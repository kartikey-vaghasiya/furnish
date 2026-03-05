import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const hashed = await bcrypt.hash("vendor123", 10)
  const vendor = await prisma.vendor.upsert({
    where: { username: "vendor" },
    update: {},
    create: { username: "vendor", password: hashed, name: "Default Vendor" },
  })

  const items = [
    { name: "Sofa",       price: 899, model: "/models/Sofa.glb" },
    { name: "Desk Table", price: 499, model: "/models/DeskTable.glb" },
    { name: "Lamp",       price: 149, model: "/models/Lamp.glb" },
    { name: "Plant",      price:  79, model: "/models/Plant.glb" },
  ]

  for (const item of items) {
    await prisma.furniture.upsert({
      where: { id: items.indexOf(item) + 1 },
      update: {},
      create: { ...item, vendorId: vendor.id },
    })
  }

  console.log("Seeded vendor and 4 furniture items.")
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
