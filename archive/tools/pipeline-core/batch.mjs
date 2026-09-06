import { objectSha, uidSet, bytesSha, readBoundFile, nonempty, HASH_PATTERN } from './canonical.mjs';

export function validateBatchManifest(root, manifest, inventory, inventoryBytes, activeRegistry = null) {
  const errors = [];
  if (!manifest || !Array.isArray(manifest.questionUids)) return { status: 'FAIL', errors: ['MANIFEST_SCHEMA'] };
  const uids = manifest.questionUids;
  try { if (!uidSet(uids).length) errors.push('EMPTY_UID_SET'); } catch { errors.push('DUPLICATE_OR_INVALID_UID'); }
  if (!Number.isSafeInteger(manifest.revision) || manifest.revision < 1 || !Number.isSafeInteger(manifest.batchNo) || manifest.batchNo < 1 || !nonempty(manifest.batchId) || manifest.isCanonical !== true) errors.push('BATCH_IDENTITY_INVALID');
  if (manifest.plannedSize !== uids.length) errors.push('PLANNED_SIZE_MISMATCH');
  const available = new Set((inventory.rows || []).map(row => row.questionUid));
  if (uids.some(uid => !available.has(uid))) errors.push('UID_NOT_IN_INVENTORY');
  if (manifest.inventorySha !== bytesSha(inventoryBytes)) errors.push('INVENTORY_SHA_MISMATCH');
  const { manifestSha, ...payload } = manifest;
  if (!HASH_PATTERN.test(manifestSha) || manifestSha !== objectSha(payload)) errors.push('MANIFEST_SHA_MISMATCH');
  const plan = manifest.visualDecisionPlan;
  const keys = ['NO_VISUAL', 'KEEP_EXISTING', 'REBUILD_EXISTING', 'ADD_NEW_VISUAL'];
  if (!plan || Object.keys(plan).some(k => !keys.includes(k)) || keys.some(k => !Number.isSafeInteger(plan[k]) || plan[k] < 0) || keys.reduce((sum, k) => sum + (plan[k] || 0), 0) !== uids.length) errors.push('VISUAL_DECISION_PLAN_INVALID');
  const ranges = { HIGH_RISK: [3, 5], REBUILD_EXISTING: [4, 6], STANDARD_KEEP_EXISTING: [8, 12], NO_VISUAL_ONLY: [15, 20], FINAL_AUDIT: [1, available.size] };
  const range = ranges[manifest.riskProfile];
  if (!range) errors.push('UNKNOWN_RISK_PROFILE');
  else if (uids.length < range[0] || uids.length > range[1]) {
    try {
      if (manifest.sizeException?.status !== 'APPROVED' || !nonempty(manifest.sizeException.reviewerId)) throw new Error();
      const approval = JSON.parse(readBoundFile(root, manifest.sizeException.evidence));
      if (approval.status !== 'APPROVED' || approval.batchId !== manifest.batchId || approval.plannedSize !== uids.length || objectSha(uidSet(approval.questionUids)) !== objectSha(uidSet(uids))) throw new Error();
    } catch { errors.push('SIZE_EXCEPTION_NOT_PROVEN'); }
  }
  if (!Array.isArray(manifest.visualTypes) || !Array.isArray(manifest.factSchemaVersions) || !manifest.factSchemaVersions.length) errors.push('VISUAL_PROFILE_MISSING');
  if (plan && plan.NO_VISUAL !== uids.length && !manifest.visualTypes?.length) errors.push('VISUAL_TYPES_EMPTY');
  if (manifest.riskProfile === 'STANDARD_KEEP_EXISTING' && plan?.KEEP_EXISTING !== uids.length) errors.push('KEEP_PROFILE_CONTAINS_OTHER_ACTION');
  if (manifest.riskProfile === 'NO_VISUAL_ONLY' && plan?.NO_VISUAL !== uids.length) errors.push('NO_VISUAL_PROFILE_CONTAINS_VISUAL');
  if (manifest.riskProfile !== 'FINAL_AUDIT' && uids.length > 5 && ((manifest.highRiskCount ?? 0) >= 3 || manifest.visualTypes?.length >= 3 || manifest.factSchemaVersions?.length >= 2 || manifest.sourceConflict === true || manifest.previousRevisionUnresolved === true)) errors.push('AUTOMATIC_BATCH_REDUCTION_REQUIRED');
  if (!Array.isArray(activeRegistry)) errors.push('CANONICAL_REGISTRY_REQUIRED');
  else {
    const ids = new Set(), active = new Set();
    for (const record of activeRegistry) {
      if (!nonempty(record.recordId) || ids.has(record.recordId) || !nonempty(record.batchId) || !Number.isSafeInteger(record.revision) || record.revision < 1 || typeof record.isCanonical !== 'boolean' || !HASH_PATTERN.test(record.inputSha)) errors.push('REGISTRY_RECORD_INVALID');
      ids.add(record.recordId);
      try {
        for (const uid of uidSet(record.questionUids)) if (record.isCanonical) { if (active.has(uid)) errors.push('REGISTRY_ACTIVE_UID_DUPLICATE'); active.add(uid); }
      } catch { errors.push('REGISTRY_UID_SET_INVALID'); }
    }
    const overlaps = activeRegistry.filter(r => r.isCanonical && r.questionUids?.some(uid => uids.includes(uid)));
    if (overlaps.length && (manifest.revision === 1 || overlaps.some(r => r.recordId !== manifest.supersedes))) errors.push('ACTIVE_CANONICAL_UID_OVERLAP');
    if (manifest.revision === 1 && manifest.supersedes !== null) errors.push('INITIAL_SUPERSEDES_INVALID');
    if (manifest.revision > 1) {
      const predecessor = activeRegistry.find(r => r.recordId === manifest.supersedes);
      if (!predecessor || predecessor.revision !== manifest.revision - 1 || predecessor.batchId !== manifest.batchId || predecessor.inputSha === manifest.evidenceInputSha || !HASH_PATTERN.test(manifest.evidenceInputSha) || objectSha(uidSet(predecessor.questionUids)) !== objectSha(uidSet(uids))) errors.push('REVISION_LINEAGE_INVALID');
    }
  }
  if (!Array.isArray(manifest.appliedRuleRefs) || !manifest.appliedRuleRefs.length) errors.push('RULE_REFS_MISSING');
  else for (const ref of manifest.appliedRuleRefs) {
    try {
      if (!nonempty(ref.declaredVersion)) throw new Error('RULE_VERSION_MISSING');
      readBoundFile(root, { path: ref.path, bytes: ref.bytes ?? ref.actualBytes, sha256: ref.sha256 });
    } catch (error) { errors.push(`RULE_REF_INVALID:${ref.path}:${error.message}`); }
  }
  return { status: errors.length ? 'FAIL' : 'PASS', errors, hashSpec: 'APMATH_CANONICAL_JSON_v1' };
}
