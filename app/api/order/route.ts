import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function POST(req: NextRequest) {
  const { items } = await req.json() as { items: Array<{ id: number; quantity: number }> }

  await Promise.all(
    items.map(({ id, quantity }) =>
      prisma.furniture.update({
        where: { id },
        data: { purchases: { increment: quantity } },
      })
    )
  )

  return NextResponse.json({ ok: true })
}
