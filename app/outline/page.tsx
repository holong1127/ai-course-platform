import { lessons, modules } from "@/lib/lessons";
import { LessonCard } from "@/components/LessonCard";

export default function OutlinePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900">課程大綱</h1>
      <p className="mt-2 text-gray-500">
        全部 {lessons.length} 課，按工作流程走——上手→讀懂文檔→計劃→執行→完成
      </p>

      <div className="mt-10 space-y-10">
        {modules.map((module) => {
          const moduleLessons = lessons.filter((l) => l.module === module);
          return (
            <section key={module}>
              <h2 className="mb-4 text-xl font-semibold text-gray-800">
                {module}
                <span className="ml-2 text-sm font-normal text-gray-400">
                  {moduleLessons.length} 課
                </span>
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {moduleLessons.map((lesson) => (
                  <LessonCard key={lesson.slug} lesson={lesson} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
