const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const path = require('node:path');
const { core, catalog, workspace, productionCatalog, filterCases } = require('./helpers/archive2-scope-harness.cjs');
const root = path.resolve(__dirname, '..');

const normalized = value => String(value || '').replace(/\s+/g, '');
const parentKey = row => [core.normalizeCourseIdentity(row.courseKey), normalized(row.L1), normalized(row.L2)].join('|');
function selectableUids(data, filters, state) {
  return data.records.filter(row => core.matches(row, filters, state) && core.eligibility(row, state).ok &&
    core.basicScopeParent(row, data.basicScopeLinks, data.canonicalAuthority)).map(row => row.questionUid);
}

test('basic-scope parent-link generator verifies the canonical runtime contract', () => {
  const result = spawnSync(process.execPath, ['archive/tools/build-basic-scope-parent-links.mjs', '--check'], {
    cwd: root,
    encoding: 'utf8',
  });
  assert.equal(result.status, 0, result.stdout + result.stderr);
});

test('Compose renders only canonical parent scopes with UID-deduplicated selectable counts', () => {
  const app = workspace();
  const scopes = app.scopeOptions();
  assert.ok(scopes.length > 0);
  assert.ok(scopes.every(scope => scope.basicScope));
  assert.ok(scopes.every(scope => scope.count === scope.scopeQuestionUids.length));
  assert.ok(scopes.every(scope => scope.count === new Set(scope.scopeQuestionUids).size));
  assert.equal(new Set(scopes.flatMap(scope => scope.scopeQuestionUids)).size,
    scopes.reduce((count, scope) => count + scope.count, 0));
  const html = app.renderScopes();
  assert.doesNotMatch(html, /source-scope-detail|RAW-source-only|unpublished subunit/);
  assert.ok(!html.includes('도형의 방정식'));
});

test('select all and continuous ranges select only the visible canonical scopes', async () => {
  const app = workspace();
  const scopes = app.scopeOptions();
  await app.click({ action: 'scope-all' });
  assert.deepEqual(app.state.scopes, scopes.map(scope => scope.key));
  const selectedUids = app.selectedScopeQuestionUids();
  assert.deepEqual(new Set(selectedUids), new Set(scopes.flatMap(scope => scope.scopeQuestionUids)));
  app.controls['scope-start'] = { value: '0' };
  app.controls['scope-end'] = { value: String(scopes.length - 1) };
  await app.click({ action: 'scope-range' });
  assert.deepEqual(app.state.scopes, scopes.map(scope => scope.key));
  assert.ok(scopes.every(scope => scope.basicScope));
});

test('every grade displays only current canonical parents with selectable records', () => {
  for (const grade of ['중1', '중2', '중3', '고1', '고2', '고3']) {
    const filters = { grade, ...(['고2', '고3'].includes(grade) ? { semanticSubject: 'ALGEBRA' } : {}) };
    const app = workspace(filters);
    const expected = new Set(selectableUids(catalog, filters, app.state));
    const scopes = app.scopeOptions();
    const actual = new Set(scopes.flatMap(scope => scope.scopeQuestionUids));
    assert.deepEqual(actual, expected, grade);
    for (const scope of scopes) {
      for (const uid of scope.scopeQuestionUids) {
        const row = catalog.records.find(record => record.questionUid === uid);
        assert.ok(row && core.basicScopeParent(row, catalog.basicScopeLinks, catalog.canonicalAuthority), grade + '/' + uid);
      }
    }
  }
});

test('live runtime packs preserve master parent authority and add only separately validated taxonomy rows', async () => {
  const { data, runtime } = await productionCatalog();
  assert.equal(runtime.packs.length, 10);
  const canonical = new Set(data.basicTaxonomy.map(parentKey));
  assert.ok(canonical.size > 0);
  assert.ok(data.taxonomy.some(row => row.L3 || row.L4), 'runtime taxonomy carries separately validated advanced paths');
  for (const row of data.basicTaxonomy) assert.ok(canonical.has(parentKey(row)));
  const app = workspace({ grade: '고2', semanticSubject: 'PROB_STATS' }, data);
  const uids = app.scopeOptions().flatMap(scope => scope.scopeQuestionUids);
  assert.equal(uids.length, new Set(uids).size);
  for (const uid of uids) {
    const record = data.records.find(row => row.questionUid === uid);
    assert.ok(core.basicScopeParent(record, data.basicScopeLinks, data.canonicalAuthority));
  }
});

test('all grade, subject, semester and curriculum filters keep counts equal to canonical selectable UID pools', async () => {
  const { data: completeCatalog } = await productionCatalog();
  const cases = filterCases();
  assert.equal(cases.length, 72);
  const representativeUids = new Set();
  for (const filters of cases) {
    const rows = completeCatalog.records.filter(row => core.matches(row, filters, { catalog: completeCatalog }) &&
      core.eligibility(row, { canonicalAuthority: completeCatalog.canonicalAuthority }).ok &&
      core.basicScopeParent(row, completeCatalog.basicScopeLinks, completeCatalog.canonicalAuthority));
    for (const row of rows.slice(0, 2)) representativeUids.add(row.questionUid);
  }
  const data = { ...completeCatalog,
    records: completeCatalog.records.filter(row => representativeUids.has(row.questionUid)) };
  const before = JSON.stringify(data.records);
  for (const filters of cases) {
    const label = JSON.stringify(filters);
    const app = workspace(filters, data);
    const scopes = app.scopeOptions();
    const expected = new Set(selectableUids(data, filters, app.state));
    const actual = scopes.flatMap(scope => scope.scopeQuestionUids);
    assert.equal(actual.length, new Set(actual).size, label + ' duplicate UIDs');
    assert.deepEqual(new Set(actual), expected, label);
    for (const scope of scopes) {
      assert.ok(scope.basicScope, label + ' all scopes are canonical');
      assert.equal(scope.count, scope.scopeQuestionUids.length, label + ' count');
    }
  }
  assert.equal(JSON.stringify(data.records), before, 'scope display must not mutate taxonomy records');
});
