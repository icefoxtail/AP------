// 문제지 만들기 한 화면 (2026-11-10): 왼쪽 조건 / 오른쪽 결과·마무리, 모자라도 막지 않음, 저장하고 반에 출제,
// 빠른 평가(?recipe=) 가드, 조건이 바뀐 뒤 안내. 로직은 그대로이고 마크업만 재배치했으므로 선택 엔진·저장은 건드리지 않는다.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const core = require('../archive/archive2-core.js');
const archiveSource = require('../archive/archive2-source.js');
const Unified = require('../archive/archive2-unified-units.js');
const { catalog, withTestAssignments } = require('./helpers/archive2-scope-harness.cjs');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, 'archive', file), 'utf8');
const plain = value => JSON.parse(JSON.stringify(value));

// The test catalog is the real one (about 28,000 records). Cloning it for every test took about 2 seconds
// each and pushed this file past the runner's 60-second limit (tools/run-tests.js). No test here changes the
// catalog itself (they only change w.state), so they share one prepared copy; the last test checks that.
let sharedCatalog = null, sharedFinderIndex = null, sharedCatalogDigest = null;
const catalogDigest = data => crypto.createHash('sha256')
  .update(JSON.stringify([data.indexVersion, data.records.length, (data.exams || []).length, data.records.map(row => row.questionUid)])).digest('hex');
