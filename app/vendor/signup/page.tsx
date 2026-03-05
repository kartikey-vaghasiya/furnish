"use client"

import { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"

export default function VendorSignupPage() {
  const router = useRouter()
  const [name, setName]           = useState("")
  const [username, setUsername]   = useState("")
  const [password, setPassword]   = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError]         = useState("")
  const [loading, setLoading]     = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    const res = await fetch("/api/vendor/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, name }),
    })
    setLoading(false)
    if (res.ok) {
      router.push("/vendor/dashboard")
    } else {
      const data = await res.json()
      setError(data.error ?? "Signup failed")
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* ── Left panel ─────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[52%] bg-[#1A1410] flex-col justify-between p-14 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)", backgroundSize: "12px 12px" }}
        />

        <Link
          href="/"
          style={{ fontFamily: "var(--font-cormorant)", fontWeight: 400, letterSpacing: "0.22em", fontSize: "1.4rem" }}
          className="uppercase text-white/90 relative z-10"
        >
          Furnish
        </Link>

        <div className="relative z-10">
          <p
            style={{ fontFamily: "var(--font-cormorant)", fontWeight: 300, fontSize: "3rem", lineHeight: 1.15 }}
            className="text-white mb-6"
          >
            Join the finest<br />furniture<br />marketplace.
          </p>
          <p className="text-[#C8B89A] text-sm leading-relaxed max-w-xs">
            Create your vendor account in seconds. Upload GLB models, set prices, and start selling to customers who preview your pieces in 3D.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-4">
            {[["3D", "Upload models"], ["Live", "Real-time preview"], ["Track", "Purchase analytics"]].map(([label, sub]) => (
              <div key={label} className="border border-white/10 rounded-xl p-4">
                <p className="text-white font-semibold text-sm">{label}</p>
                <p className="text-[#888] text-[11px] mt-1 leading-snug">{sub}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[#555] text-[11px] tracking-[0.15em] uppercase relative z-10">
          Vendor Portal · Furnish
        </p>
      </div>

      {/* ── Right panel ────────────────────────────────── */}
      <div className="flex-1 bg-[#FDFAF6] flex items-center justify-center px-8 py-16">
        <div className="w-full max-w-[360px]">

          <Link
            href="/"
            style={{ fontFamily: "var(--font-cormorant)", fontWeight: 400, letterSpacing: "0.22em", fontSize: "1.3rem" }}
            className="uppercase text-[#1A1410] lg:hidden block mb-10"
          >
            Furnish
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-[#1A1410] tracking-tight">Create account</h1>
            <p className="text-[#888] text-sm mt-1">Start selling your furniture today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[11px] font-semibold tracking-[0.12em] uppercase text-[#999] mb-2">
                Brand / Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                placeholder="e.g. Modern Living Co."
                className="w-full px-4 py-3 rounded-xl border border-[#E8E1D8] text-sm text-[#1A1410] bg-white focus:outline-none focus:border-[#C8B89A] focus:ring-2 focus:ring-[#C8B89A]/20 transition-all placeholder:text-[#CCC]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold tracking-[0.12em] uppercase text-[#999] mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                autoComplete="username"
                placeholder="your_username"
                className="w-full px-4 py-3 rounded-xl border border-[#E8E1D8] text-sm text-[#1A1410] bg-white focus:outline-none focus:border-[#C8B89A] focus:ring-2 focus:ring-[#C8B89A]/20 transition-all placeholder:text-[#CCC]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold tracking-[0.12em] uppercase text-[#999] mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  placeholder="Min. 6 characters"
                  className="w-full px-4 py-3 pr-11 rounded-xl border border-[#E8E1D8] text-sm text-[#1A1410] bg-white focus:outline-none focus:border-[#C8B89A] focus:ring-2 focus:ring-[#C8B89A]/20 transition-all placeholder:text-[#CCC]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#BBB] hover:text-[#888] transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <p className="text-[12px] text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#1A1410] text-white text-[12px] font-semibold tracking-[0.15em] uppercase rounded-xl hover:bg-[#3D3026] active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer mt-1"
            >
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#EDE7DF] text-center">
            <p className="text-[13px] text-[#888]">
              Already have an account?{" "}
              <Link href="/vendor/login" className="text-[#1A1410] font-semibold hover:underline underline-offset-2">
                Sign in
              </Link>
            </p>
          </div>

        </div>
      </div>

    </div>
  )
}
