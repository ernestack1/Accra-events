"use client";
import React from "react";
import { events } from "./lib/events";
const categories = [
  { name: "Music", icon: "♫", colour: "pink" },
  { name: "Shows", icon: "◉", colour: "purple" },
  { name: "Business", icon: "▣", colour: "blue" },
  { name: "Food & Drinks", icon: "🍴", colour: "orange" },
  { name: "Sports", icon: "⚡", colour: "green" },
  { name: "Arts & Culture", icon: "✦", colour: "yellow" },
  { name: "Religious", icon: "⌂", colour: "red" },
  { name: "Family", icon: "♟", colour: "violet" },
  { name: "Education", icon: "▥", colour: "grey" },
  { name: "Exhibitions", icon: "▥", colour: "grey" },
  { name: "Comedy", icon: "◉", colour: "purple" },
  { name: "Kids", icon: "🧸", colour: "green" },
{ name: "House Party", icon: "🎉", colour: "pink" },
];

const featuredEvents = [
  {
    date: "24",
    month: "OCT",
    title: "Accra Music Night",
    category: "Music",
    location: "Grand Arena, Accra",
    time: "7:00 PM – 11:00 PM",
    price: "From GH₵100",
    image:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=900&q=85",
  },
  {
    date: "28",
    month: "OCT",
    title: "Accra Business Summit 2026",
    category: "Business",
    location: "Labadi Beach Hotel",
    time: "9:00 AM",
    price: "From GH₵250",
    image:
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=900&q=85",
  },
  {
    date: "02",
    month: "NOV",
    title: "Accra Food Festival",
    category: "Food & Drinks",
    location: "Efua Sutherland Park",
    time: "10:00 AM",
    price: "From GH₵50",
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85",
  },
  {
    date: "14",
    month: "NOV",
    title: "Accra Comedy Live",
    category: "Shows",
    location: "National Theatre",
    time: "6:00 PM",
    price: "From GH₵80",
    image:
      "https://images.unsplash.com/photo-1527224857830-43a7acc85260?auto=format&fit=crop&w=900&q=85",
  },
];

const upcomingEvents = [
  {
    date: "18",
    month: "OCT",
    title: "Accra Art Exhibition",
    category: "Arts & Culture",
    location: "Accra Mall",
    time: "10:00 AM – 5:00 PM",
    price: "Free",
    image:
      "https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&w=800&q=85",
  },
  {
    date: "20",
    month: "OCT",
    title: "Tech in Ghana Conference",
    category: "Business",
    location: "Movenpick Hotel, Accra",
    time: "9:00 AM",
    price: "From GH₵300",
    image:
      "https://images.unsplash.com/photo-1503428593586-e225b39bddfe?auto=format&fit=crop&w=800&q=85",
  },
  {
    date: "25",
    month: "OCT",
    title: "Accra Fashion Weekend",
    category: "Parties",
    location: "Marina Mall, Accra",
    time: "4:00 PM",
    price: "From GH₵150",
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=85",
  },
];


function Heart() {
  return <span className="heart">♡</span>;
}

function LocationIcon() {
  return <span className="small-icon">⌖</span>;
}
function getAccraDateKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Accra",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  return `${year}-${month}-${day}`;
}

