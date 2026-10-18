import "./globals.css";
import { Sidebar, MobileNav } from "../components/sidebar";
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="pt-BR"><body><div className="min-h-screen"><MobileNav/><div className="flex min-h-screen"><Sidebar/><div className="min-w-0 flex-1">{children}</div></div></div></body></html>; }
