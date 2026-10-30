"use client";

import { useEffect, useState } from "react";
import { events } from "@/app/lib/events";
import { useParams } from "next/navigation";
import { supabase } from "@/app/lib/supabase";

export default function CheckoutPage() {
  const params = useParams();
const slug = params.slug as string;
const event = events[slug];
const [ticketTypes, setTicketTypes] = useState<any[]>([]);
const [ticketEvent, setTicketEvent] = useState<any>(null);
useEffect(() => {
  async function loadTicketTypes() {
    const { data: eventData, error: eventError } = await supabase
      .from("events")
      .select("id")
      .eq("slug", slug)
      .eq("published", true)
      .single();

    if (eventError || !eventData) {
  console.error("Unable to load event:", {
    slug,
    eventError,
    eventData,
  });
  alert(
    `Unable to load event "${slug}". ${
      eventError?.message || "Event not found or not published."
    }`
  );
  return;
}
setTicketEvent(eventData);
    const { data: tickets, error: ticketsError } = await supabase
      .from("ticket_types")
      .select("id, name, price, total_quantity, sold_quantity")
      .eq("event_id", eventData.id);

    if (ticketsError) {
      console.error("Unable to load ticket types:", ticketsError);
      return;
    }

    setTicketTypes(
      (tickets || []).map((ticket) => ({
        ...ticket,
        available: ticket.total_quantity - ticket.sold_quantity,
      }))
    );
  }

  loadTicketTypes();
}, [slug]);

  const searchParams =
  typeof window !== "undefined"
    ? new URLSearchParams(window.location.search)
    : null;
    const paymentReference = searchParams?.get("reference");
const [paymentStatus, setPaymentStatus] = useState("");
useEffect(() => {
  if (!paymentReference) return;

  async function verifyPayment() {
    try {
      const response = await fetch("/api/paystack/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference: paymentReference }),
      });

      const data = await response.json();
      setPaymentStatus(
        data.status === "payment_successful" || data.status === "paid"
          ? "Payment successful"
          : data.status === "abandoned" || data.status === "failed"
            ? "Payment was not completed"
            : data.message || "Checking payment status..."
      );
    } catch {
      setPaymentStatus("Unable to verify payment right now.");
    }
  }

  verifyPayment();
}, [paymentReference]);
const quantities = Object.fromEntries(
  ticketTypes.map((ticket) => [
    ticket.name,
    Number(searchParams?.get(ticket.name.toLowerCase()) || 0),
  ])
);

const totalTickets = Object.values(quantities).reduce<number>(
  (sum, quantity) => sum + Number(quantity),
  0
);

const total = ticketTypes.reduce((sum, ticket) => {
  return sum + ticket.price * (quantities[ticket.name] || 0);
}, 0);
  const [paymentMethod, setPaymentMethod] = useState("Mobile Money");

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <header
        style={{
          height: "72px",
          background: "#071b3a",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 5%",
        }}
      >
        <a
          href="/"
          style={{
            color: "white",
            textDecoration: "none",
            fontSize: "24px",
            fontWeight: "700",
          }}
        >
          Accra<span style={{ color: "#ff0080" }}>Events</span>
        </a>

        <a
          href="/events/accra-music-night/tickets"
          style={{
            color: "white",
            textDecoration: "none",
            fontWeight: "600",
          }}
        >
          ← Back to Tickets
        </a>
      </header>

      <section
        style={{
          maxWidth: "1000px",
          margin: "40px auto",
          padding: "0 24px",
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "40px",
            boxShadow: "0 10px 35px rgba(0,0,0,0.08)",
          }}
        >
          <span
            style={{
              display: "inline-block",
              background: "#ff0080",
              color: "white",
              padding: "8px 16px",
              borderRadius: "20px",
              fontWeight: "700",
              fontSize: "14px",
            }}
          >
            Checkout
          </span>

          <h1
            style={{
              color: "#071b3a",
              fontSize: "36px",
              marginTop: "20px",
            }}
          >
            Complete your booking
          </h1>

          <p style={{ color: "#666", fontSize: "16px" }}>
  {ticketEvent?.title || event?.title || slug} ·{" "}
  {ticketEvent?.event_date
    ? new Date(ticketEvent.event_date + "T12:00:00").toLocaleDateString(
        "en-GB",
        { day: "numeric", month: "long", year: "numeric" }
      )
    : ""}
