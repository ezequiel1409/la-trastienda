import { NextRequest, NextResponse } from "next/server";
import { container } from "@/infra/container";
import { ProvisionStoreService } from "@/services/provision-store.service";
import { DomainError } from "@/domain/errors";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const service = new ProvisionStoreService({
      tenantRepo: container.tenantRepo,
      gitProvisioner: container.gitProvisioner,
      dbProvisioner: container.dbProvisioner,
      hostingDeployer: container.hostingDeployer,
      logger: container.logger,
    });

    const result = await service.execute(body);

    return NextResponse.json({
      success: true,
      jobId: result.jobId,
      tenant: result.tenant,
    });
  } catch (error) {
    container.logger.error("Error en endpoint /api/provision:", error);

    if (error instanceof DomainError) {
      return NextResponse.json(
        { success: false, error: error.message, code: error.code },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      { success: false, error: "Ocurrió un error inesperado al procesar la solicitud." },
      { status: 500 }
    );
  }
}
