import { createAnalytics } from '@launchfury/analytics'

const writeKey =
  process.env.NEXT_PUBLIC_LAUNCHFURY_WRITE_KEY ||
  'lfa_prod_c9a105b862cb2e2cf5f285c13735c5b8254d734c94ac371d'

const host =
  process.env.NEXT_PUBLIC_LAUNCHFURY_HOST ||
  'https://launchfury.com'

export const analytics = createAnalytics({
  writeKey,
  host,
  debug: process.env.NODE_ENV !== 'production',
})

export function trackPageview() {
  analytics.page({
    url: window.location.href,
    path: window.location.pathname,
    referrer: document.referrer,
  })
}

export function trackEmailSignup(email: string) {
  analytics.capture('email_signup', {
    email,
    source: 'landing-page-waitlist',
  })
}