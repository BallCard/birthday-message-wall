
// 音效服务：使用 Web Audio API 动态生成音效，无需加载外部音频文件
const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();

/**
 * 播放一个简单的合成音调
 * @param freq 频率 (Hz)
 * @param type 波形类型 (sine, square, triangle, sawtooth)
 * @param duration 持续时间 (秒)
 * @param volume 音量 (0 到 1)
 */
const playTone = (freq: number, type: OscillatorType, duration: number, volume: number) => {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

  gain.gain.setValueAtTime(volume, audioCtx.currentTime);
  // 使用指数衰减让声音听起来更自然
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start();
  osc.stop(audioCtx.currentTime + duration);
};

export const soundService = {
  // 悬停音效：用于按钮或卡片悬停反馈
  playHover: () => {
    playTone(440, 'sine', 0.1, 0.05);
  },
  
  // 成功音效：用于提交成功后的反馈
  playSuccess: () => {
    const now = audioCtx.currentTime;
    [523.25, 659.25, 783.99].forEach((f, i) => {
      setTimeout(() => playTone(f, 'sine', 0.5, 0.1), i * 100);
    });
  },

  // 魔法音效：用于送礼、庆祝或宠物互动
  playMagic: () => {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        playTone(1000 + Math.random() * 2000, 'sine', 0.3, 0.03);
      }, i * 50);
    }
  },

  // 交互音效：如点击、打开表单时使用
  playPaper: () => {
    playTone(150, 'triangle', 0.2, 0.1);
  }
};
