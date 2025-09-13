"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Header } from "@/components/header"
import { Breadcrumb } from "@/components/breadcrumb"
import { Search, Filter, Star, Heart, SlidersHorizontal, Grid3X3, List, X } from "lucide-react"
import Link from "next/link"
import { useProducts, categories, conditions } from "@/lib/products"

export default function BrowsePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedCondition, setSelectedCondition] = useState("all")
  const [priceRange, setPriceRange] = useState([0, 500])
  const [sortBy, setSortBy] = useState("newest")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const { products } = useProducts()

  const filteredProducts = useMemo(() => {
    let filtered = products.filter((product) => product.status === "active")

    // Search query
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => product.category === selectedCategory)
    }

    // Condition filter
    if (selectedCondition !== "all") {
      filtered = filtered.filter((product) => product.condition === selectedCondition)
    }

    // Price range filter
    filtered = filtered.filter((product) => product.price >= priceRange[0] && product.price <= priceRange[1])

    // Sort
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "popular":
        filtered.sort((a, b) => b.views + b.favorites - (a.views + a.favorites))
        break
      case "newest":
      default:
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
    }

    return filtered
  }, [products, searchQuery, selectedCategory, selectedCondition, priceRange, sortBy])

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("all")
    setSelectedCondition("all")
    setPriceRange([0, 500])
    setSortBy("newest")
  }

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Active Filters */}
      {(selectedCategory !== "all" ||
        selectedCondition !== "all" ||
        searchQuery ||
        priceRange[0] > 0 ||
        priceRange[1] < 500) && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Active Filters</Label>
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-auto p-1 text-xs">
              Clear All
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedCategory !== "all" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {selectedCategory}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedCategory("all")} />
              </Badge>
            )}
            {selectedCondition !== "all" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {selectedCondition}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedCondition("all")} />
              </Badge>
            )}
            {(priceRange[0] > 0 || priceRange[1] < 500) && (
              <Badge variant="secondary" className="flex items-center gap-1">
                ${priceRange[0]}-${priceRange[1]}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setPriceRange([0, 500])} />
              </Badge>
            )}
          </div>
          <Separator />
        </div>
      )}

      {/* Category Filter */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Category</Label>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="h-10">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Condition Filter */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Condition</Label>
        <Select value={selectedCondition} onValueChange={setSelectedCondition}>
          <SelectTrigger className="h-10">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Conditions</SelectItem>
            {conditions.map((condition) => (
              <SelectItem key={condition} value={condition}>
                {condition}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div className="space-y-4">
        <Label className="text-sm font-medium">Price Range</Label>
        <div className="px-3">
          <Slider value={priceRange} onValueChange={setPriceRange} max={500} min={0} step={5} className="w-full" />
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span className="font-medium">${priceRange[0]}</span>
          <span className="font-medium">${priceRange[1]}</span>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[{ label: "Browse" }]} />

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Browse Sustainable Finds</h1>
          <p className="text-muted-foreground">Discover quality pre-loved items from our community</p>
        </div>

        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <Card className="sticky top-24">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-5 w-5 text-primary" />
                  <span className="font-semibold">Filters</span>
                </div>
              </CardHeader>
              <CardContent>
                <FilterContent />
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search and Controls Bar */}
            <div className="flex flex-col gap-4 mb-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search for items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-base"
                />
              </div>

              {/* Controls Row */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Results Count */}
                  <p className="text-sm text-muted-foreground font-medium">
                    {filteredProducts.length} {filteredProducts.length === 1 ? "item" : "items"}
                  </p>

                  {/* Mobile Filter Button */}
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm" className="lg:hidden bg-transparent">
                        <Filter className="h-4 w-4 mr-2" />
                        Filters
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80">
                      <SheetHeader>
                        <SheetTitle>Filters</SheetTitle>
                        <SheetDescription>Refine your search to find exactly what you're looking for</SheetDescription>
                      </SheetHeader>
                      <div className="mt-6">
                        <FilterContent />
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>

                <div className="flex items-center gap-3">
                  {/* View Mode Toggle */}
                  <div className="flex items-center border rounded-lg p-1">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className="h-8 w-8 p-0"
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className="h-8 w-8 p-0"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Sort */}
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48 h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            {filteredProducts.length === 0 ? (
              <Card className="text-center py-16">
                <CardContent>
                  <div className="max-w-md mx-auto">
                    <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                      <Search className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No items found</h3>
                    <p className="text-muted-foreground mb-6">
                      Try adjusting your search terms or filters to find what you're looking for.
                    </p>
                    <Button onClick={clearFilters} variant="outline">
                      Clear All Filters
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div
                className={
                  viewMode === "grid" ? "grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"
                }
              >
                {filteredProducts.map((product) => (
                  <Card
                    key={product.id}
                    className={`group cursor-pointer hover:shadow-xl transition-all duration-300 border-0 shadow-sm hover:-translate-y-1 ${
                      viewMode === "list" ? "flex flex-row overflow-hidden" : ""
                    }`}
                  >
                    <Link href={`/product/${product.id}`} className={viewMode === "list" ? "flex w-full" : ""}>
                      <CardHeader className={`p-0 relative ${viewMode === "list" ? "w-48 flex-shrink-0" : ""}`}>
                        <div
                          className={`overflow-hidden relative ${
                            viewMode === "list" ? "aspect-square rounded-l-lg" : "aspect-square rounded-t-lg"
                          }`}
                        >
                          <img
                            src={product.images[0] || "/placeholder.svg"}
                            alt={product.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-3 right-3 h-8 w-8 bg-background/80 hover:bg-background backdrop-blur-sm"
                            onClick={(e) => {
                              e.preventDefault()
                              // Handle favorite toggle
                            }}
                          >
                            <Heart className="h-4 w-4" />
                          </Button>
                          {product.originalPrice && (
                            <Badge className="absolute top-3 left-3 bg-destructive text-destructive-foreground font-semibold">
                              {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent
                        className={`p-4 ${viewMode === "list" ? "flex-1 flex flex-col justify-between" : ""}`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                              {product.condition}
                            </Badge>
                            <div className="flex items-center">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm text-muted-foreground ml-1">4.8</span>
                            </div>
                          </div>
                          <h3
                            className={`font-semibold mb-1 group-hover:text-primary transition-colors ${
                              viewMode === "list" ? "text-base" : "text-sm line-clamp-2"
                            }`}
                          >
                            {product.title}
                          </h3>
                          <p className="text-xs text-muted-foreground mb-3">by {product.sellerName}</p>
                        </div>
                        <div className={`${viewMode === "list" ? "flex items-center justify-between" : ""}`}>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-bold text-lg text-primary">${product.price}</span>
                            {product.originalPrice && (
                              <span className="text-sm text-muted-foreground line-through">
                                ${product.originalPrice}
                              </span>
                            )}
                          </div>
                          {viewMode === "list" && (
                            <Button size="sm" className="ml-4">
                              View Details
                            </Button>
                          )}
                        </div>
                        {viewMode === "grid" && (
                          <Badge variant="outline" className="text-xs w-fit">
                            {product.category}
                          </Badge>
                        )}
                      </CardContent>
                    </Link>
                  </Card>
                ))}
              </div>
            )}

            {/* Pagination */}
            {filteredProducts.length > 0 && (
              <div className="flex justify-center mt-12">
                <div className="flex items-center gap-2">
                  <Button variant="outline" disabled>
                    Previous
                  </Button>
                  <Button variant="default" size="sm">
                    1
                  </Button>
                  <Button variant="outline" size="sm">
                    2
                  </Button>
                  <Button variant="outline" size="sm">
                    3
                  </Button>
                  <Button variant="outline">Next</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
