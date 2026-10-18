import { NextRequest, NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { db } from "../../../db";
import { leadStatuses, operationalSettings, user } from "../../../db/schema";

export async function GET() {
  if (!db) return NextResponse.json({ error: "Banco não configurado" }, { status: 503 });
  const [statuses, users, settings] = await Promise.all([
    db.select().from(leadStatuses).orderBy(asc(leadStatuses.sortOrder)),
    db.select({ id: user.id, name: user.name, email: user.email, emailVerified: user.emailVerified, createdAt: user.createdAt }).from(user).orderBy(asc(user.name)),
    db.select().from(operationalSettings).orderBy(asc(operationalSettings.key)),
  ]);
  return NextResponse.json({ statuses, users, settings });
}

export async function PATCH(request: NextRequest) {
  if (!db) return NextResponse.json({ error: "Banco não configurado" }, { status: 503 });
  const body = await request.json();
  if (body.type === "status") {
    if (!body.id || !body.name?.trim()) return NextResponse.json({ error: "Status inválido" }, { status: 400 });
    const [row] = await db.update(leadStatuses).set({ name: body.name.trim(), color: body.color || "#64748b", isConversion: Boolean(body.isConversion), isFinal: Boolean(body.isFinal), active: body.active !== false }).where(eq(leadStatuses.id, body.id)).returning();
    return row ? NextResponse.json(row) : NextResponse.json({ error: "Status não encontrado" }, { status: 404 });
  }
  if (body.type === "setting") {
    if (!body.key?.trim()) return NextResponse.json({ error: "Parâmetro inválido" }, { status: 400 });
    const [row] = await db.insert(operationalSettings).values({ key: body.key.trim(), value: String(body.value ?? "") }).onConflictDoUpdate({ target: operationalSettings.key, set: { value: String(body.value ?? ""), updatedAt: new Date() } }).returning();
    return NextResponse.json(row);
  }
  if (body.type === "user") {
    if (!body.id || !body.name?.trim()) return NextResponse.json({ error: "Usuário inválido" }, { status: 400 });
    const [row] = await db.update(user).set({ name: body.name.trim(), updatedAt: new Date() }).where(eq(user.id, body.id)).returning({ id: user.id, name: user.name, email: user.email });
    return row ? NextResponse.json(row) : NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
  }
  return NextResponse.json({ error: "Tipo de configuração inválido" }, { status: 400 });
}
