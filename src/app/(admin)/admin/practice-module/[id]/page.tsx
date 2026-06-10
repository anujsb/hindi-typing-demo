import { db } from "@/lib/db"
import { exercises } from "@/lib/schema"
import { eq } from "drizzle-orm"
import ExerciseForm from "@/components/admin/ExerciseForm"
import { notFound } from "next/navigation"

export default async function EditExercise({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const exercise = await db.select().from(exercises).where(eq(exercises.id, resolvedParams.id))
  
  if (!exercise[0]) return notFound()

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <header>
        <h2 className="text-3xl font-serif font-bold text-[#faf7f2]">Edit Exam</h2>
        <p className="text-[#a0896a] mt-2 font-sans">Update details for Exam {exercise[0].orderIndex}.</p>
      </header>

      <ExerciseForm initialData={exercise[0]} />
    </div>
  )
}
