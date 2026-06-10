import { db } from "@/lib/db"
import { videoTutorials } from "@/lib/schema"
import VideoForm from "@/components/admin/VideoForm"
import DeleteButton from "@/components/admin/DeleteButton"
import Link from "next/link"

export default async function AdminVideos() {
  const existingVideos = await db.select().from(videoTutorials).orderBy(videoTutorials.day)

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <header>
        <h2 className="text-3xl font-serif font-bold text-[#faf7f2]">Manage Learning Module</h2>
        <p className="text-[#a0896a] mt-2 font-sans">Upload Video URLs and assign the quick Practice Test text for each day.</p>
      </header>

      <VideoForm />

      <div className="mt-12 bg-[#262015] rounded-2xl border border-[#332b1e] overflow-hidden">
        <table className="w-full text-left font-sans text-sm">
          <thead className="bg-[#1c1810] text-[#a0896a] uppercase tracking-wider text-xs border-b border-[#332b1e]">
            <tr>
              <th className="px-6 py-4 font-semibold">Day</th>
              <th className="px-6 py-4 font-semibold">Title</th>
              <th className="px-6 py-4 font-semibold">Lang / Layout</th>
              <th className="px-6 py-4 font-semibold">Premium</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#332b1e] text-white">
            {existingVideos.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-[#7a6344]">No learning videos found.</td>
              </tr>
            ) : (
              existingVideos.map(vid => (
                <tr key={vid.id} className="hover:bg-[#1c1810]/50">
                  <td className="px-6 py-4 font-mono">Day {vid.day}</td>
                  <td className="px-6 py-4 font-bold">{vid.title}</td>
                  <td className="px-6 py-4 text-xs text-[#a0896a]">{vid.language} • {vid.layout}</td>
                  <td className="px-6 py-4">
                    {vid.isPremium ? <span className="text-[#c9a96e]">Yes</span> : <span className="text-[#7a6344]">No</span>}
                  </td>
                  <td className="px-6 py-4 text-right space-x-4">
                    <Link href={`/admin/learning-module/${vid.id}`} className="text-[#a0896a] hover:text-white transition-colors font-semibold">
                      Edit
                    </Link>
                    <DeleteButton id={vid.id} type="video" />
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
