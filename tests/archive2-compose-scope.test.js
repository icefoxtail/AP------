const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const core = require('../archive/archive2-core.js');
const archiveSource = require('../archive/archive2-source.js');
const { catalog, withTestAssignments } = require('./helpers/archive2-scope-harness.cjs');
const { readWorkspace, loadWorkspace, assertWorkspaceScriptVersions } = require("./helpers/archive2-workspace-source.cjs");
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
    ProblemBankMeta: require('../archive/problem-bank-meta.js'),
    Archive2Canonical: core.Canonical,
    Archive2Output: require('../archive/archive2-output.js'),
    Archive2Papers: require('../archive/archive2-papers.js'),
    Archive2History: require('../archive/archive2-history.js'),
    Archive2Source: archiveSource,
  });
  ctx.window = ctx;
  loadWorkspace(ctx, `
    render = () => {};
    save = () => {};
    globalThis.workspaceTest = {setRender: fn => { render = fn; }, state, scopeOptions, renderScopes, renderComposition, renderInspector, renderCompose, renderMobileActions, planRows, request, bucketButtons, newDraft, draft, applyDraft, applySavedPaperRevision, saveWorkSignature, savePapers, prepare, print, assign, findExams, renderFind, pool, routeUrl, urlState, replaceUrlState, readUrl};
  `);
  const w = ctx.workspaceTest;
  w.state.catalog = data;
  w.state.byUid = new Map(data.records.map(row => [row.questionUid, row]));
  w.state.finderIndex = core.buildFinderIndex(data);
  w.state.indexVersion = data.indexVersion;
  return {
    w, ctx, events,
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
  const { w, ctx, click, change } = harness();
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
  return { w, ctx, click, change };
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
  for (const unit of ['실수', '다항식', '이차방정식', '이차함수', '삼각비', '원', '통계']) {
    const assignments = w.state.catalog.records.filter(row =>
      row.sourceGrade === '중3' &&
      core.basicScopeParent(row, w.state.catalog.basicScopeLinks, w.state.catalog.canonicalAuthority)?.L1.includes(unit)
    );
    assert.ok(assignments.length > 0, `canonical ${unit} parent assignments must remain present`);
    const selectable = assignments.filter(row => core.eligibility(row, w.state).ok);
    if (selectable.length > 0) {
      assert.ok(w.scopeOptions().some(scope => scope.L1.includes(unit) && scope.count > 0),
        `eligible ${unit} rows must be projected into Compose`);
    } else {
      const sourceHeld = assignments.filter(row =>
        row.sourceStatus === 'HOLD' && core.eligibility(row, w.state).reasons.includes('source_release')
      );
      assert.equal(sourceHeld.length, assignments.length,
        `${unit} has no selectable source: every canonical assignment must remain blocked by the source-release gate`);
      assert.equal(w.scopeOptions().filter(scope => scope.L1.includes(unit) && scope.count > 0).length, 0,
        `held ${unit} source rows must not appear as selectable Compose scope`);
    }
  }
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

test('a real approved high2 source survives Finder-to-Compose in high2 and shared high3 browse directions', async () => {
  const { w, click } = harness(catalog);
  const data = w.state.catalog;
  const currentHigh3Records = data.records.filter(row => row.sourceGrade === '고3');
  const ineligibleHigh3Uids = currentHigh3Records.filter(row => !core.basicEligibility(row, {
    canonicalAuthority: data.canonicalAuthority,
  }).ok).map(row => row.questionUid);
  if (ineligibleHigh3Uids.length) {
    w.state.filters = { grade: '고3' };
    const currentHigh3ScopeUids = new Set(w.scopeOptions().flatMap(scope => scope.scopeQuestionUids));
    assert.ok(ineligibleHigh3Uids.every(uid => !currentHigh3ScopeUids.has(uid)),
      'real high3 rows that fail current approval/readiness remain outside selectable Compose scopes');
  }
  const record = data.records.find(row => row.automatic && row.sourceGrade === '고2' &&
    core.subjectProjectionForRecord(row, '', data.projectionPolicy) &&
    core.basicEligibility(row, { canonicalAuthority: data.canonicalAuthority }).ok);
  assert.ok(record, 'test needs a current approved and source-ready high2 source');
  const exam = data.exams.find(row => row.file === record.sourceFile);
  assert.ok(exam, 'approved source must remain registered in the production Archive2 catalog');
  const semanticSubject = core.subjectProjectionForRecord(record, '', data.projectionPolicy);

  for (const browseGrade of ['고2', '고3']) {
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
      `${browseGrade} actual Finder list should include the approved ${record.sourceGrade} source`);
    const examIndex = w.state.catalog.exams.indexOf(listedExam);
    assert.match(w.renderFind(), new RegExp(`data-action="source-toggle" data-exam="${examIndex}"`),
      'the actual Finder result must render its source-selection control');
    await click({ action: 'source-toggle', exam: String(examIndex) });
    assert.deepEqual(plain(w.state.sources), [record.sourceFile]);
    assert.equal(core.finderMatches(exam, filters, w.state.finderIndex), true,
      `${browseGrade} Finder should show the approved ${record.sourceGrade} source`);

    const uidsFor = activeFilters => data.records.filter(row => row.sourceFile === record.sourceFile &&
      core.matches(row, activeFilters, { catalog: data, projectionPolicy: data.projectionPolicy }) &&
      core.basicEligibility(row, { canonicalAuthority: data.canonicalAuthority }).ok)
      .map(row => row.questionUid).sort();
    const beforeUids = uidsFor(filters);
    assert.ok(beforeUids.includes(record.questionUid),
      `${browseGrade} browse should retain the actual approved source question`);
    const beforeMetadata = data.records.filter(row => row.sourceFile === record.sourceFile)
      .map(({ sourceGrade: rawGrade, curriculumKey, courseKey }) => ({ sourceGrade: rawGrade, curriculumKey, courseKey }));

    await click({ action: 'go-compose', useSources: 'true' });

    assert.deepEqual(plain(w.state.sources), [record.sourceFile]);
    assert.deepEqual(uidsFor(w.state.filters), beforeUids,
      `${browseGrade} Compose should keep the same selected source UID set`);
    assert.deepEqual(data.records.filter(row => row.sourceFile === record.sourceFile)
      .map(({ sourceGrade: rawGrade, curriculumKey, courseKey }) => ({ sourceGrade: rawGrade, curriculumKey, courseKey })),
    beforeMetadata, 'source grade and curriculum identity remain unchanged');
  }
});

