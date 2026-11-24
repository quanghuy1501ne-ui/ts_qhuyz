const { creds, isAdmin } = require('./_lib');
module.exports = (req, res) => { res.status(isAdmin(creds(req)) ? 200 : 401).json({ ok: isAdmin(creds(req)) }); };
