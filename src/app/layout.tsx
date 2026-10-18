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
    icon: "/prontifica-favicon.svg",
    shortcut: "/prontifica-favicon.svg",
    apple: "/prontifica-favicon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="pt-BR"><body><AppShell>{children}</AppShell></body></html>; }
