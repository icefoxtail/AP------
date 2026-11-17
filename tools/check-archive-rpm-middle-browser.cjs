'use strict';

const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

// Runs inside the existing finder checker's approved, local-only Chrome session.
// The sole fixture is its local teacher session. No catalog rows or metadata are
// replaced. The buildCatalog wrapper observes the actual page result unchanged.
module.exports = async function checkArchiveRpmMiddleBrowser({ send, run, wait, baseUrl, reportDir }) {
  const origin = new URL(baseUrl).origin;
  assert.ok(['127.0.0.1', 'localhost'].includes(new URL(origin).hostname), 'RPM QA requires a local static server');
  const directory = path.resolve(reportDir || '.tmp/rpm-middle-browser-ci');
  fs.mkdirSync(directory, { recursive: true });
  const report = {
    schemaVersion: 'RPM_MIDDLE_REAL_BROWSER_QA_V1', status: 'RUNNING', startedAt: new Date().toISOString(),
    dataSource: 'Unmodified runtime catalog and actual UnitPastExamsCore.buildCatalog results',
    fixture: 'Existing local-only teacher session; no exercise fixtures',
    screenshots: [], layouts: [], workspace: [], unitViews: [], chapterViews: [], finderCurrentParents: [], pageDiagnostics: [], dataGaps: [],
    preview: { status: 'NOT_EXERCISED_HERE', reason: 'The existing output browser CI separately verifies preview rendering.' },
  };
  const evaluate = (fn, argument) => run(`(${fn.toString()})(${JSON.stringify(argument)})`);
  let initScriptId;
  const snapshot = async name => {
    const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    const file = `${name}.png`;
    fs.writeFileSync(path.join(directory, file), Buffer.from(shot.data, 'base64'));
    report.screenshots.push(file);
  };
  const navigate = async (relative, ready) => {
    const previousDiagnostics = await evaluate(() => window.__rpmMiddleBrowserQA ? {
      url: location.href, runtimeErrors: window.__rpmMiddleBrowserQA.errors, blockedWrites: window.__rpmMiddleBrowserQA.blockedWrites,
    } : null);
    if (previousDiagnostics) report.pageDiagnostics.push(previousDiagnostics);
    const previous = await run('window.__rpmMiddleBrowserQA?.documentToken || ""');
    await send('Page.navigate', { url: new URL(relative, origin).href });
    await wait(`window.__rpmMiddleBrowserQA?.documentToken && window.__rpmMiddleBrowserQA.documentToken !== ${JSON.stringify(previous)} && (${ready})`, relative);
  };
  const layout = async name => {
    for (const width of [1440, 390]) {
      await send('Emulation.setDeviceMetricsOverride', { width, height: width === 390 ? 844 : 960, deviceScaleFactor: 1, mobile: width === 390 });
      await run('new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))');
      const value = await evaluate(() => ({
        viewport: innerWidth, clientWidth: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth,
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
        offenders: [...document.querySelectorAll('main,section,button,input,select,.unit-chip-list,.scope-list')]
          .filter(el => { const r = el.getBoundingClientRect(); return r.width && r.right > innerWidth + 2; })
          .slice(0, 6).map(el => ({ tag: el.tagName, id: el.id, className: el.className })),
      }));
      report.layouts.push({ name, width, ...value });
      await snapshot(`${name}-${width}`);
      assert.equal(value.viewport, width, `${name} CSS viewport at ${width}`);
      assert.ok(value.clientWidth <= value.viewport && value.viewport - value.clientWidth <= 32, `${name} scrollbar-aware layout width at ${width}`);
      assert.equal(value.overflow, false, `${name} horizontal overflow at ${width}: ${JSON.stringify(value)}`);
    }
    await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 960, deviceScaleFactor: 1, mobile: false });
  };
  // 단원별 기출은 단원 x 단계 표 한 화면이다: 학년 버튼, 과목 버튼, 단원 행. 표를 그리기 전의 뼈대(.ug-loading)가 아니라 자료가 준비된 표를 기다린다.
  const TABLE_READY = '!!window.UnitPastExams && !!document.querySelector(".ug-grades") && !document.querySelector(".ug-loading")';
  const openGrade = async grade => {
    await navigate('/archive/unit-past-exams.html', TABLE_READY);
    await evaluate(id => {
      const button = [...document.querySelectorAll('.ug-grade')].find(el => el.dataset.profile === id);
      if (!button) throw Error(`Grade button absent: ${id}`);
      button.click();
    }, grade);
    await wait(`window.__rpmMiddleBrowserQA.catalogs[${JSON.stringify(grade)}] && document.querySelector('.ug-grade[aria-pressed="true"]')?.dataset.profile === ${JSON.stringify(grade)} && !!document.querySelector('.ug-row')`, `${grade} real unit rows`);
    const view = await evaluate(id => {
      const T = window.ArchiveRpmMiddleToc;
      const catalog = window.__rpmMiddleBrowserQA.catalogs[id];
      // Rows are listed per course button (1학기 / 2학기); the courses together are the grade's units in order.
      const readRows = () => [...document.querySelectorAll('.ug-row')].map(row => {
        const input = row.querySelector('input[data-focus^="k:"]');
        const cells = [...row.querySelectorAll('.ug-cell')];
        return { key: input.dataset.focus.slice(2), label: row.querySelector('.ug-check span').textContent.trim(),
          disabled: cells.every(cell => cell.classList.contains('is-zero')), text: row.innerText };
      });
      const courseCount = document.querySelectorAll('.ug-courses .ug-seg').length;
      const cards = [];
      if (courseCount < 2) cards.push(...readRows());
      else for (let index = 0; index < courseCount; index += 1) {
        document.querySelectorAll('.ug-courses .ug-seg')[index].click();
        cards.push(...readRows());
      }
      return { grade: id, url: location.href,
        expected: T.units(id.toUpperCase()).map(row => ({ key: row.key, label: row.L1 })),
        cards,
        units: catalog.units.map(row => ({ key: row.key, label: row.name, count: row.count, selectableCount: row.selectableCount })),
      };
    }, grade);
    assert.deepEqual(view.cards.map(row => ({ key: row.key, label: row.label })), view.expected, `${grade} actual L1 row order`);
    report.unitViews.push(view);
    await layout(`unit-${grade}`);
    return view;
  };
  // 단원 행을 체크한다(예전 단원 카드 누르기). 자료가 없는 단원이면 null.
  const openUnit = async (grade, unitKey) => {
    const opened = await evaluate(key => {
      const buttons = () => [...document.querySelectorAll('.ug-courses .ug-seg')];
      const find = () => [...document.querySelectorAll('.ug-row')].find(row => row.querySelector('input[data-focus^="k:"]')?.dataset.focus === `k:${key}`);
      for (let index = 0; index < Math.max(1, buttons().length); index += 1) {
        if (buttons().length > 1) buttons()[index].click();
        const row = find();
        if (!row) continue;
        if (row.querySelectorAll('.ug-cell:not(.is-zero)').length === 0) return false;
        if (!row.classList.contains('is-checked')) row.querySelector('input').click();
        return !!find().classList.contains('is-checked');
      }
      throw Error(`Unit row absent: ${key}`);
    }, unitKey);
    if (!opened) {
      report.dataGaps.push({ grade, unitKey, status: 'NO_SELECTABLE_UNIT_RECORDS' });
      return null;
    }
    // 소단원(챕터) 선택 칸은 옛 3단계 화면과 함께 사라졌다. 다음 묶음(표 안 소단원 행)이 돌아오기 전까지는 같은 자료를 코어 계산으로 확인한다.
    const view = await evaluate(({ grade, unitKey }) => {
      const U = window.UnitPastExamsCore, T = window.ArchiveRpmMiddleToc;
      const unit = window.__rpmMiddleBrowserQA.catalogs[grade].units.find(row => row.key === unitKey);
      const options = U.getSubUnitOptions(unit.records);
      const parents = T.parents(grade.toUpperCase()).filter(row => row.unitKey === unitKey).map(parent => {
        const records = U.filterUnitRecords(unit.records, { subUnitKeys: [parent.key], includeUnclassified: true });
        return { parentKey: parent.key, label: parent.L2, count: records.length,
          questionUids: [...new Set(records.map(U.getQuestionUid))].sort(),
          uiPresent: options.some(row => row.key === parent.key) };
      });
      return { grade, unitKey, url: location.href, checkedRows: [...document.querySelectorAll('.ug-row.is-checked input')].map(el => el.dataset.focus.slice(2)),
        options: options.map(row => ({ key: row.key, count: row.count })), parents };
    }, { grade, unitKey });
    assert.ok(view.checkedRows.includes(unitKey), `${grade} unit row is checked in the table`);
    for (const parent of view.parents) {
      assert.equal(parent.uiPresent, parent.count > 0, `${parent.label}: chapter option must reflect real records`);
      assert.equal(parent.questionUids.length, parent.count, `${parent.label}: missing or duplicate real UID`);
      if (!parent.count) report.dataGaps.push({ grade, unitKey, parentKey: parent.parentKey, label: parent.label, status: 'NO_CURRENT_PARENT_RECORDS' });
    }
    report.chapterViews.push(view);
    return view;
  };

  try {
    const init = await send('Page.addScriptToEvaluateOnNewDocument', { source: `(${function () {
      const qa = window.__rpmMiddleBrowserQA = { documentToken: `${Date.now()}-${Math.random()}`, catalogs: {}, errors: [], blockedWrites: [] };
      try { localStorage.setItem('APMATH_SESSION', JSON.stringify({ id: 'local-read-only', role: 'teacher' })); } catch (_) {}
      window.addEventListener('error', event => { if (event.message) qa.errors.push(event.message); });
      window.addEventListener('unhandledrejection', event => qa.errors.push(String(event.reason?.message || event.reason)));
      const refuse = (method, url) => {
        if (['GET', 'HEAD'].includes(String(method || 'GET').toUpperCase())) return;
        qa.blockedWrites.push({ method: String(method), url: String(url).split('?')[0] });
        throw Error('RPM browser QA blocks write requests');
      };
      const fetchOriginal = window.fetch;
      window.fetch = function (input, options = {}) { refuse(options.method || input?.method, input?.url || input); return fetchOriginal.apply(this, arguments); };
      const open = XMLHttpRequest.prototype.open, xhrSend = XMLHttpRequest.prototype.send;
      XMLHttpRequest.prototype.open = function (method, url) { this.__rpmQaRequest = { method, url }; return open.apply(this, arguments); };
      XMLHttpRequest.prototype.send = function () { refuse(this.__rpmQaRequest?.method, this.__rpmQaRequest?.url); return xhrSend.apply(this, arguments); };
      navigator.sendBeacon = function (url) { qa.blockedWrites.push({ method: 'BEACON', url: String(url).split('?')[0] }); return false; };
      let unitCore;
      Object.defineProperty(window, 'UnitPastExamsCore', { configurable: true, get: () => unitCore, set(value) {
        unitCore = value;
        const original = value?.buildCatalog;
        if (typeof original !== 'function') return;
        value.buildCatalog = function () {
          const result = original.apply(this, arguments);
          qa.catalogs[result.profile.id] = result;
          return result;
        };
      } });
    }.toString()})();` });
    initScriptId = init.identifier;
    await send('Network.enable');
    await send('Network.setBlockedURLs', { urls: ['*workers.dev/*', '*supabase.co/*'] });
    await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 960, deviceScaleFactor: 1, mobile: false });
    await navigate('/archive/workspace.html?view=compose', 'window.ARCHIVE2_FINAL_CATALOG?.records?.length && document.querySelector("[data-action=compose-grade]")');
    report.authority = await evaluate(() => {
      const T = window.ArchiveRpmMiddleToc, U = window.UnitPastExamsCore;
      return { unitCount: T.units().length, parentCount: T.parents().length, leafCount: T.authority.leafMappings.length,
        selectionCoreSharesHelper: U.MiddleToc === T, catalogCount: window.ARCHIVE2_FINAL_CATALOG.records.length,
        countsByBook: Object.fromEntries(['M1-1', 'M1-2', 'M2-1', 'M2-2', 'M3-1', 'M3-2'].map(book => [book, T.parents().filter(row => row.courseKey === book).length])),
        parents: T.parents().map(row => ({ key: row.key, unitKey: row.unitKey, L1: row.L1, L2: row.L2 })) };
    });
    assert.equal(report.authority.unitCount, 24); assert.equal(report.authority.parentCount, 54);
    assert.equal(report.authority.leafCount, 326); assert.equal(report.authority.selectionCoreSharesHelper, true);
    assert.deepEqual(report.authority.countsByBook, { 'M1-1': 9, 'M1-2': 9, 'M2-1': 10, 'M2-2': 10, 'M3-1': 9, 'M3-2': 7 });
    // Exercise the real finder with current parent names plus an existing UID.
    // The UID isolates the exam; it does not replace or inject any catalog row.
    await navigate('/archive/workspace.html?view=find', 'window.ARCHIVE2_FINAL_CATALOG?.records?.length && document.getElementById("finder-query")');
    const searchTargets = await evaluate(() => {
      const C = window.Archive2Core, U = window.UnitPastExamsCore;
      const catalog = window.ARCHIVE2_FINAL_CATALOG;
      const targets = new Map();
      for (const record of catalog.records) {
        if (!C.normalizeFile(record.sourceFile).startsWith('original/middle/') || !record.questionUid) continue;
        const resolved = U.resolveRpmParent(record);
        if (resolved.status !== 'EXACT' || targets.has(resolved.parent.grade)) continue;
        const examIndex = catalog.exams.findIndex(exam => C.normalizeFile(exam.file) === C.normalizeFile(record.sourceFile));
        if (examIndex < 0) continue;
        targets.set(resolved.parent.grade, { grade: resolved.parent.grade, examIndex,
          file: record.sourceFile, questionUid: record.questionUid, parentKey: resolved.parentKey,
          query: `${resolved.parent.L2} ${record.questionUid}` });
      }
      return [...targets.values()];
    });
    for (const target of searchTargets) {
      await evaluate(query => {
        document.getElementById('finder-query').value = query;
        document.querySelector('[data-action="finder-search"]').click();
      }, target.query);
      await wait(`!!document.querySelector('[data-action="source-toggle"][data-exam="${target.examIndex}"]')`, `${target.grade} current-parent finder result`);
      const selected = await evaluate(index => {
        const control = document.querySelector(`[data-action="source-toggle"][data-exam="${index}"]`);
        control.closest('details').open = true;
        control.click();
        return document.querySelector(`[data-action="source-toggle"][data-exam="${index}"]`)?.getAttribute('aria-pressed');
      }, target.examIndex);
      assert.equal(selected, 'true', `${target.grade} matching source can be selected`);
      report.finderCurrentParents.push({ ...target, status: 'PASS' });
    }
    for (const grade of ['중1', '중2', '중3']) if (!searchTargets.some(row => row.grade === grade))
      report.dataGaps.push({ grade, status: 'NO_CURRENT_PARENT_FINDER_RECORDS' });
    await snapshot('finder-current-parent-search');
    await navigate('/archive/workspace.html?view=compose', 'window.ARCHIVE2_FINAL_CATALOG?.records?.length && document.querySelector("[data-action=compose-grade]")');
    report.runtimeCatalogM1 = await evaluate(() => {
      const C = window.Archive2Core, U = window.UnitPastExamsCore, T = window.ArchiveRpmMiddleToc;
      const parents = T.parents('중1').filter(row => row.L1 === '기본 도형' && ['기본 도형', '작도와 합동'].includes(row.L2));
      const groups = new Map(parents.map(row => [row.key, { parentKey: row.key, label: row.L2, questionUids: [] }]));
      for (const record of window.ARCHIVE2_FINAL_CATALOG.records) {
        if (!C.normalizeFile(record.sourceFile).startsWith('original/middle/m1/') || !C.generalUseEligibility(record).ok) continue;
        const resolved = U.resolveRpmParent(record, 'm1');
        const group = groups.get(resolved.parentKey);
        if (resolved.status === 'EXACT' && group && record.questionUid) group.questionUids.push(record.questionUid);
      }
      return [...groups.values()].map(row => ({ ...row, questionUids: [...new Set(row.questionUids)].sort(),
        count: new Set(row.questionUids).size }));
    });
    for (const grade of ['중1', '중2', '중3']) {
      await evaluate(grade => document.querySelector(`[data-action="compose-grade"][data-grade="${grade}"]`).click(), grade);
      await wait(`document.querySelector('[data-action="compose-grade"][data-grade="${grade}"]')?.getAttribute('aria-pressed') === 'true'`, `${grade} workspace selection`);
      const value = await evaluate(grade => ({ grade,
        expectedUnits: window.ArchiveRpmMiddleToc.units(grade).map(row => ({ key: row.key, label: row.L1 })),
        unifiedUnits: window.Archive2UnifiedUnits.structure(grade).flatMap(group => group.units.map(row => ({ key: row.key, label: row.label }))),
        visibleScopes: [...document.querySelectorAll('[data-scope]')].map(el => ({ key: el.dataset.scope, label: el.closest('label').innerText,
          countText: el.closest('.scope-item')?.querySelector('small')?.textContent || '' })),
      }), grade);
      assert.deepEqual(value.unifiedUnits, value.expectedUnits, `${grade} workspace current L1 structure`);
      report.workspace.push(value);
      await layout(`workspace-${grade}`);
    }

    await openGrade('m1');
    const basicUnit = report.authority.parents.find(row => row.L1 === '기본 도형' && row.L2 === '작도와 합동').unitKey;
    const m1 = await openUnit('m1', basicUnit);
    if (report.runtimeCatalogM1.some(row => row.count > 0))
      assert.ok(m1, 'The live catalog has eligible M1 current-parent records, so the unit UI must open');
    if (m1) {
      const targets = m1.parents.filter(row => ['기본 도형', '작도와 합동'].includes(row.label));
      assert.equal(targets.length, 2);
      for (const reference of report.runtimeCatalogM1) {
        const actual = targets.find(row => row.parentKey === reference.parentKey);
        assert.ok(actual, `Current parent missing from M1 UI authority: ${reference.label}`);
        if (reference.count > 0) assert.ok(actual.count > 0 && actual.uiPresent,
          `${reference.label}: live original catalog has ${reference.count} eligible records but the actual unit UI lost the parent`);
      }
      assert.equal(targets[0].questionUids.some(uid => targets[1].questionUids.includes(uid)), false, 'Basic and construction pools must have distinct real UIDs');
      report.m1DistinctPools = { status: targets.every(row => row.count > 0) ? 'PASS' : 'PARTIAL_EMPTY_PARENT', parents: targets };
      // 옛 세분 출제 주소(챕터·난이도·모아뽑기 값이 붙은 즐겨찾기)는 표 화면으로 열려 그 단원이 체크되고, 옛 값은 주소에서 지워진다.
      const keys = targets.filter(row => row.uiPresent).map(row => row.parentKey).sort();
      const legacy = new URL('/archive/unit-past-exams.html', origin);
      legacy.searchParams.set('grade', 'm1'); legacy.searchParams.set('unit', basicUnit); legacy.searchParams.set('step', 'confirm');
      legacy.searchParams.set('mode', 'advanced'); legacy.searchParams.set('collection', '1');
      if (keys.length) legacy.searchParams.set('subUnit', JSON.stringify(keys));
      await navigate(legacy.pathname + legacy.search, TABLE_READY + ' && !!document.querySelector(".ug-row.is-checked")');
      const reopened = await evaluate(() => ({ search: location.search, menu: !!document.querySelector('.archive-sidebar'),
        checked: [...document.querySelectorAll('.ug-row.is-checked input')].map(el => el.dataset.focus.slice(2)),
        oldScreen: !!document.querySelector('#unit-stepper, .unit-back, .unit-grade-card, #unit-subunits'),
        fineLink: /세분 출제/.test(document.body.innerText) }));
      assert.ok(reopened.checked.includes(basicUnit), 'The old address opens the table with its unit checked');
      assert.equal(reopened.menu, true, 'The left menu is there');
      assert.equal(reopened.oldScreen || reopened.fineLink, false, 'No old screen or 세분 출제 link');
      const params = new URLSearchParams(reopened.search);
      for (const key of ['unit', 'step', 'mode', 'collection', 'subUnit']) assert.equal(params.has(key), false, `old parameter ${key} is cleaned from the address`);
      assert.equal(params.get('grade'), 'm1');
      report.urlRoundTrip = { status: 'PASS_OLD_LINK_OPENS_TABLE', reopened };
      await snapshot('m1-old-link-table');
      await layout('m1-old-link-table');
    }
    for (const [grade, unitLabels] of [['m2', ['일차함수', '삼각형의 성질', '사각형의 성질']], ['m3', ['실수와 그 연산', '다항식의 곱셈과 인수분해', '원의 성질']]]) {
      for (const label of unitLabels) {
        const view = await openGrade(grade);
        const unit = view.expected.find(row => row.label === label);
        assert.ok(unit, `${grade} ${label} current unit exists`);
        const chapters = await openUnit(grade, unit.key);
        if (chapters) await layout(`${grade}-${unit.key.toLowerCase()}-chapters`);
      }
    }
    report.status = report.dataGaps.length ? 'PASS_WITH_REAL_DATA_GAPS' : 'PASS';
    console.log('RPM_MIDDLE_REAL_CHROME_PASS ' + JSON.stringify({ status: report.status, units: 24, parents: 54, dataGaps: report.dataGaps, reportDir: directory }));
    return report;
  } catch (error) {
    report.status = 'FAIL'; report.error = { message: error.message, stack: error.stack };
    try { await snapshot('failure'); } catch (captureError) { report.screenshotError = captureError.message; }
    throw error;
  } finally {
    try { report.lastPage = await evaluate(() => ({ url: location.href, status: document.getElementById('unit-status')?.textContent || '',
      runtimeErrors: window.__rpmMiddleBrowserQA?.errors || [], blockedWrites: window.__rpmMiddleBrowserQA?.blockedWrites || [] })); } catch (_) {}
    if (report.lastPage) report.pageDiagnostics.push(report.lastPage);
    report.finishedAt = new Date().toISOString();
    fs.writeFileSync(path.join(directory, 'rpm-middle-browser-report.json'), JSON.stringify(report, null, 2) + '\n');
    if (initScriptId) await send('Page.removeScriptToEvaluateOnNewDocument', { identifier: initScriptId }).catch(() => {});
    await send('Network.setBlockedURLs', { urls: [] }).catch(() => {});
    await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 960, deviceScaleFactor: 1, mobile: false }).catch(() => {});
  }
};
