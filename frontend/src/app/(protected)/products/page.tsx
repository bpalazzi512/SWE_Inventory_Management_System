"use client";
import type { Product } from "@/types";
import { ProductsTable } from "@/components/products/products-table";
import type { CategoryOption } from "@/components/products/create-product-modal";
import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";

interface ApiProduct {
  _id: string;
  name: string;
  sku: string;
  categoryId?: { _id: string; name: string } | string;
  price: number;
  quantity: number;
}

interface ApiCategory {
  _id: string;
  name: string;
}

async function fetchProducts(): Promise<Product[]> {
  const data = await api.get<ApiProduct[]>("/products");
  return data.map((p) => ({
    id: p._id,
    name: p.name,
    sku: p.sku,
    description: "", // backend has no description field
    category: typeof p.categoryId === "object" && p.categoryId !== null && "name" in p.categoryId ? p.categoryId.name : "",
    unitPrice: Number(p.price ?? 0),
  }));
}

async function fetchCategories(): Promise<CategoryOption[]> {
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
  let data: ApiCategory[] = await api.get<ApiCategory[]>("/categories");

  const existingNames = new Set(data.map((c) => String(c.name)));
  const missing = defaultNames.filter((n) => !existingNames.has(n));

  // 2) Create missing categories (ignore conflicts if created elsewhere concurrently)
  if (missing.length > 0) {
    await Promise.all(
      missing.map((name) =>
        api.post("/categories", { name }).catch(() => undefined)
      )
    );
    // 3) Re-fetch to get ids of the now-complete set
    data = await api.get<ApiCategory[]>("/categories");
  }

  // 4) Return mapped options
  return data
    .filter((c) => defaultNames.includes(String(c.name)))
    .map((c) => ({ id: c._id, name: c.name }));
}

async function createProduct(data: {
  name: string;
  categoryId: string;
  location: string;
  price: number;
}): Promise<void> {
  await api.post("/products", data);
}

async function deleteProduct(productId: string): Promise<void> {
  await api.delete(`/products/${productId}`);
}

async function updateProduct(productId: string, data: {
  name?: string;
  categoryId?: string;
  location?: string;
  price?: number;
  description?: string;
}): Promise<void> {
  const token = localStorage.getItem("token");
  const res = await fetch(`${apiBase}/products/${productId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error((errorData as any)?.error || `Failed to update (${res.status})`);
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

  const handleUpdateProduct = useCallback(
    async (productId: string, data: {
      name?: string;
      categoryId?: string;
      location?: string;
      price?: number;
      description?: string;
    }) => {
      try {
        await updateProduct(productId, data);
        await loadProducts();
      } catch (e: unknown) {
        throw e;
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
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
          onProductCreated={handleProductCreated}
        />
      </div>
    </div>
  );
}