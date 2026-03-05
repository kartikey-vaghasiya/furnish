import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { put } from "@vercel/blob"
import { getVendorSession } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET() {
  const jar = await cookies()
  const vendor = await getVendorSession(jar)
  if (!vendor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const furniture = await prisma.furniture.findMany({
    where: { vendorId: vendor.id },
    orderBy: { id: "asc" },
  })
  return NextResponse.json(furniture)
}

export async function POST(req: NextRequest) {
  const jar = await cookies()
  const vendor = await getVendorSession(jar)
  if (!vendor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const form = await req.formData()
  const name  = form.get("name")  as string
  const price = parseFloat(form.get("price") as string)
  const file  = form.get("file")  as File | null

  if (!name || isNaN(price) || !file) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }

  try {
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`
    const blob = await put(`models/${filename}`, file, { access: "private" })
    const modelUrl = `/api/models?url=${encodeURIComponent(blob.url)}`
    const item = await prisma.furniture.create({
      data: { name, price, model: modelUrl, vendorId: vendor.id },
    })
    return NextResponse.json(item, { status: 201 })
  } catch (e) {
    console.error("[furniture POST]", e)
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
