"use client";

import { useEffect, useState } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  mustChangePassword: boolean;
};

const roles = ["ADMINISTRADOR", "GESTOR", "OPERADOR", "VISUALIZADOR"];

export default function Page() {
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "OPERADOR" });
  const [message, setMessage] = useState("");
  const [temporaryPassword, setTemporaryPassword] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const response = await fetch("/api/settings");
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Não foi possível carregar os usuários.");
      setUsers(data.users || []);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Não foi possível carregar os usuários.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  async function create(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");
    setTemporaryPassword("");
    const response = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "createUser", ...newUser }),
    });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.error || "Não foi possível cadastrar o usuário.");
      return;
    }
    setMessage("Usuário cadastrado com sucesso.");
    setTemporaryPassword(data.temporaryPassword || "");
    setNewUser({ name: "", email: "", role: "OPERADOR" });
    await load();
  }

  async function save(user: User) {
    const response = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "user", id: user.id, name: user.name, role: user.role }),
    });
    const data = await response.json();
    setMessage(response.ok ? "Usuário atualizado com sucesso." : data.error || "Não foi possível salvar o usuário.");
    if (response.ok) await load();
  }

  return (
    <section className="p-4 sm:p-8">
      <p className="text-sm text-blue-600">Administração</p>
      <h1 className="mt-1 text-3xl font-bold">Usuários e permissões</h1>
      <p className="mt-2 text-sm text-slate-500">Gerencie os usuários e os papéis de acesso da operação.</p>

      {message && <p className="mt-5 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p>}
      {temporaryPassword && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-medium text-amber-900">Senha temporária para o primeiro acesso</p>
          <code className="mt-2 block font-bold text-amber-950">{temporaryPassword}</code>
        </div>
      )}

      <div className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Usuários e papéis</h2>
        <p className="mt-1 text-sm text-slate-500">Novos usuários devem criar a própria senha no primeiro login.</p>

        <form onSubmit={create} className="mt-5 grid gap-3">
          <input required placeholder="Nome completo" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} className="rounded-lg border p-2.5" />
          <div className="grid gap-3 sm:grid-cols-2">
            <input required type="email" placeholder="E-mail" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} className="rounded-lg border p-2.5" />
            <select value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })} className="rounded-lg border p-2.5">
              {roles.map(role => <option key={role}>{role}</option>)}
            </select>
          </div>
          <button className="rounded-lg bg-blue-600 p-2.5 font-semibold text-white">Cadastrar usuário</button>
        </form>

        <div className="mt-6 space-y-3">
          {loading ? <p className="text-sm text-slate-500">Carregando usuários...</p> : users.map(user => (
            <div key={user.id} className="flex flex-wrap items-center gap-3 rounded-xl border bg-slate-50 p-3">
              <div className="min-w-0 flex-1">
                <p className="font-medium">{user.name}</p>
                <p className="truncate text-xs text-slate-500">{user.email}</p>
              </div>
              <select value={user.role || "OPERADOR"} onChange={e => setUsers(current => current.map(item => item.id === user.id ? { ...item, role: e.target.value } : item))} className="rounded-lg border px-2 py-2 text-xs">
                {roles.map(role => <option key={role}>{role}</option>)}
              </select>
              <button onClick={() => void save(user)} className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white">Salvar</button>
              {user.mustChangePassword && <span className="rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-700">Primeiro acesso</span>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
