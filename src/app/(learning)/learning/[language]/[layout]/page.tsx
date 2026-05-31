import Link from "next/link"
import { db } from "@/lib/db"
import { videoTutorials, userVideoProgress, users } from "@/lib/schema"
import { eq, and } from "drizzle-orm"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function VideoList({ params }: { params: Promise<{ language: string, layout: string }> }) {
  const resolvedParams = await params;
  const session = await auth()
  if (!session?.user?.email) redirect("/login")

  const userArray = await db.select().from(users).where(eq(users.email, session.user.email))
  const user = userArray[0]
  if (!user) redirect("/login")

  const langUpper = resolvedParams.language.toUpperCase() as any;
  const layoutUpper = resolvedParams.layout.toUpperCase() as any;

  let videos: typeof videoTutorials.$inferSelect[] = [];
  try {
     videos = await db.select().from(videoTutorials).where(
      and(
        eq(videoTutorials.language, langUpper),
        eq(videoTutorials.layout, layoutUpper)
      )
    ).orderBy(videoTutorials.day)
  } catch (e) {
     console.error("DB error fetching videos", e);
  }

  const progress = await db.select().from(userVideoProgress).where(eq(userVideoProgress.userId, user.id))
  const completedVideoIds = new Set(progress.filter(p => p.completed).map(p => p.videoId))

  return (
    <div className="min-h-screen bg-[#faf7f2] py-16 px-4 sm:px-6 lg:px-8 font-[Georgia,serif]">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="text-center">
          <p className="mb-2.5 font-mono text-[#a0896a] text-xs uppercase tracking-[0.18em]">
            {langUpper} · {layoutUpper.replace(/_/g, " ")}
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-[#1c1810]">
            Video Curriculum
          </h1>
          <div className="bg-[#c9a96e] mx-auto mt-5 rounded-sm w-12 h-0.5" />
        </header>

        {videos.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#e8dcc8]">
             <p className="text-[#a0896a] font-sans">No tutorials available yet.</p>
          </div>
        ) : (
          <div className="grid gap-6 font-sans">
            {videos.map((video, idx) => {
              const isCompleted = completedVideoIds.has(video.id);
              const isUnlocked = idx === 0 || completedVideoIds.has(videos[idx - 1].id);
              const isPremiumLocked = video.isPremium && user.subscriptionStatus !== "PREMIUM";

              return (
                <div key={video.id} className={`bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-[#e8dcc8] overflow-hidden ${isUnlocked ? 'hover:border-[#c9a96e] transition-colors' : 'opacity-60 grayscale-[0.5]'}`}>
                  <div className="px-6 py-6 sm:px-8 flex items-center justify-between">
                    <div className="flex items-center gap-5">
                      <div className={`flex items-center justify-center w-14 h-14 rounded-2xl font-mono text-xl font-bold shrink-0 ${isCompleted ? 'bg-[#c9a96e] text-white' : 'bg-[#faf7f2] text-[#a0896a] border border-[#e8dcc8]'}`}>
                        {video.day}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-[#1c1810] flex items-center gap-2">
                          {video.title}
                          {isCompleted && <span className="text-[#c9a96e] text-sm">✓</span>}
                        </h3>
                        <p className="text-[#7a6344] text-sm mt-1">{video.description}</p>
                      </div>
                    </div>
                    
                    <div className="ml-4 shrink-0 flex flex-col items-end gap-2">
                      {video.isPremium && (
                        <span className="px-3 py-1 inline-flex text-[0.7rem] uppercase tracking-wider font-bold rounded-full bg-[#fceecf] text-[#b58b22]">
                          Premium
                        </span>
                      )}
                      
                      {!isUnlocked ? (
                        <span className="text-[#a0896a] text-sm font-semibold flex items-center gap-1">
                          🔒 Locked
                        </span>
                      ) : (
                        <Link 
                          href={`/learning/${resolvedParams.language}/${resolvedParams.layout}/video/${video.id}`}
                          className="px-6 py-2 bg-[#faf7f2] border border-[#e8dcc8] hover:border-[#c9a96e] hover:bg-[#c9a96e] hover:text-white transition-colors rounded-xl text-sm font-bold text-[#5a4a35]"
                        >
                          {isCompleted ? "Replay" : "Watch"}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
