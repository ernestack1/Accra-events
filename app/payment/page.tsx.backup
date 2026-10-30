"use client";

import { Suspense } from "react";
import PaymentCallbackContent from "./PaymentCallbackContent";

export default function PaymentCallbackPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center">
          <p>Verifying your payment...</p>
        </main>
      }
    >
      <PaymentCallbackContent />
    </Suspense>
  );
}
