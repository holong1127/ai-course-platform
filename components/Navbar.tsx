"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";
import { useEffect, useState } from "react";

export function Navbar() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold text-primary-600">
          AI 辦公達人
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/outline"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            課程大綱
          </Link>
          <Link
            href="/pricing"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            定價
          </Link>
          {user ? (
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                會員專區
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                登出
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm text-white hover:bg-primary-700"
            >
              登入
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
