"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";

const PRICE_HKD = 899;

export function PricingCard() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [showEmailInput, setShowEmailInput] = useState(false);
  const router = useRouter();

  const handlePurchase = async () => {
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setShowEmailInput(true);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, email: user.email }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "付款創建失敗");
      }

      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch (err: any) {
      setError(err.message);
    }

    setLoading(false);
  };

  const handleRegisterAndBuy = async () => {
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password: Math.random().toString(36).slice(2, 10),
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    router.push("/login");
    setLoading(false);
  };

  return (
    <div className="rounded-2xl border-2 border-primary-200 bg-white p-8 shadow-lg">
      <h3 className="text-lg font-semibold text-gray-900">一次性買斷</h3>
      <p className="mt-2 text-sm text-gray-500">終身存取全部課程</p>
      <div className="mt-6">
        <span className="text-4xl font-bold text-gray-900">HK${PRICE_HKD}</span>
        <span className="text-gray-500"> 一次</span>
      </div>
      <ul className="mt-6 space-y-3 text-sm text-gray-600">
        <li className="flex items-center gap-2">
          <span className="text-green-500">✓</span> 全部 45 課內容
        </li>
        <li className="flex items-center gap-2">
          <span className="text-green-500">✓</span> 終身存取，包含未來更新
        </li>
        <li className="flex items-center gap-2">
          <span className="text-green-500">✓</span> 加入 WhatsApp 學員群組
        </li>
        <li className="flex items-center gap-2">
          <span className="text-green-500">✓</span> 信用卡付款（Visa / Master / AE）
        </li>
      </ul>

      {showEmailInput ? (
        <div className="mt-6 space-y-3">
          <p className="text-sm text-gray-600">輸入 email 註冊後繼續付款：</p>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
          <button
            onClick={handleRegisterAndBuy}
            disabled={loading || !email}
            className="w-full rounded-lg bg-primary-600 px-6 py-3 text-white hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? "處理中..." : "註冊並前往付款"}
          </button>
        </div>
      ) : (
        <button
          onClick={handlePurchase}
          disabled={loading}
          className="mt-8 w-full rounded-lg bg-primary-600 px-6 py-3 text-white hover:bg-primary-700 disabled:opacity-50"
        >
          {loading ? "處理中..." : "立即購買"}
        </button>
      )}

      {error && (
        <p className="mt-3 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
