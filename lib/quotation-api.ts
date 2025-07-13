// Quotation API functions
const API_BASE_URL = "https://selva-ganapathy-hydraulics-zl35.onrender.com/api"

export interface QuotationRequest {
  name: string
  parentType: "electric" | "tractor"
  recipient: string
}

export interface ApiResponse<T> {
  data?: T
  error?: string
  success: boolean
}

// Generate and download PDF quotation
export async function generateQuotationPDF(request: QuotationRequest): Promise<ApiResponse<string>> {
  try {
    const url = `${API_BASE_URL}/generate-pdf?name=${encodeURIComponent(request.name)}&parentType=${request.parentType}&recipient=${encodeURIComponent(request.recipient)}`

    const response = await fetch(url, {
      method: "GET",
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const base64Data = await response.text()
    return { data: base64Data, success: true }
  } catch (error) {
    console.error("Error generating quotation PDF:", error)
    return {
      error: error instanceof Error ? error.message : "Failed to generate quotation PDF",
      success: false,
    }
  }
}

// Convert base64 to downloadable blob
export function downloadBase64PDF(base64Data: string, filename: string) {
  try {
    // Remove data URL prefix if present
    const base64 = base64Data.replace(/^data:application\/pdf;base64,/, "")

    // Convert base64 to binary
    const binaryString = atob(base64)
    const bytes = new Uint8Array(binaryString.length)

    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }

    // Create blob and download
    const blob = new Blob([bytes], { type: "application/pdf" })
    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Clean up
    URL.revokeObjectURL(url)

    return true
  } catch (error) {
    console.error("Error downloading PDF:", error)
    return false
  }
}
