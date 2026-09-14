import { CORE_SHA } from './closure.mjs';
import { canonicalJson, fileRef, objectSha, readBoundFile, safePath, writeNewJson } from './canonical.mjs';
import { auditV2Run } from './v2-audit.mjs';

export const CANONICAL_AUDIT_SNAPSHOT_SCHEMA = 'APMATH_CANONICAL_AUDIT_SNAPSHOT_v1';

const refIdentity = ref => ref ? { path: ref.path, bytes: ref.bytes, sha256: ref.sha256 } : null;

export function canonicalAuditIdentity(run, { authority = null } = {}) {
  const evidenceRefs = [...(run?.evidence || [])].map(refIdentity).sort((a, b) => `${a?.path || ''}|${a?.sha256 || ''}`.localeCompare(`${b?.path || ''}|${b?.sha256 || ''}`));
  return {
    runId: run?.runId || null,
    revision: run?.revision ?? null,
    inputSha: run?.inputSha || null,
    coreSha: CORE_SHA,
    evidenceSetSha: objectSha(evidenceRefs),
    sourceAuthoritySha: objectSha(run?.sourceAuthority || null),
    uidAuthoritySha: objectSha(run?.uidAuthority || null),
    qualityClosureRef: refIdentity(run?.questionQualityClosureSetRef),
    releaseClosureRef: refIdentity(run?.examReleaseClosureRef),
    runtimeIdentity: run?.renderRuntime || null,
    releasePolicySha: objectSha(run?.releaseRenderPolicy || run?.releasePolicy || null),
  };
}

export function createCanonicalAuditSnapshot(run, audit, { authority = null, evaluator = 'pipeline-core.auditV2Run' } = {}) {
  const identity = canonicalAuditIdentity(run, { authority });
  const payload = { schemaVersion: CANONICAL_AUDIT_SNAPSHOT_SCHEMA, status: audit?.status === 'PASS' ? 'PASS' : 'BLOCKED', evaluator, identity, audit };
  return { ...payload, snapshotSha: objectSha(payload) };
}

export function writeCanonicalAuditSnapshot(root, snapshot, outputPath) {
  const target = safePath(root, outputPath, { mustExist: false });
  writeNewJson(target, snapshot);
  return fileRef(root, outputPath);
}

export function validateCanonicalAuditSnapshot(root, ref, { run, audit, authority = null } = {}) {
  const errors = [];
  let snapshot = null;
  try {
    snapshot = JSON.parse(readBoundFile(root, ref).toString('utf8'));
    const { snapshotSha: declared, ...payload } = snapshot;
    if (snapshot.schemaVersion !== CANONICAL_AUDIT_SNAPSHOT_SCHEMA) errors.push('CANONICAL_AUDIT_SNAPSHOT_SCHEMA_INVALID');
    if (snapshot.status !== 'PASS') errors.push('CANONICAL_AUDIT_SNAPSHOT_NOT_PASS');
    if (!declared || declared !== objectSha(payload)) errors.push('CANONICAL_AUDIT_SNAPSHOT_SHA_INVALID');
    if (canonicalJson(snapshot.identity) !== canonicalJson(canonicalAuditIdentity(run, { authority }))) errors.push('CANONICAL_AUDIT_SNAPSHOT_IDENTITY_MISMATCH');
    if (!snapshot.audit || snapshot.audit.status !== 'PASS' || audit && canonicalJson(snapshot.audit) !== canonicalJson(audit)) errors.push('CANONICAL_AUDIT_SNAPSHOT_AUDIT_PARITY_INVALID');
  } catch (error) {
    errors.push(`CANONICAL_AUDIT_SNAPSHOT_READ_FAILED:${error.message}`);
  }
  return { status: errors.length ? 'FAIL' : 'PASS', errors: [...new Set(errors)], snapshot };
}

export function evaluateCanonicalAuditOnce(root, run, { snapshotRef = null, outputPath = null, authority = null, evaluator = auditV2Run } = {}) {
  if (snapshotRef) {
    const checked = validateCanonicalAuditSnapshot(root, snapshotRef, { run, audit: null, authority });
    if (checked.status === 'PASS') return { status: 'REUSED', audit: checked.snapshot.audit, snapshot: checked.snapshot, snapshotRef, errors: [] };
  }
  const audit = evaluator(root, run);
  const snapshot = createCanonicalAuditSnapshot(run, audit, { authority });
  let persistedRef = null;
  if (outputPath) persistedRef = writeCanonicalAuditSnapshot(root, snapshot, outputPath);
  return { status: 'FRESH', audit, snapshot, snapshotRef: persistedRef, errors: [] };
}
