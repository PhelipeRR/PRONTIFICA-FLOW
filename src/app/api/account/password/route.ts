import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { hashPassword } from "@better-auth/utils/password";
import { auth } from "../../../../lib/auth";
import { db } from "../../../../db";
import { account, user } from "../../../../db/schema";

export async function POST(request: NextRequest) {
  if (!auth || !db) return NextResponse.json({ error: "Autenticação não configurada" }, { status: 503 });
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  const body = await request.json();
  if (!body.newPassword || body.newPassword.length < 8) return NextResponse.json({ error: "Informe uma nova senha com pelo menos 8 caracteres" }, { status: 400 });
  try {
    const [current] = await db.select({ mustChangePassword: user.mustChangePassword }).from(user).where(eq(user.id, session.user.id)).limit(1);
    if (!body.currentPassword && current?.mustChangePassword) {
      await db.update(account).set({ password: await hashPassword(body.newPassword), updatedAt: new Date() }).where(eq(account.userId, session.user.id));
    } else {
      if (!body.currentPassword) return NextResponse.json({ error: "Informe a senha atual" }, { status: 400 });
      await auth.api.changePassword({ headers: request.headers, body: { currentPassword: body.currentPassword, newPassword: body.newPassword } });
    }
    await db.update(user).set({ mustChangePassword: false, updatedAt: new Date() }).where(eq(user.id, session.user.id));
    return NextResponse.json({ ok: true });
  } catch { return NextResponse.json({ error: "Não foi possível criar a nova senha" }, { status: 400 }); }
}
