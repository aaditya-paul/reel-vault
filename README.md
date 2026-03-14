# ReelVault 🎬🧠

**ReelVault** is a private, AI-powered memory vault designed to help you store, organize, and effortlessly search your saved short-form content (Reels, TikToks, Shorts, etc.) using natural language.

Stop endlessly scrolling through your Instagram "Saved" folder trying to find that one specific video. With ReelVault, you can simply search for *"gym motivation with anime edit"* or *"startup advice by indian guy"* and find it instantly.

![ReelVault Clean UI Concept](https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop) *(Placeholder)*

## ✨ Features

- **Start Fresh:** Paste single links from Instagram, TikTok, or YouTube to save them into your vault.
- **Bulk Import:** Upload your official Instagram Data Export (ZIP) to instantly extract, deduplicate, and process thousands of your historical saved posts.
- **Semantic Search:** Find content based on *vibe*, description, or transcript using AI vector embeddings, not just exact keyword matching.
- **Private & Segregated:** All data is strictly tied to your account. No cross-user pollution.
- **Beautiful Dark Mode UI:** Built with Next.js and Tailwind CSS for a premium, fast, and responsive experience.

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js (React) App Router
- **Styling:** Tailwind CSS + Lucide Icons
- **State/Fetching:** Native React hooks + Fetch API

### Backend
- **Framework:** FastAPI (Python)
- **Database:** PostgreSQL + `pgvector` (via Docker)
- **ORM:** SQLAlchemy + Alembic (Migrations)
- **AI/ML:** OpenAI APIs (Embeddings & Vision/Transcription simulation)

---

## 🚀 Getting Started (Local Development)

Follow these steps to get the full MVP stack running on your local machine.

### 1. Prerequisites
- **Node.js** (v18+)
- **Python** (v3.10+)
- **Docker Desktop** (Running, for PostgreSQL)

### 2. Start the Database
ReelVault requires PostgreSQL with the `pgvector` extension. We provide a `docker-compose.yml` to spin this up.
```bash
# From the project root
docker-compose up -d
```
*(Note: To avoid local port conflicts, the Postgres container is mapped to port `5433` on your host machine).*

### 3. Setup the Backend (FastAPI)
```bash
# Navigate to the backend directory
cd backend

# Create and activate a virtual environment
python -m venv venv
.\venv\Scripts\activate  # Windows
# source venv/bin/activate  # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Run database migrations to create the schema (including pgvector)
alembic upgrade head

# Start the FastAPI development server
uvicorn main:app --reload --port 8000
```
The backend API will now be available at `http://localhost:8000`. You can view the interactive Swagger docs at `http://localhost:8000/docs`.

### 4. Setup the Frontend (Next.js)
Open a **new terminal window**.
```bash
# From the project root
npm install

# Start the Next.js development server
npm run dev
```
The frontend UI will now be available at `http://localhost:3000`.

---

## 🧪 Testing the MVP

1. **Dashboard (`/dashboard`):** View your masonry grid of saved items. Try the semantic search bar.
2. **Save Single URL (`/save`):** Paste a public URL and watch the background worker queue the ingestion task.
3. **Import Archive (`/import`):** Upload an Instagram `.zip` export to see the bulk deduplication and extraction logic in action.

*Note: For this initial MVP run, the heavy LLM extraction processes (Audio/OCR) and OpenAI Embeddings are simulated with fast mock responses so you don't need to provide private API keys immediately.*

## 🔒 Privacy & Compliance
ReelVault operates entirely on **user-provided data**. We do not use private Instagram APIs or scrape logged-in sessions, strictly adhering to platform terms of service while giving users full control over their exported archives.

---
*Architected and built by the AI Engineering Team.*
