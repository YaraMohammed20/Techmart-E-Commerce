"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/helpers/currency";
import toast from "react-hot-toast";
import {
  getUserCart,
  removeCartItem,
  updateCartItem,
  clearCart,
} from "@/lib/api";

export default function CartPage() {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("userToken");
      if (!token) {
        toast.error("No token found. Please login.");
        setLoading(false);
        return;
      }

      const data = await getUserCart(token);
      setCart(data);
    } catch {
      toast.error("Failed to load cart. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (productId: string) => {
    const token = localStorage.getItem("userToken");
    if (!token) return toast.error("You must be logged in.");

    try {
      await removeCartItem(token, productId);
      toast.success("Item removed from cart.");
      fetchCart();
    } catch {
      toast.error("Failed to remove item.");
    }
  };

  const handleUpdateQuantity = async (productId: string, newCount: number) => {
    const token = localStorage.getItem("userToken");
    if (!token) return toast.error("You must be logged in.");
    if (newCount < 1) return;

    try {
      await updateCartItem(token, productId, newCount);
      toast.success("Cart updated.");
      fetchCart();
    } catch {
      toast.error("Failed to update quantity.");
    }
  };

  const handleClearCart = async () => {
    const token = localStorage.getItem("userToken");
    if (!token) return toast.error("You must be logged in.");

    try {
      await clearCart(token);
      toast.success("Cart cleared.");
      fetchCart();
    } catch {
      toast.error("Failed to clear cart.");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-500">Loading cart...</p>
      </div>
    );
  }

  if (!cart || cart.numOfCartItems === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          No products in your cart
        </h2>
        <Button
          variant="outline"
          className="w-fit mt-2 bg-black text-white transition"
          asChild
        >
          <Link href="/products">Browse products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Shopping Cart</h1>
        <p className="text-muted-foreground">
          {cart.numOfCartItems} item{cart.numOfCartItems > 1 ? "s" : ""} in your cart
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.data.products.map((item: any) => (
            <div key={item._id} className="flex gap-4 p-4 border rounded-lg">
              {/* Product Image */}
              <div className="relative w-20 h-20 flex-shrink-0">
                <Image
                  src={item.product.imageCover}
                  alt={item.product.title}
                  fill
                  className="object-cover rounded-md"
                  sizes="80px"
                />
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold line-clamp-2">
                  <Link
                    href={`/products/${item.product._id}`}
                    className="hover:text-primary transition-colors"
                  >
                    {item.product.title}
                  </Link>
                </h3>
                <p className="text-sm text-muted-foreground">
                  {item.product.brand?.name}
                </p>
                <p className="font-semibold text-primary mt-2">
                  {formatPrice(item.price)}
                </p>
              </div>

              {/* Quantity & Remove */}
              <div className="flex flex-col items-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveItem(item.product._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleUpdateQuantity(item.product._id, item.count - 1)
                    }
                  >
                    <Minus className="h-4 w-4" />
                  </Button>

                  <span className="w-8 text-center">{item.count}</span>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleUpdateQuantity(item.product._id, item.count + 1)
                    }
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {/* Clear Cart */}
          <div className="mt-6">
            <Button variant="outline" onClick={handleClearCart}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Cart
            </Button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6 sticky top-20">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal ({cart.numOfCartItems} items)</span>
                <span>{formatPrice(cart.data.totalCartPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between font-semibold text-lg mb-6">
              <span>Total</span>
              <span>{formatPrice(cart.data.totalCartPrice)}</span>
            </div>

            <Button className="w-full" size="lg" asChild>
              <Link href="/checkout">Proceed to Checkout</Link>
            </Button>

            <Button variant="outline" className="w-full mt-2" asChild>
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
