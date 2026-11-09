import { NextRequest, NextResponse } from "next/server";
import { and, desc, eq, ilike, or } from "drizzle-orm";
import { db } from "../../../db";
import { businessDeals, dealHistory } from "../../../db/schema";
import { ensureBusinessSchema } from "../../../db/ensure-business-schema";
import { getActor, unauthorized } from "../../../lib/current-user";

export async function GET(request: NextRequest) {
  if (!db) return NextResponse.json({ error: "Banco não configurado" }, { status: 503 });
  const actor=await getActor(request);
  if (!actor) return unauthorized();
  await ensureBusinessSchema();
  const p=request.nextUrl.searchParams;
  const q=p.get("q"), state=p.get("state"), bank=p.get("bank"), category=p.get("category"), stage=p.get("stage"), situation=p.get("situation");
  const where=[eq(businessDeals.ownerId,actor.id),q?or(ilike(businessDeals.clientName,`%${q}%`),ilike(businessDeals.cpf,`%${q}%`),ilike(businessDeals.bank,`%${q}%`)):undefined,state?eq(businessDeals.portfolioState,state):undefined,bank?eq(businessDeals.bank,bank):undefined,category?eq(businessDeals.bankCategory,category):undefined,stage?eq(businessDeals.stage,stage):undefined,situation?eq(businessDeals.situation,situation):undefined];
  return NextResponse.json(await db.select().from(businessDeals).where(and(...where)).orderBy(desc(businessDeals.updatedAt)).limit(200));
}

export async function POST(request: NextRequest) {
  if (!db) return NextResponse.json({ error: "Banco não configurado" }, { status: 503 });
  const actor=await getActor(request);
  if (!actor) return unauthorized();
  await ensureBusinessSchema();
  const b=await request.json();
  if (!b.clientName?.trim()) return NextResponse.json({ error: "Cliente obrigatório" }, { status: 400 });
  const { id: _id, ownerId: _ownerId, createdAt: _createdAt, ...fields } = b;
  const [deal]=await db.insert(businessDeals).values({...fields,ownerId:actor.id,clientName:b.clientName.trim(),leadId:b.leadId||null,propertyValue:b.propertyValue||null,financingValue:b.financingValue||null,source:b.source??"manual"}).returning();
  await db.insert(dealHistory).values({dealId:deal.id,eventType:"CREATED",newValue:deal.portfolioState,changedBy:"sistema"});
  return NextResponse.json(deal,{status:201});
}
