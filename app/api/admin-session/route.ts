import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/app/lib/supabaseServer";

export async function GET() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user || user.email !== "ernestackom2@gmail.com") {
    return NextResponse.json(
      { isAdmin: false },
      { status: 401 }
    );
  }

  return NextResponse.json({
    isAdmin: true,
    email: user.email,
  });
}