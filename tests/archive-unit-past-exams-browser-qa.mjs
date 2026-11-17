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

// 단원별 기출은 단원 x 단계 표 한 화면이다(2026-11-16). 옛 3단계 화면(세분 출제)은 없고, 옛 주소는 표로 열린다.
export async function runUnitPastExamsBrowserQA(tab, viewport, options = {}) {
  const baseUrl = options.baseUrl || 'http://127.0.0.1:8765';
  const hash = sessionHash();
  const result = {};
  const page = tab.playwright;
  const TABLE_WAIT = 90000; // 실제 아카이브는 자료 준비(메타·카탈로그 해석)에 시간이 걸린다.

  // 옛 주소(ready 없음, 옛 값 포함)도 표로 열리고 그 단원이 체크되며, 옛 값은 주소에서 지워진다.
  await tab.goto(`${baseUrl}/archive/unit-past-exams.html?grade=h1&unit=H22-C2-07&step=confirm&collection=1&mode=advanced&blueprint=%5B%5D#apmsess=${hash}`);
  await waitFor(tab, async () => (await page.locator('.ug-table').count()) === 1, TABLE_WAIT);
  result.legacyAddress = {
    checkedRows: await page.locator('.ug-row.is-checked').count(),
    url: await tab.url(),
    menu: await page.locator('.archive-sidebar, .archive-mobile-tabs').count(),
    oldScreen: await page.locator('#unit-stepper, .unit-back, .unit-grade-card, #unit-subunits, .unit-card').count(),
    fineLink: (await page.locator('body').innerText()).includes('세분 출제')
  };
  assert.equal(result.legacyAddress.checkedRows, 1);
  assert.ok(result.legacyAddress.menu > 0, '메뉴가 처음부터 있다');
  assert.equal(result.legacyAddress.oldScreen, 0);
  assert.equal(result.legacyAddress.fineLink, false);
  for (const key of ['unit=', 'step=', 'collection=', 'mode=', 'blueprint=']) assert.ok(!result.legacyAddress.url.includes(key), `${key} 는 주소에서 지워진다`);

  // 칸 고르기 -> 문제지 보기 -> 고치기(실제 시험지 미리보기)
  await page.locator('.ug-cell:not(.is-zero)').first().click();
  await page.evaluate(() => window.UnitPastExams.gridShowPapers());
  await waitFor(tab, async () => (await page.locator('.ug-paper').count()) >= 1);
  result.papers = {
    count: await page.locator('.ug-paper').count(),
    outputButtons: await page.getByRole('button', { name: /시험지$/ }).count(),
    assignButtons: await page.locator('.ug-assign').count()
  };
  assert.ok(result.papers.assignButtons >= 1);
  await page.getByRole('button', { name: /미리 보고 고치기/ }).first().click();
  await waitFor(tab, async () => (await page.locator('.unit-confirmation').count()) === 1);
  await waitFor(tab, async () => (await page.locator('#unit-preview-iframe').count()) === 1, 20000);
  result.confirmation = {
    summary: await page.locator('.unit-confirm-pane').innerText(),
    iframe: await page.locator('#unit-preview-iframe').count(),
    backButtons: await page.getByRole('button', { name: '권 목록으로', exact: true }).count(),
    assignButtons: await page.getByRole('button', { name: /학생에게 출제/ }).count()
  };
  assert.equal(result.confirmation.assignButtons, 1);
  assert.equal(result.confirmation.iframe, 1);
  assert.equal(result.confirmation.backButtons, 1);
  assert.equal(await page.locator('.fa-solid, .fa-regular').count(), 0, '옛 아이콘 폰트는 없다');
  await page.getByRole('button', { name: /일반 출력/ }).click();
  await waitFor(tab, async () => (await page.locator('#unit-status').innerText()).includes('준비 완료'), 20000);
  await page.getByRole('button', { name: '권 목록으로', exact: true }).click();
  await waitFor(tab, async () => (await page.locator('.ug-paper').count()) >= 1);

  // 출제: 화면 안 출제 패널이 열린다(주소에 assign=legacy가 있을 때만 옛 iframe).
  await page.locator('.ug-assign').first().click();
  await waitFor(tab, async () => (await page.locator('dialog[open]').count()) >= 1, 15000);
  result.assignPanel = { dialogs: await page.locator('dialog[open]').count() };
  await page.keyboard.press('Escape');

  // 작은 화면: 가로 넘침이 없다.
  for (const [width, key] of [[320, 'mobile320'], [390, 'mobile390'], [768, 'mobile768']]) {
    await viewport.set({ width, height: 844 });
    result[key] = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
    }));
    assert.equal(result[key].overflow, false, `${width}px 가로 넘침`);
  }
  await viewport.reset();

  // 로딩 실패 안내는 새 모양이고 "다시 시도"만 있다(옛 화면으로 보내는 링크 없음).
  await tab.goto(`${baseUrl}/tests/fixtures/unit-past-exams-fallback.html`);
  await waitFor(tab, async () => (await page.locator('.unit-fallback-actions button').count()) === 1);
  result.fallback = await page.locator('.unit-fallback-actions').innerText();
  assert.equal(result.fallback.trim(), '다시 시도');
  assert.equal(await page.locator('.unit-fallback-actions a').count(), 0);

  result.logs = await tab.dev.logs({ levels: ['error', 'warn'], limit: 20 });
  assert.equal(Array.from(result.logs).length, 0);
  return result;
}
