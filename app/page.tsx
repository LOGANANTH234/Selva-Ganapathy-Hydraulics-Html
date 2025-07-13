"use client"

import { Hero } from "@/components/hero"
import { MachineCategories } from "@/components/machine-categories"
import { VideoGallery } from "@/components/video-gallery"
import { DeliveredMachines } from "@/components/delivered-machines"
import { Contact } from "@/components/contact"
import { FloatingNavButton } from "@/components/floating-nav-button"
import { useState } from "react"

export default function Home() {
  const [isAnyFullscreenOpen, setIsAnyFullscreenOpen] = useState(false)

  return (
    <main className="min-h-screen bg-white border border-gray-200">
      <Hero />
      <MachineCategories />
      <VideoGallery onFullscreenChange={setIsAnyFullscreenOpen} isAdmin={false} />
      <DeliveredMachines onFullscreenChange={setIsAnyFullscreenOpen} />
      <Contact />
      <FloatingNavButton isFullscreenOpen={isAnyFullscreenOpen} />
    </main>
  )
}

