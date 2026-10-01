const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const core = require('../archive/archive2-core.js');
const { catalog, withTestAssignments } = require('./helpers/archive2-scope-harness.cjs');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, 'archive', file), 'utf8');
const plain = value => JSON.parse(JSON.stringify(value));

function harness(data = structuredClone(catalog)) {
  data = withTestAssignments(data);
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
    Archive2Canonical: core.Canonical,
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
    globalThis.workspaceTest = {state, scopeOptions, renderScopes, renderComposition, renderInspector, planRows, request, bucketButtons, newDraft, draft, applyDraft, saveWorkSignature};
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
  const base = catalog.records.find(row => core.basicEligibility(row, {
    canonicalAuthority: catalog.canonicalAuthority,
  }).ok);
  const parent = catalog.basicTaxonomy.find(row => row.grade === grade && row.defaultSelectable !== false);
  assert.ok(base && parent, 'test needs an actual source and canonical parent for ' + grade);
  const questionUid = change.questionUid || 'qid_v1_' + crypto.createHash('sha256').update(grade).digest('hex');
  const fileGrade = grade.startsWith('중') ? `middle/m${grade[1]}` : `high/h${grade[1]}`;
  return {
    ...base, ...parent,
    questionUid,
    sourceGrade: grade, effectiveBrowseGrade: grade,
    sourceFile: `original/${fileGrade}/1mid/test-${questionUid.slice(-12)}.js`,
    sourceOrdinal: Number(change.sourceOrdinal || 1),
    identityStatus: 'VERIFIED', sourceStatus: 'VERIFIED', sourceIntegrityStatus: 'VERIFIED',
    sourceFingerprint: crypto.createHash('sha256').update('full-source:' + questionUid).digest('hex'),
    assignmentFingerprint: crypto.createHash('sha256').update('assignment:' + questionUid).digest('hex'),
    curriculumKey: parent.curriculumKey, courseKey: parent.courseKey,
    L1: parent.L1, L2: parent.L2, L3: '', L4: '',
    taxonomyStatus: 'UNKNOWN', foundationTaxonomyStatus: undefined,
    metaFoundationPackVersion: undefined, problemTypeKey: '', templateKey: '',
    reviewStatus: 'reviewed_pass', difficultyBucket: 2, difficultyConfidence: 'high',
    difficultyBoundaryFlag: 'NONE', legacyLevelCompatibility: 'NORMAL',
    curriculumApplicability: 'DEFAULT_SCOPE', defaultSelectable: true, metadataConflicts: [],
    __testApprovedAssignment: true,
    ...change,
  };
}

test('고2·고3 browse는 승인된 shared semantic subject source pool을 공유하고 source metadata를 보존한다', () => {
  const { w } = harness(catalog);
  const originalSourceMetadata = new Map(catalog.records.map(record => [
    record.questionUid,
    [record.sourceGrade, record.curriculumKey, record.courseKey],
  ]));
  let nonEmptySharedPoolCount = 0;

  for (const { value: semanticSubject } of core.highSemanticSubjectOptions()) {
    const pools = Object.fromEntries(['고2', '고3'].map(grade => [grade, new Set(
      catalog.records
        .filter(record => core.eligibility(record, { canonicalAuthority: catalog.canonicalAuthority }).ok)
        .filter(record => core.matches(record, { grade, semanticSubject }, { catalog }))
        .map(record => record.questionUid),
    )]));
    const missingFromHigh3 = [...pools['고2']].filter(uid => !pools['고3'].has(uid));
    const missingFromHigh2 = [...pools['고3']].filter(uid => !pools['고2'].has(uid));
    assert.equal(missingFromHigh3.length, 0, `${semanticSubject} has items missing from 고3 browse`);
    assert.equal(missingFromHigh2.length, 0, `${semanticSubject} has items missing from 고2 browse`);
    if (pools['고2'].size > 0) {
      nonEmptySharedPoolCount += 1;
      assert.ok(pools['고2'].size > 0, `고2 ${semanticSubject} browse should not be empty`);
      assert.ok(pools['고3'].size > 0, `고3 ${semanticSubject} browse should not be empty`);
    }
  }

  w.state.filters = { grade: '고2', semanticSubject: 'ALGEBRA' };
  const high2UiPool = new Set(w.scopeOptions().flatMap(scope => scope.scopeQuestionUids));
  w.state.filters = { grade: '고3', semanticSubject: 'ALGEBRA' };
  const high3UiPool = new Set(w.scopeOptions().flatMap(scope => scope.scopeQuestionUids));
  assert.ok(high2UiPool.size > 0, '고2 ALGEBRA scope should contain selectable questions');
  assert.ok(high3UiPool.size > 0, '고3 ALGEBRA scope should contain selectable questions');
  assert.equal([...high2UiPool].filter(uid => !high3UiPool.has(uid)).length, 0);
  assert.equal([...high3UiPool].filter(uid => !high2UiPool.has(uid)).length, 0);

  assert.ok(nonEmptySharedPoolCount > 0, 'catalog should contain at least one shared semantic source pool');
  for (const record of catalog.records) {
    assert.deepEqual(
      [record.sourceGrade, record.curriculumKey, record.courseKey],
      originalSourceMetadata.get(record.questionUid),
      `browse must preserve source metadata for ${record.questionUid}`,
    );
  }
});

