// Message 接口定义了单条祝福信息的结构
// 对接后端时，请确保后端返回的 JSON 数据包含这些字段
export interface Message {
  id: string;         // 唯一标识符列表
  nickname: string;   // 祝福者的昵称
  content: string;    // 祝福的具体文本内容
  avatar: string;     // 头像的 ID (对应 AVATAR_MAP 中的键)
  gifts: string[];    // 已收到的礼物列表 (礼物 ID)
  created_at: string; // 创建时间戳 (ISO 格式)
}

// 应用配置接口
export interface AppConfig {
  passphraseEnabled: boolean; // 是否启用口令访问
  birthdayPerson: string;      // 主角姓名
}

export type AvatarType = 'cat' | 'dog' | 'rabbit' | 'bear' | 'panda' | 'fox' | 'penguin' | 'owl';
export type GiftType = 'cake' | 'candle' | 'flower' | 'balloon' | 'star' | 'firework';

export const AVATAR_MAP: Record<string, string> = {
  cat: '🐱',
  dog: '🐶',
  rabbit: '🐰',
  bear: '🐻',
  panda: '🐼',
  fox: '🦊',
  penguin: '🐧',
  owl: '🦉',
};

export const GIFT_MAP: Record<string, string> = {
  cake: '🎂',
  candle: '🕯️',
  flower: '💐',
  balloon: '🎈',
  star: '⭐',
  firework: '🎆',
};
