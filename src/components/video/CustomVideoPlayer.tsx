"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import ReactPlayer from "react-player"
import Link from "next/link"

const formatTime = (seconds: number) => {
  if (isNaN(seconds)) return "00:00"
  const date = new Date(seconds * 1000)
  const hh = date.getUTCHours()
  const mm = date.getUTCMinutes()
  const ss = date.getUTCSeconds().toString().padStart(2, '0')
  if (hh) {
    return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`
  }
  return `${mm.toString().padStart(2, '0')}:${ss}`
}

const Player = ReactPlayer as any;

export default function CustomVideoPlayer({ 
  videoId, 
  title, 
  videoUrl,
  language,
  layout,
  isCompletedInitially 
}: { 
  videoId: string, 
  title: string, 
  videoUrl: string,
  language: string,
  layout: string,
  isCompletedInitially: boolean 
}) {
  const router = useRouter()
  const [hasWatched, setHasWatched] = useState(isCompletedInitially)
  const [isClient, setIsClient] = useState(false)
  
  // Custom Player State
  const [playing, setPlaying] = useState(false)
  const [played, setPlayed] = useState(0)
  const [maxPlayed, setMaxPlayed] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showControls, setShowControls] = useState(true)
  
  const playerRef = useRef<any>(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  function handleComplete() {
    if (!hasWatched) {
      setHasWatched(true)
    }
  }

  const handleProgress = (state: { played: number, playedSeconds: number }) => {
    setPlayed(state.played)
    // Update maxPlayed if they are watching for the first time
    if (!hasWatched && state.played > maxPlayed) {
      // Don't let maxPlayed jump massively (prevents edge cases)
      if (state.played - maxPlayed < 0.05) {
        setMaxPlayed(state.played)
      }
    }
  }

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value)
    
    // Prevent skipping forward if not completely watched
    if (!hasWatched && newValue > maxPlayed) {
      return
    }
    
    setPlayed(newValue)
    playerRef.current?.seekTo(newValue)
  }

  const togglePlayPause = () => {
    setPlaying(!playing)
  }

  return (
    <div className="space-y-6">
      <div 
        className="bg-[#1c1810] rounded-3xl overflow-hidden shadow-2xl border-4 border-[#332b1e] relative group"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => playing && setShowControls(false)}
      >
        <div className="aspect-video bg-[#0f0d09] flex flex-col items-center justify-center relative" onClick={togglePlayPause}>
          {isClient && (
            <Player 
              ref={playerRef}
              url={videoUrl}
              width="100%"
              height="100%"
              controls={false}
              playing={playing}
              onEnded={handleComplete}
              onProgress={handleProgress}
              onDuration={setDuration}
              config={{
                youtube: {
                  playerVars: { 
                    modestbranding: 1, 
                    rel: 0, 
                    disablekb: 1 
                  }
                }
              }}
            />
          )}
          
          {/* Overlay Play/Pause Button */}
          {!playing && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/20">
              <div className="w-20 h-20 bg-[#c9a96e]/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg transition-transform scale-100 group-hover:scale-110">
                <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-white border-b-[12px] border-b-transparent ml-2" />
              </div>
            </div>
          )}
        </div>
        
        {/* Custom Bottom Control Bar */}
        <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent px-6 py-4 pt-12 flex flex-col gap-3 transition-opacity duration-300 ${showControls || !playing ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          {/* Progress Bar (Range Input) */}
          <div className="relative group/slider flex items-center h-4 cursor-pointer">
            {/* Background Track */}
            <div className="absolute left-0 right-0 h-1.5 bg-white/20 rounded-full overflow-hidden">
              {/* Max Reached Track (Yellowish) */}
              {!hasWatched && (
                <div 
                  className="absolute top-0 bottom-0 left-0 bg-[#c9a96e]/30 transition-all duration-300 ease-linear"
                  style={{ width: `${maxPlayed * 100}%` }}
                />
              )}
              {/* Current Progress Track (Solid Gold) */}
              <div 
                className="absolute top-0 bottom-0 left-0 bg-[#c9a96e] transition-all duration-100 ease-linear"
                style={{ width: `${played * 100}%` }}
              />
            </div>
            {/* The Actual Range Input (Invisible, overlaid) */}
            <input
              type="range"
              min={0}
              max={0.999999}
              step="any"
              value={played}
              onChange={handleSeekChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
          
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-4">
              <button 
                onClick={togglePlayPause} 
                className="hover:text-[#c9a96e] transition-colors flex items-center justify-center w-8 h-8"
              >
                {playing ? (
                  <div className="flex gap-1 h-4">
                    <div className="w-1.5 bg-current h-full rounded-sm" />
                    <div className="w-1.5 bg-current h-full rounded-sm" />
                  </div>
                ) : (
                  <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-current border-b-[8px] border-b-transparent ml-1" />
                )}
              </button>
              <div className="font-mono text-sm tracking-wide opacity-90">
                {formatTime(played * duration)} <span className="opacity-50 mx-1">/</span> {formatTime(duration)}
              </div>
            </div>
            
            <div className="text-[#c9a96e] font-mono text-xs tracking-widest font-bold uppercase bg-[#c9a96e]/10 px-3 py-1 rounded-full border border-[#c9a96e]/20">
              {hasWatched ? "UNLOCKED" : "NO SKIPPING"}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        {!hasWatched ? (
          <button disabled className="px-8 py-4 bg-[#332b1e] text-[#7a6344] font-bold rounded-xl cursor-not-allowed border border-[#332b1e] flex items-center gap-2">
            🔒 Practice Test Locked
          </button>
        ) : (
          <Link 
            href={`/learning/${language}/${layout}/video/${videoId}/practice`}
            className="px-8 py-4 bg-[#c9a96e] text-white font-bold rounded-xl shadow-lg hover:bg-[#b5955a] transition-all flex items-center gap-2"
          >
            Start Practice Test →
          </Link>
        )}
      </div>
    </div>
  )
}
