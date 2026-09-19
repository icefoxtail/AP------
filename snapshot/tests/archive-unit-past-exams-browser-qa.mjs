import assert from 'node:assert/strict';

function sessionHash() {
  const payload = JSON.stringify({ role: 'teacher', login_id: 'browser-qa', name: '브라우저 검수' });
  return encodeURIComponent(Buffer.from(payload, 'utf8').toString('base64'));
}

async function waitFor(tab, predicate, timeout = 4000) {
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
  const page = tab.playwright;

  await tab.goto(`${baseUrl}/archive/unit-past-exams.html?grade=h1#apmsess=${hash}`);
  await waitFor(tab, async () => (await page.locator('.unit-card').count()) > 0);
  const firstCard = page.locator('.unit-card').nth(0);
  const initialPressed = await firstCard.getAttribute('aria-pressed');
  assert.equal(initialPressed, 'false');
  await firstCard.press('Enter');
  await waitFor(tab, async () => (await page.locator('.unit-step.is-active').innerText()).includes('구성'));
  assert.equal(await page.locator('#unit-subunits').count(), 1);
  assert.equal(await page.locator('#unit-difficulty').count(), 1);
  assert.equal(await page.locator('.unit-collection').count(), 0);

  await page.locator('.unit-step').nth(0).click();
  await waitFor(tab, async () => (await page.locator('.unit-card').count()) > 0);
  const activePressed = await page.locator('.unit-card').nth(0).getAttribute('aria-pressed');
  result.cardAccessibility = { initialPressed, activePressed };
  assert.equal(activePressed, 'true');
  await page.locator('.unit-card').nth(0).click();

  const high = page.locator('input[name="unit-difficulty"][value="상"]');
  await high.check();
  await waitFor(tab, async () => (await tab.url()).includes('difficulty='));
  await tab.back();
  await waitFor(tab, async () => (await page.locator('input[name="unit-difficulty"]:checked').count()) === 0);
  result.sameUnitPopstate = {
    checked: await page.locator('input[name="unit-difficulty"]:checked').count(),
    summary: await page.locator('#unit-filter-summary').innerText()
  };

  await page.locator('details.unit-advanced-panel summary').click();
  await page.locator('input[name="unit-mode"][value="advanced"]').check();
  if (await page.locator('.unit-blueprint-row').count() < 2) {
    await page.getByRole('button', { name: /조합 추가/ }).click();
  }
  const numbers = page.locator('.unit-blueprint-row input[type="number"]');
  await numbers.nth(0).fill('80');
  await numbers.nth(1).fill('80');
  await page.getByRole('button', { name: /미리보기로 이동/ }).click();
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

  const schoolUrl = new URL(`${baseUrl}/archive/unit-past-exams.html`);
  schoolUrl.searchParams.set('grade', 'h2');
  schoolUrl.searchParams.set('unit', 'H22-MI1-04');
  schoolUrl.searchParams.set('step', 'source');
  schoolUrl.searchParams.set('collection', '1');
  schoolUrl.searchParams.set('collectionYearMode', 'exact');
  schoolUrl.searchParams.set('collectionYear', '2025');
  schoolUrl.hash = `apmsess=${hash}`;
  await tab.goto(schoolUrl.toString());
  await waitFor(tab, async () => (await page.locator('.unit-source-fields').count()) === 1);
  assert.equal(await page.locator('#unit-subunits').count(), 0);
  assert.equal(await page.locator('#unit-difficulty').count(), 0);

  await page.locator('#unit-collection-semester').selectOption('2');
  await waitFor(tab, async () => (await tab.url()).includes('collectionSemester=2'));
  await page.locator('#unit-collection-exam-type').selectOption('final');
  await waitFor(tab, async () => (await tab.url()).includes('collectionExamType=final'));
  await page.locator('#unit-collection-school-search').fill('순천');
  const searchedSchools = await page.locator('.unit-school-choice').evaluateAll(labels => labels.filter(label => !label.hidden).map(label => label.textContent));
  assert.ok(searchedSchools.length > 0);
  assert.ok(searchedSchools.every(label => label.includes('순천')));
  await page.getByRole('button', { name: /전체 선택/ }).click();
  result.collectionSchoolTools = { selectedAll: await page.locator('input[name="unit-school"]:checked').count() };
  assert.ok(result.collectionSchoolTools.selectedAll > 0);
  await page.getByRole('button', { name: /선택 해제/ }).click();
  assert.equal(await page.locator('input[name="unit-school"]:checked').count(), 0);

  await page.getByRole('button', { name: /구성으로 이동/ }).click();
  await waitFor(tab, async () => (await page.locator('#unit-subunits').count()) === 1);
  result.unifiedConfiguration = {
    subunitControls: await page.locator('#unit-subunits').count(),
    difficultyControls: await page.locator('#unit-difficulty').count(),
    sourceFields: await page.locator('.unit-source-fields').count()
  };
  assert.deepEqual(result.unifiedConfiguration, { subunitControls: 1, difficultyControls: 1, sourceFields: 0 });
  await page.getByRole('button', { name: /미리보기로 이동/ }).click();
  await waitFor(tab, async () => (await page.locator('.unit-confirmation').count()) === 1);
  await waitFor(tab, async () => (await page.locator('#unit-preview-iframe').count()) === 1, 8000);
  result.confirmation = {
    summary: await page.locator('.unit-confirm-pane').innerText(),
    iframe: await page.locator('#unit-preview-iframe').count(),
    editButtons: await page.getByRole('button', { name: '구성 수정', exact: true }).count()
  };
  assert.equal(result.confirmation.iframe, 1);
  assert.equal(result.confirmation.editButtons, 1);
  await page.getByRole('button', { name: /일반 출력/ }).click();
  await waitFor(tab, async () => (await page.locator('#unit-status').innerText()).includes('준비 완료'), 8000);

  await tab.goto(`${baseUrl}/tests/fixtures/unit-past-exams-fallback.html`);
  await waitFor(tab, async () => (await page.locator('.unit-fallback-actions a').count()) === 2);
  result.fallback = await page.locator('.unit-fallback-actions a').evaluateAll(anchors => anchors.map(anchor => anchor.getAttribute('href')));
  assert.equal(Array.from(result.fallback).join('|'), 'index.html|mixer.html');

  await tab.goto(`${baseUrl}/tests/fixtures/unit-past-exams-multi-paper.html?grade=h1#apmsess=${hash}`);
  await waitFor(tab, async () => (await page.locator('#multi-ready[data-ready="true"]').count()) === 1);
  await waitFor(tab, async () => (await page.locator('#unit-content .unit-card').count()) > 0);
  await page.locator('#unit-content .unit-card').nth(0).click();
  await page.getByRole('button', { name: /미리보기로 이동/ }).click();
  await waitFor(tab, async () => (await page.locator('.unit-preview-pager').count()) === 1);
  const firstTitle = await page.locator('.unit-preview-title strong').innerText();
  await page.getByRole('button', { name: '다음 문제지' }).click();
  const secondTitle = await page.locator('.unit-preview-title strong').innerText();
  result.multiPaper = { pager: await page.locator('.unit-preview-pager').innerText(), firstTitle, secondTitle };
  assert.notEqual(firstTitle, secondTitle);
  await page.getByRole('button', { name: /학생에게 출제/ }).click();
  await waitFor(tab, async () => (await tab.url()).includes('unitPastAssign='), 8000);
  result.assignUrl = await tab.url();

  result.logs = await tab.dev.logs({ levels: ['error', 'warn'], limit: 20 });
  assert.equal(Array.from(result.logs).length, 0);
  return result;
}
