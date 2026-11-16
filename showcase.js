// Vitrine "O que construímos": carrossel com três demonstrações animadas, cada uma em loop na própria tela.
(() => {
  const track = document.querySelector('.carousel__track');
  if (!track) return;

  const slides = [...track.querySelectorAll('.slide')];
  const screens = slides.map((s) => s.querySelector('.screen'));
  const stages = screens.map((s) => s.querySelector('.screen__stage'));
  const scenes = screens.map((s) => s.querySelector('.scene'));
  const tabs = [...document.querySelectorAll('.sc-tab')];
  const animated = typeof window.gsap !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const DUR = [9, 13.5, 11]; // segundos de cada demonstração antes de recomeçar
  const NS = 'http://www.w3.org/2000/svg';
  let compact = false;

  /* ---------- Escala: o palco é desenhado em tamanho fixo e escalado ---------- */
  function fit() {
    const w = stages[0].clientWidth;
    compact = w < 640;
    const dw = compact ? 480 : 960, dh = compact ? 640 : 600;
    screens.forEach((sc, i) => {
      sc.classList.toggle('is-compact', compact);
      stages[i].style.setProperty('--dw', dw);
      stages[i].style.setProperty('--dh', dh);
      stages[i].style.setProperty('--s', w / dw);
    });
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

  /* ---------- Carrossel: abas, setas e arraste levam direto a cada demonstração ---------- */
  const count = document.querySelector('.carousel__count b');
  const btns = [...document.querySelectorAll('.carousel__btn')];
  const NAMES = ['painel_de_gestao', 'atendimento_automatico', 'conexao_entre_sistemas'];
  let current = 0;

  function mark(i) {
    if (i === current && tabs[i].classList.contains('is-active')) return;
    current = i;
    tabs.forEach((t, k) => { t.classList.toggle('is-active', k === i); t.setAttribute('aria-selected', k === i); });
    if (count) count.textContent = i + 1;
    btns.forEach((b) => (b.disabled = i + +b.dataset.dir < 0 || i + +b.dataset.dir >= slides.length));
  }
  function go(i) {
    i = Math.max(0, Math.min(slides.length - 1, i));
    track.scrollTo({ left: slides[i].offsetLeft - slides[0].offsetLeft, behavior: animated ? 'smooth' : 'auto' });
  }
  let raf = 0;
  track.addEventListener('scroll', () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const x = track.scrollLeft + slides[0].offsetLeft;
      let best = 0;
      slides.forEach((s, k) => { if (Math.abs(s.offsetLeft - x) < Math.abs(slides[best].offsetLeft - x)) best = k; });
      // No fim da rolagem a última tela pode não alinhar à esquerda: conta como ativa
      if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 4) best = slides.length - 1;
      if (best === current) return;
      mark(best);
      document.dispatchEvent(new CustomEvent('elite:track', { detail: { name: 'showcase_view', params: { demo: NAMES[best] } } }));
    });
  }, { passive: true });
  tabs.forEach((t, i) => t.addEventListener('click', () => go(i)));
  btns.forEach((b) => b.addEventListener('click', () => go(current + +b.dataset.dir)));
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(current + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(current - 1); }
  });

  fit();
  window.addEventListener('resize', fit);
  staticState(); // todas as telas já aparecem preenchidas, mesmo antes de animar
  tabs[0].classList.remove('is-active');
  mark(0);

  if (!animated) return;

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

  /* ---------- Cada tela roda sozinha, em loop, enquanto está à vista ---------- */
  const builders = [buildDash, buildChat, buildFlow];
  const tls = [null, null, null], loops = [null, null, null];

  function play(i) {
    tls[i] && tls[i].kill();
    loops[i] && loops[i].kill();
    tls[i] = builders[i]();
    loops[i] = gsap.delayedCall(DUR[i], () => play(i));
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      const i = screens.indexOf(e.target);
      if (e.isIntersecting) {
        if (!tls[i]) play(i);
        else { tls[i].resume(); loops[i].resume(); }
      } else if (tls[i]) {
        tls[i].pause(); loops[i].pause();
      }
    });
  }, { threshold: .5 });
  screens.forEach((s) => io.observe(s));
})();
