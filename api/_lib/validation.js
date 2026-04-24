const VALID_AVATARS = ['cat', 'dog', 'rabbit', 'bear', 'panda', 'fox', 'penguin', 'owl'];
const VALID_GIFT_IDS = ['cake', 'candle', 'flower', 'balloon', 'star', 'firework'];

/**
 * Validate nickname - required, string, 1-20 chars
 * @param {any} nickname
 * @returns {{ valid: boolean, message?: string }}
 */
export function validateNickname(nickname) {
  if (nickname === undefined || nickname === null) {
    return { valid: false, message: '昵称不能为空' };
  }
  if (typeof nickname !== 'string') {
    return { valid: false, message: '昵称必须是文本' };
  }
  const trimmed = nickname.trim();
  if (trimmed.length === 0) {
    return { valid: false, message: '昵称不能为空' };
  }
  if (trimmed.length > 20) {
    return { valid: false, message: '昵称最多20个字符' };
  }
  return { valid: true };
}

/**
 * Validate content - required, string, 1-200 chars
 * @param {any} content
 * @returns {{ valid: boolean, message?: string }}
 */
export function validateContent(content) {
  if (content === undefined || content === null) {
    return { valid: false, message: '留言内容不能为空' };
  }
  if (typeof content !== 'string') {
    return { valid: false, message: '留言内容必须是文本' };
  }
  const trimmed = content.trim();
  if (trimmed.length === 0) {
    return { valid: false, message: '留言内容不能为空' };
  }
  if (trimmed.length > 200) {
    return { valid: false, message: '留言内容最多200个字符' };
  }
  return { valid: true };
}

/**
 * Validate avatar - must be one of the predefined avatars
 * @param {any} avatar
 * @returns {{ valid: boolean, message?: string }}
 */
export function validateAvatar(avatar) {
  if (avatar === undefined || avatar === null) {
    return { valid: false, message: '请选择一个头像' };
  }
  if (typeof avatar !== 'string') {
    return { valid: false, message: '头像类型无效' };
  }
  if (!VALID_AVATARS.includes(avatar)) {
    return { valid: false, message: '无效的头像选择' };
  }
  return { valid: true };
}

/**
 * Validate gift ID - must be one of the predefined gifts
 * @param {any} giftId
 * @returns {{ valid: boolean, message?: string }}
 */
export function validateGiftId(giftId) {
  if (giftId === undefined || giftId === null) {
    return { valid: false, message: '请选择一个礼物' };
  }
  if (typeof giftId !== 'string') {
    return { valid: false, message: '礼物类型无效' };
  }
  if (!VALID_GIFT_IDS.includes(giftId)) {
    return { valid: false, message: '无效的礼物类型' };
  }
  return { valid: true };
}

/**
 * Validate message ID - should be a non-empty string
 * @param {any} messageId
 * @returns {{ valid: boolean, message?: string }}
 */
export function validateMessageId(messageId) {
  if (messageId === undefined || messageId === null) {
    return { valid: false, message: '留言ID不能为空' };
  }
  if (typeof messageId !== 'string') {
    return { valid: false, message: '留言ID无效' };
  }
  if (messageId.trim().length === 0) {
    return { valid: false, message: '留言ID不能为空' };
  }
  return { valid: true };
}
