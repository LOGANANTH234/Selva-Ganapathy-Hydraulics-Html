"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { ArrowLeft, FileText, Play,Expand } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect, useRef, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { FullscreenModal } from "@/components/fullscreen-modal"
import { getMachineDetails, convertBase64ToBlob, type MachineDetail } from "@/lib/api"
import { LoadingSpinner } from "@/components/loading-spinner"
// Import the QuotationDialog
import { QuotationDialog } from "@/components/quotation-dialog"

export default function MachinePage() {
  const params = useParams()
  const router = useRouter()
  const machineId = params.id as string
  const [machine, setMachine] = useState<MachineDetail | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [fullscreenOpen, setFullscreenOpen] = useState(false)
  const [fullscreenVideoOpen, setFullscreenVideoOpen] = useState(false)
  const [fullscreenVideoIndex, setFullscreenVideoIndex] = useState(0)
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [processedImages, setProcessedImages] = useState<string[]>([])
  const [hasLoaded, setHasLoaded] = useState(false) // Prevent repeated loading
  const imageContainerRef = useRef<HTMLDivElement>(null)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  // Add state for quotation dialog
  const [quotationDialogOpen, setQuotationDialogOpen] = useState(false)

  // Scroll to top when component mounts or machine changes
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [machineId])

  useEffect(() => {
    // Prevent repeated API calls for the same machine
    if (hasLoaded && machine?.name === decodeURIComponent(machineId)) {
      return
    }

    const fetchMachineDetails = async () => {
      setLoading(true)
      setError(null)

      try {
        // Decode the machine name from URL - this is the actual machine name now
        const machineName = decodeURIComponent(machineId)
        console.log("Fetching machine details for:", machineName)

        // Try electric first, then tractor
        let response = await getMachineDetails(machineName, "electric")
        console.log("Electric response:", response)

        if (response.error || !response.data || !response.data.name) {
          console.log("Trying tractor...")
          response = await getMachineDetails(machineName, "tractor")
          console.log("Tractor response:", response)
        }

        if (response.error || !response.data || !response.data.name) {
          throw new Error(response.error || "Machine not found")
        }

        console.log("Machine data:", response.data)
        setMachine(response.data)
        setHasLoaded(true) // Mark as loaded to prevent repeated calls

        // Process images if they exist
        if (response.data.images && response.data.images.length > 0) {
          const processed = response.data.images.map((image) => {
            if (image && image.startsWith("data:image")) {
              return convertBase64ToBlob(image)
            }
            return image || "/placeholder.svg"
          })
          setProcessedImages(processed)
        } else {
          // Fallback to placeholder if no images
          setProcessedImages(["/placeholder.svg"])
        }
      } catch (err) {
        console.error("Error fetching machine details:", err)
        setError(err instanceof Error ? err.message : "Failed to load machine details")
      } finally {
        setLoading(false)
      }
    }

    if (machineId) {
      fetchMachineDetails()
    }

    // Cleanup blob URLs when component unmounts
    return () => {
      processedImages.forEach((url) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url)
        }
      })
    }
  }, [machineId, hasLoaded, machine?.name])

  // Touch handlers for swipe functionality
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

    if (isLeftSwipe && processedImages.length > 1) {
      nextImage()
    }
    if (isRightSwipe && processedImages.length > 1) {
      prevImage()
    }
  }

  // Mouse handlers for desktop drag functionality
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState<number | null>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart(e.clientX)
  }

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !dragStart) return

      const distance = dragStart - e.clientX
      const isLeftDrag = distance > 50
      const isRightDrag = distance < -50

      if (isLeftDrag && processedImages.length > 1) {
        nextImage()
        setIsDragging(false)
        setDragStart(null)
      }
      if (isRightDrag && processedImages.length > 1) {
        prevImage()
        setIsDragging(false)
        setDragStart(null)
      }
    },
    [isDragging, dragStart, processedImages],
  )

  const handleMouseUp = () => {
    setIsDragging(false)
    setDragStart(null)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, handleMouseMove])

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % processedImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + processedImages.length) % processedImages.length)
  }

  // Replace the generateQuotation function:
  const generateQuotation = async () => {
    if (!machine) return
    setQuotationDialogOpen(true)
  }

  const openImageFullscreen = () => {
    setFullscreenOpen(true)
  }

   const openVideoFullscreen = (url: string) => {
    console.log(url)
    const videoId = extractYouTubeVideoId(url);
    setVideoUrl(`https://www.youtube.com/embed/${videoId}?autoplay=1`);
  
    setIsVideoOpen(true);
  };

  const extractYouTubeVideoId = (url: string): string => {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname;
    const pathname = parsedUrl.pathname;

    // 1. Handle https://www.youtube.com/watch?v=VIDEO_ID
    if (hostname.includes("youtube.com") && parsedUrl.searchParams.get("v")) {
      return parsedUrl.searchParams.get("v") || "";
    }

    // 2. Handle https://youtu.be/VIDEO_ID or https://youtu.be/VIDEO_ID?t=10
    if (hostname === "youtu.be") {
      return pathname.slice(1).split("?")[0];
    }

    // 3. Handle https://www.youtube.com/embed/VIDEO_ID
    if (pathname.startsWith("/embed/")) {
      return pathname.split("/embed/")[1].split("/")[0];
    }

    // 4. Handle https://www.youtube.com/shorts/VIDEO_ID
    if (pathname.startsWith("/shorts/")) {
      return pathname.split("/shorts/")[1].split("/")[0];
    }

    return "";
  } catch (error) {
    console.error("Invalid YouTube URL:", url);
    return "";
  }
};

  // Function to close video modal
  const closeVideoFullscreen = () => {
    setIsVideoOpen(false); // Close video modal
    setVideoUrl(""); // Clear video URL
  };
  // Full screen loading overlay
  if (loading) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner size="large" />
          <span className="text-gray-600 text-lg">Loading machine details...</span>
        </div>
      </div>
    )
  }

  if (error || !machine) {
    return (
      <div className="min-h-screen flex items-center justify-center border border-gray-200">
        <div className="text-center py-12">
          <p className="text-red-600 text-lg mb-4">Error: {error || "Machine not found"}</p>
          <div className="space-x-4">
            <Button
              variant="outline"
              className="border-[#C62828] text-[#C62828] hover:bg-[#C62828] hover:text-white bg-transparent"
              onClick={() => router.back()}
            >
              Go Back
            </Button>
            <Button
              variant="outline"
              className="border-[#C62828] text-[#C62828] hover:bg-[#C62828] hover:text-white bg-transparent"
              onClick={() => {
                setHasLoaded(false) // Reset loading state
                window.location.reload()
              }}
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-white border border-gray-200">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6 border-b border-gray-200 pb-4">
          <Link href={`/${machine.parentType}-machines`}>
            <Button
              variant="outline"
              className="mb-4 border-[#C62828] text-[#C62828] hover:bg-[#C62828] hover:text-white bg-transparent"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to {machine.parentType === "electric" ? "Electric" : "Tractor"} Machines
            </Button>
          </Link>
          <h1 className="text-2xl lg:text-3xl font-bold text-black mb-2">{machine.name}</h1>
          <p className="text-gray-600 text-base">{machine.description || "No description available"}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Image Gallery with Swipe/Drag */}
          <div className="space-y-4 border border-gray-200 rounded-lg p-4">
            <div
              ref={imageContainerRef}
              className="relative rounded-lg overflow-hidden border border-gray-200 cursor-grab active:cursor-grabbing select-none"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
            >
              <Image
                src={processedImages[currentImageIndex] || "/placeholder.svg"}
                alt={machine.name}
                width={800}
                height={600}
                className="w-full h-[350px] object-cover pointer-events-none"
                draggable={false}
              />

              {/* Expand button - only for images */}
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2 bg-white/80 hover:bg-white border-gray-300 text-gray-700 hover:text-black w-8 h-8 p-0"
                onClick={openImageFullscreen}
              >
                <Expand className="h-4 w-4" />
              </Button>

              {processedImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {processedImages.map((_, index: number) => (
                    <button
                      key={index}
                      className={`w-3 h-3 rounded-full border transition-all ${
                        index === currentImageIndex
                          ? "bg-[#C62828] border-white scale-110"
                          : "bg-white/60 border-gray-300"
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 border-t border-gray-200 pt-2">
              {processedImages.map((image: string, index: number) => (
                <button
                  key={index}
                  className={`flex-shrink-0 border-2 rounded overflow-hidden transition-all ${
                    index === currentImageIndex ? "border-[#C62828] scale-105" : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${machine.name} view ${index + 1}`}
                    width={80}
                    height={60}
                    className="pointer-events-none"
                    draggable={false}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Machine Details */}
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h2 className="text-lg font-bold mb-4 text-black border-b border-gray-200 pb-2">Key Specifications</h2>
              <div className="space-y-2">
                {machine.keySpecs && Object.keys(machine.keySpecs).length > 0 ? (
                  Object.entries(machine.keySpecs).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-200 last:border-b-0">
                      <span className="text-gray-600 font-medium">{key}:</span>
                      <span className="font-semibold text-black">{value}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No specifications available</p>
                )}
              </div>
            </div>

            <div className="space-y-3 border border-gray-200 rounded-lg p-4">
              <h2 className="text-lg font-bold text-black border-b border-gray-200 pb-2">Working Mechanism</h2>
              <p className="text-gray-700 leading-relaxed text-sm">
                {machine.workingMechanism || "Working mechanism details will be updated soon."}
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 space-y-3">
              <Button className="w-full bg-[#C62828] hover:bg-[#B71C1C] text-white py-4" onClick={generateQuotation}>
                <FileText className="w-5 h-5 mr-2" />
                Generate & Download Quotation
              </Button>

              <p className="text-xs text-gray-500 text-center">
                Click to generate a detailed PDF quotation with specifications and pricing
              </p>
            </div>
          </div>
        </div>
        
   {machine.videoLink && Object.keys(machine.videoLink).length > 0 && (
  <div className="border border-gray-200 rounded-lg p-4">
    <h2 className="text-xl font-bold mb-4 text-black border-b border-gray-200 pb-2">
      Demonstration Videos
    </h2>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Object.entries(machine.videoLink).map(([_, videoUrl], index) => {
        const videoIdMatch = videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([^?&]+)/);
        const videoId = videoIdMatch ? videoIdMatch[1] : null;
        const thumbnailUrl = videoId
          ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
          : ""; // fallback

        return (
          <div key={index} className="group relative rounded-lg overflow-hidden border border-gray-200">
            {/* Display the YouTube thumbnail */}
            {videoId ? (
              <Image
                src={thumbnailUrl}
                alt={`Video Thumbnail ${index}`}
                width={400}
                height={300}
                className="w-full h-40 object-cover"
              />
            ) : (
              <div className="w-full h-40 bg-gray-300 flex items-center justify-center text-gray-700">
                Invalid YouTube URL
              </div>
            )}

            {/* Play button overlay */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="lg"
                className="bg-[#C62828] hover:bg-[#B71C1C] text-white rounded-full w-12 h-12 border-2 border-white"
                onClick={() => openVideoFullscreen(videoUrl)}
              >
                <Play className="w-5 h-5" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  </div>
)}


      {/* Fullscreen Modal for Video */}
      {isVideoOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative w-full h-full max-w-3xl max-h-80%">
            <button
              className="absolute top-4 right-4 text-white text-xl"
              onClick={closeVideoFullscreen}
            >
              &times;
            </button>
            <iframe
              width="100%"
              height="100%"
              src={videoUrl} // Embed the YouTube video
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              title="YouTube Video"
            ></iframe>
          </div>
        </div>
      )}


{/* Fullscreen Modal - only for images */}
<FullscreenModal
  isOpen={fullscreenOpen}
  onClose={() => setFullscreenOpen(false)}
  images={processedImages}
  currentIndex={currentImageIndex}
  onIndexChange={setCurrentImageIndex}
  title={machine.name}
/>


{/* Quotation Dialog */}
<QuotationDialog
  isOpen={quotationDialogOpen}
  onClose={() => setQuotationDialogOpen(false)}
  machineName={machine.name}
  parentType={machine.parentType}
/>
      </div>
    </main>
  )
}