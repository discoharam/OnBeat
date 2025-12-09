import { useEffect, useRef } from 'react';

interface Props {
  active: boolean;
  color: string;
  barCount?: number;
}

export const WaveformCanvas = ({ active, color, barCount = 128 }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationId: number;
    let phase = 0;

    // 1. HIGH-DPI SCALING (Crisp Textures)
    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = parent.clientWidth * dpr;
        canvas.height = parent.clientHeight * dpr;
        canvas.style.width = `${parent.clientWidth}px`;
        canvas.style.height = `${parent.clientHeight}px`;
        ctx.scale(dpr, dpr);
      }
    };
    
    window.addEventListener('resize', resize);
    resize();

    const draw = () => {
      // Use logical pixels for calculations
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);
      
      ctx.clearRect(0, 0, width, height);
      
      const barWidth = width / barCount;
      const gap = 1.5; // Professional spacing
      const actualBarWidth = Math.max(1, barWidth - gap);

      // 2. PRO COLOR PALETTE (Gradient)
      let baseHex = '#71717a'; // Default zinc
      if (color.includes('indigo')) baseHex = '#818cf8';
      else if (color.includes('pink')) baseHex = '#f472b6';
      else if (color.includes('yellow')) baseHex = '#facc15';
      else if (color.includes('emerald')) baseHex = '#34d399';
      else if (color.includes('red')) baseHex = '#f87171';

      // Create vertical gradient (Brighter at top)
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, baseHex);
      gradient.addColorStop(1, `${baseHex}40`); // Fade to transparent
      ctx.fillStyle = gradient;

      // 3. SMOOTH WAVEFORM ALGORITHM
      for (let i = 0; i < barCount; i++) {
        // Simulating Audio Data using Sine Interference
        // This looks like real spectral data compared to pure random()
        const xOffset = i * 0.15;
        const tOffset = phase * 0.08;
        
        // Base Shape (Static)
        let magnitude = Math.abs(Math.sin(xOffset) * Math.cos(xOffset * 0.7)); 
        
        // Live Animation Layer
        if (active) {
           // Combine multiple waves for organic movement
           magnitude = Math.abs(Math.sin(xOffset + tOffset) * Math.cos((xOffset * 1.2) - tOffset));
           // Add slight jitter for "energy"
           magnitude += Math.random() * 0.1;
        } else {
           // Subtle static texture
           magnitude += Math.sin(i * 132.1) * 0.02;
        }

        // Clamp magnitude (0.05 to 1.0)
        magnitude = Math.max(0.05, Math.min(1.0, magnitude));

        // Draw Bar
        const barHeight = magnitude * height * 0.9;
        const x = i * barWidth;
        const y = height - barHeight;
        const radius = 2; // Rounded tips

        ctx.beginPath();
        // Modern rounded-top bars
        ctx.roundRect(x, y, actualBarWidth, barHeight, [radius, radius, 0, 0]);
        ctx.fill();
      }

      if (active) {
        phase += 1;
        animationId = requestAnimationFrame(draw);
      } else {
        animationId = requestAnimationFrame(() => {}); // Idle state
      }
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [active, color, barCount]);

  return <canvas ref={canvasRef} className="w-full h-full block" />;
};
