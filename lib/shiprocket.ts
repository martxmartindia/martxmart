interface ShiprocketConfig {
  email: string
  password: string
  baseUrl: string
}

interface ShiprocketOrderData {
  order_id: string
  order_date: string
  pickup_location: string
  billing_customer_name: string
  billing_last_name: string
  billing_address: string
  billing_city: string
  billing_pincode: string
  billing_state: string
  billing_country: string
  billing_email: string
  billing_phone: string
  shipping_is_billing: boolean
  shipping_customer_name?: string
  shipping_last_name?: string
  shipping_address?: string
  shipping_city?: string
  shipping_pincode?: string
  shipping_state?: string
  shipping_country?: string
  shipping_email?: string
  shipping_phone?: string
  order_items: Array<{
    name: string
    sku: string
    units: number
    selling_price: number
    discount?: number
    tax?: number
    hsn?: number
  }>
  payment_method: string
  shipping_charges: number
  giftwrap_charges: number
  transaction_charges: number
  total_discount: number
  sub_total: number
  length: number
  breadth: number
  height: number
  weight: number
}

class ShiprocketService {
  private config: ShiprocketConfig
  private token: string | null = null
  private tokenExpiry: Date | null = null

  constructor() {
    this.config = {
      email: process.env.SHIPROCKET_EMAIL!,
      password: process.env.SHIPROCKET_PASSWORD!,
      baseUrl: "https://apiv2.shiprocket.in/v1/external",
    }
  }

  private async authenticate(): Promise<string> {
    try {
      // Check if token is still valid
      if (this.token && this.tokenExpiry && new Date() < this.tokenExpiry) {
        if (!this.token) {
          throw new Error("Token is unexpectedly null after authentication.")
        }
        return this.token
      }

      const response = await fetch(`${this.config.baseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: this.config.email,
          password: this.config.password,
        }),
      })

      if (!response.ok) {
        throw new Error(`Authentication failed: ${response.statusText}`)
      }

      const data = await response.json()
      this.token = data.token
      // Set token expiry to 10 days from now (Shiprocket tokens are valid for 10 days)
      this.tokenExpiry = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
    if (!this.token) {
          throw new Error("Token is unexpectedly null after authentication.")
        }
        return this.token
    } catch (error) {
      console.error("Shiprocket authentication failed:", error)
      throw error
    }
  }

  async createOrder(orderData: ShiprocketOrderData) {
    try {
      const token = await this.authenticate()

      const response = await fetch(`${this.config.baseUrl}/orders/create/adhoc`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Order creation failed: ${JSON.stringify(errorData)}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Shiprocket order creation failed:", error)
      throw error
    }
  }

  async trackOrder(shipmentId: string) {
    try {
      const token = await this.authenticate()

      const response = await fetch(`${this.config.baseUrl}/courier/track/shipment/${shipmentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Tracking failed: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Shiprocket tracking failed:", error)
      throw error
    }
  }

  async getServiceability(pickupPostcode: string, deliveryPostcode: string, weight: number) {
    try {
      const token = await this.authenticate()

      const response = await fetch(
        `${this.config.baseUrl}/courier/serviceability/?pickup_postcode=${pickupPostcode}&delivery_postcode=${deliveryPostcode}&weight=${weight}&cod=1`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (!response.ok) {
        throw new Error(`Serviceability check failed: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Shiprocket serviceability check failed:", error)
      throw error
    }
  }
}

export const shiprocket = new ShiprocketService()
export type { ShiprocketOrderData }
