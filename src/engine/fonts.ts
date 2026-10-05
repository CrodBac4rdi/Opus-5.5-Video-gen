import { continueRender, delayRender, staticFile } from 'remotion';

export const FONT_HUD = '"Chakra Petch", "DejaVu Sans", sans-serif';
export const FONT_TITLE = '"Cinzel", "DejaVu Serif", serif';

const FACES: [family: string, file: string, weight: string][] = [
  ['Chakra Petch', 'chakra-petch-latin-500-normal.woff2', '500'],
  ['Chakra Petch', 'chakra-petch-latin-600-normal.woff2', '600'],
  ['Chakra Petch', 'chakra-petch-latin-700-normal.woff2', '700'],
  ['Cinzel', 'cinzel-latin-600-normal.woff2', '600'],
  ['Cinzel', 'cinzel-latin-800-normal.woff2', '800'],
];

let started = false;

/** Loads the bundled OFL fonts once and blocks rendering until they are ready. */
export const ensureFonts = () => {
  if (started || typeof document === 'undefined') return;
  started = true;
  const handle = delayRender('Loading Aethelgard fonts');
  Promise.all(
    FACES.map(([family, file, weight]) =>
      new FontFace(family, `url(${staticFile(`fonts/${file}`)}) format('woff2')`, { weight })
        .load()
        .then((f) => document.fonts.add(f)),
    ),
  )
    .then(() => continueRender(handle))
    .catch((err) => {
      console.error('Font loading failed', err);
      continueRender(handle);
    });
};
