import { db } from "@/lib/db"
import { videoTutorials, users } from "@/lib/schema"
import { eq } from "drizzle-orm"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import TypingEngine from "@/components/typing/TypingEngine"

export default async function LearningPracticePage({ params }: { params: Promise<{ language: string, layout: string, dayId: string }> }) {
  const resolvedParams = await params;
  const session = await auth()
  
  if (!session?.user?.email) {
    redirect("/login")
  }

  const userArray = await db.select().from(users).where(eq(users.email, session.user.email))
  const user = userArray[0]

  if (!user) {
    redirect("/login")
  }

  const videoArray = await db.select().from(videoTutorials).where(eq(videoTutorials.id, resolvedParams.dayId))
  const video = videoArray[0]

  if (!video) {
    return <div className="p-8 text-center">Video not found.</div>
  }

  if (!video.practiceTestContent) {
    return <div className="p-8 text-center text-[#a0896a]">No practice test assigned for this day.</div>
  }

  return (
    <TypingEngine 
      targetId={video.id}
      targetContent={video.practiceTestContent}
      isTrial={user.subscriptionStatus === "TRIAL"}
      layoutName={video.layout}
      language={video.language}
      mode="LEARNING"
      onLearningCompletePath={`/learning/${resolvedParams.language}/${resolvedParams.layout}`}
    />
  )
}
