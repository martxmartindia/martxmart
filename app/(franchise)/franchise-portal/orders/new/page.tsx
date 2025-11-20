"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Loader2, Minus, Plus, Trash2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface Customer {
  id: string
  name: string
  email: string
  phone: string
}

interface Product {
  id: string
  name: string
  sku: string
  price: number
  inventory: {
    quantity: number
  } | null
}

interface OrderItem {
  productId: string
  product: Product
  quantity: number
  price: number
}

export default function NewOrderPage() {
  const router = useRouter()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("")
  const [items, setItems] = useState<OrderItem[]>([])
  const [paymentMethod, setPaymentMethod] = useState<string>("CASH")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customersRes, productsRes] = await Promise.all([
          fetch("/api/franchise-portal/customers"),
          fetch("/api/franchise-portal/products"),
        ])

        if (!customersRes.ok || !productsRes.ok) {
          throw new Error("Failed to fetch data")
        }

        const [customersData, productsData] = await Promise.all([customersRes.json(), productsRes.json()])

        setCustomers(customersData)
        setProducts(productsData)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Failed to load required data. Please try again later.")
      } finally {
        setDataLoading(false)
      }
    }

    fetchData()
  }, [])

  const addItem = (productId: string) => {
    const product = products.find((p) => p.id === productId)
    if (!product) return

    const existingItem = items.find((item) => item.productId === productId)
    if (existingItem) {
      setItems(items.map((item) => (item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item)))
    } else {
      setItems([
        ...items,
        {
          productId,
          product,
          quantity: 1,
          price: product.price,
        },
      ])
    }
  }

  const updateItemQuantity = (index: number, quantity: number) => {
    const newItems = [...items]
    if (quantity > 0 && quantity <= (newItems[index].product.inventory?.quantity || 999)) {
      newItems[index].quantity = quantity
      setItems(newItems)
    }
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedCustomerId) {
      setError("Please select a customer")
      return
    }

    if (items.length === 0) {
      setError("Please add at least one product")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/franchise-portal/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId: selectedCustomerId,
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
          totalAmount: calculateTotal(),
          paymentMethod,
          status: "PENDING",
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to create order")
      }

      const order = await response.json()
      router.push(`/franchise-portal/orders/${order.id}`)
    } catch (err: any) {
      console.error("Error creating order:", err)
      setError(err.message || "Failed to create order. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (dataLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Create New Order</h1>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
              <CardDescription>Select a customer for this order</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customer">Customer</Label>
                  <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
                    <SelectTrigger id="customer">
                      <SelectValue placeholder="Select a customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.length > 0 ? (
                        customers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.name} ({customer.phone})
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>
                          No customers available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {selectedCustomerId && (
                  <div className="pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => router.push("/franchise-portal/customers/new")}
                    >
                      Add New Customer
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
              <CardDescription>Select payment method and enter details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger id="paymentMethod">
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CASH">Cash</SelectItem>
                      <SelectItem value="CARD">Card</SelectItem>
                      <SelectItem value="UPI">UPI</SelectItem>
                      <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {paymentMethod === "UPI" && (
                  <div className="space-y-2">
                    <Label htmlFor="upiReference">UPI Reference ID</Label>
                    <Input id="upiReference" placeholder="Enter UPI reference ID" />
                  </div>
                )}

                {paymentMethod === "CARD" && (
                  <div className="space-y-2">
                    <Label htmlFor="cardReference">Card Reference</Label>
                    <Input id="cardReference" placeholder="Enter last 4 digits" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
            <CardDescription>Add products to this order</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="product">Add Product</Label>
                <div className="flex gap-2">
                  <Select onValueChange={addItem}>
                    <SelectTrigger id="product" className="flex-1">
                      <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.length > 0 ? (
                        products.map((product) => (
                          <SelectItem key={product.id} value={product.id} disabled={product.inventory?.quantity === 0}>
                            {product.name} - ₹{product.price}
                            {product.inventory?.quantity === 0 && " (Out of stock)"}
                            {product.inventory?.quantity !== undefined &&
                              product.inventory?.quantity <= 10 &&
                              product.inventory?.quantity > 0 &&
                              ` (Only ${product.inventory.quantity} left)`}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>
                          No products available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {items.length > 0 ? (
                <div className="border rounded-md">
                  <div className="grid grid-cols-12 gap-2 p-4 font-medium text-sm border-b">
                    <div className="col-span-5">Product</div>
                    <div className="col-span-2 text-right">Price</div>
                    <div className="col-span-3 text-center">Quantity</div>
                    <div className="col-span-2 text-right">Total</div>
                  </div>

                  {items.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 p-4 border-b last:border-0 items-center">
                      <div className="col-span-5">
                        <div className="font-medium">{item.product.name}</div>
                        <div className="text-sm text-muted-foreground">SKU: {item.product.sku}</div>
                      </div>
                      <div className="col-span-2 text-right">₹{item.price}</div>
                      <div className="col-span-3 flex items-center justify-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateItemQuantity(index, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItemQuantity(index, Number.parseInt(e.target.value) || 1)}
                          min={1}
                          max={item.product.inventory?.quantity || 999}
                          className="h-8 w-16 text-center"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateItemQuantity(index, item.quantity + 1)}
                          disabled={item.quantity >= (item.product.inventory?.quantity || 999)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="col-span-1 text-right">₹{(item.price * item.quantity).toFixed(2)}</div>
                      <div className="col-span-1 flex justify-end">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => removeItem(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border rounded-md p-8 text-center">
                  <p className="text-muted-foreground">No items added to this order yet</p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t p-4">
            <div>
              <p className="text-sm text-muted-foreground">
                Total Items: {items.reduce((total, item) => total + item.quantity, 0)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Subtotal</p>
              <p className="text-2xl font-bold">₹{calculateTotal().toFixed(2)}</p>
            </div>
          </CardFooter>
        </Card>

        <div className="mt-6 flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading || items.length === 0 || !selectedCustomerId}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Order...
              </>
            ) : (
              "Create Order"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
