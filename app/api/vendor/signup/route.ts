import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/db"
import { signToken } from "@/lib/auth"

export async function POST(req: NextRequest) {
  const { username, password, name } = await req.json()

  if (!username || !password || !name) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 })
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
  }

  const existing = await prisma.vendor.findUnique({ where: { username } })
  if (existing) {
    return NextResponse.json({ error: "Username already taken" }, { status: 409 })
  }

  const hashed = await bcrypt.hash(password, 10)
  const vendor = await prisma.vendor.create({
    data: { username, password: hashed, name },
  })

  const token = await signToken(vendor.id)
  const res = NextResponse.json({ id: vendor.id, username: vendor.username, name: vendor.name }, { status: 201 })
  res.cookies.set("vendor_session", token, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "lax",
  })
  return res
}
