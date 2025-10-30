import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
import cron from 'node-cron';

import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import postRoutes from './routes/post.route.js';
import commentRoutes from './routes/comment.route.js';
import chatRouter from './routes/ai/chat.js';
import reindexRouter from './routes/ai/reindex.js';

import { processAllFeeds } from './services/rssProcessor.js';

dotenv.config();
process.env.TZ = process.env.TZ || 'Asia/Calcutta';

mongoose.connect(process.env.MONGO)
.then(() => {
    console.log('MongoDB is connected');
    ensureVectorIndex();
})
.catch((err) => {
    console.log(err);
});

// Create vector search index
async function ensureVectorIndex() {
    const db = mongoose.connection.db;
    const collection = process.env.MDB_COLLECTION || 'posts';
    const indexName = process.env.MDB_VECTOR_INDEX || 'vector_index';
    const dimensions = Number(process.env.VECTOR_DIM || 768);
    const similarity = process.env.VECTOR_SIMILARITY || 'cosine';

    try {
        await db.command({
            createSearchIndexes: collection,
            indexes: [
                {
                    name: indexName,
                    definition: {
                        mappings: {
                            dynamic: true,
                            fields: {
                                embedding: {
                                    type: 'knnVector',
                                    dimensions,
                                    similarity
                                }
                            }
                        }
                    }
                }
            ]
        });
        console.log(`Search index (knnVector) ensured: ${collection}.${indexName} dims=${dimensions}`);
    } catch (e) {
        console.warn('Vector index ensure warning:', e?.message || e);
    }
}

const __dirname = path.resolve();

const app = express();
app.use(express.json());
app.use(cookieParser());

// Add logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
    next();
});

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoutes);
app.use('/api/ai', chatRouter);
app.use('/api/ai', reindexRouter);

// Pipeline endpoint
app.get('/api/run-pipeline', async (req, res) => {
    try {
        await processAllFeeds();
        res.json({ message: 'All RSS feeds processed and new articles generated.' });
    } catch (error) {
        console.error('Pipeline error:', error);
        res.status(500).json({ error: 'Failed to process RSS feeds' });
    }
});

// Pipeline status and health check
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

// Run pipeline every 15 minutes
cron.schedule('*/15 * * * *', runPipelineSafely);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ ok: true, isRunning, lastRunAt });
});

app.use(express.static(path.join(__dirname, '/frontend/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}!`);
});

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
});
