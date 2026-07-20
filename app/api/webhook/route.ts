import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";

// Admin client for webhook — uses service role key to bypass RLS
function getAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error("Supabase URL or service role key not configured");
  }
  return createClient(url, serviceKey);
}

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature") || "";
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  let event;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const userId = session.metadata?.userId;

      if (userId) {
        const supabase = getAdminSupabase();

        const { error } = await supabase.from("subscriptions").upsert(
          {
            user_id: userId,
            stripe_session_id: session.id,
            stripe_customer_id: session.customer,
            status: "active",
            created_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        );

        if (error) {
          console.error(`Failed to upsert subscription for user ${userId}:`, error);
        } else {
          console.log(`Subscription activated for user: ${userId}`);
        }
      }
      break;
    }

    case "checkout.session.expired": {
      const session = event.data.object;
      console.log(`Checkout session expired: ${session.id}`);
      break;
    }
  }

  return NextResponse.json({ received: true });
}
