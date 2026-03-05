import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    const furniture = await prisma.furniture.findMany({
      orderBy: { id: "asc" },
    })
    return NextResponse.json(furniture)
  } catch (e) {
    console.error("[/api/furniture]", e)
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