test('an isolated test-only high3 source exercises the reverse high3-to-high2 browse route', async () => {
  const reverseRecord = basicRecord('고3', {
    questionUid: 'qid_v1_' + crypto.createHash('sha256').update('compose-shared-high3-reverse-fixture-v1').digest('hex'),
    sourceFile: 'original/high/h3/1mid/test-fixture-shared-high3-reverse.js',
    testFixtureOnly: true,
  });
  assert.equal(reverseRecord.testFixtureOnly, true);
  assert.match(reverseRecord.sourceFile, /test-fixture-shared-high3-reverse/);
  assert.equal(catalog.records.some(row => row.questionUid === reverseRecord.questionUid), false,
    'test-only UID must not collide with a production identity');
  const reverseExam = {
    file: reverseRecord.sourceFile,
    grade: '고3',
    sourceGrade: '고3',
    effectiveBrowseGrade: '고3',
    school: '테스트 전용 공유 과목 fixture',
    year: 2025,
    courseRanges: [],
    curriculums: [reverseRecord.curriculumKey],
  };
  const { w, click } = harness({
    ...catalog,
    records: [...catalog.records, reverseRecord],
    exams: [...catalog.exams, reverseExam],
  });
  const data = w.state.catalog;
  assert.equal(core.basicEligibility(reverseRecord, {
    canonicalAuthority: data.canonicalAuthority,
  }).ok, true, 'test-only canonical assignment must satisfy the same eligibility gate');
  const semanticSubject = core.subjectProjectionForRecord(reverseRecord, '', data.projectionPolicy);
  assert.equal(semanticSubject, 'ALGEBRA');
  const filters = {
    grade: '고2',
    curriculumKey: reverseRecord.curriculumKey,
    semanticSubject,
  };
  w.state.find = filters;
  const finderRows = w.findExams();
  const listedExam = finderRows.find(row => row.file === reverseRecord.sourceFile);
  assert.ok(listedExam, 'high2 Finder should show the isolated test-only high3 fixture by its shared subject');
  const examIndex = w.state.catalog.exams.indexOf(listedExam);
  assert.match(w.renderFind(), new RegExp(`data-action="source-toggle" data-exam="${examIndex}"`));
  await click({ action: 'source-toggle', exam: String(examIndex) });
  const beforeUids = data.records.filter(row => row.sourceFile === reverseRecord.sourceFile &&
    core.matches(row, filters, { catalog: data, projectionPolicy: data.projectionPolicy }) &&
    core.basicEligibility(row, { canonicalAuthority: data.canonicalAuthority }).ok)
    .map(row => row.questionUid).sort();
  assert.deepEqual(beforeUids, [reverseRecord.questionUid]);
  await click({ action: 'go-compose', useSources: 'true' });
  assert.deepEqual(plain(w.state.sources), [reverseRecord.sourceFile]);
  assert.deepEqual(data.records.filter(row => row.sourceFile === reverseRecord.sourceFile &&
    core.matches(row, w.state.filters, { catalog: data, projectionPolicy: data.projectionPolicy }) &&
    core.basicEligibility(row, { canonicalAuthority: data.canonicalAuthority }).ok)
    .map(row => row.questionUid).sort(), beforeUids,
  'the exact same test-only high3 UID remains eligible after Compose entry');
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
    ['archive2-canonical.js', '20261104-source-meta-approval-1'],
    ['archive2-core.js', '20261119-pair-type-spread-1'],
    ['meta-foundation-runtime.js', '20261110-first-paint-1'],
    ['archive2-history.js', '20261110-teacher-copy-1'],
    ['archive2-quick-pools.js', '20261117-middle-parent-1'],
    ['archive2-unit-tree.js', '20261117-middle-parent-1'],
    ['archive2-similar.js', '20261110-similar-1'],
    ['archive2-unified-units.js', '20261117-middle-parent-1'],
  ])
    assert.match(html, new RegExp(file.replace('.', '\\.') + '\\?v=' + version));
  assertWorkspaceScriptVersions(assert);
  assert.match(html, /problem-bank-meta\.js\?v=20261029-s14-1/);
  assert.match(html, /archive2-source\.js\?v=20261119-verified-rename-1/);
  assert.match(html, /archive2-library\.js\?v=20261111-assign-2/);
  assert.match(html, /archive2\.css\?v=20261119-restore-last-1/);
  assert.match(html, /archive2-tokens\.css\?v=20261110-shell-1/);
  assert.match(html, /archive2-papers\.js\?v=20261110-teacher-copy-1/);
  assert.match(html, /archive2-navigation\.js\?v=20261116-standalone-1/);
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
    // 난이도 is a primary control: 전체 is pressed and the note says unselected means every difficulty.
    assert.match(w.renderComposition(), /data-action="bucket-all"[^>]*aria-pressed="true"/);
    assert.match(w.renderComposition(), /고르지 않으면 모든 단계에서 뽑습니다/);
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

