"use client"

import { Suspense, useState, useRef, useEffect, useCallback } from "react"
import { Canvas } from "@react-three/fiber"
import { CameraControls, Environment, useGLTF } from "@react-three/drei"
import * as THREE from "three"
import { Lock, LockOpen } from "lucide-react"
import { useScene } from "@/context/SceneContext"
import FurnitureInScene from "./FurnitureInScene"
import { ROOM_MODE } from "@/lib/config"

// ─── Preload both room models ──────────────────────────────────────────────
useGLTF.preload("/models/Fake.glb")
useGLTF.preload("/models/Hall.glb")

// ─── GLB room (Fake.glb or Hall.glb) ──────────────────────────────────────
function GlbRoom({ model, onBoundsReady }: { model: string; onBoundsReady: (c: THREE.Vector3, s: THREE.Vector3) => void }) {
  const { scene } = useGLTF(model)
  const ref = useRef<THREE.Group>(null!)
  useEffect(() => {
    if (!ref.current) return
    const box = new THREE.Box3().setFromObject(ref.current)
    const c = new THREE.Vector3(), s = new THREE.Vector3()
    box.getCenter(c); box.getSize(s)
    onBoundsReady(c, s)
  }, [scene, onBoundsReady])
  return <primitive ref={ref} object={scene} />
}

// ─── Scene content ────────────────────────────────────────────────────────
interface SceneContentProps {
  controlsRef: React.RefObject<CameraControls | null>
  locked: boolean
  rotations: Record<string, number>
  onBoundsReady: (c: THREE.Vector3, s: THREE.Vector3) => void
}

function SceneContent({ controlsRef, locked, rotations, onBoundsReady }: SceneContentProps) {
  const { placedItems, selectedInstanceId } = useScene()

  useEffect(() => {
    const ctrl = controlsRef.current
    if (!ctrl) return
    if (locked) {
      ctrl.mouseButtons.left = ctrl.mouseButtons.middle = ctrl.mouseButtons.right = ctrl.mouseButtons.wheel = 0
      ctrl.touches.one = ctrl.touches.two = ctrl.touches.three = 0
    } else {
      ctrl.mouseButtons.left = 1; ctrl.mouseButtons.middle = 8
      ctrl.mouseButtons.right = 2; ctrl.mouseButtons.wheel = 16
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(ctrl.touches as any).one = 32; (ctrl.touches as any).two = 528
      ctrl.touches.three = 0
    }
  }, [locked, controlsRef])

  return (
    <>
      <ambientLight intensity={1.3} />
      <directionalLight position={[5, 10, 5]} intensity={1.0} castShadow />
      <directionalLight position={[-4, 6, -4]} intensity={0.35} />
      <Environment preset="apartment" />

      {/* Room mesh */}
      <Suspense fallback={null}>
        {ROOM_MODE === "fake" ? (
          <GlbRoom model="/models/Fake.glb" onBoundsReady={onBoundsReady} />
        ) : (
          <GlbRoom model="/models/Hall.glb" onBoundsReady={onBoundsReady} />
        )}
      </Suspense>

      {placedItems.map(item => (
        <Suspense key={item.instanceId} fallback={null}>
          <FurnitureInScene
            item={item}
            rotation={rotations[item.instanceId] ?? 0}
            isSelected={selectedInstanceId === item.instanceId}
          />
        </Suspense>
      ))}

      <CameraControls
        ref={controlsRef}
        mouseButtons={{ left: 0, middle: 0, right: 0, wheel: 0 }}
        touches={{ one: 0, two: 0, three: 0 }}
        minDistance={1}
        maxDistance={24}
        makeDefault
      />
    </>
  )
}

// ─── Main component ───────────────────────────────────────────────────────
interface RoomViewerProps {
  className?: string
  rotations: Record<string, number>
}

type ViewKey = "perspective" | "front" | "side" | "top"
const VIEWS: { key: ViewKey; label: string }[] = [
  { key: "perspective", label: "Perspective" },
  { key: "front",       label: "Front" },
  { key: "side",        label: "Side" },
  { key: "top",         label: "Top" },
]

