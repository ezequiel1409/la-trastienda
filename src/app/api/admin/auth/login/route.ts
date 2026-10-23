import { NextRequest, NextResponse } from "next/server";
import { setAdminSession } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  try {
    const { secretKey } = await req.json();

    const success = await setAdminSession(secretKey);
    if (!success) {
      return NextResponse.json({ error: "Clave de administrador incorrecta." }, { status: 401 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Error procesando autenticación." }, { status: 500 });
  }
}
