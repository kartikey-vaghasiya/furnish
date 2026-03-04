"use client"

import { useRef, useState, useCallback, useMemo, useEffect } from "react"
import { useGLTF } from "@react-three/drei"
import { ThreeEvent } from "@react-three/fiber"
import * as THREE from "three"
import { useScene } from "@/context/SceneContext"
import { FurnitureItem } from "@/lib/furniture"

interface Props {
  item: FurnitureItem & { instanceId: string; spawnPosition: [number, number, number] }
  rotation: number          // controlled by parent (ItemControlPanel)
  isSelected: boolean
}

const floorNormal = new THREE.Vector3(0, 1, 0)

export default function FurnitureInScene({ item, rotation, isSelected }: Props) {
  const { scene } = useGLTF(item.model)
  const cloned = useMemo(() => scene.clone(true), [scene])

  const { hallBounds, setSelectedInstanceId } = useScene()
  const [pos, setPos] = useState<[number, number, number]>(item.spawnPosition)

  const isDragging = useRef(false)
  const hasMoved   = useRef(false)
  const intersect  = useRef(new THREE.Vector3())
  const floorPlane = useRef(new THREE.Plane(floorNormal, -(item.spawnPosition[1])))

  useEffect(() => {
    floorPlane.current.constant = -(hallBounds?.floorY ?? item.spawnPosition[1])
  }, [hallBounds?.floorY, item.spawnPosition])

  const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v))
  const bounds = hallBounds?.dragBounds ?? { minX: -5, maxX: 5, minZ: -4, maxZ: 4 }

  const onPointerDown = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    ;(e.target as Element).setPointerCapture(e.pointerId)
    isDragging.current = true
    hasMoved.current   = false
  }, [])

  const onPointerMove = useCallback((e: ThreeEvent<PointerEvent>) => {
    if (!isDragging.current) return
    e.stopPropagation()
    hasMoved.current = true
    if (e.ray.intersectPlane(floorPlane.current, intersect.current)) {
      const floorY = hallBounds?.floorY ?? 0
      setPos([
        clamp(intersect.current.x, bounds.minX, bounds.maxX),
        floorY,
        clamp(intersect.current.z, bounds.minZ, bounds.maxZ),
      ])
    }
  }, [hallBounds, bounds.minX, bounds.maxX, bounds.minZ, bounds.maxZ])

  const onPointerUp = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    ;(e.target as Element).releasePointerCapture(e.pointerId)
    isDragging.current = false
    // If user just clicked (didn't drag) → select this item
    if (!hasMoved.current) {
      setSelectedInstanceId(isSelected ? null : item.instanceId)
    }
  }, [item.instanceId, isSelected, setSelectedInstanceId])

  return (
    <group
      position={pos}
      rotation={[0, (rotation * Math.PI) / 180, 0]}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {/* Subtle highlight ring when selected */}
      {isSelected && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <ringGeometry args={[0.55, 0.65, 32]} />
          <meshBasicMaterial color="#C8A96A" transparent opacity={0.7} />
        </mesh>
      )}
      <primitive object={cloned} />
    </group>
  )
}
