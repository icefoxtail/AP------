// Reuse an issued native semantic approval only with its independently reviewed
// current renderer proof. This adapter never creates an approval or changes data.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { REASSESSED_STUDENT_FIELDS, validateReviewedSourceReassessment } from './reviewed-source-reassessment.mjs';
import { REVIEWED_META_VALUE_FIELDS } from './reviewed-meta-value-fields.mjs';
import { reviewedRendererBindingPath, buildReviewedRendererBinding } from './reviewed-current-renderer-continuity.mjs';
import { REVIEWED_RPM_FIELDS } from './reviewed-rpm-provenance.mjs';

const fail = message => { throw Error(`native reviewed renderer reuse: ${message}`); };
const SHA256 = /^[a-f0-9]{64}$/;
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const stable = value => JSON.stringify(value, (_, v) => v && typeof v === 'object' && !Array.isArray(v)
  ? Object.fromEntries(Object.keys(v).sort().map(k => [k, v[k]])) : v);
const equal = (a, b) => stable(a ?? null) === stable(b ?? null);
const payload = q => Object.fromEntries(REASSESSED_STUDENT_FIELDS.map(k => [k, q?.[k] ?? null]));
const fullFp = q => sha(JSON.stringify({content:q.content??null,choices:Array.isArray(q.choices)?q.choices:null,answer:q.answer??null,solution:q.solution??null,image:q.image??null}));
const bodyFp = q => sha(JSON.stringify({content:q.content??null,choices:Array.isArray(q.choices)?q.choices:null,image:q.image??null}));
const caches = new Map();
const supportedFields = new Set(REVIEWED_META_VALUE_FIELDS);

function safePath(root, relative) {
  if (typeof relative !== 'string' || !relative || path.isAbsolute(relative) || relative.includes('\\') ||
      /[\x00-\x1f]/.test(relative) || relative.split('/').some(p => !p || p === '.' || p === '..')) fail('unsafe evidence path');
  const full = path.resolve(root, relative);
  for (let p = full; p !== path.resolve(root); p = path.dirname(p))
    if (fs.existsSync(p) && fs.lstatSync(p).isSymbolicLink()) fail('symlink evidence path');
  return full;
}

function claimedRows(receipt, root, identity, ordinal, cache) {
  const claims = [];
  for (const ref of receipt.approval.evidenceRefs || []) {
    if (!SHA256.test(ref.sha256 || '')) fail('SHA-bound approval evidence required');
    const bytes = fs.readFileSync(safePath(root, ref.path));
    if (sha(bytes) !== ref.sha256) fail('current evidence bytes changed');
    const key = `renderer-reuse-claim:${ref.sha256}`;
    if (!cache.has(key)) {
      let doc; try { doc = JSON.parse(bytes); } catch { doc = null; }
      cache.set(key, doc);
    }
    const doc = cache.get(key);
    if (doc?.sourceArchiveFile !== receipt.sourceArchiveFile || !Array.isArray(doc.items)) continue;
    const selected = doc.items.filter(r => r.questionUid === identity.questionUid);
    const dedicated = doc.schemaVersion === 'archive-reviewed-renderer-continuity-evidence-v1' ||
      doc.scope === 'NATIVE_SEMANTIC_REUSE_WITH_INDEPENDENT_CURRENT_RENDERER';
    const structural = selected.some(r => r.nativeReviewRef && r.prefigureSourceRef && r.currentSourceRef && r.independentReviewRef);
    if (!dedicated && !structural) continue;
    if (!selected.length) continue;
    if (selected.length !== 1 || selected[0].sourceOrdinal !== ordinal) fail('ambiguous renderer evidence UID/ordinal');
    claims.push(ref);
  }
  return claims;
}

