"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const router = useRouter()
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
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid email or password")
      } else if (result?.ok) {
        router.push("/dashboard")
        router.refresh()
      }
    } catch (err) {
      setError("An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#faf7f2] p-4 font-[Georgia,serif]">
      <div className="w-full max-w-md space-y-8 rounded-3xl bg-white p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#e8dcc8]">
        <div className="text-center">
          <p className="mb-2.5 font-mono text-[#a0896a] text-xs uppercase tracking-[0.18em]">Welcome Back</p>
          <h2 className="text-3xl font-bold tracking-tight text-[#1c1810]">Sign In</h2>
          <div className="bg-[#c9a96e] mx-auto mt-4 rounded-sm w-12 h-0.5" />
        </div>

        <form onSubmit={onSubmit} className="mt-8 space-y-6 font-sans">
          {error && <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100">{error}</div>}
          
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" name="email" type="email" required placeholder="name@example.com" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-[0.8rem] font-semibold text-[#c9a96e] hover:text-[#b5955a] transition-colors">
                  Forgot password?
                </Link>
              </div>
              <Input id="password" name="password" type="password" required />
            </div>
          </div>

          <Button type="submit" className="w-full mt-8" disabled={loading}>
            {loading ? "Signing in..." : "Sign in to Dashboard"}
          </Button>
        </form>

        <p className="text-center text-sm text-[#7a6344] font-sans pt-4">
          Don't have an account?{" "}
          <Link href="/register" className="font-semibold text-[#c9a96e] hover:text-[#b5955a] transition-colors">
            Create one now
          </Link>
        </p>
      </div>
    </div>
  )
}
