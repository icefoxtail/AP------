// Unified 2022-based unit layer for 문제지 만들기 (user decision 2026-10-29).
// Runs against the real production catalog: every assertion below is about actual records.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const core = require('../archive/archive2-core.js');
const archiveSource = require('../archive/archive2-source.js');
const Unified = require('../archive/archive2-unified-units.js');
const UnitCore = require('../archive/unit-past-exams-core.js');
const { productionCatalog } = require('./helpers/archive2-scope-harness.cjs');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, 'archive', file), 'utf8');
const plain = value => JSON.parse(JSON.stringify(value));

let catalogPromise;
const catalog = () => (catalogPromise ||= productionCatalog().then(result => result.data));

function harness(data) {
  const events = new Map(), nodes = new Map(), storage = new Map();
  const node = id => {
    if (!nodes.has(id)) nodes.set(id, {
      innerHTML: '', textContent: '', dataset: {},
      setAttribute() {}, addEventListener() {}, querySelectorAll: () => [],
      classList: { toggle() {}, add() {}, remove() {} }, close() {}, showModal() {},
    });
    return nodes.get(id);
  };
  const ctx = vm.createContext({
    console, crypto, URL, URLSearchParams, structuredClone,
    location: new URL('https://archive.test/archive/workspace.html'),
    history: { pushState() {}, replaceState() {} },
    scrollY: 0, scrollTo() {},
    setTimeout: () => 0, clearTimeout() {}, matchMedia: () => ({ matches: false }),
    localStorage: { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) },
    document: {
      baseURI: 'https://archive.test/archive/workspace.html',
      getElementById: node, querySelector: () => null, querySelectorAll: () => [],
      body: { dataset: {} },
      addEventListener: (name, callback) => {
        if (!events.has(name)) events.set(name, []);
        events.get(name).push(callback);
      },
    },
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
  vm.runInContext(source.slice(0, startup) + `
    render = () => {};
    save = () => {};
    globalThis.workspaceTest = {state, scopeOptions, renderScopes, renderHealth, unifiedHealth, unifiedIndex, planRows, request, pool,
      draft, applyDraft, generate, review, applySourceRoute, filterMarkup, reconcileUnifiedFilters, compactSaveFilters,
      selectedScopeOptions, workspaceMatches, workspaceEligibility, applySavedPaperRevision};
  })();`, ctx);
  const w = ctx.workspaceTest;
  w.state.catalog = data;
  w.state.useMode = 'general';
  w.state.byUid = new Map(data.records.map(row => [row.questionUid, row]));
  w.state.finderIndex = core.buildFinderIndex(data);
  w.state.indexVersion = data.indexVersion;
  return {
    w, ctx,
    async change(group, filter, value) {
      for (const callback of events.get('change') || [])
        await callback({ target: { dataset: { group, filter }, value } });
    },
  };
}

const GRADES = ['중1', '중2', '중3', '고1', '고2'];
const eligible = record => core.generalUseEligibility(record).ok;

test('the user decision is recorded as a display/selection-only policy and matches the module', () => {
  const policy = JSON.parse(read('data/archive2-unified-unit-policy.json'));
  for (const [key, value] of Object.entries(Unified.POLICY))
    assert.deepEqual(policy[key], value, key);
  assert.equal(policy.decidedBy, 'user');
  assert.equal(policy.decidedAt, '2026-10-29');
  assert.equal(policy.scope, 'DISPLAY_AND_SELECTION_GROUPING_ONLY');
  assert.equal(policy.keysUnchanged, true);
  assert.equal(policy.curriculumKeyConversion, false);
  assert.equal(policy.sourceAnnotationUsagePolicy.releasedCount, policy.sourceAnnotationUsagePolicy.released.length);
  assert.equal(policy.sourceAnnotationUsagePolicy.releasedCount, 27);
  for (const row of policy.sourceAnnotationUsagePolicy.released) {
    assert.match(row.questionUid, /^qid_v1_[0-9a-f]{64}$/);
    assert.ok(row.reasonCodes.length >= 2, row.questionUid);
  }
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'tools/archive-pages-release-manifest.json'), 'utf8'));
  assert.ok(manifest.archiveRootFiles.includes('archive2-unified-units.js'));
  assert.ok(manifest.archiveDataFiles.includes('archive2-unified-unit-policy.json'));
  const html = read('workspace.html');
  const order = ['archive2-core.js', 'unit-past-exams-core.js', 'archive2-unified-units.js', 'archive2-workspace.js']
    .map(file => html.indexOf(file));
  assert.ok(order.every(position => position > 0) && order.every((position, i) => !i || position > order[i - 1]),
    'shared unit modules must load between the core and the workspace');
});