function verifyRendererBinding(receipt, root, bindingPath) {
  const bytes = fs.readFileSync(safePath(root, bindingPath));
  const digests = (receipt.outputDigests || []).filter(r => r.path === bindingPath);
  if (digests.length !== 1 || digests[0].sha256 !== sha(bytes)) fail('renderer binding output digest missing or changed');
  let doc; try { doc = JSON.parse(bytes); } catch { fail('invalid renderer binding JSON'); }
  const expected = buildReviewedRendererBinding(receipt), records = expected.records;
  if (!equal(doc, expected)) fail('renderer binding differs from the exact native receipt');
  for (const selected of records) for (const rows of [receipt.appliedRecords, receipt.runtimeRecords]) {
    const bound = rows?.filter(r => r.questionUid === selected.questionUid);
    if (bound?.length !== 1 || bound[0].sourceOrdinal !== selected.sourceOrdinal ||
        !bound[0].approvalEvidence?.includes(bindingPath)) fail('renderer binding is missing from registered metadata/runtime provenance');
  }
}

// null preserves the old receipt contracts. A claimed compound review must be
// revalidated even after the pending cursor catches up to the current question.
export function nativeReviewedRendererRebind(receipt, nativeSource, previous, question, identity, ordinal, current, registry) {
  const root = fs.realpathSync(nativeSource.root);
  if (!caches.has(root)) caches.set(root, new Map());
  const cache = caches.get(root), claims = claimedRows(receipt, root, identity, ordinal, cache);
  const bindingPath = reviewedRendererBindingPath(receipt.requestId);
  const registeredBinding = current.approvalEvidence?.includes(bindingPath);
  const selected = (receipt.fingerprintRepairs || []).filter(r => r.questionUid === identity.questionUid);
  const candidates = selected.filter(r => r.sourceReview?.rendererContinuity !== undefined);
  if (!candidates.length) {
    if (claims.length || registeredBinding) fail('claimed renderer continuity is missing its selected proof');
    return null;
  }
  if (selected.length !== 1 || candidates.length !== 1) fail('ambiguous selected renderer repair');
  if (!registeredBinding) fail('renderer continuity is missing its registered provenance binding');
  verifyRendererBinding(receipt, root, bindingPath);
  const repair = candidates[0], proof = repair.sourceReview, renderer = proof.rendererContinuity;
  if (receipt.scope !== 'PARTIAL_UIDS' || receipt.approval.type !== 'FINAL_QA' || receipt.registrationMode ||
      receipt.approval.sourceRebind || repair.rebind !== undefined ||
      receipt.expectedQuestionCount !== nativeSource.bank.length ||
      repair.sourceOrdinal !== ordinal || proof.questionUid !== identity.questionUid || proof.sourceOrdinal !== ordinal ||
      proof.schemaVersion !== 'archive-reviewed-source-reassessment-v1' ||
      !['m3-s2-complete-semantic-review-v1', 'm2-s2-meta-review-v1'].includes(proof.nativeSchemaVersion) ||
      proof.scope !== 'METADATA_SOURCE_BINDING_ONLY' || proof.newMathematicalQa !== false || proof.proposalFinalization !== undefined ||
      renderer?.schemaVersion !== 'archive-reviewed-current-renderer-continuity-v1' ||
      renderer.scope !== 'NATIVE_SEMANTIC_REUSE_WITH_INDEPENDENT_CURRENT_RENDERER' ||
      renderer.questionUid !== identity.questionUid || renderer.sourceOrdinal !== ordinal ||
      renderer.newMathematicalQa !== false || renderer.newMetadataApprovals !== 0 || renderer.newDifficultyJudgments !== 0 ||
      !claims.some(ref => equal(ref, renderer.reviewRef))) fail('exclusive selected native renderer scope mismatch');
  if (!repair.metadataBefore || !repair.identityBefore ||
      !Object.hasOwn(repair.metadataBefore, 'sourceFingerprint') || !Object.hasOwn(repair.metadataBefore, 'contentFingerprint') ||
      ![repair.metadataBefore.sourceFingerprint, repair.metadataBefore.contentFingerprint].every(v => v === null || SHA256.test(v || '')) ||
      !SHA256.test(repair.identityBefore.sourceFingerprint || '') ||
      !equal(repair.after, {sourceFingerprint:fullFp(question), contentFingerprint:bodyFp(question)}))
    fail('exact source fingerprint repair required');

  // An old metadata/identity fingerprint need not be the prefigure fingerprint.
  // Re-run the original native decision and renderer witness against the exact
  // registered current values; no stale fingerprint is treated as a new review.
  const canonical = registry ? {pt:registry.problemTypes, tpl:registry.templates} : undefined;
  const replayAfter = { ...repair.after };
  const registeredRationale = proof.rationaleBindings?.primaryMethod?.origin === 'REGISTERED_NATIVE_DECISIVE_STEP_UNCHANGED';
  for (const [bindings, allowed] of [[proof.rationaleBindings, ['primaryMethod', 'decisiveStep']],
    [proof.rpmBindings, REVIEWED_RPM_FIELDS]]) {
    for (const field of Object.keys(bindings || {})) {
      if (!allowed.includes(field) || !Object.hasOwn(current, field)) fail('unsupported native value binding');
      // This issued provenance comes from a fingerprint-only request. Reinjecting
      // unchanged values would change that request's meaning and its exact proof.
      // The official reassessment below still verifies every source-carried value.
      if (!registeredRationale) replayAfter[field] = current[field];
    }
  }
  const reproduced = validateReviewedSourceReassessment({root,
    request:{scope:receipt.scope, approval:receipt.approval, sourceArchiveFile:receipt.sourceArchiveFile,
      expectedQuestionCount:receipt.expectedQuestionCount},
    patch:{questionUid:identity.questionUid, sourceOrdinal:ordinal, after:replayAfter,
      sourceReview:{schemaVersion:proof.schemaVersion, reviewCommit:proof.reviewCommit, reviewPath:proof.reviewPath,
        reviewRef:proof.reviewRef, rendererProof:{schemaVersion:renderer.schemaVersion,
          reviewCommit:renderer.reviewCommit, reviewRef:renderer.reviewRef}}, evidenceRefs:receipt.approval.evidenceRefs},
    metadata:{...current,...repair.metadataBefore}, question, final:current,
    canonicalBefore:canonical, canonicalAfter:canonical, supportedFields, cache});
  if (!equal(reproduced, proof)) fail('native renderer reassessment proof differs');
  const priorPayloadSha = sha(stable(payload(previous)));
  const allowedPrevious = [renderer.nativeStudentPayloadSha256, renderer.currentStudentPayloadSha256];
  const correctionInput = reproduced.rendererContinuity.independentlyReviewedCorrectionInput;
  if (correctionInput !== undefined) {
    if (correctionInput.schemaVersion !== 'archive-inspected-renderer-correction-input-v1' ||
        correctionInput.scope !== 'CORRECTION_INPUT_ONLY' || !SHA256.test(correctionInput.studentPayloadSha256 || ''))
      fail('unsupported independently inspected correction input');
    allowedPrevious.push(correctionInput.studentPayloadSha256);
  }
  const priorRenderer = reproduced.rendererContinuity.prefigureRendererWitness;
  if (priorRenderer !== undefined) {
    if (priorRenderer.schemaVersion !== 'archive-independent-prior-solution-renderer-review-v1' ||
        priorRenderer.scope !== 'EXACT_PREEXISTING_SOLUTION_RENDERER_ADDITION' ||
        !equal(priorRenderer.prefigureSourceRef, renderer.prefigureSourceRef) ||
        !SHA256.test(priorRenderer.studentPayloadSha256 || '')) fail('unsupported independently inspected prior renderer');
    allowedPrevious.push(priorRenderer.studentPayloadSha256);
  }
  if (!allowedPrevious.includes(priorPayloadSha))
    fail('previous student payload is not an immutable native, current or independently inspected correction input');
  return true;
}
