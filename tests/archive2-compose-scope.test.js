const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const core = require('../archive/archive2-core.js');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, 'archive', file), 'utf8');
const catalog = core.decodeCatalog(JSON.parse(read('data/archive2-catalog.json')));
const plain = value => JSON.parse(JSON.stringify(value));

function harness(data = structuredClone(catalog)) {
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
    Archive2Output: require('../archive/archive2-output.js'),
    Archive2Papers: require('../archive/archive2-papers.js'),
    Archive2History: require('../archive/archive2-history.js'),
    Archive2Source: {},
  });
  ctx.window = ctx;
  const source = read('archive2-workspace.js');
  const startup = source.lastIndexOf('  (async () => {');
  assert.ok(startup > 0);
  vm.runInContext(source.slice(0, startup) + `
    render = () => {};
    save = () => {};
    globalThis.workspaceTest = {state, scopeOptions, renderScopes, renderComposition, planRows, request, bucketButtons, newDraft, draft, applyDraft};
  })();`, ctx);
  const w = ctx.workspaceTest;
  w.state.catalog = data;
  w.state.byUid = new Map(data.records.map(row => [row.questionUid, row]));
  w.state.finderIndex = core.buildFinderIndex(data);
  w.state.indexVersion = data.indexVersion;
  return {
    w, ctx,
    async click(dataset) {
      for (const callback of events.get('click') || [])
        await callback({ target: { closest: () => ({ dataset }) } });
    },
    async change(group, filter, value) {
      for (const callback of events.get('change') || [])
        await callback({ target: { dataset: { group, filter }, value } });
    },
  };
}

function basicRecord(grade, change = {}) {
  const base = catalog.records.find(row => core.eligibility(row).ok);
  return {
    ...base, questionUid: 'qid_v1_' + crypto.createHash('sha256').update(grade).digest('hex'),
    sourceGrade: grade, effectiveBrowseGrade: grade, sourceFile: grade + '.js',
    curriculumKey: '2015', courseKey: /^중/.test(grade) ? `M${grade[1]}-1` : '공통수학1',
    L1: '원본 대단원', L2: '원본 세부단원', L3: '', L4: '',
    taxonomyStatus: 'UNKNOWN', foundationTaxonomyStatus: undefined,
    metaFoundationPackVersion: undefined, problemTypeKey: '', templateKey: '',
    reviewStatus: 'reviewed_pass', difficultyBucket: 2, difficultyConfidence: 'high',
    difficultyBoundaryFlag: 'NONE', legacyLevelCompatibility: 'NORMAL',
    curriculumApplicability: 'DEFAULT_SCOPE', defaultSelectable: true, metadataConflicts: [],
    ...change,
  };
}

test('BASIC selection and final review accept UNKNOWN advanced taxonomy for every grade', () => {
  for (const grade of ['중1', '중2', '중3', '고1', '고2', '고3']) {
    const row = basicRecord(grade);
    const path = core.pathKey(row, 4);
    const request = { filters: { grade, primaryPaths: [path] }, rows: [{ id: 'basic', paths: [path], count: 1 }] };
    assert.equal(core.basicEligibility(row).ok, true, grade);
    const result = core.selectBlueprint([row], request);
    assert.equal(result.ok, true, grade);
    assert.notEqual(core.review(result.selected, request).status, 'HARD_BLOCK', grade);
    assert.equal(core.basicEligibility({ ...row, foundationTaxonomyStatus: 'UNKNOWN' }).ok, true);
    assert.equal(core.matches({ ...row, L3: 'unverified' }, { grade, L3: 'rpm:unverified' }), false);
  }
});

test('source units stay visible and counted despite quality holds, missing difficulty and history exclusion', () => {
  const row = basicRecord('중3', { sourceStatus: 'HOLD', reviewStatus: 'HOLD', difficultyBucket: 'UNKNOWN' });
  const { w } = harness({ ...catalog, taxonomy: [], records: [row] });
  w.state.filters = { grade: '중3', L3: 'mf:missing', difficultyBuckets: [5] };
  w.state.rounds = [{ questionUids: [row.questionUid] }];
  const scopes = w.scopeOptions();
  assert.equal(scopes.length, 1);
  assert.equal(scopes[0].count, 1);
  assert.equal(scopes[0].eligibleCount, 0);
  assert.match(w.renderScopes(), /원본 세부단원/);
  assert.match(w.renderScopes(), /1문항/);
  assert.equal(core.eligibility(row).ok, false);
});

