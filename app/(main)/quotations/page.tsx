"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import QuotationTemplate from "@/components/quotation/QuotationTemplate"
import { useAuth } from "@/store/auth"
import { toast } from "sonner"
import { useCart } from "@/store/cart"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import Image from "next/image"

interface Address {
  id: string
  contactName: string
  addressLine1: string
  city: string
  state: string
  zip: string
}

export default function QuotationsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [quotationData, setQuotationData] = useState<any>(null)
  const { items } = useCart()
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [selectedAddress, setSelectedAddress] = useState<string>('')
  const [addresses, setAddresses] = useState<Address[]>([])
  const [showSelection, setShowSelection] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    if (typeof window === 'undefined') return
    
    const data = localStorage.getItem('quotationData')
    if (!data) {
      router.push('/cart')
      return
    }
    
    const parsedData = JSON.parse(data)
    setSelectedItems(parsedData.items?.map((item: any) => item.id) || [])
    
    // Fetch user addresses
    fetchAddresses()
  }, [router])

  const fetchAddresses = async () => {
    try {
      const response = await fetch('/api/account/address')
      if (response.ok) {
        const data = await response.json()
        setAddresses(data.addresses || [])
      }
    } catch (error) {
      console.error('Error fetching addresses:', error)
    }
  }

  const handleItemToggle = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const saveQuotation = async () => {
    if (selectedItems.length === 0) {
      toast.error('Please select at least one item')
      return
    }

    setIsLoading(true)
    const data = typeof window !== 'undefined' ? localStorage.getItem('quotationData') : null
    if (!data) {
      toast.error('No cart data found')
      return
    }
    const parsedData = JSON.parse(data)
    
    try {
      const response = await fetch('/api/quotations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: parsedData.items
            .filter((item: any) => selectedItems.includes(item.id))
            .map((item: any) => {
              return {
                id: item.id,
                quantity: item.quantity
              }
            }),
          addressId: selectedAddress || undefined
        })
      })

      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to save quotation')
      }
      
      const selectedItemsData = parsedData.items.filter((item: any) => selectedItems.includes(item.id))
      const addressData = addresses.find(addr => addr.id === selectedAddress)
      
      const quotation = {
        id: result.quotation.id,
        user: {
          name: user?.name || 'Guest User',
          email: user?.email || 'guest@example.com',
          phone: user?.phone || 'N/A',
          address: addressData ? 
            `${addressData.addressLine1}, ${addressData.city}, ${addressData.state} - ${addressData.zip}` : 
            'N/A'
        },
        items: selectedItemsData.map((item: any) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          hsnCode: '8439' // Default HSN code, should come from product data
        })),
        subtotal: result.quotation.subtotal,
        tax: result.quotation.tax,
        total: result.quotation.total
      }
      
      setQuotationData(quotation)
      setShowSelection(false)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('quotationData')
      }
      toast.success('Quotation generated successfully')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to generate quotation')
    } finally {
      setIsLoading(false)
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Loading...</h2>
        </div>
      </div>
    )
  }

  if (showSelection) {
    const data = typeof window !== 'undefined' ? localStorage.getItem('quotationData') : null
    const parsedData = data ? JSON.parse(data) : null
    
    if (!parsedData) {
      router.push('/cart')
      return null
    }

    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Generate Quotation</h1>
          
          {/* Product Selection */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Select Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {parsedData.items.map((item: any) => (
                  <div key={item.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Checkbox
                      checked={selectedItems.includes(item.id)}
                      onCheckedChange={() => handleItemToggle(item.id)}
                    />
                    <div className="relative w-16 h-16 rounded-md overflow-hidden">
                      <Image
                        src={item.image || '/logo.png'}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-600">Qty: {item.quantity} × ₹{item.price.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Address Selection */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Select Address (Optional)</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="" id="no-address" />
                  <Label htmlFor="no-address">No address</Label>
                </div>
                {addresses.map((address) => (
                  <div key={address.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={address.id} id={address.id} />
                    <Label htmlFor={address.id} className="flex-1">
                      <div className="p-3 border rounded-lg">
                        <p className="font-medium">{address.contactName}</p>
                        <p className="text-sm text-gray-600">
                          {address.addressLine1}, {address.city}, {address.state} - {address.zip}
                        </p>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => router.push('/cart')}
              className="flex-1"
            >
              Back to Cart
            </Button>
            <Button
              onClick={saveQuotation}
              disabled={isLoading || selectedItems.length === 0}
              className="flex-1 bg-orange-600 hover:bg-orange-700"
            >
              {isLoading ? 'Generating...' : 'Generate Quotation'}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading || !quotationData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Generating Quotation...</h2>
          <p className="text-gray-600">Please wait while we prepare your quotation.</p>
        </div>
      </div>
    )
  }

  return <QuotationTemplate quotation={quotationData} />
}