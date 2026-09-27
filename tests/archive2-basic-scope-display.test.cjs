const test = require('node:test');
const assert = require('node:assert/strict');
const { core, catalog, workspace, productionCatalog, filterCases } = require('./helpers/archive2-scope-harness.cjs');

test('actual middle1 default shows the eight canonical L1 groups and nineteen L2 scopes', () => {
  const app = workspace();
  const scopes = app.scopeOptions();
  const basic = scopes.filter(s => s.basicScope);
  assert.equal(new Set(basic.map(s => s.L1)).size, 8);
  assert.equal(basic.length, 19);
  const html = app.renderScopes();
  const [main, detail] = html.split('<details class="compose-detail source-scope-detail"');
  assert.ok(detail);
  assert.doesNotMatch(detail.slice(0, detail.indexOf('>')), /\bopen\b/);
  for (const label of ['다면체의 옆면의 모양', '원뿔, 원뿔대의 전개도의 성질', '구의 부피', '히스토그램의 직사각형의 넓이']) {
    assert.ok(!main.includes(label), label);
    assert.ok(detail.includes(label), label);
  }
  assert.ok(!main.includes('도형의 방정식'));
  const sourcePaths = new Set(catalog.records.filter(r => core.matches(r, { grade: '중1' }) && r.L1 && r.L2).map(r => core.pathKey(r, 4)));
  const visiblePaths = new Set(scopes.flatMap(s => s.paths));
  for (const sourcePath of sourcePaths) assert.ok(visiblePaths.has(sourcePath), sourcePath);
});

test('all and continuous range choose only canonical scopes while detailed scopes stay selectable', async () => {
  const app = workspace();
  const scopes = app.scopeOptions();
  await app.click({ action: 'scope-all' });
  assert.equal(app.state.scopes.length, 19);
  assert.ok(app.state.scopes.every(key => scopes.find(s => s.key === key).basicScope));
  app.controls['scope-start'] = { value: '0' };
  app.controls['scope-end'] = { value: String(scopes.length - 1) };
  await app.click({ action: 'scope-range' });
  assert.equal(app.state.scopes.length, 19);
  const target = scopes.find(s => s.L1 === '구의 부피');
  const groups = [...new Set(scopes.map(s => s.L1))];
  await app.click({ action: 'scope-clear' });
  await app.click({ action: 'scope-group', groupIndex: String(groups.indexOf(target.L1)), scopeKind: 'detail' });
  assert.ok(app.state.scopes.includes(target.key));
  assert.ok(app.renderScopes().includes('class="compose-detail source-scope-detail" open'));
  const req = { filters: { grade: '중1', primaryPaths: app.selectedScopePaths() }, rows: [{ id: 'detail', paths: target.paths, count: 1 }], seed: 'scope-display' };
  const selected = core.selectBlueprint(catalog.records, req);
  assert.equal(selected.ok, true);
  assert.equal(selected.selected[0].L1, '구의 부피');
  assert.notEqual(core.review(selected.selected, req).status, 'HARD_BLOCK');
});

test('every grade keeps default parent names inside its published taxonomy', () => {
  for (const grade of ['중1', '중2', '중3', '고1', '고2', '고3']) {
    const filters = { grade, ...(['고2', '고3'].includes(grade) ? { semanticSubject: 'ALGEBRA' } : {}) };
    const app = workspace(filters);
    const canonical = new Set(catalog.taxonomy.map(r => r.L1.replace(/\s+/g, '') + '|' + r.L2.replace(/\s+/g, '')));
    for (const scope of app.scopeOptions().filter(s => s.basicScope))
      assert.ok(canonical.has(scope.L1.replace(/\s+/g, '') + '|' + scope.L2.replace(/\s+/g, '')), `${grade} ${scope.L1} ${scope.L2}`);
  }
});

test('all ten live runtime packs preserve the basic parent authority before adding advanced rows', async () => {
  const { data, runtime } = await productionCatalog();
  assert.equal(runtime.packs.length, 10);
  assert.equal(data.basicTaxonomy, catalog.taxonomy);
  const parent = row => [core.normalizeCourseIdentity(row.courseKey), row.L1?.replace(/\s+/g, ''), row.L2?.replace(/\s+/g, '')].join('|');
  const canonical = new Set(data.basicTaxonomy.map(parent));
  assert.ok(data.taxonomy.some(row => !canonical.has(parent(row))), 'live packs contain additional advanced/legacy parents');
  const app = workspace({ grade: '고2', semanticSubject: 'PROB_STATS' }, data);
  const [main, detail] = app.renderScopes().split('<details class="compose-detail source-scope-detail"');
  for (const label of ['신뢰구간', '확률변수와 기댓값', '순열과 조합 핵심 개념']) {
    assert.ok(!main.includes(label), label);
    assert.ok(detail.includes(label), label);
  }
});

