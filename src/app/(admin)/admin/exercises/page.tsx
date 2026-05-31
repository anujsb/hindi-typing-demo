import { db } from "@/lib/db"
import { exercises } from "@/lib/schema"
import ExerciseForm from "@/components/admin/ExerciseForm"

export default async function AdminExercises() {
  const existingExercises = await db.select().from(exercises).orderBy(exercises.orderIndex)

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <header>
        <h2 className="text-3xl font-serif font-bold text-[#faf7f2]">Manage Practice Module</h2>
        <p className="text-[#a0896a] mt-2 font-sans">Add new typing passages or view existing ones.</p>
      </header>

      <ExerciseForm />

      <div className="mt-12 bg-[#262015] rounded-2xl border border-[#332b1e] overflow-hidden">
        <table className="w-full text-left font-sans text-sm">
          <thead className="bg-[#1c1810] text-[#a0896a] uppercase tracking-wider text-xs border-b border-[#332b1e]">
            <tr>
              <th className="px-6 py-4 font-semibold">Order</th>
              <th className="px-6 py-4 font-semibold">SR Name</th>
              <th className="px-6 py-4 font-semibold">Title</th>
              <th className="px-6 py-4 font-semibold">Lang / Layout</th>
              <th className="px-6 py-4 font-semibold">Premium</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#332b1e] text-white">
            {existingExercises.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-[#7a6344]">No exercises found.</td>
              </tr>
            ) : (
              existingExercises.map(ex => (
                <tr key={ex.id} className="hover:bg-[#1c1810]/50">
                  <td className="px-6 py-4">{ex.orderIndex}</td>
                  <td className="px-6 py-4 font-mono text-xs">{ex.srNameDate}</td>
                  <td className="px-6 py-4 font-bold">{ex.title}</td>
                  <td className="px-6 py-4 text-xs text-[#a0896a]">{ex.language} • {ex.layout}</td>
                  <td className="px-6 py-4">
                    {ex.isPremium ? <span className="text-[#c9a96e]">Yes</span> : <span className="text-[#7a6344]">No</span>}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
