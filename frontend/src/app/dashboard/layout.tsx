"use client";

import { ProtectedRoute } from "@/components/common/ProtectedRoute";
import { Navbar } from "@/components/common/Navbar";
import { Sidebar } from "@/components/common/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-ufrrj-light">
        <Sidebar />
        <div className="flex-1">
          <Navbar />
          <main className="p-6">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}