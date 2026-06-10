"use server"

import { db } from "@/lib/db"
import { exercises, videoTutorials, users } from "@/lib/schema"
import { auth } from "@/lib/auth"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

async function requireAdmin() {
  const session = await auth()
  if (!session?.user?.email) throw new Error("Unauthorized")
  const user = await db.select().from(users).where(eq(users.email, session.user.email))
  if (!user[0] || user[0].role !== "ADMIN") throw new Error("Unauthorized")
}

export async function addExercise(data: {
  srNameDate: string;
  title: string;
  language: "ENGLISH" | "HINDI" | "MANGAL";
  layout: "KURTIDEV_010" | "RAMINTON_GAIL" | "INSCRIPT" | "RAMINTON_GAIL_CBI";
  content: string;
  isPremium: boolean;
  orderIndex: number;
}) {
  await requireAdmin()
  try {
    await db.insert(exercises).values(data)
    revalidatePath("/admin/exercises")
    // Revalidate frontend cache
    revalidatePath(`/practice/${data.language}/${data.layout}`)
    return { success: true }
  } catch (error: any) {
    return { error: error.message }
  }
}

export async function addVideo(data: {
  day: number;
  title: string;
  description: string;
  videoUrl: string;
  practiceTestContent: string;
  language: "ENGLISH" | "HINDI" | "MANGAL";
  layout: "KURTIDEV_010" | "RAMINTON_GAIL" | "INSCRIPT" | "RAMINTON_GAIL_CBI";
  isPremium: boolean;
}) {
  await requireAdmin()
  try {
    await db.insert(videoTutorials).values(data)
    revalidatePath("/admin/videos")
    revalidatePath(`/learning/${data.language}/${data.layout}`)
    return { success: true }
  } catch (error: any) {
    return { error: error.message }
  }
}
