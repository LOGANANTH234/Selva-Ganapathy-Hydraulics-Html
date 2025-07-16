'use client'

import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { useEffect } from "react"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Selva Ganapathi Hydraulics - Premium Woodbreaker Machines",
  description:
    "Leading manufacturer of hydraulic woodbreaker machines in Tamil Nadu. Electric and tractor-based solutions for efficient wood processing.",
  keywords:
    "woodbreaker, hydraulic machines, wood processing, Tamil Nadu, tractor woodbreaker, electric woodbreaker, log splitter, hydraulic press",
  generator: "v0.dev",
}

// 🔁 KeepAlivePing Component defined directly inside layout.tsx
function KeepAlivePing() {
  useEffect(() => {
    const interval = setInterval(() => {
      fetch("https://selvaganapathyhydraulics-1.onrender.com/api/machines/get/dummy-id")
        .then(res => console.log("✅ Pinged backend:", res.status))
        .catch(err => console.error("❌ Ping failed:", err));
    }, 8 * 60 * 1000); // every 8 minutes

    return () => clearInterval(interval);
  }, []);

  return null;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <KeepAlivePing /> {/* 🧠 This will ping backend every 2 mins */}
        {children}
      </body>
    </html>
  )
}
