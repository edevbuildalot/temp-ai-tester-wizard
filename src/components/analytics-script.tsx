"use client";

import { capturePageView } from "@/lib/analytics";
import { useEffect } from "react";

export function AnalyticsScript() {
  useEffect(() => {
    capturePageView();
  }, []);

  return null;
}