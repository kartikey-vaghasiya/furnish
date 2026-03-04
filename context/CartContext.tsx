"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import { FurnitureItem } from "@/lib/furniture"

interface CartItem extends FurnitureItem {
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  add: (item: FurnitureItem) => void
  remove: (id: number) => void
  clear: () => void
  totalCount: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const add = (item: FurnitureItem) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id)
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  const remove = (id: number) => {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  const clear = () => setItems([])

  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0)
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, add, remove, clear, totalCount, totalPrice }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}
