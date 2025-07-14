"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Upload, X, Plus, Trash2, Settings } from "lucide-react"
import Image from "next/image"
import {
  addNewMachine,
  updateMachine,
  convertFileToBase64,
  validateYouTubeUrl,
  type MachineRequest,
  type MachineResponse,
} from "@/lib/machine-admin-api"
import { LoadingSpinner } from "@/components/loading-spinner"

interface MachineFormDialogProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  editingMachine?: MachineResponse | null
}

interface KeySpec {
  key: string
  value: string
}

interface VideoEntry {
  thumbnail: string // base64
  videoLink: string
}

export function MachineFormDialog({ isOpen, onClose, onSuccess, editingMachine }: MachineFormDialogProps) {
  const [formData, setFormData] = useState<MachineRequest>({
    name: "",
    images: [],
    keySpecs: {},
    description: "",
    workingMechanism: "",
    parentType: "electric",
    type: "",
    videoLink: {},
    totalPrice: "", // Add this field
  })
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [keySpecs, setKeySpecs] = useState([
  { key: "Platform Length", value: "14 ft" },
  { key: "Cylinder Type", value: "100 mm Shaft" },
  { key: "Barrel", value: "140 mm" },
  { key: "Stroke Length", value: "5 ft" },
  { key: "Oil Capacity", value: "250 Ltr" },
  { key: "Tyre Type", value: "7.50 x 16 (2 Nos)" },
  { key: "Pump", value: "160 x 150 Ltr" },
  { key: "Valve", value: "16/1 - 180 Ltr" },
  { key: "Crane Movement", value: "Left and Right" },
  { key: "Crane Damping Height", value: "16 ft" },
  { key: "Boom Type", value: "Double Step" },
  { key: "Second Boom Stroke", value: "6 ft" },
  { key: "Crane Weight Capacity", value: "2 Ton" },
  { key: "No of Cylinders", value: "3 Nos" },
  { key: "All Hoses", value: "4XP Type" },
  { key: "Painting and Accessories", value: "Included" },
])

  const [focusedKeyIndex, setFocusedKeyIndex] = useState<number | null>(null)

  const [videos, setVideos] = useState<VideoEntry[]>([{ thumbnail: "", videoLink: "" }])
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const imageInputRef = useRef<HTMLInputElement>(null)
  const videoThumbnailRefs = useRef<(HTMLInputElement | null)[]>([])
const [editingKeyIndex, setEditingKeyIndex] = useState<number | null>(null);
const [tempKeyText, setTempKeyText] = useState("");
useEffect(() => {
  const specsObject = keySpecs.reduce((acc, spec) => {
    if (spec.key.trim() && spec.value.trim()) {
      acc[spec.key] = spec.value
    }
    return acc
  }, {} as Record<string, string>)

  setFormData((prev) => ({ ...prev, keySpecs: specsObject }))
}, [keySpecs])

  // Reset and populate form when dialog opens or editing machine changes
  useEffect(() => {
    if (isOpen) {
      if (editingMachine) {
        // Populate form with existing machine data
        setFormData({
          name: editingMachine.name || "",
          images: editingMachine.images || [],
          keySpecs: editingMachine.keySpecs || {},
          description: editingMachine.description || "",
          workingMechanism: editingMachine.workingMechanism || "",
          parentType: editingMachine.parentType || "electric",
          type: editingMachine.type || "",
          videoLink: editingMachine.videoLink || {},
          totalPrice: editingMachine.totalPrice || "", // Add this field
        })
        setImagePreviews(editingMachine.images || [])
       
        // Convert keySpecs object to array
        const specsArray = Object.entries(editingMachine.keySpecs || {}).map(([key, value]) => ({ key, value }))
        setKeySpecs(specsArray.length > 0 ? specsArray : [{ key: "", value: "" }])

        // Convert videoLink object to array
        const videosArray = Object.entries(editingMachine.videoLink || {}).map(([thumbnail, videoLink]) => ({
          thumbnail,
          videoLink,
        }))
        setVideos(videosArray.length > 0 ? videosArray : [{ thumbnail: "", videoLink: "" }])

      } else {
        // Reset form for new machine
        setFormData({
          name: "",
          images: [],
          keySpecs: {},
          description: "",
          workingMechanism: "",
          parentType: "electric",
          type: "",
          videoLink: {},
          totalPrice: "", // Add this field
        })
        setImagePreviews([])
        setKeySpecs( [
  { key: "Platform Length", value: "14 ft" },
  { key: "Cylinder Type", value: "100 mm Shaft" },
  { key: "Barrel", value: "140 mm" },
  { key: "Stroke Length", value: "5 ft" },
  { key: "Oil Capacity", value: "250 Ltr" },
  { key: "Tyre Type", value: "7.50 x 16 (2 Nos)" },
  { key: "Pump", value: "160 x 150 Ltr" },
  { key: "Valve", value: "16/1 - 180 Ltr" },
  { key: "Crane Movement", value: "Left and Right" },
  { key: "Crane Damping Height", value: "16 ft" },
  { key: "Boom Type", value: "Double Step" },
  { key: "Second Boom Stroke", value: "6 ft" },
  { key: "Crane Weight Capacity", value: "2 Ton" },
  { key: "No of Cylinders", value: "3 Nos" },
  { key: "All Hoses", value: "4XP Type" },
  { key: "Painting and Accessories", value: "Included" }
])
        setVideos([{ thumbnail: "", videoLink: "" }])
      }
      setErrors({})
    }
  }, [isOpen, editingMachine])

  const handleInputChange = (field: keyof MachineRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleImagesUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length === 0) return

    // Validate file types
    const invalidFiles = files.filter((file) => !file.type.startsWith("image/"))
    if (invalidFiles.length > 0) {
      setErrors((prev) => ({ ...prev, images: "Please select only image files" }))
      return
    }

    // Validate file sizes (max 5MB each)
    const oversizedFiles = files.filter((file) => file.size > 5 * 1024 * 1024)
    if (oversizedFiles.length > 0) {
      setErrors((prev) => ({ ...prev, images: "Each image should be less than 5MB" }))
      return
    }

    try {
      const base64Images = await Promise.all(files.map((file) => convertFileToBase64(file)))
      const newImages = [...formData.images, ...base64Images]
      const newPreviews = [...imagePreviews, ...base64Images]

      setFormData((prev) => ({ ...prev, images: newImages }))
      setImagePreviews(newPreviews)
      setErrors((prev) => ({ ...prev, images: "" }))
    } catch (error) {
      setErrors((prev) => ({ ...prev, images: "Failed to process images" }))
    }
  }

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index)
    const newPreviews = imagePreviews.filter((_, i) => i !== index)
    setFormData((prev) => ({ ...prev, images: newImages }))
    setImagePreviews(newPreviews)
  }

  const handleKeySpecChange = (index: number, field: "key" | "value", value: string) => {
    const newKeySpecs = [...keySpecs]
    newKeySpecs[index][field] = value
    setKeySpecs(newKeySpecs)

    // Update formData
    const specsObject = newKeySpecs.reduce(
      (acc, spec) => {
        if (spec.key.trim() && spec.value.trim()) {
          acc[spec.key] = spec.value
        }
        return acc
      },
      {} as Record<string, string>,
    )
    setFormData((prev) => ({ ...prev, keySpecs: specsObject }))
  }

  const addKeySpec = () => {
    setKeySpecs([...keySpecs, { key: "", value: "" }])
  }

  const removeKeySpec = (index: number) => {
    if (keySpecs.length > 1) {
      const newKeySpecs = keySpecs.filter((_, i) => i !== index)
      setKeySpecs(newKeySpecs)

      // Update formData
      const specsObject = newKeySpecs.reduce(
        (acc, spec) => {
          if (spec.key.trim() && spec.value.trim()) {
            acc[spec.key] = spec.value
          }
          return acc
        },
        {} as Record<string, string>,
      )
      setFormData((prev) => ({ ...prev, keySpecs: specsObject }))
    }
  }

  const handleVideoThumbnailUpload = async (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, [`video-${index}`]: "Please select a valid image file" }))
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, [`video-${index}`]: "Image size should be less than 5MB" }))
      return
    }

    try {
      const base64 = await convertFileToBase64(file)
      const newVideos = [...videos]
      newVideos[index].thumbnail = base64
      setVideos(newVideos)

      // Update formData - use base64 as key and videoLink as value
      const videosObject = newVideos.reduce(
        (acc, video, idx) => {
          if (video.thumbnail && video.videoLink.trim()) {
            acc[Math.random().toString(36).substring(2, 10)] = video.videoLink
          }
          return acc
        },
        {} as Record<string, string>,
      )
      setFormData((prev) => ({ ...prev, videoLink: videosObject }))

      setErrors((prev) => ({ ...prev, [`video-${index}`]: "" }))
    } catch (error) {
      setErrors((prev) => ({ ...prev, [`video-${index}`]: "Failed to process image" }))
    }
  }

  const handleVideoLinkChange = (index: number, value: string) => {
    const newVideos = [...videos]
    newVideos[index].videoLink = value
    setVideos(newVideos)

    // Update formData
    const videosObject = newVideos.reduce(
      (acc, video, idx) => {
        if (video.thumbnail && video.videoLink.trim()) {
          acc[Math.random().toString(36).substring(2, 10)] = video.videoLink
        }
        return acc
      },
      {} as Record<string, string>,
    )
    setFormData((prev) => ({ ...prev, videoLink: videosObject }))

    // Clear error
    if (errors[`video-${index}`]) {
      setErrors((prev) => ({ ...prev, [`video-${index}`]: "" }))
    }
  }

  const addVideo = () => {
    setVideos([...videos, { thumbnail: "", videoLink: "" }])
    videoThumbnailRefs.current.push(null)
  }

  const removeVideo = (index: number) => {
    if (videos.length > 1) {
      const newVideos = videos.filter((_, i) => i !== index)
      setVideos(newVideos)
      videoThumbnailRefs.current = videoThumbnailRefs.current.filter((_, i) => i !== index)

      // Update formData
      const videosObject = newVideos.reduce(
        (acc, video, idx) => {
          if (video.thumbnail && video.videoLink.trim()) {
            acc[Math.random().toString(36).substring(2, 10)] = video.videoLink
          }
          return acc
        },
        {} as Record<string, string>,
      )
      setFormData((prev) => ({ ...prev, videoLink: videosObject }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = "Machine name is required"
    }

    // Validate images
    if (formData.images.length === 0) {
      newErrors.images = "At least one image is required"
    }

    // Validate description
    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }

    // Validate working mechanism
    if (!formData.workingMechanism.trim()) {
      newErrors.workingMechanism = "Working mechanism is required"
    }

    // Validate type
    if (!formData.type.trim()) {
      newErrors.type = "Machine type is required"
    }

    // Validate key specs
    const hasValidSpecs = keySpecs.some((spec) => spec.key.trim() && spec.value.trim())
    
    if (!hasValidSpecs) {
      newErrors.keySpecs = "At least one specification is required"
    }

    // Validate videos
    videos.forEach((video, index) => {
      if (video.thumbnail && !video.videoLink.trim()) {
        newErrors[`video-${index}`] = "Video link is required when thumbnail is provided"
      } else if (video.videoLink.trim() && !validateYouTubeUrl(video.videoLink)) {
        newErrors[`video-${index}`] = "Please enter a valid YouTube URL"
      }
    })

    // Validate total price
    if (!formData.totalPrice.trim()) {
      newErrors.totalPrice = "Total price is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setLoading(true)
    try {
      let response
      if (formData.keySpecs && typeof formData.keySpecs === "object") {
  const sanitizedKeySpecs: Record<string, string> = {}

  Object.entries(formData.keySpecs).forEach(([key, value]) => {
    const sanitizedKey = key.replace(/\./g, "_") // Replace all dots with underscores
    sanitizedKeySpecs[sanitizedKey] = value
  })

  formData.keySpecs = sanitizedKeySpecs
}

      if (editingMachine) {
        response = await updateMachine(editingMachine.id, formData)
      } else {
        response = await addNewMachine(formData)
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
      name: "",
      images: [],
      keySpecs: {},
      description: "",
      workingMechanism: "",
      parentType: "electric",
      type: "",
      videoLink: {},
      totalPrice: "", // Add this field
    })
    setImagePreviews([])
    setKeySpecs([{ key: "", value: "" }])
    setVideos([{ thumbnail: "", videoLink: "" }])
    setErrors({})
    if (imageInputRef.current) {
      imageInputRef.current.value = ""
    }
    videoThumbnailRefs.current = []
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto border-2 border-[#C62828]">
        <DialogHeader className="border-b border-gray-200 pb-4">
          <DialogTitle className="text-xl font-bold text-[#C62828]">
            {editingMachine ? "Update Machine" : "Add New Machine"}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {editingMachine ? "Update the machine details" : "Add a new machine to the catalog"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Machine Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Machine Name *
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter machine name (e.g., Electric Woodbreaker - Standard Model)"
              className={`border-gray-300 focus:border-[#C62828] focus:ring-[#C62828] ${errors.name ? "border-red-500" : ""
                }`}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          {/* Images Upload */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Machine Images *</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <div className="text-center mb-4">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => imageInputRef.current?.click()}
                  className="border-[#C62828] text-[#C62828] hover:bg-[#C62828] hover:text-white bg-transparent"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Images
                </Button>
                <p className="text-sm text-gray-500 mt-2">Select multiple images (PNG, JPG up to 5MB each)</p>
              </div>

              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                  {imagePreviews.map((image, index) => (
                    <div key={index} className="relative">
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`Machine image ${index + 1}`}
                        width={150}
                        height={100}
                        className="rounded-lg object-cover w-full h-24"
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="absolute top-1 right-1 bg-white hover:bg-gray-100 w-6 h-6 p-0"
                        onClick={() => removeImage(index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImagesUpload}
                className="hidden"
              />
            </div>
            {errors.images && <p className="text-red-500 text-sm">{errors.images}</p>}
          </div>

          {/* Key Specifications */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-gray-700">Key Specifications *</Label>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={addKeySpec}
                className="border-[#C62828] text-[#C62828] hover:bg-[#C62828] hover:text-white bg-transparent"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Spec
              </Button>
            </div>

            <div className="space-y-3 border border-gray-200 rounded-lg p-4 max-h-60 overflow-y-auto">
              {keySpecs.map((spec, index) => (
                <div key={index} className="flex gap-2 items-center">
                  
                  <Input
  placeholder="Specification name"
  value={spec.key}
  onClick={() => {
    setEditingKeyIndex(index);
    setTempKeyText(spec.key);
  }}
  readOnly
  className="flex-[2] cursor-pointer bg-white border-gray-300 focus:border-[#C62828] focus:ring-[#C62828]"
/>

                  <Input
                    placeholder="Value"
                    value={spec.value}
                    onChange={(e) => handleKeySpecChange(index, "value", e.target.value)}
                    className="flex-1 border-gray-300 focus:border-[#C62828] focus:ring-[#C62828]"
                  />
                  {keySpecs.length > 1 && (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => removeKeySpec(index)}
                      className="text-red-600 hover:bg-red-50 border-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            {errors.keySpecs && <p className="text-red-500 text-sm">{errors.keySpecs}</p>}
          </div>
{editingKeyIndex !== null && (
  <Dialog open={true} onOpenChange={() => setEditingKeyIndex(null)}>
    <DialogContent className="max-w-md border border-[#C62828]">
      <DialogHeader>
        <DialogTitle>Edit Specification Name</DialogTitle>
      </DialogHeader>
      <Textarea
        rows={4}
        value={tempKeyText}
        onChange={(e) => setTempKeyText(e.target.value)}
        className="w-full border-gray-300 focus:border-[#C62828] focus:ring-[#C62828]"
      />
      <DialogFooter>
        <Button
          variant="outline"
          onClick={() => setEditingKeyIndex(null)}
        >
          Cancel
        </Button>
        <Button
          className="bg-[#C62828] text-white"
          onClick={() => {
            const updatedSpecs = [...keySpecs];
            updatedSpecs[editingKeyIndex].key = tempKeyText;
            setKeySpecs(updatedSpecs);
            setEditingKeyIndex(null);
          }}
        >
          Save
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
)}


          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
              Description *
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter detailed machine description"
              rows={3}
              className={`border-gray-300 focus:border-[#C62828] focus:ring-[#C62828] ${errors.description ? "border-red-500" : ""
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
              placeholder="Explain how the machine works"
              rows={3}
              className={`border-gray-300 focus:border-[#C62828] focus:ring-[#C62828] ${errors.workingMechanism ? "border-red-500" : ""
                }`}
            />
            {errors.workingMechanism && <p className="text-red-500 text-sm">{errors.workingMechanism}</p>}
          </div>

          {/* Category and Type */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Category *</Label>
              <Select
                value={formData.parentType}
                onValueChange={(value: "electric" | "tractor") => handleInputChange("parentType", value)}
              >
                <SelectTrigger className="border-gray-300 focus:border-[#C62828] focus:ring-[#C62828]">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="border-[#C62828]">
                  <SelectItem value="electric">Electric</SelectItem>
                  <SelectItem value="tractor">Tractor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type" className="text-sm font-medium text-gray-700">
                Machine Type *
              </Label>
              <Input
                id="type"
                type="text"
                value={formData.type}
                onChange={(e) => handleInputChange("type", e.target.value)}
                placeholder="Enter machine type (e.g., crane, standard)"
                className={`border-gray-300 focus:border-[#C62828] focus:ring-[#C62828] ${errors.type ? "border-red-500" : ""
                  }`}
              />
              {errors.type && <p className="text-red-500 text-sm">{errors.type}</p>}
            </div>
          </div>

          {/* Total Price */}
          <div className="space-y-2">
  <Label htmlFor="totalPrice" className="text-sm font-medium text-gray-700">
    Total Price *
  </Label>
  <Input
    id="totalPrice"
    type="text"
    value={formData.totalPrice}
    onChange={(e) => {
      const numericValue = e.target.value.replace(/\D/g, ""); // Remove non-digits
      handleInputChange("totalPrice", numericValue);
    }}
    placeholder="Enter total price"
    className={`border-gray-300 focus:border-[#C62828] focus:ring-[#C62828] ${
      errors.totalPrice ? "border-red-500" : ""
    }`}
  />
  {errors.totalPrice && (
    <p className="text-red-500 text-sm">{errors.totalPrice}</p>
  )}
</div>


          {/* Videos */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-gray-700">Machine Videos</Label>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={addVideo}
                className="border-[#C62828] text-[#C62828] hover:bg-[#C62828] hover:text-white bg-transparent"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Video
              </Button>
            </div>

            <div className="space-y-4 border border-gray-200 rounded-lg p-4 max-h-60 overflow-y-auto">
              {videos.map((video, index) => (
                <div key={index} className="border border-gray-100 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">Video {index + 1}</span>
                    {videos.length > 1 && (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => removeVideo(index)}
                        className="text-red-600 hover:bg-red-50 border-red-300 w-8 h-8 p-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-xs text-gray-600">Thumbnail</Label>
                      <div className="border border-gray-300 rounded p-2">
                        {video.thumbnail ? (
                          <div className="relative">
                            <Image
                              src={video.thumbnail || "/placeholder.svg"}
                              alt={`Video ${index + 1} thumbnail`}
                              width={100}
                              height={60}
                              className="rounded object-cover w-full h-16"
                            />
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              className="absolute top-1 right-1 bg-white hover:bg-gray-100 w-6 h-6 p-0"
                              onClick={() => {
                                const newVideos = [...videos]
                                newVideos[index].thumbnail = ""
                                setVideos(newVideos)
                              }}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        ) : (
                          <div
                            className="text-center cursor-pointer py-4"
                            onClick={() => videoThumbnailRefs.current[index]?.click()}
                          >
                            <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                            <p className="text-xs text-gray-500">Upload thumbnail</p>
                          </div>
                        )}
                        <input
                          ref={(el) => {
                            videoThumbnailRefs.current[index] = el; // Correctly set the reference
                          }}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleVideoThumbnailUpload(index, e)}
                          className="hidden"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs text-gray-600">YouTube Link</Label>
                      <Input
                        type="url"
                        value={video.videoLink}
                        onChange={(e) => handleVideoLinkChange(index, e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="text-sm border-gray-300 focus:border-[#C62828] focus:ring-[#C62828]"
                      />
                    </div>
                  </div>

                  {errors[`video-${index}`] && <p className="text-red-500 text-xs mt-2">{errors[`video-${index}`]}</p>}
                </div>
              ))}
            </div>
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
                <Settings className="w-4 h-4 mr-2" />
                {editingMachine ? "Update Machine" : "Add Machine"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
