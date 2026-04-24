import React from 'react';

const GiftIcon: React.FC<{ type: string; className?: string }> = ({ type, className = "" }) => {
  const getEmoji = (t: string) => {
    switch (t) {
      case 'cake': return '🎂';
      case 'candle': return '🕯️';
      case 'flower': return '💐';
      case 'balloon': return '🎈';
      case 'star': return '⭐';
      case 'firework': return '🎆';
      default: return '🎁';
    }
  };

  return (
    <span className={`inline-flex items-center justify-center animate-bounce-slow ${className}`} style={{ animationDuration: '3s' }}>
      {getEmoji(type)}
      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow infinite ease-in-out;
        }
      `}</style>
    </span>
  );
};

export default GiftIcon;
