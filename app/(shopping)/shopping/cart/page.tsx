'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, Heart, ArrowRight, ShoppingBag, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { CouponInput } from '@/components/shopping/CouponInput';
import { useShopping } from '@/store/shopping';

interface CartItem {
  id: string;
  quantity: number;
  price: number;
  shopping: {
    id: string;
    name: string;
    slug: string;
    price: number;
    originalPrice?: number;
    images: string[];
    stock: number;
    brand?: string;
    category: {
      name: string;
    };
  };
}

interface CartData {
  cart: {
    id: string;
    shoppingItems: CartItem[];
  };
  summary: {
    itemCount: number;
    subtotal: number;
    originalTotal: number;
    savings: number;
  };
}

export default function CartPage() {
  const [cartData, setCartData] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());
  const { appliedCoupon, applyCoupon, removeCoupon } = useShopping();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await fetch('/api/shopping/cart', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setCartData(data);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    setUpdatingItems(prev => new Set(prev).add(itemId));

    try {
      const response = await fetch('/api/shopping/cart', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          itemId,
          quantity: newQuantity,
        }),
      });

      if (response.ok) {
        await fetchCart();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update cart');
      }
    } catch (error) {
      console.error('Error updating cart:', error);
      alert('Failed to update cart');
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const removeItem = async (itemId: string) => {
    await updateQuantity(itemId, 0);
  };

  const moveToWishlist = async (productId: string) => {
    try {
      await fetch('/api/shopping/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ shoppingId: productId }),
      });

      const item = cartData?.cart.shoppingItems.find(item => item.shopping.id === productId);
      if (item) {
        await removeItem(item.id);
      }
    } catch (error) {
      console.error('Error moving to wishlist:', error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (!cartData || !cartData.cart.shoppingItems.length) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <ShoppingBag className="h-24 w-24 mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
          <Link href="/shopping">
            <Button className="bg-orange-500 hover:bg-orange-600">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const deliveryCharges = cartData.summary.subtotal > 999 ? 0 : 99;
  const subtotalWithDelivery = cartData.summary.subtotal + deliveryCharges;
  const discountAmount = appliedCoupon?.discountAmount || 0;
  const total = Math.max(0, subtotalWithDelivery - discountAmount);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <nav className="text-sm text-gray-600">
          <Link href="/shopping" className="hover:text-orange-600">Shopping</Link>
          <span className="mx-2">/</span>
          <span className="text-orange-600 font-medium">Shopping Cart</span>
        </nav>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        <p className="text-gray-600 mt-2">{cartData.summary.itemCount} items in your cart</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartData.cart.shoppingItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  {/* Product Image */}
                  <div className="relative w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={item.shopping.images[0] || '/placeholder.png'}
                      alt={item.shopping.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <Link href={`/products/${item.shopping.id}`}>
                          <h3 className="font-semibold text-gray-900 hover:text-orange-600 transition-colors">
                            {item.shopping.name}
                          </h3>
                        </Link>
                        {item.shopping.brand && (
                          <p className="text-sm text-gray-600">{item.shopping.brand}</p>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {item.shopping.category.name}
                        </Badge>
                        {item.shopping.stock < 10 && (
                          <Badge variant="destructive" className="text-xs">
                            Only {item.shopping.stock} left
                          </Badge>
                        )}
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-gray-900">₹{Number(item.price)}</span>
                          {item.shopping.originalPrice && item.shopping.originalPrice > Number(item.price) && (
                            <span className="text-sm text-gray-500 line-through">₹{item.shopping.originalPrice}</span>
                          )}
                        </div>
                        {item.shopping.originalPrice && (
                          <p className="text-sm text-green-600 font-medium">
                            Save ₹{(item.shopping.originalPrice - Number(item.price)) * item.quantity}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={updatingItems.has(item.id) || item.quantity <= 1}
                        >
                          {updatingItems.has(item.id) ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Minus className="h-4 w-4" />
                          )}
                        </Button>
                        <span className="w-12 text-center font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={updatingItems.has(item.id) || item.quantity >= item.shopping.stock}
                        >
                          {updatingItems.has(item.id) ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Plus className="h-4 w-4" />
                          )}
                        </Button>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveToWishlist(item.shopping.id)}
                          className="text-gray-600 hover:text-orange-600"
                        >
                          <Heart className="h-4 w-4 mr-1" />
                          Wishlist
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-gray-600 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Continue Shopping */}
          <div className="pt-4">
            <Link href="/shopping">
              <Button variant="outline" className="w-full sm:w-auto">
                Continue Shopping
              </Button>
            </Link>
          </div>
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
                  <span className={deliveryCharges === 0 ? 'text-green-600' : ''}>
                    {deliveryCharges === 0 ? 'FREE' : `₹${deliveryCharges}`}
                  </span>
                </div>
                {deliveryCharges > 0 && (
                  <p className="text-xs text-gray-600">
                    Add ₹{1000 - cartData.summary.subtotal} more to get free delivery
                  </p>
                )}
              </div>

              <Separator />

              {/* Coupon Section */}
              <div className="space-y-3">
                <h4 className="font-medium">Apply Coupon</h4>
                <CouponInput
                  cartTotal={subtotalWithDelivery}
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

              <div className="space-y-3">
                <Link href="/shopping/checkout">
                  <Button className="w-full bg-orange-500 hover:bg-orange-600">
                    Proceed to Checkout
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
                
                <div className="text-xs text-gray-600 text-center">
                  <p>Safe and Secure Payments. Easy returns. 100% Authentic products.</p>
                </div>
              </div>

              {/* Offers */}
              <div className="bg-green-50 p-3 rounded-lg">
                <h4 className="font-medium text-green-800 mb-1">Available Offers</h4>
                <ul className="text-xs text-green-700 space-y-1">
                  <li>• Get 10% instant discount on SBI Credit Cards</li>
                  <li>• Flat ₹200 off on orders above ₹2000</li>
                  <li>• Buy 2 Get 1 Free on selected items</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
