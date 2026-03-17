export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, state } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  // 1. Insert into Supabase
  const sbRes = await fetch(`${process.env.SUPABASE_URL}/rest/v1/waitlist`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': process.env.SUPABASE_SECRET_KEY,
      'Authorization': `Bearer ${process.env.SUPABASE_SECRET_KEY}`,
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify({ email, state: state || null })
  });

  // 409 = duplicate — not an error, just already signed up
  if (!sbRes.ok && sbRes.status !== 409) {
    const err = await sbRes.text();
    console.error('Supabase error:', err);
    return res.status(500).json({ error: 'Failed to save email' });
  }

  const isDuplicate = sbRes.status === 409;

  // 2. Send confirmation via Resend (only for new signups)
  if (!isDuplicate) {
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: process.env.FROM_EMAIL || 'Dhyana <onboarding@resend.dev>',
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
        `
      })
    });

    if (!resendRes.ok) {
      const err = await resendRes.text();
      console.error('Resend error:', err);
      // Don't fail the request — signup succeeded, email is a bonus
    }
  }

  return res.status(200).json({ success: true, duplicate: isDuplicate });
}
