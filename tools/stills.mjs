// Bundles once, then renders a list of frames as JPEG stills for visual QA.
// usage: node tools/stills.mjs <outDir> <frame> [frame...]  (composition EP01-Opening)
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';

const [outDir, ...frames] = process.argv.slice(2);
const browserExecutable = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
const serveUrl = await bundle({ entryPoint: path.resolve('src/index.ts'), publicDir: path.resolve('public') });
const inputProps = { muted: true };
const composition = await selectComposition({ serveUrl, id: 'EP01-Film', inputProps, browserExecutable });
fs.mkdirSync(outDir, { recursive: true });
for (const f of frames.map(Number)) {
  const output = path.join(outDir, `f${String(f).padStart(4, '0')}.jpg`);
  await renderStill({ serveUrl, composition, frame: f, output, inputProps, imageFormat: 'jpeg', jpegQuality: 88, browserExecutable });
  console.log('still', output);
}
