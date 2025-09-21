"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { getUserWishlist, removeFromWishlist } from "@/lib/api";
import { Product } from "@/interfaces";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Heart, ShoppingCart } from "lucide-react";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchWishlist() {
    const token = localStorage.getItem("userToken");
    if (!token) {
      toast.error("Please login first!");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await getUserWishlist(token);
      setWishlist(res.data || []);
    } catch {
      toast.error("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  }

  async function handleRemove(productId: string) {
    const token = localStorage.getItem("userToken");
    if (!token) return;
    try {
      await removeFromWishlist(token, productId);
      toast.success("Removed from wishlist");
      setWishlist((prev) => prev.filter((p) => p._id !== productId));
    } catch {
      toast.error("Error removing from wishlist");
    }
  }

  useEffect(() => {
    fetchWishlist();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (!wishlist.length) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-xl font-semibold mb-4">Your wishlist is empty</h2>
        <Link href="/products">
          <Button>Browse Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlist.map((product) => (
          <div
            key={product._id}
            className="border rounded-lg p-4 flex flex-col justify-between hover:shadow-lg transition"
          >
            <Link href={`/products/${product._id}`} className="flex-1">
              <div className="relative w-full h-48 mb-4">
                <Image
                  src={product.imageCover || "/placeholder.png"}
                  alt={product.title}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
              <h3 className="font-semibold text-sm md:text-base line-clamp-2">{product.title}</h3>
              <p className="text-primary font-bold mt-2 text-lg">${product.price}</p>
            </Link>

            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => handleRemove(product._id)}
              >
                <Heart className="h-5 w-5 text-red-500" />
              </Button>
              <Link href={`/products/${product._id}`} className="flex-1">
                <Button className="w-full flex items-center justify-center">
                  <ShoppingCart className="h-5 w-5 mr-2" /> View
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
