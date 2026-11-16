import test from 'node:test';
import assert from 'node:assert/strict';
import { expectedRuntime, buildGeometryRegression } from '../archive/tools/meta-foundation/compile-meta-foundation.mjs';

// Synthetic compiler/receipt mechanism fixture; this is not subject QA evidence.
const RUNTIME = 'archive/data/meta-foundation/runtime/geometry-equations-v1.json';
const ASSIGNMENTS = 'archive/data/meta-foundation/evidence/geometry-equations/v1/item_metadata_assignments_400.json';
const META = 'archive/data/question_metadata.json';
const EVIDENCE = 'archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/';
function fixture() {
  const version = '1.0.2', requestId = 'synthetic-geometry-issued', receiptPath = EVIDENCE + requestId + '.json';
  const parityPath = EVIDENCE + requestId + '.source-parity.json';
  const base = { sourceArchiveFile: 'original/high/h1/2final/synthetic.js', curriculum: '2022',
    standardUnitKey: 'H1-01', subUnitKey: 'H1-01-01', problemTypeKey: 'PT_ONE', templateKey: 'TPL_ONE',
    crossConceptKeys: ['CC_ONE'], conditionKeys: ['COND_ONE'], metaFoundationPackId: 'GEOMETRY_EQUATIONS',
    metaFoundationPackVersion: version, metadataRevision: 'meta-foundation:GEOMETRY_EQUATIONS@' + version };
  const assignments = { records: Array.from({ length: 400 }, (_, i) => ({ ...base, questionUid: 'synthetic-' + i, sourceOrdinal: i + 1 })) };
  const runtime = { packId: 'GEOMETRY_EQUATIONS', packVersion: version,
    runtimeVersion: 'GEOMETRY_EQUATIONS@1.0.2/reviewed-exam-v2', records: structuredClone(assignments.records) };
  const reviewed = [...runtime.records.slice(0, 5), { ...base, questionUid: 'synthetic-outside400', sourceOrdinal: 401 }];
  for (const row of reviewed) Object.assign(row, { templateKey: 'TPL_TWO', metadataStatus: 'approved_semantic_review',
    metadataApprovalType: 'META_PIPELINE_AUDIT', sourceMetadataVerification: 'MOTHER_SOURCE_BOUND_FINAL',
    sourceFingerprint: 'source-' + row.questionUid, approvedSourceFingerprint: 'source-' + row.questionUid,
    metadataRevision: `meta-foundation:GEOMETRY_EQUATIONS@${version}:exam-meta_pipeline_audit-v2:${requestId}`,
    approvalEvidence: [receiptPath, parityPath] });
  runtime.records.push(reviewed.at(-1));
  const metadata = { records: structuredClone(runtime.records) };
  const receipt = { schemaVersion: 'archive-reviewed-exam-meta-registration-v2', requestId,
    sourceArchiveFile: base.sourceArchiveFile, metadataRegistrationStatus: 'REGISTERED',
    appliedRecords: structuredClone(reviewed), runtimeRecords: structuredClone(reviewed) };
  const parity = { records: reviewed.map(row => ({ questionUid: row.questionUid, sourceOrdinal: row.sourceOrdinal, studentPayloadEqual: true })) };
  const docs = new Map([[RUNTIME, runtime], [ASSIGNMENTS, assignments], [META, metadata], [receiptPath, receipt], [parityPath, parity]]);
  const read = file => { if (!docs.has(file)) { const e = new Error('missing fixture ' + file); e.code = 'ENOENT'; throw e; } return structuredClone(docs.get(file)); };
  const canonical = { packs: [{ meta: { packId: 'GEOMETRY_EQUATIONS', packVersion: '1.0.3' } }] };
  const compiled = { taxonomy: { problemTypes: [{ problemTypeKey: 'PT_ONE' }],
    templates: ['TPL_ONE', 'TPL_TWO'].map(templateKey => ({ templateKey, parentProblemTypeKey: 'PT_ONE' })) },
    conceptRegistry: { concepts: [{ conceptKey: 'CC_ONE' }] }, conditionRegistry: { conditions: [{ conditionKey: 'COND_ONE' }] },
    curriculumBindings: { bindings: [{ curriculum: '2022', standardUnitKey: 'H1-01', subUnitKey: 'H1-01-01', problemTypeKey: 'PT_ONE' }] },
    aliases: { collisionCount: 0 } };
  return { docs, read, canonical, compiled, runtime, metadata, receipt, receiptPath, parity, parityPath, reviewed };
}

test('compiler advances container and legacy rows while preserving entire exact Native v2 rows', () => {
  const f = fixture(), before = structuredClone(f.runtime), receiptBefore = structuredClone(f.receipt);
  const text = expectedRuntime(f.canonical, f.read), after = JSON.parse(text);
  assert.equal(after.packVersion, '1.0.3'); assert.equal(after.runtimeVersion, 'GEOMETRY_EQUATIONS@1.0.3/reviewed-exam-v2');
  for (const row of f.reviewed) assert.deepEqual(after.records.find(x => x.questionUid === row.questionUid), row);
  assert.equal(after.records[7].metaFoundationPackVersion, '1.0.3');
  assert.equal(after.records[7].metadataRevision, 'meta-foundation:GEOMETRY_EQUATIONS@1.0.3');
  assert.deepEqual(f.runtime, before); assert.deepEqual(f.receipt, receiptBefore);
  f.docs.set(RUNTIME, after); assert.equal(expectedRuntime(f.canonical, f.read), text);
});

