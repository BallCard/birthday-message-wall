/**
 * Send a JSON response
 * @param {object} res - Vercel response object
 * @param {number} status - HTTP status code
 * @param {object} data - Response data
 */
export function json(res, status, data) {
  res.status(status).json(data);
}

/**
 * Send a success response
 * @param {object} res - Vercel response object
 * @param {object} data - Response data
 * @param {number} status - HTTP status code (default 200)
 */
export function success(res, data, status = 200) {
  json(res, status, { success: true, data });
}

/**
 * Send an error response
 * @param {object} res - Vercel response object
 * @param {string} message - Error message
 * @param {number} status - HTTP status code (default 400)
 */
export function error(res, message, status = 400) {
  json(res, status, { success: false, message });
}
