"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface FullscreenModalProps {
  isOpen: boolean
  onClose: () => void
  images: string[]
  currentIndex: number
  onIndexChange: (index: number) => void
  title: string
}

export function FullscreenModal({ isOpen, onClose, images, currentIndex, onIndexChange, title }: FullscreenModalProps) {
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    const handleArrowKeys = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        prevImage()
      } else if (e.key === "ArrowRight") {
        nextImage()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.addEventListener("keydown", handleArrowKeys)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.removeEventListener("keydown", handleArrowKeys)
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  const nextImage = () => {
    if (images.length > 1) {
      onIndexChange((currentIndex + 1) % images.length)
    }
  }

  const prevImage = () => {
    if (images.length > 1) {
      onIndexChange((currentIndex - 1 + images.length) % images.length)
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe && images.length > 1) {
      nextImage()
    }
    if (isRightSwipe && images.length > 1) {
      prevImage()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
      {/* Close button */}
      <Button
        size="icon"
        variant="outline"
        className="absolute top-4 right-4 z-10 bg-white/10 border-white/20 text-white hover:bg-white/20"
        onClick={onClose}
      >
        <X className="h-6 w-6" />
      </Button>

      {/* Navigation buttons */}
      {images.length > 1 && (
        <>
          <Button
            size="icon"
            variant="outline"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 border-white/20 text-white hover:bg-white/20"
            onClick={prevImage}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <Button
            size="icon"
            variant="outline"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 border-white/20 text-white hover:bg-white/20"
            onClick={nextImage}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}

      {/* Image container */}
      <div
        className="relative w-full h-full flex items-center justify-center p-8"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          src={images[currentIndex] || "/placeholder.svg"}
          alt={`${title} - View ${currentIndex + 1}`}
          width={1200}
          height={800}
          className="max-w-full max-h-full object-contain"
          priority
        />

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full">
            {currentIndex + 1} of {images.length}
          </div>
        )}

        {/* Dot indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex ? "bg-white scale-110" : "bg-white/50"
                }`}
                onClick={() => onIndexChange(index)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
