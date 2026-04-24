/**
 * Get allowed CORS origins from environment
 * @returns {string[]}
 */
function getAllowedOrigins() {
  const origins = process.env.CORS_ORIGINS || '';
  if (!origins.trim()) {
    return [];
  }
  return origins.split(',').map(o => o.trim()).filter(o => o);
}

/**
 * Set CORS headers on response
 * @param {object} req - Vercel request object
 * @param {object} res - Vercel response object
 * @returns {boolean} - Whether the origin is allowed
 */
export function setCorsHeaders(req, res) {
  const allowedOrigins = getAllowedOrigins();
  const requestOrigin = req.headers.origin || req.headers.Origin;

  // If no origins configured, allow all
  if (allowedOrigins.length === 0) {
    res.setHeader('Access-Control-Allow-Origin', '*');
  } else if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
    res.setHeader('Access-Control-Allow-Origin', requestOrigin);
  } else if (requestOrigin) {
    // Origin not in allowed list
    return false;
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');

  return true;
}

/**
 * Handle CORS preflight request
 * @param {object} req - Vercel request object
 * @param {object} res - Vercel response object
 * @returns {boolean} - True if this was a preflight request that was handled
 */
export function handlePreflight(req, res) {
  if (req.method === 'OPTIONS') {
    const originAllowed = setCorsHeaders(req, res);
    if (!originAllowed) {
      res.status(403).json({ success: false, message: 'CORS origin not allowed' });
    } else {
      res.status(204).end();
    }
    return true;
  }
  return false;
}
