"use client"

import { useState } from "react"
import { addExercise } from "@/actions/admin"
import { useRouter } from "next/navigation"

export default function ExerciseForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [textContent, setTextContent] = useState("")

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (event) => {
      const text = event.target?.result as string
      setTextContent(text)
    }
    reader.readAsText(file)
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")
    
    const formData = new FormData(e.currentTarget)
    
    const result = await addExercise({
      srNameDate: formData.get("srNameDate") as string,
      title: formData.get("title") as string,
      language: formData.get("language") as "ENGLISH" | "HINDI" | "MANGAL",
      layout: formData.get("layout") as "KURTIDEV_010" | "RAMINTON_GAIL" | "INSCRIPT" | "RAMINTON_GAIL_CBI",
      content: textContent,
      isPremium: formData.get("isPremium") === "on",
      orderIndex: parseInt(formData.get("orderIndex") as string, 10)
    })

    if (result.error) {
      setError(result.error)
    } else {
      setTextContent("")
      ;(e.target as HTMLFormElement).reset()
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <form onSubmit={onSubmit} className="bg-[#262015] p-6 rounded-2xl border border-[#332b1e] space-y-4 font-sans text-sm mt-6">
      <h3 className="text-xl font-bold text-[#faf7f2] mb-4">Add Practice Exercise</h3>
      {error && <div className="p-3 bg-red-900/50 text-red-300 rounded border border-red-800">{error}</div>}
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[#a0896a]">SR_NAME_DATE (Unique)</label>
          <input required name="srNameDate" placeholder="001_Example_290526" className="w-full bg-[#1c1810] border-[#332b1e] rounded px-3 py-2 text-white" />
        </div>
        <div className="space-y-1">
          <label className="text-[#a0896a]">Display Title</label>
          <input required name="title" placeholder="The Quick Brown Fox" className="w-full bg-[#1c1810] border-[#332b1e] rounded px-3 py-2 text-white" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[#a0896a]">Language</label>
          <select required name="language" className="w-full bg-[#1c1810] border-[#332b1e] rounded px-3 py-2 text-white">
            <option value="ENGLISH">English</option>
            <option value="HINDI">Hindi (Legacy)</option>
            <option value="MANGAL">Mangal (Unicode)</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[#a0896a]">Layout</label>
          <select required name="layout" className="w-full bg-[#1c1810] border-[#332b1e] rounded px-3 py-2 text-white">
            <option value="KURTIDEV_010">KrutiDev 010</option>
            <option value="RAMINTON_GAIL">Remington Gail</option>
            <option value="INSCRIPT">Inscript</option>
            <option value="RAMINTON_GAIL_CBI">Remington Gail CBI</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[#a0896a]">Order Index (Sequence)</label>
          <input required type="number" name="orderIndex" defaultValue="1" className="w-full bg-[#1c1810] border-[#332b1e] rounded px-3 py-2 text-white" />
        </div>
        <div className="flex items-center space-x-2 pt-6">
          <input type="checkbox" id="isPremium" name="isPremium" className="w-4 h-4 rounded bg-[#1c1810] border-[#332b1e] accent-[#c9a96e]" />
          <label htmlFor="isPremium" className="text-[#a0896a]">Is Premium (Requires Subscription)</label>
        </div>
      </div>

      <div className="space-y-2 border-t border-[#332b1e] pt-4 mt-4">
        <label className="text-[#a0896a] font-bold">Typing Passage Content</label>
        <div className="flex items-center justify-between text-xs text-[#7a6344]">
          <span>Type/Paste manually OR upload a .txt file</span>
          <input 
            type="file" 
            accept=".txt" 
            onChange={handleFileUpload} 
            className="text-xs file:bg-[#332b1e] file:border-0 file:rounded file:px-2 file:py-1 file:text-[#a0896a] file:cursor-pointer"
          />
        </div>
        <textarea 
          required 
          value={textContent}
          onChange={(e) => setTextContent(e.target.value)}
          placeholder="Paste the passage here..." 
          className="w-full h-32 bg-[#1c1810] border-[#332b1e] rounded px-3 py-2 text-white resize-y font-mono" 
        />
      </div>

      <button disabled={loading} type="submit" className="w-full py-3 bg-[#c9a96e] text-white rounded font-bold hover:bg-[#b5955a] transition-colors">
        {loading ? "Saving..." : "Save Practice Exercise"}
      </button>
    </form>
  )
}
