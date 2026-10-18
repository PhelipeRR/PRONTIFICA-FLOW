import { NextRequest, NextResponse } from "next/server";
import { and, asc, eq } from "drizzle-orm";
import { auth } from "../../../../../lib/auth";
import { db } from "../../../../../db";
import { businessCatalogs, user } from "../../../../../db/schema";
import { sql } from "drizzle-orm";

async function admin(request: NextRequest) {
  if (!db || !auth) return false;
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) return false;
  const [row] = await db.select({ role: user.role }).from(user).where(eq(user.id, session.user.id)).limit(1);
  return row?.role === "ADMINISTRADOR";
}

async function ensure() {
  if (!db) return;
  await db.execute(sql`CREATE TABLE IF NOT EXISTS business_catalogs (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), category text NOT NULL, name text NOT NULL, description text, color text, sort_order integer NOT NULL DEFAULT 0, active boolean NOT NULL DEFAULT true, created_at timestamp NOT NULL DEFAULT now(), updated_at timestamp NOT NULL DEFAULT now())`);
}

export async function GET(request: NextRequest) {
  if (!db) return NextResponse.json({ error: "Banco não configurado" }, { status: 503 });
  await ensure();
  const category = request.nextUrl.searchParams.get("category");
  const filters = category ? [eq(businessCatalogs.category, category)] : [];
  return NextResponse.json(await db.select().from(businessCatalogs).where(filters.length ? and(...filters) : undefined).orderBy(asc(businessCatalogs.category), asc(businessCatalogs.sortOrder), asc(businessCatalogs.name)));
}

export async function POST(request: NextRequest) {
  if (!await admin(request)) return NextResponse.json({ error: "Apenas administradores podem alterar configurações." }, { status: 403 });
  await ensure();
  const body = await request.json();
  if (!body.category?.trim() || !body.name?.trim()) return NextResponse.json({ error: "Categoria e nome são obrigatórios." }, { status: 400 });
  const [row] = await db!.insert(businessCatalogs).values({ category: body.category.trim(), name: body.name.trim(), description: body.description?.trim() || null, color: body.color || null, sortOrder: Number(body.sortOrder || 0), active: body.active !== false }).returning();
  return NextResponse.json(row, { status: 201 });
}

export async function PUT(request: NextRequest) {
  if (!await admin(request)) return NextResponse.json({ error: "Apenas administradores podem alterar configurações." }, { status: 403 });
  await ensure();
  const body = await request.json();
  if (!body.id || !body.name?.trim()) return NextResponse.json({ error: "Registro inválido." }, { status: 400 });
  const [row] = await db!.update(businessCatalogs).set({ name: body.name.trim(), description: body.description?.trim() || null, color: body.color || null, sortOrder: Number(body.sortOrder || 0), active: body.active !== false, updatedAt: new Date() }).where(eq(businessCatalogs.id, body.id)).returning();
  return row ? NextResponse.json(row) : NextResponse.json({ error: "Registro não encontrado." }, { status: 404 });
}
