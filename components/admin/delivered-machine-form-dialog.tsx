"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Upload, X, CalendarIcon, Truck } from "lucide-react"
import { format } from "date-fns"
import Image from "next/image"
import {
  addDeliveredMachine,
  updateDeliveredMachine,
  convertFileToBase64,
  type DeliveredMachineRequest,
  type DeliveredMachineResponse,
} from "@/lib/delivered-machines-api"
import { LoadingSpinner } from "@/components/loading-spinner"
import { cn } from "@/lib/utils"

interface DeliveredMachineFormDialogProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  editingMachine?: DeliveredMachineResponse | null
}

export function DeliveredMachineFormDialog({
  isOpen,
  onClose,
  onSuccess,
  editingMachine,
}: DeliveredMachineFormDialogProps) {
  const [formData, setFormData] = useState<DeliveredMachineRequest>({
    customerName: "",
    location: "",
    machineName: "",
    image: "",
    deliveryDate: "",
    description: "",
    workingMechanism: "",
  })
  const [imagePreview, setImagePreview] = useState<string>("")
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Reset and populate form when dialog opens or editing machine changes
  useEffect(() => {
    if (isOpen) {
      if (editingMachine) {
        // Populate form with existing machine data
        setFormData({
          customerName: editingMachine.customerName || "",
          location: editingMachine.location || "",
          machineName: editingMachine.machineName || "",
          image: editingMachine.image || "",
          deliveryDate: editingMachine.deliveryDate || "",
          description: editingMachine.description || "",
          workingMechanism: editingMachine.workingMechanism || "",
        })
        setImagePreview(editingMachine.image || "")

        // Parse delivery date
        if (editingMachine.deliveryDate) {
          try {
            const date = new Date(editingMachine.deliveryDate)
            setSelectedDate(date)
          } catch (error) {
            console.error("Error parsing date:", error)
          }
        }
      } else {
        // Reset form for new machine
        setFormData({
          customerName: "",
          location: "",
          machineName: "",
          image: "",
          deliveryDate: "",
          description: "",
          workingMechanism: "",
        })
        setImagePreview("")
        setSelectedDate(undefined)
      }
      setErrors({})
    }
  }, [isOpen, editingMachine])

  const handleInputChange = (field: keyof DeliveredMachineRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, image: "Please select a valid image file" }))
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, image: "Image size should be less than 5MB" }))
      return
    }

    try {
      const base64 = await convertFileToBase64(file)
      setFormData((prev) => ({ ...prev, image: base64 }))
      setImagePreview(base64)
      setErrors((prev) => ({ ...prev, image: "" }))
    } catch (error) {
      setErrors((prev) => ({ ...prev, image: "Failed to process image" }))
    }
  }

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    if (date) {
      const formattedDate = format(date, "MMMM yyyy")
      setFormData((prev) => ({ ...prev, deliveryDate: formattedDate }))
      setErrors((prev) => ({ ...prev, deliveryDate: "" }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Validate customer name
    if (!formData.customerName.trim()) {
      newErrors.customerName = "Customer name is required"
    }

    // Validate location
    if (!formData.location.trim()) {
      newErrors.location = "Location is required"
    }

    // Validate machine name
    if (!formData.machineName.trim()) {
      newErrors.machineName = "Machine name is required"
    }

    // Validate image
    if (!formData.image) {
      newErrors.image = "Machine image is required"
    }

    // Validate delivery date
    if (!formData.deliveryDate) {
      newErrors.deliveryDate = "Delivery date is required"
    }

    // Validate description
    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }

    // Validate working mechanism
    if (!formData.workingMechanism.trim()) {
      newErrors.workingMechanism = "Working mechanism is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setLoading(true)
    try {
      let response
      if (editingMachine) {
        response = await updateDeliveredMachine(editingMachine.id, formData)
      } else {
        response = await addDeliveredMachine(formData)
      }

      if (response.success) {
        onSuccess()
        handleClose()
      } else {
        setErrors({ submit: response.error || "Operation failed" })
      }
    } catch (error) {
      setErrors({ submit: "An unexpected error occurred" })
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({
      customerName: "",
      location: "",
      machineName: "",
      image: "",
      deliveryDate: "",
      description: "",
      workingMechanism: "",
    })
    setImagePreview("")
    setSelectedDate(undefined)
    setErrors({})
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    onClose()
  }

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: "" }))
    setImagePreview("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    setErrors((prev) => ({ ...prev, image: "" }))
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto border-2 border-[#C62828]">
        <DialogHeader className="border-b border-gray-200 pb-4">
          <DialogTitle className="text-xl font-bold text-[#C62828]">
            {editingMachine ? "Update Delivered Machine" : "Add Delivered Machine"}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {editingMachine ? "Update the delivered machine details" : "Add a new successfully delivered machine"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Customer Name */}
          <div className="space-y-2">
            <Label htmlFor="customerName" className="text-sm font-medium text-gray-700">
              Customer Name *
            </Label>
            <Input
              id="customerName"
              type="text"
              value={formData.customerName}
              onChange={(e) => handleInputChange("customerName", e.target.value)}
              placeholder="Enter customer name (e.g., Tamil Nadu Timber Co.)"
              className={`border-gray-300 focus:border-[#C62828] focus:ring-[#C62828] ${
                errors.customerName ? "border-red-500" : ""
              }`}
            />
            {errors.customerName && <p className="text-red-500 text-sm">{errors.customerName}</p>}
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-medium text-gray-700">
              Location *
            </Label>
            <Input
              id="location"
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              placeholder="Enter location (e.g., Coimbatore, Tamil Nadu)"
              className={`border-gray-300 focus:border-[#C62828] focus:ring-[#C62828] ${
                errors.location ? "border-red-500" : ""
              }`}
            />
            {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
          </div>

          {/* Machine Name */}
          <div className="space-y-2">
            <Label htmlFor="machineName" className="text-sm font-medium text-gray-700">
              Machine Name *
            </Label>
            <Input
              id="machineName"
              type="text"
              value={formData.machineName}
              onChange={(e) => handleInputChange("machineName", e.target.value)}
              placeholder="Enter machine name (e.g., Woodbreaker Tractor)"
              className={`border-gray-300 focus:border-[#C62828] focus:ring-[#C62828] ${
                errors.machineName ? "border-red-500" : ""
              }`}
            />
            {errors.machineName && <p className="text-red-500 text-sm">{errors.machineName}</p>}
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Machine Image *</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              {imagePreview ? (
                <div className="relative">
                  <Image
                    src={imagePreview || "/placeholder.svg"}
                    alt="Machine preview"
                    width={200}
                    height={120}
                    className="rounded-lg object-cover mx-auto"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2 bg-white hover:bg-gray-100"
                    onClick={removeImage}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="mt-2 w-full border-[#C62828] text-[#C62828] hover:bg-[#C62828] hover:text-white bg-transparent"
                    onClick={triggerFileInput}
                  >
                    Change Image
                  </Button>
                </div>
              ) : (
                <div className="text-center cursor-pointer" onClick={triggerFileInput}>
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 mb-2">Click to upload machine image</p>
                  <p className="text-sm text-gray-500">PNG, JPG up to 5MB</p>
                </div>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </div>
            {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}
          </div>

          {/* Delivery Date */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Delivery Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal border-gray-300 focus:border-[#C62828] focus:ring-[#C62828]",
                    !selectedDate && "text-muted-foreground",
                    errors.deliveryDate && "border-red-500",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "MMMM yyyy") : "Select delivery date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.deliveryDate && <p className="text-red-500 text-sm">{errors.deliveryDate}</p>}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
              Description *
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter machine description (e.g., Heavy-duty woodbreaker for large-scale timber processing operations)"
              rows={3}
              className={`border-gray-300 focus:border-[#C62828] focus:ring-[#C62828] ${
                errors.description ? "border-red-500" : ""
              }`}
            />
            {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
          </div>

          {/* Working Mechanism */}
          <div className="space-y-2">
            <Label htmlFor="workingMechanism" className="text-sm font-medium text-gray-700">
              Working Mechanism *
            </Label>
            <Textarea
              id="workingMechanism"
              value={formData.workingMechanism}
              onChange={(e) => handleInputChange("workingMechanism", e.target.value)}
              placeholder="Explain the working mechanism (e.g., Tractor PTO-driven hydraulic system with 210L capacity for continuous operation)"
              rows={3}
              className={`border-gray-300 focus:border-[#C62828] focus:ring-[#C62828] ${
                errors.workingMechanism ? "border-red-500" : ""
              }`}
            />
            {errors.workingMechanism && <p className="text-red-500 text-sm">{errors.workingMechanism}</p>}
          </div>

          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{errors.submit}</p>
            </div>
          )}
        </div>

        <DialogFooter className="border-t border-gray-200 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={loading}
            className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="bg-[#C62828] hover:bg-[#B71C1C] text-white"
          >
            {loading ? (
              <>
                <LoadingSpinner size="small" />
                <span className="ml-2">{editingMachine ? "Updating..." : "Adding..."}</span>
              </>
            ) : (
              <>
                <Truck className="w-4 h-4 mr-2" />
                {editingMachine ? "Update Machine" : "Add Machine"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
