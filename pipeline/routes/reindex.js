const express = require('express');
const router = express.Router();

const Article = require('../models/Article');
const { embedText } = require('../services/embeddings');

router.post('/reindex-gemini', async (_req, res) => {
  try {
    const cursor = Article.find().cursor();
    let count = 0;
    for await (const doc of cursor) {
      const base = `${doc.title || ''}\n\n${doc.rawBody || doc.articleContent || ''}`;
      const emb = await embedText(base);
      await Article.updateOne({ _id: doc._id }, { $set: { embedding: emb } });
      count += 1;
    }
    res.json({ message: 'Gemini reindex complete', count });
  } catch (e) {
    console.error('Reindex error:', e?.message || e);
    res.status(500).json({ error: 'Reindex failed' });
  }
});

module.exports = router;
