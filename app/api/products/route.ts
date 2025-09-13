import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"
import { randomUUID } from "crypto"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sellerId = searchParams.get("sellerId")

    let products
    if (sellerId) {
      products = db.getProductsBySeller(sellerId)
    } else {
      products = db.getAllProducts()
    }

    return NextResponse.json({ products })
  } catch (error) {
    console.error("[v0] Get products error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const productData = await request.json()

    if (!productData.title || !productData.description || !productData.price) {
      return NextResponse.json({ error: "Title, description, and price are required" }, { status: 400 })
    }

    const productId = randomUUID()

    const newProduct = {
      id: productId,
      title: productData.title,
      description: productData.description,
      price: productData.price,
      originalPrice: productData.originalPrice,
      category: productData.category,
      condition: productData.condition,
      images: productData.images || [],
      sellerId: productData.sellerId,
      sellerName: productData.sellerName,
      sellerAvatar: productData.sellerAvatar,
      status: productData.status || "active",
      tags: productData.tags || [],
    }

    db.createProduct(newProduct)

    return NextResponse.json({ product: newProduct }, { status: 201 })
  } catch (error) {
    console.error("[v0] Create product error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
