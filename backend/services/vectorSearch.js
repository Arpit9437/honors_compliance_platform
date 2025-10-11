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
        score: { $meta: 'searchScore' }
      }
    }
  ];

  return await collection.aggregate(pipeline).toArray();
}

module.exports = { searchSimilarMongo };
