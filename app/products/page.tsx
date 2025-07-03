"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "../components/sidebar"
import Header from "../components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Edit, Trash2 } from "lucide-react"
import AddProductModal from "../components/add-product-modal"

interface Product {
  id: number
  name: string
  price: number
  category: string
  stock: number
  image: string
}

const mockProducts: Product[] = [
  {
    id: 1,
    name: "Coca Cola 1.5L",
    price: 8000,
    category: "Ichimliklar",
    stock: 50,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 2,
    name: "Non",
    price: 2000,
    category: "Oziq-ovqat",
    stock: 30,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 3,
    name: "Sut 1L",
    price: 12000,
    category: "Sut mahsulotlari",
    stock: 25,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 4,
    name: "Olma 1kg",
    price: 15000,
    category: "Mevalar",
    stock: 40,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 5,
    name: "Guruch 1kg",
    price: 18000,
    category: "Oziq-ovqat",
    stock: 20,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 6,
    name: "Choy",
    price: 25000,
    category: "Ichimliklar",
    stock: 15,
    image: "/placeholder.svg?height=100&width=100",
  },
]

export default function ProductsPage() {
  const [user, setUser] = useState<any>(null)
  const [products, setProducts] = useState<Product[]>(mockProducts)
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

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddProduct = (newProduct: any) => {
    setProducts([...products, newProduct])
  }

  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setShowEditModal(true)
  }

  const handleUpdateProduct = (updatedProduct: any) => {
    setProducts(products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)))
    setEditingProduct(null)
    setShowEditModal(false)
  }

  const handleDeleteProduct = (id: number) => {
    if (confirm("Bu mahsulotni o'chirishni xohlaysizmi?")) {
      setProducts(products.filter((p) => p.id !== id))
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
                <h1 className="text-2xl font-bold text-gray-900">Mahsulotlar</h1>
                <p className="text-gray-600">Barcha mahsulotlarni boshqaring</p>
              </div>
              <Button onClick={() => setShowAddModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Yangi Mahsulot
              </Button>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Mahsulot qidirish..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-32 object-cover rounded-md"
                    />
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <p className="text-sm text-gray-600">{product.category}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-indigo-600">{product.price.toLocaleString()} so'm</span>
                      <Badge variant={product.stock > 10 ? "default" : "destructive"}>{product.stock} dona</Badge>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent"
                        onClick={() => handleEditProduct(product)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Tahrirlash
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteProduct(product.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <AddProductModal open={showAddModal} onOpenChange={setShowAddModal} onAddProduct={handleAddProduct} />
          {editingProduct && (
            <AddProductModal
              open={showEditModal}
              onOpenChange={setShowEditModal}
              onAddProduct={handleUpdateProduct}
              editProduct={editingProduct}
            />
          )}
        </main>
      </div>
    </div>
  )
}
