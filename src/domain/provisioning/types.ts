/**
 * Tipos de Dominio del Proceso de Aprovisionamiento (Saga & Jobs)
 */

export type ProvisioningStep =
  | "INITIALIZING"
  | "VALIDATING"
  | "CREATING_DATABASE"
  | "APPLYING_MIGRATIONS"
  | "GENERATING_REPOSITORY"
  | "INJECTING_CONFIG"
  | "TRIGGERING_DEPLOY"
  | "FINALIZING"
  | "COMPLETED"
  | "FAILED"
  | "ROLLED_BACK";

export interface ProvisioningLogEntry {
  step: ProvisioningStep;
  message: string;
  timestamp: number;
  status: "IN_PROGRESS" | "SUCCESS" | "FAILED";
  details?: Record<string, unknown>;
}

export interface ProvisionJob {
  id: string; // uuid
  storeSlug: string;
  storeName: string;
  currentStep: ProvisioningStep;
  status: "RUNNING" | "COMPLETED" | "FAILED" | "ROLLED_BACK";
  progressPercentage: number;
  logs: ProvisioningLogEntry[];
  error?: string;

  // Artefactos generados
  databaseId?: string;
  repoUrl?: string;
  liveUrl?: string;

  startedAt: number;
  completedAt?: number;
}
