// Assembles the data explorer (demo/) into a static folder that works under any sub-path, by default
// dist/demo/uz-open-data/ (served at wonmor.io/demo/uz-open-data/). The datasets are copied unchanged into
// data/ next to the page, with the ODbL notice, so the explorer always shows exactly what the repository holds.
//   node tools/build-demo.mjs                 -> dist/demo/uz-open-data/
//   DEMO_OUT=/some/dir node tools/build-demo.mjs
import { cpSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync } from 'node:fs';
import { join, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
export const OUT = process.env.DEMO_OUT || join(ROOT, 'dist', 'demo', 'uz-open-data');
const FS = join(ROOT, 'node_modules', '@fontsource-variable');
const FONTS = {
  'sans-latin': 'hanken-grotesk/files/hanken-grotesk-latin-wght-normal',
  'sans-latin-ext': 'hanken-grotesk/files/hanken-grotesk-latin-ext-wght-normal',
  'sans-cyrillic': 'onest/files/onest-cyrillic-wght-normal',
  'sans-cyrillic-ext': 'onest/files/onest-cyrillic-ext-wght-normal',
  'serif-latin': 'source-serif-4/files/source-serif-4-latin-wght-normal',
  'serif-latin-ext': 'source-serif-4/files/source-serif-4-latin-ext-wght-normal',
  'mono-latin': 'jetbrains-mono/files/jetbrains-mono-latin-wght-normal',
  'mono-cyrillic': 'jetbrains-mono/files/jetbrains-mono-cyrillic-wght-normal',
};
const DATA = ['mosques/mosques.geojson', 'mosques/query.overpassql', 'mosques/LICENSE-ODbL.md', 'alphabet/cyrillic-to-latin-2026.csv'];
const FORBIDDEN = [/(?<![\d.])\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(?![\d.])/, /\+998[\s-]?\d{2}/, /\b(ghp|gho|github_pat)_[A-Za-z0-9_]{20,}/, /-----BEGIN [A-Z ]*PRIVATE KEY-----/];

export function build(out = OUT) {
  rmSync(out, { recursive: true, force: true });
  for (const d of ['data', 'fonts']) mkdirSync(join(out, d), { recursive: true });
  for (const f of readdirSync(join(ROOT, 'demo'))) cpSync(join(ROOT, 'demo', f), join(out, f));
  for (const f of DATA) cpSync(join(ROOT, f), join(out, 'data', f.split('/').pop()));
  for (const [name, src] of Object.entries(FONTS)) cpSync(join(FS, src + '.woff2'), join(out, 'fonts', name + '.woff2'));
  for (const pkg of ['hanken-grotesk', 'onest', 'source-serif-4', 'jetbrains-mono']) cpSync(join(FS, pkg, 'LICENSE'), join(out, 'fonts', `LICENSE-${pkg}.txt`));

  let bytes = 0;
  const errors = [];
  (function walk(d) {
    for (const n of readdirSync(d)) {
      const p = join(d, n);
      const st = statSync(p);
      if (st.isDirectory()) { walk(p); continue; }
      bytes += st.size;
      if (['.html', '.js', '.css'].includes(extname(p))) {
        const src = readFileSync(p, 'utf8');
        for (const re of FORBIDDEN) { const m = src.match(re); if (m) errors.push(`${p}: forbidden text "${m[0]}"`); }
      }
    }
  })(out);
  if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
  return { out, bytes };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === normalize(process.argv[1])) {
  const r = build();
  console.log(`demo built: ${r.out} (${(r.bytes / 1024).toFixed(0)} KB)`);
}
