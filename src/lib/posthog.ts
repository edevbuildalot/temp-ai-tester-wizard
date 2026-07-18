import { PostHog } from "posthog-js"

export function getPostHog(): PostHog | null {
  if (typeof window === "undefined") return null
  return (window as unknown as { __posthog?: PostHog }).__posthog ?? null
}