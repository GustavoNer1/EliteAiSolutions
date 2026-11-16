import React from 'react';
import { linearTiming, TransitionSeries } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { AbsoluteFill } from 'remotion';
import { Captions } from './Captions';
import { Backdrop, Particles, Vignette } from './components';
import { Causa, Chamada, Futuro, Gancho, Problema, Solucao, Virada } from './scenes';
import { sceneDurations, TRANSITION } from './theme';

export type EliteVideoProps = { voice: number[] };

export const EliteVideo: React.FC<EliteVideoProps> = ({ voice }) => {
  const d = sceneDurations(voice);
  return (
    <AbsoluteFill>
      <Backdrop />
      <Particles />
      <TransitionSeries name="Cenas">
        <TransitionSeries.Sequence name="1 · Gancho" durationInFrames={d[0]}>
          <Gancho voice={voice[0]} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: TRANSITION })} />
        <TransitionSeries.Sequence name="2 · Problema" durationInFrames={d[1]}>
          <Problema voice={voice[1]} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: TRANSITION })} />
        <TransitionSeries.Sequence name="3 · Causa" durationInFrames={d[2]}>
          <Causa voice={voice[2]} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: TRANSITION })} />
        <TransitionSeries.Sequence name="4 · Virada" durationInFrames={d[3]}>
          <Virada voice={voice[3]} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: TRANSITION })} />
        <TransitionSeries.Sequence name="5 · Solução" durationInFrames={d[4]}>
          <Solucao voice={voice[4]} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: TRANSITION })} />
        <TransitionSeries.Sequence name="6 · Futuro" durationInFrames={d[5]}>
          <Futuro voice={voice[5]} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: TRANSITION })} />
        <TransitionSeries.Sequence name="7 · Chamada" durationInFrames={d[6]}>
          <Chamada voice={voice[6]} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      <Captions voice={voice} />
      <Vignette />
    </AbsoluteFill>
  );
};
