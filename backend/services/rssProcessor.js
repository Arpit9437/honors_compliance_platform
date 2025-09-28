const Parser = require('rss-parser');
const { GoogleGenAI } = require('@google/genai');
const Article = require('../models/Article');

const parser = new Parser();
const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY
});

// List of RSS feeds with metadata
const rssFeeds = [
  {
    url: 'https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&Regid=3',
    sourceName: 'Press Information Bureau',
  }
];

// Article generation using Google Gemini API
async function generateArticle(prompt) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });
    return response.text || '';
  } catch (error) {
    console.error('Google Gemini generation error:', error);
    return '';
  }
}

// Process all RSS feeds, generate and store unique articles
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

        const prompt = `Write a concise, clear article based on this update:\nTitle: ${item.title}\nContent: ${item.contentSnippet || ''}`;
        const articleContent = await generateArticle(prompt);
        if (!articleContent) {
          console.log(`Article generation failed for feedId: ${uniqueId}`);
          continue;
        }

        const newArticle = new Article({
          feedId: uniqueId,
          title: item.title,
          link: item.link,
          pubDate: item.pubDate ? new Date(item.pubDate) : new Date(),
          articleContent,
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
