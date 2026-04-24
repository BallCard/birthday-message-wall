import { timingSafeEqual } from 'crypto';

/**
 * Passphrase verification middleware
 * @param {object} req - Vercel request object
 * @returns {{ ok: boolean, status?: number, message?: string }}
 */
export function verifyPassphrase(req) {
  const enabled = process.env.PASSPHRASE_ENABLED === 'true';

  // If passphrase is not enabled, pass through
  if (!enabled) {
    return { ok: true };
  }

  const secret = process.env.PASSPHRASE_SECRET || 'birthday2024';
  const passphrase = req.body?.passphrase;

  // Check if passphrase is provided
  if (!passphrase || typeof passphrase !== 'string') {
    return { ok: false, status: 403, message: '请输入暗号' };
  }

  // Use timing-safe comparison to prevent timing attacks
  try {
    const secretBuffer = Buffer.from(secret, 'utf8');
    const passphraseBuffer = Buffer.from(passphrase, 'utf8');

    // Buffers must be same length for timingSafeEqual
    if (secretBuffer.length !== passphraseBuffer.length) {
      // Still do a comparison with a same-length buffer to maintain constant time
      const dummyBuffer = Buffer.alloc(secretBuffer.length);
      timingSafeEqual(dummyBuffer, secretBuffer);
      return { ok: false, status: 403, message: '暗号不正确' };
    }

    const isMatch = timingSafeEqual(passphraseBuffer, secretBuffer);

    if (!isMatch) {
      return { ok: false, status: 403, message: '暗号不正确' };
    }

    return { ok: true };
  } catch (err) {
    return { ok: false, status: 500, message: '验证失败' };
  }
}
