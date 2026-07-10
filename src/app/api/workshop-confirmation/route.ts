import { NextResponse } from 'next/server'

/**
 * Sends workshop / training registration emails via Resend's REST API.
 *
 * Shared by every program in the workshop_registrations table (keyed by
 * `program`). Two stages:
 * - stage 'submitted' (default): fired when a registration is created.
 *     · EasyPaisa → registrant gets a "received, pending verification" holding email.
 *     · Cash on arrival → registrant gets a confirmation (bring cash on the day).
 *     · Free tier → registrant gets an immediate confirmation (no payment).
 *     · Admin gets a notification (with the receipt link) so they can verify.
 * - stage 'verified': fired when an admin marks a registration verified.
 *     · Registrant gets the final "payment verified — you're confirmed" email.
 *
 * Best-effort: callers treat this as non-blocking, so a mail failure never
 * blocks a saved registration or a status change.
 */

const RESEND_ENDPOINT = 'https://api.resend.com/emails'

type Stage = 'submitted' | 'verified'

type RegistrationBody = {
  full_name?: string
  designation?: string
  school_name?: string
  city?: string
  phone?: string
  email?: string | null
  payment_method?: string
  receipt_url?: string | null
  program?: string
  category_label?: string
  fee_label?: string
  stage?: Stage
}

type ProgramConfig = {
  title: string
  dateLabel: string
  timeLabel: string
  venue: string
  contactPhone: string
  defaultFeeLabel: string
}

const NAVY = '#0f2b4c'
const GOLD = '#c9a227'
const EASYPAISA_NUMBER = '0336-5816350'

const PROGRAMS: Record<string, ProgramConfig> = {
  leadership_workshop: {
    title: 'School Leadership in Action — Workshop',
    dateLabel: '24–25 July 2026',
    timeLabel: '9:00 AM – 2:00 PM',
    venue: 'Oyster School System, Islamabad',
    contactPhone: '0332-8308486',
    defaultFeeLabel: 'Rs. 20,000',
  },
  five_day_training: {
    title: '5-Day Training Program — Teaching Fundamentals',
    dateLabel: '27–31 July 2026',
    timeLabel: '8:30 AM – 2:00 PM',
    venue: 'High School St. #36, Block-C, PWD',
    contactPhone: '033-2830-8486',
    defaultFeeLabel: 'Rs. 3,000',
  },
}

function resolveProgram(program?: string): ProgramConfig {
  return PROGRAMS[program ?? ''] ?? PROGRAMS.leadership_workshop
}

function paymentLabel(method?: string): string {
  if (method === 'easypaisa') return 'EasyPaisa'
  if (method === 'jazzcash') return 'JazzCash'
  if (method === 'cash_on_arrival') return 'Cash on Arrival'
  if (method === 'free') return 'Free'
  return method ?? '—'
}

function detailsTable(rows: [string, string][]): string {
  return `
    <table style="width:100%;border-collapse:collapse;margin-top:8px;">
      ${rows
        .map(
          ([label, value]) => `
        <tr>
          <td style="padding:6px 12px 6px 0;color:#6b7280;font-size:14px;white-space:nowrap;vertical-align:top;">${label}</td>
          <td style="padding:6px 0;color:${NAVY};font-size:14px;font-weight:600;">${value}</td>
        </tr>`
        )
        .join('')}
    </table>`
}

function programDetailsBlock(cfg: ProgramConfig, body: RegistrationBody): string {
  const extra: [string, string][] = []
  if (body.category_label) extra.push(['Category', body.category_label])
  extra.push(['Investment', body.fee_label || cfg.defaultFeeLabel])
  extra.push(['Payment Method', paymentLabel(body.payment_method)])
  return `
    <div style="background:#f5f1e8;border-radius:8px;padding:16px 20px;margin:20px 0;">
      <p style="margin:0 0 4px;color:${GOLD};font-size:11px;letter-spacing:2px;text-transform:uppercase;font-weight:700;">${cfg.title}</p>
      ${detailsTable([
        ['Date', cfg.dateLabel],
        ['Time', cfg.timeLabel],
        ['Venue', cfg.venue],
        ...extra,
      ])}
    </div>`
}

