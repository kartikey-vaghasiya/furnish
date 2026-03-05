"use client"

import { Suspense, useEffect, useState } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, useGLTF, Environment } from "@react-three/drei"
import { X, ShoppingCart } from "lucide-react"
import { FurnitureItem } from "@/lib/furniture"
import { useScene } from "@/context/SceneContext"
import { useCart } from "@/context/CartContext"

function ModelPreview({ model }: { model: string }) {
  const { scene } = useGLTF(model)
  return <primitive object={scene.clone(true)} />
}

interface CardProps {
  item: FurnitureItem
  onPlace: () => void
}

function FurnitureCard({ item, onPlace }: CardProps) {
  const { placeItem } = useScene()

  return (
    <div
      className="group rounded-xl overflow-hidden border border-[#EDE7DF] bg-white hover:border-[#C8B89A] hover:shadow-md transition-all duration-200"
      style={{ cursor: "default" }}
    >
      {/* 3D preview */}
      <div style={{ height: 140, background: "#F5F0E8", position: "relative" }}>
        <Canvas camera={{ position: [0, 1.1, 2.8], fov: 40 }} gl={{ antialias: true }}>
          <ambientLight intensity={1.2} />
          <directionalLight position={[3, 5, 3]} intensity={0.7} />
          <Environment preset="apartment" />
          <Suspense fallback={null}>
            <ModelPreview model={item.model} />
          </Suspense>
          <OrbitControls
            enableZoom={false}
            autoRotate
            autoRotateSpeed={0.7}
            enablePan={false}
          />
        </Canvas>
      </div>

      {/* Info + action */}
      <div className="px-4 py-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[13px] font-semibold text-[#1A1410] leading-tight truncate">{item.name}</p>
          <p className="text-[11px] text-[#999] mt-0.5 font-medium">${item.price}</p>
        </div>
        <button
          onClick={() => { placeItem(item); onPlace() }}
          className="shrink-0 rounded-full text-[11px] font-bold tracking-wide uppercase bg-[#1A1410] text-white px-4 py-2 hover:bg-[#3D3026] transition-colors cursor-pointer"
        >
          Place
        </button>
      </div>
    </div>
  )
}

interface Props {
  open: boolean
  onClose: () => void
}

export default function FurniturePanel({ open, onClose }: Props) {
  const { totalCount } = useCart()
  const [furniture, setFurniture] = useState<FurnitureItem[]>([])

  useEffect(() => {
    fetch("/api/furniture")
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setFurniture(data) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [onClose])

  return (
    <div
      className="absolute top-0 left-0 h-full z-30 flex flex-col transition-all duration-300 ease-in-out overflow-hidden"
      style={{
        width: open ? 300 : 0,
        minWidth: 0,
        boxShadow: open ? "4px 0 32px rgba(0,0,0,0.10)" : "none",
      }}
    >
      <div className="flex flex-col h-full bg-[#FDFAF6]" style={{ width: 300 }}>

        {/* Header */}
        <div className="shrink-0 px-5 py-4 bg-white border-b border-[#EDE7DF] flex items-center justify-between">
          <div>
            <p className="text-[13px] font-bold tracking-wide text-[#1A1410]">Furniture</p>
            <p className="text-[11px] text-[#AAA] mt-0.5">Place items into the room</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#BBB] hover:text-[#1A1410] hover:bg-[#F0EAE2] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>

        {/* Cards */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {furniture.map(item => (
            <FurnitureCard key={item.id} item={item} onPlace={onClose} />
          ))}
        </div>

        {/* Cart summary footer */}
        <div className={`shrink-0 border-t border-[#EDE7DF] bg-white px-5 py-3 transition-all duration-200 ${totalCount > 0 ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
          <div className="flex items-center gap-2 text-[12px] text-[#888]">
            <ShoppingCart className="w-3.5 h-3.5 text-[#C8A96A]" strokeWidth={2} />
            <span>
              <strong className="text-[#1A1410] font-semibold">{totalCount} item{totalCount !== 1 ? "s" : ""}</strong> in cart
            </span>
          </div>
        </div>

      </div>
    </div>
  )
}
