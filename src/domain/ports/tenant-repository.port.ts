import { StoreTenant } from "../store/types";
import { ProvisionJob } from "../provisioning/types";

/**
 * Puerto de Persistencia interna de Comercios y Jobs de la plataforma
 */
export interface ITenantRepositoryPort {
  saveTenant(tenant: StoreTenant): Promise<void>;
  findTenantById(id: string): Promise<StoreTenant | null>;
  findTenantBySlug(slug: string): Promise<StoreTenant | null>;
  listAllTenants(): Promise<StoreTenant[]>;
  updateTenant(id: string, partial: Partial<StoreTenant>): Promise<void>;
  deleteTenant(id: string): Promise<void>;

  saveJob(job: ProvisionJob): Promise<void>;
  getJobById(jobId: string): Promise<ProvisionJob | null>;
  updateJob(jobId: string, partial: Partial<ProvisionJob>): Promise<void>;
}
