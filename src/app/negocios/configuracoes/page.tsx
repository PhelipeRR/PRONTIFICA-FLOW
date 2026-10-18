"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Archive, ArrowRight, Banknote, BarChart3, Building2, ClipboardCheck, FileText, Landmark, Search, Settings2, Users } from "lucide-react";

type Deal = { bank?: string; serviceOwner?: string; operationsOwner?: string; stage?: string; situation?: string; bankCategory?: string };
type Item = { title: string; description: string; href: string; icon: typeof Landmark; count?: number; note?: string };

export default function Page() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => { fetch("/api/negocios").then(async response => { const data = await response.json(); if (!response.ok) throw new Error(data.error || "Não foi possível carregar os indicadores."); setDeals(Array.isArray(data) ? data : []); }).catch(error => setError(error instanceof Error ? error.message : "Não foi possível carregar os indicadores.")).finally(() => setLoading(false)); }, []);

  const stats = useMemo(() => ({ banks: new Set(deals.map(item => item.bank).filter(Boolean)).size, service: new Set(deals.map(item => item.serviceOwner).filter(Boolean)).size, operations: new Set(deals.map(item => item.operationsOwner).filter(Boolean)).size, stages: new Set(deals.map(item => item.stage).filter(Boolean)).size, situations: new Set(deals.map(item => item.situation).filter(Boolean)).size }), [deals]);
  const sections: [string, Item[]][] = [
    ["Cadastros e responsáveis", [
      { title: "Bancos", description: "Instituições financeiras utilizadas nas operações.", href: "/negocios/configuracoes/catalogos", icon: Landmark, count: stats.banks, note: "bancos identificados" },
      { title: "Responsáveis de atendimento", description: "Profissionais comerciais atribuídos aos negócios.", href: "/negocios/configuracoes/catalogos", icon: Users, count: stats.service, note: "responsáveis identificados" },
      { title: "Responsáveis operacionais", description: "Equipe responsável pelo andamento operacional.", href: "/negocios/configuracoes/catalogos", icon: Users, count: stats.operations, note: "responsáveis identificados" },
      { title: "Parceiros", description: "Corretores e imobiliárias relacionados à operação.", href: "/corretores", icon: Building2 },
    ]],
    ["Fluxo operacional", [
      { title: "Etapas", description: "Etapas presentes no fluxo atual de financiamento.", href: "/negocios/configuracoes/catalogos", icon: BarChart3, count: stats.stages, note: "etapas em uso" },
      { title: "Situações", description: "Situações operacionais utilizadas nos negócios.", href: "/negocios/configuracoes/catalogos", icon: FileText, count: stats.situations, note: "situações em uso" },
      { title: "Parâmetros de auditoria", description: "Pendências e inconsistências encontradas nos cadastros.", href: "/negocios/auditoria", icon: ClipboardCheck, note: "Abrir auditoria" },
    ]],
    ["Financeiro e controle", [
      { title: "Carteiras financeiras", description: "Acesse Caixa, bancos privados e faturamento.", href: "/negocios", icon: Banknote, note: "Abrir gestão financeira" },
      { title: "Histórico de negócios", description: "Consulte os registros e o histórico operacional.", href: "/negocios/todos", icon: Archive, note: "Consultar negócios" },
      { title: "Importação de dados", description: "Importe planilhas de negócios reconhecidas pelo sistema.", href: "/negocios/importar", icon: Settings2, note: "Importar planilha" },
    ]],
  ];
  const filtered = sections.map(([name, items]) => [name, items.filter(item => `${item.title} ${item.description}`.toLowerCase().includes(query.toLowerCase()))] as [string, Item[]]).filter(([, items]) => items.length);

  return <section className="p-4 sm:p-8"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-medium text-blue-600">Gestão de Negócios / Configurações</p><h1 className="mt-1 text-3xl font-bold tracking-tight">Configurações de negócios</h1><p className="mt-2 max-w-2xl text-sm text-slate-500">Gerencie os cadastros, fluxos operacionais e parâmetros da sua carteira de financiamentos.</p></div><div className="flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm text-slate-400 shadow-sm"><Search size={17} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar configuração" className="w-44 bg-transparent outline-none placeholder:text-slate-400" /></div></div>
    {error && <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
    <div className="mt-8 space-y-8">{loading ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{[1, 2, 3, 4, 5, 6].map(item => <div key={item} className="h-40 animate-pulse rounded-2xl bg-slate-200" />)}</div> : filtered.map(([name, items]) => <section key={name}><div className="mb-3 flex items-center gap-2"><h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{name}</h2><span className="h-px flex-1 bg-slate-200" /></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{items.map(item => <Link href={item.href} key={item.title} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"><div className="flex items-start justify-between gap-4"><span className="rounded-xl bg-blue-50 p-2.5 text-blue-600"><item.icon size={20} /></span><ArrowRight size={18} className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600" /></div><h3 className="mt-4 font-semibold text-slate-900">{item.title}</h3><p className="mt-1 min-h-10 text-sm leading-5 text-slate-500">{item.description}</p>{item.count !== undefined ? <p className="mt-4 text-xs font-medium text-slate-600">{item.count} {item.note}</p> : <p className="mt-4 text-xs font-medium text-blue-600">{item.note} <ArrowRight className="inline" size={13} /></p>}</Link>)}</div></section>)}{!loading && !filtered.length && <div className="rounded-2xl border border-dashed bg-white p-10 text-center text-sm text-slate-500">Nenhuma configuração encontrada.</div>}</div>
  </section>;
}
