import { redirect } from "next/navigation";
import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase-server";

export default async function DashboardPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "active")
    .single();

  const hasAccess = !!subscription;
  const whatsappUrl = process.env.NEXT_PUBLIC_WHATSAPP_GROUP_URL;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900">會員專區</h1>
      <p className="mt-1 text-gray-500">{user.email}</p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {/* Course access status */}
        <div className="rounded-lg border p-6">
          <h2 className="text-lg font-semibold text-gray-900">課程存取</h2>
          {hasAccess ? (
            <div>
              <p className="mt-2 text-green-600 font-medium">
                ✓ 你已解鎖全部課程
              </p>
              <Link
                href="/outline"
                className="mt-4 inline-block rounded-lg bg-primary-600 px-4 py-2 text-sm text-white hover:bg-primary-700"
              >
                去上課
              </Link>
            </div>
          ) : (
            <div>
              <p className="mt-2 text-amber-600 font-medium">
                你尚未購買課程
              </p>
              <Link
                href="/pricing"
                className="mt-4 inline-block rounded-lg bg-primary-600 px-4 py-2 text-sm text-white hover:bg-primary-700"
              >
                查看定價
              </Link>
            </div>
          )}
        </div>

        {/* WhatsApp group */}
        <div className="rounded-lg border p-6">
          <h2 className="text-lg font-semibold text-gray-900">學員群組</h2>
          {hasAccess && whatsappUrl ? (
            <div>
              <p className="mt-2 text-gray-500">
                加入 WhatsApp 群組，同其他學員交流心得。
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block rounded-lg bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
              >
                加入 WhatsApp 群
              </a>
            </div>
          ) : (
            <p className="mt-2 text-gray-400">
              {hasAccess
                ? "WhatsApp 群連結即將準備好"
                : "購買課程後即可加入學員群組"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
