"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "../../components/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Store, Edit, Trash2, Eye } from "lucide-react"

interface Shop {
  id: number
  name: string
  owner: string
  email: string
  phone: string
  address: string
  status: "active" | "inactive" | "pending"
  createdDate: string
}

const mockShops: Shop[] = [
  {
    id: 1,
    name: "Oila Market",
    owner: "Alisher Karimov",
    email: "alisher@example.com",
    phone: "+998901234567",
    address: "Toshkent, Chilonzor tumani",
    status: "active",
    createdDate: "2024-01-15",
  },
  {
    id: 2,
    name: "Yangi Dukon",
    owner: "Malika Tosheva",
    email: "malika@example.com",
    phone: "+998907654321",
    address: "Samarqand, Markaz tumani",
    status: "pending",
    createdDate: "2024-01-20",
  },
  {
    id: 3,
    name: "Super Market",
    owner: "Bobur Rahimov",
    email: "bobur@example.com",
    phone: "+998909876543",
    address: "Buxoro, Kogon tumani",
    status: "active",
    createdDate: "2024-01-25",
  },
]

export default function ShopsPage() {
  const [user, setUser] = useState<any>(null)
  const [shops, setShops] = useState<Shop[]>(mockShops)
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingShop, setEditingShop] = useState<Shop | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    owner: "",
    email: "",
    phone: "",
    address: "",
    status: "pending" as "active" | "inactive" | "pending",
  })
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

  const filteredShops = shops.filter(
    (shop) =>
      shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shop.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shop.address.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const resetForm = () => {
    setFormData({
      name: "",
      owner: "",
      email: "",
      phone: "",
      address: "",
      status: "pending",
    })
  }

  const handleAddShop = (e: React.FormEvent) => {
    e.preventDefault()
    const newShop: Shop = {
      id: Date.now(),
      ...formData,
      createdDate: new Date().toISOString().split("T")[0],
    }
    setShops([...shops, newShop])
    resetForm()
    setShowAddModal(false)
  }

  const handleEditShop = (shop: Shop) => {
    setEditingShop(shop)
    setFormData({
      name: shop.name,
      owner: shop.owner,
      email: shop.email,
      phone: shop.phone,
      address: shop.address,
      status: shop.status,
    })
    setShowEditModal(true)
  }

  const handleUpdateShop = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingShop) return

    const updatedShop: Shop = {
      ...editingShop,
      ...formData,
    }

    setShops(shops.map((shop) => (shop.id === editingShop.id ? updatedShop : shop)))
    setEditingShop(null)
    resetForm()
    setShowEditModal(false)
  }

  const handleDeleteShop = (id: number, shopName: string) => {
    if (confirm(`"${shopName}" do'konini o'chirishni xohlaysizmi?\n\nBu amal qaytarilmaydi!`)) {
      setShops(shops.filter((shop) => shop.id !== id))
    }
  }

  const handleStatusChange = (id: number, newStatus: "active" | "inactive" | "pending") => {
    setShops(shops.map((shop) => (shop.id === id ? { ...shop, status: newStatus } : shop)))
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "pending":
        return "secondary"
      case "inactive":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Faol"
      case "pending":
        return "Kutilmoqda"
      case "inactive":
        return "Nofaol"
      default:
        return "Noma'lum"
    }
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
                <h1 className="text-2xl font-bold text-gray-900">Do'konlar</h1>
                <p className="text-gray-600">Barcha do'konlarni boshqaring</p>
              </div>
              <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Yangi Do'kon
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Yangi Do'kon Yaratish</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddShop} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Do'kon nomi</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Do'kon nomini kiriting"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="owner">Egasi</Label>
                        <Input
                          id="owner"
                          value={formData.owner}
                          onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                          placeholder="Ega ismini kiriting"
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
                          placeholder="email@example.com"
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
                      <Label htmlFor="address">Manzil</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="To'liq manzilni kiriting"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="status">Holat</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value: "active" | "inactive" | "pending") =>
                          setFormData({ ...formData, status: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Kutilmoqda</SelectItem>
                          <SelectItem value="active">Faol</SelectItem>
                          <SelectItem value="inactive">Nofaol</SelectItem>
                        </SelectContent>
                      </Select>
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
                      <Button type="submit">Yaratish</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Do'kon qidirish..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredShops.map((shop) => (
                <Card key={shop.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="bg-indigo-100 p-2 rounded-lg">
                          <Store className="h-6 w-6 text-indigo-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{shop.name}</CardTitle>
                          <p className="text-sm text-gray-600">{shop.owner}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <Badge variant={getStatusBadgeVariant(shop.status)}>{getStatusText(shop.status)}</Badge>
                        <Select
                          value={shop.status}
                          onValueChange={(value: "active" | "inactive" | "pending") =>
                            handleStatusChange(shop.id, value)
                          }
                        >
                          <SelectTrigger className="w-24 h-6 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Kutish</SelectItem>
                            <SelectItem value="active">Faol</SelectItem>
                            <SelectItem value="inactive">Nofaol</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600 flex items-center">
                        <span className="font-medium mr-2">Email:</span>
                        {shop.email}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center">
                        <span className="font-medium mr-2">Tel:</span>
                        {shop.phone}
                      </p>
                      <p className="text-sm text-gray-600 flex items-start">
                        <span className="font-medium mr-2">Manzil:</span>
                        <span className="flex-1">{shop.address}</span>
                      </p>
                    </div>

                    <div className="text-xs text-gray-500 border-t pt-2">
                      Yaratilgan: {new Date(shop.createdDate).toLocaleDateString("uz-UZ")}
                    </div>

                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        <Eye className="h-4 w-4 mr-1" />
                        Ko'rish
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEditShop(shop)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteShop(shop.id, shop.name)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
            <DialogTitle>Do'konni Tahrirlash</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateShop} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Do'kon nomi</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Do'kon nomini kiriting"
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-owner">Egasi</Label>
                <Input
                  id="edit-owner"
                  value={formData.owner}
                  onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                  placeholder="Ega ismini kiriting"
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
                  placeholder="email@example.com"
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
              <Label htmlFor="edit-address">Manzil</Label>
              <Input
                id="edit-address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="To'liq manzilni kiriting"
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-status">Holat</Label>
              <Select
                value={formData.status}
                onValueChange={(value: "active" | "inactive" | "pending") =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Kutilmoqda</SelectItem>
                  <SelectItem value="active">Faol</SelectItem>
                  <SelectItem value="inactive">Nofaol</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowEditModal(false)
                  setEditingShop(null)
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
