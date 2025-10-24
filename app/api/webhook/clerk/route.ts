import { headers } from "next/headers";
import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: Request) {
  // Get webhook secret from environment
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("CLERK_WEBHOOK_SECRET is not configured");
    return new Response("Webhook secret not configured", { status: 500 });
  }

  // Get headers for signature verification
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // Verify required headers exist
  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error("Missing svix headers");
    return new Response("Missing svix headers", { status: 400 });
  }

  // Get request body
  const payload = await req.text();

  // Create svix instance for verification
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify webhook signature
  try {
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook signature:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  // Handle the webhook event
  const eventType = evt.type;

  try {
    if (eventType === "user.created" || eventType === "user.updated") {
      const { id, email_addresses, first_name, last_name, image_url } = evt.data;

      // Get primary email
      const primaryEmail = email_addresses.find(
        (email) => email.id === evt.data.primary_email_address_id
      );

      if (!primaryEmail) {
        console.error("No primary email found for user:", id);
        return new Response("No primary email found", { status: 400 });
      }

      // Build full name
      const name = [first_name, last_name].filter(Boolean).join(" ") || undefined;

      // Sync user to Convex
      console.log(`Processing ${eventType} for user:`, id);

      await convex.mutation(api.users.getOrCreateUser, {
        clerkId: id,
        email: primaryEmail.email_address,
        name: name,
        imageUrl: image_url,
      });

      console.log(`Successfully synced user ${id} to Convex`);
      return new Response("User synced successfully", { status: 200 });
    }

    if (eventType === "user.deleted") {
      const { id } = evt.data;

      console.log(`User deleted event received for user:`, id);
      // Note: We don't delete users from Convex to preserve data integrity
      // Implement soft delete or actual deletion based on your requirements

      return new Response("User deletion noted", { status: 200 });
    }

    // Log unhandled event types
    console.log(`Unhandled webhook event type: ${eventType}`);
    return new Response("Event type not handled", { status: 200 });
  } catch (error) {
    console.error(`Error processing ${eventType}:`, error);
    return new Response("Internal server error", { status: 500 });
  }
}
