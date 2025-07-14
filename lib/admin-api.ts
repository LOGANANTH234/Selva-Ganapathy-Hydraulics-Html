// Admin API functions for managing machine videos
const API_BASE_URL = "https://selvaganapathyhydraulics-1.onrender.com/api"

export interface MachineVideoRequest {
  name: string
  thumbnail: string // base64 string
  videoLink: string
  duration: string
  description: string
}

export interface MachineVideoResponse extends MachineVideoRequest {
  id: string
}

export interface ApiResponse<T> {
  data?: T
  error?: string
  success: boolean
}

// Add new machine video
export async function addNewMachineVideo(videoData: MachineVideoRequest): Promise<ApiResponse<MachineVideoResponse>> {
  try {
    const response = await fetch(`${API_BASE_URL}/machines/addNewMachineVideo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(videoData),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return { data, success: true }
  } catch (error) {
    console.error("Error adding machine video:", error)
    return {
      error: error instanceof Error ? error.message : "Failed to add machine video",
      success: false,
    }
  }
}

// Update machine video
export async function updateMachineVideo(
  id: string,
  videoData: MachineVideoRequest,
): Promise<ApiResponse<MachineVideoResponse>> {
  try {
    const response = await fetch(`${API_BASE_URL}/machines/updateMachineVideo/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(videoData),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return { data, success: true }
  } catch (error) {
    console.error("Error updating machine video:", error)
    return {
      error: error instanceof Error ? error.message : "Failed to update machine video",
      success: false,
    }
  }
}

// Delete machine video
export async function deleteMachineVideo(id: string): Promise<ApiResponse<string>> {
  try {
    const response = await fetch(`${API_BASE_URL}/machines/deleteMachineVideo/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.text()
    return { data, success: true }
  } catch (error) {
    console.error("Error deleting machine video:", error)
    return {
      error: error instanceof Error ? error.message : "Failed to delete machine video",
      success: false,
    }
  }
}

// Utility function to convert file to base64
export function convertFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result)
      } else {
        reject(new Error("Failed to convert file to base64"))
      }
    }
    reader.onerror = (error) => reject(error)
  })
}

// Validate YouTube URL
export function validateYouTubeUrl(url: string): boolean {
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/
  return youtubeRegex.test(url)
}

// Validate duration format (MM:SS)
export function validateDuration(duration: string): boolean {
  const durationRegex = /^([0-9]{1,2}):([0-5][0-9])$/
  return durationRegex.test(duration)
}
