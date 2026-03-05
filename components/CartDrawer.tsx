"use client"

import { X } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useCart } from "@/context/CartContext"
import { toast } from "sonner"

interface Props {
  open: boolean
  onClose: () => void
}

export default function CartDrawer({ open, onClose }: Props) {
  const { items, remove, clear, totalPrice } = useCart()

  const handlePlaceOrder = async () => {
    await fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: items.map(i => ({ id: i.id, quantity: i.quantity })) }),
    }).catch(() => {})
    clear()
    onClose()
    toast.success("Order confirmed — we'll be in touch shortly.")
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="flex flex-col w-full sm:max-w-[400px] p-0 gap-0 border-l border-border">

        {/* Header */}
        <SheetHeader className="px-8 py-6 border-b border-border">
          <SheetTitle
            style={{ fontFamily: "var(--font-cormorant)", fontWeight: 300 }}
            className="text-2xl tracking-wide text-left"
          >
            Your Selection
          </SheetTitle>
          {items.length > 0 && (
            <p className="text-xs text-muted-foreground tracking-[0.2em] uppercase mt-1">
              {items.length} {items.length === 1 ? "piece" : "pieces"} selected
            </p>
          )}
        </SheetHeader>

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-72 px-8 text-center">
              <p
                style={{ fontFamily: "var(--font-cormorant)", fontWeight: 300 }}
                className="text-4xl text-muted-foreground mb-3"
              >
                Empty
              </p>
              <p className="text-xs text-muted-foreground tracking-wide leading-relaxed">
                Place a piece into the room, then click it to add to your selection.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {items.map(item => (
                <div key={item.id} className="flex items-center gap-4 px-8 py-5">
                  <div className="flex-1 min-w-0">
                    <p
                      style={{ fontFamily: "var(--font-cormorant)", fontWeight: 300 }}
                      className="text-xl leading-tight"
                    >
                      {item.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 tracking-wide">
                      ${item.price} × {item.quantity}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium tabular-nums">${item.price * item.quantity}</span>
                    <button
                      onClick={() => remove(item.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                      aria-label="Remove"
                    >
                      <X className="w-4 h-4" strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border px-8 py-7 space-y-5 bg-card">
            <div className="flex justify-between items-center">
              <span className="text-xs tracking-[0.25em] uppercase text-muted-foreground">Total</span>
              <span
                style={{ fontFamily: "var(--font-cormorant)", fontWeight: 400 }}
                className="text-2xl"
              >
                ${totalPrice}
              </span>
            </div>
            <button
              onClick={handlePlaceOrder}
              className="w-full py-4 bg-foreground text-background text-[11px] tracking-[0.3em] uppercase font-medium hover:bg-foreground/85 transition-colors"
            >
              Confirm Order
            </button>
          </div>
        )}

      </SheetContent>
    </Sheet>
  )
}
