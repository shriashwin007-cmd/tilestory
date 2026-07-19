import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const phone = typeof body?.phone === "string" ? body.phone.trim() : "";
  const message = typeof body?.message === "string" ? body.message.trim() : "";

  if (!name || !phone) {
    return NextResponse.json({ error: "Name and phone are required." }, { status: 400 });
  }

  const { error } = await supabaseAdmin()
    .from("enquiries")
    .insert({ name, phone, message: message || null });

  if (error) {
    return NextResponse.json({ error: "Could not save enquiry." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
