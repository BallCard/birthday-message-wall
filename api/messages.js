import { randomUUID } from 'crypto';
import { kv } from './_lib/kv.js';
import { success, error } from './_lib/response.js';
import { validateNickname, validateContent, validateAvatar } from './_lib/validation.js';
import { postLimiter, getLimiter } from './_lib/rate-limit.js';
import { verifyPassphrase } from './_lib/passphrase.js';
import { setCorsHeaders, handlePreflight } from './_lib/cors.js';

/**
 * Extract client IP from request
 * @param {object} req
 * @returns {string}
 */
function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    const ips = forwarded.split(',');
    return ips[0].trim();
  }
  return req.connection?.remoteAddress || 'unknown';
}

/**
 * GET /api/messages - List messages, paginated
 */
async function handleGet(req, res) {
  const ip = getClientIp(req);

  // Rate limiting
  const { success: rateLimitOk } = await getLimiter.limit(ip);
  if (!rateLimitOk) {
    return error(res, '请求太频繁，请稍后再试', 429);
  }

  // Parse pagination params
  let page = parseInt(req.query?.page, 10);
  let limit = parseInt(req.query?.limit, 10);

  if (isNaN(page) || page < 1) page = 1;
  if (isNaN(limit) || limit < 1) limit = 50;
  if (limit > 100) limit = 100;

  // Get total count from sorted set
  const total = await kv.zcard('msg:index');

  // Calculate offset: we want newest first, sorted set is score-ascending
  // so we read from the end
  const start = Math.max(0, total - page * limit);
  const end = Math.max(0, total - (page - 1) * limit - 1);

  // Get message IDs from sorted set (highest scores = newest first)
  const messageIds = await kv.zrange('msg:index', end, start);

  // Fetch each message
  const messages = [];
  if (messageIds.length > 0) {
    const pipeline = kv.pipeline();
    for (const id of messageIds) {
      pipeline.get(`msg:${id}`);
    }
    const results = await pipeline.exec();
    for (const msg of results) {
      if (msg) {
        messages.push(msg);
      }
    }
  }

  const hasMore = total > page * limit;

  return success(res, {
    messages,
    pagination: { page, limit, total, hasMore },
  });
}

/**
 * POST /api/messages - Create a new message
 */
async function handlePost(req, res) {
  const ip = getClientIp(req);

  // Rate limiting
  const { success: rateLimitOk } = await postLimiter.limit(ip);
  if (!rateLimitOk) {
    return error(res, '提交太频繁，请稍后再试', 429);
  }

  // Validate input
  const { nickname, content, avatar } = req.body || {};

  const nicknameResult = validateNickname(nickname);
  if (!nicknameResult.valid) {
    return error(res, nicknameResult.message);
  }

  const contentResult = validateContent(content);
  if (!contentResult.valid) {
    return error(res, contentResult.message);
  }

  const avatarResult = validateAvatar(avatar);
  if (!avatarResult.valid) {
    return error(res, avatarResult.message);
  }

  // Check passphrase
  const passphraseResult = verifyPassphrase(req);
  if (!passphraseResult.ok) {
    return error(res, passphraseResult.message, passphraseResult.status);
  }

  // Create message
  const id = randomUUID();
  const now = new Date();
  const message = {
    id,
    nickname: nickname.trim(),
    content: content.trim(),
    avatar,
    gifts: [],
    created_at: now.toISOString(),
  };

  // Store message and add to index
  await kv.set(`msg:${id}`, message);
  await kv.zadd('msg:index', { score: now.getTime(), member: id });

  return success(res, message, 201);
}

export default async function handler(req, res) {
  // Handle CORS preflight
  if (handlePreflight(req, res)) return;

  // Set CORS headers
  const originAllowed = setCorsHeaders(req, res);
  if (!originAllowed && req.method !== 'OPTIONS') {
    return error(res, 'CORS origin not allowed', 403);
  }

  try {
    switch (req.method) {
      case 'GET':
        return await handleGet(req, res);
      case 'POST':
        return await handlePost(req, res);
      default:
        return error(res, 'Method not allowed', 405);
    }
  } catch (err) {
    console.error('Messages endpoint error:', err);
    return error(res, '服务器暂时无法响应', 500);
  }
}
