import {
  CreateDatabaseResult,
  DatabaseSeedParams,
  IDatabaseProvisionerPort,
} from "../../domain/ports/database-provisioner.port";
import { IObservabilityPort } from "../../domain/ports/observability.port";

export class MockD1Adapter implements IDatabaseProvisionerPort {
  constructor(private readonly logger?: IObservabilityPort) {}

  async createDatabase(databaseName: string): Promise<CreateDatabaseResult> {
    this.logger?.info(`[MOCK CLOUDFLARE] Creando base D1 '${databaseName}'...`);
    await new Promise((r) => setTimeout(r, 700));

    const fakeId = `d1-${Math.random().toString(36).substring(2, 10)}-${Date.now()}`;
    return {
      databaseId: fakeId,
      databaseName,
    };
  }

  async applyMigrationsAndSeed(databaseId: string, seed: DatabaseSeedParams): Promise<void> {
    this.logger?.info(`[MOCK CLOUDFLARE] Aplicando migraciones de Drizzle y sembrando comercio '${seed.brandName}' en D1 (${databaseId})...`);
    await new Promise((r) => setTimeout(r, 900));
  }

  async deleteDatabase(databaseId: string): Promise<void> {
    this.logger?.warn(`[MOCK CLOUDFLARE ROLLBACK] Eliminando base D1 simulada (${databaseId}) para liberar cupo...`);
    await new Promise((r) => setTimeout(r, 400));
  }
}
