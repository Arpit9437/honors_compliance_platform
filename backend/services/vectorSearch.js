import mongoose from 'mongoose';
import Post from '../models/post.model.js';

async function searchSimilarMongo(queryVector, topK = 5) {
  const collectionName = process.env.MDB_COLLECTION || 'posts';
  const collection = mongoose.connection.db.collection(collectionName);
  const index = process.env.MDB_VECTOR_INDEX || 'vector_index';
  
  console.log(`Searching in collection: ${collectionName} with index: ${index}`);
  
  // Verify collection exists and has documents
  const count = await collection.countDocuments();
  console.log(`Found ${count} documents in collection ${collectionName}`);
  
  if (count === 0) {
    console.warn('No documents found in collection');
    return [];
  }

  const pipeline = [
    {
      $search: {
        index,
        knnBeta: {
          path: 'embedding',
          vector: queryVector,
          k: Number(topK)
        }
      }
    },
    {
      $project: {
        title: 1,
        link: 1,
        source: 1,
        createdAt: 1,
        content: 1,
        summary: 1,
        score: { $meta: 'searchScore' }
      }
    }
  ];

  return await collection.aggregate(pipeline).toArray();
}

async function searchSimilarMongoHybrid(queryVector, topK = 15, queryText = '') {
  const collectionName = process.env.MDB_COLLECTION || 'posts';
  const collection = mongoose.connection.db.collection(collectionName);
  const index = process.env.MDB_VECTOR_INDEX || 'vector_index';

  // Debug: Check collection content
  const count = await collection.countDocuments();
  console.log(`[Debug] Collection ${collectionName} has ${count} documents`);
  
  // Debug: Check a sample document
  const sampleDoc = await collection.findOne({});
  console.log('[Debug] Sample document structure:', JSON.stringify({
    hasEmbedding: !!sampleDoc?.embedding,
    embeddingLength: sampleDoc?.embedding?.length,
    fields: Object.keys(sampleDoc || {})
  }, null, 2));

  const stop = new Set(['the','a','an','to','of','in','on','for','with','and','or','is','are','has','have','what']);
  const keywords = (queryText || '')
    .split(/\\s+/)
    .map(w => w.trim().toLowerCase())
    .filter(w => w && w.length > 2 && !stop.has(w));

  const searchStage = {
    index,
    knnBeta: {
      path: 'embedding',
      vector: queryVector,
      k: Math.max(20, Number(topK))
    }
  };

  const pipeline = [
    { $search: searchStage },
    {
      $project: {
        title: 1,
        link: 1,
        source: 1,
        createdAt: 1,
        content: 1,
        summary: 1,
        score: { $meta: 'searchScore' }
      }
    },
  ];

  if (keywords.length) {
    const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\\]\\]/g, '\\\\$&');
    const kws = Array.from(new Set(keywords));
    const orClauses = [];
    kws.forEach(k => {
      const pat = escapeRegExp(k);
      orClauses.push({ title: { $regex: pat, $options: 'i' } });
      orClauses.push({ content: { $regex: pat, $options: 'i' } });
      orClauses.push({ summary: { $regex: pat, $options: 'i' } });
    });

    pipeline.push({ $match: { $or: orClauses } });
  }

  pipeline.push({ $limit: Math.max(20, Number(topK)) });

  try {
    return await collection.aggregate(pipeline).toArray();
  } catch (err) {
    console.error('Aggregate failed:', err?.message || err);
    if ((err?.message || '').toLowerCase().includes('unrecognized field "filter"') ||
        (err?.message || '').toLowerCase().includes('knnbeta is not allowed') ||
        (err?.message || '').toLowerCase().includes('knnbeta')) {
      try {
        const safeSearch = [
          { $search: { index, knnBeta: { path: 'embedding', vector: queryVector, k: Math.max(50, Number(topK)) } } },
          { $project: { title: 1, link: 1, source: 1, createdAt: 1, content: 1, summary: 1, score: { $meta: 'searchScore' } } },
          { $limit: Math.max(50, Number(topK)) }
        ];
        const docs = await collection.aggregate(safeSearch).toArray();
        if (!keywords.length) return docs.slice(0, topK);

        const kws = Array.from(new Set(keywords));
        const reList = kws.map(k => new RegExp(k.replace(/[.*+?^${}()|[\\]\\]/g, '\\\\$&'), 'i'));
        const filtered = docs.filter(d => {
          const hay = ((d.title || '') + '\\n' + (d.content || '') + '\\n' + (d.summary || '')).toLowerCase();
          return reList.some(r => r.test(hay));
        });

        return filtered.slice(0, topK);
      } catch (fallbackErr) {
        console.error('Fallback failed:', fallbackErr?.message || fallbackErr);
        throw fallbackErr;
      }
    }

    throw err;
  }
}

export { searchSimilarMongo, searchSimilarMongoHybrid };