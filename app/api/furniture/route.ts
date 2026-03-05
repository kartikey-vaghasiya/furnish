import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  const furniture = await prisma.furniture.findMany({
    orderBy: { id: "asc" },
  })
  return NextResponse.json(furniture)
}
