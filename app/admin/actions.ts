"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { supabaseServer } from "@/lib/supabase/server";

function parseList(value: FormDataEntryValue | null): string[] {
  return String(value ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function upsertProduct(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  if (!id) throw new Error("Product ID is required.");

  const { error } = await supabaseAdmin().from("products").upsert({
    id,
    name: String(formData.get("name") ?? "").trim(),
    category: String(formData.get("category") ?? "").trim(),
    finish: String(formData.get("finish") ?? "").trim(),
    size: String(formData.get("size") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    image: String(formData.get("image") ?? "").trim() || "placeholder.jpg",
    colors: parseList(formData.get("colors")),
    use_cases: parseList(formData.get("use_cases")),
    tags: parseList(formData.get("tags")),
  });
  if (error) throw error;

  revalidatePath("/admin");
  revalidatePath("/");
}

export async function deleteProduct(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const { error } = await supabaseAdmin().from("products").delete().eq("id", id);
  if (error) throw error;

  revalidatePath("/admin");
  revalidatePath("/");
}

export async function addReview(formData: FormData) {
  const { error } = await supabaseAdmin().from("reviews").insert({
    name: String(formData.get("name") ?? "").trim(),
    text: String(formData.get("text") ?? "").trim(),
    rating: Number(formData.get("rating") ?? 5),
  });
  if (error) throw error;

  revalidatePath("/admin");
  revalidatePath("/");
}

export async function deleteReview(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const { error } = await supabaseAdmin().from("reviews").delete().eq("id", id);
  if (error) throw error;

  revalidatePath("/admin");
  revalidatePath("/");
}

export async function deleteEnquiry(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const { error } = await supabaseAdmin().from("enquiries").delete().eq("id", id);
  if (error) throw error;

  revalidatePath("/admin");
}

export async function signOut() {
  const supabase = await supabaseServer();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
