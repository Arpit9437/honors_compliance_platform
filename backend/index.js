const express = require('express');
require('dotenv').config();
const connectDB = require('./utils/db');
const { processAllFeeds } = require('./services/rssProcessor');
const cron = require('node-cron');
const chatRouter = require('./routes/chat');
const reindexRouter = require('./routes/reindex');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
process.env.TZ = process.env.TZ || 'Asia/Calcutta';

connectDB();

app.get('/api/run-pipeline', async (_req, res) => {
  try {
    await processAllFeeds();
    res.json({ message: 'All RSS feeds processed and new articles generated.' });
  } catch (error) {
    console.error('Pipeline error:', error);
    res.status(500).json({ error: 'Failed to process RSS feeds' });
  }
});

app.use('/api', chatRouter);
app.use('/api', reindexRouter);

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
    await processAllFeeds();
    lastRunAt = new Date();
    console.log(`[CRON] Completed pipeline at ${lastRunAt.toISOString()}`);
  } catch (err) {
    console.error('[CRON] Pipeline failed:', err);
  } finally {
    isRunning = false;
  }
}

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
