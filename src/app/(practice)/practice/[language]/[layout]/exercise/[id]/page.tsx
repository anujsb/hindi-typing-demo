import { db } from "@/lib/db"
import { exercises, users } from "@/lib/schema"
import { eq } from "drizzle-orm"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import TypingEngine from "@/components/typing/TypingEngine"

export default async function ExercisePage({ params }: { params: Promise<{ language: string, layout: string, id: string }> }) {
  const resolvedParams = await params;
  const session = await auth()
  
  if (!session?.user?.email) {
    redirect("/login")
  }

  // Fetch User to determine trial/premium
  const userArray = await db.select().from(users).where(eq(users.email, session.user.email))
  const user = userArray[0]

  if (!user) {
    redirect("/login")
  }

  // Fetch Exercise
  const exerciseArray = await db.select().from(exercises).where(eq(exercises.id, resolvedParams.id))
  const exercise = exerciseArray[0]

  if (!exercise) {
    return <div className="p-8 text-center">Exercise not found.</div>
  }

  // Enforce Premium Access
  if (exercise.isPremium && user.subscriptionStatus === "TRIAL") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow max-w-md text-center">
           <h2 className="text-2xl font-bold text-gray-900 mb-4">Premium Content</h2>
           <p className="text-gray-600 mb-6">This exercise requires a premium subscription.</p>
           <a href="/subscription" className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium">Upgrade to Premium</a>
        </div>
      </div>
    )
  }

  return (
    <TypingEngine 
      exerciseId={exercise.id}
      targetContent={exercise.content}
      isTrial={user.subscriptionStatus === "TRIAL"}
      layoutName={exercise.layout}
      language={exercise.language}
    />
  )
}
