const express = require('express');
require('dotenv').config();
const connectDB = require('./utils/db');
const rssProcessor = require('./services/rssProcessor');

const app = express();
const port = process.env.PORT || 3000;

connectDB();

app.get('/api/run-pipeline', async (req, res) => {
  try {
    await rssProcessor.processAllFeeds();
    res.json({ message: 'All RSS feeds processed and new articles generated.' });
  } catch (error) {
    console.error('Pipeline error:', error);
    res.status(500).json({ error: 'Failed to process RSS feeds' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
