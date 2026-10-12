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
const crypto = require('node:crypto');
const vm = require('node:vm');
const { execFileSync, spawnSync } = require('node:child_process');
const REVIEW_PATH = 'archive/data/generated-lite/hyocheon-2026-1mid-independent-review-v1.json';
const sha256Bytes = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const gitBlobSha1 = bytes => crypto.createHash('sha1').update(Buffer.concat([Buffer.from('blob ' + bytes.length + '\0'), bytes])).digest('hex');
const gitBlobBytes = sha => execFileSync('git', ['cat-file', 'blob', sha], { cwd: root, maxBuffer: 2 * 1024 * 1024 });
const generatedQuestions = bytes => {
  const context = { window: {} };
  vm.runInNewContext(bytes.toString('utf8'), context, { timeout: 1000 });
  return context.window.questionBank;
};
function assertAuditRecord(record, uid, sourcePath, sourceQid, answer) {
  assert.ok(record, 'review record missing');
  assert.equal(record.uid, uid, 'review UID mismatch');
  assert.equal(record.shard, sourcePath, 'review source path mismatch');
  assert.equal(Number(record.qid), Number(sourceQid), 'review qid mismatch');
  assert.equal(record.independentAnswer, answer, 'reviewed answer mismatch');
  assert.ok(['PASS', 'REPAIRED_PASS'].includes(record.status), 'review status is not passing');
}
function findSourceAuditCommit(uid, sourceEvidence, sourceQid, answer) {
  const candidates = execFileSync('git', ['log', '--all', '--format=%H', '--find-object=' + sourceEvidence.gitBlobSha1], { cwd: root, encoding: 'utf8' }).trim().split(/\r?\n/).filter(Boolean);
  for (const commit of candidates) {
    const sourceResult = spawnSync('git', ['rev-parse', commit + ':' + sourceEvidence.path], { cwd: root, encoding: 'utf8' });
    if (sourceResult.status !== 0 || sourceResult.stdout.trim() !== sourceEvidence.gitBlobSha1) continue;
    const reviewResult = spawnSync('git', ['rev-parse', commit + ':' + REVIEW_PATH], { cwd: root, encoding: 'utf8' });
    if (reviewResult.status !== 0) continue;
    const reviewBlobSha = reviewResult.stdout.trim();
    const reviewBytes = gitBlobBytes(reviewBlobSha);
    const review = JSON.parse(reviewBytes.toString('utf8'));
    const record = (review.records || []).find(item => item.uid === uid);
    if (!record) continue;
    assertAuditRecord(record, uid, sourceEvidence.path, sourceQid, answer);
    return { commit, reviewBlobSha, reviewBytes, record };
  }
  throw new Error('SOURCE_AUDIT_COMMIT_NOT_FOUND:' + uid);
}


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

