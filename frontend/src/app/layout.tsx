import type { Metadata } from "next";
import { ClientAuthProvider } from "@/context/AuthProvider";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "SIGAE - Gestão de Ações Extensionistas",
  description: "Sistema para gerenciar ações extensionistas",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <ClientAuthProvider>{children}</ClientAuthProvider>
      </body>
    </html>
  );
}