"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Expand } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"
import Link from "next/link"
import { FullscreenModal } from "./fullscreen-modal"
import { convertBase64ToBlob, type Machine } from "@/lib/api"

interface MachineListProps {
  machines: Machine[]
}

function ImageSlider({ images, alt, machineId }: { images: string[]; alt: string; machineId: string }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [fullscreenOpen, setFullscreenOpen] = useState(false)
  const [processedImages, setProcessedImages] = useState<string[]>([])

  // Process base64 images to blob URLs
  useEffect(() => {
    const processed = images.map((image) => {
      if (image.startsWith("data:image")) {
        return convertBase64ToBlob(image)
      }
      return image
    })
    setProcessedImages(processed)

    // Cleanup blob URLs when component unmounts
    return () => {
      processed.forEach((url) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url)
        }
      })
    }
  }, [images])

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % processedImages.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + processedImages.length) % processedImages.length)
  }

  const openFullscreen = () => {
    setFullscreenOpen(true)
  }

  if (processedImages.length === 0) {
    return (
      <div className="w-full h-64 bg-gray-200 rounded-t-lg flex items-center justify-center">
        <span className="text-gray-500">Loading image...</span>
      </div>
    )
  }

  return (
    <>
      <div className="relative group">
        <Image
          src={processedImages[currentIndex] || "/placeholder.svg"}
          alt={`${alt} - View ${currentIndex + 1}`}
          width={600}
          height={400}
          className="w-full h-64 object-cover rounded-t-lg"
        />

        {/* Expand button */}
        <Button
          size="sm"
          variant="outline"
          className="absolute top-2 right-2 bg-white/80 hover:bg-white border-gray-300 text-gray-700 hover:text-black w-8 h-8 p-0"
          onClick={openFullscreen}
        >
          <Expand className="h-4 w-4" />
        </Button>

        {processedImages.length > 1 && (
          <>
            <Button
              size="sm"
              variant="outline"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={prevImage}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <Button
              size="sm"
              variant="outline"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={nextImage}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>

            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
              {processedImages.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${index === currentIndex ? "bg-[#C62828]" : "bg-white/60"}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <FullscreenModal
        isOpen={fullscreenOpen}
        onClose={() => setFullscreenOpen(false)}
        images={processedImages}
        currentIndex={currentIndex}
        onIndexChange={setCurrentIndex}
        title={alt}
      />
    </>
  )
}

export function MachineList({ machines }: MachineListProps) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {machines.map((machine) => (
        <Card key={machine.id} className="overflow-hidden border-2 hover:border-[#C62828] transition-colors">
          <div className="relative">
            <ImageSlider images={machine.images} alt={machine.name} machineId={machine.id} />
            {/* Type Badge */}
            <Badge className="absolute top-2 left-2 bg-[#C62828] text-white border border-white">{machine.type}</Badge>
          </div>

          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-black">{machine.name}</CardTitle>
            <CardDescription className="text-sm">{machine.description}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
    <h4 className="font-semibold text-black mb-3 text-sm">Key Specifications</h4>
    <div className="space-y-2">
      {Object.entries(machine.keySpecs)
        .slice(0, 4) // Limit to the first 4 key specifications
        .map(([key, value]) => (
          <div key={key} className="flex justify-between text-sm py-1 border-b border-gray-100">
            <span className="text-gray-600">{key}:</span>
            <span className="font-medium text-black">{value}</span>
          </div>
                ))}
              </div>
            </div>

            {/* Pass machine name instead of ID */}
            <Link href={`/machine/${encodeURIComponent(machine.name)}`} className="w-full">
              <Button className="w-full bg-[#C62828] hover:bg-[#B71C1C] text-white">View Details</Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