test('source hold annotations are not usage gates; the strict approval metric is untouched', async () => {
  const data = await catalog();
  const policy = JSON.parse(read('data/archive2-unified-unit-policy.json'));
  const byUid = new Map(data.records.map(record => [record.questionUid, record]));
  for (const row of policy.sourceAnnotationUsagePolicy.released) {
    const record = byUid.get(row.questionUid);
    assert.ok(record, row.questionUid);
    assert.equal(eligible(record), true, `${row.sourceFile}#${row.sourceOrdinal}`);
  }
  const base = data.records.find(record => core.basicEligibility(record, { canonicalAuthority: data.canonicalAuthority }).ok);
  for (const change of [{ sourceIssueHold: true }, { sourceDefectCandidate: true },
    { sourceQualityDisposition: 'SOURCE_BLOCKED' }, { sourceStatus: 'HOLD' }, { reviewStatus: 'HOLD' }]) {
    const record = { ...base, ...change };
    assert.equal(core.generalUseEligibility(record).ok, true, JSON.stringify(change));
  }
  // Strict approval stays strict.
  assert.equal(core.basicEligibility({ ...base, sourceIssueHold: true }, { canonicalAuthority: data.canonicalAuthority }).ok, false);
  assert.equal(core.basicEligibility({ ...base, sourceQualityDisposition: 'SOURCE_BLOCKED' }, { canonicalAuthority: data.canonicalAuthority }).ok, false);
  // Technical gates remain.
  assert.equal(core.generalUseEligibility({ ...base, identityStatus: 'UNRESOLVED' }).ok, false);
  assert.equal(core.generalUseEligibility({ ...base, sourceIntegrityStatus: 'UNRESOLVED' }).ok, false);
  assert.equal(core.generalUseEligibility({ ...base, sourceFingerprint: '' }).ok, false);
});

test('unified classification agrees with every 단원별 기출 classification (shared maps, legacy fields)', async () => {
  const data = await catalog();
  const context = { window: {} };
  context.window = context;
  vm.runInNewContext(read('question-index.js'), context);
  const index = context.questionIndex || context.window.questionIndex;
  assert.ok(Array.isArray(index) && index.length > 20000);
  const profileByGrade = Unified.GRADE_PROFILE;
  const unified = Unified.buildIndex(data.records, { projectionPolicy: data.projectionPolicy });
  // Question numbers are only an identity when they are unique inside their file.
  const entryByIdentity = new Map(), repeated = new Set();
  for (const entry of unified.byRecord.values()) {
    const identity = `${entry.record.sourceFile}#${entry.record.sourceQuestionNo}`;
    if (entryByIdentity.has(identity)) repeated.add(identity);
    entryByIdentity.set(identity, entry);
  }
  let compared = 0;
  for (const row of index) {
    const profileId = profileByGrade[row.grade || row.sourceGrade];
    if (!profileId) continue;
    const result = UnitCore.classifyRecord(row, profileId);
    if (result.status !== 'classified') continue;
    const identity = `${UnitCore.normalizePath(row.sourceFile)}#${UnitCore.getQuestionNo(row)}`;
    const entry = repeated.has(identity) ? null : entryByIdentity.get(identity);
    if (!entry) continue;
    compared++;
    assert.equal(entry.unitKey, result.unitKey, `${row.sourceFile}#${row.id}`);
  }
  assert.ok(compared > 15000, `compared ${compared} classified question-index rows`);
});

