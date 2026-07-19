import Link from "next/link";

export function Footer() {
  const whatsappUrl =
    process.env.NEXT_PUBLIC_WHATSAPP_GROUP_URL || "#";

  return (
    <footer className="border-t bg-gray-50">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-8 md:flex-row md:justify-between">
        <div className="flex gap-6 text-sm text-gray-500">
          <Link href="/outline">課程大綱</Link>
          <Link href="/about">關於我們</Link>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp 群組
          </a>
        </div>
        <p className="text-sm text-gray-400">© 2025 AI 辦公達人</p>
      </div>
    </footer>
  );
}
