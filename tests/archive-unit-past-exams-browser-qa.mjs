import assert from 'node:assert/strict';

function sessionHash() {
  const payload = JSON.stringify({ role: 'teacher', login_id: 'browser-qa', name: '브라우저 검수' });
  return encodeURIComponent(Buffer.from(payload, 'utf8').toString('base64'));
}

async function waitFor(tab, predicate, timeout = 3000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    if (await predicate()) return;
    await tab.playwright.waitForTimeout(80);
  }
  throw new Error('브라우저 상태 대기 시간이 초과되었습니다.');
}

export async function runUnitPastExamsBrowserQA(tab, viewport, options = {}) {
  const baseUrl = options.baseUrl || 'http://127.0.0.1:8765';
  const hash = sessionHash();
  const result = {};
  const pageUrl = `${baseUrl}/archive/unit-past-exams.html?grade=h1#apmsess=${hash}`;

  await tab.goto(pageUrl);
  await waitFor(tab, async () => (await tab.playwright.locator('.unit-card').count()) > 0);
  const page = tab.playwright;
  const catalogCards = page.locator('.unit-card');
  const initialPressed = await catalogCards.nth(0).getAttribute('aria-pressed');
  assert.equal(initialPressed, 'false');
  await catalogCards.nth(0).press('Enter');
  await waitFor(tab, async () => (await tab.url()).includes('unit=H22-C-01'));
  const activePressed = await page.locator('.unit-card').nth(0).getAttribute('aria-pressed');
  result.cardAccessibility = { initialPressed, activePressed };
  assert.equal(activePressed, 'true');
  await page.waitForTimeout(120);

  const high = page.locator('input[name="unit-difficulty"][value="상"]');
  await high.check();
  await page.waitForTimeout(100);
  await tab.back();
  await waitFor(tab, async () => (await page.locator('input[name="unit-difficulty"]:checked').count()) === 0);
  result.sameUnitPopstate = {
    checked: await page.locator('input[name="unit-difficulty"]:checked').count(),
    report: await page.locator('#unit-selection-report').innerText()
  };
  assert.equal(result.sameUnitPopstate.checked, 0);

  await page.locator('input[name="unit-mode"][value="advanced"]').check();
  await page.waitForTimeout(80);
  if (await page.locator('.unit-blueprint-row').count() < 2) {
    await page.getByRole('button', { name: /조합 추가/ }).click();
  }
  const numbers = page.locator('.unit-blueprint-row input[type="number"]');
  await numbers.nth(0).fill('80');
  await numbers.nth(1).fill('80');
  await page.getByRole('button', { name: /조건으로 문제지 만들기/ }).click();
  await page.waitForTimeout(120);
  result.limit = await page.locator('#unit-selection-report').innerText();
  assert.match(result.limit, /최대 80문항/);
  const advancedUrl = await tab.url();
  await tab.reload();
  await waitFor(tab, async () => (await page.locator('.unit-blueprint-row').count()) === 2);
  result.blueprintRestore = {
    url: advancedUrl,
    rows: await page.locator('.unit-blueprint-row').count(),
    values: [await numbers.nth(0).getAttribute('value'), await numbers.nth(1).getAttribute('value')]
  };
  assert.deepEqual(result.blueprintRestore.values, ['80', '80']);

  await viewport.set({ width: 320, height: 844 });
  result.mobile320 = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
  }));
  assert.equal(result.mobile320.overflow, false);
  await viewport.set({ width: 768, height: 844 });
  result.mobile768 = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
  }));
  assert.equal(result.mobile768.overflow, false);
  await viewport.reset();

  await tab.goto(`${baseUrl}/tests/fixtures/unit-past-exams-fallback.html`);
  await waitFor(tab, async () => (await page.locator('.unit-fallback-actions a').count()) === 2);
  result.fallback = await page.locator('.unit-fallback-actions a').evaluateAll(anchors => anchors.map(anchor => anchor.getAttribute('href')));
  assert.equal(Array.from(result.fallback).join('|'), 'index.html|mixer.html');

  await tab.goto(`${baseUrl}/tests/fixtures/unit-past-exams-multi-paper.html?grade=h1#apmsess=${hash}`);
  await waitFor(tab, async () => (await page.locator('#multi-ready[data-ready="true"]').count()) === 1);
  await waitFor(tab, async () => (await page.locator('#unit-content .unit-card').count()) > 0);
  await page.locator('#unit-content .unit-card').nth(0).click();
  await page.getByRole('button', { name: /조건으로 문제지 만들기/ }).click();
  await waitFor(tab, async () => (await page.locator('.unit-generated-paper').count()) === 2);
  result.multiPaper = {
    papers: await page.locator('.unit-generated-paper').count(),
    buttons: await page.locator('.unit-generated-paper button').count(),
    onclicks: await page.locator('.unit-generated-paper button').evaluateAll(buttons => buttons.map(button => button.getAttribute('onclick')))
  };
  assert.equal(result.multiPaper.papers, 2);
  assert.equal(result.multiPaper.buttons, 4);
  assert.ok(result.multiPaper.onclicks.some(value => value.includes('generated-1')));
  assert.ok(result.multiPaper.onclicks.some(value => value.includes('generated-2')));
  await page.locator('.unit-generated-paper').nth(0).getByRole('button', { name: /일반 출력/ }).click();
  await waitFor(tab, async () => (await page.locator('#unit-status').innerText()).includes('준비 완료'), 8000);
  result.multiPaper.printStatus = await page.locator('#unit-status').innerText();
  await page.locator('.unit-generated-paper').nth(1).getByRole('button', { name: /반 학생에게 출제/ }).click();
  await waitFor(tab, async () => (await tab.url()).includes('unitPastAssign='), 8000);
  result.multiPaper.assignUrl = await tab.url();

  result.logs = await tab.dev.logs({ levels: ['error', 'warn'], limit: 20 });
  assert.equal(Array.from(result.logs).length, 0);
  return result;
}
