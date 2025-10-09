const express = require('express');
require('dotenv').config();
const connectDB = require('./utils/db');
const rssProcessor = require('./services/rssProcessor');
const cron = require('node-cron');

const app = express();
const port = process.env.PORT || 3000;

process.env.TZ = process.env.TZ || 'Asia/Calcutta';

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

let isRunning = false;
let lastRunAt = null;

async function runPipelineSafely() {
  if (isRunning) {
    console.warn('Pipeline is already running, skipping this tick.');
    return;
  }
  isRunning = true;
  const startedAt = new Date();
  console.log(`[CRON] Starting pipeline at ${startedAt.toISOString()}`);
  try {
    await rssProcessor.processAllFeeds();
    lastRunAt = new Date();
    console.log(`[CRON] Completed pipeline at ${lastRunAt.toISOString()}`);
  } catch (err) {
    console.error('[CRON] Pipeline failed:', err);
  } finally {
    isRunning = false;
  }
}

// schedule: every 15 minutes
cron.schedule('*/15 * * * *', runPipelineSafely, {
  scheduled: true,
  timezone: process.env.TZ || 'Asia/Calcutta', 
});

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    isRunning,
    lastRunAt,
    timezone: process.env.TZ || 'UTC',
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
