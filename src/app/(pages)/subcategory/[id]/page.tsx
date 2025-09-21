import { getProductsBySubcategory } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/interfaces"; 

export default async function SubcategoryPage({ params }: { params: { id: string } }) {
  const products: Product[] = await getProductsBySubcategory(params.id); 

  return (
    <main className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Subcategory Products</h1>

      {products.length === 0 ? (
        <p className="text-gray-500 text-center">No products found in this subcategory.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product: Product) => (
            <Link
              key={product._id}
              href={`/products/${product._id}`}
              className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition flex flex-col"
            >
              <div className="relative w-full h-48 md:h-60 lg:h-72">
                <Image
                  src={product.imageCover || "/placeholder.png"}
                  alt={product.title}
                  fill
                  className="object-cover w-full h-full"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <h2 className="font-semibold text-sm md:text-base line-clamp-2">{product.title}</h2>
                <p className="text-primary font-bold mt-2 text-lg">${product.price}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
