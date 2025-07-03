"use client"

import { Bell, Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useState } from "react"

interface HeaderProps {
  user: {
    name: string
    email: string
    role: string
  }
}

export default function Header({ user }: HeaderProps) {
  const [load, setLoad] = useState(false)
  return (
    <header className="bg-white shadow-sm border-b px-6 py-4">
      <div className="flex items-center justify-between base">
        <div className="flex items-center space-x-4">
          <Link href="" className="text-4xl font-bold">Market Rp</Link>
        </div>

        <div className="flex items-center space-x-2">
          <div className="bg-indigo-600 p-2 rounded-full">
            <User className="h-4 w-4 text-white" />
          </div>
          <div className="text-sm">
            <p className="font-medium">{user.name}</p>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
