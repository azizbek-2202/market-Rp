"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, ShoppingCart, Plus } from "lucide-react"
import Sidebar from "../components/sidebar"
import CartButton from "../components/cart-button"
import QuantityModal from "../components/quantity-modal"

interface Product {
  id: number
  name: string
  price: number
  category: string
  stock: number
  unit: string
  image: string
}

interface CartItem extends Product {
  quantity: number
}

const mockProducts: Product[] = [
  {
    id: 1,
    name: "Coca Cola 1.5L",
    price: 8000,
    category: "Ichimliklar",
    stock: 50,
    unit: "dona",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 2,
    name: "Non",
    price: 2000,
    category: "Oziq-ovqat",
    stock: 30,
    unit: "dona",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 3,
    name: "Sut 1L",
    price: 12000,
    category: "Sut mahsulotlari",
    stock: 25,
    unit: "litr",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 4,
    name: "Olma 1kg",
    price: 15000,
    category: "Mevalar",
    stock: 40,
    unit: "kg",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 5,
    name: "Guruch 1kg",
    price: 18000,
    category: "Oziq-ovqat",
    stock: 20,
    unit: "kg",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 6,
    name: "Choy",
    price: 25000,
    category: "Ichimliklar",
    stock: 15,
    unit: "quti",
    image: "/placeholder.svg?height=80&width=80",
  },
]

export default function SalesPage() {
  const [user, setUser] = useState<any>(null)
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [cart, setCart] = useState<CartItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showQuantityModal, setShowQuantityModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/")
      return
    }
    setUser(JSON.parse(userData))
  }, [router])

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product)
    setShowQuantityModal(true)
  }

  const addToCart = (product: Product, quantity: number) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id)
      if (existingItem) {
        // Agar mahsulot allaqachon savatda bo'lsa, miqdorni qo'shamiz
        return prevCart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item))
      }
      // Yangi mahsulot qo'shamiz
      return [...prevCart, { ...product, quantity }]
    })
  }

  const updateQuantity = (id: number, change: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === id) {
            const newQuantity = item.quantity + change
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : item
          }
          return item
        })
        .filter((item) => item.quantity > 0),
    )
  }

  const removeFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id))
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const handleCheckout = () => {
    if (cart.length === 0) return

    // Store cart data in localStorage for checkout page
    localStorage.setItem("checkoutCart", JSON.stringify(cart))
    router.push("/checkout")
  }

  if (!user) return null

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden ml-64">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-indigo-600 p-2 rounded-lg">
                  <ShoppingCart className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Sotuv Paneli</h1>
                  <p className="text-sm text-gray-600">Xush kelibsiz, {user?.name}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <CartButton cart={cart} />
                <Button onClick={() => router.push("/")} variant="outline">
                  Chiqish
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex h-[calc(100vh-80px)]">
          {/* Products Section */}
          <div className="flex-1 p-6">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Mahsulot qidirish..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-20 object-cover rounded-md mb-3"
                    />
                    <h3 className="font-semibold text-sm mb-1">{product.name}</h3>
                    <p className="text-xs text-gray-600 mb-2">{product.category}</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-indigo-600">{product.price.toLocaleString()} so'm</span>
                      <Badge variant={product.stock > 10 ? "default" : "destructive"}>
                        {product.stock} {product.unit}
                      </Badge>
                    </div>
                    <Button
                      onClick={() => handleProductClick(product)}
                      className="w-full"
                      size="sm"
                      disabled={product.stock === 0}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Qo'shish
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      <QuantityModal
        open={showQuantityModal}
        onOpenChange={setShowQuantityModal}
        product={selectedProduct}
        onAddToCart={addToCart}
      />
    </div>
  )
}
