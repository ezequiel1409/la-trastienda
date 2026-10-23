import {
  CreateFromTemplateParams,
  GitProvisionResult,
  IGitProvisionerPort,
} from "../../domain/ports/git-provisioner.port";
import { IObservabilityPort } from "../../domain/ports/observability.port";
import { ProvisioningFailedError } from "../../domain/errors";

export interface GitHubAdapterConfig {
  token: string;
  templateOwner: string;
  templateRepo: string;
}

export class OctokitGithubAdapter implements IGitProvisionerPort {
  constructor(
    private readonly config: GitHubAdapterConfig,
    private readonly logger?: IObservabilityPort
  ) {}

  private async ghFetch(endpoint: string, options: RequestInit = {}) {
    const url = endpoint.startsWith("http") ? endpoint : `https://api.github.com${endpoint}`;
    const res = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.config.token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "La-Trastienda-Orchestrator",
        ...(options.headers || {}),
      },
    });

    if (!res.ok) {
      const errBody = await res.text();
      throw new Error(`GitHub API error (${res.status}): ${errBody}`);
    }

    return res.json();
  }

  async createRepositoryFromTemplate(params: CreateFromTemplateParams): Promise<GitProvisionResult> {
    this.logger?.info(`[GITHUB API] Generando repo '${params.targetRepoName}' desde '${this.config.templateOwner}/${this.config.templateRepo}'...`);

    try {
      // 1. POST /repos/{template_owner}/{template_repo}/generate
      const createdRepo = await this.ghFetch(
        `/repos/${this.config.templateOwner}/${this.config.templateRepo}/generate`,
        {
          method: "POST",
          body: JSON.stringify({
            name: params.targetRepoName,
            description: params.description,
            private: params.isPrivate,
            include_all_branches: false,
          }),
        }
      );

      const repoFullName = createdRepo.full_name;
      const repoUrl = createdRepo.html_url;

      this.logger?.info(`[GITHUB API] Repositorio creado exitosamente: ${repoFullName}. Actualizando wrangler.jsonc...`);

      // 2. Obtiene el wrangler.jsonc actual para reemplazar los datos
      const fileRes = await this.ghFetch(`/repos/${repoFullName}/contents/wrangler.jsonc`);
      const sha = fileRes.sha;
      const currentContent = Buffer.from(fileRes.content, "base64").toString("utf-8");

      // Reemplaza nombre y database_id
      const updatedContent = currentContent
        .replace(/"name":\s*"[^"]+"/, `"name": "${params.wranglerConfig.workerName}"`)
        .replace(/"database_name":\s*"[^"]+"/, `"database_name": "${params.wranglerConfig.databaseName}"`)
        .replace(/"database_id":\s*"[^"]+"/, `"database_id": "${params.wranglerConfig.databaseId}"`);

      // 3. Comitea wrangler.jsonc modificado
      await this.ghFetch(`/repos/${repoFullName}/contents/wrangler.jsonc`, {
        method: "PUT",
        body: JSON.stringify({
          message: `chore: configure store for ${params.wranglerConfig.workerName}`,
          content: Buffer.from(updatedContent, "utf-8").toString("base64"),
          sha,
        }),
      });

      this.logger?.info(`[GITHUB API] wrangler.jsonc actualizado con database_id ${params.wranglerConfig.databaseId}`);

      return {
        repoFullName,
        repoUrl,
      };
    } catch (err) {
      throw new ProvisioningFailedError(
        `Error al crear o configurar repositorio en GitHub: ${err instanceof Error ? err.message : String(err)}`,
        "GENERATING_REPOSITORY"
      );
    }
  }

  async deleteRepository(repoFullName: string): Promise<void> {
    this.logger?.warn(`[GITHUB API ROLLBACK] Eliminando repositorio huérfano '${repoFullName}'...`);
    try {
      await this.ghFetch(`/repos/${repoFullName}`, { method: "DELETE" });
      this.logger?.info(`[GITHUB API ROLLBACK] Repositorio '${repoFullName}' eliminado.`);
    } catch (err) {
      this.logger?.error(`[GITHUB API ROLLBACK] No se pudo eliminar el repo '${repoFullName}':`, err);
    }
  }
}
