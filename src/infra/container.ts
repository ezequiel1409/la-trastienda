import { ConsoleLoggerAdapter } from "./observability/console-logger.adapter";
import { SqliteTenantRepositoryAdapter } from "./db/sqlite-tenant-repository.adapter";
import { MockGithubAdapter } from "./github/mock-github.adapter";
import { OctokitGithubAdapter } from "./github/octokit-github.adapter";
import { MockD1Adapter } from "./cloudflare/mock-d1.adapter";
import { CloudflareD1ApiAdapter } from "./cloudflare/api-d1.adapter";
import { MockHostingAdapter } from "./hosting/mock-hosting.adapter";
import { IGitProvisionerPort } from "../domain/ports/git-provisioner.port";
import { IDatabaseProvisionerPort } from "../domain/ports/database-provisioner.port";
import { IHostingDeployerPort } from "../domain/ports/hosting-deployer.port";
import { ITenantRepositoryPort } from "../domain/ports/tenant-repository.port";
import { IObservabilityPort } from "../domain/ports/observability.port";

class ServiceContainer {
  public readonly logger: IObservabilityPort;
  public readonly tenantRepo: ITenantRepositoryPort;
  public readonly gitProvisioner: IGitProvisionerPort;
  public readonly dbProvisioner: IDatabaseProvisionerPort;
  public readonly hostingDeployer: IHostingDeployerPort;

  constructor() {
    this.logger = new ConsoleLoggerAdapter();
    this.tenantRepo = new SqliteTenantRepositoryAdapter();

    const isMock = process.env.MOCK_MODE !== "false";

    if (isMock) {
      this.logger.info("Inicializando servicios en MOCK_MODE (Simulación local sin tokens)");
      this.gitProvisioner = new MockGithubAdapter(this.logger);
      this.dbProvisioner = new MockD1Adapter(this.logger);
      this.hostingDeployer = new MockHostingAdapter(this.logger);
    } else {
      this.logger.info("Inicializando servicios en MODO REAL (Cloudflare API + GitHub API)");
      this.gitProvisioner = new OctokitGithubAdapter(
        {
          token: process.env.GITHUB_TOKEN || "",
          templateOwner: process.env.GITHUB_OWNER || "",
          templateRepo: process.env.GITHUB_TEMPLATE_REPO || "aura-studio",
        },
        this.logger
      );

      this.dbProvisioner = new CloudflareD1ApiAdapter(
        {
          apiToken: process.env.CLOUDFLARE_API_TOKEN || "",
          accountId: process.env.CLOUDFLARE_ACCOUNT_ID || "",
        },
        this.logger
      );

      this.hostingDeployer = new MockHostingAdapter(this.logger);
    }
  }
}

// Singleton global para Next.js
declare global {
  // eslint-disable-next-line no-var
  var __container: ServiceContainer | undefined;
}

export const container: ServiceContainer = global.__container || new ServiceContainer();
if (process.env.NODE_ENV !== "production") {
  global.__container = container;
}
