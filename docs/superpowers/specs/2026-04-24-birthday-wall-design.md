# Birthday Wall - Design Spec

Date: 2026-04-24
Status: Approved

## Overview

Single-event birthday message wall. Visitors leave text messages with virtual gifts on a visual wall, accompanied by an interactive desktop pet. Deployed on Vercel as a monorepo (frontend + serverless API).

## Tech Stack

| Layer | Choice |
|-------|--------|
| Frontend | Vue 3 SPA (Vite) |
| Backend | Vercel Serverless Functions (Node.js) |
| Database | Vercel KV (Redis) |
| Deployment | Vercel |
| Visual Assets | AI-generated via Gemini (prompts provided) |

## Project Structure

```
birthday-wall/
├── api/                    # Vercel Serverless Functions
│   ├── messages.js         # Message CRUD
│   ├── gifts.js            # Gift data
│   └── config.js           # Frontend config
├── src/                    # Vue 3 frontend
│   ├── components/         # UI components
│   ├── stores/             # Pinia state management
│   ├── api/                # Frontend API client
│   └── assets/             # Static assets
├── public/                 # Pure static files
├── package.json
├── vercel.json             # Vercel routing config
└── .env.example
```

## API Design

### Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/config` | Get config (passphrase toggle, birthday person name) |
| GET | `/api/messages` | List all messages (paginated) |
| POST | `/api/messages` | Submit new message (with passphrase check) |
| GET | `/api/gifts` | List available gifts |
| POST | `/api/gifts/send` | Send a gift (attach to a message) |

### Data Models

**Avatar IDs:** `["cat", "dog", "rabbit", "bear", "panda", "fox", "penguin", "owl"]`
Each avatar ID maps to a frontend asset (image or emoji). The list is hardcoded in both backend validation and frontend selection UI.

**Message:**
```js
{
  id: string,          // UUID
  nickname: string,    // max 20 chars
  content: string,     // max 200 chars
  avatar: string,      // one of: "cat" | "dog" | "rabbit" | "bear" | "panda" | "fox" | "penguin" | "owl"
  gifts: string[],     // gift IDs received, e.g. ["cake", "star"]
  created_at: string   // ISO 8601
}
```

**Gift:**
```js
{
  id: string,          // "cake" | "candle" | "flower" | "balloon" | "star" | "firework"
  name: string,        // Display name
  animation: string    // Frontend animation type
}
```

**Vercel KV Storage Design:**
- `msg:<id>` → JSON object of a single Message (one key per message)
- `msg:index` → Redis sorted set, score = timestamp, member = message ID
- `config` → JSON object with app config

This avoids the read-modify-write race condition of storing all messages in a single key. Each new message is an independent SET operation. The sorted set index enables ordered retrieval without scanning all keys.

### Pagination

**GET /api/messages?page=1&limit=20**

Query parameters:
- `page` (default: 1) — page number, starting from 1
- `limit` (default: 50, max: 100) — messages per page

Results ordered by `created_at` descending (newest first).

```js
// Response 200
{
  "success": true,
  "data": {
    "messages": [ ... ],
    "pagination": { "page": 1, "limit": 20, "total": 42, "hasMore": true }
  }
}
```

### Error Responses

All endpoints return errors in a consistent format. HTTP status codes: 400 (validation), 403 (passphrase/CORS), 429 (rate limit), 500 (server error).

```js
{ "success": false, "message": "Human-readable error description" }
```

GET endpoints: return 500 with `{ "success": false, "message": "服务器暂时无法响应" }` if KV is unavailable.

### Request/Response Examples

**POST /api/messages**
```js
// Request
{ "nickname": "小明", "content": "生日快乐！", "avatar": "cat", "passphrase": "..." }

// Response 201
{ "success": true, "data": { "id": "uuid", "nickname": "小明", "avatar": "cat", "content": "生日快乐！", "gifts": [], "created_at": "2026-04-24T12:00:00Z" } }

// Response 400
{ "success": false, "message": "昵称不能为空" }

// Response 403
{ "success": false, "message": "暗号不正确" }

// Response 429
{ "success": false, "message": "提交太频繁，请稍后再试" }
```

**POST /api/gifts/send**
```js
// Request
{ "messageId": "uuid", "giftId": "cake" }

// Response 200
{ "success": true, "data": { "messageId": "uuid", "gifts": ["cake"] } }

// Response 400
{ "success": false, "message": "无效的礼物类型" }

// Response 404
{ "success": false, "message": "留言不存在" }
```

