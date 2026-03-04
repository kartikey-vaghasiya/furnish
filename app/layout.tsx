import type { Metadata } from "next"
import { Geist } from "next/font/google"
import { Cormorant_Garamond } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/context/CartContext"
import { SceneProvider } from "@/context/SceneContext"
import { Toaster } from "@/components/ui/sonner"

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" })
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  variable: "--font-cormorant",
})

export const metadata: Metadata = {
  title: "Furnish — Design Your Space",
  description: "Preview furniture in your space before you buy.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${cormorant.variable} font-sans antialiased`}>
        <CartProvider>
          <SceneProvider>
            {children}
            <Toaster position="bottom-right" />
          </SceneProvider>
        </CartProvider>
      </body>
    </html>
  )
}
