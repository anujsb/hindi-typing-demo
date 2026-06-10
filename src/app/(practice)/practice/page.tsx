import Link from "next/link"

const languages = [
  { id: "ENGLISH", name: "English", desc: "Standard English Layout", layouts: ["STANDARD"] },
  { id: "HINDI", name: "Hindi (Krutidev)", desc: "Legacy Typing Font", layouts: ["KURTIDEV_010"] },
  { id: "MANGAL", name: "Mangal Unicode", desc: "Standard Government Exams", layouts: ["RAMINTON_GAIL", "INSCRIPT", "RAMINTON_GAIL_CBI"] }
]

export default function PracticeLanguageSelection() {
  return (
    <div className="min-h-screen bg-[#faf7f2] py-16 px-4 sm:px-6 lg:px-8 font-[Georgia,serif]">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="text-center">
          <p className="mb-2.5 font-mono text-[#a0896a] text-xs uppercase tracking-[0.18em]">Curriculum</p>
          <h1 className="text-4xl font-bold tracking-tight text-[#1c1810]">Select Language</h1>
          <div className="bg-[#c9a96e] mx-auto mt-5 rounded-sm w-12 h-0.5" />
        </header>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 font-sans">
          {languages.map((lang) => (
            <div key={lang.id} className="bg-white group overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#e8dcc8] hover:border-[#c9a96e] transition-all rounded-3xl flex flex-col hover:-translate-y-1 hover:shadow-[0_15px_40px_rgb(0,0,0,0.08)]">
              <div className="px-6 py-6 border-b border-[#f0e9dc] bg-[#fdfbf7]">
                <h3 className="text-xl font-bold text-[#1c1810] tracking-tight">{lang.name}</h3>
                <p className="text-sm text-[#a0896a] mt-1">{lang.desc}</p>
              </div>
              <div className="px-6 py-6 space-y-3 flex-1 flex flex-col justify-center">
                {lang.layouts.map((layout) => (
                  <Link 
                    key={layout}
                    href={`/practice/${lang.id.toLowerCase()}/${layout.toLowerCase()}`}
                    className="block w-full text-center px-4 py-3 border-[1.5px] border-[#e0d3bc] text-[#7a6344] rounded-xl hover:bg-[#c9a96e] hover:border-[#c9a96e] hover:text-white transition-all text-sm font-bold tracking-wide"
                  >
                    {layout.replace(/_/g, " ")}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
