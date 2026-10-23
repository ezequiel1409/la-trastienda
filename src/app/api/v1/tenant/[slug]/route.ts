import { NextRequest, NextResponse } from "next/server";
import { container } from "@/infra/container";
import { TenantService } from "@/services/tenant.service";
import { TenantNotFoundError } from "@/domain/errors";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const tenantService = new TenantService({
      tenantRepo: container.tenantRepo,
      dbProvisioner: container.dbProvisioner,
      logger: container.logger,
    });

    const info = await tenantService.getStoreStatusForEmbed(slug);
    return NextResponse.json(info);
  } catch (err) {
    if (err instanceof TenantNotFoundError) {
      return NextResponse.json({ error: err.message }, { status: 404 });
    }
    container.logger.error("Error en api/v1/tenant/[slug]:", err);
    return NextResponse.json({ error: "Error consultando el estado del comercio." }, { status: 500 });
  }
}
