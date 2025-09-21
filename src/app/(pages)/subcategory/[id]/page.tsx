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
        <p className="text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product: Product) => ( 
            <Link
              key={product._id}
              href={`/products/${product._id}`}
              className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition"
            >
              <Image
                src={product.imageCover}
                alt={product.title}
                width={300}
                height={300}
                className="object-cover w-full h-48"
              />
              <div className="p-4">
                <h2 className="font-semibold">{product.title}</h2>
                <p className="text-primary font-bold">${product.price}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
