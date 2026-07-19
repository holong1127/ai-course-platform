import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    const { userId, email } = await req.json();
    const stripe = getStripe();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "hkd",
            product_data: {
              name: "AI 辦公達人 — 完整課程",
              description: "全部 45 課 + WhatsApp 學員群組",
            },
            unit_amount: parseInt(
              process.env.COURSE_PRICE_HKD || "89900"
            ),
          },
          quantity: 1,
        },
      ],
      customer_email: email,
      metadata: { userId },
      success_url: `${
        process.env.NEXT_PUBLIC_SITE_URL
      }/dashboard?success=true`,
      cancel_url: `${
        process.env.NEXT_PUBLIC_SITE_URL
      }/pricing?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
