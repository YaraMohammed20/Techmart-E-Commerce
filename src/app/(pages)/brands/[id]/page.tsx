"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getProductsByBrand } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Product } from "@/interfaces/product";


export default function BrandProductsPage() {
  const { id } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getProductsByBrand(id as string); // typed in API function
        setProducts(data.data); // TypeScript knows data.data is Product[]
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-500">Loading products...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-xl font-semibold mb-4">No products found for this brand.</h2>
        <Button variant="outline" className="w-fit mt-2 bg-black text-white transition" asChild>
          <Link href="/products">Browse Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Products by Brand</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product: Product) => (
          <div key={product._id} className="border rounded-lg p-4">
            <Image
              src={product.imageCover}
              alt={product.title}
              width={200}
              height={200}
              className="object-cover rounded-md"
            />
            <h3 className="font-semibold mt-2">{product.title}</h3>
            <p className="text-gray-600">${product.price}</p>
            <Button variant="outline" className="mt-3" asChild>
              <Link href={`/products/${product._id}`}>View Details</Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
