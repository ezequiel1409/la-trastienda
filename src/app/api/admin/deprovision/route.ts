import { NextRequest, NextResponse } from "next/server";
import { container } from "@/infra/container";
import { TenantService } from "@/services/tenant.service";

export async function POST(req: NextRequest) {
  try {
    const { slug } = await req.json();

    const tenantService = new TenantService({
      tenantRepo: container.tenantRepo,
      dbProvisioner: container.dbProvisioner,
      logger: container.logger,
    });

    await tenantService.deprovisionTenant(slug);
    return NextResponse.json({ success: true });
  } catch (err) {
    container.logger.error("Error desaprovisionando comercio:", err);
    return NextResponse.json({ error: "No se pudo desaprovisionar la tienda." }, { status: 500 });
  }
}
