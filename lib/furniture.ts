export interface FurnitureItem {
  id: number
  name: string
  model: string
  price: number
}

export const FURNITURE: FurnitureItem[] = [
  { id: 1, name: "Sofa",       model: "/models/Sofa.glb",      price: 899 },
  { id: 2, name: "Desk Table", model: "/models/DeskTable.glb", price: 499 },
  { id: 3, name: "Lamp",       model: "/models/Lamp.glb",      price: 149 },
  { id: 4, name: "Plant",      model: "/models/Plant.glb",     price:  79 },
]
