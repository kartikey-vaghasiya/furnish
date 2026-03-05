"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye } from "lucide-react"
import AddFurnitureModal from "@/components/AddFurnitureModal"
import FurniturePreviewModal from "@/components/FurniturePreviewModal"

interface FurnitureRow {
  id: number
  name: string
  price: number
  model: string
  purchases: number
}

interface Props {
  vendor: { id: number; username: string; name: string }
  initialFurniture: FurnitureRow[]
}

export default function VendorDashboardClient({ vendor, initialFurniture }: Props) {
  const router = useRouter()
  const [furniture, setFurniture]     = useState<FurnitureRow[]>(initialFurniture)
  const [addOpen, setAddOpen]         = useState(false)
  const [preview, setPreview]         = useState<FurnitureRow | null>(null)

  async function handleLogout() {
    await fetch("/api/vendor/logout", { method: "POST" })
    router.push("/vendor/login")
  }

  async function refreshFurniture() {
    const res = await fetch("/api/vendor/furniture")
    if (res.ok) setFurniture(await res.json())
  }

  const totalPurchases = furniture.reduce((s, f) => s + f.purchases, 0)

  return (
    <div className="min-h-screen bg-[#F7F4EF]">

      {/* ── Navbar ─────────────────────────────────────────── */}
      <header className="h-14 bg-white border-b border-[#EDE7DF] flex items-center justify-between px-8">
        <Link
          href="/"
          style={{ fontFamily: "var(--font-cormorant)", fontWeight: 400, letterSpacing: "0.22em", fontSize: "1.2rem" }}
          className="uppercase text-[#1A1410] select-none"
        >
          Furnish
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-[12px] text-[#888]">{vendor.name}</span>
          <button
            onClick={handleLogout}
            className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#1A1410] bg-[#F5F0E8] hover:bg-[#EDE5D8] rounded-full px-4 py-2 transition-colors cursor-pointer"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">

        {/* ── Header ─────────────────────────────────────── */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1
              style={{ fontFamily: "var(--font-cormorant)", fontWeight: 300, fontSize: "2rem" }}
              className="text-[#1A1410]"
            >
              Your Furniture
            </h1>
            <p className="text-[11px] tracking-[0.2em] uppercase text-[#AAA] mt-1">
              {vendor.name} · Vendor Dashboard
            </p>
          </div>
          <button
            onClick={() => setAddOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-[#1A1410] text-white hover:bg-[#3D3026] transition-colors cursor-pointer"
          >
            + Add New
          </button>
        </div>

        {/* ── Stats strip ────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Listed Items",     value: furniture.length },
            { label: "Total Purchases",  value: totalPurchases },
            { label: "Total Revenue",    value: `$${furniture.reduce((s, f) => s + f.price * f.purchases, 0).toLocaleString()}` },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-2xl border border-[#EDE7DF] px-6 py-5">
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#AAA]">{label}</p>
              <p
                style={{ fontFamily: "var(--font-cormorant)", fontWeight: 400, fontSize: "1.8rem" }}
                className="text-[#1A1410] mt-1 leading-none"
              >
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* ── Table ──────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-[#EDE7DF] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#EDE7DF] bg-[#FDFAF6]">
                <th className="text-left px-6 py-3.5 text-[10px] font-bold tracking-[0.2em] uppercase text-[#AAA]">Name</th>
                <th className="text-left px-6 py-3.5 text-[10px] font-bold tracking-[0.2em] uppercase text-[#AAA]">Price</th>
                <th className="text-left px-6 py-3.5 text-[10px] font-bold tracking-[0.2em] uppercase text-[#AAA]">Purchases</th>
                <th className="px-6 py-3.5 text-[10px] font-bold tracking-[0.2em] uppercase text-[#AAA] text-right">Preview</th>
              </tr>
            </thead>
            <tbody>
              {furniture.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <p className="text-[#CCC] text-sm">No furniture yet.</p>
                    <p className="text-[#DDD] text-[11px] mt-1">Click &ldquo;+ Add New&rdquo; to upload your first piece.</p>
                  </td>
                </tr>
              ) : (
                furniture.map((item, i) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-[#FDFAF6] transition-colors ${i < furniture.length - 1 ? "border-b border-[#EDE7DF]" : ""}`}
                  >
                    <td className="px-6 py-4 text-sm text-[#1A1410] font-medium">{item.name}</td>
                    <td className="px-6 py-4 text-sm text-[#555]">${item.price.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-[#555]">
                      <span className={`inline-flex items-center gap-1.5 ${item.purchases > 0 ? "text-[#2D7A4F]" : "text-[#999]"}`}>
                        {item.purchases > 0 && <span className="w-1.5 h-1.5 rounded-full bg-[#2D7A4F] inline-block" />}
                        {item.purchases}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setPreview(item)}
                        title="Preview 3D model"
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full text-[#BBB] hover:text-[#1A1410] hover:bg-[#F5F0E8] transition-colors cursor-pointer"
                      >
                        <Eye className="w-4 h-4" strokeWidth={1.8} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </main>

      <AddFurnitureModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdded={refreshFurniture}
      />

      {preview && (
        <FurniturePreviewModal
          open={!!preview}
          onClose={() => setPreview(null)}
          name={preview.name}
          price={preview.price}
          model={preview.model}
        />
      )}
    </div>
  )
}
