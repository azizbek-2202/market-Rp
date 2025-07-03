"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const recentSales = [
  {
    id: 1,
    customer: "Alisher Karimov",
    email: "alisher@example.com",
    amount: 125000,
    time: "2 daqiqa oldin",
  },
  {
    id: 2,
    customer: "Malika Tosheva",
    email: "malika@example.com",
    amount: 89000,
    time: "5 daqiqa oldin",
  },
  {
    id: 3,
    customer: "Bobur Rahimov",
    email: "bobur@example.com",
    amount: 234000,
    time: "10 daqiqa oldin",
  },
  {
    id: 4,
    customer: "Nilufar Saidova",
    email: "nilufar@example.com",
    amount: 67000,
    time: "15 daqiqa oldin",
  },
]

export default function RecentSales() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>So'nggi Sotuvlar</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentSales.map((sale) => (
          <div key={sale.id} className="flex items-center space-x-4">
            <Avatar>
              <AvatarFallback>
                {sale.customer
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium">{sale.customer}</p>
              <p className="text-xs text-gray-600">{sale.email}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">+{sale.amount.toLocaleString()} so'm</p>
              <p className="text-xs text-gray-600">{sale.time}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
