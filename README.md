# Edatech Frontend

React + TypeScript + Vite SPA served from EC2 at https://ai.edatech.ai

---

## Development Setup

Full setup instructions (environment variables, running both apps, seeding, common issues) are in the backend repo:

📄 [`main-backend/DEVELOPMENT.md`](../main-backend/DEVELOPMENT.md)

### Quick start

```bash
# 1. Copy and fill in environment variables
cp .env.example .env

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev
```

The app starts at `http://localhost:5173`. The backend must also be running at `http://localhost:5000`.

### Environment variables

See `.env.example` for the full list. Key variables:

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Backend API base URL |
| `VITE_MICROSERVICE_BASE_URL` | Exam/quiz microservice base URL |

> Vite bakes env vars into the bundle at build time — restart the dev server after editing `.env`.
