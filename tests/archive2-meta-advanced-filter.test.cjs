const test = require('node:test');
const assert = require('node:assert/strict');
const core = require('../archive/archive2-core.js');
const catalog = core.decodeCatalog(require('../archive/data/archive2-catalog.json'));
const runtime = require('../archive/data/meta-foundation/runtime/middle1-v1.json');
const taxonomy = require('../archive/data/meta-foundation/compiled/taxonomy_registry.json');
const byUid = new Map(catalog.records.map(row => [row.questionUid, row]));

test('middle1 basic gate uses L1/L2 and quality while RPM leaf remains a capability', () => {
  assert.equal(runtime.records.length, 381);
  const joined = runtime.records.map(row => [row, byUid.get(row.questionUid)]);
  assert.equal(joined.filter(([, row]) => row).length, 381);
  assert.equal(joined.reduce((n, [, row]) => n + (row.metadataConflicts?.length || 0), 0), 0);
  assert.equal(joined.filter(([, row]) => core.eligibility(row).ok).length, 125);
  const rpmOnly = joined.filter(([runtimeRow]) => runtimeRow.rpmPathStatus === 'HOLD_NO_EQUIVALENT_PATH');
  assert.equal(rpmOnly.length, 11);
  assert.equal(rpmOnly.filter(([row]) => row.sourceQualityDisposition === 'HOLD_RESOLVED_NO_SOURCE_MUTATION').length, 4);
  assert.equal(rpmOnly.filter(([row]) => row.sourceQualityDisposition === 'SOLUTION_REPAIR_REQUIRED').length, 7);
  for (const [source, row] of rpmOnly)
    assert.equal(core.eligibility(row).ok, source.sourceQualityDisposition === 'HOLD_RESOLVED_NO_SOURCE_MUTATION', source.questionUid);
  for (const [source, row] of joined)
    if (source.semanticDisposition === 'HOLD' || source.semanticDisposition === 'ROUTE_OUT' || source.sourceQualityDisposition === 'SOURCE_BLOCKED')
      assert.equal(core.eligibility(row).ok, false, source.questionUid);
});

test('canonical L3, L4 and difficulty carry through selection, shortage and final review', () => {
  const eligible = runtime.records.map(row => byUid.get(row.questionUid)).filter(row => core.eligibility(row).ok);
  const grouped = Map.groupBy(eligible, row => [core.pathKey(row, 4), row.problemTypeKey, row.templateKey, row.difficultyBucket].join('|'));
  const group = [...grouped.values()].find(rows => rows.length >= 2);
  assert.ok(group, 'need two eligible items in one canonical L4 and difficulty');
  const target = group[0];
  const path = core.pathKey(target, 4);
  const base = { grade: '중1', primaryPaths: [path] };
  const filters = { ...base, L3: `mf:${target.problemTypeKey}`, L4: `mf:${target.templateKey}`, difficultyBuckets: [target.difficultyBucket] };
  const request = { filters, rows: [{ id: 'unit', paths: [path], depth: 4, count: 1, difficultyBuckets: [target.difficultyBucket] }], seed: 'meta-filter-test' };
  const result = core.selectBlueprint(catalog.records, request);
  assert.equal(result.ok, true, JSON.stringify(result));
  assert.equal(result.selected[0].problemTypeKey, target.problemTypeKey);
  assert.equal(result.selected[0].templateKey, target.templateKey);
  assert.equal(result.selected[0].difficultyBucket, target.difficultyBucket);
  assert.equal(result.rowResults[0].available, catalog.records.filter(row => core.eligibility(row).ok && core.matches(row, filters) && core.rowMatches(row, request.rows[0])).length);
  assert.notEqual(core.review(result.selected, request).status, 'HARD_BLOCK');
  const replacement = group.find(row => row.questionUid !== result.selected[0].questionUid);
  assert.ok(replacement);
  assert.ok(core.matches(replacement, filters) && core.rowMatches(replacement, request.rows[0]));
  assert.notEqual(core.review([{ ...replacement, rowId: 'unit' }], request).status, 'HARD_BLOCK');
  const wrong = eligible.find(row => row.problemTypeKey !== target.problemTypeKey);
  assert.ok(wrong);
  assert.equal(core.review([{ ...wrong, rowId: 'unit' }], request).status, 'HARD_BLOCK');
  const l3Request = { ...request, filters: { ...base, L3: filters.L3 } };
  assert.ok(core.selectBlueprint(catalog.records, l3Request).selected.every(row => row.problemTypeKey === target.problemTypeKey));
  const l4Request = { ...request, filters: { ...base, L4: filters.L4 } };
  assert.ok(core.selectBlueprint(catalog.records, l4Request).selected.every(row => row.templateKey === target.templateKey));
  assert.ok(taxonomy.problemTypes.some(row => row.problemTypeKey === target.problemTypeKey && /[가-힣]/.test(row.canonicalLabelKo)));
  assert.ok(taxonomy.templates.some(row => row.templateKey === target.templateKey && /[가-힣]/.test(row.canonicalLabelKo)));
});

