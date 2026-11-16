// Vitrine "O que construímos": três cenas animadas que rodam como vídeos em loop.
(() => {
  const screen = document.querySelector('.screen');
  if (!screen) return;

  const stage = screen.querySelector('.screen__stage');
  const tabs = [...document.querySelectorAll('.sc-tab')];
  const scenes = [...screen.querySelectorAll('.scene')];
  const animated = typeof window.gsap !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const DUR = [9, 13.5, 11]; // segundos de cada cena antes de passar para a próxima
  const NS = 'http://www.w3.org/2000/svg';
  let compact = false;

  /* ---------- Escala: o palco é desenhado em tamanho fixo e escalado ---------- */
  function fit() {
    const w = stage.clientWidth;
    compact = w < 640;
    screen.classList.toggle('is-compact', compact);
    const dw = compact ? 480 : 960, dh = compact ? 640 : 600;
    stage.style.setProperty('--dw', dw);
    stage.style.setProperty('--dh', dh);
    stage.style.setProperty('--s', w / dw);
    drawFlow(dw, dh);
  }

  /* ---------- Cena 3: liga os nós com curvas calculadas a partir das posições ---------- */
  const flowScene = scenes[2];
  const flowSvg = flowScene.querySelector('.flow__lines');
  const node = (c) => flowScene.querySelector('.' + c);
  function anchor(el, side) {
    const x = el.offsetLeft, y = el.offsetTop, w = el.offsetWidth, h = el.offsetHeight;
    return { r: [x + w, y + h / 2], l: [x, y + h / 2], b: [x + w / 2, y + h], t: [x + w / 2, y] }[side];
  }
  function curve(a, b, vertical) {
    if (vertical) {
      const m = (a[1] + b[1]) / 2;
      return `M${a[0]} ${a[1]} C${a[0]} ${m}, ${b[0]} ${m}, ${b[0]} ${b[1]}`;
    }
    const m = (a[0] + b[0]) / 2;
    return `M${a[0]} ${a[1]} C${m} ${a[1]}, ${m} ${b[1]}, ${b[0]} ${b[1]}`;
  }
  function drawFlow(dw, dh) {
    flowSvg.setAttribute('viewBox', `0 0 ${dw} ${dh}`);
    const [o, i] = compact ? ['b', 't'] : ['r', 'l'];
    const core = node('n-c');
    flowSvg.querySelector('#fl1').setAttribute('d', curve(anchor(node('n-l1'), o), anchor(core, i), compact));
    flowSvg.querySelector('#fl4').setAttribute('d', curve(anchor(node('n-l2'), o), anchor(core, i), compact));
    flowSvg.querySelector('#fl2').setAttribute('d', curve(anchor(core, o), anchor(node('n-r1'), i), compact));
    flowSvg.querySelector('#fl3').setAttribute('d', curve(anchor(core, o), anchor(node('n-r2'), i), compact));
  }

  /* ---------- Utilidades ---------- */
  function fmt(el, v) {
    const d = el.dataset;
    const n = d.dec ? (v / 10).toFixed(1).replace('.', ',') : Math.round(v).toLocaleString('pt-BR');
    return (d.prefix || '') + n + (d.suffix || '');
  }
  const BAR_HEIGHTS = [38, 52, 44, 61, 57, 70, 64, 78, 72, 86, 81, 95];
  const bars = scenes[0].querySelector('.bars');
  BAR_HEIGHTS.forEach((h) => { const b = document.createElement('span'); b.style.height = h + '%'; bars.appendChild(b); });

  // Gráfico de linha: desenha via máscara (funciona com linha tracejada)
  const lineSvg = scenes[0].querySelector('.chart--line svg');
  const clip = document.createElementNS(NS, 'clipPath');
  clip.id = 'lnclip';
  const clipRect = document.createElementNS(NS, 'rect');
  clipRect.setAttribute('x', 0); clipRect.setAttribute('y', 0); clipRect.setAttribute('height', 120); clipRect.setAttribute('width', 300);
  clip.appendChild(clipRect);
  const defs = document.createElementNS(NS, 'defs'); defs.appendChild(clip); lineSvg.prepend(defs);
  lineSvg.querySelectorAll('.ln').forEach((p) => p.setAttribute('clip-path', 'url(#lnclip)'));

  const rowsBox = scenes[0].querySelector('.dash__rows');
  const rowsHTML = rowsBox.innerHTML;

  const CHAT = [
    { who: 'in', text: 'Oi! Vocês fazem sistema para clínica?' },
    { who: 'out', text: 'Olá! Fazemos sim. Criamos sistemas sob medida para clínicas: agenda, prontuário e confirmações automáticas. Posso entender melhor a sua?', lead: 'Qualificando' },
    { who: 'in', text: 'Tenho 3 dentistas e perco muito paciente por falta.' },
    { who: 'out', text: 'Entendi. Com confirmação automática pelo WhatsApp dá para reduzir essas faltas. Que tal uma conversa de 30 min com nosso especialista?', lead: 'Lead qualificado' },
    { who: 'in', text: 'Pode ser amanhã às 10h?' },
    { who: 'card', title: 'Reunião agendada', text: 'Amanhã · 10:00 · Diagnóstico da sua operação', lead: 'Reunião agendada' },
  ];
  function chatBubble(m) {
    const el = document.createElement('div');
    if (m.who === 'card') { el.className = 'msg msg--card'; el.innerHTML = `<b>✓ ${m.title}</b>${m.text}`; }
    else { el.className = 'msg msg--' + m.who; el.textContent = m.text; }
    return el;
  }

  const FLOW = [
    { from: 'fl1', src: 'n-l1', to: 'fl2', dst: 'n-r1', log: 'Lead “Ana · Clínica Sorriso” cadastrado no CRM' },
    { from: 'fl4', src: 'n-l2', to: 'fl3', dst: 'n-r2', log: 'Pedido #4825 confirmado ao cliente' },
    { from: 'fl1', src: 'n-l1', to: 'fl3', dst: 'n-r2', log: 'Proposta enviada ao “Grupo Atlas”' },
    { from: 'fl4', src: 'n-l2', to: 'fl2', dst: 'n-r1', log: 'Relatório do dia atualizado' },
  ];

  /* ---------- Estado final estático (sem animação) ---------- */
  function staticState() {
    scenes[0].querySelectorAll('[data-count]').forEach((el) => (el.textContent = fmt(el, +el.dataset.count)));
    const body = scenes[1].querySelector('.phone__body');
    body.innerHTML = '';
    CHAT.forEach((m) => body.appendChild(chatBubble(m)));
    scenes[1].querySelector('.lead-status').textContent = 'Reunião agendada';
    flowScene.querySelector('.flow__count b').textContent = '136';
    flowScene.querySelector('.flow__log ul').innerHTML = FLOW.map((f) => `<li><b>✓</b>${f.log}</li>`).join('');
  }

  function activate(i) {
    tabs.forEach((t, k) => { t.classList.toggle('is-active', k === i); t.setAttribute('aria-selected', k === i); });
    scenes.forEach((s, k) => s.classList.toggle('is-active', k === i));
  }

  fit();
  window.addEventListener('resize', fit);

  if (!animated) {
    staticState();
    tabs.forEach((t, i) => t.addEventListener('click', () => activate(i)));
    return;
  }

  /* ---------- Cena 1: Dashboard ---------- */
  function buildDash() {
    const s = scenes[0];
    rowsBox.innerHTML = rowsHTML;
    const t = gsap.timeline();
    t.fromTo(s.querySelectorAll('.kpi'), { y: 24, opacity: 0 }, { y: 0, opacity: 1, stagger: .08, duration: .7, ease: 'expo.out' }, 0);
    s.querySelectorAll('[data-count]').forEach((el) => {
      const o = { v: 0 };
      el.textContent = fmt(el, 0);
      t.to(o, { v: +el.dataset.count, duration: 2, ease: 'power3.out', onUpdate: () => (el.textContent = fmt(el, o.v)) }, .15);
    });
    t.fromTo(bars.children, { scaleY: 0 }, { scaleY: 1, stagger: .05, duration: .9, ease: 'expo.out' }, .3);
    t.fromTo(clipRect, { attr: { width: 0 } }, { attr: { width: 300 }, duration: 2.2, ease: 'power2.inOut' }, .4);
    t.fromTo(rowsBox.children, { x: -24, opacity: 0 }, { x: 0, opacity: 1, stagger: .15, duration: .6, ease: 'expo.out' }, 1);

    // "Ao vivo": entra um pedido novo e o faturamento sobe
    t.call(() => {
      const row = document.createElement('div');
      row.className = 'row';
      row.innerHTML = '<span>#4824 · Clínica Vita</span><span>R$ 2.180</span><i>Pago</i>';
      rowsBox.prepend(row);
      rowsBox.lastElementChild.remove();
      gsap.fromTo(row, { height: 0, opacity: 0, paddingTop: 0, paddingBottom: 0 }, { height: 'auto', opacity: 1, paddingTop: 10, paddingBottom: 10, duration: .6, ease: 'expo.out', clearProps: 'height,paddingTop,paddingBottom' });
      gsap.fromTo(row, { borderColor: '#C9A86A' }, { borderColor: '#2A2723', duration: 2, delay: .4 });
      const fat = s.querySelector('.kpi b'), ped = s.querySelectorAll('.kpi b')[1];
      const o = { v: +fat.dataset.count, p: +ped.dataset.count };
      gsap.to(o, { v: o.v + 2180, p: o.p + 1, duration: 1.2, ease: 'power2.out', onUpdate: () => { fat.textContent = fmt(fat, o.v); ped.textContent = fmt(ped, o.p); } });
      gsap.fromTo(fat.parentElement, { borderColor: '#C9A86A' }, { borderColor: '#2A2723', duration: 1.6 });
    }, null, 4.6);
    t.fromTo(bars.lastElementChild, { scaleY: 1 }, { scaleY: 1.04, duration: .5, yoyo: true, repeat: 1 }, 4.8);
    return t;
  }

  /* ---------- Cena 2: Agente de IA no WhatsApp ---------- */
  function buildChat() {
    const s = scenes[1];
    const body = s.querySelector('.phone__body');
    const status = s.querySelector('.phone__status');
    const lead = s.querySelector('.lead-status');
    body.innerHTML = '';
    status.textContent = 'online';
    lead.textContent = 'Novo contato';
    const t = gsap.timeline();
    let at = .5;
    CHAT.forEach((m) => {
      const out = m.who !== 'in';
      const typing = document.createElement('div');
      typing.className = 'typing' + (out ? '' : ' in');
      typing.innerHTML = '<i></i><i></i><i></i>';
      t.call(() => { body.appendChild(typing); if (out) status.textContent = 'digitando…'; }, null, at);
      at += out ? 1.4 : .9;
      t.call(() => {
        typing.remove();
        status.textContent = 'online';
        const el = chatBubble(m);
        body.appendChild(el);
        gsap.from(el, { y: 14, opacity: 0, duration: .45, ease: 'expo.out' });
        while (body.children.length > 7) body.firstElementChild.remove();
        if (m.lead) {
          lead.textContent = m.lead;
          gsap.fromTo(lead, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: .5 });
        }
      }, null, at);
      at += m.who === 'out' ? 1.2 : .7;
    });
    return t;
  }

  /* ---------- Cena 3: Automação ---------- */
  function hit(cls) {
    const el = node(cls);
    el.classList.add('is-hit');
    gsap.delayedCall(.7, () => el.classList.remove('is-hit'));
  }
  function pulse(t, id, at, onEnd) {
    const path = flowSvg.querySelector('#' + id);
    const c = document.createElementNS(NS, 'circle');
    c.setAttribute('r', 5);
    const o = { v: 0 };
    t.call(() => flowSvg.appendChild(c), null, at);
    t.to(o, {
      v: 1, duration: 1.05, ease: 'power1.inOut',
      onUpdate: () => { const pt = path.getPointAtLength(o.v * path.getTotalLength()); c.setAttribute('cx', pt.x); c.setAttribute('cy', pt.y); },
      onComplete: () => { c.remove(); onEnd && onEnd(); },
    }, at);
  }
  function buildFlow() {
    drawFlow(compact ? 480 : 960, compact ? 640 : 600);
    flowSvg.querySelectorAll('circle').forEach((c) => c.remove());
    const log = flowScene.querySelector('.flow__log ul');
    const cnt = flowScene.querySelector('.flow__count b');
    log.innerHTML = '';
    const o = { v: 0 };
    const t = gsap.timeline();
    t.fromTo(flowScene.querySelectorAll('.node'), { opacity: 0, scale: .9 }, { opacity: 1, scale: 1, stagger: .08, duration: .6, ease: 'expo.out' }, 0);
    t.to(o, { v: 132, duration: 1.6, ease: 'power2.out', onUpdate: () => (cnt.textContent = Math.round(o.v)) }, .1);
    FLOW.forEach((f, i) => {
      const at = .8 + i * 2.4;
      t.call(() => hit(f.src), null, at);
      pulse(t, f.from, at, () => hit('n-c'));
      pulse(t, f.to, at + 1.15, () => {
        hit(f.dst);
        const li = document.createElement('li');
        li.innerHTML = `<b>✓</b>${f.log}`;
        log.appendChild(li);
        while (log.children.length > 3) log.firstElementChild.remove();
        gsap.from(li, { x: -10, opacity: 0, duration: .4 });
        cnt.textContent = 133 + i;
        gsap.fromTo(cnt, { scale: 1.15 }, { scale: 1, duration: .5, ease: 'expo.out' });
      });
    });
    return t;
  }

  /* ---------- Controle tipo "player de vídeo" ---------- */
  const builders = [buildDash, buildChat, buildFlow];
  let current = 0, tl = null, timer = null, started = false;

  function play(i) {
    current = i;
    activate(i);
    tl && tl.kill();
    timer && timer.kill();
    tabs.forEach((t) => gsap.set(t.querySelector('.sc-tab__bar i'), { scaleX: 0 }));
    gsap.fromTo(scenes[i], { opacity: 0 }, { opacity: 1, duration: .5 });
    tl = builders[i]();
    timer = gsap.fromTo(tabs[i].querySelector('.sc-tab__bar i'), { scaleX: 0 }, {
      scaleX: 1, duration: DUR[i], ease: 'none', onComplete: () => play((i + 1) % scenes.length),
    });
  }

  tabs.forEach((t, i) => t.addEventListener('click', () => play(i)));

  const io = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) {
      if (!started) { started = true; play(0); }
      else { tl && tl.resume(); timer && timer.resume(); }
    } else if (started) {
      tl && tl.pause(); timer && timer.pause();
    }
  }, { threshold: .35 });
  io.observe(screen);
})();
