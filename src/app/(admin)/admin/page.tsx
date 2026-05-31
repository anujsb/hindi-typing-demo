import { db } from "@/lib/db"
import { users, exercises, videoTutorials } from "@/lib/schema"

export default async function AdminDashboard() {
  const userCount = (await db.select().from(users)).length;
  const exerciseCount = (await db.select().from(exercises)).length;
  const videoCount = (await db.select().from(videoTutorials)).length;

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-serif font-bold text-[#faf7f2]">Overview</h2>
        <p className="text-[#a0896a] mt-2 font-sans">Welcome to the Hindi Typing administration portal.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
        <div className="bg-[#262015] p-6 rounded-2xl border border-[#332b1e]">
          <h3 className="text-[#a0896a] text-sm font-bold uppercase tracking-wider mb-2">Total Users</h3>
          <p className="text-4xl font-bold text-[#c9a96e]">{userCount}</p>
        </div>
        <div className="bg-[#262015] p-6 rounded-2xl border border-[#332b1e]">
          <h3 className="text-[#a0896a] text-sm font-bold uppercase tracking-wider mb-2">Practice Module</h3>
          <p className="text-4xl font-bold text-[#c9a96e]">{exerciseCount}</p>
        </div>
        <div className="bg-[#262015] p-6 rounded-2xl border border-[#332b1e]">
          <h3 className="text-[#a0896a] text-sm font-bold uppercase tracking-wider mb-2">Learning Module</h3>
          <p className="text-4xl font-bold text-[#c9a96e]">{videoCount}</p>
        </div>
      </div>
    </div>
  )
}