test('BASIC selection and final review accept UNKNOWN advanced taxonomy for every grade', () => {
  for (const grade of ['중1', '중2', '중3', '고1', '고2', '고3']) {
    const row = basicRecord(grade);
    const data = withTestAssignments({ ...catalog, records: [row] });
    const authority = data.canonicalAuthority;
    const path = core.pathKey(row, 4);
    const request = { filters: { grade, primaryPaths: [path] }, rows: [{ id: 'basic', paths: [path], count: 1 }], canonicalAuthority: authority };
    assert.equal(core.basicEligibility(row, { canonicalAuthority: authority }).ok, true, grade);
    const result = core.selectBlueprint([row], request);
    assert.equal(result.ok, true, grade);
    assert.notEqual(core.review(result.selected, request).status, 'HARD_BLOCK', grade);
    assert.equal(core.basicEligibility({ ...row, foundationTaxonomyStatus: 'UNKNOWN' }, { canonicalAuthority: authority }).ok, true);
    assert.equal(core.basicEligibility({ ...row, taxonomyStatus: 'HOLD' }, { canonicalAuthority: authority }).ok, true);
    assert.equal(core.basicEligibility({ ...row, basicTaxonomyStatus: 'HOLD' }, { canonicalAuthority: authority }).ok, true);
    assert.equal(core.matches({ ...row, L3: 'unverified' }, { grade, L3: 'rpm:unverified' }, { canonicalAuthority: authority }), false);
  }
});

test('source-only units never create cards; card counts and UID pools contain selectable records only', () => {
  const valid = basicRecord('중3');
  const rawOnly = {
    ...valid,
    questionUid: 'qid_v1_' + crypto.createHash('sha256').update('source-only').digest('hex'),
    sourceFile: valid.sourceFile.replace(/\.js$/, '-source-only.js'),
    sourceFingerprint: 'a'.repeat(64),
    assignmentFingerprint: 'b'.repeat(64),
    curriculumKey: '', courseKey: '', L1: 'RAW-source-only', L2: 'unpublished subunit',
    assignmentEvidence: null,
    __testApprovedAssignment: false,
  };
  const held = basicRecord('중3', {
    questionUid: 'qid_v1_' + crypto.createHash('sha256').update('held-only').digest('hex'),
    sourceFile: valid.sourceFile.replace(/\.js$/, '-held.js'),
    sourceFingerprint: 'c'.repeat(64), assignmentFingerprint: 'd'.repeat(64),
    reviewStatus: 'HOLD',
  });
  const data = withTestAssignments({ ...catalog, records: [valid, rawOnly, held] });
  const { w } = harness(data);
  w.state.filters = { grade: '중3' };
  const scopes = w.scopeOptions();
  assert.equal(scopes.some(scope => scope.L1 === 'RAW-source-only'), false);
  assert.ok(scopes.length > 0);
  for (const scope of scopes) {
    assert.equal(scope.count, scope.scopeQuestionUids.length, scope.key);
    assert.equal(scope.count, scope.eligibleCount, scope.key);
    assert.equal(new Set(scope.scopeQuestionUids).size, scope.scopeQuestionUids.length);
    assert.ok(!scope.scopeQuestionUids.includes(held.questionUid));
    assert.ok(!scope.scopeQuestionUids.includes(rawOnly.questionUid));
  }
});

