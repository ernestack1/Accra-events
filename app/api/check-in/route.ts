import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import { createSupabaseServerClient } from "@/app/lib/supabaseServer";

export async function POST(request: NextRequest) {
      const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user || user.email !== "ernestackom2@gmail.com") {
    return NextResponse.json(
      { success: false, message: "Admin access required." },
      { status: 401 }
    );
  }
  try {
    const body = await request.json();
    const ticketCode =
      typeof body.ticketCode === "string" ? body.ticketCode.trim() : "";

    if (!ticketCode) {
      return NextResponse.json(
        { success: false, message: "Ticket code is required." },
        { status: 400 }
      );
    }

    const { data: ticket, error } = await supabaseAdmin
      .from("tickets")
      .select("id, ticket_code, status, booking_item_id")
      .eq("ticket_code", ticketCode)
      .maybeSingle();

    if (error) {
      console.error("Ticket lookup failed:", error.message);
      return NextResponse.json(
        { success: false, message: "Unable to verify ticket." },
        { status: 500 }
      );
    }

    if (!ticket) {
      return NextResponse.json(
        { success: false, message: "Invalid ticket. Ticket not found." },
        { status: 404 }
      );
    }

    if (ticket.status === "used") {
      return NextResponse.json(
        { success: false, message: "This ticket has already been used." },
        { status: 409 }
      );
    }

    if (ticket.status !== "valid") {
      return NextResponse.json(
        { success: false, message: "This ticket is not valid for entry." },
        { status: 409 }
      );
    }

    const { data: updatedTicket, error: updateError } = await supabaseAdmin
      .from("tickets")
      .update({
        status: "used",
        checked_in_at: new Date().toISOString(),
      })
      .eq("id", ticket.id)
      .eq("status", "valid")
      .select("ticket_code, status, checked_in_at")
      .maybeSingle();

    if (updateError) {
      console.error("Ticket check-in failed:", updateError.message);
      return NextResponse.json(
        { success: false, message: "Unable to complete check-in." },
        { status: 500 }
      );
    }

    if (!updatedTicket) {
      return NextResponse.json(
        { success: false, message: "Ticket already checked in. Entry denied." },
        { status: 409 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Ticket verified. Entry approved!",
      ticket: updatedTicket,
    });
  } catch (error) {
    console.error("Check-in error:", error);
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}