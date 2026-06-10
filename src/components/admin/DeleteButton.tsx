"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { deleteVideo, deleteExercise } from "@/actions/admin"

export default function DeleteButton({ id, type }: { id: string, type: "video" | "exercise" }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this? This action cannot be undone.")) return
    
    setLoading(true)
    if (type === "video") {
      await deleteVideo(id)
    } else {
      await deleteExercise(id)
    }
    setLoading(false)
    router.refresh()
  }

  return (
    <button 
      onClick={handleDelete}
      disabled={loading}
      className="text-red-400 hover:text-red-300 transition-colors font-semibold disabled:opacity-50"
    >
      {loading ? "..." : "Delete"}
    </button>
  )
}
