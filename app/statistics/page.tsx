"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "../components/sidebar"
import Header from "../components/header"
import StatsCards from "../components/stats-cards"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, TrendingUp, Calendar } from "lucide-react"

export default function StatisticsPage() {
  const [user, setUser] = useState<any>(null)
  const [period, setPeriod] = useState("week")
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== "shopOwner") {
      router.push("/sales")
      return
    }

    setUser(parsedUser)
  }, [router])

  const salesData = [
    { month: "Yanvar", sales: 12500000, orders: 245 },
    { month: "Fevral", sales: 15200000, orders: 298 },
    { month: "Mart", sales: 18900000, orders: 356 },
    { month: "Aprel", sales: 16700000, orders: 312 },
    { month: "May", sales: 21300000, orders: 398 },
    { month: "Iyun", sales: 19800000, orders: 367 },
  ]

  const topProducts = [
    { name: "Coca Cola 1.5L", sales: 1250, revenue: 10000000 },
    { name: "Non", sales: 2100, revenue: 4200000 },
    { name: "Sut 1L", sales: 890, revenue: 10680000 },
    { name: "Olma 1kg", sales: 650, revenue: 9750000 },
    { name: "Guruch 1kg", sales: 420, revenue: 7560000 },
  ]

  if (!user) return null

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6 ml-64">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Statistika</h1>
                <p className="text-gray-600">Sotuv va biznes statistikasi</p>
              </div>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="w-48">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Bu hafta</SelectItem>
                  <SelectItem value="month">Bu oy</SelectItem>
                  <SelectItem value="year">Bu yil</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <StatsCards />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Sales Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Oylik Sotuv
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {salesData.map((item) => {
                      const maxSales = Math.max(...salesData.map((d) => d.sales))
                      return (
                        <div key={item.month} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{item.month}</span>
                            <span className="text-gray-600">{item.sales.toLocaleString()} so'm</span>
                          </div>
                          <div className="bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${(item.sales / maxSales) * 100}%` }}
                            />
                          </div>
                          <div className="text-xs text-gray-500">{item.orders} buyurtma</div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Top Products */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Eng Ko'p Sotiladigan Mahsulotlar
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topProducts.map((product, index) => (
                      <div key={product.name} className="flex items-center space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-indigo-600">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{product.name}</p>
                          <p className="text-xs text-gray-600">{product.sales} dona sotildi</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{product.revenue.toLocaleString()} so'm</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">O'rtacha Buyurtma</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-indigo-600">156,000 so'm</div>
                  <p className="text-sm text-gray-600">Har bir buyurtma uchun</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Eng Faol Kun</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">Shanba</div>
                  <p className="text-sm text-gray-600">Haftalik sotuv bo'yicha</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Mijozlar Soni</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">1,234</div>
                  <p className="text-sm text-gray-600">Jami ro'yxatdan o'tgan</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
