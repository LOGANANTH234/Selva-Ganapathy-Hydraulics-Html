"use client"

import { useState, useRef, useEffect } from "react"
import { Plus, Trash2, Download, Eye, Edit2, X, Check } from "lucide-react"
// DELETE the entire SGH_LOGO_B64 constant (the long broken string)
// Replace with:
const SGH_LOGO_SRC = "/images/logo.png"

// ─── Share Modal ─────────────────────────────────────────────────────────────
function ShareModal({ onClose, machineName }: { onClose: () => void; machineName: string }) {
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState(`Hi, please find the quotation for ${machineName} attached.`)

  const handleWhatsAppShare = () => {
    const cleanPhone = phone.replace(/\D/g, "")
    const encodedMsg = encodeURIComponent(message)
    const url = cleanPhone ? `https://wa.me/${cleanPhone}?text=${encodedMsg}` : `https://wa.me/?text=${encodedMsg}`
    window.open(url, "_blank")
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-xl shadow-2xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-base font-bold text-gray-900">Share Quotation</h2>
            <p className="text-xs text-gray-500">PDF downloaded successfully</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button>
        </div>
        
        <div className="p-5 space-y-3">
          {/* WhatsApp Share Section */}
          <div className="border border-gray-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-[#25D366] flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Share via WhatsApp</p>
                <p className="text-xs text-gray-500">Send with message</p>
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Phone number <span className="text-gray-400">(optional)</span></label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g. 919876543210"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366]" />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Message</label>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] resize-none" />
            </div>
            
            <button onClick={handleWhatsAppShare} className="w-full px-4 py-2.5 bg-[#25D366] text-white rounded-lg text-sm font-semibold hover:bg-[#20BA5A] flex items-center justify-center gap-2">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Open WhatsApp
            </button>
          </div>

          <p className="text-[11px] text-gray-500">Note: WhatsApp doesn't allow direct file sharing from web. Please manually attach the downloaded PDF in the WhatsApp chat.</p>
        </div>

        <div className="px-5 py-4 border-t border-gray-200 flex gap-3 sticky bottom-0 bg-gray-50">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100">Done</button>
        </div>
      </div>
    </div>
  )
}




  // Main share menu
  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-xl shadow-2xl w-full sm:max-w-sm max-h-[90vh] overflow-y-auto">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-base font-bold text-gray-900">Share Quotation</h2>
            <p className="text-xs text-gray-500">PDF ready to share</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button>
        </div>
        
        <div className="p-5 space-y-3">
          <button onClick={() => setStep("whatsapp")} 
            className="w-full flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-[#25D366] flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold text-gray-900">WhatsApp</p>
              <p className="text-xs text-gray-500">Send with message</p>
            </div>
          </button>

          <button onClick={() => setStep("telegram")} 
            className="w-full flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-[#0088cc] flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.869 4.332-2.97-.924c-.644-.203-.658-.644.135-.954l11.593-4.47c.54-.196 1.011.131.832.942z" />
              </svg>
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold text-gray-900">Telegram</p>
              <p className="text-xs text-gray-500">Send message</p>
            </div>
          </button>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-[10px] text-gray-700 text-center font-medium">Smart<br/>Sidebar</span>
              <span className="text-[9px] text-gray-400">Save</span>
            </button>

            <button className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-blue-400 flex items-center justify-center">
                <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54h2.86v4h2v-4h2.86l-2.75-3.54 1.96-2.36H9.5V4h-2v4H4.64l2.75 3.54-1.96 2.36H6.3v4h2v-4h2.86z" />
                </svg>
              </div>
              <span className="text-[10px] text-gray-700 text-center font-medium">My<br/>Files</span>
              <span className="text-[9px] text-gray-400">Save</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center">
                <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                  <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4c-1.48 0-2.85.43-4.01 1.17l1.46 1.46C10.21 5.23 11.08 5 12 5c3.04 0 5.5 2.46 5.5 5.5v.5H19c1.66 0 3 1.34 3 3 0 1.13-.64 2.11-1.56 2.62l1.45 1.45c.9-.86 1.48-2.04 1.48-3.36 0-.77-.18-1.5-.48-2.15z" />
                </svg>
              </div>
              <span className="text-[10px] text-gray-700 text-center font-medium">Link to<br/>Windows</span>
              <span className="text-[9px] text-gray-400">Send</span>
            </button>

            <button className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-cyan-500 flex items-center justify-center">
                <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                  <path d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.99 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 L4.13399899,1.01554701 C3.34915502,0.9 2.40734225,0.9 1.77946707,1.4686203 C0.994623095,2.03684061 0.837654326,3.12632979 1.15159189,3.91181669 L3.03521743,10.3528097 C3.03521743,10.5099071 3.34915502,10.6670045 3.50612381,10.6670045 L16.6915026,11.4524914 C16.6915026,11.4524914 17.1624089,11.4524914 17.1624089,12.0211117 C17.1624089,12.4744748 16.6915026,12.4744748 16.6915026,12.4744748 Z" />
                </svg>
              </div>
              <span className="text-[10px] text-gray-700 text-center font-medium">Telegram<br/>App</span>
              <span className="text-[9px] text-gray-400">Share</span>
            </button>
          </div>
        </div>

        <div className="px-5 py-4 border-t border-gray-200 flex gap-3 sticky bottom-0 bg-gray-50">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100">Cancel</button>
        </div>
      </div>
    </div>
  )
}

// ─── Fraction Popover Input ───────────────────────────────────────────────────
function FractionInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false)
  const p = value ? value.split("/") : ["", ""]
  const [num, setNum] = useState(p[0] || "")
  const [den, setDen] = useState(p[1] || "")
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const q = value ? value.split("/") : ["", ""]
    setNum(q[0] || ""); setDen(q[1] || "")
  }, [value])

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const emit = (n: string, d: string) => { if (n && d) onChange(`${n}/${d}`); else onChange("") }
  const handleNum = (v: string) => { setNum(v); emit(v, den) }
  const handleDen = (v: string) => { setDen(v); emit(num, v) }

  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen((o) => !o)}
        className={`border rounded px-1.5 py-1 text-xs w-12 text-center focus:outline-none focus:ring-1 focus:ring-[#C62828] transition-colors
          ${open ? "border-[#C62828] bg-red-50" : "border-gray-300 bg-white hover:border-gray-400"}
          ${value ? "font-semibold text-gray-800" : "text-gray-400"}`}>
        {value || "—"}
      </button>
      {open && (
        <div className="absolute z-50 top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl p-3 w-24 flex flex-col items-center gap-1">
          <p className="text-[9px] text-gray-400 font-medium uppercase tracking-wide">Fraction</p>
          <input autoFocus type="text" inputMode="numeric" value={num} onChange={(e) => handleNum(e.target.value.replace(/\D/g, ""))} placeholder="1"
            className="w-14 text-center border border-gray-300 rounded text-sm font-bold py-1 focus:outline-none focus:ring-1 focus:ring-[#C62828]" />
          <div className="w-14 border-t-2 border-gray-700" />
          <input type="text" inputMode="numeric" value={den} onChange={(e) => handleDen(e.target.value.replace(/\D/g, ""))} placeholder="2"
            className="w-14 text-center border border-gray-300 rounded text-sm font-bold py-1 focus:outline-none focus:ring-1 focus:ring-[#C62828]" />
          <button onClick={() => { setNum(""); setDen(""); onChange(""); setOpen(false) }} className="mt-1 text-[9px] text-red-400 hover:text-red-600">clear</button>
        </div>
      )}
    </div>
  )
}

