(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const hasGsap = typeof window.gsap !== 'undefined';

  document.getElementById('year').textContent = new Date().getFullYear();

  // Manifesto: quebra em palavras
  document.querySelectorAll('[data-words]').forEach((el) => {
    el.innerHTML = el.textContent.trim().split(/\s+/).map((w) => `<span class="w">${w}</span>`).join(' ');
  });

  if (!hasGsap || reduce) {
    document.querySelector('.loader')?.remove();
    document.querySelectorAll('.w').forEach((w) => (w.style.opacity = 1));
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  document.body.classList.add('is-loading');

  // Rolagem suave
  let lenis = null;
  if (window.Lenis) {
    lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
    document.querySelectorAll('a[href^="#"]').forEach((a) =>
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        if (id.length > 1 && document.querySelector(id)) { e.preventDefault(); lenis.scrollTo(id, { offset: -40 }); }
      })
    );
  }

  // Loader + entrada do hero
  gsap.set('.hero__title .line > span', { yPercent: 110 });
  gsap.set('.hero .reveal-up', { y: 30, opacity: 0 });
  gsap.set('.nav', { y: -30, opacity: 0 });

  gsap.timeline({ defaults: { ease: 'expo.out' } })
    .to('.loader .draw', { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut', stagger: .15 })
    .to('.loader text', { opacity: 1, duration: .6 }, '-=.5')
    .to('.loader', { yPercent: -100, duration: 1.1, ease: 'expo.inOut' }, '+=.25')
    .add(() => { document.body.classList.remove('is-loading'); lenis?.start(); document.querySelector('.loader')?.remove(); })
    .to('.nav', { y: 0, opacity: 1, duration: 1 }, '-=.5')
    .to('.hero__title .line > span', { yPercent: 0, duration: 1.4, stagger: .12 }, '-=.9')
    .to('.hero .reveal-up', { y: 0, opacity: 1, duration: 1.2, stagger: .1 }, '-=1');

  // Nav ao rolar
  ScrollTrigger.create({ start: 80, onUpdate: (s) => document.querySelector('.nav').classList.toggle('is-scrolled', s.scroll() > 80) });

  // Revelações
  gsap.utils.toArray('.reveal-up').filter((el) => !el.closest('.hero')).forEach((el) => {
    gsap.from(el, { y: 50, opacity: 0, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%' } });
  });

  // Manifesto: palavras acendem
  gsap.to('.manifesto .w', {
    opacity: 1, stagger: .1, ease: 'none',
    scrollTrigger: { trigger: '.manifesto__text', start: 'top 75%', end: 'bottom 45%', scrub: true },
  });

  // Processo: rolagem horizontal fixada
  const mm = gsap.matchMedia();
  mm.add('(min-width: 961px)', () => {
    const track = document.querySelector('.process__track');
    const pin = document.querySelector('.process__pin');
    const dist = () => Math.max(0, track.scrollWidth - window.innerWidth + parseFloat(getComputedStyle(pin).paddingLeft) * 2);
    const tl = gsap.timeline({
      scrollTrigger: { trigger: '.process', start: 'top top', end: () => '+=' + dist(), pin: '.process__pin', scrub: 1, invalidateOnRefresh: true },
    });
    tl.to(track, { x: () => -dist(), ease: 'none' }, 0).to('.process__bar span', { scaleX: 1, ease: 'none' }, 0);
  });
  mm.add('(max-width: 960px)', () => {
    document.querySelector('.process__track').style.cssText = 'flex-direction:column;width:auto';
    gsap.utils.toArray('.step').forEach((s) =>
      gsap.from(s, { y: 40, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: s, start: 'top 90%' } })
    );
  });

  // Parallax leve no hero
  gsap.to('.hero__inner', { yPercent: 18, opacity: .2, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

  if (!fine) {
    // Toque: sem mouse, os cards inclinam e o brilho percorre conforme passam pela tela
    gsap.utils.toArray('.tilt').forEach((card, i) => {
      const glare = card.querySelector('.card__glare');
      const side = i % 2 ? -1 : 1;
      card.classList.add('is-touch');
      gsap.set(card, { transformPerspective: 900 });
      gsap.fromTo(card, { rotateX: 9, rotateY: 5 * side }, {
        rotateX: -9, rotateY: -5 * side, ease: 'none',
        scrollTrigger: {
          trigger: card, start: 'top bottom', end: 'bottom top', scrub: .6,
          onUpdate: (s) => {
            glare.style.setProperty('--gy', `${s.progress * 100}%`);
            glare.style.setProperty('--gx', `${50 + side * (s.progress - .5) * 70}%`);
          },
        },
      });
      ScrollTrigger.create({ trigger: card, start: 'top 62%', end: 'bottom 38%', toggleClass: { targets: card, className: 'is-focus' } });
    });
    return;
  }

  // Cursor
  const cursor = document.querySelector('.cursor');
  const dot = cursor.querySelector('.cursor__dot');
  const ring = cursor.querySelector('.cursor__ring');
  const dx = gsap.quickTo(dot, 'x', { duration: .1 }), dy = gsap.quickTo(dot, 'y', { duration: .1 });
  const rx = gsap.quickTo(ring, 'x', { duration: .5, ease: 'power3' }), ry = gsap.quickTo(ring, 'y', { duration: .5, ease: 'power3' });
  window.addEventListener('mousemove', (e) => { dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY); });
  document.querySelectorAll('a, button, .card').forEach((el) => {
    el.addEventListener('mouseenter', () => cursor.classList.add('is-hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
  });

  // Luz do hero segue o mouse
  const hero = document.querySelector('.hero');
  const spot = document.querySelector('.hero__spot');
  hero.addEventListener('mousemove', (e) => {
    const r = hero.getBoundingClientRect();
    spot.style.setProperty('--mx', `${e.clientX - r.left}px`);
    spot.style.setProperty('--my', `${e.clientY - r.top}px`);
  });

  // Botões magnéticos
  document.querySelectorAll('.magnetic').forEach((el) => {
    const xTo = gsap.quickTo(el, 'x', { duration: .6, ease: 'elastic.out(1, .4)' });
    const yTo = gsap.quickTo(el, 'y', { duration: .6, ease: 'elastic.out(1, .4)' });
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - r.left - r.width / 2) * .3);
      yTo((e.clientY - r.top - r.height / 2) * .4);
    });
    el.addEventListener('mouseleave', () => { xTo(0); yTo(0); });
  });

  // Cards com inclinação 3D e brilho
  document.querySelectorAll('.tilt').forEach((card) => {
    const glare = card.querySelector('.card__glare');
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      gsap.to(card, { rotateY: (px - .5) * 12, rotateX: (.5 - py) * 10, duration: .6, ease: 'power3.out' });
      glare.style.setProperty('--gx', `${px * 100}%`);
      glare.style.setProperty('--gy', `${py * 100}%`);
    });
    card.addEventListener('mouseleave', () => gsap.to(card, { rotateX: 0, rotateY: 0, duration: 1, ease: 'elastic.out(1, .5)' }));
  });

})();
