const Parser = require('rss-parser');
const fetch = require('node-fetch');
const cheerio = require('cheerio');

const { groq } = require('@ai-sdk/groq');
const { generateText } = require('ai');

const Article = require('../models/Article');
const { embedText } = require('./embeddings');

const parser = new Parser();

const rssFeeds = [
  {
    url: 'https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&Regid=3',
    sourceName: 'Press Information Bureau'
  },
  {
    url: 'https://services.india.gov.in/feed/rss?cat_id=7&ln=en',
    sourceName: 'India.gov.in'
  },
  {
    url: 'https://services.india.gov.in/feed/rss?cat_id=16&ln=en',
    sourceName: 'India.gov.in'
  }
];

function extractReadableText(html) {
  if (!html) return '';
  const $ = cheerio.load(html);
  $('script, style, noscript, iframe, header, footer, nav').remove();
  const candidates = [
    '#divContent', '.innerpagecontent', '.article', '.content', '.content-area', 'article'
  ];
  for (const sel of candidates) {
    const node = $(sel);
    if (node && node.text() && node.text().trim().length > 200) {
      return node.text().replace(/\s+\n/g, '\n').replace(/\n{2,}/g, '\n\n').trim();
    }
  }
  const text = $('p').map((_, el) => $(el).text().trim()).get().filter(Boolean).join('\n\n');
  return text || $.text().replace(/\s+\n/g, '\n').replace(/\n{2,}/g, '\n\n').trim();
}

async function fetchRawBody(link) {
  try {
    if (!link) return '';
    const resp = await fetch(link, { timeout: 15000 });
    if (!resp.ok) return '';
    const html = await resp.text();
    return extractReadableText(html);
  } catch {
    return '';
  }
}

async function generateArticle(item) {
  const prompt = `
Write a clear, publication-ready article based on this update using only paragraphs (no lists or bullet points).
Title: ${item.title}
Content: ${item.contentSnippet || ''}

Constraints:
- Length: between 300 and 400 words in the "content" field (not fewer than 300, not more than 400).
- Summary: provide a short summary of the article of about 25-50 words (1-3 short sentences). Place it in the "summary" field.
- Tagging: assign this article to exactly one domain tag from the following list (return the tag exactly as one lowercase word): tax, labor, finance, compliance, schemes.
- Style: paragraphs only; no bullet points, no numbered lists, no headings, no markdown.
- Be factual, concise, and neutral. Do not invent details.
Return strictly valid JSON with keys: "title", "summary", "content", "tag".
`;

  const { text } = await generateText({
    model: groq('llama-3.3-70b-versatile'),
    maxTokens: 700,
    temperature: 0.2,
    system: 'You format and serialize content into strict JSON as requested.',
    prompt
  });

  let data = { title: item.title, summary: '', content: '', tag: '' };
  try {
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    data = JSON.parse(text.slice(start, end + 1));
  } catch {
    // Keep defaults
  }
  
  const allowedTags = ['tax', 'labor', 'finance', 'compliance', 'schemes'];
  data.tag = (data.tag || '').toString().toLowerCase().trim();
  const inferTag = (txt = '') => {
    const s = (txt || '').toLowerCase();
    if (!s) return 'compliance';
    if (s.match(/\b(gst|tax|tds|income tax|taxation)\b/)) return 'tax';
    if (s.match(/\b(labou?r|wage|employee|employment|industrial relations)\b/)) return 'labor';
    if (s.match(/\b(loan|credit|interest|finance|bank|fund|investment)\b/)) return 'finance';
    if (s.match(/\b(scheme|grant|subsidy|benefit|programme|program)\b/)) return 'schemes';
    if (s.match(/\b(license|licence|registration|regulation|compliance|act|rule|law)\b/)) return 'compliance';
    return 'compliance';
  };

  if (!allowedTags.includes(data.tag)) {
    const tryText = ((data.summary || '') + '\n' + (data.content || '')).trim();
    data.tag = inferTag(tryText);
  }
  return data;
}

async function processFeed(feedInfo) {
  const feed = await parser.parseURL(feedInfo.url);
  for (const item of feed.items || []) {
    const uniqueId = item.guid || item.link || item.id || item.title;
    if (!uniqueId) continue;

    const existing = await Article.findOne({ feedId: uniqueId });
    if (existing) continue;

    const generated = await generateArticle(item);
    const contentForEmbed = (generated.content || '').trim();
    const embedding = await embedText(contentForEmbed);

    const doc = new Article({
      feedId: uniqueId,
      title: generated.title || item.title || '',
      link: item.link || '',
      pubDate: item.pubDate ? new Date(item.pubDate) : new Date(),
      articleContent: generated.content || '',
      summary: generated.summary || '',
      tag: generated.tag || '',
      generatedAt: new Date(),
      source: feedInfo.sourceName,
      embedding
    });

    await doc.save();
  }
}

async function processAllFeeds() {
  for (const feedInfo of rssFeeds) {
    await processFeed(feedInfo);
  }
}

module.exports = { processAllFeeds };
