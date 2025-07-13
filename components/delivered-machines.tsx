"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, CheckCircle, ChevronLeft, ChevronRight, Expand } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useRef, useState, useEffect } from "react"
import { FullscreenModal } from "./fullscreen-modal"
import { getAllDeliveredMachines, convertBase64ToBlob, type DeliveredMachine } from "@/lib/api"
import { LoadingSpinner } from "./loading-spinner"

interface DeliveredMachinesProps {
  onFullscreenChange?: (isOpen: boolean) => void
}

export function DeliveredMachines({ onFullscreenChange }: DeliveredMachinesProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [fullscreenOpen, setFullscreenOpen] = useState(false)
  const [fullscreenIndex, setFullscreenIndex] = useState(0)
  const [fullscreenImages, setFullscreenImages] = useState<string[]>([])
  const [fullscreenTitle, setFullscreenTitle] = useState("")
  const [deliveredMachines, setDeliveredMachines] = useState<DeliveredMachine[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [processedImages, setProcessedImages] = useState<Record<string, string>>({})

  // Fetch delivered machines when component mounts
  useEffect(() => {
    const fetchDeliveredMachines = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await getAllDeliveredMachines()
        if (response.error) {
          throw new Error(response.error)
        }

        setDeliveredMachines(response.data)

        // Process images
        const images: Record<string, string> = {}
        response.data.forEach((machine) => {
          if (machine.image && machine.image.startsWith("data:image")) {
            images[machine.id] = convertBase64ToBlob(machine.image)
          }
        })
        setProcessedImages(images)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load delivered machines")
      } finally {
        setLoading(false)
      }
    }

    fetchDeliveredMachines()

    // Cleanup blob URLs when component unmounts
    return () => {
      Object.values(processedImages).forEach((url) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url)
        }
      })
    }
  }, [])

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const cardWidth = 350
      const gap = 24
      const scrollAmount = cardWidth + gap
      scrollContainerRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const cardWidth = 350
      const gap = 24
      const scrollAmount = cardWidth + gap
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  const openFullscreen = (delivery: DeliveredMachine) => {
    const imageSrc = processedImages[delivery.id] || "/placeholder.svg"
    setFullscreenImages([imageSrc])
    setFullscreenIndex(0)
    setFullscreenTitle(delivery.machineName)
    setFullscreenOpen(true)
    onFullscreenChange?.(true)
  }

  const closeFullscreen = () => {
    setFullscreenOpen(false)
    onFullscreenChange?.(false)
  }

  if (loading) {
    return (
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6 border-b border-gray-200 pb-4">
            <h2 className="text-2xl lg:text-3xl font-bold text-black mb-3">Successfully Delivered Machines</h2>
            <p className="text-gray-600 text-base max-w-2xl mx-auto">
              Proud to serve customers across India with our reliable and efficient woodbreaker machines.
            </p>
          </div>

          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3">
              <LoadingSpinner />
              <span className="text-gray-600">Loading delivered machines...</span>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6 border-b border-gray-200 pb-4">
            <h2 className="text-2xl lg:text-3xl font-bold text-black mb-3">Successfully Delivered Machines</h2>
          </div>

          <div className="text-center py-12 border border-gray-200 rounded-lg bg-red-50">
            <p className="text-red-600 text-lg mb-4">Error loading delivered machines: {error}</p>
            <Button
              variant="outline"
              className="border-[#C62828] text-[#C62828] hover:bg-[#C62828] hover:text-white bg-transparent"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-8 bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6 border-b border-gray-200 pb-4">
          <h2 className="text-2xl lg:text-3xl font-bold text-black mb-3">Successfully Delivered Machines</h2>
          <p className="text-gray-600 text-base max-w-2xl mx-auto">
            Proud to serve customers across India with our reliable and efficient woodbreaker machines.
          </p>
        </div>

        <div className="relative border border-gray-200 rounded-lg bg-gray-50 p-4">
          {/* Navigation buttons positioned in center - reduced size */}
          <Button
            size="sm"
            variant="outline"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white border-[#C62828] text-[#C62828] hover:bg-[#C62828] hover:text-white shadow-lg w-8 h-8 p-0"
            onClick={scrollLeft}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white border-[#C62828] text-[#C62828] hover:bg-[#C62828] hover:text-white shadow-lg w-8 h-8 p-0"
            onClick={scrollRight}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-6 py-4 px-12 scrollbar-hide scroll-smooth"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              scrollSnapType: "x mandatory",
            }}
          >
            {deliveredMachines.map((delivery) => {
              const imageSrc = processedImages[delivery.id] || "/placeholder.svg"

              return (
                <Card
                  key={delivery.id}
                  className="flex-shrink-0 w-[350px] overflow-hidden hover:shadow-lg transition-shadow border-2 border-gray-200"
                  style={{ scrollSnapAlign: "center" }}
                >
                  <div className="relative border-b border-gray-200">
                    <Image
                      src={imageSrc || "/placeholder.svg"}
                      alt={`${delivery.machineName} delivered to ${delivery.customerName}`}
                      width={350}
                      height={250}
                      className="w-full h-48 object-cover"
                    />

                    {/* Expand button */}
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white border-gray-300 text-gray-700 hover:text-black w-8 h-8 p-0"
                      onClick={() => openFullscreen(delivery)}
                    >
                      <Expand className="h-4 w-4" />
                    </Button>

                    <Badge className="absolute top-3 left-3 bg-green-600 text-white border border-white">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Delivered
                    </Badge>
                  </div>

                  <CardHeader className="pb-3 border-b border-gray-100">
                    <CardTitle className="text-base text-black">{delivery.machineName}</CardTitle>
                    <CardDescription className="font-medium text-[#C62828]">{delivery.customerName}</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-3 pt-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600 border-b border-gray-100 pb-2">
                      <MapPin className="w-4 h-4 text-[#C62828]" />
                      {delivery.location}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600 border-b border-gray-100 pb-2">
                      <Calendar className="w-4 h-4 text-[#C62828]" />
                      {delivery.deliveryDate}
                    </div>

                    <p className="text-gray-700 text-sm border-b border-gray-100 pb-2">{delivery.description}</p>

                    <div>
                      <h4 className="font-semibold text-black text-sm mb-1">Working Mechanism:</h4>
                      <p className="text-gray-600 text-xs">{delivery.workingMechanism}</p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        <div className="text-center mt-8">
          <div className="inline-flex items-center gap-4 bg-gray-50 px-6 py-4 rounded-lg border border-gray-200">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div className="text-left">
              <p className="font-semibold text-black">{deliveredMachines.length + 50 }+ Machines Delivered</p>
              <p className="text-gray-600 text-sm">Across 10+ States in India</p>
            </div>
          </div>
        </div>

        <FullscreenModal
          isOpen={fullscreenOpen}
          onClose={closeFullscreen}
          images={fullscreenImages}
          currentIndex={fullscreenIndex}
          onIndexChange={setFullscreenIndex}
          title={fullscreenTitle}
        />

        <style jsx global>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    </section>
  )
}
