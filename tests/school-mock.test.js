// 학교 모의고사(학교 시험지 한 줄 -> 기본 / 응용 / 심화): archive2-derive.js의 짝 규칙 옵션·한 줄 요약(합성 픽스처)과
// 작업 화면 흐름(실카탈로그, 개수 고정 없이 결함 조건만: 같은 시험 문항 0, 짝 중복 0, 세 벌 서로 겹침 0, 문항 수·결정성).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const D = require('../archive/archive2-derive.js');
const core = require('../archive/archive2-core.js');
const Unified = require('../archive/archive2-unified-units.js');
const Quick = require('../archive/archive2-quick-pools.js');
const Tree = require('../archive/archive2-unit-tree.js');
const archiveSource = require('../archive/archive2-source.js');
const { catalog, withTestAssignments } = require('./helpers/archive2-scope-harness.cjs');
const { loadWorkspace, readWorkspace } = require('./helpers/archive2-workspace-source.cjs');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, 'archive', file), 'utf8');
Tree.setGroups(JSON.parse(read('data/archive2-subunit-groups.json')));
const plain = v => JSON.parse(JSON.stringify(v));

// ---- 합성 픽스처 (archive2-derive.test.js와 같은 모양) ----
function fixture(rows) {
  const records = [];
  const unified = { byRecord: new Map(), byUid: new Map() };
  for (const row of rows) {
    const record = {
      questionUid: row.uid, sourceFile: row.file, sourceOrdinal: row.ordinal ?? 1, contentType: row.type || '기출',
      templateKey: row.tpl || '', problemTypeKey: row.pt || '', difficultyBucket: row.b,
    };
    const entry = { uid: row.uid, grade: '고1', subject: 'ALG', originalCurriculum: '2022', unitKey: row.unit || 'U1', unclassified: false };
    records.push(record);
    unified.byRecord.set(record, entry);
    unified.byUid.set(row.uid, entry);
  }
  return { records, index: D.buildDeriveIndex(records, { unified, eligible: () => true }) };
}
const BASE_FILE = 'original/high/h1/1mid/26_순천고_1학기_중간_고1_수학.js';
const baseRow = (n, extra = {}) => ({ uid: `b${n}`, file: BASE_FILE, ordinal: n, tpl: 'T1', pt: 'P1', b: 2, ...extra });

test('짝 규칙 옵션은 기본이 꺼져 있고(기존 다시 만들기 그대로), 켜면 기준 시험의 유사본과 한 벌 안의 원본-유사 짝을 뺀다', () => {
  const rows = [
    baseRow(1), baseRow(2),
    { uid: 'sim1', file: 'similar/high/h1/1mid/26_순천고_1학기_중간_고1_수학_유사.js', ordinal: 1, tpl: 'T1', pt: 'P1', b: 2 }, // 기준 시험의 유사본
    { uid: 'o5', file: 'original/high/h1/1mid/25_학교A_1학기_중간_고1_수학.js', ordinal: 5, tpl: 'T1', pt: 'P1', b: 2 },
    { uid: 'o5s', file: 'similar/high/h1/1mid/25_학교A_1학기_중간_고1_수학_유사.js', ordinal: 5, tpl: 'T1', pt: 'P1', b: 2 }, // o5의 짝
    { uid: 'o6', file: 'original/high/h1/1mid/24_학교B_1학기_중간_고1_수학.js', ordinal: 6, tpl: 'T1', pt: 'P1', b: 2 },
  ];
  const { index } = fixture(rows);
  const plainRun = D.deriveFromPaper(['b1', 'b2'], { seed: 's' }, index);
  assert.ok(plainRun.items.some(r => r.questionUid === 'sim1') || plainRun.items.length === 2, '기본 동작에서는 기준 시험의 유사본도 후보다(사용자 2026-11-20)');
  const keyed = (out) => out.items.map(r => r.questionUid);
  for (const seed of ['a', 'b', 'c', 'd', 'e']) {
    const out = D.deriveFromPaper(['b1', 'b2'], { seed, pairExclusive: true, excludeBaseFamily: true }, index);
    const uids = keyed(out);
    assert.ok(!uids.includes('sim1'), '기준 시험의 유사본은 후보에서 빠진다');
    assert.ok(!(uids.includes('o5') && uids.includes('o5s')), '원본과 그 유사본은 한 벌에 함께 들어가지 않는다');
    assert.equal(new Set(uids).size, uids.length);
  }
});

