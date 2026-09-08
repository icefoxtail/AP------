import { HASH_PATTERN, isObject, nonempty, objectSha, readBoundFile, canonicalJson } from './canonical.mjs';

export const BUILD_WORK_LEDGER_VERSION = 'APMATH_BUILD_WORK_LEDGER_v1';

export function createBuildWorkLedgerEntry({ buildId, pipeline, questionUid, builderId, builderSessionId, builderModelOrAgent, runId, revision, inputSha, outputRefs = [], reviewEvidenceIds = [], status = 'PASS', createdAt }) {
  const entry = { schemaVersion: BUILD_WORK_LEDGER_VERSION, buildId, pipeline, questionUid, builderId, builderSessionId, builderModelOrAgent, runId, revision, inputSha, outputRefs, reviewEvidenceIds: Array.isArray(reviewEvidenceIds) ? [...reviewEvidenceIds].sort() : reviewEvidenceIds, status, createdAt };
  const result = validateBuildWorkLedgerEntry(entry);
  if (result.status !== 'PASS') throw new Error(result.errors.join(';'));
  return { ...entry, entrySha: objectSha(entry) };
}

export function validateBuildWorkLedgerEntry(entry, { root, run, freshness = [], evidence } = {}) {
  const errors = [];
  if (!isObject(entry) || entry.schemaVersion !== BUILD_WORK_LEDGER_VERSION) errors.push('BUILD_LEDGER_SCHEMA_INVALID');
  for (const field of ['buildId', 'pipeline', 'questionUid', 'builderId', 'builderSessionId']) if (!nonempty(entry?.[field])) errors.push(`BUILD_LEDGER_FIELD_MISSING:${field}`);
  if (!HASH_PATTERN.test(entry?.inputSha)) errors.push('BUILD_LEDGER_INPUT_SHA_INVALID');
  if (!Array.isArray(entry?.outputRefs)) errors.push('BUILD_LEDGER_OUTPUT_REFS_INVALID');
  if (!['PASS', 'FAIL'].includes(entry?.status)) errors.push('BUILD_LEDGER_STATUS_INVALID');
  if (!Number.isFinite(Date.parse(entry?.createdAt))) errors.push('BUILD_LEDGER_TIME_INVALID');
  if (run) {
    if (entry.runId !== run.runId || entry.revision !== run.revision || entry.builderId !== run.builderId || entry.builderSessionId !== run.builderSessionId || entry.builderModelOrAgent !== run.builderModelOrAgent || entry.inputSha !== run.inputSha) errors.push('BUILD_LEDGER_RUN_LINEAGE');
    const question = run.questions.find(q => q.questionUid === entry.questionUid);
    const outputs = run.inputs.filter(ref => ref.path === question?.candidatePath || [...(question?.solutionAssetPaths || []), ...(question?.problemAssetPaths || [])].includes(ref.path));
    if (canonicalJson(entry.outputRefs) !== canonicalJson(outputs)) errors.push('BUILD_LEDGER_OUTPUT_BINDING');
    for (const ref of entry.outputRefs || []) { try { readBoundFile(root, ref); } catch { errors.push('BUILD_LEDGER_OUTPUT_CHANGED'); } }
    const reviewIds = freshness.filter(row => row.questionUid === entry.questionUid && ['FRESH', 'MACHINE_CURRENT'].includes(row.mode)).map(row => row.evidenceId).sort();
    if (canonicalJson(entry.reviewEvidenceIds || []) !== canonicalJson(reviewIds)) errors.push('BUILD_LEDGER_REVIEW_LINEAGE');
    for (const id of reviewIds) if (Date.parse(entry.createdAt) > Date.parse(evidence?.get(id)?.startedAt)) errors.push('REVIEW_PRECEDES_BUILD');
    const { entrySha, ...payload } = entry;
    if (entrySha !== objectSha(payload)) errors.push('BUILD_LEDGER_SHA_MISMATCH');
  }
  return { status: errors.length ? 'FAIL' : 'PASS', errors };
}
