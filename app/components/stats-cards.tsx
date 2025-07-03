"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, Package, Users, ShoppingCart } from "lucide-react"

const stats = [
  {
    title: "Bugungi Sotuv",
    value: "2,450,000",
    unit: "so'm",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "Mahsulotlar",
    value: "1,234",
    unit: "dona",
    change: "+3.2%",
    trend: "up",
    icon: Package,
  },
  {
    title: "Mijozlar",
    value: "89",
    unit: "kishi",
    change: "-2.1%",
    trend: "down",
    icon: Users,
  },
  {
    title: "Buyurtmalar",
    value: "156",
    unit: "ta",
    change: "+8.7%",
    trend: "up",
    icon: ShoppingCart,
  },
]

export default function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon
        const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown

        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
              <Icon className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stat.value} <span className="text-sm font-normal text-gray-600">{stat.unit}</span>
              </div>
              <div className={`flex items-center text-xs ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                <TrendIcon className="h-3 w-3 mr-1" />
                {stat.change}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
