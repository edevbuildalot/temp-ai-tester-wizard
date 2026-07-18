"use client"

import { Suspense, useEffect } from "react"
import posthog from "posthog-js"
import { usePathname, useSearchParams } from "next/navigation"

function PostHogPageViewTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const searchParamsString = searchParams.toString()
    if (pathname && posthog.__loaded) {
      posthog.capture("$pageview", {
        $current_url: pathname + (searchParamsString ? `?${searchParamsString}` : ""),
      })
    }
  }, [pathname, searchParams])

  return null
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window === "undefined") return
    if (!process.env.NEXT_PUBLIC_POSTHOG_KEY || !process.env.NEXT_PUBLIC_POSTHOG_HOST) return

    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      capture_pageview: false,
      loaded: (ph) => {
        if (process.env.NODE_ENV === "development") ph.opt_out_capturing()
      },
    })
  }, [])

  return (
    <>
      <Suspense fallback={null}>
        <PostHogPageViewTracker />
      </Suspense>
      {children}
    </>
  )
}