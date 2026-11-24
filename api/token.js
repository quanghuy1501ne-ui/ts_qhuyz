// Big files: gives the browser a one-off token to upload straight to Blob.
const { isAdmin, tabOf, makePath } = require('./_lib');
module.exports = async (req, res) => {
  try {
    const { handleUpload } = await import('@vercel/blob/client');
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const out = await handleUpload({
      body, request: req,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        let c = {}; try { c = JSON.parse(clientPayload || '{}'); } catch (e) {}
        if (!isAdmin(c)) throw new Error('admin only');
        return { allowedContentTypes: ['audio/*', 'video/*'], maximumSizeInBytes: 200 * 1024 * 1024, addRandomSuffix: true };
      },
      onUploadCompleted: async () => {}
    });
    res.json(out);
  } catch (e) { res.status(400).json({ error: String(e.message || e) }); }
};
