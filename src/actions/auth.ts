"use server"

import { db } from "@/lib/db"
import { users } from "@/lib/schema"
import { eq, or } from "drizzle-orm"
import bcrypt from "bcryptjs"

export async function registerUser(formData: FormData) {
  const fullName = formData.get("fullName") as string
  const email = formData.get("email") as string
  const mobileNumber = formData.get("mobileNumber") as string
  const password = formData.get("password") as string
  const district = formData.get("district") as string
  const state = formData.get("state") as string

  if (!fullName || !email || !mobileNumber || !password) {
    return { error: "Missing required fields" }
  }

  try {
    const existingUser = await db.select().from(users).where(
      or(
        eq(users.email, email),
        eq(users.mobileNumber, mobileNumber)
      )
    )

    if (existingUser.length > 0) {
      if (existingUser[0].email === email) {
         return { error: "Email already registered" }
      }
      return { error: "Mobile number already registered" }
    }

    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    await db.insert(users).values({
      name: fullName,
      email,
      mobileNumber,
      passwordHash,
      district,
      state,
      subscriptionStatus: "TRIAL",
    })

    return { success: true }
  } catch (error) {
    console.error("Registration error:", error)
    return { error: "Failed to create account" }
  }
}
