import { NextRequest, NextResponse } from "next/server";
import { container } from "@/infra/container";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await params;
    const job = await container.tenantRepo.getJobById(jobId);

    if (!job) {
      return NextResponse.json({ error: "Orden de aprovisionamiento no encontrada." }, { status: 404 });
    }

    return NextResponse.json(job);
  } catch (err) {
    container.logger.error("Error consultando job:", err);
    return NextResponse.json({ error: "Error consultando el estado del job." }, { status: 500 });
  }
}
