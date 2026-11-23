// Automatic selection rules (2026-11-18 user/coordinator decision):
//   1. An original exam question and its similar-problem variant (same exam, same number) are never
//      on one paper unless the teacher pinned them.
//   2. A problem type is repeated only when no unused type is left: a new type of an earlier year
//      comes before a repeat of the newest year; among questions of one type the newest comes first.
// The requested count and the unit/difficulty conditions never change. Synthetic pools cover the
// rules; one test runs the real catalog and states defect conditions only (no operating counts).
const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const core = require('../archive/archive2-core.js');
const Similar = require('../archive/archive2-similar.js');
const { productionCatalog } = require('./helpers/archive2-scope-harness.cjs');

// The browser loads archive2-similar.js as a global after archive2-core.js; mirror that.
globalThis.Archive2Similar = Similar;

const uidFor = (n) => 'qid_v1_' + crypto.createHash('sha256').update('pair-' + n).digest('hex');
let counter = 0;
const PATH = { curriculumKey: '2015', courseKey: '수학(상)', L1: '다항식', L2: '인수분해' };

// One exam file with `count` questions; types[i] is the recorded problem type of question i+1.
function exam({ file, school = '가고', year = 2025, axis = '1-mid', subject = '대수', contentType = '기출', types, difficulty = 3, path = PATH }) {
  return types.map((type, index) => ({
    questionUid: uidFor(++counter), identityStatus: 'VERIFIED', sourceIntegrityStatus: 'VERIFIED', sourceStatus: 'VERIFIED',
    sourceFile: file, sourceOrdinal: index + 1, sourceQuestionNo: String(index + 1), sourceFingerprint: 'f'.repeat(64),
    school, year, subject, contentType, examAxis: axis, sourceGrade: '고1', effectiveBrowseGrade: '고1',
    difficultyBucket: difficulty, ...path,
    ...(type ? { metaBinding: 'text', metaHintPT: type, metaHintStatus: '-P-' } : {}),
  }));
}
const original = (opts) => exam({ file: `original/high/h1/1mid/${opts.school || '가고'}_${opts.year || 2025}_기출.js`, ...opts });
const similarOf = (opts) => exam({ file: `similar/high/h1/1mid/${opts.school || '가고'}_${opts.year || 2025}_기출_유사${opts.suffix || ''}.js`, contentType: '유형', ...opts });

function requestFor(records, count, extra = {}) {
  const uids = records.map((r) => r.questionUid);
  const unit = core.pathKey(records[0], 4);
  return {
    filters: { grade: '고1', scopeQuestionUids: uids, primaryPaths: [unit] },
    rows: [{ id: 'unit', count, paths: [unit], depth: 4, scopeQuestionUids: uids }],
    useMode: 'general', seed: 'pair-seed', ...extra,
  };
}
const familyKeys = (records, selected) => {
  const family = core.familyResolver(records);
  return selected.map((r) => family(r)).filter(Boolean);
};
const duplicates = (list) => list.filter((value, index) => list.indexOf(value) !== index);
const SEEDS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

test('the family of a similar set is its original exam and the same question number', () => {
  const types = ['T1', 'T2', 'T3', 'T4'];
  const records = [...original({ types }), ...similarOf({ types })];
  const family = core.familyResolver(records);
  const [o, s] = [records.slice(0, 4), records.slice(4)];
  for (let i = 0; i < 4; i++) {
    assert.ok(family(o[i]), 'an original has a family key');
    assert.equal(family(o[i]), family(s[i]), 'variant n belongs to the original question n');
    assert.notEqual(family(o[i]), family(o[(i + 1) % 4]));
  }
});

test('an ambiguous or unlinked similar set is never treated as a pair', () => {
  const orig = original({ types: ['T1', 'T2'] });
  // no year and a name that names no original: archive2-similar leaves it unlinked
  const noYear = exam({ file: 'similar/high/h1/1mid/무제_유사.js', contentType: '유형', types: ['T1', 'T2'], year: null });
  const records = [...orig, ...noYear];
  const family = core.familyResolver(records);
  assert.ok(noYear.every((r) => !family(r)));
  // a different school is another exam, not a pair
  const other = similarOf({ types: ['T1', 'T2'], school: '나고' });
  const records2 = [...orig, ...other];
  const family2 = core.familyResolver(records2);
  assert.ok(other.every((r) => !family2(r)));
});

