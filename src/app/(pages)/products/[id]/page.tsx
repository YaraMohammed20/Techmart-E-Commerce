"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { Product, Subcategory } from "@/interfaces";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ShoppingCart, Heart } from "lucide-react";
import { renderStars } from "@/helpers/rating";
import { SingleProductResponse } from "@/types";
import { CartResponse } from "@/interfaces/cart";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addingToWishlist, setAddingToWishlist] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false); // ✅ red heart state

  async function fetchProducts() {
    try {
      setLoading(true);
      const res = await fetch(
        `https://ecommerce.routemisr.com/api/v1/products/${id}`
      );
      const data: SingleProductResponse = await res.json();

      if (!res.ok) throw new Error("Failed to load product details.");
      setProduct(data.data);
    } catch {
      setError("Failed to load product details.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) fetchProducts();
  }, [id]);

  async function addProductToCart(
    productId: string
  ): Promise<CartResponse | undefined> {
    const token = localStorage.getItem("userToken");
    if (!token) {
      toast.error("Please login first!");
      return;
    }

    try {
      setAddingToCart(true);

      const res = await fetch("https://ecommerce.routemisr.com/api/v1/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token,
        },
        body: JSON.stringify({ productId, count: 1 }),
      });

      const data: CartResponse = await res.json();

      if (!res.ok || data.status !== "success") {
        throw new Error(data.message || "Failed to add product to cart");
      }

      toast.success("Product added to cart successfully!");
      return data;
    } catch (err: any) {
      toast.error(err.message || "Error adding product to cart");
    } finally {
      setAddingToCart(false);
    }
  }

  async function addProductToWishlist(productId: string) {
    const token = localStorage.getItem("userToken");
    if (!token) {
      toast.error("Please login first!");
      return;
    }

    try {
      setAddingToWishlist(true);

      const res = await fetch(
        "https://ecommerce.routemisr.com/api/v1/wishlist",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token,
          },
          body: JSON.stringify({ productId }),
        }
      );

      const data = await res.json();

      if (!res.ok || data.status !== "success") {
        throw new Error(data.message || "Failed to add product to wishlist");
      }

      setIsWishlisted(true); 
      toast.success("Product added to wishlist!");
    } catch (err: any) {
      toast.error(err.message || "Error adding product to wishlist");
    } finally {
      setAddingToWishlist(false);
    }
  }

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || "Product not found"}</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg border">
            <Image
              src={product.images[selectedImage] ?? product.imageCover}
              alt={product.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border-2 ${
                    selectedImage === index
                      ? "border-primary"
                      : "border-gray-200"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Brand */}
          <div className="text-sm text-muted-foreground uppercase tracking-wide">
            <Link
              href={`/brands/${product.brand._id}`}
              className="hover:text-primary hover:underline transition-colors"
            >
              {product.brand.name}
            </Link>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold">{product.title}</h1>

          {/* Rating */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              {renderStars(product.ratingsAverage)}
              <span className="ml-2 text-sm text-muted-foreground">
                {product.ratingsAverage} ({product.ratingsQuantity} reviews)
              </span>
            </div>
            <span className="text-sm text-muted-foreground">
              {product.sold} sold
            </span>
          </div>

          {/* Price */}
          <div className="text-3xl font-bold text-primary">
            {formatPrice(product.price)}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="font-semibold">Description</h3>
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Category & Subcategory */}
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/categories/${product.category._id}`}
              className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm hover:bg-secondary/80 transition-colors"
            >
              {product.category.name}
            </Link>

            {product.subcategory.map((sub: Subcategory) => (
              <Link
                key={sub._id}
                href={`/subcategory/${sub._id}`}
                className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm hover:bg-muted/80 transition-colors"
              >
                {sub.name}
              </Link>
            ))}
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Stock:</span>
            <span
              className={`text-sm ${
                product.quantity > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {product.quantity > 0
                ? `${product.quantity} available`
                : "Out of stock"}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            {/* Add to Cart */}
            <Button
              size="lg"
              className="flex-1"
              disabled={product.quantity === 0 || addingToCart}
              onClick={async () => {
                const res = await addProductToCart(product._id);
                if (res) router.push("/cart");
              }}
            >
              {addingToCart ? (
                <LoadingSpinner className="h-5 w-5 mr-2" />
              ) : (
                <ShoppingCart className="h-5 w-5 mr-2" />
              )}
              {addingToCart ? "Adding..." : "Add to Cart"}
            </Button>

            {/* Wishlist */}
            <Button
              variant="outline"
              size="lg"
              disabled={addingToWishlist}
              onClick={() => addProductToWishlist(product._id)}
            >
              <Heart
                className={`h-5 w-5 ${
                  isWishlisted ? "text-red-500 fill-red-500" : ""
                }`}
              />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
