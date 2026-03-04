"use client"

import { useState, useCallback } from "react"
import dynamic from "next/dynamic"
import { Sofa, ShoppingBag } from "lucide-react"
import { useCart } from "@/context/CartContext"
import { useScene } from "@/context/SceneContext"
import CartDrawer from "@/components/CartDrawer"
import FurniturePanel from "@/components/FurniturePanel"
import ItemControlPanel from "@/components/ItemControlPanel"

const RoomViewer = dynamic(() => import("@/components/RoomViewer"), { ssr: false })

export default function Home() {
  const [panelOpen, setPanelOpen] = useState(false)
  const [cartOpen, setCartOpen]   = useState(false)
  // Rotation state for each placed item: instanceId → degrees
  const [rotations, setRotations] = useState<Record<string, number>>({})

  const { totalCount }          = useCart()
  const { selectedInstanceId }  = useScene()

  const handleRotationChange = useCallback((instanceId: string, deg: number) => {
    setRotations(prev => ({ ...prev, [instanceId]: deg }))
  }, [])

  // Close furniture panel when item panel opens, and vice-versa
  const itemPanelOpen = !!selectedInstanceId

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#F7F4EF]">

      {/* ── Navbar ─────────────────────────────────────── */}
      <header className="shrink-0 h-14 bg-white border-b border-[#EDE7DF] flex items-center justify-between px-8 z-40">
        <span
          style={{ fontFamily: "var(--font-cormorant)", fontWeight: 400, letterSpacing: "0.22em", fontSize: "1.2rem" }}
          className="uppercase text-[#1A1410] select-none"
        >
          Furnish
        </span>

        <button
          onClick={() => setCartOpen(true)}
          className="relative flex items-center gap-2 text-[11px] font-bold tracking-[0.15em] uppercase text-[#1A1410] bg-[#F5F0E8] hover:bg-[#EDE5D8] rounded-full px-4 py-2 transition-colors cursor-pointer"
        >
          <ShoppingBag className="w-[15px] h-[15px]" strokeWidth={2} />
          Cart
          {totalCount > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#1A1410] text-white text-[9px] rounded-full flex items-center justify-center font-bold">
              {totalCount}
            </span>
          )}
        </button>
      </header>

      {/* ── Main ───────────────────────────────────────── */}
      <div className="flex-1 relative flex overflow-hidden">

        {/* Left: furniture browser panel */}
        <FurniturePanel
          open={panelOpen && !itemPanelOpen}
          onClose={() => setPanelOpen(false)}
        />

        {/* Centre: 3D room */}
        <div className="flex-1 relative overflow-hidden">
          <RoomViewer className="w-full h-full" rotations={rotations} />

          {/* Floating "Add Furniture" button */}
          {!itemPanelOpen && (
            <button
              onClick={() => setPanelOpen(o => !o)}
              className={`absolute bottom-6 left-6 z-20 flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] font-bold tracking-wide uppercase shadow-lg transition-all duration-200 cursor-pointer
                ${panelOpen
                  ? "bg-white text-[#1A1410] border-2 border-[#1A1410]"
                  : "bg-[#1A1410] text-white hover:bg-[#3D3026] hover:shadow-xl"
                }`}
            >
              <Sofa className="w-4 h-4" strokeWidth={1.8} />
              {panelOpen ? "Close" : "Add Furniture"}
            </button>
          )}
        </div>

        {/* Right: selected item control panel */}
        <ItemControlPanel
          rotations={rotations}
          onRotationChange={handleRotationChange}
        />
      </div>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  )
}
