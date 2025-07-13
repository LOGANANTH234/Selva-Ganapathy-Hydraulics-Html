// Admin API functions for managing machines
const API_BASE_URL = "https://selva-ganapathy-hydraulics-zl35.onrender.com/api"

// Add totalPrice field to MachineRequest interface
export interface MachineRequest {
  name: string
  images: string[] // base64 strings
  keySpecs: Record<string, string>
  description: string
  workingMechanism: string
  parentType: "electric" | "tractor"
  type: string
 videoLink?: { [base64Image: string]: string };
  totalPrice: string // New field for admin only
}

export interface MachineResponse extends MachineRequest {
  id: string
}

export interface ApiResponse<T> {
  data?: T
  error?: string
  success: boolean
}

// Add new machine
export async function addNewMachine(machineData: MachineRequest): Promise<ApiResponse<MachineResponse>> {
  try {
    const response = await fetch(`${API_BASE_URL}/machines/addNewMachine`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(machineData),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return { data, success: true }
  } catch (error) {
    console.error("Error adding machine:", error)
    return {
      error: error instanceof Error ? error.message : "Failed to add machine",
      success: false,
    }
  }
}

// Update machine
export async function updateMachine(id: string, machineData: MachineRequest): Promise<ApiResponse<MachineResponse>> {
  try {
    console.log(machineData.videoLink);
    const response = await fetch(`${API_BASE_URL}/machines/updateMachine/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(machineData),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return { data, success: true }
  } catch (error) {
    console.error("Error updating machine:", error)
    return {
      error: error instanceof Error ? error.message : "Failed to update machine",
      success: false,
    }
  }
}

// Delete machine
export async function deleteMachine(id: string): Promise<ApiResponse<string>> {
  try {
    const response = await fetch(`${API_BASE_URL}/machines/deleteMachine/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return { data: "Machine deleted successfully", success: true }
  } catch (error) {
    console.error("Error deleting machine:", error)
    return {
      error: error instanceof Error ? error.message : "Failed to delete machine",
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