export default function RoomViewer({ className, rotations }: RoomViewerProps) {
  const [activeView, setActiveView] = useState<ViewKey>(ROOM_MODE === "fake" ? "side" : "front")
  const [locked, setLocked]         = useState(true)
  const controlsRef = useRef<CameraControls | null>(null)
  const centerRef   = useRef(new THREE.Vector3())
  const sizeRef     = useRef(new THREE.Vector3(10, 4, 8))
  const floorYRef   = useRef(0)
  const boundsReady = useRef(false)
  const { setHallBounds } = useScene()

  const goToView = useCallback((key: ViewKey, smooth = true) => {
    if (!controlsRef.current) return
    setActiveView(key)
    const c = centerRef.current
    const s = sizeRef.current
    const fy = floorYRef.current
    const d  = Math.max(s.x, s.z)
    const eyeY = fy + s.y * 0.5

    const configs: Record<ViewKey, { cam: [number,number,number]; tgt: [number,number,number] }> = {
      front:       { cam: [c.x,            eyeY, c.z + d * 1.35], tgt: [c.x, eyeY, c.z] },
      side:        { cam: [c.x + d * 1.35, eyeY, c.z],            tgt: [c.x, eyeY, c.z] },
      perspective: { cam: [c.x + d * 0.65, eyeY, c.z + d * 1.3],  tgt: [c.x, eyeY, c.z] },
      top:         { cam: [c.x, fy + d * 1.9, c.z + 0.01],        tgt: [c.x, fy,   c.z] },
    }
    const { cam, tgt } = configs[key]
    controlsRef.current.setLookAt(...cam, ...tgt, smooth)
  }, [])

  const handleBoundsReady = useCallback((center: THREE.Vector3, size: THREE.Vector3) => {
    if (boundsReady.current) return
    boundsReady.current = true
    centerRef.current.copy(center)
    sizeRef.current.copy(size)
    const floorY = center.y - size.y / 2 + 0.02
    floorYRef.current = floorY
    setHallBounds({
      center:     { x: center.x, y: center.y, z: center.z },
      size:       { x: size.x, y: size.y, z: size.z },
      floorY,
      dragBounds: {
        minX: center.x - size.x * 0.4, maxX: center.x + size.x * 0.4,
        minZ: center.z - size.z * 0.4, maxZ: center.z + size.z * 0.4,
      },
    })
    // In fake mode the right wall is open — look in from that side
    setTimeout(() => goToView(ROOM_MODE === "fake" ? "side" : "front", false), 60)
  }, [goToView, setHallBounds])

  return (
    <div
      className={`relative overflow-hidden ${className ?? "w-full h-full"}`}
      style={{ background: "#F7F4EF" }}
    >
      <Canvas
        shadows
        camera={{ position: [0, 4, 14], fov: 46 }}
        gl={{ antialias: true }}
        style={{ width: "100%", height: "100%" }}
      >
        <SceneContent
          controlsRef={controlsRef}
          locked={locked}
          rotations={rotations}
          onBoundsReady={handleBoundsReady}
        />
      </Canvas>

      {/* Bottom controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5">
        <button
          onClick={() => setLocked(l => !l)}
          className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-full text-[11px] font-bold tracking-wide shadow-md transition-all duration-200 cursor-pointer
            ${locked
              ? "bg-[#1A1410] text-white hover:bg-[#3D3026]"
              : "bg-white text-[#1A1410] border-2 border-[#1A1410]"
            }`}
        >
          {locked ? <Lock className="w-3 h-3" strokeWidth={2.5}/> : <LockOpen className="w-3 h-3" strokeWidth={2.5}/>}
          {locked ? "Locked" : "Free"}
        </button>

        <div className="flex rounded-full overflow-hidden shadow-md border border-[#DDD5C8] bg-white">
          {VIEWS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => goToView(key)}
              className={`px-4 py-2.5 text-[11px] font-semibold tracking-wide transition-all duration-150 cursor-pointer border-r border-[#EDE7DF] last:border-r-0
                ${activeView === key
                  ? "bg-[#1A1410] text-white"
                  : "text-[#999] hover:text-[#1A1410] hover:bg-[#F5F0E8]"
                }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Hint */}
      <p className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.18em] uppercase pointer-events-none select-none whitespace-nowrap text-[#C8B89A]">
        {locked ? "View locked · Use buttons to navigate" : "Free view · Drag to orbit · Scroll to zoom"}
      </p>
    </div>
  )
}
