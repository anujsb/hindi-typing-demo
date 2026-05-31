"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { registerUser } from "@/actions/auth"
import { INDIAN_STATES } from "@/lib/indianStates"

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [selectedState, setSelectedState] = useState("")

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")
    const formData = new FormData(e.currentTarget)
    
    try {
      const result = await registerUser(formData)
      if (result.error) {
        setError(result.error)
      } else {
        router.push("/login?registered=true")
      }
    } catch (err) {
      setError("An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#faf7f2] p-4 font-[Georgia,serif]">
      <div className="w-full max-w-lg space-y-8 rounded-3xl bg-white p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#e8dcc8]">
        <div className="text-center">
          <p className="mb-2.5 font-mono text-[#a0896a] text-xs uppercase tracking-[0.18em]">Join Us</p>
          <h2 className="text-3xl font-bold tracking-tight text-[#1c1810]">Create Account</h2>
          <div className="bg-[#c9a96e] mx-auto mt-4 rounded-sm w-12 h-0.5" />
        </div>

        <form onSubmit={onSubmit} className="mt-8 space-y-6 font-sans">
          {error && <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100">{error}</div>}
          
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input id="fullName" name="fullName" required placeholder="Aarav Sharma" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" name="email" type="email" required placeholder="aarav@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobileNumber">Mobile *</Label>
                <Input id="mobileNumber" name="mobileNumber" required placeholder="9876543210" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input id="password" name="password" type="password" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="examName">Target Exam</Label>
              <Input id="examName" name="examName" placeholder="e.g. UPSSSC, SSC (Optional)" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <select 
                  id="state" 
                  name="state" 
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-[#e8dcc8] bg-white px-3 py-2 text-sm text-[#1c1810] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a96e] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select State</option>
                  {Object.keys(INDIAN_STATES).map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="district">District</Label>
                <select 
                  id="district" 
                  name="district" 
                  disabled={!selectedState}
                  className="flex h-10 w-full rounded-md border border-[#e8dcc8] bg-white px-3 py-2 text-sm text-[#1c1810] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a96e] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select District</option>
                  {selectedState && INDIAN_STATES[selectedState]?.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full mt-8" disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </Button>
        </form>

        <p className="text-center text-sm text-[#7a6344] font-sans pt-4">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-[#c9a96e] hover:text-[#b5955a] transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
