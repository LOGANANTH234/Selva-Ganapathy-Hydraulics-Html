"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreVertical, Edit, Trash2, Plus, Truck } from "lucide-react"
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
import { getAllDeliveredMachines, convertBase64ToBlob, type DeliveredMachine } from "@/lib/api"
import { deleteDeliveredMachine, type DeliveredMachineResponse } from "@/lib/delivered-machines-api"
import { DeliveredMachineFormDialog } from "./delivered-machine-form-dialog"
import { LoadingSpinner, LoadingCard } from "@/components/loading-spinner"

interface DeliveredMachinesManagementProps {
  refreshTrigger: number
}

export function DeliveredMachinesManagement({ refreshTrigger }: DeliveredMachinesManagementProps) {
  const [machines, setMachines] = useState<DeliveredMachine[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [processedImages, setProcessedImages] = useState<Record<string, string>>({})
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [machineToDelete, setMachineToDelete] = useState<DeliveredMachine | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingMachine, setEditingMachine] = useState<DeliveredMachineResponse | null>(null)

  // Fetch machines when component mounts or refresh is triggered
  useEffect(() => {
    fetchMachines()
  }, [refreshTrigger])

  const fetchMachines = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await getAllDeliveredMachines()
      if (response.error) {
        throw new Error(response.error)
      }

      setMachines(response.data)

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

  const handleEdit = (machine: DeliveredMachine) => {
    // Convert DeliveredMachine to DeliveredMachineResponse format for editing
    const machineResponse: DeliveredMachineResponse = {
      id: machine.id,
      customerName: machine.customerName,
      location: machine.location,
      machineName: machine.machineName,
      image: machine.image,
      deliveryDate: machine.deliveryDate,
      description: machine.description,
      workingMechanism: machine.workingMechanism,
    }
    setEditingMachine(machineResponse)
    setShowAddDialog(true)
  }

  const handleDeleteClick = (machine: DeliveredMachine) => {
    setMachineToDelete(machine)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!machineToDelete) return

    setDeleting(true)
    try {
      const response = await deleteDeliveredMachine(machineToDelete.id)
      if (response.success) {
        setDeleteDialogOpen(false)
        setMachineToDelete(null)
        fetchMachines() // Refresh the list
      } else {
        alert(response.error || "Failed to delete delivered machine")
      }
    } catch (error) {
      alert("An error occurred while deleting the delivered machine")
    } finally {
      setDeleting(false)
    }
  }

  const handleAddMachine = () => {
    setEditingMachine(null)
    setShowAddDialog(true)
  }

  const handleSuccess = () => {
    fetchMachines() // Refresh the list
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <LoadingSpinner size="small" />
          <span className="text-gray-600">Loading delivered machines...</span>
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
        <p className="text-red-600 text-lg mb-4">Error loading delivered machines: {error}</p>
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
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-700">Successfully Delivered Machines</h3>
          <p className="text-sm text-gray-600">
            {machines.length} machine{machines.length !== 1 ? "s" : ""} delivered
          </p>
        </div>
        <Button onClick={handleAddMachine} className="bg-[#C62828] hover:bg-[#B71C1C] text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Delivered Machine
        </Button>
      </div>

      {/* Machines Grid */}
      {machines.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {machines.map((machine) => {
            const imageSrc = processedImages[machine.id] || "/placeholder.svg"

            return (
              <Card
                key={machine.id}
                className="overflow-hidden border-2 hover:border-[#C62828] transition-colors relative"
              >
                <div className="relative">
                  <Image
                    src={imageSrc || "/placeholder.svg"}
                    alt={`${machine.machineName} delivered to ${machine.customerName}`}
                    width={400}
                    height={250}
                    className="w-full h-48 object-cover"
                  />

                  {/* Delivered Badge */}
                  <Badge className="absolute top-2 left-2 bg-green-600 text-white border border-white">
                    <Truck className="w-3 h-3 mr-1" />
                    Delivered
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
                  <CardTitle className="text-lg text-black">{machine.machineName}</CardTitle>
                  <CardDescription className="font-medium text-[#C62828]">{machine.customerName}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between border-b border-gray-100 pb-1">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium text-black">{machine.location}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-1">
                      <span className="text-gray-600">Delivered:</span>
                      <span className="font-medium text-black">{machine.deliveryDate}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-gray-700 text-sm mb-2">{machine.description}</p>
                    <div>
                      <h4 className="font-semibold text-black text-sm mb-1">Working Mechanism:</h4>
                      <p className="text-gray-600 text-xs">{machine.workingMechanism}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-12 border border-gray-200 rounded-lg bg-gray-50">
          <Truck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-4">No delivered machines found.</p>
          <p className="text-gray-400 text-sm mb-4">Add delivered machines to showcase your successful deliveries.</p>
          <Button onClick={handleAddMachine} className="bg-[#C62828] hover:bg-[#B71C1C] text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add First Delivered Machine
          </Button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="border-2 border-red-500">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600">Delete Delivered Machine</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the delivery record for "{machineToDelete?.machineName}" delivered to{" "}
              {machineToDelete?.customerName}? This action cannot be undone.
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

      {/* Add/Edit Dialog */}
      <DeliveredMachineFormDialog
        isOpen={showAddDialog}
        onClose={() => {
          setShowAddDialog(false)
          setEditingMachine(null)
        }}
        onSuccess={handleSuccess}
        editingMachine={editingMachine}
      />
    </div>
  )
}
