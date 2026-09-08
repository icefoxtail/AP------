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
    if (manifest.riskProfile === 'HIGH_RISK' && uids.length > 5) errors.push('HIGH_RISK_HARD_MAX');
    else {
    try {
      if (manifest.sizeException?.status !== 'APPROVED' || !nonempty(manifest.sizeException.reviewerId)) throw new Error();
      const approval = JSON.parse(readBoundFile(root, manifest.sizeException.evidence));
      if (approval.status !== 'APPROVED' || approval.batchId !== manifest.batchId || approval.plannedSize !== uids.length || objectSha(uidSet(approval.questionUids)) !== objectSha(uidSet(uids))) throw new Error();
    } catch { errors.push('SIZE_EXCEPTION_NOT_PROVEN'); }
    }
  }
  if (!Array.isArray(manifest.visualTypes) || !Array.isArray(manifest.factSchemaVersions) || !manifest.factSchemaVersions.length) errors.push('VISUAL_PROFILE_MISSING');
  if (plan && plan.NO_VISUAL !== uids.length && !manifest.visualTypes?.length) errors.push('VISUAL_TYPES_EMPTY');
  if (manifest.riskProfile === 'STANDARD_KEEP_EXISTING' && plan?.KEEP_EXISTING !== uids.length) errors.push('KEEP_PROFILE_CONTAINS_OTHER_ACTION');
  if (manifest.riskProfile === 'NO_VISUAL_ONLY' && plan?.NO_VISUAL !== uids.length) errors.push('NO_VISUAL_PROFILE_CONTAINS_VISUAL');
  if (manifest.riskProfile !== 'FINAL_AUDIT' && uids.length > 5 && ((manifest.highRiskCount ?? 0) >= 3 || manifest.visualTypes?.length >= 3 || manifest.factSchemaVersions?.length >= 2 || manifest.sourceConflict === true || manifest.previousRevisionUnresolved === true)) errors.push('AUTOMATIC_BATCH_REDUCTION_REQUIRED');
  if (!Array.isArray(activeRegistry) || activeRegistry.length === 0) errors.push('CANONICAL_REGISTRY_REQUIRED');
  else {
    const ids = new Set(), active = new Set();
    for (const record of activeRegistry) {
      if (!nonempty(record.recordId) || ids.has(record.recordId) || !nonempty(record.batchId) || !Number.isSafeInteger(record.revision) || record.revision < 1 || typeof record.isCanonical !== 'boolean' || !HASH_PATTERN.test(record.inputSha)) errors.push('REGISTRY_RECORD_INVALID');
      ids.add(record.recordId);
      try {
        const recordUids = uidSet(record.questionUids);
        if (recordUids.length === 0) errors.push('REGISTRY_EMPTY_UID_SET');
        for (const uid of recordUids) if (record.isCanonical) { if (active.has(uid)) errors.push('REGISTRY_ACTIVE_UID_DUPLICATE'); active.add(uid); }
      } catch { errors.push('REGISTRY_UID_SET_INVALID'); }
    }
    const byId = new Map(activeRegistry.map((record) => [record.recordId, record]));
    for (const record of activeRegistry) {
      if (record.revision === 1 && record.supersedes !== null) errors.push('REGISTRY_INITIAL_SUPERSEDES_INVALID');
      if (record.revision > 1) {
        const predecessor = byId.get(record.supersedes);
        try {
          if (!predecessor || predecessor.isCanonical || predecessor.batchId !== record.batchId || predecessor.revision !== record.revision - 1 || predecessor.inputSha === record.inputSha || objectSha(uidSet(predecessor.questionUids)) !== objectSha(uidSet(record.questionUids))) errors.push('REGISTRY_REVISION_LINEAGE_INVALID');
        } catch { errors.push('REGISTRY_REVISION_UID_SCOPE_INVALID'); }
      }
    }
    const overlaps = activeRegistry.filter(r => r.isCanonical && r.questionUids?.some(uid => uids.includes(uid)));
    if (overlaps.length && (manifest.revision === 1 || overlaps.some(r => r.recordId !== manifest.supersedes))) errors.push('ACTIVE_CANONICAL_UID_OVERLAP');
    if (manifest.revision === 1 && manifest.supersedes !== null) errors.push('INITIAL_SUPERSEDES_INVALID');
    if (manifest.revision > 1) {
      const predecessor = activeRegistry.find(r => r.recordId === manifest.supersedes);
      if (!predecessor || predecessor.isCanonical || predecessor.revision !== manifest.revision - 1 || predecessor.batchId !== manifest.batchId || predecessor.inputSha === manifest.evidenceInputSha || !HASH_PATTERN.test(manifest.evidenceInputSha) || objectSha(uidSet(predecessor.questionUids)) !== objectSha(uidSet(uids))) errors.push('REVISION_LINEAGE_INVALID');
    }
  }
  if (!Array.isArray(manifest.appliedRuleRefs) || !manifest.appliedRuleRefs.length) errors.push('RULE_REFS_MISSING');
  else for (const ref of manifest.appliedRuleRefs) {
    try {
      if (!nonempty(ref.declaredVersion)) throw new Error('RULE_VERSION_MISSING');
      readBoundFile(root, { path: ref.path, bytes: ref.bytes ?? ref.actualBytes, sha256: ref.sha256 });
    } catch (error) { errors.push(`RULE_REF_INVALID:${ref.path}:${error.message}`); }
  }
  if (manifest.requireFullRulePack === true) {
    const requiredRulePaths = [
      'docs/rules/00_RULES_INDEX.md',
      'docs/rules/01_CANONICAL/JS아카이브룰북_v2.6.md',
      'docs/rules/02_PIPELINES/COMMON_PROTOCOL_v1.2.10.md',
      'docs/rules/02_PIPELINES/공통파이프라인_실행계약_v1.md',
      'docs/rules/02_PIPELINES/작업방식_적응형배치루프_v1.md',
      'docs/rules/03_REVIEW/수학_문항오류_검증_프로토콜_v2.1.md',
      'docs/rules/04_VISUAL/도형추출.md',
      'docs/rules/04_VISUAL/도형의방정식_해설_SVG_독립검수_운영규정_v1.1.md',
      'docs/rules/04_VISUAL/AP_MATH_OS_집합_명제_논리시각자료_Semantic_Overlay_v1.4_QUALIFICATION_READY.md'
    ];
    const refsByPath = new Map((manifest.appliedRuleRefs || []).map((ref) => [ref.path, ref]));
    for (const requiredPath of requiredRulePaths) if (!refsByPath.has(requiredPath)) errors.push(`REQUIRED_RULE_REF_MISSING:${requiredPath}`);
    const routingPayload = [...refsByPath.values()].map(({ path: refPath, declaredVersion, bytes, actualBytes, sha256 }) => ({ path: refPath, declaredVersion, bytes: bytes ?? actualBytes, sha256 })).sort((a, b) => a.path.localeCompare(b.path));
    if (!HASH_PATTERN.test(manifest.ruleRoutingBundleSha || '') || manifest.ruleRoutingBundleSha !== objectSha(routingPayload)) errors.push('RULE_ROUTING_BUNDLE_SHA_MISMATCH');
    if (manifest.ruleContractVersion !== 'LOGIC_VISUAL_RULE_CONTRACT_v1') errors.push('RULE_CONTRACT_VERSION_INVALID');
  }
  return { status: errors.length ? 'FAIL' : 'PASS', errors, hashSpec: 'APMATH_CANONICAL_JSON_v1' };
}
