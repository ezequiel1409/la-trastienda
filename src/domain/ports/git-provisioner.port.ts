/**
 * Puerto de Aprovisionamiento de Repositorios Git (GitHub API)
 */

export interface CreateFromTemplateParams {
  targetRepoName: string; // ej: "tienda-calzados-tito"
  description: string;
  isPrivate: boolean;
  packageJsonName: string;
  wranglerConfig: {
    workerName: string;
    databaseName: string;
    databaseId: string;
  };
}

export interface GitProvisionResult {
  repoFullName: string; // ej: "ezequiel/tienda-calzados-tito"
  repoUrl: string; // ej: "https://github.com/ezequiel/tienda-calzados-tito"
}

export interface IGitProvisionerPort {
  /**
   * Crea un nuevo repositorio a partir de la plantilla base (aura-studio)
   * y comitea la configuración personalizada de la tienda.
   */
  createRepositoryFromTemplate(params: CreateFromTemplateParams): Promise<GitProvisionResult>;

  /**
   * Acción compensatoria: Elimina el repositorio creado si la saga falla.
   */
  deleteRepository(repoFullName: string): Promise<void>;
}
