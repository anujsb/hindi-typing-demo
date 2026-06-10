import { db } from "@/lib/db"
import { videoTutorials } from "@/lib/schema"
import { eq } from "drizzle-orm"
import VideoForm from "@/components/admin/VideoForm"
import { notFound } from "next/navigation"

export default async function EditVideo({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const video = await db.select().from(videoTutorials).where(eq(videoTutorials.id, resolvedParams.id))
  
  if (!video[0]) return notFound()

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <header>
        <h2 className="text-3xl font-serif font-bold text-[#faf7f2]">Edit Learning Module</h2>
        <p className="text-[#a0896a] mt-2 font-sans">Update details for Day {video[0].day}.</p>
      </header>

      <VideoForm initialData={video[0]} />
    </div>
  )
}
