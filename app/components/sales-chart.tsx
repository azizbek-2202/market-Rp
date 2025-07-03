"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SalesChart() {
  const data = [
    { day: "Dush", sales: 2400 },
    { day: "Sesh", sales: 1800 },
    { day: "Chor", sales: 3200 },
    { day: "Pay", sales: 2800 },
    { day: "Jum", sales: 3800 },
    { day: "Shan", sales: 4200 },
    { day: "Yak", sales: 3600 },
  ]

  const maxSales = Math.max(...data.map((d) => d.sales))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Haftalik Sotuv</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item) => (
            <div key={item.day} className="flex items-center space-x-4">
              <div className="w-12 text-sm font-medium">{item.day}</div>
              <div className="flex-1">
                <div className="bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(item.sales / maxSales) * 100}%` }}
                  />
                </div>
              </div>
              <div className="text-sm font-medium w-20 text-right">{item.sales.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