// ─── Description helpers ──────────────────────────────────────────────────────
const UNIT_OPTIONS = ["", "in", "ft", "mm", "cm", "m", "Ft", '"', "'"]

interface DescParts { w1: string; f1: string; unit1: string; w2: string; f2: string; unit2: string; count: string }

function buildDescString(p: DescParts) {
  const d1 = p.w1 + (p.f1 ? ` ${p.f1}` : "")
  const d2 = p.w2 + (p.f2 ? ` ${p.f2}` : "")
  const u1 = p.unit1 || ""; const u2 = p.unit2 || p.unit1 || ""
  const cnt = p.count ? ` - ${p.count}no` : ""
  if (!d1 && !d2) return ""
  if (!p.w2 && !p.f2) return `${d1}${u1}${cnt}`
  return `${d1}${u1} x ${d2}${u2}${cnt}`
}

function parseDescString(desc: string): DescParts {
  const parts: DescParts = { w1: "", f1: "", unit1: "in", w2: "", f2: "", unit2: "in", count: "" }
  if (!desc) return parts
  const m = desc.match(/^(\d+)?\s*(\d+\/\d+)?([a-zA-Z"']*)\s*x\s*(\d+)?\s*(\d+\/\d+)?([a-zA-Z"']*)?(?:\s*-\s*(\d+)no)?/i)
  if (m) {
    parts.w1 = m[1] || ""; parts.f1 = m[2] || ""; parts.unit1 = m[3] || ""
    parts.w2 = m[4] || ""; parts.f2 = m[5] || ""; parts.unit2 = m[6] || m[3] || ""; parts.count = m[7] || ""
  } else {
    const s = desc.match(/^(\d+)?\s*(\d+\/\d+)?([a-zA-Z"']*)(?:\s*-\s*(\d+)no)?/i)
    if (s) { parts.w1 = s[1] || ""; parts.f1 = s[2] || ""; parts.unit1 = s[3] || ""; parts.count = s[4] || "" }
  }
  return parts
}

function renderDescHTML(desc: string, showCount = true): string {
  if (!desc) return `<span style="color:#9ca3af;font-style:italic;font-size:11px;">No description</span>`
  const parts = parseDescString(desc)
  const renderDim = (whole: string, frac: string, unit: string) => {
    let html = ""
    if (whole) html += `<span style="font-weight:700;color:#1f2937;font-size:13px;">${whole}</span>`
    if (frac) html += `<span style="font-weight:600;color:#6b7280;font-size:12px;margin:0 2px;"> ${frac} </span>`
    if (unit) html += `<span style="font-weight:700;color:#1f2937;font-size:13px;"> ${unit}</span>`
    return html
  }
  const hasD1 = parts.w1 || parts.f1; const hasD2 = parts.w2 || parts.f2
  if (!hasD1 && !hasD2) return `<span style="font-weight:700;color:#1f2937;font-size:13px;">${desc}</span>`
  let html = ""
  if (hasD1) html += renderDim(parts.w1, parts.f1, parts.unit1)
  if (hasD2) { html += `<span style="color:#6b7280;font-weight:700;font-size:13px;margin:0 6px;">×</span>`; html += renderDim(parts.w2, parts.f2, parts.unit2) }
  if (showCount && parts.count) {
    html += `<span style="color:#9ca3af;font-size:13px;margin:0 5px;">—</span>`
    html += `<span style="font-weight:700;color:#1f2937;font-size:13px;">${parts.count}</span>`
    html += `<span style="font-size:10px;font-weight:500;color:#6b7280;margin-left:2px;">No</span>`
  }
  return html
}

function VisualFraction({ frac }: { frac: string }) {
  if (!frac) return null
  const [num, den] = frac.split("/")
  if (!num || !den) return null
  return (
    <span className="inline-flex flex-col items-center justify-center leading-none bg-gray-100 rounded px-1 py-0.5 mx-1 border border-gray-200">
      <span className="text-[10px] font-bold text-gray-700">{num}</span>
      <span className="w-full h-px bg-gray-400" />
      <span className="text-[10px] font-bold text-gray-700">{den}</span>
    </span>
  )
}

function DescDisplay({ desc, showCount = true }: { desc: string; showCount?: boolean }) {
  if (!desc) return <span className="text-gray-400 italic text-xs">No description</span>
  const parts = parseDescString(desc)
  const hasD1 = parts.w1 || parts.f1; const hasD2 = parts.w2 || parts.f2
  if (!hasD1 && !hasD2) return <span className="font-semibold text-gray-800 text-sm">{desc}</span>
  return (
    <span className="inline-flex items-center gap-1 flex-wrap">
      {hasD1 && (
        <span className="inline-flex items-center">
          {parts.w1 && <span className="font-bold text-gray-800 text-sm">{parts.w1}</span>}
          <VisualFraction frac={parts.f1} />
          {parts.unit1 && <span className="text-[10px] font-medium text-gray-500 uppercase ml-0.5">{parts.unit1}</span>}
        </span>
      )}
      {hasD2 && (
        <>
          <span className="text-gray-400 font-bold text-sm">×</span>
          <span className="inline-flex items-center">
            {parts.w2 && <span className="font-bold text-gray-800 text-sm">{parts.w2}</span>}
            <VisualFraction frac={parts.f2} />
            {parts.unit2 && <span className="text-[10px] font-medium text-gray-500 uppercase ml-0.5">{parts.unit2}</span>}
          </span>
        </>
      )}
      {showCount && parts.count && (
        <span className="inline-flex items-center ml-1">
          <span className="text-gray-400 text-sm mr-1">—</span>
          <span className="font-bold text-gray-800 text-sm">{parts.count}</span>
          <span className="ml-0.5 text-[10px] font-medium text-gray-500">No</span>
        </span>
      )}
    </span>
  )
}

function DescEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [parts, setParts] = useState(() => parseDescString(value))
  const update = (key: keyof DescParts, val: string) => {
    const next = { ...parts, [key]: val }; setParts(next); onChange(buildDescString(next))
  }
  const inCls = "border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#C62828] text-xs px-1.5 py-1.5 bg-white"
  const lbl = "text-[10px] font-medium text-gray-500 text-center block mb-0.5"
  return (
    <div className="space-y-2">
      <div className="flex items-end gap-1 flex-wrap">
        <div><span className={lbl}>Whole</span><input className={inCls} style={{ width: 42 }} value={parts.w1} onChange={(e) => update("w1", e.target.value)} placeholder="12" /></div>
        <div><span className={lbl}>Frac</span><FractionInput value={parts.f1} onChange={(v) => update("f1", v)} /></div>
        <div><span className={lbl}>Unit</span>
          <select className={inCls} style={{ width: 52 }} value={parts.unit1} onChange={(e) => update("unit1", e.target.value)}>
            {UNIT_OPTIONS.map((u) => <option key={u} value={u}>{u || "—"}</option>)}
          </select>
        </div>
        <div className="pb-1 px-0.5"><span className={lbl}>&nbsp;</span><span className="text-xs font-bold text-gray-500">×</span></div>
        <div><span className={lbl}>Whole</span><input className={inCls} style={{ width: 42 }} value={parts.w2} onChange={(e) => update("w2", e.target.value)} placeholder="20" /></div>
        <div><span className={lbl}>Frac</span><FractionInput value={parts.f2} onChange={(v) => update("f2", v)} /></div>
        <div><span className={lbl}>Unit</span>
          <select className={inCls} style={{ width: 52 }} value={parts.unit2} onChange={(e) => update("unit2", e.target.value)}>
            {UNIT_OPTIONS.map((u) => <option key={u} value={u}>{u || "—"}</option>)}
          </select>
        </div>
        <div className="pb-1 px-0.5"><span className={lbl}>&nbsp;</span><span className="text-xs font-bold text-gray-500">—</span></div>
        <div><span className={lbl}>Count</span><input className={inCls} style={{ width: 38 }} value={parts.count} onChange={(e) => update("count", e.target.value)} placeholder="2" /></div>
        <div className="pb-1"><span className={lbl}>&nbsp;</span><span className="text-xs font-semibold text-gray-500">No</span></div>
      </div>
      {buildDescString(parts) && (
        <p className="text-[10px] text-gray-400 italic">Preview: <span className="font-semibold text-gray-600">{buildDescString(parts)}</span></p>
      )}
    </div>
  )
}

// ─── SVG Diagrams ─────────────────────────────────────────────────────────────
interface DiagramDims { [key: string]: string | undefined }
interface DiagramData { shape: string; dims: DiagramDims }

function ChannelSVG({ dims = {}, size = "preview", activeKey }: { dims?: DiagramDims; size?: "preview" | "inline"; activeKey?: string | null }) {
  const isP = size === "preview"
  const w = isP ? 200 : 120; const h = isP ? 100 : 65; const fs = isP ? 10 : 9
  const baseColor = "#333"; const highlight = "#C62828"; const textColor = "#111"
  const getStroke = (key: string) => (activeKey === key ? highlight : baseColor)
  const getWidth = (key: string) => (activeKey === key ? (isP ? 3 : 2.2) : isP ? 2 : 1.5)
  const getTextFill = (key: string) => (activeKey === key ? highlight : textColor)
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} xmlns="http://www.w3.org/2000/svg">
      <text x={w / 2} y={isP ? 12 : 10} textAnchor="middle" fontSize={fs} fill={getTextFill("top")} fontWeight="bold">{dims.top || "Top"}</text>
      <line x1={w * 0.3} y1={isP ? 18 : 15} x2={w * 0.7} y2={isP ? 18 : 15} stroke={getStroke("top")} strokeWidth={getWidth("top")} />
      <line x1={w * 0.3} y1={isP ? 18 : 15} x2={w * 0.2} y2={isP ? 75 : 50} stroke={getStroke("height")} strokeWidth={getWidth("height")} />
      <line x1={w * 0.7} y1={isP ? 18 : 15} x2={w * 0.8} y2={isP ? 75 : 50} stroke={getStroke("length")} strokeWidth={getWidth("length")} />
      <line x1={w * 0.15} y1={isP ? 75 : 50} x2={w * 0.85} y2={isP ? 75 : 50} stroke={getStroke("bottom")} strokeWidth={getWidth("bottom")} />
      <text x={isP ? 10 : 4} y={isP ? 50 : 35} fontSize={fs - 1} fill={getTextFill("height")} fontWeight="bold">{dims.height || "H"}</text>
      <text x={w / 2} y={isP ? 90 : 62} textAnchor="middle" fontSize={fs} fill={getTextFill("bottom")} fontWeight="bold">{dims.bottom || "Bottom"}</text>
      <text x={isP ? w - 12 : w - 6} y={isP ? 50 : 35} fontSize={fs - 1} fill={getTextFill("length")} fontWeight="bold">{dims.length || "L"}</text>
    </svg>
  )
}

// ─── FIXED LBracketSVG ────────────────────────────────────────────────────────
// Fixes:
//  1. Left label is placed LEFT of the arm (textAnchor="end" at lx-gap), not on it
//  2. Fractions render inline as "3 ¹⁄₂" using baseline-shift tspans, not vertical stacking
//  3. Right label is placed RIGHT of the arm (textAnchor="start" at rx+gap)
//  4. Wide enough SVG so labels never clip
function LBracketSVG({ dims = {}, size = "preview", activeKey }: { dims?: DiagramDims; size?: "preview" | "inline"; activeKey?: string | null }) {
  const isP = size === "preview"
  const w = isP ? 310 : 220; const h = isP ? 110 : 80; const fs = isP ? 12 : 9
  const baseColor = "#222"; const highlight = "#C62828"
  const getStroke = (key: string) => (activeKey === key ? highlight : baseColor)
  const getWidth = (key: string) => (activeKey === key ? (isP ? 3 : 2.2) : isP ? 2 : 1.5)
  const getColor = (key: string) => (activeKey === key ? highlight : "#333")
  // lx is placed with enough room for the left label to the left of it
  const lx = isP ? 90 : 65; const rx = isP ? 175 : 125
  const baseY = isP ? 85 : 57; const ltY = isP ? 12 : 10; const rtY = isP ? 22 : 16
  const bRx = isP ? 288 : 205
  // Gap between arm and label
  const gap = isP ? 7 : 5

  const parseDimensionValue = (value: string) => {
    if (!value) return { whole: "", frac: "", unit: "" }
    const match = value.trim().match(/^(\d+)?\s*(\d+\/\d+)?\s*([a-zA-Z"']*)/)
    return { whole: match?.[1] || "", frac: match?.[2] || "", unit: match?.[3] || "" }
  }

  // Renders a dimension as a single <text> element with inline fraction using baseline-shift
  // This keeps everything on one line: "3 ¹⁄₂ in"
  const renderDimension = (value: string | undefined, fallback: string, x: number, y: number, anchor: string, colorKey: string) => {
    const { whole, frac, unit } = parseDimensionValue(value || "")
    const actualWhole = whole || (value ? "" : fallback)
    const displayUnit = unit || ""
    const fill = getColor(colorKey)
    const smFs = isP ? 8 : 6.5

    if (!frac) {
      return (
        <text key={`${x}-${y}-${colorKey}`} x={x} y={y} fontSize={fs} textAnchor={anchor} fontWeight="bold" dominantBaseline="middle" fill={fill}>
          {actualWhole}{displayUnit}
        </text>
      )
    }

    const [num, den] = frac.split("/")
    // Render as: whole ⁿ/d unit — all inline in one <text>
    return (
      <text key={`${x}-${y}-${colorKey}`} x={x} y={y} fontSize={fs} textAnchor={anchor} fontWeight="bold" dominantBaseline="middle" fill={fill}>
        {actualWhole && <tspan>{actualWhole} </tspan>}
        <tspan fontSize={smFs} baselineShift="super">{num}</tspan>
        <tspan fontSize={smFs}>⁄</tspan>
        <tspan fontSize={smFs} baselineShift="sub">{den}</tspan>
        {displayUnit && <tspan fontSize={fs}> {displayUnit}</tspan>}
      </text>
    )
  }

  const midLeftY = (ltY + baseY) / 2
  const midRightY = (rtY + baseY) / 2

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <line x1={lx} y1={ltY} x2={lx} y2={baseY} stroke={getStroke("leftH")} strokeWidth={getWidth("leftH")} />
      <line x1={lx} y1={baseY} x2={bRx} y2={baseY} stroke={getStroke("bottomW")} strokeWidth={getWidth("bottomW")} />
      <line x1={rx} y1={rtY} x2={rx} y2={baseY} stroke={getStroke("rightH")} strokeWidth={getWidth("rightH")} />
      {/* Left label: end-anchored to the LEFT of the arm */}
      {renderDimension(dims.leftH, "H", lx - gap, midLeftY, "end", "leftH")}
      {/* Right label: start-anchored to the RIGHT of the arm */}
      {renderDimension(dims.rightH, "H", rx + gap, midRightY, "start", "rightH")}
      {/* Inner width below baseline, centered between arms */}
      {renderDimension(dims.inner, "W", (lx + rx) / 2, baseY + (isP ? 16 : 12), "middle", "inner")}
      {/* Bottom total width below baseline, centered in right section */}
      {renderDimension(dims.bottomW, "BW", (rx + bRx) / 2, baseY + (isP ? 16 : 12), "middle", "bottomW")}
    </svg>
  )
}

function RectSVG({ dims = {}, size = "preview", activeKey }: { dims?: DiagramDims; size?: "preview" | "inline"; activeKey?: string | null }) {
  const isP = size === "preview"
  const w = isP ? 200 : 90; const h = isP ? 80 : 45
  const fillColor = "#666"; const fs = isP ? 10 : 7
  const baseColor = "#333"; const highlight = "#C62828"
  const getTextFill = (key: string) => (activeKey === key ? highlight : fillColor)
  const rectStroke = activeKey === "width" || activeKey === "height" ? highlight : baseColor
  const rectWidth = activeKey === "width" || activeKey === "height" ? (isP ? 3 : 2.2) : 2
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} xmlns="http://www.w3.org/2000/svg">
      <rect x={w * 0.18} y={10} width={w * 0.64} height={h - 20} fill="none" stroke={rectStroke} strokeWidth={rectWidth} rx={2} />
      <text x={w / 2} y={8} textAnchor="middle" fontSize={fs} fill={getTextFill("width")} fontWeight={activeKey === "width" ? "bold" : "normal"}>{dims.width || "W"}</text>
      <text x={w * 0.88} y={h / 2} fontSize={fs} fill={getTextFill("height")} fontWeight={activeKey === "height" ? "bold" : "normal"}>{dims.height || "H"}</text>
    </svg>
  )
}

function DiagramRenderer({ diagram = {} as DiagramData, size = "preview", activeKey }: { diagram?: DiagramData; size?: "preview" | "inline"; activeKey?: string | null }) {
  if (diagram.shape === "lbracket") return <LBracketSVG dims={diagram.dims} size={size} activeKey={activeKey} />
  if (diagram.shape === "channel") return <ChannelSVG dims={diagram.dims} size={size} activeKey={activeKey} />
  if (diagram.shape === "rect") return <RectSVG dims={diagram.dims} size={size} activeKey={activeKey} />
  if (diagram.shape === "custom") return <span>{diagram.dims?.note}</span>
  return null
}

function renderDiagramHTML(diagram: DiagramData): string {
  const d = diagram.dims
  if (diagram.shape === "channel") {
    return `<svg width="260" height="170" viewBox="0 0 260 170" display="block" xmlns="http://www.w3.org/2000/svg">
      <text x="130" y="16" text-anchor="middle" font-size="14" fill="#111" font-weight="bold">${d.top || ""}</text>
      <line x1="78" y1="28" x2="182" y2="28" stroke="#333" stroke-width="2.5"/>
      <line x1="78" y1="28" x2="52" y2="120" stroke="#333" stroke-width="2.5"/>
      <line x1="182" y1="28" x2="208" y2="120" stroke="#333" stroke-width="2.5"/>
      <line x1="38" y1="120" x2="222" y2="120" stroke="#333" stroke-width="2.5"/>
      <text x="8" y="82" font-size="13" fill="#111" font-weight="bold">${d.height || ""}</text>
      <text x="130" y="155" text-anchor="middle" font-size="14" fill="#111" font-weight="bold">${d.bottom || ""}</text>
      <text x="252" y="82" font-size="13" fill="#111" font-weight="bold" text-anchor="end">${d.length || ""}</text>
    </svg>`
  }
  if (diagram.shape === "lbracket") {
    // FIXED: left label now centered on lx=80 so it never clips
    return `<svg width="340" height="160" viewBox="0 0 340 160" display="block" xmlns="http://www.w3.org/2000/svg">
      <line x1="80" y1="16" x2="80" y2="118" stroke="#222" stroke-width="3"/>
      <line x1="80" y1="118" x2="310" y2="118" stroke="#222" stroke-width="3"/>
      <line x1="200" y1="32" x2="200" y2="118" stroke="#222" stroke-width="3"/>
      <text x="80" y="72" font-size="13" fill="#444" text-anchor="middle">${d.leftH || ""}</text>
      <text x="214" y="80" font-size="13" fill="#444" text-anchor="start">${d.rightH || ""}</text>
      <text x="140" y="148" font-size="13" fill="#444" text-anchor="middle">${d.inner || ""}</text>
      <text x="256" y="148" font-size="13" fill="#444" text-anchor="middle">${d.bottomW || ""}</text>
    </svg>`
  }
  if (diagram.shape === "rect") {
    return `<svg width="200" height="110" viewBox="0 0 200 110" display="block" xmlns="http://www.w3.org/2000/svg">
      <rect x="28" y="14" width="144" height="72" fill="none" stroke="#333" stroke-width="2.5" rx="2"/>
      <text x="100" y="11" text-anchor="middle" font-size="13" fill="#555" font-weight="bold">${d.width || ""}</text>
      <text x="182" y="56" font-size="12" fill="#555" font-weight="bold">${d.height || ""}</text>
    </svg>`
  }
  if (diagram.shape === "custom") return `<span style="font-size:14px;color:#555;">${d.note || ""}</span>`
  return ""
}

// ─── Diagram Dimension Input ──────────────────────────────────────────────────
function DiagramDimInput({ value, onChange, onFocus, onBlur }: { value: string; onChange: (v: string) => void; onFocus: () => void; onBlur: () => void }) {
  const parseValue = (val: string) => {
    const match = val.match(/^(\d+)?\s*(\d+\/\d+)?\s*([a-zA-Z"']*)?$/)
    if (match) return { whole: match[1] || "", frac: match[2] || "", unit: match[3] || "" }
    return { whole: "", frac: "", unit: "" }
  }
  const parsed = parseValue(value || "")
  const [whole, setWhole] = useState(parsed.whole)
  const [frac, setFrac] = useState(parsed.frac)
  const [unit, setUnit] = useState(parsed.unit)
  const wholeRef = useRef(whole); const fracRef = useRef(frac); const unitRef = useRef(unit)
  useEffect(() => { wholeRef.current = whole; fracRef.current = frac; unitRef.current = unit }, [whole, frac, unit])
  useEffect(() => { const p = parseValue(value || ""); setWhole(p.whole); setFrac(p.frac); setUnit(p.unit) }, [value])
  const buildValue = (w: string, f: string, u: string) => {
    const parts = []; if (w) parts.push(w); if (f) parts.push(f)
    return parts.join(" ") + u
  }
  const handleWholeChange = (v: string) => { setWhole(v); onChange(buildValue(v, fracRef.current, unitRef.current)) }
  const handleFracChange = (v: string) => { setFrac(v); onChange(buildValue(wholeRef.current, v, unitRef.current)) }
  const handleUnitChange = (v: string) => { setUnit(v); onChange(buildValue(wholeRef.current, fracRef.current, v)) }
  const inCls = "border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#C62828] text-xs px-1.5 py-1.5 bg-white"
  const lbl = "text-[9px] font-medium text-gray-400 text-center block mb-0.5"
  return (
    <div className="flex items-end gap-1" onFocus={onFocus} onBlur={onBlur}>
      <div><span className={lbl}>Whole</span><input className={inCls} style={{ width: 38 }} value={whole} onChange={(e) => handleWholeChange(e.target.value.replace(/\D/g, ""))} placeholder="12" onFocus={onFocus} onBlur={onBlur} /></div>
      <div><span className={lbl}>Frac</span><FractionInput value={frac} onChange={handleFracChange} /></div>
      <div><span className={lbl}>Unit</span>
        <select className={inCls} style={{ width: 46 }} value={unit} onChange={(e) => handleUnitChange(e.target.value)} onFocus={onFocus} onBlur={onBlur}>
          {UNIT_OPTIONS.map((u) => <option key={u} value={u}>{u || "—"}</option>)}
        </select>
      </div>
    </div>
  )
}

// ─── Diagram Editor Modal ─────────────────────────────────────────────────────
const SHAPE_FIELDS: Record<string, { k: string; l: string }[]> = {
  channel: [{ k: "top", l: "Top width" }, { k: "height", l: "Height" }, { k: "bottom", l: "Bottom width" }, { k: "length", l: "Length / depth" }],
  lbracket: [{ k: "leftH", l: "Left arm height" }, { k: "rightH", l: "Right arm height" }, { k: "inner", l: "Inner width (between arms)" }, { k: "bottomW", l: "Base total width" }],
  rect: [{ k: "width", l: "Width" }, { k: "height", l: "Height" }],
  custom: [{ k: "note", l: "Description / dimensions text" }],
}

interface QuotationItem { id: string; sku: string; desc: string; count: string; diagram: DiagramData | null }

function DiagramModal({ item, onSave, onClose }: { item: QuotationItem; onSave: (diagram: DiagramData, count: string) => void; onClose: () => void }) {
  const [shape, setShape] = useState(item?.diagram?.shape || "channel")
  const [dims, setDims] = useState<DiagramDims>(item?.diagram?.dims || {})
  const [count, setCount] = useState(item?.count || "")
  const [activeKey, setActiveKey] = useState<string | null>(null)
  const chg = (s: string) => { setShape(s); if (s !== shape) setDims({}) }
  const labels: Record<string, string> = { channel: "Channel", lbracket: "L-bracket", rect: "Rectangle", custom: "Text only" }
  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-xl shadow-2xl w-full sm:max-w-md max-h-[92vh] overflow-y-auto">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="text-base font-semibold text-gray-900">{item?.diagram ? "Edit" : "Add"} diagram — {item?.sku}</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button>
        </div>
        <div className="p-5 space-y-5">
          <div>
            <p className="text-xs font-medium text-gray-600 mb-2">Shape type</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(labels).map(([s, l]) => (
                <button key={s} onClick={() => chg(s)} className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${shape === s ? "bg-[#C62828] text-white border-[#C62828]" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`}>{l}</button>
              ))}
            </div>
          </div>
          <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-center min-h-[110px] bg-gray-50 overflow-x-auto">
            <DiagramRenderer diagram={{ shape, dims }} size="preview" activeKey={activeKey} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(SHAPE_FIELDS[shape] || []).map((f) => (
              <div key={f.k} className={f.k === "note" ? "col-span-1 sm:col-span-2" : ""}>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">{f.l}</label>
                {f.k === "note" ? (
                  <input value={dims[f.k] || ""} onFocus={() => setActiveKey(f.k)} onBlur={() => setActiveKey(null)} onChange={(e) => setDims((d) => ({ ...d, [f.k]: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C62828] text-sm" />
                ) : (
                  <DiagramDimInput value={dims[f.k] || ""} onChange={(v) => setDims((d) => ({ ...d, [f.k]: v }))} onFocus={() => setActiveKey(f.k)} onBlur={() => setActiveKey(null)} />
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="px-5 py-4 border-t border-gray-200 flex gap-3 items-center sticky bottom-0 bg-white">
          <div className="flex items-center gap-2 mr-auto">
            <label className="text-xs font-medium text-gray-600">Count</label>
            <input value={count} onChange={(e) => setCount(e.target.value.replace(/\D/g, ""))} placeholder="1"
              className="w-16 px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C62828]" />
            <span className="text-xs text-gray-500">No</span>
          </div>
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
          <button onClick={() => onSave({ shape, dims }, count)} className="px-4 py-2 bg-[#C62828] text-white rounded-lg text-sm font-medium hover:bg-[#B71C1C]">Save</button>
        </div>
      </div>
    </div>
  )
}

// ─── Preview Modal ────────────────────────────────────────────────────────────
interface QuotationData { date: string; machineName: string; items: QuotationItem[] }

function PreviewModal({ data, onClose, onDownload, generating }: { data: QuotationData; onClose: () => void; onDownload: () => void; generating: boolean }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
      <div className="bg-white rounded-t-2xl sm:rounded-xl shadow-2xl w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-5 py-4 flex items-center justify-between z-10">
          <h2 className="text-lg font-bold text-[#C62828]">Preview</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5">
          <div className="mb-5 flex items-center gap-4 border-b-2 border-[#40B7FF] pb-3">
  <img src={SGH_LOGO_SRC} alt="SGH Logo" 
    style={{ width: 65, height: 65, objectFit: "contain", flexShrink: 0 }} />
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-bold text-[#C62828] mb-0.5 text-center">SELVA GANAPATHI HYDRAULICS</h2>
              <p className="text-[10px] text-[#40B7FF] text-center truncate">487, Gandhi Nagar Road, KUNNATHUR - 638103, Tirupur (Dt).</p>
              <p className="text-[10px] text-[#40B7FF] text-center truncate">Email: sgharasu@gmail.com | Cell: 75026 21020</p>
            </div>
          </div>
          <p className="text-right text-xs font-semibold mb-3">Date: {data.date}</p>
          <h3 className="font-bold underline text-sm mb-3">{data.machineName}</h3>
          <div className="overflow-x-auto -mx-1">
            <table className="w-full border-collapse text-xs mb-4 min-w-[320px]">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-2 py-2 text-center w-8">S.No</th>
                  <th className="border border-gray-300 px-2 py-2 text-center w-14">Material</th>
                  <th className="border border-gray-300 px-2 py-2 text-left">Length</th>
                  <th className="border border-gray-300 px-2 py-2 text-center w-8">No</th>
                </tr>
              </thead>
              <tbody>
                {data.items.filter((i) => i.desc.trim() || i.diagram).map((item, idx) => {
                  const parts = parseDescString(item.desc)
                  const countVal = item.diagram ? item.count : parts.count
                  return (
                    <tr key={item.id}>
                      <td className="border border-gray-300 px-2 py-2 font-semibold text-center">{idx + 1}</td>
                      <td className="border border-gray-300 px-2 py-2 font-semibold text-center">{item.sku}</td>
                      <td className="border border-gray-300 px-2 py-2">
                        {item.diagram ? <DiagramRenderer diagram={item.diagram} size="inline" /> : <DescDisplay desc={item.desc} showCount={false} />}
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center font-semibold">{countVal || ""}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-5 py-4 flex gap-3">
          <button onClick={onClose} className="flex-1 sm:flex-none px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100">Close</button>
          <button onClick={onDownload} disabled={generating}
            className="flex-1 sm:flex-none px-4 py-2.5 bg-[#C62828] text-white rounded-lg text-sm font-medium hover:bg-[#B71C1C] flex items-center justify-center gap-2 disabled:opacity-50">
            {generating ? (<><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Generating...</>) : (<><Download className="w-4 h-4" />Download PDF</>)}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Inline Edit Row ──────────────────────────────────────────────────────────
function InlineEditRow({ item, idx, onSave, onCancel }: { item: QuotationItem; idx: number; onSave: (vals: { sku: string; desc: string; count: string }) => void; onCancel: () => void }) {
  const [sku, setSku] = useState(item.sku)
  const [desc, setDesc] = useState(item.desc)
  const [count, setCount] = useState(item.count || "")
  return (
    <div className="px-3 py-3 border-b border-gray-200 bg-yellow-50 space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-gray-500 w-5 flex-shrink-0">{idx + 1}</span>
        <input className="flex-1 px-2 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#C62828]"
          value={sku} onChange={(e) => setSku(e.target.value)} placeholder="SKU / Material" />
        <div className="flex gap-1 flex-shrink-0">
          <button onClick={() => onSave({ sku, desc: item.diagram ? item.desc : desc, count: item.diagram ? count : "" })}
            className="p-1.5 text-green-600 hover:bg-green-50 rounded"><Check className="w-4 h-4" /></button>
          <button onClick={onCancel} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded"><X className="w-4 h-4" /></button>
        </div>
      </div>
      <div className="pl-7">
        {item.diagram
          ? <div className="flex items-center gap-2">
            <p className="text-xs text-gray-400 italic flex-1">Diagram item — edit via diagram button</p>
            <input className="w-14 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#C62828]"
              value={count} onChange={(e) => setCount(e.target.value.replace(/\D/g, ""))} placeholder="Count" />
            <span className="text-xs text-gray-500">No</span>
          </div>
          : <DescEditor value={desc} onChange={setDesc} />
        }
      </div>
    </div>
  )
}

// ─── Add Item Panel ───────────────────────────────────────────────────────────
function AddItemPanel({ onAdd }: { onAdd: (item: { sku: string; desc: string; mode: string }) => void }) {
  const [mode, setMode] = useState("text")
  const [sku, setSku] = useState("")
  const [desc, setDesc] = useState("")
  const inputCls = "w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C62828] text-sm"
  const handleAdd = () => {
    if (mode === "text" && !desc.trim()) { alert("Please enter a description."); return }
    onAdd({ sku, desc, mode }); setSku(""); setDesc("")
  }
  return (
    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200 space-y-3">
      <p className="text-xs font-semibold text-gray-700">Add new specification</p>
      <div className="flex gap-2">
        {["text", "diagram"].map((m) => (
          <button key={m} onClick={() => setMode(m)}
            className={`flex-1 px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors ${mode === m ? "bg-[#C62828] text-white border-[#C62828]" : "border-gray-300 text-gray-600 hover:bg-gray-100"}`}>
            {m === "text" ? "Text" : "Diagram"}
          </button>
        ))}
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">SKU / Material (optional)</label>
        <input className={inputCls} value={sku} onChange={(e) => setSku(e.target.value)} placeholder="e.g. 50mm" />
      </div>
      {mode === "text" ? (
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-2">Description</label>
          <DescEditor value={desc} onChange={setDesc} />
        </div>
      ) : (
        <p className="text-xs text-gray-500 italic bg-white border border-dashed border-gray-300 rounded-lg px-3 py-2">Diagram editor opens after adding.</p>
      )}
      <button onClick={handleAdd} className="w-full px-4 py-2.5 bg-[#C62828] text-white rounded-lg text-sm font-medium hover:bg-[#B71C1C] flex items-center justify-center gap-1">
        <Plus className="w-4 h-4" /> Add item
      </button>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
const today = new Date()
const formattedDate = `${String(today.getDate()).padStart(2, "0")}/${String(today.getMonth() + 1).padStart(2, "0")}/${today.getFullYear()}`

const INITIAL_ITEMS: QuotationItem[] = [
  { id: "1", sku: "50mm", desc: "3 1/2in x 20in - 2no", count: "", diagram: null },
  { id: "2", sku: "45mm", desc: "18in x 14ft - 1no", count: "", diagram: null },
  { id: "3", sku: "40mm", desc: "4in x 7in - 1no", count: "", diagram: null },
  { id: "4", sku: "32mm", desc: "24in x 20in - 1no", count: "", diagram: null },
  { id: "5", sku: "32mm", desc: "24in x 22in - 1no", count: "", diagram: null },
  { id: "6", sku: "32mm", desc: "18in x 15in - 1no", count: "", diagram: null },
  { id: "7", sku: "28mm", desc: "6in x 20in - 2no", count: "", diagram: null },
  { id: "8", sku: "18mm", desc: "24in x 22in - 2no", count: "", diagram: null },
  { id: "9", sku: "18mm", desc: "24in x 15in - 1no", count: "", diagram: null },
  { id: "10", sku: "16mm", desc: "18in x 14ft - 1no", count: "", diagram: null },
  { id: "11", sku: "16mm", desc: "5in x 14ft - 2no", count: "", diagram: null },
  { id: "12", sku: "16mm", desc: "7 1/2in x 12 3/4in - 4no", count: "", diagram: null },
  { id: "13", sku: "16mm", desc: "8in x 22in - 2no", count: "", diagram: null },
  { id: "14", sku: "16mm", desc: "18in x 22in - 1no", count: "", diagram: null },
  { id: "15", sku: "16mm", desc: "15in x 22in - 1no", count: "", diagram: null },
  { id: "16", sku: "16mm", desc: "10in x 10in - 1no", count: "", diagram: null },
  { id: "17", sku: "12mm", desc: "8in x 8in - 2no", count: "", diagram: null },
  { id: "18", sku: "8mm", desc: "", count: "2", diagram: { shape: "lbracket", dims: { leftH: "3in", rightH: "3in", inner: "6in", bottomW: "66in" } } },
  { id: "19", sku: "4mm", desc: "2ft x 4ft - 1no", count: "", diagram: null },
  { id: "20", sku: "3mm", desc: "", count: "2", diagram: { shape: "lbracket", dims: { leftH: "15cm", rightH: "15", inner: "13", bottomW: "36" } } },
  { id: "21", sku: "3mm", desc: "14 3/4 x 12 3/4 - 4no", count: "", diagram: null },
  { id: "22", sku: "3mm", desc: "12 3/4 x 36 - 2no", count: "", diagram: null },
]

export default function QuotationGenerator() {
  const [data, setData] = useState<QuotationData>({ date: formattedDate, machineName: "ABQ", items: INITIAL_ITEMS })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [diagModalItem, setDiagModalItem] = useState<QuotationItem | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [nextId, setNextId] = useState(25)
  const [showWhatsApp, setShowWhatsApp] = useState(false)

  const upField = <K extends keyof QuotationData>(f: K, v: QuotationData[K]) => setData((p) => ({ ...p, [f]: v }))
  const upItems = (fn: (items: QuotationItem[]) => QuotationItem[]) => setData((p) => ({ ...p, items: fn(p.items) }))

  const saveEdit = (id: string, { sku, desc, count }: { sku: string; desc: string; count: string }) => {
    upItems((items) => items.map((it) => (it.id === id ? { ...it, sku, desc, count } : it)))
    setEditingId(null)
  }

  const deleteItem = (id: string) => {
    if (data.items.length <= 1) { alert("Must have at least one item."); return }
    upItems((items) => items.filter((it) => it.id !== id))
  }

  const addItem = ({ sku, desc, mode }: { sku: string; desc: string; mode: string }) => {
    const id = String(nextId); setNextId((n) => n + 1)
    const ni: QuotationItem = { id, sku: sku || "-", desc: mode === "diagram" ? "" : desc, count: "", diagram: null }
    upItems((items) => [...items, ni])
    if (mode === "diagram") setDiagModalItem(ni)
  }

  const saveDiagram = (diagram: DiagramData, count: string) => {
    upItems((items) => items.map((it) => (it.id === diagModalItem?.id ? { ...it, diagram, desc: "", count } : it)))
    setDiagModalItem(null)
  }

  const removeDiagram = (id: string) => upItems((items) => items.map((it) => (it.id === id ? { ...it, diagram: null } : it)))

  const buildHTML = () => {
    const filteredItems = data.items.filter((i) => i.desc.trim() || i.diagram)
    const rows = filteredItems.map((item, idx) => {
      const parts = parseDescString(item.desc)
      let descCell = ""; let countCell = ""
      if (item.diagram) {
        descCell = renderDiagramHTML(item.diagram)
        countCell = item.count ? `<span style="font-weight:700;color:#1f2937;font-size:13px;">${item.count}</span>` : ""
      } else {
        descCell = renderDescHTML(item.desc, false)
        countCell = parts.count ? `<span style="font-weight:700;color:#1f2937;font-size:13px;">${parts.count}</span>` : ""
      }
      const rowBg = idx % 2 === 0 ? "#ffffff" : "#f9fafb"
      return `<tr style="background:${rowBg};page-break-inside:avoid;break-inside:avoid;">
        <td style="padding:9px 10px;border:1px solid #d1d5db;text-align:center;font-weight:700;font-size:13px;color:#374151;vertical-align:middle;">${idx + 1}</td>
        <td style="padding:9px 10px;border:1px solid #d1d5db;text-align:center;font-weight:700;font-size:13px;color:#374151;vertical-align:middle;">${item.sku}</td>
        <td style="padding:9px 10px;border:1px solid #d1d5db;vertical-align:middle;">${descCell}</td>
        <td style="padding:9px 10px;border:1px solid #d1d5db;text-align:center;vertical-align:middle;">${countCell}</td>
      </tr>`
    }).join("")

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, Helvetica, sans-serif; font-size: 14px; color: #111; }
    .page { width: 794px; padding: 32px 40px; }
    .header-inner { display: flex; align-items: center; gap: 16px; border-bottom: 2.5px solid #40B7FF; padding-bottom: 8px; margin-bottom: 24px; }
    .logo { width: 70px; height: 70px; object-fit: contain; flex-shrink: 0; }
    .header-text { flex: 1; }
    .header-text h2 { font-size: 22px; font-weight: 900; color: #C62828; letter-spacing: 0.5px; margin-bottom: 5px; text-align: center; }
    .header-text p { font-size: 11px; color: #40B7FF; margin: 2px 0; text-align: center; }
    .meta-date { text-align: right; font-weight: 700; font-size: 13px; margin-bottom: 14px; }
    .machine-name { font-size: 16px; font-weight: 700; text-decoration: underline; margin-bottom: 12px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 18px; table-layout: fixed; }
    thead tr { background: #f3f4f6; }
    th { padding: 10px; border: 1px solid #d1d5db; text-align: left; font-size: 13px; font-weight: 700; color: #374151; }
    th.center { text-align: center; }
    td { vertical-align: middle; }
    tr { page-break-inside: avoid; break-inside: avoid; }
  </style>
</head>
<body>
<div class="page">
  <div class="header-inner">
   <img class="logo" src="/images/logo.png" alt="SGH Logo" />
    <div class="header-text">
      <h2>SELVA GANAPATHI HYDRAULICS</h2>
      <p>487, Gandhi Nagar Road, KUNNATHUR - 638103, Tirupur (Dt).</p>
      <p>Email: sgharasu@gmail.com | Cell: 75026 21020, 74026 21020</p>
    </div>
  </div>
  <div class="meta-date">Date: ${data.date}</div>
  <div class="machine-name">${data.machineName}</div>
  <table>
    <thead>
      <tr>
        <th class="center" style="width:52px;">S.No</th>
        <th class="center" style="width:90px;">Material</th>
        <th>Length</th>
        <th class="center" style="width:52px;">No</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
</div>
</body>
</html>`
  }

  const downloadPDF = async () => {
    if (!data.machineName.trim()) { alert("Please fill in machine name."); return }
    setGenerating(true)
    try {
      const html2canvas = (await import("html2canvas")).default
      const jsPDFModule = (await import("jspdf")).default
      const el = document.createElement("div")
      el.innerHTML = buildHTML()
      el.style.position = "fixed"; el.style.left = "-9999px"; el.style.top = "0"; el.style.width = "794px"
      document.body.appendChild(el)
      const inner = (el.querySelector(".page") || el) as HTMLElement
      inner.style.width = "794px"; inner.style.boxSizing = "border-box"
      await new Promise(r => setTimeout(r, 300))
      const canvas = await html2canvas(inner, { scale: 2, useCORS: true, logging: false, scrollX: 0, scrollY: 0, width: 794, height: inner.scrollHeight, windowWidth: 794, windowHeight: inner.scrollHeight })
      const imgData = canvas.toDataURL("image/jpeg", 0.98)
      const mmPerPx = 210 / 794; const finalW = 210; const finalH = Math.ceil(inner.scrollHeight * mmPerPx)
      const pdf = new jsPDFModule({ unit: "mm", format: [finalW, finalH], orientation: "portrait" })
      pdf.addImage(imgData, "JPEG", 0, 0, finalW, finalH)
      pdf.save(`${data.machineName.replace(/\s+/g, "_")}_Quotation_${data.date.replace(/\//g, "-")}.pdf`)
      document.body.removeChild(el)
      setShowWhatsApp(true)
    } catch (err) {
      console.error(err); alert("PDF generation failed.")
    } finally {
      setGenerating(false)
    }
  }

  const iCls = "w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C62828] text-sm"

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-3 sm:p-6">
      <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6">

        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-2 h-8 bg-[#C62828] rounded-full" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Quotation Generator</h1>
          </div>
          <p className="text-gray-500 ml-5 text-xs sm:text-sm">{data.items.length} items · diagram support · structured description editor</p>
        </div>

        {/* Basic Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-[#C62828] rounded-full" />Basic information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Date</label>
              <input className={iCls} value={data.date} onChange={(e) => upField("date", e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Machine / order name</label>
              <input className={iCls} value={data.machineName} onChange={(e) => upField("machineName", e.target.value)} />
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
              <span className="w-1 h-6 bg-[#C62828] rounded-full" />
              <span className="hidden sm:inline">Order items / specifications</span>
              <span className="sm:hidden">Items</span>
            </h2>
            <span className="bg-[#C62828] text-white text-xs font-semibold px-3 py-1 rounded-full">{data.items.length} items</span>
          </div>

          {/* Desktop header */}
          <div className="hidden sm:grid grid-cols-12 gap-2 px-3 py-2 bg-gray-50 rounded-t-lg border border-gray-200 text-xs font-semibold text-gray-700">
            <div className="col-span-1">S.No</div>
            <div className="col-span-2">Material</div>
            <div className="col-span-6">Length</div>
            <div className="col-span-1 text-center">No</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          <div className="border border-t-0 sm:border-t border-gray-200 rounded-b-lg sm:rounded-lg overflow-hidden max-h-[480px] sm:max-h-[520px] overflow-y-auto">
            {data.items.map((item, idx) =>
              editingId === item.id ? (
                <InlineEditRow key={item.id} item={item} idx={idx} onSave={(vals) => saveEdit(item.id, vals)} onCancel={() => setEditingId(null)} />
              ) : (
                <div key={item.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  {/* Mobile view */}
                  <div className="sm:hidden flex items-start gap-2 px-3 py-2.5">
                    <span className="text-xs font-semibold text-gray-400 w-5 flex-shrink-0 pt-0.5">{idx + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded">{item.sku}</span>
                        {(item.diagram ? item.count : parseDescString(item.desc).count) && (
                          <span className="text-xs text-gray-500">
                            × <span className="font-bold text-gray-700">{item.diagram ? item.count : parseDescString(item.desc).count}</span> No
                          </span>
                        )}
                      </div>
                      <div className="overflow-x-auto">
                        {item.diagram ? (
                          <DiagramRenderer diagram={item.diagram} size="inline" />
                        ) : (
                          <DescDisplay desc={item.desc} showCount={false} />
                        )}
                      </div>
                      {item.diagram && (
                        <div className="flex gap-3 mt-1.5">
                          <button onClick={() => setDiagModalItem(item)} className="text-xs text-blue-500 hover:text-blue-700 underline">Edit diagram</button>
                          <button onClick={() => removeDiagram(item.id)} className="text-xs text-red-400 hover:text-red-600">Remove</button>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button onClick={() => setEditingId(item.id)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => deleteItem(item.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>

                  {/* Desktop view */}
                  <div className="hidden sm:grid grid-cols-12 gap-2 px-3 py-2 items-center">
                    <div className="col-span-1 text-xs font-semibold text-gray-400">{idx + 1}</div>
                    <div className="col-span-2 text-xs font-semibold text-gray-700">{item.sku}</div>
                    <div className="col-span-6">
                      {item.diagram ? (
                        <div className="flex items-center gap-3">
                          <DiagramRenderer diagram={item.diagram} size="inline" />
                          <div className="flex flex-col gap-1">
                            <button onClick={() => setDiagModalItem(item)} className="text-xs text-blue-500 hover:text-blue-700 underline">Edit diagram</button>
                            <button onClick={() => removeDiagram(item.id)} className="text-xs text-red-400 hover:text-red-600">Remove</button>
                          </div>
                        </div>
                      ) : (
                        <DescDisplay desc={item.desc} showCount={false} />
                      )}
                    </div>
                    <div className="col-span-1 text-center">
                      <span className="text-xs font-semibold text-gray-700">
                        {item.diagram ? item.count : parseDescString(item.desc).count}
                      </span>
                    </div>
                    <div className="col-span-2 flex gap-1 justify-end">
                      <button onClick={() => setEditingId(item.id)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => deleteItem(item.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>

          <AddItemPanel onAdd={addItem} />
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pb-8">
          <button onClick={() => setPreviewOpen(true)}
            className="w-full sm:w-auto px-6 py-3 border-2 border-[#C62828] text-[#C62828] rounded-lg font-semibold hover:bg-[#C62828] hover:text-white transition-colors flex items-center justify-center gap-2">
            <Eye className="w-5 h-5" /> Preview
          </button>
          <button onClick={downloadPDF} disabled={generating}
            className="w-full sm:w-auto px-6 py-3 bg-[#C62828] hover:bg-[#B71C1C] text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
            {generating ? (<><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />Generating...</>) : (<><Download className="w-5 h-5" />Download PDF</>)}
          </button>
          <button onClick={() => setShowWhatsApp(true)}
            className="w-full sm:w-auto px-6 py-3 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Share on WhatsApp
          </button>
        </div>
      </div>

      {diagModalItem && <DiagramModal item={diagModalItem} onSave={saveDiagram} onClose={() => setDiagModalItem(null)} />}
      {previewOpen && <PreviewModal data={data} onClose={() => setPreviewOpen(false)} onDownload={() => { setPreviewOpen(false); downloadPDF() }} generating={generating} />}
        {showWhatsApp && <ShareModal onClose={() => setShowWhatsApp(false)} machineName={data.machineName} />}
    </div>
  )
}