test('한 줄 요약과 못 채운 자리 번호', () => {
  const rows = [
    baseRow(1), baseRow(2, { tpl: 'T9', pt: 'P9', unit: 'U1' }), baseRow(3, { tpl: 'TZ', pt: 'PZ', unit: 'U7' }),
    { uid: 'c1', file: 'original/high/h1/1mid/25_학교A_1학기_중간_고1_수학.js', ordinal: 1, tpl: 'T1', pt: 'P1', b: 2 },
    { uid: 'c2', file: 'original/high/h1/1mid/25_학교A_1학기_중간_고1_수학.js', ordinal: 2, tpl: 'TX', pt: 'PX', b: 2 }, // 같은 단원만 일치
  ];
  const { index } = fixture(rows);
  const out = D.deriveFromPaper(['b1', 'b2', 'b3'], { seed: 's', excludeBaseFamily: true, pairExclusive: true }, index);
  const s = out.summary;
  assert.equal(s.sameType, 1);
  assert.deepEqual(s.unfilledSlots, [3], 'U7을 덮는 후보가 없어 3번 자리는 비어 있다(경계 밖)');
  assert.match(s.headline, /^3문항 중 1문항 같은 유형/);
  assert.match(s.headline, /1문항 같은 단원/);
  assert.match(s.headline, /1문항 못 채움/);
});

test('preferSchool: 같은 칸이면 학교 기출을 유사·교재보다 먼저 고른다(꺼져 있으면 기존 점수 그대로)', () => {
  const rows = [
    baseRow(1),
    { uid: 'w1', file: 'types/high/h1/25_학교Z_유형.js', ordinal: 3, type: '유형', tpl: 'T1', pt: 'P1', b: 2 },
    { uid: 's1', file: 'similar/high/h1/1mid/25_학교Y_1학기_중간_고1_수학_유사.js', ordinal: 4, tpl: 'T1', pt: 'P1', b: 2 },
    { uid: 'o1', file: 'original/high/h1/1mid/25_학교A_1학기_중간_고1_수학.js', ordinal: 5, tpl: 'T1', pt: 'P1', b: 2 },
  ];
  const { index } = fixture(rows);
  for (const seed of ['a', 'b', 'c', 'd']) {
    const out = D.deriveFromPaper(['b1'], { seed, preferSchool: true }, index);
    assert.equal(out.items[0].questionUid, 'o1', '학교 기출이 있으면 그것');
  }
  const noSchool = fixture(rows.filter(r => r.uid !== 'o1'));
  const out = D.deriveFromPaper(['b1'], { seed: 'a', preferSchool: true }, noSchool.index);
  assert.equal(out.items.length, 1, '학교 기출이 없으면 유사·교재로 채운다');
});

