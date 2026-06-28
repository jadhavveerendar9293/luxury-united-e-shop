import { useEffect } from "react";
import { useQuery, useQueryClient, queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import {
  type Category,
  type Product,
  computeDiscountPercent,
} from "./products";

interface ProductRow {
  id: string;
  slug: string;
  name: string;
  description: string;
  collection: string | null;
  category: string;
  sku: string | null;
  price: number | string;
  compare_at_price: number | string | null;
  images: string[] | null;
  details: string[] | null;
  stock: number;
  rating: number | string;
  reviews_count: number;
  popularity: number;
  is_featured: boolean;
  is_new_arrival: boolean;
  is_best_seller: boolean;
  created_at: string;
}

interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  tagline: string | null;
  sort_order: number;
}

interface CollectionRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
}

const toNum = (v: number | string | null | undefined, fallback = 0): number => {
  if (v === null || v === undefined) return fallback;
  return typeof v === "number" ? v : Number(v);
};

export function mapProduct(r: ProductRow): Product {
  const price = toNum(r.price);
  const compareAtPrice = r.compare_at_price === null ? null : toNum(r.compare_at_price);
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    description: r.description ?? "",
    collection: r.collection,
    category: r.category as Category,
    sku: r.sku,
    price,
    compareAtPrice,
    discountPercent: computeDiscountPercent(price, compareAtPrice),
    images: r.images ?? [],
    details: r.details ?? [],
    stock: r.stock,
    rating: toNum(r.rating),
    reviewsCount: r.reviews_count,
    popularity: r.popularity,
    isFeatured: r.is_featured,
    isNewArrival: r.is_new_arrival,
    isBestSeller: r.is_best_seller,
    createdAt: r.created_at,
  };
}

export interface CategoryData {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  tagline: string | null;
  sortOrder: number;
}

export interface CollectionData {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  sortOrder: number;
}

export function mapCategory(r: CategoryRow): CategoryData {
  return {
    id: r.id,
    name: r.name,
    slug: r.slug,
    description: r.description,
    imageUrl: r.image_url,
    tagline: r.tagline,
    sortOrder: r.sort_order,
  };
}

export function mapCollection(r: CollectionRow): CollectionData {
  return {
    id: r.id,
    name: r.name,
    slug: r.slug,
    description: r.description,
    imageUrl: r.image_url,
    sortOrder: r.sort_order,
  };
}

async function fetchAllProducts(): Promise<Product[]> {
  const { data, error } = await (supabase as any)
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as ProductRow[]).map(mapProduct);
}

async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await (supabase as any)
    .from("products")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data ? mapProduct(data as ProductRow) : null;
}

async function fetchCategories(): Promise<CategoryData[]> {
  const { data, error } = await (supabase as any)
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data as CategoryRow[]).map(mapCategory);
}

async function fetchCollections(): Promise<CollectionData[]> {
  const { data, error } = await (supabase as any)
    .from("collections")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data as CollectionRow[]).map(mapCollection);
}

export const productsQueryOptions = queryOptions({
  queryKey: ["products"],
  queryFn: fetchAllProducts,
  staleTime: 120_000,
  gcTime: 300_000,
});

export const productQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ["products", slug],
    queryFn: () => fetchProductBySlug(slug),
    staleTime: 30_000,
  });

export const categoriesQueryOptions = queryOptions({
  queryKey: ["categories"],
  queryFn: fetchCategories,
  staleTime: 300_000,
  gcTime: 600_000,
});

export const collectionsQueryOptions = queryOptions({
  queryKey: ["collections"],
  queryFn: fetchCollections,
  staleTime: 300_000,
  gcTime: 600_000,
});

export function useProducts() {
  return useQuery(productsQueryOptions);
}

export function useProduct(slug: string) {
  return useQuery(productQueryOptions(slug));
}

export function useCategories() {
  return useQuery(categoriesQueryOptions);
}

export function useCollections() {
  return useQuery(collectionsQueryOptions);
}

/**
 * Subscribes to product table changes once at app shell level and
 * invalidates the cache when anything changes. Drop it into the root layout.
 */
export function useProductsRealtime() {
  const qc = useQueryClient();
  useEffect(() => {
    const channel = supabase
      .channel("products-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products" },
        () => {
          qc.invalidateQueries({ queryKey: ["products"] });
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [qc]);
}

async function fetchWebsiteSettings(): Promise<Tables<"website_settings"> | null> {
  const { data, error } = await (supabase as any)
    .from("website_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();
  if (error) throw error;
  return data as Tables<"website_settings"> | null;
}

export const websiteSettingsQueryOptions = queryOptions({
  queryKey: ["websiteSettings"],
  queryFn: fetchWebsiteSettings,
  staleTime: 600_000,
  gcTime: 1_200_000,
});

export function useWebsiteSettings() {
  return useQuery(websiteSettingsQueryOptions);
}
