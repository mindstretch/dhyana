const STATE_MAP = {
  restful:   { color: '#E8A855', line: "You showed up clear. That\u2019s rarer than it sounds." },
  regulated: { color: '#6FA89A', line: "You showed up steady. Build from here." },
  activated: { color: '#C96B5A', line: "You showed up running hot. Dhyana would know what to do with that." },
  depleted:  { color: '#5A6E8A', line: "You showed up on empty. That took something." },
  dysreg:    { color: '#7A6880', line: "You showed up scattered. The fact that you checked in at all means something." },
};

const DEFAULT_STATE = { color: '#E8A855', line: "You showed up. That\u2019s where it starts." };

function buildEmail(stateKey) {
  const state = (stateKey && STATE_MAP[stateKey]) ? STATE_MAP[stateKey] : DEFAULT_STATE;
  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0E1219;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0E1219;min-height:100vh;">
    <tr><td align="center" style="padding:56px 24px 48px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;">
        <tr><td style="padding-bottom:48px;">
          <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-style:italic;font-size:22px;color:rgba(255,255,255,0.5);">Dhyana</p>
        </td></tr>
        <tr><td style="padding-bottom:32px;">
          <div style="width:32px;height:1.5px;background:${state.color};opacity:0.8;"></div>
        </td></tr>
        <tr><td style="padding-bottom:28px;">
          <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-style:italic;font-size:28px;font-weight:400;line-height:1.25;color:rgba(255,255,255,0.92);">You\u2019re on the list.</p>
        </td></tr>
        <tr><td style="padding-bottom:24px;">
          <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:15px;font-weight:300;line-height:1.7;color:rgba(255,255,255,0.72);">${state.line}</p>
        </td></tr>
        <tr><td style="padding-bottom:24px;">
          <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:15px;font-weight:300;line-height:1.7;color:rgba(255,255,255,0.44);">Dhyana reads your nervous system \u2014 not your steps, your sleep score, or your streak. Just where you actually are. Then it tells you exactly what to do about it.</p>
        </td></tr>
        <tr><td style="padding-bottom:48px;">
          <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:15px;font-weight:300;line-height:1.7;color:rgba(255,255,255,0.44);">We\u2019ll find you when it\u2019s ready.</p>
        </td></tr>
        <tr><td style="border-top:1px solid rgba(255,255,255,0.07);padding-top:28px;">
          <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:11px;color:rgba(255,255,255,0.2);line-height:1.7;">
            <a href="https://dhyanaflow.com" style="color:rgba(255,255,255,0.2);text-decoration:none;">dhyanaflow.com</a>
            &nbsp;\u00b7&nbsp;You received this because you joined the Dhyana waitlist.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
  return { subject: "You\u2019re on the Dhyana waitlist.", html };
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, state } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SECRET_KEY;
  const resendKey   = process.env.RESEND_API_KEY;
  const fromEmail   = process.env.FROM_EMAIL || 'Dhyana <hello@dhyanaflow.com>';

  if (!supabaseUrl || !supabaseKey || !resendKey) {
    console.error('Missing env vars', { supabaseUrl: !!supabaseUrl, supabaseKey: !!supabaseKey, resendKey: !!resendKey });
    return res.status(500).json({ error: 'Server configuration error' });
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
    body: JSON.stringify({ email, state: state || null }),
  });

  if (!sbRes.ok && sbRes.status !== 409) {
    const err = await sbRes.text();
    console.error('Supabase error:', err);
    return res.status(500).json({ error: 'Failed to save email' });
  }

  const isDuplicate = sbRes.status === 409;

  // 2. Send confirmation email + internal notification
  if (!isDuplicate) {
    const { subject, html } = buildEmail(state);

    // Confirmation to user
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${resendKey}` },
      body: JSON.stringify({ from: fromEmail, to: [email], subject, html }),
    });
    if (!resendRes.ok) {
      console.error('Resend error:', await resendRes.text());
    }

    // Internal notification to hello@dhyanaflow.com
    const stateLabel = STATE_MAP[state] ? state.charAt(0).toUpperCase() + state.slice(1) : 'Unknown';
    const notifHtml = `<div style="font-family:Helvetica,sans-serif;padding:32px;background:#0E1219;color:rgba(255,255,255,0.8);">
      <p style="font-family:Georgia,serif;font-style:italic;font-size:18px;color:rgba(255,255,255,0.5);margin:0 0 24px;">Dhyana</p>
      <div style="width:32px;height:1.5px;background:${STATE_MAP[state]?.color || '#E8A855'};margin-bottom:24px;"></div>
      <p style="font-size:20px;font-weight:400;margin:0 0 16px;color:rgba(255,255,255,0.92);">New waitlist signup</p>
      <p style="font-size:15px;margin:0 0 8px;color:rgba(255,255,255,0.6);"><strong style="color:rgba(255,255,255,0.88);">Email:</strong> ${email}</p>
      <p style="font-size:15px;margin:0 0 8px;color:rgba(255,255,255,0.6);"><strong style="color:rgba(255,255,255,0.88);">State:</strong> ${stateLabel}</p>
      <p style="font-size:15px;margin:0;color:rgba(255,255,255,0.6);"><strong style="color:rgba(255,255,255,0.88);">Time:</strong> ${new Date().toUTCString()}</p>
    </div>`;

    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${resendKey}` },
      body: JSON.stringify({
        from: fromEmail,
        to: ['hello@dhyanaflow.com'],
        subject: `New signup — ${email} (${stateLabel})`,
        html: notifHtml,
      }),
    });
  }

  return res.status(200).json({ success: true, duplicate: isDuplicate });
};
