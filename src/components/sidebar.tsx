"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
const items = [["Dashboard","/"],["Leads","/leads"],["Acompanhamentos","/acompanhamentos"],["Corretores","/corretores"],["Imobiliárias","/imobiliarias"],["Relatórios","/relatorios"],["Importar Excel","/importar"],["Configurações","/configuracoes"]];
export function Sidebar(){const pathname=usePathname();return <aside className="hidden min-h-screen w-64 shrink-0 bg-slate-950 p-5 text-white md:block"><div className="mb-8 text-xl font-bold">Prontifica <span className="text-blue-400">Flow</span></div><nav className="space-y-1 text-sm">{items.map(([label,href])=>{const active=href==="/"?pathname==="/":pathname.startsWith(href);return <Link className={`block rounded-lg px-3 py-2 transition ${active?"bg-blue-600 text-white":"text-slate-300 hover:bg-slate-800 hover:text-white"}`} href={href} key={href}>{label}</Link>})}</nav></aside>}
