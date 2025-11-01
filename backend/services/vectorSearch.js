import mongoose from 'mongoose';
import Post from '../models/post.model.js';

async function searchSimilarMongo(queryVector, topK = 5) {
  const collection = mongoose.connection.db.collection(process.env.MDB_COLLECTION || 'posts');
  const index = process.env.MDB_VECTOR_INDEX || 'vector_index';

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
  console.log('\n=== Vector Search Debug ===');
  console.log('Collection:', process.env.MDB_COLLECTION || 'posts');
  console.log('Index:', process.env.MDB_VECTOR_INDEX || 'vector_index');
  console.log('Vector length:', queryVector?.length);
  
  const collection = mongoose.connection.db.collection(process.env.MDB_COLLECTION || 'posts');
  const index = process.env.MDB_VECTOR_INDEX || 'vector_index';
  
  // Debug: Check if collection exists and has documents
  const count = await collection.countDocuments();
  console.log('Total documents in collection:', count);
  
  // Debug: Check if documents have embeddings
  const hasEmbeddings = await collection.countDocuments({ embedding: { $exists: true, $not: { $size: 0 } } });
  console.log('Documents with embeddings:', hasEmbeddings);

  const stop = new Set(['the','a','an','to','of','in','on','for','with','and','or','is','are','has','have','what']);
  // Clean and split the query into keywords
  const keywords = (queryText || '')
    .split(/\s+/)
    .map(w => w.trim().toLowerCase())
    .map(w => w.replace(/[?!.,]/g, '')) // Remove punctuation
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
      // Word boundary search for more accurate matches
      orClauses.push({ title: { $regex: `\\b${pat}\\b`, $options: 'i' } });
      orClauses.push({ content: { $regex: `\\b${pat}\\b`, $options: 'i' } });
      orClauses.push({ summary: { $regex: `\\b${pat}\\b`, $options: 'i' } });
    });
    
    // Add full text search for exact matches
    if (queryText.trim()) {
      const fullTextPat = escapeRegExp(queryText.trim());
      orClauses.push({ title: { $regex: fullTextPat, $options: 'i' } });
      orClauses.push({ content: { $regex: fullTextPat, $options: 'i' } });
      orClauses.push({ summary: { $regex: fullTextPat, $options: 'i' } });

    }
    
    pipeline.push({ 
      $match: { 
        $or: orClauses
      }
    });
  }

  // Add a sorting stage to combine vector similarity with text match relevance
  pipeline.push({ 
    $sort: { 
      score: -1  // Sort by vector similarity score
    }
  });

  pipeline.push({ $limit: Math.max(20, Number(topK)) });

  try {
    const results = await collection.aggregate(pipeline).toArray();
    console.log('Search results found:', results.length);
    if (results.length === 0) {
      console.log('Pipeline:', JSON.stringify(pipeline, null, 2));
    }
    return results;
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
