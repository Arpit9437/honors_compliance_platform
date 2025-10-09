const Parser = require('rss-parser');
const { groq } = require('@ai-sdk/groq');
const { generateText } = require('ai');
const Article = require('../models/Article');

const parser = new Parser();

const rssFeeds = [
  {
    url: 'https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&Regid=3',
    sourceName: 'Press Information Bureau',
  },
];

async function generateArticle(item) {
  const prompt = `
Write a clear, publication-ready article based on this update using only paragraphs (no lists or bullet points).
Title: ${item.title}
Content: ${item.contentSnippet || ''}

Constraints:
- Length: between 300 and 400 words in the "content" field (not fewer than 300, not more than 400).
- Style: paragraphs only; no bullet points, no numbered lists, no headings, no emojis, no markdown, no code fences, and no stray characters.
- Language: concise, neutral, factual tone suitable for a news-style summary.

Output format:
Return ONLY a valid JSON object in a single line with exactly these keys and no others:
{"title": string, "summary": string, "content": string}

Rules:
- "title": a crisp headline derived from the provided Title and Content.
- "summary": a 1–2 sentence abstract (plain text, no bullets).
- "content": paragraph-only prose meeting the 300–400 word constraint.
- Do NOT include any text before or after the JSON, no code fences, and no trailing commas.
- Escape internal quotes properly so the JSON is valid.
`.trim();

  try {
    const { text } = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      prompt,
      apiKey: process.env.GROQ_API_KEY,
      temperature: 0.6,
      maxTokens: 900
    });

    // Direct JSON parse with no extra utilities
    return JSON.parse(text);
  } catch (err) {
    console.error('Groq generation/parse error:', err?.message || err);
    return null;
  }
}

async function processAllFeeds() {
  for (const feedInfo of rssFeeds) {
    console.log(`Processing feed: ${feedInfo.sourceName}`);
    try {
      const feed = await parser.parseURL(feedInfo.url);
      for (const item of feed.items) {
        const uniqueId = item.guid || item.link;
        if (!uniqueId) continue;

        const exists = await Article.findOne({ feedId: uniqueId });
        if (exists) {
          console.log(`Skipping existing feedId: ${uniqueId}`);
          continue;
        }

        const data = await generateArticle(item);
        if (!data || !data.title || !data.content) {
          console.error('Invalid or incomplete JSON from model, skipping:', data);
          continue;
        }

        const newArticle = new Article({
          feedId: uniqueId,
          title: data.title,
          link: item.link,
          pubDate: item.pubDate ? new Date(item.pubDate) : new Date(),
          articleContent: data.content,
          generatedAt: new Date(),
          source: feedInfo.sourceName
        });

        await newArticle.save();
        console.log(`Saved article for feedId: ${uniqueId} from ${feedInfo.sourceName}`);
      }
    } catch (error) {
      console.error(`Error processing feed ${feedInfo.sourceName}:`, error);
    }
  }
}

module.exports = { processAllFeeds };
