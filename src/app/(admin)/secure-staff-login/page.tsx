"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export default function SecureAdminLogin() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams?.get("callbackUrl") || "/admin"
  
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")
    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      })

      if (result?.error) {
        setError("Invalid secure credentials.")
      } else if (result?.ok) {
        // Will be checked by the layout to ensure they are an ADMIN. If they aren't, they will bounce.
        router.push(callbackUrl)
        router.refresh()
      }
    } catch (err) {
      setError("An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#14110a] p-4 font-[Georgia,serif]">
      <div className="w-full max-w-md space-y-8 rounded-3xl bg-[#1c1810] p-10 shadow-2xl border border-[#332b1e]">
        <div className="text-center">
          <p className="mb-2.5 font-mono text-red-500 font-bold text-xs uppercase tracking-[0.2em]">Restricted Access</p>
          <h2 className="text-3xl font-bold tracking-tight text-[#faf7f2]">Admin Gateway</h2>
          <div className="bg-[#c9a96e] mx-auto mt-4 rounded-sm w-12 h-0.5" />
        </div>

        <form onSubmit={onSubmit} className="mt-8 space-y-6 font-sans">
          {error && <div className="rounded-xl bg-red-950 p-4 text-sm text-red-400 border border-red-900">{error}</div>}
          
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#a0896a]">Admin Email</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                required 
                className="!bg-[#262015] !border-[#332b1e] !text-white focus-visible:ring-[#c9a96e]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#a0896a]">Password</Label>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                required 
                className="!bg-[#262015] !border-[#332b1e] !text-white focus-visible:ring-[#c9a96e]"
              />
            </div>
            
            {/* Future Phase: OTP Input would go here */}
          </div>

          <Button type="submit" className="w-full mt-8 bg-[#c9a96e] hover:bg-[#b5955a] text-white" disabled={loading}>
            {loading ? "Authenticating..." : "Secure Login"}
          </Button>
        </form>
      </div>
    </div>
  )
}
