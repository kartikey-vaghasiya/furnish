"use client"

import { Suspense } from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, useGLTF, Environment } from "@react-three/drei"
import { X } from "lucide-react"

function Model({ model }: { model: string }) {
  const { scene } = useGLTF(model)
  return <primitive object={scene.clone(true)} />
}

interface Props {
  open: boolean
  onClose: () => void
  name: string
  price: number
  model: string
}

export default function FurniturePreviewModal({ open, onClose, name, price, model }: Props) {
  return (
    <Dialog.Root open={open} onOpenChange={v => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl border border-[#EDE7DF] shadow-2xl overflow-hidden">

          {/* 3D Viewer */}
          <div style={{ height: 320, background: "#F5F0E8", position: "relative" }}>
            <Canvas camera={{ position: [0, 1.2, 3.2], fov: 42 }} gl={{ antialias: true }}>
              <ambientLight intensity={1.3} />
              <directionalLight position={[4, 6, 4]} intensity={0.8} />
              <Environment preset="apartment" />
              <Suspense fallback={null}>
                <Model model={model} />
              </Suspense>
              <OrbitControls
                autoRotate
                autoRotateSpeed={0.8}
                enableZoom={true}
                enablePan={false}
                minDistance={1}
                maxDistance={8}
              />
            </Canvas>
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-[#888] hover:text-[#1A1410] transition-colors shadow cursor-pointer"
            >
              <X className="w-4 h-4" strokeWidth={2} />
            </button>
            <p className="absolute bottom-3 left-0 right-0 text-center text-[10px] tracking-[0.18em] uppercase text-[#C8B89A] pointer-events-none">
              Drag to orbit · Scroll to zoom
            </p>
          </div>

          {/* Info */}
          <div className="px-7 py-5 flex items-center justify-between">
            <div>
              <Dialog.Title
                style={{ fontFamily: "var(--font-cormorant)", fontWeight: 300, fontSize: "1.5rem" }}
                className="text-[#1A1410] leading-tight"
              >
                {name}
              </Dialog.Title>
              <p className="text-[11px] tracking-[0.15em] uppercase text-[#AAA] mt-1">3D Preview</p>
            </div>
            <span
              style={{ fontFamily: "var(--font-cormorant)", fontWeight: 400, fontSize: "1.4rem" }}
              className="text-[#1A1410]"
            >
              ${price}
            </span>
          </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
