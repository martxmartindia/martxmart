import { NextResponse } from "next/server";
import { prisma as db } from "@/lib/prisma";
import { PaymentStatus } from "@prisma/client";
import razorpay from "@/lib/razorpay";
import { sendEmail, emailTemplates } from "@/lib/email";
import { getAuthenticatedUser, requireAuth } from "@/lib/auth-helpers";

export async function GET(request: Request) {
  try {
    // Use NextAuth authentication instead of custom JWT
    const authError = await requireAuth();
    if (authError) return authError;
    
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const userId = user.id as string;
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page") || "1");
    const limit = Number(searchParams.get("limit") || "10");
    const status = searchParams.get("status");

    const skip = (page - 1) * limit;

    const whereClause: any = { userId: userId };
    if (status) {
      whereClause.status = status;
    }

    const orders = await db.order.findMany({
      where: whereClause,
      include: {
        shoppingItems: {
          include: {
            shopping: {
              select: {
                id: true,
                name: true,
                images: true,
                brand: true,
              },
            },
          },
        },
        payment: true,
        shippingAddress: true,
        billingAddress: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    });

    const totalOrders = await db.order.count({
      where: whereClause,
    });

    return NextResponse.json({
      orders,
      pagination: {
        total: totalOrders,
        page,
        limit,
        totalPages: Math.ceil(totalOrders / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Use NextAuth authentication instead of custom JWT
    const authError = await requireAuth();
    if (authError) return authError;
    
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const userId = user.id as string;

    const { shippingAddressId, billingAddressId, paymentMethod, notes, couponCode, discountAmount } =
      await request.json();

    if (!shippingAddressId) {
      return NextResponse.json(
        { error: "Shipping address is required" },
        { status: 400 }
      );
    }

    // Get user's cart
    const cart = await db.cart.findFirst({
      where: { userId: userId },
      include: {
        shoppingItems: {
          include: {
            shopping: true,
          },
        },
      },
    });

    if (!cart || cart.shoppingItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Calculate total amount
    const subtotal = cart.shoppingItems.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0
    );
    const deliveryCharges = subtotal > 999 ? 0 : 99;
    const codCharges = paymentMethod === "COD" ? 49 : 0;
    const totalBeforeDiscount = subtotal + deliveryCharges + codCharges;
    const totalAmount = Math.max(0, totalBeforeDiscount - (discountAmount || 0));

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Create Razorpay order if payment method is online
    let razorpayOrderId = null;
    if (paymentMethod !== "COD") {
      const razorpayOrder = await razorpay.orders.create({
        amount: Math.round(totalAmount * 100), // Convert to paise
        currency: "INR",
        receipt: orderNumber,
      });
      razorpayOrderId = razorpayOrder.id;
    }

    // Prepare order data
    const orderData: any = {
      orderNumber,
      userId: userId,
      totalAmount,
      shippingAddressId,
      billingAddressId: billingAddressId || shippingAddressId,
      notes,
      status: paymentMethod === "COD" ? "PENDING" : "PENDING",
      shoppingItems: {
        create: cart.shoppingItems.map((item) => ({
          shoppingId: item.shoppingId,
          quantity: item.quantity,
          price: item.price,
          subtotal: Number(item.price) * item.quantity,
        })),
      },
    };
    let payment = null;
    if (razorpayOrderId) {
      payment = await db.payment.create({
        data: {
          amount: totalAmount,
          method: paymentMethod,
          status: PaymentStatus.PENDING,
          razorpayOrderId,
        },
      });
    }
// Add paymentId to orderData if payment was created
if (payment) {
  orderData.paymentId = payment.id;
}
    // Create order
    const order = await db.order.create({
      data: orderData,
      include: {
        shoppingItems: {
          include: {
            shopping: true,
          },
        },
        shippingAddress: true,
        payment: true,
      },
    });

    // Clear cart
    await db.shoppingCartItem.deleteMany({
      where: { cartId: cart.id },
    });

    // Update inventory
    for (const item of cart.shoppingItems) {
      await db.shopping.update({
        where: { id: item.shoppingId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    // Send confirmation email
    try {
      await sendEmail({
        to: String(user.email!),
        subject: `Order Confirmation - ${orderNumber}`,
        html: emailTemplates.orderConfirmation({
          customerName: user.name,
          orderNumber,
          totalAmount,
          paymentMethod,
        }),
      });
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
    }

    return NextResponse.json({
      order,
      razorpayOrderId,
      razorpayKeyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
