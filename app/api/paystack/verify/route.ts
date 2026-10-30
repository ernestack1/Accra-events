
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";

export async function POST(request: NextRequest) {
  try {
    const { reference } = await request.json();

    const trimmedReference =
      typeof reference === "string" ? reference.trim() : "";

    if (!trimmedReference) {
      return NextResponse.json(
        { error: "A valid payment reference is required." },
        { status: 400 }
      );
    }

    const { data: booking, error: bookingError } = await supabaseAdmin
      .from("bookings")
      .select("id, paystack_reference, status, amount")
      .eq("paystack_reference", trimmedReference)
      .maybeSingle();

    if (bookingError) {
      console.error("Booking lookup failed:", bookingError.message);
      return NextResponse.json(
        { error: "Unable to find booking." },
        { status: 500 }
      );
    }

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found." },
        { status: 404 }
      );
    }

    if (booking.status === "paid") {
      return NextResponse.json({
        success: true,
        status: "paid",
      });
    }

    const secretKey = process.env.PAYSTACK_SECRET_KEY;

    if (!secretKey) {
      return NextResponse.json(
        { error: "Payment verification is not configured." },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(trimmedReference)}`,
      {
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
        cache: "no-store",
      }
    );

    const result = await response.json();

    if (!response.ok || !result.status || !result.data) {
      return NextResponse.json(
        { error: "Unable to verify payment with Paystack." },
        { status: 502 }
      );
    }

    const payment = result.data;

    if (payment.currency !== "GHS") {
      return NextResponse.json(
        { error: "Invalid payment currency." },
        { status: 400 }
      );
    }

    if (payment.status === "success") {
      const expectedAmount = Math.round(Number(booking.amount) * 100);

      if (
        !Number.isFinite(expectedAmount) ||
        payment.amount !== expectedAmount
      ) {
        return NextResponse.json(
          { error: "Payment amount does not match the booking." },
          { status: 400 }
        );
      }

      const { data: confirmation, error: confirmError } =
        await supabaseAdmin.rpc("confirm_paid_booking", {
          p_reference: trimmedReference,
          p_amount_pesewas: payment.amount,
        });

      if (confirmError) {
        console.error(
          "Booking confirmation failed:",
          confirmError.message
        );

        return NextResponse.json(
          { error: "Unable to confirm booking." },
          { status: 500 }
        );
      }

      if (!confirmation?.success) {
        return NextResponse.json(
          {
            error:
              confirmation?.message || "Unable to confirm booking.",
          },
          { status: 409 }
        );
      }

      return NextResponse.json({
        success: true,
        status: "paid",
        message: confirmation.message,
      });
    }

    if (payment.status === "failed") {
      const { error: updateError } = await supabaseAdmin
        .from("bookings")
        .update({ status: "failed" })
        .eq("paystack_reference", trimmedReference)
        .eq("status", "pending");

      if (updateError) {
        console.error(
          "Unable to update booking status:",
          updateError.message
        );

        return NextResponse.json(
          { error: "Unable to update booking status." },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        status: "failed",
      });
    }

    if (payment.status === "abandoned") {
      return NextResponse.json({
        success: true,
        status: "abandoned",
      });
    }

    return NextResponse.json({
      success: true,
      status: "pending",
    });
  } catch (error) {
    console.error("Payment verification error:", error);

    return NextResponse.json(
      { error: "Payment verification failed." },
      { status: 500 }
    );
  }
}