// ---- 작업 화면 흐름(실카탈로그) ----
const catalogBase = withTestAssignments(structuredClone(catalog));
function harness(extra = {}, options = {}) {
  const storage = new Map(options.session ? [['APMATH_SESSION', JSON.stringify({ id: 'teacher-test', session_token: 'test-token' })]] : []);
  const nodes = new Map(), opened = [];
  const node = id => {
    if (!nodes.has(id)) nodes.set(id, { innerHTML: '', textContent: '', dataset: {}, setAttribute() {}, addEventListener() {}, querySelectorAll: () => [], classList: { toggle() {}, add() {}, remove() {} }, close() {}, showModal() {}, focus() {} });
    return nodes.get(id);
  };
  const popup = () => ({ document: { body: { textContent: '' } }, location: { replace() {} }, close() {} });
  const ctx = vm.createContext({
    console: { ...console, log() {} }, crypto, URL, URLSearchParams, structuredClone, queueMicrotask: () => {},
    location: new URL('https://archive.test/archive/workspace.html'), history: { pushState() {}, replaceState() {} }, scrollY: 0, scrollTo() {},
    setTimeout: () => 0, clearTimeout() {}, matchMedia: () => ({ matches: false }),
    open: () => { const p = popup(); opened.push(p); return p; },
    localStorage: { getItem: k => storage.get(k) ?? null, setItem: (k, v) => storage.set(k, v), removeItem: k => storage.delete(k) },
    document: { baseURI: 'https://archive.test/archive/workspace.html', getElementById: node, querySelector: () => null, querySelectorAll: () => [], body: { dataset: {} }, addEventListener() {} },
    addEventListener() {}, fetch: async () => { throw new Error('no network'); },
    Archive2Core: core, Archive2UnifiedUnits: Unified, Archive2QuickPools: Quick, Archive2UnitTree: Tree, Archive2Derive: D,
    ProblemBankMeta: require('../archive/problem-bank-meta.js'), Archive2Canonical: core.Canonical,
    Archive2Output: require('../archive/archive2-output.js'), Archive2Papers: require('../archive/archive2-papers.js'),
    Archive2History: require('../archive/archive2-history.js'),
    Archive2Source: { ...archiveSource, restore: async records => records.map(r => ({ questionUid: r.questionUid, answer: '①', choices: ['1', '2', '3', '4', '5'], solution: '해설' })) },
    ...extra,
  });
  ctx.window = ctx;
  loadWorkspace(ctx, `
    render = () => {}; save = () => {};
    globalThis.workspaceTest = { state, generate, request };
  `);
  const w = ctx.workspaceTest;
  w.state.catalog = catalogBase;
  w.state.byUid = new Map(catalogBase.records.map(r => [r.questionUid, r]));
  w.state.finderIndex = core.buildFinderIndex(catalogBase);
  w.state.indexVersion = catalogBase.indexVersion;
  const api = ctx.Archive2Workspace.api, V = ctx.Archive2Workspace.v;
  const body = () => ctx.document.getElementById('modal-body').innerHTML;
  return { w, ctx, api, V, body, opened };
}
const stemOf = file => String(file).replace(/^[^/]+\//, '').replace(/\.js$/i, '').replace(/_유사\d*$/, '');
function pickBaseExam() {
  const counts = new Map();
  for (const r of catalogBase.records) if (/^original\/high\/h1\//.test(r.sourceFile)) counts.set(r.sourceFile, (counts.get(r.sourceFile) || 0) + 1);
  const file = [...counts.entries()].filter(([, n]) => n >= 16).sort((a, b) => b[0].localeCompare(a[0]))[0][0];
  return { file, exam: catalogBase.exams.find(e => e.file === file), n: counts.get(file) };
}

test('시험지 한 줄 -> 기본/응용/심화 선택 창 -> 결과: 같은 시험 문항·짝 중복·못 채움 표시', async () => {
  const { file, exam, n } = pickBaseExam();
  const H = harness();
  H.api.startMockForExam(exam);
  assert.equal((H.body().match(/data-action="derive-mock-level"/g) || []).length, 3, '기본·응용·심화 세 단추');
  assert.match(H.body(), /derive-mock-all/);
  const baseUids = new Set(catalogBase.records.filter(r => r.sourceFile === file).map(r => r.questionUid));
  for (const level of ['same', 'up-some', 'up-one']) {
    await H.api.deriveAction('derive-mock-level', { dataset: { level } });
    const result = H.V.derive.dlg.result;
    assert.ok(result.items.length >= Math.floor(n * 0.8), `${level}: 같은 문항 수에 가깝게 채운다`);
    assert.ok(result.items.length <= n);
    const uids = result.items.map(r => r.questionUid);
    assert.equal(new Set(uids).size, uids.length, `${level}: 같은 문항 중복 0`);
    assert.ok(uids.every(uid => !baseUids.has(uid)), `${level}: 기준 시험 자기 문항 0`);
    assert.ok(result.items.every(r => stemOf(r.sourceFile) !== stemOf(file)), `${level}: 기준 시험의 유사·유형 문항 0`);
    const pairs = result.items.map(r => `${stemOf(r.sourceFile)}#${r.sourceOrdinal}`);
    assert.equal(new Set(pairs).size, pairs.length, `${level}: 원본-유사 짝 동시 포함 0`);
    assert.match(H.body(), /문항 중 \d+문항 같은 유형/, '한 줄 요약');
    assert.doesNotMatch(H.body(), /templateKey|problemTypeKey|qid_v1_|PT_|TPL_/, '내부 키는 화면에 내지 않는다');
    if (result.summary.unfilledSlots.length) assert.match(H.body(), /못 채운 자리/);
  }
  // 같은 seed·같은 입력 -> 같은 결과
  const again = harness();
  again.api.startMockForExam(exam);
  again.V.derive.dlg.seed = H.V.derive.dlg.seed;
  await again.api.deriveAction('derive-mock-level', { dataset: { level: 'same' } });
  assert.deepEqual(again.V.derive.dlg.result.items.map(r => r.questionUid), H.V.derive.dlg.sets.same.items.map(r => r.questionUid), '같은 seed면 같은 결과');
});

test('세 벌 한꺼번에: 심화→응용→기본 순으로 뽑고 겹침은 요약에 알린다, 세 벌 모두 열기, 문제지 만들기로 이어가면 모의고사 제목과 안내', async () => {
  const { exam } = pickBaseExam();
  const H = harness();
  H.api.startMockForExam(exam);
  await H.api.deriveAction('derive-mock-all', {});
  const sets = H.V.derive.dlg.sets;
  assert.deepEqual(Object.keys(sets).sort(), ['same', 'up-one', 'up-some']);
  const all = Object.values(sets).flatMap(set => set.items.map(r => r.questionUid));
  // 못 채운 자리는 다른 벌과 겹쳐서 채우고, 요약의 겹침 수가 실제 겹침과 같다. 한 벌 안의 중복은 없다.
  for (const set of Object.values(sets)) assert.equal(new Set(set.items.map(r => r.questionUid)).size, set.items.length, '한 벌 안의 중복 0');
  const seen = new Set();
  let dup = 0;
  for (const level of ['up-one', 'up-some', 'same']) for (const r of sets[level].items) { if (seen.has(r.questionUid)) dup += 1; seen.add(r.questionUid); }
  assert.equal(['up-one', 'up-some', 'same'].reduce((n, level) => n + (sets[level].summary.overlap || 0), 0), dup);
  assert.equal(sets['up-one'].summary.overlap, 0, '가장 먼저 뽑는 심화는 겹침 없음');
  if (dup) assert.match(H.body(), /다른 회차와 겹침 \d+문항/);
  assert.match(H.body(), /derive-mock-open-all/);
  H.api.deriveAction('derive-mock-open-all', {});
  assert.equal(H.opened.length, 3, '창 셋을 한 번 눌러 연다');
  await H.api.deriveAction('derive-compose', {});
  assert.match(H.w.state.title, /모의고사 \(기본\)$/);
  assert.doesNotMatch(H.w.state.title, /다시 ?만들기/);
  assert.deepEqual(new Set(plain(H.w.state.selected).map(r => r.questionUid)), new Set(sets.same.items.map(r => r.questionUid)));
  assert.match(H.api.deriveNoteMarkup(), /모의고사/);
  assert.match(H.api.deriveNoteMarkup(), /data-action="derive-mock-switch"[^>]*data-level="up-some"/, '다른 난이도로 새로 만들기 단추');
  // 같은 시험의 다른 난이도로 이어가기: 지금 문제지 문항은 새 세트에서 빠진다
  const firstPaper = new Set(plain(H.w.state.selected).map(r => r.questionUid));
  await H.api.deriveAction('derive-mock-switch', { dataset: { level: 'up-some' } });
  assert.match(H.w.state.title, /모의고사 \(응용\)$/);
  const secondPaper = plain(H.w.state.selected).map(r => r.questionUid);
  assert.ok(secondPaper.length > 0, '다른 난이도 세트도 채운다');
  // 저장 요청은 서버가 아는 키만 쓴다(다시 만들기 길과 같음)
  const req = H.w.request(true);
  assert.ok(req.filters.grade && req.filters.scopeQuestionUids.length >= H.w.state.selected.length);
});

test('입구: 학교 기출 시험지 줄에만 모의고사 단추가 있고, 옛 홈 카드·?mock= 주소도 같은 길이다', () => {
  const find = readWorkspace();
  assert.match(find, /derive-mock-open/);
  assert.match(find, /\^original\\\//, '학교 기출(original/)만');
  assert.match(find, /mock-in-actions/);
  assert.match(find, /mock-in-sim/);
  assert.doesNotMatch(read('index.html'), /data-action="mock"/, '옛 홈 카드는 main과 같은 높이를 지킨다(입구는 학교별 기출 줄)');
  const { exam } = pickBaseExam();
  // ?mock=<파일> 주소: 자료가 오면 같은 선택 창이 열린다(주소는 파일을 불러올 때 붙잡아 둔다)
  const H = harness({ location: new URL('https://archive.test/archive/workspace.html?view=find&mock=' + encodeURIComponent(exam.file)) });
  H.api.openDeriveFromUrl();
  assert.match(H.body(), /derive-mock-all/);
});

// 온전성만 본다: 세 벌을 한꺼번에 뽑아도 못 채운 자리가 한 벌만 뽑을 때보다 나빠지지 않는다.
for (const [label, re] of [['왕의중 중2', /^original\/middle\/m2\/.*왕의중.*\.js$/], ['중1', /^original\/middle\/m1\/.*왕운중.*\.js$/]]) {
  test(`세 벌 온전성: ${label} - 못 채움은 한 벌만 뽑을 때보다 나쁘지 않다`, async () => {
    const counts = new Map();
    for (const r of catalogBase.records) if (re.test(r.sourceFile)) counts.set(r.sourceFile, (counts.get(r.sourceFile) || 0) + 1);
    const file = [...counts.entries()].filter(([, n]) => n >= 10).sort((a, b) => b[0].localeCompare(a[0]))[0]?.[0];
    assert.ok(file, `${label} 시험지가 카탈로그에 있다`);
    const exam = catalogBase.exams.find(e => e.file === file);
    const H = harness();
    H.api.startMockForExam(exam);
    await H.api.deriveAction('derive-mock-all', {});
    const sets = H.V.derive.dlg.sets;
    for (const level of ['same', 'up-some', 'up-one']) {
      const solo = harness();
      solo.api.startMockForExam(exam);
      await solo.api.deriveAction('derive-mock-level', { dataset: { level } });
      const alone = solo.V.derive.dlg.result;
      assert.ok(sets[level].items.length >= alone.items.length, `${level}: 못 채움이 한 벌만 뽑을 때보다 나쁘지 않다 (${sets[level].items.length} >= ${alone.items.length})`);
      const uids = sets[level].items.map(r => r.questionUid);
      assert.equal(new Set(uids).size, uids.length, `${level}: 한 벌 안의 중복 0`);
    }
  });
}
