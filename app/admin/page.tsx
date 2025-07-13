"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Plus,
  Settings,
  Play,
  FileText,
  Truck,
  Phone,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { MachineFormDialog } from "@/components/admin/machine-form-dialog"
import { MachineListView } from "@/components/admin/machine-list-view"
import { DeliveredMachinesManagement } from "@/components/admin/delivered-machines-management"
import { VideoGallery } from "@/components/video-gallery"
import type { MachineResponse } from "@/lib/machine-admin-api"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const API_BASE_URL = "https://selva-ganapathy-hydraulics-zl35.onrender.com/api"

export default function AdminPage() {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState("quotation")
  const [refreshTrigger, setRefreshTrigger] = useState(0)
const [firstAdvance, setFirstAdvance] = useState("")
const [secondAdvance, setSecondAdvance] = useState("")
const [others, setOthers] = useState("")

  const [showMachineDialog, setShowMachineDialog] = useState(false)
  const [editingMachine, setEditingMachine] = useState<MachineResponse | null>(null)
const [focusedKeyIndex, setFocusedKeyIndex] = useState<number | null>(null)

  const [showQuotationDialog, setShowQuotationDialog] = useState(false)
  const [showContactDialog, setShowContactDialog] = useState(false)

  const [machineNameQ, setMachineNameQ] = useState("")
  const [recipientQ, setRecipientQ] = useState("")
  const [totalPriceQ, setTotalPriceQ] = useState("")
const [keySpecsQ, setKeySpecsQ] = useState([
  { key: "Flatform Length", value: "14 ft" },
  { key: "Cylinder Type", value: "100 mm Shaft" },
  { key: "Barrel", value: "140 mm" },
  { key: "Stroke Length", value: "5 ft" },
  { key: "Oil Capacity", value: "250 Ltr" },
  { key: "Tyre Type", value: "7.50 x 16 (2 Nos)" },
  { key: "Pump", value: "160 x 150 Ltr" },
  { key: "Valve", value: "16/1 - 180 Ltr" },
  { key: "Crane Movement Left and Right", value: "" },
  { key: "Crane Damping Height", value: "16 ft" },
  { key: "Double Step Boom Type", value: "" },
  { key: "Second Boom Stroke Length", value: "6 ft" },
  { key: "Crane Weight Capacity", value: "2 Ton" },
  { key: "No. of Cylinders", value: "3" },
  { key: "All Hoses are 4*P Type", value: "" },
  { key: "Painting and Accessories", value: "" },
])

  const [errorsQ, setErrorsQ] = useState<any>({})
  const [loadingQ, setLoadingQ] = useState(false)
useEffect(() => {
    if (firstAdvance || secondAdvance) {
      setOthers("Balance Machine Delivery\nDelivery Time 10 Days Only");
    } else {
      setOthers(""); // Clear if both fields are empty
    }
  }, [firstAdvance, secondAdvance]);
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("sgh-admin-logged-in")
    if (!isLoggedIn) router.push("/admin/login")
  }, [router])

  const handleAddSpec = () => setKeySpecsQ([...keySpecsQ, { key: "", value: "" }])
  const handleRemoveSpec = (idx: number) => setKeySpecsQ(keySpecsQ.filter((_, i) => i !== idx))
  const handleSpecChange = (idx: number, field: "key" | "value", value: string) => {
    const arr = [...keySpecsQ]
    arr[idx][field] = value
    setKeySpecsQ(arr)
  }

  const validateForm = () => {
    const errs: any = {}
    if (!machineNameQ.trim()) errs.machineName = "Machine name required"
    if (!recipientQ.trim()) errs.recipient = "Recipient required"
    if (!totalPriceQ.trim()) errs.totalPrice = "Total price required"
    if (keySpecsQ.length === 0 || keySpecsQ.some((s) => !s.key.trim())) {
      errs.keySpecs = "Each spec must have a key"
    }
    setErrorsQ(errs)
    return Object.keys(errs).length === 0
  }

  const downloadBase64PDF = (base64: string, filename: string) => {
    const link = document.createElement("a")
    link.href = `data:application/pdf;base64,${base64}`
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const submitQuotation = async () => {
    if (!validateForm()) return
    setLoadingQ(true)
    setErrorsQ({})
    try {
      const params = new URLSearchParams()
      params.append("name", machineNameQ)
      params.append("recipient", recipientQ)
      params.append("totalPrice", totalPriceQ)
      params.append("firstAdvance", firstAdvance)
      params.append("secondAdvance", secondAdvance) 
      params.append("others", others)

      keySpecsQ.forEach((s) => params.append(s.key, s.value))
      const res = await fetch(`${API_BASE_URL}/admin/generate-pdf?${params}`)
      if (!res.ok) throw new Error("Failed to generate PDF")
      const base64 = await res.text()
      downloadBase64PDF(base64, `${machineNameQ.replace(/\s/g, "_")}_Quotation.pdf`)
      setShowQuotationDialog(false)
      setShowContactDialog(true)
      setMachineNameQ("")
      setRecipientQ("")
      setTotalPriceQ("")
      setFirstAdvance("")
      setSecondAdvance("")
      setOthers("")
      //setKeySpecsQ([{ key: "", value: "" }])
    } catch (e) {
      setErrorsQ({ submit: "Error generating quotation." })
    } finally {
      setLoadingQ(false)
    }
  }

  const handleEditMachine = (machine: MachineResponse) => {
    setEditingMachine(machine)
    setShowMachineDialog(true)
  }

  const handleMachineSuccess = () => {
    setRefreshTrigger((prev) => prev + 1)
    setShowMachineDialog(false)
    setEditingMachine(null)
  }

  return (
    <TooltipProvider>
      <main className="min-h-screen bg-white dark:bg-black text-black dark:text-white flex">
        {/* Sidebar */}
        <aside className="w-16 bg-[#f9f9f9] dark:bg-[#1c1c1c] border-r border-gray-200 dark:border-gray-700 p-2 flex flex-col items-center">
          <div className="space-y-2">
            {[
              { id: "quotation", icon: <FileText className="w-5 h-5" />, label: "Quotation" },
              { id: "add-machine", icon: <Plus className="w-5 h-5" />, label: "Add Machine" },
              { id: "manage-machines", icon: <Settings className="w-5 h-5" />, label: "Manage Machines" },
              { id: "videos", icon: <Play className="w-5 h-5" />, label: "Videos" },
              { id: "delivered", icon: <Truck className="w-5 h-5" />, label: "Delivered" },
            ].map(({ id, icon, label }) => (
              <Tooltip key={id}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    onClick={() => setActiveSection(id)}
                    className={`p-3 w-12 h-12 rounded-lg ${
                      activeSection === id ? "bg-[#C62828] text-white" : "hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    {icon}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-black text-white text-xs">
                  {label}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </aside>

        {/* Main */}
        <section className="flex-1 p-6">
          {activeSection === "quotation" && (
            <Button className="bg-[#C62828] text-white" onClick={() => setShowQuotationDialog(true)}>
              Generate Quotation
            </Button>
          )}

          {activeSection === "add-machine" && (
            <Button
              className="bg-[#C62828] text-white"
              onClick={() => {
                setEditingMachine(null)
                setShowMachineDialog(true)
              }}
            >
              <Plus className="w-4 h-4 mr-2" /> Add New Machine
            </Button>
          )}

          {activeSection === "manage-machines" && (
            <>
              <h2 className="text-xl font-bold mb-4">Machine Management</h2>
              <MachineListView onEdit={handleEditMachine} refreshTrigger={refreshTrigger} />
            </>
          )}

          {activeSection === "videos" && (
            <>
              <h2 className="text-xl font-bold mb-4">Video Management</h2>
              <VideoGallery isAdmin onFullscreenChange={() => {}} />
            </>
          )}

          {activeSection === "delivered" && (
            <>
              <h2 className="text-xl font-bold mb-4">Delivered Machines Management</h2>
              <DeliveredMachinesManagement refreshTrigger={refreshTrigger} />
            </>
          )}
        </section>

        {/* Dialogs */}
        <MachineFormDialog
          isOpen={showMachineDialog}
          onClose={() => setShowMachineDialog(false)}
          onSuccess={handleMachineSuccess}
          editingMachine={editingMachine}
        />
<Dialog open={focusedKeyIndex !== null} onOpenChange={() => setFocusedKeyIndex(null)}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Edit Key Specification</DialogTitle>
    </DialogHeader>
    {focusedKeyIndex !== null && (
      <Textarea
        rows={4}
        value={keySpecsQ[focusedKeyIndex].key}
        onChange={(e) => {
          const newSpecs = [...keySpecsQ]
          newSpecs[focusedKeyIndex].key = e.target.value
          setKeySpecsQ(newSpecs)
        }}
      />
    )}
    <DialogFooter className="mt-4">
      <Button onClick={() => setFocusedKeyIndex(null)}>Close</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

        <Dialog open={showQuotationDialog} onOpenChange={setShowQuotationDialog}>
          <DialogContent className="sm:max-w-md border-2 border-[#C62828] max-h-[90vh] overflow-auto dark:bg-[#1a1a1a]">
            <DialogHeader>
              <DialogTitle className="text-[#C62828]">Generate Quotation</DialogTitle>
              <DialogDescription>
                Fill details below to generate a PDF quotation.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 px-4">
              <div>
                <Label>Machine Name *</Label>
                <Input value={machineNameQ} onChange={(e) => setMachineNameQ(e.target.value)} />
                {errorsQ.machineName && <p className="text-red-500 text-sm">{errorsQ.machineName}</p>}
              </div>
              <div>
                <Label>Recipient *</Label>
                <Textarea value={recipientQ} onChange={(e) => setRecipientQ(e.target.value)} rows={2} />
                {errorsQ.recipient && <p className="text-red-500 text-sm">{errorsQ.recipient}</p>}
              </div>
             
              <div>
                <Label>Key Specifications *</Label>
                {keySpecsQ.map((spec, idx) => (
                  <div className="flex gap-2 mb-1" key={idx}>
                    <Input
  placeholder="Key"
  value={spec.key}
  onClick={() => setFocusedKeyIndex(idx)} // opens the textarea
  readOnly // prevent direct editing in the input
  className="w-2/3 cursor-pointer"
/>

                    <Input placeholder="Value"  className="w-2/3" value={spec.value} onChange={(e) => handleSpecChange(idx, "value", e.target.value)} />
                    {keySpecsQ.length > 1 && (
                      <Button onClick={() => handleRemoveSpec(idx)} variant="outline" className="text-red-500 border-red-300">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  
                ))}
                <Button onClick={handleAddSpec} className="bg-[#C62828] text-white hover:bg-[#B71C1C] mt-2">
                  <Plus className="w-4 h-4 mr-1" /> Add Spec
                </Button>
                 {errorsQ.keySpecs && <p className="text-red-500 text-sm">{errorsQ.keySpecs}</p>}
                 <div>
                <Label>Total Price *</Label>
              <Input
  type="number"
  min="1"
  value={totalPriceQ}
  onChange={(e) => {
    const val = e.target.value;
    if (/^\d*$/.test(val)) {
      setTotalPriceQ(val);
    }
  }}
  className="appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
/>

                {errorsQ.totalPrice && <p className="text-red-500 text-sm">{errorsQ.totalPrice}</p>}
              </div>
              <div>
  <Label>First Advance</Label>
  <Input
  type="number"
  value={firstAdvance}
  min="1"
  onChange={(e) => {
    const val = e.target.value;
    if (/^\d*$/.test(val)) {
      setFirstAdvance(val);
    }
  }}
  className="appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
/>

</div>

<div>
  <Label>Second Advance</Label>
  <Input
  type="number"
  value={secondAdvance}
  min="1"
  onChange={(e) => {
    const val = e.target.value;
    if (/^\d*$/.test(val)) {
      setSecondAdvance(val);
    }
  }}
  className="appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
/>

</div>

<div>
  <Label>Others</Label>
  <Textarea
    rows={3}
    value={others}
    onChange={(e) => setOthers(e.target.value)}
  />
</div>
                
               
              </div>
              {errorsQ.submit && <p className="text-red-500 text-sm">{errorsQ.submit}</p>}
            </div>
            <DialogFooter>
              <Button onClick={() => setShowQuotationDialog(false)} variant="outline">Cancel</Button>
              <Button disabled={loadingQ} onClick={submitQuotation} className="bg-[#C62828] text-white">
                {loadingQ ? "Generating..." : "Submit Quotation"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <AlertDialog open={showContactDialog} onOpenChange={setShowContactDialog}>
          <AlertDialogContent className="border-2 border-green-500 dark:bg-[#1a1a1a]">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-green-600 flex items-center">
                <Phone className="mr-2" /> Quotation Downloaded!
              </AlertDialogTitle>
              <AlertDialogDescription>
                <p>The quotation PDF has been downloaded. Thank you!</p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction className="bg-green-600 text-white hover:bg-green-700">
                OK
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </TooltipProvider>
  )
}
