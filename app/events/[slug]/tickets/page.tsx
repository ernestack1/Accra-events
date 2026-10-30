"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { events } from "@/app/lib/events";

export default function TicketsPage() {
  const params = useParams();
  const slug = params.slug as string;
  console.log("CURRENT TICKET SLUG:", slug);
  
const [event, setEvent] = useState<any>(null);

const [ticketTypes, setTicketTypes] = useState<any[]>([]);

useEffect(() => {
  let active = true;

  fetch("/api/events")
    .then((response) => response.json())
    .then((result) => {
      if (!active) return;
console.log("TICKET PAGE URL SLUG:", slug);
console.log("API EVENT SLUGS:", result.events?.map((item: any) => item.slug));

      const foundEvent = result.events?.find(
  (item: any) =>
    String(item.slug || "").trim().toLowerCase() ===
    String(slug || "").trim().toLowerCase()
);

      const selectedEvent = foundEvent
        ? {
            ...foundEvent,
            ticketMode: foundEvent.ticketMode ?? foundEvent.ticket_mode,
            ticketLink: foundEvent.ticketLink ?? foundEvent.ticket_link,
            date: foundEvent.date ?? foundEvent.event_date,
            time: foundEvent.time ?? foundEvent.event_time,
            ticketTypes: foundEvent.ticketTypes ?? foundEvent.ticket_types ?? [],
          }
        : events[slug as keyof typeof events];

      setEvent(selectedEvent ?? null);
      console.log("SELECTED TICKET EVENT:", selectedEvent?.title, selectedEvent?.slug);

      setTicketTypes(
        selectedEvent?.ticketMode === "internal"
          ? (selectedEvent.ticketTypes || [])
              .filter(
                (ticket: any) =>
                  ticket.name?.trim() && Number(ticket.price) > 0
              )
              .map((ticket: any) => ({
                ...ticket,
                price: Number(ticket.price),
                available: Number(ticket.available) || 0,
              }))
          : []
      );
    })
    .catch((error) => {
      console.error("Failed to load ticket event:", error);

      if (active) {
        setEvent(events[slug as keyof typeof events] ?? null);
        setTicketTypes([]);
      }
    });

  return () => {
    active = false;
  };
}, [slug]);

 const [quantities, setQuantities] = useState<Record<string, number>>(() =>
  Object.fromEntries(
    ticketTypes.map((ticket, index) => [
      ticket.name,
      index === 0 ? 1 : 0,
    ])
  )
);

  const updateQuantity = (
    ticketName: string,
change: number
  ) => {
    setQuantities((current) => {
     const currentQuantity = Number(current[ticketName] || 0);

const selectedTicket = ticketTypes.find(
  (ticket) => ticket.name === ticketName
);

const available = Number(selectedTicket?.available || 0);

const newQuantity = Math.max(
  0,
  Math.min(available, currentQuantity + change)
);

      return {
        ...current,
        [ticketName]: newQuantity,
      };
    });
  };

  const total = ticketTypes.reduce((sum, ticket) => {
  return sum + ticket.price * (quantities[ticket.name] || 0);
}, 0);

  const totalTickets = ticketTypes.reduce((sum, ticket) => {
  return sum + (quantities[ticket.name] || 0);
}, 0);

  const continueToPayment = () => {
    const params = new URLSearchParams();

ticketTypes.forEach((ticket) => {
  params.set(
    ticket.name.toLowerCase(),
    String(quantities[ticket.name] || 0)
  );
});

params.set("total", String(total));

    window.location.href =
  `/events/${slug}/tickets/checkout?${params.toString()}`;
  };

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
          href={`/events/${slug}`}
          style={{
            color: "white",
            textDecoration: "none",
            fontWeight: "600",
          }}
        >
          ← Back to Event
        </a>
      </header>

      <div
        style={{
          maxWidth: "950px",
          margin: "40px auto",
          padding: "0 20px",
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "40px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
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
            Tickets
          </span>

          <h1
            style={{
              color: "#071b3a",
              fontSize: "38px",
              margin: "20px 0 10px",
            }}
          >
            {event?.title || "Event Tickets"}
          </h1>

          <p
            style={{
              color: "#555",
              fontSize: "16px",
              marginBottom: "35px",
            }}
          >
            {event?.date || event?.event_date} · {event?.time || event?.event_time}
          </p>

          <div
            style={{
              borderTop: "1px solid #e5e5e5",
            }}
          >
            {ticketTypes.map((ticket) => {
              const quantity =
                quantities[ticket.name as keyof typeof quantities];

              return (
                <div
                  key={ticket.name}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "28px 0",
                    borderBottom: "1px solid #e5e5e5",
                  }}
                >
                  <div>
                    <h2
                      style={{
                        margin: "0 0 8px",
                        color: "#071b3a",
                        fontSize: "20px",
                      }}
                    >
                      {ticket.name} Ticket
                    </h2>

                    <p
                      style={{
                        margin: 0,
                        color: "#666",
                      }}
                    >
                      GHS {ticket.price} per ticket
                    </p>

                    <p
                      style={{
                        margin: "6px 0 0",
                        color: "#999",
                        fontSize: "13px",
                      }}
                    >
                    </p>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "18px",
                    }}
                  >
                    <button
                      onClick={() =>
                        updateQuantity(
                          ticket.name as "Regular" | "VIP" | "VVIP",
                          -1
                        )
                      }
                      disabled={quantity === 0}
                      style={{
                        width: "40px",
                        height: "40px",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        background: "white",
                        fontSize: "20px",
                        cursor: quantity === 0 ? "not-allowed" : "pointer",
                      }}
                    >
                      −
                    </button>

                    <span
                      style={{
                        minWidth: "20px",
                        textAlign: "center",
                        fontWeight: "700",
                        fontSize: "18px",
                      }}
                    >
                      {quantity}
                    </span>

                    <button
                      onClick={() =>
                        updateQuantity(
                          ticket.name as "Regular" | "VIP" | "VVIP",
                          1
                        )
                      }
                      disabled={quantity >= ticket.available}
                      style={{
                        width: "40px",
                        height: "40px",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        background: "white",
                        fontSize: "20px",
                        cursor:
                          quantity >= ticket.available
                            ? "not-allowed"
                            : "pointer",
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "32px",
            }}
          >
            <div>
              <strong
                style={{
                  display: "block",
                  color: "#071b3a",
                  fontSize: "18px",
                }}
              >
                Total Tickets
              </strong>

              <span style={{ color: "#666" }}>
                {totalTickets} ticket{totalTickets !== 1 ? "s" : ""}
              </span>
            </div>

            <div
              style={{
                color: "#071b3a",
                fontSize: "28px",
                fontWeight: "700",
              }}
            >
              GHS {total}
            </div>
          </div>

          <button
            onClick={continueToPayment}
            disabled={totalTickets === 0}
            style={{
              width: "100%",
              marginTop: "28px",
              padding: "17px",
              border: "none",
              borderRadius: "10px",
              background:
                totalTickets === 0 ? "#ccc" : "#ff0080",
              color: "white",
              fontSize: "16px",
              fontWeight: "700",
              cursor:
                totalTickets === 0 ? "not-allowed" : "pointer",
            }}
          >
            Continue to Payment
          </button>
        </div>
      </div>
    </main>
  );
}