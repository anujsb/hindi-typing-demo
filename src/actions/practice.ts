"use server"

import { db } from "@/lib/db"
import { userExerciseProgress } from "@/lib/schema"
import { auth } from "@/lib/auth"

export async function saveExerciseProgress(data: { exerciseId: string; wpm: number; accuracy: number; timeTaken: number }) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  try {
    await db.insert(userExerciseProgress).values({
      userId: session.user.id,
      exerciseId: data.exerciseId,
      wpm: data.wpm,
      accuracy: data.accuracy,
      timeTaken: data.timeTaken,
    })
    return { success: true }
  } catch (error) {
    console.error("Failed to save progress:", error)
    return { error: "Failed to save progress" }
  }
}
