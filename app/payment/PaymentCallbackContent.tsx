
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function PaymentCallbackPage() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");
  const [message, setMessage] = useState("Verifying your payment...");
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    if (!reference) {
      setMessage("No payment reference was found. Please contact support.");
      return;
    }

    let cancelled = false;

    async function verifyPayment() {
      try {
        const response = await fetch("/api/paystack/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reference }),
        });

        const result = await response.json();

        if (cancelled) return;

        if (response.ok && result.status === "paid") {
          setPaid(true);
          setMessage(
            "Your payment is confirmed. Thank you for booking with AccraEvents!"
          );
          } else if (result.status === "abandoned") {
  setMessage(
    "This payment was abandoned. You can return to the event and try again."
  );
        } else if (result.status === "payment_successful") {
          setMessage(
            "Your payment was received. Confirmation is still processing. Please refresh this page shortly."
          );
        } else {
  setMessage(
    result.message ||
      result.error ||
      "We could not confirm your payment. Please contact support before paying again."
  );
}
      } catch {
        if (!cancelled) {
          setMessage(
            "We could not verify your payment right now. Please refresh this page shortly."
          );
        }
      }
    }

    verifyPayment();

const retryTimer = setInterval(verifyPayment, 5000);

    return () => {
  cancelled = true;
  clearInterval(retryTimer);
};
  }, [reference]);

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12 flex items-center justify-center">
      <div className="w-full max-w-lg rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-lg sm:p-10">
        <a href="/" className="text-2xl font-extrabold tracking-tight text-gray-950">
          AccraEvents<span className="text-pink-600">.</span>
        </a>

        <div
          className={`mx-auto mt-8 flex h-20 w-20 items-center justify-center rounded-full text-4xl font-bold ${
            paid
              ? "bg-green-100 text-green-700"
              : "bg-pink-100 text-pink-600"
          }`}
        >
          {paid ? "✓" : "🎟"}
        </div>

        <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-gray-950">
          {paid ? "Booking Confirmed!" : "Payment Status"}
        </h1>

        <p className="mx-auto mt-4 max-w-sm leading-7 text-gray-600">
          {message}
        </p>

        {reference && (
          <div className="mt-6 rounded-xl bg-gray-50 p-4 text-left">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Payment reference
            </p>
            <p className="mt-2 break-all font-mono text-sm text-gray-900">
              {reference}
            </p>
          </div>
        )}

        <a
          href="/"
          className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-pink-600 px-6 py-4 font-semibold text-white transition hover:bg-pink-700"
        >
          Return to AccraEvents
        </a>

        <p className="mt-6 text-xs text-gray-400">
          Secure payments · Made for events in Ghana
        </p>
      </div>
    </main>
  );
}

