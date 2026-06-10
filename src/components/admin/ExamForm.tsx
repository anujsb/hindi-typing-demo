"use client"

import { useState } from "react"
import { addExam } from "@/actions/admin"
import { useRouter } from "next/navigation"

export default function ExamForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")
    
    const formData = new FormData(e.currentTarget)
    
    const result = await addExam({
      name: formData.get("name") as string,
      isActive: formData.get("isActive") === "on",
    })

    if (result.error) {
      setError(result.error)
    } else {
      ;(e.target as HTMLFormElement).reset()
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <form onSubmit={onSubmit} className="bg-[#262015] p-6 rounded-2xl border border-[#332b1e] space-y-4 font-sans text-sm mt-6">
      <h3 className="text-xl font-bold text-[#faf7f2] mb-4">Add New Exam Category</h3>
      {error && <div className="p-3 bg-red-900/50 text-red-300 rounded border border-red-800">{error}</div>}
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[#a0896a]">Exam Name (e.g. UPSSSC, SSC)</label>
          <input required name="name" placeholder="SSC CGL 2026" className="w-full bg-[#1c1810] border-[#332b1e] rounded px-3 py-2 text-white" />
        </div>
        <div className="flex items-center space-x-2 pt-6 pl-4">
          <input type="checkbox" id="isActive" name="isActive" defaultChecked className="w-4 h-4 rounded bg-[#1c1810] border-[#332b1e] accent-[#c9a96e]" />
          <label htmlFor="isActive" className="text-[#a0896a]">Is Active (Shows in Registration Dropdown)</label>
        </div>
      </div>

      <button disabled={loading} type="submit" className="w-full py-3 bg-[#c9a96e] text-white rounded font-bold hover:bg-[#b5955a] transition-colors mt-2">
        {loading ? "Saving..." : "Save Exam"}
      </button>
    </form>
  )
}
