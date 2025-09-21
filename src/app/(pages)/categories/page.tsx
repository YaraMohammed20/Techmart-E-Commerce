import Link from "next/link";
import { getCategories } from "@/lib/api";

export default async function CategoriesPage() {
  const data = await getCategories();
  const categories = data?.data || [];

  return (
    <main className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Categories</h1>

      {categories.length === 0 ? (
        <p className="text-gray-500 text-center">No categories found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {categories.map((cat: any) => (
            <Link
              key={cat._id}
              href={`/categories/${cat._id}`}
              className="border rounded-lg p-4 text-center shadow hover:shadow-lg transition cursor-pointer"
            >
              <p className="font-semibold">{cat.name}</p>
            </Link>

          ))}
        </div>
      )}
    </main>
  );
}