test('actual catalog and all active runtime packs expose every middle-school source question in scopes', async () => {
  const { w, ctx } = harness();
  vm.runInContext(read('meta-foundation-runtime.js'), ctx);
  const overlaid = await ctx.applyArchiveMetaFoundationCatalog(catalog);
  for (const data of [catalog, overlaid]) {
    w.state.catalog = data;
    for (const grade of ['중1', '중2', '중3']) {
      w.state.filters = { grade };
      const expected = data.records.filter(row => row.effectiveBrowseGrade === grade);
      const scopes = w.scopeOptions();
      assert.ok(expected.length > 1000, grade);
      assert.equal(scopes.reduce((sum, scope) => sum + scope.count, 0), expected.length, grade);
      for (const row of expected)
        assert.ok(scopes.some(scope => scope.count > 0 && scope.paths.includes(core.pathKey(row, 4))), row.sourceFile + '#' + row.sourceOrdinal);
    }
  }
  w.state.filters = { grade: '중3' };
  for (const unit of ['실수', '다항식', '이차방정식', '이차함수', '삼각비', '원', '통계'])
    assert.ok(w.scopeOptions().some(scope => scope.L1.includes(unit) && scope.count > 0), unit);
});

test('high-school scope inventory retains source units for each subject projection', () => {
  const { w } = harness();
  for (const grade of ['고1', '고2', '고3']) {
    for (const { value: semanticSubject } of core.subjectProjectionOptions(grade)) {
      w.state.filters = { grade, semanticSubject };
      const expected = catalog.records.filter(row => core.matches(row, w.state.filters));
      assert.equal(w.scopeOptions().reduce((sum, scope) => sum + scope.count, 0), expected.length, grade + '/' + semanticSubject);
    }
  }
});

test('grade changes, generic Compose entry and new drafts clear stale source restrictions', async () => {
  const { w, change, click } = harness();
  const highSource = catalog.records.find(row => row.effectiveBrowseGrade === '고1').sourceFile;
  for (const group of ['compose', 'find']) {
    w.state.sources = [highSource];
    await change(group, 'grade', '중3');
    assert.deepEqual(plain(w.state.sources), []);
  }
  w.state.find = { grade: '중3' };
  w.state.filters = { grade: '고1', yearFrom: 2099, L3: 'mf:old' };
  w.state.sources = [highSource];
  await click({ action: 'go-compose' });
  assert.deepEqual(plain(w.state.sources), []);
  assert.equal(w.state.filters.grade, '중3');
  assert.equal(w.state.filters.yearFrom, undefined);
  assert.equal(w.state.filters.L3, undefined);
  assert.equal(w.scopeOptions().reduce((sum, row) => sum + row.count, 0), 1893);
  w.state.sources = [highSource];
  w.newDraft();
  assert.deepEqual(plain(w.state.sources), []);
  w.state.sources = [highSource];
  w.state.view = 'find';
  await click({ view: 'compose' });
  assert.deepEqual(plain(w.state.sources), []);
});

test('explicit selected-source entry and saved draft restoration retain the intended sources', async () => {
  const { w, click } = harness();
  const source = catalog.records.find(row => row.effectiveBrowseGrade === '중3').sourceFile;
  w.state.find = { grade: '중3' };
  w.state.sources = [source];
  await click({ action: 'go-compose', useSources: 'true' });
  assert.deepEqual(plain(w.state.sources), [source]);
  assert.equal(w.scopeOptions().reduce((sum, scope) => sum + scope.count, 0), catalog.records.filter(row => row.sourceFile === source).length);
  const saved = w.draft();
  w.newDraft();
  w.applyDraft(saved);
  assert.deepEqual(plain(w.state.sources), [source]);
});

test('all changed browser scripts use new cache versions', () => {
  const html = read('workspace.html');
  for (const file of ['archive2-core.js', 'archive2-workspace.js', 'meta-foundation-runtime.js'])
    assert.match(html, new RegExp(file.replace('.', '\\.') + '\\?v=20260927-'));
});

