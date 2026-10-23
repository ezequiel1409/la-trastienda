import {
  CreateFromTemplateParams,
  GitProvisionResult,
  IGitProvisionerPort,
} from "../../domain/ports/git-provisioner.port";
import { IObservabilityPort } from "../../domain/ports/observability.port";

export class MockGithubAdapter implements IGitProvisionerPort {
  constructor(private readonly logger?: IObservabilityPort) {}

  async createRepositoryFromTemplate(params: CreateFromTemplateParams): Promise<GitProvisionResult> {
    this.logger?.info(`[MOCK GITHUB] Generando repositorio '${params.targetRepoName}' desde plantilla...`);
    // Simula latencia de red
    await new Promise((r) => setTimeout(r, 800));

    this.logger?.info(`[MOCK GITHUB] Inyectando wrangler.jsonc y package.json para '${params.packageJsonName}'...`);
    await new Promise((r) => setTimeout(r, 600));

    return {
      repoFullName: `ezequiel/${params.targetRepoName}`,
      repoUrl: `https://github.com/ezequiel/${params.targetRepoName}`,
    };
  }

  async deleteRepository(repoFullName: string): Promise<void> {
    this.logger?.warn(`[MOCK GITHUB ROLLBACK] Eliminando repositorio simulado '${repoFullName}'...`);
    await new Promise((r) => setTimeout(r, 400));
  }
}
