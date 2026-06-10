"use client"

import { useState } from "react"
import { addVideo } from "@/actions/admin"
import { useRouter } from "next/navigation"

export default function VideoForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [language, setLanguage] = useState<"ENGLISH" | "HINDI" | "MANGAL">("ENGLISH")

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")
    
    const formData = new FormData(e.currentTarget)
    
    const result = await addVideo({
      day: parseInt(formData.get("day") as string, 10),
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      videoUrl: formData.get("videoUrl") as string,
      practiceTestContent: formData.get("practiceTestContent") as string,
      language: language,
      layout: language === "ENGLISH" ? "STANDARD" : (formData.get("layout") as "KURTIDEV_010" | "RAMINTON_GAIL" | "INSCRIPT" | "RAMINTON_GAIL_CBI" | "STANDARD"),
      isPremium: formData.get("isPremium") === "on",
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
    <form onSubmit={onSubmit} className="bg-[#262015] p-6 rounded-2xl border border-[#332b1e] space-y-6 font-sans text-sm mt-6">
      <h3 className="text-xl font-bold text-[#faf7f2] mb-4">Add Learning Day (Video + Practice Test)</h3>
      {error && <div className="p-3 bg-red-900/50 text-red-300 rounded border border-red-800">{error}</div>}
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[#a0896a]">Day Number</label>
          <input required type="number" name="day" placeholder="1" className="w-full bg-[#1c1810] border-[#332b1e] rounded px-3 py-2 text-white" />
        </div>
        <div className="space-y-1">
          <label className="text-[#a0896a]">Display Title</label>
          <input required name="title" placeholder="Home-Row Video Tutorial" className="w-full bg-[#1c1810] border-[#332b1e] rounded px-3 py-2 text-white" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[#a0896a]">Language</label>
          <select required name="language" value={language} onChange={(e) => setLanguage(e.target.value as any)} className="w-full bg-[#1c1810] border-[#332b1e] rounded px-3 py-2 text-white">
            <option value="ENGLISH">English</option>
            <option value="HINDI">Hindi (Legacy)</option>
            <option value="MANGAL">Mangal (Unicode)</option>
          </select>
        </div>
        
        {language !== "ENGLISH" && (
          <div className="space-y-1">
            <label className="text-[#a0896a]">Layout</label>
            <select required name="layout" className="w-full bg-[#1c1810] border-[#332b1e] rounded px-3 py-2 text-white">
              <option value="KURTIDEV_010">KrutiDev 010</option>
              <option value="RAMINTON_GAIL">Remington Gail</option>
              <option value="INSCRIPT">Inscript</option>
              <option value="RAMINTON_GAIL_CBI">Remington Gail CBI</option>
            </select>
          </div>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-[#a0896a]">Video URL (YouTube or Direct Link)</label>
        <input required name="videoUrl" placeholder="https://youtube.com/watch?v=..." className="w-full bg-[#1c1810] border-[#332b1e] rounded px-3 py-2 text-white" />
      </div>

      <div className="space-y-1">
        <label className="text-[#a0896a]">Description / Lesson Focus (Optional)</label>
        <textarea name="description" placeholder="Today we focus on the home row..." className="w-full bg-[#1c1810] border-[#332b1e] rounded px-3 py-2 text-white h-20" />
      </div>

      <div className="space-y-1">
        <label className="text-[#a0896a]">Practice Test Content (For post-video typing test)</label>
        <textarea required name="practiceTestContent" placeholder="Paste the exact Hindi passage they should type after the video..." className="w-full bg-[#1c1810] border-[#332b1e] rounded px-3 py-2 text-white h-32 font-serif" />
      </div>

      <div className="flex items-center space-x-2 pt-2">
        <input type="checkbox" id="isPremium" name="isPremium" className="w-4 h-4 rounded bg-[#1c1810] border-[#332b1e] accent-[#c9a96e]" />
        <label htmlFor="isPremium" className="text-[#a0896a]">Is Premium (Day 4 onwards usually)</label>
      </div>

      <button disabled={loading} type="submit" className="w-full mt-4 py-3 bg-[#c9a96e] text-white rounded font-bold hover:bg-[#b5955a] transition-colors">
        {loading ? "Saving..." : "Save Learning Exercise"}
      </button>
    </form>
  )
}
