/**
 * Puerto de Aprovisionamiento de Base de Datos (Cloudflare D1 API)
 */

export interface DatabaseSeedParams {
  brandName: string;
  slug: string;
  whatsappNumber: string;
  adminEmail: string;
  adminPasswordHash: string;
  adminPasswordSalt: string;
  rubro: string;
  enabledPaymentGateways?: string[];
  bankName?: string | null;
  cbu?: string | null;
  alias?: string | null;
  cuit?: string | null;
}

export interface CreateDatabaseResult {
  databaseId: string;
  databaseName: string;
}

export interface IDatabaseProvisionerPort {
  /**
   * Crea una base de datos D1 en Cloudflare con el nombre de la tienda.
   */
  createDatabase(databaseName: string): Promise<CreateDatabaseResult>;

  /**
   * Ejecuta las migraciones de Drizzle y siembra los datos iniciales de la tienda.
   */
  applyMigrationsAndSeed(databaseId: string, seed: DatabaseSeedParams): Promise<void>;

  /**
   * Acción compensatoria / Limpieza: Elimina la base de datos D1 para liberar cupo.
   */
  deleteDatabase(databaseId: string): Promise<void>;
}
