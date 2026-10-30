
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function AllEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const searchParams = useSearchParams();
  const filter = searchParams.get("filter");

  useEffect(() => {
    fetch("/api/events")
      .then((response) => response.json())
      .then((result) => {
        if (result.events) {
          setEvents(result.events);
        }
      })
      .catch((error) => {
        console.error("Failed to load events:", error);
      });
  }, []);

  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Accra",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

  const displayedEvents = events.filter((event) => {
    const eventDate = event.event_date ?? event.date ?? "";

    if (filter === "featured") {
  return event.is_featured === true || event.is_featured === "true";
}

    if (filter === "upcoming") {
      return eventDate > today;
    }

    return eventDate >= today;
  });

  return (
    <main style={{ width: "100%", maxWidth: "1400px", margin: "0 auto", padding: "32px 24px", boxSizing: "border-box" }}>
      <a
  href="/"
  style={{
    display: "inline-block",
    marginBottom: "20px",
    color: "#ff007f",
    textDecoration: "none",
    fontWeight: "600",
  }}
>
  ← Back to AccraEvents
</a>
      <h1>
        {filter === "featured"
          ? "Featured Events"
          : filter === "upcoming"
            ? "Upcoming Events"
            : "All Events"}
      </h1>

      {displayedEvents.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "24px",
          }}
        >
          {displayedEvents.map((event) => {
  const cardDate = event.event_date ?? event.date;
  const parsedDate = cardDate
    ? new Date(`${String(cardDate).slice(0, 10)}T12:00:00`)
    : null;

  const validDate =
    parsedDate && !Number.isNaN(parsedDate.getTime());

  return (
    <article
      key={event.id}
      className="small-event-card"
      onClick={() => {
        window.location.href = `/events/${event.slug}`;
      }}
      style={{ cursor: "pointer" }}
    >
      <div className="small-event-image">
        {event.image && (
          <img src={event.image} alt={event.title} />
        )}

        <div className="date-card">
          <strong>
            {validDate ? parsedDate.getDate() : "TBA"}
          </strong>
          <small>
            {validDate
              ? parsedDate
                  .toLocaleString("en-GB", {
                    month: "short",
                    timeZone: "Africa/Accra",
                  })
                  .toUpperCase()
              : ""}
          </small>
        </div>

        <div className="small-category">
          {event.category || "Other"}
        </div>
      </div>

      <div className="small-event-body">
        <h3>{event.title}</h3>

        <div>
          <span className="small-icon">⌖</span>
          {event.location}
        </div>

        <div>
          <span className="small-icon">◷</span>
          {event.event_time || event.time || "Time to be announced"}
        </div>

        <strong className={
          event.ticket_mode === "free" || event.price === "Free"
            ? "free"
            : ""
        }>
          {event.ticket_mode === "free" || event.price === "Free"
            ? "Free"
            : event.ticket_types?.length > 0
              ? `From GHC${Math.min(
                  ...event.ticket_types.map((ticket: any) =>
                    Number(ticket.price)
                  )
                )}`
              : event.ticket_link
                ? "Tickets"
                : event.price || "Tickets"}
        </strong>
      </div>
    </article>
  );
})}
        </div>
      )}
    </main>
  );
}