test('actual catalog and all active runtime packs expose only canonical selectable middle-school UIDs', async () => {
  const { data: finalCatalog, runtime } = await require('./helpers/archive2-scope-harness.cjs').productionCatalog();
  const { w } = harness(finalCatalog);
  const repairOverlay = runtime.records.find(row => row.catalogIdentityRepairVerified);
  assert.ok(repairOverlay);
  const repaired = finalCatalog.records.find(row => row.questionUid === repairOverlay.questionUid);
  assert.equal(repaired.identityStatus, 'VERIFIED');
  assert.equal(repaired.sourceIntegrityStatus, 'VERIFIED');
  for (const data of [catalog, finalCatalog]) {
    w.state.catalog = data;
    for (const grade of ['중1', '중2', '중3']) {
      w.state.filters = { grade };
      const expected = data.records.filter(row => row.sourceGrade === grade &&
        core.matches(row, w.state.filters, w.state) && core.eligibility(row, w.state).ok &&
        core.basicScopeParent(row, data.basicScopeLinks, data.canonicalAuthority));
      const scopes = w.scopeOptions();
      const scopedUids = scopes.flatMap(scope => scope.scopeQuestionUids);
      assert.ok(expected.length > 0, grade);
      assert.equal(scopedUids.length, new Set(scopedUids).size, grade + ' unique scope UID count');
      assert.deepEqual(new Set(scopedUids), new Set(expected.map(row => row.questionUid)), grade);
      for (const row of expected)
        assert.ok(scopes.some(scope => scope.count > 0 && scope.paths.includes(core.pathKey(row, 4))), row.sourceFile + '#' + row.sourceOrdinal);
    }
  }
  w.state.filters = { grade: '중3' };
  for (const unit of ['실수', '다항식', '이차방정식', '이차함수', '삼각비', '원', '통계'])
    assert.ok(w.scopeOptions().some(scope => scope.L1.includes(unit) && scope.count > 0), unit);
});

