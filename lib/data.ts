import "server-only";
import { supabaseAdmin } from "./supabaseAdmin";
import type { Product } from "./products";

export type Review = {
  id: string;
  name: string;
  text: string;
  rating: number;
};

export type Enquiry = {
  id: string;
  name: string;
  phone: string;
  message: string | null;
  created_at: string;
};

type ProductRow = {
  id: string;
  name: string;
  category: string;
  colors: string[];
  finish: string;
  size: string;
  use_cases: string[];
  description: string;
  image: string;
  tags: string[];
};

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabaseAdmin()
    .from("products")
    .select("*")
    .order("id");
  if (error) throw error;
  return (data as ProductRow[]).map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    colors: p.colors,
    finish: p.finish,
    size: p.size,
    use: p.use_cases,
    desc: p.description,
    image: p.image,
    tags: p.tags,
  }));
}

export async function getReviews(): Promise<Review[]> {
  const { data, error } = await supabaseAdmin()
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Review[];
}

export async function getEnquiries(): Promise<Enquiry[]> {
  const { data, error } = await supabaseAdmin()
    .from("enquiries")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Enquiry[];
}
