import Link from "next/link";

export default function CatalogosLayout({ children }: { children: React.ReactNode }) {
  return <div>{children}<div className="px-4 pb-8 sm:px-8"><Link href="/negocios/configuracoes" className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800">← Voltar para configurações</Link></div></div>;
}
