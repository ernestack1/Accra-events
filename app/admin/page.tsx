"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
type TicketType = {
  name: string;
  price: string;
  available: string;
};

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [existingEvents, setExistingEvents] = useState<any[]>([]);
const [adminEmail, setAdminEmail] = useState("");
const [adminPassword, setAdminPassword] = useState("");
const [eventCategory, setEventCategory] = useState("");
const [customCategory, setCustomCategory] = useState("");
useEffect(() => {
  let active = true;

  fetch("/api/admin-session")
    .then(async (response) => {
      if (!active) return;

      if (response.ok) {
        const result = await response.json();
        setIsLoggedIn(result.isAdmin);
        setAdminEmail(result.email || "");
      } else {
        setIsLoggedIn(false);
      }
    })
    .catch(() => {
      if (active) setIsLoggedIn(false);
    });

  return () => {
    active = false;
  };
}, []);

useEffect(() => {
  let active = true;

  fetch("/api/admin-list")
    .then((response) => response.json())
    .then((result) => {
      if (active && result.events) {
        setExistingEvents(result.events);
      }
    })
    .catch((error) => {
      console.error("Failed to load existing events:", error);
    });

  return () => {
    active = false;
  };
}, []);
const [loginError, setLoginError] = useState("");


async function handleAdminLogin() {
  setLoginError("");

  try {
    const response = await fetch("/api/admin-login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: adminEmail,
        password: adminPassword,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      setLoginError(result.error || "Unable to sign in.");
      return;
    }

    setIsLoggedIn(true);
    setAdminPassword("");
    window.location.reload();
  } catch {
    setLoginError("Unable to sign in. Please try again.");
  }
}

  const [activeView, setActiveView] = useState("dashboard");
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventVenue, setEventVenue] = useState("");
  const [eventImage, setEventImage] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([
  {
    name: "Regular",
    price: "",
    available: "",
  },
]);
  const [ticketLink, setTicketLink] = useState("");
  const [ticketMode, setTicketMode] = useState<
  "free" | "internal" | "external"
>("internal");
  const [eventDescription, setEventDescription] = useState("");
const [editingEventId, setEditingEventId] = useState<string | null>(null);
  

async function handleSaveEvent() {
  if (!eventTitle || !eventDate || !eventVenue) {
    alert("Please fill in the event title, date and venue.");
    return;
  }

  const slug = eventTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const validTickets =
    ticketMode === "internal"
      ? ticketTypes
          .filter(
            (ticket) =>
              ticket.name.trim() &&
              Number(ticket.price) > 0 &&
              Number(ticket.available) > 0
          )
          .map((ticket) => ({
            name: ticket.name.trim(),
            price: Number(ticket.price),
            total_quantity: Number(ticket.available),
          }))
      : [];

  if (ticketMode === "internal" && validTickets.length === 0) {
    alert("Add at least one ticket type with a valid price and availability.");
    return;
  }


  const newEvent = {
    id: "",
    title: eventTitle,
    date: eventDate,
    time: eventTime,
    location: eventVenue,
    image: eventImage,
    ticketTypes,
    price:
      ticketMode === "free"
        ? "Free"
        : ticketMode === "external"
          ? "See ticket website"
          : `From GH₵${Math.min(
              ...validTickets.map((ticket) => ticket.price)
            )}`,
    ticketMode,
    ticketLink,
    is_featured: isFeatured,
    description: eventDescription,
  };

  try {
    const response = await fetch("/api/events", {
      method: editingEventId ? "PATCH" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: editingEventId,
        title: eventTitle,
        slug,
        category: eventCategory === "Other" ? customCategory.trim() : eventCategory,
        event_date: eventDate,
        event_time: eventTime,
        location: eventVenue,
        description: eventDescription,
        image: eventImage,
        ticket_mode: ticketMode,
        ticket_link: ticketLink,
        ticket_types: validTickets,
        is_featured: isFeatured,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      alert(result.error || "Unable to save event.");
      return;
    }

    newEvent.id = result.event.id;

    alert("Event saved successfully to Supabase!");

    setEditingEventId(null);
  } catch (error) {
    console.error("Error saving event:", error);
    alert("Unable to save event. Please check that your server is running.");
  }
}



  if (!isLoggedIn) {
  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#f5f7fb",
      fontFamily: "Arial, sans-serif",
      padding: "20px",
    }}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAdminLogin();
        }}
        style={{
          background: "white",
          padding: "35px",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <h1>AccraEvents Admin</h1>
        <p>Sign in to manage events.</p>

        <input
          type="email"
          placeholder="Admin email"
          value={adminEmail}
          onChange={(e) => setAdminEmail(e.target.value)}
          required
          style={{ width: "100%", padding: "12px", marginBottom: "12px" }}
        />

        <input
          type="password"
          placeholder="Password"
          value={adminPassword}
          onChange={(e) => setAdminPassword(e.target.value)}
          required
          style={{ width: "100%", padding: "12px", marginBottom: "12px" }}
        />

        {loginError && <p style={{ color: "red" }}>{loginError}</p>}

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            background: "#c2185b",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Sign In
        </button>
      </form>
    </main>
  );
}

