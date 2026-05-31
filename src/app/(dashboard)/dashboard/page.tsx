import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { db } from "@/lib/db"
import { userExerciseProgress, users } from "@/lib/schema"
import { eq } from "drizzle-orm"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.email) redirect("/login")

  const userArray = await db.select().from(users).where(eq(users.email, session.user.email))
  const user = userArray[0]

  if (!user) redirect("/login")

  // Fetch recent progress
  const progress = await db.select().from(userExerciseProgress).where(eq(userExerciseProgress.userId, user.id)).limit(5)

  return (
    <div className="min-h-screen bg-[#faf7f2] font-[Georgia,serif] text-[#1c1810] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        <header>
          <p className="mb-2 font-mono text-[#a0896a] text-xs uppercase tracking-[0.18em]">Dashboard</p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#1c1810]">Welcome, {user.name}</h1>
          <p className="mt-3 text-[#7a6344] font-sans">
            Account Status: <span className="font-bold text-[#c9a96e] px-2 py-1 bg-[#fceecf] rounded-md text-xs uppercase tracking-wider">{user.subscriptionStatus}</span>
          </p>
          <div className="bg-[#c9a96e] mt-6 rounded-sm w-12 h-0.5" />
        </header>

        <div className="grid md:grid-cols-2 gap-8 font-sans">
          {/* Learning Module Card */}
          <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#e8dcc8] hover:border-[#c9a96e] transition-colors flex flex-col items-start group">
            <h2 className="text-2xl font-bold text-[#1c1810] mb-3">Learning Module</h2>
            <p className="text-[#7a6344] mb-8">Start from scratch with day-by-day video tutorials. Perfect for absolute beginners.</p>
            <Link href="/learning" className="mt-auto px-6 py-3 font-bold text-white bg-[#c9a96e] hover:bg-[#b5955a] rounded-xl shadow-[0_4px_14px_0_rgba(201,169,110,0.39)] group-hover:shadow-[0_6px_20px_rgba(201,169,110,0.23)] group-hover:-translate-y-0.5 transition-all">
              Start Learning
            </Link>
          </div>

          {/* Practice Module Card */}
          <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#e8dcc8] hover:border-[#c9a96e] transition-colors flex flex-col items-start group">
            <h2 className="text-2xl font-bold text-[#1c1810] mb-3">Practice Module</h2>
            <p className="text-[#7a6344] mb-8">Test your skills with various exercises and track your WPM and accuracy.</p>
            <Link href="/practice" className="mt-auto px-6 py-3 font-bold text-[#5a4a35] bg-[#faf7f2] border-[1.5px] border-[#e8dcc8] hover:border-[#c9a96e] rounded-xl shadow-sm group-hover:shadow-md group-hover:-translate-y-0.5 transition-all">
              Start Practicing
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