test('every catalog record with a grade is placed; the only unplaced ones lack a registered grade', async () => {
  const data = await catalog();
  const index = Unified.buildIndex(data.records, { projectionPolicy: data.projectionPolicy });
  const { overall } = index.stats;
  assert.equal(overall.total, data.records.length);
  assert.equal(overall.placed + overall.unplaced, overall.total);
  assert.deepEqual(Object.keys(overall.unplacedReasons), overall.unplaced ? ['GRADE_UNRESOLVED'] : []);
  for (const record of index.unplacedRecords) assert.ok(!(record.effectiveBrowseGrade || record.sourceGrade));
  // Far more than the canonical-parent scope list could place (28.3%).
  assert.ok(overall.placed / overall.total > 0.85, `placed ${overall.placed}/${overall.total}`);
  assert.ok(overall.unitPlaced / overall.total > 0.75, `unit-placed ${overall.unitPlaced}/${overall.total}`);
  for (const record of data.records) {
    const entry = index.byRecord.get(record);
    if (!entry) continue;
    // Display grouping only: the record itself is never rewritten.
    assert.ok(!('unifiedUnitKey' in record));
  }
});

test('compose shows one clean unit list per grade with 2015 and 2022 items merged', async () => {
  const data = await catalog();
  for (const grade of GRADES) {
    const { w } = harness(data);
    w.state.filters = { grade };
    const scopes = w.scopeOptions();
    assert.ok(scopes.length >= 8, `${grade} has ${scopes.length} scopes`);
    const labels = scopes.map(scope => scope.fullLabel);
    assert.equal(new Set(labels).size, labels.length, `${grade} duplicate labels`);
    for (const scope of scopes) {
      assert.ok(scope.unified && scope.basicScope && scope.count > 0, scope.key);
      assert.ok(!/·\s*(2015|2022|통합)\s*$/.test(scope.label), scope.label);
      assert.equal(scope.count, scope.scopeQuestionUids.length);
      assert.equal(new Set(scope.scopeQuestionUids).size, scope.count);
    }
    // A UID is counted once across the whole list and equals the eligible placed view.
    const all = scopes.flatMap(scope => scope.scopeQuestionUids);
    assert.equal(new Set(all).size, all.length);
    const index = w.unifiedIndex();
    const expected = new Set(index.views[grade].filter(entry => eligible(entry.record)).map(entry => entry.uid));
    assert.equal(all.length, expected.size, grade);
    // 단원 미분류 comes last inside its subject group.
    const bySubject = new Map();
    for (const scope of scopes) bySubject.set(scope.L1, [...(bySubject.get(scope.L1) || []), scope]);
    for (const rows of bySubject.values())
      assert.deepEqual(rows.map(row => row.unclassified), [...rows.map(row => row.unclassified)].sort((a, b) => a - b));
    assert.ok(w.renderScopes().includes('2015·2022'), 'the screen explains the unified list');
  }
  const { w } = harness(data);
  w.state.filters = { grade: '고1' };
  const scopes = w.scopeOptions();
  assert.deepEqual(plain([...new Set(scopes.map(scope => scope.L1))].filter(label => !/미정/.test(label))), ['공통수학1', '공통수학2']);
});