return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "40px 20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "#111827",
            color: "white",
            padding: "28px 30px",
            borderRadius: "16px",
            marginBottom: "25px",
          }}
        >
          <div
            style={{
              fontSize: "14px",
              color: "#ff4fa3",
              fontWeight: "700",
              marginBottom: "8px",
            }}
          >
            ACCRAEVENTS ADMIN
            <button
  onClick={async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setAdminPassword("");
  }}
  style={{
    background: "#ff4fa3",
    color: "white",
    padding: "8px 16px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    marginTop: "10px",
  }}
>
  Sign Out
</button>
          </div>

          
      {/* Admin Navigation */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          marginBottom: "25px",
        }}
      >
        {[
          { id: "dashboard", label: "Dashboard" },
          { id: "add-event", label: "Add Event" },
          { id: "existing-events", label: "Existing Events" },
          { id: "organisers", label: "Organisers" },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            style={{
              background:
                activeView === item.id ? "#ec4899" : "white",
              color: activeView === item.id ? "white" : "#111827",
              border: "1px solid #e5e7eb",
              borderRadius: "10px",
              padding: "12px 18px",
              cursor: "pointer",
              fontWeight: "700",
            }}
          >
            {item.label}
          </button>
        ))}
      </div>


          <h1
            style={{
              margin: 0,
              fontSize: "30px",
            }}
          >
            Event Management
          </h1>

          <p
            style={{
              margin: "8px 0 0",
              color: "#cbd5e1",
            }}
          >
            Add and manage events that appear on AccraEvents.
          </p>
        </div>

      {activeView === "dashboard" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "16px",
            marginBottom: "25px",
          }}
        >
          {[
            { label: "Published Events", value: "—" },
            { label: "Registered Users", value: "—" },
            { label: "Tickets Sold", value: "—" },
            { label: "Total Revenue", value: "—" },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                background: "white",
                borderRadius: "14px",
                padding: "22px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
              }}
            >
              <div style={{ color: "#64748b", fontSize: "14px" }}>
                {stat.label}
              </div>
              <div
                style={{
                  color: "#111827",
                  fontSize: "28px",
                  fontWeight: "800",
                  marginTop: "10px",
                }}
              >
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      )}

        {/* Add Event */}
        <div
  style={{
    display: activeView === "add-event" ? "block" : "none",
    background: "white",
            borderRadius: "16px",
            padding: "30px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              fontSize: "22px",
              color: "#111827",
            }}
          >
            Add New Event
          </h2>

          {/* Event Title */}
          <label
            style={{
              display: "block",
              fontWeight: "700",
              marginBottom: "8px",
              marginTop: "20px",
            }}
          >
            Event Title
          </label>

          <input
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
            placeholder="e.g. Accra Music Night"
            style={inputStyle}
          />

          
{/* Event Image URL */}
<label
  style={{
    display: "block",
    fontWeight: "700",
    marginTop: "20px",
    marginBottom: "8px",
  }}
>
  Event Image URL
</label>

<input
  type="file"
  accept="image/*"
  onChange={async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = `${Date.now()}-${file.name}`;

    const formData = new FormData();
formData.append("file", file);

const response = await fetch("/api/admin-upload-flyer", {
  method: "POST",
  body: formData,
});

const result = await response.json();

if (!response.ok) {
  alert("Upload failed: " + result.error);
  return;
}

setEventImage(result.url);
alert("Flyer uploaded successfully!");
  }}
  style={inputStyle}
/>

{/* Event Category */}
<label
  style={{
    display: "block",
    fontWeight: "700",
    marginTop: "20px",
    marginBottom: "8px",
  }}
>
  Event Category
</label>

<select
  value={eventCategory}
  onChange={(e) => setEventCategory(e.target.value)}
  style={inputStyle}
  required
>
  <option value="">Select an event category</option>
  <option value="Music">Music</option>
  <option value="Shows">Shows</option>
  <option value="Business">Business</option>
  <option value="Food & Drinks">Food & Drinks</option>
  <option value="Sports">Sports</option>
  <option value="Arts & Culture">Arts & Culture</option>
  <option value="Religious">Religious</option>
  <option value="Family">Family</option>
  <option value="Education">Education</option>
  <option value="Exhibitions">Exhibitions</option>
  <option value="Other">Other</option>
  
