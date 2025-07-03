"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "../components/sidebar"
import Header from "../components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Edit, Trash2, FolderOpen } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface Category {
  id: number
  name: string
  description: string
  productCount: number
  color: string
}

const mockCategories: Category[] = [
  { id: 1, name: "Ichimliklar", description: "Barcha turdagi ichimliklar", productCount: 25, color: "bg-blue-500" },
  { id: 2, name: "Oziq-ovqat", description: "Asosiy oziq-ovqat mahsulotlari", productCount: 45, color: "bg-green-500" },
  { id: 3, name: "Sut mahsulotlari", description: "Sut va sut mahsulotlari", productCount: 18, color: "bg-yellow-500" },
  { id: 4, name: "Mevalar", description: "Yangi mevalar", productCount: 32, color: "bg-red-500" },
  { id: 5, name: "Sabzavotlar", description: "Yangi sabzavotlar", productCount: 28, color: "bg-purple-500" },
  {
    id: 6,
    name: "Go'sht mahsulotlari",
    description: "Go'sht va go'sht mahsulotlari",
    productCount: 15,
    color: "bg-orange-500",
  },
]

export default function CategoriesPage() {
  const [user, setUser] = useState<any>(null)
  const [categories, setCategories] = useState<Category[]>(mockCategories)
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  const [showAddModal, setShowAddModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "bg-blue-500",
  })

  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-red-500",
    "bg-purple-500",
    "bg-orange-500",
    "bg-pink-500",
    "bg-indigo-500",
  ]

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault()
    const newCategory: Category = {
      id: Date.now(),
      ...formData,
      productCount: 0,
    }
    setCategories([...categories, newCategory])
    setFormData({ name: "", description: "", color: "bg-blue-500" })
    setShowAddModal(false)
  }

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description,
      color: category.color,
    })
    setShowEditModal(true)
  }

  const handleUpdateCategory = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCategory) return

    const updatedCategory = {
      ...editingCategory,
      ...formData,
    }
    setCategories(categories.map((c) => (c.id === editingCategory.id ? updatedCategory : c)))
    setEditingCategory(null)
    setShowEditModal(false)
  }

  const handleDeleteCategory = (id: number) => {
    if (confirm("Bu kategoriyani o'chirishni xohlaysizmi?")) {
      setCategories(categories.filter((c) => c.id !== id))
    }
  }

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

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
                <h1 className="text-2xl font-bold text-gray-900">Kategoriyalar</h1>
                <p className="text-gray-600">Mahsulot kategoriyalarini boshqaring</p>
              </div>
              <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Yangi Kategoriya
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Yangi Kategoriya Qo'shish</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddCategory} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Kategoriya nomi</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Tavsif</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label>Rang</Label>
                      <div className="flex space-x-2 mt-2">
                        {colors.map((color) => (
                          <button
                            key={color}
                            type="button"
                            className={`w-8 h-8 rounded-full ${color} ${formData.color === color ? "ring-2 ring-gray-400" : ""}`}
                            onClick={() => setFormData({ ...formData, color })}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
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
                  placeholder="Kategoriya qidirish..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCategories.map((category) => (
                <Card key={category.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-lg ${category.color}`}>
                        <FolderOpen className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{category.name}</CardTitle>
                        <Badge variant="secondary">{category.productCount} mahsulot</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">{category.description}</p>

                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent"
                        onClick={() => handleEditCategory(category)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Tahrirlash
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteCategory(category.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Kategoriyani Tahrirlash</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateCategory} className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Kategoriya nomi</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Tavsif</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>
            <div>
              <Label>Rang</Label>
              <div className="flex space-x-2 mt-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`w-8 h-8 rounded-full ${color} ${formData.color === color ? "ring-2 ring-gray-400" : ""}`}
                    onClick={() => setFormData({ ...formData, color })}
                  />
                ))}
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setShowEditModal(false)}>
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
