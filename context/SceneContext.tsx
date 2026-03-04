"use client"

import { createContext, useContext, useState, useRef, ReactNode } from "react"
import { FurnitureItem } from "@/lib/furniture"

export interface HallBounds {
  center: { x: number; y: number; z: number }
  size:   { x: number; y: number; z: number }
  floorY: number
  dragBounds: { minX: number; maxX: number; minZ: number; maxZ: number }
}

export interface PlacedItem extends FurnitureItem {
  instanceId: string
  spawnPosition: [number, number, number]
}

interface SceneContextType {
  placedItems: PlacedItem[]
  placeItem: (item: FurnitureItem) => void
  removeItem: (instanceId: string) => void
  hallBounds: HallBounds | null
  setHallBounds: (bounds: HallBounds) => void
  // Selected item for right-panel interaction
  selectedInstanceId: string | null
  setSelectedInstanceId: (id: string | null) => void
}

const SceneContext = createContext<SceneContextType | null>(null)

export function SceneProvider({ children }: { children: ReactNode }) {
  const [placedItems, setPlacedItems] = useState<PlacedItem[]>([])
  const [hallBounds, setHallBoundsState] = useState<HallBounds | null>(null)
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(null)
  const hallBoundsRef = useRef<HallBounds | null>(null)

  const setHallBounds = (bounds: HallBounds) => {
    hallBoundsRef.current = bounds
    setHallBoundsState(bounds)
  }

  const placeItem = (item: FurnitureItem) => {
    const instanceId = `${item.id}-${Date.now()}`
    const b = hallBoundsRef.current
    const spawnX = b ? b.center.x + (Math.random() - 0.5) * (b.size.x * 0.25) : 0
    const spawnZ = b ? b.center.z + (Math.random() - 0.5) * (b.size.z * 0.25) : 0
    const spawnY = b ? b.floorY : 0
    setPlacedItems(prev => [...prev, { ...item, instanceId, spawnPosition: [spawnX, spawnY, spawnZ] }])
  }

  const removeItem = (instanceId: string) => {
    setPlacedItems(prev => prev.filter(i => i.instanceId !== instanceId))
    setSelectedInstanceId(id => id === instanceId ? null : id)
  }

  return (
    <SceneContext.Provider value={{
      placedItems, placeItem, removeItem,
      hallBounds, setHallBounds,
      selectedInstanceId, setSelectedInstanceId,
    }}>
      {children}
    </SceneContext.Provider>
  )
}

export function useScene() {
  const ctx = useContext(SceneContext)
  if (!ctx) throw new Error("useScene must be used within SceneProvider")
  return ctx
}
