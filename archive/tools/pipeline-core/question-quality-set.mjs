import { canonicalJson, isObject, nonempty, objectSha, uidSet, HASH_PATTERN } from './canonical.mjs';
import { validateEvidenceFreshness } from './review-evidence-v2.mjs';
import { calibrationComparisonChecksForReviewAxis, validateCalibrationConsumptionBinding } from './calibration-consumption.mjs';

export const QUESTION_QUALITY_CLOSURE_VERSION = 'APMATH_QUESTION_QUALITY_CLOSURE_v2';
export const QUESTION_QUALITY_CLOSURE_SET_VERSION = 'APMATH_QUESTION_QUALITY_CLOSURE_SET_v1';

const normalizeAxes = axes => [...new Set((Array.isArray(axes) ? axes : Object.keys(axes || {})).map(axis => String(axis).toUpperCase()))].sort();
const comparisonChecks = (axis, calibrationAxes) => calibrationComparisonChecksForReviewAxis(axis, {
  problemAssetPaths: calibrationAxes.includes('problemVisual') ? ['calibration'] : [],
  solutionAssetPaths: calibrationAxes.includes('solutionVisual') ? ['calibration'] : []
});

export function materializeQuestionQualityClosure({ questionUid, currentRunInputSha, requiredAxes, axes, affected = false, initialErrors = [], calibrationByAxis = {}, requiredCalibrationAxesByAxis = {}, calibrationIdentity = null, calibrationAnchorCatalog = null }) {
  const errors = [...initialErrors];
  if (!nonempty(questionUid) || !HASH_PATTERN.test(currentRunInputSha)) errors.push('QUESTION_CLOSURE_IDENTITY_INVALID');
  const required = normalizeAxes(requiredAxes);
  const source = isObject(axes) ? axes : {};
  const normalizedAxes = {};
  for (const axis of required) {
    const entry = source[axis] || source[axis.toLowerCase()];
    if (!isObject(entry) || !['FRESH', 'REUSED', 'MACHINE_CURRENT'].includes(entry.mode) || entry.status !== 'PASS') errors.push(`QUESTION_CLOSURE_AXIS_NOT_CLOSED:${axis}`);
    if (entry?.questionUid !== questionUid || entry?.axis !== axis || !nonempty(entry?.evidenceId) || !HASH_PATTERN.test(entry?.evidenceSha || '') || !HASH_PATTERN.test(entry?.axisInputSha || '') || (entry?.mode === 'REUSED' ? !HASH_PATTERN.test(entry?.receiptSha || '') : entry?.receiptSha !== null)) errors.push(`QUESTION_CLOSURE_AXIS_BINDING:${axis}`);
    const calibrationAxes = requiredCalibrationAxesByAxis?.[axis] || requiredCalibrationAxesByAxis?.[axis.toUpperCase()] || [];
    const calibration = calibrationByAxis?.[axis] || calibrationByAxis?.[axis.toUpperCase()] || entry?.calibrationConsumption || null;
    if (calibrationAxes.length) {
      const checked = validateCalibrationConsumptionBinding(calibration, { expectedIdentity: calibrationIdentity, reviewerPhase: axis === 'RENDER_REVIEW' ? 'RENDER_REVIEW' : ['V2'].includes(axis) ? 'U2' : 'U3', requiredAxes: calibrationAxes, requirePass: true, anchorCatalog: calibrationAnchorCatalog, requiredComparisonChecks: comparisonChecks(axis, calibrationAxes) });
      errors.push(...checked.errors.map(error => `${axis}:${error}`));
    }
    normalizedAxes[axis] = calibrationAxes.length ? { ...(entry || { status: 'BLOCKED', mode: null }), calibrationConsumption: calibration, calibrationRequired: true } : (entry || { status: 'BLOCKED', mode: null });
  }
  const payload = { schemaVersion: QUESTION_QUALITY_CLOSURE_VERSION, questionUid, currentRunInputSha, requiredAxes: required, axes: normalizedAxes, affected, productionAuthorized: false, status: errors.length ? 'BLOCKED' : 'PASS' };
  return { ...payload, closureSha: objectSha(payload), errors };
}

