import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Heart, Share2, Sparkles } from 'lucide-react';
import MessageCard from './components/MessageCard';
import SubmitForm from './components/SubmitForm';
import DesktopPet from './components/DesktopPet';
import CelebrationEffect, { CelebrationEffectRef } from './components/CelebrationEffect';
import { Message, AppConfig } from './types';
import { soundService } from './services/soundService';

export default function App() {
// 状态管理：存储所有的祝福留言、应用配置、表单显示状态等
  const [messages, setMessages] = useState<Message[]>([]);
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const celebrationRef = useRef<CelebrationEffectRef>(null);

  // 显示提示条（Toast）
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // 初始化：从后端获取配置信息（如主角姓名）和现有祝福列表
  useEffect(() => {
    const init = async () => {
      try {
        const [configRes, messagesRes] = await Promise.all([
          fetch('/api/config'),
          fetch('/api/messages')
        ]);
        const configData = await configRes.json();
        const messagesData = await messagesRes.json();
        
        setConfig(configData.data);
        setMessages(messagesData.data.messages);
      } catch (err) {
        console.error("加载数据失败", err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // 当提交新祝福成功后，将其添加到页面顶端并触发庆祝特效
  const handleNewMessage = (msg: Message) => {
    setMessages(prev => [msg, ...prev]);
    celebrationRef.current?.trigger('confetti');
  };

  // 这里的 handleSendGift 是用于“送礼”互动的 API 调用
  // 它会将礼物 ID 发送到后端，并根据返回的新留言对象更新本地状态
  const handleSendGift = async (messageId: string, giftId: string) => {
    soundService.playMagic();
    try {
      const res = await fetch('/api/gifts/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId, giftId })
      });
      const result = await res.json();
      if (result.success) {
        // 更新本地消息列表中的对应项目（包含新的礼物计数）
        setMessages(prev => prev.map(m => m.id === messageId ? result.data : m));
        
        // Map gift to effect
        const effectMap: Record<string, 'firework' | 'petal' | 'star'> = {
          firework: 'firework',
          flower: 'petal',
          star: 'star',
          cake: 'firework',
          balloon: 'confetti' as any,
          heart: 'petal'
        };
        
        celebrationRef.current?.trigger(effectMap[giftId] || 'firework');
        showToast('Love delivered!');
      } else {
        showToast('Gift delivery failed', 'error');
      }
    } catch (err) {
      console.error("Failed to send gift", err);
      showToast('Network error', 'error');
    }
  };

  return (
    <div className="relative h-screen w-screen flex flex-col overflow-hidden select-none bg-background-warm font-sans">
      <div className="bg-pattern opacity-40" />
      
      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/20 rounded-full"
            initial={{ 
              x: Math.random() * 100 + '%', 
              y: Math.random() * 100 + '%',
              opacity: Math.random() * 0.3
            }}
            animate={{ 
              y: [null, '-10%', '10%'],
              x: [null, '5%', '-5%'],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
              duration: 15 + Math.random() * 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      <motion.div 
        animate={{ 
          x: [0, 40, 0],
          y: [0, 20, 0]
        }}
        transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
        className="bg-blob bg-blob-1 opacity-20" 
      />
      <motion.div 
        animate={{ 
          x: [0, -40, 0],
          y: [0, -20, 0]
        }}
        transition={{ repeat: Infinity, duration: 30, ease: 'linear' }}
        className="bg-blob bg-blob-2 opacity-20" 
      />
      <div className="noise-overlay" />

      {/* Header */}
      <header className="h-56 flex items-center justify-between px-24 md:px-40 lg:px-64 z-30 shrink-0">
        <div className="flex flex-col">
          <span className="text-[14px] uppercase tracking-[1em] font-display font-black text-primary mb-6 drop-shadow-sm">Birthday Journal</span>
          <h1 className="text-4xl md:text-7xl lg:text-8xl font-display font-black tracking-tighter text-text-main flex items-center gap-6 drop-shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
            Celebrating <span className="italic font-serif font-normal text-primary relative">
              <motion.span
                initial={{ opacity: 0, scale: 0.5, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ 
                  delay: 0.5, 
                  type: 'spring', 
                  stiffness: 260, 
                  damping: 20 
                }}
                className="inline-block"
              >
                {config?.birthdayPerson || '...'}
              </motion.span>
              <motion.span 
                initial={{ width: 0 }}
                animate={{ width: '105%' }}
                className="absolute -bottom-2 left-0 h-1 bg-accent/20 -z-10"
              />
            </span>
          </h1>
        </div>
        
        <div className="flex items-center gap-16">
          <div className="hidden lg:flex flex-col items-end opacity-40">
            <span className="text-[10px] uppercase tracking-[0.3em] font-display font-bold text-text-muted">Archives</span>
            <span className="text-xs font-serif italic text-text-main">{messages.length} wishes shared</span>
          </div>
          <button 
            className="group flex items-center gap-6 px-10 py-5 bg-white/40 hover:bg-white backdrop-blur-md rounded-full transition-all border border-white/60 shadow-sm"
            onClick={() => celebrationRef.current?.trigger('petal')}
          >
            <Sparkles size={18} className="text-primary group-hover:scale-110 transition-transform" />
            <span className="text-[10px] uppercase font-display font-bold tracking-[0.2em] text-text-main">Bloom</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto px-24 md:px-40 lg:px-64 custom-scrollbar pb-80">
        <div className="max-w-[1900px] mx-auto pt-24">
          {loading ? (
            <div className="flex flex-wrap gap-16 justify-center">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="w-80 h-72 bg-white/10 rounded-[40px] animate-pulse border border-white/10" />
              ))}
            </div>
          ) : messages.length === 0 ? (
            <div className="h-[50vh] flex flex-col items-center justify-center text-center">
              <motion.div 
                animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }} 
                transition={{ repeat: Infinity, duration: 6 }}
                className="text-6xl mb-12 opacity-10"
              >
                🕊️
              </motion.div>
              <h2 className="text-2xl font-serif italic text-text-main/20 uppercase tracking-[0.3em]">Silence is golden, but wishes are better</h2>
            </div>
          ) : (
            <div className="flex flex-wrap gap-x-16 gap-y-24 justify-center items-start">
              <AnimatePresence mode="popLayout">
                {messages.map((msg, index) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ 
                      type: 'spring', 
                      damping: 20, 
                      stiffness: 70,
                      delay: index * 0.08 
                    }}
                    className="flex-shrink-0"
                  >
                    <MessageCard 
                      message={msg} 
                      onSendGift={(giftId) => handleSendGift(msg.id, giftId)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-16 right-16 flex flex-col items-end gap-6 pointer-events-none z-40">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 }}
          className="bg-white/40 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/60 shadow-sm"
        >
          <p className="text-[10px] font-display font-black uppercase tracking-[0.3em] text-primary">Leave a Mark</p>
        </motion.div>
        
        <motion.button
          whileHover={{ scale: 1.05, y: -5, rotate: 2 }}
          onMouseEnter={() => soundService.playHover()}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            soundService.playPaper();
            setIsFormVisible(true);
          }}
          className="pointer-events-auto w-24 h-24 bg-text-main text-white rounded-[32px] shadow-[0_20px_50px_rgba(40,54,24,0.3)] flex items-center justify-center transition-all duration-500 hover:shadow-primary/40 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          <Plus size={32} className="relative z-10 transition-transform group-hover:rotate-90" />
        </motion.button>
      </div>

      {/* Components */}
      <SubmitForm 
        visible={isFormVisible} 
        onClose={() => setIsFormVisible(false)}
        onSubmitted={handleNewMessage}
        onNotify={showToast}
        birthdayPerson={config?.birthdayPerson || '...'}
      />
      <DesktopPet />
      <CelebrationEffect ref={celebrationRef} />

      {/* Toast Notifications */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-32 left-1/2 -translate-x-1/2 z-[100] pointer-events-none"
          >
            <div className={`px-8 py-3 rounded-full backdrop-blur-xl border shadow-xl flex items-center gap-3 ${
              toast.type === 'success' 
                ? 'bg-white/80 border-primary/20 text-text-main' 
                : 'bg-red-50/80 border-red-200 text-red-600'
            }`}>
              <div className={`w-2 h-2 rounded-full animate-pulse ${
                toast.type === 'success' ? 'bg-primary' : 'bg-red-500'
              }`} />
              <span className="text-[10px] font-display font-bold uppercase tracking-widest leading-none mt-0.5">
                {toast.message}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative Pet Area */}
      <div className="fixed bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white/20 to-transparent pointer-events-none z-10" />
    </div>
  );
}
