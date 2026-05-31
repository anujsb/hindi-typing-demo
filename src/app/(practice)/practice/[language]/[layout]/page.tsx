import Link from "next/link"
import { db } from "@/lib/db"
import { exercises } from "@/lib/schema"
import { eq, and } from "drizzle-orm"

export default async function ExerciseList({ params }: { params: { language: string, layout: string } }) {
  const langUpper = params.language.toUpperCase() as any;
  const layoutUpper = params.layout.toUpperCase() as any;

  let exerciseList: typeof exercises.$inferSelect[] = [];
  try {
     exerciseList = await db.select().from(exercises).where(
      and(
        eq(exercises.language, langUpper),
        eq(exercises.layout, layoutUpper)
      )
    ).orderBy(exercises.orderIndex)
  } catch (e) {
     console.error("DB error fetching exercises", e);
  }

  return (
    <div className="min-h-screen bg-[#faf7f2] py-16 px-4 sm:px-6 lg:px-8 font-[Georgia,serif]">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="text-center">
          <p className="mb-2.5 font-mono text-[#a0896a] text-xs uppercase tracking-[0.18em]">
            {langUpper} · {layoutUpper.replace(/_/g, " ")}
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-[#1c1810]">
            Exercises
          </h1>
          <div className="bg-[#c9a96e] mx-auto mt-5 rounded-sm w-12 h-0.5" />
        </header>

        {exerciseList.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#e8dcc8]">
             <p className="text-[#a0896a] font-sans">No exercises found for this layout.</p>
          </div>
        ) : (
          <div className="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#e8dcc8] overflow-hidden rounded-3xl font-sans">
            <ul role="list" className="divide-y divide-[#f0e9dc]">
              {exerciseList.map((exercise, idx) => (
                <li key={exercise.id}>
                  <Link href={`/practice/${params.language}/${params.layout}/exercise/${exercise.id}`} className="block hover:bg-[#fdfbf7] transition-colors group">
                    <div className="px-6 py-6 sm:px-8 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[#f0e9dc] text-[#a0896a] font-mono text-sm font-bold group-hover:bg-[#c9a96e] group-hover:text-white transition-colors">
                          {idx + 1}
                        </span>
                        <div className="text-lg font-semibold text-[#1c1810]">
                          {exercise.title}
                        </div>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex items-center gap-4">
                        {exercise.isPremium ? (
                          <span className="px-3 py-1 inline-flex text-[0.7rem] uppercase tracking-wider font-bold rounded-full bg-[#fceecf] text-[#b58b22]">
                            Premium
                          </span>
                        ) : (
                          <span className="px-3 py-1 inline-flex text-[0.7rem] uppercase tracking-wider font-bold rounded-full bg-[#e8f4ec] text-[#3e8e58]">
                            Free
                          </span>
                        )}
                        <span className="text-[#c9a96e] opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1">
                          →
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
