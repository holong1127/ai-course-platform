import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { lessons, getLesson } from "@/lib/lessons";
import fs from "fs/promises";
import path from "path";
import { createServerSupabase } from "@/lib/supabase-server";

export async function generateStaticParams() {
  return lessons.map((lesson) => ({ slug: lesson.slug }));
}

async function checkUserAccess(): Promise<boolean> {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "active")
      .single();

    return !!subscription;
  } catch {
    return false;
  }
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) notFound();

  let content: string | null = null;
  try {
    content = await fs.readFile(
      path.join(process.cwd(), "content/lessons", `${slug}.mdx`),
      "utf-8"
    );
  } catch {
    // Content not found yet
  }

  const hasAccess = lesson.free || await checkUserAccess();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-gray-500">
        <Link href="/" className="hover:text-gray-700">首頁</Link>
        <span className="mx-2">/</span>
        <Link href="/outline" className="hover:text-gray-700">課程大綱</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">第{lesson.number}課</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <span className="rounded bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-700">
            {lesson.module}
          </span>
          {lesson.free ? (
            <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
              免費
            </span>
          ) : (
            <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
              付費
            </span>
          )}
        </div>
        <h1 className="mt-3 text-3xl font-bold text-gray-900">
          第{lesson.number}課 · {lesson.title}
        </h1>
        <p className="mt-2 text-lg text-gray-500">{lesson.summary}</p>
      </div>

      {/* Content or Paywall */}
      {hasAccess ? (
        content ? (
          <div className="prose prose-gray max-w-none">
            <MDXRemote source={content} />
          </div>
        ) : (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-6">
            <p className="text-amber-700">
              📝 內容整理中，好快會有。你可以先去睇其他課。
            </p>
          </div>
        )
      ) : (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-8 text-center">
          <svg
            className="mx-auto h-12 w-12 text-amber-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <h2 className="mt-4 text-xl font-semibold text-gray-900">
            呢課係付費內容
          </h2>
          <p className="mt-2 text-gray-600">
            一次性付款就可以解鎖全部 45 課，仲可以加入 WhatsApp
            群組同其他學員交流。
          </p>
          <Link
            href="/pricing"
            className="mt-6 inline-block rounded-lg bg-primary-600 px-6 py-3 text-white hover:bg-primary-700"
          >
            睇吓定價
          </Link>
          <p className="mt-4 text-sm text-gray-400">
            已經係會員？
            <Link href="/login" className="ml-1 text-primary-600 hover:underline">
              登入
            </Link>
          </p>
        </div>
      )}

      {/* Navigation */}
      <div className="mt-12 flex items-center justify-between border-t pt-6">
        <p className="text-sm text-gray-400">最後更新：2025</p>
      </div>
    </div>
  );
}
