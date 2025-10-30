let googleAI = null;

async function embedGemini(input) {
  if (!googleAI) {
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    googleAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  }
  const model = googleAI.getGenerativeModel({
    model: process.env.GEMINI_EMBEDDING_MODEL || 'text-embedding-004'
  });
  const { embedding } = await model.embedContent(input);
  return embedding.values;
}

async function embedText(text) {
  return embedGemini(text);
}

export { embedText };