function emailShell(heading: string, inner: string, contactPhone: string): string {
  return `
  <div style="background:#f5f1e8;padding:24px;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #eee;">
      <div style="background:${NAVY};padding:28px 32px;text-align:center;">
        <p style="margin:0 0 6px;color:${GOLD};font-size:12px;letter-spacing:2px;text-transform:uppercase;font-weight:700;">Oyster School System</p>
        <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:600;">${heading}</h1>
      </div>
      <div style="padding:28px 32px;color:#374151;font-size:15px;line-height:1.6;">
        ${inner}
      </div>
      <div style="background:${NAVY};padding:16px 32px;text-align:center;">
        <p style="margin:0;color:#9ca3af;font-size:12px;">Oyster School System · ${contactPhone}</p>
      </div>
    </div>
  </div>`
}

/** EasyPaisa, stage 'submitted' — payment received, awaiting verification. */
function registrantPendingHtml(cfg: ProgramConfig, body: RegistrationBody): string {
  const feeLabel = body.fee_label || cfg.defaultFeeLabel
  const inner = `
    <p style="margin:0 0 16px;">Dear ${body.full_name ?? 'Registrant'},</p>
    <p style="margin:0 0 16px;">
      Thank you for registering for the <strong>${cfg.title}</strong>. We have received your
      registration along with your <strong>EasyPaisa</strong> payment receipt.
    </p>
    <div style="background:#fdf6e3;border:1px solid ${GOLD};border-radius:8px;padding:14px 18px;margin:0 0 16px;">
      <p style="margin:0;color:${NAVY};font-size:14px;font-weight:600;">⏳ Your payment is under review.</p>
      <p style="margin:6px 0 0;color:#6b7280;font-size:14px;">
        Our team will verify your payment of ${feeLabel} (sent to ${EASYPAISA_NUMBER}). Once verified, you
        will receive a final confirmation email that you can show to attend.
      </p>
    </div>
    ${programDetailsBlock(cfg, body)}
    <p style="margin:0;">Contact us at <strong>${cfg.contactPhone}</strong> for any queries.</p>`
  return emailShell('Registration Received', inner, cfg.contactPhone)
}

/** Cash on arrival, stage 'submitted' — confirmed, bring cash. */
function registrantCashHtml(cfg: ProgramConfig, body: RegistrationBody): string {
  const feeLabel = body.fee_label || cfg.defaultFeeLabel
  const inner = `
    <p style="margin:0 0 16px;">Dear ${body.full_name ?? 'Registrant'},</p>
    <p style="margin:0 0 16px;">
      Your registration for the <strong>${cfg.title}</strong> has been confirmed!
    </p>
    <p style="margin:0 0 16px;">
      You have chosen to pay by <strong>cash on arrival</strong>. Please bring <strong>${feeLabel}</strong> in
      cash on the day.
    </p>
    ${programDetailsBlock(cfg, body)}
    <p style="margin:0;">Contact us at <strong>${cfg.contactPhone}</strong> for any queries.</p>`
  return emailShell('Registration Confirmed', inner, cfg.contactPhone)
}

/** Free tier, stage 'submitted' — no payment, immediate confirmation. */
function registrantFreeHtml(cfg: ProgramConfig, body: RegistrationBody): string {
  const inner = `
    <p style="margin:0 0 16px;">Dear ${body.full_name ?? 'Registrant'},</p>
    <p style="margin:0 0 16px;">
      Your registration for the <strong>${cfg.title}</strong> is <strong>confirmed</strong>.
    </p>
    <div style="background:#ecfdf5;border:1px solid #10b981;border-radius:8px;padding:14px 18px;margin:0 0 16px;">
      <p style="margin:0;color:${NAVY};font-size:14px;font-weight:600;">✅ You're all set — no payment required.</p>
      <p style="margin:6px 0 0;color:#6b7280;font-size:14px;">Please <strong>show this email</strong> at the venue to attend.</p>
    </div>
    ${programDetailsBlock(cfg, body)}
    <p style="margin:0;">We look forward to seeing you. Contact us at <strong>${cfg.contactPhone}</strong> for any queries.</p>`
  return emailShell('Registration Confirmed', inner, cfg.contactPhone)
}

