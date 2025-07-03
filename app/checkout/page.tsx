"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "../components/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ShoppingCart, Calculator, CreditCard } from "lucide-react"

interface CartItem {
  id: number
  name: string
  price: number
  category: string
  stock: number
  unit: string
  image: string
  quantity: number
}

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    address: "",
  })
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [discount, setDiscount] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const checkoutCart = localStorage.getItem("checkoutCart")
    if (checkoutCart) {
      setCart(JSON.parse(checkoutCart))
    } else {
      router.push("/sales")
    }
  }, [router])

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const getFinalPrice = () => {
    const total = getTotalPrice()
    return total - (total * discount) / 100
  }

  const handleCompleteSale = () => {
    // Here you would typically send the data to your backend
    alert(`Sotuv muvaffaqiyatli yakunlandi!\nJami: ${getFinalPrice().toLocaleString()} so'm`)

    // Clear cart and redirect
    localStorage.removeItem("checkoutCart")
    router.push("/sales")
  }

  if (cart.length === 0) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <div className="ml-64">
        <div className="p-6">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="outline" onClick={() => router.back()}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Orqaga
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                    <Calculator className="h-6 w-6 mr-2" />
                    Hisob-kitob
                  </h1>
                  <p className="text-gray-600">Sotuv ma'lumotlarini tasdiqlang</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Product Details */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Mahsulotlar Ro'yxati
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {cart.map((item) => (
                        <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-md"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{item.name}</h3>
                            <p className="text-sm text-gray-600 mb-1">{item.category}</p>
                            <div className="flex items-center space-x-4">
                              <Badge variant="outline">
                                {item.quantity} {item.unit}
                              </Badge>
                              <span className="text-sm text-gray-600">
                                {item.price.toLocaleString()} so'm / {item.unit}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-indigo-600">
                              {(item.price * item.quantity).toLocaleString()} so'm
                            </p>
                            <p className="text-xs text-gray-500">
                              {item.quantity} × {item.price.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Customer Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Mijoz Ma'lumotlari</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Mijoz ismi</Label>
                        <Input
                          id="name"
                          value={customerInfo.name}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                          placeholder="Mijoz ismini kiriting"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Telefon raqam</Label>
                        <Input
                          id="phone"
                          value={customerInfo.phone}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                          placeholder="+998901234567"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="address">Manzil (ixtiyoriy)</Label>
                      <Input
                        id="address"
                        value={customerInfo.address}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                        placeholder="Mijoz manzilini kiriting"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Sotuv Xulosasi</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Jami mahsulotlar:</span>
                        <span>{getTotalItems()} dona</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>{getTotalPrice().toLocaleString()} so'm</span>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="discount">Chegirma (%)</Label>
                        <Input
                          id="discount"
                          type="number"
                          min="0"
                          max="100"
                          value={discount}
                          onChange={(e) => setDiscount(Number(e.target.value))}
                          placeholder="0"
                        />
                      </div>

                      {discount > 0 && (
                        <div className="flex justify-between text-red-600">
                          <span>Chegirma ({discount}%):</span>
                          <span>-{((getTotalPrice() * discount) / 100).toLocaleString()} so'm</span>
                        </div>
                      )}

                      <Separator />

                      <div className="flex justify-between text-lg font-bold">
                        <span>Jami to'lov:</span>
                        <span className="text-indigo-600">{getFinalPrice().toLocaleString()} so'm</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CreditCard className="h-5 w-5 mr-2" />
                      To'lov Usuli
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="payment"
                          value="cash"
                          checked={paymentMethod === "cash"}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="text-indigo-600"
                        />
                        <span>Naqd pul</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="payment"
                          value="card"
                          checked={paymentMethod === "card"}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="text-indigo-600"
                        />
                        <span>Plastik karta</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="payment"
                          value="transfer"
                          checked={paymentMethod === "transfer"}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="text-indigo-600"
                        />
                        <span>Bank o'tkazmasi</span>
                      </label>
                    </div>
                  </CardContent>
                </Card>

                <Button onClick={handleCompleteSale} className="w-full h-12 text-lg">
                  Sotuvni Yakunlash
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
