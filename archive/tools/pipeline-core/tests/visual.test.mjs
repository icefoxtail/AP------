import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { canonicalJson, bytesSha, objectSha, safePath, fileRef } from '../canonical.mjs';
import { compareVisualFacts, validateVisualFact, semanticSha, circleRelation, auditDuplicates, structureFingerprint } from '../visual.mjs';
import { validateBatchManifest } from '../batch.mjs';
import { validateSchema } from '../schema.mjs';
import { verifyBranch } from '../expression.mjs';
import { fixture, fact } from './fixture.mjs';

test('raw bytes and canonical objects are separate hash domains', () => {
  assert.throws(() => bytesSha({ x: 1 }), /RAW_BYTES/);
  assert.notEqual(bytesSha(Buffer.from('a\r\n')), bytesSha(Buffer.from('a\n')));
  assert.equal(objectSha({ z: 1, a: 2 }), objectSha({ a: 2, z: 1 }));
  assert.throws(() => canonicalJson({ a: undefined }), /NON_JSON/);
  assert.throws(() => canonicalJson({ a: NaN }), /NON_CANONICAL/);
});
test('same semantic meaning on another UID hashes the same; parity still checks identity', () => {
  assert.equal(semanticSha(fact('a')), semanticSha(fact('b')));
  assert.equal(compareVisualFacts(fact('a'), fact('b')).status, 'FAIL');
});
test('unproven vocabulary conversions are rejected, not normalized into PASS', () => {
  const a = { schemaVersion: 'APMATH_VISUAL_FACT_v2', questionUid: 'q', visualType: 'set-regions', semantic: { setIds: ['A', 'B', 'C'], universeId: 'U', regions: ['011'], decisiveSteps: ['B∩C', 'exclude A'] } };
  const b = structuredClone(a); b.semantic.regions = ['B∩C∩Aᶜ'];
  assert.equal(compareVisualFacts(a, b).status, 'FAIL');
  delete b.semantic.universeId; assert.equal(validateVisualFact(b).status, 'FAIL');
});
test('SET masks canonicalize; narrative wording is a separate mandatory V3 gate', () => {
  const a = { schemaVersion: 'APMATH_VISUAL_FACT_v2', questionUid: 'q', visualType: 'set-regions', semantic: { setIds: ['A', 'B'], universeId: 'U', regions: ['01', '11'], decisiveSteps: ['intersect', 'exclude'] } };
  const b = structuredClone(a); b.semantic.regions.reverse(); assert.equal(semanticSha(a), semanticSha(b));
  b.semantic.decisiveSteps.reverse(); assert.equal(semanticSha(a), semanticSha(b));
  delete b.semantic.decisiveSteps; assert.equal(validateVisualFact(b).status, 'FAIL');
});
test('case rows use IDs; cell order and exhaustive reason cannot disappear', () => {
  const a = { schemaVersion: 'APMATH_VISUAL_FACT_v2', questionUid: 'q', visualType: 'case-table', semantic: { columns: ['x'], rows: [{ id: 'a', cells: ['1'], disposition: 'KEEP', reason: 'satisfies' }, { id: 'b', cells: ['2'], disposition: 'REJECT', reason: 'violates' }], exhaustivenessReason: 'x is 1 or 2' } };
  const b = structuredClone(a); b.semantic.rows.reverse(); assert.equal(semanticSha(a), semanticSha(b));
  delete b.semantic.exhaustivenessReason; assert.equal(validateVisualFact(b).status, 'FAIL');
});
for (const [name, change] of Object.entries({ negative: f => { f.semantic.maximumIntersection = -1; }, wrongMaximum: f => { f.semantic.maximumIntersection = 24; }, wrongMinimum: f => { f.semantic.minimumIntersection = 0; }, null: f => { f.semantic.aCount = null; }, unknownField: f => { f.semantic.pixelCircle = {}; }, uidType: f => { f.questionUid = 3; } })) test(`strict type/domain: ${name}`, () => {
  const f = fact(); change(f); assert.equal(validateVisualFact(f).status, 'FAIL');
});
test('q10 counterexample fails containment despite correct count labels', () => {
  assert.equal(circleRelation({ x: 239, y: 219, radius: 67 }, { x: 146, y: 219, radius: 67 }, 'SUBSET_OR_EQUAL'), false);
  assert.equal(circleRelation({ x: 195, y: 148, radius: 47 }, { x: 180, y: 135, radius: 83 }, 'SUBSET_OR_EQUAL'), true);
});
test('duplicate approvals are bound to the current pair, facts and bytes', () => {
  const a = { artifactSha: objectSha('a'), structureSha: structureFingerprint(fact('a')), fact: fact('a') };
  const b = { artifactSha: objectSha('b'), structureSha: structureFingerprint(fact('b')), fact: fact('b') };
  const pending = auditDuplicates([a, b]); assert.equal(pending.status, 'BLOCKED');
  a.reuseApproval = { status: 'PASS', reviewerId: 'separate-reviewer', pairInputSha: pending.candidates[0].pairInputSha, questionSpecificCoverage: 'PASS' };
  assert.equal(auditDuplicates([b, a]).status, 'PASS');
  b.artifactSha = objectSha('modified'); assert.equal(auditDuplicates([a, b]).status, 'BLOCKED');
});
test('schema validator does not ignore unsupported keywords', () => {
  assert.ok(validateSchema({}, { type: 'object', unsupported: true }).some(s => s.includes('UNSUPPORTED_SCHEMA_KEYWORD')));
});
test('file refs reject traversal and stale bytes', () => {
  const f = fixture(); try { assert.throws(() => safePath(f.root, '../escape')); assert.throws(() => safePath(f.root, 'C:/outside')); assert.throws(() => safePath(f.root, 'a\\b')); } finally { f.cleanup(); }
});
test('adaptive preflight rejects the four previously accepted negative manifests', () => {
  const f = fixture(); try {
    const uids = ['u1', 'u2', 'u3']; const inventory = { rows: uids.map(questionUid => ({ questionUid })) }, bytes = Buffer.from(JSON.stringify(inventory));
    const base = { batchId: 'b', batchNo: 1, revision: 1, supersedes: null, isCanonical: true, riskProfile: 'HIGH_RISK', plannedSize: 3, questionUids: uids, visualDecisionPlan: { NO_VISUAL: 0, KEEP_EXISTING: 3, REBUILD_EXISTING: 0, ADD_NEW_VISUAL: 0 }, visualTypes: ['set-cardinality'], factSchemaVersions: ['APMATH_VISUAL_FACT_v2'], appliedRuleRefs: [{ ...fileRef(f.root, 'docs/rules/00_RULES_INDEX.md'), declaredVersion: 'index' }], inventorySha: bytesSha(bytes) };
    base.manifestSha = objectSha(base);
    const registry = [{ recordId: 'unrelated', batchId: 'old', revision: 1, supersedes: null, isCanonical: true, questionUids: ['unrelated'], inputSha: objectSha('old') }];
    assert.equal(validateBatchManifest(f.root, base, inventory, bytes, registry).status, 'PASS');
    assert.equal(validateBatchManifest(f.root, base, inventory, bytes, []).status, 'FAIL');
    assert.equal(validateBatchManifest(f.root, base, inventory, bytes).status, 'FAIL');
    for (const change of [m => { m.inventorySha = `sha256:${'0'.repeat(64)}`; }, m => { m.revision = 2; }, m => { m.manifestSha = null; }, m => { m.questionUids = []; m.plannedSize = 0; m.visualDecisionPlan.KEEP_EXISTING = 0; m.sizeException = { status: 'APPROVED' }; }]) { const m = structuredClone(base); change(m); assert.equal(validateBatchManifest(f.root, m, inventory, bytes, registry).status, 'FAIL'); }
    assert.equal(validateBatchManifest(f.root, base, inventory, bytes, [{ ...registry[0], questionUids: ['u1'] }]).status, 'FAIL');
  } finally { f.cleanup(); }
});