/** stage 'verified' — admin confirmed the payment; final confirmation. */
function registrantVerifiedHtml(cfg: ProgramConfig, body: RegistrationBody): string {
  const inner = `
    <p style="margin:0 0 16px;">Dear ${body.full_name ?? 'Registrant'},</p>
    <p style="margin:0 0 16px;">
      Great news — your payment has been <strong>verified</strong> and your place at the
      <strong>${cfg.title}</strong> is now <strong>confirmed</strong>.
    </p>
    <div style="background:#ecfdf5;border:1px solid #10b981;border-radius:8px;padding:14px 18px;margin:0 0 16px;">
      <p style="margin:0;color:${NAVY};font-size:14px;font-weight:600;">✅ You're all set!</p>
      <p style="margin:6px 0 0;color:#6b7280;font-size:14px;">
        Please <strong>show this email</strong> at the venue to attend.
      </p>
    </div>
    ${programDetailsBlock(cfg, body)}
    <p style="margin:0;">We look forward to seeing you. Contact us at <strong>${cfg.contactPhone}</strong> for any queries.</p>`
  return emailShell('Payment Verified — You’re Confirmed', inner, cfg.contactPhone)
}

function adminHtml(cfg: ProgramConfig, body: RegistrationBody): string {
  const receiptCell = body.receipt_url
    ? `<a href="${body.receipt_url}" style="color:${GOLD};font-weight:600;">View receipt</a>`
    : '—'
  const note =
    body.payment_method === 'easypaisa'
      ? `<p style="margin:0 0 16px;color:#b45309;">Action needed: review the receipt and mark this registration <strong>Verified</strong> in the admin panel to confirm the registrant.</p>`
      : ''
  const inner = `
    <p style="margin:0 0 16px;">A new registration for <strong>${cfg.title}</strong> has been submitted.</p>
    ${note}
    ${detailsTable([
      ['Name', body.full_name ?? '—'],
      ['Designation', body.designation ?? '—'],
      ['School', body.school_name ?? '—'],
      ['City', body.city ?? '—'],
      ['Phone', body.phone ?? '—'],
      ['Email', body.email || '—'],
      ...(body.category_label ? ([['Category', body.category_label]] as [string, string][]) : []),
      ['Fee', body.fee_label || cfg.defaultFeeLabel],
      ['Payment Method', paymentLabel(body.payment_method)],
      ['Payment Receipt', receiptCell],
    ])}`
  return emailShell('New Registration', inner, cfg.contactPhone)
}

async function sendEmail(
  apiKey: string,
  payload: { from: string; to: string; subject: string; html: string }
): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      const text = await res.text()
      return { ok: false, error: `${res.status}: ${text}` }
    }
    return { ok: true }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

export async function POST(req: Request) {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.WORKSHOP_FROM_EMAIL
  const adminEmail = process.env.WORKSHOP_ADMIN_EMAIL

  if (!apiKey || !from) {
    return NextResponse.json(
      { error: 'Email is not configured. Set RESEND_API_KEY and WORKSHOP_FROM_EMAIL.' },
      { status: 500 }
    )
  }

  let body: RegistrationBody
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  if (!body.full_name || !body.payment_method) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
  }

  const cfg = resolveProgram(body.program)
  const stage: Stage = body.stage === 'verified' ? 'verified' : 'submitted'
  const method = body.payment_method
  const tasks: Promise<{ ok: boolean; error?: string }>[] = []

  if (stage === 'verified') {
    // Final confirmation to the registrant only.
    if (body.email) {
      tasks.push(
        sendEmail(apiKey, {
          from,
          to: body.email,
          subject: `Payment Verified — Your Registration is Confirmed — ${cfg.title}`,
          html: registrantVerifiedHtml(cfg, body),
        })
      )
    }
  } else {
    // stage 'submitted'
    if (body.email) {
      let html: string
      let subject: string
      if (method === 'easypaisa') {
        html = registrantPendingHtml(cfg, body)
        subject = `Registration Received — Payment Under Review — ${cfg.title}`
      } else if (method === 'free') {
        html = registrantFreeHtml(cfg, body)
        subject = `Your Registration is Confirmed — ${cfg.title}`
      } else {
        html = registrantCashHtml(cfg, body)
        subject = `Your Registration is Confirmed — ${cfg.title}`
      }
      tasks.push(sendEmail(apiKey, { from, to: body.email, subject, html }))
    }

    if (adminEmail) {
      tasks.push(
        sendEmail(apiKey, {
          from,
          to: adminEmail,
          subject: `New Registration (${cfg.title}) — ${body.full_name}`,
          html: adminHtml(cfg, body),
        })
      )
    }
  }

  const results = await Promise.all(tasks)
  const failed = results.filter((r) => !r.ok)

  if (failed.length > 0) {
    return NextResponse.json(
      { ok: false, errors: failed.map((f) => f.error) },
      { status: 502 }
    )
  }

  return NextResponse.json({ ok: true })
}
