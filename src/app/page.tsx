import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#faf7f2] font-[Georgia,serif] text-[#1c1810]">
      {/* Navigation Bar */}
      <nav className="flex justify-between items-center py-6 px-8 max-w-6xl mx-auto">
        <div className="font-bold text-2xl tracking-tight text-[#1c1810]">
          हिंदी Typing
        </div>
        <div className="space-x-4 font-sans">
          <Link href="/demo" className="text-sm font-semibold text-[#a0896a] hover:text-[#c9a96e] transition-colors">
            Try Demo
          </Link>
          <Link href="/login" className="text-sm font-semibold text-[#7a6344] hover:text-[#c9a96e] transition-colors">
            Sign In
          </Link>
          <Link href="/register" className="px-5 py-2 text-sm font-bold text-white bg-[#1c1810] hover:bg-[#332b1e] rounded-full transition-colors shadow-sm">
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center text-center px-4 pt-24 pb-32">
        <p className="mb-4 font-mono text-[#a0896a] text-sm uppercase tracking-[0.2em] font-semibold">
          The Ultimate Typing Software
        </p>
        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-[#1c1810] max-w-4xl leading-tight">
          Master Hindi Typing for <span className="text-[#c9a96e]">Government Exams</span>
        </h1>
        <p className="mt-6 text-xl text-[#7a6344] max-w-2xl font-sans">
          Learn and practice Kruti Dev 010, Mangal Inscript, and Remington Gail layouts with our interactive tutorials and real-time analytics.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 font-sans">
          <Link 
            href="/practice" 
            className="px-8 py-4 text-base font-bold text-white bg-[#c9a96e] hover:bg-[#b5955a] rounded-xl shadow-[0_4px_14px_0_rgba(201,169,110,0.39)] hover:shadow-[0_6px_20px_rgba(201,169,110,0.23)] hover:-translate-y-0.5 transition-all"
          >
            Start Free Trial
          </Link>
          <Link 
            href="/subscription" 
            className="px-8 py-4 text-base font-bold text-[#5a4a35] bg-white border-[1.5px] border-[#e8dcc8] hover:border-[#c9a96e] rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            View Premium Plans
          </Link>
        </div>
      </main>

      {/* Feature Section */}
      <section className="bg-white border-t border-[#e8dcc8] py-24 font-sans">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold text-center text-[#1c1810] mb-16">
            Everything you need to succeed
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-[#faf7f2] border border-[#e8dcc8] hover:border-[#c9a96e] transition-colors">
              <h3 className="text-xl font-bold text-[#1c1810] mb-3">Structured Learning</h3>
              <p className="text-[#7a6344]">Day-by-day video tutorials starting from the home row all the way to advanced paragraphs.</p>
            </div>
            <div className="p-8 rounded-3xl bg-[#faf7f2] border border-[#e8dcc8] hover:border-[#c9a96e] transition-colors">
              <h3 className="text-xl font-bold text-[#1c1810] mb-3">Multiple Layouts</h3>
              <p className="text-[#7a6344]">Practice on the exact layouts required for UPSSSC, SSC, and other state-level exams.</p>
            </div>
            <div className="p-8 rounded-3xl bg-[#faf7f2] border border-[#e8dcc8] hover:border-[#c9a96e] transition-colors">
              <h3 className="text-xl font-bold text-[#1c1810] mb-3">Real-time Analytics</h3>
              <p className="text-[#7a6344]">Track your Words Per Minute (WPM) and accuracy to see your progression over time.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}