"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, User, Shield } from "lucide-react"
import Image from "next/image"

export default function AdminLoginPage() {
  const [credentials, setCredentials] = useState({ id: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Simple static authentication
    if (credentials.id === "sgh" && credentials.password === "sgh") {
      // Set a simple flag in localStorage to indicate admin is logged in
      localStorage.setItem("sgh-admin-logged-in", "true")
      router.push("/admin")
    } else {
      setError("Invalid credentials. Please check your ID and password.")
    }

    setLoading(false)
  }

  const handleInputChange = (field: "id" | "password", value: string) => {
    setCredentials((prev) => ({ ...prev, [field]: value }))
    if (error) setError("")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <Image src="/images/logo.png" alt="SGH Logo" width={80} height={80} className="mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-black mb-2">
            SELVA<span className="text-[#C62828]">GANAPATHI</span>
          </h1>
          <h2 className="text-lg font-semibold text-gray-700">HYDRAULICS</h2>
          <p className="text-gray-600 mt-2">Admin Portal</p>
        </div>

        {/* Login Card */}
        <Card className="border-2 border-[#C62828] shadow-lg">
          <CardHeader className="text-center border-b border-gray-200">
            <CardTitle className="text-xl font-bold text-[#C62828] flex items-center justify-center">
              <Shield className="w-5 h-5 mr-2" />
              Admin Login
            </CardTitle>
            <CardDescription className="text-gray-600">
              Enter your credentials to access the admin dashboard
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Admin ID */}
              <div className="space-y-2">
                <Label htmlFor="adminId" className="text-sm font-medium text-gray-700">
                  Admin ID
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="adminId"
                    type="text"
                    value={credentials.id}
                    onChange={(e) => handleInputChange("id", e.target.value)}
                    placeholder="Enter admin ID"
                    className="pl-10 border-gray-300 focus:border-[#C62828] focus:ring-[#C62828]"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="password"
                    type="password"
                    value={credentials.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    placeholder="Enter password"
                    className="pl-10 border-gray-300 focus:border-[#C62828] focus:ring-[#C62828]"
                    required
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* Login Button */}
              <Button
                type="submit"
                disabled={loading || !credentials.id || !credentials.password}
                className="w-full bg-[#C62828] hover:bg-[#B71C1C] text-white py-3"
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            {/* Help Text */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">For support, contact the system administrator</p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>&copy; 2024 Selva Ganapathi Hydraulics. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
