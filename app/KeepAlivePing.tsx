'use client'

import { useEffect } from "react"

export default function KeepAlivePing() {
  useEffect(() => {
    const interval = setInterval(() => {
      fetch("https://selvaganapathyhydraulics-1.onrender.com/api/machines/get/dummy-id")
        .then(res => console.log("✅ Pinged backend:", res.status))
        .catch(err => console.error("❌ Ping failed:", err));
    }, 8 * 60 * 1000) // 8 minutes

    return () => clearInterval(interval)
  }, [])

  return null
}