test('고2·고3 subjects, the optional original-curriculum filter and the subject filter narrow one list', async () => {
  const data = await catalog();
  const { w } = harness(data);
  w.state.filters = { grade: '고2' };
  const all = w.scopeOptions();
  assert.deepEqual(plain([...new Set(all.map(scope => scope.L1))].filter(label => label !== Unified.NO_SUBJECT_LABEL)),
    ['대수', '미적분Ⅰ', '확률과 통계', '미적분Ⅱ', '기하']);
  w.state.filters = { grade: '고2', semanticSubject: 'ALGEBRA' };
  const algebra = w.scopeOptions();
  assert.ok(algebra.length && algebra.every(scope => scope.L1 === '대수'));
  assert.ok(algebra.reduce((n, scope) => n + scope.count, 0) < all.reduce((n, scope) => n + scope.count, 0));
  const index = w.unifiedIndex();
  const count = filters => (w.state.filters = filters, w.scopeOptions().reduce((n, scope) => n + scope.count, 0));
  const total = count({ grade: '중2' });
  const y2015 = count({ grade: '중2', originalCurriculum: '2015' });
  const y2022 = count({ grade: '중2', originalCurriculum: '2022' });
  assert.ok(y2015 > 0 && y2022 > 0 && y2015 + y2022 <= total);
  for (const curriculum of ['2015', '2022']) {
    w.state.filters = { grade: '중2', originalCurriculum: curriculum };
    for (const scope of w.scopeOptions())
      for (const uid of scope.scopeQuestionUids)
        assert.equal(index.byUid.get(uid).originalCurriculum, curriculum);
  }
  // The filter is a selection aid only: it never reaches the replayed/saved request.
  w.state.filters = { grade: '중2', originalCurriculum: '2022', semanticSubject: '', curriculumKey: '2022', courseKey: 'M2-1' };
  const filters = w.request().filters;
  for (const key of ['originalCurriculum', 'semanticSubject', 'curriculumKey', 'courseKey', 'family'])
    assert.ok(!(key in filters), key);
});

test('a paper mixing 2015 and 2022 items of one unit passes review and the saved-paper/server filter contract', async () => {
  const data = await catalog();
  const { w } = harness(data);
  w.state.filters = { grade: '고1' };
  const index = w.unifiedIndex();
  const scope = w.scopeOptions()
    .filter(candidate => !candidate.unclassified)
    .map(candidate => ({
      candidate,
      curricula: new Set(candidate.scopeQuestionUids.map(uid => index.byUid.get(uid).originalCurriculum)),
    }))
    .filter(row => row.curricula.has('2015') && row.curricula.has('2022'))
    .sort((a, b) => a.candidate.count - b.candidate.count)[0]?.candidate;
  assert.ok(scope, 'a unit with both curricula exists');
  w.state.scopes = [scope.key];
  w.state.distribution = 'pool';
  w.state.count = Math.min(scope.count, 24);
  // Pool selection draws from the whole unit; make sure both curricula are available to it.
  w.generate();
  assert.ok(w.state.selected.length > 0);
  assert.equal(w.review().hardFailures.length, 0, JSON.stringify(w.review()));
  // Force a paper that contains both curricula (selection is recency/random based).
  const mixed = ['2015', '2022'].flatMap(curriculum =>
    scope.scopeQuestionUids.filter(uid => index.byUid.get(uid).originalCurriculum === curriculum).slice(0, 3));
  w.state.distribution = 'custom';
  w.state.custom = { [scope.key]: { count: mixed.length } };
  const request = w.request();
  const rowId = request.rows[0].id;
  w.state.selected = mixed.map(uid => ({ ...w.state.byUid.get(uid), rowId }));
  w.state.rows = request.rows;
  const result = core.review(w.state.selected, w.request(true));
  assert.notEqual(result.status, 'HARD_BLOCK', JSON.stringify(result));
  assert.equal(new Set(w.state.selected.map(record => index.byUid.get(record.questionUid).originalCurriculum)).size, 2);
  // Server contract: allowed keys, non-empty primaryPaths, and the worker replays every question.
  const saved = await import('../apmath/worker-backup/worker/helpers/archive-saved-papers.js');
  const filters = w.compactSaveFilters(w.request(true).filters);
  await saved.computeSavedPaperRequestHash({
    schema_version: saved.SAVED_PAPER_SCHEMA,
    save_batch_id: crypto.randomUUID(),
    index_version: data.indexVersion,
    selection_filters: filters,
    papers: [{ part_index: 0, questions: [] }],
  });
  assert.ok(filters.primaryPaths.length > 0);
  for (const record of w.state.selected) {
    assert.equal(core.generalUseEligibility(record).ok, true);
    assert.equal(core.matches(record, filters, {
      useMode: 'general', canonicalAuthority: data.canonicalAuthority, projectionPolicy: data.projectionPolicy,
    }), true, record.questionUid);
  }
});

