'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { build, deriveMetaBrowsePath, SCHEMA } = require('../archive/tools/backfill-generated-meta.cjs');

const root = path.resolve(__dirname, '..');
const indexPath = path.join(root, 'archive/data/generated-lite-consumer/v1/index.json');
const ledgerPath = path.join(root, 'archive/data/generated-lite-consumer/v1/legacy-meta-evidence-323.json');
const cutoverPath = path.join(root, 'archive/data/generated-lite-consumer/v1/meta-retention-cutover-20261009.json');
const canonicalHash = value => require('node:crypto').createHash('sha256').update(JSON.stringify(value)).digest('hex');
const studentBody = q => JSON.stringify({ uid: q.uid, content: q.content, choices: q.choices, answer: q.answer, solution: q.solution, image: q.image });

test('legacy backfill is exact-roster, rerunnable, partial, and non-recertifying', () => {
  const preview = build({ write: false });
  assert.equal(preview.projected, 323);
  assert.equal(preview.ledger.scope, 'EXACT_323_CUTOVER_UIDS_METADATA_ONLY');
  assert.equal(preview.ledger.records.length, 323);
  assert.equal(new Set(preview.ledger.records.map(row => row.uid)).size, 323);
  for (const row of preview.ledger.records) {
    assert.equal(row.status, 'LEGACY_NOT_RECERTIFIED');
    assert.equal(row.sourceEvidence.source.path.startsWith('archive/generated/lite/v1/'), true);
    assert.match(row.sourceEvidence.source.sha256, /^[a-f0-9]{64}$/);
    assert.match(row.studentPayloadSha256, /^[a-f0-9]{64}$/);
  }
});

