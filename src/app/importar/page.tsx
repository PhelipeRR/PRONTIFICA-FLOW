"use client";
import Link from "next/link";
import { DragEvent, FormEvent, useRef, useState } from "react";
import { CheckCircle2, FileSpreadsheet, Lock, TriangleAlert, UploadCloud, X } from "lucide-react";
import { LoadingLabel } from "../../components/action-feedback";

type Result = { ok: true; imported: number; skipped: number } | { ok: false; error: string };

const columns = [["A", "Data do contato"], ["B", "Cliente"], ["C", "Telefone"], ["D", "Corretor"], ["E", "Imobiliária"], ["F", "Status"], ["G", "Observações"]] as const;

function formatSize(bytes: number) { return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`; }

export default function Page() {
  const input = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null), [busy, setBusy] = useState(false), [dragging, setDragging] = useState(false), [result, setResult] = useState<Result | null>(null);

  function pick(next: File | null | undefined) {
    setResult(null);
    if (next && !next.name.toLowerCase().endsWith(".xlsx")) { setFile(null); setResult({ ok: false, error: "Formato não suportado. Envie um arquivo .xlsx." }); return; }
    setFile(next ?? null);
  }
  function clear() { setFile(null); setResult(null); if (input.current) input.current.value = ""; }
  function onDrop(e: DragEvent) { e.preventDefault(); setDragging(false); pick(e.dataTransfer.files?.[0]); }

  async function submit(e: FormEvent) {
    e.preventDefault(); if (!file) return;
    setBusy(true); setResult(null);
    try {
      const form = new FormData(); form.append("file", file);
      const res = await fetch("/api/import", { method: "POST", body: form });
      const json = await res.json().catch(() => ({}));
      setResult(res.ok ? { ok: true, imported: Number(json.imported ?? 0), skipped: Number(json.skipped ?? 0) } : { ok: false, error: json.error || "Não foi possível importar a planilha." });
    } catch { setResult({ ok: false, error: "Não foi possível conectar ao servidor de importação." }); }
    finally { setBusy(false); }
  }

  return <section className="p-4 sm:p-8">
    <p className="text-sm font-medium text-blue-600">Gestão comercial</p>
    <h1 className="mt-1 text-3xl font-bold">Importar Excel</h1>
    <p className="mt-2 text-sm text-slate-500">Traga sua planilha de leads para o sistema em poucos segundos.</p>

    <div className="mt-8 grid max-w-6xl gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <form onSubmit={submit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-slate-900">Arquivo da planilha</h2>
        <p className="mt-1 text-sm text-slate-500">Arquivo .xlsx com as abas LEADS 2025 ou LEADS 2026.</p>

        {file ? (
          <div className="mt-5 flex items-center gap-4 rounded-xl border border-blue-200 bg-blue-50/60 p-4">
            <span className="rounded-lg bg-white p-2.5 text-emerald-600 shadow-sm"><FileSpreadsheet size={24} /></span>
            <div className="min-w-0 flex-1"><p className="truncate font-medium text-slate-900">{file.name}</p><p className="text-xs text-slate-500">{formatSize(file.size)}</p></div>
            <button type="button" onClick={clear} disabled={busy} aria-label="Remover arquivo" className="rounded-lg p-2 text-slate-500 hover:bg-white hover:text-slate-900 disabled:opacity-50"><X size={18} /></button>
          </div>
        ) : (
          <label onDragOver={e => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={onDrop}
            className={`mt-5 flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition focus-within:ring-2 focus-within:ring-blue-200 ${dragging ? "border-blue-500 bg-blue-50" : "border-slate-300 bg-slate-50/60 hover:border-blue-400 hover:bg-blue-50/40"}`}>
            <input ref={input} type="file" accept=".xlsx" className="sr-only" onChange={e => pick(e.target.files?.[0])} />
            <span className="rounded-full bg-blue-100 p-3 text-blue-600"><UploadCloud size={26} /></span>
            <span className="mt-4 font-semibold text-slate-800">Arraste a planilha aqui</span>
            <span className="mt-1 text-sm text-slate-500">ou <span className="font-medium text-blue-600 underline underline-offset-2">clique para escolher</span> no computador</span>
          </label>
        )}

        {result && (result.ok ? (
          <div role="status" className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="flex items-center gap-2 font-medium text-emerald-800"><CheckCircle2 size={18} />Importação concluída</p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-white p-3"><p className="text-2xl font-bold text-slate-900">{result.imported}</p><p className="text-xs text-slate-500">leads importados</p></div>
              <div className="rounded-lg bg-white p-3"><p className="text-2xl font-bold text-slate-900">{result.skipped}</p><p className="text-xs text-slate-500">linhas ignoradas</p></div>
            </div>
            <Link href="/leads" className="mt-3 inline-block text-sm font-medium text-emerald-800 underline underline-offset-2">Ver meus leads</Link>
          </div>
        ) : (
          <p role="alert" className="mt-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"><TriangleAlert size={18} className="mt-0.5 shrink-0" />{result.error}</p>
        ))}

        <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-5">
          <button type="submit" disabled={!file || busy} className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">{busy ? <LoadingLabel>Importando...</LoadingLabel> : "Importar planilha"}</button>
          {!file && <span className="text-sm text-slate-500">Escolha um arquivo para continuar.</span>}
        </div>
      </form>

      <aside className="space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-slate-900">Colunas esperadas</h2>
          <p className="mt-1 text-xs text-slate-500">Mesma ordem da planilha padrão, com o cabeçalho no topo da aba.</p>
          <ul className="mt-4 space-y-2">{columns.map(([col, label]) => <li key={col} className="flex items-center gap-3 text-sm text-slate-700"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-slate-100 text-xs font-semibold text-slate-600">{col}</span>{label}</li>)}</ul>
          <p className="mt-4 text-xs leading-relaxed text-slate-500">Linhas sem data ou sem nome do cliente são ignoradas. Linhas já importadas por você não são duplicadas.</p>
        </div>
        <div className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-sm">
          <Lock size={18} className="mt-0.5 shrink-0 text-slate-400" />
          <p>Os leads importados ficam visíveis somente para a sua conta.</p>
        </div>
      </aside>
    </div>
  </section>;
}
