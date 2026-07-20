import Link from "next/link";
import { lessons } from "@/lib/lessons";

export default function HomePage() {
  const freeLessons = lessons.filter((l) => l.free);
  const totalLessons = lessons.length;

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-bold md:text-5xl">
            AI 幫你完成辦公室所有重複工作
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-100">
            唔使識寫 Code，唔使用外國工具。一門課程，教你用 AI
            自動化會計入帳、對數、報表、文書處理，仲有其他辦公室工種。
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/outline"
              className="rounded-lg bg-white px-6 py-3 font-medium text-primary-700 hover:bg-primary-50"
            >
              免費試睇 {freeLessons.length} 課
            </Link>
            <Link
              href="/pricing"
              className="rounded-lg border border-white/30 px-6 py-3 font-medium text-white hover:bg-white/10"
            >
              睇吓定價
            </Link>
          </div>
        </div>
      </section>

      {/* Industry selector */}
      <section className="border-b bg-gray-50 py-8">
        <div className="mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">揀你嘅行業</p>
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            <span className="rounded-full bg-primary-100 px-6 py-2 text-sm font-medium text-primary-700">
              會計／財務
            </span>
            <span className="rounded-full bg-gray-200 px-6 py-2 text-sm text-gray-400">
              HR／行政（即將推出）
            </span>
            <span className="rounded-full bg-gray-200 px-6 py-2 text-sm text-gray-400">
              採購／供應鏈（即將推出）
            </span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-lg border p-6 text-center">
            <div className="text-3xl">🤖</div>
            <h3 className="mt-4 text-lg font-semibold">AI Agent 唔係 Chatbot</h3>
            <p className="mt-2 text-sm text-gray-500">
              AI 而家有手有腳，可以直接幫你完成一整項工作，唔係剩係識答問題。
            </p>
          </div>
          <div className="rounded-lg border p-6 text-center">
            <div className="text-3xl">🇭🇰</div>
            <h3 className="mt-4 text-lg font-semibold">香港人專屬</h3>
            <p className="mt-2 text-sm text-gray-500">
              廣東話繁體中文內容，例子用香港會計及辦公室場景，貼地實用。
            </p>
          </div>
          <div className="rounded-lg border p-6 text-center">
            <div className="text-3xl">🛠️</div>
            <h3 className="mt-4 text-lg font-semibold">即學即用</h3>
            <p className="mt-2 text-sm text-gray-500">
              第一課就上手，跟住做就得。45 課由入門到進階，逐步提升。
            </p>
          </div>
        </div>
      </section>

      {/* Free lessons preview */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-bold text-gray-900">
            免費試睇 {freeLessons.length} 課
          </h2>
          <p className="mt-2 text-gray-500">
            唔使俾錢，直接睇晒入門篇全部內容。
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {freeLessons.map((lesson) => (
              <Link
                key={lesson.slug}
                href={`/lessons/${lesson.slug}`}
                className="block rounded-lg border bg-white p-4 transition-colors hover:border-primary-300"
              >
                <span className="text-xs font-medium text-primary-600">
                  第{lesson.number}課
                </span>
                <h3 className="mt-1 font-medium text-gray-900">
                  {lesson.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500">{lesson.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          {totalLessons} 課，由零開始成為 AI 辦公達人
        </h2>
        <p className="mt-2 text-gray-500">
          唔需要程式經驗，唔需要外國工具，只需要你肯試。
        </p>
        <Link
          href="/pricing"
          className="mt-6 inline-block rounded-lg bg-primary-600 px-8 py-3 text-white hover:bg-primary-700"
        >
          立即開始
        </Link>
      </section>
    </div>
  );
}
