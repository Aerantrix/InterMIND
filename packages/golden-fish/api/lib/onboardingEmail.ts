/**
 * Welcome email to the applicant via Resend's HTTP API. Best-effort: the
 * lead exists in Pipedrive regardless of whether this email lands. We do
 * NOT block the user-facing success response on email delivery.
 *
 * Resend accepts `from` in either bare email form or the RFC 5322 form
 * "Name <addr@domain>" — we pass EMAIL_FROM_ADDRESS through verbatim.
 */

import type { OnboardingPayload } from "../types/onboardingTypes.js"

const RESEND_ENDPOINT = "https://api.resend.com/emails"

interface SendOpts {
  leadId: string
  payload: OnboardingPayload
}

interface EmailContext {
  firstName: string
  leadId: string
  whatsappLink: string | null
  tcUrl: string | null
}

function buildHtml(ctx: EmailContext): string {
  const { firstName, leadId, whatsappLink, tcUrl } = ctx
  const greeting = firstName ? `Hi ${firstName},` : "Hi there,"

  const ctaButton = whatsappLink
    ? `<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 24px 0;">
         <tr>
           <td style="border-radius: 999px; background: #B8862E;">
             <a href="${whatsappLink}"
                style="display: inline-block; padding: 12px 28px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; font-size: 15px; font-weight: 600; color: #FFFFFF; text-decoration: none;">
               Message us on WhatsApp →
             </a>
           </td>
         </tr>
       </table>`
    : ""

  const tcLine = tcUrl
    ? `<p style="margin: 12px 0 0; font-size: 13px; color: #6B7889;">By replying you confirm you've read our <a href="${tcUrl}" style="color: #B8862E; text-decoration: underline;">Terms & Conditions</a>.</p>`
    : ""

  return `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>Your business set-up application</title></head>
<body style="margin: 0; padding: 0; background: #F8F4EC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; color: #1A2540;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: #F8F4EC; padding: 32px 16px;">
    <tr><td align="center">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="560" style="max-width: 560px; background: #FFFFFF; border-radius: 14px; box-shadow: 0 8px 24px rgba(26, 37, 64, 0.06); overflow: hidden;">
        <tr>
          <td style="background: #1A2540; padding: 22px 32px;">
            <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; font-size: 18px; font-weight: 700; color: #B8862E; letter-spacing: 0.5px;">GOLDEN FISH</div>
            <div style="font-size: 12px; color: #B8C5D6; letter-spacing: 0.08em; text-transform: uppercase; margin-top: 2px;">UAE Business Set-Up</div>
          </td>
        </tr>
        <tr>
          <td style="padding: 32px;">
            <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.5;">${greeting}</p>
            <p style="margin: 0 0 16px; font-size: 15px; line-height: 1.6; color: #3F4A65;">
              Thanks for completing the onboarding form. Your application is in our queue and a dedicated manager will reach out within <b>24 hours</b> with a tailored proposal.
            </p>
            <h3 style="margin: 24px 0 8px; font-size: 14px; font-weight: 600; color: #1A2540; letter-spacing: 0.04em; text-transform: uppercase;">What's next</h3>
            <ul style="margin: 0 0 16px; padding-left: 20px; font-size: 15px; line-height: 1.8; color: #3F4A65;">
              <li>Draft commercial proposal (PDF) in a follow-up message</li>
              <li>A brief call to align on jurisdiction, timeline, and banking</li>
              <li>Single official prepayment contract — no piecemeal invoices</li>
            </ul>
            ${ctaButton}
            <p style="margin: 16px 0 0; font-size: 13px; color: #6B7889;">Reference: <code style="background: #F8F4EC; padding: 2px 6px; border-radius: 4px; font-size: 12px;">#${leadId}</code></p>
          </td>
        </tr>
        <tr>
          <td style="padding: 0 32px 24px;">
            ${tcLine}
            <p style="margin: 16px 0 0; font-size: 13px; color: #6B7889;">— Golden Fish team</p>
          </td>
        </tr>
        <tr>
          <td style="background: #F8F4EC; padding: 16px 32px; border-top: 1px solid rgba(26, 37, 64, 0.08); font-size: 12px; color: #6B7889; line-height: 1.6;">
            Golden Fish Corporate Services Provider LLC · Office 405-070, Port Saeed, Dubai, UAE<br>
            <a href="mailto:info@goldenfish.ae" style="color: #6B7889; text-decoration: none;">info@goldenfish.ae</a>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function buildText(ctx: EmailContext): string {
  const { firstName, leadId, whatsappLink, tcUrl } = ctx
  const greeting = firstName ? `Hi ${firstName},` : "Hi there,"
  const lines: string[] = [
    greeting,
    "",
    "Thanks for completing the onboarding form. Your application is in our queue and a dedicated manager will reach out within 24 hours with a tailored proposal.",
    "",
    "What's next:",
    "  • Draft commercial proposal (PDF) in a follow-up message",
    "  • A brief call to align on jurisdiction, timeline, and banking",
    "  • Single official prepayment contract — no piecemeal invoices",
    "",
  ]
  if (whatsappLink) lines.push(`Message us on WhatsApp: ${whatsappLink}`, "")
  lines.push(`Reference: #${leadId}`, "")
  if (tcUrl) lines.push(`Terms & Conditions: ${tcUrl}`, "")
  lines.push("— Golden Fish team", "", "Golden Fish Corporate Services Provider LLC", "Office 405-070, Port Saeed, Dubai, UAE", "info@goldenfish.ae")
  return lines.join("\n")
}

export async function sendWelcomeEmail({ leadId, payload }: SendOpts): Promise<void> {
  const apiKey = process.env.EMAIL_API_KEY
  const from = process.env.EMAIL_FROM_ADDRESS
  if (!apiKey || !from) {
    console.warn("[onboarding] Email not configured (EMAIL_API_KEY / EMAIL_FROM_ADDRESS missing) — skipping welcome email")
    return
  }

  // Sandbox guard — Resend's onboarding@resend.dev only delivers to your own
  // registered email in test mode. Loud warning so we don't silently ship
  // production with sandbox sender.
  if (process.env.VERCEL_ENV === "production" && /resend\.dev/i.test(from)) {
    console.error("[onboarding] WARNING: production uses Resend sandbox sender. Verify your domain in Resend and update EMAIL_FROM_ADDRESS.")
  }

  const ctx: EmailContext = {
    firstName: (payload.contact.name || "").split(/\s+/)[0],
    leadId,
    whatsappLink: buildWhatsappLink(leadId),
    tcUrl: process.env.TC_URL || null,
  }

  const subject = "Your business set-up application — next steps"
  const body = {
    from,
    to: [payload.contact.email],
    subject,
    html: buildHtml(ctx),
    text: buildText(ctx),
  }

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      const text = await res.text()
      console.error(`[onboarding] Resend send failed (${res.status}): ${text.slice(0, 300)}`)
    }
  } catch (err) {
    console.error("[onboarding] Resend fetch error:", err instanceof Error ? err.message : err)
  }
}

function buildWhatsappLink(leadId: string): string | null {
  const num = process.env.WHATSAPP_BUSINESS_NUMBER
  if (!num) return null
  const text = encodeURIComponent(`Hi, I just submitted application #${leadId}`)
  return `https://wa.me/${num}?text=${text}`
}
