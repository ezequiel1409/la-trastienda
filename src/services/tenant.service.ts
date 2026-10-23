import { ITenantRepositoryPort } from "../domain/ports/tenant-repository.port";
import { IDatabaseProvisionerPort } from "../domain/ports/database-provisioner.port";
import { IObservabilityPort } from "../domain/ports/observability.port";
import { StoreTenant, TenantSubscriptionStatus } from "../domain/store/types";
import { TenantNotFoundError } from "../domain/errors";

export interface TenantServiceDeps {
  tenantRepo: ITenantRepositoryPort;
  dbProvisioner: IDatabaseProvisionerPort;
  logger: IObservabilityPort;
}

export class TenantService {
  constructor(private readonly deps: TenantServiceDeps) {}

  async listTenants(): Promise<StoreTenant[]> {
    return this.deps.tenantRepo.listAllTenants();
  }

  async getTenantBySlug(slug: string): Promise<StoreTenant> {
    const tenant = await this.deps.tenantRepo.findTenantBySlug(slug);
    if (!tenant) {
      throw new TenantNotFoundError(slug);
    }
    return tenant;
  }

  /**
   * Renueva 30 días de suscripción tras confirmar la transferencia bancaria
   */
  async renewSubscription(slug: string, days = 30): Promise<StoreTenant> {
    const tenant = await this.getTenantBySlug(slug);
    const now = Date.now();
    const currentBase = tenant.paidUntil && tenant.paidUntil > now ? tenant.paidUntil : now;
    const newPaidUntil = currentBase + days * 24 * 60 * 60 * 1000;

    await this.deps.tenantRepo.updateTenant(tenant.id, {
      subscriptionStatus: "ACTIVE_PAID",
      paidUntil: newPaidUntil,
    });

    this.deps.logger.info(`[SUSCRIPCIÓN RENOVADA] Se acreditaron ${days} días a '${slug}'. Vence: ${new Date(newPaidUntil).toLocaleDateString()}`);
    return (await this.deps.tenantRepo.findTenantById(tenant.id))!;
  }

  /**
   * Pausa la tienda (ej. por falta de pago)
   */
  async pauseTenant(slug: string): Promise<void> {
    const tenant = await this.getTenantBySlug(slug);
    await this.deps.tenantRepo.updateTenant(tenant.id, {
      subscriptionStatus: "SUSPENDED",
    });
    this.deps.logger.warn(`[TIENDA PAUSADA] '${slug}' ha sido suspendida.`);
  }

  /**
   * Desaprovisiona la tienda y destruye su base D1 en Cloudflare para liberar el cupo gratuito
   */
  async deprovisionTenant(slug: string): Promise<void> {
    const tenant = await this.getTenantBySlug(slug);

    if (tenant.cloudD1DatabaseId) {
      this.deps.logger.warn(`[DESAPROVISIONANDO D1] Eliminando base D1 ${tenant.cloudD1DatabaseId} de '${slug}'...`);
      await this.deps.dbProvisioner.deleteDatabase(tenant.cloudD1DatabaseId);
    }

    await this.deps.tenantRepo.updateTenant(tenant.id, {
      subscriptionStatus: "DEPROVISIONED",
      cloudD1DatabaseId: undefined,
    });

    this.deps.logger.info(`[DESAPROVISIONADO COMPLETO] Cupo de Cloudflare liberado para el comercio '${slug}'.`);
  }

  /**
   * Devuelve el estado de cuenta y datos de cobro que consume la tienda del comercio en su propio panel
   */
  async getStoreStatusForEmbed(slug: string) {
    const tenant = await this.getTenantBySlug(slug);
    const now = Date.now();

    let daysRemaining = 0;
    let isExpired = false;

    if (tenant.subscriptionStatus === "TRIAL_ACTIVE") {
      daysRemaining = Math.max(0, Math.ceil((tenant.trialEndsAt - now) / (1000 * 60 * 60 * 24)));
      isExpired = daysRemaining <= 0;
    } else if (tenant.subscriptionStatus === "ACTIVE_PAID" && tenant.paidUntil) {
      daysRemaining = Math.max(0, Math.ceil((tenant.paidUntil - now) / (1000 * 60 * 60 * 24)));
      isExpired = daysRemaining <= 0;
    } else {
      isExpired = true;
    }

    return {
      storeName: tenant.name,
      slug: tenant.slug,
      status: tenant.subscriptionStatus,
      daysRemaining,
      isExpired,
      billingInfo: {
        alias: process.env.BILLING_ALIAS || "latrastienda.mp",
        cbu: process.env.BILLING_CBU || "0000003100010000000000",
        accountHolder: process.env.BILLING_ACCOUNT_HOLDER || "Ezequiel (La Trastienda)",
        monthlyPriceArs: tenant.monthlyPriceArs,
        supportWhatsapp: process.env.BILLING_SUPPORT_WHATSAPP || "+5491100000000",
      },
    };
  }
}