test('an original question and its similar variant never share an automatic paper', () => {
  const types = Array.from({ length: 10 }, (_, i) => 'T' + (i % 4));
  const records = [...original({ types }), ...similarOf({ types })];
  for (const seed of SEEDS) {
    const result = core.selectBlueprint(records, requestFor(records, 10, { seed }));
    assert.equal(result.ok, true);
    assert.equal(result.selected.length, 10, 'the requested count is met');
    assert.deepEqual(duplicates(familyKeys(records, result.selected)), [], 'no family twice, seed ' + seed);
  }
});

test('questions the teacher pinned stay even when they are a pair; automatic picks avoid the pinned question\'s family', () => {
  const types = Array.from({ length: 8 }, (_, i) => 'T' + i);
  const o = original({ types });
  const s = similarOf({ types });
  const records = [...o, ...s];
  // pin BOTH members of one family: the teacher's choice is not undone
  const both = { ...requestFor(records, 6), pins: [{ questionUid: o[2].questionUid, rowId: 'unit' }, { questionUid: s[2].questionUid, rowId: 'unit' }] };
  const kept = core.selectBlueprint(records, both);
  assert.ok(kept.selected.some((r) => r.questionUid === o[2].questionUid));
  assert.ok(kept.selected.some((r) => r.questionUid === s[2].questionUid));
  assert.equal(kept.selected.length, 6);
  // pin only the original: its variant (and every other pair) is left out
  for (const seed of SEEDS) {
    const one = { ...requestFor(records, 6, { seed }), pins: [{ questionUid: o[2].questionUid, rowId: 'unit' }] };
    const result = core.selectBlueprint(records, one);
    assert.equal(result.selected.length, 6);
    assert.ok(!result.selected.some((r) => r.questionUid === s[2].questionUid), 'the pinned original\'s variant is not added');
    assert.deepEqual(duplicates(familyKeys(records, result.selected)), []);
  }
});

test('the count is met by allowing a pair only when the pool has no other question', () => {
  const types = ['T1', 'T2', 'T3'];
  const records = [...original({ types }), ...similarOf({ types })];
  const result = core.selectBlueprint(records, requestFor(records, 5));
  assert.equal(result.ok, true);
  assert.equal(result.selected.length, 5, 'count never shrinks to avoid a pair');
  const families = familyKeys(records, result.selected);
  assert.equal(new Set(families).size, 3, 'every family is used once before any is used twice');
  assert.equal(duplicates(families).length, 2);
  // all six questions requested: nothing is left out
  assert.equal(core.selectBlueprint(records, requestFor(records, 6)).selected.length, 6);
});

test('a type is repeated only after every unused type: an earlier year\'s new type beats the newest year\'s repeat', () => {
  const rows = [
    ...exam({ file: 'original/high/h1/1mid/a_2026.js', year: 2026, types: ['A', 'A', 'A', 'A', 'A', 'A'] }),
    ...exam({ file: 'original/high/h1/1mid/b_2025.js', school: '나고', year: 2025, types: ['B'] }),
    ...exam({ file: 'original/high/h1/1mid/c_2024.js', school: '다고', year: 2024, types: ['C'] }),
    ...exam({ file: 'original/high/h1/1mid/d_2023.js', school: '라고', year: 2023, types: ['D'] }),
  ];
  for (const seed of SEEDS) {
    const result = core.selectBlueprint(rows, requestFor(rows, 4, { seed }));
    assert.equal(result.selected.length, 4);
    const types = result.selected.map((r) => core.selectionTypeKey(r));
    assert.deepEqual([...new Set(types)].sort(), ['A', 'B', 'C', 'D'], 'all four types, no repeat: ' + types);
    assert.equal(result.diagnostics.typeCoverage.repeatedCount, 0);
  }
  // five questions: exactly one repeat, and it is of the only type that has more questions (A)
  const five = core.selectBlueprint(rows, requestFor(rows, 5));
  assert.equal(five.diagnostics.typeCoverage.distinctTypes, 4);
  assert.equal(five.selected.filter((r) => core.selectionTypeKey(r) === 'A').length, 2);
});

