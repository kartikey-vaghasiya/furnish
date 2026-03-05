import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { put } from "@vercel/blob"
import { writeFile } from "fs/promises"
import path from "path"
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

  let modelUrl: string

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    // Production: upload to Vercel Blob
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`
    const blob = await put(`models/${filename}`, file, { access: "public" })
    modelUrl = blob.url
  } else {
    // Local dev: save to public/models/
    const bytes = await file.arrayBuffer()
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`
    const dest = path.join(process.cwd(), "public", "models", filename)
    await writeFile(dest, Buffer.from(bytes))
    modelUrl = `/models/${filename}`
  }

  const item = await prisma.furniture.create({
    data: { name, price, model: modelUrl, vendorId: vendor.id },
  })
  return NextResponse.json(item, { status: 201 })
}
