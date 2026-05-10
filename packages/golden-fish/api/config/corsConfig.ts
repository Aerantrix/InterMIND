/**
 * CORS Configuration for API Endpoints
 *
 * Domain access control configuration for securing API endpoints.
 * Validates incoming requests against allowed domains list to prevent
 * unauthorized access from unknown origins.
 *
 * Features:
 * - Origin and referer header validation
 * - Fallback domain checking
 * - Development domain support
 * - Access logging and warnings
 */

// Allowed domains for API endpoints (custom domains we control)
export const ALLOWED_DOMAINS = ["localhost", "goldenfish.ae", "status.goldenfish.ae"]

/**
 * Build the runtime allow-list. Combines the static ALLOWED_DOMAINS with the
 * current Vercel deployment's own hostnames pulled from environment variables
 * Vercel sets at build/runtime — so preview deployments self-authorise without
 * us needing to update this list every time a branch URL changes.
 */
function getRuntimeAllowedDomains(): Set<string> {
  const allowed = new Set<string>(ALLOWED_DOMAINS)
  // VERCEL_URL  — current deployment's `.vercel.app` URL (e.g. project-abc123.vercel.app)
  // VERCEL_BRANCH_URL — branch-specific alias (e.g. project-git-feat-xyz.vercel.app)
  // VERCEL_PROJECT_PRODUCTION_URL — alias used by the production deployment
  for (const envVar of ["VERCEL_URL", "VERCEL_BRANCH_URL", "VERCEL_PROJECT_PRODUCTION_URL"]) {
    const v = process.env[envVar]
    if (v) allowed.add(v.replace(/^https?:\/\//, "").replace(/\/+$/, ""))
  }
  return allowed
}

// Function to check allowed domain
export function isAllowedDomain(request: Request): boolean {
  const allowed = getRuntimeAllowedDomains()
  const origin = request.headers.get("origin")
  const referer = request.headers.get("referer")

  // Allow if no origin and referer (for direct requests)
  if (!origin && !referer) {
    return true
  }

  // Check origin
  if (origin) {
    try {
      const originUrl = new URL(origin)
      const hostname = originUrl.hostname

      if (allowed.has(hostname)) {
        return true
      } else {
        console.warn(`🚫 Access denied from unauthorized domain: ${hostname} (origin)`)
      }
    } catch (e) {
      console.warn("Invalid origin URL:", origin)
    }
  }

  // Check referer as fallback
  if (referer) {
    try {
      const refererUrl = new URL(referer)
      const hostname = refererUrl.hostname

      if (allowed.has(hostname)) {
        return true
      } else {
        console.warn(`🚫 Access denied from unauthorized domain: ${hostname} (referer)`)
      }
    } catch (e) {
      console.warn("Invalid referer URL:", referer)
    }
  }

  return false
}
