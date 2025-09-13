"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { ProtectedRoute } from "@/components/protected-route"
import { CreditCard, Truck, Shield, Loader2, Wallet, ExternalLink, CheckCircle } from "lucide-react"
import { useCart } from "@/lib/cart"
import { toast } from "@/hooks/use-toast"
import { metaMaskService, type MetaMaskAccount } from "@/lib/metamask"

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [metaMaskAccount, setMetaMaskAccount] = useState<MetaMaskAccount | null>(null)
  const [isConnectingWallet, setIsConnectingWallet] = useState(false)
  const [cryptoTransactionHash, setCryptoTransactionHash] = useState("")

  // Shipping form
  const [shippingForm, setShippingForm] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
  })

  // Payment form
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
  })

  const { items, getTotalPrice, getTotalItems, createOrder } = useCart()
  const router = useRouter()

  const subtotal = getTotalPrice()
  const shipping = subtotal > 50 ? 0 : 9.99
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  useEffect(() => {
    checkMetaMaskConnection()
  }, [])

  const checkMetaMaskConnection = async () => {
    try {
      const accounts = await metaMaskService.getAccounts()
      if (accounts.length > 0) {
        const balance = await window.ethereum.request({
          method: "eth_getBalance",
          params: [accounts[0], "latest"],
        })
        const balanceInEth = (Number.parseInt(balance, 16) / Math.pow(10, 18)).toFixed(4)
        setMetaMaskAccount({
          address: accounts[0],
          balance: balanceInEth,
        })
      }
    } catch (error) {
      console.error("Error checking MetaMask connection:", error)
    }
  }

  const connectMetaMask = async () => {
    setIsConnectingWallet(true)
    try {
      const account = await metaMaskService.connectWallet()
      setMetaMaskAccount(account)
      toast({
        title: "Wallet connected!",
        description: `Connected to ${account?.address.slice(0, 6)}...${account?.address.slice(-4)}`,
      })
    } catch (error: any) {
      toast({
        title: "Connection failed",
        description: error.message || "Failed to connect to MetaMask",
        variant: "destructive",
      })
    } finally {
      setIsConnectingWallet(false)
    }
  }

  const handleCryptoPayment = async () => {
    if (!metaMaskAccount) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your MetaMask wallet first",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const ethAmount = metaMaskService.convertUsdToEth(total)
      const merchantAddress = "0x742d35Cc6634C0532925a3b8D0C9C0E3C5d5c8E9"
      const transactionHash = await metaMaskService.sendTransaction(merchantAddress, ethAmount.toString())
      setCryptoTransactionHash(transactionHash)

      const orderId = await createOrder(shippingForm, {
        type: "crypto",
        transactionHash: transactionHash,
        ethAmount: ethAmount.toString(),
        walletAddress: metaMaskAccount.address,
      })

      toast({
        title: "Payment successful!",
        description: `Your crypto payment has been processed. Order #${orderId}`,
      })

      router.push(`/order-confirmation/${orderId}`)
    } catch (error: any) {
      toast({
        title: "Payment failed",
        description: error.message || "Failed to process crypto payment",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate shipping form
    if (
      !shippingForm.name ||
      !shippingForm.address ||
      !shippingForm.city ||
      !shippingForm.state ||
      !shippingForm.zipCode
    ) {
      setError("Please fill in all shipping information")
      return
    }

    if (paymentMethod === "crypto") {
      await handleCryptoPayment()
      return
    }

    // Validate payment form
    if (paymentMethod === "card") {
      if (!paymentForm.cardNumber || !paymentForm.expiryDate || !paymentForm.cvv || !paymentForm.cardName) {
        setError("Please fill in all payment information")
        return
      }
    }

    setLoading(true)

    try {
      const orderId = await createOrder(shippingForm, {
        type: paymentMethod as "card" | "paypal",
        last4: paymentMethod === "card" ? paymentForm.cardNumber.slice(-4) : undefined,
      })

      toast({
        title: "Order placed successfully!",
        description: `Your order #${orderId} has been confirmed.`,
      })

      router.push(`/order-confirmation/${orderId}`)
    } catch (err) {
      setError("Failed to place order. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    router.push("/cart")
    return null
  }

  const ethAmount = metaMaskService.convertUsdToEth(total)

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Header />

        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Checkout</h1>
            <p className="text-muted-foreground">Complete your sustainable purchase</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Checkout Form */}
              <div className="lg:col-span-2 space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Shipping Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5" />
                      Shipping Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={shippingForm.name}
                          onChange={(e) => setShippingForm({ ...shippingForm, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">Country *</Label>
                        <Select
                          value={shippingForm.country}
                          onValueChange={(value) => setShippingForm({ ...shippingForm, country: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="US">United States</SelectItem>
                            <SelectItem value="CA">Canada</SelectItem>
                            <SelectItem value="UK">United Kingdom</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address *</Label>
                      <Input
                        id="address"
                        value={shippingForm.address}
                        onChange={(e) => setShippingForm({ ...shippingForm, address: e.target.value })}
                        required
                      />
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={shippingForm.city}
                          onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State *</Label>
                        <Input
                          id="state"
                          value={shippingForm.state}
                          onChange={(e) => setShippingForm({ ...shippingForm, state: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zipCode">ZIP Code *</Label>
                        <Input
                          id="zipCode"
                          value={shippingForm.zipCode}
                          onChange={(e) => setShippingForm({ ...shippingForm, zipCode: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Payment Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card">Credit/Debit Card</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="paypal" id="paypal" />
                        <Label htmlFor="paypal">PayPal</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="crypto" id="crypto" />
                        <Label htmlFor="crypto" className="flex items-center gap-2">
                          <Wallet className="h-4 w-4" />
                          Cryptocurrency (ETH)
                          <Badge variant="secondary" className="text-xs">
                            New
                          </Badge>
                        </Label>
                      </div>
                    </RadioGroup>

                    {paymentMethod === "card" && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="cardName">Name on Card *</Label>
                          <Input
                            id="cardName"
                            value={paymentForm.cardName}
                            onChange={(e) => setPaymentForm({ ...paymentForm, cardName: e.target.value })}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="cardNumber">Card Number *</Label>
                          <Input
                            id="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            value={paymentForm.cardNumber}
                            onChange={(e) => setPaymentForm({ ...paymentForm, cardNumber: e.target.value })}
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="expiryDate">Expiry Date *</Label>
                            <Input
                              id="expiryDate"
                              placeholder="MM/YY"
                              value={paymentForm.expiryDate}
                              onChange={(e) => setPaymentForm({ ...paymentForm, expiryDate: e.target.value })}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cvv">CVV *</Label>
                            <Input
                              id="cvv"
                              placeholder="123"
                              value={paymentForm.cvv}
                              onChange={(e) => setPaymentForm({ ...paymentForm, cvv: e.target.value })}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {paymentMethod === "paypal" && (
                      <div className="p-4 bg-muted/30 rounded-lg text-center">
                        <p className="text-sm text-muted-foreground">
                          You will be redirected to PayPal to complete your payment.
                        </p>
                      </div>
                    )}

                    {paymentMethod === "crypto" && (
                      <div className="space-y-4">
                        <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                          <div className="flex items-center gap-2 mb-3">
                            <Wallet className="h-5 w-5 text-primary" />
                            <span className="font-medium">Pay with Ethereum</span>
                          </div>

                          {!metaMaskAccount ? (
                            <div className="space-y-3">
                              <p className="text-sm text-muted-foreground">
                                Connect your MetaMask wallet to pay with cryptocurrency
                              </p>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={connectMetaMask}
                                disabled={isConnectingWallet}
                                className="w-full bg-transparent"
                              >
                                {isConnectingWallet ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Connecting...
                                  </>
                                ) : (
                                  <>
                                    <Wallet className="mr-2 h-4 w-4" />
                                    Connect MetaMask
                                  </>
                                )}
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <span className="text-sm font-medium">Wallet Connected</span>
                              </div>
                              <div className="text-sm space-y-1">
                                <p>
                                  <strong>Address:</strong> {metaMaskAccount.address.slice(0, 6)}...
                                  {metaMaskAccount.address.slice(-4)}
                                </p>
                                <p>
                                  <strong>Balance:</strong> {metaMaskAccount.balance} ETH
                                </p>
                                <p>
                                  <strong>Payment Amount:</strong> {ethAmount.toFixed(6)} ETH (≈ ${total.toFixed(2)}{" "}
                                  USD)
                                </p>
                              </div>

                              {Number.parseFloat(metaMaskAccount.balance) < ethAmount && (
                                <Alert variant="destructive">
                                  <AlertDescription>
                                    Insufficient ETH balance. You need {ethAmount.toFixed(6)} ETH but only have{" "}
                                    {metaMaskAccount.balance} ETH.
                                  </AlertDescription>
                                </Alert>
                              )}

                              {cryptoTransactionHash && (
                                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                  <div className="flex items-center gap-2 mb-2">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <span className="text-sm font-medium text-green-800">Transaction Submitted</span>
                                  </div>
                                  <p className="text-xs text-green-700">
                                    Hash: {cryptoTransactionHash.slice(0, 10)}...{cryptoTransactionHash.slice(-8)}
                                  </p>
                                  <Button
                                    type="button"
                                    variant="link"
                                    size="sm"
                                    className="h-auto p-0 text-green-700"
                                    onClick={() =>
                                      window.open(`https://etherscan.io/tx/${cryptoTransactionHash}`, "_blank")
                                    }
                                  >
                                    View on Etherscan <ExternalLink className="ml-1 h-3 w-3" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="text-xs text-muted-foreground">
                          <p>• Payments are processed on the Ethereum network</p>
                          <p>• Transaction fees (gas) will be added by your wallet</p>
                          <p>• Transactions are irreversible once confirmed</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Order Items */}
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div key={item.id} className="flex gap-3">
                          <img
                            src={item.product.images[0] || "/placeholder.svg"}
                            alt={item.product.title}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{item.product.title}</p>
                            <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                          </div>
                          <div className="text-sm font-medium">${(item.product.price * item.quantity).toFixed(2)}</div>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    {/* Pricing */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal ({getTotalItems()} items)</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span>Shipping</span>
                        <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span>Tax</span>
                        <span>${tax.toFixed(2)}</span>
                      </div>

                      <Separator />

                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <div className="text-right">
                          <div>${total.toFixed(2)}</div>
                          {paymentMethod === "crypto" && (
                            <div className="text-sm font-normal text-muted-foreground">
                              ≈ {ethAmount.toFixed(6)} ETH
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={
                        loading ||
                        (paymentMethod === "crypto" &&
                          (!metaMaskAccount || Number.parseFloat(metaMaskAccount.balance) < ethAmount))
                      }
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : paymentMethod === "crypto" ? (
                        <>
                          <Wallet className="mr-2 h-5 w-5" />
                          Pay with Crypto
                        </>
                      ) : (
                        <>
                          <Shield className="mr-2 h-5 w-5" />
                          Place Order
                        </>
                      )}
                    </Button>

                    <div className="text-xs text-muted-foreground text-center">
                      {paymentMethod === "crypto"
                        ? "Your crypto payment is secured by blockchain technology"
                        : "Your payment information is secure and encrypted"}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </main>
      </div>
    </ProtectedRoute>
  )
}
