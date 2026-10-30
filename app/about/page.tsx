export default function AboutPage() {
  return (
    <main style={{ background: "#ffffff", minHeight: "100vh", color: "#172033" }}>
      <header
        style={{
          padding: "22px 7%",
          borderBottom: "1px solid #eeeeee",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "15px",
        }}
      >
        <a
          href="/"
          style={{
            fontSize: "24px",
            fontWeight: "800",
            color: "#172033",
            textDecoration: "none",
          }}
        >
          Accra<span style={{ color: "#e76b35" }}>Events</span>
        </a>

        <nav style={{ display: "flex", gap: "25px", flexWrap: "wrap" }}>
          <a href="/" style={{ color: "#555", textDecoration: "none" }}>Home</a>
          <a href="/events/all" style={{ color: "#555", textDecoration: "none" }}>Events</a>
          <a href="/about" style={{ color: "#e76b35", textDecoration: "none", fontWeight: "700" }}>About</a>
        </nav>
      </header>

      <section
        style={{
          background: "#fff5ef",
          padding: "90px 7%",
          textAlign: "center",
        }}
      >
        <p style={{ color: "#e76b35", fontWeight: "700", letterSpacing: "2px" }}>
          ABOUT US
        </p>

        <h1 style={{ fontSize: "clamp(34px, 5vw, 55px)", margin: "15px 0" }}>
          Discover What&apos;s Happening in Accra
        </h1>

        <p style={{ maxWidth: "700px", margin: "0 auto", color: "#666", fontSize: "18px", lineHeight: "1.8" }}>
          Accra Events helps you discover exciting events, experiences and
          activities happening across Accra, all in one place.
        </p>
      </section>

      <section style={{ maxWidth: "1000px", margin: "auto", padding: "70px 7%" }}>
        <h2 style={{ fontSize: "30px", marginBottom: "18px" }}>Who We Are</h2>

        <p style={{ color: "#666", lineHeight: "1.9", fontSize: "17px" }}>
          Accra Events is an event discovery platform created to make it easier
          for people to find out what is happening in Accra. From concerts and
          parties to conferences, workshops and community gatherings, we want
          to bring event information closer to everyone.
        </p>

        <h2 style={{ fontSize: "30px", marginTop: "45px", marginBottom: "18px" }}>
          Our Mission
        </h2>

        <p style={{ color: "#666", lineHeight: "1.9", fontSize: "17px" }}>
          Our mission is to connect people with experiences by making event
          discovery simple, convenient and accessible. We want event lovers
          to find interesting activities and organisers to reach the audiences
          looking for them.
        </p>

        <h2 style={{ fontSize: "30px", marginTop: "45px", marginBottom: "18px" }}>
          What You Can Do
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
          <div style={{ padding: "25px", background: "#f8f8f8", borderRadius: "12px" }}>
            <h3>Discover Events</h3>
            <p style={{ color: "#666", lineHeight: "1.7" }}>
              Explore events happening across Accra.
            </p>
          </div>

          <div style={{ padding: "25px", background: "#f8f8f8", borderRadius: "12px" }}>
            <h3>Find Your Experience</h3>
            <p style={{ color: "#666", lineHeight: "1.7" }}>
              Browse different categories and find events that interest you.
            </p>
          </div>

          <div style={{ padding: "25px", background: "#f8f8f8", borderRadius: "12px" }}>
            <h3>Promote Your Events</h3>
            <p style={{ color: "#666", lineHeight: "1.7" }}>
              Give event organisers an opportunity to reach more people.
            </p>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "60px" }}>
          <h2>Ready to explore Accra?</h2>
          <p style={{ color: "#666", marginBottom: "25px" }}>
            Find your next experience.
          </p>

          <a
            href="/events/all"
            style={{
              display: "inline-block",
              background: "#e76b35",
              color: "#ffffff",
              padding: "14px 28px",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "700",
            }}
          >
            Explore Events
          </a>
        </div>
      </section>

      <footer style={{ background: "#172033", color: "#ffffff", padding: "25px 7%", textAlign: "center" }}>
        © {new Date().getFullYear()} Accra Events. All rights reserved.
      </footer>
    </main>
  );
}