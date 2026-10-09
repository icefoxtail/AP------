'use strict';

// Produces index-only browse aliases for the 23 post-cutover approved UIDs.
// Approved source/meta bytes are read-only; write mode applies a SHA-guarded
// patch to `metaBrowsePath` only and records every UID disposition.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { deriveMetaBrowsePath } = require('./backfill-generated-meta.cjs');

const ROOT = path.resolve(__dirname, '../..');
const INDEX_REL = 'archive/data/generated-lite-consumer/v1/index.json';
const CUTOVER_REL = 'archive/data/generated-lite-consumer/v1/meta-retention-cutover-20261009.json';
const CROSSWALK_REL = 'archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json';
const RPM_MASTER_REL = 'docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json';
const RECEIPT_REL = 'archive/data/generated-lite-consumer/v1/meta-browse-alias-receipt-20261009.json';

const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const gitBlobSha1 = bytes => crypto.createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${bytes.length}\0`), bytes])).digest('hex');
const canonical = value => JSON.stringify(sort(value));
function sort(value) {
  if (Array.isArray(value)) return value.map(sort);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map(key => [key, sort(value[key])]));
  return value;
}
function label(raw) {
  if (typeof raw !== 'string') return null;
  const value = raw.trim();
  const split = value.lastIndexOf('|');
  return split > 0 && split < value.length - 1 ? { code: value.slice(0, split).trim(), label: value.slice(split + 1).trim() } : null;
}
function jsonAt(root, rel) { return JSON.parse(fs.readFileSync(path.join(root, rel), 'utf8')); }
function nestedMetaRow(doc, uid) {
  if (doc?.generatedQuestionUid === uid || doc?.uid === uid) return doc;
  const rows = Array.isArray(doc) ? doc : Array.isArray(doc?.records) ? doc.records : [];
  const rowsForUid = rows.filter(row => row.generatedQuestionUid === uid || row.uid === uid || row.questionUid === uid);
  return rowsForUid.length === 1 ? rowsForUid[0] : null;
}
function sourceMetaPath(sourceShard) {
  const normalized = sourceShard.replace(/\\/g, '/');
  if (!normalized.startsWith('archive/generated/lite/v1/') || !normalized.includes('/shards/') || !normalized.endsWith('.js')) return null;
  return normalized.replace('/shards/', '/metadata/').slice(0, -3) + '.json';
}
function buildPlan(root = ROOT, { indexDocument = null } = {}) {
  const indexBytes = fs.readFileSync(path.join(root, INDEX_REL));
  const index = indexDocument || JSON.parse(indexBytes.toString('utf8'));
  const cutover = jsonAt(root, CUTOVER_REL);
  const crosswalkBytes = fs.readFileSync(path.join(root, CROSSWALK_REL));
  const crosswalk = JSON.parse(crosswalkBytes.toString('utf8'));
  const masterBytes = fs.readFileSync(path.join(root, RPM_MASTER_REL));
  const master = JSON.parse(masterBytes.toString('utf8'));
  const legacy = new Set(cutover.legacyUids || []);
  const roster = cutover.historicalMetaEvidenceCompatibility || [];
  if (roster.length !== 23 || cutover.historicalMetaEvidenceCompatibilityCount !== 23 || new Set(roster.map(item => item.uid)).size !== 23 || roster.some(item => legacy.has(item.uid))) throw new Error(`HISTORICAL_META_COMPATIBILITY_ROSTER_INVALID:${roster.length}`);
  const rowsByUid = new Map(index.records.map(row => [row.uid, row]));
  const targetRows = roster.map(compat => ({ compat, row: rowsByUid.get(compat.uid) || null }));
  const xwalkRows = Array.isArray(crosswalk.records) ? crosswalk.records : [];
  const aliases = [];
  const dispositions = [];
  const shardCache = new Map();
  const metaCache = new Map();
  const extensionCache = new Map();
  const crosswalkSha = sha256(crosswalkBytes);
  const crosswalkBlob = gitBlobSha1(crosswalkBytes);
  const masterSha = sha256(masterBytes);
  const authority = {
    policyL3L4: master.policy?.L3L4 || '',
    ref: 'archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json',
    sha256: crosswalkSha,
    namespacePolicyRef: RPM_MASTER_REL,
    namespacePolicySha256: masterSha
  };
  for (const target of targetRows) {
    const { compat } = target;
    const row = target.row;
    if (!row) {
      dispositions.push({ uid: compat.uid, status: 'INACTIVE_WITHDRAWN_FROM_INDEX', reason: 'UID_NOT_PRESENT_IN_CURRENT_CONSUMER_INDEX', metaFinalSha256: compat.metaFinalSha256, historicalEvidence: { metaReviewEvidenceSha256: compat.metaReviewEvidenceSha256, sourceShardGitSha: compat.sourceShardGitSha } });
      continue;
    }
    const fail = reason => dispositions.push({ uid: row.uid, status: 'EVIDENCE_DEBT', reason, metaFinalSha256: row.metaFinalSha256 || compat.metaFinalSha256 });
    if (row.consumerSelectable !== true || row.approval === 'HOLD' || row.reviewStatus === 'HOLD') {
      dispositions.push({ uid: row.uid, status: 'INACTIVE_NOT_SELECTABLE', reason: 'CURRENT_CONSUMER_ROW_NOT_SELECTABLE', metaFinalSha256: row.metaFinalSha256 || compat.metaFinalSha256 });
      continue;
    }
    if (row.metaFinalSha256 !== compat.metaFinalSha256 || (row.sourceShardGitSha && row.sourceShardGitSha !== compat.sourceShardGitSha)) { fail('HISTORICAL_COMPATIBILITY_BASELINE_DRIFT'); continue; }
    const shardRel = `archive/${row.shard}`;
    if (!shardRel.startsWith('archive/data/generated-lite-consumer/v1/')) { fail('CONSUMER_SHARD_OUT_OF_SCOPE'); continue; }
    let shardEntry = shardCache.get(shardRel);
    if (!shardEntry) {
      const bytes = fs.readFileSync(path.join(root, shardRel));
      shardEntry = { bytes, data: JSON.parse(bytes.toString('utf8')), gitBlobSha1: gitBlobSha1(bytes) };
      shardCache.set(shardRel, shardEntry);
    }
    if ((row.consumerShardGitSha && row.consumerShardGitSha !== shardEntry.gitBlobSha1) ||
        (row.shardGitBlobSha && row.shardGitBlobSha !== shardEntry.gitBlobSha1)) { fail('CONSUMER_SHARD_SHA_STALE'); continue; }
    const records = shardEntry.data.records || [];
    const matches = records.filter(record => record.generatedUid === row.uid && record.localOrdinal === row.localOrdinal);
    if (matches.length !== 1) { fail('CONSUMER_UID_ORDINAL_NOT_UNIQUE'); continue; }
    const record = matches[0], question = record.question || {};
    if (record.l2 !== row.l2 || question.subUnitKey !== row.l2) { fail('PHYSICAL_STORAGE_BUCKET_MISMATCH'); continue; }
    const sourceRel = record.sourceShard;
    const metaRel = sourceMetaPath(sourceRel);
    if (!metaRel) { fail('SOURCE_METADATA_PATH_INVALID'); continue; }
    const sourceBytes = fs.readFileSync(path.join(root, sourceRel));
    const sourceBlob = gitBlobSha1(sourceBytes);
    if ((record.sourceShardGitSha && record.sourceShardGitSha !== sourceBlob) || (row.sourceShardGitSha && row.sourceShardGitSha !== sourceBlob)) { fail('SOURCE_SHARD_SHA_STALE'); continue; }
    let metaEntry = metaCache.get(metaRel);
    if (!metaEntry) {
      const bytes = fs.readFileSync(path.join(root, metaRel));
      metaEntry = { bytes, doc: JSON.parse(bytes.toString('utf8')) };
      metaCache.set(metaRel, metaEntry);
    }
    const metaRow = nestedMetaRow(metaEntry.doc, row.uid);
    if (!metaRow?.meta || !metaRow.meta.rpmL4Namespace) { fail('APPROVED_META_UID_NOT_UNIQUE'); continue; }
    const meta = metaRow.meta;
    const metaDigest = sha256(Buffer.from(canonical(meta)));
    if (!row.metaFinalSha256 || row.metaFinalSha256.toLowerCase() !== metaDigest.toLowerCase()) { fail('CURRENT_META_FINAL_SHA_MISMATCH'); continue; }
    const difficulty = meta.difficultyBucket;
    if (!Number.isInteger(difficulty) || difficulty < 1 || difficulty > 5 || question.difficultyBucket !== difficulty) { fail('DIFFICULTY_SOURCE_CONSUMER_PARITY_REQUIRED'); continue; }
    if (!question.standardCourse || !question.standardUnitKey || !question.subUnitKey) { fail('CURRICULUM_PARENT_MISSING'); continue; }
    const common = {
      rpmL1: meta.rpmL1, rpmL2: meta.rpmL2, rpmL3: meta.rpmL3, rpmL4: meta.rpmL4,
      standardCourse: question.standardCourse, standardUnitKey: question.standardUnitKey,
      subUnitKey: question.subUnitKey, difficultyBucket: difficulty,
      expectedDifficultyBucket: question.difficultyBucket, rpmL4Namespace: meta.rpmL4Namespace,
      rpmPrimaryRecordId: meta.rpmPrimaryRecordId,
      rpmDraftAuthorityRef: meta.rpmDraftAuthorityRef,
      rpmDraftAuthoritySha256: meta.rpmDraftAuthoritySha256
    };
    let alias = null;
    if (meta.rpmL4Namespace === 'RPM_EXISTING_DRAFT') {
      if (meta.rpmDraftAuthorityRef !== CROSSWALK_REL || meta.rpmDraftAuthoritySha256?.toLowerCase() !== crosswalkSha.toLowerCase()) { fail('DRAFT_AUTHORITY_BYTES_MISMATCH'); continue; }
      const checked = deriveMetaBrowsePath(common, xwalkRows, authority);
      if (checked.status !== 'EXACT_AUTHORITY_ALIAS') { fail(checked.reason || 'EXACT_RPM_CROSSWALK_REQUIRED'); continue; }
      alias = {
        status: 'EXACT_AUTHORITY_ALIAS', ...checked.metaBrowsePath,
        authorityRef: CROSSWALK_REL, authoritySha256: crosswalkSha,
        namespacePolicyRef: RPM_MASTER_REL, namespacePolicySha256: masterSha,
        recordId: checked.authority.id, metaFinalSha256: row.metaFinalSha256
      };
    } else if (meta.rpmL4Namespace === 'GENERATED_EXT_L4') {
      const extRel = meta.generatedL4RegistryRef;
      if (typeof extRel !== 'string' || !extRel.startsWith('archive/generated/lite/v1/') || extRel.includes('..') || extRel.includes('\\')) { fail('GENERATED_EXT_REGISTRY_REF_INVALID'); continue; }
      let ext = extensionCache.get(extRel);
      if (!ext) {
        const bytes = fs.readFileSync(path.join(root, extRel));
        ext = { bytes, doc: JSON.parse(bytes.toString('utf8')) };
        extensionCache.set(extRel, ext);
      }
      const extSha = sha256(ext.bytes);
      const entry = (ext.doc.entries || []).filter(item => item.sourceUid === row.uid);
      const l3 = label(meta.rpmL3), l4 = label(meta.rpmL4);
      if (ext.doc.schemaVersion !== 'ALIVE_GENERATED_EXT_L4_ACTIVE_V1' || ext.doc.namespace !== 'GENERATED_ONLY' || entry.length !== 1 || !l3 || !l4 || entry[0].key !== l4.code || entry[0].labelKo !== l4.label || entry[0].parentL3 !== l3.code) { fail('GENERATED_EXT_UID_PARENT_OR_LABEL_MISMATCH'); continue; }
      const parentCandidates = xwalkRows.filter(item => item.standardCourse === question.standardCourse && item.standardUnitKey === question.standardUnitKey &&
        label(meta.rpmL1)?.label === item.rpmPath?.majorUnit && label(meta.rpmL2)?.label === item.rpmPath?.midUnit &&
        item.rpmPath?.l3 === l3.label && item.rpmPath?.l3 && item.rpmPath?.majorUnit && item.rpmPath?.midUnit);
      const parentTriples = new Map(parentCandidates.map(item => [`${item.rpmPath.majorUnit}\u0000${item.rpmPath.midUnit}\u0000${item.rpmPath.l3}`, item]));
      if (parentTriples.size !== 1) { fail('GENERATED_EXT_PARENT_NOT_UNIQUE'); continue; }
      const parent = [...parentTriples.values()][0];
      alias = {
        status: 'EXACT_AUTHORITY_ALIAS',
        L1: parent.rpmPath.majorUnit, L2: parent.rpmPath.midUnit, L3: parent.rpmPath.l3,
        L4: meta.rpmL4, rpmL4Namespace: 'GENERATED_EXT_L4',
        authorityRef: extRel, authoritySha256: extSha,
        namespacePolicyRef: RPM_MASTER_REL, namespacePolicySha256: masterSha,
        recordId: null, parentRecordIds: [...new Set(parentCandidates.map(item => item.id))].sort(),
        metaFinalSha256: row.metaFinalSha256
      };
    } else { fail('RPM_NAMESPACE_NOT_SUPPORTED'); continue; }
    const binding = {
      uid: row.uid,
      indexShard: row.shard,
      indexLocalOrdinal: row.localOrdinal,
      metaFinalSha256: row.metaFinalSha256,
      sourceMetadata: { path: metaRel, sha256: sha256(metaEntry.bytes), gitBlobSha1: gitBlobSha1(metaEntry.bytes) },
      sourceShard: { path: sourceRel, sha256: sha256(sourceBytes), gitBlobSha1: sourceBlob },
      consumerShard: { path: shardRel, sha256: sha256(shardEntry.bytes), gitBlobSha1: shardEntry.gitBlobSha1 },
      rpmCrosswalk: { path: CROSSWALK_REL, sha256: crosswalkSha, gitBlobSha1: crosswalkBlob },
      namespacePolicy: { path: RPM_MASTER_REL, sha256: masterSha }
    };
    aliases.push({ uid: row.uid, metaBrowsePath: alias, binding });
    dispositions.push({ uid: row.uid, status: 'EXACT_AUTHORITY_ALIAS', L1: alias.L1, L2: alias.L2, L3: alias.L3, L4: alias.L4, recordId: alias.recordId, metaFinalSha256: row.metaFinalSha256 });
  }
  return {
    schemaVersion: 'GENERATED_META_BROWSE_ALIAS_RECEIPT_V1',
    scope: 'EXACT_POST_CUTOVER_23_UIDS_INDEX_ONLY',
    indexBefore: { path: INDEX_REL, sha256: sha256(indexBytes), gitBlobSha1: gitBlobSha1(indexBytes) },
    cutover: { path: CUTOVER_REL, sha256: sha256(fs.readFileSync(path.join(root, CUTOVER_REL))) },
    rpmCrosswalk: { path: CROSSWALK_REL, sha256: crosswalkSha, gitBlobSha1: crosswalkBlob },
    namespacePolicy: { path: RPM_MASTER_REL, sha256: masterSha, policyL3L4: master.policy?.L3L4 || '' },
    aliasCount: aliases.length,
    evidenceDebtCount: dispositions.filter(item => item.status === 'EVIDENCE_DEBT').length,
    aliases,
    dispositions
  };
}
function writeAliases(root = ROOT) {
  const plan = buildPlan(root);
  const indexPath = path.join(root, INDEX_REL);
  const currentBytes = fs.readFileSync(indexPath);
  if (sha256(currentBytes) !== plan.indexBefore.sha256) throw new Error('INDEX_RAW_SHA_CAS_MISMATCH');
  const index = JSON.parse(currentBytes.toString('utf8'));
  const byUid = new Map(plan.aliases.map(item => [item.uid, item.metaBrowsePath]));
  let changed = 0;
  for (const row of index.records) {
    const alias = byUid.get(row.uid);
    if (!alias) continue;
    if (row.metaFinalSha256 !== alias.metaFinalSha256) throw new Error(`META_FINAL_SHA_CAS_MISMATCH:${row.uid}`);
    if (row.metaBrowsePath && canonical(row.metaBrowsePath) !== canonical(alias)) throw new Error(`EXISTING_ALIAS_CONFLICT:${row.uid}`);
    if (!row.metaBrowsePath) { row.metaBrowsePath = alias; changed++; }
  }
  const bytes = Buffer.from(`${JSON.stringify(index, null, 2)}\n`);
  const tempPath = `${indexPath}.meta-browse-${process.pid}.tmp`;
  fs.writeFileSync(tempPath, bytes, { flag: 'wx' });
  const reRead = fs.readFileSync(indexPath);
  if (sha256(reRead) !== plan.indexBefore.sha256) {
    fs.unlinkSync(tempPath);
    throw new Error('INDEX_CHANGED_DURING_ALIAS_BUILD');
  }
  fs.renameSync(tempPath, indexPath);
  const receipt = { ...plan, indexAfter: { path: INDEX_REL, sha256: sha256(bytes), gitBlobSha1: gitBlobSha1(bytes) }, writtenAliasCount: changed };
  fs.writeFileSync(path.join(root, RECEIPT_REL), `${JSON.stringify(receipt, null, 2)}\n`);
  return receipt;
}

if (require.main === module) {
  try {
    const write = process.argv.includes('--write');
    const result = write ? writeAliases() : buildPlan();
    console.log(JSON.stringify({ status: 'PASS', scope: result.scope, aliasCount: result.aliasCount, evidenceDebtCount: result.evidenceDebtCount, receipt: RECEIPT_REL, write }, null, 2));
  } catch (error) {
    console.error(JSON.stringify({ status: 'FAIL', error: error.message }, null, 2));
    process.exitCode = 1;
  }
}

module.exports = { buildPlan, writeAliases, label, canonical, sha256, gitBlobSha1, paths: { INDEX_REL, RECEIPT_REL } };
