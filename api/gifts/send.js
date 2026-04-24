import { kv } from '../_lib/kv.js';
import { success, error } from '../_lib/response.js';
import { validateGiftId, validateMessageId } from '../_lib/validation.js';
import { postLimiter } from '../_lib/rate-limit.js';
import { setCorsHeaders, handlePreflight } from '../_lib/cors.js';

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
 * POST /api/gifts/send - Send a gift to a message
 */
async function handleSendGift(req, res) {
  const ip = getClientIp(req);

  // Rate limiting
  const { success: rateLimitOk } = await postLimiter.limit(ip);
  if (!rateLimitOk) {
    return error(res, '提交太频繁，请稍后再试', 429);
  }

  const { messageId, giftId } = req.body || {};

  // Validate giftId
  const giftResult = validateGiftId(giftId);
  if (!giftResult.valid) {
    return error(res, giftResult.message);
  }

  // Validate messageId
  const messageResult = validateMessageId(messageId);
  if (!messageResult.valid) {
    return error(res, messageResult.message);
  }

  // Check message exists
  const message = await kv.get(`msg:${messageId}`);
  if (!message) {
    return error(res, '留言不存在', 404);
  }

  // Append gift to message's gifts array
  const gifts = message.gifts || [];
  gifts.push(giftId);

  // Write back the updated message
  const updatedMessage = { ...message, gifts };
  await kv.set(`msg:${messageId}`, updatedMessage);

  return success(res, updatedMessage);
}

export default async function handler(req, res) {
  // Handle CORS preflight
  if (handlePreflight(req, res)) return;

  // Set CORS headers
  const originAllowed = setCorsHeaders(req, res);
  if (!originAllowed) {
    return error(res, 'CORS origin not allowed', 403);
  }

  try {
    if (req.method === 'POST') {
      return await handleSendGift(req, res);
    }

    return error(res, 'Method not allowed', 405);
  } catch (err) {
    console.error('Gifts send endpoint error:', err);
    return error(res, '服务器暂时无法响应', 500);
  }
}
