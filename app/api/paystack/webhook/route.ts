import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";

export async function POST(request: NextRequest) {
  try {
    const secretKey = process.env.PAYSTACK_SECRET_KEY;

    if (!secretKey) {
      return NextResponse.json(
        { error: "Paystack secret key is not configured." },
        { status: 500 }
      );
    }

    const body = await request.text();

    const signature = request.headers.get("x-paystack-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing Paystack signature." },
        { status: 401 }
      );
    }

    const hash = crypto
      .createHmac("sha512", secretKey)
      .update(body)
      .digest("hex");

    if (hash !== signature) {
      return NextResponse.json(
        { error: "Invalid Paystack signature." },
        { status: 401 }
      );
    }

    const event = JSON.parse(body);

    console.log("Paystack webhook received:", event.event);

    if (event.event === "charge.success") {
  const payment = event.data;
  
if (payment.currency !== "GHS") {
  console.error("Unexpected payment currency:", payment.currency);
  return NextResponse.json(
    { error: "Invalid payment currency." },
    { status: 400 }
  );
}


if (payment.status !== "success") {
  return NextResponse.json({ received: true });
}

  const { data: result, error: confirmError } = await supabaseAdmin.rpc(
  "confirm_paid_booking",
  {
    p_reference: payment.reference,
    p_amount_pesewas: payment.amount,
  }
);

if (confirmError) {
  console.error("Booking confirmation failed:", confirmError.message);
  return NextResponse.json(
    { error: "Unable to confirm booking" },
    { status: 500 }
  );
}

if (!result?.success) {
  console.error("Booking confirmation rejected:", result?.message);
  return NextResponse.json(
    { error: result?.message || "Unable to confirm booking" },
    { status: 500 }
  );
}

console.log("Booking confirmation result:", result.message);

}

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Paystack webhook error:", error);

    return NextResponse.json(
      { error: "Webhook processing failed." },
      { status: 500 }
    );
  }
}