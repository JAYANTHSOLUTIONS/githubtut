"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface Product {
  id: string
  title: string
  description: string
  price: number
  originalPrice?: number
  category: string
  condition: string
  images: string[]
  sellerId: string
  sellerName: string
  sellerAvatar?: string
  status: "active" | "sold" | "draft"
  views: number
  favorites: number
  tags: string[]
  createdAt: string
}

interface ProductContextType {
  products: Product[]
  loading: boolean
  getProductById: (id: string) => Product | undefined
  addProduct: (product: Omit<Product, "id" | "createdAt" | "views" | "favorites">) => Promise<boolean>
  updateProduct: (id: string, updates: Partial<Product>) => Promise<boolean>
  deleteProduct: (id: string) => Promise<boolean>
  getProductsBySeller: (sellerId: string) => Product[]
  refreshProducts: () => Promise<void>
}

const ProductContext = createContext<ProductContextType | undefined>(undefined)

function getAuthToken(): string | null {
  return localStorage.getItem("ecofinds_token")
}

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    refreshProducts()
  }, [])

  const refreshProducts = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/products")
      if (response.ok) {
        const { products: fetchedProducts } = await response.json()
        setProducts(fetchedProducts)
      } else {
        console.error("[v0] Failed to fetch products")
      }
    } catch (error) {
      console.error("[v0] Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const getProductById = (id: string) => {
    return products.find((product) => product.id === id)
  }

  const addProduct = async (
    productData: Omit<Product, "id" | "createdAt" | "views" | "favorites">,
  ): Promise<boolean> => {
    const token = getAuthToken()
    if (!token) {
      console.error("[v0] No auth token found")
      return false
    }

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      })

      if (response.ok) {
        const { product } = await response.json()
        setProducts((prev) => [product, ...prev])
        return true
      } else {
        const errorData = await response.json()
        console.error("[v0] Failed to add product:", errorData.error)
        return false
      }
    } catch (error) {
      console.error("[v0] Error adding product:", error)
      return false
    }
  }

  const updateProduct = async (id: string, updates: Partial<Product>): Promise<boolean> => {
    const token = getAuthToken()
    if (!token) {
      console.error("[v0] No auth token found")
      return false
    }

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        const { product } = await response.json()
        setProducts((prev) => prev.map((p) => (p.id === id ? product : p)))
        return true
      } else {
        const errorData = await response.json()
        console.error("[v0] Failed to update product:", errorData.error)
        return false
      }
    } catch (error) {
      console.error("[v0] Error updating product:", error)
      return false
    }
  }

  const deleteProduct = async (id: string): Promise<boolean> => {
    const token = getAuthToken()
    if (!token) {
      console.error("[v0] No auth token found")
      return false
    }

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setProducts((prev) => prev.filter((product) => product.id !== id))
        return true
      } else {
        const errorData = await response.json()
        console.error("[v0] Failed to delete product:", errorData.error)
        return false
      }
    } catch (error) {
      console.error("[v0] Error deleting product:", error)
      return false
    }
  }

  const getProductsBySeller = (sellerId: string) => {
    return products.filter((product) => product.sellerId === sellerId)
  }

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        getProductById,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductsBySeller,
        refreshProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  )
}

export function useProducts() {
  const context = useContext(ProductContext)
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductProvider")
  }
  return context
}

export const categories = [
  "Fashion",
  "Furniture",
  "Electronics",
  "Books",
  "Home & Garden",
  "Sports & Outdoors",
  "Toys & Games",
  "Art & Collectibles",
]

export const conditions = ["Like New", "Excellent", "Good", "Fair", "Poor"]
