"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/interfaces";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart } from "lucide-react";
import { renderStars } from "@/helpers/rating";
import { formatPrice } from "@/helpers/currency";
import { addToCart, addToWishlist } from "@/lib/api";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { ProductCardProps } from "@/interfaces/product";

export default function ProductCard({
  product,
  viewMode = "grid",
  token,
}: ProductCardProps) {
  const [loading, setLoading] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);


  async function handleAddToCart() {
    const storedToken =
      typeof window !== "undefined" ? localStorage.getItem("userToken") : null;
    const authToken = token || storedToken;

    if (!authToken) {
      toast.error("You need to sign in first!");
      return;
    }

    try {
      setLoading(true);
      await addToCart(authToken, product._id, 1);
      toast.success("Added to cart!");
    } catch (err: any) {
      toast.error(err.message || "Failed to add to cart");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddToWishlist(productId: string) {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) {
        toast.error("Please login to add to wishlist");
        return;
      }
      await addToWishlist(token, productId);
      setIsWishlisted(true); 
      toast.success("Added to wishlist");
    } catch (err) {
      console.error("Wishlist error:", err);
      toast.error("Failed to add to wishlist");
    }
  }

  if (viewMode === "list") {
    return (
      <div className="flex gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
        {/* Product Image */}
        <div className="relative w-32 h-32 flex-shrink-0">
          <Image
            src={product.imageCover}
            alt={product.title}
            fill
            className="object-cover rounded-md"
            sizes="128px"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg line-clamp-2">
              <Link
                href={`/products/${product._id}`}
                className="hover:text-primary transition-colors"
              >
                {product.title}
              </Link>
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleAddToWishlist(product._id)}
            >
              <Heart
                className={`h-4 w-4 ${
                  isWishlisted ? "text-red-500 fill-red-500" : ""
                }`}
              />
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-1">
              {renderStars(product.ratingsAverage)}
              <span className="text-sm text-muted-foreground ml-1">
                ({product.ratingsQuantity})
              </span>
            </div>
            <span className="text-sm text-muted-foreground">
              {product.sold} sold
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-2xl font-bold text-primary">
                {formatPrice(product.price)}
              </span>
            </div>

            <Button onClick={handleAddToCart} disabled={loading}>
              <ShoppingCart className="h-4 w-4 mr-2" />
              {loading ? "Adding..." : "Add to Cart"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={product.imageCover}
          alt={product.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />

        {/* Heart button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleAddToWishlist(product._id)}
          className="absolute top-2 right-2 z-10 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Heart
            className={`h-4 w-4 ${
              isWishlisted ? "text-red-500 fill-red-500" : ""
            }`}
          />
        </Button>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-semibold text-sm mb-2 line-clamp-2 hover:text-primary transition-colors">
          <Link href={`/products/${product._id}`}>{product.title}</Link>
        </h3>

        <div className="flex items-center gap-1 mb-2">
          <div className="flex">{renderStars(product.ratingsAverage)}</div>
          <span className="text-xs text-muted-foreground">
            ({product.ratingsQuantity})
          </span>
        </div>

        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-primary">
            {formatPrice(product.price)}
          </span>
          <span className="text-xs text-muted-foreground">
            {product.sold} sold
          </span>
        </div>

        <Button
          className="w-full"
          size="sm"
          onClick={handleAddToCart}
          disabled={loading}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {loading ? "Adding..." : "Add to Cart"}
        </Button>
      </div>
    </div>
  );
}
