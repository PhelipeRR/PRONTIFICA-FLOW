"use client";
import { usePathname } from "next/navigation";
import { Sidebar, MobileNav } from "./sidebar";
import { useEffect, useState } from "react";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); const [name, setName] = useState("");
  useEffect(() => { fetch("/api/account/me").then(response => response.ok ? response.json() : null).then(data => setName(data?.name || "")).catch(() => undefined); }, []);
  if (pathname === "/login" || pathname === "/primeiro-acesso" || pathname.startsWith("/forgot-password")) return <>{children}</>;
  return <div className="min-h-screen bg-slate-50"><MobileNav/><div className="flex min-h-screen"><Sidebar/><div className="min-w-0 flex-1"><header className="hidden h-16 items-center justify-between border-b border-slate-200 bg-white px-6 md:flex"><div><p className="text-xs font-medium uppercase tracking-wider text-slate-400">Prontifica Flow</p><p className="text-sm font-medium text-slate-700">{name ? `Bem-vindo, ${name}` : "Gestão comercial imobiliária"}</p></div><span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">Operação ativa</span></header>{children}</div></div></div>;
}
