const express = require('express');
const router = express.Router();

const { embedText } = require('../services/embeddings');
const { searchSimilarMongoHybrid, searchSimilarMongo } = require('../services/vectorSearch');

const { groq } = require('@ai-sdk/groq');
const { generateText } = require('ai');

function takeLongSnippet(text, max = 1800) {
  if (!text) return '';
  const s = String(text);
  return s.length <= max ? s : s.slice(0, max);
}

router.post('/chat', async (req, res) => {
  try {
    const { message, topK = 12, mode = 'hybrid' } = req.body || {};
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'message is required' });
    }

    const queryVector = await embedText(message);

    const hits = mode === 'hybrid'
      ? await searchSimilarMongoHybrid(queryVector, topK, message)
      : await searchSimilarMongo(queryVector, topK);

    const contexts = hits.map((h, i) => {
      const snippet = takeLongSnippet(String(h.rawBody || h.articleContent || ''));
      return `#${i + 1}\nTitle: ${h.title}\nSource: ${h.source || 'Unknown'}\nLink: ${h.link || 'N/A'}\nDate: ${h.pubDate || 'N/A'}\nContent:\n\`\`\`\n${snippet}\n\`\`\``;
    });
    const sysPrompt = `
You are a concise compliance/news assistant that answers strictly using the provided context.
Rules:
- If the answer is not explicitly present in the context, say: "I do not have enough information to answer from the provided context."
- Copy numeric facts (amounts, dates, counts) verbatim from the context without rounding or rephrasing.
- Be direct and brief. If multiple values appear, state the most specific one and cite the source title in square brackets at the end.`;

    const userPrompt = `Question: ${message}

Context:
${contexts.join('\n\n')}

Answer in one or two sentences, grounded only in the context. If not present, say you do not have enough information.`;

    const { text } = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      temperature: 0,
      maxTokens: 800,
      system: sysPrompt,
      prompt: userPrompt
    });

    return res.json({
      answer: text?.trim() || '',
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
    return res.status(500).json({ error: 'failed to generate answer' });
  }
});

module.exports = router;
