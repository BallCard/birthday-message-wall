# Birthday Wall 🎂

> 生日留言墙 — 访客留言、送礼祝福，给 TA 一个温暖的生日惊喜

A full-stack birthday message wall where visitors can leave wishes, send virtual gifts, and interact with a cute desktop pet. Single-event focused — deploy once, celebrate, and share the link.

## ✨ Features

- 💌 **Message Wall** — Visitors leave birthday wishes with emoji avatars
- 🎁 **Virtual Gifts** — Send cake, candles, flowers, balloons, stars, and fireworks to any message
- 🐱 **Desktop Pet** — A cute wandering pet that reacts to interactions
- 🎉 **Celebration Effects** — Confetti, fireworks, and petal animations
- 🔐 **Optional Passphrase** — Restrict posting with a secret code
- 📱 **Responsive Design** — Works on mobile and desktop

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + TypeScript + Tailwind CSS + Motion |
| Backend | Vercel Serverless Functions (Node.js) |
| Database | Upstash Redis (via Vercel KV) |
| Deployment | Vercel |

## Quick Start

1. **Clone and install:**
   ```bash
   git clone https://github.com/BallCard/birthday-message-wall.git
   cd birthday-message-wall
   npm install
   ```

2. **Deploy to Vercel:**
   ```bash
   vercel --prod
   ```

3. **Set up database:**
   - In Vercel Dashboard → Storage → Create **Upstash for Redis**
   - Connect it to your project

4. **Configure environment variables** (Vercel Dashboard → Settings → Environment Variables):

   | Variable | Required | Description |
   |----------|----------|-------------|
   | `BIRTHDAY_PERSON` | ✅ | The birthday person's name |
   | `KV_REST_API_URL` | Auto | Auto-injected by Upstash |
   | `KV_REST_API_TOKEN` | Auto | Auto-injected by Upstash |
   | `PASSPHRASE_ENABLED` | Optional | Set `true` to require a passphrase |
   | `PASSPHRASE_SECRET` | Optional | The passphrase (default: `birthday2024`) |
   | `CORS_ORIGINS` | Optional | Comma-separated origins (empty = allow all) |

5. **Redeploy** and share the link!

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/config` | Get app config (passphrase toggle, birthday person name) |
| `GET` | `/api/messages` | List messages (paginated, newest first) |
| `POST` | `/api/messages` | Create a new message |
| `GET` | `/api/gifts` | List available gift types |
| `POST` | `/api/gifts/send` | Send a gift to a message |

## Project Structure

```
├── api/                    # Vercel Serverless Functions
│   ├── _lib/               # Shared utilities (validation, rate limiting, CORS)
│   ├── config.js           # GET /api/config
│   ├── messages.js         # GET/POST /api/messages
│   ├── gifts.js            # GET /api/gifts
│   └── gifts/send.js       # POST /api/gifts/send
├── src/                    # React frontend
│   ├── components/         # MessageCard, SubmitForm, DesktopPet, etc.
│   ├── services/           # Sound effects (Web Audio API)
│   └── types.ts            # TypeScript type definitions
├── docs/                   # Design docs and prompts
└── vercel.json             # Build and routing config
```

## License

MIT
