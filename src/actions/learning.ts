"use server"

import { db } from "@/lib/db"
import { userVideoProgress } from "@/lib/schema"
import { auth } from "@/lib/auth"

export async function markVideoCompleted(videoId: string) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  try {
    await db.insert(userVideoProgress).values({
      userId: session.user.id,
      videoId,
      completed: true,
    }).onConflictDoUpdate({
      target: [userVideoProgress.userId, userVideoProgress.videoId],
      set: { completed: true }
    })
    return { success: true }
  } catch (error) {
    console.error("Failed to mark video completed:", error)
    return { error: "Failed to mark progress" }
  }
}
