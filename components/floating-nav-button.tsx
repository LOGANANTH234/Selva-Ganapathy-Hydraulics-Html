"use client"

import { Button } from "@/components/ui/button"
import { ArrowUp } from "lucide-react"
import { useState, useEffect } from "react"

interface FloatingNavButtonProps {
  isFullscreenOpen?: boolean
}

export function FloatingNavButton({ isFullscreenOpen = false }: FloatingNavButtonProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      const machineCategoriesSection = document.getElementById("machine-categories")
      if (machineCategoriesSection) {
        const rect = machineCategoriesSection.getBoundingClientRect()
        // Show button when machine categories section is passed (top of section is above viewport)
        setIsVisible(rect.top < 0)
      }
    }

    window.addEventListener("scroll", toggleVisibility)
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  const scrollToMachineCategories = () => {
    const machineCategoriesSection = document.getElementById("machine-categories")
    if (machineCategoriesSection) {
      machineCategoriesSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Don't show the button if fullscreen is open or if not visible based on scroll position
  if (!isVisible || isFullscreenOpen) return null

  return (
    <Button
      onClick={scrollToMachineCategories}
      className="fixed bottom-6 right-6 z-50 bg-[#C62828] hover:bg-[#B71C1C] text-white rounded-full w-14 h-14 shadow-lg border-2 border-white"
      size="icon"
    >
      <ArrowUp className="w-6 h-6" />
    </Button>
  )
}
