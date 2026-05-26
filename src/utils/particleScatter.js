/** Smooth easing helpers */
export const ease = {
  inOutCubic: (t) => (t < 0.5 ? 4 * t * t * t : 1 - ((-2 * t + 2) ** 3) / 2),
  outCubic: (t) => 1 - (1 - t) ** 3,
  outQuart: (t) => 1 - (1 - t) ** 4,
  outExpo: (t) => (t === 1 ? 1 : 1 - 2 ** (-10 * t)),
};

function coverRect(imgW, imgH, viewW, viewH, scale = 1) {
  const imgRatio = imgW / imgH;
  const viewRatio = viewW / viewH;
  let drawW;
  let drawH;

  if (imgRatio > viewRatio) {
    drawH = viewH * scale;
    drawW = drawH * imgRatio;
  } else {
    drawW = viewW * scale;
    drawH = drawW / imgRatio;
  }

  return {
    x: (viewW - drawW) / 2,
    y: (viewH - drawH) / 2,
    w: drawW,
    h: drawH,
  };
}

/** Pre-sample particles off the main thread budget — call before scatter starts */
export function buildParticles(image, viewW, viewH, scale = 1.75) {
  if (!image?.naturalWidth) return [];

  const sampleW = Math.floor(viewW * 0.5);
  const sampleH = Math.floor(viewH * 0.5);
  const offscreen = document.createElement('canvas');
  offscreen.width = sampleW;
  offscreen.height = sampleH;
  const offCtx = offscreen.getContext('2d', { willReadFrequently: true });
  if (!offCtx) return [];

  const rect = coverRect(image.naturalWidth, image.naturalHeight, sampleW, sampleH, scale);
  offCtx.drawImage(image, rect.x, rect.y, rect.w, rect.h);
  const data = offCtx.getImageData(0, 0, sampleW, sampleH).data;

  const step = 5;
  const cx = viewW / 2;
  const cy = viewH / 2;
  const maxDist = Math.hypot(viewW, viewH) * 0.5;
  const particles = [];
  const sx = viewW / sampleW;
  const sy = viewH / sampleH;

  for (let y = 0; y < sampleH; y += step) {
    for (let x = 0; x < sampleW; x += step) {
      const i = (y * sampleW + x) * 4;
      if (data[i + 3] < 40) continue;

      const px = x * sx + (Math.random() - 0.5) * step * sx;
      const py = y * sy + (Math.random() - 0.5) * step * sy;
      const dx = px - cx;
      const dy = py - cy;
      const dist = Math.hypot(dx, dy) || 1;
      const angle = Math.atan2(dy, dx);
      const norm = dist / maxDist;
      const speed = (9 + Math.random() * 14) * (1 + (1 - norm) * 1.6);

      particles.push({
        x: px,
        y: py,
        ox: px,
        oy: py,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        r: data[i],
        g: data[i + 1],
        b: data[i + 2],
        size: step * sx * 0.55 + Math.random(),
        born: norm * 180,
        life: 1,
        drag: 0.985,
      });
    }
  }

  return particles;
}

export function resizeScatterCanvas(canvas) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = window.innerWidth;
  const h = window.innerHeight;
  canvas.width = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;
  const ctx = canvas.getContext('2d');
  if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { w, h };
}

/**
 * Runs a buttery-smooth particle dissolve using pre-built particles.
 * All timing is delta-time based for consistent motion across frame rates.
 */
export function runParticleScatter(canvas, particles, options = {}) {
  const {
    duration = 1400,
    onProgress,
    onComplete,
  } = options;

  const ctx = canvas.getContext('2d');
  if (!ctx || !particles.length) {
    onComplete?.();
    return () => {};
  }

  const w = window.innerWidth;
  const h = window.innerHeight;
  let rafId = null;
  let startTime = null;
  let lastTime = null;

  const draw = (timestamp) => {
    if (!startTime) {
      startTime = timestamp;
      lastTime = timestamp;
    }

    const elapsed = timestamp - startTime;
    const dt = Math.min((timestamp - lastTime) / 16.667, 2.5);
    lastTime = timestamp;
    const progress = Math.min(elapsed / duration, 1);
    const dissolve = ease.outCubic(Math.min(progress / 0.35, 1));
    const fadeOut = progress > 0.55 ? ease.inOutCubic((progress - 0.55) / 0.45) : 0;

    ctx.clearRect(0, 0, w, h);

    let alive = 0;
    for (let n = 0; n < particles.length; n += 1) {
      const p = particles[n];
      const age = elapsed - p.born;
      if (age < 0) {
        alive += 1;
        const a = dissolve * 0.9 * (1 - fadeOut);
        if (a > 0.02) {
          ctx.globalAlpha = a;
          ctx.fillStyle = `rgb(${p.r},${p.g},${p.b})`;
          ctx.beginPath();
          ctx.arc(p.ox, p.oy, p.size * 0.85, 0, Math.PI * 2);
          ctx.fill();
        }
        continue;
      }

      const moveEase = ease.outExpo(Math.min(age / 280, 1));
      p.vx *= p.drag ** dt;
      p.vy *= p.drag ** dt;
      p.x += p.vx * dt * moveEase;
      p.y += p.vy * dt * moveEase;
      p.life = (1 - fadeOut) * (1 - progress * 0.15);

      if (p.life <= 0.02) continue;
      alive += 1;

      ctx.globalAlpha = p.life * dissolve;
      ctx.fillStyle = `rgb(${p.r},${p.g},${p.b})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
    onProgress?.(progress);

    if (progress < 1 && alive > 0) {
      rafId = requestAnimationFrame(draw);
      return;
    }

    ctx.clearRect(0, 0, w, h);
    onComplete?.();
  };

  rafId = requestAnimationFrame(draw);

  return () => {
    if (rafId) cancelAnimationFrame(rafId);
  };
}

/* Implement particle scatter effect */
