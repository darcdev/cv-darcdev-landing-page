import { useEffect, useRef } from 'preact/hooks';

export default function DotGridBg() {
  const glowRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const glow = glowRef.current;
    const cursor = cursorRef.current;
    if (!glow || !cursor) return;

    let raf: number;
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 3;
    let x = tx, y = ty;
    let cx = tx, cy = ty;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };

    const tick = () => {
      x += (tx - x) * 0.07;
      y += (ty - y) * 0.07;
      cx += (tx - cx) * 0.3;
      cy += (ty - cy) * 0.3;
      glow.style.left = x + "px";
      glow.style.top = y + "px";
      cursor.style.left = cx + "px";
      cursor.style.top = cy + "px";
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <>
      <div class="dot-grid" />
      <div class="dot-cursor" ref={cursorRef} />
      <div class="dot-glow" ref={glowRef} />
    </>
  );
}
