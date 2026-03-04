"use client"

import { Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, useGLTF, Environment } from "@react-three/drei"
import { FurnitureItem } from "@/lib/furniture"
import { useScene } from "@/context/SceneContext"

function ModelPreview({ model }: { model: string }) {
  const { scene } = useGLTF(model)
  return <primitive object={scene.clone(true)} />
}

interface Props {
  item: FurnitureItem
  index: number
  onTryOut: () => void
}

export default function FurnitureCard({ item, index, onTryOut }: Props) {
  const { placeItem } = useScene()

  const handleTryOut = () => {
    placeItem(item)
    onTryOut()
  }

  return (
    <article className="group flex flex-col bg-card border-border hover:border-foreground/20 transition-colors duration-300 border">

      {/* 3D preview */}
      <div className="relative bg-[#F2EDE5] overflow-hidden" style={{ height: "280px" }}>
        <Canvas camera={{ position: [0, 1.4, 3.2], fov: 40 }} gl={{ antialias: true }}>
          <ambientLight intensity={1} />
          <directionalLight position={[4, 6, 4]} intensity={0.9} />
          <Environment preset="apartment" />
          <Suspense fallback={null}>
            <ModelPreview model={item.model} />
          </Suspense>
          <OrbitControls
            enableZoom={false}
            autoRotate
            autoRotateSpeed={0.9}
            enablePan={false}
          />
        </Canvas>

        {/* Index tag */}
        <span className="absolute top-4 left-4 text-[10px] tracking-[0.25em] text-foreground/30 select-none">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      {/* Details */}
      <div className="p-6 flex items-end justify-between gap-4 border-t border-border">
        <div>
          <h3
            className="text-2xl leading-tight mb-1"
            style={{ fontFamily: "var(--font-cormorant)", fontWeight: 300 }}
          >
            {item.name}
          </h3>
          <p className="text-sm text-muted-foreground tracking-wide">${item.price}</p>
        </div>

        <button
          onClick={handleTryOut}
          className="shrink-0 text-[11px] font-medium tracking-[0.2em] uppercase bg-foreground text-background px-5 py-3 hover:bg-foreground/80 transition-colors duration-200 whitespace-nowrap"
        >
          Try it Out
        </button>
      </div>

    </article>
  )
}
