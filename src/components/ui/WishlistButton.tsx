"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { toast } from "react-hot-toast";
import { addToWishlist, removeFromWishlist } from "@/lib/api";
import {WishlistButtonProps} from "@/interfaces/Wishlist";


export default function WishlistButton({ token, productId }: WishlistButtonProps) {
  const [inWishlist, setInWishlist] = useState(false);

  const toggleWishlist = async () => {
    try {
      if (inWishlist) {
        await removeFromWishlist(token, productId);
        setInWishlist(false);
        toast.success("Removed from wishlist");
      } else {
        await addToWishlist(token, productId);
        setInWishlist(true);
        toast.success("Added to wishlist");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  return (
    <button onClick={toggleWishlist} className="p-2">
      <Heart
        className="w-6 h-6 transition-colors"
        color={inWishlist ? "red" : "gray"}
        fill={inWishlist ? "red" : "none"}
      />
    </button>
  );
}
