import { NextRequest, NextResponse } from "next/server";
import { and, desc, eq, ilike, or } from "drizzle-orm";
import { db } from "../../../db";
import { businessDeals, dealHistory } from "../../../db/schema";

export async function GET(request: NextRequest) {
  if (!db) return NextResponse.json({ error: "Banco não configurado" }, { status: 503 });
  const p=request.nextUrl.searchParams;
  const q=p.get("q"), state=p.get("state"), bank=p.get("bank"), category=p.get("category");
  const where=[q?or(ilike(businessDeals.clientName,`%${q}%`),ilike(businessDeals.cpf,`%${q}%`),ilike(businessDeals.bank,`%${q}%`)):undefined,state?eq(businessDeals.portfolioState,state):undefined,bank?eq(businessDeals.bank,bank):undefined,category?eq(businessDeals.bankCategory,category):undefined].filter(Boolean);
  return NextResponse.json(await db.select().from(businessDeals).where(where.length?and(...where as any):undefined).orderBy(desc(businessDeals.updatedAt)).limit(200));
}

export async function POST(request: NextRequest) {
  if (!db) return NextResponse.json({ error: "Banco não configurado" }, { status: 503 });
  const b=await request.json();
  if (!b.clientName?.trim()) return NextResponse.json({ error: "Cliente obrigatório" }, { status: 400 });
  const [deal]=await db.insert(businessDeals).values({...b,clientName:b.clientName.trim(),leadId:b.leadId||null,propertyValue:b.propertyValue||null,financingValue:b.financingValue||null,source:b.source??"manual"}).returning();
  await db.insert(dealHistory).values({dealId:deal.id,eventType:"CREATED",newValue:deal.portfolioState,changedBy:"sistema"});
  return NextResponse.json(deal,{status:201});
}
