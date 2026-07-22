"use client";

import { useEffect } from "react";
import { analytics, type AnalyticsConfig } from "@launchfury/analytics";

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const writeKey = process.env.NEXT_PUBLIC_LF_WRITE_KEY;

    if (!writeKey) return;

    analytics.init({
      writeKey,
      host: process.env.NEXT_PUBLIC_LF_HOST || "https://launchfury.com",
    });

    analytics.capture("app_loaded", {
      app: "temp-ai-tester-wizard",
      url: window.location.href,
    });
  }, []);

  return <>{children}</>;
}
