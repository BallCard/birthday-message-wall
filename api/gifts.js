import { success, error } from './_lib/response.js';
import { setCorsHeaders, handlePreflight } from './_lib/cors.js';

const GIFTS = [
  { id: 'cake', name: '蛋糕', animation: 'bounce' },
  { id: 'candle', name: '蜡烛', animation: 'flicker' },
  { id: 'flower', name: '花束', animation: 'bloom' },
  { id: 'balloon', name: '气球', animation: 'float' },
  { id: 'star', name: '星星', animation: 'twinkle' },
  { id: 'firework', name: '烟花', animation: 'explode' },
];

export default async function handler(req, res) {
  // Handle CORS preflight
  if (handlePreflight(req, res)) return;

  // Set CORS headers
  const originAllowed = setCorsHeaders(req, res);
  if (!originAllowed) {
    return error(res, 'CORS origin not allowed', 403);
  }

  try {
    if (req.method === 'GET') {
      return success(res, GIFTS);
    }

    return error(res, 'Method not allowed', 405);
  } catch (err) {
    console.error('Gifts endpoint error:', err);
    return error(res, '服务器暂时无法响应', 500);
  }
}
