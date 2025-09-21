"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import toast from "react-hot-toast";
import {
  createCheckoutSession,
  createCashOrder,
  getUserCart,
  getUserAddresses,
} from "@/lib/api";
import { ShippingAddress } from "@/interfaces/order";
import { CartResponse } from "@/interfaces";

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [address, setAddress] = useState<ShippingAddress | null>(null);
  const router = useRouter();

  // Fetch cart and address on mount
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) return;

    getUserCart(token)
      .then((data) => setCart(data || null))
      .catch(() => toast.error("Could not fetch cart."));

    getUserAddresses(token)
      .then((res) => {
        if (res?.data?.length) setAddress(res.data[0]);
      })
      .catch(() => toast.error("Could not fetch address."));
  }, []);

  // Online Payment
  const handleOnlinePayment = async () => {
    const token = localStorage.getItem("userToken");
    const cartId = cart?.data?._id;
    if (!token || !cartId) {
      toast.error("Missing user/cart info.");
      return;
    }

    try {
      setLoading(true);
      const session = await createCheckoutSession(token, cartId, window.location.origin);

      if (session.session?.url) {
        window.location.href = session.session.url;
      } else {
        toast.success("Order placed without redirect.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Payment failed to start.");
    } finally {
      setLoading(false);
    }
  };

  // Cash on Delivery
  const handleCashOnDelivery = async () => {
    const token = localStorage.getItem("userToken");
    const cartId = cart?.data?._id;
    const addressId = address?._id;

    if (!token || !cartId || !addressId) {
      toast.error("Missing user/cart/address info.");
      return;
    }

    try {
      setLoading(true);
      await createCashOrder(token, cartId, addressId);
      toast.success("Cash order placed successfully!");
      router.push("/products");
    } catch (err) {
      console.error(err);
      toast.error("Could not place cash order.");
    } finally {
      setLoading(false);
    }
  };

  // Empty cart state
  if (!cart || cart.numOfCartItems === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-xl font-semibold mb-4">Your cart is empty</h2>
        <Button asChild>
          <a href="/products" className="w-fit bg-black text-white px-4 py-2 rounded">
            Browse Products
          </a>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {/* Shipping Details */}
      <div className="p-6 border rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-2">Shipping Address</h2>
        {address ? (
          <div className="text-muted-foreground space-y-1">
            <p><strong>City:</strong> {address.city}</p>
            <p><strong>Details:</strong> {address.details}</p>
            <p><strong>Phone:</strong> {address.phone}</p>
          </div>
        ) : (
          <p className="text-muted-foreground">
            No saved address found. Please add one in your profile.
          </p>
        )}
      </div>

      {/* Payment Section */}
      <div className="p-6 border rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-2">Payment</h2>
        <p className="text-muted-foreground mb-4">
          Choose your preferred payment method.
        </p>

        <div className="space-y-3">
          <Button
            className="w-full"
            size="lg"
            onClick={handleOnlinePayment}
            disabled={loading}
          >
            {loading ? "Processing..." : "Pay Online"}
          </Button>

          <Button
            className="w-full"
            size="lg"
            variant="outline"
            onClick={handleCashOnDelivery}
            disabled={loading}
          >
            {loading ? "Processing..." : "Cash on Delivery"}
          </Button>
        </div>
      </div>

      <Separator />
    </div>
  );
}
