"use client"

import { ShoppingBag } from "lucide-react"
import { useCart } from "@/context/CartContext"

interface Props {
  onCartClick: () => void
}

export default function Navbar({ onCartClick }: Props) {
  const { totalCount } = useCart()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="max-w-screen-2xl mx-auto px-10 h-16 flex items-center justify-between">

        <span
          className="text-2xl tracking-[0.18em] uppercase"
          style={{ fontFamily: "var(--font-cormorant)", fontWeight: 400, letterSpacing: "0.22em" }}
        >
          Furnish
        </span>

        <button
          onClick={onCartClick}
          className="relative flex items-center gap-2.5 text-xs tracking-[0.18em] uppercase font-medium hover:opacity-60 transition-opacity"
        >
          <ShoppingBag className="w-[18px] h-[18px]" strokeWidth={1.5} />
          <span>Cart</span>
          {totalCount > 0 && (
            <span className="absolute -top-2.5 -right-3 w-5 h-5 bg-foreground text-background text-[10px] rounded-full flex items-center justify-center font-semibold">
              {totalCount}
            </span>
          )}
        </button>

      </div>
    </nav>
  )
}