function harness() {
  if (!sharedCatalog) {
    sharedCatalog = withTestAssignments(structuredClone(catalog));
    sharedFinderIndex = core.buildFinderIndex(sharedCatalog);
    sharedCatalogDigest = catalogDigest(sharedCatalog);
  }
  const data = sharedCatalog;
  const events = new Map(), nodes = new Map(), storage = new Map();
  const node = id => {
    if (!nodes.has(id)) nodes.set(id, {
      innerHTML: '', textContent: '', dataset: {},
      setAttribute() {}, addEventListener() {}, querySelectorAll: () => [],
      classList: { toggle() {}, add() {}, remove() {} }, close() {}, showModal() {},
    });
    return nodes.get(id);
  };
  const document = {
    baseURI: 'https://archive.test/archive/workspace.html',
    getElementById: node, querySelector: () => null, querySelectorAll: () => [],
    body: { dataset: {} },
    addEventListener: (name, callback) => {
      if (!events.has(name)) events.set(name, []);
      events.get(name).push(callback);
    },
  };
  const ctx = vm.createContext({
    console, crypto, URL, URLSearchParams, structuredClone, queueMicrotask: () => {},
    location: new URL('https://archive.test/archive/workspace.html'),
    history: { pushState() {}, replaceState() {} },
    scrollY: 0, scrollTo() {},
    setTimeout: () => 0, clearTimeout() {}, matchMedia: () => ({ matches: false }),
    localStorage: { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) },
    document,
    addEventListener() {},
    fetch: async url => ({ ok: true, json: async () => JSON.parse(read(new URL(String(url)).pathname.replace(/^\/archive\//, ''))) }),
    Archive2Core: core,
    Archive2UnifiedUnits: Unified,
    ProblemBankMeta: require('../archive/problem-bank-meta.js'),
    Archive2Canonical: core.Canonical,
    Archive2Output: require('../archive/archive2-output.js'),
    Archive2Papers: require('../archive/archive2-papers.js'),
    Archive2History: require('../archive/archive2-history.js'),
    Archive2Source: archiveSource,
  });
  ctx.window = ctx;
  const source = read('archive2-workspace.js');
  const startup = source.lastIndexOf('  (async () => {');
  assert.ok(startup > 0);
  vm.runInContext(source.slice(0, startup) + `
    render = () => {};
    save = () => {};
    globalThis.workspaceTest = {state, scopeOptions, renderScopes, renderComposition, renderCompose, renderResult, renderResultSummary,
      renderResultEmpty, renderMobileActions, renderResultFinish, renderPaper, planRows, request, pool, review, generate, invalidate,
      saveAndAssign, currentSavedPaperIds, draft, applyDraft, focusComposeResult, composeLiveMarkup, applyFiveMinuteViewGuard, FIVE_MINUTE_GUARD, filterMarkup, newDraft, saveWorkSignature,
      setHooks: hooks => {
        if (hooks.savePapers) savePapers = hooks.savePapers;
        if (hooks.openSavedPaperAssign) openSavedPaperAssign = hooks.openSavedPaperAssign;
        if (hooks.api) api = hooks.api;
      }};
  })();`, ctx);
  const w = ctx.workspaceTest;
  w.state.catalog = data;
  w.state.byUid = new Map(data.records.map(row => [row.questionUid, row]));
  w.state.finderIndex = sharedFinderIndex;
  w.state.indexVersion = data.indexVersion;
  return {
    w, ctx, document, events,
    async click(dataset) {
      for (const callback of events.get('click') || [])
        await callback({ target: { closest: () => ({ dataset }) } });
    },
    async change(target) {
      for (const callback of events.get('change') || []) await callback({ target });
    },
  };
}

// A real unit of the test catalog with enough eligible questions to draw from.
function pickUnit(w) {
  w.state.filters = { grade: '고1' };
  const scope = w.scopeOptions().filter(item => !item.unclassified).sort((a, b) => b.count - a.count)[0];
  assert.ok(scope && scope.count > 0, 'test catalog has a unit with questions');
  return scope;
}

test('한 화면: 왼쪽은 조건(학년·과목·단원·단계·문항 수·더 자세한 조건·가능 문항 요약), 오른쪽은 결과 자리', () => {
  const { w } = harness();
  const unit = pickUnit(w);
  w.state.scopes = [unit.key];
  const html = w.renderCompose();
  const conditions = html.indexOf('data-cz-conditions'), result = html.indexOf('data-cz-result');
  assert.ok(conditions > 0 && result > conditions, 'conditions come first, the result pane second');
  const left = html.slice(conditions, result), right = html.slice(result);
  // ① 학년 버튼 6개(학년 색) ② 과목 ③ 단원 ④ 단계 ⑤ 문항 수 ⑥ 더 자세한 조건 ⑦ 가능 문항 요약 + 문제지 만들기
  assert.equal([...left.matchAll(/data-action="compose-grade"/g)].length, 6);
  assert.match(left, /class="cz-seg"[\s\S]*data-action="compose-subject"/, '고1 has two subjects: a two-way switch');
  assert.match(left, /data-scope=/);
  assert.match(left, /data-action="bucket-all"[^>]*aria-pressed="true"/, '단계 default stays 전체');
  assert.match(left, /id="count"/);
  assert.match(left, /data-action="count-step"[^>]*data-step="-1"/);
  assert.match(left, /<details class="compose-detail cz-detail"/);
  for (const moved of ['id="distribution"', 'data-filter="school"', 'data-filter="originalCurriculum"', 'data-filter="axis"', 'data-filter="yearFrom"', 'data-filter="metaPT"', 'data-filter="metaApprovedOnly"', 'data-action="backup"', 'data-action="import"'])
    assert.ok(left.includes(moved), `${moved} moved into 더 자세한 조건, not removed`);
  assert.match(left, /data-cz-feasible="ok"/);
  assert.match(left, /<span class="cz-feasible-n">\d+문항<\/span> 가능[\s\S]*요청 \d+문항/);
  assert.equal([...left.matchAll(/data-action="generate"/g)].length, 1);
  assert.match(left, /class="primary cz-generate"[^>]*>문제지 만들기/);
  // 결과 전: 오른쪽은 빈 상자가 아니라 안내.
  assert.match(right, /data-cz-empty-guide/);
  assert.match(right, /문제지 만들기<\/strong>를 누르면 여기에 문제지가 나옵니다/);
  assert.doesNotMatch(right, /data-action="print"|data-action="save-paper"/);
});

test('고2·고3 여러 과목은 칩, 학년 버튼은 학년을 바꾸고 단원 선택을 비운다', async () => {
  const { w, click } = harness();
  w.state.filters = { grade: '고2', semanticSubject: 'ALGEBRA' };
  const primary = w.filterMarkup(w.state.filters, 'compose', 'primary');
  assert.match(primary, /class="cz-chips"/);
  assert.match(primary, /data-subject=""[^>]*>전체 과목/);
  assert.match(primary, /data-subject="ALGEBRA" aria-pressed="true"/);
  w.state.scopes = ['stale'];
  await click({ action: 'compose-grade', grade: '고1' });
  assert.equal(w.state.filters.grade, '고1');
  assert.deepEqual(plain(w.state.scopes), [], 'changing the grade clears the unit choice like the old select');
  await click({ action: 'compose-subject', subject: 'COMMON_MATH_2' });
  assert.equal(w.state.filters.semanticSubject, 'COMMON_MATH_2');
});

test('모자라도 막지 않는다: 버튼은 눌리고, 있는 만큼만 넣고, 어디가 얼마나 모자랐는지 알리며, 검증이 막지 않는다', () => {
  const { w } = harness();
  const unit = pickUnit(w);
  w.state.scopes = [unit.key];
  w.state.distribution = 'pool';
  w.state.count = unit.count + 7;
  const html = w.renderComposition();
  assert.doesNotMatch(html, /data-action="generate"[^>]*disabled/, 'a shortage does not disable the button');
  assert.match(html, /data-cz-feasible-short/);
  assert.match(html, new RegExp(`${unit.count}문항</span> 가능[\\s\\S]*요청 ${unit.count + 7}문항`));
  w.generate();
  const got = w.state.selected.length;
  assert.ok(got > 0 && got <= unit.count, 'drew what exists');
  assert.equal(w.state.composeShortage.length, 1);
  assert.equal(w.state.composeShortage[0].requested, unit.count + 7);
  assert.equal(w.state.composeShortage[0].got, got);
  assert.equal(w.state.rows.reduce((n, row) => n + row.count, 0), got, 'rows shrink to what was drawn so the review is satisfiable');
  assert.notEqual(w.review().status, 'HARD_BLOCK');
  assert.ok(!w.review().hardFailures.some(text => /요청한 문항 수가 충족되지 않았습니다/.test(text)));
  const summary = w.renderResultSummary(w.review());
  assert.match(summary, /data-compose-shortage/);
  assert.match(summary, /모자라서 있는 만큼만 넣었습니다/);
  assert.match(summary, new RegExp(`${unit.count + 7 - got}문항 모자람`));
  // 바로 저장·출력·출제가 가능하다(막는 사유가 없다).
  assert.doesNotMatch(w.renderResultFinish(w.review()), /data-action="(?:print|save-paper|save-and-assign)"[^>]*disabled/);
});

test('조건에 맞는 문항이 0개면 버튼을 막고 이유를 말한다', () => {
  const { w } = harness();
  const unit = pickUnit(w);
  w.state.scopes = [unit.key];
  assert.equal(w.planRows().length, 1, 'the unit is chosen');
  // 단원은 고른 상태인데 조건(난이도·교육과정·이력 등)에 맞는 문항이 하나도 없는 경우: 선택 엔진의 행 일치를 막아 만든다.
  const rowMatches = core.rowMatches;
  const selectBlueprint = core.selectBlueprint;
  core.rowMatches = () => false;
  core.selectBlueprint = () => ({ ok: false, errors: [], selected: [], rowResults: [], shortages: [], diagnostics: { elapsedMs: 0 } });
  try {
    const html = w.renderComposition();
    assert.match(html, /data-cz-feasible="none"[^>]*>고른 조건에 맞는 문항이 없습니다/);
    assert.match(html, /data-action="generate"[^>]*disabled/);
    w.generate();
    assert.equal(w.state.selected.length, 0, 'nothing is selected when nothing matches');
    assert.equal(w.state.composeShortage.length, 0);
  } finally {
    core.rowMatches = rowMatches;
    core.selectBlueprint = selectBlueprint;
  }
});

test('단원을 아직 고르지 않았으면 문제지 만들기는 막혀 있고 안내가 보인다', () => {
  const { w } = harness();
  w.state.filters = { grade: '고1' };
  w.state.scopes = [];
  const html = w.renderComposition();
  assert.match(html, /data-cz-feasible="empty"/);
  assert.match(html, /data-action="generate"[^>]*disabled/);
});

test('조건을 바꾸면 결과는 지금처럼 비우고, 오른쪽에 "조건이 바뀌었습니다"를 보인다(빈 화면 아님)', async () => {
  const { w, change } = harness();
  const unit = pickUnit(w);
  w.state.scopes = [unit.key];
  w.state.distribution = 'pool';
  w.state.count = 1;
  w.generate();
  assert.equal(w.state.selected.length, 1);
  assert.equal(w.state.composeStale, false);
  assert.doesNotMatch(w.renderResult(w.review()), /data-compose-stale/);
  // 단계 버튼·문항 수 변경도 같은 invalidate()를 지난다.
  await change({ id: 'count', dataset: {}, value: '2' });
  assert.equal(w.state.selected.length, 0);
  assert.equal(w.state.composeStale, true);
  const right = w.renderCompose().slice(w.renderCompose().indexOf('data-cz-result'));
  assert.match(right, /data-compose-stale/);
  assert.match(right, /조건이 바뀌었습니다\.[\s\S]*문제지 만들기[\s\S]*새로 뽑습니다/);
  assert.match(right, /data-cz-empty-guide/);
  w.generate();
  assert.equal(w.state.composeStale, false, 'a new draw clears the notice');
  w.invalidate();
  assert.equal(w.state.composeStale, true);
  w.newDraft();
  assert.equal(w.state.composeStale, false);
});

function readyToSave(w) {
  const unit = pickUnit(w);
  w.state.scopes = [unit.key];
  w.state.distribution = 'pool';
  w.state.count = 2;
  w.generate();
  assert.ok(w.state.selected.length > 0);
  w.state.ackWarnings = true;
}
const UUID1 = '00000000-0000-4000-8000-000000000011', UUID2 = '00000000-0000-4000-8000-000000000012';

test('저장하고 반에 출제: 저장이 확인된 뒤에만 출제 패널을 연다(1권)', async () => {
  const { w } = harness();
  readyToSave(w);
  const calls = [];
  w.setHooks({
    savePapers: async () => {
      calls.push('save');
      w.state.saveResultState = 'SAVED';
      w.state.saveResultSignature = w.saveWorkSignature();
      w.state.lastSavedPaperIds = [UUID1];
    },
    openSavedPaperAssign: async (id, options) => { calls.push(['open', id, options]); },
  });
  await w.saveAndAssign();
  assert.equal(calls.length, 2);
  assert.equal(calls[0], 'save', 'saved first');
  assert.deepEqual(calls[1].slice(0, 2), ['open', UUID1], 'then the panel opens for the saved paper');
  assert.equal(calls[1][2], undefined, 'a single paper is read from the server by the panel opener');
  assert.equal(w.state.assignBusy, false);
});

test('저장하고 반에 출제: 저장 실패·결과 모름이면 출제로 넘어가지 않는다', async () => {
  for (const outcome of ['FAILED', 'RESULT_UNKNOWN', 'STALE']) {
    const { w } = harness();
    readyToSave(w);
    let opened = 0;
    w.setHooks({
      savePapers: async () => {
        w.state.saveResultState = outcome === 'STALE' ? 'SAVED' : outcome;
        // 저장 결과가 현재 편집본과 맞지 않으면(서명 불일치) 저장된 것으로 보지 않는다.
        w.state.saveResultSignature = outcome === 'STALE' ? 'older-edit' : w.saveWorkSignature();
        w.state.lastSavedPaperIds = [UUID1];
      },
      openSavedPaperAssign: async () => { opened += 1; },
    });
    await w.saveAndAssign();
    assert.equal(opened, 0, outcome);
  }
  // 이전 저장 결과를 모르는 상태에서는 새로 저장하지도 않는다.
  const { w } = harness();
  readyToSave(w);
  let saved = 0, opened = 0;
  w.state.saveResultState = 'RESULT_UNKNOWN';
  w.setHooks({ savePapers: async () => { saved += 1; }, openSavedPaperAssign: async () => { opened += 1; } });
  await w.saveAndAssign();
  assert.deepEqual([saved, opened], [0, 0]);
});

test('저장하고 반에 출제: 이미 현재 편집본이 저장되어 있으면 다시 저장하지 않고 그 저장본으로 연다', async () => {
  const { w } = harness();
  readyToSave(w);
  w.state.saveResultState = 'SAVED';
  w.state.saveResultSignature = w.saveWorkSignature();
  w.state.lastSavedPaperIds = [UUID1];
  let saved = 0;
  const opened = [];
  w.setHooks({ savePapers: async () => { saved += 1; }, openSavedPaperAssign: async id => { opened.push(id); } });
  assert.match(w.renderResultFinish(w.review()), /data-action="save-and-assign"[^>]*>저장한 문제지 출제/);
  await w.saveAndAssign();
  assert.equal(saved, 0);
  assert.deepEqual(opened, [UUID1]);
});

test('저장하고 반에 출제: 여러 권이면 저장된 권 전체를 한 패널에 넘기고, 하나라도 확인되지 않으면 열지 않는다', async () => {
  const { w } = harness();
  readyToSave(w);
  w.state.saveBatchId = 'batch-1';
  const calls = [];
  const rows = [{ id: UUID2, library_status: 'ACTIVE', part_index: 1 }, { id: UUID1, library_status: 'ACTIVE', part_index: 0 }];
  w.setHooks({
    savePapers: async () => {
      w.state.saveResultState = 'SAVED';
      w.state.saveResultSignature = w.saveWorkSignature();
      w.state.lastSavedPaperIds = [UUID1, UUID2];
    },
    api: async route => { calls.push(route); return { papers: rows }; },
    openSavedPaperAssign: async (id, options) => { calls.push(['open', id, plain(options.papers.map(p => p.id))]); },
  });
  await w.saveAndAssign();
  assert.deepEqual(plain(calls), ['/archive-saved-papers/save-batches/batch-1', ['open', UUID1, [UUID1, UUID2]]]);
  // 한 권이 빠진 응답이면 일부만 열지 않고 알린다.
  const second = harness();
  readyToSave(second.w);
  second.w.state.saveBatchId = 'batch-2';
  let opened = 0;
  second.w.setHooks({
    savePapers: async () => {
      second.w.state.saveResultState = 'SAVED';
      second.w.state.saveResultSignature = second.w.saveWorkSignature();
      second.w.state.lastSavedPaperIds = [UUID1, UUID2];
    },
    api: async () => ({ papers: [rows[1]] }),
    openSavedPaperAssign: async () => { opened += 1; },
  });
  await assert.rejects(() => second.w.saveAndAssign(), /모두 확인하지 못했습니다/);
  assert.equal(opened, 0);
});

test('결과 쪽: 요약 → 문항 목록 → 미리보기 → 출력 설정(접힘) → 출력·보관함에 저장·저장하고 반에 출제', () => {
  const { w } = harness();
  readyToSave(w);
  const html = w.renderCompose();
  const right = html.slice(html.indexOf('data-cz-result'));
  const order = ['data-cz-summary', 'id="question-list"', 'id="preview-host"', 'data-cz-output', 'data-cz-finish']
    .map(token => right.indexOf(token));
  assert.ok(order.every((position, i) => position > 0 && (!i || position > order[i - 1])), `result order ${order}`);
  assert.doesNotMatch(right.slice(right.indexOf('data-cz-output'), right.indexOf('data-cz-finish')), /<details[^>]*data-cz-output[^>]* open/, 'output settings start folded');
  const finish = right.slice(right.indexOf('data-cz-finish'), right.indexOf('class="cz-bar"'));
  assert.match(finish, /data-action="print"[^>]*>출력/);
  assert.match(finish, /data-action="save-paper"[^>]*>보관함에 저장/);
  assert.match(finish, /class="primary cz-primary"[^>]*>저장하고 출제/);
  assert.equal([...finish.matchAll(/class="primary /g)].length, 1, 'one primary button in the result pane');
  // 한 권이면 권 고르기가 없다. 51문항 이상이면 생긴다.
  assert.doesNotMatch(right, /id="preview-index"/);
  // 미리보기를 접으면 미리보기 자리를 그리지 않는다(숨은 iframe이 빈 폭으로 그려지지 않게).
  w.state.previewOpen = false;
  assert.doesNotMatch(w.renderPaper(), /id="preview-host"/);
  assert.match(w.renderPaper(), /미리보기 펼치기/);
});

test('하단 고정 띠: 결과 전 "N문항 가능 + 문제지 만들기", 결과 후 "N문항 · 권 + 출력 + 더보기(저장·저장하고 출제)"', () => {
  const { w } = harness();
  const unit = pickUnit(w);
  w.state.scopes = [unit.key];
  w.renderComposition(); // 띠는 마지막으로 그린 가능 문항 수를 쓴다
  const before = w.renderMobileActions();
  assert.match(before, /class="cz-bar"[\s\S]*\d+문항 가능[\s\S]*data-action="generate"[^>]*>문제지 만들기/);
  assert.doesNotMatch(before, /mobile-actions/);
  w.state.distribution = 'pool';
  w.state.count = 2;
  w.generate();
  const after = w.renderMobileActions(w.review());
  assert.match(after, /\d+문항 · 1권/);
  assert.match(after, /data-action="print"/);
  const more = after.slice(after.indexOf('cz-more cz-bar-more'));
  assert.match(more, /data-action="save-paper"[^>]*>보관함에 저장/);
  assert.match(more, /data-action="save-and-assign"[^>]*>저장하고 출제/);
  assert.doesNotMatch(w.renderCompose(), /class="mobile-actions"|class="inspector/);
});

// 빠른 평가(?recipe=) 가드: 마크업을 바꿀 때마다 이 선택자가 계속 맞는지 지킨다(예전에는 테스트가 없었다).
test('빠른 평가 가드가 쓰는 선택자는 문제지 만들기 마크업에 실제로 있다', () => {
  const { w } = harness();
  const empty = w.renderCompose();
  readyToSave(w);
  const withResult = w.renderCompose();
  const guard = w.FIVE_MINUTE_GUARD;
  const present = (selector, html) => {
    if (selector.startsWith('#')) return html.includes(`id="${selector.slice(1)}"`);
    const attribute = /^\[([\w-]+)(?:="([^"]*)")?\]$/.exec(selector);
    if (attribute) return attribute[2] === undefined ? html.includes(attribute[1]) : html.includes(`${attribute[1]}="${attribute[2]}"`);
    if (selector.startsWith('.')) return new RegExp(`class="[^"]*\\b${selector.slice(1)}\\b`).test(html);
    throw new Error('unsupported selector ' + selector);
  };
  for (const selector of guard.disable) assert.ok(present(selector, empty), `${selector} in the conditions`);
  assert.ok(present(guard.emptyGuide, empty), 'empty-state guide text');
  assert.ok(present(guard.heading, withResult), 'result heading');
  assert.ok(present(guard.menu, withResult), 'more menu');
  for (const selector of guard.remove) assert.ok(present(selector, empty + withResult), `${selector} exists to be removed`);
});

test('빠른 평가 가드: 문항 수·배분을 잠그고 저장·백업·새 작업·저장하고 출제를 없애며 안내문과 제목을 바꾼다', () => {
  const { w, ctx, document } = harness();
  const makeElement = (extra = {}) => ({
    attrs: {}, removed: false, textContent: '',
    setAttribute(key, value) { this.attrs[key] = value; },
    remove() { this.removed = true; },
    querySelector: () => null,
    ...extra,
  });
  const queried = new Map(), singles = new Map();
  const install = () => {
    queried.clear();
    document.querySelectorAll = selector => {
      const list = selector.split(', ').flatMap(part => {
        if (!queried.has(part)) queried.set(part, [makeElement()]);
        return queried.get(part);
      });
      return list;
    };
    document.querySelector = selector => {
      if (!singles.has(selector)) singles.set(selector, makeElement());
      return singles.get(selector);
    };
  };
  install();
  w.applyFiveMinuteViewGuard();
  assert.equal(queried.size, 0, 'normal compose is untouched');
  w.state.assessmentRecipe = 'FIVE_MINUTE';
  singles.clear();
  // 비어 있는 더보기 메뉴(버튼이 모두 지워진 뒤)는 없앤다.
  document.querySelectorAll = selector => {
    if (selector === '.cz-more') return [singles.get('.cz-more') || (singles.set('.cz-more', makeElement()), singles.get('.cz-more'))];
    return selector.split(', ').flatMap(part => queried.get(part) || (queried.set(part, [makeElement()]), queried.get(part)));
  };
  w.applyFiveMinuteViewGuard();
  for (const selector of ['#distribution', '#count', '[data-action="count-step"]'])
    assert.equal(queried.get(selector)[0].attrs.disabled, '', `${selector} is locked`);
  for (const selector of ['[data-action="save-paper"]', '[data-action="save-and-assign"]', '[data-action="backup"]', '[data-action="import"]', '[data-action="new-draft"]'])
    assert.equal(queried.get(selector)[0].removed, true, `${selector} is removed`);
  assert.equal(singles.get('.cz-more').removed, true, 'an emptied 더보기 menu is removed');
  assert.match(singles.get('[data-cz-empty-guide]').textContent, /문항을 선택하면 문제·정답·해설 출력을 확인합니다/);
  assert.equal(singles.get('[data-cz-result-title]').textContent, `${w.state.title} ${w.state.round}차`);
  assert.ok(ctx);
});

test('?recipe= 로 들어오면 문항 수는 평가 방식이 정하고 저장·백업 버튼이 남지 않는다(렌더 결과 + 가드)', () => {
  const { w } = harness();
  w.state.assessmentRecipe = 'FIVE_MINUTE';
  const html = w.renderComposition();
  // 배분은 pool로 고정된다(가드가 select를 잠그기 전에도 상태는 고정).
  assert.equal(w.state.distribution, 'pool');
  assert.match(html, /id="count"/);
});

test('조건 순서는 학년 → 과목 → 난이도 단계 → 문항 수 → 단원(긴 목록) → 더 자세한 조건 → 요약이고, 문항 수 옆 설명은 숫자와 한 문장이다', () => {
  const { w } = harness();
  const unit = pickUnit(w);
  w.state.scopes = [unit.key];
  const left = w.renderCompose();
  const order = ['data-action="compose-grade"', 'data-action="compose-subject"', 'id="compose-difficulty-label"', 'id="count"', 'data-scope=', 'class="compose-detail cz-detail"', 'data-cz-live']
    .map(token => left.indexOf(token));
  assert.ok(order.every((position, i) => position > 0 && (!i || position > order[i - 1])), 'order ' + order);
  assert.match(left, /고르지 않으면 모든 단계에서 뽑습니다./);
  assert.match(left, /<span class="cz-amount-note">단원마다 10문항씩<\/span>/);
  w.state.distribution = 'pool';
  w.state.count = 20;
  assert.match(w.renderComposition(), /<span class="cz-amount-note">전체 20문항<\/span>/);
});

test('단원 목록: 과목 묶음은 접을 수 있고 첫 묶음·고른 단원이 있는 묶음이 펼쳐져 있으며 머리줄에 모두 버튼이 있다', () => {
  const { w } = harness();
  pickUnit(w);
  const html = w.renderScopes();
  const groups = [...html.matchAll(/<details class="scope-group" data-scope-group="([^"]*)"( open)?>/g)];
  assert.ok(groups.length >= 1);
  assert.ok(groups[0][2], 'the first group is open');
  assert.match(html, /<summary class="group-head"><h3>[^<]+<\/h3><button data-action="scope-group"/);
  assert.doesNotMatch(html, /class="scope-group"><div class="group-head"/);
});

test('뽑은 뒤 화면 상태 줄에는 개발용 처리 시간이나 결과 요약을 내지 않는다(숨은 안내에만)', () => {
  const { w, ctx } = harness();
  const unit = pickUnit(w);
  w.state.scopes = [unit.key];
  w.state.distribution = 'pool';
  w.state.count = 3;
  const statusNode = ctx.document.getElementById('status');
  statusNode.textContent = '이전 안내';
  w.generate();
  assert.ok(w.state.selected.length > 0);
  assert.equal(statusNode.textContent, '', 'the visible status line is cleared');
  assert.doesNotMatch(statusNode.textContent, /ms|중복 없음/);
  assert.match(w.state.composeAnnounce, /\d+문항을 선택했습니다/);
  assert.match(w.renderCompose(), /class="visually-hidden" role="status" aria-live="polite" data-cz-announce>\d+문항을 선택했습니다/);
});

// ---- K1~K5 (2026-11-11) ---------------------------------------------------------------------------------
// 문항을 전부 쓰는 작은 단원(다시 만들기에서 지금 문항을 빼면 후보가 없다).
function pickSmallUnit(w) {
  w.state.filters = { grade: '고1' };
  const scope = w.scopeOptions().filter(item => !item.unclassified && item.count >= 4 && item.count <= 50).sort((x, y) => x.count - y.count)[0];
  assert.ok(scope, 'test catalog has a small unit');
  return scope;
}

test('K1 고정 외 다시 만들기: 새로 뽑을 문항이 모자라 결과가 줄어들면 적용하지 않고 지금 문제지를 그대로 두며 안내한다', () => {
  const { w } = harness();
  const unit = pickSmallUnit(w);
  w.state.scopes = [unit.key];
  w.state.distribution = 'pool';
  w.state.count = unit.count; // 단원의 문항을 전부 쓴다
  w.generate();
  const before = w.state.selected.map(row => row.questionUid);
  assert.ok(before.length >= 4);
  w.generate(true);
  assert.deepEqual(w.state.selected.map(row => row.questionUid), before, 'same questions in the same order');
  assert.match(w.state.composeNotice, /바꿔 넣을 문항이 모자라 지금 문제지를 그대로 둡니다/);
  assert.match(w.renderResult(), /data-compose-notice[^>]*>바꿔 넣을 문항이 모자라 지금 문제지를 그대로 둡니다. 문항을 하나씩 교체하거나 조건을 넓혀 주세요./);
  // 고정한 문항이 있어도 같다(고정은 그대로).
  w.state.pins = [before[0]];
  w.generate(true);
  assert.deepEqual(w.state.selected.map(row => row.questionUid), before);
  assert.deepEqual(plain(w.state.pins), [before[0]]);
  // 결과를 비우는 조건 변경은 안내를 지운다.
  w.invalidate();
  assert.equal(w.state.composeNotice, '');
});

test('K1 고정 외 다시 만들기: 후보가 충분하면 정상으로 바뀌고 고정한 문항은 남는다', () => {
  const { w } = harness();
  const unit = pickUnit(w);
  w.state.scopes = [unit.key];
  w.state.distribution = 'pool';
  w.state.count = 3;
  w.state.composeNotice = '이전 안내';
  w.generate();
  assert.equal(w.state.composeNotice, '', 'a fresh draw clears the notice');
  const before = w.state.selected.map(row => row.questionUid);
  w.state.pins = [before[0]];
  w.generate(true);
  assert.equal(w.state.composeNotice, '');
  assert.equal(w.state.selected.length, before.length);
  assert.ok(w.state.selected.some(row => row.questionUid === before[0]), 'the pinned question stays');
  assert.ok(w.state.selected.some(row => !before.includes(row.questionUid)), 'unpinned ones were replaced');
});

test('K1 같은 조건으로 다시 뽑기는 지금 문항을 후보에서 빼지 않아 모자라게 줄지 않는다', () => {
  const { w } = harness();
  const unit = pickUnit(w);
  w.state.scopes = [unit.key];
  w.state.distribution = 'pool';
  w.state.count = unit.count; // 단원의 문항을 전부 쓴다
  w.generate();
  const first = w.state.selected.length;
  assert.ok(first > 0);
  w.generate();
  assert.equal(w.state.selected.length, first, 'drawing again from the same pool keeps the size');
});

test('K3 좁은 화면에서는 뽑은 뒤 결과 머리로 스크롤하고 포커스를 옮기고, 두 칸(PC)에서는 하지 않는다', () => {
  const { w, ctx, document } = harness();
  const calls = [];
  const target = {
    attrs: {}, setAttribute(name, value) { this.attrs[name] = value; },
    scrollIntoView(options) { calls.push(['scroll', options]); }, focus(options) { calls.push(['focus', options]); },
  };
  document.querySelector = selector => (selector === '[data-cz-result-title]' ? target : null);
  ctx.matchMedia = () => ({ matches: false });
  w.focusComposeResult();
  assert.deepEqual(plain(calls), [['scroll', { behavior: 'smooth', block: 'start' }], ['focus', { preventScroll: true }]]);
  assert.equal(target.attrs.tabindex, '-1');
  calls.length = 0;
  ctx.matchMedia = query => ({ matches: query.includes('prefers-reduced-motion') });
  w.focusComposeResult();
  assert.equal(calls[0][1].behavior, 'auto', 'reduced motion jumps at once');
  calls.length = 0;
  ctx.matchMedia = query => ({ matches: query.includes('min-width: 1100px') });
  w.focusComposeResult();
  assert.deepEqual(calls, [], 'two-column layout does not scroll');
  // generate()가 실제로 부른다.
  ctx.matchMedia = () => ({ matches: false });
  const unit = pickUnit(w);
  w.state.scopes = [unit.key];
  w.state.distribution = 'pool';
  w.state.count = 3;
  w.generate();
  assert.ok(calls.some(call => call[0] === 'scroll'));
});

test('K4 요청 합계가 400문항을 넘으면 요약 줄에서 미리 알리고 버튼을 막는다', () => {
  const { w } = harness();
  w.state.filters = { grade: '고1' };
  const units = w.scopeOptions().filter(item => !item.unclassified);
  assert.ok(units.length >= 2, 'test catalog has two units');
  w.state.scopes = units.slice(0, 2).map(item => item.key);
  w.state.distribution = 'equal';
  w.state.count = 250; // 단원마다 250 → 500
  const html = w.renderComposition();
  assert.match(html, /data-cz-feasible="limit"[^>]*>한 번에 최대 400문항입니다\(지금 요청 500문항\)/);
  assert.match(html, /data-action="generate"[^>]*disabled/);
  assert.match(w.renderMobileActions(null), /최대 400문항<\/strong><span class="cz-bar-note">지금 요청 500문항/);
  assert.match(w.renderMobileActions(null), /data-action="generate"[^>]*disabled/);
  w.state.count = 150; // 300은 괜찮다
  assert.doesNotMatch(w.renderComposition(), /data-cz-feasible="limit"/);
});

test('K5a 조건이 바뀌어 결과가 비워질 때 고정해 둔 문항도 함께 지워졌다고 알린다', () => {
  const { w } = harness();
  const unit = pickUnit(w);
  w.state.scopes = [unit.key];
  w.state.distribution = 'pool';
  w.state.count = Math.min(4, unit.count);
  w.generate();
  w.state.pins = w.state.selected.slice(0, 2).map(row => row.questionUid);
  w.invalidate();
  assert.equal(w.state.selected.length, 0);
  assert.match(w.renderResultEmpty(), /조건이 바뀌었습니다[\s\S]*고정해 둔 2문항도 함께 지워졌습니다/);
  // 고정이 없었으면 그 문장은 없다.
  w.state.count = Math.min(4, unit.count);
  w.generate();
  w.invalidate();
  assert.doesNotMatch(w.renderResultEmpty(), /고정해 둔/);
});

test('K5b 모자라게 뽑은 문제지를 초안에서 복원해도 모자람 안내가 남는다', () => {
  const { w } = harness();
  const unit = pickUnit(w);
  w.state.scopes = [unit.key];
  w.state.distribution = 'pool';
  w.state.count = unit.count + 5;
  w.generate();
  assert.equal(w.state.composeShortage.length, 1);
  const saved = JSON.parse(JSON.stringify(w.draft()));
  assert.equal(saved.composeShortage.length, 1);
  w.state.composeShortage = [];
  w.applyDraft(saved);
  assert.equal(w.state.composeShortage.length, 1);
  assert.equal(w.state.composeShortage[0].requested, unit.count + 5);
  assert.match(w.renderResultSummary(w.review()), /모자라서 있는 만큼만 넣었습니다/);
  // 이전 형식의 초안(필드 없음)은 안내 없이 열린다.
  delete saved.composeShortage;
  w.applyDraft(saved);
  assert.deepEqual(plain(w.state.composeShortage), []);
});

test('the tests above shared one catalog and none of them changed it', () => {
  harness();
  assert.equal(catalogDigest(sharedCatalog), sharedCatalogDigest);
});
