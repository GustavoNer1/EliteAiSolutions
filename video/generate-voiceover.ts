// Gera a narração de cada cena na ElevenLabs e salva em public/voz/.
// Uso: npm run voz   (lê ELEVENLABS_API_KEY do ambiente)
import { mkdirSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { SCENES, VOICE_ID } from './src/script.ts';

const key =
  process.env.ELEVENLABS_API_KEY ||
  execSync(`powershell.exe -NoProfile -Command "[Environment]::GetEnvironmentVariable('ELEVENLABS_API_KEY','User')"`)
    .toString()
    .trim();
if (!key) throw new Error('Defina a variável ELEVENLABS_API_KEY.');

mkdirSync('public/voz', { recursive: true });

for (let i = 0; i < SCENES.length; i++) {
  const scene = SCENES[i];
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
    method: 'POST',
    headers: { 'xi-api-key': key, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
    body: JSON.stringify({
      text: scene.text,
      model_id: 'eleven_multilingual_v2',
      // contexto das falas vizinhas para manter a entonação contínua
      previous_text: SCENES[i - 1]?.text,
      next_text: SCENES[i + 1]?.text,
      voice_settings: { stability: 0.55, similarity_boost: 0.8, style: 0.25, use_speaker_boost: true },
    }),
  });
  if (!res.ok) throw new Error(`${scene.id}: ${res.status} ${await res.text()}`);
  writeFileSync(`public/voz/${scene.id}.mp3`, Buffer.from(await res.arrayBuffer()));
  console.log('ok', scene.id);
}
