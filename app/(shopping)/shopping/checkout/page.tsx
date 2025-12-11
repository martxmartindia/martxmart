"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, CreditCard, Truck, Shield, MapPin, Plus, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { CouponInput } from "@/components/shopping/CouponInput"
import { useShopping } from "@/store/shopping"

interface CartItem {
  id: string
  quantity: number
  price: number
  shopping: {
    id: string
    name: string
    images: string[]
    brand?: string
  }
}

interface Address {
  id: string
  type: string
  contactName: string
  phone: string
  email: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  zip: string
}

interface CartData {
  cart: {
    id: string
    shoppingItems: CartItem[]
  }
  summary: {
    itemCount: number
    subtotal: number
    originalTotal: number
    savings: number
  }
}

export default function CheckoutPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [cartData, setCartData] = useState<CartData | null>(null)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddress, setSelectedAddress] = useState<string>("")
  const [paymentMethod, setPaymentMethod] = useState<string>("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [showNewAddressForm, setShowNewAddressForm] = useState(false)
  const [orderNotes, setOrderNotes] = useState("")
  const { appliedCoupon, applyCoupon, removeCoupon } = useShopping()
  const [newAddress, setNewAddress] = useState({
    type: "DISPATCH",
    contactName: "",
    phone: "",
    email: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zip: "",
  })

  useEffect(() => {
    fetchCartData()
    fetchAddresses()
  }, [])

  const fetchCartData = async () => {
    try {
      const response = await fetch("/api/shopping/cart", {
        credentials: "include"
      })

      if (response.ok) {
        const data = await response.json()
        setCartData(data)
      } else if (response.status === 401) {
        router.push("/auth/login")
      }
    } catch (error) {
      console.error("Error fetching cart:", error)
    }
  }

  const fetchAddresses = async () => {
    try {
      const response = await fetch("/api/shopping/addresses", {
        credentials: "include"
      })

      if (response.ok) {
        const data = await response.json()
        setAddresses(data.addresses)
      }
    } catch (error) {
      console.error("Error fetching addresses:", error)
    }
  }

  const saveAddress = async () => {
    try {
      const response = await fetch("/api/shopping/addresses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(newAddress),
      })

      if (response.ok) {
        const savedAddress = await response.json()
        setAddresses((prev) => [...prev, savedAddress])
        setSelectedAddress(savedAddress.id)
        setShowNewAddressForm(false)
        setNewAddress({
          type: "DISPATCH",
          contactName: "",
          phone: "",
          email: "",
          addressLine1: "",
          addressLine2: "",
          city: "",
          state: "",
          zip: "",
        })
      }
    } catch (error) {
      console.error("Error saving address:", error)
    }
  }

  const handlePlaceOrder = async () => {
    if (!selectedAddress || !paymentMethod) return

    setIsProcessing(true)

    try {
      const response = await fetch("/api/shopping/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shippingAddressId: selectedAddress,
          billingAddressId: selectedAddress,
          paymentMethod,
          notes: orderNotes,
          couponCode: appliedCoupon?.code,
          discountAmount: appliedCoupon?.discountAmount || 0,
        }),
      })

      if (response.ok) {
        const data = await response.json()

        if (paymentMethod === "RAZORPAY" && data.razorpayOrderId) {
          // Initialize Razorpay payment
          const options = {
            key: data.razorpayKeyId,
            amount: Math.round(total * 100),
            currency: "INR",
            name: "martXmart Privated Limited",
            description: `Order #${data.order.orderNumber}`,
            order_id: data.razorpayOrderId,
            handler: async (response: any) => {
              // Verify payment
              const verifyResponse = await fetch("/api/shopping/payment/verify", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  orderId: data.order.id,
                }),
              })

              if (verifyResponse.ok) {
                router.push(`/shopping/order-confirmation/${data.order.id}`)
              }
            },
            prefill: {
              name: addresses.find((a) => a.id === selectedAddress)?.contactName,
              email: addresses.find((a) => a.id === selectedAddress)?.email,
              contact: addresses.find((a) => a.id === selectedAddress)?.phone,
            },
          }

          const razorpay = new (window as any).Razorpay(options)
          razorpay.open()
        } else {
          // COD order
          router.push(`/shopping/order-confirmation/${data.order.id}`)
        }
      }
    } catch (error) {
      console.error("Error placing order:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  if (!cartData) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      </div>
    )
  }

  const deliveryCharges = cartData.summary.subtotal > 999 ? 0 : 99
  const codCharges = paymentMethod === "COD" ? 49 : 0
  const subtotalWithCharges = cartData.summary.subtotal + deliveryCharges + codCharges
  const discountAmount = appliedCoupon?.discountAmount || 0
  const total = Math.max(0, subtotalWithCharges - discountAmount)

  const steps = [
    { id: 1, title: "Address", icon: MapPin },
    { id: 2, title: "Payment", icon: CreditCard },
    { id: 3, title: "Review", icon: Shield },
  ]

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
              currentStep >= step.id ? "bg-orange-500 border-orange-500 text-white" : "border-gray-300 text-gray-400"
            }`}
          >
            <step.icon className="h-5 w-5" />
          </div>
          <span className={`ml-2 text-sm font-medium ${currentStep >= step.id ? "text-orange-600" : "text-gray-400"}`}>
            {step.title}
          </span>
          {index < steps.length - 1 && (
            <div className={`w-16 h-0.5 mx-4 ${currentStep > step.id ? "bg-orange-500" : "bg-gray-300"}`} />
          )}
        </div>
      ))}
    </div>
  )

  const renderAddressStep = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Select Delivery Address</h2>
        <Button variant="outline" onClick={() => setShowNewAddressForm(!showNewAddressForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Address
        </Button>
      </div>

      {showNewAddressForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Address Type</Label>
                <Select
                  value={newAddress.type}
                  onValueChange={(value) => setNewAddress({ ...newAddress, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BILLING">Billing</SelectItem>
                    <SelectItem value="DISPATCH">Dispatch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="contactName">Full Name</Label>
                <Input
                  id="contactName"
                  value={newAddress.contactName}
                  onChange={(e) => setNewAddress({ ...newAddress, contactName: e.target.value })}
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={newAddress.phone}
                  onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                  placeholder="+91 9876543210"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newAddress.email}
                  onChange={(e) => setNewAddress({ ...newAddress, email: e.target.value })}
                  placeholder="john@example.com"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="addressLine1">Address Line 1</Label>
                <Input
                  id="addressLine1"
                  value={newAddress.addressLine1}
                  onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })}
                  placeholder="House/Flat/Office No, Building Name"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
                <Input
                  id="addressLine2"
                  value={newAddress.addressLine2}
                  onChange={(e) => setNewAddress({ ...newAddress, addressLine2: e.target.value })}
                  placeholder="Area, Landmark"
                />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={newAddress.city}
                  onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                  placeholder="Mumbai"
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Select
                  value={newAddress.state}
                  onValueChange={(value) => setNewAddress({ ...newAddress, state: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maharashtra">Maharashtra</SelectItem>
                    <SelectItem value="delhi">Delhi</SelectItem>
                    <SelectItem value="karnataka">Karnataka</SelectItem>
                    <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                    <SelectItem value="gujarat">Gujarat</SelectItem>
                    <SelectItem value="rajasthan">Rajasthan</SelectItem>
                    <SelectItem value="west-bengal">West Bengal</SelectItem>
                    <SelectItem value="uttar-pradesh">Uttar Pradesh</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="zip">PIN Code</Label>
                <Input
                  id="zip"
                  value={newAddress.zip}
                  onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })}
                  placeholder="400001"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={saveAddress}>Save Address</Button>
              <Button variant="outline" onClick={() => setShowNewAddressForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {addresses.map((address) => (
          <Card
            key={address.id}
            className={`cursor-pointer transition-all ${
              selectedAddress === address.id ? "ring-2 ring-orange-500 border-orange-500" : "hover:shadow-md"
            }`}
            onClick={() => setSelectedAddress(address.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <Checkbox checked={selectedAddress === address.id} onChange={() => setSelectedAddress(address.id)} />
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">{address.contactName}</span>
                      <Badge variant="outline">{address.type}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {address.addressLine1}
                      {address.addressLine2 && `, ${address.addressLine2}`}
                    </p>
                    <p className="text-sm text-gray-600">
                      {address.city}, {address.state} - {address.zip}
                    </p>
                    <p className="text-sm text-gray-600">{address.phone}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button
        onClick={() => setCurrentStep(2)}
        disabled={!selectedAddress}
        className="w-full bg-orange-500 hover:bg-orange-600"
      >
        Continue to Payment
      </Button>
    </div>
  )

  const renderPaymentStep = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Select Payment Method</h2>

      <div className="grid gap-4">
        <Card
          className={`cursor-pointer transition-all ${
            paymentMethod === "RAZORPAY" ? "ring-2 ring-orange-500 border-orange-500" : "hover:shadow-md"
          }`}
          onClick={() => setPaymentMethod("RAZORPAY")}
        >
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Checkbox checked={paymentMethod === "RAZORPAY"} onChange={() => setPaymentMethod("RAZORPAY")} />
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold">Credit/Debit Card, UPI, Net Banking</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Pay securely using Razorpay. Supports all major cards, UPI, and net banking.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all ${
            paymentMethod === "COD" ? "ring-2 ring-orange-500 border-orange-500" : "hover:shadow-md"
          }`}
          onClick={() => setPaymentMethod("COD")}
        >
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Checkbox checked={paymentMethod === "COD"} onChange={() => setPaymentMethod("COD")} />
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <Truck className="h-5 w-5 text-green-600" />
                  <span className="font-semibold">Cash on Delivery</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Pay when your order is delivered. Additional ₹49 COD charges apply.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <Label htmlFor="notes">Order Notes (Optional)</Label>
        <Textarea
          id="notes"
          value={orderNotes}
          onChange={(e) => setOrderNotes(e.target.value)}
          placeholder="Any special instructions for delivery..."
          className="mt-1"
        />
      </div>

      <div className="flex gap-4">
        <Button variant="outline" onClick={() => setCurrentStep(1)} className="flex-1">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Address
        </Button>
        <Button
          onClick={() => setCurrentStep(3)}
          disabled={!paymentMethod}
          className="flex-1 bg-orange-500 hover:bg-orange-600"
        >
          Review Order
        </Button>
      </div>
    </div>
  )

  const renderReviewStep = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Review Your Order</h2>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {cartData.cart.shoppingItems.map((item) => (
            <div key={item.id} className="flex items-center space-x-4">
              <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={item.shopping.images[0] || "/placeholder.svg?height=64&width=64"}
                  alt={item.shopping.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{item.shopping.name}</h4>
                {item.shopping.brand && <p className="text-sm text-gray-600">{item.shopping.brand}</p>}
                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">₹{Number(item.price) * item.quantity}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Delivery Address */}
      <Card>
        <CardHeader>
          <CardTitle>Delivery Address</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedAddress && (
            <div className="space-y-2">
              {(() => {
                const address = addresses.find((a) => a.id === selectedAddress)
                return address ? (
                  <>
                    <p className="font-semibold">{address.contactName}</p>
                    <p className="text-gray-600">
                      {address.addressLine1}
                      {address.addressLine2 && `, ${address.addressLine2}`}
                    </p>
                    <p className="text-gray-600">
                      {address.city}, {address.state} - {address.zip}
                    </p>
                    <p className="text-gray-600">{address.phone}</p>
                  </>
                ) : null
              })()}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            {paymentMethod === "RAZORPAY" ? (
              <>
                <CreditCard className="h-5 w-5 text-blue-600" />
                <span>Credit/Debit Card, UPI, Net Banking</span>
              </>
            ) : (
              <>
                <Truck className="h-5 w-5 text-green-600" />
                <span>Cash on Delivery</span>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button variant="outline" onClick={() => setCurrentStep(2)} className="flex-1">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Payment
        </Button>
        <Button onClick={handlePlaceOrder} disabled={isProcessing} className="flex-1 bg-orange-500 hover:bg-orange-600">
          {isProcessing ? "Processing..." : `Place Order - ₹${total}`}
        </Button>
      </div>
    </div>
  )

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {renderStepIndicator()}

            {currentStep === 1 && renderAddressStep()}
            {currentStep === 2 && renderPaymentStep()}
            {currentStep === 3 && renderReviewStep()}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal ({cartData.summary.itemCount} items)</span>
                    <span>₹{cartData.summary.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Total Savings</span>
                    <span>-₹{cartData.summary.savings}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Charges</span>
                    <span className={deliveryCharges === 0 ? "text-green-600" : ""}>
                      {deliveryCharges === 0 ? "FREE" : `₹${deliveryCharges}`}
                    </span>
                  </div>
                  {paymentMethod === "COD" && (
                    <div className="flex justify-between">
                      <span>COD Charges</span>
                      <span>₹{codCharges}</span>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Coupon Section */}
                <div className="space-y-3">
                  <h4 className="font-medium">Apply Coupon</h4>
                  <CouponInput
                    cartTotal={subtotalWithCharges}
                    onCouponApply={applyCoupon}
                    onCouponRemove={removeCoupon}
                    appliedCoupon={appliedCoupon}
                  />
                </div>

                {appliedCoupon && (
                  <>
                    <Separator />
                    <div className="flex justify-between text-green-600">
                      <span>Coupon Discount</span>
                      <span>-₹{discountAmount.toFixed(2)}</span>
                    </div>
                  </>
                )}

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>

                <div className="bg-green-50 p-3 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-1">Order Protection</h4>
                  <ul className="text-xs text-green-700 space-y-1">
                    <li>• 100% Secure Payment</li>
                    <li>• 7 Days Easy Return</li>
                    <li>• Authentic Products Guaranteed</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
