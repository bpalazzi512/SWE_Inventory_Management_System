"use client";
import type { Product } from "@/types";
import { ProductsTable } from "@/components/products/products-table";
import type { CategoryOption } from "@/components/products/create-product-modal";
import { useState, useEffect, useCallback } from "react";

const apiBase = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000/api";

async function fetchProducts(): Promise<Product[]> {
  const token = localStorage.getItem("token");
  const res = await fetch(`${apiBase}/products`, {
    cache: "no-store",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
  const data = await res.json();
  return (data as unknown[]).map((p: any) => ({
    id: p._id,
    name: p.name,
    sku: p.sku,
    description: "", // backend has no description field
    category: p.categoryId?.name ?? "",
    unitPrice: Number(p.price ?? 0),
  }));
}

async function fetchCategories(): Promise<CategoryOption[]> {
  const token = localStorage.getItem("token");
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
  let res = await fetch(`${apiBase}/categories`, {
    cache: "no-store",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) throw new Error(`Failed to fetch categories: ${res.status}`);
  let data: unknown[] = await res.json();

  const existingNames = new Set((data as any[]).map((c: any) => String(c.name)));
  const missing = defaultNames.filter((n) => !existingNames.has(n));

  // 2) Create missing categories (ignore conflicts if created elsewhere concurrently)
  if (missing.length > 0) {
    await Promise.all(
      missing.map((name) =>
        fetch(`${apiBase}/categories`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ name }),
        }).catch(() => undefined)
      )
    );
    // 3) Re-fetch to get ids of the now-complete set
    res = await fetch(`${apiBase}/categories`, {
      cache: "no-store",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (!res.ok) throw new Error(`Failed to fetch categories after seed: ${res.status}`);
    data = await res.json();
  }

  // 4) Return mapped options
  return ((data as any[])
    .filter((c) => defaultNames.includes(String(c.name)))
    .map((c) => ({ id: c._id, name: c.name })));
}

async function createProduct(data: {
  name: string;
  categoryId: string;
  location: string;
  price: number;
}): Promise<void> {
  const token = localStorage.getItem("token");
  const res = await fetch(`${apiBase}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error((errorData as any)?.error || `Request failed (${res.status})`);
  }
}

async function deleteProduct(productId: string): Promise<void> {
  const token = localStorage.getItem("token");
  const res = await fetch(`${apiBase}/products/${productId}`, {
    method: "DELETE",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error((errorData as any)?.error || `Failed to delete (${res.status})`);
  }
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const locations = ["Boston", "Seattle", "Oakland"];

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [productsData, categoriesData] = await Promise.all([
        fetchProducts(),
        fetchCategories(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleProductCreated = useCallback(async () => {
    // Refresh products after product is created
    await loadProducts();
  }, [loadProducts]);

  const handleCreateProduct = useCallback(
    async (data: {
      name: string;
      categoryId: string;
      location: string;
      price: number;
    }) => {
      try {
        await createProduct(data);
        // Refresh products after successful creation
        await loadProducts();
      } catch (e: unknown) {
        throw e; // Re-throw to let the modal handle the error
      }
    },
    [loadProducts]
  );

  const handleDeleteProduct = useCallback(
    async (productId: string) => {
      try {
        await deleteProduct(productId);
        // Refresh products after successful deletion
        await loadProducts();
      } catch (e: unknown) {
        throw e; // Re-throw to let the component handle the error
      }
    },
    [loadProducts]
  );

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen w-full bg-gray-50 p-8 flex flex-col items-center justify-center">
        <div className="text-gray-500">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 p-8 flex flex-col items-center">
      <div className="w-full max-w-6xl space-y-6">
        <h1 className="text-3xl font-semibold mb-6">Products</h1>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        <ProductsTable
          products={products}
          categories={categories}
          locations={locations}
          onCreateProduct={handleCreateProduct}
          onDeleteProduct={handleDeleteProduct}
          onProductCreated={handleProductCreated}
        />
      </div>
    </div>
  );
}