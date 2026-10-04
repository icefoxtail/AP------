const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { core, workspace, productionCatalog } = require('./helpers/archive2-scope-harness.cjs');
const source = require('../archive/archive2-source.js');

test('the reported empty middle1 units count their existing questions without inventing curriculum membership', async () => {
  const { data } = await productionCatalog();
  const before = JSON.stringify(data.records);
  for (const [curriculumKey, expected] of [
    ['', { '입체도형의 겉넓이와 부피': 82, '도수분포표와 상대도수': 34, '대푯값': 13 }],
    ['2015', { '입체도형의 겉넓이와 부피': 40, '자료의 정리와 해석': 47 }],
    ['2022', { '입체도형의 겉넓이와 부피': 32, '도수분포표와 상대도수': 29, '대푯값': 13 }],
  ]) {
    const app = workspace({ grade: '중1', curriculumKey }, data);
    const scopes = app.scopeOptions();
    for (const [label, count] of Object.entries(expected)) {
      const target = scopes.find(s => s.basicScope && s.L2 === label);
      assert.ok(target, label);
      assert.equal(target.count, count, `${curriculumKey || 'all'} ${label}`);
      assert.equal(target.scopeQuestionUids.length, count);
      if (curriculumKey)
        assert.ok(target.scopeQuestionUids.every(uid => data.records.find(r => r.questionUid === uid).curriculumKey === curriculumKey));
    }
  }
  assert.equal(JSON.stringify(data.records), before);
});

test('statistics sharing a legacy parent cannot leak into the other selected unit or replacement row', async () => {
  const { data } = await productionCatalog();
  const app = workspace({ grade: '중1', curriculumKey: '2022' }, data);
  const scopes = app.scopeOptions();
  const frequency = scopes.find(s => s.L2 === '도수분포표와 상대도수');
  const central = scopes.find(s => s.L2 === '대푯값');
  assert.ok(frequency.paths.some(p => central.paths.includes(p)), 'old source paths contain both concepts');
  assert.ok(frequency.scopeQuestionUids.every(uid => !central.scopeQuestionUids.includes(uid)));
  for (const target of [frequency, central]) {
    app.state.scopes = [target.key];
    app.state.distribution = 'all';
    const req = app.request();
    const result = core.selectBlueprint(data.records, req);
    assert.equal(result.ok, true, JSON.stringify(result.shortages));
    assert.equal(result.selected.length, target.eligibleCount);
    assert.ok(result.selected.every(r => target.scopeQuestionUids.includes(r.questionUid)));
    assert.notEqual(core.review(result.selected, req).status, 'HARD_BLOCK');
    const other = target === frequency ? central : frequency;
    const wrong = data.records.find(r => other.scopeQuestionUids.includes(r.questionUid) && target.paths.includes(core.pathKey(r, 4)));
    assert.ok(wrong);
    assert.equal(core.matches(wrong, req.filters), false);
    assert.equal(core.rowMatches(wrong, req.rows[0]), false);
    assert.equal(core.review([{ ...wrong, rowId: req.rows[0].id }, ...result.selected.slice(1)], req).status, 'HARD_BLOCK');
    app.state.distribution = 'pool';
    app.state.count = 5;
    const pooled = core.selectBlueprint(data.records, app.request());
    assert.equal(pooled.ok, true);
    assert.ok(pooled.selected.every(r => target.scopeQuestionUids.includes(r.questionUid)));
  }
});

