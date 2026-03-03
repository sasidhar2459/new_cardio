import { useEffect, useRef, useState } from 'react';

// ── Fade-up reveal on scroll ───────────────────────────────────────
// 200ms mount delay lets IonContent's scroll container settle first
export function useReveal(delay = 0, threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let obs: IntersectionObserver | null = null;
    const timer = setTimeout(() => {
      obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            if (delay) setTimeout(() => setVisible(true), delay);
            else setVisible(true);
            obs?.disconnect();
          }
        },
        { threshold }
      );
      obs.observe(el);
    }, 200);
    return () => { clearTimeout(timer); obs?.disconnect(); };
  }, [delay, threshold]);
  return { ref, visible };
}

// ── Slide in from left or right on scroll ──────────────────────────
export function useSlideReveal(from: 'left' | 'right') {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let obs: IntersectionObserver | null = null;
    const timer = setTimeout(() => {
      obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs?.disconnect(); } },
        { threshold: 0.12 }
      );
      obs.observe(el);
    }, 200);
    return () => { clearTimeout(timer); obs?.disconnect(); };
  }, []);
  return { ref, visible, from };
}
