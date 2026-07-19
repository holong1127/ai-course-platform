import Link from "next/link";
import type { Lesson } from "@/lib/lessons";

export function LessonCard({ lesson }: { lesson: Lesson }) {
  return (
    <Link
      href={`/lessons/${lesson.slug}`}
      className="block rounded-lg border p-4 transition-colors hover:border-primary-300 hover:bg-primary-50/50"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-primary-600">
              第{lesson.number}課
            </span>
            {lesson.free && (
              <span className="rounded bg-green-100 px-1.5 py-0.5 text-xs font-medium text-green-700">
                免費
              </span>
            )}
          </div>
          <h3 className="mt-1 font-medium text-gray-900">{lesson.title}</h3>
          <p className="mt-1 text-sm text-gray-500">{lesson.summary}</p>
        </div>
        {!lesson.free && (
          <svg
            className="mt-1 h-4 w-4 shrink-0 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        )}
      </div>
    </Link>
  );
}
