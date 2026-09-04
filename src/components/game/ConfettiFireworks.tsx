import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  rotation: number;
  vRot: number;
  type: 'confetti' | 'spark' | 'ring';
  shape: 'rect' | 'circle' | 'star';
  life: number;
  maxLife: number;
}

interface ConfettiFireworksProps {
  active: boolean;
  onComplete?: () => void;
}

export const ConfettiFireworks: React.FC<ConfettiFireworksProps> = ({ active }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const particles: Particle[] = [];
    const colors = [
      '#FF5E7E', '#FFB800', '#00D084', '#06B6D4', '#8B5CF6',
      '#FF4081', '#38EF7D', '#FFE600', '#FA709A', '#00F2FE'
    ];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Spawn confetti cannon from both sides and center
    const spawnConfetti = (originX: number, originY: number, angleDeg: number, spreadDeg: number, count = 40) => {
      for (let i = 0; i < count; i++) {
        const angle = ((angleDeg + (Math.random() - 0.5) * spreadDeg) * Math.PI) / 180;
        const speed = 7 + Math.random() * 14;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const shape = Math.random() > 0.4 ? 'rect' : 'circle';

        particles.push({
          x: originX,
          y: originY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color,
          size: shape === 'rect' ? 6 + Math.random() * 8 : 4 + Math.random() * 5,
          alpha: 1,
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.25,
          type: 'confetti',
          shape,
          life: 0,
          maxLife: 150 + Math.random() * 100,
        });
      }
    };

    // Spawn firework explosion
    const spawnFirework = (x: number, y: number, count = 60) => {
      const color = colors[Math.floor(Math.random() * colors.length)];
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.2;
        const speed = 3 + Math.random() * 8;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color,
          size: 3 + Math.random() * 4,
          alpha: 1,
          rotation: 0,
          vRot: 0,
          type: 'spark',
          shape: 'circle',
          life: 0,
          maxLife: 90 + Math.random() * 40,
        });
      }
    };

    // Initial bursts
    spawnConfetti(canvas.width * 0.2, canvas.height * 0.8, -60, 50, 60);
    spawnConfetti(canvas.width * 0.8, canvas.height * 0.8, -120, 50, 60);
    spawnConfetti(canvas.width * 0.5, canvas.height * 0.7, -90, 60, 80);
    spawnFirework(canvas.width * 0.35, canvas.height * 0.35, 50);
    spawnFirework(canvas.width * 0.65, canvas.height * 0.3, 50);

    // Periodic fireworks intervals
    const fwInterval = setInterval(() => {
      const rx = canvas.width * (0.2 + Math.random() * 0.6);
      const ry = canvas.height * (0.15 + Math.random() * 0.4);
      spawnFirework(rx, ry, 45);
      if (Math.random() > 0.5) {
        spawnConfetti(canvas.width * (Math.random() > 0.5 ? 0.15 : 0.85), canvas.height * 0.75, Math.random() > 0.5 ? -50 : -130, 45, 30);
      }
    }, 600);

    // Animation loop
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vRot;

        if (p.type === 'confetti') {
          p.vy += 0.22; // Gravity
          p.vx *= 0.985; // Drag
        } else {
          p.vy += 0.12; // Light gravity
          p.vx *= 0.96; // Air resistance
        }

        p.alpha = Math.max(0, 1 - p.life / p.maxLife);

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();

        if (p.life >= p.maxLife || p.y > canvas.height + 50) {
          particles.splice(i, 1);
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(fwInterval);
      window.removeEventListener('resize', resize);
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ width: '100vw', height: '100vh' }}
    />
  );
};
