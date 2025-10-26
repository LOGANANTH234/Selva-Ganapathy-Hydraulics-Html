"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter } from "lucide-react"

interface MachineFilterProps {
  types: string[]
  selectedType: string
  onTypeChange: (type: string) => void
}

export function MachineFilter({ types, selectedType, onTypeChange }: MachineFilterProps) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="flex items-center gap-2 text-gray-700">
        <Filter className="w-4 h-4 text-[#C62828]" />
        <span className="font-medium">Filter by Type:</span>
      </div>

      <Select
        value={selectedType}
        onValueChange={(newValue) => {
        
          onTypeChange(newValue)
        }}
      >
        <SelectTrigger className="w-[200px] border-[#C62828] text-[#C62828] hover:bg-[#C62828]/5 focus:ring-[#C62828] focus:border-[#C62828]">
          <SelectValue placeholder="All Types" />
        </SelectTrigger>

        <SelectContent className="border-[#C62828]">
          <SelectItem value="all" className="hover:bg-[#C62828]/10 focus:bg-[#C62828]/10">
            All Types
          </SelectItem>

          {types
            .map((type) => type.trim()) // remove extra spaces
            .filter((type, index, self) => self.indexOf(type) === index) // remove duplicates
            .map((type) => {
              if (type === selectedType.trim()) {
                
              }
              return (
                <SelectItem
                  key={type}
                  value={type}
                  className="hover:bg-[#C62828]/10 focus:bg-[#C62828]/10"
                >
                  {type}
                </SelectItem>
              )
            })}
        </SelectContent>
      </Select>
    </div>
  )
}