test('all 66 grade, subject, semester and curriculum cases preserve sources and isolate default selection', async () => {
  const { data } = await productionCatalog();
  const master = core.taxonomyPaths(require('../docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json'));
  const parent = row => [core.normalizeCourseIdentity(row.courseKey), row.L1?.replace(/\s+/g, ''), row.L2?.replace(/\s+/g, '')].join('|');
  const authoritativeParents = new Set(master.map(parent));
  const before = JSON.stringify(data.records);
  const cases = filterCases();
  assert.equal(cases.length, 66);
  for (const filters of cases) {
    const label = JSON.stringify(filters), app = workspace(filters, data);
    const scopes = app.scopeOptions(), basics = scopes.filter(s => s.basicScope);
    const allowed = new Set(app.taxonomyRowsForFilters(filters).map(row => row.L1.replace(/\s+/g, '') + '|' + row.L2.replace(/\s+/g, '')));
    for (const row of app.taxonomyRowsForFilters(filters)) assert.ok(authoritativeParents.has(parent(row)), label + ' canonical source');
    for (const s of basics) assert.ok(allowed.has(s.L1.replace(/\s+/g, '') + '|' + s.L2.replace(/\s+/g, '')), label + ' basic label');
    const pool = data.records.filter(r => core.matches(r, filters) && r.L1 && r.L2);
    const paths = new Set(scopes.flatMap(s => s.paths));
    for (const r of pool) assert.ok(paths.has(core.pathKey(r, 4)), label + ' missing source ' + r.questionUid);
    assert.equal(scopes.reduce((n, s) => n + s.count, 0), pool.length, label + ' source counts');
    const html = app.renderScopes();
    if (scopes.some(s => !s.basicScope)) {
      const detail = html.split('<details class="compose-detail source-scope-detail"')[1];
      assert.ok(detail, label + ' missing details');
      assert.doesNotMatch(detail.slice(0, detail.indexOf('>')), /\bopen\b/, label + ' details must start collapsed');
    }
    await app.click({ action: 'scope-all' });
    assert.deepEqual([...app.state.scopes], [...basics.map(s => s.key)], label + ' all');
    app.controls['scope-start'] = { value: '0' };
    app.controls['scope-end'] = { value: String(scopes.length - 1) };
    await app.click({ action: 'scope-range' });
    assert.deepEqual([...app.state.scopes], [...basics.map(s => s.key)], label + ' continuous');
    const sharedGroup = basics.find(s => scopes.some(d => !d.basicScope && d.L1 === s.L1));
    if (sharedGroup) {
      await app.click({ action: 'scope-clear' });
      await app.click({ action: 'scope-group', groupIndex: String([...new Set(scopes.map(s => s.L1))].indexOf(sharedGroup.L1)), scopeKind: 'basic' });
      assert.ok(app.state.scopes.every(key => scopes.find(s => s.key === key).basicScope), label + ' group selection');
    }
  }
  assert.equal(JSON.stringify(data.records), before, 'scope display and selection must not change metadata');
});

test('middle2, middle3 and high subjects retain selectable detailed source questions with the live bridge', async () => {
  const { data } = await productionCatalog();
  for (const filters of [{ grade: '중2' }, { grade: '중3' }, { grade: '고1' },
    ...core.highSemanticSubjectOptions().map(s => ({ grade: '고2', semanticSubject: s.value }))]) {
    const app = workspace(filters, data), scopes = app.scopeOptions();
    const target = scopes.find(s => !s.basicScope && s.eligibleCount > 0);
    if (!target) {
      assert.equal(data.records.filter(r => core.matches(r, filters) && !scopes.filter(s => s.basicScope).some(s => s.paths.includes(core.pathKey(r, 4))) && core.eligibility(r).ok).length, 0);
      continue;
    }
    const index = [...new Set(scopes.map(s => s.L1))].indexOf(target.L1);
    await app.click({ action: 'scope-group', groupIndex: String(index), scopeKind: 'detail' });
    assert.ok(app.state.scopes.includes(target.key));
    assert.ok(app.renderScopes().includes('class="compose-detail source-scope-detail" open'));
    const req = { filters: { ...filters, primaryPaths: app.selectedScopePaths() }, rows: [{ id: 'detail', paths: target.paths, count: 1 }], seed: 'all-grades-scope' };
    const selected = core.selectBlueprint(data.records, req);
    assert.equal(selected.ok, true, JSON.stringify(filters));
    assert.notEqual(core.review(selected.selected, req).status, 'HARD_BLOCK', JSON.stringify(filters));
  }
});

test('an explicit curriculum keeps canonical middle geometry counts despite legacy course aliases', async () => {
  const { data } = await productionCatalog();
  const app = workspace({ grade: '중3', curriculumKey: '2015' }, data);
  const scopes = app.scopeOptions();
  const circle = scopes.find(s => s.basicScope && s.L1 === '원의 성질' && s.L2 === '원주각');
  assert.ok(circle && circle.count > 0);
  const aliased = data.records.filter(r => core.matches(r, app.state.filters) && r.courseKey === '중3 수학' && r.L1 === '원의 성질' && r.L2 === '원주각');
  assert.ok(aliased.length > 0);
  for (const r of aliased) assert.ok(circle.paths.includes(core.pathKey(r, 4)), r.questionUid);
  assert.ok(!scopes.some(s => !s.basicScope && s.L1 === '원의 성질' && s.L2 === '원주각'));
});
