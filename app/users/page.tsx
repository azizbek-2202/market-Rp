"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "../components/sidebar"
import Header from "../components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Plus, Edit, Trash2, Mail, Phone } from "lucide-react"
import AddUserModal from "../components/add-user-modal"

interface User {
  id: number
  name: string
  email: string
  phone: string
  role: string
  status: "active" | "inactive"
  joinDate: string
}

const mockUsers: User[] = [
  {
    id: 1,
    name: "Alisher Karimov",
    email: "alisher@example.com",
    phone: "+998901234567",
    role: "Mijoz",
    status: "active",
    joinDate: "2024-01-15",
  },
  {
    id: 2,
    name: "Malika Tosheva",
    email: "malika@example.com",
    phone: "+998907654321",
    role: "Xodim",
    status: "active",
    joinDate: "2024-02-20",
  },
  {
    id: 3,
    name: "Bobur Rahimov",
    email: "bobur@example.com",
    phone: "+998909876543",
    role: "Mijoz",
    status: "inactive",
    joinDate: "2024-03-10",
  },
  {
    id: 4,
    name: "Nilufar Saidova",
    email: "nilufar@example.com",
    phone: "+998905432109",
    role: "Mijoz",
    status: "active",
    joinDate: "2024-03-25",
  },
]

export default function UsersPage() {
  const [user, setUser] = useState<any>(null)
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
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

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddUser = (newUser: any) => {
    setUsers([...users, newUser])
  }

  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setShowEditModal(true)
  }

  const handleUpdateUser = (updatedUser: any) => {
    setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)))
    setEditingUser(null)
    setShowEditModal(false)
  }

  const handleDeleteUser = (id: number) => {
    if (confirm("Bu foydalanuvchini o'chirishni xohlaysizmi?")) {
      setUsers(users.filter((u) => u.id !== id))
    }
  }

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
                <h1 className="text-2xl font-bold text-gray-900">Foydalanuvchilar</h1>
                <p className="text-gray-600">Barcha foydalanuvchilarni boshqaring</p>
              </div>
              <Button onClick={() => setShowAddModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Yangi Foydalanuvchi
              </Button>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Foydalanuvchi qidirish..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map((user) => (
                <Card key={user.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{user.name}</CardTitle>
                        <Badge variant={user.status === "active" ? "default" : "secondary"}>
                          {user.status === "active" ? "Faol" : "Nofaol"}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Mail className="h-4 w-4" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Phone className="h-4 w-4" />
                        <span>{user.phone}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{user.role}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(user.joinDate).toLocaleDateString("uz-UZ")}
                      </span>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent"
                        onClick={() => handleEditUser(user)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Tahrirlash
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteUser(user.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <AddUserModal open={showAddModal} onOpenChange={setShowAddModal} onAddUser={handleAddUser} />
          {editingUser && (
            <AddUserModal
              open={showEditModal}
              onOpenChange={setShowEditModal}
              onAddUser={handleUpdateUser}
              editUser={editingUser}
            />
          )}
        </main>
      </div>
    </div>
  )
}
