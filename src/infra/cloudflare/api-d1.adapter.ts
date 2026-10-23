import {
  CreateDatabaseResult,
  DatabaseSeedParams,
  IDatabaseProvisionerPort,
} from "../../domain/ports/database-provisioner.port";
import { IObservabilityPort } from "../../domain/ports/observability.port";
import { ProvisioningFailedError } from "../../domain/errors";

export interface CloudflareD1Config {
  apiToken: string;
  accountId: string;
}

export class CloudflareD1ApiAdapter implements IDatabaseProvisionerPort {
  constructor(
    private readonly config: CloudflareD1Config,
    private readonly logger?: IObservabilityPort
  ) {}

  private async cfFetch(endpoint: string, options: RequestInit = {}) {
    const url = `https://api.cloudflare.com/client/v4/accounts/${this.config.accountId}${endpoint}`;
    const res = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.config.apiToken}`,
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      const errMsg = data.errors?.map((e: { message: string }) => e.message).join(", ") || res.statusText;
      throw new Error(`Cloudflare D1 API error: ${errMsg}`);
    }

    return data.result;
  }

  async createDatabase(databaseName: string): Promise<CreateDatabaseResult> {
    this.logger?.info(`[CLOUDFLARE D1] Creando base de datos '${databaseName}'...`);
    try {
      const result = await this.cfFetch("/d1/database", {
        method: "POST",
        body: JSON.stringify({ name: databaseName }),
      });

      return {
        databaseId: result.uuid,
        databaseName: result.name,
      };
    } catch (err) {
      throw new ProvisioningFailedError(
        `Fallo al crear la base de datos D1 en Cloudflare: ${err instanceof Error ? err.message : String(err)}`,
        "CREATING_DATABASE"
      );
    }
  }

  async applyMigrationsAndSeed(databaseId: string, seed: DatabaseSeedParams): Promise<void> {
    this.logger?.info(`[CLOUDFLARE D1] Sembrando datos para '${seed.brandName}' en D1 (${databaseId})...`);

    try {
      // Inserción de configuración básica y comercio en D1
      const sqlQueries = [
        `INSERT OR IGNORE INTO settings (key, value) VALUES ('whatsapp_number', '${seed.whatsappNumber}'), ('brand_name', '${seed.brandName}'), ('reservation_hours', '48');`,
        `INSERT OR IGNORE INTO admin_users (email, name, password_hash, password_salt, role, status, created_at, updated_at) VALUES ('${seed.adminEmail}', '${seed.brandName}', '${seed.adminPasswordHash}', '${seed.adminPasswordSalt}', 'SUPER_ADMIN', 'ACTIVE', ${Date.now()}, ${Date.now()});`,
        `INSERT OR IGNORE INTO commerces (slug, name, whatsapp_number, is_active, created_at, updated_at) VALUES ('${seed.slug}', '${seed.brandName}', '${seed.whatsappNumber}', 1, ${Date.now()}, ${Date.now()});`,
      ];

      for (const query of sqlQueries) {
        await this.cfFetch(`/d1/database/${databaseId}/query`, {
          method: "POST",
          body: JSON.stringify({ sql: query }),
        });
      }

      this.logger?.info(`[CLOUDFLARE D1] Configuración inicial sembrada con éxito.`);
    } catch (err) {
      throw new ProvisioningFailedError(
        `Fallo al ejecutar seed en D1: ${err instanceof Error ? err.message : String(err)}`,
        "APPLYING_MIGRATIONS"
      );
    }
  }

  async deleteDatabase(databaseId: string): Promise<void> {
    this.logger?.warn(`[CLOUDFLARE D1 ROLLBACK] Eliminando base de datos D1 (${databaseId}) para liberar cupo...`);
    try {
      await this.cfFetch(`/d1/database/${databaseId}`, { method: "DELETE" });
      this.logger?.info(`[CLOUDFLARE D1 ROLLBACK] Base D1 eliminada con éxito.`);
    } catch (err) {
      this.logger?.error(`[CLOUDFLARE D1 ROLLBACK] Error eliminando base D1:`, err);
    }
  }
}
