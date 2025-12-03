import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/utils";
import Razorpay from "razorpay";
import { getAuthenticatedUser, requireAuth } from "@/lib/auth-helpers";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    const finduser = await requireAuth();
    if (finduser instanceof NextResponse) return finduser;

    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user.id;
    const { 
      items, 
      shippingAddressId, 
      billingAddressId, 
      totalAmount, 
      paymentMethod, 
      notes 
    } = await req.json();

    if (!items?.length || !shippingAddressId || !totalAmount || !paymentMethod) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Validate addresses
    const [shippingAddress, billingAddress] = await Promise.all([
      prisma.address.findFirst({ where: { id: shippingAddressId, userId } }),
      billingAddressId ? prisma.address.findFirst({ where: { id: billingAddressId, userId } }) : null
    ]);

    if (!shippingAddress) {
      return NextResponse.json({ error: "Invalid shipping address" }, { status: 400 });
    }

    // Validate products and stock
    const productIds = items.map((item: any) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } }
    });

    for (const item of items) {
      const product = products.find(p => p.id === item.productId);
      if (!product || product.stock < item.quantity) {
        return NextResponse.json({ 
          error: `Insufficient stock for ${product?.name || 'product'}` 
        }, { status: 400 });
      }
    }

    const result = await prisma.$transaction(async (tx) => {
      const orderNumber = generateOrderNumber();
      
      // Create order
      const order = await tx.order.create({
        data: {
          orderNumber,
          userId,
          totalAmount,
          status: "PENDING",
          shippingAddressId,
          billingAddressId: billingAddressId || shippingAddressId,
          notes,
          items: {
            create: items.map((item: any) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
              subtotal: item.price * item.quantity,
            })),
          },
        },
      });

      // Update stock
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // Create payment record
      let razorpayOrderId = null;
      if (paymentMethod === "RAZORPAY") {
        const razorpayOrder = await razorpay.orders.create({
          amount: Math.round(totalAmount * 100),
          currency: "INR",
          receipt: orderNumber,
          notes: { orderId: order.id, userId },
        });
        razorpayOrderId = razorpayOrder.id;
      }

      const payment = await tx.payment.create({
        data: {
          orderId: order.id,
          amount: totalAmount,
          method: paymentMethod,
          status: paymentMethod === "COD" ? "PENDING" : "PENDING",
          currency: "INR",
          razorpayOrderId,
        },
      });

      // Clear cart
      const cart = await tx.cart.findFirst({ where: { userId } });
      if (cart) {
        await tx.productCartItem.deleteMany({ where: { cartId: cart.id } });
        await tx.shoppingCartItem.deleteMany({ where: { cartId: cart.id } });
      }

      return { order, payment, razorpayOrderId };
    });

    return NextResponse.json({
      success: true,
      orderId: result.order.id,
      orderNumber: result.order.orderNumber,
      amount: Number(totalAmount),
      razorpayOrderId: result.razorpayOrderId,
    });

  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}