
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import { supabase } from "@/app/lib/supabase";
import { createSupabaseServerClient } from "@/app/lib/supabaseServer";

export async function GET() {
  const { data, error } = await supabase
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
    .eq("published", true)
    .order("event_date", { ascending: true });

  if (error) {
    console.error("Failed to load events:", error.message);
    return NextResponse.json(
      { error: "Unable to load events" },
      { status: 500 }
    );
  }

  return NextResponse.json({ events: data });
}

export async function POST(request: Request) {
  try {
    const supabaseServer = await createSupabaseServerClient();

const {
  data: { user },
  error: authError,
} = await supabaseServer.auth.getUser();

if (authError || !user) {
  return NextResponse.json(
    { error: "Please sign in as an admin first." },
    { status: 401 }
  );
}
if (user.email !== "ernestackom2@gmail.com") {
  return NextResponse.json(
    { error: "You are not authorised to manage events." },
    { status: 403 }
  );
}
    const body = await request.json();

    const {
      title,
      slug,
      category,
      event_date,
      event_time,
      location,
      description,
      image,
      ticket_mode,
      ticket_link,
      ticket_types,
      is_featured
    } = body;

    if (!title || !slug || !event_date || !location) {
      return NextResponse.json(
        { error: "Title, slug, date and location are required." },
        { status: 400 }
      );
    }

    const { data: event, error } = await supabaseAdmin
      .from("events")
      .insert({
        title,
        slug,
        category,
        event_date,
        event_time,
        location,
        description,
        image,
        ticket_mode,
        ticket_link,
        published: true,
        is_featured: is_featured ?? false,
      })
      .select("id")
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    if (Array.isArray(ticket_types) && ticket_types.length > 0) {
      const rows = ticket_types.map((ticket: any) => ({
        event_id: event.id,
        name: ticket.name,
        price: Number(ticket.price),
        total_quantity: Number(ticket.total_quantity),
        sold_quantity: 0,
      }));

      const { error: ticketError } = await supabaseAdmin
        .from("ticket_types")
        .insert(rows);

      if (ticketError) {
        await supabaseAdmin.from("events").delete().eq("id", event.id);

        return NextResponse.json(
          { error: ticketError.message },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ success: true, event });
  } catch {
    return NextResponse.json(
      { error: "Unable to save event." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const supabaseServer = await createSupabaseServerClient();


    const {
      data: { user },
      error: authError,
    } = await supabaseServer.auth.getUser();

    if (authError || !user || user.email !== "ernestackom2@gmail.com") {
      return NextResponse.json(
        { error: "Not authorised to manage events." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      id,
      title,
      slug,
      category,
      event_date,
      event_time,
      location,
      description,
      image,
      ticket_mode,
      ticket_link,
      is_featured,
      published,
    } = body;

    if (!id || !title || !slug || !event_date || !location) {
      return NextResponse.json(
        { error: "Event ID, title, slug, date and location are required." },
        { status: 400 }
      );
    }

    const { data: event, error } = await supabaseAdmin
      .from("events")
      .update({
        title,
        slug,
        category,
        event_date,
        event_time,
        location,
        description,
        image,
        ticket_mode,
        ticket_link,
        is_featured: is_featured ?? false,
        ...(published !== undefined ? { published } : {}),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, event });
  } catch {
    return NextResponse.json(
      { error: "Unable to update event." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Event ID is required." },
        { status: 400 }
      );
    }

    const supabaseAdmin = (await import("@/app/lib/supabaseAdmin")).supabaseAdmin;

    const { count, error: bookingCheckError } = await supabaseAdmin
  .from("bookings")
  .select("id", { count: "exact", head: true })
  .eq("event_id", id);

if (bookingCheckError) {
  return NextResponse.json(
    { error: "Unable to check event bookings. Please try again." },
    { status: 500 }
  );
}

if (count && count > 0) {
  return NextResponse.json(
    { error: "This event has bookings and cannot be deleted. Please keep it or contact support." },
    { status: 409 }
  );
}
    const { data, error } = await supabaseAdmin
  .from("events")
  .delete()
  .eq("id", id)
  .select("id");

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
  return NextResponse.json(
    { error: "No event was deleted. The event may not exist or deletion was blocked." },
    { status: 404 }
  );
}

return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Unable to delete event." },
      { status: 500 }
    );
  }
}