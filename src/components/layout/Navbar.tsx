import Link from "next/link"
import { auth, signOut } from "@/lib/auth"

export default async function Navbar() {
  const session = await auth()
  if (!session?.user) return null

  return (
    <nav className="bg-white border-b border-[#e8dcc8] sticky top-0 z-50 font-sans shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="font-serif font-bold text-xl text-[#1c1810]">
              हिंदी Typing
            </Link>
            <div className="hidden sm:flex gap-6">
              <Link href="/dashboard" className="text-sm font-semibold text-[#7a6344] hover:text-[#c9a96e] transition-colors">Dashboard</Link>
              <Link href="/learning" className="text-sm font-semibold text-[#7a6344] hover:text-[#c9a96e] transition-colors">Learning Module</Link>
              <Link href="/practice" className="text-sm font-semibold text-[#7a6344] hover:text-[#c9a96e] transition-colors">Exams</Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-[#1c1810] hidden sm:block">
              {session.user.name || session.user.email}
            </span>
            <form action={async () => {
              "use server"
              await signOut({ redirectTo: "/login" })
            }}>
              <button type="submit" className="text-sm font-semibold text-[#a0896a] hover:text-[#c9a96e] transition-colors">
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </div>
    </nav>
  )
}
