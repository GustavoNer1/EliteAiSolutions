import React from 'react';
import { Audio } from '@remotion/media';
import { AbsoluteFill, interpolate, random, staticFile, useCurrentFrame } from 'remotion';
import { Counter, Eyebrow, Label, Monogram, Panel, Reveal, Words, Wordmark } from './components';
import { SCENES } from './script';
import { beat, C, clamp, EASE, EASE_IN_OUT, sans, serif, VOICE_DELAY } from './theme';

type SceneProps = { voice: number };

const Voice: React.FC<{ id: string }> = ({ id }) => (
  <Audio name={`Voz ${id}`} src={staticFile(`voz/${id}.mp3`)} from={VOICE_DELAY} />
);

const big: React.CSSProperties = { fontFamily: serif, fontWeight: 300, color: C.ivory, lineHeight: 1.08 };

/* ------------------------------------------------------------------ 1. Gancho */
export const Gancho: React.FC<SceneProps> = ({ voice }) => {
  const frame = useCurrentFrame();
  const text = SCENES[0].text;
  const b = (p: string) => beat(text, p, voice);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <Voice id={SCENES[0].id} />
      {/* contador fantasma de custo ao fundo */}
      <div
        style={{
          position: 'absolute',
          fontFamily: serif,
          fontSize: 420,
          color: C.gold,
          opacity: 0.045,
          letterSpacing: '-0.02em',
          top: 560,
          translate: `0px ${-frame * 0.5}px`,
        }}
      >
        R$ <Counter at={0} to={48720} len={150} />
      </div>
      <div style={{ textAlign: 'center' }}>
        <Words at={b('Quanto')} segs={[{ t: 'Quanto custa, por mês,' }]} style={{ ...big, fontSize: 120 }} />
        <Words
          at={b('a sua')}
          segs={[{ t: 'a sua empresa funcionar no' }, { t: 'improviso?', gold: true, shake: true }]}
          style={{ ...big, fontSize: 120 }}
        />
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ 2. Problema */
const Sheet: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const cells = ['Cliente', 'Valor', 'Status', 'Data', 'Ana', '#REF!', '???', '12/03', 'Grupo A.', 'R$ 3.4', '—', '#N/D', 'Carlos', '', 'pendente?', '??/??'];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginTop: 22 }}>
      {cells.map((c, i) => {
        const p = interpolate(frame, [at + i * 2, at + i * 2 + 10], [0, 1], clamp);
        const err = c.startsWith('#') || c.includes('?');
        return (
          <div
            key={i}
            style={{
              opacity: p,
              height: 46,
              border: `1px solid ${C.line}`,
              fontFamily: sans,
              fontSize: 19,
              color: err ? C.gold : i < 4 ? C.bronze : C.dim,
              display: 'flex',
              alignItems: 'center',
              paddingLeft: 12,
              background: err ? 'rgba(201,168,106,0.06)' : 'transparent',
            }}
          >
            {c}
          </div>
        );
      })}
    </div>
  );
};

const Notifications: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const msgs = ['Oi, alguém pode me ajudar?', 'Ainda estou aguardando…', 'Vocês atendem hoje?', 'Olá??'];
  const count = Math.round(interpolate(frame, [at, at + 140], [1, 27], clamp));
  return (
    <div style={{ marginTop: 22, position: 'relative' }}>
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: -64,
          minWidth: 56,
          height: 56,
          borderRadius: 28,
          background: C.gold,
          color: C.noir,
          fontFamily: sans,
          fontWeight: 500,
          fontSize: 26,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 14px',
          opacity: interpolate(frame, [at, at + 10], [0, 1], clamp),
        }}
      >
        {count}
      </div>
      {msgs.map((m, i) => {
        const s = at + 8 + i * 22;
        const p = interpolate(frame, [s, s + 14], [0, 1], { ...clamp, easing: EASE });
        return (
          <div
            key={i}
            style={{
              opacity: p,
              translate: `${(1 - p) * 40}px 0px`,
              display: 'flex',
              justifyContent: 'space-between',
              padding: '12px 16px',
              marginBottom: 8,
              background: '#1A1A1A',
              borderRadius: 12,
              fontFamily: sans,
              fontSize: 20,
              color: C.dim,
            }}
          >
            <span>{m}</span>
            <span style={{ color: C.bronze, fontSize: 16 }}>sem resposta</span>
          </div>
        );
      })}
    </div>
  );
};

