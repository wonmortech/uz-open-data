// Serves the built explorer at /demo/uz-open-data/ under the Content-Security-Policy wonmor.io sends, so
// screenshots and smoke tests run under the same rules as the live page.
//   node tools/build-demo.mjs && node tools/serve-demo.mjs   -> http://127.0.0.1:4290/demo/uz-open-data/
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, normalize, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { OUT } from './build-demo.mjs';

export const BASE = '/demo/uz-open-data/';
const CSP = "default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; media-src 'self'; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'";
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8', '.json': 'application/json', '.geojson': 'application/geo+json', '.csv': 'text/csv; charset=utf-8', '.overpassql': 'text/plain; charset=utf-8', '.md': 'text/plain; charset=utf-8' };

export function start(port = Number(process.env.PORT) || 4290, host = '127.0.0.1') {
  const root = OUT.endsWith(sep) ? OUT : OUT + sep;
  const server = createServer(async (req, res) => {
    res.setHeader('Content-Security-Policy', CSP);
    res.setHeader('X-Content-Type-Options', 'nosniff');
    const path = new URL(req.url, 'http://x').pathname;
    if (path === '/' || path === BASE.slice(0, -1)) { res.writeHead(302, { Location: BASE }); res.end(); return; }
    if (!path.startsWith(BASE)) { res.writeHead(404); res.end('not found'); return; }
    let rel = decodeURIComponent(path.slice(BASE.length)) || 'index.html';
    if (rel.endsWith('/')) rel += 'index.html';
    const file = normalize(join(root, rel));
    if (!file.startsWith(root)) { res.writeHead(403); res.end(); return; }
    try {
      await stat(file);
      res.writeHead(200, { 'Content-Type': TYPES[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
      res.end(await readFile(file));
    } catch {
      res.writeHead(404); res.end('not found');
    }
  });
  return new Promise((ok) => server.listen(port, host, () => ok(server)));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === normalize(process.argv[1])) {
  const s = await start();
  console.log(`demo on http://127.0.0.1:${s.address().port}${BASE}`);
}
