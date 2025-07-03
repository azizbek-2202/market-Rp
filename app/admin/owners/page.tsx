"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "../../components/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, User, Mail, Phone, Copy, Eye, Edit, Trash2, RefreshCw } from "lucide-react"

interface Owner {
  id: number
  name: string
  email: string
  password: string
  phone: string
  shopName: string
  status: "active" | "inactive"
  createdDate: string
}

const mockOwners: Owner[] = [
  {
    id: 1,
    name: "Alisher Karimov",
    email: "alisher@marketrp.com",
    password: "shop123",
    phone: "+998901234567",
    shopName: "Oila Market",
    status: "active",
    createdDate: "2024-01-15",
  },
  {
    id: 2,
    name: "Malika Tosheva",
    email: "malika@marketrp.com",
    password: "shop456",
    phone: "+998907654321",
    shopName: "Yangi Dukon",
    status: "active",
    createdDate: "2024-01-20",
  },
  {
    id: 3,
    name: "Bobur Rahimov",
    email: "bobur@marketrp.com",
    password: "shop789",
    phone: "+998909876543",
    shopName: "Super Market",
    status: "inactive",
    createdDate: "2024-01-25",
  },
]

export default function OwnersPage() {
  const [user, setUser] = useState<any>(null)
  const [owners, setOwners] = useState<Owner[]>(mockOwners)
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingOwner, setEditingOwner] = useState<Owner | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    shopName: "",
    status: "active" as "active" | "inactive",
  })
  const [copiedText, setCopiedText] = useState("")
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

  const filteredOwners = owners.filter(
    (owner) =>
      owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      owner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      owner.shopName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const generatePassword = () => {
    return "shop" + Math.random().toString(36).substr(2, 6)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      shopName: "",
      status: "active",
    })
  }

  const handleAddOwner = (e: React.FormEvent) => {
    e.preventDefault()
    const password = generatePassword()
    const newOwner: Owner = {
      id: Date.now(),
      ...formData,
      password,
      createdDate: new Date().toISOString().split("T")[0],
    }
    setOwners([...owners, newOwner])
    resetForm()
    setShowAddModal(false)
  }

  const handleEditOwner = (owner: Owner) => {
    setEditingOwner(owner)
    setFormData({
      name: owner.name,
      email: owner.email,
      phone: owner.phone,
      shopName: owner.shopName,
      status: owner.status,
    })
    setShowEditModal(true)
  }

  const handleUpdateOwner = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingOwner) return

    const updatedOwner: Owner = {
      ...editingOwner,
      ...formData,
    }

    setOwners(owners.map((owner) => (owner.id === editingOwner.id ? updatedOwner : owner)))
    setEditingOwner(null)
    resetForm()
    setShowEditModal(false)
  }

  const handleDeleteOwner = (id: number, ownerName: string) => {
    if (
      confirm(
        `"${ownerName}" do'kon egasini o'chirishni xohlaysizmi?\n\nBu amal bilan uning barcha ma'lumotlari o'chiriladi va qaytarilmaydi!`,
      )
    ) {
      setOwners(owners.filter((owner) => owner.id !== id))
    }
  }

  const handleStatusChange = (id: number, newStatus: "active" | "inactive") => {
    setOwners(owners.map((owner) => (owner.id === id ? { ...owner, status: newStatus } : owner)))
  }

  const handleResetPassword = (id: number) => {
    if (confirm("Yangi parol yaratilsinmi?\n\nEski parol ishlamay qoladi!")) {
      const newPassword = generatePassword()
      setOwners(owners.map((owner) => (owner.id === id ? { ...owner, password: newPassword } : owner)))
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedText(text)
      setTimeout(() => setCopiedText(""), 2000)
    })
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <div className="ml-64">
        <div className="p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Do'kon Egalari</h1>
                <p className="text-gray-600">Do'kon egalarini boshqaring va login ma'lumotlarini bering</p>
              </div>
              <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Yangi Egasi
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Yangi Do'kon Egasi Qo'shish</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddOwner} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">To'liq ism</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Ism familiyani kiriting"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="shopName">Do'kon nomi</Label>
                        <Input
                          id="shopName"
                          value={formData.shopName}
                          onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                          placeholder="Do'kon nomini kiriting"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="email@marketrp.com"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Telefon</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+998901234567"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="status">Holat</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value: "active" | "inactive") => setFormData({ ...formData, status: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Faol</SelectItem>
                          <SelectItem value="inactive">Nofaol</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Eslatma:</strong> Parol avtomatik yaratiladi va egaga beriladi.
                      </p>
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowAddModal(false)
                          resetForm()
                        }}
                      >
                        Bekor qilish
                      </Button>
                      <Button type="submit">Qo'shish</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Egasi qidirish..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOwners.map((owner) => (
                <Card key={owner.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback>
                            {owner.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <CardTitle className="text-lg">{owner.name}</CardTitle>
                          <p className="text-sm text-gray-600">{owner.shopName}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <Badge variant={owner.status === "active" ? "default" : "destructive"}>
                          {owner.status === "active" ? "Faol" : "Nofaol"}
                        </Badge>
                        <Select
                          value={owner.status}
                          onValueChange={(value: "active" | "inactive") => handleStatusChange(owner.id, value)}
                        >
                          <SelectTrigger className="w-20 h-6 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Faol</SelectItem>
                            <SelectItem value="inactive">Nofaol</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{owner.email}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(owner.email)}
                          className="h-6 w-6 p-0"
                          title="Nusxalash"
                        >
                          <Copy className={`h-3 w-3 ${copiedText === owner.email ? "text-green-600" : ""}`} />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center space-x-2">
                          <Eye className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-mono">{owner.password}</span>
                        </div>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(owner.password)}
                            className="h-6 w-6 p-0"
                            title="Parolni nusxalash"
                          >
                            <Copy className={`h-3 w-3 ${copiedText === owner.password ? "text-green-600" : ""}`} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleResetPassword(owner.id)}
                            className="h-6 w-6 p-0"
                            title="Yangi parol yaratish"
                          >
                            <RefreshCw className="h-3 w-3 text-orange-600" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 text-sm text-gray-600 p-2">
                        <Phone className="h-4 w-4" />
                        <span>{owner.phone}</span>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500 border-t pt-2">
                      Yaratilgan: {new Date(owner.createdDate).toLocaleDateString("uz-UZ")}
                    </div>

                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        <User className="h-4 w-4 mr-1" />
                        Profil
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEditOwner(owner)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteOwner(owner.id, owner.name)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        const credentials = `Email: ${owner.email}\nParol: ${owner.password}`
                        copyToClipboard(credentials)
                      }}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Login ma'lumotlarini nusxalash
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Do'kon Egasini Tahrirlash</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateOwner} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">To'liq ism</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ism familiyani kiriting"
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-shopName">Do'kon nomi</Label>
                <Input
                  id="edit-shopName"
                  value={formData.shopName}
                  onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                  placeholder="Do'kon nomini kiriting"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@marketrp.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-phone">Telefon</Label>
                <Input
                  id="edit-phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+998901234567"
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-status">Holat</Label>
              <Select
                value={formData.status}
                onValueChange={(value: "active" | "inactive") => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Faol</SelectItem>
                  <SelectItem value="inactive">Nofaol</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Eslatma:</strong> Parol o'zgartirilmaydi. Yangi parol uchun "Yangi parol yaratish" tugmasini
                ishlating.
              </p>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowEditModal(false)
                  setEditingOwner(null)
                  resetForm()
                }}
              >
                Bekor qilish
              </Button>
              <Button type="submit">Yangilash</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