test('questions without unit evidence stay selectable in a per-subject 단원 미분류 scope', async () => {
  const data = await catalog();
  const { w } = harness(data);
  let total = 0;
  for (const grade of GRADES) {
    w.state.filters = { grade };
    const scopes = w.scopeOptions().filter(scope => scope.unclassified);
    for (const scope of scopes) {
      assert.equal(scope.label, Unified.UNCLASSIFIED_LABEL);
      total += scope.count;
    }
  }
  assert.ok(total > 1000, `unclassified-but-offered ${total}`);
  w.state.filters = { grade: '중3' };
  const scope = w.scopeOptions().find(row => row.unclassified);
  w.state.scopes = [scope.key];
  w.state.distribution = 'pool';
  w.state.count = 5;
  w.generate();
  assert.equal(w.state.selected.length, 5);
  assert.equal(w.review().hardFailures.length, 0, JSON.stringify(w.review()));
});

test('2026 팔마중 중3 2학기 중간 and 팔마고 고2 1학기 기말 now produce scopes and a preview via the source route', async () => {
  const data = await catalog();
  for (const [file, grade, expectedCount] of [
    ['original/middle/m3/2mid/26_팔마중_2학기_중간_중3_기출.js', '중3', 24],
    ['original/high/h2/1final/26_팔마고_1학기_기말_고2_대수.js', '고2', 21],
  ]) {
    const { w } = harness(data);
    w.state.view = 'compose';
    w.state.urlSources = [file];
    w.state.urlRange = 'all';
    w.applySourceRoute();
    assert.equal(w.state.filters.grade, grade);
    assert.deepEqual(plain(w.state.sources), [file]);
    const scopes = w.scopeOptions();
    assert.ok(scopes.length >= 1, file);
    assert.equal(scopes.reduce((n, scope) => n + scope.count, 0), expectedCount, file);
    assert.equal(w.state.scopes.length, scopes.length, 'range=all selects every offered unit');
    w.generate();
    assert.equal(w.state.selected.length, expectedCount, file);
    assert.ok(w.state.selected.every(record => record.sourceFile === file));
    assert.equal(w.review().hardFailures.length, 0, JSON.stringify(w.review()));
  }
});

test('drafts from the per-curriculum list restore their questions and drop old scope keys with a visible notice', async () => {
  const data = await catalog();
  const { w } = harness(data);
  w.state.filters = { grade: '고1', curriculumKey: '2022', courseKey: '공통수학1' };
  w.state.filters = w.reconcileUnifiedFilters(w.state.filters);
  assert.equal(w.state.filters.originalCurriculum, '2022', 'old curriculum select becomes the optional filter');
  assert.equal(w.state.filters.semanticSubject, 'COMMON_MATH_1');
  assert.equal(w.state.filters.curriculumKey, '');
  w.state.filters = { grade: '고1' };
  const scope = w.scopeOptions().find(row => !row.unclassified);
  w.state.scopes = [scope.key];
  w.state.distribution = 'pool';
  w.state.count = 6;
  w.generate();
  const fresh = plain(w.draft());
  assert.deepEqual(fresh.scopes, [scope.key]);
  // Same-version unified draft keeps its scope.
  w.applyDraft(plain(fresh));
  assert.deepEqual(plain(w.state.scopes), [scope.key]);
  assert.equal(w.state.scopeNotice, '');
  // An old draft: per-curriculum scope key and path-only scope source, unknown old subject value.
  const old = plain(fresh);
  old.scopes = ['scope-3-입체도형의겉넓이와부피-2015'];
  old.scopeSourcePaths = ['["2015","M1-2","x","y"]'];
  old.filters = { grade: '고1', curriculumKey: '2015', courseKey: '', semanticSubject: 'H1_2015_MATH_UP' };
  w.applyDraft(old);
  assert.deepEqual(plain(w.state.scopes), []);
  assert.match(w.state.scopeNotice, /제외/);
  assert.equal(w.state.selected.length, fresh.selected.length, 'the frozen paper itself is kept');
  assert.equal(w.state.filters.semanticSubject, '', 'an unknown old subject is dropped');
  assert.equal(w.state.filters.originalCurriculum, '2015');
  assert.match(w.renderScopes(), /제외/);
});

