"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, ChevronLeft, ChevronRight, Plus } from "lucide-react"
import Image from "next/image"
import { useRef, useState, useEffect } from "react"
import { getAllMachineVideos, convertBase64ToBlob, extractYouTubeVideoId, type MachineVideo } from "@/lib/api"
import { LoadingSpinner } from "./loading-spinner"
import { VideoMenu } from "./admin/video-menu"
import { VideoFormDialog } from "./admin/video-form-dialog"
import type { MachineVideoResponse } from "@/lib/admin-api"

interface VideoGalleryProps {
  onFullscreenChange?: (isOpen: boolean) => void
  isAdmin?: boolean
}

export function VideoGallery({ onFullscreenChange, isAdmin = false }: VideoGalleryProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [playingVideo, setPlayingVideo] = useState<string | null>(null)
  const [videos, setVideos] = useState<MachineVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [processedThumbnails, setProcessedThumbnails] = useState<Record<string, string>>({})
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingVideo, setEditingVideo] = useState<MachineVideoResponse | null>(null)

  // Fetch videos when component mounts
  const fetchVideos = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await getAllMachineVideos()
      if (response.error) {
        throw new Error(response.error)
      }

      setVideos(response.data)

      // Process thumbnails
      const thumbnails: Record<string, string> = {}
      response.data.forEach((video) => {
        if (video.thumbnail && video.thumbnail.startsWith("data:image")) {
          thumbnails[video.id] = convertBase64ToBlob(video.thumbnail)
        }
      })
      setProcessedThumbnails(thumbnails)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load videos")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVideos()

    // Cleanup blob URLs when component unmounts
    return () => {
      Object.values(processedThumbnails).forEach((url) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url)
        }
      })
    }
  }, [])

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const cardWidth = 300
      const gap = 24
      const scrollAmount = cardWidth + gap
      scrollContainerRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const cardWidth = 300
      const gap = 24
      const scrollAmount = cardWidth + gap
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  const handlePlayVideo = (videoId: string) => {
    setPlayingVideo(videoId)
  }

  const handleStopVideo = () => {
    setPlayingVideo(null)
  }

  const handleAddVideo = () => {
    setEditingVideo(null)
    setShowAddDialog(true)
  }

  const handleEditVideo = (video: MachineVideoResponse) => {
    setEditingVideo(video)
    setShowAddDialog(true)
  }

  const handleVideoSuccess = () => {
    fetchVideos() // Refresh the video list
  }

  const handleVideoDelete = () => {
    fetchVideos() // Refresh the video list
  }

  if (loading) {
    return (
      <section className="py-8 bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6 border-b border-gray-200 pb-4">
            <h2 className="text-2xl lg:text-3xl font-bold text-black mb-3">Machine Demonstrations</h2>
            <p className="text-gray-600 text-base max-w-2xl mx-auto">
              Watch our machines in action and learn about their operation, maintenance, and installation.
            </p>
          </div>

          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3">
              <LoadingSpinner />
              <span className="text-gray-600">Loading demonstration videos...</span>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-8 bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6 border-b border-gray-200 pb-4">
            <h2 className="text-2xl lg:text-3xl font-bold text-black mb-3">Machine Demonstrations</h2>
          </div>

          <div className="text-center py-12 border border-gray-200 rounded-lg bg-red-50">
            <p className="text-red-600 text-lg mb-4">Error loading videos: {error}</p>
            <Button
              variant="outline"
              className="border-[#C62828] text-[#C62828] hover:bg-[#C62828] hover:text-white bg-transparent"
              onClick={fetchVideos}
            >
              Try Again
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-8 bg-gray-50 border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6 border-b border-gray-200 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h2 className="text-2xl lg:text-3xl font-bold text-black mb-3">Machine Demonstrations</h2>
              <p className="text-gray-600 text-base max-w-2xl mx-auto">
                Watch our machines in action and learn about their operation, maintenance, and installation.
              </p>
            </div>
            {isAdmin && (
              <Button onClick={handleAddVideo} className="bg-[#C62828] hover:bg-[#B71C1C] text-white" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Video
              </Button>
            )}
          </div>
        </div>

        <div className="relative border border-gray-200 rounded-lg bg-white p-4">
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
            {videos.map((video) => {
              const videoId = extractYouTubeVideoId(video.videoLink)
              const thumbnailSrc = processedThumbnails[video.id] || "/placeholder.svg"

              return (
                <Card
                  key={video.id}
                  className="flex-shrink-0 w-[300px] overflow-hidden hover:shadow-lg transition-shadow group border-2 border-gray-200 relative"
                  style={{ scrollSnapAlign: "center" }}
                >
                  <div className="relative border-b border-gray-200">
                    {playingVideo === video.id ? (
                      <div className="w-full h-48">
                        <iframe
                          width="100%"
                          height="100%"
                          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                          title={video.name}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          className="w-full h-full"
                        />
                      </div>
                    ) : (
                      <>
                        <Image
                          src={thumbnailSrc || "/placeholder.svg"}
                          alt={video.name}
                          width={300}
                          height={200}
                          className="w-full h-48 object-cover"
                        />

                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="lg"
                            className="bg-[#C62828] hover:bg-[#B71C1C] text-white rounded-full w-16 h-16 border-2 border-white"
                            onClick={() => handlePlayVideo(video.id)}
                          >
                            <Play className="w-6 h-6" />
                          </Button>
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded border border-white/20">
                          {video.duration}
                        </div>
                      </>
                    )}

                    {/* Admin Menu */}
                    {isAdmin && (
                      <VideoMenu
                        video={video as MachineVideoResponse}
                        onEdit={handleEditVideo}
                        onDelete={handleVideoDelete}
                      />
                    )}
                  </div>

                  <CardHeader className="pb-2 border-b border-gray-100">
                    <CardTitle className="text-base text-black">{video.name}</CardTitle>
                  </CardHeader>

                  <CardContent className="pt-3">
                    <p className="text-gray-600 text-sm mb-4">{video.description}</p>
                    {playingVideo === video.id ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-[#C62828] text-[#C62828] hover:bg-[#C62828] hover:text-white bg-transparent"
                        onClick={handleStopVideo}
                      >
                        Stop Video
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-[#C62828] text-[#C62828] hover:bg-[#C62828] hover:text-white bg-transparent"
                        onClick={() => handlePlayVideo(video.id)}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Play Video
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Video Form Dialog */}
        <VideoFormDialog
          isOpen={showAddDialog}
          onClose={() => setShowAddDialog(false)}
          onSuccess={handleVideoSuccess}
          editingVideo={editingVideo}
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