const CopyPaste: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const n = Math.floor(interpolate(frame, [at, at + 110], [0, 18], clamp));
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 24 }}>
      {Array.from({ length: n }).map((_, i) => (
        <div
          key={i}
          style={{
            fontFamily: sans,
            fontSize: 20,
            padding: '8px 16px',
            border: `1px solid ${i % 2 ? C.line : 'rgba(201,168,106,0.4)'}`,
            color: i % 2 ? C.dim : C.gold,
          }}
        >
          {i % 2 ? 'Ctrl + V' : 'Ctrl + C'}
        </div>
      ))}
    </div>
  );
};

const BlindChart: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const q = interpolate(frame, [at + 10, at + 30], [0, 1], { ...clamp, easing: EASE });
  return (
    <div style={{ position: 'relative', height: 190, marginTop: 22 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: '100%', filter: 'blur(9px)' }}>
        {[40, 72, 55, 88, 46, 63, 80, 52].map((h, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: `${interpolate(frame, [at, at + 30], [0, h], { ...clamp, easing: EASE })}%`,
              background: C.bronze,
            }}
          />
        ))}
      </div>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: serif,
          fontSize: 150,
          color: C.gold,
          opacity: q,
          scale: `${0.7 + q * 0.3}`,
        }}
      >
        ?
      </div>
    </div>
  );
};