test('compose list stays fast on the real catalog (cold 500 ms budget)', async () => {
  const data = await catalog();
  const measurements = [];
  for (const grade of GRADES) {
    for (const semanticSubject of ['', grade === '고2' ? 'ALGEBRA' : '']) {
      const { w } = harness(data);
      w.state.filters = { grade, semanticSubject };
      w.unifiedIndex();
      let best = Infinity;
      for (let attempt = 0; attempt < 3; attempt++) {
        const started = performance.now();
        w.scopeOptions();
        best = Math.min(best, performance.now() - started);
      }
      measurements.push([grade, semanticSubject, Math.round(best)]);
      assert.ok(best < 500, `${grade}/${semanticSubject}: ${best.toFixed(0)}ms`);
    }
  }
  // Building the shared index happens once per catalog load.
  const started = performance.now();
  Unified.buildIndex(data.records, { projectionPolicy: data.projectionPolicy });
  assert.ok(performance.now() - started < 1500, 'index build');
  console.log('unified scope ms', JSON.stringify(measurements));
});

test('data status view describes the unified policy and counts what the unified list places', async () => {
  const data = await catalog();
  const { w } = harness(data);
  const health = w.unifiedHealth();
  assert.ok(health.placed > 20000);
  assert.equal(health.placed, health.unit + health.unclassified);
  assert.deepEqual(Object.keys(health.unplacedReasons), health.unplaced ? ['GRADE_UNRESOLVED'] : []);
  w.state.healthUnified = health;
  w.state.healthComposeScope = health.placed;
  const html = w.renderHealth();
  assert.match(html, /교육과정 통합 표시/);
  assert.match(html, /원본 교육과정·키·메타데이터는 바꾸지 않습니다/);
  assert.match(html, /archive2-unified-unit-policy\.json/);
});

