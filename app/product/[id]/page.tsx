"use client"

import { Label } from "@/components/ui/label"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"
import { Header } from "@/components/header"
import { Breadcrumb } from "@/components/breadcrumb"
import {
  Heart,
  Share2,
  MessageCircle,
  Star,
  ShoppingCart,
  Shield,
  Truck,
  RotateCcw,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
} from "lucide-react"
import Link from "next/link"
import { useProducts, type Product } from "@/lib/products"
import { useAuth } from "@/lib/auth"
import { useCart } from "@/lib/cart"

export default function ProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isFavorited, setIsFavorited] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [isImageZoomed, setIsImageZoomed] = useState(false)

  const { getProductById, updateProduct, products } = useProducts()
  const { user } = useAuth()
  const { addToCart } = useCart()
  const router = useRouter()

  useEffect(() => {
    const foundProduct = getProductById(params.id)
    if (foundProduct) {
      setProduct(foundProduct)
      // Increment view count
      updateProduct(params.id, { views: foundProduct.views + 1 })
    }
  }, [params.id, getProductById, updateProduct])

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
              <ShoppingCart className="h-8 w-8 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Product not found</h1>
            <p className="text-muted-foreground mb-6">The item you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link href="/browse">Browse Products</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const handleFavoriteToggle = () => {
    setIsFavorited(!isFavorited)
    updateProduct(product.id, {
      favorites: isFavorited ? product.favorites - 1 : product.favorites + 1,
    })
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: product.description,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copied",
        description: "Product link has been copied to your clipboard.",
      })
    }
  }

  const handleAddToCart = () => {
    if (!user) {
      router.push("/login")
      return
    }

    for (let i = 0; i < quantity; i++) {
      addToCart(product)
    }
    toast({
      title: "Added to cart",
      description: `${quantity} × ${product.title} added to your cart.`,
    })
  }

  const handleBuyNow = () => {
    if (!user) {
      router.push("/login")
      return
    }

    for (let i = 0; i < quantity; i++) {
      addToCart(product)
    }
    router.push("/cart")
  }

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % product.images.length)
  }

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length)
  }

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id && p.status === "active")
    .slice(0, 4)

  const savings = product.originalPrice ? product.originalPrice - product.price : 0
  const savingsPercentage = product.originalPrice ? Math.round((savings / product.originalPrice) * 100) : 0

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb
          items={[
            { label: "Browse", href: "/browse" },
            { label: product.category, href: `/browse?category=${product.category}` },
            { label: product.title },
          ]}
        />

        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-xl border bg-muted/30">
              <img
                src={product.images[selectedImageIndex] || "/placeholder.svg"}
                alt={product.title}
                className={`w-full h-full object-cover transition-transform duration-300 ${
                  isImageZoomed ? "scale-150 cursor-zoom-out" : "cursor-zoom-in"
                }`}
                onClick={() => setIsImageZoomed(!isImageZoomed)}
              />

              {/* Image navigation arrows */}
              {product.images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background backdrop-blur-sm"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background backdrop-blur-sm"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </>
              )}

              {/* Zoom indicator */}
              <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm rounded-lg p-2">
                <ZoomIn className="h-4 w-4 text-muted-foreground" />
              </div>

              {/* Discount badge */}
              {product.originalPrice && (
                <Badge className="absolute top-4 left-4 bg-destructive text-destructive-foreground font-semibold text-sm px-3 py-1">
                  {savingsPercentage}% OFF
                </Badge>
              )}
            </div>

            {/* Thumbnail gallery */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden transition-all ${
                      selectedImageIndex === index
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-muted hover:border-primary/50"
                    }`}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-8">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      {product.category}
                    </Badge>
                    <Badge variant="secondary" className="bg-secondary/10 text-secondary border-secondary/20">
                      {product.condition}
                    </Badge>
                  </div>
                  <h1 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight">{product.title}</h1>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleFavoriteToggle}
                    className="h-10 w-10 bg-transparent"
                  >
                    <Heart className={`h-5 w-5 ${isFavorited ? "fill-red-500 text-red-500" : ""}`} />
                  </Button>
                  <Button variant="outline" size="icon" onClick={handleShare} className="h-10 w-10 bg-transparent">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Price section */}
              <div className="bg-muted/30 rounded-xl p-6 mb-6">
                <div className="flex items-baseline gap-4 mb-3">
                  <span className="text-4xl font-bold text-primary">${product.price}</span>
                  {product.originalPrice && (
                    <span className="text-xl text-muted-foreground line-through">${product.originalPrice}</span>
                  )}
                </div>
                {product.originalPrice && (
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive" className="font-semibold">
                      Save ${savings} ({savingsPercentage}% off)
                    </Badge>
                    <span className="text-sm text-muted-foreground">compared to retail price</span>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">4.8 (23 reviews)</span>
                </div>
                <span>•</span>
                <span>{product.views} views</span>
                <span>•</span>
                <span>{product.favorites} favorites</span>
              </div>
            </div>

            <Card className="border-2">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={product.sellerAvatar || "/placeholder.svg"} />
                    <AvatarFallback className="text-lg">{product.sellerName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{product.sellerName}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">4.9 seller rating</span>
                      </div>
                      <span>•</span>
                      <span>98% positive feedback</span>
                    </div>
                  </div>
                  <Button variant="outline" className="h-10 bg-transparent">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Message Seller
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Label className="text-sm font-medium">Quantity:</Label>
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 min-w-[3rem] text-center font-medium">{quantity}</span>
                  <Button variant="ghost" size="icon" className="h-10 w-10" onClick={() => setQuantity(quantity + 1)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button size="lg" className="h-12 text-base font-semibold" onClick={handleAddToCart}>
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 text-base font-semibold bg-transparent"
                  onClick={handleBuyNow}
                >
                  Buy Now
                </Button>
              </div>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="font-medium text-sm">Buyer Protection</div>
                  <div className="text-xs text-muted-foreground">Full refund if not as described</div>
                </div>
              </div>
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="font-medium text-sm">Fast Shipping</div>
                  <div className="text-xs text-muted-foreground">Free shipping over $50</div>
                </div>
              </div>
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <RotateCcw className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="font-medium text-sm">Easy Returns</div>
                  <div className="text-xs text-muted-foreground">30-day return policy</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="shipping">Shipping</TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Product Description</h2>
                    <div className="prose prose-sm max-w-none">
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{product.description}</p>
                    </div>

                    {product.tags.length > 0 && (
                      <div className="mt-6 pt-6 border-t">
                        <h3 className="font-medium mb-3">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                          {product.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="bg-muted/50">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="details" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Item Details</h2>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm text-muted-foreground">Condition</span>
                          <div className="font-medium">{product.condition}</div>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Category</span>
                          <div className="font-medium">{product.category}</div>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Listed Date</span>
                          <div className="font-medium">{new Date(product.createdAt).toLocaleDateString()}</div>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Item ID</span>
                          <div className="font-medium text-xs">{product.id}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="shipping" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Shipping & Returns</h2>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Truck className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <div className="font-medium">Free Standard Shipping</div>
                          <div className="text-sm text-muted-foreground">On orders over $50 • 3-5 business days</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <RotateCcw className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <div className="font-medium">30-Day Returns</div>
                          <div className="text-sm text-muted-foreground">Easy returns for peace of mind</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Shield className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <div className="font-medium">Buyer Protection</div>
                          <div className="text-sm text-muted-foreground">Full refund if item not as described</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h3 className="font-semibold">Why Buy Sustainable?</h3>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Reduce environmental impact</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Save money on quality items</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Support circular economy</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <section className="border-t pt-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">You Might Also Like</h2>
              <Button variant="outline" asChild>
                <Link href={`/browse?category=${product.category}`}>View All in {product.category}</Link>
              </Button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Card
                  key={relatedProduct.id}
                  className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-0 shadow-sm hover:-translate-y-1"
                >
                  <Link href={`/product/${relatedProduct.id}`}>
                    <CardHeader className="p-0 relative">
                      <div className="aspect-square overflow-hidden rounded-t-lg">
                        <img
                          src={relatedProduct.images[0] || "/placeholder.svg"}
                          alt={relatedProduct.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
                          {relatedProduct.condition}
                        </Badge>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm text-muted-foreground ml-1">4.8</span>
                        </div>
                      </div>
                      <h3 className="font-semibold text-sm mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                        {relatedProduct.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mb-2">by {relatedProduct.sellerName}</p>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-primary">${relatedProduct.price}</span>
                        {relatedProduct.originalPrice && (
                          <span className="text-xs text-muted-foreground line-through">
                            ${relatedProduct.originalPrice}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
