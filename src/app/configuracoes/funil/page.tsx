"use client";

import { StatusManager } from "../../../components/status-manager";

export default function Page() {
  return (
    <section className="p-4 sm:p-8">
      <p className="text-sm text-blue-600">Administração</p>
      <h1 className="mt-1 text-3xl font-bold">Funil de leads</h1>
      <p className="mt-2 text-sm text-slate-500">Cadastre e mantenha os status usados no atendimento comercial.</p>
      <div className="mt-8">
        <StatusManager />
      </div>
    </section>
  );
}
