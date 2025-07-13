"use client"

import { MachineList } from "@/components/machine-list"
import { MachineFilter } from "@/components/machine-filter"
import { LoadingSpinner, LoadingCard } from "@/components/loading-spinner"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useState, useMemo } from "react"
import { getMachinesByParentType, getMachineTypesByParentType, type Machine } from "@/lib/api"

export default function TractorMachinesPage() {
  const [machines, setMachines] = useState<Machine[]>([])
  const [filterTypes, setFilterTypes] = useState<string[]>([])
  const [selectedType, setSelectedType] = useState("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)

      try {
        // Fetch both machines and filter types in parallel
        const [machinesResponse, typesResponse] = await Promise.all([
          getMachinesByParentType("tractor"),
          getMachineTypesByParentType("tractor"),
        ])

        if (machinesResponse.error) {
          throw new Error(machinesResponse.error)
        }

        if (typesResponse.error) {
          throw new Error(typesResponse.error)
        }

        setMachines(machinesResponse.data)
        setFilterTypes(typesResponse.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filter machines based on selected type
  const filteredMachines = useMemo(() => {
    if (selectedType === "all") {
      return machines
    }
    return machines.filter((machine) => machine.type === selectedType)
  }, [machines, selectedType])

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  if (error) {
    return (
      <main className="min-h-screen bg-white border border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="mb-6 border-b border-gray-200 pb-4">
            <Link href="/">
              <Button
                variant="outline"
                className="mb-4 border-[#C62828] text-[#C62828] hover:bg-[#C62828] hover:text-white bg-transparent"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-2xl lg:text-3xl font-bold text-black mb-3">Tractor Based Machines</h1>
          </div>

          <div className="text-center py-12 border border-gray-200 rounded-lg bg-red-50">
            <p className="text-red-600 text-lg mb-4">Error loading machines: {error}</p>
            <Button
              variant="outline"
              className="border-[#C62828] text-[#C62828] hover:bg-[#C62828] hover:text-white bg-transparent"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white border border-gray-200">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6 border-b border-gray-200 pb-4">
          <Link href="/">
            <Button
              variant="outline"
              className="mb-4 border-[#C62828] text-[#C62828] hover:bg-[#C62828] hover:text-white bg-transparent"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-2xl lg:text-3xl font-bold text-black mb-3">Tractor Based Machines</h1>
          <p className="text-gray-600 text-base max-w-3xl">
            Discover our powerful tractor-based hydraulic machines engineered for heavy-duty wood processing and field
            operations.
          </p>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          {loading ? (
            <div className="space-y-6">
                  <div className="flex justify-center items-center h-[60vh] gap-x-4">
                <LoadingSpinner size="large" />
        <span className="text-[#C62828] text-xl font-bold tracking-wide animate-pulse drop-shadow-md">
           Loading Machines...
        </span>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <LoadingCard key={index} />
                ))}
              </div>
            </div>
          ) : (
            <>
              <MachineFilter types={filterTypes} selectedType={selectedType} onTypeChange={setSelectedType} />

              <div className="mt-4">
                {filteredMachines.length > 0 ? (
                  <MachineList machines={filteredMachines} />
                ) : (
                  <div className="text-center py-12 border border-gray-200 rounded-lg bg-gray-50">
                    <p className="text-gray-500 text-lg">No machines found for the selected type.</p>
                    <Button
                      variant="outline"
                      className="mt-4 border-[#C62828] text-[#C62828] hover:bg-[#C62828] hover:text-white bg-transparent"
                      onClick={() => setSelectedType("all")}
                    >
                      Show All Machines
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
