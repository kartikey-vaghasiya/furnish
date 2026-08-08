"use client"

import { useState, useCallback } from "react"
import dynamic from "next/dynamic"
import { Sofa } from "lucide-react"
import { useScene } from "@/context/SceneContext"
import FurniturePanel from "@/components/FurniturePanel"
import ItemControlPanel from "@/components/ItemControlPanel"

const RoomViewer = dynamic(() => import("@/components/RoomViewer"), { ssr: false })

export default function Home() {
  const [panelOpen, setPanelOpen] = useState(false)
  const [rotations, setRotations] = useState<Record<string, number>>({})

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
        <img
          src="/homecentre-logo.png"
          alt="Furnish Logo"
          className="h-12 object-contain"
        />

        <div className="flex items-center gap-3">
          <button
            className="text-[11px] font-bold tracking-[0.15em] uppercase text-white bg-[#1A1410] hover:bg-[#3D3026] rounded-full px-5 py-2 transition-colors cursor-pointer"
          >
            Book Design Expert
          </button>
        </div>
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
    </div>
  )
}
