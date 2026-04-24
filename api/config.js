import { success, error } from './_lib/response.js';
import { setCorsHeaders, handlePreflight } from './_lib/cors.js';

export default async function handler(req, res) {
  // Handle CORS preflight
  if (handlePreflight(req, res)) return;

  // Set CORS headers
  setCorsHeaders(req, res);

  if (req.method !== 'GET') {
    return error(res, 'Method not allowed', 405);
  }

  try {
    return success(res, {
      passphraseEnabled: process.env.PASSPHRASE_ENABLED === 'true',
      birthdayPerson: process.env.BIRTHDAY_PERSON || '',
    });
  } catch (err) {
    console.error('Config endpoint error:', err);
    return error(res, '服务器暂时无法响应', 500);
  }
}
