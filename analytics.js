// Medição com consentimento: o Google Analytics só carrega depois do "Aceitar".
// Para ligar, preencha GA_ID com o código da propriedade (começa com "G-").
(() => {
  const GA_ID = '';       // ex.: 'G-XXXXXXXXXX'
  const CLARITY_ID = '';  // opcional: código do projeto no Microsoft Clarity
  const KEY = 'elite-cookies';

  if (!GA_ID && !CLARITY_ID) return;

  let consent = null;
  try { consent = localStorage.getItem(KEY); } catch (e) { /* armazenamento bloqueado */ }

  /* ---------- Fila: eventos esperam a decisão do visitante ---------- */
  let queue = [];
  let live = false;
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }

  function track(name, params) {
    if (consent === 'no') return;
    if (live) gtag('event', name, params || {});
    else queue.push([name, params || {}]);
  }

  function start() {
    if (live) return;
    live = true;
    if (GA_ID) {
      const s = document.createElement('script');
      s.async = true;
      s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
      document.head.appendChild(s);
      gtag('js', new Date());
      gtag('config', GA_ID);
    }
    if (CLARITY_ID) {
      window.clarity = window.clarity || function () { (window.clarity.q = window.clarity.q || []).push(arguments); };
      const c = document.createElement('script');
      c.async = true;
      c.src = 'https://www.clarity.ms/tag/' + CLARITY_ID;
      document.head.appendChild(c);
    }
    queue.forEach(([n, p]) => gtag('event', n, p));
    queue = [];
  }

  /* ---------- Aviso de cookies ---------- */
  let banner = null;
  function decide(value) {
    consent = value;
    try { localStorage.setItem(KEY, value); } catch (e) { /* segue só nesta visita */ }
    banner?.remove();
    banner = null;
    if (value === 'yes') start();
    else queue = [];
  }
  function openBanner() {
    if (banner) return;
    banner = document.createElement('div');
    banner.className = 'cookies';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Preferências de cookies');
    banner.innerHTML =
      '<p class="cookies__title">Sua privacidade</p>' +
      '<p>Usamos cookies para medir as visitas e melhorar o site. A escolha é sua. ' +
      '<a href="privacidade.html">Política de privacidade</a></p>' +
      '<div class="cookies__actions">' +
      '<button type="button" class="cookies__btn" data-v="no">Recusar</button>' +
      '<button type="button" class="cookies__btn cookies__btn--gold" data-v="yes">Aceitar</button>' +
      '</div>';
    banner.addEventListener('click', (e) => {
      const b = e.target.closest('[data-v]');
      if (b) decide(b.dataset.v);
    });
    document.body.appendChild(banner);
  }

  if (consent === 'yes') start();
  else if (consent !== 'no') openBanner();

  // Link no rodapé para mudar a escolha depois
  const copy = document.querySelector('.footer__copy');
  if (copy) {
    const prefs = document.createElement('button');
    prefs.type = 'button';
    prefs.className = 'footer__prefs';
    prefs.textContent = 'Preferências de cookies';
    prefs.addEventListener('click', openBanner);
    copy.append(' · ', prefs);
  }

  /* ---------- Eventos ---------- */
  // Enviados por outros scripts do site (formulário)
  document.addEventListener('elite:track', (e) => track(e.detail.name, e.detail.params));

  // Seções vistas: mostra até onde cada visitante chegou
  const SECTIONS = [
    ['.hero', 'inicio'], ['#video', 'video'], ['#servicos', 'servicos'], ['.uses', 'usos'],
    ['#vitrine', 'vitrine'], ['#processo', 'processo'], ['#sob-medida', 'comparativo'],
    ['#duvidas', 'duvidas'], ['#contato', 'formulario'],
  ];
  if ('IntersectionObserver' in window) {
    const names = new Map();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        track('section_view', { section: names.get(en.target) });
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -45% 0px' });
    SECTIONS.forEach(([sel, name], i) => {
      const el = document.querySelector(sel);
      if (el) { names.set(el, `${i + 1}_${name}`); io.observe(el); }
    });
  }

  // De que parte da página veio o clique
  function place(el) {
    if (el.closest('.nav')) return 'topo';
    if (el.closest('.film__end')) return 'fim_do_video';
    if (el.closest('.apply')) return 'formulario';
    if (el.closest('.footer')) return 'rodape';
    const s = el.closest('section');
    return s ? (s.id || s.className.split(' ')[0]) : 'pagina';
  }
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a) return;
    const href = a.getAttribute('href') || '';
    if (href === '#contato') track('cta_click', { location: place(a) });
    else if (href.includes('wa.me')) track('whatsapp_click', { location: place(a) });
  });

  // Vídeo: início, 25%, 50%, 75% e fim
  const video = document.querySelector('.film__video');
  if (video) {
    const marks = [25, 50, 75];
    let started = false;
    video.addEventListener('play', () => { if (!started) { started = true; track('video_start'); } });
    video.addEventListener('timeupdate', () => {
      if (!video.duration) return;
      const pct = (video.currentTime / video.duration) * 100;
      while (marks.length && pct >= marks[0]) track('video_progress', { percent: marks.shift() });
    });
    video.addEventListener('ended', () => track('video_complete'));
  }

  // Dúvidas abertas
  document.querySelectorAll('.faq details').forEach((d) => {
    d.addEventListener('toggle', () => {
      if (d.open) track('faq_open', { question: d.querySelector('summary').textContent.trim() });
    });
  });
})();
