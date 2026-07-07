import { NextResponse } from 'next/server'

/**
 * Sends workshop registration emails via Resend's REST API.
 * - Registrant: a confirmation email (only if they provided an address).
 * - Admin: a notification email (if WORKSHOP_ADMIN_EMAIL is set).
 *
 * Best-effort: the form treats this as non-blocking, so a mail failure never
 * blocks a successful registration.
 */

const RESEND_ENDPOINT = 'https://api.resend.com/emails'

type RegistrationBody = {
  full_name?: string
  designation?: string
  school_name?: string
  city?: string
  phone?: string
  email?: string | null
  payment_method?: string
}

const NAVY = '#0f2b4c'
const GOLD = '#c9a227'

function paymentLabel(method?: string): string {
  if (method === 'jazzcash') return 'JazzCash'
  if (method === 'cash_on_arrival') return 'Cash on Arrival'
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

function emailShell(heading: string, inner: string): string {
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
        <p style="margin:0;color:#9ca3af;font-size:12px;">Oyster School System, Islamabad · 0332-8308486</p>
      </div>
    </div>
  </div>`
}

function registrantHtml(body: RegistrationBody): string {
  const inner = `
    <p style="margin:0 0 16px;">Dear ${body.full_name ?? 'Registrant'},</p>
    <p style="margin:0 0 16px;">
      Your registration for the <strong>School Leadership in Action — Workshop</strong> has been confirmed!
      Please complete your payment before <strong>23 July 2026</strong>.
    </p>
    <p style="margin:0 0 16px;">
      For <strong>JazzCash</strong> payments send to <strong>0332-8308486</strong> and WhatsApp your payment
      screenshot to confirm. For <strong>cash</strong> payment bring <strong>Rs. 20,000</strong> on the day.
    </p>
    <div style="background:#f5f1e8;border-radius:8px;padding:16px 20px;margin:20px 0;">
      <p style="margin:0 0 4px;color:${GOLD};font-size:11px;letter-spacing:2px;text-transform:uppercase;font-weight:700;">Workshop Details</p>
      ${detailsTable([
        ['Date', '24–25 July 2026'],
        ['Time', '9:00 AM – 2:00 PM'],
        ['Venue', 'Oyster School System, Islamabad'],
        ['Investment', 'Rs. 20,000'],
        ['Payment Method', paymentLabel(body.payment_method)],
      ])}
    </div>
    <p style="margin:0;">Contact us at <strong>0332-8308486</strong> for any queries.</p>`
  return emailShell('Registration Confirmed', inner)
}

function adminHtml(body: RegistrationBody): string {
  const inner = `
    <p style="margin:0 0 16px;">A new workshop registration has been submitted.</p>
    ${detailsTable([
      ['Name', body.full_name ?? '—'],
      ['Designation', body.designation ?? '—'],
      ['School', body.school_name ?? '—'],
      ['City', body.city ?? '—'],
      ['Phone', body.phone ?? '—'],
      ['Email', body.email || '—'],
      ['Payment Method', paymentLabel(body.payment_method)],
    ])}`
  return emailShell('New Workshop Registration', inner)
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

  const tasks: Promise<{ ok: boolean; error?: string }>[] = []

  if (body.email) {
    tasks.push(
      sendEmail(apiKey, {
        from,
        to: body.email,
        subject: 'Your Workshop Registration is Confirmed — Oyster School System',
        html: registrantHtml(body),
      })
    )
  }

  if (adminEmail) {
    tasks.push(
      sendEmail(apiKey, {
        from,
        to: adminEmail,
        subject: `New Workshop Registration — ${body.full_name}`,
        html: adminHtml(body),
      })
    )
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
