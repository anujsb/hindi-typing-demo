import { db } from "@/lib/db"
import { exercises, videoTutorials } from "@/lib/schema"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    await db.insert(exercises).values({
      srNameDate: "001_Demo_Exercise_" + Date.now(),
      title: "Demo Hindi Typing Passage",
      language: "HINDI",
      layout: "KURTIDEV_010",
      content: "यह एक उदाहरण है कि हिंदी टाइपिंग कैसे की जाती है।",
      isPremium: false,
      orderIndex: 1
    })

    await db.insert(videoTutorials).values({
      day: 1,
      title: "Day 1: Home-Row Introduction",
      description: "Learn the home row keys for KrutiDev 010.",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      language: "HINDI",
      layout: "KURTIDEV_010",
      isPremium: false
    })
    
    return NextResponse.json({ success: true, message: "Demo data seeded!" })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message })
  }
}
