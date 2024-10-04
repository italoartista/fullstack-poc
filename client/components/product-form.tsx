'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { DialogFooter } from "@/components/ui/dialog"

interface ProductFormProps {
  initialProduct?: {
    id?: number
    name: string
    description: string
    price: number
    stock: number
  }
  onSubmit: (product: Omit<ProductFormProps['initialProduct'], 'id'>) => void
  onCancel: () => void
}

export function ProductFormComponent({ initialProduct, onSubmit, onCancel }: ProductFormProps) {
  const [product, setProduct] = useState(initialProduct || {
    name: '',
    description: '',
    price: 0,
    stock: 0
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProduct(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value
    }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!product.name) newErrors.name = 'Name is required'
    if (!product.description) newErrors.description = 'Description is required'
    if (product.price <= 0) newErrors.price = 'Price must be greater than 0'
    if (product.stock < 0) newErrors.stock = 'Stock cannot be negative'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(product)
    }
  }

  return (
    <form onSubmit={handleSubmit} action='http://localhost:3000/products' className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          value={product.name}
          onChange={handleChange}
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={product.description}
          onChange={handleChange}
          className={errors.description ? 'border-red-500' : ''}
        />
        {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
      </div>
      <div>
        <Label htmlFor="price">Price</Label>
        <Input
          id="price"
          name="price"
          type="number"
          step="0.01"
          value={product.price}
          onChange={handleChange}
          className={errors.price ? 'border-red-500' : ''}
        />
        {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
      </div>
      <div>
        <Label htmlFor="stock">Stock</Label>
        <Input
          id="stock"
          name="stock"
          type="number"
          value={product.stock}
          onChange={handleChange}
          className={errors.stock ? 'border-red-500' : ''}
        />
        {errors.stock && <p className="text-red-500 text-sm">{errors.stock}</p>}
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </DialogFooter>
    </form>
  )
}