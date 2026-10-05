import { Config } from '@remotion/cli/config';
import fs from 'node:fs';

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(95);
Config.setOverwriteOutput(true);
Config.setConcurrency(4);
// codec/CRF/pixel format are passed per render (tools/render_ep01.sh) so that
// audio-only renders (--codec=wav) stay possible.

// Cloud containers ship a pre-installed headless Chromium; use it instead of downloading one.
const preinstalled = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
if (fs.existsSync(preinstalled)) {
  Config.setBrowserExecutable(preinstalled);
}