test('among questions of one type the newest year comes first', () => {
  const rows = [
    ...exam({ file: 'original/high/h1/1mid/a_2026.js', year: 2026, types: ['A', 'B'] }),
    ...exam({ file: 'original/high/h1/1mid/b_2024.js', school: '나고', year: 2024, types: ['A', 'C'] }),
    ...exam({ file: 'original/high/h1/1mid/c_2022.js', school: '다고', year: 2022, types: ['A'] }),
  ];
  for (const seed of SEEDS) {
    const result = core.selectBlueprint(rows, requestFor(rows, 3, { seed }));
    const a = result.selected.filter((r) => core.selectionTypeKey(r) === 'A');
    assert.equal(a.length, 1);
    assert.equal(a[0].year, 2026, 'type A is taken from 2026, not from an older year');
    assert.deepEqual(result.selected.map((r) => core.selectionTypeKey(r)).sort(), ['A', 'B', 'C']);
  }
  // when A has to repeat, the newest remaining A is taken
  const four = core.selectBlueprint(rows, requestFor(rows, 4));
  assert.deepEqual(four.selected.filter((r) => core.selectionTypeKey(r) === 'A').map((r) => r.year).sort(), [2024, 2026]);
});

test('when the pool is smaller than the types and pairs allow, the requested count is still met', () => {
  const rows = exam({ file: 'original/high/h1/1mid/a_2025.js', types: ['A', 'A', 'A', 'A', 'A'] });
  const result = core.selectBlueprint(rows, requestFor(rows, 5));
  assert.equal(result.ok, true);
  assert.equal(result.selected.length, 5);
  assert.equal(result.diagnostics.typeCoverage.repeatedCount, 4);
  const short = core.selectBlueprint(rows, requestFor(rows, 7));
  assert.equal(short.selected.length, 5);
  assert.equal(short.shortages.length, 1);
});

test('questions without a recorded type are not repeats; they come after the new types', () => {
  const rows = [
    ...exam({ file: 'original/high/h1/1mid/a_2026.js', year: 2026, types: [null, null, null, 'A'] }),
    ...exam({ file: 'original/high/h1/1mid/b_2024.js', school: '나고', year: 2024, types: ['B'] }),
  ];
  const result = core.selectBlueprint(rows, requestFor(rows, 3));
  assert.equal(result.selected.length, 3);
  const types = result.selected.map((r) => core.selectionTypeKey(r));
  assert.ok(types.includes('A') && types.includes('B'), 'both known types come before untyped questions: ' + types);
  // all untyped: plain newest-first, full count
  const untyped = [
    ...exam({ file: 'original/high/h1/1mid/a_2026.js', year: 2026, types: [null, null, null] }),
    ...exam({ file: 'original/high/h1/1mid/b_2024.js', school: '나고', year: 2024, types: [null, null] }),
  ];
  const all = core.selectBlueprint(untyped, requestFor(untyped, 4));
  assert.equal(all.selected.length, 4);
  assert.equal(all.selected.filter((r) => r.year === 2026).length, 3);
});

test('the rules keep the row, unit and difficulty conditions and work for several rows', () => {
  const hard = exam({ file: 'original/high/h1/1mid/h_2025.js', types: ['A', 'B', 'C', 'D'], difficulty: 5 });
  const easy = exam({ file: 'original/high/h1/1mid/e_2025.js', school: '나고', types: ['A', 'B', 'C', 'D'], difficulty: 1 });
  const records = [...hard, ...easy];
  const uids = records.map((r) => r.questionUid);
  const unit = core.pathKey(records[0], 4);
  const request = {
    filters: { grade: '고1', scopeQuestionUids: uids, primaryPaths: [unit] },
    rows: [
      { id: 'hard', count: 2, paths: [unit], depth: 4, scopeQuestionUids: uids, difficultyBuckets: [5] },
      { id: 'easy', count: 3, paths: [unit], depth: 4, scopeQuestionUids: uids, difficultyBuckets: [1] },
    ],
    useMode: 'general', seed: 'rows',
  };
  const result = core.selectBlueprint(records, request);
  assert.equal(result.ok, true);
  assert.equal(result.selected.filter((r) => r.rowId === 'hard').length, 2);
  assert.equal(result.selected.filter((r) => r.rowId === 'easy').length, 3);
  assert.ok(result.selected.filter((r) => r.rowId === 'hard').every((r) => r.difficultyBucket === 5));
  assert.ok(result.selected.filter((r) => r.rowId === 'easy').every((r) => r.difficultyBucket === 1));
  assert.ok(result.selected.every((r) => core.matches(r, request.filters, request)));
});

