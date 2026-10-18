import "./globals.css";
import type { Metadata } from "next";
import { Sidebar, MobileNav } from "../components/sidebar";

export const metadata: Metadata = {
  title: {
    default: "Prontifica Flow",
    template: "%s | Prontifica Flow",
  },
  description: "Gestão e acompanhamento comercial imobiliário.",
  icons: {
    icon: "/prontifica-favicon.png",
    shortcut: "/prontifica-favicon.png",
    apple: "/prontifica-favicon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="pt-BR"><body><div className="min-h-screen"><MobileNav/><div className="flex min-h-screen"><Sidebar/><div className="min-w-0 flex-1">{children}</div></div></div></body></html>; }
