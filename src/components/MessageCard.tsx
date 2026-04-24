import React from 'react';
import { motion } from 'motion/react';
import { Message, AVATAR_MAP, GIFT_MAP } from '../types';
import { Gift } from 'lucide-react';
import { soundService } from '../services/soundService';

interface MessageCardProps {
  message: Message;
  onSendGift: (id: string) => void;
}

const MessageCard: React.FC<MessageCardProps> = ({ message, onSendGift }) => {
  const rotation = React.useMemo(() => (Math.random() - 0.5) * 6, []);
  
  const timeAgo = (dateStr: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 1000);
    if (seconds < 60) return 'NOW';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    return `${Math.floor(seconds / 86400)}d`;
  };

  const giftCounts = message.gifts.reduce((acc, curr) => {
    acc[curr] = (acc[curr] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <motion.div 
      whileHover={{ 
        y: -12, 
        scale: 1.05, 
        rotateX: Math.random() * 8 - 4,
        rotateY: Math.random() * 8 - 4,
        zIndex: 50 
      }}
      initial={{ rotate: rotation }}
      style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
      className="group relative bg-white/20 backdrop-blur-2xl border border-white/50 rounded-[40px] p-6 md:p-8 shadow-[0_8px_40px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_60px_rgba(212,163,115,0.15)] transition-shadow duration-700 max-w-xs cursor-default"
    >
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/80 rounded-2xl flex items-center justify-center text-2xl shadow-sm rotate-[-3deg] group-hover:rotate-0 transition-transform duration-500">
              {AVATAR_MAP[message.avatar] || '👤'}
            </div>
            <div className="flex flex-col">
              <h3 className="font-display font-bold text-text-main text-[9px] uppercase tracking-[0.4em] mb-1">{message.nickname}</h3>
              <span className="text-[8px] font-display font-medium uppercase tracking-widest text-text-muted/40">{timeAgo(message.created_at)}</span>
            </div>
          </div>
        </div>

        <p className="font-serif italic text-xl md:text-2xl text-text-main/80 leading-[1.6] tracking-tight">
          {message.content}
        </p>

        <div className="flex justify-between items-center">
          <div className="flex -space-x-2">
            {Object.entries(giftCounts).map(([type, count], i) => (
              <div key={i} className="flex items-center justify-center w-10 h-10 bg-white/90 rounded-full border border-white shadow-sm ring-4 ring-background-warm/30 transition-transform hover:scale-125 hover:z-20">
                <span className="text-lg">{GIFT_MAP[type]}</span>
                {count > 1 && (
                  <span className="absolute -top-1 -right-1 text-[8px] font-black font-display text-white bg-text-main px-1.5 rounded-full">
                    {count}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Luxury Minimalist Gift Tray */}
      <div className="absolute top-6 right-6 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
        {Object.keys(GIFT_MAP).map(giftId => (
          <button
            key={giftId}
            onMouseEnter={() => soundService.playHover()}
            onClick={(e) => {
              e.stopPropagation();
              onSendGift(giftId);
            }}
            className="w-8 h-8 bg-white/90 hover:bg-primary hover:text-white rounded-full flex items-center justify-center text-sm transition-all hover:scale-110 active:scale-90 shadow-sm"
            title={giftId}
          >
            {GIFT_MAP[giftId]}
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default MessageCard;
