const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  feedId: { type: String, unique: true, required: true },
  title: String,
  link: String,
  pubDate: Date,
  articleContent: String,
  generatedAt: Date,
  source: String,
  embedding: { type: [Number], default: [] }
});

const Article = mongoose.model('Article', articleSchema);
module.exports = Article;
