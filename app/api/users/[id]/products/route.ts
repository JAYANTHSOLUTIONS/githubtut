import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") || "active"

    const products = db
      .getProductsBySeller(params.id)
      .filter((product) => status === "all" || product.status === status)

    return NextResponse.json({ products })
  } catch (error) {
    console.error("[v0] Get user products error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