test('middle1 composes with L1/L2 and difficulty alone', () => {
  const target = runtime.records.map(row => byUid.get(row.questionUid)).find(row => core.eligibility(row).ok);
  const path = core.pathKey(target, 4);
  const request = {
    filters: { grade: '중1', primaryPaths: [path], difficultyBuckets: [target.difficultyBucket] },
    rows: [{ id: 'basic', paths: [path], depth: 4, difficultyBuckets: [target.difficultyBucket], count: 1 }],
    seed: 'middle1-basic'
  };
  const result = core.selectBlueprint(catalog.records, request);
  assert.equal(result.ok, true, JSON.stringify(result));
  assert.ok(result.selected.every(row => row.L1 === target.L1 && row.L2 === target.L2 && row.difficultyBucket === target.difficultyBucket));
  assert.notEqual(core.review(result.selected, request).status, 'HARD_BLOCK');
});

test('unpromoted scope retains RPM L3 and L4 filtering', () => {
  const target = catalog.records.find(row => core.eligibility(row).ok && core.advancedAuthority(row) === 'rpm' && row.L3 && row.L4);
  assert.ok(target);
  const filters = { grade: target.effectiveBrowseGrade, primaryPaths: [core.pathKey(target, 4)], L3: `rpm:${target.L3}`, L4: `rpm:${target.L4}` };
  assert.equal(core.matches(target, filters), true);
  assert.equal(core.matches(target, { ...filters, L3: `mf:${target.problemTypeKey || 'missing'}` }), false);
  const request = { filters, rows: [{ id: 'rpm', paths: filters.primaryPaths, depth: 4, count: 1, difficultyBuckets: [target.difficultyBucket] }], seed: 'rpm-regression' };
  const selected = core.selectBlueprint(catalog.records, request);
  assert.equal(selected.ok, true, JSON.stringify(selected));
  assert.ok(selected.selected.every(row => row.L3 === target.L3 && row.L4 === target.L4));
});

test('an existing Functions/Graphs Compose label restores to its unique canonical keys', () => {
  const pack = require('../archive/data/meta-foundation/runtime/functions-graphs-v1.json');
  const records = pack.records.map(overlay => {
    const base = byUid.get(overlay.questionUid);
    if (!base) return null;
    return {
      ...base, ...overlay,
      sourceFile: base.sourceFile, sourceOrdinal: base.sourceOrdinal,
      effectiveBrowseGrade: base.effectiveBrowseGrade,
      identityStatus: base.identityStatus, sourceStatus: base.sourceStatus,
      sourceFingerprint: base.sourceFingerprint, gradeConflict: base.gradeConflict,
      taxonomyStatus: 'CONFIRMED', metadataConflicts: [],
      reviewStatus: overlay.reviewStatus || 'reviewed_pass'
    };
  }).filter(Boolean);
  const target = records.find(row => core.eligibility(row).ok &&
    row.L3 === '함수 그래프의 성질' && row.L4 === '그래프의 대소 관계');
  assert.ok(target);
  const migrated = core.migrateLegacyAdvancedFilters(
    { grade: target.effectiveBrowseGrade, L3: target.L3, L4: target.L4 },
    records, [core.pathKey(target, 4)]
  );
  assert.equal(migrated.L3, 'mf:PT_FUNCTION_GRAPH_PROPERTIES');
  assert.equal(migrated.L4, 'mf:TPL_GRAPH_ORDER_INTERVAL');
  assert.equal(core.matches(target, migrated), true);
});
