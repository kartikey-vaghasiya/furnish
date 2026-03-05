import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getVendorSession } from "@/lib/auth"
import { prisma } from "@/lib/db"
import VendorDashboardClient from "./DashboardClient"

export default async function VendorDashboardPage() {
  const jar = await cookies()
  const vendor = await getVendorSession(jar)
  if (!vendor) redirect("/vendor/login")

  const furniture = await prisma.furniture.findMany({
    where: { vendorId: vendor.id },
    orderBy: { id: "asc" },
  })

  return <VendorDashboardClient vendor={vendor} initialFurniture={furniture} />
}