test('high-school scope inventory retains only canonical selectable UIDs for each subject projection', () => {
  const { w } = harness();
  for (const grade of ['고1', '고2', '고3']) {
    for (const { value: semanticSubject } of core.subjectProjectionOptions(grade)) {
      w.state.filters = { grade, semanticSubject };
      const expected = catalog.records.filter(row => core.matches(row, w.state.filters, w.state) &&
        core.eligibility(row, w.state).ok && core.basicScopeParent(row, catalog.basicScopeLinks, catalog.canonicalAuthority));
      const scopedUids = w.scopeOptions().flatMap(scope => scope.scopeQuestionUids);
      assert.deepEqual(new Set(scopedUids), new Set(expected.map(row => row.questionUid)), grade + '/' + semanticSubject);
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
  const expectedMiddle = catalog.records.filter(row => row.sourceGrade === '중3' &&
    core.matches(row, { grade: '중3' }, w.state) && core.eligibility(row, w.state).ok &&
    core.basicScopeParent(row, catalog.basicScopeLinks, catalog.canonicalAuthority));
  assert.equal(new Set(w.scopeOptions().flatMap(row => row.scopeQuestionUids)).size,
    new Set(expectedMiddle.map(row => row.questionUid)).size);
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
  const expected = catalog.records.filter(row => row.sourceFile === source && core.matches(row, { grade: '중3', sourceFiles: [source] }, w.state) &&
    core.eligibility(row, w.state).ok && core.basicScopeParent(row, catalog.basicScopeLinks, catalog.canonicalAuthority));
  assert.deepEqual(new Set(w.scopeOptions().flatMap(scope => scope.scopeQuestionUids)), new Set(expected.map(row => row.questionUid)));
  const saved = w.draft();
  w.newDraft();
  w.applyDraft(saved);
  assert.deepEqual(plain(w.state.sources), [source]);
});

test('approved shared high2/high3 sources survive Finder-to-Compose in both browse directions', async () => {
  const base = catalog.records.find(row => row.sourceGrade === '고2' &&
    core.subjectProjectionForRecord(row, '', catalog.projectionPolicy));
  assert.ok(base, 'test needs a canonical high2 subject projection');
  const semanticSubject = core.subjectProjectionForRecord(base, '', catalog.projectionPolicy);
  const makeRecord = grade => {
    const sourceFile = `original/high/h${grade[1]}/1mid/shared-${grade}.js`;
    return {
      ...base,
      questionUid: 'qid_v1_' + crypto.createHash('sha256').update(`shared-compose:${grade}`).digest('hex'),
      sourceFile,
      sourceOrdinal: 1,
      sourceGrade: grade,
      effectiveBrowseGrade: grade,
      __testApprovedAssignment: true,
    };
  };
  const records = ['고2', '고3'].map(makeRecord);
  const exams = records.map(record => ({
    file: record.sourceFile,
    grade: record.sourceGrade,
    sourceGrade: record.sourceGrade,
    effectiveBrowseGrade: record.sourceGrade,
    school: `공유 ${record.sourceGrade}`,
    year: 2025,
    courseRanges: [],
    curriculums: [record.curriculumKey],
  }));
  const { w, click } = harness({ ...catalog, records, exams });
  const data = w.state.catalog;

  for (const [browseGrade, sourceGrade] of [['고2', '고3'], ['고3', '고2']]) {
    const record = data.records.find(row => row.sourceGrade === sourceGrade);
    const exam = data.exams.find(row => row.file === record.sourceFile);
    const filters = {
      grade: browseGrade,
      curriculumKey: record.curriculumKey,
      semanticSubject,
    };
    assert.equal(core.finderMatches(exam, filters, w.state.finderIndex), true,
      `${browseGrade} Finder should show the approved ${sourceGrade} source`);

    const uidsFor = activeFilters => data.records.filter(row => row.sourceFile === record.sourceFile &&
      core.matches(row, activeFilters, { catalog: data, projectionPolicy: data.projectionPolicy }) &&
      core.basicEligibility(row, { canonicalAuthority: data.canonicalAuthority }).ok)
      .map(row => row.questionUid).sort();
    const beforeUids = uidsFor(filters);
    const beforeMetadata = data.records.filter(row => row.sourceFile === record.sourceFile)
      .map(({ sourceGrade: rawGrade, curriculumKey, courseKey }) => ({ sourceGrade: rawGrade, curriculumKey, courseKey }));
    assert.deepEqual(beforeUids, [record.questionUid]);

    w.state.find = filters;
    w.state.sources = [record.sourceFile];
    await click({ action: 'go-compose', useSources: 'true' });

    assert.deepEqual(plain(w.state.sources), [record.sourceFile]);
    assert.deepEqual(uidsFor(w.state.filters), beforeUids,
      `${browseGrade} Compose should keep the same selected source UID set`);
    assert.deepEqual(data.records.filter(row => row.sourceFile === record.sourceFile)
      .map(({ sourceGrade: rawGrade, curriculumKey, courseKey }) => ({ sourceGrade: rawGrade, curriculumKey, courseKey })),
    beforeMetadata, 'source grade and curriculum identity remain unchanged');
  }
});

test('cross-grade sources without an approved canonical projection remain excluded', async () => {
  const base = catalog.records.find(row => row.sourceGrade === '고2' &&
    core.subjectProjectionForRecord(row, '', catalog.projectionPolicy));
  const semanticSubject = core.subjectProjectionForRecord(base, '', catalog.projectionPolicy);
  const sourceFile = 'original/high/h3/unapproved-shared.js';
  const record = {
    ...base,
    questionUid: 'qid_v1_' + crypto.createHash('sha256').update('unapproved-shared').digest('hex'),
    sourceFile,
    sourceOrdinal: 1,
    sourceGrade: '고3',
    effectiveBrowseGrade: '고3',
    __testApprovedAssignment: true,
  };
  const projectionPolicy = {
    ...catalog.projectionPolicy,
    high23SharedSubjects: catalog.projectionPolicy.high23SharedSubjects.filter(row =>
      !(row.grade === '고3' && row.curriculumKey === record.curriculumKey && row.courseKey === record.courseKey)),
  };
  const exam = { file: sourceFile, grade: '고3', sourceGrade: '고3', effectiveBrowseGrade: '고3', courseRanges: [] };
  const data = {
    ...catalog,
    records: [record],
    exams: [exam],
    projectionPolicy,
    canonicalAuthority: { ...catalog.canonicalAuthority, projectionPolicy },
  };
  const { w, click } = harness(data);
  const filters = { grade: '고2', curriculumKey: record.curriculumKey, semanticSubject };

  assert.equal(core.finderMatches(exam, filters, w.state.finderIndex), false);
  assert.equal(core.matches(record, filters, { catalog: w.state.catalog, projectionPolicy }), false);
  w.state.find = filters;
  w.state.sources = [sourceFile];
  await click({ action: 'go-compose', useSources: 'true' });
  assert.deepEqual(plain(w.state.sources), []);
});

test('all changed browser scripts use new cache versions', () => {
  const html = read('workspace.html');
  for (const [file, version] of [
    ['archive2-canonical.js', '20261001-canonical-loadset-1'],
    ['archive2-core.js', '20261001-h23-compose-closure-1'],
    ['meta-foundation-runtime.js', '20260930-canonical-lock-2'],
    ['archive2-workspace.js', '20261001-h23-compose-closure-1'],
  ])
    assert.match(html, new RegExp(file.replace('.', '\\.') + '\\?v=' + version));
  assert.match(html, /archive2-source\.js\?v=20260930-meta-v2-sidecar-1/);
  for (const file of ['archive2-library.js', 'archive2-navigation.js'])
    assert.match(html, new RegExp(file.replace('.', '\\.') + '\\?v=20260929-saved-library-'));
});

test('fresh BASIC includes every difficulty and unclassified metadata without preselecting 2 and 3', () => {
  for (const grade of ['중1', '중2', '중3', '고1', '고2', '고3']) {
    const records = [1, 2, 3, 4, 5, 'UNKNOWN'].map((difficultyBucket, i) => basicRecord(grade, {
      questionUid: 'qid_v1_' + crypto.createHash('sha256').update(grade + i).digest('hex'),
      difficultyBucket, reviewStatus: undefined, curriculumApplicability: undefined,
      defaultSelectable: undefined,
    }));
    const { w } = harness({ ...catalog, records, taxonomy: [] });
    w.state.filters = { grade, ...(['고2', '고3'].includes(grade) ? { semanticSubject: 'ALGEBRA' } : {}) };
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
  const record = catalog.records.find(row => core.basicEligibility(row, { canonicalAuthority: catalog.canonicalAuthority }).ok);
  const generated = { ...old, selected: [{ questionUid: record.questionUid, rowId: 'paper', sourceFingerprint: record.sourceFingerprint }] };
  w.applyDraft(generated);
  assert.deepEqual(plain(w.state.buckets), [2, 3]);
});

test('saved-paper links are tied to the current work signature and fresh drafts clear prior save identity', () => {
  const { w } = harness();
  const record = catalog.records.find(row => core.basicEligibility(row, { canonicalAuthority: catalog.canonicalAuthority }).ok);
  const scope = core.pathKey(record, 4);
  w.state.filters = { grade: record.effectiveBrowseGrade };
  w.state.scopes = [scope];
  w.state.rows = [{ id: scope, paths: [scope], scopeQuestionUids: [record.questionUid], count: 1 }];
  w.state.selected = [{ ...record, rowId: scope }];
  const savedSignature = w.saveWorkSignature();
  w.state.saveResultSignature = savedSignature;
  w.state.savedPaperIds = ['00000000-0000-4000-8000-000000000001'];
  w.state.saveMessage = '시험지 1개를 저장했습니다.';
  assert.match(w.renderInspector(), /index\.html\?savedPaper=00000000-0000-4000-8000-000000000001/);
  w.state.header = { ...w.state.header, title: '검수: 저장 이후 수정한 시험지' };
  assert.notEqual(w.saveWorkSignature(), savedSignature, 'output title changes invalidate the old saved-paper receipt');
  assert.doesNotMatch(w.renderInspector(), /index\.html\?savedPaper=/, 'editing invalidates the old direct-distribution link');
  assert.match(w.renderInspector(), /현재 편집본은 저장되지 않았습니다/);
  w.newDraft();
  assert.equal(w.state.saveMessage, '');
  assert.deepEqual(plain(w.state.savedPaperIds), []);
  assert.equal(w.state.saveBatchId, '');
  assert.equal(w.state.saveSignature, '');
  assert.equal(w.state.saveResultSignature, '');
  const legacyDraft = plain(w.draft());
  for (const key of ['saveBatchId', 'saveSignature', 'savedPaperIds', 'saveMessage', 'saveError', 'saveResultSignature']) delete legacyDraft[key];
  w.state.saveBatchId = 'stale-legacy-batch';
  w.state.saveSignature = 'stale-legacy-signature';
  w.state.savedPaperIds = ['00000000-0000-4000-8000-000000000001'];
  w.state.saveMessage = 'stale success';
  w.state.saveError = 'stale error';
  w.state.saveResultSignature = 'stale-result';
  w.applyDraft(legacyDraft);
  assert.equal(w.state.saveMessage, '');
  assert.deepEqual(plain(w.state.savedPaperIds), []);
  assert.equal(w.state.saveBatchId, '');
  assert.equal(w.state.saveSignature, '');
  assert.equal(w.state.saveResultSignature, '');
});

test('scope cards cannot be created by source-only labels and counts match selectable UIDs', () => {
  const valid = catalog.records.find(row => core.basicEligibility(row, {
    canonicalAuthority: catalog.canonicalAuthority,
  }).ok);
  assert.ok(valid);
  const rawOnly = {
    ...valid,
    questionUid: 'qid_v1_' + crypto.createHash('sha256').update('raw-only-scope').digest('hex'),
    sourceFile: valid.sourceFile.replace(/\.js$/, '-raw-only.js'),
    sourceOrdinal: Number(valid.sourceOrdinal) + 1000,
    sourceFingerprint: 'a'.repeat(64),
    assignmentFingerprint: 'b'.repeat(64),
    curriculumKey: '', courseKey: '',
    L1: 'RAW-unpublished-parent', L2: 'raw source subunit',
    assignmentEvidence: null,
  };
  const held = {
    ...valid,
    questionUid: 'qid_v1_' + crypto.createHash('sha256').update('held-scope-row').digest('hex'),
    sourceFile: valid.sourceFile.replace(/\.js$/, '-held.js'),
    sourceOrdinal: Number(valid.sourceOrdinal) + 2000,
    sourceFingerprint: 'c'.repeat(64),
    assignmentFingerprint: 'd'.repeat(64),
    reviewStatus: 'HOLD',
    assignmentEvidence: null,
  };
  const data = { ...catalog, records: [...catalog.records, rawOnly, held] };
  const { w } = harness(data);
  w.state.filters = { grade: valid.sourceGrade };
  const scopes = w.scopeOptions();
  assert.equal(scopes.some(scope => scope.L1 === 'RAW-unpublished-parent'), false);
  for (const scope of scopes) {
    assert.equal(scope.count, scope.scopeQuestionUids.length, scope.key);
    assert.equal(scope.count, scope.eligibleCount, scope.key);
    assert.ok(!scope.scopeQuestionUids.includes(rawOnly.questionUid));
    assert.ok(!scope.scopeQuestionUids.includes(held.questionUid));
  }
});

test('restoring a draft fails when its exact canonical scope parent no longer exists', () => {
  const valid = catalog.records.find(row => core.basicEligibility(row, {
    canonicalAuthority: catalog.canonicalAuthority,
  }).ok);
  assert.ok(valid);
  const { w } = harness({ ...catalog, filters: { grade: valid.sourceGrade } });
  const parentKey = [valid.grade || valid.sourceGrade, valid.curriculumKey, valid.courseKey, valid.L1, valid.L2].join('|');
  const savedPath = core.pathKey(valid, 4);
  const draft = {
    ...w.draft(),
    scopes: ['old-display-key'],
    scopeSourcePaths: [savedPath],
    scopeQuestionUids: [valid.questionUid],
  };
  const nextCatalog = {
    ...catalog,
    indexVersion: catalog.indexVersion + ':next',
    basicTaxonomy: catalog.basicTaxonomy.filter(row =>
      [row.grade, row.curriculumKey, row.courseKey, row.L1, row.L2].join('|') !== parentKey),
    canonicalAuthority: {
      ...catalog.canonicalAuthority,
      canonicalParents: catalog.canonicalAuthority.canonicalParents.filter(row =>
        [row.grade, row.curriculumKey, row.courseKey, row.L1, row.L2].join('|') !== parentKey),
    },
  };
  w.state.catalog = nextCatalog;
  w.state.byUid = new Map(nextCatalog.records.map(row => [row.questionUid, row]));
  assert.throws(() => w.applyDraft(draft), /현재 분류 기준이 변경되어 범위를 다시 선택해야 합니다/);
});
