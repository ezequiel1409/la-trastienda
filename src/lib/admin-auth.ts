import { cookies } from "next/headers";

const ADMIN_COOKIE_NAME = "trastienda_admin_session";

export async function setAdminSession(secret: string): Promise<boolean> {
  const expectedSecret = process.env.ADMIN_SECRET_KEY || "trastienda-admin-2026";
  if (secret !== expectedSecret) {
    return false;
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 días
  });

  return true;
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE_NAME);
  return session?.value === "authenticated";
}
