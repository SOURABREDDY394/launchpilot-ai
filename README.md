# LaunchPilot AI

LaunchPilot AI is a starter full-stack project for validating startup ideas with FastAPI, LangChain, OpenAI, React, and Tailwind CSS. It includes a working Idea Validator module and scaffolding for future RAG, agent, storage, and media workflows with ChromaDB, Supabase, and Cloudinary.

## Stack

- Backend: FastAPI, Pydantic, LangChain, OpenAI
- Frontend: React, Vite, Tailwind CSS
- Vector store: ChromaDB
- Data and auth-ready layer: Supabase
- Asset pipeline: Cloudinary

## Project Structure

```text
backend/
  agents/
    base.py
  modules/
    idea_validator.py
  rag/
    vector_store.py
  utils/
    settings.py
  main.py
  .env.example
frontend/
  public/
  src/
    components/
      IdeaValidator.jsx
    pages/
      DashboardPage.jsx
    App.jsx
    api.js
    index.css
    main.jsx
  index.html
  package.json
  postcss.config.js
  tailwind.config.js
  vite.config.js
requirements.txt
README.md
```

## Backend Setup

1. Create and activate a virtual environment.
2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Copy the environment file and add your credentials:

```bash
cp backend/.env.example backend/.env
```

4. Start the FastAPI server from the project root:

```bash
uvicorn backend.main:app --reload
```

The API will be available at [http://127.0.0.1:8000](http://127.0.0.1:8000) and docs at [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).

## Frontend Setup

1. Install frontend dependencies:

```bash
cd frontend
npm install
```

2. Start the React development server:

```bash
npm run dev
```

The frontend runs at [http://127.0.0.1:5173](http://127.0.0.1:5173). Vite is configured to proxy `/validate-idea` and `/health` to the FastAPI backend in development.

## Environment Variables

Add these values in `backend/.env`:

- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `OPENAI_EMBEDDING_MODEL`
- `CHROMA_PERSIST_DIRECTORY`
- `SUPABASE_URL`
- `SUPABASE_KEY`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `ENVIRONMENT`

## Current API Endpoints

- `GET /health`
- `POST /validate-idea`

Request body:

```json
{
  "idea": "AI platform that validates startup concepts with live market evidence"
}
```

## Notes

- The Idea Validator returns strict JSON with category scores, rationale, strengths, weaknesses, and pivot suggestions for low-scoring ideas.
- `backend/rag` and `backend/agents` are scaffolded for future retrieval and autonomous workflow modules.
- Supabase and Cloudinary dependencies are included so the project can expand into persistence, auth, exports, and media storage without a second setup pass.
