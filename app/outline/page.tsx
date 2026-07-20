import { lessons, modules } from "@/lib/lessons";
import { LessonCard } from "@/components/LessonCard";
import { createServerSupabase } from "@/lib/supabase-server";

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

export default async function OutlinePage() {
  const hasAccess = await checkUserAccess();
  const visibleModules = hasAccess
    ? modules
    : modules.filter((m) => m === "入門篇");
  const visibleLessons = hasAccess
    ? lessons
    : lessons.filter((l) => l.free);
  const totalLabel = hasAccess
    ? `全部 ${lessons.length} 課`
    : `免費試睇 ${lessons.filter((l) => l.free).length} 課（全部 ${lessons.length} 課）`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">課程大綱</h1>
          <p className="mt-2 text-gray-500">{totalLabel}</p>
        </div>
        <img
          src="/robot.gif"
          alt=""
          className="hidden h-28 w-auto shrink-0 sm:block"
        />
      </div>

      <div className="mt-10 space-y-10">
        {visibleModules.map((module) => {
          const moduleLessons = visibleLessons.filter((l) => l.module === module);
          if (moduleLessons.length === 0) return null;
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

      {!hasAccess && (
        <div className="mt-10 text-center">
          <p className="text-sm text-gray-400">
            登入並購買課程後即可睇晒全部 {lessons.length} 課
          </p>
        </div>
      )}
    </div>
  );
}