test('backfilled projections preserve unknowns and keep physical bucket distinct from RPM L2', () => {
  const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
  const cutover = JSON.parse(fs.readFileSync(cutoverPath, 'utf8'));
  const roster = new Set(cutover.legacyUids);
  let legacyCount = 0;
  for (const row of index.records) {
    if (!roster.has(row.uid)) {
      assert.equal(row.metaProjection, undefined, `non-cutover UID modified: ${row.uid}`);
      continue;
    }
    legacyCount++;
    const p = row.metaProjection;
    assert.equal(p.schemaVersion, SCHEMA);
    assert.equal(p.uid, row.uid);
    assert.equal(p.status, 'LEGACY_NOT_RECERTIFIED');
    assert.equal(p.physicalStorageBucketKey, row.l2);
    assert.equal(p.rpmL2 === row.l2 && p.rpmL2 !== null, false);
    assert.equal(p.rpmL4Namespace, p.rpmL4 === null ? null : 'RPM_EXISTING_DRAFT');
    if (p.rpmL4Namespace === 'RPM_EXISTING_DRAFT') {
      assert.match(p.rpmDraftAuthorityRef, /^docs\/rules\/01_CANONICAL\/taxonomy\/rpm-primary-v1\.0\//);
      assert.match(p.rpmDraftAuthoritySha256, /^[a-f0-9]{64}$/);
    }
    assert.equal(Object.hasOwn(row, 'meta'), false, 'legacy partial projection must not masquerade as approved full meta');
    for (const field of ['crossConceptKeys', 'conditionKeys', 'integrationPattern']) {
      if (p.evidenceByField[field].status === 'UNKNOWN') {
        assert.equal(p[field], null);
        assert.ok(p.evidenceDebt.some(item => item.field === field));
      }
    }
  }
  assert.equal(legacyCount, 323);
});

test('Consumer student payload hashes remain byte-equivalent to the evidence ledger', () => {
  const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
  const ledger = JSON.parse(fs.readFileSync(ledgerPath, 'utf8'));
  const expected = new Map(ledger.records.map(row => [row.uid, row.studentPayloadSha256]));
  let checked = 0;
  for (const row of index.records) {
    if (!expected.has(row.uid)) continue;
    const shardPath = path.join(root, 'archive', row.shard);
    const shard = JSON.parse(fs.readFileSync(shardPath, 'utf8'));
    const matches = shard.records.filter(record => record.generatedUid === row.uid && record.localOrdinal === row.localOrdinal);
    assert.equal(matches.length, 1, `UID/ordinal join must stay unique: ${row.uid}`);
    assert.deepEqual(matches[0].metaProjection, row.metaProjection, `index/record Meta projection drift: ${row.uid}`);
    assert.deepEqual(matches[0].question.metaProjection, row.metaProjection, `index/question Meta projection drift: ${row.uid}`);
    assert.equal(canonicalHash(JSON.parse(studentBody(matches[0].question))), expected.get(row.uid), `student payload changed: ${row.uid}`);
    checked++;
  }
  assert.equal(checked, 323);
  for (const row of index.records.filter(item => item.consumerShardGitSha)) {
    const shardBytes = fs.readFileSync(path.join(root, 'archive', row.shard));
    const actualGitBlobSha = require('node:crypto').createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${shardBytes.length}\0`), shardBytes])).digest('hex');
    assert.equal(row.consumerShardGitSha, actualGitBlobSha, `stale Consumer shard Git SHA: ${row.uid}`);
    if (Object.hasOwn(row, 'shardGitBlobSha')) assert.equal(row.shardGitBlobSha, actualGitBlobSha, `stale shardGitBlobSha: ${row.uid}`);
    if (Object.hasOwn(row, 'consumerShardSha256')) assert.equal(row.consumerShardSha256, require('node:crypto').createHash('sha256').update(shardBytes).digest('hex'), `stale consumerShardSha256: ${row.uid}`);
  }
});

test('same metadata sidecar is joined separately for each UID', () => {
  const ledger = JSON.parse(fs.readFileSync(ledgerPath, 'utf8'));
  const byUid = new Map(ledger.records.map(row => [row.uid, row]));
  assert.equal(byUid.get('ALITE-20261008-HYC26-Q05-002').mappingAttempt.candidateRecordId, 'H1-RPM-151');
  assert.equal(byUid.get('ALITE-20261008-HYC26-Q05-004').mappingAttempt.candidateRecordId, 'H1-RPM-152');
});

test('the seven audited difficulty gaps remain UNKNOWN without conversion from level', () => {
  const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
  const expected = new Set([
    'ALITE-20261008-HYC26-Q18-001', 'ALITE-20261008-HYC26-Q18-002', 'ALITE-20261008-HYC26-Q18-004',
    'ALITE-20261008-HYC26-Q20-001', 'ALITE-20261008-HYC26-Q20-002', 'ALITE-20261008-HYC26-Q20-003', 'ALITE-20261008-HYC26-Q20-004'
  ]);
  const unknown = index.records.filter(row => row.metaProjection?.difficultyBucket === null).map(row => row.uid);
  assert.deepEqual(new Set(unknown), expected);
  for (const uid of expected) {
    const row = index.records.find(item => item.uid === uid);
    assert.ok(row.metaProjection.evidenceDebt.some(item => item.field === 'difficultyBucket' && item.reason === 'AUDITED_DIFFICULTY_EVIDENCE_DEBT_NO_INDEPENDENT_1_TO_5_EVIDENCE'));
    assert.ok(row.metaProjection.level, 'legacy level is retained as its own field and is not converted');
  }
});

test('RPM browse alias requires unique exact authority and exact parents/labels/bucket', () => {
  const records = [{ id: 'R-1', standardCourse: 'C', standardUnitKey: 'U', subUnitKey: 'S', rpmPath: { majorUnit: 'M1', midUnit: 'M2', l3: 'M3', l4: 'M4' } }];
  const base = { recordId: 'R-1', standardCourse: 'C', standardUnitKey: 'U', subUnitKey: 'S', rpmL1: 'code1|M1', rpmL2: 'code2|M2', rpmL3: 'code3|M3', rpmL4: 'code4|M4', rpmL4Namespace: 'RPM_EXISTING_DRAFT', rpmDraftAuthorityRef: 'docs/rules/authority.json', rpmDraftAuthoritySha256: 'a'.repeat(64), difficultyBucket: 3, expectedDifficultyBucket: 3 };
  const draftAuthority = { policyL3L4: 'CANONICAL_DRAFT normalized for archive' };
  const result = deriveMetaBrowsePath(base, records, draftAuthority);
  assert.equal(result.status, 'EXACT_AUTHORITY_ALIAS');
  assert.deepEqual(result.metaBrowsePath, { L1: 'M1', L2: 'M2', L3: 'M3', L4: 'M4' });
  assert.equal(deriveMetaBrowsePath({ ...base, standardUnitKey: 'wrong' }, records, draftAuthority).status, 'UNKNOWN');
  assert.equal(deriveMetaBrowsePath({ ...base, rpmL4: 'code4|different' }, records, draftAuthority).status, 'UNKNOWN');
  assert.equal(deriveMetaBrowsePath({ ...base, difficultyBucket: 4 }, records, draftAuthority).status, 'UNKNOWN');
  assert.equal(deriveMetaBrowsePath({ ...base, rpmL4Namespace: 'GENERATED_EXT_L4' }, records, draftAuthority).status, 'UNKNOWN');
  assert.equal(deriveMetaBrowsePath(base, [...records, records[0]], draftAuthority).reason, 'RPM_RECORD_ID_AMBIGUOUS');
  assert.equal(deriveMetaBrowsePath({ ...base, rpmL4Namespace: 'RPM_LOCKED' }, records, draftAuthority).reason, 'RPM_LOCKED_AUTHORITY_UNVERIFIED');
});
