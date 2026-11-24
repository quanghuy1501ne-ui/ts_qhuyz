const { creds, isAdmin, readJson, makePath } = require('./_lib');
module.exports = async (req, res) => {
  try {
    if (!isAdmin(creds(req))) return res.status(401).json({ error: 'admin only' });
    const { path, title } = await readJson(req);
    if (!/^(pub|pri)\//.test(path || '') || !title) return res.status(400).json({ error: 'bad input' });
    const { list, copy, del } = await import('@vercel/blob');
    const r = await list({ prefix: path, limit: 5 });
    const b = r.blobs.find(x => x.pathname === path);
    if (!b) return res.status(404).json({ error: 'not found' });
    const ts = path.split('/').pop().split('-')[0];
    const ext = (path.match(/\.[^.]+$/) || [''])[0];
    const np = path.split('/')[0] + '/' + ts + '-' + encodeURIComponent(String(title).slice(0, 80)).replace(/%2F/gi, '_') + ext;
    await copy(b.url, np, { access: 'public', addRandomSuffix: false });
    await del(b.url);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: String(e.message || e) }); }
};
