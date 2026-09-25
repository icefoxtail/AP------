const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const core = require('../archive/archive2-core.js');

const root = path.resolve(__dirname, '..');
const read = (p) => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));
const global = 'archive/_generated/intelligence/phase1/middle1-foundation/global';
const mapping = read(`${global}/B01_B16_CANONICAL_MAPPING.json`);
const input = read(`${global}/B01_B16_GLOBAL_COMPRESSION_INPUT.json`);
const runtime = read('archive/data/meta-foundation/runtime/middle1-v1.json');
const catalog = core.decodeCatalog(read('archive/data/archive2-catalog.json'));
const byCatalogUid = new Map(catalog.records.map((r) => [r.questionUid, r]));
const byRuntimeUid = new Map(runtime.records.map((r) => [r.questionUid, r]));

test('B01-B16 canonical keys project by UID through runtime and Archive2', () => {
  assert.equal(input.batches.length, 16);
  assert.equal(input.counts.uniqueUid, 381);
  assert.equal(mapping.uidMappings.length, 364);
  assert.equal(runtime.records.length, 381);
  for (const row of mapping.uidMappings) {
    const runtimeRow = byRuntimeUid.get(row.questionUid);
    const catalogRow = byCatalogUid.get(row.questionUid);
    assert.ok(runtimeRow && catalogRow, row.questionUid);
    assert.equal(runtimeRow.problemTypeKey, row.finalProblemTypeKey);
    assert.equal(runtimeRow.templateKey, row.finalTemplateKey);
    assert.equal(catalogRow.problemTypeKey, row.finalProblemTypeKey);
    assert.equal(catalogRow.templateKey, row.finalTemplateKey);
    assert.deepEqual(catalogRow.crossConceptKeys, row.finalCrossConceptKeys);
    assert.equal(catalogRow.foundationTaxonomyStatus, 'CONFIRMED');
    assert.deepEqual(catalogRow.metadataConflicts, []);
  }
});

test('curriculum rollout and explicit HOLDs retain correct Archive2 selectability', () => {
  let selectable = 0;
  for (const row of input.rows) {
    const catalogRow = byCatalogUid.get(row.questionUid);
    const runtimeRow = byRuntimeUid.get(row.questionUid);
    assert.ok(catalogRow && runtimeRow, row.questionUid);
    const sourceYear = Number(path.basename(row.sourceArchiveFile).slice(0, 2));
    if (catalogRow.curriculumKey) assert.equal(catalogRow.curriculumKey, sourceYear >= 25 ? '2022' : '2015');
    assert.equal(catalogRow.automatic, runtimeRow.runtimeSelectable);
    if (catalogRow.automatic) selectable++;
    if (row.reviewStatus === 'HOLD' || row.reviewStatus === 'ROUTE_OUT' || runtimeRow.sourceQualityDisposition === 'SOLUTION_REPAIR_REQUIRED')
      assert.equal(catalogRow.automatic, false, row.questionUid);
    if (runtimeRow.rpmPathStatus === 'HOLD_NO_EQUIVALENT_PATH')
      assert.equal(catalogRow.automatic, runtimeRow.sourceQualityDisposition === 'HOLD_RESOLVED_NO_SOURCE_MUTATION', row.questionUid);
  }
  assert.equal(selectable, 125);
});
