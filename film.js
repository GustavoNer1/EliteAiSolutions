// Player do vídeo: botão de play próprio e chamada para o WhatsApp no final.
(() => {
  const section = document.querySelector('.film');
  if (!section) return;
  const video = section.querySelector('.film__video');
  const play = section.querySelector('.film__play');
  const end = section.querySelector('.film__end');
  const replay = section.querySelector('.film__replay');

  const start = () => {
    end.hidden = true;
    section.classList.add('is-playing');
    video.controls = true;
    video.play().catch(() => {});
  };

  play.addEventListener('click', start);
  replay.addEventListener('click', () => { video.currentTime = 0; start(); });
  video.addEventListener('pause', () => { if (!video.ended) section.classList.remove('is-playing'); });
  video.addEventListener('play', () => section.classList.add('is-playing'));
  video.addEventListener('ended', () => {
    section.classList.remove('is-playing');
    video.controls = false;
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    end.hidden = false;
  });

  // Pausa se a pessoa rolar para longe do vídeo
  new IntersectionObserver(([e]) => { if (!e.isIntersecting && !video.paused) video.pause(); }, { threshold: 0.2 }).observe(video);
})();
