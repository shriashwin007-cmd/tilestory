"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import sharp from "sharp";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { supabaseServer } from "@/lib/supabase/server";

const STORAGE_PATH_MARKER = "/tile-images/";

function storagePathFromUrl(url: string): string | null {
  const idx = url.indexOf(STORAGE_PATH_MARKER);
  if (idx === -1) return null;
  return url.slice(idx + STORAGE_PATH_MARKER.length);
}

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

const IMAGE_SLOTS = 3;

export async function uploadProductImages(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  if (!id) throw new Error("Missing product id.");

  const admin = supabaseAdmin();
  const { data: existing, error: fetchErr } = await admin
    .from("products")
    .select("images")
    .eq("id", id)
    .single();
  if (fetchErr) throw fetchErr;

  const next = [...((existing?.images as string[] | null) ?? [])];

  for (let i = 0; i < IMAGE_SLOTS; i++) {
    const file = formData.get(`image${i + 1}`);
    if (file instanceof File && file.size > 0) {
      const original = Buffer.from(await file.arrayBuffer());
      // Downscale + re-encode as webp: uploaded photos are often several MB
      // straight off a phone camera, which made the catalog/admin sluggish.
      const compressed = await sharp(original)
        .rotate()
        .resize({ width: 1200, height: 1200, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 78 })
        .toBuffer();

      const path = `${id}/slot-${i + 1}-${Date.now()}.webp`;
      const { error: upErr } = await admin.storage.from("tile-images").upload(path, compressed, {
        contentType: "image/webp",
        upsert: true,
      });
      if (upErr) throw upErr;

      const oldUrl = next[i];
      if (oldUrl) {
        const oldPath = storagePathFromUrl(oldUrl);
        if (oldPath) await admin.storage.from("tile-images").remove([oldPath]);
      }

      const { data: pub } = admin.storage.from("tile-images").getPublicUrl(path);
      next[i] = pub.publicUrl;
    }
  }

  const { error } = await admin
    .from("products")
    .update({ images: next.slice(0, IMAGE_SLOTS) })
    .eq("id", id);
  if (error) throw error;

  revalidatePath("/admin");
  revalidatePath("/");
}

export async function removeProductImage(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  const slot = Number(formData.get("slot"));
  if (!id || !slot) throw new Error("Missing id or slot.");

  const admin = supabaseAdmin();
  const { data: existing, error: fetchErr } = await admin
    .from("products")
    .select("images")
    .eq("id", id)
    .single();
  if (fetchErr) throw fetchErr;

  const next = [...((existing?.images as string[] | null) ?? [])];
  const url = next[slot - 1];
  if (url) {
    const path = storagePathFromUrl(url);
    if (path) await admin.storage.from("tile-images").remove([path]);
  }
  next[slot - 1] = "";

  const { error } = await admin.from("products").update({ images: next }).eq("id", id);
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
