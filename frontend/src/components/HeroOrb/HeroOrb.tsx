import { useEffect, useRef } from 'react';
import './HeroOrb.css';

const DOT_COUNT = 200;
const CONNECT_DIST = 130;   // static connecting lines between nearby dots
const GLOW_RADIUS = 180;    // cursor highlight radius

interface Dot {
  x: number;
  y: number;
  r: number;
}

export default function HeroOrb() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;

    let W = 0, H = 0;
    let mouseX = -9999, mouseY = -9999;
    let animId = 0;
    let dots: Dot[] = [];

    function resize() {
      const parent = canvas.parentElement!;
      W = canvas.width = parent.clientWidth || window.innerWidth;
      H = canvas.height = parent.clientHeight || window.innerHeight;
      // place dots once — they don't move
      dots = Array.from({ length: DOT_COUNT }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.4 + 0.6,
      }));
    }

    function onMouseMove(e: MouseEvent) {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    }

    function onTouchMove(e: TouchEvent) {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.touches[0].clientX - rect.left;
      mouseY = e.touches[0].clientY - rect.top;
    }

    function dist(ax: number, ay: number, bx: number, by: number) {
      return Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2);
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);

      // static base lines between nearby dots (dim, always visible)
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const d = dist(dots[i].x, dots[i].y, dots[j].x, dots[j].y);
          if (d < CONNECT_DIST) {
            const alpha = (1 - d / CONNECT_DIST) * 0.22;
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.strokeStyle = `rgba(170, 215, 170, ${alpha})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }

      // draw each dot — brighter when near cursor
      for (const d of dots) {
        const dMouse = dist(d.x, d.y, mouseX, mouseY);
        const isNear = dMouse < GLOW_RADIUS;
        const proximity = isNear ? 1 - dMouse / GLOW_RADIUS : 0;

        // glow halo around highlighted dot
        if (isNear) {
          const glow = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, 14 + proximity * 10);
          glow.addColorStop(0, `rgba(160, 240, 160, ${proximity * 0.65})`);
          glow.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.beginPath();
          ctx.arc(d.x, d.y, 14 + proximity * 10, 0, Math.PI * 2);
          ctx.fillStyle = glow;
          ctx.fill();
        }

        // the dot itself
        const baseAlpha = 0.45;
        const dotAlpha = baseAlpha + proximity * 0.55;
        const dotR = d.r + proximity * 1.5;
        ctx.beginPath();
        ctx.arc(d.x, d.y, dotR, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180, 230, 180, ${dotAlpha})`;
        ctx.fill();
      }

      // bright lines from cursor to nearby dots
      for (const d of dots) {
        const dMouse = dist(d.x, d.y, mouseX, mouseY);
        if (dMouse < GLOW_RADIUS) {
          const alpha = (1 - dMouse / GLOW_RADIUS) * 0.75;
          ctx.beginPath();
          ctx.moveTo(d.x, d.y);
          ctx.lineTo(mouseX, mouseY);
          ctx.strokeStyle = `rgba(180, 240, 180, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      // cursor dot
      if (mouseX > 0) {
        const cursorGlow = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 30);
        cursorGlow.addColorStop(0, 'rgba(160, 230, 160, 0.18)');
        cursorGlow.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, 30, 0, Math.PI * 2);
        ctx.fillStyle = cursorGlow;
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    }

    const initTimer = setTimeout(() => {
      resize();
      draw();
    }, 50);

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    return () => {
      clearTimeout(initTimer);
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-orb-canvas" />;
}
