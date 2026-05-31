import { db } from "../src/lib/db"
import { exercises, videoTutorials } from "../src/lib/schema"

async function main() {
  console.log("Seeding demo exercise and video...")
  
  try {
    await db.insert(exercises).values({
      srNameDate: "001_Demo_Exercise_" + Date.now(),
      title: "Demo Hindi Typing Passage",
      language: "HINDI",
      layout: "KURTIDEV_010",
      content: "यह एक उदाहरण है कि हिंदी टाइपिंग कैसे की जाती है। अभ्यास करते रहें।",
      isPremium: false,
      orderIndex: 1
    })

    await db.insert(videoTutorials).values({
      day: 1,
      title: "Day 1: Home-Row Introduction",
      description: "Learn the home row keys for KrutiDev 010.",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Demo YouTube URL
      language: "HINDI",
      layout: "KURTIDEV_010",
      isPremium: false
    })
    
    console.log("Demo data successfully added!")
  } catch (e) {
    console.error("Error seeding data:", e)
  }
  process.exit(0)
}

main()
