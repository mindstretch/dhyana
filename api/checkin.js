// Check-in persistence. Mirrors api/subscribe.js: raw Supabase REST with the
// service key (bypasses RLS), same env var names as configured in Vercel.
//
//   POST { device_id, state }          -> inserts a check-in, returns { id }
//   POST { id, reflection }            -> attaches a reflection to that check-in
//   GET  ?device_id=<id>               -> returns that device's recent check-ins

module.exports = async (req, res) => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing env vars', { supabaseUrl: !!supabaseUrl, supabaseKey: !!supabaseKey });
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const base = `${supabaseUrl}/rest/v1/checkins`;
  const headers = {
    'Content-Type': 'application/json',
    apikey: supabaseKey,
    Authorization: `Bearer ${supabaseKey}`,
  };

  try {
    // ── List a device's recent check-ins ──
    if (req.method === 'GET') {
      const deviceId = req.query.device_id;
      if (!deviceId) return res.status(400).json({ error: 'device_id required' });

      const url = `${base}?device_id=eq.${encodeURIComponent(deviceId)}`
        + `&order=created_at.desc&limit=20&select=id,state,reflection,reflection_data,created_at`;
      const r = await fetch(url, { headers });
      if (!r.ok) { console.error('Supabase read error:', await r.text()); return res.status(500).json({ error: 'Read failed' }); }
      return res.status(200).json({ checkins: await r.json() });
    }

    if (req.method === 'POST') {
      const { id, device_id, state, reflection, reflection_data, program_day } = req.body || {};

      // ── Attach a reflection (free-text and/or structured) to an existing check-in ──
      if (id) {
        const patch = {};
        if (reflection !== undefined)      patch.reflection = reflection ?? null;
        if (reflection_data !== undefined) patch.reflection_data = reflection_data ?? null;
        const r = await fetch(`${base}?id=eq.${encodeURIComponent(id)}`, {
          method: 'PATCH',
          headers: { ...headers, Prefer: 'return=minimal' },
          body: JSON.stringify(patch),
        });
        if (!r.ok) { console.error('Supabase update error:', await r.text()); return res.status(500).json({ error: 'Update failed' }); }
        return res.status(200).json({ success: true });
      }

      // ── New check-in ──
      if (!device_id || !state) return res.status(400).json({ error: 'device_id and state required' });
      const r = await fetch(base, {
        method: 'POST',
        headers: { ...headers, Prefer: 'return=representation' },
        body: JSON.stringify({ device_id, state, program_day: program_day ?? null, reflection: reflection ?? null }),
      });
      if (!r.ok) { console.error('Supabase insert error:', await r.text()); return res.status(500).json({ error: 'Save failed' }); }
      const rows = await r.json();
      return res.status(200).json({ id: rows[0] && rows[0].id });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    console.error('checkin error:', e);
    return res.status(500).json({ error: 'Server error' });
  }
};
