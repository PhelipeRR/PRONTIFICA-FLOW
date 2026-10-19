"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Modal } from "../../../components/modal";

type User = { id: string; name: string; email: string; role: string; mustChangePassword: boolean };
const roles = ["ADMINISTRADOR", "GESTOR", "OPERADOR", "VISUALIZADOR"];

export default function Page() {
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "OPERADOR" });
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [temporaryPassword, setTemporaryPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const response = await fetch("/api/settings");
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Não foi possível carregar os usuários.");
      setUsers(data.users || []);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Não foi possível carregar os usuários.");
    } finally { setLoading(false); }
  }
  useEffect(() => { void load(); }, []);

  async function create(event: React.FormEvent) {
    event.preventDefault(); setSaving(true); setMessage(""); setTemporaryPassword("");
    const response = await fetch("/api/settings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "createUser", ...newUser }) });
    const data = await response.json();
    if (!response.ok) { setMessage(data.error || "Não foi possível cadastrar o usuário."); setSaving(false); return; }
    setMessage("Usuário cadastrado com sucesso."); setTemporaryPassword(data.temporaryPassword || "");
    setNewUser({ name: "", email: "", role: "OPERADOR" }); setOpen(false); await load(); setSaving(false);
  }

  async function save(user: User) {
    const response = await fetch("/api/settings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "user", id: user.id, name: user.name, role: user.role }) });
    const data = await response.json();
    setMessage(response.ok ? "Usuário atualizado com sucesso." : data.error || "Não foi possível salvar o usuário.");
    if (response.ok) await load();
  }

  return <section className="p-4 sm:p-8">
    <p className="text-sm text-blue-600">Administração</p>
    <h1 className="mt-1 text-3xl font-bold">Usuários e permissões</h1>
    <p className="mt-2 text-sm text-slate-500">Gerencie os usuários e os papéis de acesso da operação.</p>
    {message && <p className="mt-5 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p>}
    {temporaryPassword && <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4"><p className="text-sm font-semibold text-amber-900">Usuário criado — envie estes dados ao usuário</p><p className="mt-1 text-sm text-amber-800">Ele deve entrar com o e-mail cadastrado e esta senha temporária. Depois será redirecionado para criar a senha pessoal.</p><div className="mt-3 flex items-center gap-3"><code className="rounded-lg bg-white px-3 py-2 font-bold text-amber-950">{temporaryPassword}</code><button type="button" onClick={() => void navigator.clipboard?.writeText(temporaryPassword)} className="rounded-lg border border-amber-300 px-3 py-2 text-xs font-semibold text-amber-900">Copiar senha</button></div></div>}
    <div className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4"><div><h2 className="text-lg font-semibold">Usuários e papéis</h2><p className="mt-1 text-sm text-slate-500">Novos usuários devem criar a própria senha no primeiro login.</p></div><button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white"><Plus size={16} />Novo</button></div>
      <div className="mt-6 space-y-3">{loading ? <p className="text-sm text-slate-500">Carregando usuários...</p> : users.map(user => <div key={user.id} className="flex flex-wrap items-center gap-3 rounded-xl border bg-slate-50 p-3"><div className="min-w-0 flex-1"><p className="font-medium">{user.name}</p><p className="truncate text-xs text-slate-500">{user.email}</p></div><select value={user.role || "OPERADOR"} onChange={e => setUsers(current => current.map(item => item.id === user.id ? { ...item, role: e.target.value } : item))} className="rounded-lg border px-2 py-2 text-xs">{roles.map(role => <option key={role}>{role}</option>)}</select><button onClick={() => void save(user)} className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white">Salvar</button>{user.mustChangePassword && <span className="rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-700">Primeiro acesso</span>}</div>)}</div>
    </div>
    <Modal open={open} onClose={() => !saving && setOpen(false)} title="Novo usuário" description="Cadastre o usuário e defina o papel de acesso inicial."><form onSubmit={create} className="space-y-4 p-6"><label className="block text-sm font-medium">Nome completo<input required value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} className="mt-1.5 w-full rounded-lg border p-2.5" /></label><label className="block text-sm font-medium">E-mail<input required type="email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} className="mt-1.5 w-full rounded-lg border p-2.5" /></label><label className="block text-sm font-medium">Papel<select value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })} className="mt-1.5 w-full rounded-lg border p-2.5">{roles.map(role => <option key={role}>{role}</option>)}</select></label><div className="flex justify-end gap-3 border-t pt-5"><button type="button" onClick={() => setOpen(false)} className="rounded-lg border px-4 py-2">Cancelar</button><button disabled={saving} className="rounded-lg bg-blue-600 px-4 py-2 text-white">{saving ? "Cadastrando..." : "Cadastrar usuário"}</button></div></form></Modal>
  </section>;
}
