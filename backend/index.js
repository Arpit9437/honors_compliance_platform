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

// Optional: keep your existing cron+lock code
let isRunning = false;
let lastRunAt = null;

async function runPipelineSafely() {
  if (isRunning) {
    console.warn('Pipeline is already running, skipping this tick.');
    return;
  }
  isRunning = true;
  try {
    await processAllFeeds();
    lastRunAt = new Date();
  } catch (e) {
    console.error('Scheduled pipeline error:', e);
  } finally {
    isRunning = false;
  }
}

// Example: run every 15 minutes
cron.schedule('*/15 * * * *', runPipelineSafely);

app.get('/health', (_req, res) => {
  res.json({ ok: true, isRunning, lastRunAt });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
