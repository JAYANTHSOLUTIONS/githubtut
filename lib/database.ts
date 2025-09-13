// In-memory database implementation for EcoFinds Marketplace

export interface User {
  id: string
  name: string
  email: string
  password_hash: string
  avatar: string
  created_at: string
}

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
  sellerAvatar: string
  status: string
  tags: string[]
  createdAt: string
}

export interface CartItem {
  id: string
  userId: string
  productId: string
  quantity: number
  addedAt: string
}

class InMemoryDatabase {
  private users: Map<string, User> = new Map()
  private products: Map<string, Product> = new Map()
  private cartItems: Map<string, CartItem> = new Map()

  constructor() {
    this.seedData()
  }

  // User methods
  createUser(userData: { id: string; name: string; email: string; passwordHash: string; avatar: string }) {
    const user: User = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      password_hash: userData.passwordHash,
      avatar: userData.avatar,
      created_at: new Date().toISOString(),
    }
    this.users.set(user.id, user)
    return user
  }

  getUserByEmail(email: string): User | null {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user
      }
    }
    return null
  }

  getUserById(id: string): User | null {
    return this.users.get(id) || null
  }

  updateUser(id: string, updates: Partial<Omit<User, "id" | "created_at">>): boolean {
    const user = this.users.get(id)
    if (!user) return false

    // Handle passwordHash update (convert from API naming)
    if ("passwordHash" in updates) {
      const { passwordHash, ...otherUpdates } = updates as any
      updates = { ...otherUpdates, password_hash: passwordHash }
    }

    const updatedUser = { ...user, ...updates }
    this.users.set(id, updatedUser)
    return true
  }

  // Product methods
  createProduct(productData: Omit<Product, "createdAt">) {
    const product: Product = {
      ...productData,
      createdAt: new Date().toISOString(),
    }
    this.products.set(product.id, product)
    return product
  }

  getAllProducts(): Product[] {
    return Array.from(this.products.values())
  }

  getProductById(id: string): Product | null {
    return this.products.get(id) || null
  }

  getProductsBySeller(sellerId: string): Product[] {
    return Array.from(this.products.values()).filter((product) => product.sellerId === sellerId)
  }

  updateProduct(id: string, updates: Partial<Product>): boolean {
    const product = this.products.get(id)
    if (!product) return false

    const updatedProduct = { ...product, ...updates }
    this.products.set(id, updatedProduct)
    return true
  }

  deleteProduct(id: string): boolean {
    return this.products.delete(id)
  }

  // Cart methods
  addToCart(userId: string, productId: string, quantity: number) {
    const cartKey = `${userId}-${productId}`
    const existingItem = this.cartItems.get(cartKey)

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      const cartItem: CartItem = {
        id: cartKey,
        userId,
        productId,
        quantity,
        addedAt: new Date().toISOString(),
      }
      this.cartItems.set(cartKey, cartItem)
    }
  }

  getCartItems(userId: string): Array<CartItem & { product: Product }> {
    const userCartItems = Array.from(this.cartItems.values()).filter((item) => item.userId === userId)

    return userCartItems
      .map((item) => {
        const product = this.getProductById(item.productId)
        return {
          ...item,
          product: product!,
        }
      })
      .filter((item) => item.product) // Filter out items with deleted products
  }

  updateCartItemQuantity(userId: string, productId: string, quantity: number) {
    const cartKey = `${userId}-${productId}`
    const item = this.cartItems.get(cartKey)

    if (item && item.userId === userId) {
      if (quantity <= 0) {
        this.cartItems.delete(cartKey)
      } else {
        item.quantity = quantity
      }
    }
  }

  removeFromCart(userId: string, productId: string) {
    const cartKey = `${userId}-${productId}`
    this.cartItems.delete(cartKey)
  }

  private seedData() {
    // Seed some sample data
    const sampleUser: User = {
      id: "user-1",
      name: "John Doe",
      email: "john@example.com",
      password_hash: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uIoO", // "password123"
      avatar: "/placeholder.svg?height=40&width=40",
      created_at: new Date().toISOString(),
    }
    this.users.set(sampleUser.id, sampleUser)

    const sampleProducts: Product[] = [
      {
        id: "product-1",
        title: "Eco-Friendly Water Bottle",
        description: "Reusable stainless steel water bottle with bamboo cap",
        price: 25.99,
        originalPrice: 35.99,
        category: "Kitchen & Dining",
        condition: "New",
        images: ["/reusable-water-bottle.png"],
        sellerId: "user-1",
        sellerName: "John Doe",
        sellerAvatar: "/placeholder.svg?height=40&width=40",
        status: "active",
        tags: ["eco-friendly", "reusable", "water bottle"],
        createdAt: new Date().toISOString(),
      },
      {
        id: "product-2",
        title: "Organic Cotton Tote Bag",
        description: "Sustainable shopping bag made from 100% organic cotton",
        price: 15.99,
        category: "Bags & Accessories",
        condition: "New",
        images: ["/simple-canvas-tote.png"],
        sellerId: "user-1",
        sellerName: "John Doe",
        sellerAvatar: "/placeholder.svg?height=40&width=40",
        status: "active",
        tags: ["organic", "cotton", "sustainable"],
        createdAt: new Date().toISOString(),
      },
    ]

    sampleProducts.forEach((product) => {
      this.products.set(product.id, product)
    })
  }
}

// Export singleton instance
export const db = new InMemoryDatabase()
