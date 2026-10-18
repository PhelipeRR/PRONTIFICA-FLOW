import "./globals.css";
import { Sidebar } from "../components/sidebar";
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="pt-BR"><body><div className="flex min-h-screen"><Sidebar/><div className="min-w-0 flex-1">{children}</div></div></body></html>; }
