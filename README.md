PolicySync – Compliance Information & Insights Platform

PolicySync is a centralized compliance intelligence platform that automatically fetches, analyzes, and summarizes government updates, policies, and legal news — helping organizations stay aligned with the latest regulations.

🚀 Features

Automated RSS Feed Integration – Fetches real-time updates from official sources like PIB and ministries.
AI-Powered Chatbot – Ask questions directly from the ingested articles using vector search + LLM.
Admin Dashboard – Manage, monitor, and reindex content easily.
Secure Authentication – User roles, admin access, and Google OAuth support.
Frontend Dashboard – Clean, responsive UI built with React and Tailwind.
MongoDB Vector Search – Enables semantic retrieval of compliance content.

🧩 Tech Stack

Frontend: React, Tailwind CSS
Backend: Node.js, Express.js, MongoDB Atlas
AI Services: Google Generative AI (Embeddings), Groq LLM (LLaMA-3)
Deployment: Render / Vercel

⚙️ Setup

Clone the repository

git clone https://github.com/Arpit9437/honors_compliance_platform
cd honors_compliance_platform


Install dependencies

cd backend && npm install
cd ../frontend && npm install


Configure .env (MongoDB URI, API keys, etc.)

Run the app

# Backend
npm run dev

# Frontend
npm run dev

🧠 How It Works

RSS Feeder pipeline fetches and stores new articles in MongoDB.
Each article is embedded into a vector using Google Gemini.
Chatbot retrieves semantically relevant posts using MongoDB’s vector index.
LLM (Groq) answers user queries based only on the retrieved context.

🛡️ Vision

PolicySync simplifies regulatory awareness by merging automation, AI, and compliance intelligence — enabling businesses and policymakers to stay informed effortlessly.