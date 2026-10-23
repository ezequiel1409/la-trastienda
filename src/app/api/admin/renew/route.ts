import { NextRequest, NextResponse } from "next/server";
import { container } from "@/infra/container";
import { TenantService } from "@/services/tenant.service";

export async function POST(req: NextRequest) {
  try {
    const { slug, days } = await req.json();

    const tenantService = new TenantService({
      tenantRepo: container.tenantRepo,
      dbProvisioner: container.dbProvisioner,
      logger: container.logger,
    });

    const updated = await tenantService.renewSubscription(slug, days || 30);
    return NextResponse.json({ success: true, tenant: updated });
  } catch (err) {
    container.logger.error("Error renovando comercio:", err);
    return NextResponse.json({ error: "No se pudo renovar la tienda." }, { status: 500 });
  }
}
