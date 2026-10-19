import { NextResponse } from "next/server";
import { and, count, desc, eq, gte, lte, sql } from "drizzle-orm";
import { db } from "../../../db";
import { agencies, brokers, followUps, leadStatuses, leads, user } from "../../../db/schema";
import { auth } from "../../../lib/auth";

export async function GET(request: Request) {
  if (!db || !auth) return NextResponse.json({ error: "Banco não configurado" }, { status: 503 });
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  const [actor] = await db.select({ id: user.id, role: user.role }).from(user).where(eq(user.id, session.user.id)).limit(1);
  if (!actor) return NextResponse.json({ error: "Usuário não encontrado" }, { status: 401 });
  const params = new URL(request.url).searchParams, from = params.get("from"), to = params.get("to");
  const canSeeAll = actor.role === "ADMINISTRADOR" || actor.role === "GESTOR";
  const ownerFilter = canSeeAll ? undefined : eq(leads.ownerId, actor.id);
  const period = and(ownerFilter, from ? gte(leads.contactDate, from) : undefined, to ? lte(leads.contactDate, to) : undefined);
  const [total, sent, converted, pending, statuses, monthly, brokerRanking, agencyRanking] = await Promise.all([
    db.select({ value: count() }).from(leads).where(period),
    db.select({ value: count() }).from(leads).innerJoin(leadStatuses, eq(leads.statusId, leadStatuses.id)).where(and(period, eq(leadStatuses.name, "SIMULAÇÕES ENVIADAS"))),
    db.select({ value: count() }).from(leads).innerJoin(leadStatuses, eq(leads.statusId, leadStatuses.id)).where(and(period, eq(leadStatuses.isConversion, true))),
    db.select({ value: count() }).from(followUps).innerJoin(leads, eq(followUps.leadId, leads.id)).where(and(ownerFilter, sql`${followUps.completedAt} is null`)),
    db.select({ name: leadStatuses.name, value: count(), color: leadStatuses.color }).from(leads).innerJoin(leadStatuses, eq(leads.statusId, leadStatuses.id)).where(period).groupBy(leadStatuses.name, leadStatuses.color),
    db.select({ month: sql<string>`to_char(${leads.contactDate}, 'YYYY-MM')`, value: count() }).from(leads).where(period).groupBy(sql`to_char(${leads.contactDate}, 'YYYY-MM')`).orderBy(sql`to_char(${leads.contactDate}, 'YYYY-MM')`),
    db.select({ name: brokers.name, value: count(), converted: sql<number>`count(*) filter (where ${leadStatuses.isConversion} = true)` }).from(leads).innerJoin(brokers, eq(leads.brokerId, brokers.id)).innerJoin(leadStatuses, eq(leads.statusId, leadStatuses.id)).where(period).groupBy(brokers.name).orderBy(desc(sql`count(*)`)).limit(10),
    db.select({ name: agencies.name, value: count(), converted: sql<number>`count(*) filter (where ${leadStatuses.isConversion} = true)` }).from(leads).innerJoin(agencies, eq(leads.agencyId, agencies.id)).innerJoin(leadStatuses, eq(leads.statusId, leadStatuses.id)).where(period).groupBy(agencies.name).orderBy(desc(sql`count(*)`)).limit(10),
  ]);
  return NextResponse.json({ cards: { total: Number(total[0]?.value ?? 0), sent: Number(sent[0]?.value ?? 0), converted: Number(converted[0]?.value ?? 0), pending: Number(pending[0]?.value ?? 0) }, statuses: statuses.map(x => ({ name: x.name, value: Number(x.value), color: x.color })), monthly: monthly.map(x => ({ month: x.month, value: Number(x.value) })), brokers: brokerRanking.map(x => ({ name: x.name, leads: Number(x.value), converted: Number(x.converted) })), agencies: agencyRanking.map(x => ({ name: x.name, leads: Number(x.value), converted: Number(x.converted) })) });
}
