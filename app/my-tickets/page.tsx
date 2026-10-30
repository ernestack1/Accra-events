"use client";

import { useState } from "react";
import QRCode from "qrcode";

type Ticket = {
  ticket_code: string;
  status: string;
  created_at: string;
};
async function generateTicketQR(ticketCode: string) {
  const QRCode = (await import("qrcode")).default;

  return QRCode.toDataURL(ticketCode, {
    width: 250,
    margin: 2,
    errorCorrectionLevel: "H",
  });
}

export default function MyTicketsPage() {
  const [reference, setReference] = useState("");
  const [email, setEmail] = useState("");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [qrCodes, setQrCodes] = useState<Record<string, string>>({});
  async function loadTicketQR(ticketList: Ticket[]) {
  const generated: Record<string, string> = {};

  for (const ticket of ticketList) {
    generated[ticket.ticket_code] = await generateTicketQR(
      ticket.ticket_code
    );
  }

  setQrCodes(generated);
}
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function findTickets(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setTickets([]);

    try {
      const response = await fetch("/api/my-tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference, email }),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.error || "Unable to retrieve tickets.");
      } else if (!result.tickets?.length) {
        setMessage("No tickets were found for this booking.");
      } else {
        setTickets(result.tickets);
        await loadTicketQR(result.tickets);
        setMessage("Your tickets were found successfully.");
      }
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12 text-gray-900">
      <section className="mx-auto max-w-xl rounded-2xl bg-white p-6 shadow-lg sm:p-8">
        <h1 className="text-center text-3xl font-bold">
          AccraEvents<span className="text-pink-600">.</span>
        </h1>

        <h2 className="mt-8 text-2xl font-bold">My Tickets</h2>
        <p className="mt-2 text-gray-600">
          Enter your booking reference and email to find your tickets.
        </p>

        <form onSubmit={findTickets} className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block font-medium">
              Payment reference
            </label>
            <input
              required
              value={reference}
              onChange={(event) => setReference(event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3"
              placeholder="Enter your payment reference"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">Booking email</label>
            <input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3"
              placeholder="Enter the email used for booking"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-pink-600 px-4 py-3 font-bold text-white disabled:opacity-60"
          >
            {loading ? "Finding tickets..." : "Find My Tickets"}
          </button>
        </form>

        {message && (
          <p className="mt-5 rounded-lg bg-gray-100 p-3 text-sm">
            {message}
          </p>
        )}

        {tickets.length > 0 && (
          <div className="mt-6 space-y-4">
            {tickets.map((ticket) => (
              <article
                key={ticket.ticket_code}
                className="rounded-xl border border-gray-200 p-4"
              >
                <h3 className="font-bold">Your AccraEvents Ticket</h3>
                <p className="mt-3 text-sm text-gray-600">Ticket code</p>
                <p className="break-all font-mono">{ticket.ticket_code}</p>
                {qrCodes[ticket.ticket_code] && (
  <div className="mt-4">
    <img
      src={qrCodes[ticket.ticket_code]}
      alt="Ticket QR Code"
      width={250}
      height={250}
      className="mx-auto rounded-lg"
    />
    <p className="mt-2 text-center text-sm text-gray-500">
      Show this QR code at the event entrance
    </p>
  </div>
)}
                <p className="mt-3">
                  Status: <strong>{ticket.status}</strong>
                </p>
                <p className="mt-2 text-sm text-gray-600">
                  Created: {new Date(ticket.created_at).toLocaleString()}
                </p>
              </article>
            ))}
          </div>
        )}

        <p className="mt-8 text-center text-sm text-gray-500">
          Secure payments · Made for events in Ghana
        </p>
      </section>
    </main>
  );
}