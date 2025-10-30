const mongoose = require('mongoose');

async function ensureVectorIndex() {
  const db = mongoose.connection.db;
  const collection = process.env.MDB_COLLECTION || 'articles';
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

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { autoIndex: true });
    console.log('MongoDB connected');
    await ensureVectorIndex();
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
