"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { User } from "@/types";

export function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const userData = user as User | null;

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold">SIGAE</div>

          <div className="flex items-center gap-6">
            <div className="text-sm">
              <p className="font-semibold">{userData?.nome}</p>
              <p className="text-blue-100">{userData?.email}</p>
            </div>

            <button
              onClick={handleLogout}
              className="rounded bg-blue-700 px-4 py-2 hover:bg-blue-800"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}