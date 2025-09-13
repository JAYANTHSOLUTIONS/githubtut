"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Package, Plus, Eye, Heart, DollarSign, TrendingUp, ShoppingBag, Clock } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth"
import { useProducts } from "@/lib/products"
import { useCart } from "@/lib/cart"

export default function DashboardPage() {
  const { user } = useAuth()
  const { products, getProductsBySeller } = useProducts()
  const { orders } = useCart()

  const userProducts = user ? getProductsBySeller(user.id) : []
  const activeListings = userProducts.filter((p) => p.status === "active").length
  const totalViews = userProducts.reduce((sum, p) => sum + p.views, 0)
  const totalFavorites = userProducts.reduce((sum, p) => sum + p.favorites, 0)
  const totalEarnings = orders.reduce((sum, order) => sum + order.total, 0)
  const recentOrders = orders.slice(0, 3)

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Header />

        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
            <p className="text-muted-foreground">Manage your EcoFinds account and listings</p>
          </div>

          {/* Stats Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeListings}</div>
                <p className="text-xs text-muted-foreground">{userProducts.length - activeListings} sold items</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalViews}</div>
                <p className="text-xs text-muted-foreground">Across all your listings</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Favorites</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalFavorites}</div>
                <p className="text-xs text-muted-foreground">Items saved by others</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalEarnings.toFixed(0)}</div>
                <p className="text-xs text-muted-foreground">{orders.length} orders placed</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Recent Activity */}
            <div className="lg:col-span-2 space-y-6">
              {/* Recent Listings */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Your Recent Listings</CardTitle>
                      <CardDescription>Manage your active and sold items</CardDescription>
                    </div>
                    <Button asChild>
                      <Link href="/sell">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Listing
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {userProducts.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No listings yet</h3>
                      <p className="text-muted-foreground mb-4">Start selling your pre-loved items!</p>
                      <Button asChild>
                        <Link href="/sell">Create Your First Listing</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userProducts.slice(0, 3).map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <img
                              src={item.images[0] || "/placeholder.svg"}
                              alt={item.title}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                            <div>
                              <h4 className="font-medium">{item.title}</h4>
                              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <span>${item.price}</span>
                                <Badge variant={item.status === "active" ? "default" : "secondary"}>
                                  {item.status}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Eye className="h-4 w-4" />
                              <span>{item.views}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Heart className="h-4 w-4" />
                              <span>{item.favorites}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                      {userProducts.length > 3 && (
                        <div className="text-center pt-4">
                          <Button variant="outline" asChild>
                            <Link href="/my-listings">View All Listings</Link>
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Orders */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Recent Purchases</CardTitle>
                      <CardDescription>Your latest orders and purchases</CardDescription>
                    </div>
                    <Button variant="outline" asChild>
                      <Link href="/purchase-history">View All</Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {recentOrders.length === 0 ? (
                    <div className="text-center py-8">
                      <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No purchases yet</h3>
                      <p className="text-muted-foreground mb-4">Start shopping for sustainable finds!</p>
                      <Button asChild>
                        <Link href="/browse">Browse Products</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentOrders.map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                              <ShoppingBag className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-medium">Order #{order.id}</h4>
                              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <span>{order.items.length} items</span>
                                <Badge variant="secondary">{order.status}</Badge>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${order.total.toFixed(2)}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" asChild>
                    <Link href="/sell">
                      <Plus className="mr-2 h-4 w-4" />
                      List New Item
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                    <Link href="/my-listings">
                      <Package className="mr-2 h-4 w-4" />
                      Manage Listings
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                    <Link href="/purchase-history">
                      <Clock className="mr-2 h-4 w-4" />
                      Purchase History
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                    <Link href="/browse">
                      <Eye className="mr-2 h-4 w-4" />
                      Browse Items
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5" />
                    Your Impact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Items Sold</span>
                      <span className="font-medium">{userProducts.filter((p) => p.status === "sold").length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Items Purchased</span>
                      <span className="font-medium">{orders.reduce((sum, o) => sum + o.items.length, 0)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">CO₂ Saved</span>
                      <span className="font-medium text-green-600">
                        ~{Math.round((userProducts.length + orders.length) * 2.5)}kg
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