</p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "40px",
              marginTop: "35px",
            }}
          >
            <div>
              <h2 style={{ color: "#071b3a" }}>Your details</h2>

              <label
                style={{
                  display: "block",
                  marginTop: "20px",
                  marginBottom: "8px",
                  fontWeight: "600",
                }}
              >
                Full name
              </label>

              <input
                type="text"
                placeholder="Enter your full name"
                style={{
                  width: "100%",
                  padding: "14px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  fontSize: "15px",
                  boxSizing: "border-box",
                }}
              />

              <label
                style={{
                  display: "block",
                  marginTop: "20px",
                  marginBottom: "8px",
                  fontWeight: "600",
                }}
              >
                Email address
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                style={{
                  width: "100%",
                  padding: "14px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  fontSize: "15px",
                  boxSizing: "border-box",
                }}
              />

              <label
                style={{
                  display: "block",
                  marginTop: "20px",
                  marginBottom: "8px",
                  fontWeight: "600",
                }}
              >
                Phone number
              </label>

              <input
                type="tel"
                placeholder="024 XXX XXXX"
                style={{
                  width: "100%",
                  padding: "14px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  fontSize: "15px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <h2 style={{ color: "#071b3a" }}>Payment method</h2>

              <button
                onClick={() => setPaymentMethod("Mobile Money")}
                style={{
                  width: "100%",
                  padding: "16px",
                  marginTop: "20px",
                  borderRadius: "10px",
                  border:
                    paymentMethod === "Mobile Money"
                      ? "2px solid #ff0080"
                      : "1px solid #ddd",
                  background: "white",
                  textAlign: "left",
                  cursor: "pointer",
                  fontWeight: "700",
                }}
              >
                📱 Mobile Money
                <div
                  style={{
                    fontWeight: "400",
                    color: "#666",
                    marginTop: "5px",
                  }}
                >
                  MTN MoMo, Telecel Cash or AT Money
                </div>
              </button>

              <button
                onClick={() => setPaymentMethod("Card")}
                style={{
                  width: "100%",
                  padding: "16px",
                  marginTop: "12px",
                  borderRadius: "10px",
                  border:
                    paymentMethod === "Card"
                      ? "2px solid #ff0080"
                      : "1px solid #ddd",
                  background: "white",
                  textAlign: "left",
                  cursor: "pointer",
                  fontWeight: "700",
                }}
              >
                💳 Card
                <div
                  style={{
                    fontWeight: "400",
                    color: "#666",
                    marginTop: "5px",
                  }}
                >
                  Visa or Mastercard
                </div>
              </button>

              <div
                style={{
                  background: "#f5f7fb",
                  borderRadius: "10px",
                  padding: "20px",
                  marginTop: "25px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "12px",
                  }}
                >
                  <strong>
  {totalTickets} tickets
</strong>
                </div>

                <div
                  style={{
                    borderTop: "1px solid #ddd",
                    paddingTop: "15px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <strong>Total</strong>
                  <strong
                    style={{
                      fontSize: "22px",
                      color: "#071b3a",
                    }}
                  >
                    GHS {total}
                  </strong>
                </div>
              </div>

              <button
              onClick={async () => {
  const emailInput = document.querySelector(
    'input[placeholder="Enter your email"]'
  ) as HTMLInputElement | null;

  const email = emailInput?.value;

  if (!email) {
    alert("Please enter your email address.");
    return;
  }

  try {
    const response = await fetch("/api/paystack/initialize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
  email,
  amount: total,
  eventSlug: slug,
  quantities,
}),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      alert(data.error || "Unable to start payment.");
      return;
    }

    window.location.href = data.authorization_url;
  } catch (error) {
    console.error(error);
    alert("Something went wrong while starting payment.");
  }
}}
                style={{
                  width: "100%",
                  border: "none",
                  background: "#ff0080",
                  color: "white",
                  padding: "16px",
                  marginTop: "20px",
                  borderRadius: "10px",
                  fontSize: "17px",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                Pay GHS {total}
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}