test('post-compile frozen cohort remains 400 with exactly five source-bound overrides and zero mapping drift', () => {
  const f = fixture(); f.docs.set(RUNTIME, JSON.parse(expectedRuntime(f.canonical, f.read)));
  const c = buildGeometryRegression(f.canonical, f.compiled, f.read).counts;
  assert.equal(c.assignmentCount, 400); assert.equal(c.runtimeRecordCount, 400);
  assert.equal(c.approvedSourceMappingOverrideCount, 5); assert.equal(c.runtimeMappingMismatchCount, 0);
  for (const [key, value] of Object.entries(c)) if (!['assignmentCount', 'runtimeRecordCount', 'approvedSourceMappingOverrideCount'].includes(key)) assert.equal(value, 0, key);
});

for (const field of ['templateKey', 'sourceFingerprint', 'metaFoundationPackVersion', 'metadataRevision', 'unapprovedExtraField'])
test('compiler refuses a reviewed runtime field not matching the whole issued row: ' + field, () => {
  const f = fixture(); f.runtime.records[0][field] = field === 'metaFoundationPackVersion' ? '1.0.1'
    : field === 'metadataRevision' ? f.runtime.records[0][field].replace('@1.0.2:', '@1.0.1:') : 'changed';
  assert.throws(() => expectedRuntime(f.canonical, f.read), /does not match its issued Native receipt/);
});

for (const mutation of ['missing', 'schema', 'unregistered', 'path-request-id', 'source', 'duplicate-runtime', 'duplicate-metadata', 'metadata-version', 'metadata-fingerprint'])
test('compiler never preserves a v2 claim using incomplete or substituted Native evidence: ' + mutation, () => {
  const f = fixture();
  if (mutation === 'missing') f.docs.delete(f.receiptPath);
  if (mutation === 'schema') f.receipt.schemaVersion = 'unissued';
  if (mutation === 'unregistered') f.receipt.metadataRegistrationStatus = 'PENDING';
  if (mutation === 'path-request-id') f.receipt.requestId = 'other';
  if (mutation === 'source') f.receipt.sourceArchiveFile = 'original/other.js';
  if (mutation === 'duplicate-runtime') f.receipt.runtimeRecords.push(structuredClone(f.receipt.runtimeRecords[0]));
  if (mutation === 'duplicate-metadata') f.receipt.appliedRecords.push(structuredClone(f.receipt.appliedRecords[0]));
  if (mutation === 'metadata-version') f.receipt.appliedRecords[0].metaFoundationPackVersion = '1.0.1';
  if (mutation === 'metadata-fingerprint') f.receipt.appliedRecords[0].sourceFingerprint = 'changed';
  assert.throws(() => expectedRuntime(f.canonical, f.read), /does not match its issued Native receipt/);
});

test('a future-issued row cannot cross a canonical version rollback', () => {
  const f = fixture(); f.canonical.packs[0].meta.packVersion = '1.0.1';
  assert.throws(() => expectedRuntime(f.canonical, f.read), /does not match its issued Native receipt/);
});

for (const mutation of ['source-parity', 'metadata-version', 'metadata-revision', 'source-fingerprint', 'mapping', 'native-row'])
test('frozen400 source override still refuses original guard failures: ' + mutation, () => {
  const f = fixture(); f.docs.set(RUNTIME, JSON.parse(expectedRuntime(f.canonical, f.read)));
  if (mutation === 'source-parity') f.parity.records[0].studentPayloadEqual = false;
  if (mutation === 'metadata-version') f.metadata.records[0].metaFoundationPackVersion = '1.0.3';
  if (mutation === 'metadata-revision') f.metadata.records[0].metadataRevision += '-changed';
  if (mutation === 'source-fingerprint') f.metadata.records[0].sourceFingerprint = 'changed';
  if (mutation === 'mapping') f.metadata.records[0].templateKey = 'TPL_ONE';
  if (mutation === 'native-row') f.receipt.runtimeRecords[0].templateKey = 'TPL_ONE';
  const c = buildGeometryRegression(f.canonical, f.compiled, f.read).counts;
  assert.equal(c.assignmentCount, 400); assert.equal(c.runtimeRecordCount, 400);
  assert.equal(c.approvedSourceMappingOverrideCount, 4); assert.equal(c.runtimeMappingMismatchCount, 1);
});

test('an exact receipt never licenses a later row with unregistered canonical mapping', () => {
  const f = fixture();
  for (const rows of [f.runtime.records, f.receipt.runtimeRecords, f.receipt.appliedRecords]) rows.at(-1).problemTypeKey = 'PT_UNREGISTERED';
  f.docs.set(RUNTIME, JSON.parse(expectedRuntime(f.canonical, f.read)));
  const c = buildGeometryRegression(f.canonical, f.compiled, f.read).counts;
  assert.equal(c.assignmentCount, 400); assert.equal(c.runtimeRecordCount, 400);
  assert.equal(c.unregisteredL3Count, 1); assert.equal(c.brokenL4ParentCount, 1); assert.equal(c.brokenL2L3BindingCount, 1);
});
