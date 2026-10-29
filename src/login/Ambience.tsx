import { useEffect, useRef } from "react";

// Glowing spores drifting over the background; a submitted form sends a
// light wave from its submit button. Off for prefers-reduced-motion.

type Spore = {
  x: number;
  y: number;
  z: number; // depth 0..1, scales size, speed and parallax
  vx: number;
  vy: number;
  phase: number;
  warm: boolean;
};

const WAVE_MS = 1400;

function sprite(color: string) {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, color);
  grad.addColorStop(0.25, color.replace(/[\d.]+\)$/, "0.45)"));
  grad.addColorStop(1, color.replace(/[\d.]+\)$/, "0)"));
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  return c;
}

export function Ambience() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cool = sprite("rgba(191, 241, 255, 1)");
    const warm = sprite("rgba(255, 228, 196, 1)");
    let w = 0;
    let h = 0;
    let spores: Spore[] = [];
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    let wave: { x: number; y: number; start: number } | undefined;

    const spawn = (anywhere: boolean): Spore => {
      const z = Math.random() ** 1.5;
      return {
        x: Math.random() * w,
        y: anywhere ? Math.random() * h : h + 20,
        z,
        vx: 0,
        vy: -(6 + 18 * z),
        phase: Math.random() * Math.PI * 2,
        warm: Math.random() < 0.3,
      };
    };

    const resize = () => {
      const dpr = Math.min(devicePixelRatio, 2);
      w = innerWidth;
      h = innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(140, Math.round((w * h) / 14000));
      spores = Array.from({ length: count }, () => spawn(true));
    };

    const onPointer = (e: PointerEvent) => {
      pointer.tx = e.clientX / w - 0.5;
      pointer.ty = e.clientY / h - 0.5;
    };

    const onSubmit = (e: SubmitEvent) => {
      const el = e.submitter ?? (e.target as Element);
      const r = el.getBoundingClientRect();
      wave = {
        x: r.left + r.width / 2,
        y: r.top + r.height / 2,
        start: performance.now(),
      };
      for (const s of spores) {
        const dx = s.x - wave.x;
        const dy = s.y - wave.y;
        const d = Math.hypot(dx, dy) || 1;
        const push = 9000 / (d + 120);
        s.vx += (dx / d) * push;
        s.vy += (dy / d) * push;
      }
    };

    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      pointer.x += (pointer.tx - pointer.x) * 0.04;
      pointer.y += (pointer.ty - pointer.y) * 0.04;

      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      // rAF time can lag the submit event's performance.now(); a negative age would throw in createRadialGradient
      const waveAge = wave ? Math.max(0, (now - wave.start) / WAVE_MS) : 1;
      if (wave && waveAge < 1) {
        const radius = Math.hypot(w, h) * (1 - (1 - waveAge) ** 3);
        const ring = ctx.createRadialGradient(
          wave.x,
          wave.y,
          Math.max(0, radius - 140),
          wave.x,
          wave.y,
          radius,
        );
        ring.addColorStop(0, "rgba(92, 213, 251, 0)");
        ring.addColorStop(0.8, `rgba(92, 213, 251, ${0.32 * (1 - waveAge)})`);
        ring.addColorStop(1, "rgba(92, 213, 251, 0)");
        ctx.fillStyle = ring;
        ctx.fillRect(0, 0, w, h);
      }
      const flash = waveAge < 1 ? 1 + 1.5 * (1 - waveAge) : 1;

      for (let i = 0; i < spores.length; i++) {
        const s = spores[i];
        s.phase += dt * (0.4 + s.z);
        s.vx *= 1 - dt * 1.5;
        s.vy += (-(6 + 18 * s.z) - s.vy) * dt * 1.5;
        s.x += (s.vx + Math.sin(s.phase) * 8 * s.z) * dt;
        s.y += s.vy * dt;
        if (s.y < -30 || s.x < -30 || s.x > w + 30 || s.y > h + 60) {
          spores[i] = spawn(false);
          continue;
        }
        const size = 4 + 18 * s.z;
        const x = s.x + pointer.x * 40 * s.z - size / 2;
        const y = s.y + pointer.y * 24 * s.z - size / 2;
        const twinkle = 0.65 + 0.35 * Math.sin(s.phase * 2.3);
        ctx.globalAlpha = Math.min(1, (0.18 + 0.5 * s.z) * twinkle * flash);
        ctx.drawImage(s.warm ? warm : cool, x, y, size, size);
      }
      ctx.globalAlpha = 1;
      frame = requestAnimationFrame(tick);
    };

    const onVisibility = () => {
      cancelAnimationFrame(frame);
      if (!document.hidden) {
        last = performance.now();
        frame = requestAnimationFrame(tick);
      }
    };

    resize();
    frame = requestAnimationFrame(tick);
    addEventListener("resize", resize);
    addEventListener("pointermove", onPointer);
    document.addEventListener("submit", onSubmit, true);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("resize", resize);
      removeEventListener("pointermove", onPointer);
      document.removeEventListener("submit", onSubmit, true);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 size-full"
    />
  );
}
