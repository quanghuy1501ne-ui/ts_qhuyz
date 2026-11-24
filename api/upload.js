// Small files (<= ~4 MB): the browser sends the raw file here.
const { creds, isAdmin, tabOf, makePath } = require('./_lib');
module.exports = async (req, res) => {
  try {
    if (!isAdmin(creds(req))) return res.status(401).json({ error: 'admin only' });
    const chunks = []; for await (const c of req) chunks.push(c);
    const buf = Buffer.concat(chunks);
    const name = decodeURIComponent(req.headers['x-filename'] || 'track');
    const ext = (name.match(/\.[^.]+$/) || [''])[0];
    const title = name.replace(/\.[^.]+$/, '');
    const { put } = await import('@vercel/blob');
    const b = await put(makePath(tabOf(req.headers['x-tab']), title, ext), buf, {
      access: 'public', contentType: req.headers['x-type'] || 'application/octet-stream', addRandomSuffix: true });
    res.json({ ok: true, url: b.url });
  } catch (e) { res.status(500).json({ error: String(e.message || e) }); }
};
