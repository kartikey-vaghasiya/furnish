"use client"

import { FURNITURE } from "@/lib/furniture"
import FurnitureCard from "./FurnitureCard"

interface Props {
  onTryOut: () => void
}

export default function FurnitureListing({ onTryOut }: Props) {
  return (
    <section className="bg-background">

      {/* Section header */}
      <div className="max-w-screen-2xl mx-auto px-10 pt-20 pb-10">
        <div className="flex items-end justify-between border-b border-border pb-8">
          <div>
            <p className="text-xs tracking-[0.35em] uppercase text-muted-foreground mb-4">
              The Collection
            </p>
            <h2
              style={{ fontFamily: "var(--font-cormorant)", fontWeight: 300 }}
              className="text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.95]"
            >
              Curated Pieces
            </h2>
          </div>
          <p className="hidden md:block text-sm text-muted-foreground max-w-[220px] text-right leading-relaxed mb-1">
            Try any piece in the room before adding to your selection.
          </p>
        </div>
      </div>

      {/* Grid — borderless tight layout */}
      <div className="max-w-screen-2xl mx-auto px-10 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FURNITURE.map((item, i) => (
            <FurnitureCard key={item.id} item={item} index={i} onTryOut={onTryOut} />
          ))}
        </div>
      </div>

    </section>
  )
}
