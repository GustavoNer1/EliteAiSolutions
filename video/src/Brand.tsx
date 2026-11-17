// Imagens estáticas da marca (logo e capa do Perfil da Empresa no Google).
// Gerar: npx remotion still Logo ../assets/brand/logo-perfil.png
//        npx remotion still Capa ../assets/brand/capa-perfil.png
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C, sans, serif } from './theme';

const BG = `radial-gradient(circle at 50% 45%, #1c1812 0%, ${C.noir} 62%)`;

const Diamond: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <path d="M50 4 L96 50 L50 96 L4 50 Z" stroke={C.gold} strokeWidth={1.6} />
    <path d="M50 13 L87 50 L50 87 L13 50 Z" stroke={C.gold} strokeWidth={0.8} strokeDasharray="3 3" opacity={0.7} />
    <text x="50" y="63" textAnchor="middle" fontFamily={serif} fontSize={38} fill={C.gold}>
      E
    </text>
  </svg>
);


export const Logo: React.FC = () => (
  <AbsoluteFill style={{ background: BG, alignItems: 'center', justifyContent: 'center' }}>
    
    <Diamond size={520} />
  </AbsoluteFill>
);

export const Capa: React.FC = () => (
  <AbsoluteFill style={{ background: BG, alignItems: 'center', justifyContent: 'center' }}>
    
    <div style={{ display: 'flex', alignItems: 'center', gap: 44 }}>
      <Diamond size={190} />
      <div>
        <div style={{ fontFamily: serif, fontWeight: 400, fontSize: 112, color: C.ivory, lineHeight: 1, letterSpacing: '0.01em' }}>
          Elite <span style={{ fontStyle: 'italic', color: C.gold }}>AI</span> Solutions
        </div>
        <div style={{ height: 1, background: C.gold, opacity: 0.5, margin: '34px 0 28px' }} />
        <div style={{ fontFamily: sans, fontWeight: 300, fontSize: 34, color: C.dim, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          Automação · IA · Sistemas sob medida
        </div>
      </div>
    </div>
    <div style={{ position: 'absolute', bottom: 56, fontFamily: sans, fontWeight: 300, fontSize: 26, color: C.bronze, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
      Jundiaí · Campinas · Atibaia · Alphaville
    </div>
  </AbsoluteFill>
);
