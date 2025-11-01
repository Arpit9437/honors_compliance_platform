import express from 'express';
const router = express.Router();

import { embedText } from '../../services/embeddings.js';
import { searchSimilarMongoHybrid, searchSimilarMongo } from '../../services/vectorSearch.js';
import { groq } from '@ai-sdk/groq';
import { generateText } from 'ai';

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

    console.log('\n=== Chat Context Retrieval ===');
    console.log('Query:', message);
    console.log('Mode:', mode);
    console.log('TopK:', topK);
    console.log('\nRetrieved Documents:');
    hits.forEach((hit, index) => {
      console.log(`\n[${index + 1}] Score: ${hit.score?.toFixed(4) || 'N/A'}`);
      console.log(`Title: ${hit.title || 'No Title'}`);
      console.log(`Source: ${hit.source || 'Unknown'}`);
      console.log(`Content Preview: ${takeLongSnippet(hit.content || '', 200)}...`);
    });
    console.log('\n=== End Context Retrieval ===\n');

    const contexts = hits.map((h, i) => {
      const snippet = takeLongSnippet(String(h.content || ''));
      return `#${i + 1}\\nTitle: ${h.title}\\nSource: ${h.source || 'Unknown'}\\nLink: ${h.link || 'N/A'}\\nDate: ${h.createdAt || 'N/A'}\\nContent:\\n\`\`\`\\n${snippet}\\n\`\`\``;
    });
    const sysPrompt = `
You are a concise compliance/news assistant that answers strictly using the provided context.
Rules:
- If the answer is not explicitly present in the context, say: "I do not have enough information to answer from the provided context."
- Copy numeric facts (amounts, dates, counts) verbatim from the context without rounding or rephrasing.
- Be direct and brief. If multiple values appear, state the most specific one and cite the source title in square brackets at the end.`;

    const userPrompt = `Question: ${message}

Context:
${contexts.join('\\n\\n')}

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
        createdAt: h.createdAt
      }))
    });
  } catch (err) {
    console.error('Chat error:', err?.message || err);
    return res.status(500).json({ error: 'failed to generate answer' });
  }
});

export default router;
