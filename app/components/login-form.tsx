"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, EyeOff, ShoppingBag, Mail, Lock, User } from "lucide-react"

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Check for admin login
    if (email === "admin@gmail.com" && password === "admin") {
      localStorage.setItem(
        "user",
        JSON.stringify({
          email,
          role: "admin",
          name: "Admin",
        }),
      )
      router.push("/admin")
      setIsLoading(false)
      return
    }

    // Store user data in localStorage
    localStorage.setItem(
      "user",
      JSON.stringify({
        email,
        role,
        name: role === "shopOwner" ? "Do'kon Egasi" : "Xodim",
      }),
    )

    // Redirect based on role
    if (role === "shopOwner") {
      router.push("/dashboard")
    } else {
      router.push("/sales")
    }

    setIsLoading(false)
  }

  // Check if admin credentials are being entered
  const isAdminLogin = email === "admin@gmail.com"

  return (
    <Card className="w-full max-w-md shadow-xl border-0">
      <CardHeader className="space-y-4 text-center pb-8">
        <div className="flex items-center justify-center space-x-2">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <ShoppingBag className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Market Rp</h1>
        </div>
        <div>
          <CardTitle className="text-2xl font-semibold text-gray-900">
            {isAdminLogin ? "Admin Panel" : "Xush kelibsiz"}
          </CardTitle>
          <CardDescription className="text-gray-600 mt-2">
            {isAdminLogin ? "Admin paneliga kirish" : "Hisobingizga kirish uchun ma'lumotlaringizni kiriting"}
          </CardDescription>
        </div>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email manzil
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="sizning@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-12 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
              Parol
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Parolingizni kiriting"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 h-12 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {!isAdminLogin && (
            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-medium text-gray-700">
                Rol
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />
                <Select value={role} onValueChange={setRole} required>
                  <SelectTrigger className="pl-10 h-12 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
                    <SelectValue placeholder="Rolingizni tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="shopOwner">Do'kon Egasi</SelectItem>
                    <SelectItem value="employee">Xodim</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col space-y-4 pt-6">
          <Button
            type="submit"
            className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
            disabled={isLoading || (!isAdminLogin && !role)}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Kirish...</span>
              </div>
            ) : (
              "Kirish"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
