import "./globals.css";
import type { Metadata } from "next";
import { AppShell } from "../components/app-shell";

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

export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="pt-BR"><body><AppShell>{children}</AppShell></body></html>; }
