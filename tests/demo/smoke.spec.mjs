import { test, expect } from '@playwright/test';

const ROUTES = [
  ['', 'Open data for Uzbekistan'],
  ['map', 'Map'],
  ['table', 'Table'],
  ['m/node/1827042138', 'Bahovuddin Naqshband'],
  ['regions', 'Regions'],
  ['quality', 'Data quality'],
  ['pinned', 'Pinned'],
  ['alphabet', 'Cyrillic'],
  ['about', 'Sources'],
];

function watch(page) {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  return errors;
}

for (const [hash, title] of ROUTES) {
  test(`route #/${hash} renders`, async ({ page }) => {
    const errors = watch(page);
    await page.goto('./#/' + hash);
    await expect(page.locator('html')).toHaveAttribute('data-ready', '1');
    await expect(page.locator('main h1')).toContainText(title);
    await expect(page.locator('.demo-pill')).toBeVisible();
    expect(errors).toEqual([]);
  });
}

test('overview counts match the dataset', async ({ page }) => {
  await page.goto('./#/');
  await expect(page.locator('main')).toContainText('2,289');
  await expect(page.locator('main')).toContainText('1,511');
});

test('table filters, sorts and pages through every feature', async ({ page }) => {
  await page.goto('./#/table');
  await expect(page.locator('main .lede')).toContainText('2,289 of 2,289');
  await expect(page.locator('tbody tr')).toHaveCount(50);
  await page.click('[data-ft="relation"]');
  await expect(page.locator('main .lede')).toContainText('38 of 2,289');
  await page.click('[data-ft="all"]');
  await page.selectOption('#fs', 'cyrillic');
  await expect(page.locator('main .lede')).toContainText('of 2,289');
  await page.selectOption('#fs', 'all');
  await page.fill('#q', 'Naqshband');
  await expect(page.locator('tbody')).toContainText('Bahovuddin');
  await page.fill('#q', 'zzzz-no-such-mosque');
  await expect(page.locator('.empty')).toContainText('No feature matches');
});

test('map selects a point and shows nearest mosques', async ({ page }) => {
  await page.goto('./#/map');
  await page.locator('#side [data-sel]', { hasText: 'Bahovuddin' }).click();
  await expect(page.locator('#side')).toContainText('Nearest');
  await page.click('#dens');
  await expect(page.locator('#dens')).toHaveAttribute('aria-pressed', 'true');
});

test('pins can be added, noted and removed; reload resets them', async ({ page }) => {
  await page.goto('./#/pinned');
  await expect(page.locator('[data-unpin]')).toHaveCount(4);
  await page.goto('./#/m/node/1771088936');
  await page.click('#pin');
  await page.fill('#note', 'Visit after Asr');
  await page.goto('./#/pinned');
  await expect(page.locator('[data-unpin]')).toHaveCount(5);
  await expect(page.locator('main')).toContainText('Visit after Asr');
  await page.locator('[data-unpin]').first().click();
  await expect(page.locator('[data-unpin]')).toHaveCount(4);
  await page.click('#clr');
  await expect(page.locator('main')).toContainText('Nothing pinned');
  await page.reload();
  await expect(page.locator('[data-unpin]')).toHaveCount(4);
});

test('alphabet converter passes the bitg examples', async ({ page }) => {
  await page.goto('./#/alphabet');
  await expect(page.locator('.check.ok')).toHaveCount(9);
  await page.fill('#src', 'Тошкент шаҳри, ЎЗБЕКИСТОН, маъно, поезд');
  await expect(page.locator('#dst')).toHaveText('Toşkent şahri, ÖZBEKISTON, maʼno, poyezd');
  await page.click('[data-l="ц"]');
  await expect(page.locator('#ldetail')).toContainText('after a vowel');
});
