import { ITenantRepositoryPort } from "../../domain/ports/tenant-repository.port";
import { StoreTenant } from "../../domain/store/types";
import { ProvisionJob } from "../../domain/provisioning/types";
import Database from "better-sqlite3";
import path from "node:path";
import fs from "node:fs";

export class SqliteTenantRepositoryAdapter implements ITenantRepositoryPort {
  private db: Database.Database;

  constructor(dbFilePath?: string) {
    const targetPath = dbFilePath || path.resolve(process.cwd(), "trastienda.sqlite");
    const dir = path.dirname(targetPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    this.db = new Database(targetPath);
    this.db.pragma("journal_mode = WAL");
    this.initTables();
  }

  private initTables(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS tenants (
        id TEXT PRIMARY KEY,
        slug TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        rubro TEXT NOT NULL,
        whatsapp_number TEXT NOT NULL,
        admin_email TEXT NOT NULL,
        admin_initial_password TEXT,
        enabled_payment_gateways TEXT NOT NULL,
        cloud_d1_database_id TEXT,
        cloud_d1_database_name TEXT,
        git_repo_full_name TEXT,
        live_url TEXT,
        subscription_status TEXT NOT NULL,
        trial_ends_at INTEGER NOT NULL,
        paid_until INTEGER,
        monthly_price_ars INTEGER NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS provision_jobs (
        id TEXT PRIMARY KEY,
        store_slug TEXT NOT NULL,
        store_name TEXT NOT NULL,
        current_step TEXT NOT NULL,
        status TEXT NOT NULL,
        progress_percentage INTEGER NOT NULL,
        logs_json TEXT NOT NULL,
        error TEXT,
        database_id TEXT,
        repo_url TEXT,
        live_url TEXT,
        started_at INTEGER NOT NULL,
        completed_at INTEGER
      );
    `);
  }

  async saveTenant(tenant: StoreTenant): Promise<void> {
    const stmt = this.db.prepare(`
      INSERT INTO tenants (
        id, slug, name, rubro, whatsapp_number, admin_email,
        admin_initial_password, enabled_payment_gateways,
        cloud_d1_database_id, cloud_d1_database_name, git_repo_full_name,
        live_url, subscription_status, trial_ends_at, paid_until,
        monthly_price_ars, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        rubro = excluded.rubro,
        whatsapp_number = excluded.whatsapp_number,
        enabled_payment_gateways = excluded.enabled_payment_gateways,
        cloud_d1_database_id = excluded.cloud_d1_database_id,
        cloud_d1_database_name = excluded.cloud_d1_database_name,
        git_repo_full_name = excluded.git_repo_full_name,
        live_url = excluded.live_url,
        subscription_status = excluded.subscription_status,
        trial_ends_at = excluded.trial_ends_at,
        paid_until = excluded.paid_until,
        updated_at = excluded.updated_at
    `);

    stmt.run(
      tenant.id,
      tenant.slug,
      tenant.name,
      tenant.rubro,
      tenant.whatsappNumber,
      tenant.adminEmail,
      tenant.adminInitialPassword || null,
      JSON.stringify(tenant.enabledPaymentGateways),
      tenant.cloudD1DatabaseId || null,
      tenant.cloudD1DatabaseName || null,
      tenant.gitRepoFullName || null,
      tenant.liveUrl || null,
      tenant.subscriptionStatus,
      tenant.trialEndsAt,
      tenant.paidUntil || null,
      tenant.monthlyPriceArs,
      tenant.createdAt,
      tenant.updatedAt
    );
  }

  async findTenantById(id: string): Promise<StoreTenant | null> {
    const row = this.db.prepare("SELECT * FROM tenants WHERE id = ?").get(id) as Record<string, unknown> | undefined;
    return row ? this.mapRowToTenant(row) : null;
  }

  async findTenantBySlug(slug: string): Promise<StoreTenant | null> {
    const row = this.db.prepare("SELECT * FROM tenants WHERE slug = ?").get(slug) as Record<string, unknown> | undefined;
    return row ? this.mapRowToTenant(row) : null;
  }

  async listAllTenants(): Promise<StoreTenant[]> {
    const rows = this.db.prepare("SELECT * FROM tenants ORDER BY created_at DESC").all() as Record<string, unknown>[];
    return rows.map((r) => this.mapRowToTenant(r));
  }

  async updateTenant(id: string, partial: Partial<StoreTenant>): Promise<void> {
    const current = await this.findTenantById(id);
    if (!current) return;
    const merged: StoreTenant = {
      ...current,
      ...partial,
      updatedAt: Date.now(),
    };
    await this.saveTenant(merged);
  }

  async deleteTenant(id: string): Promise<void> {
    this.db.prepare("DELETE FROM tenants WHERE id = ?").run(id);
  }

  async saveJob(job: ProvisionJob): Promise<void> {
    const stmt = this.db.prepare(`
      INSERT INTO provision_jobs (
        id, store_slug, store_name, current_step, status,
        progress_percentage, logs_json, error, database_id,
        repo_url, live_url, started_at, completed_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        current_step = excluded.current_step,
        status = excluded.status,
        progress_percentage = excluded.progress_percentage,
        logs_json = excluded.logs_json,
        error = excluded.error,
        database_id = excluded.database_id,
        repo_url = excluded.repo_url,
        live_url = excluded.live_url,
        completed_at = excluded.completed_at
    `);

    stmt.run(
      job.id,
      job.storeSlug,
      job.storeName,
      job.currentStep,
      job.status,
      job.progressPercentage,
      JSON.stringify(job.logs),
      job.error || null,
      job.databaseId || null,
      job.repoUrl || null,
      job.liveUrl || null,
      job.startedAt,
      job.completedAt || null
    );
  }

  async getJobById(jobId: string): Promise<ProvisionJob | null> {
    const row = this.db.prepare("SELECT * FROM provision_jobs WHERE id = ?").get(jobId) as Record<string, unknown> | undefined;
    return row ? this.mapRowToJob(row) : null;
  }

  async updateJob(jobId: string, partial: Partial<ProvisionJob>): Promise<void> {
    const current = await this.getJobById(jobId);
    if (!current) return;
    const merged: ProvisionJob = {
      ...current,
      ...partial,
    };
    await this.saveJob(merged);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private mapRowToTenant(row: any): StoreTenant {
    return {
      id: row.id,
      slug: row.slug,
      name: row.name,
      rubro: row.rubro,
      whatsappNumber: row.whatsapp_number,
      adminEmail: row.admin_email,
      adminInitialPassword: row.admin_initial_password ?? undefined,
      enabledPaymentGateways: JSON.parse(row.enabled_payment_gateways || "[]"),
      cloudD1DatabaseId: row.cloud_d1_database_id ?? undefined,
      cloudD1DatabaseName: row.cloud_d1_database_name ?? undefined,
      gitRepoFullName: row.git_repo_full_name ?? undefined,
      liveUrl: row.live_url ?? undefined,
      subscriptionStatus: row.subscription_status,
      trialEndsAt: row.trial_ends_at,
      paidUntil: row.paid_until ?? undefined,
      monthlyPriceArs: row.monthly_price_ars,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private mapRowToJob(row: any): ProvisionJob {
    return {
      id: row.id,
      storeSlug: row.store_slug,
      storeName: row.store_name,
      currentStep: row.current_step,
      status: row.status,
      progressPercentage: row.progress_percentage,
      logs: JSON.parse(row.logs_json || "[]"),
      error: row.error ?? undefined,
      databaseId: row.database_id ?? undefined,
      repoUrl: row.repo_url ?? undefined,
      liveUrl: row.live_url ?? undefined,
      startedAt: row.started_at,
      completedAt: row.completed_at ?? undefined,
    };
  }
}
