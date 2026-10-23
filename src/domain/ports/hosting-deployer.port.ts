/**
 * Puerto de Despliegue de Hosting (Cloudflare Workers / OpenNext)
 */

export interface DeployParams {
  workerName: string;
  repoFullName: string;
  databaseId: string;
}

export interface DeployResult {
  liveUrl: string; // ej: "https://calzados-tito.latrastienda.workers.dev"
  deploymentId: string;
}

export interface IHostingDeployerPort {
  /**
   * Conecta y dispara el despliegue del worker en Cloudflare
   */
  triggerDeploy(params: DeployParams): Promise<DeployResult>;

  /**
   * Acción compensatoria: Elimina o cancela el despliegue
   */
  cancelOrRemoveDeploy(workerName: string): Promise<void>;
}
