import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { song, link, name } = await req.json().catch(() => ({}));
  const ok = song && /^https?:\/\/((www|m)\.)?(youtube\.com|youtu\.be)\//.test(link ?? "");
  if (!ok) return NextResponse.json({ ok: false }, { status: 400 });
  console.log("Remaster request:", { song, link, name });
  // TODO: forward to email (Resend), Supabase, Google Sheets, etc.
  return NextResponse.json({ ok: true });
}
