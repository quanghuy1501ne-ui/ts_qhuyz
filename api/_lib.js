// Use whichever *_READ_WRITE_TOKEN variable Vercel created (it may carry a prefix)
if (!process.env.BLOB_READ_WRITE_TOKEN) {
  const k = Object.keys(process.env).find(k => /_READ_WRITE_TOKEN$/.test(k));
  if (k) process.env.BLOB_READ_WRITE_TOKEN = process.env[k];
}
// Shared helpers for the music API (admin check, blob naming)
function creds(req){
  let u = req.headers['x-user'], p = req.headers['x-pass'];
  try { u = u ? decodeURIComponent(u) : u; p = p ? decodeURIComponent(p) : p; } catch (e) {}
  return { u, p };
}
function isAdmin(c){
  const U = process.env.ADMIN_USER, P = process.env.ADMIN_PASS;
  return !!(U && P && c && c.u === U && c.p === P);
}
const tabOf = t => (t === 'pri' ? 'pri' : 'pub');
async function readJson(req){
  if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) return req.body;
  const chunks = []; for await (const c of req) chunks.push(c);
  try { return JSON.parse(Buffer.concat(chunks).toString() || '{}'); } catch (e) { return {}; }
}
function titleFromPath(p){ // pri/1700000000000-<encoded title>.ext
  const name = p.split('/').pop().replace(/\.[^.]+$/, '');
  const i = name.indexOf('-');
  try { return decodeURIComponent(i >= 0 ? name.slice(i + 1) : name); } catch (e) { return name; }
}
const makePath = (tab, title, ext) =>
  `${tabOf(tab)}/${Date.now()}-${encodeURIComponent(String(title).slice(0, 80)).replace(/%2F/gi, '_')}${ext}`;
module.exports = { creds, isAdmin, tabOf, readJson, titleFromPath, makePath };
