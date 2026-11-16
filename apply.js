// Solicitação de análise: formulário em duas etapas que monta a mensagem e abre o WhatsApp.
(() => {
  const form = document.getElementById('analise');
  if (!form) return;

  const WHATSAPP = '5511970299201';
  const panels = [...form.querySelectorAll('.apply__panel')];
  const stepEl = form.querySelector('.apply__step b');
  const bar = form.querySelector('.apply__bar i');
  const error = form.querySelector('.apply__error');
  const back = form.querySelector('.apply__back');
  const submitLabel = form.querySelector('.apply__submit span');
  const done = form.querySelector('.apply__done');
  let step = 0;
  let touched = false;
  const track = (name, params) => document.dispatchEvent(new CustomEvent('elite:track', { detail: { name, params } }));

  function show(n, focus) {
    step = n;
    panels.forEach((p, i) => (p.hidden = i !== n));
    stepEl.textContent = n + 1;
    bar.style.transform = `scaleX(${(n + 1) / panels.length})`;
    back.hidden = n === 0;
    submitLabel.textContent = n === panels.length - 1 ? 'Enviar para análise' : 'Continuar';
    error.hidden = true;
    if (focus) panels[n].querySelector('input, select')?.focus({ preventScroll: true });
  }

  function valid(panel) {
    const bad = [...panel.querySelectorAll('input, select')].find((el) => !el.checkValidity());
    if (!bad) return true;
    error.textContent = bad.type === 'radio' || bad.tagName === 'SELECT'
      ? 'Escolha uma opção em cada pergunta para enviar.'
      : 'Preencha os três campos para continuar.';
    error.hidden = false;
    bad.focus({ preventScroll: true });
    return false;
  }

  function message() {
    const d = new FormData(form);
    const v = (k) => String(d.get(k) || '').trim();
    return [
      'Olá! Quero solicitar a análise do meu negócio.',
      '',
      `Nome: ${v('nome')}`,
      `Empresa: ${v('empresa')}`,
      `Segmento: ${v('segmento')}`,
      `Equipe: ${v('equipe')}`,
      `Principal desafio: ${v('desafio')}`,
      `Faturamento mensal: ${v('faturamento')}`,
    ].join('\n');
  }

  form.addEventListener('input', () => {
    error.hidden = true;
    if (!touched) { touched = true; track('form_start'); }
  });
  back.addEventListener('click', () => show(step - 1, true));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!valid(panels[step])) return;
    if (step < panels.length - 1) { show(step + 1, true); track('form_step', { step: step + 1 }); return; }

    const d = new FormData(form);
    track('generate_lead', { team_size: d.get('equipe'), main_pain: d.get('desafio'), revenue_range: d.get('faturamento') });

    const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message())}`;
    form.querySelector('.apply__wa').href = url;
    [...form.children].forEach((el) => (el.hidden = el !== done));
    done.hidden = false;
    form.classList.add('is-done');
    window.open(url, '_blank', 'noopener');
  });

  show(0, false);
})();