test('legacy parity CLI cannot pass empty files or overwrite old evidence', () => {
  const f = fixture(); try {
    const a = path.join(f.root, 'empty.jsonl'); fs.writeFileSync(a, '');
    const command = path.resolve('archive/tools/logic-visual-audit/verify-item-semantic-parity.mjs');
    const run = spawnSync(process.execPath, [command, a, a], { encoding: 'utf8' });
    assert.equal(run.status, 1); assert.match(run.stdout, /NONEMPTY_EXACT_UID_COVERAGE_REQUIRED/);
  } finally { f.cleanup(); }
});
test('cartesian numeric checks reject a flat curve mislabeled as a parabola and a pole bridge', () => {
  assert.equal(verifyBranch({ formula: 'x**2', points: [{ x:-2,y:0 },{ x:2,y:0 }] }, { yMin:-5,yMax:5 }), false);
  assert.equal(verifyBranch({ formula: '1/x', points: [{ x:-1,y:-1 },{ x:1,y:1 }] }, { yMin:-5,yMax:5 }), false);
  assert.equal(verifyBranch({ formula: 'sqrt(x)', points: [{ x:0,y:0 },{ x:4,y:2 }] }, { yMin:0,yMax:3 }), true);
});
test('case storage ids do not create false semantic mismatches', () => {
  const a = { schemaVersion:'APMATH_VISUAL_FACT_v2',questionUid:'q',visualType:'case-table',semantic:{columns:['x'],rows:[{id:'a',cells:['1'],disposition:'KEEP',reason:'조건 만족'}],exhaustivenessReason:'후보는 하나'} };
  const b = structuredClone(a); b.semantic.rows[0].id='row1'; b.semantic.rows[0].reason='조건을 충족한다';
  assert.equal(semanticSha(a),semanticSha(b));
});
