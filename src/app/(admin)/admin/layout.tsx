import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { users } from "@/lib/schema"
import { eq } from "drizzle-orm"
import Link from "next/link"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user?.email) redirect("/secure-staff-login")

  const userArray = await db.select().from(users).where(eq(users.email, session.user.email))
  const user = userArray[0]

  // ACTIVE ROLE CHECK: Bounces anyone who isn't an ADMIN
  if (!user || user.role !== "ADMIN") {
    redirect("/dashboard") 
  }

  return (
    <div className="min-h-screen bg-[#1c1810] text-[#faf7f2] flex font-sans">
      {/* Admin Sidebar */}
      <aside className="w-64 border-r border-[#332b1e] p-6 flex flex-col bg-[#14110a]">
        <h1 className="text-xl font-serif font-bold text-[#c9a96e] mb-1">Hindi Typing</h1>
        <p className="text-xs uppercase tracking-[0.2em] text-[#7a6344] mb-10">Admin Portal</p>
        
        <nav className="space-y-2 flex-1">
          <Link href="/admin" className="block px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#332b1e] text-[#a0896a] hover:text-[#faf7f2] transition-colors">
            Dashboard
          </Link>
          <Link href="/admin/exercises" className="block px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#332b1e] text-[#a0896a] hover:text-[#faf7f2] transition-colors">
            Practice Module
          </Link>
          <Link href="/admin/videos" className="block px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#332b1e] text-[#a0896a] hover:text-[#faf7f2] transition-colors">
            Learning Module
          </Link>
          <Link href="/admin/exams" className="block px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#332b1e] text-[#a0896a] hover:text-[#faf7f2] transition-colors">
            Manage Exams
          </Link>
          <Link href="/admin/users" className="block px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#332b1e] text-[#a0896a] hover:text-[#faf7f2] transition-colors">
            User Accounts
          </Link>
        </nav>
        
        <div className="pt-8 border-t border-[#332b1e]">
          <p className="text-xs text-[#7a6344] mb-2">Logged in as:</p>
          <p className="text-sm font-bold text-[#c9a96e] truncate">{user.email}</p>
          <Link href="/dashboard" className="block mt-4 text-xs font-bold text-[#a0896a] hover:text-[#faf7f2] transition-colors">
            ← Back to App
          </Link>
        </div>
      </aside>
      
      {/* Admin Content Area */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}
