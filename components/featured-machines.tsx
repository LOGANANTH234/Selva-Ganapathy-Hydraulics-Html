"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Play } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

const machines = [
  {
    id: "woodbreaker-motor",
    name: "Woodbreaker Running With Motor",
    category: "Electric",
    videoUrl: "https://youtu.be/d-69XIBTVXk?si=-w2b5xRP2TckpWJV",
    embedId: "d-69XIBTVXk",
    description:
      "High-efficiency woodbreaker powered by electric motor, perfect for consistent wood processing operations.",
    specifications: {
      "Stroke Length": "4 Feet",
      "Total Length": "13 Feet",
      "Full Weight": "3 Ton",
      "Oil Capacity": "130 Liter",
      "Special Feature": "Imported valve oil pump",
    },
    workingMechanism:
      "Hydraulic cylinder extends and retracts to split wood logs efficiently using high-pressure oil system.",
    price: "Contact for pricing",
  },
  {
    id: "woodbreaker-tractor",
    name: "Woodbreaker Running With Tractor",
    category: "Tractor-Based",
    videoUrl: "https://youtu.be/d-69XIBTVXk?si=-w2b5xRP2TckpWJV",
    embedId: "d-69XIBTVXk",
    description:
      "Heavy-duty woodbreaker designed for tractor operation, featuring rolling and lift type mechanism for maximum efficiency.",
    specifications: {
      "Stroke Length": "4 Feet",
      "Total Length": "13 Feet",
      "Full Weight": "3 Ton",
      "Oil Capacity": "210 Liter",
      Type: "Rolling Type with Lift Type",
      "Special Feature": "Imported valve oil pump",
    },
    workingMechanism:
      "Tractor PTO drives hydraulic pump, creating pressure to operate the splitting mechanism with rolling and lifting capabilities.",
    price: "Contact for pricing",
  },
]

export function FeaturedMachines() {
  const [playingVideo, setPlayingVideo] = useState<string | null>(null)

  const generateQuotation = (machineId: string) => {
    // TODO: Integrate with backend API for PDF generation
    
    alert("Quotation feature will be integrated with backend API soon!")
  }

  const handlePlayVideo = (machineId: string) => {
    setPlayingVideo(machineId)
  }

  const handleStopVideo = () => {
    setPlayingVideo(null)
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-black mb-4">Featured Machines</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Our flagship woodbreaker machines designed for professional wood processing operations.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {machines.map((machine) => (
            <Card key={machine.id} className="overflow-hidden border-2 hover:border-[#C62828] transition-colors">
              <div className="relative">
                {playingVideo === machine.id ? (
                  <div className="w-full h-64">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${machine.embedId}?autoplay=1&rel=0`}
                      title={machine.name}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                ) : (
                  <>
                    {/* YouTube Thumbnail */}
                    <Image
                      src={`https://img.youtube.com/vi/${machine.embedId}/maxresdefault.jpg`}
                      alt={machine.name}
                      width={400}
                      height={300}
                      className="w-full h-64 object-cover"
                      onError={(e) => {
                        // Fallback to medium quality thumbnail if maxres fails
                        const target = e.target as HTMLImageElement
                        target.src = `https://img.youtube.com/vi/${machine.embedId}/hqdefault.jpg`
                      }}
                    />
                    <Badge className="absolute top-4 left-4 bg-[#C62828] text-white">{machine.category}</Badge>
                    <Button
                      size="sm"
                      className="absolute top-4 right-4 bg-black/70 hover:bg-black text-white"
                      onClick={() => handlePlayVideo(machine.id)}
                    >
                      <Play className="w-4 h-4 mr-1" />
                      Demo
                    </Button>
                  </>
                )}
              </div>

              <CardHeader>
                <CardTitle className="text-xl text-black">{machine.name}</CardTitle>
                <CardDescription>{machine.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold text-black mb-3">Specifications</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {Object.entries(machine.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-1 border-b border-gray-100">
                        <span className="text-gray-600">{key}:</span>
                        <span className="font-medium text-black">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-black mb-2">Working Mechanism</h4>
                  <p className="text-gray-700 text-sm">{machine.workingMechanism}</p>
                </div>

                <div className="flex gap-3">
                  <Button
                    className="flex-1 bg-[#C62828] hover:bg-[#B71C1C] text-white"
                    onClick={() => generateQuotation(machine.id)}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Get Quotation
                  </Button>
                  <Button
                    variant="outline"
                    className="border-[#C62828] text-[#C62828] hover:bg-[#C62828] hover:text-white bg-transparent"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Brochure
                  </Button>
                </div>

                {playingVideo === machine.id && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-[#C62828] text-[#C62828] hover:bg-[#C62828] hover:text-white bg-transparent"
                    onClick={handleStopVideo}
                  >
                    Stop Video
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