test('solid measurement selection, school restriction and original source restoration use the same membership', async () => {
  const { data } = await productionCatalog();
  const filters = { grade: '중1', curriculumKey: '2022', school: '왕운중' };
  const app = workspace(filters, data);
  const target = app.scopeOptions().find(s => s.L2 === '입체도형의 겉넓이와 부피');
  assert.ok(target.count > 0);
  app.state.scopes = [target.key];
  app.state.distribution = 'all';
  const req = app.request();
  const selected = core.selectBlueprint(data.records, req);
  assert.equal(selected.ok, true);
  assert.equal(selected.selected.length, target.eligibleCount);
  assert.ok(selected.selected.every(r => r.school === '왕운중' && r.curriculumKey === '2022'));
  const previousDocument = global.document, previousFetch = global.fetch;
  global.document = { baseURI: 'https://scope.test/archive/' };
  global.fetch = async url => ({ ok: true, text: async () => fs.readFileSync(path.join(__dirname, '../archive', decodeURIComponent(new URL(url).pathname).replace(/^\/archive\//, '')), 'utf8') });
  try {
    const restored = await source.restore(selected.selected, data);
    for (let i = 0; i < restored.length; i++) {
      assert.equal(restored[i].L1, selected.selected[i].L1);
      assert.equal(restored[i].L2, selected.selected[i].L2);
      assert.equal(await source.fingerprint(restored[i]), selected.selected[i].sourceFingerprint);
    }
  } finally { global.document = previousDocument; global.fetch = previousFetch; }
});

test('manual statistics links fail closed when source bytes change, and quality holds remain excluded', async () => {
  const { data } = await productionCatalog();
  const median = data.records.find(r => r.sourceFile.includes('25_연향중_2학기_기말_중1') && r.sourceOrdinal === 18);
  assert.equal(core.basicScopeParent(median, data.basicScopeLinks).L2, '대푯값');
  assert.equal(core.basicScopeParent({ ...median, sourceFingerprint: 'changed' }, data.basicScopeLinks), null);
  assert.equal(core.basicScopeParent({ ...median, effectiveBrowseGrade: '고1' }, data.basicScopeLinks), null);
  const held = { ...data.records.find(r => core.basicScopeParent(r)?.L2 === '입체도형의 겉넓이와 부피'), sourceIssueHold: true };
  assert.equal(core.eligibility(held).ok, false);
  assert.equal(core.matches(median, { scopeQuestionUids: [] }), false);
  assert.equal(core.rowMatches(median, { scopeQuestionUids: [] }), false);
});

test('frozen papers keep their original source ranges when display scope keys have changed', async () => {
  const { data } = await productionCatalog();
  const app = workspace({ grade: '중1', curriculumKey: '2022' }, data);
  const median = data.records.find(r => r.sourceFile.includes('25_연향중_2학기_기말_중1') && r.sourceOrdinal === 18);
  const oldPath = core.pathKey(median, 4);
  app.state.scopes = ['scope-previous-자료의정리와해석-자료의해석-2022'];
  app.state.rows = [{ id: 'previous', paths: [oldPath], count: 1 }];
  app.state.selected = [{ ...median, rowId: 'previous' }];
  assert.notEqual(core.review(app.state.selected, app.request(true)).status, 'HARD_BLOCK');
  const target = app.scopeOptions().find(s => s.L2 === '대푯값');
  app.state.scopes = [target.key];
  app.state.distribution = 'pool';
  app.state.count = 1;
  app.state.rows = app.planRows();
  app.state.scopes = ['a-display-key-from-a-previous-build'];
  const frozen = app.request(true);
  assert.ok(frozen.filters.scopeQuestionUids.every(uid => target.scopeQuestionUids.includes(uid)));
  assert.equal(core.selectBlueprint(data.records, frozen).ok, true);
});

test('basic linkage, counts and selectable membership do not depend on L3, L4 or difficulty', async () => {
  const { data } = await productionCatalog();
  const fields = ['L3','L4','problemTypeKey','templateKey','secondaryConceptKeys','crossConceptKeys','conditionKeys',
    'integrationPattern','foundationTaxonomyStatus','metaFoundationL3Status','metaFoundationL4Status',
    'difficultyBucket','difficultyConfidence','difficultyBoundaryFlag','legacyLevelCompatibility'];
  const withoutAdvanced = { ...data, records: data.records.map(original => {
    const record = { ...original };
    for (const field of fields) delete record[field];
    return record;
  }) };
  const cases = [{ grade: '중1' }, { grade: '중2' }, { grade: '중3' }, { grade: '고1' },
    ...core.highSemanticSubjectOptions().map(s => ({ grade: '고2', semanticSubject: s.value }))];
  const summary = app => app.scopeOptions().map(s => ({ L1: s.L1, L2: s.L2, count: s.count, eligible: s.eligibleCount, uids: [...s.scopeQuestionUids] }));
  for (const filters of cases) {
    assert.deepEqual(JSON.parse(JSON.stringify(summary(workspace(filters, withoutAdvanced)))),
      JSON.parse(JSON.stringify(summary(workspace(filters, data)))), JSON.stringify(filters));
  }
  const registry = require('../archive/data/basic-scope-parent-links.json');
  for (const record of [...registry.records, ...registry.sourceParents])
    for (const field of ['L3','L4','problemTypeKey','templateKey','difficultyBucket']) assert.ok(!(field in record));
});

test('reviewed equivalent L1/L2 parents merge only in the all-curriculum view', async () => {
  const { data } = await productionCatalog();
  const all = workspace({ grade: '중2' }, data).scopeOptions().filter(s => s.basicScope);
  const inequality = all.filter(s => s.L2 === '일차부등식');
  assert.equal(inequality.length, 1);
  assert.equal(inequality[0].count, 74);
  assert.equal(workspace({ grade: '중2', curriculumKey: '2022' }, data).scopeOptions().find(s => s.L2 === '일차부등식').count, 0);
  const middle3 = workspace({ grade: '중3' }, data).scopeOptions().filter(s => s.basicScope);
  assert.equal(middle3.filter(s => /제곱근과/.test(s.L2)).length, 1);
  const future = middle3.find(s => s.L2 === '산포도');
  assert.equal(future.count, 0);
  assert.match(future.label, /2022/);
});