test('the assessment-recipe group path also keeps pairs out and meets the count', () => {
  const types = Array.from({ length: 10 }, (_, i) => 'T' + i);
  const records = [...original({ types }), ...similarOf({ types })];
  const options = { representativeGroupFor: (record) => ({ concept: 'C' + (record.sourceOrdinal % 2), type: record.metaHintPT }) };
  for (const seed of SEEDS) {
    const result = core.selectBlueprint(records, requestFor(records, 8, { seed }), {}, options);
    assert.equal(result.selected.length, 8);
    assert.deepEqual(duplicates(familyKeys(records, result.selected)), [], 'seed ' + seed);
  }
});

test('options.familyRecords links families through originals that are outside the picked pool', () => {
  // The teacher picks one unit. The original exam's questions belong to ANOTHER unit, so the pool only holds the
  // two similar sets (variants of the same original questions) and one more exam of the picked unit.
  const OTHER = { curriculumKey: '2015', courseKey: '수학(상)', L1: '다항식', L2: '다항식의 연산' };
  const types = Array.from({ length: 6 }, (_, i) => 'T' + (i % 2));
  const orig = original({ types, path: OTHER });
  const sim1 = similarOf({ types, suffix: '1' });
  const sim2 = similarOf({ types, suffix: '2' });
  const filler = exam({ file: 'original/high/h1/1mid/다고_2024_기출.js', school: '다고', year: 2024, types });
  const everything = [...orig, ...sim1, ...sim2, ...filler];
  const pool = [...sim1, ...sim2, ...filler];
  const options = { familyRecords: everything };
  const family = core.familyResolver(everything);
  const duplicateFamilies = (selected) => duplicates(selected.map((r) => family(r)).filter(Boolean));
  // the pool alone cannot see the original, the whole catalog can
  assert.ok(sim1.every((r) => core.familyResolver(pool)(r) === ''), 'pool alone: the similar sets look unlinked');
  assert.ok(sim1.every((r, i) => family(r) === family(sim2[i]) && family(r) !== ''), 'whole catalog: both variants of question n share a family');
  let withoutOption = 0;
  for (const seed of SEEDS) {
    const request = requestFor(pool, 8, { seed });
    const result = core.selectBlueprint(pool, request, {}, options);
    assert.equal(result.ok, true);
    assert.equal(result.selected.length, 8, 'the requested count is met');
    assert.deepEqual(duplicateFamilies(result.selected), [], 'no family twice, seed ' + seed);
    assert.ok(result.selected.every((r) => pool.some((p) => p.questionUid === r.questionUid)), 'only pool questions are drawn');
    assert.ok(result.selected.every((r) => core.matches(r, request.filters, request)), 'unit conditions hold');
    withoutOption += duplicateFamilies(core.selectBlueprint(pool, request).selected).length;
  }
  assert.ok(withoutOption > 0, 'without the option the same two variants can still be drawn together (this is what the option fixes)');
  // a pool that cannot fill the count without a family repeat still meets it, and a missing/empty option changes nothing
  const small = [...sim1, ...sim2];
  const full = core.selectBlueprint(small, requestFor(small, 12), {}, options);
  assert.equal(full.selected.length, 12);
  const same = core.selectBlueprint(pool, requestFor(pool, 8, { seed: 'k' }), {}, { familyRecords: [] });
  assert.deepEqual(same.selected.map((r) => r.questionUid), core.selectBlueprint(pool, requestFor(pool, 8, { seed: 'k' })).selected.map((r) => r.questionUid));
  // pins are never undone by the wider family view
  const pinned = { ...requestFor(pool, 6, { seed: 'p' }), pins: [{ questionUid: sim1[2].questionUid, rowId: 'unit' }, { questionUid: sim2[2].questionUid, rowId: 'unit' }] };
  const kept = core.selectBlueprint(pool, pinned, {}, options);
  assert.ok([sim1[2], sim2[2]].every((p) => kept.selected.some((r) => r.questionUid === p.questionUid)), 'both pinned variants stay');
  assert.equal(kept.selected.length, 6);
});

