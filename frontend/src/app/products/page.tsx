import type { Product } from "@/types";
import { ProductsTable } from "@/components/products/products-table";
import type { CategoryOption } from "@/components/products/create-product-modal";

async function fetchProducts(): Promise<Product[]> {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000/api";
  const res = await fetch(`${apiBase}/products`, { next: { revalidate: 0 } });
  if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
  const data = await res.json();
  return (data as any[]).map((p) => ({
    id: p._id,
    name: p.name,
    sku: p.sku,
    description: "", // backend has no description field
    category: p.categoryId?.name ?? "",
    unitPrice: Number(p.price ?? 0),
  }));
}

async function fetchCategories(): Promise<CategoryOption[]> {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000/api";
  // Ensure the standard set of categories exist (matching the previous UI options)
  const defaultNames = [
    "Routers",
    "Switches",
    "Access Points",
    "Transcievers", // keep spelling as previously used in the project
    "Cables",
    "Accessories",
    "Power Supplies",
    "Tools",
  ];

  // 1) Fetch existing categories
  let res = await fetch(`${apiBase}/categories`, { next: { revalidate: 0 } });
  if (!res.ok) throw new Error(`Failed to fetch categories: ${res.status}`);
  let data: any[] = await res.json();

  const existingNames = new Set(data.map((c: any) => String(c.name)));
  const missing = defaultNames.filter((n) => !existingNames.has(n));

  // 2) Create missing categories (ignore conflicts if created elsewhere concurrently)
  if (missing.length > 0) {
    await Promise.all(
      missing.map((name) =>
        fetch(`${apiBase}/categories`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        }).catch(() => undefined)
      )
    );
    // 3) Re-fetch to get ids of the now-complete set
    res = await fetch(`${apiBase}/categories`, { next: { revalidate: 0 } });
    if (!res.ok) throw new Error(`Failed to fetch categories after seed: ${res.status}`);
    data = await res.json();
  }

  // 4) Return mapped options
  return (data as any[])
    .filter((c) => defaultNames.includes(String(c.name)))
    .map((c) => ({ id: c._id, name: c.name }));
}

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([fetchProducts(), fetchCategories()]);
  const locations = ["Boston", "Seattle", "Oakland"];

  return (
    <div className="min-h-screen w-full bg-gray-50 p-8 flex flex-col items-center">
      <div className="w-full max-w-6xl space-y-6">
        <h1 className="text-3xl font-semibold mb-6">Products</h1>
        <ProductsTable products={products} categories={categories} locations={locations} />
      </div>
    </div>
  );
}