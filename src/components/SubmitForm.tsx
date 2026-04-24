import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { Message, AVATAR_MAP } from '../types';
import { soundService } from '../services/soundService';

interface SubmitFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmitted: (msg: Message) => void;
  onNotify: (msg: string, type?: 'success' | 'error') => void;
  birthdayPerson: string;
}

const SubmitForm: React.FC<SubmitFormProps> = ({ visible, onClose, onSubmitted, onNotify, birthdayPerson }) => {
  const [nickname, setNickname] = useState('');
  const [content, setContent] = useState('');
  const [avatar, setAvatar] = useState('cat');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 基础校验
    if (!nickname.trim() || !content.trim()) {
      setError('请完整填写署名和祝福内容');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // API 请求：发送新的祝福消息到后端
      // 数据包含：昵称、内容和选择的头像 ID
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname, content, avatar }),
      });
      const result = await response.json();
      
      if (result.success) {
        // 如果后端处理成功，调用父组件的回调函数更新列表
        onSubmitted(result.data);
        onNotify('祝福已成功送达墙上');
        soundService.playSuccess();
        setNickname('');
        setContent('');
        onClose();
      } else {
        onNotify(result.message || '发送失败', 'error');
        setError(result.message || '系统繁忙，请稍后再试');
      }
    } catch (err) {
      onNotify('连接丢失', 'error');
      setError('网络连接出现问题，请检查网络后再试。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 120 }}
            className="fixed right-0 top-0 h-full w-full max-w-xl bg-white shadow-2xl z-50 flex flex-col border-l border-gray-100"
          >
            <div className="relative h-64 bg-background-warm overflow-hidden shrink-0">
              <div className="bg-pattern opacity-20" />
              <div className="bg-blob bg-blob-1 scale-150 -top-20 -right-20" />
              <div className="absolute inset-0 p-12 flex flex-col justify-end">
                <button 
                  onClick={() => {
                    soundService.playPaper();
                    onClose();
                  }}
                  onMouseEnter={() => soundService.playHover()}
                  className="absolute top-8 right-8 p-3 bg-white/40 hover:bg-white backdrop-blur-md rounded-full transition-all border border-white/60 shadow-sm text-text-main"
                >
                  <X size={20} />
                </button>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-4xl font-display font-medium tracking-tight text-text-main leading-tight mb-2">Send Your Wish</h2>
                  <p className="text-[10px] uppercase font-display font-black tracking-[0.5em] text-primary/60">Message Board • to {birthdayPerson}</p>
                </motion.div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-12 p-12 md:p-16 overflow-y-auto custom-scrollbar">
              <div className="space-y-6">
                <label className="block text-[10px] uppercase font-display font-bold tracking-[0.4em] text-text-muted/60">Choose Your Avatar</label>
                <div className="grid grid-cols-4 gap-4">
                  {Object.entries(AVATAR_MAP).map(([id, emoji]) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setAvatar(id)}
                      className={`text-3xl aspect-square flex items-center justify-center rounded-3xl border-2 transition-all duration-500 ${
                        avatar === id 
                          ? 'border-primary bg-primary/5 scale-105 shadow-xl shadow-primary/5' 
                          : 'border-background-warm hover:border-primary/20 grayscale opacity-40 hover:grayscale-0 hover:opacity-100'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-10">
                <div className="group relative">
                  <label className="block text-[9px] uppercase font-display font-bold tracking-[0.4em] text-text-muted/60 mb-2 transition-colors group-focus-within:text-primary">
                    Signature
                  </label>
                  <input
                    type="text"
                    maxLength={20}
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="Who is this from?"
                    className="w-full bg-transparent py-4 border-b-2 border-background-warm focus:border-primary focus:outline-none transition-all font-serif italic text-2xl text-text-main placeholder:text-text-muted/20"
                    required
                  />
                </div>

                <div className="group relative">
                  <label className="block text-[9px] uppercase font-display font-bold tracking-[0.4em] text-text-muted/60 mb-2 transition-colors group-focus-within:text-primary">
                    Eternal Wish
                  </label>
                  <textarea
                    maxLength={200}
                    rows={5}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={`Write something heart-touching for ${birthdayPerson}...`}
                    className="w-full bg-transparent py-4 border-b-2 border-background-warm focus:border-primary focus:outline-none transition-all font-serif italic text-xl text-text-main placeholder:text-text-muted/20 resize-none leading-[1.8]"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="p-5 rounded-2xl bg-red-50 text-red-700 text-[10px] font-display font-black tracking-[0.2em] uppercase text-center border border-red-100/50">
                  {error}
                </div>
              )}

              <div className="pt-8">
                <button
                  type="submit"
                  disabled={loading}
                  onMouseEnter={() => soundService.playHover()}
                  className="w-full py-6 bg-text-main text-white font-display font-bold text-[11px] uppercase tracking-[0.4em] rounded-full shadow-2xl shadow-text-main/20 hover:bg-primary transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center overflow-hidden group relative"
                >
                  <AnimatePresence mode="wait">
                    {loading ? (
                      <motion.div
                        key="loading"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        className="flex items-center gap-3"
                      >
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Delivering...</span>
                      </motion.div>
                    ) : (
                      <motion.span
                        key="idle"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                      >
                        Publish to Wall
                      </motion.span>
                    )}
                  </AnimatePresence>
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SubmitForm;