test('without the similar-problem module nothing throws and the count is met', () => {
  const types = ['T1', 'T2', 'T3', 'T4'];
  const records = [...original({ types }), ...similarOf({ types })];
  const kept = globalThis.Archive2Similar;
  try {
    delete globalThis.Archive2Similar;
    const family = core.familyResolver(records);
    assert.ok(records.every((r) => family(r) === ''));
    assert.equal(core.selectBlueprint(records, requestFor(records, 6)).selected.length, 6);
  } finally {
    globalThis.Archive2Similar = kept;
  }
});

test('real catalog: families equal archive2-similar pairs, and automatic papers never hold a pair', async () => {
  const { data } = await productionCatalog();
  const records = data.records;
  // 1. the family rebuilt from the records matches the pairing computed from the exam rows
  const pairs = Similar.pairSimilarSets(data.exams);
  const prefix = new Map();
  for (const exam of data.exams) {
    if (Similar.isOriginalExam(exam)) prefix.set(exam.file, exam.file);
    else if (pairs.originalFileFor(exam.file)) prefix.set(exam.file, pairs.originalFileFor(exam.file));
  }
  const family = core.familyResolver(records);
  const wrong = records.filter((r) => (prefix.has(r.sourceFile) ? `${prefix.get(r.sourceFile)}#${r.sourceOrdinal}` : '') !== family(r));
  assert.equal(wrong.length, 0, 'family keys differ from the archive2-similar pairing: ' + wrong.slice(0, 3).map((r) => r.sourceFile));
  // 2. a unit that has similar sets: the paper never holds two members of a family
  const withSimilar = new Set(records.filter((r) => String(r.sourceFile).startsWith('similar/') && family(r)).map((r) => core.generalPathKey(r, 4)));
  const unitPaths = [...withSimilar].filter((p) => !/\["","","",""\]/.test(p));
  assert.ok(unitPaths.length > 0, 'the catalog has units with similar sets');
  for (const unit of unitPaths.slice(0, 6)) {
    const scoped = records.filter((r) => core.generalPathKey(r, 4) === unit && r.effectiveBrowseGrade);
    const grade = scoped[0].effectiveBrowseGrade;
    const request = (seed) => ({
      filters: { grade, primaryPaths: [unit] }, rows: [{ id: 'r', paths: [unit], depth: 4, count: 12 }], useMode: 'general', seed,
      canonicalAuthority: data.canonicalAuthority, projectionPolicy: data.projectionPolicy,
    });
    for (const seed of ['s1', 's2', 's3']) {
      const result = core.selectBlueprint(scoped, request(seed));
      assert.equal(result.errors.length, 0);
      const pool = scoped.filter((r) => core.rowMatches(r, request(seed).rows[0], { useMode: 'general', canonicalAuthority: data.canonicalAuthority, projectionPolicy: data.projectionPolicy }) && core.generalUseEligibility(r).ok);
      assert.equal(result.selected.length, Math.min(12, pool.length), 'count is met whenever the pool is large enough');
      // pairs are allowed only if the pool could not fill the count without one
      const distinctFamilies = new Set(pool.map((r) => family(r) || r.questionUid)).size;
      if (distinctFamilies >= result.selected.length)
        assert.deepEqual(duplicates(familyKeys(scoped, result.selected)), [], `pair in ${unit} seed ${seed}`);
    }
  }
});

