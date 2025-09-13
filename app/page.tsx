"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Recycle, Heart, Shield, Users, ArrowRight, Star, Truck, Award } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth"

export default function HomePage() {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />

        {/* Hero Section for Unauthenticated Users */}
        <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0">
            <source src="tropical-leaves-rain.mp4" type="video/mp4" />
            <span className="text-white">Your browser does not support the video tag.</span>
          </video>

          <div className="absolute inset-0 bg-black/60 z-10"></div>

          <div className="container mx-auto relative z-20">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="secondary" className="mb-6 bg-primary text-primary-foreground border-primary">
                🌱 Sustainable Shopping Made Simple
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-balance mb-6 leading-tight text-white">
                Discover Quality <span className="text-green-400 font-extrabold">Pre-Loved</span> Treasures
              </h1>
              <p className="text-xl text-white text-pretty mb-8 max-w-2xl mx-auto leading-relaxed">
                Join thousands of eco-conscious shoppers finding amazing deals on quality second-hand items. Every
                purchase makes a positive impact on our planet.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button size="lg" className="h-12 px-8 text-base font-semibold" asChild>
                  <Link href="/login">
                    Sign In <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 px-8 text-base font-semibold bg-white/10 border-white/20 text-white hover:bg-white/20"
                  asChild
                >
                  <Link href="/register">Sign Up</Link>
                </Button>
              </div>

              <div className="flex items-center justify-center gap-6 text-sm text-white/80">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  <span>Free shipping over $50</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  <span>Quality guaranteed</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Choose EcoFinds?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We're more than just a marketplace - we're a community committed to sustainable living and circular
                economy.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Recycle className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">Eco-Friendly</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Reduce waste and environmental impact by giving items a second life.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">Quality Assured</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Every item is carefully reviewed to ensure quality and authenticity.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">Community Driven</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Connect with like-minded individuals who care about sustainability.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">Feel Good Shopping</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Every purchase makes a positive impact on the environment.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary/5">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of eco-conscious shoppers and sellers who are making sustainable choices every day.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/register">Join EcoFinds Today</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t py-12 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                    <Recycle className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span className="text-xl font-bold text-primary">EcoFinds</span>
                </div>
                <p className="text-sm text-muted-foreground">Making sustainable shopping accessible to everyone.</p>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Shop</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link href="/browse" className="hover:text-primary">
                      Browse All
                    </Link>
                  </li>
                  <li>
                    <Link href="/categories" className="hover:text-primary">
                      Categories
                    </Link>
                  </li>
                  <li>
                    <Link href="/new-arrivals" className="hover:text-primary">
                      New Arrivals
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Sell</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link href="/sell" className="hover:text-primary">
                      Start Selling
                    </Link>
                  </li>
                  <li>
                    <Link href="/seller-guide" className="hover:text-primary">
                      Seller Guide
                    </Link>
                  </li>
                  <li>
                    <Link href="/pricing" className="hover:text-primary">
                      Pricing
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link href="/help" className="hover:text-primary">
                      Help Center
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="hover:text-primary">
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" className="hover:text-primary">
                      About
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
              <p>&copy; 2024 EcoFinds. All rights reserved. Built with sustainability in mind.</p>
            </div>
          </div>
        </footer>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0">
          <source src="tropical-leaves-rain.mp4" type="video/mp4" />
          <span className="text-white">Your browser does not support the video tag.</span>
        </video>

        <div className="absolute inset-0 bg-black/60 z-10"></div>

        <div className="container mx-auto relative z-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <Badge variant="secondary" className="mb-4 bg-primary text-primary-foreground border-primary">
                🌱 Welcome back, {user.name}!
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-balance mb-6 leading-tight text-white">
                Discover Quality <span className="text-green-400 font-extrabold">Pre-Loved</span> Treasures
              </h1>
              <p className="text-xl text-white text-pretty mb-8 max-w-xl leading-relaxed">
                Continue your sustainable shopping journey. Find amazing deals on quality second-hand items and make a
                positive impact on our planet.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button size="lg" className="h-12 px-8 text-base font-semibold" asChild>
                  <Link href="/browse">
                    Shop Now <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 px-8 text-base font-semibold bg-white/10 border-white/20 text-white hover:bg-white/20"
                  asChild
                >
                  <Link href="/sell">Start Selling</Link>
                </Button>
              </div>
              <div className="flex items-center gap-6 text-sm text-white/80">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  <span>Free shipping over $50</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  <span>Quality guaranteed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose EcoFinds?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're more than just a marketplace - we're a community committed to sustainable living and circular
              economy.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Recycle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Eco-Friendly</h3>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Reduce waste and environmental impact by giving items a second life.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Quality Assured</h3>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Every item is carefully reviewed to ensure quality and authenticity.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Community Driven</h3>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Connect with like-minded individuals who care about sustainability.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Feel Good Shopping</h3>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Every purchase makes a positive impact on the environment.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Trending Now</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover the most popular sustainable finds from our community of sellers
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              {
                id: 1,
                title: "Vintage Leather Jacket",
                price: "$45",
                originalPrice: "$120",
                image: "/vintage-leather-jacket.png",
                condition: "Excellent",
                seller: "Sarah M.",
                discount: "62% off",
              },
              {
                id: 2,
                title: "Mid-Century Modern Chair",
                price: "$85",
                originalPrice: "$200",
                image: "/mid-century-modern-chair.jpg",
                condition: "Good",
                seller: "Mike R.",
                discount: "57% off",
              },
              {
                id: 3,
                title: "Designer Handbag",
                price: "$120",
                originalPrice: "$350",
                image: "/luxury-quilted-handbag.png",
                condition: "Like New",
                seller: "Emma L.",
                discount: "66% off",
              },
              {
                id: 4,
                title: "Acoustic Guitar",
                price: "$180",
                originalPrice: "$400",
                image: "/acoustic-guitar.png",
                condition: "Very Good",
                seller: "David K.",
                discount: "55% off",
              },
            ].map((product) => (
              <Card
                key={product.id}
                className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-0 shadow-sm hover:-translate-y-1"
              >
                <CardHeader className="p-0 relative">
                  <div className="aspect-square overflow-hidden rounded-t-lg relative">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <Badge className="absolute top-3 left-3 bg-destructive text-destructive-foreground font-semibold">
                      {product.discount}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
                      {product.condition}
                    </Badge>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-muted-foreground ml-1">4.8</span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">
                    {product.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3">by {product.seller}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg text-primary">{product.price}</span>
                      <span className="text-sm text-muted-foreground line-through">{product.originalPrice}</span>
                    </div>
                    <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      Quick View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button size="lg" variant="outline" asChild>
              <Link href="/browse">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary/5">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Continue making sustainable choices and help build a better future for our planet.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/sell">List Your Items</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">Get Support</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                  <Recycle className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-primary">EcoFinds</span>
              </div>
              <p className="text-sm text-muted-foreground">Making sustainable shopping accessible to everyone.</p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Shop</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/browse" className="hover:text-primary">
                    Browse All
                  </Link>
                </li>
                <li>
                  <Link href="/categories" className="hover:text-primary">
                    Categories
                  </Link>
                </li>
                <li>
                  <Link href="/new-arrivals" className="hover:text-primary">
                    New Arrivals
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Sell</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/sell" className="hover:text-primary">
                    Start Selling
                  </Link>
                </li>
                <li>
                  <Link href="/seller-guide" className="hover:text-primary">
                    Seller Guide
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-primary">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/help" className="hover:text-primary">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-primary">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-primary">
                    About
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 EcoFinds. All rights reserved. Built with sustainability in mind.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
