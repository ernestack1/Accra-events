"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { events } from "@/app/lib/events";

export default function EventPage() {

  type EventWithTicketing = {
  ticketMode?: "free" | "internal" | "external";
  ticketLink?: string;
};
  const params = useParams();
  const [isFavourite, setIsFavourite] = useState(false);
  const slug = params.slug as string;

  const savedEvents =
  typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("accraEvents") || "[]")
    : [];

const savedEvent = savedEvents.find(
  (item: any) =>
    item.title
      .toLowerCase()
      .replaceAll(" ", "-") === slug
);

const [event, setEvent] = useState<any>(null);
const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/events")
      .then((response) => response.json())
      .then((result) => {
        const foundEvent = result.events?.find(
          (item: any) => item.slug === slug
        );
        setEvent(
  foundEvent
    ? {
        ...foundEvent,
        ticketMode: foundEvent.ticketMode ?? foundEvent.ticket_mode,
        ticketLink: foundEvent.ticketLink ?? foundEvent.ticket_link,
        date: foundEvent.date ?? foundEvent.event_date,
        time: foundEvent.time ?? foundEvent.event_time,
      }
    : savedEvent ?? events[slug as keyof typeof events]
);
      })
      .catch(() => {
        setEvent(savedEvent ?? events[slug as keyof typeof events]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [slug]);

  if (isLoading) {
  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      Loading event...
    </main>
  );
}

if (!event) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h1>Event not found</h1>
          <p>This event does not exist.</p>
          <a href="/" style={{ color: "#ff0080" }}>
            ← Back to AccraEvents
          </a>
        </div>
      </main>
    );
  }

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
    padding: "0 4%",
    gap: "30px",
  }}
>
  <a
    href="/"
    style={{
      color: "white",
      textDecoration: "none",
      fontSize: "24px",
      fontWeight: "800",
      whiteSpace: "nowrap",
    }}
  >
    Accra<span style={{ color: "#ff0080" }}>Events</span>
  </a>

  <nav
    style={{
      display: "flex",
      alignItems: "center",
      gap: "28px",
      flex: 1,
      justifyContent: "center",
    }}
  >
    <a href="/" style={{ color: "white", textDecoration: "none" }}>
      Home
    </a>

    <a href="/" style={{ color: "white", textDecoration: "none" }}>
      Events
    </a>

    <a href="/" style={{ color: "white", textDecoration: "none" }}>
      Categories
    </a>

    <a href="/" style={{ color: "white", textDecoration: "none" }}>
      About
    </a>
  </nav>

  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "10px",
      whiteSpace: "nowrap",
    }}
  >
    <button
      style={{
        background: "transparent",
        border: "none",
        color: "white",
        fontSize: "20px",
        cursor: "pointer",
      }}
    >
      ♡
    </button>

    <a
      href="/"
      style={{
        color: "white",
        textDecoration: "none",
        padding: "10px 16px",
        border: "1px solid rgba(255,255,255,0.35)",
        borderRadius: "9px",
        fontWeight: "600",
      }}
    >
      My Events
    </a>

    <a
      href="/"
      style={{
        color: "white",
        textDecoration: "none",
        padding: "10px 16px",
        border: "1px solid rgba(255,255,255,0.35)",
        borderRadius: "9px",
        fontWeight: "600",
      }}
    >
      Login
    </a>

    <a
      href="/"
      style={{
        background: "#ff0080",
        color: "white",
        textDecoration: "none",
        padding: "11px 18px",
        borderRadius: "9px",
        fontWeight: "700",
      }}
    >
      Sign Up
    </a>
  </div>
</header>

      <section
        style={{
          maxWidth: "1200px",
          margin: "20px auto",
          padding: "0 24px",
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: "0 10px 35px rgba(0,0,0,0.08)",
          }}
        >
          <img
            src={event.image}
            alt={event.title}
            style={{
              width: "100%",
              height: "420px",
              objectFit: "cover",
              display: "block",
            }}
          />

          <div style={{ padding: "40px" }}>
            <span
              style={{
                display: "inline-block",
                background: "#ff0080",
                color: "white",
                padding: "7px 14px",
                borderRadius: "20px",
                fontSize: "13px",
                fontWeight: "700",
              }}
            >
              {event.category}
            </span>

            <h1
              style={{
                fontSize: "42px",
                color: "#071b3a",
                margin: "18px 0 25px",
              }}
            >
              {event.title}
            </h1>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "20px",
                marginBottom: "30px",
              }}
            >
              <div>
                <strong>📅 Date</strong>
                <p>{event.date || event.event_date || "Date to be announced"}</p>
              </div>

              <div>
                <strong>🕐 Time</strong>
                <p>{event.time || event.event_time || "Time to be announced"}</p>
              </div>

              <div>
                <strong>📍 Location</strong>
                <p>{event.location}</p>
              </div>
            </div>

            <hr style={{ border: 0, borderTop: "1px solid #eee" }} />

            <h2 style={{ color: "#071b3a", marginTop: "30px" }}>
              About this event
            </h2>

            <p
              style={{
                color: "#555",
                fontSize: "17px",
                lineHeight: "1.8",
                maxWidth: "800px",
              }}
            >
              {event.description}
            </p>

            <div
              style={{
                marginTop: "35px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "20px",
                flexWrap: "wrap",
              }}
            >
              <div>
  <small style={{ color: "#777" }}>Tickets</small>

  <div
    style={{
      display: "flex",
      gap: "10px",
      flexWrap: "wrap",
      marginTop: "10px",
    }}
  >
    {(event as any).ticketTypes?.map((ticket: any) => (
      <div
        key={ticket.name}
        style={{
          border: "1px solid #eee",
          borderRadius: "10px",
          padding: "10px 14px",
          background: "#fafafa",
          minWidth: "120px",
        }}
      >
        <strong style={{ color: "#071b3a" }}>
          {ticket.name}
        </strong>

        <div
          style={{
            color: "#ff0080",
            fontWeight: "700",
            marginTop: "4px",
          }}
        >
          GHS {ticket.price}
        </div>
      </div>
    ))}
  </div>
</div>

              <div style={{ display: "flex", gap: "12px" }}>

                <button
  onClick={() => {
  const start = "20261024T190000";
  const end = "20261024T230000";

  const calendarUrl =
    `https://calendar.google.com/calendar/render?action=TEMPLATE` +
    `&text=${encodeURIComponent(event.title)}` +
    `&dates=${start}/${end}` +
    `&details=${encodeURIComponent(event.description)}` +
    `&location=${encodeURIComponent(event.location)}`;

  window.open(calendarUrl, "_blank");
}}
  style={{
                    border: "1px solid #ddd",
                    background: "white",
                    padding: "14px 22px",
                    borderRadius: "10px",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                >
                  📅 Add to Calendar
                </button>

                <button
                onClick={() => {
  if (event.ticketMode === "external" && event.ticketLink) {
    window.location.href = event.ticketLink;
  } else if (event.ticketMode === "internal") {
    window.location.href = `/events/${slug}/tickets`;
  }
}}
                  style={{
                    border: "none",
                    background: "#ff0080",
                    color: "white",
                    padding: "14px 28px",
                    borderRadius: "10px",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                >
                  Buy Tickets
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}