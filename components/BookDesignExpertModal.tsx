"use client"

import { useState } from "react"
import { X } from "lucide-react"

interface BookingFormData {
  slot: string
  name: string
  phone: string
  email: string
}

interface Props {
  open: boolean
  onClose: () => void
}

const AVAILABLE_SLOTS = [
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
]

export default function BookDesignExpertModal({ open, onClose }: Props) {
  const [formData, setFormData] = useState<BookingFormData>({
    slot: "",
    name: "",
    phone: "",
    email: "",
  })

  const [submitted, setSubmitted] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.slot && formData.name && formData.phone && formData.email) {
      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        setFormData({ slot: "", name: "", phone: "", email: "" })
        onClose()
      }, 2000)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#1A1410]">Book Design Expert</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#999] hover:text-[#1A1410] hover:bg-[#F5F0E8] transition-colors"
          >
            <X className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center">
            <div className="mb-4 text-5xl">✓</div>
            <p className="text-lg font-semibold text-[#1A1410] mb-2">Booking Confirmed!</p>
            <p className="text-sm text-[#999]">
              Our design expert will contact you shortly at {formData.phone}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Time Slot Selection */}
            <div>
              <label className="block text-sm font-semibold text-[#1A1410] mb-2">
                Select Time Slot *
              </label>
              <select
                name="slot"
                value={formData.slot}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 border border-[#EDE7DF] rounded-lg focus:outline-none focus:border-[#1A1410] bg-white text-[#1A1410]"
              >
                <option value="">Choose a time...</option>
                {AVAILABLE_SLOTS.map(slot => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>

            {/* Name Input */}
            <div>
              <label className="block text-sm font-semibold text-[#1A1410] mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter your name"
                className="w-full px-4 py-2.5 border border-[#EDE7DF] rounded-lg focus:outline-none focus:border-[#1A1410] text-[#1A1410] placeholder-[#CCC]"
              />
            </div>

            {/* Phone Input */}
            <div>
              <label className="block text-sm font-semibold text-[#1A1410] mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                placeholder="Enter your phone number"
                className="w-full px-4 py-2.5 border border-[#EDE7DF] rounded-lg focus:outline-none focus:border-[#1A1410] text-[#1A1410] placeholder-[#CCC]"
              />
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-semibold text-[#1A1410] mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="Enter your email"
                className="w-full px-4 py-2.5 border border-[#EDE7DF] rounded-lg focus:outline-none focus:border-[#1A1410] text-[#1A1410] placeholder-[#CCC]"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-6 bg-[#1A1410] text-white font-bold py-2.5 rounded-lg hover:bg-[#3D3026] transition-colors cursor-pointer"
            >
              Confirm Booking
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
