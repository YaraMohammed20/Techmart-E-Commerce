"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { toast } from "react-hot-toast";
import { addToWishlist, removeFromWishlist } from "@/lib/api";
import { WishlistButtonProps } from "@/interfaces/Wishlist";

export default function WishlistButton({ token, productId }: WishlistButtonProps) {
  const [inWishlist, setInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleWishlist = async () => {
    if (!token) {
      toast.error("You must be signed in to manage your wishlist");
      return;
    }

    try {
      setLoading(true);
      if (inWishlist) {
        await removeFromWishlist(token, productId);
        setInWishlist(false);
        toast.success("Removed from wishlist");
      } else {
        await addToWishlist(token, productId);
        setInWishlist(true);
        toast.success("Added to wishlist");
      }
    } catch (err: unknown) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleWishlist}
      className="p-2"
      disabled={loading}
      aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart
        className="w-6 h-6 transition-colors"
        color={inWishlist ? "red" : "gray"}
        fill={inWishlist ? "red" : "none"}
      />
    </button>
  );
}