export function createQuestionQualityClosureSet({ runId, revision, currentRunInputSha, questions, closures, productionAuthorized = false }) {
  const errors = [];
  if (!nonempty(runId) || !Number.isSafeInteger(revision) || revision < 1 || !HASH_PATTERN.test(currentRunInputSha)) errors.push('QUESTION_CLOSURE_SET_IDENTITY_INVALID');
  const expectedUids = uidSet((Array.isArray(questions) ? questions : []).map(question => question.questionUid));
  if (!expectedUids.length) errors.push('QUESTION_CLOSURE_SET_EMPTY');
  const records = Array.isArray(closures) ? closures : [];
  const seen = new Set();
  for (const closure of records) {
    if (!nonempty(closure?.questionUid) || seen.has(closure.questionUid)) errors.push(`QUESTION_CLOSURE_UID_DUPLICATE_OR_MISSING:${closure?.questionUid || 'unknown'}`);
    seen.add(closure?.questionUid);
    if (closure?.status !== 'PASS' || closure?.currentRunInputSha !== currentRunInputSha || closure?.productionAuthorized === true) errors.push(`QUESTION_CLOSURE_INVALID:${closure?.questionUid || 'unknown'}`);
  }
  for (const uid of expectedUids) if (!seen.has(uid)) errors.push(`QUESTION_CLOSURE_UID_MISSING:${uid}`);
  for (const uid of seen) if (!expectedUids.includes(uid)) errors.push(`QUESTION_CLOSURE_UID_EXTRA:${uid}`);
  if (productionAuthorized === true) errors.push('QUESTION_QUALITY_PRODUCTION_AUTHORITY_FORBIDDEN');
  const ordered = records.slice().sort((a, b) => a.questionUid.localeCompare(b.questionUid));
  const allAxes = ordered.flatMap(closure => Object.values(closure.axes || {}).map(axis => ({ ...axis, questionUid: closure.questionUid })));
  const payload = { schemaVersion: QUESTION_QUALITY_CLOSURE_SET_VERSION, runId, revision, currentRunInputSha, questionUids: expectedUids, questionUidSetSha: objectSha(expectedUids), closures: ordered, freshAxisCount: allAxes.filter(axis => axis.mode === 'FRESH').length, reusedAxisCount: allAxes.filter(axis => axis.mode === 'REUSED').length, freshUidCount: new Set(allAxes.filter(axis => axis.mode === 'FRESH').map(axis => axis.questionUid)).size, reusedOnlyUidCount: new Set(allAxes.filter(axis => axis.mode === 'REUSED').map(axis => axis.questionUid)).size, affectedUidCount: new Set(ordered.filter(closure => closure.affected).map(closure => closure.questionUid)).size, productionAuthorized: false, status: errors.length ? 'BLOCKED' : 'PASS' };
  return { ...payload, closureSetSha: objectSha(payload), errors };
}

