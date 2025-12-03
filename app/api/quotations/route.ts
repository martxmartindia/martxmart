import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthenticatedUser, requireAuth } from "@/lib/auth-helpers"


export async function POST(req: NextRequest) {
    try {
     // Use NextAuth authentication instead of custom JWT
       const authError = await requireAuth();
       if (authError) return authError;
       
       const user = await getAuthenticatedUser();
       if (!user) {
         return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
       }
        const userId = user.id
        const { items, addressId } = await req.json()

        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ error: "Invalid items" }, { status: 400 })
        }

        // Look up cart items and their associated products
        const cartItemIds = items.map(item => item.id)
        console.log('Looking for cart item IDs:', cartItemIds)
        
        const [productCartItems, shoppingCartItems] = await Promise.all([
            prisma.productCartItem.findMany({
                where: { id: { in: cartItemIds } },
                include: {
                    product: {
                        select: { id: true, name: true, price: true, hsnCode: true }
                    }
                }
            }),
            prisma.shoppingCartItem.findMany({
                where: { id: { in: cartItemIds } },
                include: {
                    shopping: {
                        select: { id: true, name: true, price: true, hsnCode: true }
                    }
                }
            })
        ])
        
        // Transform cart items to include product data
        const allItems = [
            ...productCartItems.map(item => ({
                cartItemId: item.id,
                id: item.product.id,
                name: item.product.name,
                price: item.price,
                quantity: item.quantity,
                hsnCode: item.product.hsnCode
            })),
            ...shoppingCartItems.map(item => ({
                cartItemId: item.id,
                id: item.shopping.id,
                name: item.shopping.name,
                price: item.price,
                quantity: item.quantity,
                hsnCode: item.shopping.hsnCode
            }))
        ]
        
        console.log('Cart items found:', allItems.length)
        
        const address = addressId ? await prisma.address.findUnique({
            where: { id: addressId }
        }) : null

        // Create a map of item details for easy lookup using cart item ID
        const itemMap = allItems.reduce((map, item) => {
            (map as { [key: string]: typeof item })[item.cartItemId] = item
            return map
        }, {})

        // Calculate totals and prepare items with correct data types
        const quotationItems = items.map(item => {
            const itemData = (itemMap as { [key: string]: typeof allItems[0] })[item.id]
            const itemTotal = parseFloat(itemData.price as unknown as string) * itemData.quantity
            return {
                productId: itemData.id,
                name: itemData.name,
                price: itemData.price,
                quantity: itemData.quantity,
                hsnCode: itemData.hsnCode,
                total: itemTotal
            }
        })

        const subtotal = quotationItems.reduce((sum, item) => sum + item.total, 0)
        const tax = subtotal * 0.18 // 18% GST
        const total = subtotal + tax

        // Create quotation in database
        const quotation = await prisma.quotation.create({
            data: {
                userId: userId as string,
                ...(addressId && { addressId }),
                subtotal,
                tax,
                total,
                status: "PENDING",
                validity: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
                items: {
                    create: quotationItems
                },
            },
            include: {
                items: true,
                ...(addressId && { address: true })
            }
        })

        return NextResponse.json(
            {
                id: quotation.id,
                message: "Quotation created successfully",
                quotation,
            },
            { status: 201 },
        )
    } catch (error) {
        console.error("Error creating quotation:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

export async function GET(req: NextRequest) {
    try {
  // Use NextAuth authentication instead of custom JWT
    const authError = await requireAuth();
    if (authError) return authError;
    
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
        const url = new URL(req.url)
        const userId = url.searchParams.get("userId")

        // For admin users, allow filtering by userId
        if (user.role === "ADMIN" && userId) {
            const quotations = await prisma.quotation.findMany({
                where: { userId },
                include: { items: true },
                orderBy: { createdAt: "desc" },
            })

            return NextResponse.json(quotations)
        }

        // For regular users, only return their own quotations
        const quotations = await prisma.quotation.findMany({
            where: { userId: user.id as string },
            include: { items: true },
            orderBy: { createdAt: "desc" },
        })

        return NextResponse.json(quotations)
    } catch (error) {
        console.error("Error fetching quotations:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}