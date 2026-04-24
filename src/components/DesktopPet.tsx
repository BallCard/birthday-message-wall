import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundService } from '../services/soundService';

const DesktopPet: React.FC = () => {
  const [pos, setPos] = useState({ x: 50, y: 0 }); // y is offset from bottom
  const [state, setState] = useState<'idle' | 'walk' | 'react' | 'celebrate'>('idle');
  const [direction, setDirection] = useState(1); // 1 = right, -1 = left
  const [effects, setEffects] = useState<{ id: number; emoji: string; x: number; y: number; delay: number }[]>([]);

  const [trail, setTrail] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const move = () => {
      // Trail effect
      if (state === 'walk') {
        setTrail(prev => [{ id: Math.random(), x: pos.x, y: pos.y }, ...prev].slice(0, 5));
      }

      if (state === 'walk') {
        setPos(prev => {
          const nextX = prev.x + direction * 0.8;
          if (nextX < 5 || nextX > 95) {
            setDirection(d => -d);
            return { ...prev, x: nextX < 5 ? 5 : 95 };
          }
          return { ...prev, x: nextX };
        });
      }

      if (Math.random() < 0.01 && state !== 'react' && state !== 'celebrate') {
        if (state === 'idle') {
          setState('walk');
          setDirection(Math.random() > 0.5 ? 1 : -1);
        } else {
          setState('idle');
        }
      }
    };

    timer = setInterval(move, 50);
    return () => clearInterval(timer);
  }, [state, direction, pos]);

  const handleClick = () => {
    if (state === 'react') return;
    setState('react');
    soundService.playMagic();
    
    const emojis = ['❤️', '💖', '✨', '🌈', '🍭', '⭐'];
    const newEffects = Array.from({ length: 12 }).map((_, i) => ({
      id: Math.random(),
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      x: (Math.random() - 0.5) * 200,
      y: -100 - Math.random() * 150,
      delay: i * 0.05
    }));
    setEffects(newEffects);
    
    setTimeout(() => {
      setState('idle');
      setEffects([]);
    }, 2000);
  };

  return (
    <div className="fixed bottom-12 left-0 w-full h-[150px] pointer-events-none z-40 overflow-visible">
      {/* Sparkle Trail */}
      {trail.map((t, i) => (
        <motion.div
          key={t.id}
          initial={{ opacity: 0.5, scale: 1 }}
          animate={{ opacity: 0, scale: 0 }}
          style={{ 
            left: `${t.x}%`, 
            bottom: '20px', 
            position: 'absolute' 
          }}
          className="text-primary/30"
        >
          ✨
        </motion.div>
      ))}

      <motion.div
        className="absolute pointer-events-auto cursor-pointer"
        animate={{ 
          left: `${pos.x}%`,
          scaleX: direction
        }}
        transition={{ type: 'tween', ease: 'linear', duration: 0.05 }}
        onClick={handleClick}
        style={{ width: '80px', height: '80px', bottom: '0', transformOrigin: 'center bottom' }}
      >
        <div className="relative w-full h-full text-6xl flex items-center justify-center select-none">
          <motion.div
            animate={state === 'walk' ? {
              y: [0, -6, 0],
              rotate: [0, 8, -8, 0]
            } : state === 'idle' ? {
              scale: [1, 1.05, 1],
              rotate: [0, 2, -2, 0]
            } : state === 'react' ? {
              y: [0, -40, 0, -40, 0],
              scale: [1, 1.3, 0.9, 1.4, 1],
              rotate: [0, 15, -15, 15, 0],
              transition: { duration: 1.5, times: [0, 0.2, 0.4, 0.7, 1] }
            } : {}}
            transition={state === 'react' ? {} : {
              repeat: Infinity,
              duration: state === 'walk' ? 0.4 : 3
            }}
          >
            🐱
          </motion.div>
          
          <AnimatePresence>
            {effects.map((h) => (
              <motion.div
                key={h.id}
                initial={{ opacity: 0, y: 0, x: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 1, 1, 0], 
                  y: h.y,
                  x: h.x,
                  scale: [0, 1.5, 1, 0],
                  rotate: [0, 45, -45, 0]
                }}
                transition={{ 
                  duration: 1.5, 
                  delay: h.delay,
                  ease: "easeOut"
                }}
                className="absolute text-3xl"
              >
                {h.emoji}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default DesktopPet;