## Backend Design

### Security

- `helmet` for security headers
- CORS: comma-separated origins in `CORS_ORIGINS` env var (e.g. `"https://example.com,http://localhost:5173"`). Empty value allows all origins.
- Rate limiting via `@upstash/ratelimit` (built for Vercel KV): POST 10 req/IP/15min, GET 60 req/IP/min
- Request body limit: 100kb
- Input validation: nickname/content length, avatar whitelist (8 IDs), gift ID whitelist (6 IDs)

### Passphrase Verification

- Toggle via `PASSPHRASE_ENABLED` env var
- When enabled, POST /api/messages requires `passphrase` field
- Uses `crypto.timingSafeEqual` to prevent timing attacks
- Default secret: `birthday2024`

### vercel.json

```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" },
    { "source": "/((?!api/).*)", "destination": "/index.html" }
  ]
}
```

### Environment Variables

```
PASSPHRASE_ENABLED=false
PASSPHRASE_SECRET=birthday2024
BIRTHDAY_PERSON=寿星名字
CORS_ORIGINS=https://your-domain.com
KV_REST_API_URL=xxx
KV_REST_API_TOKEN=xxx
RATE_LIMIT_POST_MAX=10
RATE_LIMIT_GET_MAX=60
```

## Frontend Design

### Components

- **MessageWall** — Main wall displaying all messages as cards
- **MessageCard** — Individual message card with flip animation
- **SubmitForm** — Message submission form (drawer modal)
- **GiftPanel** — Gift selection overlay
- **DesktopPet** — Interactive desktop pet character
- **CelebrationEffect** — Full-screen celebration animations
- **Toast** — Global notification

### Gift System

Six preset gifts, each with AI-generated visual assets:

| ID | Name | Behavior |
|----|------|----------|
| cake | 生日蛋糕 | Small cake icon displayed on card |
| candle | 蜡烛 | Animated flickering candle on card |
| flower | 花束 | Flower decoration around card border |
| balloon | 气球 | Floating balloons beside card |
| star | 星星 | Twinkling star in card corner |
| firework | 烟花 | Full-screen celebration animation |

Flow: User clicks a message → selects a gift → frontend plays send animation → calls POST `/api/gifts/send` → gift icon permanently displayed on that card.

### Desktop Pet

A small character wandering at the bottom of the page.

**States:**
- Idle: random walking / occasionally dozing
- Clicked: jumps and waves / emits hearts
- New message: runs toward the new card, jumps
- Gift received: plays mini celebration (flower petals / jumping)

**Implementation:** CSS `animation` + `background-position` sprite sheet playback. JS controls position movement and state transitions. No Canvas, no physics engine.

**Required sprite sheets (4 sheets):**
- Walk animation: 8-12 frames
- Idle/doze animation: 4-6 frames
- Click reaction animation: 4 frames
- Celebration animation: 4 frames

### State Management (Pinia)

```
messagesStore:
  - messages: Message[]
  - loading: boolean
  - error: string | null
  - submitting: boolean
  - passphraseEnabled: boolean
  - actions: fetchConfig, fetchMessages, submitMessage, sendGift

Error handling:
  - API failure → store.error = "加载留言失败，请刷新重试", UI shows error toast
  - Rate limited → store.error = "提交太频繁", UI shows rate limit message
  - Network offline → store.error = "网络连接失败", UI shows offline indicator
  - All errors auto-clear on next successful action
```

### Frontend API Client

Axios instance with `/api` base URL, auto-injected by Vite proxy in dev mode.

## Gemini Prompt Deliverables

Seven prompt sets for AI-generated assets:

1. **Page Background** — Overall atmosphere illustration
2. **Message Card** — Card appearance design (front/back)
3. **Gift Icons x6** — Cake, candle, flowers, balloon, star, firework
4. **Desktop Pet Sprite Sheet** — Walk, idle, click, celebration states
5. **Send Gift Animation** — Full-screen effects (fireworks, confetti)
6. **Empty State Illustration** — Placeholder when no messages
7. **Full Page Layout** — Complete page description for Gemini to generate frontend code

## Deliverables

| Item | Description |
|------|-------------|
| Backend code | Vercel Serverless Functions + KV storage, complete and runnable |
| API documentation | Interface spec for frontend integration |
| Gemini prompt pack | 7 prompt sets covering all visual assets |
| vercel.json | Routing configuration |
| .env.example | Environment variable template |
