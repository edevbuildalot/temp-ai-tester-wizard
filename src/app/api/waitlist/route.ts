import { NextRequest, NextResponse } from "next/server";
import { PostHog } from "posthog-node";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 }
      );
    }

    console.log("[WAITLIST]", email);

    const posthogKey = process.env.POSTHOG_KEY;
    if (posthogKey) {
      const posthog = new PostHog(posthogKey, {
        host: process.env.POSTHOG_HOST || "https://us.i.posthog.com",
      });
      posthog.capture({
        distinctId: email,
        event: "waitlist_signup",
        properties: { email },
      });
      await posthog.shutdown();
    }

    return NextResponse.json(
      { message: "You're on the list! We'll be in touch soon." },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}