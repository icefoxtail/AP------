const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const core = require('../archive/archive2-core.js');
const root = path.resolve(__dirname, '..');
const source = 'similar/high/h1/2final/25_제일고_2학기_기말_고1_유사.js';
const ledger = JSON.parse(fs.readFileSync(path.join(root, 'archive/data/legacy-similar-reviewed/25_제일고_2학기_기말_고1_유사.review.json'), 'utf8'));
const catalog = core.decodeCatalog(JSON.parse(fs.readFileSync(path.join(root, 'archive/data/archive2-catalog.json'), 'utf8')));
const identity = JSON.parse(fs.readFileSync(path.join(root, 'archive/data/question_identity_map.json'), 'utf8'));
const metadata = JSON.parse(fs.readFileSync(path.join(root, 'archive/data/question_metadata.json'), 'utf8'));
const rows = catalog.records.filter((r) => r.sourceFile === source).sort((a, b) => a.sourceOrdinal - b.sourceOrdinal);
test('reviewed 22 stable legacy UIDs remain fully discoverable and individually basic-selectable', () => {
  assert.equal(rows.length, 22);
  assert.equal(new Set(rows.map((r) => r.questionUid)).size, 22);
  for (const [i, row] of rows.entries()) {
    const frozen = ledger.questions[i];
    assert.equal(row.questionUid, frozen.questionUid);
    assert.equal(row.sourceOrdinal, frozen.sourceOrdinal);
    assert.equal(row.sourceKind, 'LEGACY_SIMILAR');
    assert.equal(row.identityStatus, 'VERIFIED');
    assert.equal(row.sourceIntegrityStatus, 'VERIFIED');
    assert.equal(row.sourceStatus, 'VERIFIED');
    assert.equal(row.L1, frozen.rpmL1);
    assert.equal(row.L2, frozen.rpmL2);
    assert.equal(row.difficultyBucket, frozen.independentDifficulty1to5);
    assert.equal(row.difficultyConfidence, 'medium');
    assert.ok(row.assignmentEvidence, 'required canonical basic parent ' + frozen.qid);
    const eligibility = core.eligibility(row, { canonicalAuthority: catalog.canonicalAuthority });
    assert.equal(row.automatic, true, 'basic-selectable source q' + frozen.qid + ': ' + eligibility.reasons.join(','));
    assert.equal(identity.records.filter((r) => r.questionUid === frozen.questionUid).length, 1);
    assert.equal(metadata.records.filter((r) => r.questionUid === frozen.questionUid).length, 1);
    if (frozen.problemTypeKey) {
      assert.equal(row.problemTypeKey, frozen.problemTypeKey);
      assert.equal(row.templateKey, frozen.templateKey);
    }
    if (!frozen.rpmL4) assert.ok(frozen.metaDebt.includes('NO_EQUIVALENT_RPM_L4'));
  }
});
test('legacy data and index share the exact original question count and source identity', () => {
  const sourceJs = fs.readFileSync(path.join(root, 'archive/exams', source), 'utf8');
  const w = { window: {} };
  vm.createContext(w);
  vm.runInContext(sourceJs, w, { timeout: 3000 });
  assert.equal(w.window.questionBank.length, 22);
  for (const [i, row] of ledger.questions.entries()) {
    assert.equal(w.window.questionBank[i].answer, row.independentAnswer);
    assert.equal(w.window.questionBank[i].id, row.qid);
  }
  const indexContext = { window: {} };
  vm.createContext(indexContext);
  vm.runInContext(fs.readFileSync(path.join(root, 'archive/question-index.js'), 'utf8'), indexContext, { timeout: 20000 });
  const indexRows = indexContext.window.questionIndex.filter((r) => r.sourceFile === source);
  assert.equal(indexRows.length, 22);
  assert.deepEqual(Array.from(indexRows, (r) => r.sourceOrdinal).sort((a, b) => a - b),
    Array.from({ length: 22 }, (_, i) => i + 1));
});
