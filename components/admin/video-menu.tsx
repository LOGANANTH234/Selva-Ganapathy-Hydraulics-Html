"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
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
import { MoreVertical, Edit, Trash2 } from "lucide-react"
import { deleteMachineVideo, type MachineVideoResponse } from "@/lib/admin-api"
import { LoadingSpinner } from "@/components/loading-spinner"

interface VideoMenuProps {
  video: MachineVideoResponse
  onEdit: (video: MachineVideoResponse) => void
  onDelete: () => void
}

export function VideoMenu({ video, onEdit, onDelete }: VideoMenuProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleEdit = () => {
    onEdit(video)
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const response = await deleteMachineVideo(video.id)
      if (response.success) {
        onDelete()
        setShowDeleteDialog(false)
      } else {
        alert(response.error || "Failed to delete video")
      }
    } catch (error) {
      alert("An error occurred while deleting the video")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
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
          <DropdownMenuItem onClick={handleEdit} className="hover:bg-[#C62828]/10 focus:bg-[#C62828]/10">
            <Edit className="w-4 h-4 mr-2 text-[#C62828]" />
            <span className="text-[#C62828]">Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="hover:bg-red-50 focus:bg-red-50">
            <Trash2 className="w-4 h-4 mr-2 text-red-600" />
            <span className="text-red-600">Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="border-2 border-red-500">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600">Delete Video</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{video.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting} className="border-gray-300 text-gray-700 hover:bg-gray-50">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
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
    </>
  )
}
