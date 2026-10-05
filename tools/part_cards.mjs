// Renders the transparent PartCard overlays (intro + outro for every part) as PNG.
// usage: node tools/part_cards.mjs <outDir>
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';

const outDir = process.argv[2] ?? 'out/cards';
const browserExecutable = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
const shots = JSON.parse(fs.readFileSync('src/timeline/ep01.shots.json', 'utf8'));
const serveUrl = await bundle({ entryPoint: path.resolve('src/index.ts'), publicDir: path.resolve('public') });
fs.mkdirSync(outDir, { recursive: true });
for (const p of shots.parts) {
  for (const kind of ['intro', 'outro']) {
    const inputProps = { part: p.id, kind };
    const composition = await selectComposition({ serveUrl, id: 'PartCard', inputProps, browserExecutable });
    const output = path.join(outDir, `part${p.id}_${kind}.png`);
    await renderStill({ serveUrl, composition, frame: 0, output, inputProps, imageFormat: 'png', browserExecutable });
    console.log('card', output);
  }
}
