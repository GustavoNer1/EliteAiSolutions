import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { SCENES } from './script';
import { C, clamp, sans, sceneStarts, VOICE_DELAY } from './theme';

// Cenas em que o texto na tela já é a própria fala: sem legenda para não repetir
const SKIP = new Set(['01-gancho', '04-virada', '07-chamada']);

type Cue = { from: number; to: number; text: string };

// Divide cada fala em frases curtas e distribui o tempo pela quantidade de letras
export const buildCues = (voice: number[]): Cue[] => {
  const starts = sceneStarts(voice);
  const cues: Cue[] = [];
  SCENES.forEach((scene, i) => {
    if (SKIP.has(scene.id)) return;
    const parts = scene.text
      .split(/(?<=[.?!:])\s+/)
      .flatMap((s) => (s.length > 70 ? s.split(/(?<=[,:])\s+/) : [s]))
      .flatMap((s) => {
        if (s.length <= 70) return [s];
        // ainda longa: quebra no espaço mais perto do meio
        const mid = s.length / 2;
        let cut = s.indexOf(' ', mid);
        const before = s.lastIndexOf(' ', mid);
        if (cut < 0 || (before > 0 && mid - before < cut - mid)) cut = before;
        return [s.slice(0, cut), s.slice(cut + 1)];
      });
    const total = parts.join(' ').length;
    let acc = 0;
    parts.forEach((p) => {
      const from = starts[i] + VOICE_DELAY + Math.round((acc / total) * voice[i]);
      acc += p.length + 1;
      const to = starts[i] + VOICE_DELAY + Math.round((acc / total) * voice[i]);
      cues.push({ from, to, text: p });
    });
  });
  return cues;
};

export const Captions: React.FC<{ voice: number[] }> = ({ voice }) => {
  const frame = useCurrentFrame();
  const cue = buildCues(voice).find((c) => frame >= c.from && frame < c.to);
  if (!cue) return null;
  const o = interpolate(frame, [cue.from, cue.from + 5, cue.to - 4, cue.to], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 56 }}>
      <div
        style={{
          opacity: o,
          maxWidth: 1500,
          textAlign: 'center',
          fontFamily: sans,
          fontSize: 40,
          lineHeight: 1.35,
          color: C.ivory,
          background: 'rgba(11,11,12,0.72)',
          padding: '12px 28px',
          borderBottom: `2px solid ${C.gold}`,
        }}
      >
        {cue.text}
      </div>
    </AbsoluteFill>
  );
};
