
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const reference =
      typeof body.reference === "string" ? body.reference.trim() : "";
    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!reference || !email) {
      return NextResponse.json(
        { error: "Payment reference and email are required." },
        { status: 400 }
      );
    }

    const { data: booking, error: bookingError } = await supabaseAdmin
      .from("bookings")
      .select("id, paystack_reference, customer_email, status")
      .eq("paystack_reference", reference)
      .maybeSingle();

    if (bookingError) {
      console.error("Ticket booking lookup failed:", bookingError.message);
      return NextResponse.json(
        { error: "Unable to retrieve tickets." },
        { status: 500 }
      );
    }

    if (
      !booking ||
      booking.customer_email?.trim().toLowerCase() !== email
    ) {
      return NextResponse.json(
        { error: "Booking not found for those details." },
        { status: 404 }
      );
    }

    if (booking.status !== "paid") {
      return NextResponse.json(
        { error: "This booking has not been confirmed as paid." },
        { status: 409 }
      );
    }

    const { data: items, error: itemsError } = await supabaseAdmin
      .from("booking_items")
      .select("id, quantity, unit_price")
      .eq("booking_id", booking.id);

    if (itemsError) {
      console.error("Ticket items lookup failed:", itemsError.message);
      return NextResponse.json(
        { error: "Unable to retrieve ticket items." },
        { status: 500 }
      );
    }

    const itemIds = (items ?? []).map((item) => item.id);

    if (itemIds.length === 0) {
      return NextResponse.json({ tickets: [] });
    }

    const { data: tickets, error: ticketsError } = await supabaseAdmin
      .from("tickets")
      .select("ticket_code, status, created_at, booking_item_id")
      .in("booking_item_id", itemIds);

    if (ticketsError) {
      console.error("Ticket lookup failed:", ticketsError.message);
      return NextResponse.json(
        { error: "Unable to retrieve tickets." },
        { status: 500 }
      );
    }

    return NextResponse.json({ tickets: tickets ?? [] });
  } catch (error) {
    console.error("My Tickets API error:", error);
    return NextResponse.json(
      { error: "Unable to retrieve tickets." },
      { status: 500 }
    );
  }
}
