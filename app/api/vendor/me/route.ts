import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getVendorSession } from "@/lib/auth"

export async function GET(_req: NextRequest) {
  const jar = await cookies()
  const vendor = await getVendorSession(jar)
  if (!vendor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  return NextResponse.json({ vendor })
}
