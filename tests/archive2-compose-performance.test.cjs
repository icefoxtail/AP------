const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const crypto = require('node:crypto');
const { performance } = require('node:perf_hooks');
const { catalog, core } = require('./helpers/archive2-scope-harness.cjs');
const problemBankMeta = require('../archive/problem-bank-meta.js');

function app(useMode = 'strict') {
  const nodes = { content: { addEventListener() {} } };
  const listeners = {};
  const window = {
    Archive2Core: core,
    ProblemBankMeta: problemBankMeta,
    Archive2Output: require('../archive/archive2-output.js'),
    Archive2Papers: require('../archive/archive2-papers.js'),
    addEventListener() {},
  };
  const source = fs.readFileSync(require.resolve('../archive/archive2-workspace.js'), 'utf8');
  vm.runInNewContext(source.slice(0, source.lastIndexOf('  (async () => {')) +
    'window.testApp = { state, render }; })();', {
    window, crypto, console, setTimeout: () => 0, clearTimeout() {},
    document: {
      getElementById: id => nodes[id] ||= { addEventListener() {} },
      querySelector: () => null, querySelectorAll: () => [], body: { dataset: {} },
      addEventListener: (name, fn) => listeners[name] = fn,
    },
  });
  const { state, render } = window.testApp;
  Object.assign(state, { catalog: structuredClone(catalog), view: 'compose', filters: { grade: '고1' }, useMode });
  state.metaIndex = window.ProblemBankMeta.buildIndex(state.catalog.records, []);
  state.metaIndexSource = state.catalog.records;
  state.finderIndex = core.buildFinderIndex(state.catalog);
  return { state, render, nodes, listeners };
}

test('production-size compose curriculum and scope interactions stay responsive', async t => {
  const a = app();
  assert.ok(a.state.catalog.records.length >= 10000, 'performance requires the full production-size archive');
  for (const curriculumKey of ['', '2015', '2022']) {
    a.state.filters.curriculumKey = curriculumKey;
    const start = performance.now();
    a.render();
    const elapsed = performance.now() - start;
    t.diagnostic(`curriculum ${curriculumKey || 'all'}: ${elapsed.toFixed(1)}ms`);
    assert.match(a.nodes.content.innerHTML, /data-scope=/);
    assert.ok(elapsed < 500, `compose blocks input for ${elapsed.toFixed(1)}ms`);
  }
  const knownMeta = a.state.catalog.records.find(record => record.L1 && Number.isInteger(record.difficultyBucket));
  assert.ok(knownMeta, 'production catalog must contain a concrete L1 and difficulty projection');
  a.state.filters = { grade: knownMeta.sourceGrade, L1: knownMeta.L1 };
  a.state.buckets = [knownMeta.difficultyBucket];
  const metaStart = performance.now();
  a.render();
  const metaElapsed = performance.now() - metaStart;
  t.diagnostic(`shared Meta L1+difficulty render: ${metaElapsed.toFixed(1)}ms`);
  assert.ok(metaElapsed < 500, `shared Meta filter blocks input for ${metaElapsed.toFixed(1)}ms`);
  const directMetaResult = problemBankMeta.query(a.state.metaIndex, {
    rpmL1: knownMeta.L1, difficultyBuckets: [knownMeta.difficultyBucket],
  }, { profile: 'DIRECT' });
  assert.ok(directMetaResult.some(record => record.questionUid === knownMeta.questionUid));
  a.state.filters = { grade: '고1' };
  a.state.buckets = [];
  a.render();
  const scope = a.nodes.content.innerHTML.match(/data-scope="([^"]+)"/)[1];
  const start = performance.now();
  await a.listeners.change({ target: { dataset: { scope }, checked: true } });
  const elapsed = performance.now() - start;
  t.diagnostic(`scope checkbox: ${elapsed.toFixed(1)}ms`);
  assert.ok(a.state.scopes.includes(scope));
  assert.match(a.nodes.content.innerHTML, /data-scope="[^"]+" checked/);
  assert.ok(elapsed < 500, `scope selection blocks input for ${elapsed.toFixed(1)}ms`);

  // A new render must recheck quality, even if the filter did not change.
  for (const record of a.state.catalog.records) record.sourceStatus = 'HOLD';
  a.render();
  assert.doesNotMatch(a.nodes.content.innerHTML, /data-scope=/);
});

test('select all and count edits do not block the production-size composition form', async t => {
  const a = app();
  a.render();
  const selectionStart = performance.now();
  await a.listeners.click({ target: { closest: selector => selector === 'button' ? { dataset: { action: 'scope-all' } } : null } });
  const selectionElapsed = performance.now() - selectionStart;
  t.diagnostic(`select-all click: ${selectionElapsed.toFixed(1)}ms`);
  assert.ok(selectionElapsed < 450, `select-all blocks input for ${selectionElapsed.toFixed(1)}ms`);
  a.state.scopes = [...a.nodes.content.innerHTML.matchAll(/data-scope="([^"]+)"/g)].map(match => match[1]);
  for (const distribution of ['equal', 'all']) {
    a.state.distribution = distribution;
    a.state.count = 20;
    const start = performance.now();
    a.render();
    const elapsed = performance.now() - start;
    t.diagnostic(`${distribution} selection/count edit: ${elapsed.toFixed(1)}ms`);
    assert.ok(elapsed < 450, `form blocks input for ${elapsed.toFixed(1)}ms`);
    assert.match(a.nodes.content.innerHTML, /data-action="generate"/);
  }
});

