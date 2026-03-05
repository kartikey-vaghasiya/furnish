import { NextRequest, NextResponse } from "next/server"

// Proxy private Vercel Blob files so the 3D viewer can load them
export async function GET(req: NextRequest) {
  const blobUrl = req.nextUrl.searchParams.get("url")
  if (!blobUrl) return new NextResponse("Missing url", { status: 400 })

  const token = process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB2_READ_WRITE_TOKEN
  if (!token) return new NextResponse("No blob token", { status: 500 })

  const response = await fetch(blobUrl, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!response.ok) return new NextResponse("Blob not found", { status: 404 })

  return new NextResponse(response.body, {
    headers: {
      "Content-Type": "model/gltf-binary",
      "Cache-Control": "public, max-age=86400",
    },
  })
}