</select>
{eventCategory === "Other" && (
  <input
    type="text"
    placeholder="Enter your event category"
    value={customCategory}
    onChange={(e) => setCustomCategory(e.target.value)}
    style={inputStyle}
    required
  />
)}

          {/* Date and Time */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontWeight: "700",
                  marginBottom: "8px",
                  marginTop: "20px",
                }}
              >
                Date
              </label>

              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontWeight: "700",
                  marginBottom: "8px",
                  marginTop: "20px",
                }}
              >
                Time
              </label>

              <input
                type="time"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Venue */}
          <label
            style={{
              display: "block",
              fontWeight: "700",
              marginBottom: "8px",
              marginTop: "20px",
            }}
          >
            Venue
          </label>

          <input
            value={eventVenue}
            onChange={(e) => setEventVenue(e.target.value)}
            placeholder="e.g. Grand Arena, Accra"
            style={inputStyle}
          />

<div style={{ marginTop: "20px" }}>
  <label style={{ display: "flex", alignItems: "center", gap: "10px" }}>
    <input
      type="checkbox"
      checked={isFeatured}
      onChange={(e) => setIsFeatured(e.target.checked)}
    />
    Promote this event to Featured Events
  </label>
</div>         
          {/* Ticket Types */}
<div style={{ marginTop: "20px" }}>
  <label
    style={{
      display: "block",
      fontWeight: "700",
      marginBottom: "12px",
    }}
  >
    Ticket Types
  </label>

  {ticketTypes.map((ticket, index) => (
    <div
      key={index}
      style={{
        display: "grid",
        gridTemplateColumns: "1.2fr 1fr 1fr auto",
        gap: "12px",
        marginBottom: "12px",
        alignItems: "center",
      }}
    >
      <input
        value={ticket.name}
        onChange={(e) => {
          const updated = [...ticketTypes];
          updated[index].name = e.target.value;
          setTicketTypes(updated);
        }}
        placeholder="e.g. Regular"
        style={inputStyle}
      />

      <input
        value={ticket.price}
        onChange={(e) => {
          const updated = [...ticketTypes];
          updated[index].price = e.target.value;
          setTicketTypes(updated);
        }}
        placeholder="Price (GHS)"
        style={inputStyle}
      />

      <input
        value={ticket.available}
        onChange={(e) => {
          const updated = [...ticketTypes];
          updated[index].available = e.target.value;
          setTicketTypes(updated);
        }}
        placeholder="Available"
        style={inputStyle}
      />

      {ticketTypes.length > 1 && (
        <button
          type="button"
          onClick={() => {
            setTicketTypes(
              ticketTypes.filter((_, ticketIndex) => ticketIndex !== index)
            );
          }}
          style={{
            border: "none",
            background: "#fee2e2",
            color: "#dc2626",
            padding: "12px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "700",
          }}
        >
          Remove
        </button>
      )}
    </div>
  ))}

  <button
    type="button"
    onClick={() => {
      setTicketTypes([
        ...ticketTypes,
        {
          name: "",
          price: "",
          available: "",
        },
      ]);
    }}
    style={{
      border: "1px solid #ff0080",
      background: "white",
      color: "#ff0080",
      padding: "11px 18px",
      borderRadius: "9px",
      fontWeight: "700",
      cursor: "pointer",
    }}
  >
    + Add Ticket Type
  </button>
</div>

          {/* Ticketing Options */}
<div style={{ marginTop: "20px" }}>
  <label
    style={{
      display: "block",
      fontWeight: "700",
      marginBottom: "10px",
    }}
  >
    Ticketing Option
  </label>

  <select
    value={ticketMode}
    onChange={(e) =>
      setTicketMode(
        e.target.value as "free" | "internal" | "external"
      )
    }
    style={inputStyle}
  >
    <option value="free">Free Event</option>
    <option value="internal">Sell tickets on AccraEvents</option>
    <option value="external">Use external ticket link</option>
  </select>

  {ticketMode === "external" && (
    <div style={{ marginTop: "15px" }}>
      <label
        style={{
          display: "block",
          fontWeight: "700",
          marginBottom: "8px",
        }}
      >
        Official Ticket URL
      </label>

      <input
        value={ticketLink}
        onChange={(e) => setTicketLink(e.target.value)}
        placeholder="https://app.chaleapp.org/checkout/242"
        style={inputStyle}
      />

      <p
        style={{
          fontSize: "13px",
          color: "#64748b",
          marginTop: "8px",
        }}
      >
        Visitors will be taken to this official ticket website
        when they click Buy Tickets.
      </p>
    </div>
  )}

  {ticketMode === "internal" && (
    <p
      style={{
        fontSize: "13px",
        color: "#64748b",
        marginTop: "8px",
      }}
    >
      AccraEvents will handle ticket sales and payment through
      Paystack.
    </p>
  )}

  {ticketMode === "free" && (
    <p
      style={{
        fontSize: "13px",
        color: "#64748b",
        marginTop: "8px",
      }}
    >
      This event is free. Visitors will not be charged for
      tickets.
    </p>
  )}
