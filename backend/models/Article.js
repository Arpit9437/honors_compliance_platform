const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  feedId: { type: String, unique: true, required: true },
  title: String,
  link: String,
  pubDate: Date,
  articleContent: String,
  generatedAt: Date,
  source: String 
});

const Article = mongoose.model('Article', articleSchema);
module.exports = Article;
