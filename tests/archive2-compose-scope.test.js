const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const core = require('../archive/archive2-core.js');
const archiveSource = require('../archive/archive2-source.js');
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
    scrollY: 0,
    scrollTo() {},
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
    Archive2Source: archiveSource,
  });
  ctx.window = ctx;
  const source = read('archive2-workspace.js');
  const startup = source.lastIndexOf('  (async () => {');
  assert.ok(startup > 0);
  vm.runInContext(source.slice(0, startup) + `
    render = () => {};
    save = () => {};
    globalThis.workspaceTest = {state, scopeOptions, renderScopes, renderComposition, renderInspector, renderCompose, renderMobileActions, planRows, request, bucketButtons, newDraft, draft, applyDraft, applySavedPaperRevision, saveWorkSignature, savePapers, prepare, print, assign, findExams, renderFind, pool, routeUrl, urlState, replaceUrlState, readUrl};
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

function configureSaveHarness(t) {
  const { w, ctx } = harness();
  const previousDocument = global.document;
  const previousFetch = global.fetch;
  global.document = { baseURI: "https://archive.test/archive/workspace.html" };
  global.fetch = async input => {
    const url = new URL(String(input));
    const sourcePath = decodeURIComponent(url.pathname.replace("/archive/exams/", ""));
    return {
      ok: true,
      status: 200,
      text: async () => fs.readFileSync(path.join(root, "archive/exams", sourcePath), "utf8"),
    };
  };
  t.after(() => {
    if (previousDocument === undefined) delete global.document; else global.document = previousDocument;
    if (previousFetch === undefined) delete global.fetch; else global.fetch = previousFetch;
  });
  const record = catalog.records.find(row => core.basicEligibility(row, {
    canonicalAuthority: catalog.canonicalAuthority,
  }).ok);
  const scope = core.pathKey(record, 4);
  w.state.filters = { grade: record.effectiveBrowseGrade };
  w.state.scopes = [scope];
  w.state.rows = [{ id: scope, paths: [scope], scopeQuestionUids: [record.questionUid], count: 1 }];
  w.state.selected = [{ ...record, rowId: scope }];
  w.state.ackWarnings = true;
  ctx.localStorage.setItem("APMATH_SESSION", JSON.stringify({ id: "fixture-teacher", session_token: "fixture-token" }));
  ctx.APMATH_API_BASE = "https://archive.test/api";
  return { w, ctx };
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

test('Saved Paper는 51문항을 50문항과 1문항으로 나눈다', async t => {
  const { w } = configureSaveHarness(t);
  const first = catalog.records.find(row => row.automatic && row.sourceGrade === '고2' &&
    core.basicEligibility(row, { canonicalAuthority: catalog.canonicalAuthority }).ok);
  const semanticSubject = core.subjectProjectionForRecord(first, '', catalog.projectionPolicy);
  const records = catalog.records
    .filter(row => row.automatic && row.sourceGrade === '고2' &&
      core.subjectProjectionForRecord(row, '', catalog.projectionPolicy) === semanticSubject &&
      core.basicEligibility(row, { canonicalAuthority: catalog.canonicalAuthority }).ok)
    .slice(0, 51);
  assert.equal(records.length, 51);
  w.state.filters = { grade: '고2', semanticSubject };
  w.state.selected = records.map(row => ({ ...row }));
  w.state.prepared = { signature: '' };
  const papers = await w.prepare();
  assert.deepEqual(plain(papers.map(paper => paper.questions.length)), [50, 1]);
  assert.deepEqual(plain(papers.map(paper => paper.index)), [0, 1]);
  assert.equal(papers[0].meta.title.endsWith('· 1권'), true);
  assert.equal(papers[1].meta.title.endsWith('· 2권'), true);
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
  assert.equal(catalog.exams.filter(exam => exam.sourceGrade === '고3').length, 0,
    'the current Archive2 source population has no registered 고3 source; the reverse direction is fixture-verified');
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
    w.state.sources = [];
    w.state.find = filters;
    const finderRows = w.findExams();
    const listedExam = finderRows.find(row => row.file === record.sourceFile);
    assert.ok(listedExam,
      `${browseGrade} actual Finder list should include the approved ${sourceGrade} source`);
    const examIndex = w.state.catalog.exams.indexOf(listedExam);
    assert.match(w.renderFind(), new RegExp(`data-action="source-toggle" data-exam="${examIndex}"`),
      'the actual Finder result must render its source-selection control');
    await click({ action: 'source-toggle', exam: String(examIndex) });
    assert.deepEqual(plain(w.state.sources), [record.sourceFile]);
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

    await click({ action: 'go-compose', useSources: 'true' });

    assert.deepEqual(plain(w.state.sources), [record.sourceFile]);
    assert.deepEqual(uidsFor(w.state.filters), beforeUids,
      `${browseGrade} Compose should keep the same selected source UID set`);
    assert.deepEqual(data.records.filter(row => row.sourceFile === record.sourceFile)
      .map(({ sourceGrade: rawGrade, curriculumKey, courseKey }) => ({ sourceGrade: rawGrade, curriculumKey, courseKey })),
    beforeMetadata, 'source grade and curriculum identity remain unchanged');
  }
});

test('actual Finder list and Compose keep an approved high2 source in the high3 browse view', async () => {
  const record = catalog.records.find(row => row.sourceGrade === '고2' &&
    core.subjectProjectionForRecord(row, '', catalog.projectionPolicy) &&
    core.basicEligibility(row, { canonicalAuthority: catalog.canonicalAuthority }).ok);
  assert.ok(record, 'test needs a real, verified high2 source with an approved shared-subject projection');
  const exam = catalog.exams.find(row => row.file === record.sourceFile);
  assert.ok(exam, 'test source must be present in the production Archive2 catalog');
  assert.equal(exam.effectiveBrowseGrade, '고2', 'the registered browse projection retains the source grade');
  const semanticSubject = core.subjectProjectionForRecord(record, '', catalog.projectionPolicy);
  const { w, click } = harness(catalog);
  w.state.find = { grade: '고3', curriculumKey: record.curriculumKey, semanticSubject };

  const finderRows = w.findExams();
  const listedExam = finderRows.find(row => row.file === record.sourceFile);
  assert.ok(listedExam,
    'the real findExams() list must apply the shared canonical projection before filtering by grade');
  const finderPosition = finderRows.indexOf(listedExam);
  w.state.page = Math.floor(finderPosition / 18);
  const examIndex = w.state.catalog.exams.indexOf(listedExam);
  assert.match(w.renderFind(), new RegExp(`data-action="source-toggle" data-exam="${examIndex}"`),
    'the real Finder renderer must expose a selectable row for this approved source');
  const before = w.state.catalog.records.filter(row => row.sourceFile === record.sourceFile)
    .map(({ sourceGrade, curriculumKey, courseKey }) => ({ sourceGrade, curriculumKey, courseKey }));
  assert.ok(before.some(row => row.sourceGrade === '고2' && row.courseKey === record.courseKey));
  await click({ action: 'source-toggle', exam: String(examIndex) });
  assert.deepEqual(plain(w.state.sources), [record.sourceFile]);
  await click({ action: 'go-compose', useSources: 'true' });

  assert.deepEqual(plain(w.state.sources), [record.sourceFile],
    'selecting this Finder result must retain its source restriction after go-compose');
  const sourceScopes = w.scopeOptions();
  const sourceScope = sourceScopes.find(scope => scope.scopeQuestionUids.includes(record.questionUid));
  assert.ok(sourceScope, 'the selected source must still provide a canonical Compose scope');
  const scopeUids = sourceScopes.flatMap(scope => scope.scopeQuestionUids);
  assert.ok(scopeUids.length > 0);
  assert.ok(scopeUids.every(uid => w.state.catalog.records.find(row => row.questionUid === uid)?.sourceFile === record.sourceFile),
    'the actual Compose scope list must not widen beyond the selected source');
  w.state.scopes = [sourceScope.key];
  const request = w.request();
  assert.deepEqual(plain(request.filters.sourceFiles), [record.sourceFile],
    'the selected source must remain in the save/selection request filters');
  const selectable = w.pool().filter(row => core.eligibility(row, w.state).ok &&
    core.matches(row, request.filters, w.state));
  assert.ok(selectable.length > 0, 'the selected source must still provide selectable Compose candidates');
  assert.ok(selectable.every(row => row.sourceFile === record.sourceFile),
    'the executable Compose candidate set must remain limited to the selected source');
  assert.deepEqual(new Set(selectable.map(row => row.questionUid)), new Set(sourceScope.scopeQuestionUids));
  assert.deepEqual(w.state.catalog.records.filter(row => row.sourceFile === record.sourceFile)
    .map(({ sourceGrade, curriculumKey, courseKey }) => ({ sourceGrade, curriculumKey, courseKey })), before,
  'browse grade must not rewrite source grade, curriculum, or course identity');
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
  assert.equal(w.findExams().some(row => row.file === sourceFile), false,
    'unapproved cross-grade sources must stay out of the actual Finder result list');
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
    ['archive2-history.js', '20261004-class-grade-fallback-1'],
    ['archive2-workspace.js', '20261006-compose-performance-1'],
  ])
    assert.match(html, new RegExp(file.replace('.', '\\.') + '\\?v=' + version));
  assert.match(html, /archive2-source\.js\?v=20260930-meta-v2-sidecar-1/);
  assert.match(html, /archive2-library\.js\?v=20261003-navigation-s5-3/);
  assert.match(html, /archive2\.css\?v=20261003-navigation-s5-1/);
  assert.match(html, /archive2-navigation\.js\?v=20260929-saved-library-2/);
});

test('Finder, Recent, and Saved Paper view state survives route changes and reload URLs', () => {
  const { w, ctx } = harness();
  const historyCalls = [];
  ctx.history.replaceState = (state, _title, url) => {
    ctx.history.state = state;
    ctx.location = new URL(String(url), ctx.location.href);
    historyCalls.push({ kind: 'replace', state, href: ctx.location.href });
  };
  ctx.history.pushState = (state, _title, url) => {
    ctx.history.state = state;
    ctx.location = new URL(String(url), ctx.location.href);
    historyCalls.push({ kind: 'push', state, href: ctx.location.href });
  };

  w.state.view = 'find';
  w.state.find = { grade: '중2', curriculumKey: '2015', query: '강남여고', material: 'exam' };
  w.state.page = 3;
  let url = w.routeUrl();
  assert.equal(url.searchParams.get('view'), 'find');
  assert.equal(url.searchParams.get('query'), '강남여고');
  assert.equal(url.searchParams.get('page'), '3');

  ctx.location = new URL('https://archive.test/archive/workspace.html?view=find&grade=%EC%A4%912&query=%EA%B0%95%EB%82%A8%EC%97%AC%EA%B3%A0&page=2');
  w.readUrl();
  assert.equal(w.state.page, 2);
  assert.equal(w.state.find.query, '강남여고');

  w.state.view = 'recent';
  w.state.recentFilters = { from: '2026-09-01', to: '2026-09-30', grade: '고1', subject: '공통수학1', query: '중간' };
  w.state.recentClassId = 'class-exact-7';
  w.state.recentSelectedAssignmentId = 'assignment-exact-7';
  url = w.routeUrl();
  assert.equal(url.searchParams.get('from'), '2026-09-01');
  assert.equal(url.searchParams.get('class'), 'class-exact-7');
  assert.equal(url.searchParams.get('assignment_id'), 'assignment-exact-7');

  w.state.view = 'saved';
  w.state.savedPaperId = 'saved-paper-exact-7';
  w.state.savedLibraryStatusFilter = 'ARCHIVED';
  url = w.routeUrl();
  assert.equal(url.searchParams.get('paper_id'), 'saved-paper-exact-7');
  assert.equal(url.searchParams.get('status'), 'ARCHIVED');

  w.state.view = 'find';
  w.state.find = { grade: '고1', query: '중간' };
  w.state.page = 1;
  ctx.window.scrollY = 413;
  w.urlState();
  assert.equal(historyCalls.at(-2).kind, 'replace');
  assert.equal(historyCalls.at(-2).state.archive2ScrollY, 413);
  assert.equal(historyCalls.at(-1).kind, 'push');
  assert.equal(new URL(historyCalls.at(-1).href).searchParams.get('page'), '1');
  const scrollBeforeCanonicalRewrite = historyCalls.at(-1).state.archive2ScrollY;
  ctx.location = new URL('https://archive.test/archive/workspace.html?view=find&courseKey=stale');
  w.readUrl();
  assert.equal(historyCalls.at(-1).kind, 'replace');
  assert.equal(historyCalls.at(-1).state.archive2ScrollY, scrollBeforeCanonicalRewrite,
    'canonical filter URL cleanup preserves the scroll saved on this history entry');
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

test('removing advanced metadata leaves the exact BASIC candidate UID set unchanged', () => {
  const rows = [1, 2, 3, 4, 5, 'UNKNOWN'].map((difficultyBucket, index) =>
    basicRecord('고2', {
      questionUid: 'qid_v1_' + crypto.createHash('sha256').update(`advanced-optional-${index}`).digest('hex'),
      L3: '시험용 L3', L4: '시험용 L4', problemTypeKey: 'PT_OPTIONAL_TEST', templateKey: 'TPL_OPTIONAL_TEST',
      difficultyBucket, difficultyConfidence: difficultyBucket === 'UNKNOWN' ? 'unknown' : 'high',
    }));
  const withoutAdvanced = rows.map(row => ({
    ...row,
    L3: '', L4: '', problemTypeKey: '', templateKey: '',
    difficultyBucket: undefined, difficultyConfidence: undefined, difficultyBoundaryFlag: undefined,
  }));
  const selectableUids = records => {
    const { w } = harness({ ...catalog, records });
    w.state.filters = { grade: '고2', semanticSubject: core.subjectProjectionForRecord(records[0], '', catalog.projectionPolicy) };
    return new Set(w.scopeOptions().flatMap(scope => scope.scopeQuestionUids));
  };

  assert.deepEqual(selectableUids(withoutAdvanced), selectableUids(rows));
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

test('last Saved Paper actions survive Draft edits and fresh Drafts clear the prior save identity', () => {
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
  w.state.lastSavedPaperIds = ['00000000-0000-4000-8000-000000000001'];
  w.state.saveMessage = '시험지 1개를 저장했습니다.';
  w.state.saveResultState = 'SAVED';
  const savedCompose = w.renderCompose();
  assert.match(savedCompose, /마지막 저장본/);
  assert.match(savedCompose, /data-action="saved-paper-issue" data-paper-id="00000000-0000-4000-8000-000000000001" class="primary">이 저장본 출제/);
  assert.doesNotMatch(savedCompose, /index\.html\?savedPaper=/);
  for (const mode of ["exam", "sol", "ans"])
    assert.match(savedCompose, new RegExp(`data-action="saved-output" data-paper-id="00000000-0000-4000-8000-000000000001" data-mode="${mode}"`));
  assert.match(w.renderMobileActions(), /data-action="saved-paper-issue" data-paper-id="00000000-0000-4000-8000-000000000001"/);
  w.state.header = { ...w.state.header, title: '검수: 저장 이후 수정한 시험지' };
  assert.notEqual(w.saveWorkSignature(), savedSignature, 'output title changes invalidate the old saved-paper receipt');
  const editedCompose = w.renderCompose();
  assert.match(editedCompose, /현재 편집본은 저장되지 않았습니다/);
  assert.match(editedCompose, /data-action="saved-paper-issue" data-paper-id="00000000-0000-4000-8000-000000000001"/,
    'editing marks the Draft unsaved but keeps actions for the last immutable Saved Paper');
  const editedDraft = plain(w.draft());
  assert.deepEqual(editedDraft.lastSavedPaperIds, ['00000000-0000-4000-8000-000000000001']);
  editedDraft.scopes = [];
  editedDraft.scopeSourcePaths = [];
  editedDraft.scopeQuestionUids = [];
  const restored = harness();
  restored.w.applyDraft(editedDraft);
  assert.deepEqual(plain(restored.w.state.lastSavedPaperIds), ['00000000-0000-4000-8000-000000000001']);
  assert.match(restored.w.renderCompose(), /현재 편집본은 저장되지 않았습니다/);
  assert.match(restored.w.renderCompose(), /data-action="saved-paper-issue" data-paper-id="00000000-0000-4000-8000-000000000001"/);
  w.newDraft();
  assert.equal(w.state.saveMessage, '');
  assert.deepEqual(plain(w.state.savedPaperIds), []);
  assert.deepEqual(plain(w.state.lastSavedPaperIds), []);
  assert.equal(w.state.saveBatchId, '');
  assert.equal(w.state.saveSignature, '');
  assert.equal(w.state.saveResultSignature, '');
  const legacyDraft = plain(w.draft());
  for (const key of ['saveBatchId', 'saveSignature', 'savedPaperIds', 'lastSavedPaperIds', 'saveMessage', 'saveError', 'saveResultSignature', 'saveResultState']) delete legacyDraft[key];
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

test('completed Compose output reads the exact receipt Assignment ID instead of rebuilding a source output', async t => {
  const { w, ctx } = harness();
  const assignmentId = '00000000-0000-4000-8000-000000000440';
  const requests = [];
  const stored = [];
  const popup = { location: { href: '' }, close() { this.closed = true; } };
  const oldStore = ctx.Archive2Output.storeOutputEnvelope;
  ctx.Archive2Output.storeOutputEnvelope = async envelope => { stored.push(envelope); };
  ctx.open = (url, target) => { assert.equal(url, 'about:blank'); assert.equal(target, '_blank'); return popup; };
  ctx.APMATH_API_BASE = 'https://archive.test/api';
  ctx.localStorage.setItem('APMATH_SESSION', JSON.stringify({ id: 'fixture-teacher', session_token: 'fixture-token' }));
  ctx.fetch = async (url, init = {}) => {
    const parsed = new URL(String(url));
    requests.push({ path: parsed.pathname, query: parsed.search, method: init.method || 'GET' });
    assert.equal(parsed.pathname, `/api/class-exam-assignments/${assignmentId}/output`);
    assert.equal(parsed.searchParams.get('mode'), 'sol');
    return { ok: true, status: 200, json: async () => ({
      success: true,
      envelope: {
        contractVersion: 'archive2-output-envelope-v1',
        outputRequestId: '00000000-0000-4000-8000-000000000441',
        ownerId: '00000000-0000-4000-8000-000000000442',
        sourceKind: 'assignment', sourceId: assignmentId, assignmentId,
        mode: 'sol', questionCount: 1, meta: { qpp: 4 }, questions: [{ questionUid: 'qid_v1_receipt' }],
      },
    }) };
  };
  t.after(() => { ctx.Archive2Output.storeOutputEnvelope = oldStore; });
  w.state.classId = 'class-exact-receipt';
  w.state.previewIndex = 0;
  w.state.outputMode = 'sol';
  w.state.receipts = [{ key: 'draft-paper-key', partIndex: 0, classId: w.state.classId, id: assignmentId, ready: false }];

  await w.print();

  assert.deepEqual(requests.map(row => row.path), [`/api/class-exam-assignments/${assignmentId}/output`]);
  assert.equal(requests[0].method, 'GET');
  assert.equal(stored.length, 1);
  assert.equal(stored[0].assignmentId, assignmentId);
  const outputUrl = new URL(popup.location.href);
  assert.equal(outputUrl.searchParams.get('outputRequestId'), stored[0].outputRequestId);
  assert.equal(outputUrl.searchParams.get('outputOwnerId'), stored[0].ownerId);
  assert.equal(outputUrl.searchParams.get('assignmentId'), assignmentId);
  assert.equal(outputUrl.searchParams.get('mode'), 'sol');
  assert.equal(outputUrl.searchParams.get('preview'), null);
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

test('unknown save result persists its batch and locks Draft edits until reconciled', () => {
  const { w } = harness();
  const record = catalog.records.find(row => core.basicEligibility(row, {
    canonicalAuthority: catalog.canonicalAuthority,
  }).ok);
  const scope = core.pathKey(record, 4);
  w.state.filters = { grade: record.effectiveBrowseGrade };
  w.state.scopes = [scope];
  w.state.rows = [{ id: scope, paths: [scope], scopeQuestionUids: [record.questionUid], count: 1 }];
  w.state.selected = [{ ...record, rowId: scope }];
  w.state.saveBatchId = '00000000-0000-4000-8000-000000000123';
  w.state.saveSignature = 'frozen-request-signature';
  w.state.saveResultSignature = w.saveWorkSignature();
  w.state.lastSavedPaperIds = ['00000000-0000-4000-8000-000000000120'];
  w.state.saveResultState = 'RESULT_UNKNOWN';
  const savedDraft = plain(w.draft());
  assert.equal(savedDraft.saveBatchId, w.state.saveBatchId);
  assert.equal(savedDraft.saveResultState, 'RESULT_UNKNOWN');
  const mobile = w.renderMobileActions();
  assert.match(mobile, /저장 결과 확인/);
  const compose = w.renderCompose();
  assert.match(compose, /응답을 확인하지 못했습니다/);
  assert.match(compose, /class="workspace" inert/);
  assert.match(compose, /data-action="save-paper"[^>]*>저장 결과 확인/);
  assert.ok(compose.indexOf('data-action="save-paper"') < compose.indexOf('<div class="workspace" inert'),
    'desktop recovery action must sit outside the inert editor region');
  assert.match(compose, /data-action="saved-paper-issue" data-paper-id="00000000-0000-4000-8000-000000000120"/,
    'last confirmed Saved Paper remains distinct and available while the new result is unknown');
  assert.deepEqual(plain(savedDraft.lastSavedPaperIds), ['00000000-0000-4000-8000-000000000120']);
  const lockedDraftId = w.state.draftId;
  w.newDraft();
  assert.equal(w.state.draftId, lockedDraftId, "an unknown result cannot be abandoned as a new save identity");
  assert.match(compose, /응답을 확인하지 못했습니다/);
});

test('restoring a Draft saved while POST was in flight marks the result unknown', () => {
  const { w } = harness();
  const interruptedRequest = plain(w.draft());
  interruptedRequest.saveBatchId = '00000000-0000-4000-8000-000000000124';
  interruptedRequest.saveSignature = 'frozen-request-signature';
  interruptedRequest.saveResultSignature = w.saveWorkSignature();
  interruptedRequest.saveResultState = 'SAVING';
  w.applyDraft(interruptedRequest);
  assert.equal(w.state.saveResultState, 'RESULT_UNKNOWN');
  assert.equal(w.state.saveBatchId, interruptedRequest.saveBatchId);
  assert.equal(w.state.saveSignature, interruptedRequest.saveSignature);
});

test('lost save response resolves through the same batch ID and changed Draft creates a new batch', async (t) => {
  const { w, ctx } = harness();
  const previousDocument = global.document;
  const previousFetch = global.fetch;
  global.document = { baseURI: "https://archive.test/archive/workspace.html" };
  global.fetch = async input => {
    const url = new URL(String(input));
    const sourcePath = decodeURIComponent(url.pathname.replace("/archive/exams/", ""));
    return {
      ok: true,
      status: 200,
      text: async () => fs.readFileSync(path.join(root, "archive/exams", sourcePath), "utf8"),
    };
  };
  t.after(() => {
    if (previousDocument === undefined) delete global.document; else global.document = previousDocument;
    if (previousFetch === undefined) delete global.fetch; else global.fetch = previousFetch;
  });
  const record = catalog.records.find(row => core.basicEligibility(row, {
    canonicalAuthority: catalog.canonicalAuthority,
  }).ok);
  const scope = core.pathKey(record, 4);
  w.state.filters = { grade: record.effectiveBrowseGrade };
  w.state.scopes = [scope];
  w.state.rows = [{ id: scope, paths: [scope], scopeQuestionUids: [record.questionUid], count: 1 }];
  w.state.selected = [{ ...record, rowId: scope }];
  w.state.ackWarnings = true;
  ctx.localStorage.setItem("APMATH_SESSION", JSON.stringify({ id: "fixture-teacher", session_token: "fixture-token" }));
  ctx.APMATH_API_BASE = "https://archive.test/api";
  const postBodies = [];
  let batchLookups = 0;
  let lookedUpBatchId = "";
  ctx.fetch = async (url, init = {}) => {
    const parsed = new URL(String(url));
    if (parsed.pathname.startsWith("/api/archive-saved-papers/save-batches/")) {
      batchLookups++;
      lookedUpBatchId = parsed.pathname.split("/").at(-1);
      return { ok: true, status: 200, json: async () => ({
        success: true, found: true, saved: true,
        papers: [{ id: "00000000-0000-4000-8000-000000000901" }],
      }) };
    }
    if (parsed.pathname === "/api/archive-saved-papers" && init.method === "POST") {
      const body = JSON.parse(init.body);
      postBodies.push(body);
      if (postBodies.length === 1)
        return { ok: false, status: 502, json: async () => ({ error: "reply lost after commit" }) };
      return { ok: true, status: 200, json: async () => ({
        success: true, saved: true,
        papers: [{ id: "00000000-0000-4000-8000-000000000902" }],
      }) };
    }
    throw new Error("unexpected API request: " + parsed.pathname);
  };

  await w.savePapers();
  assert.equal(w.state.saveResultState, "SAVED", JSON.stringify({error: w.state.saveError, postBodies: postBodies.length, batchLookups}));
  assert.deepEqual(plain(w.state.savedPaperIds), ["00000000-0000-4000-8000-000000000901"]);
  assert.deepEqual(plain(w.state.lastSavedPaperIds), ["00000000-0000-4000-8000-000000000901"]);
  assert.equal(postBodies.length, 1);
  assert.equal(batchLookups, 1);
  assert.equal(lookedUpBatchId, postBodies[0].save_batch_id);

  const firstBatchId = w.state.saveBatchId;
  w.state.header = { ...w.state.header, title: "다음 수정본" };
  await w.savePapers();
  assert.equal(postBodies.length, 2);
  assert.notEqual(postBodies[1].save_batch_id, firstBatchId,
    "a changed Draft must receive a new idempotency identity");
  assert.equal(w.state.saveResultState, "SAVED");
  assert.deepEqual(plain(w.state.savedPaperIds), ["00000000-0000-4000-8000-000000000902"]);
  assert.deepEqual(plain(w.state.lastSavedPaperIds), ["00000000-0000-4000-8000-000000000902"]);
});


test('unknown save with no committed batch retries the identical request identity', async (t) => {
  const { w, ctx } = harness();
  const previousDocument = global.document;
  const previousFetch = global.fetch;
  global.document = { baseURI: "https://archive.test/archive/workspace.html" };
  global.fetch = async input => {
    const url = new URL(String(input));
    const sourcePath = decodeURIComponent(url.pathname.replace("/archive/exams/", ""));
    return {
      ok: true,
      status: 200,
      text: async () => fs.readFileSync(path.join(root, "archive/exams", sourcePath), "utf8"),
    };
  };
  t.after(() => {
    if (previousDocument === undefined) delete global.document; else global.document = previousDocument;
    if (previousFetch === undefined) delete global.fetch; else global.fetch = previousFetch;
  });
  const record = catalog.records.find(row => core.basicEligibility(row, {
    canonicalAuthority: catalog.canonicalAuthority,
  }).ok);
  const scope = core.pathKey(record, 4);
  w.state.filters = { grade: record.effectiveBrowseGrade };
  w.state.scopes = [scope];
  w.state.rows = [{ id: scope, paths: [scope], scopeQuestionUids: [record.questionUid], count: 1 }];
  w.state.selected = [{ ...record, rowId: scope }];
  w.state.ackWarnings = true;
  ctx.localStorage.setItem("APMATH_SESSION", JSON.stringify({ id: "fixture-teacher", session_token: "fixture-token" }));
  ctx.APMATH_API_BASE = "https://archive.test/api";
  const postBodies = [];
  let statusChecks = 0;
  ctx.fetch = async (url, init = {}) => {
    const parsed = new URL(String(url));
    if (parsed.pathname.startsWith("/api/archive-saved-papers/save-batches/")) {
      statusChecks++;
      if (statusChecks === 2) throw new Error("transient status lookup failure");
      return { ok: true, status: 200, json: async () => ({ success: true, found: false, saved: false, papers: [] }) };
    }
    if (parsed.pathname === "/api/archive-saved-papers" && init.method === "POST") {
      postBodies.push(JSON.parse(init.body));
      if (postBodies.length === 1)
        return { ok: false, status: 502, json: async () => ({ error: "response lost before commit" }) };
      return { ok: true, status: 200, json: async () => ({
        success: true, saved: true,
        papers: [{ id: "00000000-0000-4000-8000-000000000903" }],
      }) };
    }
    throw new Error("unexpected API request: " + parsed.pathname);
  };

  await w.savePapers();
  assert.equal(w.state.saveResultState, "RESULT_UNKNOWN");
  const originalBatchId = postBodies[0].save_batch_id;
  await w.savePapers();
  assert.equal(w.state.saveResultState, "SAVED");
  assert.equal(statusChecks, 2);
  assert.equal(postBodies.length, 2);
  assert.equal(postBodies[1].save_batch_id, originalBatchId);
  assert.deepEqual(postBodies[1], postBodies[0]);
});

test("a missing save batch followed by POST 409 is a definite failure", async t => {
  const { w, ctx } = configureSaveHarness(t);
  let statusChecks = 0;
  let posts = 0;
  ctx.fetch = async (url, init = {}) => {
    const parsed = new URL(String(url));
    if (parsed.pathname.startsWith("/api/archive-saved-papers/save-batches/")) {
      statusChecks++;
      if (statusChecks === 1)
        return { ok: true, status: 200, json: async () => ({ success: true, found: false, saved: false, papers: [] }) };
      return { ok: false, status: 404, json: async () => ({ error: "save batch not found" }) };
    }
    if (parsed.pathname === "/api/archive-saved-papers" && init.method === "POST") {
      posts++;
      if (posts === 1) throw new Error("response lost");
      return { ok: false, status: 409, json: async () => ({ error: "save batch conflict" }) };
    }
    throw new Error("unexpected API request: " + parsed.pathname);
  };

  await w.savePapers();
  assert.equal(w.state.saveResultState, "RESULT_UNKNOWN");
  await w.savePapers();
  assert.equal(w.state.saveResultState, "FAILED");
  assert.equal(posts, 2);
  assert.equal(statusChecks, 2);
  assert.match(w.state.saveError, /save batch conflict/);
});

test("HTTP 502 and network failures keep the same save result unresolved", async t => {
  for (const failureKind of ["HTTP 502", "network"]) {
    await t.test(failureKind, async subtest => {
      const { w, ctx } = configureSaveHarness(subtest);
      ctx.fetch = async (url, init = {}) => {
        const parsed = new URL(String(url));
        if (parsed.pathname.startsWith("/api/archive-saved-papers/save-batches/"))
          return { ok: true, status: 200, json: async () => ({ success: true, found: false, saved: false, papers: [] }) };
        if (parsed.pathname === "/api/archive-saved-papers" && init.method === "POST") {
          if (failureKind === "network") throw new Error("network unavailable");
          return { ok: false, status: 502, json: async () => ({ error: "upstream unavailable" }) };
        }
        throw new Error("unexpected API request: " + parsed.pathname);
      };

      await w.savePapers();
      assert.equal(w.state.saveResultState, "RESULT_UNKNOWN");
      assert.ok(w.state.saveBatchId);
      assert.match(w.state.saveError, failureKind === "network" ? /network unavailable/ : /upstream unavailable/);
    });
  }
});

test('Saved Paper revision Draft preserves the immutable source snapshot and lineage parent', async () => {
  const { w, ctx } = harness();
  const record = catalog.records.find(row => core.basicEligibility(row, {
    canonicalAuthority: catalog.canonicalAuthority,
  }).ok);
  const uid = record.questionUid;
  const pathKey = core.pathKey(record, 4);
  const frozenQuestion = {
    questionUid: uid,
    sourceFingerprint: record.sourceFingerprint,
    sourceArchiveFile: record.sourceFile,
    sourceOrdinal: record.sourceOrdinal,
    sourceQuestionNo: record.sourceQuestionNo,
    content: '<p>frozen Saved Paper bytes</p>',
    solution: '<p>frozen solution bytes</p>',
    image: 'data:image/png;base64,Zm9vemVu',
  };
  const paper = {
    id: '00000000-0000-4000-8000-000000000321',
    title: 'immutable source title',
    snapshot_hash: 'a'.repeat(64),
    snapshot: {
      questions: [frozenQuestion],
      meta: {
        title: 'immutable source title',
        questionUids: [uid],
        printHeaderOptions: { title: 'immutable source title', subtitle: 'saved subtitle' },
        qpp: 6,
        includeQr: true,
      },
      selectionFilters: {
        grade: record.effectiveBrowseGrade,
        primaryPaths: [pathKey],
        scopeQuestionUids: [uid],
        sourceFiles: [record.sourceFile],
        difficultyBuckets: [],
      },
    },
  };
  const oldDraftId = w.state.draftId;
  w.applySavedPaperRevision(paper);
  assert.notEqual(w.state.draftId, oldDraftId);
  assert.equal(w.state.derivationSource.parentKind, 'SAVED_PAPER');
  assert.equal(w.state.derivationSource.parentId, paper.id);
  assert.equal(w.state.derivationSource.parentSnapshotHash, paper.snapshot_hash);
  assert.equal(w.state.derivationSource.derivationType, 'REVISION');
  assert.deepEqual(plain(w.state.selected.map(row => row.questionUid)), [uid]);
  assert.equal(w.state.saveBatchId, '');
  assert.equal(w.state.qpp, 6);
  assert.equal(w.state.includeQr, true);
  const persistedDraft = plain(w.draft());
  assert.equal(persistedDraft.derivationSource.parentId, paper.id);
  assert.equal(Object.hasOwn(persistedDraft, 'derivedBaseQuestions'), false,
    'large immutable source payload stays server-authoritative instead of entering local Draft storage');
  const prepared = await w.prepare();
  assert.equal(prepared[0].questions[0].content, frozenQuestion.content);
  assert.equal(prepared[0].questions[0].solution, frozenQuestion.solution);
  assert.equal(prepared[0].questions[0].image, frozenQuestion.image);
  assert.match(w.renderCompose(), /원본 저장 시험지의 고정된 범위/);

  const changedSource = structuredClone(paper);
  changedSource.snapshot.questions[0].sourceFingerprint = 'changed-source-fingerprint';
  assert.throws(() => w.applySavedPaperRevision(changedSource), /원본 문항이 변경되었습니다/);

  ctx.localStorage.setItem("APMATH_SESSION", JSON.stringify({ id: "fixture-teacher", session_token: "fixture-token" }));
  ctx.APMATH_API_BASE = "https://archive.test/api";
  let savedPayload = null;
  ctx.fetch = async (url, init = {}) => {
    assert.equal(new URL(String(url)).pathname, "/api/archive-saved-papers");
    assert.equal(init.method, "POST");
    savedPayload = JSON.parse(init.body);
    return { ok: true, status: 200, json: async () => ({
      success: true,
      saved: true,
      papers: [{ id: "00000000-0000-4000-8000-000000000322" }],
    }) };
  };
  await w.savePapers();
  assert.equal(w.state.saveResultState, "SAVED");
  assert.equal(savedPayload.papers[0].lineage.parent_kind, "SAVED_PAPER");
  assert.equal(savedPayload.papers[0].lineage.parent_id, paper.id);
  assert.equal(savedPayload.papers[0].lineage.parent_snapshot_hash, paper.snapshot_hash);
  assert.equal(savedPayload.papers[0].lineage.derivation_type, "REVISION");
  assert.equal(savedPayload.papers[0].questions[0].content, frozenQuestion.content);

  w.applyDraft(persistedDraft);
  assert.equal(w.state.derivationSource.parentId, paper.id);
  assert.equal(w.state.derivedBaseQuestions, null, "Draft restoration keeps only the parent identity locally");
  ctx.fetch = async (url, init = {}) => {
    const parsed = new URL(String(url));
    assert.equal(parsed.pathname, "/api/archive-saved-papers/" + paper.id);
    assert.equal(init.method, "GET");
    return { ok: true, status: 200, json: async () => ({ success: true, paper }) };
  };
  const restoredPrepared = await w.prepare();
  assert.equal(restoredPrepared[0].questions[0].content, frozenQuestion.content,
    "Draft reopen reads the immutable parent snapshot instead of rebuilding from current source files");
});
