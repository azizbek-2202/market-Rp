"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface AddProductModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddProduct: (product: any) => void
  editProduct?: any
}

const categories = ["Ichimliklar", "Oziq-ovqat", "Sut mahsulotlari", "Mevalar", "Sabzavotlar", "Go'sht mahsulotlari"]

export default function AddProductModal({ open, onOpenChange, onAddProduct, editProduct }: AddProductModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    description: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (editProduct) {
      setFormData({
        name: editProduct.name,
        price: editProduct.price.toString(),
        category: editProduct.category,
        stock: editProduct.stock.toString(),
        description: editProduct.description || "",
      })
    } else {
      setFormData({ name: "", price: "", category: "", stock: "", description: "" })
    }
  }, [editProduct])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newProduct = {
      id: editProduct ? editProduct.id : Date.now(),
      name: formData.name,
      price: Number.parseInt(formData.price),
      category: formData.category,
      stock: Number.parseInt(formData.stock),
      image: editProduct?.image || "/placeholder.svg?height=100&width=100",
      description: formData.description,
    }

    onAddProduct(newProduct)
    setFormData({ name: "", price: "", category: "", stock: "", description: "" })
    setIsLoading(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editProduct ? "Mahsulotni Tahrirlash" : "Yangi Mahsulot Qo'shish"}</DialogTitle>
          <DialogDescription>Yangi mahsulot ma'lumotlarini kiriting</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Mahsulot nomi</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Mahsulot nomini kiriting"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Narxi (so'm)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Kategoriya</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Kategoriyani tanlang" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Miqdor</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                placeholder="0"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Tavsif</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Mahsulot haqida qisqacha ma'lumot"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Bekor qilish
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Qo'shilmoqda..." : "Qo'shish"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
