"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useCart } from "@/store/cart"
import { useAuth } from "@/store/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  CheckCircle, CreditCard, MapPin, Package, Loader2, ArrowLeft, ArrowRight, 
  Plus, Edit, Trash2, Shield, Truck, Clock, Phone, Mail, User, Home
} from "lucide-react"
import Image from "next/image"

const addressSchema = z.object({
  contactName: z.string().min(2, "Contact name is required"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string().email("Invalid email address").optional(),
  addressLine1: z.string().min(5, "Address is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zip: z.string().length(6, "ZIP code must be exactly 6 digits"),
  type: z.enum(["BILLING", "DISPATCH"]),
})

const validatePincode = async (pincode: string) => {
  const response = await fetch(`/api/kyc/verify/pincode?pincode=${pincode}`)
  if (!response.ok) throw new Error('Invalid pincode')
  return await response.json()
}

type CheckoutStep = 'address' | 'payment' | 'success'
type AddressFormData = z.infer<typeof addressSchema>

interface Address {
  id: string
  contactName: string
  phone: string
  email?: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  zip: string
  type: "BILLING" | "DISPATCH"
}

declare global {
  interface Window {
    Razorpay: any
  }
}

export default function CheckoutPage() {
  const { items, totalPrice, appliedCoupon, clearCart, applyCoupon: applyCartCoupon, removeCoupon: removeCartCoupon } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('address')
  const [loading, setLoading] = useState(false)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedShippingAddress, setSelectedShippingAddress] = useState<Address | null>(null)
  const [selectedBillingAddress, setSelectedBillingAddress] = useState<Address | null>(null)
  const [sameAsShipping, setSameAsShipping] = useState(true)
  const [paymentMethod, setPaymentMethod] = useState('RAZORPAY')
  const [orderId, setOrderId] = useState<string | null>(null)
  const [orderNumber, setOrderNumber] = useState<string | null>(null)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [orderNotes, setOrderNotes] = useState("")
  const [couponCode, setCouponCode] = useState("")
  const [couponLoading, setCouponLoading] = useState(false)
  const [pincodeValidating, setPincodeValidating] = useState(false)

  const addressForm = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      contactName: user?.name || "",
      phone: "",
      email: user?.email || "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      zip: "",
      type: "DISPATCH",
    },
  })

  useEffect(() => {
    if (!user) {
      router.push("/auth/login?redirect=/checkout")
      return
    }
    if (items.length === 0) {
      router.push("/cart")
      return
    }
    fetchAddresses()
    loadRazorpayScript()
  }, [user, items, router])

  const fetchAddresses = async () => {
    try {
      const response = await fetch('/api/account/address')
      if (response.ok) {
        const data = await response.json()
        setAddresses(data.addresses || [])
      }
    } catch (error) {
      console.error('Failed to fetch addresses:', error)
    }
  }

  const loadRazorpayScript = () => {
    if (window.Razorpay) return
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)
  }

  const calculateTotals = () => {
    const subtotal = totalPrice
    const discount = appliedCoupon?.discountAmount || 0
    const tax = (subtotal - discount) * 0.18
    const shipping = subtotal > 500 ? 0 : 50
    const total = subtotal - discount + tax + shipping
    return { subtotal, discount, tax, shipping, total }
  }

  const { subtotal, discount, tax, shipping, total } = calculateTotals()

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code')
      return
    }
    
    setCouponLoading(true)
    try {
      await applyCartCoupon(couponCode)
      setCouponCode('')
    } catch (error) {
      // Error handling is done in the cart store
    } finally {
      setCouponLoading(false)
    }
  }

  const removeCoupon = () => {
    // Remove coupon through cart store
    toast.success('Coupon removed')
  }

  const handlePincodeValidation = async (pincode: string) => {
    if (pincode.length === 6) {
      setPincodeValidating(true)
      try {
        const data = await validatePincode(pincode)
        if (data.data?.district) addressForm.setValue('city', data.data.district || '')
        if (data.data?.state) addressForm.setValue('state', data.data.state || '')
        toast.success('Pincode validated successfully')
      } catch (error) {
        toast.error('Invalid pincode')
      } finally {
        setPincodeValidating(false)
      }
    }
  }

  const handleAddressSubmit = async (values: AddressFormData) => {
    setLoading(true)
    try {
      const url = editingAddress ? `/api/account/address/${editingAddress.id}` : '/api/account/address'
      const method = editingAddress ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      })

      if (!response.ok) throw new Error('Failed to save address')
      
      await fetchAddresses()
      setShowAddressForm(false)
      setEditingAddress(null)
      addressForm.reset()
      toast.success(editingAddress ? 'Address updated' : 'Address added')
    } catch (error: any) {
      toast.error(error.message || 'Failed to save address')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAddress = async (addressId: string) => {
    try {
      const response = await fetch(`/api/account/address/${addressId}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) throw new Error('Failed to delete address')
      
      await fetchAddresses()
      toast.success('Address deleted')
    } catch (error) {
      toast.error('Failed to delete address')
    }
  }

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address)
    addressForm.reset(address)
    setShowAddressForm(true)
  }

  const proceedToPayment = () => {
    if (!selectedShippingAddress) {
      toast.error('Please select a shipping address')
      return
    }
    if (!sameAsShipping && !selectedBillingAddress) {
      toast.error('Please select a billing address')
      return
    }
    setCurrentStep('payment')
  }

  const createOrder = async () => {
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddressId: selectedShippingAddress?.id,
        billingAddressId: sameAsShipping ? selectedShippingAddress?.id : selectedBillingAddress?.id,
        paymentMethod,
        totalAmount: total,
        notes: orderNotes,
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to create order')
    }
    return await response.json()
  }

  const handlePayment = async () => {
    if (!selectedShippingAddress) return
    
    setLoading(true)
    try {
      const order = await createOrder()
      setOrderId(order.orderId)
      setOrderNumber(order.orderNumber)
      
      if (paymentMethod === 'RAZORPAY') {
        await processRazorpayPayment(order)
      } else {
        // COD - Order is already created, just show success
        setCurrentStep('success')
        await clearCart()
        toast.success('Order placed successfully!')
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to process order')
    } finally {
      setLoading(false)
    }
  }

  const processRazorpayPayment = async (order: any) => {
    if (!window.Razorpay) {
      toast.error('Payment gateway not loaded')
      return
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: Math.round(order.amount * 100),
      currency: 'INR',
      name: 'martXmart',
      description: `Payment for Order #${order.orderNumber}`,
      order_id: order.razorpayOrderId,
      handler: async (response: any) => {
        try {
          const verifyResponse = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId: order.orderId,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature
            })
          })
          
          if (verifyResponse.ok) {
            setCurrentStep('success')
            await clearCart()
            toast.success('Payment successful!')
          } else {
            throw new Error('Payment verification failed')
          }
        } catch (error) {
          toast.error('Payment verification failed')
        }
      },
      prefill: {
        name: selectedShippingAddress?.contactName,
        email: selectedShippingAddress?.email,
        contact: selectedShippingAddress?.phone
      },
      theme: { color: '#ea580c' },
      modal: {
        ondismiss: () => {
          setLoading(false)
          toast.info('Payment cancelled')
        }
      }
    }
    
    const rzp = new window.Razorpay(options)
    rzp.open()
  }

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[
        {step: 'address', icon: MapPin, label: 'Address'}, 
        {step: 'payment', icon: CreditCard, label: 'Payment'}, 
        {step: 'success', icon: CheckCircle, label: 'Success'}
      ].map((item, index) => (
        <div key={item.step} className="flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            currentStep === item.step ? 'bg-orange-600 text-white' : 
            ['address', 'payment', 'success'].indexOf(currentStep) > index ? 'bg-green-600 text-white' : 'bg-gray-200'
          }`}>
            <item.icon className="w-5 h-5" />
          </div>
          <span className="ml-2 text-sm font-medium">{item.label}</span>
          {index < 2 && <div className="w-16 h-0.5 bg-gray-200 mx-4" />}
        </div>
      ))}
    </div>
  )

  const OrderSummary = () => (
    <Card className="h-fit sticky top-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5" />
          Order Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="max-h-60 overflow-y-auto space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0">
                {item.image && (
                  <Image src={item.image} alt={item.name} width={64} height={64} className="w-full h-full object-cover rounded-lg" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium truncate">{item.name}</h4>
                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                <p className="text-sm font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
        
        <Separator />
        
        {/* Coupon Section */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              className="flex-1"
            />
            <Button 
              onClick={applyCoupon} 
              disabled={couponLoading || !couponCode.trim()}
              variant="outline"
              size="sm"
            >
              {couponLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
            </Button>
          </div>
          
          {appliedCoupon && (
            <div className="flex items-center justify-between p-2 bg-green-50 rounded border border-green-200">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {appliedCoupon.code}
                </Badge>
                <span className="text-sm text-green-700">
                  {appliedCoupon.discount}% off
                </span>
              </div>
              <Button 
                onClick={removeCoupon} 
                variant="ghost" 
                size="sm"
                className="h-auto p-1 text-green-700 hover:text-green-900"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
        
        <Separator />
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal ({items.length} items)</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          
          {discount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount ({appliedCoupon?.code})</span>
              <span>-₹{discount.toFixed(2)}</span>
            </div>
          )}
          
          <div className="flex justify-between text-sm">
            <span>Tax (GST 18%)</span>
            <span>₹{tax.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="flex items-center gap-1">
              <Truck className="w-4 h-4" />
              Shipping
            </span>
            <span>{shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}</span>
          </div>
        </div>
        
        <Separator />
        
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
        
        <div className="text-xs text-gray-500 space-y-1">
          <div className="flex items-center gap-1">
            <Shield className="w-3 h-3" />
            <span>Secure checkout with SSL encryption</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Estimated delivery: 3-5 business days</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const AddressCard = ({ address, isSelected, onSelect, onEdit, onDelete }: {
    address: Address
    isSelected: boolean
    onSelect: () => void
    onEdit: () => void
    onDelete: () => void
  }) => (
    <div className={`border rounded-lg p-4 cursor-pointer transition-all ${
      isSelected ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'
    }`} onClick={onSelect}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className={`w-4 h-4 rounded-full border-2 mt-1 ${
            isSelected ? 'border-orange-500 bg-orange-500' : 'border-gray-300'
          }`}>
            {isSelected && <div className="w-2 h-2 bg-white rounded-full m-0.5" />}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <User className="w-4 h-4 text-gray-500" />
              <span className="font-medium">{address.contactName}</span>
              <Badge variant="outline" className="text-xs">
                {address.type === 'DISPATCH' ? 'Shipping' : 'Billing'}
              </Badge>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <div className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                <span>{address.addressLine1}</span>
              </div>
              {address.addressLine2 && (
                <div className="ml-6">{address.addressLine2}</div>
              )}
              <div className="ml-6">{address.city}, {address.state} - {address.zip}</div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>{address.phone}</span>
              </div>
              {address.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{address.email}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onEdit() }}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onDelete() }}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )

  if (currentStep === 'address') {
    return (
      <div className="container mx-auto py-8 max-w-6xl">
        <StepIndicator />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Truck className="w-5 h-5" />
                    Shipping Address
                  </div>
                  <Button variant="outline" size="sm" onClick={() => {
                    setEditingAddress(null)
                    addressForm.reset({ type: "DISPATCH" })
                    setShowAddressForm(true)
                  }}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add New
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {addresses.filter(addr => addr.type === 'DISPATCH').length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Home className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No shipping addresses found</p>
                    <p className="text-sm">Add a new address to continue</p>
                  </div>
                ) : (
                  addresses.filter(addr => addr.type === 'DISPATCH').map((address) => (
                    <AddressCard
                      key={address.id}
                      address={address}
                      isSelected={selectedShippingAddress?.id === address.id}
                      onSelect={() => setSelectedShippingAddress(address)}
                      onEdit={() => handleEditAddress(address)}
                      onDelete={() => handleDeleteAddress(address.id)}
                    />
                  ))
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Billing Address
                  </div>
                  <Button variant="outline" size="sm" onClick={() => {
                    setEditingAddress(null)
                    addressForm.reset({ type: "BILLING" })
                    setShowAddressForm(true)
                  }}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add New
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="sameAsShipping" 
                    checked={sameAsShipping}
                    onCheckedChange={(checked) => setSameAsShipping(checked as boolean)}
                  />
                  <label htmlFor="sameAsShipping" className="text-sm font-medium">
                    Same as shipping address
                  </label>
                </div>
                
                {!sameAsShipping && (
                  <>
                    {addresses.filter(addr => addr.type === 'BILLING').length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>No billing addresses found</p>
                        <p className="text-sm">Add a new address to continue</p>
                      </div>
                    ) : (
                      addresses.filter(addr => addr.type === 'BILLING').map((address) => (
                        <AddressCard
                          key={address.id}
                          address={address}
                          isSelected={selectedBillingAddress?.id === address.id}
                          onSelect={() => setSelectedBillingAddress(address)}
                          onEdit={() => handleEditAddress(address)}
                          onDelete={() => handleDeleteAddress(address.id)}
                        />
                      ))
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            {showAddressForm && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {editingAddress ? 'Edit Address' : 'Add New Address'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...addressForm}>
                    <form onSubmit={addressForm.handleSubmit(handleAddressSubmit)} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField control={addressForm.control} name="contactName" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Name</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={addressForm.control} name="phone" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>
                      
                      <FormField control={addressForm.control} name="email" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email (Optional)</FormLabel>
                          <FormControl><Input type="email" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      
                      <FormField control={addressForm.control} name="addressLine1" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address Line 1</FormLabel>
                          <FormControl><Textarea {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      
                      <FormField control={addressForm.control} name="addressLine2" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address Line 2 (Optional)</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField control={addressForm.control} name="city" render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={addressForm.control} name="state" render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                        )} />
                        <FormField control={addressForm.control} name="zip" render={({ field }) => (
                          <FormItem>
                            <FormLabel>ZIP Code</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input 
                                  {...field} 
                                  onChange={(e) => {
                                    field.onChange(e)
                                    handlePincodeValidation(e.target.value)
                                  }}
                                />
                                {pincodeValidating && (
                                  <Loader2 className="absolute right-3 top-3 w-4 h-4 animate-spin" />
                                )}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>
                      
                      <FormField control={addressForm.control} name="type" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select address type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="DISPATCH">Shipping</SelectItem>
                              <SelectItem value="BILLING">Billing</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                      
                      <div className="flex gap-4">
                        <Button type="button" variant="outline" onClick={() => {
                          setShowAddressForm(false)
                          setEditingAddress(null)
                          addressForm.reset()
                        }}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                          {loading ? <Loader2 className="mr-2 w-4 h-4 animate-spin" /> : null}
                          {editingAddress ? 'Update Address' : 'Save Address'}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-end">
              <Button onClick={proceedToPayment} size="lg" className="px-8">
                Continue to Payment <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <OrderSummary />
        </div>
      </div>
    )
  }

  if (currentStep === 'payment') {
    return (
      <div className="container mx-auto py-8 max-w-6xl">
        <StepIndicator />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value="RAZORPAY" id="razorpay" />
                      <div className="flex-1">
                        <label htmlFor="razorpay" className="font-medium cursor-pointer">Razorpay</label>
                        <p className="text-sm text-gray-600">Pay securely with cards, UPI, wallets & more</p>
                        <div className="flex gap-2 mt-2">
                          <Image src="/payment-icons/visa.png" alt="Visa" width={32} height={20} className="h-5 w-auto" />
                          <Image src="/payment-icons/mastercard.png" alt="Mastercard" width={32} height={20} className="h-5 w-auto" />
                          <Image src="/payment-icons/googlepay.png" alt="Google Pay" width={32} height={20} className="h-5 w-auto" />
                        </div>
                      </div>
                      <Badge className="bg-blue-600">Recommended</Badge>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value="COD" id="cod" />
                      <div className="flex-1">
                        <label htmlFor="cod" className="font-medium cursor-pointer">Cash on Delivery</label>
                        <p className="text-sm text-gray-600">Pay when you receive your order</p>
                      </div>
                      <Image src="/payment-icons/cash.png" alt="Cash" width={32} height={20} className="h-5 w-auto" />
                    </div>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Order Notes (Optional)</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea 
                  placeholder="Any special instructions for your order..."
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  rows={3}
                />
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setCurrentStep('address')} size="lg">
                <ArrowLeft className="mr-2 w-4 h-4" /> Back to Address
              </Button>
              <Button onClick={handlePayment} disabled={loading} size="lg" className="flex-1">
                {loading ? <Loader2 className="mr-2 w-4 h-4 animate-spin" /> : null}
                {paymentMethod === 'RAZORPAY' ? 'Pay Now' : 'Place Order'} - ₹{total.toFixed(2)}
              </Button>
            </div>
          </div>
          
          <OrderSummary />
        </div>
      </div>
    )
  }

  if (currentStep === 'success') {
    return (
      <div className="container mx-auto py-16 max-w-2xl text-center">
        <div className="bg-green-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Order Placed Successfully!</h1>
        <p className="text-gray-600 mb-6">Thank you for your purchase. Your order has been confirmed and is being processed.</p>
        
        {orderId && (
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div>
                <p className="text-sm text-gray-600">Order Number</p>
                <p className="font-mono font-medium">{orderNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="font-medium">₹{total.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Payment Method</p>
                <p className="font-medium">{paymentMethod === 'RAZORPAY' ? 'Online Payment' : 'Cash on Delivery'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Estimated Delivery</p>
                <p className="font-medium">3-5 business days</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-4">You will receive an email confirmation and tracking details shortly.</p>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => router.push('/orders')} variant="outline" size="lg">
            <Package className="mr-2 w-4 h-4" />
            View Orders
          </Button>
          <Button onClick={() => router.push('/products')} size="lg">
            Continue Shopping
          </Button>
        </div>
      </div>
    )
  }

  return null
}