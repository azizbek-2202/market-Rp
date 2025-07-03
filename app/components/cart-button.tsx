"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ShoppingCart } from "lucide-react"
import { useRouter } from "next/navigation"

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

interface CartButtonProps {
  cart: CartItem[]
}

export default function CartButton({ cart }: CartButtonProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const handleCheckout = () => {
    if (cart.length === 0) return

    // Store cart data in localStorage for checkout page
    localStorage.setItem("checkoutCart", JSON.stringify(cart))
    router.push("/checkout")
    setIsOpen(false)
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="relative bg-transparent">
          <ShoppingCart className="h-4 w-4" />
          {cart.length > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {getTotalItems()}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-96 p-0" align="end">
        <div className="p-4 border-b">
          <h3 className="font-semibold flex items-center">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Savatcha ({cart.length} xil mahsulot)
          </h3>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {cart.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Savatcha bo'sh</p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{item.name}</h4>
                    <p className="text-xs text-gray-600">
                      {item.price.toLocaleString()} so'm / {item.unit}
                    </p>
                    <p className="text-sm font-semibold text-indigo-600">
                      {(item.price * item.quantity).toLocaleString()} so'm
                    </p>
                  </div>
                  <div className="flex flex-col items-center space-y-1">
                    <div className="text-sm font-medium">
                      {item.quantity} {item.unit}
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.quantity} × {item.price.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t p-4 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Jami mahsulotlar:</span>
                <span>{getTotalItems()} dona</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Xil mahsulotlar:</span>
                <span>{cart.length} xil</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Jami narx:</span>
                <span className="text-indigo-600">{getTotalPrice().toLocaleString()} so'm</span>
              </div>
            </div>
            <Button onClick={handleCheckout} className="w-full">
              Hisob-kitob
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
