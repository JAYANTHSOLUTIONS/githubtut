"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Product } from "./products"

export interface CartItem {
  id: string
  product: Product
  quantity: number
}

export interface Order {
  id: string
  items: CartItem[]
  total: number
  status: string
  createdAt: string
  estimatedDelivery: string
  shippingAddress: {
    name: string
    address: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  paymentMethod: {
    type: string
    last4?: string
    transactionHash?: string
    ethAmount?: string
    walletAddress?: string
  }
}

interface CartContextType {
  items: CartItem[]
  orders: Order[]
  loading: boolean
  addToCart: (product: Product) => Promise<void>
  removeFromCart: (productId: string) => Promise<void>
  updateQuantity: (productId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  getTotalPrice: () => number
  getTotalItems: () => number
  refreshCart: () => Promise<void>
  createOrder: (shippingAddress: any, paymentMethod: any) => Promise<string>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

function getAuthToken(): string | null {
  return localStorage.getItem("ecofinds_token")
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const token = getAuthToken()
    if (token) {
      refreshCart()
    }
  }, [])

  const refreshCart = async () => {
    const token = getAuthToken()
    if (!token) return

    setLoading(true)
    try {
      const response = await fetch("/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const { items: fetchedItems } = await response.json()
        setItems(fetchedItems)
      } else {
        console.error("[v0] Failed to fetch cart items")
      }
    } catch (error) {
      console.error("[v0] Error fetching cart:", error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (product: Product) => {
    const token = getAuthToken()
    if (!token) {
      console.error("[v0] No auth token found")
      return
    }

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: product.id, quantity: 1 }),
      })

      if (response.ok) {
        const { items: updatedItems } = await response.json()
        setItems(updatedItems)
      } else {
        console.error("[v0] Failed to add to cart")
        setItems((prev) => {
          const existingItem = prev.find((item) => item.product.id === product.id)
          if (existingItem) {
            return prev.map((item) =>
              item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
            )
          }
          return [...prev, { id: Date.now().toString(), product, quantity: 1 }]
        })
      }
    } catch (error) {
      console.error("[v0] Error adding to cart:", error)
    }
  }

  const removeFromCart = async (productId: string) => {
    const token = getAuthToken()
    if (!token) {
      console.error("[v0] No auth token found")
      return
    }

    try {
      const response = await fetch(`/api/cart?productId=${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const { items: updatedItems } = await response.json()
        setItems(updatedItems)
      } else {
        console.error("[v0] Failed to remove from cart")
        setItems((prev) => prev.filter((item) => item.product.id !== productId))
      }
    } catch (error) {
      console.error("[v0] Error removing from cart:", error)
    }
  }

  const updateQuantity = async (productId: string, quantity: number) => {
    const token = getAuthToken()
    if (!token) {
      console.error("[v0] No auth token found")
      return
    }

    if (quantity <= 0) {
      await removeFromCart(productId)
      return
    }

    try {
      const response = await fetch("/api/cart", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity }),
      })

      if (response.ok) {
        const { items: updatedItems } = await response.json()
        setItems(updatedItems)
      } else {
        console.error("[v0] Failed to update cart quantity")
        setItems((prev) => prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item)))
      }
    } catch (error) {
      console.error("[v0] Error updating cart quantity:", error)
    }
  }

  const clearCart = async () => {
    const token = getAuthToken()
    if (!token) {
      setItems([])
      return
    }

    try {
      for (const item of items) {
        await removeFromCart(item.product.id)
      }
    } catch (error) {
      console.error("[v0] Error clearing cart:", error)
      setItems([])
    }
  }

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.product.price * item.quantity, 0)
  }

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const createOrder = async (shippingAddress: any, paymentMethod: any): Promise<string> => {
    const subtotal = getTotalPrice()
    const shipping = subtotal > 50 ? 0 : 9.99
    const tax = subtotal * 0.08
    const total = subtotal + shipping + tax

    const orderId = `ORD-${Date.now()}`
    const newOrder: Order = {
      id: orderId,
      items: [...items],
      total,
      status: "confirmed",
      createdAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      shippingAddress,
      paymentMethod,
    }

    setOrders((prev) => [...prev, newOrder])
    await clearCart()

    return orderId
  }

  return (
    <CartContext.Provider
      value={{
        items,
        orders,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
        refreshCart,
        createOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
