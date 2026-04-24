import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

export interface CelebrationEffectRef {
  trigger: (type: 'confetti' | 'firework' | 'petal' | 'star') => void;
}

const CelebrationEffect = forwardRef<CelebrationEffectRef>((props, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<any[]>([]);
  const requestRef = useRef<number>();

  class Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    life: number;
    type: string;
    rotation: number;
    vRotation: number;

    constructor(x: number, y: number, type: string) {
      this.x = x;
      this.y = y;
      this.type = type;
      this.life = 1;
      this.rotation = Math.random() * Math.PI * 2;
      this.vRotation = (Math.random() - 0.5) * 0.2;

      const colors = ['#ff8fab', '#ffd166', '#ffb5a7', '#fcd5ce', '#9bf6ff'];
      this.color = colors[Math.floor(Math.random() * colors.length)];

      if (type === 'firework') {
        const angle = Math.random() * Math.PI * 2;
        const force = Math.random() * 6 + 2;
        this.vx = Math.cos(angle) * force;
        this.vy = Math.sin(angle) * force;
        this.size = Math.random() * 3 + 1;
      } else if (type === 'petal') {
        this.vx = Math.random() * 2 - 1;
        this.vy = Math.random() * 2 + 1;
        this.size = Math.random() * 8 + 5;
        this.color = '#ffccd5';
      } else if (type === 'star') {
        const angle = Math.random() * Math.PI * 2;
        const force = Math.random() * 4 + 1;
        this.vx = Math.cos(angle) * force;
        this.vy = Math.sin(angle) * force;
        this.size = Math.random() * 4 + 2;
        this.color = '#ffd166';
      } else {
        // confetti
        this.vx = Math.random() * 4 - 2;
        this.vy = Math.random() * 4 + 2;
        this.size = Math.random() * 10 + 5;
      }
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.rotation += this.vRotation;
      
      if (this.type === 'firework') {
        this.vy += 0.15;
        this.life -= 0.015;
      } else {
        this.life -= 0.005;
      }
    }

    draw(ctx: CanvasRenderingContext2D) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = this.life;
      ctx.fillStyle = this.color;

      if (this.type === 'petal') {
        // Simple petal shape
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size, this.size/1.5, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (this.type === 'firework' || this.type === 'star') {
        ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size);
      } else {
        // Confetti rect
        ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size/2);
      }
      ctx.restore();
    }
  }

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = particles.current.length - 1; i >= 0; i--) {
      const p = particles.current[i];
      p.update();
      p.draw(ctx);
      if (p.life <= 0) {
        particles.current.splice(i, 1);
      }
    }

    requestRef.current = requestAnimationFrame(animate);
  };

  useImperativeHandle(ref, () => ({
    trigger: (type) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      if (type === 'firework') {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height * 0.5;
        for (let i = 0; i < 50; i++) particles.current.push(new Particle(x, y, 'firework'));
      } else if (type === 'confetti') {
        for (let i = 0; i < 100; i++) {
          particles.current.push(new Particle(Math.random() * canvas.width, -20, 'confetti'));
        }
      } else if (type === 'petal') {
        for (let i = 0; i < 40; i++) {
          particles.current.push(new Particle(Math.random() * canvas.width, -20, 'petal'));
        }
      } else if (type === 'star') {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        for (let i = 0; i < 20; i++) particles.current.push(new Particle(x, y, 'star'));
      }
    }
  }));

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-[100]"
    />
  );
});

export default CelebrationEffect;
