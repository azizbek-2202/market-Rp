"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "../components/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Store, Users, TrendingUp } from "lucide-react"

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== "admin") {
      router.push("/")
      return
    }

    setUser(parsedUser)
  }, [router])

  const stats = [
    {
      title: "Jami Do'konlar",
      value: "24",
      change: "+3 yangi",
      icon: Store,
      color: "text-blue-600",
    },
    {
      title: "Do'kon Egalari",
      value: "18",
      change: "+2 yangi",
      icon: Users,
      color: "text-green-600",
    },
    {
      title: "Faol Do'konlar",
      value: "22",
      change: "91.7%",
      icon: TrendingUp,
      color: "text-purple-600",
    },
    {
      title: "Jami Sotuv",
      value: "₽2.4M",
      change: "+12.5%",
      icon: TrendingUp,
      color: "text-orange-600",
    },
  ]

  const recentShops = [
    { name: "Oila Market", owner: "Alisher Karimov", status: "active", date: "2024-01-15" },
    { name: "Yangi Dukon", owner: "Malika Tosheva", status: "pending", date: "2024-01-20" },
    { name: "Super Market", owner: "Bobur Rahimov", status: "active", date: "2024-01-25" },
  ]

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <div className="ml-64">
        <div className="p-6">
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Market Rp admin paneli</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => {
                const Icon = stat.icon
                return (
                  <Card key={stat.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                      <Icon className={`h-4 w-4 ${stat.color}`} />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <p className="text-xs text-gray-600">{stat.change}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Recent Shops */}
            <Card>
              <CardHeader>
                <CardTitle>So'nggi Do'konlar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentShops.map((shop, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="bg-indigo-100 p-2 rounded-lg">
                          <Store className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div>
                          <p className="font-medium">{shop.name}</p>
                          <p className="text-sm text-gray-600">{shop.owner}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={shop.status === "active" ? "default" : "secondary"}>
                          {shop.status === "active" ? "Faol" : "Kutilmoqda"}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">{new Date(shop.date).toLocaleDateString("uz-UZ")}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