// The screen passes the whole catalog as the family view: a unit whose originals sit in another unit still keeps
// the two similar variants of one original question off one automatic paper (real catalog, real generate()).
test('real screen: generate() keeps similar variants of one original apart even when the original is in another unit', () => {
  const vm = require('node:vm');
  const fs = require('node:fs');
  const path = require('node:path');
  const Unified = require('../archive/archive2-unified-units.js');
  const Tree = require('../archive/archive2-unit-tree.js');
  const Quick = require('../archive/archive2-quick-pools.js');
  const archiveSource = require('../archive/archive2-source.js');
  const { catalog, withTestAssignments } = require('./helpers/archive2-scope-harness.cjs');
  const { loadWorkspace } = require('./helpers/archive2-workspace-source.cjs');
  Tree.setGroups(JSON.parse(fs.readFileSync(path.join(__dirname, '../archive/data/archive2-subunit-groups.json'), 'utf8')));
  const data = withTestAssignments(structuredClone(catalog));
  const pairs = Similar.pairSimilarSets(data.exams);
  const prefix = new Map();
  for (const e of data.exams) {
    if (Similar.isOriginalExam(e)) prefix.set(e.file, e.file);
    else if (pairs.originalFileFor(e.file)) prefix.set(e.file, pairs.originalFileFor(e.file));
  }
  const familyOfRecord = (r) => (prefix.has(r.sourceFile) ? `${prefix.get(r.sourceFile)}#${r.sourceOrdinal}` : '');
  let nextSeed = 'x';
  const fakeCrypto = { ...crypto, randomUUID: () => nextSeed };
  const nodes = new Map();
  const node = (id) => {
    if (!nodes.has(id)) nodes.set(id, { innerHTML: '', textContent: '', dataset: {}, setAttribute() {}, addEventListener() {}, querySelectorAll: () => [], classList: { toggle() {}, add() {}, remove() {} }, close() {}, showModal() {} });
    return nodes.get(id);
  };
  const ctx = vm.createContext({
    console: { ...console, log() {} }, crypto: fakeCrypto, URL, URLSearchParams, structuredClone, queueMicrotask: () => {},
    location: new URL('https://archive.test/archive/workspace.html'), history: { pushState() {}, replaceState() {} }, scrollY: 0, scrollTo() {},
    setTimeout: () => 0, clearTimeout() {}, matchMedia: () => ({ matches: false }),
    localStorage: { getItem: () => null, setItem() {}, removeItem() {} },
    document: { baseURI: 'https://archive.test/archive/workspace.html', getElementById: node, querySelector: () => null, querySelectorAll: () => [], body: { dataset: {} }, addEventListener() {} },
    addEventListener() {}, fetch: async () => { throw new Error('no network'); },
    Archive2Core: core, Archive2UnifiedUnits: Unified, Archive2QuickPools: Quick, Archive2UnitTree: Tree, Archive2Similar: Similar,
    ProblemBankMeta: require('../archive/problem-bank-meta.js'), Archive2Canonical: core.Canonical,
    Archive2Output: require('../archive/archive2-output.js'), Archive2Papers: require('../archive/archive2-papers.js'),
    Archive2History: require('../archive/archive2-history.js'), Archive2Source: archiveSource,
  });
  ctx.window = ctx;
  loadWorkspace(ctx, 'render = () => {}; save = () => {}; globalThis.workspaceTest = { state, scopeOptions, planRows, pool, generate };');
  const w = ctx.workspaceTest;
  w.state.catalog = data;
  w.state.byUid = new Map(data.records.map((r) => [r.questionUid, r]));
  w.state.finderIndex = core.buildFinderIndex(data);
  w.state.indexVersion = data.indexVersion;
  w.state.filters = { grade: '고1' };
  // the unit with the most original/similar family members inside its own pool (measured, not named)
  const scopes = w.scopeOptions().filter((s) => !s.unclassified && s.count > 0);
  const pairExtra = (scope) => {
    w.state.scopes = [scope.key]; w.state.distribution = 'pool'; w.state.count = 20;
    const pool = w.pool().filter((r) => core.generalUseEligibility(r).ok);
    return { scope, extra: pool.length - new Set(pool.map((r) => familyOfRecord(r) || r.questionUid)).size };
  };
  const best = scopes.map(pairExtra).sort((a, b) => b.extra - a.extra)[0];
  assert.ok(best.extra > 0, 'the catalog has a unit whose pool holds variants of one original question');
  for (const seed of ['s1', 's2', 's3', 's4', 's5']) {
    nextSeed = seed;
    w.state.scopes = [best.scope.key]; w.state.distribution = 'pool'; w.state.count = 20;
    w.state.selected = []; w.state.rows = w.planRows();
    w.generate();
    assert.equal(w.state.selected.length, 20, 'the requested count is met');
    assert.deepEqual(duplicates(w.state.selected.map(familyOfRecord).filter(Boolean)), [], 'no original/similar family twice, seed ' + seed);
  }
});
