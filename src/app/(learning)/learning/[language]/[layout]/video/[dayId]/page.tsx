import { db } from "@/lib/db"
import { videoTutorials, users, userVideoProgress } from "@/lib/schema"
import { eq } from "drizzle-orm"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import CustomVideoPlayer from "@/components/video/CustomVideoPlayer"

export default async function VideoPage({ params }: { params: Promise<{ language: string, layout: string, dayId: string }> }) {
  const resolvedParams = await params;
  const session = await auth()
  if (!session?.user?.email) redirect("/login")

  const userArray = await db.select().from(users).where(eq(users.email, session.user.email))
  const user = userArray[0]
  if (!user) redirect("/login")

  const videoArray = await db.select().from(videoTutorials).where(eq(videoTutorials.id, resolvedParams.dayId))
  const video = videoArray[0]

  if (!video) return <div className="p-8 text-center">Video not found.</div>

  // Enforce Premium Access
  if (video.isPremium && user.subscriptionStatus === "TRIAL") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf7f2] font-sans">
        <div className="bg-white p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#e8dcc8] max-w-md text-center">
           <div className="text-5xl mb-4">👑</div>
           <h2 className="text-2xl font-bold text-[#1c1810] mb-4">Premium Content Locked</h2>
           <p className="text-[#7a6344] mb-8 leading-relaxed">Day {video.day} and beyond are exclusive to premium members. Upgrade your account to unlock advanced tutorials and exercises.</p>
           <Link href="/subscription" className="block w-full bg-[#c9a96e] text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-[#b5955a] transition-colors">
             View Premium Plans
           </Link>
           <Link href={`/learning/${resolvedParams.language}/${resolvedParams.layout}`} className="block mt-4 text-sm font-bold text-[#a0896a] hover:text-[#1c1810] transition-colors">
             Go Back
           </Link>
        </div>
      </div>
    )
  }

  // Check if previously completed
  const progressArray = await db.select().from(userVideoProgress).where(
    eq(userVideoProgress.userId, user.id)
  )
  const isCompleted = progressArray.some(p => p.videoId === video.id && p.completed)

  return (
    <div className="min-h-screen bg-[#faf7f2] py-12 px-4 sm:px-6 lg:px-8 font-[Georgia,serif]">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <Link href={`/learning/${resolvedParams.language}/${resolvedParams.layout}`} className="inline-flex items-center gap-2 text-sm font-bold font-sans text-[#a0896a] hover:text-[#c9a96e] transition-colors">
          <span>←</span> Back to Curriculum
        </Link>

        <header>
          <p className="mb-2 font-mono text-[#c9a96e] text-sm uppercase tracking-[0.2em] font-bold">
            Day {video.day} Tutorial
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-[#1c1810] mb-3">
            {video.title}
          </h1>
          <p className="text-[#7a6344] font-sans text-lg max-w-3xl">
            {video.description}
          </p>
        </header>

        <div className="mt-8">
           <CustomVideoPlayer 
             videoId={video.id} 
             title={video.title}
             videoUrl={video.videoUrl}
             language={resolvedParams.language}
             layout={resolvedParams.layout}
             isCompletedInitially={isCompleted} 
           />
        </div>

      </div>
    </div>
  )
}