</div>

          {/* Description */}
          <label
            style={{
              display: "block",
              fontWeight: "700",
              marginBottom: "8px",
              marginTop: "20px",
            }}
          >
            Event Description
          </label>

          <textarea
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
            placeholder="Tell visitors about the event..."
            rows={6}
            style={{
              ...inputStyle,
              resize: "vertical",
            }}
          />

          {/* Save */}
          <button
            onClick={handleSaveEvent}
            style={{
              marginTop: "25px",
              border: "none",
              background: "#ff0080",
              color: "white",
              padding: "15px 28px",
              borderRadius: "10px",
              fontSize: "16px",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            + Save Event
          </button>
        </div>
      </div>
            {/* Manage Existing Events */}
      <div
        style={{
          display: activeView === "existing-events" ? "block" : "none",
          background: "white",
          borderRadius: "16px",
          padding: "30px",
          marginTop: "25px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
        }}
      >
        <h2>Manage Existing Events</h2>

        {existingEvents.map((event: any) => (
        
          <div
            key={event.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "15px",
              padding: "15px 0",
              borderBottom: "1px solid #eee",
            }}
          >
            <div>
              <strong>{event.title}</strong>
              <div style={{ color: "#64748b", fontSize: "13px" }}>
                {event.date} · {event.location}
              </div>
            </div>

            
<button
  onClick={() => {
    setEditingEventId(event.id);
    setIsFeatured(event.is_featured === true);
    setEventTitle(event.title || "");
    setEventCategory(event.category ?? "");
    setCustomCategory(
  ["Music", "Shows", "Business", "Food & Drinks", "Sports", "Arts & Culture", "Religious", "Family", "Education", "Exhibitions"].includes(event.category)
    ? ""
    : event.category && event.category !== "Other"
      ? event.category
      : ""
);
    setEventDate(event.event_date || event.date || "");
    setEventTime(event.event_time || event.time || "");
    setEventVenue(event.location || "");
    setEventImage(event.image_url ?? event.image ?? "");
    setEventDescription(event.description || "");
    setTicketMode(event.ticketMode || "internal");
    setTicketLink(event.ticketLink || "");
    setActiveView("add-event");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }}
  style={{
    background: "#e0e7ff",
    color: "#3730a3",
    border: "none",
    borderRadius: "8px",
    padding: "10px 14px",
    cursor: "pointer",
    fontWeight: "700",
  }}
>
  Edit
</button>
<button

onClick={async () => {
    if (confirm(`Hide "${event.title}" from the website?`)) {
const response = await fetch("/api/events", {
  method: "PATCH",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
  id: event.id,
  title: event.title,
  slug: event.slug,
  event_date: event.event_date || event.date,
  location: event.location,
  published: !event.published,
}),
});
const result = await response.json();

if (!response.ok) {
  alert(result.error || "Failed to hide event.");
  return;
}

window.location.reload();
    }
  }}
  style={{
    background: "#fef3c7",
    color: "#92400e",
    border: "none",
    borderRadius: "8px",
    padding: "10px 14px",
    cursor: "pointer",
    fontWeight: "700",
  }}
>
  {event.published ? "Hide" : "Unhide"}
</button>
            <button
              onClick={async () => {
                if (
                  confirm(`Are you sure you want to delete "${event.title}"?`)
                ) {
                  
const response = await fetch("/api/events", {
  method: "DELETE",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ id: event.id }),
});

const result = await response.json();

if (!response.ok) {
  alert(result.error || "Failed to delete event.");
  return;
}

window.location.reload();

                }
              }}
              style={{
                background: "#fee2e2",
                color: "#b91c1c",
                border: "none",
                borderRadius: "8px",
                padding: "10px 14px",
                cursor: "pointer",
                fontWeight: "700",
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}

const inputStyle = {
  width: "100%",
  padding: "13px 14px",
  border: "1px solid #d9dee7",
  borderRadius: "9px",
  fontSize: "15px",
  boxSizing: "border-box" as const,
  outline: "none",
  background: "white",
};