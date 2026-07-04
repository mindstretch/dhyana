// Assembles the native web bundle for Capacitor from the deployed web app.
// Copies public/app.html -> native/www/index.html and injects the absolute API
// origin (so /api/checkin calls reach the live serverless functions), plus assets.
//
//   node native/build.mjs
//
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'fs';

const ORIGIN = 'https://dhyanaflow.com';
mkdirSync('native/www', { recursive: true });

let html = readFileSync('public/app.html', 'utf8');
html = html.replace('</head>', `<script>window.DHYANA_API_BASE='${ORIGIN}';</script>\n</head>`);
writeFileSync('native/www/index.html', html);

for (const f of ['528hz.mp3', 'manifest.json', 'icon-180.png', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'icon-1024.png']) {
  try { copyFileSync(`public/${f}`, `native/www/${f}`); } catch (e) { /* optional */ }
}

console.log('Built native/www — run: npx cap sync ios');
