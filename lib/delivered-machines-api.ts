// Delivered Machines Admin API functions
const API_BASE_URL = "https://selva-ganapathy-hydraulics-zl35.onrender.com/api"

export interface DeliveredMachineRequest {
  customerName: string
  location: string
  machineName: string
  image: string // base64 string
  deliveryDate: string // date as string
  description: string
  workingMechanism: string
}

export interface DeliveredMachineResponse extends DeliveredMachineRequest {
  id: string
}

export interface ApiResponse<T> {
  data?: T
  error?: string
  success: boolean
}

// Add new delivered machine
export async function addDeliveredMachine(machineData: DeliveredMachineRequest): Promise<ApiResponse<string>> {
  try {
    const response = await fetch(`${API_BASE_URL}/machines/addDeliveredMachine`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(machineData),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.text()
    return { data, success: true }
  } catch (error) {
    console.error("Error adding delivered machine:", error)
    return {
      error: error instanceof Error ? error.message : "Failed to add delivered machine",
      success: false,
    }
  }
}

// Update delivered machine
export async function updateDeliveredMachine(
  id: string,
  machineData: DeliveredMachineRequest,
): Promise<ApiResponse<string>> {
  try {
    const response = await fetch(`${API_BASE_URL}/machines/updateDeliveredMachine/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(machineData),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.text()
    return { data, success: true }
  } catch (error) {
    console.error("Error updating delivered machine:", error)
    return {
      error: error instanceof Error ? error.message : "Failed to update delivered machine",
      success: false,
    }
  }
}

// Delete delivered machine
export async function deleteDeliveredMachine(id: string): Promise<ApiResponse<string>> {
  try {
    const response = await fetch(`${API_BASE_URL}/machines/deleteDeliveredMachine/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.text()
    return { data, success: true }
  } catch (error) {
    console.error("Error deleting delivered machine:", error)
    return {
      error: error instanceof Error ? error.message : "Failed to delete delivered machine",
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