test('fresh BASIC includes every difficulty and unclassified metadata without preselecting 2 and 3', () => {
  for (const grade of ['중1', '중2', '중3', '고1', '고2', '고3']) {
    const records = [1, 2, 3, 4, 5, 'UNKNOWN'].map((difficultyBucket, i) => basicRecord(grade, {
      questionUid: 'qid_v1_' + crypto.createHash('sha256').update(grade + i).digest('hex'),
      difficultyBucket, reviewStatus: undefined, curriculumApplicability: undefined,
      defaultSelectable: undefined,
    }));
    const { w } = harness({ ...catalog, records, taxonomy: [] });
    w.state.filters = { grade };
    w.state.scopes = w.scopeOptions().map(scope => scope.key);
    w.state.distribution = 'all';
    assert.deepEqual(plain(w.state.buckets), []);
    const request = w.request();
    assert.equal(request.rows[0].count, 6, grade);
    assert.deepEqual(plain(request.rows[0].difficultyBuckets), []);
    const result = core.selectBlueprint(records, request);
    assert.equal(result.ok, true, grade);
    assert.equal(result.selected.length, 6, grade);
    assert.notEqual(core.review(result.selected, request).status, 'HARD_BLOCK', grade);
    assert.doesNotMatch(w.renderScopes(), /자동 출제/);
    assert.match(w.renderComposition(), /전체 \(미지정 포함\)/);
  }
});

test('difficulty filters apply only after an explicit choice and can return to all', async () => {
  const records = [1, 2, 3, 4, 5, 'UNKNOWN'].map((difficultyBucket, i) => basicRecord('중3', {
    questionUid: 'qid_v1_' + crypto.createHash('sha256').update(String(i)).digest('hex'), difficultyBucket,
  }));
  const { w, click } = harness({ ...catalog, records, taxonomy: [] });
  w.state.filters = { grade: '중3' };
  await click({ action: 'bucket', bucket: '2' });
  await click({ action: 'bucket', bucket: '3' });
  w.state.scopes = w.scopeOptions().map(scope => scope.key);
  w.state.distribution = 'all';
  let request = w.request();
  assert.equal(request.rows[0].count, 2);
  let result = core.selectBlueprint(records, request);
  assert.equal(result.ok, true);
  assert.deepEqual(result.selected.map(row => row.difficultyBucket).sort(), [2, 3]);
  assert.equal(core.review([{ ...records[5], rowId: request.rows[0].id }, { ...records[1], rowId: request.rows[0].id }], request).status, 'HARD_BLOCK');
  await click({ action: 'bucket-all' });
  w.state.scopes = w.scopeOptions().map(scope => scope.key);
  assert.deepEqual(plain(w.state.buckets), []);
  assert.equal(w.request().rows[0].count, 6);
  await click({ action: 'bucket', bucket: '4' });
  await click({ action: 'bucket', bucket: '4' });
  assert.deepEqual(plain(w.state.buckets), []);
});

test('new entry, grade changes and new drafts restore BASIC all-difficulty defaults', async () => {
  const { w, click, change } = harness();
  w.state.buckets = [2, 3];
  w.state.custom = { old: { buckets: [4] } };
  w.newDraft();
  assert.deepEqual(plain(w.state.buckets), []);
  assert.deepEqual(plain(w.state.custom), {});
  w.state.buckets = [2, 3];
  await change('compose', 'grade', '중3');
  assert.deepEqual(plain(w.state.buckets), []);
  w.state.buckets = [2, 3];
  await click({ action: 'go-compose' });
  assert.deepEqual(plain(w.state.buckets), []);
});

test('old unopened 2/3 defaults migrate to all while saved explicit and generated-paper choices survive', () => {
  const { w } = harness();
  const old = plain(w.draft());
  old.buckets = [2, 3];
  delete old.difficultyFilterVersion;
  w.applyDraft(old);
  assert.deepEqual(plain(w.state.buckets), []);
  const explicit = { ...old, difficultyFilterVersion: 'optional-v1' };
  w.applyDraft(explicit);
  assert.deepEqual(plain(w.state.buckets), [2, 3]);
  const record = catalog.records.find(row => core.basicEligibility(row).ok);
  const generated = { ...old, selected: [{ questionUid: record.questionUid, rowId: 'paper', sourceFingerprint: record.sourceFingerprint }] };
  w.applyDraft(generated);
  assert.deepEqual(plain(w.state.buckets), [2, 3]);
});
