import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import sharp from "sharp";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// A plain Route Handler (native multipart/form-data POST), not a React
// Server Action. Uploads submitted through the server action's RPC wire
// format were coming out corrupted — every non-UTF8 byte replaced with the
// U+FFFD replacement character, the classic signature of binary data being
// forced through a text decode somewhere in that transport. This endpoint
// is covered by the same /admin/:path* proxy auth as the rest of the panel.
const IMAGE_SLOTS = 3;
const STORAGE_PATH_MARKER = "/tile-images/";

function storagePathFromUrl(url: string): string | null {
  const idx = url.indexOf(STORAGE_PATH_MARKER);
  if (idx === -1) return null;
  return url.slice(idx + STORAGE_PATH_MARKER.length);
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const id = String(formData.get("id") ?? "").trim();
  const redirectUrl = new URL("/admin", request.url);

  if (!id) return NextResponse.redirect(redirectUrl, { status: 303 });

  const admin = supabaseAdmin();
  const { data: existing, error: fetchErr } = await admin
    .from("products")
    .select("images")
    .eq("id", id)
    .single();
  if (fetchErr) return NextResponse.redirect(redirectUrl, { status: 303 });

  const next = [...((existing?.images as string[] | null) ?? [])];

  for (let i = 0; i < IMAGE_SLOTS; i++) {
    const file = formData.get(`image${i + 1}`);
    if (file instanceof File && file.size > 0) {
      const original = Buffer.from(await file.arrayBuffer());
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
      if (upErr) continue;

      const oldUrl = next[i];
      if (oldUrl) {
        const oldPath = storagePathFromUrl(oldUrl);
        if (oldPath) await admin.storage.from("tile-images").remove([oldPath]);
      }

      const { data: pub } = admin.storage.from("tile-images").getPublicUrl(path);
      next[i] = pub.publicUrl;
    }
  }

  await admin.from("products").update({ images: next.slice(0, IMAGE_SLOTS) }).eq("id", id);

  revalidatePath("/admin");
  revalidatePath("/");

  return NextResponse.redirect(redirectUrl, { status: 303 });
}
