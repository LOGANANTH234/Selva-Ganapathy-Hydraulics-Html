// API configuration and utility functions
const API_BASE_URL = "https://selva-ganapathy-hydraulics-zl35.onrender.com/api"

export interface Machine {
  id: string
  name: string
  images: string[]
  keySpecs: Record<string, string>
  description: string
  parentType: "electric" | "tractor"
  type: string
  videoLink?: { [base64Image: string]: string }; // The key is base64 string, and the value is the YouTube link
workingMechanism : string
totalPrice: string
}

export interface MachineDetail {
  id?: string
  name: string
  images?: string[]
  keySpecs?: Record<string, string>
  description?: string
  workingMechanism?: string
  parentType: "electric" | "tractor"
  videoLink?: { [base64Image: string]: string }; // The key is base64 string, and the value is the YouTube link
totalPrice: string
}

export interface MachineVideo {
  id: string
  name: string
  thumbnail: string
  videoLink: string
  duration: string
  description: string
}

export interface DeliveredMachine {
  id: string
  customerName: string
  location: string
  machineName: string
  image: string
  deliveryDate: string
  description: string
  workingMechanism: string
}

export interface ApiResponse<T> {
  data: T
  error?: string
}

// Fetch machines by parent type
export async function getMachinesByParentType(parentType: "electric" | "tractor"): Promise<ApiResponse<Machine[]>> {
  try {
    const response = await fetch(`${API_BASE_URL}/machines/getMachineByParentType?parentType=${parentType}`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return { data }
  } catch (error) {
    console.error("Error fetching machines:", error)
    return {
      data: [],
      error: error instanceof Error ? error.message : "Failed to fetch machines",
    }
  }
}

// Fetch machine filter types by parent type
export async function getMachineTypesByParentType(parentType: "electric" | "tractor"): Promise<ApiResponse<string[]>> {
  try {
    const response = await fetch(`${API_BASE_URL}/machines/getMachineNamesByParentType?parentType=${parentType}`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return { data }
  } catch (error) {
    console.error("Error fetching machine types:", error)
    return {
      data: [],
      error: error instanceof Error ? error.message : "Failed to fetch machine types",
    }
  }
}

// Fetch machine details by name and parent type
export async function getMachineDetails(
  name: string,
  parentType: "electric" | "tractor",
): Promise<ApiResponse<MachineDetail>> {
  try {
    const encodedName = encodeURIComponent(name)
    const url = `${API_BASE_URL}/machines/getMachineDetails?name=${encodedName}&parentType=${parentType}`
    console.log("Fetching from URL:", url)

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log("API Response:", data)

    // API returns an array, we need the first item
    if (Array.isArray(data) && data.length > 0) {
      return { data: data[0] }
    } else if (data && typeof data === "object" && !Array.isArray(data)) {
      // If API returns a single object instead of array
      return { data }
    } else {
      throw new Error("No machine data found")
    }
  } catch (error) {
    console.error("Error fetching machine details:", error)
    return {
      data: {} as MachineDetail,
      error: error instanceof Error ? error.message : "Failed to fetch machine details",
    }
  }
}

// Fetch all machine videos
export async function getAllMachineVideos(): Promise<ApiResponse<MachineVideo[]>> {
  try {
    const response = await fetch(`${API_BASE_URL}/machines/getAllMachineVideos`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return { data }
  } catch (error) {
    console.error("Error fetching machine videos:", error)
    return {
      data: [],
      error: error instanceof Error ? error.message : "Failed to fetch machine videos",
    }
  }
}

// Fetch all delivered machines
export async function getAllDeliveredMachines(): Promise<ApiResponse<DeliveredMachine[]>> {
  try {
    const response = await fetch(`${API_BASE_URL}/machines/getAllDeliveredMachine`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return { data }
  } catch (error) {
    console.error("Error fetching delivered machines:", error)
    return {
      data: [],
      error: error instanceof Error ? error.message : "Failed to fetch delivered machines",
    }
  }
}

// Convert base64 image to blob URL for better performance
export function convertBase64ToBlob(base64String: string): string {
  try {
    // Extract the base64 data (remove data:image/jpeg;base64, prefix)
    const base64Data = base64String.split(",")[1]
    const byteCharacters = atob(base64Data)
    const byteNumbers = new Array(byteCharacters.length)

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }

    const byteArray = new Uint8Array(byteNumbers)
    const blob = new Blob([byteArray], { type: "image/jpeg" })
    return URL.createObjectURL(blob)
  } catch (error) {
    console.error("Error converting base64 to blob:", error)
    return "/placeholder.svg?height=400&width=600" // Fallback image
  }
}

// Extract YouTube video ID from various YouTube URL formats
export function extractYouTubeVideoId(url: string): string {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[2].length === 11 ? match[2] : ""
}
