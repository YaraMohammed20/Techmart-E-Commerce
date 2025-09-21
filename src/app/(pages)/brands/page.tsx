import Image from "next/image";
import Link from "next/link";
import { getBrands } from "@/lib/api";

export default async function BrandsPage() {
  const data = await getBrands();
  const brands = data?.data || [];

  return (
    <main className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Brands</h1>

      {brands.length === 0 ? (
        <p className="text-gray-500 text-center">No brands found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {brands.map((brand: any) => (
            <Link
              key={brand._id}
              href={`/brands/${brand._id}`}
              className="border rounded-lg p-4 text-center shadow hover:shadow-lg transition cursor-pointer"
            >
              {brand.image && (
                <div className="mb-3 flex justify-center">
                  <Image
                    src={brand.image}
                    alt={brand.name}
                    width={80}
                    height={80}
                    className="rounded object-contain"
                  />
                </div>
              )}
              <p className="font-semibold text-gray-800">{brand.name}</p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
