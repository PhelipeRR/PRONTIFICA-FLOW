"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Modal } from "./modal";
import { ConfirmModal } from "./action-feedback";

type Status = { id: string; name: string; color: string; isConversion: boolean; isFinal: boolean };
const initialForm = { name: "", color: "#2563eb", isConversion: false, isFinal: false };

export function StatusManager() {
  const [rows, setRows] = useState<Status[]>([]);
  const [open, setOpen] = useState(false);
  const [remove, setRemove] = useState<Status | null>(null);
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const load = () => fetch("/api/statuses").then(r => r.json()).then(j => setRows(Array.isArray(j) ? j : []));
  useEffect(() => { void load(); }, []);
  async function save(id: string, body: Partial<Status>) {
    setBusy(true); const response = await fetch("/api/settings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "status", id, ...body }) });
    setMessage(response.ok ? "Status salvo." : "Não foi possível salvar."); if (response.ok) await load(); setBusy(false);
  }
  async function create(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); const response = await fetch("/api/statuses", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, sortOrder: rows.length }) }); const data = await response.json();
    if (response.ok) { setOpen(false); setForm(initialForm); setMessage("Status cadastrado."); await load(); } else setMessage(data.error || "Não foi possível cadastrar."); setBusy(false);
  }
  async function removeStatus() {
    if (!remove) return; setBusy(true); const response = await fetch(`/api/statuses?id=${remove.id}`, { method: "DELETE" }); const data = await response.json(); setMessage(response.ok ? "Status excluído." : data.error || "Não foi possível excluir."); if (response.ok) { setRemove(null); await load(); } setBusy(false);
  }
  return <div className="rounded-2xl border bg-white p-6 shadow-sm">
    <div className="flex items-start justify-between gap-3"><div><h2 className="text-lg font-semibold">Status dos leads</h2><p className="mt-1 text-sm text-slate-500">Edite, cadastre e exclua status em um único lugar.</p></div><button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white"><Plus size={16} />Novo status</button></div>
    {message && <p className="mt-4 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">{message}</p>}
    <div className="mt-5 space-y-2">{rows.map(status => <div key={status.id} className="flex flex-wrap items-center gap-2 rounded-xl border bg-slate-50 p-2"><input value={status.name} onChange={e => setRows(items => items.map(item => item.id === status.id ? { ...item, name: e.target.value } : item))} className="min-w-[180px] flex-1 rounded-lg border p-2 text-sm" /><input type="color" value={status.color} onChange={e => setRows(items => items.map(item => item.id === status.id ? { ...item, color: e.target.value } : item))} className="h-9 w-12 rounded border p-1" /><label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={status.isConversion} onChange={e => setRows(items => items.map(item => item.id === status.id ? { ...item, isConversion: e.target.checked } : item))} />Conversão</label><label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={status.isFinal} onChange={e => setRows(items => items.map(item => item.id === status.id ? { ...item, isFinal: e.target.checked } : item))} />Final</label><button disabled={busy} onClick={() => void save(status.id, { name: status.name, color: status.color, isConversion: status.isConversion, isFinal: status.isFinal })} className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white">Salvar</button><button onClick={() => setRemove(status)} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"><Trash2 size={16} /></button></div>)}</div>
    <Modal open={open} onClose={() => !busy && setOpen(false)} title="Cadastrar novo status" description="O status ficará disponível no funil de leads."><form onSubmit={create} className="space-y-4 p-6"><label className="block text-sm font-medium">Nome<input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="mt-1.5 w-full rounded-lg border p-2.5" /></label><label className="block text-sm font-medium">Cor<input type="color" value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} className="mt-1.5 h-10 w-full rounded-lg border p-1" /></label><div className="flex flex-wrap gap-4"><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isConversion} onChange={e => setForm({ ...form, isConversion: e.target.checked })} />Conversão</label><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isFinal} onChange={e => setForm({ ...form, isFinal: e.target.checked })} />Final</label></div><div className="flex justify-end gap-3 border-t pt-5"><button type="button" onClick={() => setOpen(false)} className="rounded-lg border px-4 py-2">Cancelar</button><button disabled={busy} className="rounded-lg bg-blue-600 px-4 py-2 text-white">Cadastrar</button></div></form></Modal>
    <ConfirmModal open={!!remove} onCancel={() => !busy && setRemove(null)} onConfirm={removeStatus} busy={busy} title="Excluir status" description={`Tem certeza que deseja excluir “${remove?.name}”? Status vinculados a leads não podem ser removidos.`} />
  </div>;
}
