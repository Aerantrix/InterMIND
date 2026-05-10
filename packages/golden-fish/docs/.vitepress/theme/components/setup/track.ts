/**
 * Wizard analytics — pushes to GTM dataLayer (the existing GTM container
 * forwards to GA4 via the consent-mode setup in config/gtm.config.ts) and
 * mirrors to Vercel Analytics custom events.
 *
 * Safe to call before GTM has loaded: dataLayer is initialised lazily and
 * GTM picks up queued events on init.
 */

import { track as vercelTrack } from "@vercel/analytics"

declare global {
  interface Window {
    dataLayer?: unknown[]
  }
}

export type SetupEvent =
  | "setup_form_started"
  | "setup_step_completed"
  | "setup_step_back"
  | "setup_form_submitted"
  | "setup_form_failed"
  | "setup_form_validation_error"

export function track(event: SetupEvent, props: Record<string, string | number | boolean | null> = {}): void {
  if (typeof window === "undefined") return

  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ event, ...props })

  try {
    const sanitized: Record<string, string | number | boolean | null> = {}
    for (const k of Object.keys(props)) {
      const v = props[k]
      if (v !== undefined) sanitized[k] = v
    }
    vercelTrack(event, sanitized)
  } catch {
    // vercelTrack throws if analytics script hasn't injected yet; dataLayer
    // already captured the event so we don't double-log to console.
  }
}
