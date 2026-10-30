"use client";

import { useEffect, useRef, useState } from "react";

export default function CheckInPage() {
  const scannerRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState("Ready to scan tickets.");
  const [resultType, setResultType] = useState<"success" | "error" | "info">("info");
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    let scanner: import("html5-qrcode").Html5Qrcode | null = null;
    let cancelled = false;

    async function startScanner() {
      if (!scannerRef.current || cancelled) return;

      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        if (cancelled || !scannerRef.current) return;

        scanner = new Html5Qrcode("ticket-scanner");

        await scanner.start(
          { facingMode: "user" },
          { fps: 10, qrbox: { width: 220, height: 220 } },
          async (decodedText) => {
  try {
    setMessage("Verifying ticket...");
setResultType("info");

    const response = await fetch("/api/check-in", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticketCode: decodedText }),
    });

    const result = await response.json();

    setMessage(result.message || "Unable to verify ticket.");
setResultType(response.ok && result.success ? "success" : "error");
  } catch {
    setMessage("Could not verify ticket. Please try again.");
  }
},
          () => {}
        );

        if (!cancelled) setScanning(true);
      } catch {
        setMessage("Camera unavailable. Allow camera access and try again.");
      }
    }

    void startScanner();

    return () => {
      cancelled = true;
      if (scanner?.isScanning) {
        void scanner.stop().catch(() => {});
      }
    };
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12 text-gray-900">
      <section className="mx-auto max-w-xl rounded-2xl bg-white p-6 shadow-lg">
        <h1 className="text-center text-3xl font-bold">
          AccraEvents Check-in
        </h1>

        <p className="mt-3 text-center text-gray-600">
          Scan an attendee&apos;s ticket QR code at the event entrance.
        </p>

        <div
          id="ticket-scanner"
          ref={scannerRef}
          className="mt-6 w-full overflow-hidden rounded-xl"
        />

        <p
  className={`mt-5 rounded-lg p-4 text-sm font-semibold ${
    resultType === "success"
      ? "bg-green-100 text-green-800"
      : resultType === "error"
      ? "bg-red-100 text-red-800"
      : "bg-gray-100 text-gray-800"
  }`}
>
  {message}
</p>

        {!scanning && (
          <p className="mt-3 text-center text-sm text-gray-500">
            Your browser may ask for camera permission.
          </p>
        )}
      </section>
    </main>
  );
}