// Production boot switches state.useMode to "general" (archive2-workspace.js), and
// 고2/고3 subject selection resolves the subject projection for every record.
test('general useMode and 고2/고3 semantic subject selections stay responsive', t => {
  const a = app('general');
  assert.equal(a.state.useMode, 'general');
  assert.ok(a.state.catalog.records.length >= 10000, 'performance requires the full production-size archive');
  a.render(); // first render builds lazily created indexes, like the first screen after boot
  const cases = [{ grade: '고1' }, { grade: '중3' }];
  for (const [grade, subjects] of [
    ['고2', ['ALGEBRA', 'CALCULUS', 'PROB_STATS', 'CALCULUS_ADVANCED', 'GEOMETRY']],
    ['고3', ['ALGEBRA', 'CALCULUS', 'PROB_STATS', 'CALCULUS_ADVANCED', 'GEOMETRY']],
  ]) for (const semanticSubject of subjects) cases.push({ grade, semanticSubject });
  for (const useMode of ['general', 'strict']) {
    a.state.useMode = useMode;
    for (const filters of cases) {
      a.state.filters = { ...filters };
      a.state.scopes = [];
      const start = performance.now();
      a.render();
      const elapsed = performance.now() - start;
      t.diagnostic(`${useMode} ${JSON.stringify(filters)}: ${elapsed.toFixed(1)}ms`);
      assert.ok(a.nodes.content.innerHTML.length > 0, `${JSON.stringify(filters)} rendered nothing`);
      assert.ok(elapsed < 500, `${useMode} ${JSON.stringify(filters)} blocks input for ${elapsed.toFixed(1)}ms`);
    }
  }
});

// The first grade/subject change after boot evaluates records that the default
// 고1 screen never touched, so none of the per-record caches are filled yet. Use a
// fresh catalog clone per grade so every cache starts cold, like a real page load.
test('first 고2/고3 selection after boot (cold caches) stays responsive in general mode', t => {
  for (const [grade, subjects] of [
    ['고2', ['ALGEBRA', 'CALCULUS', 'PROB_STATS']],
    ['고3', ['CALCULUS_ADVANCED', 'GEOMETRY', 'ALGEBRA']],
  ]) {
    const a = app('general');
    a.render(); // boot screen: default 고1
    for (const filters of [{ grade }, ...subjects.map(semanticSubject => ({ grade, semanticSubject }))]) {
      a.state.filters = { ...filters };
      a.state.scopes = [];
      const start = performance.now();
      a.render();
      const elapsed = performance.now() - start;
      t.diagnostic(`cold general ${JSON.stringify(filters)}: ${elapsed.toFixed(1)}ms`);
      assert.ok(a.nodes.content.innerHTML.length > 0, `${JSON.stringify(filters)} rendered nothing`);
      assert.ok(elapsed < 500, `cold general ${JSON.stringify(filters)} blocks input for ${elapsed.toFixed(1)}ms`);
    }
  }
});

test('memoized subject projection is identical to the canonical resolver and follows policy edits', () => {
  const policy = catalog.projectionPolicy;
  const seen = new Set();
  let compared = 0;
  for (const record of catalog.records) {
    const key = [record.sourceGrade, record.curriculumKey, record.courseKey, record.standardUnitKey, record.legacyStandardUnitKey].join('|');
    if (seen.has(key)) continue;
    seen.add(key);
    const expected = core.Canonical.resolveSubjectProjection(record, policy) || '';
    assert.equal(core.subjectProjectionForRecord(record, '', policy), expected, key);
    assert.equal(core.subjectProjectionForRecord(record, '', policy), expected, key);
    compared += 1;
  }
  assert.ok(compared > 10);
  const record = { sourceGrade: '고1', curriculumKey: '2015', courseKey: '수학(상)', standardUnitKey: 'ZZ-TEST-UNIT' };
  const clonePolicy = structuredClone(policy);
  const before = core.subjectProjectionForRecord(record, '', clonePolicy);
  assert.equal(before, core.Canonical.resolveSubjectProjection(record, clonePolicy) || '');
  clonePolicy.gradeCourseAllowlist = clonePolicy.gradeCourseAllowlist.filter(row => !(row.grade === '고1' && row.courseKey === '수학(상)'));
  assert.equal(core.subjectProjectionForRecord(record, '', clonePolicy), core.Canonical.resolveSubjectProjection(record, clonePolicy) || '');
  assert.equal(core.subjectProjectionForRecord(record, '', null), '');
});
