import {canonicalJson, objectSha, bytesSha, fileRef, readBoundFile, isObject} from '../../pipeline-core/canonical.mjs';
import {parseQuestionUidV2} from '../../pipeline-core/question-uid.mjs';

export const WIRE_VERSION = 'APMATH_VISUAL_WIRE_v1';
const integer = /^(0|-?[1-9][0-9]*)$/;
export function validateScalar(v, depth = 0) {
  if (depth > 24 || !isObject(v)) throw Error('INVALID_EXACT_SCALAR');
  const keys = Object.keys(v).sort().join(',');
  if (v.kind === 'integer' && keys === 'kind,value' && integer.test(v.value) && v.value.length <= 256) return v;
  if (v.kind === 'rational' && keys === 'denominator,kind,numerator' && integer.test(v.numerator) && /^[1-9][0-9]*$/.test(v.denominator) && v.numerator.length <= 256 && v.denominator.length <= 256) return v;
  if (v.kind === 'constant' && keys === 'kind,name' && ['pi','e'].includes(v.name)) return v;
  const arities = {add:2, sub:2, mul:2, div:2, pow:2, sqrt:1, neg:1};
  if (keys === 'args,kind,op' && v.kind === 'expression' && Array.isArray(v.args) && v.args.length === arities[v.op]) {
    v.args.forEach(a => validateScalar(a, depth + 1)); return v;
  }
  throw Error('INVALID_EXACT_SCALAR');
}
export function freezeWire(payload) {
  function keys(value){
    if(Array.isArray(value))value.forEach(keys);
    else if(isObject(value))for(const [key,child] of Object.entries(value)){if(key!==key.normalize('NFC'))throw Error('WIRE_KEY_MUST_BE_NFC');keys(child);}
  }
  keys(payload);
  const blob = canonicalJson(payload);
  return {wireVersion:WIRE_VERSION, canonicalBlob:blob, objectSha256:bytesSha(Buffer.from(blob))};
}
export function validateResponse(value, requestHash) {
  if (value?.wireVersion !== WIRE_VERSION || value.inputObjectSha256 !== requestHash || !['OK','UNSUPPORTED','ERROR'].includes(value.status)) throw Error('INVALID_WORKER_RESPONSE');
  canonicalJson(value);
  return value;
}
export function assetIdentity(questionUid, surface, visualRole = 'decisive-relation') {
  parseQuestionUidV2(questionUid);
  if (!['SOLUTION_VISUAL','PROBLEM_VISUAL'].includes(surface) || !/^[a-z][a-z0-9-]{0,63}$/.test(visualRole)) throw Error('INVALID_VISUAL_IDENTITY');
  const visualAssetKey = objectSha({questionUid,surface,visualRole});
  const assetId = 'va-' + objectSha({questionUid,surface,visualAssetKey}).slice(7);
  return {questionUid,surface,visualRole,visualAssetKey,assetId};
}
export function planHash(plan) {
  const {planSha256, ...payload} = plan;
  const computed = objectSha(payload);
  if (planSha256 && planSha256 !== computed) throw Error('STALE_PLAN_HASH');
  return computed;
}
export function validateFrozenPlan(plan) {
  const allowed=['schemaVersion','questionUid','visualAssetKey','sourceRef','solutionRef','mathPlan','graphPlan','labels','displayEnvelope','planSha256'];
  if(plan?.schemaVersion!=='VISUAL_SPIKE_PLAN_v1'||Object.keys(plan).some(k=>!allowed.includes(k))||Boolean(plan.mathPlan)===Boolean(plan.graphPlan))throw Error('INVALID_FROZEN_PLAN');
  if(!plan.sourceRef||!plan.solutionRef)throw Error('PLAN_SOURCE_REFS_REQUIRED');
  return planHash(plan);
}
export function stageKey(stage, projection, fingerprint) {
  return objectSha({schemaVersion:WIRE_VERSION,stage,projection,fingerprint});
}
export function capabilityFingerprint(root, {capability, implementationPaths, observerPaths, dependencyLock, policy}) {
  if (!implementationPaths?.length || !observerPaths?.length || !dependencyLock || !policy) throw Error('INCOMPLETE_FINGERPRINT');
  const refs = paths => [...new Set(paths)].sort().map(p => fileRef(root,p));
  return objectSha({capability,implementation:refs(implementationPaths),observers:refs(observerPaths),dependencyLock,policy,wireVersion:WIRE_VERSION});
}
export const CAPABILITIES = Object.freeze({
  'construction-spike-v1': {status:'EXPERIMENTAL',requiredAudits:['SOURCE_CONDITIONS','CINDY_RECONSTRUCTION','SVG_PRIMITIVES','TYPOGRAPHY','RENDERED_LAYOUT','ACTUAL_ARCHIVE','INDEPENDENT_VISUAL_REVIEW']},
  'polynomial-spike-v1': {status:'EXPERIMENTAL',requiredAudits:['SOURCE_CONDITIONS','GRAPH_INTERIOR_BOUND','GRAPH_TOPOLOGY','TYPOGRAPHY','RENDERED_LAYOUT','ACTUAL_ARCHIVE','INDEPENDENT_VISUAL_REVIEW']},
});
export function reduceResult(capability, evidence) {
  const descriptor = CAPABILITIES[capability];
  if (!descriptor) return {status:'UNSUPPORTED_CAPABILITY',productionAuthorized:false};
  const missing = descriptor.requiredAudits.filter(axis => evidence[axis]?.status !== 'PASS');
  return {status:missing.length?'REVIEW_REQUIRED':'READY_FOR_INDEPENDENT_REVIEW',missing,productionAuthorized:false};
}
// Legacy hashes retain their versioned semantics: never prefix them as objectSha.
export function bindLegacy(root, ref, {algorithm, expectedHex, compute}) {
  if (algorithm !== 'GE_PYTHON_CANONICAL_v1' || !/^[0-9a-f]{64}$/.test(expectedHex) || typeof compute !== 'function') throw Error('INVALID_LEGACY_ADAPTER');
  const raw = readBoundFile(root,ref);
  if (compute(raw) !== expectedHex) throw Error('STALE_LEGACY_HASH');
  return {boundFile:ref,legacy:{algorithm,hex:expectedHex}};
}
