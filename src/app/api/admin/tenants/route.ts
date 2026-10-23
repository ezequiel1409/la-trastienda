import { NextResponse } from "next/server";
import { container } from "@/infra/container";
import { TenantService } from "@/services/tenant.service";

export async function GET() {
  try {
    const tenantService = new TenantService({
      tenantRepo: container.tenantRepo,
      dbProvisioner: container.dbProvisioner,
      logger: container.logger,
    });

    const tenants = await tenantService.listTenants();
    return NextResponse.json(tenants);
  } catch (err) {
    container.logger.error("Error listando comercios en admin:", err);
    return NextResponse.json({ error: "Error listando comercios." }, { status: 500 });
  }
}
