import type { VercelRequest, VercelResponse } from '@vercel/node';

interface SubscribeBody {
  email: string;
  state?: string | null;
}

/* ─────────────────────────────────────────────────────────
   STATE CONFIG
   Maps the orb state key → human label + color + opening line
   that makes the email feel personal without being clinical.
───────────────────────────────────────────────────────── */
const STATE_MAP: Record<string, { label: string; color: string; line: string }> = {
  restful:   {
    label: 'Restful Alertness',
    color: '#E8A855',
    line:  'You showed up clear. That's rarer than it sounds.',
  },
  regulated: {
    label: 'Regulated',
    color: '#6FA89A',
    line:  'You showed up steady. Build from here.',
  },
  activated: {
    label: 'Activated',
    color: '#C96B5A',
    line:  'You showed up running hot. Dhyana would know what to do with that.',
  },
  depleted:  {
    label: 'Depleted',
    color: '#5A6E8A',
    line:  'You showed up on empty. That took something.',
  },
  dysreg:    {
    label: 'Dysregulated',
    color: '#7A6880',
    line:  'You showed up scattered. The fact that you checked in at all means something.',
  },
};

const DEFAULT_STATE = {
  label: null,
  color: '#E8A855',
  line:  'You showed up. That's where it starts.',
};

/* ─────────────────────────────────────────────────────────
   EMAIL TEMPLATE
   Dark, typographic, breathing room. Feels like the site.
   State-aware opening line — personal without being clinical.
───────────────────────────────────────────────────────── */
function buildEmail(email: string, stateKey: string | null | undefined): { subject: string; html: string } {
  const state = (stateKey && STATE_MAP[stateKey]) ? STATE_MAP[stateKey] : DEFAULT_STATE;
  const accentColor = state.color;

  const subject = 'You're on the Dhyana waitlist.';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>You're on the list.</title>
</head>
<body style="margin:0;padding:0;background:#0E1219;-webkit-font-smoothing:antialiased;">

  <!-- Outer wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
         style="background:#0E1219;min-height:100vh;">
    <tr>
      <td align="center" style="padding:56px 24px 48px;">

        <!-- Card -->
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
               style="max-width:480px;width:100%;">

          <!-- Wordmark -->
          <tr>
            <td style="padding-bottom:48px;">
              <p style="margin:0;
                         font-family:Georgia,'Times New Roman',serif;
                         font-style:italic;
                         font-size:22px;
                         letter-spacing:0.02em;
                         color:rgba(255,255,255,0.5);">Dhyana</p>
            </td>
          </tr>

          <!-- Accent rule — state color -->
          <tr>
            <td style="padding-bottom:32px;">
              <div style="width:32px;height:1.5px;background:${accentColor};opacity:0.8;"></div>
            </td>
          </tr>

          <!-- Headline -->
          <tr>
            <td style="padding-bottom:28px;">
              <p style="margin:0;
                         font-family:Georgia,'Times New Roman',serif;
                         font-style:italic;
                         font-size:28px;
                         font-weight:400;
                         line-height:1.25;
                         letter-spacing:-0.01em;
                         color:rgba(255,255,255,0.92);">You're on the list.</p>
            </td>
          </tr>

          <!-- State-aware opening line -->
          <tr>
            <td style="padding-bottom:24px;">
              <p style="margin:0;
                         font-family:Helvetica,Arial,sans-serif;
                         font-size:15px;
                         font-weight:300;
                         line-height:1.7;
                         color:rgba(255,255,255,0.72);">${state.line}</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding-bottom:24px;">
              <p style="margin:0;
                         font-family:Helvetica,Arial,sans-serif;
                         font-size:15px;
                         font-weight:300;
                         line-height:1.7;
                         color:rgba(255,255,255,0.44);">Dhyana reads your nervous system — not your steps, your sleep score, or your streak. Just where you actually are. Then it tells you exactly what to do about it.</p>
            </td>
          </tr>

          <tr>
            <td style="padding-bottom:48px;">
              <p style="margin:0;
                         font-family:Helvetica,Arial,sans-serif;
                         font-size:15px;
                         font-weight:300;
                         line-height:1.7;
                         color:rgba(255,255,255,0.44);">We'll find you when it's ready.</p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="border-top:1px solid rgba(255,255,255,0.07);padding-top:28px;">
              <p style="margin:0;
                         font-family:Helvetica,Arial,sans-serif;
                         font-size:11px;
                         color:rgba(255,255,255,0.2);
                         line-height:1.7;
                         letter-spacing:0.03em;">
                <a href="https://dhyanaflow.com" style="color:rgba(255,255,255,0.2);text-decoration:none;">dhyanaflow.com</a>
                &nbsp;·&nbsp;
                You received this because you joined the Dhyana waitlist.
              </p>
            </td>
          </tr>

        </table>
        <!-- /Card -->

      </td>
    </tr>
  </table>

</body>
</html>`;

  return { subject, html };
}

/* ─────────────────────────────────────────────────────────
   HANDLER
───────────────────────────────────────────────────────── */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { email, state } = req.body as SubscribeBody;

  if (!email || !email.includes('@')) {
    res.status(400).json({ error: 'Invalid email' });
    return;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SECRET_KEY;
  const resendKey   = process.env.RESEND_API_KEY;
  const fromEmail   = process.env.FROM_EMAIL ?? 'Dhyana <hello@dhyanaflow.com>';

  if (!supabaseUrl || !supabaseKey || !resendKey) {
    console.error('Missing required environment variables');
    res.status(500).json({ error: 'Server configuration error' });
    return;
  }

  // 1. Save to Supabase
  const sbRes = await fetch(`${supabaseUrl}/rest/v1/waitlist`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({ email, state: state ?? null }),
  });

  // 409 = duplicate — not an error
  if (!sbRes.ok && sbRes.status !== 409) {
    const errText = await sbRes.text();
    console.error('Supabase error:', errText);
    res.status(500).json({ error: 'Failed to save email' });
    return;
  }

  const isDuplicate = sbRes.status === 409;

  // 2. Send confirmation email (new signups only)
  if (!isDuplicate) {
    const { subject, html } = buildEmail(email, state);

    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendKey}`,
      },
      body: JSON.stringify({ from: fromEmail, to: [email], subject, html }),
    });

    if (!resendRes.ok) {
      const errText = await resendRes.text();
      console.error('Resend error:', errText);
      // Don't fail the whole request — signup is the critical path
    }
  }

  res.status(200).json({ success: true, duplicate: isDuplicate });
}
