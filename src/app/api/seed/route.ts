import { db } from "@/lib/db"
import { users } from "@/lib/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function GET() {
  try {
    const email = "expertypingtutor@gmail.com"
    const newPassword = "password123"
    
    const hash = await bcrypt.hash(newPassword, 10)
    
    const existing = await db.select().from(users).where(eq(users.email, email))
    
    if (existing.length > 0) {
      await db.update(users)
        .set({ passwordHash: hash, role: "ADMIN" })
        .where(eq(users.email, email))
      return NextResponse.json({ success: true, message: `Account updated! Password is ${newPassword} and role is ADMIN.` })
    } else {
      await db.insert(users).values({
        id: crypto.randomUUID(),
        email: email,
        fullName: "Admin",
        mobileNumber: "0000000000",
        examName: "N/A",
        district: "N/A",
        state: "N/A",
        passwordHash: hash,
        role: "ADMIN"
      })
      return NextResponse.json({ success: true, message: `Account created! Password is ${newPassword} and role is ADMIN.` })
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message })
  }
}
