"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

interface Product {
  id: number
  name: string
  price: number
  category: string
  stock: number
  unit: string
  image: string
}

interface QuantityModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: Product | null
  onAddToCart: (product: Product, quantity: number) => void
}

export default function QuantityModal({ open, onOpenChange, product, onAddToCart }: QuantityModalProps) {
  const [quantity, setQuantity] = useState(1)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (product && quantity > 0 && quantity <= product.stock) {
      onAddToCart(product, quantity)
      setQuantity(1)
      onOpenChange(false)
    }
  }

  const handleQuantityChange = (value: string) => {
    const num = Number.parseInt(value) || 0
    if (num >= 0 && product && num <= product.stock) {
      setQuantity(num)
    }
  }

  const getTotalPrice = () => {
    return product ? product.price * quantity : 0
  }

  if (!product) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Miqdorni Kiriting</DialogTitle>
          <DialogDescription>{product.name} uchun kerakli miqdorni kiriting</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className="w-16 h-16 object-cover rounded-md"
            />
            <div className="flex-1">
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-sm text-gray-600">{product.category}</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="font-bold text-indigo-600">{product.price.toLocaleString()} so'm</span>
                <Badge variant={product.stock > 10 ? "default" : "destructive"}>
                  {product.stock} {product.unit}
                </Badge>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Miqdor ({product.unit})</Label>
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => handleQuantityChange(e.target.value)}
                  className="text-center"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                >
                  +
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Mavjud: {product.stock} {product.unit}
              </p>
            </div>

            <div className="p-3 bg-indigo-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Jami narx:</span>
                <span className="text-lg font-bold text-indigo-600">{getTotalPrice().toLocaleString()} so'm</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {quantity} × {product.price.toLocaleString()} so'm
              </p>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Bekor qilish
              </Button>
              <Button type="submit" disabled={quantity <= 0 || quantity > product.stock}>
                Savatga Qo'shish
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
