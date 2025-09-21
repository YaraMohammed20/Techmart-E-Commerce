"use client";

import { useState, useEffect } from "react";
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
import {ShippingAddress} from "@/interfaces/order";

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const [cartId, setCartId] = useState<string | null>(null);
  const [address, setAddress] = useState<ShippingAddress | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) return;

    getUserCart(token)
      .then((data) => {
        setCartId(data?.data?._id || null);
      })
      .catch(() => {
        toast.error("Could not fetch cart.");
      });

    getUserAddresses(token)
      .then((res) => {
        if (res?.data?.length > 0) {
          setAddress(res.data[0]); 
        }
      })
      .catch(() => {
        toast.error("Could not fetch address.");
      });
  }, []);


  const handleOnlinePayment = async () => {
    const token = localStorage.getItem("userToken");
    if (!token || !cartId) {
      toast.error("Missing user/cart info.");
      return;
    }

    try {
      setLoading(true);
      const session = await createCheckoutSession(
        token,
        cartId,
        window.location.origin
      );

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

  const handleCashOnDelivery = async () => {
    const token = localStorage.getItem("userToken");
    if (!token || !cartId || !address) {
      toast.error("Missing user/cart/address info.");
      return;
    }

    try {
      setLoading(true);
      await createCashOrder(token, cartId,  address._id);
      toast.success("Cash order placed successfully!");
      router.push("/products"); 
    } catch (err) {
      console.error(err);
      toast.error("Could not place cash order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="space-y-4">
        {/* Shipping Details */}
        <div className="p-6 border rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Shipping Address</h2>
          {address ? (
            <div className="text-muted-foreground space-y-1">
              <p><strong>City:</strong> {address.city}</p>
              <p><strong>Details:</strong> {address.details}</p>
            </div>
          ) : (
            <p className="text-muted-foreground">
              No saved address found. Please add one in your profile.
            </p>
          )}
        </div>

        {/* Payment Section */}
        <div className="p-6 border rounded-lg">
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
    </div>
  );
}