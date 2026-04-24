# Birthday Wall

A birthday message wall app where visitors leave wishes with virtual gifts.

## Tech Stack

- Frontend: Vue 3 + Vite + Pinia
- Backend: Vercel Serverless Functions
- Database: Vercel KV (Redis)
- Deployment: Vercel

## Quick Start

1. Clone and install dependencies:
   ```bash
   npm install
   ```

2. Set up Vercel KV and configure environment variables (see `.env.example`)

3. Deploy to Vercel:
   ```bash
   vercel --prod
   ```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/config | Get app config |
| GET | /api/messages | List messages (paginated) |
| POST | /api/messages | Create message |
| GET | /api/gifts | List available gifts |
| POST | /api/gifts/send | Send gift to message |

## Documentation

- `docs/gemini-prompts.md` - Frontend code generation prompts
- `docs/image-prompts.md` - Visual asset generation prompts
- `docs/superpowers/specs/` - Design specification
