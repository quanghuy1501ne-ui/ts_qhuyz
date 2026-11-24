const { creds, isAdmin, tabOf, titleFromPath } = require('./_lib');
module.exports = async (req, res) => {
  try {
    const tab = tabOf(req.query.tab);
    if (tab === 'pri' && !isAdmin(creds(req))) return res.status(401).json({ error: 'admin only' });
    const { list } = await import('@vercel/blob');
    const r = await list({ prefix: tab + '/', limit: 1000 });
    const items = r.blobs.sort((a, b) => a.pathname.localeCompare(b.pathname))
      .map(b => ({ path: b.pathname, url: b.url, t: titleFromPath(b.pathname), size: b.size }));
    res.setHeader('Cache-Control', 'no-store');
    res.json({ items });
  } catch (e) { res.status(500).json({ error: String(e.message || e) }); }
};
