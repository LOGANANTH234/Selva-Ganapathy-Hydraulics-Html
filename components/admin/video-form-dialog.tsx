"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Upload, X, Play } from "lucide-react"
import Image from "next/image"
import {
  addNewMachineVideo,
  updateMachineVideo,
  convertFileToBase64,
  validateYouTubeUrl,
  validateDuration,
  type MachineVideoRequest,
  type MachineVideoResponse,
} from "@/lib/admin-api"
import { LoadingSpinner } from "@/components/loading-spinner"

interface VideoFormDialogProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  editingVideo?: MachineVideoResponse | null
}

export function VideoFormDialog({ isOpen, onClose, onSuccess, editingVideo }: VideoFormDialogProps) {
  const [formData, setFormData] = useState<MachineVideoRequest>({
    name: "",
    thumbnail: "",
    videoLink: "",
    duration: "",
    description: "",
  })
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Reset and populate form when dialog opens or editing video changes
  useEffect(() => {
    if (isOpen) {
      if (editingVideo) {
        // Populate form with existing video data
        setFormData({
          name: editingVideo.name || "",
          thumbnail: editingVideo.thumbnail || "",
          videoLink: editingVideo.videoLink || "",
          duration: editingVideo.duration || "",
          description: editingVideo.description || "",
        })
        setThumbnailPreview(editingVideo.thumbnail || "")
      } else {
        // Reset form for new video
        setFormData({
          name: "",
          thumbnail: "",
          videoLink: "",
          duration: "",
          description: "",
        })
        setThumbnailPreview("")
      }
      setErrors({})
    }
  }, [isOpen, editingVideo])

  const handleInputChange = (field: keyof MachineVideoRequest, value: string) => {
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
      setErrors((prev) => ({ ...prev, thumbnail: "Please select a valid image file" }))
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, thumbnail: "Image size should be less than 5MB" }))
      return
    }

    try {
      const base64 = await convertFileToBase64(file)
      setFormData((prev) => ({ ...prev, thumbnail: base64 }))
      setThumbnailPreview(base64)
      setErrors((prev) => ({ ...prev, thumbnail: "" }))
    } catch (error) {
      setErrors((prev) => ({ ...prev, thumbnail: "Failed to process image" }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    // Validate thumbnail
    if (!formData.thumbnail) {
      newErrors.thumbnail = "Thumbnail image is required"
    }

    // Validate video link
    if (!formData.videoLink.trim()) {
      newErrors.videoLink = "Video link is required"
    } else if (!validateYouTubeUrl(formData.videoLink)) {
      newErrors.videoLink = "Please enter a valid YouTube URL"
    }

    // Validate duration
    if (!formData.duration.trim()) {
      newErrors.duration = "Duration is required"
    } else if (!validateDuration(formData.duration)) {
      newErrors.duration = "Duration must be in MM:SS format (e.g., 2:45)"
    }

    // Validate description
    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setLoading(true)
    try {
      let response
      if (editingVideo) {
        response = await updateMachineVideo(editingVideo.id, formData)
      } else {
        response = await addNewMachineVideo(formData)
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
      thumbnail: "",
      videoLink: "",
      duration: "",
      description: "",
    })
    setThumbnailPreview("")
    setErrors({})
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    onClose()
  }

  const removeThumbnail = () => {
    setFormData((prev) => ({ ...prev, thumbnail: "" }))
    setThumbnailPreview("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    setErrors((prev) => ({ ...prev, thumbnail: "" }))
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto border-2 border-[#C62828]">
        <DialogHeader className="border-b border-gray-200 pb-4">
          <DialogTitle className="text-xl font-bold text-[#C62828]">
            {editingVideo ? "Update Machine Video" : "Add New Machine Video"}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {editingVideo ? "Update the machine demonstration video details" : "Add a new machine demonstration video"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Video Name *
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter video name (e.g., Woodbreaker Motor Operation)"
              className={`border-gray-300 focus:border-[#C62828] focus:ring-[#C62828] ${
                errors.name ? "border-red-500" : ""
              }`}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          {/* Thumbnail Upload */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Thumbnail Image *</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              {thumbnailPreview ? (
                <div className="relative">
                  <Image
                    src={thumbnailPreview || "/placeholder.svg"}
                    alt="Thumbnail preview"
                    width={200}
                    height={120}
                    className="rounded-lg object-cover mx-auto"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2 bg-white hover:bg-gray-100"
                    onClick={removeThumbnail}
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
                  <p className="text-gray-600 mb-2">Click to upload thumbnail image</p>
                  <p className="text-sm text-gray-500">PNG, JPG up to 5MB</p>
                </div>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </div>
            {errors.thumbnail && <p className="text-red-500 text-sm">{errors.thumbnail}</p>}
          </div>

          {/* Video Link */}
          <div className="space-y-2">
            <Label htmlFor="videoLink" className="text-sm font-medium text-gray-700">
              YouTube Video Link *
            </Label>
            <Input
              id="videoLink"
              type="url"
              value={formData.videoLink}
              onChange={(e) => handleInputChange("videoLink", e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className={`border-gray-300 focus:border-[#C62828] focus:ring-[#C62828] ${
                errors.videoLink ? "border-red-500" : ""
              }`}
            />
            {errors.videoLink && <p className="text-red-500 text-sm">{errors.videoLink}</p>}
            <p className="text-xs text-gray-500">
              Enter a valid YouTube URL (e.g., https://www.youtube.com/watch?v=bH1DV9p1SXE)
            </p>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <Label htmlFor="duration" className="text-sm font-medium text-gray-700">
              Duration (MM:SS) *
            </Label>
            <Input
              id="duration"
              type="text"
              value={formData.duration}
              onChange={(e) => handleInputChange("duration", e.target.value)}
              placeholder="2:45"
              className={`border-gray-300 focus:border-[#C62828] focus:ring-[#C62828] ${
                errors.duration ? "border-red-500" : ""
              }`}
            />
            {errors.duration && <p className="text-red-500 text-sm">{errors.duration}</p>}
            <p className="text-xs text-gray-500">Format: MM:SS (e.g., 2:45 for 2 minutes 45 seconds)</p>
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
              placeholder="Enter video description (e.g., Watch how our electric motor woodbreaker efficiently processes logs)"
              rows={3}
              className={`border-gray-300 focus:border-[#C62828] focus:ring-[#C62828] ${
                errors.description ? "border-red-500" : ""
              }`}
            />
            {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
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
                <span className="ml-2">{editingVideo ? "Updating..." : "Adding..."}</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                {editingVideo ? "Update Video" : "Add Video"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
