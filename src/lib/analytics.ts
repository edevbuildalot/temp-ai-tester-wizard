import { PostHog } from "posthog-js";

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST =
  process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com";

let posthog: PostHog | null = null;

export function getAnalytics(): PostHog | null {
  if (typeof window === "undefined") return null;

  if (!posthog && POSTHOG_KEY) {
    import("posthog-js").then(({ default: ph }) => {
      ph.init(POSTHOG_KEY as string, {
        api_host: POSTHOG_HOST,
        person_profiles: "identified_only",
        capture_pageview: false,
        loaded: (ph) => {
          ph.register_for_session({ page_url: window.location.href });
        },
      });
      posthog = ph;
    });
  }

  return posthog;
}

export function capturePageView(): void {
  if (typeof window === "undefined") return;

  if (POSTHOG_KEY) {
    import("posthog-js").then(({ default: ph }) => {
      if (!ph.__loaded) {
        ph.init(POSTHOG_KEY as string, {
          api_host: POSTHOG_HOST,
          person_profiles: "identified_only",
          capture_pageview: false,
        });
      }
      ph.capture("$pageview", {
        page_url: window.location.href,
        page_title: document.title,
      });
    });
  }
}

export function captureEvent(
  event: string,
  properties?: Record<string, unknown>,
): void {
  if (typeof window === "undefined") return;

  if (POSTHOG_KEY) {
    import("posthog-js").then(({ default: ph }) => {
      if (!ph.__loaded) {
        ph.init(POSTHOG_KEY as string, {
          api_host: POSTHOG_HOST,
          person_profiles: "identified_only",
          capture_pageview: false,
        });
      }
      ph.capture(event, properties);
    });
  }
}