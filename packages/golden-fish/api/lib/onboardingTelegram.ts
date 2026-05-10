/**
 * Telegram notification: "new lead has arrived" → posts to manager group.
 * Best-effort: failures are logged but do not block the API response —
 * the lead is already in Pipedrive at this point, the Telegram ping is
 * just a convenience push.
 *
 * Format goal: a manager opening Telegram on phone should see in 5 seconds
 * — who, what they want, how urgent, and how to call them.
 */

import type { OnboardingPayload } from "../types/onboardingTypes.js"

interface NotifyOpts {
  leadId: string
  personId: number
  payload: OnboardingPayload
}

function escape(s: string | null | undefined): string {
  if (!s) return ""
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

/** Map Launch Timeline option_value to a short urgency tag for the message header. */
function urgencyTag(launchTimelineValue: number | null): string {
  switch (launchTimelineValue) {
    case 0:
      return "🔥 URGENT"
    case 1:
      return "⚡ This month"
    case 2:
      return "📅 1-3 months"
    case 3:
      return "🔍 Exploring"
    default:
      return ""
  }
}

function buildMessage({ leadId, payload }: NotifyOpts, leadUrl: string | null): string {
  const { contact, step2, step3, step4, step6, step7, step8, step9 } = payload

  // Compact summary of what they want — only show non-default answers to keep
  // the message scannable.
  const wants: string[] = []
  if (step6.value === 0) wants.push("Residency")
  if (step7.value === 0) wants.push("Bank a/c")
  if (step8.value === 0) wants.push("Already in UAE")
  else if (step8.value === 1) wants.push("Arriving soon")

  const utm = payload.meta.utm_source
    ? ` · 📊 ${escape(payload.meta.utm_source)}${payload.meta.utm_campaign ? ` / ${escape(payload.meta.utm_campaign)}` : ""}`
    : ""

  const lines: string[] = []
  const tag = urgencyTag(step9.value)
  lines.push(`🎯 <b>New lead</b>${tag ? ` — ${tag}` : ""}`)
  lines.push("")
  lines.push(`<b>${escape(contact.name)}</b>`)
  lines.push(`📧 <a href="mailto:${escape(contact.email)}">${escape(contact.email)}</a>`)
  lines.push(`📱 <a href="tel:${escape(contact.phone_e164)}">${escape(contact.phone_e164)}</a> · <a href="https://wa.me/${escape(contact.phone_e164.replace(/^\+/, ""))}">WhatsApp</a>`)
  lines.push("")
  lines.push(`🏢 ${escape(step2.label)} · ${escape(step3.label)}`)
  if (step4.category_label) lines.push(`🏷️ ${escape(step4.category_label)}`)
  if (wants.length > 0) lines.push(`✅ ${wants.map((w) => escape(w)).join(" · ")}`)
  if (utm) lines.push(utm.trim())

  if (leadUrl) {
    lines.push("")
    lines.push(`🔗 <a href="${escape(leadUrl)}">Open in Pipedrive</a>`)
  }

  return lines.join("\n")
}

export async function notifyTelegram(opts: NotifyOpts): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) {
    console.warn("[onboarding] Telegram not configured (TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID missing) — skipping notification")
    return
  }

  const domain = process.env.PIPEDRIVE_DOMAIN
  const leadUrl = domain ? `${domain.replace(/\/+$/, "")}/leads/inbox/${opts.leadId}` : null

  const text = buildMessage(opts, leadUrl)

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    })
    if (!res.ok) {
      const body = await res.text()
      console.error(`[onboarding] Telegram sendMessage failed (${res.status}): ${body.slice(0, 300)}`)
    }
  } catch (err) {
    console.error("[onboarding] Telegram fetch error:", err instanceof Error ? err.message : err)
  }
}
