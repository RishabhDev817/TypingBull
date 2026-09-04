import React, { useEffect, useRef } from 'react';

interface LotusLakeCanvasProps {
  className?: string;
}

export const LotusLakeCanvas: React.FC<LotusLakeCanvasProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;

    const resize = () => {
      if (!canvas.parentElement) return;
      width = canvas.parentElement.clientWidth;
      height = canvas.parentElement.clientHeight;
      canvas.width = width;
      canvas.height = height;
    };

    resize();
    window.addEventListener('resize', resize);

    // Ambient floating lotus elements and water sparkles
    const sparkles: { x: number; y: number; size: number; phase: number; speed: number }[] = [];
    for (let i = 0; i < 28; i++) {
      sparkles.push({
        x: Math.random(),
        y: 0.35 + Math.random() * 0.6,
        size: 1.5 + Math.random() * 2.5,
        phase: Math.random() * Math.PI * 2,
        speed: 0.02 + Math.random() * 0.03,
      });
    }

    // Floating background lotus flowers & pads
    const ambientLilies = [
      { x: 0.12, y: 0.72, r: 24, flower: true, color: '#F472B6' },
      { x: 0.88, y: 0.68, r: 28, flower: true, color: '#FB7185' },
      { x: 0.32, y: 0.86, r: 20, flower: false, color: '#34D399' },
      { x: 0.68, y: 0.84, r: 22, flower: false, color: '#34D399' },
      { x: 0.05, y: 0.42, r: 16, flower: false, color: '#10B981' },
      { x: 0.95, y: 0.45, r: 18, flower: true, color: '#EC4899' },
    ];

    let t = 0;

    const render = () => {
      t += 0.025;
      ctx.clearRect(0, 0, width, height);

      // 1. Water Lake Background Gradient
      const waterGrad = ctx.createLinearGradient(0, 0, 0, height);
      waterGrad.addColorStop(0, '#38BDF8'); // Sky reflection
      waterGrad.addColorStop(0.35, '#0284C7'); // Upper lake
      waterGrad.addColorStop(0.7, '#0369A1'); // Deep serene lake
      waterGrad.addColorStop(1, '#0C4A6E'); // Bottom depth
      ctx.fillStyle = waterGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Animated Gentle Wave Bands / Light Caustics
      ctx.save();
      for (let layer = 0; layer < 4; layer++) {
        ctx.beginPath();
        const yOffset = height * (0.35 + layer * 0.18);
        ctx.moveTo(0, yOffset);

        for (let x = 0; x <= width; x += 20) {
          const wave =
            Math.sin(x * 0.008 + t * 0.8 + layer * 1.5) * 6 +
            Math.cos(x * 0.015 - t * 0.5 + layer) * 3;
          ctx.lineTo(x, yOffset + wave);
        }

        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();

        ctx.fillStyle = `rgba(255, 255, 255, ${0.04 + layer * 0.02})`;
        ctx.fill();
      }
      ctx.restore();

      // 3. Ambient Lotus Lilies & Flower Blossoms in background
      ambientLilies.forEach((lily) => {
        const lx = lily.x * width;
        const ly = lily.y * height + Math.sin(t + lily.x * 10) * 3; // gentle bobbing

        // Lilypad ellipse
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(lx, ly, lily.r * 1.4, lily.r * 0.8, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(16, 185, 129, 0.35)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(5, 150, 105, 0.45)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Lotus flower on top
        if (lily.flower) {
          const fx = lx;
          const fy = ly - 4;
          // Petals
          for (let p = 0; p < 5; p++) {
            const angle = (p / 5) * Math.PI * 2;
            const px = fx + Math.cos(angle) * (lily.r * 0.35);
            const py = fy + Math.sin(angle) * (lily.r * 0.25);
            ctx.beginPath();
            ctx.ellipse(px, py, lily.r * 0.28, lily.r * 0.16, angle, 0, Math.PI * 2);
            ctx.fillStyle = lily.color;
            ctx.fill();
          }
          // Center yellow pistil
          ctx.beginPath();
          ctx.arc(fx, fy, lily.r * 0.14, 0, Math.PI * 2);
          ctx.fillStyle = '#FDE047';
          ctx.fill();
        }
        ctx.restore();
      });

      // 4. Sparkling Water Droplets & Light Glimmers
      sparkles.forEach((s) => {
        s.phase += s.speed;
        const alpha = (Math.sin(s.phase) + 1) * 0.4;
        const sx = s.x * width;
        const sy = s.y * height;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(sx, sy, s.size, 0, Math.PI * 2);
        ctx.fill();

        // Sparkle cross star
        if (alpha > 0.5) {
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(sx - s.size * 2, sy);
          ctx.lineTo(sx + s.size * 2, sy);
          ctx.moveTo(sx, sy - s.size * 2);
          ctx.lineTo(sx, sy + s.size * 2);
          ctx.stroke();
        }
        ctx.restore();
      });

      // 5. Shoreline reeds / cattails silhouetted on far corners
      ctx.save();
      ctx.fillStyle = 'rgba(6, 78, 59, 0.4)';
      // Left reeds
      for (let r = 0; r < 5; r++) {
        const rx = 10 + r * 14;
        const rHeight = 60 + Math.sin(r * 2) * 25;
        const sway = Math.sin(t * 0.8 + r) * 4;
        ctx.beginPath();
        ctx.moveTo(rx, height);
        ctx.quadraticCurveTo(rx + sway * 0.5, height - rHeight * 0.6, rx + sway, height - rHeight);
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'rgba(4, 120, 87, 0.5)';
        ctx.stroke();
      }
      // Right reeds
      for (let r = 0; r < 5; r++) {
        const rx = width - 15 - r * 14;
        const rHeight = 65 + Math.cos(r * 2) * 20;
        const sway = Math.sin(t * 0.8 + r + 2) * 4;
        ctx.beginPath();
        ctx.moveTo(rx, height);
        ctx.quadraticCurveTo(rx + sway * 0.5, height - rHeight * 0.6, rx + sway, height - rHeight);
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'rgba(4, 120, 87, 0.5)';
        ctx.stroke();
      }
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none rounded-3xl ${className}`}
    />
  );
};
