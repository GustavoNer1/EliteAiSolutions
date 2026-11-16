// Banner: esfera 3D de pontos dourados ("a mente da IA") com órbitas de costura,
// partículas no fundo e fios que se ligam ao cursor. Canvas 2D puro, sem bibliotecas.
(() => {
  const hero = document.querySelector('.hero');
  const cv = document.querySelector('.hero__threads');
  if (!hero || !cv) return;

  const ctx = cv.getContext('2d');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const GOLD = '201,168,106';
  const IVORY = '244,239,230';
  let dpr = 1, W = 0, H = 0, cx = 0, cy = 0, R = 0, soft = 1;
  let mouse = { x: -9999, y: -9999 }, tilt = { x: 0, y: 0 }, tiltTarget = { x: 0, y: 0 };

  // Pontos da esfera (distribuição de Fibonacci) — cada um nasce em posição aleatória e "se monta"
  const N = 720;
  const sphere = Array.from({ length: N }, (_, i) => {
    const y = 1 - (i / (N - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const th = i * Math.PI * (3 - Math.sqrt(5));
    return {
      x: Math.cos(th) * r, y, z: Math.sin(th) * r,
      sx: (Math.random() - .5) * 6, sy: (Math.random() - .5) * 6, sz: (Math.random() - .5) * 6,
      tw: Math.random() * Math.PI * 2, // brilho individual
    };
  });

  // Órbitas: anéis inclinados com uma "agulha" dourada percorrendo cada um
  const rings = [
    { rx: 1.32, tiltX: 1.15, tiltZ: .35, speed: .55, phase: 0 },
    { rx: 1.5, tiltX: 1.35, tiltZ: -.6, speed: -.38, phase: 2 },
    { rx: 1.18, tiltX: .25, tiltZ: 1.1, speed: .7, phase: 4 },
  ];

  let dust = [];

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = hero.offsetWidth; H = hero.offsetHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const wide = W > 960;
    soft = wide ? 1 : .45; // no celular a esfera fica atrás do texto: mais discreta
    cx = wide ? W * .73 : W * .78;
    cy = wide ? H * .5 : H * .2;
    R = wide ? Math.min(W * .22, H * .36) : Math.min(W * .34, 170);
    dust = Array.from({ length: Math.round((W * H) / 18000) }, () => ({
      x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25,
    }));
  }

  function rotate(p, ay, ax) {
    // gira no eixo Y e depois no X
    const cosY = Math.cos(ay), sinY = Math.sin(ay);
    let x = p.x * cosY - p.z * sinY, z = p.x * sinY + p.z * cosY;
    const cosX = Math.cos(ax), sinX = Math.sin(ax);
    const y = p.y * cosX - z * sinX;
    z = p.y * sinX + z * cosX;
    return { x, y, z };
  }
  function project(p, scale) {
    const f = 2.6 / (2.6 + p.z); // perspectiva
    return { x: cx + p.x * R * scale * f, y: cy + p.y * R * scale * f, f };
  }

  let t0 = performance.now();
  const ASSEMBLE = 2.6; // segundos para a esfera se montar
  const START_DELAY = document.querySelector('.loader') ? 2.4 : 0;

  function frame(now) {
    const t = (now - t0) / 1000;
    ctx.clearRect(0, 0, W, H);
    ctx.globalAlpha = soft;

    // suaviza a inclinação seguindo o mouse
    tilt.x += (tiltTarget.x - tilt.x) * .05;
    tilt.y += (tiltTarget.y - tilt.y) * .05;
    const ay = t * .18 + tilt.x;
    const ax = -.35 + tilt.y;
    const breathe = 1 + Math.sin(t * .8) * .015;

    // progresso da montagem (ease-out)
    let k = Math.min(1, Math.max(0, (t - START_DELAY) / ASSEMBLE));
    k = 1 - Math.pow(1 - k, 3);

    // 1) poeira de fundo + fios ao cursor
    for (const d of dust) {
      d.x += d.vx; d.y += d.vy;
      if (d.x < 0 || d.x > W) d.vx *= -1;
      if (d.y < 0 || d.y > H) d.vy *= -1;
      const dist = Math.hypot(d.x - mouse.x, d.y - mouse.y);
      const near = dist < 160 ? 1 - dist / 160 : 0;
      ctx.fillStyle = `rgba(${GOLD},${.14 + near * .7})`;
      ctx.fillRect(d.x - .8, d.y - .8, 1.6, 1.6);
      if (near) {
        ctx.strokeStyle = `rgba(${GOLD},${near * .3})`;
        ctx.setLineDash([3, 4]);
        ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
      }
    }
    ctx.setLineDash([]);

    // 2) halo atrás da esfera
    const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 1.9);
    halo.addColorStop(0, `rgba(${GOLD},${.12 * k})`);
    halo.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = halo;
    ctx.fillRect(cx - R * 2, cy - R * 2, R * 4, R * 4);

    // 3) órbitas (desenhadas em segmentos, mais fracas atrás da esfera)
    ctx.lineWidth = 1;
    rings.forEach((ring, ri) => {
      const pts = [];
      const steps = 120;
      for (let s = 0; s <= steps; s++) {
        const a = (s / steps) * Math.PI * 2;
        let p = { x: Math.cos(a) * ring.rx, y: 0, z: Math.sin(a) * ring.rx };
        p = rotate(p, ring.tiltZ, ring.tiltX);
        p = rotate(p, ay * .6, ax);
        pts.push({ ...project(p, breathe), z: p.z });
      }
      for (let s = 0; s < steps; s++) {
        const a = pts[s], b = pts[s + 1];
        if (s % 2) continue; // tracejado = costura
        const alpha = (a.z > 0 ? .14 : .5) * k;
        ctx.strokeStyle = `rgba(${GOLD},${alpha})`;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
      // agulha com rastro
      const pos = ((t * ring.speed * .25 + ring.phase / (Math.PI * 2)) % 1 + 1) % 1;
      for (let tr = 0; tr < 14; tr++) {
        const idx = Math.floor(((pos - (ring.speed > 0 ? tr : -tr) * .006 + 1) % 1) * steps);
        const p = pts[idx];
        const alpha = (1 - tr / 14) * (p.z > 0 ? .35 : 1) * k;
        ctx.fillStyle = `rgba(${GOLD},${alpha})`;
        const size = (tr === 0 ? 3.2 : 2.2 * (1 - tr / 14)) * p.f;
        ctx.beginPath(); ctx.arc(p.x, p.y, size, 0, Math.PI * 2); ctx.fill();
      }
      if (ri === 0 && k > .99) {
        // brilho na ponta da agulha principal
        const p = pts[Math.floor(pos * steps)];
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 16);
        g.addColorStop(0, `rgba(${GOLD},.5)`); g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g; ctx.fillRect(p.x - 16, p.y - 16, 32, 32);
      }
    });

    // 4) pontos da esfera
    for (const p of sphere) {
      const base = { x: p.sx + (p.x - p.sx) * k, y: p.sy + (p.y - p.sy) * k, z: p.sz + (p.z - p.sz) * k };
      const r = rotate(base, ay, ax);
      const q = project(r, breathe);
      const depth = (1 - r.z) / 2; // 1 = frente
      const twinkle = .75 + Math.sin(t * 2 + p.tw) * .25;
      let alpha = (.14 + depth * .86) * twinkle * Math.max(k, .2);
      const dm = Math.hypot(q.x - mouse.x, q.y - mouse.y);
      if (dm < 90) alpha = Math.min(1, alpha + (1 - dm / 90) * .6);
      const col = depth > .85 && p.tw > 5.4 ? IVORY : GOLD;
      ctx.fillStyle = `rgba(${col},${alpha})`;
      const s = (1.1 + depth * 2) * q.f * (soft < 1 ? .7 : 1);
      ctx.fillRect(q.x - s / 2, q.y - s / 2, s, s);
    }

    if (!reduce) raf = requestAnimationFrame(frame);
  }

  resize();
  window.addEventListener('resize', resize);

  hero.addEventListener('mousemove', (e) => {
    const r = hero.getBoundingClientRect();
    mouse = { x: e.clientX - r.left, y: e.clientY - r.top };
    tiltTarget = { x: (mouse.x / W - .5) * .8, y: (mouse.y / H - .5) * .5 };
  });
  hero.addEventListener('mouseleave', () => { mouse = { x: -9999, y: -9999 }; tiltTarget = { x: 0, y: 0 }; });

  let raf = 0;
  if (reduce) {
    t0 = performance.now() - (START_DELAY + ASSEMBLE + 1) * 1000;
    frame(performance.now());
    return;
  }

  // Só anima quando o banner está visível
  new IntersectionObserver(([en]) => {
    cancelAnimationFrame(raf);
    if (en.isIntersecting) raf = requestAnimationFrame(frame);
  }).observe(hero);
})();
