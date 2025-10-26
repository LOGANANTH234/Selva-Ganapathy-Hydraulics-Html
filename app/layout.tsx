import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import KeepAlivePing from "./KeepAlivePing" 

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Selva Ganapathi Hydraulics - Premium Woodbreaker Machines",
  description:
    "Leading manufacturer of hydraulic woodbreaker machines in Tamil Nadu. Electric and tractor-based solutions for efficient wood processing.",
  keywords:
    "woodbreaker, hydraulic machines, wood processing, Tamil Nadu, tractor woodbreaker, electric woodbreaker, log splitter, hydraulic press",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <KeepAlivePing /> {/* now imported from a client file */}
        {children}
      </body>
    </html>
  )
}
