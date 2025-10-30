import express from 'express';
const router = express.Router();
import { verifyToken } from '../../utils/verifyUser.js';

import Post from '../../models/post.model.js';
import { embedText } from '../../services/embeddings.js';

router.post('/reindex', verifyToken, async (req, res) => {
  // Only allow admin to reindex
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: 'Only admin can reindex posts' });
  }

  try {
    const cursor = Post.find({ isGenerated: true }).cursor();
    let count = 0;
    for await (const doc of cursor) {
      const base = `${doc.title || ''}\n\n${doc.content || ''}`;
      const emb = await embedText(base);
      await Post.updateOne({ _id: doc._id }, { $set: { embedding: emb } });
      count += 1;
    }
    res.json({ message: 'Reindex complete', count });
  } catch (e) {
    console.error('Reindex error:', e?.message || e);
    res.status(500).json({ error: 'Reindex failed' });
  }
});

export default router;