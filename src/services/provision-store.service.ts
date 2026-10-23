import {
  CreateStoreInput,
  ProvisionJob,
  ProvisioningStep,
  SlugAlreadyExistsError,
  StoreTenant,
  validateStoreInput,
  slugify,
} from "../domain";
import { IGitProvisionerPort } from "../domain/ports/git-provisioner.port";
import { IDatabaseProvisionerPort } from "../domain/ports/database-provisioner.port";
import { IHostingDeployerPort } from "../domain/ports/hosting-deployer.port";
import { ITenantRepositoryPort } from "../domain/ports/tenant-repository.port";
import { IObservabilityPort } from "../domain/ports/observability.port";
import { SagaCoordinator } from "./saga-coordinator.service";
import { generateRandomPassword, hashPassword } from "../lib/crypto";

export interface ProvisionStoreServiceDeps {
  tenantRepo: ITenantRepositoryPort;
  gitProvisioner: IGitProvisionerPort;
  dbProvisioner: IDatabaseProvisionerPort;
  hostingDeployer: IHostingDeployerPort;
  logger: IObservabilityPort;
}

export class ProvisionStoreService {
  constructor(private readonly deps: ProvisionStoreServiceDeps) {}

  async execute(input: CreateStoreInput): Promise<{ jobId: string; tenant: StoreTenant }> {
    // 1. Validaciones de Dominio
    validateStoreInput(input);
    const cleanSlug = slugify(input.slug || input.name);

    // 2. Verificar disponibilidad de Slug
    const existing = await this.deps.tenantRepo.findTenantBySlug(cleanSlug);
    if (existing) {
      throw new SlugAlreadyExistsError(cleanSlug);
    }

    const jobId = `job-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const tenantId = `tenant-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const saga = new SagaCoordinator(this.deps.logger, jobId);

    // Inicializa el Job
    const job: ProvisionJob = {
      id: jobId,
      storeSlug: cleanSlug,
      storeName: input.name,
      currentStep: "INITIALIZING",
      status: "RUNNING",
      progressPercentage: 5,
      logs: [
        {
          step: "INITIALIZING",
          message: `Iniciando aprovisionamiento para '${input.name}' (${cleanSlug})...`,
          timestamp: Date.now(),
          status: "SUCCESS",
        },
      ],
      startedAt: Date.now(),
    };
    await this.deps.tenantRepo.saveJob(job);

    const updateStep = async (step: ProvisioningStep, message: string, progress: number) => {
      this.deps.logger.info(`[JOB ${jobId}] ${message}`, { step, storeSlug: cleanSlug });
      job.currentStep = step;
      job.progressPercentage = progress;
      job.logs.push({
        step,
        message,
        timestamp: Date.now(),
        status: "SUCCESS",
      });
      await this.deps.tenantRepo.saveJob(job);
    };

    try {
      // 3. Crear Base de Datos D1 en Cloudflare
      await updateStep("CREATING_DATABASE", "Creando base de datos Cloudflare D1 exclusiva...", 20);
      const dbName = `${cleanSlug}-db`;
      const dbResult = await this.deps.dbProvisioner.createDatabase(dbName);
      job.databaseId = dbResult.databaseId;

      saga.registerCompensation("deleteD1Database", async () => {
        await this.deps.dbProvisioner.deleteDatabase(dbResult.databaseId);
      });

      // 4. Sembrar configuración inicial y contraseñas
      await updateStep("APPLYING_MIGRATIONS", "Sembrando tablas, pasarelas y configuración del comercio...", 40);
      const rawAdminPassword = input.adminPassword || generateRandomPassword(input.name.split(" ")[0]);
      const { hash, salt } = await hashPassword(rawAdminPassword);

      await this.deps.dbProvisioner.applyMigrationsAndSeed(dbResult.databaseId, {
        brandName: input.name,
        slug: cleanSlug,
        whatsappNumber: input.whatsappNumber,
        adminEmail: input.adminEmail,
        adminPasswordHash: hash,
        adminPasswordSalt: salt,
        rubro: input.rubro,
      });

      // 5. Crear Repositorio GitHub a partir de la plantilla aura-studio
      await updateStep("GENERATING_REPOSITORY", "Generando repositorio de código y configurando variables...", 60);
      const targetRepoName = `tienda-${cleanSlug}`;
      const gitResult = await this.deps.gitProvisioner.createRepositoryFromTemplate({
        targetRepoName,
        description: `Tienda online de ${input.name}`,
        isPrivate: true,
        packageJsonName: targetRepoName,
        wranglerConfig: {
          workerName: cleanSlug,
          databaseName: dbResult.databaseName,
          databaseId: dbResult.databaseId,
        },
      });
      job.repoUrl = gitResult.repoUrl;

      saga.registerCompensation("deleteGitHubRepository", async () => {
        await this.deps.gitProvisioner.deleteRepository(gitResult.repoFullName);
      });

      // 6. Despliegue en Cloudflare Workers
      await updateStep("TRIGGERING_DEPLOY", "Desplegando infraestructura en Cloudflare Workers...", 80);
      const deployResult = await this.deps.hostingDeployer.triggerDeploy({
        workerName: cleanSlug,
        repoFullName: gitResult.repoFullName,
        databaseId: dbResult.databaseId,
      });
      job.liveUrl = deployResult.liveUrl;

      saga.registerCompensation("cancelDeploy", async () => {
        await this.deps.hostingDeployer.cancelOrRemoveDeploy(cleanSlug);
      });

      // 7. Guardar Tenant en la base de datos de La Trastienda
      await updateStep("FINALIZING", "Registrando comercio en la plataforma...", 95);
      const now = Date.now();
      const trialDays = 14;
      const trialEndsAt = now + trialDays * 24 * 60 * 60 * 1000;

      const tenant: StoreTenant = {
        id: tenantId,
        slug: cleanSlug,
        name: input.name,
        rubro: input.rubro,
        whatsappNumber: input.whatsappNumber,
        adminEmail: input.adminEmail,
        adminInitialPassword: rawAdminPassword,
        enabledPaymentGateways: input.enabledPaymentGateways || ["TRANSFER", "MERCADOPAGO", "CASH"],
        cloudD1DatabaseId: dbResult.databaseId,
        cloudD1DatabaseName: dbResult.databaseName,
        gitRepoFullName: gitResult.repoFullName,
        liveUrl: deployResult.liveUrl,
        subscriptionStatus: "TRIAL_ACTIVE",
        trialEndsAt,
        monthlyPriceArs: Number(process.env.BILLING_MONTHLY_PRICE_ARS) || 15000,
        createdAt: now,
        updatedAt: now,
      };

      await this.deps.tenantRepo.saveTenant(tenant);

      // 8. Finalizar Job con éxito
      await updateStep("COMPLETED", "Aprovisionamiento completado con éxito. Tienda en línea.", 100);
      job.status = "COMPLETED";
      job.completedAt = Date.now();
      await this.deps.tenantRepo.saveJob(job);

      return { jobId, tenant };
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error);
      this.deps.logger.error(`[JOB ${jobId}] Falló el aprovisionamiento: ${errMsg}`, error);

      job.status = "FAILED";
      job.error = errMsg;
      job.logs.push({
        step: "FAILED",
        message: `Fallo durante el aprovisionamiento: ${errMsg}. Ejecutando rollback...`,
        timestamp: Date.now(),
        status: "FAILED",
      });
      await this.deps.tenantRepo.saveJob(job);

      await saga.rollback();

      job.status = "ROLLED_BACK";
      job.logs.push({
        step: "ROLLED_BACK",
        message: "Rollback completado con éxito. Recursos liberados para evitar costos.",
        timestamp: Date.now(),
        status: "SUCCESS",
      });
      await this.deps.tenantRepo.saveJob(job);

      throw error;
    }
  }
}
