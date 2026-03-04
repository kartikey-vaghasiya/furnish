"use client"

import { X, RotateCw, ShoppingCart, Trash2 } from "lucide-react"
import { useScene } from "@/context/SceneContext"
import { useCart } from "@/context/CartContext"

interface Props {
  // rotation state lifted here so it can be passed down to FurnitureInScene
  rotations: Record<string, number>
  onRotationChange: (instanceId: string, deg: number) => void
}

export default function ItemControlPanel({ rotations, onRotationChange }: Props) {
  const { placedItems, removeItem, selectedInstanceId, setSelectedInstanceId } = useScene()
  const { add } = useCart()

  const item = placedItems.find(i => i.instanceId === selectedInstanceId)
  const open = !!item

  return (
    <div
      className="absolute top-0 right-0 h-full z-30 flex flex-col transition-all duration-300 ease-in-out overflow-hidden"
      style={{
        width: open ? 280 : 0,
        minWidth: 0,
        boxShadow: open ? "-4px 0 32px rgba(0,0,0,0.09)" : "none",
      }}
    >
      {item && (
        <div className="flex flex-col h-full bg-[#FDFAF6] border-l border-[#EDE7DF]" style={{ width: 280 }}>

          {/* Header */}
          <div className="shrink-0 px-5 py-4 bg-white border-b border-[#EDE7DF] flex items-center justify-between">
            <div>
              <p
                style={{ fontFamily: "var(--font-cormorant)", fontWeight: 400, fontSize: "1.15rem", letterSpacing: "0.02em" }}
                className="text-[#1A1410] leading-tight"
              >
                {item.name}
              </p>
              <p className="text-[11px] text-[#AAA] mt-0.5 font-medium">${item.price}</p>
            </div>
            <button
              onClick={() => setSelectedInstanceId(null)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#BBB] hover:text-[#1A1410] hover:bg-[#F0EAE2] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>

          {/* Rotate control */}
          <div className="px-5 py-5 border-b border-[#EDE7DF] bg-[#FDFAF6]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <RotateCw className="w-3.5 h-3.5 text-[#C8A96A]" strokeWidth={2} />
                <span className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#888]">Rotate</span>
              </div>
              <span className="text-[12px] font-semibold text-[#444] tabular-nums">
                {rotations[item.instanceId] ?? 0}°
              </span>
            </div>
            <input
              type="range" min={0} max={360}
              value={rotations[item.instanceId] ?? 0}
              onChange={e => onRotationChange(item.instanceId, Number(e.target.value))}
              className="w-full"
              style={{ cursor: "ew-resize" }}
            />
            {/* Quick rotation presets */}
            <div className="flex gap-2 mt-3">
              {[0, 90, 180, 270].map(deg => (
                <button
                  key={deg}
                  onClick={() => onRotationChange(item.instanceId, deg)}
                  className={`flex-1 py-1.5 text-[10px] font-semibold rounded-full transition-colors cursor-pointer
                    ${(rotations[item.instanceId] ?? 0) === deg
                      ? "bg-[#1A1410] text-white"
                      : "bg-[#F0EAE2] text-[#888] hover:bg-[#E5DDD3] hover:text-[#1A1410]"
                    }`}
                >
                  {deg}°
                </button>
              ))}
            </div>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Actions */}
          <div className="shrink-0 p-5 space-y-3 border-t border-[#EDE7DF] bg-white">
            <button
              onClick={() => { add(item); setSelectedInstanceId(null) }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-[#1A1410] text-white text-[12px] font-bold tracking-wide uppercase hover:bg-[#3D3026] transition-colors cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" strokeWidth={2} />
              Add to Cart — ${item.price}
            </button>
            <button
              onClick={() => removeItem(item.instanceId)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full border border-[#E0D8CE] text-[#B5A898] text-[11px] font-semibold tracking-wide uppercase hover:border-red-300 hover:text-red-400 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" strokeWidth={2} />
              Remove from Room
            </button>
          </div>

        </div>
      )}
    </div>
  )
}