test('legacy roster ignores future UIDs and preserves withdrawn history as inactive evidence', () => {
  const source = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
  const future = structuredClone(source);
  future.records.push({ uid: 'ALITE-SYNTHETIC-FUTURE-0347', sourceKind: 'generated', consumerSelectable: true });
  future.approvedCount = future.records.length;
  const futureRun = build({ write: false, indexDocument: future });
  assert.equal(futureRun.projected, 323);
  assert.equal(futureRun.ledger.records.some(row => row.uid === 'ALITE-SYNTHETIC-FUTURE-0347'), false);

  const withdrawnUid = 'ALITE-20261008-HYC26-Q05-001';
  const withdrawn = structuredClone(source);
  withdrawn.records = withdrawn.records.filter(row => row.uid !== withdrawnUid);
  withdrawn.approvedCount = withdrawn.records.length;
  const withdrawnRun = build({ write: false, indexDocument: withdrawn });
  const ledgerRow = withdrawnRun.ledger.records.find(row => row.uid === withdrawnUid);
  assert.equal(withdrawnRun.projected, 322);
  assert.equal(withdrawnRun.ledger.inactiveWithdrawnCount, 1);
  assert.equal(ledgerRow.consumerDisposition, 'INACTIVE_WITHDRAWN_FROM_INDEX');
  assert.equal(ledgerRow.status, 'LEGACY_NOT_RECERTIFIED');
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
    assert.equal(row.metaProjection.status, 'LEGACY_NOT_RECERTIFIED', 'source metadata remains distinct from historical quality status');
    assert.equal(row.mainSourceAvailable, true, 'main-resident source membership is independent of historical quality projection');
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
    const currentPayloadHash = canonicalHash(JSON.parse(studentBody(matches[0].question)));
    const ledgerPayloadHash = expected.get(row.uid);
    if (currentPayloadHash === ledgerPayloadHash) {
      assert.equal(currentPayloadHash, ledgerPayloadHash);
    } else {
      const evidence = ledger.records.find(item => item.uid === row.uid);
      assert.ok(evidence, 'missing immutable ledger evidence: ' + row.uid);
      assert.equal(evidence.status, 'LEGACY_NOT_RECERTIFIED');
      const beforeBytes = gitBlobBytes(evidence.sourceEvidence.consumerShardBefore.gitBlobSha1);
      assert.equal(gitBlobSha1(beforeBytes), evidence.sourceEvidence.consumerShardBefore.gitBlobSha1);
      assert.equal(sha256Bytes(beforeBytes), evidence.sourceEvidence.consumerShardBefore.sha256);
      const beforeShard = JSON.parse(beforeBytes.toString('utf8'));
      const beforeMatches = beforeShard.records.filter(item => item.generatedUid === row.uid && item.localOrdinal === row.localOrdinal);
      assert.equal(beforeMatches.length, 1, 'cutover UID/ordinal join must stay unique: ' + row.uid);
      assert.equal(canonicalHash(JSON.parse(studentBody(beforeMatches[0].question))), ledgerPayloadHash, 'historical cutover hash changed: ' + row.uid);

      const approvedSource = evidence.sourceEvidence.source;
      const approvedSourceBytes = gitBlobBytes(approvedSource.gitBlobSha1);
      assert.equal(gitBlobSha1(approvedSourceBytes), approvedSource.gitBlobSha1);
      assert.equal(sha256Bytes(approvedSourceBytes), approvedSource.sha256);
      const approvedQuestion = generatedQuestions(approvedSourceBytes).find(item => Number(item.id) === Number(row.localOrdinal));
      assert.ok(approvedQuestion, 'approved source question missing: ' + row.uid);
      const audit = findSourceAuditCommit(row.uid, approvedSource, approvedQuestion.id, approvedQuestion.answer);
      const currentSourceBytes = fs.readFileSync(path.join(root, approvedSource.path));
      assert.equal(gitBlobSha1(currentSourceBytes), matches[0].sourceShardGitSha, 'Consumer source pointer drift: ' + row.uid);
      const currentSourceQuestion = generatedQuestions(currentSourceBytes).find(item => Number(item.id) === Number(row.localOrdinal));
      assert.ok(currentSourceQuestion, 'current source question missing: ' + row.uid);
      assert.equal(studentBody(currentSourceQuestion), studentBody(approvedQuestion), 'current source changed beyond audited student payload: ' + row.uid);
      assert.equal(studentBody(matches[0].question), studentBody(currentSourceQuestion), 'Consumer does not match the audited source: ' + row.uid);
      assert.equal(audit.record.uid, row.uid);
    }
    checked++;
  }
  assert.equal(checked, 323);
  for (const row of index.records.filter(item => item.consumerShardGitSha)) {
    const shardBytes = fs.readFileSync(path.join(root, 'archive', row.shard));
    const actualGitBlobSha = require('node:crypto').createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${shardBytes.length}\0`), shardBytes])).digest('hex');
    assert.equal(row.consumerShardGitSha, actualGitBlobSha, `stale Consumer shard Git SHA: ${row.uid}`);
    if (Object.hasOwn(row, 'shardGitBlobSha')) assert.equal(row.shardGitBlobSha, actualGitBlobSha, `stale shardGitBlobSha: ${row.uid}`);
    if (Object.hasOwn(row, 'consumerShardSha256')) assert.equal(row.consumerShardSha256.toLowerCase(), require('node:crypto').createHash('sha256').update(shardBytes).digest('hex'), `stale consumerShardSha256: ${row.uid}`);
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
  const draftAuthority = { policyL3L4: 'CANONICAL_DRAFT normalized for archive', ref: base.rpmDraftAuthorityRef, sha256: base.rpmDraftAuthoritySha256 };
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
