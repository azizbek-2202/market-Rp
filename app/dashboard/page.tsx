"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "../components/sidebar"
import Header from "../components/header"
import StatsCards from "../components/stats-cards"
import RecentSales from "../components/recent-sales"
import SalesChart from "../components/sales-chart"

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
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

  if (!user) return null

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6 ml-64">
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Market Rp boshqaruv paneli</p>
            </div>

            <StatsCards />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SalesChart />
              <RecentSales />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
