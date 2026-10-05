const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const core = require('../archive/archive2-core.js');

const root = path.resolve(__dirname, '..');

async function loadFinalCatalog() {
  const baseUrl = 'https://archive.test/AP------/archive/workspace.html';
  const fetcher = async url => {
    const pathname = decodeURIComponent(new URL(String(url)).pathname);
    let file;
    if (pathname.startsWith('/AP------/archive/'))
      file = path.join(root, 'archive', pathname.slice('/AP------/archive/'.length));
    else if (pathname.startsWith('/AP------/docs/'))
      file = path.join(root, 'docs', pathname.slice('/AP------/docs/'.length));
    else return new Response('not found', { status: 404 });
    return fs.existsSync(file) ? new Response(fs.readFileSync(file)) : new Response('not found', { status: 404 });
  };
  const versionBundle = await core.Canonical.loadInputBundle(fetcher, baseUrl);
  return core.Canonical.resolveCatalog({ versionBundle });
}

test('BASIC candidates require reviewed assignments and exact current canonical parents', async () => {
  const catalog = await loadFinalCatalog();
  const basic = catalog.records.filter(row => core.basicEligibility(row, {
    canonicalAuthority: catalog.canonicalAuthority,
  }).ok);
  assert.ok(basic.length > 0);
  for (const row of basic) {
    assert.equal(row.sourceGradeStatus, 'VALID', row.questionUid);
    assert.ok(row.assignmentEvidence?.reviewEvidence?.reference, row.questionUid);
    assert.equal(core.Canonical.validateBasicAssignment(row, catalog.canonicalAuthority).ok, true, row.questionUid);
  }
  const rawOnly = catalog.records.find(row => !row.assignmentEvidence);
  assert.ok(rawOnly);
  assert.equal(core.basicEligibility({ ...rawOnly, l1l2ParentValid: true }, {
    canonicalAuthority: catalog.canonicalAuthority,
  }).ok, false);
});

test('a detailed filter uses only the exact reviewed assignment and parent chain', async () => {
  const catalog = await loadFinalCatalog();
  const eligible = catalog.records.filter(row =>
    core.basicEligibility(row, { canonicalAuthority: catalog.canonicalAuthority }).ok &&
    core.advancedEligible(row, { canonicalAuthority: catalog.canonicalAuthority }),
  );
  assert.ok(eligible.length > 0, 'reviewed item overrides with current canonical bindings remain usable');
  const target = eligible[0];
  const path = core.pathKey(target, 4);
  const filters = {
    grade: target.sourceGrade,
    primaryPaths: [path],
    L3: `mf:${target.problemTypeKey}`,
    L4: `mf:${target.templateKey}`,
  };
  const request = {
    filters,
    rows: [{ id: 'unit', paths: [path], depth: 4, count: 1 }],
    canonicalAuthority: catalog.canonicalAuthority,
    seed: 'canonical-meta-filter',
  };
  const result = core.selectBlueprint(catalog.records, request);
  assert.equal(result.ok, true, JSON.stringify(result));
  assert.equal(result.selected[0].questionUid, target.questionUid);
  assert.equal(core.review(result.selected, request).status !== 'HARD_BLOCK', true);
  const wrongLeaf = { ...target, L2: '잘못된 parent', rowId: 'unit' };
  assert.equal(core.basicEligibility(wrongLeaf, { canonicalAuthority: catalog.canonicalAuthority }).ok, false);
  assert.equal(core.advancedEligible(wrongLeaf, { canonicalAuthority: catalog.canonicalAuthority }), false);
});

test('grade and advanced capability status booleans from the catalog are not validation authority', async () => {
  const catalog = await loadFinalCatalog();
  const row = catalog.records.find(candidate => candidate.automatic);
  assert.ok(row);
  assert.equal(core.basicEligibility({
    ...row,
    gradeConflict: false,
    l1l2ParentValid: true,
    sourceGrade: '고1',
  }, { canonicalAuthority: catalog.canonicalAuthority }).ok, false);
});
