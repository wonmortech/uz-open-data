// README screenshots from the data explorer: builds it, serves it under the wonmor.io CSP, visits every page
// (with a point selected, filters set and a letter opened where it matters) and writes 1440x900 JPEGs plus
// one phone shot to docs/screenshots/. Run again whenever the data or the explorer changes:
//   npm run site:screenshots
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';
import { build } from './build-demo.mjs';
import { start, BASE } from './serve-demo.mjs';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const DIR = join(ROOT, 'docs', 'screenshots');
mkdirSync(DIR, { recursive: true });
build();
const server = await start(4291);
const url = `http://127.0.0.1:4291${BASE}`;
const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM_PATH || undefined });

async function shot(name, hash, act, opts = {}) {
  const ctx = await browser.newContext({ viewport: opts.phone ? { width: 390, height: 844 } : { width: 1440, height: 900 }, deviceScaleFactor: opts.phone ? 2 : 1, colorScheme: opts.dark ? 'dark' : 'light' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto(url + '#' + hash);
  await page.waitForSelector('html[data-ready="1"]');
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  if (act) await act(page);
  await page.waitForTimeout(450);
  await page.screenshot({ path: join(DIR, name + '.jpg'), type: 'jpeg', quality: 78 });
  if (errors.length) throw new Error(name + ': ' + errors.join('; '));
  console.log('shot', name);
  await ctx.close();
}

try {
  await shot('overview', '/');
  await shot('map', '/map', async (p) => {
    await p.locator('#side [data-sel]', { hasText: 'Bahovuddin' }).click();
    await p.click('[data-preset="Fergana Valley"]'); await p.click('#zfit');
  });
  await shot('map-density', '/map', async (p) => { await p.click('#dens'); });
  await shot('table', '/table', async (p) => { await p.fill('#q', 'masjid'); await p.selectOption('#fr', 'Bukhara'); });
  await shot('detail', '/m/node/1827042138');
  await shot('regions', '/regions');
  await shot('quality', '/quality');
  await shot('pinned', '/pinned');
  await shot('alphabet', '/alphabet', async (p) => { await p.click('[data-l="е"]'); await p.locator('#ldetail').scrollIntoViewIfNeeded(); await p.evaluate(() => window.scrollBy(0, -380)); });
  await shot('converter', '/alphabet', async (p) => { await p.click('[data-ex="Ғафур Ғулом кўчаси"]'); });
  await shot('map-dark', '/map', async (p) => { await p.click('[data-preset="Tashkent"]'); }, { dark: true });
  await shot('phone', '/map', async (p) => { await p.click('[data-preset="Fergana Valley"]'); }, { phone: true });
} finally {
  await browser.close();
  server.close();
}
