import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { email, eventSlug, quantities } = body;

    if (!email || !eventSlug || !quantities) {
      return NextResponse.json(
        { error: "Email and amount are required." },
        { status: 400 }
      );
    }

    const secretKey = process.env.PAYSTACK_SECRET_KEY;

    if (!secretKey) {
      return NextResponse.json(
        { error: "Paystack secret key is not configured." },
        { status: 500 }
      );
    }

    const { data: event, error: eventError } = await supabaseAdmin
  .from("events")
  .select("id, title")
  .eq("slug", eventSlug)
  .eq("published", true)
  .single();

if (eventError || !event) {
  return NextResponse.json(
    { error: "Event not found or unavailable." },
    { status: 404 }
  );
}

if (
  !quantities ||
  typeof quantities !== "object" ||
  Array.isArray(quantities)
) {
  return NextResponse.json(
    { error: "Invalid ticket quantities." },
    { status: 400 }
  );
}

const { data: ticketTypes, error: ticketError } = await supabaseAdmin
  .from("ticket_types")
  .select("id, name, price, total_quantity, sold_quantity")
  .eq("event_id", event.id);

if (ticketError || !ticketTypes) {
  return NextResponse.json(
    { error: "Unable to verify ticket prices." },
    { status: 500 }
  );
}

let totalAmount = 0;
let totalTickets = 0;
const selectedTickets: { id: string; name: string; quantity: number; price: number }[] = [];

for (const [ticketName, rawQuantity] of Object.entries(quantities)) {
  const quantity = Number(rawQuantity);

  if (!Number.isInteger(quantity) || quantity < 0) {
    return NextResponse.json(
      { error: "Invalid ticket quantity." },
      { status: 400 }
    );
  }

  if (quantity === 0) continue;

  const ticket = ticketTypes.find((item) => item.name === ticketName);

  if (!ticket) {
    return NextResponse.json(
      { error: `Ticket type "${ticketName}" was not found.` },
      { status: 400 }
    );
  }

  if (ticket.total_quantity - ticket.sold_quantity < quantity) {
    return NextResponse.json(
      { error: `Not enough ${ticket.name} tickets available.` },
      { status: 400 }
    );
  }

selectedTickets.push({
  id: ticket.id,
  name: ticket.name,
  quantity,
  price: Number(ticket.price),
});
  totalAmount += Number(ticket.price) * quantity;
  totalTickets += quantity;
}

if (totalTickets === 0 || totalAmount <= 0) {
  return NextResponse.json(
    { error: "Please select at least one paid ticket." },
    { status: 400 }
  );
}

const stockReservations: { ticketTypeId: string; quantity: number }[] =
  selectedTickets.map((ticket) => ({
    ticketTypeId: ticket.id,
    quantity: ticket.quantity,
  }));
const amountInPesewas = Math.round(totalAmount * 100);

    const response = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
  email,
  amount: amountInPesewas,
  currency: "GHS",
  callback_url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://marvelous-maker-cupid.ngrok-free.dev"}/payment`,
  channels: ["card", "mobile_money"],
  metadata: {
  eventSlug,
  quantities,
  stockReservations,
},
}),
      }
    );

    const data = await response.json();

    if (!response.ok || !data.status) {
      return NextResponse.json(
        {
          error: data.message || "Unable to initialize Paystack payment.",
        },
        { status: 400 }
      );
    }

    const reference = data.data.reference;

const { error: bookingError } = await supabaseAdmin
  .from("bookings")
  .insert({
    event_id: event.id,
    customer_email: email,
    paystack_reference: reference,
    quantity: totalTickets,
    amount: totalAmount,
    status: "pending",
  });

if (bookingError) {
  console.error("Unable to create booking:", bookingError);

  return NextResponse.json(
    { error: "Payment was initialised, but the booking could not be saved. Please contact support before trying again." },
    { status: 500 }
  );
}
const { data: savedBooking, error: savedBookingError } =
  await supabaseAdmin
    .from("bookings")
    .select("id")
    .eq("paystack_reference", reference)
    .single();

if (savedBookingError || !savedBooking) {
  console.error("Unable to find saved booking:", savedBookingError);
  return NextResponse.json(
    { error: "Booking was created, but its ticket details could not be saved." },
    { status: 500 }
  );
}

const { error: itemsError } = await supabaseAdmin
  .from("booking_items")
  .insert(
    selectedTickets.map((ticket) => ({
      booking_id: savedBooking.id,
      ticket_type_id: ticket.id,
      quantity: ticket.quantity,
      unit_price: ticket.price,
    }))
  );

if (itemsError) {
  console.error("Unable to save booking items:", itemsError);
  return NextResponse.json(
    { error: "Booking was created, but its ticket details could not be saved." },
    { status: 500 }
  );
}

return NextResponse.json({
  success: true,
  authorization_url: data.data.authorization_url,
  access_code: data.data.access_code,
  reference,
});
  } catch (error) {
    console.error("Paystack initialization error:", error);

    return NextResponse.json(
      { error: "Something went wrong while starting payment." },
      { status: 500 }
    );
  }
}