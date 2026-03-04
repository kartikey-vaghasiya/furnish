"use client"

import { useCallback } from "react"
import * as THREE from "three"

// ─── Room dimensions ──────────────────────────────────────────────────────────
export const ROOM = {
  width:  7,    // X  (left ↔ right)
  height: 2.24, // Y  (floor ↔ ceiling)
  depth:  5.6,  // Z  (front ↔ back)
}

// ─── Materials ────────────────────────────────────────────────────────────────
const floorMat   = new THREE.MeshStandardMaterial({ color: "#C8A97A", roughness: 0.85, metalness: 0.0 })
const wallMat    = new THREE.MeshStandardMaterial({ color: "#B8C4CA", roughness: 0.9,  metalness: 0.0 })
const ceilingMat = new THREE.MeshStandardMaterial({ color: "#E8E4DC", roughness: 1.0,  metalness: 0.0 })
const trimMat    = new THREE.MeshStandardMaterial({ color: "#FFFFFF", roughness: 0.7,  metalness: 0.0 })

const HW = ROOM.width  / 2   // half-width
const HH = ROOM.height / 2   // half-height
const HD = ROOM.depth  / 2   // half-depth

interface Props {
  onBoundsReady: (center: THREE.Vector3, size: THREE.Vector3) => void
}

export default function ProceduralRoom({ onBoundsReady }: Props) {
  const ref = useCallback((group: THREE.Group | null) => {
    if (!group) return
    const center = new THREE.Vector3(0, HH, 0)
    const size   = new THREE.Vector3(ROOM.width, ROOM.height, ROOM.depth)
    onBoundsReady(center, size)
  }, [onBoundsReady])

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <group ref={ref as any}>

      {/* ── Floor ─────────────────────────────────────────────── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[ROOM.width, ROOM.depth]} />
        <primitive object={floorMat} attach="material" />
      </mesh>

      {/* Floor skirting strip (subtle depth) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <planeGeometry args={[ROOM.width + 0.02, ROOM.depth + 0.02]} />
        <meshStandardMaterial color="#B89560" roughness={0.9} />
      </mesh>

      {/* ── Ceiling ───────────────────────────────────────────── */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, ROOM.height, 0]}>
        <planeGeometry args={[ROOM.width, ROOM.depth]} />
        <primitive object={ceilingMat} attach="material" />
      </mesh>

      {/* ── Back wall ─────────────────────────────────────────── */}
      <mesh position={[0, HH, -HD]} receiveShadow>
        <planeGeometry args={[ROOM.width, ROOM.height]} />
        <primitive object={wallMat} attach="material" />
      </mesh>

      {/* ── Left wall ─────────────────────────────────────────── */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-HW, HH, 0]} receiveShadow>
        <planeGeometry args={[ROOM.depth, ROOM.height]} />
        <primitive object={wallMat} attach="material" />
      </mesh>

      {/* ── Right wall ────────────────────────────────────────── */}
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[HW, HH, 0]} receiveShadow>
        <planeGeometry args={[ROOM.depth, ROOM.height]} />
        <primitive object={wallMat} attach="material" />
      </mesh>

      {/* ── Baseboard trim — back ──────────────────────────────── */}
      <mesh position={[0, 0.07, -HD + 0.01]}>
        <boxGeometry args={[ROOM.width, 0.14, 0.04]} />
        <primitive object={trimMat} attach="material" />
      </mesh>

      {/* ── Baseboard trim — left ─────────────────────────────── */}
      <mesh position={[-HW + 0.01, 0.07, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[ROOM.depth, 0.14, 0.04]} />
        <primitive object={trimMat} attach="material" />
      </mesh>

      {/* ── Baseboard trim — right ────────────────────────────── */}
      <mesh position={[HW - 0.01, 0.07, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <boxGeometry args={[ROOM.depth, 0.14, 0.04]} />
        <primitive object={trimMat} attach="material" />
      </mesh>

      {/* ── Ceiling light ─────────────────────────────────────── */}
      <mesh position={[0, ROOM.height - 0.01, 0]}>
        <circleGeometry args={[0.25, 32]} />
        <meshStandardMaterial color="#F5F0E8" emissive="#F5F0E8" emissiveIntensity={0.4} />
      </mesh>

    </group>
  )
}
