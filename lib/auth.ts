import { SignJWT, jwtVerify } from "jose"
import { prisma } from "@/lib/db"
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies"

const secret = new TextEncoder().encode(
  process.env.VENDOR_JWT_SECRET ?? "furnish_dev_secret"
)

export async function signToken(vendorId: number): Promise<string> {
  return new SignJWT({ vendorId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret)
}

export async function verifyToken(token: string): Promise<{ vendorId: number } | null> {
  try {
    const { payload } = await jwtVerify(token, secret)
    return { vendorId: payload.vendorId as number }
  } catch {
    return null
  }
}

export async function getVendorSession(cookies: ReadonlyRequestCookies) {
  const token = cookies.get("vendor_session")?.value
  if (!token) return null
  const payload = await verifyToken(token)
  if (!payload) return null
  return prisma.vendor.findUnique({
    where: { id: payload.vendorId },
    select: { id: true, username: true, name: true },
  })
}
