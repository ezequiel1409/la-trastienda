import {
  DeployParams,
  DeployResult,
  IHostingDeployerPort,
} from "../../domain/ports/hosting-deployer.port";
import { IObservabilityPort } from "../../domain/ports/observability.port";

export class MockHostingAdapter implements IHostingDeployerPort {
  constructor(private readonly logger?: IObservabilityPort) {}

  async triggerDeploy(params: DeployParams): Promise<DeployResult> {
    this.logger?.info(`[MOCK DEPLOY] Desplegando Cloudflare Worker '${params.workerName}' con OpenNext...`);
    await new Promise((r) => setTimeout(r, 1200));

    return {
      liveUrl: `https://${params.workerName}.latrastienda.workers.dev`,
      deploymentId: `dep-${Date.now()}`,
    };
  }

  async cancelOrRemoveDeploy(workerName: string): Promise<void> {
    this.logger?.warn(`[MOCK DEPLOY ROLLBACK] Cancelando despliegue de '${workerName}'...`);
    await new Promise((r) => setTimeout(r, 400));
  }
}
