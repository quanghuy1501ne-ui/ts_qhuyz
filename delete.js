const { creds, isAdmin, readJson } = require('./_lib');
module.exports = async (req, res) => {
  try {
    if (!isAdmin(creds(req))) return res.status(401).json({ error: 'admin only' });
    const { path } = await readJson(req);
    if (!/^(pub|pri)\//.test(path || '')) return res.status(400).json({ error: 'bad path' });
    const { list, del } = await import('@vercel/blob');
    const r = await list({ prefix: path, limit: 5 });
    const b = r.blobs.find(x => x.pathname === path);
    if (b) await del(b.url);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: String(e.message || e) }); }
};
