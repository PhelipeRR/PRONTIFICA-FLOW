import { NextRequest, NextResponse } from "next/server";
import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import { db } from "../../../db";
import { leads, leadStatuses } from "../../../db/schema";
import { normalizePhone, normalizeText } from "../../../lib/normalization";

export async function GET(request: NextRequest) {
  if (!db) return NextResponse.json({ error: "Banco não configurado" }, { status: 503 });
  const query = request.nextUrl.searchParams.get("q")?.trim();
  const status = request.nextUrl.searchParams.get("status");
  const from = request.nextUrl.searchParams.get("from");
  const to = request.nextUrl.searchParams.get("to");
  const filters = [query ? or(ilike(leads.clientName, `%${query}%`), ilike(leads.phone, `%${query}%`)) : undefined, status ? eq(leadStatuses.name, status) : undefined, from ? sql`${leads.contactDate} >= ${from}` : undefined, to ? sql`${leads.contactDate} <= ${to}` : undefined].filter(Boolean);
  const rows = await db.select({ lead: leads, status: leadStatuses.name, color: leadStatuses.color }).from(leads).leftJoin(leadStatuses, eq(leads.statusId, leadStatuses.id)).where(filters.length ? and(...filters as any) : undefined).orderBy(desc(leads.contactDate)).limit(100);
  return NextResponse.json(rows);
}

export async function POST(request: NextRequest) {
  if (!db) return NextResponse.json({ error: "Banco não configurado" }, { status: 503 });
  const body = await request.json();
  const clientName = normalizeText(body.clientName);
  if (!clientName || !body.contactDate || !body.statusId) return NextResponse.json({ error: "Nome, data e status são obrigatórios" }, { status: 400 });
  const [created] = await db.insert(leads).values({ clientName, phone: normalizePhone(body.phone), contactDate: body.contactDate, statusId: body.statusId, notes: normalizeText(body.notes) || null, source: "manual" }).returning();
  return NextResponse.json(created, { status: 201 });
}
