const mongoose = require('mongoose');

async function searchSimilarMongo(queryVector, topK = 5) {
  const collection = mongoose.connection.db.collection(process.env.MDB_COLLECTION || 'articles');
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
        pubDate: 1,
        articleContent: 1,
        rawBody: 1,
        score: { $meta: 'searchScore' }
      }
    }
  ];

  return await collection.aggregate(pipeline).toArray();
}

// Hybrid retrieval: top-level knnBeta + top-level filter (no nesting of knnBeta)
async function searchSimilarMongoHybrid(queryVector, topK = 15, queryText = '') {
  const collection = mongoose.connection.db.collection(process.env.MDB_COLLECTION || 'articles');
  const index = process.env.MDB_VECTOR_INDEX || 'vector_index';

  const stop = new Set(['the','a','an','to','of','in','on','for','with','and','or','is','are','has','have','what']);
  const keywords = (queryText || '')
    .split(/\s+/)
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
        pubDate: 1,
        articleContent: 1,
        rawBody: 1,
        score: { $meta: 'searchScore' }
      }
    },
  ];

  // If keywords exist, add a server-side $match stage to filter results
  // from the knn search. This avoids placing unsupported fields inside
  // the $search stage itself.
  if (keywords.length) {
    const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&');
    const kws = Array.from(new Set(keywords));
    const orClauses = [];
    kws.forEach(k => {
      const pat = escapeRegExp(k);
      orClauses.push({ title: { $regex: pat, $options: 'i' } });
      orClauses.push({ articleContent: { $regex: pat, $options: 'i' } });
      orClauses.push({ rawBody: { $regex: pat, $options: 'i' } });
    });

    pipeline.push({ $match: { $or: orClauses } });
  }

  pipeline.push({ $limit: Math.max(20, Number(topK)) });

  try {
    console.debug && console.debug('Aggregate pipeline:', JSON.stringify(pipeline));
    return await collection.aggregate(pipeline).toArray();
  } catch (err) {
    console.error('Aggregate failed:', err?.message || err);
    if ((err?.message || '').toLowerCase().includes('unrecognized field "filter"') ||
        (err?.message || '').toLowerCase().includes('knnbeta is not allowed') ||
        (err?.message || '').toLowerCase().includes('knnbeta')) {
      try {
        const safeSearch = [
          { $search: { index, knnBeta: { path: 'embedding', vector: queryVector, k: Math.max(50, Number(topK)) } } },
          { $project: { title: 1, link: 1, source: 1, pubDate: 1, articleContent: 1, rawBody: 1, score: { $meta: 'searchScore' } } },
          { $limit: Math.max(50, Number(topK)) }
        ];
        const docs = await collection.aggregate(safeSearch).toArray();
        if (!keywords.length) return docs.slice(0, topK);

        const kws = Array.from(new Set(keywords));
        const reList = kws.map(k => new RegExp(k.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&'), 'i'));
        const filtered = docs.filter(d => {
          const hay = ((d.title || '') + '\n' + (d.articleContent || '') + '\n' + (d.rawBody || '')).toLowerCase();
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

module.exports = { searchSimilarMongo, searchSimilarMongoHybrid };
