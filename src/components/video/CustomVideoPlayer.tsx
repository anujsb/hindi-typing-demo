"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { markVideoCompleted } from "@/actions/learning"

export default function CustomVideoPlayer({ videoId, title, isCompletedInitially }: { videoId: string, title: string, isCompletedInitially: boolean }) {
  const router = useRouter()
  const [isCompleted, setIsCompleted] = useState(isCompletedInitially)
  const [progress, setProgress] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [saving, setSaving] = useState(false)
  
  // Simulated Video length of 15 seconds for demonstration
  const DURATION = 15; 

  useEffect(() => {
    if (isPlaying && progress < DURATION) {
      const timer = setInterval(() => {
        setProgress(prev => {
          if (prev + 1 >= DURATION) {
            handleComplete()
            return DURATION
          }
          return prev + 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [isPlaying, progress])

  async function handleComplete() {
    setIsPlaying(false)
    if (!isCompleted) {
      setSaving(true)
      await markVideoCompleted(videoId)
      setIsCompleted(true)
      setSaving(false)
      router.refresh()
    }
  }

  return (
    <div className="bg-[#1c1810] rounded-3xl overflow-hidden shadow-2xl border-4 border-[#332b1e]">
      {/* Simulated Video Screen */}
      <div className="aspect-video bg-[#0f0d09] flex flex-col items-center justify-center relative">
        {!isPlaying && progress < DURATION && (
          <button 
            onClick={() => setIsPlaying(true)}
            className="w-20 h-20 bg-[#c9a96e] hover:bg-[#b5955a] hover:scale-105 transition-transform rounded-full flex items-center justify-center shadow-lg z-10"
          >
            <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-white border-b-[12px] border-b-transparent ml-2" />
          </button>
        )}

        {isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-tr from-[#c9a96e20] to-transparent">
             <span className="text-white text-2xl font-serif opacity-50 tracking-widest animate-pulse">
               Playing: {title}
             </span>
          </div>
        )}

        {progress >= DURATION && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1c1810]/90 z-10">
            <span className="text-[#c9a96e] text-5xl mb-4">✓</span>
            <span className="text-white text-xl font-bold tracking-wide">Tutorial Completed</span>
            {saving && <span className="text-[#a0896a] text-sm mt-2">Saving progress...</span>}
          </div>
        )}
      </div>

      {/* Custom Controls (Non-skippable if not completed) */}
      <div className="px-6 py-4 bg-[#262015] flex flex-col gap-3">
        <div className="h-2 w-full bg-[#1c1810] rounded-full overflow-hidden relative">
          <div 
            className="h-full bg-[#c9a96e] transition-all duration-1000 ease-linear"
            style={{ width: `${(progress / DURATION) * 100}%` }}
          />
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-[#a0896a] font-mono text-sm">
            0:{progress.toString().padStart(2, '0')} / 0:{DURATION.toString().padStart(2, '0')}
          </div>
          
          <div className="flex gap-4">
            {isCompleted && (
              <button 
                onClick={() => { setProgress(0); setIsPlaying(true); }}
                className="text-xs font-bold text-[#c9a96e] uppercase tracking-wider hover:text-white transition-colors"
              >
                Replay Video
              </button>
            )}
            {!isCompleted && progress < DURATION && (
               <span className="text-xs font-mono text-[#7a6344] uppercase tracking-wider">
                 Skipping Disabled
               </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
