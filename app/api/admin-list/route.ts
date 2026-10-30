import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import { createSupabaseServerClient } from "@/app/lib/supabaseServer";

export async function GET() {
  try {
    const supabaseServer = await createSupabaseServerClient();

    const {
      data: { user },
      error: authError,
    } = await supabaseServer.auth.getUser();

    if (
      authError ||
      !user ||
      user.email !== "ernestackom2@gmail.com"
    ) {
      return NextResponse.json(
        { error: "Not authorised to view events." },
        { status: 403 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("events")
      .select(`
        id,
        slug,
        title,
        category,
        event_date,
        event_time,
        location,
        description,
        image,
        ticket_mode,
        ticket_link,
        published,
        is_featured,
        ticket_types (
          id,
          name,
          price,
          total_quantity,
          sold_quantity
        )
      `)
      .order("event_date", { ascending: true });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ events: data });
  } catch {
    return NextResponse.json(
      { error: "Unable to load admin events." },
      { status: 500 }
    );
  }
}