export function validateQuestionQualityClosureSet(closureSet, { runId, revision, currentRunInputSha, questionUids, requiredAxesByUid, freshness, calibrationIdentity = null, calibrationRequiredAxesByUid = {}, calibrationAnchorCatalog = null } = {}) {
  const errors = [];
  if (!isObject(closureSet) || closureSet.schemaVersion !== QUESTION_QUALITY_CLOSURE_SET_VERSION) errors.push('QUESTION_CLOSURE_SET_SCHEMA_INVALID');
  if (runId !== undefined && closureSet?.runId !== runId) errors.push('QUESTION_CLOSURE_SET_RUN_MISMATCH');
  if (revision !== undefined && closureSet?.revision !== revision) errors.push('QUESTION_CLOSURE_SET_REVISION_MISMATCH');
  if (currentRunInputSha !== undefined && closureSet?.currentRunInputSha !== currentRunInputSha) errors.push('QUESTION_CLOSURE_SET_INPUT_SHA_MISMATCH');
  if (closureSet?.productionAuthorized !== false || closureSet?.status !== 'PASS') errors.push('QUESTION_QUALITY_PRODUCTION_AUTHORITY_FORBIDDEN');
  let expected = [];
  try { expected = questionUids ? uidSet(questionUids) : uidSet(closureSet?.questionUids || []); } catch { errors.push('QUESTION_CLOSURE_SET_UID_SET_INVALID'); }
  const actual = (closureSet?.closures || []).map(closure => closure.questionUid);
  let normalizedActual = [];
  try { normalizedActual = uidSet(actual); } catch { errors.push('QUESTION_CLOSURE_SET_DUPLICATE_UID'); }
  if (canonicalJson(normalizedActual) !== canonicalJson(expected)) errors.push('QUESTION_CLOSURE_SET_UID_COVERAGE_MISMATCH');
  for (const closure of closureSet?.closures || []) {
    if (closure.schemaVersion !== QUESTION_QUALITY_CLOSURE_VERSION || closure.status !== 'PASS' || closure.currentRunInputSha !== closureSet.currentRunInputSha || closure.productionAuthorized === true) errors.push(`QUESTION_CLOSURE_INVALID:${closure.questionUid}`);
    const requiredAxes = requiredAxesByUid?.[closure.questionUid] || normalizeAxes(closure.requiredAxes);
    if (canonicalJson(closure.requiredAxes) !== canonicalJson(requiredAxes)) errors.push(`QUESTION_CLOSURE_REQUIRED_AXIS_PARITY:${closure.questionUid}`);
    const { closureSha, errors: ignoredErrors, ...closurePayload } = closure;
    if (closureSha !== objectSha(closurePayload)) errors.push(`QUESTION_CLOSURE_SHA:${closure.questionUid}`);
    if (!requiredAxes.length) errors.push(`QUESTION_CLOSURE_AXES_MISSING:${closure.questionUid}`);
    for (const axis of requiredAxes) {
      const entry = closure.axes?.[axis] || closure.axes?.[axis.toLowerCase()];
      if (!isObject(entry) || !['FRESH', 'REUSED', 'MACHINE_CURRENT'].includes(entry.mode) || entry.status !== 'PASS') errors.push(`QUESTION_CLOSURE_AXIS_INVALID:${closure.questionUid}:${axis}`);
      for (const field of ['evidenceSha', 'axisInputSha']) if (!HASH_PATTERN.test(entry?.[field] || '')) errors.push(`QUESTION_CLOSURE_BINDING_MISSING:${axis}:${field}`);
      if (!nonempty(entry?.evidenceId) || entry?.questionUid !== closure.questionUid || entry?.axis !== axis || (entry?.mode === 'REUSED' ? !HASH_PATTERN.test(entry.receiptSha || '') : entry?.receiptSha !== null)) errors.push(`QUESTION_CLOSURE_IDENTITY_PARITY:${axis}`);
      if (freshness) {
        const rows = freshness.filter(row => row.questionUid === closure.questionUid && row.axis === axis);
        const fields = ['questionUid', 'axis', 'mode', 'evidenceId', 'evidenceSha', 'receiptSha', 'axisInputSha', 'status'];
        if (rows.length !== 1 || fields.some(field => entry?.[field] !== rows[0][field])) errors.push(`QUESTION_CLOSURE_AUDIT_PARITY:${closure.questionUid}:${axis}`);
      }
      const calibrationAxes = calibrationRequiredAxesByUid?.[closure.questionUid]?.[axis] || calibrationRequiredAxesByUid?.[closure.questionUid]?.[axis.toUpperCase()] || [];
      if (calibrationAxes.length) {
        const checked = validateCalibrationConsumptionBinding(entry?.calibrationConsumption, { expectedIdentity: calibrationIdentity, reviewerPhase: axis === 'RENDER_REVIEW' ? 'RENDER_REVIEW' : axis === 'V2' ? 'U2' : 'U3', requiredAxes: calibrationAxes, requirePass: true, anchorCatalog: calibrationAnchorCatalog, requiredComparisonChecks: comparisonChecks(axis, calibrationAxes) });
        errors.push(...checked.errors.map(error => `${closure.questionUid}:${axis}:${error}`));
        if (entry?.calibrationRequired !== true) errors.push(`QUESTION_CLOSURE_CALIBRATION_REQUIRED_FLAG:${closure.questionUid}:${axis}`);
      }
    }
    for (const axis of Object.keys(closure.axes || {})) if (!requiredAxes.includes(axis.toUpperCase())) errors.push(`QUESTION_CLOSURE_AXIS_EXTRA:${closure.questionUid}:${axis}`);
  }
  const { closureSetSha: _closureSetSha, errors: _errors, ...closureSetPayload } = closureSet || {};
  if (!expected.length || closureSet?.questionUidSetSha !== objectSha(expected) || canonicalJson(closureSet?.questionUids || []) !== canonicalJson(expected) || _closureSetSha !== objectSha(closureSetPayload)) errors.push('QUESTION_CLOSURE_SET_HASH_OR_SCOPE_MISMATCH');
  return { status: errors.length ? 'BLOCKED' : 'PASS', errors, closureSetSha: errors.length ? null : objectSha(closureSetPayload) };
}

export function buildClosureFromEvidence({ question, requiredAxes, evidenceByAxis, evidenceRefsByAxis = {}, currentRunInputSha, axisInputShas, receiptsByAxis = {}, dependencies = {}, calibrationIdentity = null, calibrationRequiredAxesByAxis = {}, calibrationAnchorCatalog = null }) {
  const axes = {};
  const errors = [];
  for (const axis of normalizeAxes(requiredAxes)) {
    const evidence = evidenceByAxis?.[axis] || evidenceByAxis?.[axis.toLowerCase()];
    const freshness = validateEvidenceFreshness(evidence, { currentRunInputSha, currentAxisInputSha: axisInputShas?.[axis], reuseReceipt: receiptsByAxis?.[axis] || null, reuseContext: { ...dependencies, priorEvidence: evidence } });
    const calibration = evidence?.payload?.calibrationConsumption || evidence?.payload?.calibration?.calibrationConsumption || null;
    axes[axis] = { questionUid: question.questionUid, axis, axisInputSha: axisInputShas?.[axis] || null, status: freshness.status === 'PASS' ? 'PASS' : 'BLOCKED', mode: freshness.mode, evidenceId: evidence?.evidenceId || null, evidenceSha: evidenceRefsByAxis[axis]?.sha256 || null, receiptSha: freshness.receiptSha || null, errors: freshness.errors, ...(calibrationRequiredAxesByAxis?.[axis]?.length ? { calibrationConsumption: calibration, calibrationRequired: true } : {}) };
    if (freshness.status !== 'PASS') errors.push(...freshness.errors.map(error => `${axis}:${error}`));
  }
  return materializeQuestionQualityClosure({ questionUid: question.questionUid, currentRunInputSha, requiredAxes, axes, affected: false, initialErrors: errors, calibrationIdentity, calibrationAnchorCatalog, requiredCalibrationAxesByAxis: calibrationRequiredAxesByAxis });
}