test('problem paper maker uses a recorded difficulty without approval labels or text binding', async () => {
  const r2 = basicRecord('중3', {
    difficultyBucket: 2, difficultyConfidence: undefined, difficultyBoundaryFlag: undefined,
    legacyLevelCompatibility: undefined, sourceStatus: 'HOLD', metaBinding: 'text',
    metadataConflicts: ['difficultyBucket'],
  });
  const r3 = basicRecord('중3', {
    questionUid: 'qid_v1_' + crypto.createHash('sha256').update('general-r3').digest('hex'),
    difficultyBucket: 3, sourceStatus: 'HOLD', metaBinding: 'text',
  });
  // same bucket 2, no text binding recorded: still usable (binding is a label); a broken source
  // reference (generalUseEligibility) is the real defect and stays out
  const unbound = basicRecord('중3', {
    questionUid: 'qid_v1_' + crypto.createHash('sha256').update('general-unbound').digest('hex'),
    difficultyBucket: 2, sourceStatus: 'HOLD', metaBinding: '',
  });
  const brokenSource = basicRecord('중3', {
    questionUid: 'qid_v1_' + crypto.createHash('sha256').update('general-broken-source').digest('hex'),
    difficultyBucket: 2, sourceIntegrityStatus: 'MISMATCH',
  });
  const { w, click } = harness({ ...catalog, records: [r2, r3, unbound, brokenSource], taxonomy: [] });
  w.state.useMode = 'general';
  w.state.filters = { grade: '중3' };
  await click({ action: 'bucket', bucket: '2' });
  w.state.scopes = w.scopeOptions().map(scope => scope.key);
  w.state.distribution = 'all';
  const req = w.request();
  assert.equal(req.rows[0].count, 2, 'the recorded bucket survives missing auxiliary metadata and a missing binding');
  const selected = core.selectBlueprint([r2, r3, unbound, brokenSource], req);
  assert.equal(selected.ok, true);
  assert.deepEqual(selected.selected.map(row => row.questionUid).sort(), [r2.questionUid, unbound.questionUid].sort(),
    'the broken-source row is excluded by the usage gate, the unbound row is not');
  assert.notEqual(core.review(selected.selected, req).status, 'HARD_BLOCK');
  await click({ action: 'bucket-all' });
  assert.equal(w.request().rows[0].count, 3, 'with no difficulty filter every usable row counts');
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
  assert.match(savedCompose, /data-action="saved-paper-issue" data-paper-id="00000000-0000-4000-8000-000000000001" class="primary" aria-label="이 저장본 반에 출제">이 저장본 출제/);
  assert.doesNotMatch(savedCompose, /index\.html\?savedPaper=/);
  for (const mode of ["exam", "sol", "ans"])
    assert.match(savedCompose, new RegExp(`data-action="saved-output" data-paper-id="00000000-0000-4000-8000-000000000001" data-mode="${mode}"`));
  // 하단 띠: 저장된 뒤에는 같은 저장본으로 바로 반에 출제(save-and-assign)가 열린다.
  assert.match(w.renderMobileActions(), /class="cz-bar"[\s\S]*저장했습니다[\s\S]*data-action="save-and-assign"[^>]*>저장한 문제지 출제/);
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
  assert.match(compose, /class="cz-result-body" inert/);
  assert.match(compose, /data-cz-conditions inert/);
  assert.match(compose, /data-action="save-paper"[^>]*>저장 결과 확인/);
  assert.ok(compose.indexOf('data-action="save-paper"') < compose.indexOf('class="cz-result-body" inert'),
    'desktop recovery action must sit outside the inert editor region');
  assert.doesNotMatch(compose, /data-action="save-and-assign"[^>]*>저장하고 출제/,
    'no new save+assign while the previous save result is unknown');
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

test('Saved Paper revision Draft preserves the immutable source snapshot and lineage parent', async t => {
  const { w, ctx } = harness();
  // Re-saving a revision restores the question's original image path from its source file (the Worker embeds it again),
  // so the fixture question needs a real school-exam image field and the source files must be readable.
  const previousDocument = global.document;
  const previousFetch = global.fetch;
  global.document = { baseURI: "https://archive.test/archive/workspace.html" };
  global.fetch = async input => ({
    ok: true,
    status: 200,
    text: async () => fs.readFileSync(path.join(root, "archive/exams",
      decodeURIComponent(new URL(String(input)).pathname.replace("/archive/exams/", ""))), "utf8"),
  });
  t.after(() => {
    if (previousDocument === undefined) delete global.document; else global.document = previousDocument;
    if (previousFetch === undefined) delete global.fetch; else global.fetch = previousFetch;
  });
  const record = findImageFieldQuestion();
  assert.ok(record, 'the data has a question with an image field');
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
  assert.throws(() => w.applySavedPaperRevision(changedSource), /원본 문항이 바뀌어/);

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
  const [originalQuestion] = await archiveSource.restore([record], catalog);
  assert.equal(savedPayload.papers[0].questions[0].image, originalQuestion.image,
    'the image the Worker embedded goes back as its original path (the Worker embeds it again)');
  assert.notEqual(savedPayload.papers[0].questions[0].image, frozenQuestion.image);

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

test('multi-word Finder search matches every word in any order against visible exam values', () => {
  const { w } = harness();
  const exam = catalog.exams.find(row => row.school && row.grade && row.year && row.semester && row.examType);
  assert.ok(exam, 'fixture needs an exam with school, grade, year and period');
  const period = exam.examType === 'mid' ? '중간' : '기말';
  const run = query => { w.state.find = { query }; return w.findExams().map(row => row.file); };
  const single = run(exam.school);
  assert.ok(single.includes(exam.file), 'one-word search keeps matching');
  for (const query of [
    `${exam.school} ${exam.grade}`,
    `${exam.grade} ${exam.school} ${period}`,
    `${period} ${exam.semester}학기 ${exam.school} ${exam.grade}`,
  ])
    assert.ok(run(query).includes(exam.file), `"${query}" must find the exam`);
  assert.ok(run(`${exam.school} ${exam.grade}`).every(file => single.includes(file)),
    'extra words only narrow the one-word result');
  assert.equal(run(`${exam.school} zzzz-no-such-word`).length, 0, 'every word must match');
  assert.equal(run('semester').includes(exam.file), false, 'JSON key names are not searchable text');
});

test('a tampered backup is refused before anything reaches state or the page', () => {
  const { w } = harness();
  const good = plain(w.draft());
  const before = JSON.stringify(plain(w.state.count)) + JSON.stringify(plain(w.state.round));
  for (const [key, value] of [
    ['count', '1"><img src=x onerror=alert(1)>'],
    ['count', null],
    ['count', NaN],
    ['round', '<script>alert(1)</script>'],
    ['buckets', ['<img src=x>']],
    ['distribution', 'drop'],
    ['qpp', '4'],
    ['header', { title: { x: 1 } }],
    ['filters', { grade: { nested: true } }],
    ['studentIds', [1, 2]],
    ['saveResultState', '<b>'],
    ['rows', [{ id: 'a', count: '9' }]],
    ['custom', { a: { count: '5' } }],
  ]) {
    assert.throws(() => w.applyDraft({ ...good, [key]: value }), /형식이 올바르지 않아 불러올 수 없습니다/, `${key} must be rejected`);
  }
  assert.throws(() => w.applyDraft(null), /형식이 올바르지 않아/);
  assert.equal(JSON.stringify(plain(w.state.count)) + JSON.stringify(plain(w.state.round)), before, 'a rejected file changes nothing');
  assert.doesNotThrow(() => w.applyDraft(good), 'an untouched backup still restores');
});

test('counts a teacher can type (10.5, -3, 1200) are restored clamped instead of being refused', () => {
  const { w } = harness();
  const good = plain(w.draft());
  for (const [typed, expected] of [[10.5, 11], [-3, 1], [1200, 400], [0, 1]]) {
    w.applyDraft({ ...good, count: typed, custom: { k: { count: typed } }, rows: [{ id: 'k', count: typed }] });
    assert.equal(w.state.count, expected, `count ${typed}`);
    assert.equal(w.state.custom.k.count, expected, `custom count ${typed}`);
    assert.equal(w.state.rows[0].count, typed === 1200 ? 1200 : Math.max(0, Math.round(typed)), `row count ${typed}`);
  }
});

test('the unknown-result warning checkbox survives the input then change event order', async () => {
  const { w, events } = harness();
  const record = catalog.records.find(row => core.basicEligibility(row, { canonicalAuthority: catalog.canonicalAuthority }).ok);
  const scope = core.pathKey(record, 4);
  w.state.filters = { grade: record.effectiveBrowseGrade };
  w.state.scopes = [scope];
  w.state.rows = [{ id: scope, paths: [scope], scopeQuestionUids: [record.questionUid], count: 1 }];
  w.state.selected = [{ ...record, rowId: scope }];
  w.state.saveBatchId = '00000000-0000-4000-8000-000000000198';
  w.state.saveSignature = 'sig';
  w.state.saveResultSignature = w.saveWorkSignature();
  w.state.saveResultState = 'RESULT_UNKNOWN';
  w.state.ackWarnings = false;
  let renders = 0;
  w.setRender(() => { renders++; });
  const target = { id: 'ack-warnings-recovery', checked: true, dataset: {} };
  // Dispatch in the browser's order: input first, then change on the same element.
  for (const callback of events.get('input') || []) await callback({ target });
  assert.equal(renders, 0, 'input must not re-render (it would replace the checkbox before change fires)');
  for (const callback of events.get('change') || []) await callback({ target });
  assert.equal(w.state.ackWarnings, true, 'the acknowledgement is recorded');
});

test('while a save result is unknown, output and backup stay reachable and only edits are locked', async () => {
  const { w, ctx, click } = harness();
  const record = catalog.records.find(row => core.basicEligibility(row, { canonicalAuthority: catalog.canonicalAuthority }).ok);
  const scope = core.pathKey(record, 4);
  w.state.filters = { grade: record.effectiveBrowseGrade };
  w.state.scopes = [scope];
  w.state.rows = [{ id: scope, paths: [scope], scopeQuestionUids: [record.questionUid], count: 1 }];
  w.state.selected = [{ ...record, rowId: scope }];
  w.state.saveBatchId = '00000000-0000-4000-8000-000000000199';
  w.state.saveSignature = 'sig';
  w.state.saveResultSignature = w.saveWorkSignature();
  w.state.saveResultState = 'RESULT_UNKNOWN';
  const compose = w.renderCompose();
  const recovery = compose.slice(compose.indexOf('id="compose-save-continuity"'), compose.indexOf('class="cz-result-body"'));
  assert.match(recovery, /data-action="print"/, 'output is offered outside the inert editor');
  assert.match(recovery, /data-action="backup"/, 'backup is offered outside the inert editor');
  assert.doesNotMatch(recovery, /Draft/, 'teacher-facing text avoids the word Draft');
  assert.match(w.renderMobileActions(), /data-action="print"/);
  const statusNode = ctx.document.getElementById('status');
  statusNode.textContent = '';
  await click({ action: 'pin', index: '0' });
  assert.match(statusNode.textContent, /편집을 잠급니다/, 'an editing action stays locked');
  statusNode.textContent = '';
  await click({ action: 'close-dialog' });
  assert.doesNotMatch(statusNode.textContent, /잠급니다/, 'closing a dialog is not locked');
});

// ---- 저장 요청 본문을 서버 계약에 맞춘다 (savePapers: saveWireQuestion / saveRequestFilters / parity 문구) ----
function savedPaperOk() {
  return { ok: true, status: 200, json: async () => ({ success: true, saved: true, papers: [{ id: crypto.randomUUID() }] }) };
}
function captureSavePost(ctx, reply = savedPaperOk) {
  const bodies = [];
  ctx.fetch = async (url, init = {}) => {
    const parsed = new URL(String(url));
    if (parsed.pathname === '/api/archive-saved-papers' && init.method === 'POST') {
      bodies.push(JSON.parse(init.body));
      return reply();
    }
    throw new Error('unexpected API request: ' + parsed.pathname);
  };
  return bodies;
}

test('저장 요청 본문의 정본 메타 필드는 카탈로그 값이고 미리보기·인쇄용 문항은 바뀌지 않는다', async t => {
  const { w, ctx } = configureSaveHarness(t);
  const uid = w.state.selected[0].questionUid;
  // 카탈로그: courseKey·curriculumKey는 빈 값, L3 필드는 없음. 원본 JS에서 복원한 문항은 그 자리에 원본 값을 남긴다(Source.restore).
  const catalogRecord = { ...w.state.byUid.get(uid), courseKey: '', curriculumKey: '' };
  delete catalogRecord.L3;
  w.state.byUid.set(uid, catalogRecord);
  const [paper] = await w.prepare();
  const shown = paper.questions[0];
  Object.assign(shown, { courseKey: 'SOURCE-ONLY-COURSE', curriculumKey: 'SOURCE-ONLY-CURRICULUM', L3: 'SOURCE-ONLY-L3' });
  const shownBefore = plain(shown);
  const bodies = captureSavePost(ctx);

  await w.savePapers();
  assert.equal(w.state.saveResultState, 'SAVED', w.state.saveError);
  assert.equal(bodies.length, 1);
  const sent = bodies[0].papers[0].questions[0];
  for (const field of core.META_FIELDS) {
    if (catalogRecord[field] === undefined) assert.equal(Object.hasOwn(sent, field), false, field + ' is absent in the catalog, so it is absent in the request');
    else assert.deepEqual(sent[field], plain(catalogRecord[field]), field + ' equals the catalog record');
  }
  assert.equal(sent.courseKey, '', 'an empty catalog value is sent as empty, not dropped and not replaced by the source value');
  assert.equal(Object.hasOwn(sent, 'L3'), false);
  for (const field of ['questionUid', 'sourceArchiveFile', 'sourceOrdinal', 'sourceFingerprint', 'content', 'answer', 'solution'])
    assert.deepEqual(sent[field], plain(shown[field]), field + ' is not a metadata field and is sent unchanged');
  // Preview/print objects keep the restored (source) values.
  assert.deepEqual(plain(w.state.prepared[0].questions[0]), shownBefore);
  assert.equal(shown.courseKey, 'SOURCE-ONLY-COURSE');
});

test('카탈로그 레코드가 없는 문항(수정본·옛 출제 등)은 전송 본문에서도 그대로 보낸다', async t => {
  const { w, ctx } = configureSaveHarness(t);
  const uid = w.state.selected[0].questionUid;
  const [paper] = await w.prepare();
  paper.questions[0].courseKey = 'FROZEN-COURSE';
  w.state.byUid.delete(uid);
  const bodies = captureSavePost(ctx);
  await w.savePapers();
  assert.equal(w.state.saveResultState, 'SAVED', w.state.saveError);
  assert.deepEqual(bodies[0].papers[0].questions[0], plain(paper.questions[0]));
});

test('찾기 화면에서 넘어온 material·file·similarOnly는 저장 요청의 selection_filters에 넣지 않는다', async t => {
  const { w, ctx } = configureSaveHarness(t);
  w.state.filters = { ...w.state.filters, material: 'exam', file: 'x.js', similarOnly: '1', school: '' };
  const bodies = captureSavePost(ctx);
  await w.savePapers();
  assert.equal(w.state.saveResultState, 'SAVED', w.state.saveError);
  const filters = bodies[0].selection_filters;
  for (const key of ['material', 'file', 'similarOnly']) assert.equal(Object.hasOwn(filters, key), false, key);
  assert.ok(filters.grade && Array.isArray(filters.primaryPaths) && Array.isArray(filters.sourceFiles), 'the real range conditions stay');
});

test('저장이 정본 메타 불일치(409)로 거절되면 화면에는 안내 문구만, 서버 원문은 콘솔에만 남긴다', async t => {
  const raw = 'canonical metadata parity mismatch: courseKey';
  const run = async (message, status = 409) => {
    const { w, ctx } = configureSaveHarness(t);
    captureSavePost(ctx, () => ({ ok: false, status, json: async () => ({ success: false, error: message }) }));
    await w.savePapers();
    return w.state;
  };
  const warn = t.mock.method(console, 'warn', () => {});
  const state = await run(raw);
  assert.equal(state.saveResultState, 'FAILED');
  assert.equal(state.saveError, '분류 자료가 서버와 다릅니다. 새로고침한 뒤 다시 저장해 주세요.');
  assert.doesNotMatch(state.saveError, /parity|courseKey/);
  assert.ok(warn.mock.calls.some(call => call.arguments.some(arg => String(arg).includes(raw))), 'raw server text goes to console.warn');
  // 너무 큼(413)은 서버 문장 대신 할 일이 든 문구를 보이고, 서버 원문은 접힌 상세로 간다(아래 테스트).
  const other = await run('1권 데이터가 저장 한도(1,500,000바이트)를 넘었습니다.', 413);
  assert.match(other.saveError, /너무 커서.*나누거나 문항 수를 줄여/);
});

// ---- 저장 실패 문구: 거절 이유마다 다른 문구, 할 일 포함, 서버 원문·내부 용어 비노출 ----
// 화면은 archive2-error-detail.js가 있을 때 문구를 만든다(워크스페이스 페이지가 함께 올린다). 하네스에도 올려 실제 경로로 본다.
const withErrorDetail = harness => { harness.ctx.Archive2ErrorDetail = require('../archive/archive2-error-detail.js'); return harness; };
test('저장 실패 문구는 이유(로그인 만료·너무 큼·분류 기준 갱신·분류 자료 불일치)마다 다르고 할 일이 들어 있다', async t => {
  t.mock.method(console, 'warn', () => {});
  const cases = [
    { status: 401, raw: 'Unauthorized', todo: /다시 로그인/, keeps: /초안에 남아 있습니다/ },
    { status: 403, raw: 'Forbidden: teacher only', todo: /다시 로그인/, keeps: /초안에 남아 있습니다/ },
    { status: 413, raw: 'Payload too large: 1500000 bytes', todo: /나누거나 문항 수를 줄여/ },
    { status: 409, raw: '분류 기준이 갱신되었습니다. 문항 목록을 새로고침하세요.', todo: /새로고침/, stale: true },
    { status: 409, raw: 'canonical metadata parity mismatch: courseKey', todo: /새로고침/ },
  ];
  const seen = new Map();
  for (const item of cases) {
    const { w, ctx } = withErrorDetail(configureSaveHarness(t));
    let posts = 0;
    ctx.fetch = async (url, init = {}) => {
      const parsed = new URL(String(url));
      if (parsed.pathname === '/api/archive-saved-papers' && init.method === 'POST') { posts++; return { ok: false, status: item.status, json: async () => ({ success: false, error: item.raw }) }; }
      if (parsed.pathname.endsWith('/data/archive2-canonical-input-manifest.json')) return { ok: false, status: 503, text: async () => '' };
      throw new Error('unexpected request: ' + parsed.pathname);
    };
    await w.savePapers();
    const shown = w.state.saveError, label = `${item.status} ${item.raw}`;
    assert.equal(w.state.saveResultState, 'FAILED', label);
    assert.match(shown, item.todo, label);
    if (item.keeps) assert.match(shown, item.keeps, label);
    assert.doesNotMatch(shown, /parity|courseKey|Unauthorized|Forbidden|Payload|bytes|HOLD|projection|canonical|HTTP/i, label);
    assert.match(String(ctx.document.getElementById('status').textContent), /시험지를 저장하지 못했습니다\./, label);
    assert.ok(posts <= 2, label + ': no extra retries beyond the existing stale-version resend');
    seen.set(label, shown);
  }
  // 401과 403은 같은 안내, 나머지는 서로 다른 문구.
  assert.equal(seen.get('401 Unauthorized'), seen.get('403 Forbidden: teacher only'));
  const distinct = new Set([...seen.values()]);
  assert.equal(distinct.size, 4, [...distinct].join(' | '));
});

test('저장 실패의 서버 원문은 접힌 상세에만 있고, 표에 없는 거절은 일반 문구에 코드가 붙는다', async t => {
  t.mock.method(console, 'warn', () => {});
  const { w, ctx } = withErrorDetail(configureSaveHarness(t));
  captureSavePost(ctx, () => ({ ok: false, status: 413, json: async () => ({ success: false, error: 'Payload too large: 1500000 bytes' }) }));
  await w.savePapers();
  const info = require('../archive/archive2-error-detail.js').describe(Object.assign(new Error('Payload too large: 1500000 bytes'), { status: 413, data: { error: 'Payload too large: 1500000 bytes' } }), { headline: w.state.saveError });
  assert.equal(info.headline, w.state.saveError);
  assert.match(info.detailText, /Payload too large/, 'the original text is in the folded detail');
  assert.match(info.detailText, /413/);
  assert.doesNotMatch(info.headline, /Payload/);
  // 표에 없는 4xx(예: 422)는 지금과 같다: 영어 원문은 일반 문구로 가려진다.
  const other = withErrorDetail(configureSaveHarness(t));
  captureSavePost(other.ctx, () => ({ ok: false, status: 422, json: async () => ({ success: false, error: 'validation failed: papers[0]' }) }));
  await other.w.savePapers();
  assert.equal(other.w.state.saveResultState, 'FAILED');
  assert.equal(other.w.state.saveError, 'validation failed: papers[0]', 'unchanged: the screen turns this into the general sentence');
  assert.equal(other.ctx.document.getElementById('status').textContent, '시험지를 저장하지 못했습니다. 작업과 미리보기는 유지했습니다.');
});

test('네트워크 끊김·시간 초과는 거절이 아니라 결과 모름이라 저장 결과 확인을 안내한다(문구 그대로)', async t => {
  for (const make of [() => new TypeError('Failed to fetch'), () => Object.assign(new Error('응답이 늦습니다. 잠시 뒤 다시 시도해 주세요.'), { timeout: true })]) {
    const { w, ctx } = withErrorDetail(configureSaveHarness(t));
    ctx.fetch = async (url, init = {}) => { if (new URL(String(url)).pathname === '/api/archive-saved-papers' && init.method === 'POST') throw make(); throw new Error('lost'); };
    await w.savePapers();
    assert.equal(w.state.saveResultState, 'RESULT_UNKNOWN');
    assert.match(String(ctx.document.getElementById('status').textContent), /저장 결과를 확인하지 못했습니다.*저장 결과 확인/);
  }
});

// ---- 요청이 나가기 전의 실패(로그인 정보 없음)는 결과 모름이 아니다. 나간 뒤의 끊김·시간 초과·5xx는 계속 결과 모름 ----
const LOGIN_NEEDED = /로그인이 필요합니다.*로그인한 뒤 저장해 주세요.*초안에 남아 있습니다/;
function countingFetch(ctx, reply) {
  const calls = [];
  ctx.fetch = async (url, init = {}) => {
    const parsed = new URL(String(url));
    calls.push(parsed.pathname + ' ' + (init.method || 'GET'));
    return reply(parsed, init);
  };
  return calls;
}
const saveCalls = calls => calls.filter(call => call === '/api/archive-saved-papers POST').length;

test('로그인 정보가 없으면 요청을 보내지 않고 일반 실패로 처리한다: 편집 잠금 없음, 로그인 안내, 같은 batch id로 다시 저장', async t => {
  t.mock.method(console, 'warn', () => {});
  const { w, ctx, statusText } = (() => { const h = withErrorDetail(configureSaveHarness(t)); return { ...h, statusText: () => String(h.ctx.document.getElementById('status').textContent) }; })();
  ctx.localStorage.setItem('APMATH_SESSION', 'null'); // 로그인 정보 없음
  const calls = countingFetch(ctx, () => { throw new Error('nothing may be fetched without a login'); });
  await w.savePapers();
  assert.equal(calls.length, 0, 'fetch is never called');
  assert.equal(w.state.saveResultState, 'FAILED');
  assert.notEqual(w.state.saveResultState, 'RESULT_UNKNOWN');
  assert.match(w.state.saveError, LOGIN_NEEDED);
  assert.match(statusText(), LOGIN_NEEDED);
  assert.doesNotMatch(statusText() + w.state.saveError, /결과를 확인하지 못했습니다|저장 결과 확인|중복 저장/);
  const batch = w.state.saveBatchId;
  assert.ok(batch, 'the batch id was prepared but never reached the server');
  await w.savePapers(); // 다시 눌러도 같은 안내(편집·저장이 잠기지 않음)
  assert.equal(w.state.saveResultState, 'FAILED');
  assert.equal(calls.length, 0);
  // 로그인한 뒤 같은 내용을 다시 저장하면 같은 batch id로 한 번 나가 저장된다(요청이 나간 적 없으므로 중복 위험 없음).
  ctx.localStorage.setItem('APMATH_SESSION', JSON.stringify({ id: 'fixture-teacher', session_token: 'fixture-token' }));
  const bodies = captureSavePost(ctx);
  await w.savePapers();
  assert.equal(w.state.saveResultState, 'SAVED', w.state.saveError);
  assert.equal(bodies.length, 1);
  assert.equal(bodies[0].save_batch_id, batch);
});

test('요청이 나간 뒤의 네트워크 끊김·시간 초과·5xx는 계속 결과 모름(RESULT_UNKNOWN)이다', async t => {
  t.mock.method(console, 'warn', () => {});
  const replies = [
    ['network cut', () => { throw new TypeError('Failed to fetch'); }],
    ['timeout error', () => { throw Object.assign(new Error('응답이 늦습니다. 잠시 뒤 다시 시도해 주세요.'), { timeout: true }); }],
    ['503', () => ({ ok: false, status: 503, json: async () => ({ success: false, error: 'Service Unavailable' }) })],
    ['500', () => ({ ok: false, status: 500, json: async () => ({ success: false, error: 'Internal error' }) })],
  ];
  for (const [label, reply] of replies) {
    const { w, ctx } = withErrorDetail(configureSaveHarness(t));
    const calls = countingFetch(ctx, (parsed, init) => {
      if (parsed.pathname === '/api/archive-saved-papers' && init.method === 'POST') return reply();
      throw new TypeError('Failed to fetch'); // 결과 확인(GET)도 닿지 않는다
    });
    await w.savePapers();
    assert.equal(saveCalls(calls), 1, label);
    assert.equal(w.state.saveResultState, 'RESULT_UNKNOWN', label);
    assert.match(String(ctx.document.getElementById('status').textContent), /저장 결과를 확인하지 못했습니다.*저장 결과 확인/, label);
    assert.doesNotMatch(String(ctx.document.getElementById('status').textContent), /로그인이 필요합니다/, label);
  }
});

test('401 응답은 로그인 만료 문구, 요청 전 로그인 없음은 로그인 필요 문구로 서로 다르다', async t => {
  t.mock.method(console, 'warn', () => {});
  const expired = withErrorDetail(configureSaveHarness(t));
  captureSavePost(expired.ctx, () => ({ ok: false, status: 401, json: async () => ({ success: false, error: 'Unauthorized' }) }));
  await expired.w.savePapers();
  assert.equal(expired.w.state.saveResultState, 'FAILED');
  assert.match(expired.w.state.saveError, /로그인이 만료됐습니다/);
  const missing = withErrorDetail(configureSaveHarness(t));
  missing.ctx.localStorage.setItem('APMATH_SESSION', 'null');
  await missing.w.savePapers();
  assert.match(missing.w.state.saveError, /로그인이 필요합니다/);
  assert.notEqual(expired.w.state.saveError, missing.w.state.saveError);
});

test('api()는 로그인 없이 막힌 요청에만 requestNotSent를 달고, 서버·네트워크 오류에는 달지 않는다', async t => {
  const { ctx } = configureSaveHarness(t);
  const request = ctx.Archive2Api.request;
  ctx.localStorage.setItem('APMATH_SESSION', 'null');
  let calls = 0;
  ctx.fetch = async () => { calls++; return { ok: true, status: 200, json: async () => ({ success: true }) }; };
  await assert.rejects(request('/anything', { a: 1 }), error => error.requestNotSent === true);
  assert.equal(calls, 0);
  ctx.localStorage.setItem('APMATH_SESSION', JSON.stringify({ id: 'fixture-teacher', session_token: 'fixture-token' }));
  ctx.fetch = async () => { throw new TypeError('Failed to fetch'); };
  await assert.rejects(request('/anything', { a: 1 }), error => error.requestNotSent === undefined);
  ctx.fetch = async () => ({ ok: false, status: 500, json: async () => ({ success: false, error: 'x' }) });
  await assert.rejects(request('/anything', { a: 1 }), error => error.requestNotSent === undefined && error.status === 500);
});

// ---- 저장은 "낡은 줄 아는 버전"을 보내지 않고, 서버가 앞서간 경우 한 번만 다시 읽어 다시 보낸다 ----
const STALE_VERSION_MESSAGE = '분류 기준이 갱신되었습니다. 문항 목록을 새로고침하세요.';
// 서버 대역: currentVersion과 같은 index_version만 받는다(archive2-questions.js의 확인과 같은 규칙). 같은 batch id는 같은 본문이면 되풀이 응답한다.
function versionedSaveServer(ctx, { currentVersion, manifestOk = true, alwaysStale = false }) {
  const posts = [];
  let manifestReads = 0;
  const manifestText = fs.readFileSync(path.join(root, 'archive/data/archive2-canonical-input-manifest.json'), 'utf8');
  ctx.fetch = async (url, init = {}) => {
    const parsed = new URL(String(url));
    if (parsed.pathname.endsWith('/data/archive2-canonical-input-manifest.json')) {
      manifestReads++;
      return manifestOk ? { ok: true, status: 200, text: async () => manifestText } : { ok: false, status: 503, text: async () => '' };
    }
    if (parsed.pathname === '/api/archive-saved-papers' && init.method === 'POST') {
      const body = JSON.parse(init.body);
      posts.push(body);
      if (alwaysStale || body.index_version !== currentVersion)
        return { ok: false, status: 409, json: async () => ({ success: false, error: STALE_VERSION_MESSAGE }) };
      return { ok: true, status: 200, json: async () => ({ success: true, saved: true, papers: body.papers.map(() => ({ id: crypto.randomUUID() })) }) };
    }
    throw new Error('unexpected request: ' + parsed.pathname);
  };
  return { posts, manifestReads: () => manifestReads };
}
const manifestVersion = () => JSON.parse(fs.readFileSync(path.join(root, 'archive/data/archive2-canonical-input-manifest.json'), 'utf8')).projectionVersion;
const sentVersions = body => [body.index_version, ...body.papers.map(paper => paper.meta.indexVersion)];

test('초안 버전(state.indexVersion)이 낡아도 화면 목록 버전으로 저장하고, 한 요청에 버전 값은 하나뿐이다', async t => {
  const { w, ctx } = configureSaveHarness(t);
  const catalogVersion = w.state.catalog.indexVersion;
  w.state.indexVersion = 'archive2-canonical-v1:' + '0'.repeat(64); // 초안을 만든 뒤 목록이 새로 읽힌 화면
  const server = versionedSaveServer(ctx, { currentVersion: catalogVersion });
  await w.savePapers();
  assert.equal(w.state.saveResultState, 'SAVED', w.state.saveError);
  assert.equal(server.posts.length, 1, 'no 409 round trip');
  assert.deepEqual([...new Set(sentVersions(server.posts[0]))], [catalogVersion], 'index_version and papers[].meta.indexVersion are the same single value');
  assert.equal(server.manifestReads(), 0);
});

test('정상이면 같은 버전·같은 batch id로 보내고 다시 저장해도 중복되지 않는다', async t => {
  const { w, ctx } = configureSaveHarness(t);
  const server = versionedSaveServer(ctx, { currentVersion: w.state.catalog.indexVersion });
  await w.savePapers();
  await w.savePapers();
  assert.equal(w.state.saveResultState, 'SAVED', w.state.saveError);
  assert.equal(server.posts.length, 2);
  assert.equal(server.posts[0].save_batch_id, server.posts[1].save_batch_id, 'an unchanged paper keeps its batch id (idempotent)');
});

test('서버 기준이 화면보다 앞서면 현재 버전을 다시 읽어 한 번만 다시 보내고, 새 batch id를 쓴다', async t => {
  const { w, ctx } = configureSaveHarness(t);
  const serverVersion = manifestVersion();
  w.state.catalog = { ...w.state.catalog, indexVersion: 'archive2-canonical-v1:' + 'f'.repeat(64) }; // 화면이 연 뒤 배포되어 서버만 앞섬
  const server = versionedSaveServer(ctx, { currentVersion: serverVersion });
  await w.savePapers();
  assert.equal(w.state.saveResultState, 'SAVED', w.state.saveError);
  assert.equal(server.posts.length, 2, 'one rejected request and exactly one resend');
  assert.notEqual(server.posts[0].index_version, serverVersion);
  assert.deepEqual([...new Set(sentVersions(server.posts[1]))], [serverVersion]);
  assert.deepEqual([...new Set(sentVersions(server.posts[0]))], [server.posts[0].index_version]);
  assert.notEqual(server.posts[0].save_batch_id, server.posts[1].save_batch_id, 'the content changed (index_version), so the resend is a new batch');
  assert.equal(w.state.saveBatchId, server.posts[1].save_batch_id);
  assert.equal(server.manifestReads(), 1);
  // 같은 화면에서 다시 저장해도 이미 확인한 서버 버전을 바로 쓰고, 같은 batch id라 중복 저장이 생기지 않는다.
  await w.savePapers();
  assert.equal(server.posts.length, 3);
  assert.equal(server.posts[2].index_version, serverVersion);
  assert.equal(server.posts[2].save_batch_id, server.posts[1].save_batch_id);
  assert.equal(server.manifestReads(), 1);
});

test('다시 보내도 서버가 기준 갱신으로 거절하면 안내로 끝나고 요청은 2회를 넘지 않는다', async t => {
  const { w, ctx } = configureSaveHarness(t);
  w.state.catalog = { ...w.state.catalog, indexVersion: 'archive2-canonical-v1:' + 'e'.repeat(64) };
  const warn = t.mock.method(console, 'warn', () => {});
  const server = versionedSaveServer(ctx, { currentVersion: manifestVersion(), alwaysStale: true });
  await w.savePapers();
  assert.equal(w.state.saveResultState, 'FAILED');
  assert.equal(server.posts.length, 2);
  assert.equal(w.state.saveError, '문항 목록이 갱신되었습니다. 새로고침한 뒤 다시 저장해 주세요.');
  assert.ok(warn.mock.calls.length >= 1);
});

test('현재 버전을 읽지 못하거나 같은 버전이면 다시 보내지 않고 안내로 끝난다', async t => {
  for (const options of [{ manifestOk: false }, { manifestOk: true, sameVersion: true }]) {
    const { w, ctx } = configureSaveHarness(t);
    t.mock.method(console, 'warn', () => {});
    const own = options.sameVersion ? manifestVersion() : 'archive2-canonical-v1:' + 'd'.repeat(64);
    w.state.catalog = { ...w.state.catalog, indexVersion: own };
    const server = versionedSaveServer(ctx, { currentVersion: 'archive2-canonical-v1:' + 'c'.repeat(64), manifestOk: options.manifestOk });
    await w.savePapers();
    assert.equal(w.state.saveResultState, 'FAILED');
    assert.equal(server.posts.length, 1, JSON.stringify(options));
    assert.equal(w.state.saveError, '문항 목록이 갱신되었습니다. 새로고침한 뒤 다시 저장해 주세요.');
  }
});

test('기준 갱신이 아닌 409·413은 자동으로 다시 보내지 않는다', async t => {
  for (const [status, message] of [[409, 'save_batch_id was already used for different paper content'], [413, '1권 데이터가 저장 한도(1,500,000바이트)를 넘었습니다.']]) {
    const { w, ctx } = configureSaveHarness(t);
    const bodies = captureSavePost(ctx, () => ({ ok: false, status, json: async () => ({ success: false, error: message }) }));
    await w.savePapers();
    assert.equal(bodies.length, 1);
    assert.equal(w.state.saveResultState, 'FAILED');
  }
});

test('낡은 초안 버전은 저장 버튼 옆에 개발자식 안내를 내지 않는다', () => {
  assert.doesNotMatch(readWorkspace(), /문항 목록 버전이 달라/);
});

// ---- 수정본 재저장: 저장본에 서버가 내장한 그림(data: URL)은 전송 사본에서만 원래 경로로 되돌린다 (수리 목록 34) ----
// 본문·해설 HTML 안에 시험지 그림(<img src="assets/images/...">)이 있는 실제 문항을 찾는다(없는 자료면 이 검사가 실패해 알린다).
// An eligible record whose source question has a school-exam image in its `image` field (used by the revision draft test above).
function findImageFieldQuestion() {
  const byFile = new Map();
  for (const row of catalog.records) {
    if (!row.automatic) continue;
    if (!byFile.has(row.sourceFile)) byFile.set(row.sourceFile, []);
    byFile.get(row.sourceFile).push(row);
  }
  for (const [file, records] of [...byFile].slice(0, 600)) {
    const bank = archiveSource.evaluate(fs.readFileSync(path.join(root, 'archive/exams', file), 'utf8'), file);
    const hit = records.find(record => {
      const q = bank[record.sourceOrdinal - 1];
      return typeof q?.image === 'string' && q.image.startsWith('assets/images/') &&
        core.basicEligibility(record, { canonicalAuthority: catalog.canonicalAuthority }).ok;
    });
    if (hit) return hit;
  }
  return null;
}
function findHtmlImageQuestion() {
  const seen = new Set();
  for (const row of catalog.records) {
    if (!row.automatic || seen.has(row.sourceFile) || seen.size > 600) continue;
    if (!core.basicEligibility(row, { canonicalAuthority: catalog.canonicalAuthority }).ok) continue;
    seen.add(row.sourceFile);
    const bank = archiveSource.evaluate(fs.readFileSync(path.join(root, 'archive/exams', row.sourceFile), 'utf8'), row.sourceFile);
    for (const record of catalog.records) {
      if (record.sourceFile !== row.sourceFile || !record.automatic) continue;
      const q = bank[record.sourceOrdinal - 1];
      if (q && ['content', 'solution'].some(field => /<img\b[^>]*\bsrc\s*=\s*["'][^"']*assets\/images\//i.test(String(q[field] || ''))) &&
          core.basicEligibility(record, { canonicalAuthority: catalog.canonicalAuthority }).ok) return record;
    }
  }
  return null;
}
async function derivedHarness(t) {
  const { w, ctx } = configureSaveHarness(t);
  const record = findHtmlImageQuestion();
  assert.ok(record, 'the data has a question with an HTML image to test the revision re-save');
  const rowId = core.pathKey(record, 4);
  w.state.filters = { grade: record.effectiveBrowseGrade };
  w.state.scopes = [rowId];
  w.state.rows = [{ id: rowId, paths: [rowId], scopeQuestionUids: [record.questionUid], count: 1 }];
  w.state.selected = [{ ...record, rowId }];
  const [original] = await archiveSource.restore([record], catalog);
  // What the Worker stored at the first save: every school-exam image reference became a data: URL.
  const embed = value => typeof value === 'string'
    ? value.replace(/(\bsrc\s*=\s*["'])[^"']*assets\/images\/[^"']*(["'])/gi, '$1data:image/png;base64,AQID$2')
    : value;
  const frozen = structuredClone(original);
  for (const field of ['content', 'question', 'solution']) frozen[field] = embed(frozen[field]);
  if (typeof frozen.image === 'string' && frozen.image.includes('assets/images/')) frozen.image = 'data:image/png;base64,AQID';
  if (typeof frozen.solutionImage === 'string' && frozen.solutionImage.includes('assets/images/')) frozen.solutionImage = 'data:image/png;base64,AQID';
  assert.notDeepEqual(plain(frozen), plain(original), 'the frozen snapshot question carries embedded images');
  w.state.derivationSource = { parentKind: 'SAVED_PAPER', parentId: crypto.randomUUID(), parentRevision: null, parentSnapshotHash: 'a'.repeat(64), derivationType: 'REVISION' };
  w.state.derivedBaseQuestions = [frozen];
  w.state.prepared = [];
  return { w, ctx, frozen, original };
}

test('수정본 재저장: 내장된 그림은 원래 경로로 되돌려 보내고, 화면·미리보기용 문항은 바뀌지 않는다', async t => {
  const { w, ctx, frozen, original } = await derivedHarness(t);
  const bodies = captureSavePost(ctx);
  await w.savePapers();
  assert.equal(w.state.saveResultState, 'SAVED', w.state.saveError);
  const sent = bodies[0].papers[0].questions[0];
  for (const field of ['content', 'question', 'solution', 'image', 'solutionImage'])
    if (typeof original[field] === 'string') assert.equal(sent[field], original[field], field + ' goes back with the original image paths');
  assert.doesNotMatch(JSON.stringify(sent), /data:image\//, 'no embedded image is sent back');
  assert.deepEqual(plain(sent.choices), plain(original.choices));
  assert.equal(sent.answer, original.answer);
  // the object used for preview/print keeps the saved (embedded) content
  assert.deepEqual(plain(w.state.prepared[0].questions[0]), plain(frozen));
});

test('수정본 재저장: 저장본 문항의 본문이 달라졌으면(그림 자리 밖) 조용히 보내지 않고 막는다', async t => {
  const { w, ctx, frozen } = await derivedHarness(t);
  const field = ['content', 'solution', 'question'].find(f => typeof frozen[f] === 'string' && frozen[f].includes('data:image/'));
  assert.ok(field, 'an embedded HTML field exists');
  frozen[field] += ' 바뀐 문장';
  const bodies = captureSavePost(ctx);
  await w.savePapers();
  assert.notEqual(w.state.saveResultState, 'SAVED');
  assert.equal(bodies.length, 0, 'nothing was sent');
  assert.match(w.state.saveError, /원본 문항이 바뀌어/);
});

// ---- 학년·과목 버튼을 누른 뒤 저장해도 서버가 모르는 조건 키가 실리지 않는다 ----
// 학년·과목 버튼(changeComposeFilter)은 state.filters에 metaL3/metaPT/metaTPL/metaApprovedOnly를 ""로 만든다. 저장 서버는 값과 상관없이 모르는 키가 있으면
// 409 "허용되지 않은 출제 조건"으로 거절하므로, 저장 요청의 키는 서버가 읽는 허용 키 안에 있어야 한다. 허용 키는 손으로 옮겨 적지 않고 Worker 소스에서 읽는다.
function workerFilterKeys() {
  const text = fs.readFileSync(path.join(root, 'apmath/worker-backup/worker/helpers/archive-saved-papers.js'), 'utf8');
  const body = /const FILTER_KEYS = new Set\(\[([\s\S]*?)\]\)/.exec(text);
  assert.ok(body, 'the Worker declares FILTER_KEYS');
  const keys = new Set([...body[1].matchAll(/"([^"]+)"/g)].map(match => match[1]));
  assert.ok(keys.has('grade') && keys.has('primaryPaths') && keys.has('scopeQuestionUids'), 'the parsed Worker key list is the real one');
  return keys;
}
async function pressThenSave(t, presses) {
  const { w, ctx, click, change } = configureSaveHarness(t);
  for (const press of presses) {
    if (press.change) await change('compose', press.change[0], press.change[1]);
    else await click(press);
  }
  // 버튼이 단원 선택과 만든 결과를 비우므로, 버튼 뒤의 학년에서 단원을 고르고 문항을 뽑은 상태를 다시 만든다.
  const record = catalog.records.find(row => row.effectiveBrowseGrade === w.state.filters.grade &&
    core.matches(row, w.state.filters, w.state) &&
    core.basicEligibility(row, { canonicalAuthority: catalog.canonicalAuthority }).ok);
  assert.ok(record, 'a BASIC-eligible record that the pressed grade/subject filters accept in ' + w.state.filters.grade);
  const scope = core.pathKey(record, 4);
  w.state.scopes = [scope];
  w.state.rows = [{ id: scope, paths: [scope], scopeQuestionUids: [record.questionUid], count: 1 }];
  w.state.selected = [{ ...record, rowId: scope }];
  w.state.ackWarnings = true;
  const bodies = captureSavePost(ctx);
  await w.savePapers();
  assert.equal(w.state.saveResultState, 'SAVED', w.state.saveError);
  assert.equal(bodies.length, 1);
  return { w, record, filters: bodies[0].selection_filters };
}
const GRADE_BUTTONS = [{ action: 'compose-grade', grade: '중3' }, { action: 'compose-grade', grade: '고1' }];

for (const [name, presses] of [
  ['학년 버튼', [GRADE_BUTTONS[0]]],
  ['다른 학년 버튼', [GRADE_BUTTONS[1]]],
  ['학년 버튼 뒤 과목 버튼', [GRADE_BUTTONS[1], { action: 'compose-subject', subject: 'COMMON_MATH_2' }]],
  ['과목 버튼', [{ action: 'compose-subject', subject: 'COMMON_MATH_1' }]],
]) {
  test(`${name}를 누른 뒤 저장 요청의 selection_filters 키는 전부 서버 허용 키 안에 있다`, async t => {
    const allowed = workerFilterKeys();
    const { filters } = await pressThenSave(t, presses);
    const unknown = Object.keys(filters).filter(key => !allowed.has(key));
    assert.deepEqual(unknown, [], 'the server answers 409 for any key it does not know');
  });
}

test('세부 조건(개념·유형·풀이)을 실제로 고른 경우도 조건 키는 싣지 않고, 고른 문항은 범위 목록으로 서버 재검증을 통과한다', async t => {
  const allowed = workerFilterKeys();
  const { w, record, filters } = await pressThenSave(t, [GRADE_BUTTONS[1], { change: ['metaApprovedOnly', '1'] }]);
  assert.equal(w.state.filters.metaApprovedOnly, '1', "the teacher's choice stays the screen state (and the draft keeps it)");
  assert.deepEqual(Object.keys(filters).filter(key => !allowed.has(key)), []);
  assert.ok(filters.scopeQuestionUids.includes(record.questionUid), 'the selection travels as the scope UID list');
  assert.equal(core.matches(record, filters, { canonicalAuthority: catalog.canonicalAuthority }), true, 'the server replay accepts the saved question');
});
