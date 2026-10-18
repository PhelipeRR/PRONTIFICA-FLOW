import Link from "next/link";
import { count, eq } from "drizzle-orm";
import { db } from "../db";
import { leads, leadStatuses } from "../db/schema";

async function metrics() {
  if (!db) return { total: 0, sent: 0, converted: 0 };
  const total = await db.select({ value: count() }).from(leads);
  const sent = await db.select({ value: count() }).from(leads).innerJoin(leadStatuses, eq(leads.statusId, leadStatuses.id)).where(eq(leadStatuses.name, "SIMULAÇÕES ENVIADAS"));
  const converted = await db.select({ value: count() }).from(leads).innerJoin(leadStatuses, eq(leads.statusId, leadStatuses.id)).where(eq(leadStatuses.isConversion, true));
  return { total: Number(total[0]?.value ?? 0), sent: Number(sent[0]?.value ?? 0), converted: Number(converted[0]?.value ?? 0) };
}

export default async function Dashboard() { const data = await metrics(); const rate = data.total ? `${((data.converted / data.total) * 100).toFixed(1)}%` : "0%"; const cards = [["Total de leads",data.total],["Simulações enviadas",data.sent],["Negócios convertidos",data.converted],["Taxa de conversão",rate],["Leads no mês","—"],["Acompanhamentos atrasados","—"]]; return <main className="min-h-screen flex"><aside className="hidden w-64 shrink-0 bg-slate-950 p-5 text-white md:block"><div className="mb-8 text-xl font-bold">Prontifica <span className="text-blue-400">Flow</span></div><nav className="space-y-1 text-sm">{[["Dashboard","/"],["Leads","/leads"],["Acompanhamentos","/acompanhamentos"],["Corretores","/corretores"],["Imobiliárias","/imobiliarias"],["Relatórios","/relatorios"],["Importar Excel","/importar"],["Configurações","/configuracoes"]].map(([label,href])=><Link className="block rounded-lg px-3 py-2 transition hover:bg-slate-800" href={href} key={href}>{label}</Link>)}</nav></aside><section className="flex-1 p-8"><div className="mb-8"><p className="text-sm text-slate-500">Visão geral</p><h1 className="text-3xl font-bold">Dashboard</h1><p className="mt-1 text-slate-500">Indicadores calculados diretamente no PostgreSQL.</p></div><div className="grid grid-cols-1 gap-4 md:grid-cols-3">{cards.map(([label,value])=><div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm" key={label}><p className="text-sm text-slate-500">{label}</p><p className="mt-3 text-3xl font-bold">{value}</p></div>)}</div></section></main>; }
