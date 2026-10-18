import { NextRequest, NextResponse } from "next/server";
import { asc, eq, sql } from "drizzle-orm";
import { db } from "../../../db";
import { leadStatuses, operationalSettings, user } from "../../../db/schema";

export async function GET() {
  if (!db) return NextResponse.json({ error: "Banco não configurado" }, { status: 503 });
  await db.execute(sql`create table if not exists operational_settings (key text primary key, value text not null, updated_at timestamp not null default now(), updated_by text)`);
  await db.execute(sql`alter table "user" add column if not exists role text not null default 'OPERADOR'`);
  await db.execute(sql`alter table "user" add column if not exists must_change_password boolean not null default false`);
  const [statuses, users, settings] = await Promise.all([
    db.select().from(leadStatuses).orderBy(asc(leadStatuses.sortOrder)),
    db.select({ id: user.id, name: user.name, email: user.email, emailVerified: user.emailVerified, role: user.role, mustChangePassword: user.mustChangePassword, createdAt: user.createdAt }).from(user).orderBy(asc(user.name)),
    db.select().from(operationalSettings).orderBy(asc(operationalSettings.key)),
  ]);
  return NextResponse.json({ statuses, users, settings });
}

export async function PATCH(request: NextRequest) {
  if (!db) return NextResponse.json({ error: "Banco não configurado" }, { status: 503 });
  await db.execute(sql`create table if not exists operational_settings (key text primary key, value text not null, updated_at timestamp not null default now(), updated_by text)`);
  await db.execute(sql`alter table "user" add column if not exists role text not null default 'OPERADOR'`);
  await db.execute(sql`alter table "user" add column if not exists must_change_password boolean not null default false`);
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
    const [row] = await db.update(user).set({ name: body.name.trim(), role: body.role || "OPERADOR", updatedAt: new Date() }).where(eq(user.id, body.id)).returning({ id: user.id, name: user.name, email: user.email, role: user.role });
    return row ? NextResponse.json(row) : NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
  }
  if (body.type === "createUser") {
    if (!body.name?.trim() || !body.email?.trim()) return NextResponse.json({ error: "Nome e e-mail são obrigatórios" }, { status: 400 });
    if (!process.env.BETTER_AUTH_SECRET) return NextResponse.json({ error: "Autenticação não configurada" }, { status: 503 });
    const temporaryPassword = `Prontifica#${Math.random().toString(36).slice(2,8)}!`;
    const origin = request.headers.get("origin") || new URL(request.url).origin;
    const response = await fetch(new URL("/api/auth/sign-up/email", request.url), { method: "POST", headers: { "content-type": "application/json", origin, referer: `${origin}/configuracoes/usuarios` }, body: JSON.stringify({ name: body.name.trim(), email: body.email.trim().toLowerCase(), password: temporaryPassword }) });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) return NextResponse.json({ error: result.message || result.error || "Não foi possível cadastrar o usuário" }, { status: response.status });
    const created = result.user;
    if (!created?.id) return NextResponse.json({ error: "Usuário criado sem identificador" }, { status: 500 });
    await db.update(user).set({ role: body.role || "OPERADOR", mustChangePassword: true, updatedAt: new Date() }).where(eq(user.id, created.id));
    return NextResponse.json({ user: { id: created.id, name: created.name, email: created.email, role: body.role || "OPERADOR" }, temporaryPassword }, { status: 201 });
  }
  return NextResponse.json({ error: "Tipo de configuração inválido" }, { status: 400 });
}
