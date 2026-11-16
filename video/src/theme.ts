import { loadFont as loadSerif } from '@remotion/google-fonts/CormorantGaramond';
import { loadFont as loadSans } from '@remotion/google-fonts/Inter';
import { Easing } from 'remotion';

export const serif = loadSerif('normal', { weights: ['300', '400', '500'], subsets: ['latin'] }).fontFamily;
loadSerif('italic', { weights: ['300', '400'], subsets: ['latin'] });
export const sans = loadSans('normal', { weights: ['300', '400', '500'], subsets: ['latin'] }).fontFamily;

export const C = {
  noir: '#0B0B0C',
  noir2: '#141414',
  line: '#2A2723',
  ivory: '#F4EFE6',
  dim: '#A39C90',
  gold: '#C9A86A',
  bronze: '#6E6658',
};

export const EASE = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);
export const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

// Tempos (em frames, 30 fps)
export const FPS = 30;
export const VOICE_DELAY = 8; // respiro antes de cada fala
export const PAD = 24; // respiro depois de cada fala
export const TRANSITION = 15; // duração do fade entre cenas
export const END_HOLD = 90; // tempo extra na tela final

export const sceneDurations = (voice: number[]) =>
  voice.map((v, i) => VOICE_DELAY + v + PAD + (i === voice.length - 1 ? END_HOLD : 0));

export const sceneStarts = (voice: number[]) => {
  const d = sceneDurations(voice);
  const starts: number[] = [];
  let acc = 0;
  d.forEach((len) => {
    starts.push(acc);
    acc += len - TRANSITION;
  });
  return starts;
};

export const totalDuration = (voice: number[]) =>
  sceneDurations(voice).reduce((a, b) => a + b, 0) - TRANSITION * (voice.length - 1);

// Momento (frame dentro da cena) em que um trecho da fala começa, estimado pela posição do texto
export const beat = (text: string, phrase: string, voice: number) => {
  const i = text.indexOf(phrase);
  return VOICE_DELAY + Math.round(voice * (Math.max(0, i) / text.length));
};