test('a saved paper made from fallback-only (non-canonical) questions can be reopened as a revision draft', async () => {
  const data = await catalog();
  const { w } = harness(data);
  // Questions whose raw path key is blank but whose general-use fallback taxonomy is complete:
  // the saved filters carry the general-mode key, the old strict check would not know it.
  const fallbackOnly = new Set(data.records
    .filter(record => eligible(record) && core.pathKey(record, 4) !== core.generalPathKey(record, 4))
    .map(record => record.questionUid));
  assert.ok(fallbackOnly.size > 1000, `fallback-only questions: ${fallbackOnly.size}`);
  const first = data.records.find(record => fallbackOnly.has(record.questionUid) && Unified.GRADE_PROFILE[record.sourceGrade]);
  w.state.filters = { grade: first.sourceGrade };
  const scope = w.scopeOptions().find(row => row.scopeQuestionUids.includes(first.questionUid));
  const sample = scope.scopeQuestionUids.filter(uid => fallbackOnly.has(uid)).slice(0, 3).map(uid => w.state.byUid.get(uid));
  assert.ok(sample.length >= 1 && sample.every(record => core.pathKey(record, 4) !== core.generalPathKey(record, 4)));
  w.state.scopes = [scope.key];
  w.state.distribution = 'custom';
  w.state.custom = { [scope.key]: { count: sample.length } };
  const request = w.request();
  w.state.rows = request.rows;
  w.state.selected = sample.map(record => ({ ...record, rowId: request.rows[0].id }));
  // A unit that holds only fallback-taxonomy questions records only general-mode path keys.
  const filters = {
    ...w.compactSaveFilters(w.request(true).filters),
    primaryPaths: [...new Set(sample.map(record => core.generalPathKey(record, 4)))],
  };
  assert.ok(filters.primaryPaths.every(key => key !== core.pathKey(sample[0], 4)));
  const paper = {
    id: '00000000-0000-4000-8000-000000000999',
    title: 'unified saved paper',
    snapshot_hash: 'b'.repeat(64),
    snapshot: {
      questions: sample.map(record => ({
        questionUid: record.questionUid, sourceFingerprint: record.sourceFingerprint,
        sourceArchiveFile: record.sourceFile, sourceOrdinal: record.sourceOrdinal, content: '<p>frozen</p>',
      })),
      meta: { title: 'unified saved paper', questionUids: sample.map(record => record.questionUid), printHeaderOptions: { title: 'unified saved paper' } },
      selectionFilters: filters,
    },
  };
  const fresh = harness(data).w;
  fresh.applySavedPaperRevision(plain(paper));
  assert.deepEqual(plain(fresh.state.selected.map(row => row.questionUid)), plain(sample.map(record => record.questionUid)));
  assert.equal(fresh.state.derivationSource.parentId, paper.id);
  // The same request stays valid when a (very large) unit would exceed the server's size limit.
  const big = w.compactSaveFilters({ ...filters, scopeQuestionUids: Array.from({ length: 4000 }, (_, i) => 'qid_v1_' + String(i).padStart(64, '0')) });
  assert.ok(JSON.stringify(big).length < 150000);
  assert.ok(big.scopeQuestionUids.every(uid => w.state.selected.some(record => record.questionUid === uid)));
});

test('per-question identity rules of 단원별 기출 are honoured and never served from the key/label cache', async () => {
  const data = await catalog();
  const special = data.records.find(record =>
    record.sourceFile === 'original/high/h2/1final/25_제일고_1학기_기말_고2_대수c.js' && String(record.sourceQuestionNo) === '22');
  assert.ok(special, 'the explicitly ignored question exists');
  assert.equal(UnitCore.hasIdentityRule({ sourceFile: special.sourceFile, id: 22 }, 'h2'), true);
  assert.equal(UnitCore.hasIdentityRule({ sourceFile: special.sourceFile, id: 21 }, 'h2'), false);
  assert.equal(UnitCore.hasIdentityRule({ sourceFile: 'original/high/h1/1final/22_효천고_1학기_기말_고1_기출.js', id: 12 }, 'h1'), true);
  // A normal question with the same legacy key and label is classified first, so a cache keyed
  // by key/label alone would wrongly classify the ignored one as well.
  const twin = data.records.find(record => record !== special && record.sourceGrade === '고2' &&
    record.legacyStandardUnitKey === special.legacyStandardUnitKey && record.legacyStandardUnit === special.legacyStandardUnit);
  assert.ok(twin, 'a twin with the same key and label exists');
  const index = Unified.buildIndex([twin, special], { projectionPolicy: data.projectionPolicy });
  assert.equal(index.byRecord.get(twin).unclassified, false);
  assert.equal(index.byRecord.get(special).unclassified, true);
  assert.equal(UnitCore.classifyRecord({ sourceFile: special.sourceFile, id: 22, standardUnitKey: special.legacyStandardUnitKey, standardUnit: special.legacyStandardUnit }, 'h2').status, 'ignored');
});
