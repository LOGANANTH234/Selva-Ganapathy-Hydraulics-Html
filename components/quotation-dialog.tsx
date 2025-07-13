"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { FileText, Download, Phone } from "lucide-react"
import { generateQuotationPDF, downloadBase64PDF, type QuotationRequest } from "@/lib/quotation-api"
import { LoadingSpinner } from "@/components/loading-spinner"

interface QuotationDialogProps {
  isOpen: boolean
  onClose: () => void
  machineName: string
  parentType: "electric" | "tractor"
}

export function QuotationDialog({ isOpen, onClose, machineName, parentType }: QuotationDialogProps) {
  const [recipient, setRecipient] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showContactDialog, setShowContactDialog] = useState(false)

  const handleGenerateQuotation = async () => {
    if (!recipient.trim()) {
      setError("Recipient name is required")
      return
    }

    setLoading(true)
    setError("")

    try {
      const request: QuotationRequest = {
        name: machineName,
        parentType,
        recipient: recipient.trim(),
      }

      const response = await generateQuotationPDF(request)

      if (response.success && response.data) {
        // Download the PDF
        const filename = `${machineName.replace(/[^a-zA-Z0-9]/g, "_")}_Quotation.pdf`
        const downloadSuccess = downloadBase64PDF(response.data, filename)

        if (downloadSuccess) {
          // Close the quotation dialog and show contact dialog
          onClose()
          setRecipient("")
          setShowContactDialog(true)
        } else {
          setError("Failed to download PDF. Please try again.")
        }
      } else {
        setError(response.error || "Failed to generate quotation")
      }
    } catch (error) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setRecipient("")
    setError("")
    onClose()
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[500px] border-2 border-[#C62828]">
          <DialogHeader className="border-b border-gray-200 pb-4">
            <DialogTitle className="text-xl font-bold text-[#C62828] flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Generate Quotation
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Generate and download a detailed PDF quotation for <strong>{machineName}</strong>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
  <div className="space-y-2">
    <Label htmlFor="recipient" className="text-sm font-medium text-gray-700">
      Recipient Details For Quotation*
    </Label>
    <textarea
      id="recipient"
      value={recipient}
      onChange={(e) => {
        setRecipient(e.target.value);
        if (error) setError("");
      }}
     placeholder="Name and Address..."
      className={`border-2 border-gray-300 focus:border-[#C62828] focus:ring-[#C62828] ${
        error ? "border-red-500" : ""
      } resize-none`}
      disabled={loading}
      rows={4}
      cols={40}
      style={{ cursor: 'text' }} // Ensure the cursor is a text cursor
    />
    {error && <p className="text-red-500 text-sm">{error}</p>}
  </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-blue-800 text-sm">
                <strong>Note:</strong> The quotation will include machine specifications, pricing, and terms &
                conditions.
              </p>
            </div>
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
              onClick={handleGenerateQuotation}
              disabled={loading || !recipient.trim()}
              className="bg-[#C62828] hover:bg-[#B71C1C] text-white"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="small" />
                  <span className="ml-2">Generating...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Generate & Download
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Contact Information Dialog */}
      <AlertDialog open={showContactDialog} onOpenChange={setShowContactDialog}>
        <AlertDialogContent className="border-2 border-green-500">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-green-600 flex items-center">
              <Phone className="w-5 h-5 mr-2" />
              Quotation Downloaded Successfully!
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p>Your quotation has been downloaded successfully.</p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-yellow-800 font-medium">For accurate details, please contact:</p>
                <div className="mt-2 space-y-1">
                  <p className="font-semibold text-gray-800">Thanigai Aarasu</p>
                  <p className="text-gray-700">📞 75026 21020</p>
                  <p className="text-gray-700">📞 74026 21020</p>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => setShowContactDialog(false)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Got it, Thanks!
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
