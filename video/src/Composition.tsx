import { ALL_FORMATS, Input, UrlSource } from 'mediabunny';
import { CalculateMetadataFunction, Composition, staticFile } from 'remotion';
import { EliteVideo, EliteVideoProps } from './EliteVideo';
import { SCENES } from './script';
import { FPS, totalDuration } from './theme';

const getAudioDuration = async (src: string) => {
  const input = new Input({ formats: ALL_FORMATS, source: new UrlSource(src) });
  const seconds = await input.computeDuration();
  input.dispose();
  return seconds;
};

// Mede a narração de cada cena e ajusta a duração do vídeo a ela
const calculateMetadata: CalculateMetadataFunction<EliteVideoProps> = async ({ props }) => {
  const seconds = await Promise.all(SCENES.map((s) => getAudioDuration(staticFile(`voz/${s.id}.mp3`))));
  const voice = seconds.map((s) => Math.ceil(s * FPS));
  return { durationInFrames: totalDuration(voice), props: { ...props, voice } };
};

export const MyComposition = () => {
  return (
    <Composition
      id="EliteAI"
      component={EliteVideo}
      durationInFrames={2100}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{ voice: [133, 397, 283, 167, 518, 307, 282] }}
      calculateMetadata={calculateMetadata}
    />
  );
};
