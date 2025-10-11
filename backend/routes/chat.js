const express = require('express');
const router = express.Router();
const { embedText } = require('../services/embeddings');
const { searchSimilarMongo } = require('../services/vectorSearch');
const { groq } = require('@ai-sdk/groq');
const { generateText } = require('ai');

router.post('/chat', async (req, res) => {
  try {
    const { message, topK = 5 } = req.body || {};
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'message is required' });
    }

    const queryVector = await embedText(message);
    const hits = await searchSimilarMongo(queryVector, topK);

    const contexts = hits.map((h, i) =>
      `#${i + 1}\nTitle: ${h.title}\nSource: ${h.source || 'Unknown'}\nLink: ${h.link || 'N/A'}\nDate: ${h.pubDate || 'N/A'}\nContent: ${String(h.articleContent || '').slice(0, 600)}`
    );

    const sysPrompt = `
You are a concise compliance/news assistant that answers strictly using the provided context.
- If the answer is not present, say you do not have enough information.
- Do not fabricate URLs or details.
- Keep answers factual and neutral in 1–3 short paragraphs.
- If citing items, reference them inline as [Source: Title].
`.trim();

    const userPrompt = `User question:\n${message}\n\nContext:\n${contexts.join('\n\n')}`.trim();

    const { text: answer } = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      apiKey: process.env.GROQ_API_KEY,
      temperature: 0.2,
      maxTokens: 600,
      system: sysPrompt,
      prompt: userPrompt
    });

    res.json({
      answer,
      references: hits.map(h => ({
        title: h.title,
        link: h.link,
        score: h.score,
        source: h.source,
        pubDate: h.pubDate
      }))
    });
  } catch (err) {
    console.error('Chat error:', err?.message || err);
    res.status(500).json({ error: 'Failed to generate answer' });
  }
});

module.exports = router;