export const Problema: React.FC<SceneProps> = ({ voice }) => {
  const frame = useCurrentFrame();
  const text = SCENES[1].text;
  const b = (p: string) => beat(text, p, voice);
  const panels = [
    { at: b('Planilhas'), title: 'Planilhas desatualizadas', body: <Sheet at={b('Planilhas') + 8} /> },
    { at: b('Clientes'), title: 'Clientes esperando', body: <Notifications at={b('Clientes') + 6} /> },
    { at: b('Sua equipe'), title: 'Retrabalho, todos os dias', body: <CopyPaste at={b('Sua equipe') + 6} /> },
    { at: b('E você'), title: 'Decisões no escuro', body: <BlindChart at={b('E você') + 6} /> },
  ];
  return (
    <AbsoluteFill style={{ padding: '110px 150px 170px' }}>
      <Voice id={SCENES[1].id} />
      <Eyebrow at={4}>O custo do improviso</Eyebrow>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 34, marginTop: 34, flex: 1 }}>
        {panels.map((p, i) => {
          const pr = interpolate(frame, [p.at, p.at + 22], [0, 1], { ...clamp, easing: EASE });
          const jitter = pr >= 1 ? Math.sin(frame / 7 + i * 2) * 0.35 : 0;
          return (
            <Panel
              key={p.title}
              style={{
                padding: '28px 34px',
                opacity: pr,
                translate: `0px ${(1 - pr) * 50}px`,
                rotate: `${(random(`r${i}`) - 0.5) * 2.4 + jitter}deg`,
              }}
            >
              <div style={{ fontFamily: serif, fontSize: 40, color: C.ivory }}>{p.title}</div>
              {p.body}
            </Panel>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ 3. Causa */
export const Causa: React.FC<SceneProps> = ({ voice }) => {
  const frame = useCurrentFrame();
  const text = SCENES[2].text;
  const b = (p: string) => beat(text, p, voice);
  const drop = interpolate(frame, [b('É tentar'), b('É tentar') + 30], [0, 1], { ...clamp, easing: EASE });
  const misfit = interpolate(frame, [b('Elas'), b('Elas') + 20], [0, 1], clamp);
  const blink = misfit > 0 ? 0.55 + 0.45 * Math.abs(Math.sin(frame / 6)) : 0;
  return (
    <AbsoluteFill style={{ flexDirection: 'row', alignItems: 'center', padding: '0 150px', gap: 90 }}>
      <Voice id={SCENES[2].id} />
      <svg width={760} height={680} viewBox="0 0 760 680" style={{ flex: 'none', overflow: 'visible' }}>
        {/* a forma única do seu negócio */}
        <path
          d="M180 120 C 320 60, 470 150, 560 110 C 660 70, 700 230, 640 330 C 600 410, 690 500, 590 570 C 480 640, 360 560, 250 600 C 130 640, 70 520, 110 420 C 140 340, 60 250, 180 120 Z"
          fill="rgba(201,168,106,0.07)"
          stroke={C.gold}
          strokeWidth={2.5}
          strokeDasharray="10 9"
          pathLength={1000}
          strokeDashoffset={interpolate(frame, [0, 60], [1000, 0], clamp)}
        />
        <text x={380} y={680} textAnchor="middle" fontFamily={serif} fontSize={44} fill={C.gold} fontStyle="italic"
          opacity={interpolate(frame, [20, 45], [0, 1], clamp)}>
          o seu negócio
        </text>
        {/* a caixa genérica, que não encaixa */}
        <g style={{ translate: `0px ${(1 - drop) * -700}px` }} opacity={drop}>
          <rect x={150} y={170} width={460} height={380} fill="rgba(110,102,88,0.35)" stroke={C.dim} strokeWidth={2} />
          <text x={380} y={250} textAnchor="middle" fontFamily={sans} fontSize={22} letterSpacing={6} fill={C.ivory}>
            TAMANHO ÚNICO
          </text>
        </g>
        {/* pontos onde não serve */}
        {[
          [560, 110], [640, 330], [590, 570], [110, 420], [250, 600],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={16} fill="none" stroke={C.gold} strokeWidth={3} opacity={blink} />
        ))}
      </svg>
      <div style={{ flex: 1 }}>
        <Reveal at={b('O problema')}>
          <div style={{ fontFamily: sans, fontSize: 34, color: C.dim, marginBottom: 30 }}>Não é falta de esforço.</div>
        </Reveal>
        <Words at={b('ferramentas')} segs={[{ t: 'Ferramentas feitas para todo mundo' }]} style={{ ...big, fontSize: 84 }} />
        <Words at={b('Elas')} segs={[{ t: 'nunca servem direito.', gold: true }]} style={{ ...big, fontSize: 84, marginTop: 10 }} />
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ 4. Virada */
export const Virada: React.FC<SceneProps> = ({ voice }) => {
  const frame = useCurrentFrame();
  const text = SCENES[3].text;
  const b = (p: string) => beat(text, p, voice);
  const tape = interpolate(frame, [0, 70], [1, 0], { ...clamp, easing: EASE_IN_OUT });
  const stitch = interpolate(frame, [b('Um terno sob') + 20, b('Um terno sob') + 70], [0, 1], { ...clamp, easing: EASE });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <Voice id={SCENES[3].id} />
      {/* fita métrica atravessando a tela */}
      <div
        style={{
          position: 'absolute',
          top: 150,
          left: 0,
          width: 3600,
          height: 64,
          translate: `${-tape * 1700 - 200}px 0px`,
          background: `repeating-linear-gradient(90deg, ${C.noir} 0 2px, transparent 2px 20px), ${C.gold}`,
          backgroundSize: '20px 22px, auto',
          backgroundRepeat: 'repeat-x, no-repeat',
          opacity: 0.85,
          display: 'flex',
          alignItems: 'flex-end',
        }}
      >
        {Array.from({ length: 36 }).map((_, i) => (
          <div key={i} style={{ width: 100, flex: 'none', fontFamily: sans, fontSize: 18, color: C.noir, paddingLeft: 4, paddingBottom: 6 }}>
            {(i + 1) * 10}
          </div>
        ))}
      </div>
      <div style={{ textAlign: 'center' }}>
        <Words at={b('Um terno pronto')} segs={[{ t: 'Um terno pronto serve em muita gente.' }]}
          style={{ ...big, fontSize: 84, color: C.dim }} />
        <Words at={b('Um terno sob')}
          segs={[{ t: 'Um terno' }, { t: 'sob medida', gold: true }, { t: 'serve em' }, { t: 'uma só.', gold: true }]}
          style={{ ...big, fontSize: 104, marginTop: 24 }} />
        <svg width={1100} height={20} style={{ marginTop: 36 }}>
          <line x1={0} y1={10} x2={1100 * stitch} y2={10} stroke={C.gold} strokeWidth={2} strokeDasharray="12 10" />
        </svg>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ 5. Solução */
export const Solucao: React.FC<SceneProps> = ({ voice }) => {
  const frame = useCurrentFrame();
  const text = SCENES[4].text;
  const b = (p: string) => beat(text, p, voice);
  const cards = [
    { at: b('sistemas sob medida'), n: 'I', title: 'Sistemas sob medida', desc: 'Plataformas e painéis feitos para a sua operação' },
    { at: b('automações'), n: 'II', title: 'Automações', desc: 'Tarefas repetitivas acontecendo sozinhas' },
    { at: b('inteligência artificial'), n: 'III', title: 'Inteligência artificial', desc: 'Atendimento aos seus clientes 24 horas por dia' },
  ];
  return (
    <AbsoluteFill style={{ alignItems: 'center', paddingTop: 100 }}>
      <Voice id={SCENES[4].id} />
      <Monogram at={0} size={130} />
      <Reveal at={30} style={{ marginTop: 26 }}>
        <Wordmark size={70} />
      </Reveal>
      <Reveal at={b('tiramos')} style={{ marginTop: 18 }}>
        <div style={{ fontFamily: sans, fontSize: 32, color: C.dim }}>
          Tiramos as medidas da sua operação e costuramos a tecnologia certa.
        </div>
      </Reveal>
      <div style={{ display: 'flex', gap: 36, marginTop: 70 }}>
        {cards.map((c, i) => {
          const p = interpolate(frame, [c.at, c.at + 24], [0, 1], { ...clamp, easing: EASE });
          const next = cards[i + 1]?.at ?? c.at + 200;
          const glow = interpolate(frame, [c.at, c.at + 12, next, next + 20], [0, 1, 1, 0.35], clamp);
          return (
            <Panel key={c.n} glow={glow} style={{ width: 500, padding: '40px 40px 44px', opacity: p, translate: `0px ${(1 - p) * 60}px` }}>
              <div style={{ fontFamily: serif, fontSize: 64, color: C.gold, lineHeight: 1 }}>{c.n}</div>
              <div style={{ fontFamily: serif, fontSize: 46, color: C.ivory, marginTop: 40 }}>{c.title}</div>
              <div style={{ fontFamily: sans, fontSize: 24, color: C.dim, marginTop: 14, lineHeight: 1.45 }}>{c.desc}</div>
            </Panel>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ 6. Futuro */
export const Futuro: React.FC<SceneProps> = ({ voice }) => {
  const frame = useCurrentFrame();
  const text = SCENES[5].text;
  const b = (p: string) => beat(text, p, voice);
  const dash = b('Imagine');
  const chat = b('Clientes');
  const meet = b('Reuniões');
  const bubble = (at: number) => interpolate(frame, [at, at + 14], [0, 1], { ...clamp, easing: EASE });
  const kpis = [
    { l: 'Faturamento', v: 248390, f: (n: number) => `R$ ${Math.round(n).toLocaleString('pt-BR')}` },
    { l: 'Pedidos', v: 1284, f: (n: number) => Math.round(n).toLocaleString('pt-BR') },
    { l: 'Conversão', v: 48, f: (n: number) => `${(n / 10).toFixed(1).replace('.', ',')}%` },
  ];
  return (
    <AbsoluteFill style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 70, paddingBottom: 60 }}>
      <Voice id={SCENES[5].id} />
      {/* painel */}
      <Reveal at={dash} y={60}>
        <Panel style={{ width: 980, padding: 40 }}>
          <Label>Visão geral · hoje</Label>
          <div style={{ fontFamily: serif, fontSize: 46, color: C.ivory, marginTop: 6 }}>Painel da sua empresa</div>
          <div style={{ display: 'flex', gap: 20, marginTop: 30 }}>
            {kpis.map((k) => (
              <div key={k.l} style={{ flex: 1, border: `1px solid ${C.line}`, padding: '20px 22px' }}>
                <Label style={{ fontSize: 15 }}>{k.l}</Label>
                <div style={{ fontFamily: serif, fontSize: 52, color: C.ivory, marginTop: 6 }}>
                  <Counter at={dash + 10} to={k.v} len={60} format={k.f} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 230, marginTop: 30 }}>
            {[38, 52, 44, 61, 57, 70, 64, 78, 72, 86, 81, 95].map((h, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: `${interpolate(frame, [dash + 14 + i * 2, dash + 44 + i * 2], [0, h], { ...clamp, easing: EASE })}%`,
                  background: `linear-gradient(to top, rgba(201,168,106,0.2), ${C.gold})`,
                }}
              />
            ))}
          </div>
        </Panel>
      </Reveal>
      {/* celular */}
      <Reveal at={chat - 10} y={60}>
        <div
          style={{
            width: 430,
            height: 760,
            borderRadius: 48,
            border: `1.5px solid ${C.line}`,
            background: '#0A0A0A',
            boxShadow: `0 0 0 10px #131313, 0 0 0 11.5px ${C.line}`,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '22px 30px 0', fontFamily: sans, fontSize: 18, color: C.dim }}>
            <span>02:14</span>
            <span style={{ color: C.gold }}>☾</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '18px 24px', borderBottom: `1px solid ${C.line}` }}>
            <Monogram at={-100} size={42} />
            <div>
              <div style={{ fontFamily: sans, fontSize: 21, color: C.ivory }}>Sua Empresa</div>
              <div style={{ fontFamily: sans, fontSize: 16, color: C.gold }}>online · agente de IA</div>
            </div>
          </div>
          <div style={{ flex: 1, padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 12, fontFamily: sans, fontSize: 20, lineHeight: 1.4 }}>
            <div style={{ alignSelf: 'flex-start', background: '#1A1A1A', color: C.ivory, padding: '12px 16px', borderRadius: 16, maxWidth: '82%', opacity: bubble(chat), translate: `0px ${(1 - bubble(chat)) * 20}px` }}>
              Oi! Queria um orçamento.
            </div>
            <div style={{ alignSelf: 'flex-end', background: 'rgba(201,168,106,0.16)', border: '1px solid rgba(201,168,106,0.4)', color: C.ivory, padding: '12px 16px', borderRadius: 16, maxWidth: '86%', opacity: bubble(chat + 22), translate: `0px ${(1 - bubble(chat + 22)) * 20}px` }}>
              Olá! Claro. Me conta um pouco sobre o seu negócio?
              <div style={{ fontSize: 15, color: C.gold, marginTop: 6 }}>respondido em 3 s</div>
            </div>
            <div style={{ alignSelf: 'flex-end', border: `1.5px solid ${C.gold}`, background: 'rgba(201,168,106,0.1)', padding: '14px 18px', borderRadius: 14, color: C.ivory, opacity: bubble(meet + 6), scale: `${0.9 + bubble(meet + 6) * 0.1}` }}>
              <div style={{ color: C.gold, fontWeight: 500 }}>✓ Reunião agendada</div>
              <div style={{ fontSize: 17, color: C.dim, marginTop: 4 }}>Amanhã · 10:00</div>
            </div>
          </div>
        </div>
      </Reveal>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ 7. Chamada */
const WhatsIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3.5 20.5l1.3-4.2A8.5 8.5 0 1 1 8 19.4z" />
    <path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1.2-1.4-2-1-1 .8a4 4 0 0 1-2.1-2.1l.8-1-1-2z" />
  </svg>
);

export const Chamada: React.FC<SceneProps> = ({ voice }) => {
  const frame = useCurrentFrame();
  const text = SCENES[6].text;
  const b = (p: string) => beat(text, p, voice);
  const btnAt = b('Toque');
  const btn = interpolate(frame, [btnAt, btnAt + 24], [0, 1], { ...clamp, easing: EASE });
  const pulse = frame > btnAt + 24 ? 1 + Math.sin((frame - btnAt) / 9) * 0.025 : 1;
  const ring = ((frame - btnAt) % 45) / 45;
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', paddingBottom: 60 }}>
      <Voice id={SCENES[6].id} />
      <Eyebrow at={0}>Uma conversa de 30 minutos</Eyebrow>
      <div style={{ textAlign: 'center', marginTop: 34 }}>
        <Words at={b('Vamos')} segs={[{ t: 'Vamos tirar as medidas' }]} style={{ ...big, fontSize: 124 }} />
        <Words at={b('do seu')} segs={[{ t: 'do seu negócio?', gold: true }]} style={{ ...big, fontSize: 124 }} />
      </div>
      <div style={{ position: 'relative', marginTop: 70, opacity: btn, translate: `0px ${(1 - btn) * 40}px` }}>
        {frame > btnAt + 24 && (
          <div style={{ position: 'absolute', inset: 0, border: `2px solid ${C.gold}`, opacity: 1 - ring, scale: `${1 + ring * 0.25}` }} />
        )}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            background: C.gold,
            color: C.noir,
            padding: '30px 64px',
            fontFamily: sans,
            fontSize: 34,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            fontWeight: 500,
            scale: `${pulse}`,
          }}
        >
          <WhatsIcon size={42} color={C.noir} />
          Falar no WhatsApp
        </div>
      </div>
      <Reveal at={btnAt + 14} style={{ marginTop: 30 }}>
        <div style={{ fontFamily: sans, fontSize: 36, color: C.ivory, letterSpacing: '0.06em' }}>(11) 97029-9201</div>
      </Reveal>
      <Reveal at={b('Em trinta')} style={{ position: 'absolute', bottom: 90, display: 'flex', alignItems: 'center', gap: 18 }}>
        <Monogram at={b('Em trinta')} size={56} />
        <Wordmark size={40} />
      </Reveal>
    </AbsoluteFill>
  );
};
