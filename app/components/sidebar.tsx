"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Package,
  Users,
  FolderOpen,
  BarChart3,
  ShoppingCart,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Settings,
} from "lucide-react"

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: ShoppingCart, label: "Sotuvlar", href: "/sales" },
  { icon: Package, label: "Mahsulotlar", href: "/products" },
  { icon: Users, label: "Foydalanuvchilar", href: "/users" },
  { icon: FolderOpen, label: "Kategoriyalar", href: "/categories" },
  { icon: BarChart3, label: "Statistika", href: "/statistics" },
]

const adminMenuItems = [
  { icon: LayoutDashboard, label: "Admin Dashboard", href: "/admin" },
  { icon: Settings, label: "Do'konlar", href: "/admin/shops" },
  { icon: Users, label: "Do'kon Egalari", href: "/admin/owners" },
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  // Get user data to determine menu items
  const userData = typeof window !== "undefined" ? localStorage.getItem("user") : null
  const user = userData ? JSON.parse(userData) : null
  const isAdmin = user?.role === "admin"

  const currentMenuItems = isAdmin ? adminMenuItems : menuItems

  return (
    <div
      className={`fixed left-0 top-0 h-full bg-white shadow-lg transition-all duration-300 z-50 ${collapsed ? "w-16" : "w-64"}`}
    >
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          {!collapsed && <h2 className="text-lg font-bold text-gray-800">{isAdmin ? "Admin Panel" : "Market Rp"}</h2>}
          <Button variant="ghost" size="sm" onClick={() => setCollapsed(!collapsed)} className="p-2">
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
        {currentMenuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Button
              key={item.href}
              variant={isActive ? "default" : "ghost"}
              className={`w-full justify-start ${collapsed ? "px-2" : "px-4"}`}
              onClick={() => router.push(item.href)}
            >
              <Icon className="h-4 w-4" />
              {!collapsed && <span className="ml-2">{item.label}</span>}
            </Button>
          )
        })}
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <Button
          variant="outline"
          className={`w-full justify-start ${collapsed ? "px-2" : "px-4"}`}
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span className="ml-2">Chiqish</span>}
        </Button>
      </div>
    </div>
  )
}