export default function Home() {
const [selectedCategory, setSelectedCategory] = React.useState("");
  const [adminEvents, setAdminEvents] = React.useState<any[]>([]);
  const [selectedDate, setSelectedDate] = React.useState("");
const [searchQuery, setSearchQuery] = React.useState("");
const todayKey = getAccraDateKey();

const today = new Date(`${todayKey}T12:00:00Z`);
const dayOfWeek = today.getUTCDay();

const daysUntilSaturday = (6 - dayOfWeek + 7) % 7;
const daysSinceSaturday = (dayOfWeek + 1) % 7;
const weekendOffset = dayOfWeek === 0 || dayOfWeek === 6
  ? -daysSinceSaturday
  : daysUntilSaturday;

const weekendStart = new Date(today);
weekendStart.setUTCDate(today.getUTCDate() + weekendOffset);

const weekendEnd = new Date(weekendStart);
weekendEnd.setUTCDate(weekendStart.getUTCDate() + 1);

const weekendStartKey = getAccraDateKey(weekendStart);
const weekendEndKey = getAccraDateKey(weekendEnd);
const promotedEvents = adminEvents.filter(
  (event: any) => event.is_featured === true
);
const todayEvents = adminEvents.filter(
  (event) => event.date === todayKey
);

const thisWeekendEvents = adminEvents.filter((event) => {
  const eventDate = String(event.date ?? "");
  return eventDate >= weekendStartKey && eventDate <= weekendEndKey;
});

const upcomingDatabaseEvents = adminEvents.filter((event: any) => {
  const eventDate = String(event.event_date ?? event.date ?? "");
  return eventDate > todayKey;
});
const freeEvents = adminEvents
  .filter((event: any) => {
    const ticketMode = String(
      event.ticket_mode ?? event.ticketMode ?? ""
    ).toLowerCase();

    const eventDate = String(
      event.event_date ?? event.date ?? ""
    );

    return ticketMode === "free" && eventDate >= todayKey;
  })
  .sort((a: any, b: any) => {
    const dateA = String(a.event_date ?? a.date ?? "");
    const dateB = String(b.event_date ?? b.date ?? "");
    return dateA.localeCompare(dateB);
  })
  .slice(0, 5);
  
React.useEffect(() => {
  fetch("/api/events")
    .then((response) => response.json())
    .then((result) => {
      if (result.events) {
        setAdminEvents(
          result.events.map((event: any) => ({
  ...event,
  date: event.event_date,
  time: event.event_time,
  is_featured: event.is_featured,
  ticket_types: event.ticket_types,
ticket_mode: event.ticket_mode,
}))
        );
      }
    })
    .catch((error) => {
    console.log("HOMEPAGE EVENTS:", adminEvents);
      console.error("Failed to load events:", error);
    });
}, []);


  return (
    <main className="site">

      {/* ================= HEADER ================= */}
      <header className="topbar">
        <div className="logo">
          Accra<span>Events</span>
        </div>

        <nav className="nav">
          <a className="active" href="#">Home</a>
          <a href="/events/all">Events</a>
          <a href="/about">About</a>
        </nav>

        <div className="header-actions">         
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="hero">

        <div className="hero-background" />

        <div className="hero-overlay" />

        <div className="hero-content">

          <div className="location-pill">
            ● &nbsp; Accra, Ghana
          </div>

          <h1>
            What&apos;s happening
            <br />
            in <span>Accra?</span>
          </h1>

          <p>
            Discover events, programmes and experiences
            <br />
            happening around Accra.
          </p>

          <div className="search-box">

           <div className="search-input">
  <span>⌕</span>
  <input
    type="text"
    placeholder="Search events or venues..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />
</div>

            <div className="location-select">
              <span>⌖</span>
              <span>Accra</span>
              <span className="arrow">⌄</span>
            </div>

            <button className="search-button">
              Search
            </button>

          </div>

          <div className="quick-filters">
            <button onClick={() => document.getElementById("today-events")?.scrollIntoView({ behavior: "smooth" })}>
  Today
</button>
            <button onClick={() => document.getElementById("weekend-events")?.scrollIntoView({ behavior: "smooth" })}>
  This Weekend
</button>
            <button onClick={() => document.getElementById("free-events")?.scrollIntoView({ behavior: "smooth" })}>
  Free Events
</button>
          </div>

        </div>
      </section>

      {/* ================= MAIN ================= */}
      <section className="main-wrapper">

        {/* CATEGORY ROW */}
        <div
  className="category-row"
  style={{
    display: "flex",
    flexWrap: "nowrap",
    overflowX: "auto",
    gap: "24px",
  }}
>
          {categories.map((category) => (
            <div
  className={`category ${selectedCategory === category.name ? "selected" : ""}`}
  key={category.name}
  onClick={() => setSelectedCategory(category.name)}
  style={{ cursor: "pointer" }}
>
              <div className={`category-circle ${category.colour}`}>
                {category.icon}
              </div>
              <div className="category-name">
                {category.name}
              </div>
            </div>
          ))}
        </div>

        <div className="content-layout">

          {/* ================= LEFT CONTENT ================= */}
          <div className="main-content">

            {/* FEATURED */}
            <section className="section">
              <div className="section-heading">
                <h2>
                  <span className="pink-line" />
                  Featured Events
                </h2>

                <a href="/events/all?filter=featured">View All →</a>
              </div>

<div className="mb-6 flex flex-wrap items-center gap-3">
  <label htmlFor="event-date" className="font-semibold">
    Find events by date:
  </label>
  <input
    id="event-date"
    type="date"
    value={selectedDate}
    onChange={(e) => setSelectedDate(e.target.value)}
    className="rounded-lg border border-gray-300 px-4 py-2"
  />
  {selectedDate && (
    <button
      type="button"
      onClick={() => setSelectedDate("")}
      className="text-pink-600 underline"
    >
      Clear date
    </button>
  )}
</div>
              <div className="featured-grid">
                {adminEvents.filter((event: any) => event.is_featured)
  .filter((event) => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return true;

    return (
      event.title?.toLowerCase().includes(query) ||
      event.location?.toLowerCase().includes(query)
    );
  })
  
.filter((event) => {
if (
  selectedCategory &&
  event.category?.toLowerCase() !== selectedCategory.toLowerCase()
) {
  return false;
}
  if (!selectedDate) return true;

  const months: Record<string, string> = {
    JAN: "01", FEB: "02", MAR: "03", APR: "04",
    MAY: "05", JUN: "06", JUL: "07", AUG: "08",
    SEP: "09", OCT: "10", NOV: "11", DEC: "12",
  };

  const rawDate = String(event.date ?? "").trim();
  let formattedDate = "";

  if (/^\d{4}-\d{2}-\d{2}$/.test(rawDate)) {
    formattedDate = rawDate;
  } else {
    const day = rawDate.match(/\d+/)?.[0];
    const month = String(event.month ?? "").toUpperCase().slice(0, 3);

    if (day && months[month]) {
      formattedDate = `${new Date().getFullYear()}-${months[month]}-${day.padStart(2, "0")}`;
    } else {
      const parsed = new Date(rawDate);
      if (!Number.isNaN(parsed.getTime())) {
        formattedDate = [
          parsed.getFullYear(),
          String(parsed.getMonth() + 1).padStart(2, "0"),
          String(parsed.getDate()).padStart(2, "0"),
        ].join("-");
      }
    }
  }

  return formattedDate === selectedDate;
})

  .map((event) => (
                  <article
  className="event-card"
  key={event.id ?? `${event.title}-${event.date}-${event.location}`}
  onClick={() =>
    (window.location.href = `/events/${event.title
      .toLowerCase()
      .replaceAll(" ", "-")}`)
  }
>

                    <div className="event-image-wrapper">

                      {event.image ? (
  <img
    src={event.image}
    alt={event.title}
    className="event-image"
  />
) : (
  <div className="event-image" />
)}

                      <div className="date-card">
  <strong>
    {event.date.includes("-")
      ? event.date.split("-")[2]
      : event.date}
  </strong>
  <small>
    {event.date.includes("-")
      ? new Date(`${event.date}T12:00:00`).toLocaleString("en-GB", {
          month: "short",
        }).toUpperCase()
      : event.month}
  </small>
</div>


                       <div className="event-category">
  {event.category || "Events"}
</div>

                    </div>

                    <div className="event-card-body">

                      <h3>{event.title}</h3>

                      <div className="event-detail">
                        <LocationIcon />
                        {event.location}
                      </div>

                      <div className="event-detail">
                        <span className="small-icon">◷</span>
                        {event.time}
                      </div>

                      <div className="event-price">
  {event.ticket_mode === "free" || event.price === "Free"
    ? "Free"
    : event.ticket_types?.length > 0
      ? `From GHC${Math.min(
          ...event.ticket_types.map((ticket: any) => Number(ticket.price))
        )}`
      : event.ticket_link
        ? "Tickets"
        : event.price || "Tickets"}
</div>

                    </div>

                  </article>
                ))}
              </div>
            </section>


            {/* ================= UPCOMING ================= */}
            <section id="upcoming-events" className="section upcoming-section">

              <div className="section-heading">
                <h2>
                  <span className="pink-line" />
                  Upcoming Events
                </h2>

                <a href="/events/all?filter=upcoming">View All →</a>
              </div>

              

              <div className="upcoming-grid">

            {upcomingDatabaseEvents
  .filter((event: any) => !selectedCategory || event.category === selectedCategory)
  .map((event: any) => (                 <article
  className="small-event-card"
  key={event.id}
  onClick={() => {
    window.location.href = `/events/${event.slug}`;
  }}
  style={{ cursor: "pointer" }}
>

                    <div className="small-event-image">

                      {event.image ? (
  <img
    src={event.image}
    alt={event.title}
  />
) : (
  <div className="small-event-image" />
)}

                     <div className="date-card">
  <strong>
    {String(event.date).includes("-")
      ? String(event.date).split("-")[2]
      : String(event.date).split(" ")[0]}
  </strong>
  <small>
    {String(event.date).includes("-")
      ? new Date(`${event.date}T12:00:00`).toLocaleString("en-GB", {
          month: "short",
          timeZone: "Africa/Accra",
        }).toUpperCase()
      : String(event.month || "").slice(0, 3).toUpperCase()}
  </small>
</div>

                      <div className="small-category">
                        {event.category}
                      </div>

                    </div>

                    <div className="small-event-body">

                      <h3>{event.title}</h3>

                      <div>
                        <LocationIcon />
                        {event.location}
                      </div>

                      <div>
                        <span className="small-icon">◷</span>
                        {event.time}
                      </div>

                     <strong className={
  event.ticket_mode === "free" ||
  event.price === "Free"
    ? "free"
    : ""
}>
  {event.ticket_mode === "free"
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
                ))}

              </div>

            </section>


            {/* ================= BOTTOM BANNER ================= */}
            <section className="bottom-banner">

              <div className="banner-background" />

              <div className="banner-content">
                <h2>
                  Never miss what&apos;s happening in Accra.
                </h2>

                <p>
                  Save your favourites and keep track of events
                  you&apos;re registered for.
                </p>
              </div>

              <button onClick={() => {
  window.location.href = "/events/all";
}}>
  Explore Events →
</button>

            </section>

          <section id="today-events" className="section">
  <div className="section-heading">
    <h2>
      <span className="pink-line" />
      Happening Today
    </h2>
  </div>
  <div className="featured-grid">
  {todayEvents.map((event: any) => (
    
<article
  className="event-card"
  key={event.id}
  onClick={() => {
    window.location.href = `/events/${event.slug}`;
  }}
  style={{ cursor: "pointer" }}
>
  <div className="event-image-wrapper">
    {event.image && (
      <img
        src={event.image}
        alt={event.title}
        className="event-image"
      />
    )}

    <div className="date-card">
      <strong>
        {event.date?.includes("-")
          ? event.date.split("-")[2]
          : event.date}
      </strong>
      <small>
        {event.date?.includes("-")
          ? new Date(`${event.date}T12:00:00`)
              .toLocaleString("en-GB", { month: "short" })
              .toUpperCase()
          : event.month}
      </small>
    </div>

    <div className="event-category">
      {event.category || "Events"}
    </div>
  </div>

  <div className="event-card-body">
    <h3>{event.title}</h3>
    <div className="event-detail">
      {event.location}
    </div>
    <div className="event-detail">
      {event.time}
    </div>
   <div className="event-price">
  {event.ticket_mode === "free"
    ? "Free"
    : event.ticket_types?.length > 0
      ? `From GHC${Math.min(...event.ticket_types.map((ticket: any) => Number(ticket.price))) }`
      : event.ticket_link
        ? "Tickets"
        : "Tickets"}
</div>
  </div>
</article>

  ))}
  {todayEvents.length === 0 && (
    <p>No events happening today. Check back soon!</p>
  )}
</div>
</section>
<section id="weekend-events" className="section">
  <div className="section-heading">
    <h2>
      <span className="pink-line" />
      This Weekend
    </h2>
  </div>

  <div className="featured-grid">
    {thisWeekendEvents.map((event: any) => (
      
<article
  className="event-card"
  key={event.id}
  onClick={() => {
    window.location.href = `/events/${event.slug}`;
  }}
  style={{ cursor: "pointer" }}
>
  <div className="event-image-wrapper">
    {event.image && (
      <img
        src={event.image}
        alt={event.title}
        className="event-image"
      />
    )}

    <div className="date-card">
      <strong>
        {event.date?.includes("-")
          ? event.date.split("-")[2]
          : event.date}
      </strong>
      <small>
        {event.date?.includes("-")
          ? new Date(`${event.date}T12:00:00`)
              .toLocaleString("en-GB", { month: "short" })
              .toUpperCase()
          : event.month}
      </small>
    </div>

    <div className="event-category">
      {event.category || "Events"}
    </div>
  </div>

  <div className="event-card-body">
    <h3>{event.title}</h3>
    <div className="event-detail">{event.location}</div>
    <div className="event-detail">{event.time}</div>
    <div className="event-price">
  {event.ticket_mode === "free"
    ? "Free"
    : event.ticket_types?.length > 0
      ? `From GHC${Math.min(...event.ticket_types.map((ticket: any) => Number(ticket.price)))}`
      : "Tickets"}
</div>
  </div>
</article>

    ))}

    {thisWeekendEvents.length === 0 && (
      <p>No events listed for this weekend yet.</p>
    )}
  </div>
</section>
          </div>


          {/* ================= RIGHT SIDEBAR ================= */}
          <aside className="sidebar">


            {/* POPULAR CATEGORIES */}
            <div className="side-card">

              <div className="side-heading">
                <h3>
                  ▣ &nbsp; Popular Categories
                </h3>
              </div>

             <div className="popular-grid">
  {categories.map(({ name, icon, colour }) => (
    <div
  className={`popular-item ${selectedCategory === name ? "selected" : ""}`}
  key={name}
  onClick={() =>
  setSelectedCategory(selectedCategory === name ? "" : name)
}
  style={{ cursor: "pointer" }}
>
      <div className={`mini-circle ${colour}`}>
        {icon}
      </div>
      <span>{name}</span>
    </div>
  ))}
</div>
</div>

            {/* ORGANISER */}
            <div className="organiser-card">

              <div className="organiser-background" />

              <div className="organiser-content">

                <div className="organiser-label">
                  ● &nbsp; Event Organisers
                </div>

                <h3>
                  List your event
                  <br />
                  with AccraEvents
                </h3>

                <p>
                  Get your event in front of thousands.
                  We review every event before it goes live.
                </p>

               <a href="https://wa.me/233257512491" target="_blank" rel="noopener noreferrer">
  Contact Us →
</a>

              </div>

            </div>


            {/* FREE EVENTS */}
            <div id="free-events" className="side-card free-events-card">

              <div className="side-heading">
                <h3>
                  <span className="free-dot">●</span>
                  Free Events This Week
                </h3>

                <a href="#upcoming-events">View All →</a>
              </div>

              {freeEvents.map((event) => (
                <div
  className="free-event"
  key={event.title}
  onClick={() => {
    window.location.href = `/events/${event.slug || event.id}`;
  }}
  style={{ cursor: "pointer" }}
>

                  {event.image ? (
  <img
    src={event.image}
    alt={event.title}
  />
) : (
  <div className="free-event-image" />
)}

                  <div className="free-event-info">
                    <strong>{event.title}</strong>
                    <span>
                      {event.event_date || event.date} · {event.event_time || event.time}
                    </span>
                    <span>
                      ⌖ {event.location}
                    </span>
                  </div>

                  <span className="free-badge">
                    Free
                  </span>

                </div>
              ))}

            </div>

          </aside>

        </div>

      </section>

    </main>
  );
}