"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MoreVertical, Edit, Trash2, Filter } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import Image from "next/image"
import { getMachinesByParentType, convertBase64ToBlob, type Machine } from "@/lib/api"
import { deleteMachine, type MachineResponse } from "@/lib/machine-admin-api"
import { LoadingSpinner, LoadingCard } from "@/components/loading-spinner"

interface MachineListViewProps {
  onEdit: (machine: MachineResponse) => void
  refreshTrigger: number
}

export function MachineListView({ onEdit, refreshTrigger }: MachineListViewProps) {
  const [machines, setMachines] = useState<Machine[]>([])
  const [selectedCategory, setSelectedCategory] = useState<"electric" | "tractor">("electric")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [processedImages, setProcessedImages] = useState<Record<string, string>>({})
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [machineToDelete, setMachineToDelete] = useState<Machine | null>(null)
  const [deleting, setDeleting] = useState(false)

  // Fetch machines when category changes or refresh is triggered
  useEffect(() => {
    fetchMachines()
  }, [selectedCategory, refreshTrigger])

  const fetchMachines = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await getMachinesByParentType(selectedCategory)
      if (response.error) {
        throw new Error(response.error)
      }

      setMachines(response.data)

      // Process images
      const images: Record<string, string> = {}
      response.data.forEach((machine) => {
        if (machine.images && machine.images.length > 0) {
          machine.images.forEach((image, index) => {
            if (image && image.startsWith("data:image")) {
              images[`${machine.id}-${index}`] = convertBase64ToBlob(image)
            }
          })
        }
      })
      setProcessedImages(images)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load machines")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (machine: Machine) => {
    // Convert Machine to MachineResponse format for editing
    const machineResponse: MachineResponse = {
      id: machine.id,
      name: machine.name,
      images: machine.images,
      keySpecs: machine.keySpecs,
      description: machine.description,
      workingMechanism: machine.workingMechanism, // This might not be available in the list API
      parentType: machine.parentType,
      type: machine.type,
      videoLink: machine.videoLink, // This might not be available in the list API
      totalPrice: machine.totalPrice, // Add this field (might not be available in list API)
    }
    onEdit(machineResponse)
  }

  const handleDeleteClick = (machine: Machine) => {
    setMachineToDelete(machine)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!machineToDelete) return

    setDeleting(true)
    try {
      const response = await deleteMachine(machineToDelete.id)
      if (response.success) {
        setDeleteDialogOpen(false)
        setMachineToDelete(null)
        fetchMachines() // Refresh the list
      } else {
        alert(response.error || "Failed to delete machine")
      }
    } catch (error) {
      alert("An error occurred while deleting the machine")
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <LoadingSpinner size="small" />
          <span className="text-gray-600">Loading machines...</span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <LoadingCard key={index} />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12 border border-gray-200 rounded-lg bg-red-50">
        <p className="text-red-600 text-lg mb-4">Error loading machines: {error}</p>
        <Button
          variant="outline"
          className="border-[#C62828] text-[#C62828] hover:bg-[#C62828] hover:text-white bg-transparent"
          onClick={fetchMachines}
        >
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-gray-700">
          <Filter className="w-4 h-4 text-[#C62828]" />
          <span className="font-medium">Category:</span>
        </div>

        <Select value={selectedCategory} onValueChange={(value: "electric" | "tractor") => setSelectedCategory(value)}>
          <SelectTrigger className="w-[200px] border-[#C62828] text-[#C62828] hover:bg-[#C62828]/5 focus:ring-[#C62828] focus:border-[#C62828]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="border-[#C62828]">
            <SelectItem value="electric" className="hover:bg-[#C62828]/10 focus:bg-[#C62828]/10">
              Electric Machines
            </SelectItem>
            <SelectItem value="tractor" className="hover:bg-[#C62828]/10 focus:bg-[#C62828]/10">
              Tractor Machines
            </SelectItem>
          </SelectContent>
        </Select>

        <div className="text-sm text-gray-600">
          {machines.length} machine{machines.length !== 1 ? "s" : ""} found
        </div>
      </div>

      {/* Machines Grid */}
      {machines.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {machines.map((machine) => {
            const firstImageSrc = machine.images?.[0]
              ? processedImages[`${machine.id}-0`] || machine.images[0]
              : "/placeholder.svg"

            return (
              <Card
                key={machine.id}
                className="overflow-hidden border-2 hover:border-[#C62828] transition-colors relative"
              >
                <div className="relative">
                  <Image
                    src={firstImageSrc || "/placeholder.svg"}
                    alt={machine.name}
                    width={400}
                    height={250}
                    className="w-full h-48 object-cover"
                  />

                  {/* Type Badge */}
                  <Badge className="absolute top-2 left-2 bg-[#C62828] text-white border border-white">
                    {machine.type}
                  </Badge>

                  {/* Action Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute top-2 right-2 bg-white/90 hover:bg-white border-gray-300 text-gray-700 hover:text-black w-8 h-8 p-0"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40 border-[#C62828]">
                      <DropdownMenuItem
                        onClick={() => handleEdit(machine)}
                        className="hover:bg-[#C62828]/10 focus:bg-[#C62828]/10"
                      >
                        <Edit className="w-4 h-4 mr-2 text-[#C62828]" />
                        <span className="text-[#C62828]">Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteClick(machine)}
                        className="hover:bg-red-50 focus:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-2 text-red-600" />
                        <span className="text-red-600">Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
                        .slice(0, 3)
                        .map(([key, value]) => (
                          <div key={key} className="flex justify-between text-sm py-1 border-b border-gray-100">
                            <span className="text-gray-600">{key}:</span>
                            <span className="font-medium text-black">{value}</span>
                          </div>
                        ))}
                      {Object.keys(machine.keySpecs).length > 3 && (
                        <div className="text-xs text-gray-500 text-center pt-2">
                          +{Object.keys(machine.keySpecs).length - 3} more specifications
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Price Display - Admin Only */}
                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Price:</span>
                      <span className="text-lg font-bold text-[#C62828]">
                        {machine.totalPrice || "Contact for pricing"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-12 border border-gray-200 rounded-lg bg-gray-50">
          <p className="text-gray-500 text-lg mb-4">No {selectedCategory} machines found.</p>
          <p className="text-gray-400 text-sm">Add some machines to get started.</p>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="border-2 border-red-500">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600">Delete Machine</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{machineToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting} className="border-gray-300 text-gray-700 hover:bg-gray-50">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleting ? (
                <>
                  <LoadingSpinner size="small" />
                  <span className="ml-2">Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
