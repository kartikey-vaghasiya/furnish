"use client"

import { useState, FormEvent, useRef } from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { X } from "lucide-react"

interface Props {
  open: boolean
  onClose: () => void
  onAdded: () => void
}

export default function AddFurnitureModal({ open, onClose, onAdded }: Props) {
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError("")
    const file = fileRef.current?.files?.[0]
    if (!file) { setError("Please select a GLB file."); return }

    setLoading(true)
    const form = new FormData()
    form.append("name", name)
    form.append("price", price)
    form.append("file", file)

    const res = await fetch("/api/vendor/furniture", { method: "POST", body: form })
    setLoading(false)

    if (res.ok) {
      setName(""); setPrice(""); if (fileRef.current) fileRef.current.value = ""
      onAdded()
      onClose()
    } else {
      const data = await res.json()
      setError(data.error ?? "Upload failed")
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={v => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 z-50" />
        <Dialog.Content className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white rounded-2xl border border-[#EDE7DF] shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="text-[13px] font-bold tracking-wide text-[#1A1410]">
              Add New Furniture
            </Dialog.Title>
            <button onClick={onClose} className="text-[#BBB] hover:text-[#1A1410] transition-colors cursor-pointer">
              <X className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold tracking-[0.15em] uppercase text-[#888] mb-1.5">Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-[#EDE7DF] text-sm text-[#1A1410] bg-[#FDFAF6] focus:outline-none focus:border-[#C8B89A] transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold tracking-[0.15em] uppercase text-[#888] mb-1.5">Price ($)</label>
              <input
                type="number"
                value={price}
                onChange={e => setPrice(e.target.value)}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-2.5 rounded-lg border border-[#EDE7DF] text-sm text-[#1A1410] bg-[#FDFAF6] focus:outline-none focus:border-[#C8B89A] transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold tracking-[0.15em] uppercase text-[#888] mb-1.5">GLB File</label>
              <input
                ref={fileRef}
                type="file"
                accept=".glb"
                required
                className="w-full text-sm text-[#888] file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-[11px] file:font-bold file:uppercase file:tracking-wide file:bg-[#F5F0E8] file:text-[#1A1410] hover:file:bg-[#EDE5D8] file:cursor-pointer"
              />
            </div>

            {error && <p className="text-[11px] text-red-500 tracking-wide">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#1A1410] text-white text-[11px] font-bold tracking-[0.2em] uppercase rounded-full hover:bg-[#3D3026] transition-colors disabled:opacity-50 cursor-pointer mt-2"
            >
              {loading ? "Uploading…" : "Add Furniture"}
            </button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
