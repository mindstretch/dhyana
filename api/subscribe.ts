import type { VercelRequest, VercelResponse } from '@vercel/node';

interface SubscribeBody {
  email: string;
  state?: string | null;
}

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
  const resendKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.FROM_EMAIL ?? 'Dhyana <onboarding@resend.dev>';

  if (!supabaseUrl || !supabaseKey || !resendKey) {
    console.error('Missing required environment variables');
    res.status(500).json({ error: 'Server configuration error' });
    return;
  }

  // 1. Insert into Supabase waitlist table
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

  // 409 = duplicate — not an error, just already signed up
  if (!sbRes.ok && sbRes.status !== 409) {
    const errText = await sbRes.text();
    console.error('Supabase error:', errText);
    res.status(500).json({ error: 'Failed to save email' });
    return;
  }

  const isDuplicate = sbRes.status === 409;

  // 2. Send confirmation via Resend (new signups only)
  if (!isDuplicate) {
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [email],
        subject: "You're on the Dhyana waitlist.",
        html: `
          <!DOCTYPE html>
          <html>
          <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width"></head>
          <body style="margin:0;padding:0;background:#0E1219;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#0E1219;padding:48px 0;">
              <tr><td align="center">
                <table width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;padding:0 24px;">
                  <tr>
                    <td style="padding-bottom:36px;">
                      <p style="margin:0;font-family:Georgia,serif;font-style:italic;font-size:20px;color:rgba(255,255,255,0.88);">Dhyana</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-bottom:20px;">
                      <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:24px;font-weight:300;color:rgba(255,255,255,0.92);line-height:1.3;">You're on the list.</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-bottom:20px;">
                      <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:15px;font-weight:300;color:rgba(255,255,255,0.52);line-height:1.75;">
                        Dhyana reads your nervous system and tells you exactly what to do about it. We're building something that meets you where you are — every morning, in under 60 seconds.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-bottom:40px;">
                      <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:15px;font-weight:300;color:rgba(255,255,255,0.52);line-height:1.75;">
                        We'll find you when it's ready.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="border-top:1px solid rgba(255,255,255,0.08);padding-top:24px;">
                      <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:11px;color:rgba(255,255,255,0.22);line-height:1.6;">
                        dhyanaflow.com &nbsp;·&nbsp; You're receiving this because you joined the Dhyana waitlist.
                      </p>
                    </td>
                  </tr>
                </table>
              </td></tr>
            </table>
          </body>
          </html>
        `,
      }),
    });

    if (!resendRes.ok) {
      const errText = await resendRes.text();
      console.error('Resend error:', errText);
      // Don't fail the request — signup succeeded, email is secondary
    }
  }

  res.status(200).json({ success: true, duplicate: isDuplicate });
}
