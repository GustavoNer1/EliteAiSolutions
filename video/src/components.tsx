import React from 'react';
import { AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, clamp, EASE, EASE_IN_OUT, sans, serif } from './theme';

/* Fundo preto com brilho dourado suave */
export const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(1300px 900px at ${62 + Math.sin(frame / 120) * 8}% ${40 + Math.cos(frame / 150) * 6}%, rgba(201,168,106,0.11), transparent 62%), ${C.noir}`,
      }}
    />
  );
};

export const Vignette: React.FC = () => (
  <AbsoluteFill style={{ background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.6) 100%)' }} />
);

/* Partículas douradas subindo devagar */
export const Particles: React.FC<{ count?: number }> = ({ count = 70 }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill>
      {Array.from({ length: count }).map((_, i) => {
        const x = random(`x${i}`) * width;
        const speed = 0.15 + random(`s${i}`) * 0.45;
        const y = (((random(`y${i}`) * height - frame * speed) % height) + height) % height;
        const size = 1.2 + random(`z${i}`) * 2.6;
        const twinkle = 0.35 + 0.65 * Math.abs(Math.sin(frame / 28 + i));
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: size,
              height: size,
              borderRadius: '50%',
              background: C.gold,
              opacity: 0.32 * twinkle,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/* Bloco que entra subindo, com desfoque saindo */
export const Reveal: React.FC<{
  at: number;
  len?: number;
  y?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ at, len = 24, y = 40, style, children }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + len], [0, 1], { ...clamp, easing: EASE });
  return (
    <div style={{ opacity: p, translate: `0px ${(1 - p) * y}px`, filter: `blur(${(1 - p) * 8}px)`, ...style }}>
      {children}
    </div>
  );
};

/* Texto revelado palavra por palavra; trechos "gold" ficam em dourado itálico */
export type Seg = { t: string; gold?: boolean; shake?: boolean };
export const Words: React.FC<{ at: number; segs: Seg[]; stagger?: number; style?: React.CSSProperties }> = ({
  at,
  segs,
  stagger = 4,
  style,
}) => {
  const frame = useCurrentFrame();
  let k = 0;
  return (
    <div style={style}>
      {segs.map((s, si) =>
        s.t
          .split(' ')
          .filter(Boolean)
          .map((w, wi) => {
            const start = at + k++ * stagger;
            const p = interpolate(frame, [start, start + 20], [0, 1], { ...clamp, easing: EASE });
            const shake = s.shake && p >= 1 ? Math.sin(frame * 1.7) * 1.2 : 0;
            return (
              <span
                key={`${si}-${wi}`}
                style={{
                  display: 'inline-block',
                  marginRight: '0.24em',
                  opacity: p,
                  translate: `${shake}px ${(1 - p) * 34}px`,
                  rotate: `${shake * 0.6}deg`,
                  filter: `blur(${(1 - p) * 7}px)`,
                  color: s.gold ? C.gold : undefined,
                  fontStyle: s.gold ? 'italic' : undefined,
                }}
              >
                {w}
              </span>
            );
          }),
      )}
    </div>
  );
};

export const Eyebrow: React.FC<{ at: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  at,
  children,
  style,
}) => (
  <Reveal at={at} y={14} style={style}>
    <div style={{ fontFamily: sans, fontSize: 24, letterSpacing: '0.32em', textTransform: 'uppercase', color: C.gold }}>
      {children}
    </div>
  </Reveal>
);

/* Monograma: losango desenhado + costura + "E" */
export const Monogram: React.FC<{ at: number; size: number }> = ({ at, size }) => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [at, at + 45], [0, 1], { ...clamp, easing: EASE_IN_OUT });
  const stitch = interpolate(frame, [at + 20, at + 50], [0, 0.75], clamp);
  const letter = interpolate(frame, [at + 35, at + 60], [0, 1], { ...clamp, easing: EASE });
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
      <path
        d="M50 4 L96 50 L50 96 L4 50 Z"
        fill="none"
        stroke={C.gold}
        strokeWidth={1.4}
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - draw}
      />
      <path d="M50 13 L87 50 L50 87 L13 50 Z" fill="none" stroke={C.gold} strokeWidth={0.8} strokeDasharray="3 3" opacity={stitch} />
      <text
        x="50"
        y="63"
        textAnchor="middle"
        fontFamily={serif}
        fontSize={38}
        fill={C.gold}
        opacity={letter}
        style={{ translate: `0px ${(1 - letter) * 6}px` }}
      >
        E
      </text>
    </svg>
  );
};

export const Wordmark: React.FC<{ size?: number }> = ({ size = 64 }) => (
  <div style={{ fontFamily: serif, fontSize: size, color: C.ivory, letterSpacing: '0.04em', fontWeight: 400 }}>
    Elite <span style={{ color: C.gold, fontStyle: 'italic', fontWeight: 300 }}>AI</span> Solutions
  </div>
);

/* Painel padrão (cartão escuro com borda fina) */
export const Panel: React.FC<{ style?: React.CSSProperties; children: React.ReactNode; glow?: number }> = ({
  style,
  children,
  glow = 0,
}) => (
  <div
    style={{
      background: C.noir2,
      border: `1.5px solid ${glow > 0 ? `rgba(201,168,106,${0.25 + glow * 0.6})` : C.line}`,
      boxShadow: glow > 0 ? `0 0 ${60 * glow}px -10px rgba(201,168,106,${0.45 * glow})` : 'none',
      ...style,
    }}
  >
    {children}
  </div>
);

export const Label: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ fontFamily: sans, fontSize: 18, letterSpacing: '0.24em', textTransform: 'uppercase', color: C.bronze, ...style }}>
    {children}
  </div>
);

/* Número que conta de 0 até o valor */
export const Counter: React.FC<{ at: number; to: number; len?: number; format?: (n: number) => string }> = ({
  at,
  to,
  len = 50,
  format = (n) => Math.round(n).toLocaleString('pt-BR'),
}) => {
  const frame = useCurrentFrame();
  const v = interpolate(frame, [at, at + len], [0, to], { ...clamp, easing: EASE });
  return <>{format(v)}</>;
};
