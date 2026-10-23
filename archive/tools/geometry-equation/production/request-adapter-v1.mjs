import {objectSha, HASH_PATTERN, nonempty} from '../../pipeline-core/canonical.mjs';
import {assetIdentity, CAPABILITIES} from './contracts.mjs';
import {runFrozen} from './run.mjs';
import {types as utilTypes} from 'node:util';

export const REQUEST_ADAPTER_VERSION = 'APMATH_VISUAL_REQUEST_ADAPTER_v1';
const REQUIRED_FIELDS = ['questionUid', 'surface', 'mode', 'capability', 'frozenPlanRef', 'sourceRef', 'solutionRef'];
const OPTIONAL_FIELDS = ['visualRole', 'runId', 'replayResultRef'];
const ENVELOPE_FIELDS = ['schemaVersion', 'request', 'requestSha256'];

function fail(code) { throw new Error(code); }

// Reject JavaScript-only object features before hashing so getters, cycles,
// sparse arrays, symbols, and custom prototypes cannot be observed or folded
// into a JSON snapshot implicitly.
function assertJsonData(value, path = '$', ancestors = new Set()) {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return;
  if (typeof value === 'number') {
    if (!Number.isFinite(value) || Math.abs(value) > Number.MAX_SAFE_INTEGER) objectSha(value);
    return;
  }
  if (typeof value !== 'object') objectSha(value);
  // util.types.isProxy does not invoke proxy traps. Reject before reflection,
  // validation, hashing, or snapshotting can observe inconsistent values.
  if (utilTypes.isProxy(value)) fail(`NON_JSON_VALUE:${path}:PROXY`);
  if (ancestors.has(value)) fail(`NON_JSON_VALUE:${path}`);
  ancestors.add(value);
  if (Array.isArray(value)) {
    if (Object.getPrototypeOf(value) !== Array.prototype || Object.getOwnPropertySymbols(value).length) fail(`NON_JSON_VALUE:${path}`);
    const names = Object.getOwnPropertyNames(value);
    if (names.length !== value.length + 1 || !names.includes('length')) fail(`NON_JSON_VALUE:${path}`);
    for (let i = 0; i < value.length; i++) {
      const descriptor = Object.getOwnPropertyDescriptor(value, String(i));
      if (!descriptor || !descriptor.enumerable || !Object.hasOwn(descriptor, 'value')) fail(`NON_JSON_VALUE:${path}[${i}]`);
      assertJsonData(descriptor.value, `${path}[${i}]`, ancestors);
    }
  } else {
    if (Object.getPrototypeOf(value) !== Object.prototype || Object.getOwnPropertySymbols(value).length) fail(`NON_JSON_VALUE:${path}`);
    for (const key of Object.getOwnPropertyNames(value)) {
      const descriptor = Object.getOwnPropertyDescriptor(value, key);
      if (!descriptor.enumerable || !Object.hasOwn(descriptor, 'value')) fail(`NON_JSON_VALUE:${path}.${key}`);
      assertJsonData(descriptor.value, `${path}.${key}`, ancestors);
    }
  }
  ancestors.delete(value);
}

function snapshot(value) {
  if (value === null || typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map(snapshot);
  const copy = {};
  for (const key of Object.keys(value)) copy[key] = snapshot(value[key]);
  return copy;
}

function exactRecord(value, fields, code) {
  if (value === null || typeof value !== 'object' || Array.isArray(value) || Object.getPrototypeOf(value) !== Object.prototype) fail(code);
  const keys = Object.keys(value);
  if (Object.getOwnPropertySymbols(value).length || keys.length !== fields.length || fields.some(key => !Object.hasOwn(value, key)) || keys.some(key => !fields.includes(key))) fail(code);
}

function validateFileRef(ref, field) {
  exactRecord(ref, ['path', 'bytes', 'sha256'], `INVALID_FILE_REF:${field}`);
  if (!nonempty(ref.path) || !Number.isSafeInteger(ref.bytes) || ref.bytes < 0 || typeof ref.sha256 !== 'string' || !HASH_PATTERN.test(ref.sha256)) fail(`INVALID_FILE_REF:${field}`);
}

function validateRequest(request) {
  assertJsonData(request);
  if (request === null || typeof request !== 'object' || Array.isArray(request) || Object.getPrototypeOf(request) !== Object.prototype) fail('INVALID_REQUEST');
  const keys = Object.keys(request);
  for (const field of REQUIRED_FIELDS) if (!Object.hasOwn(request, field)) fail(`REQUEST_FIELD_MISSING:${field}`);
  for (const field of keys) if (![...REQUIRED_FIELDS, ...OPTIONAL_FIELDS].includes(field)) fail(`UNKNOWN_REQUEST_FIELD:${field}`);
  for (const field of ['frozenPlanRef', 'sourceRef', 'solutionRef']) validateFileRef(request[field], field);
  if (Object.hasOwn(request, 'replayResultRef') && request.replayResultRef !== null) validateFileRef(request.replayResultRef, 'replayResultRef');
  if (Object.hasOwn(request, 'runId') && request.runId !== null && (typeof request.runId !== 'string' || !nonempty(request.runId))) fail('INVALID_RUN_ID');
  if (Object.hasOwn(request, 'visualRole') && typeof request.visualRole !== 'string') fail('INVALID_VISUAL_ROLE');
  if (request.mode !== 'PHASE0_2_EXPERIMENT') fail('ONLY_PHASE0_2_EXPERIMENT_SUPPORTED');
  assetIdentity(request.questionUid, request.surface, request.visualRole);
  if (typeof request.capability !== 'string' || !Object.hasOwn(CAPABILITIES, request.capability)) fail('UNSUPPORTED_CAPABILITY');
  return request;
}

export function createFrozenVisualRequest(request) {
  validateRequest(request);
  const detached = snapshot(request);
  return {schemaVersion: REQUEST_ADAPTER_VERSION, request: detached, requestSha256: objectSha(detached)};
}

export function unwrapFrozenVisualRequest(envelope) {
  assertJsonData(envelope);
  if (envelope === null || typeof envelope !== 'object' || Array.isArray(envelope) || Object.getPrototypeOf(envelope) !== Object.prototype) fail('INVALID_ENVELOPE');
  const keys = Object.keys(envelope);
  if (Object.getOwnPropertySymbols(envelope).length || keys.length !== ENVELOPE_FIELDS.length || keys.some(key => !ENVELOPE_FIELDS.includes(key)) || ENVELOPE_FIELDS.some(key => !Object.hasOwn(envelope, key))) fail('INVALID_ENVELOPE_KEYS');
  if (envelope.schemaVersion !== REQUEST_ADAPTER_VERSION) fail('INVALID_ENVELOPE_VERSION');
  if (typeof envelope.requestSha256 !== 'string' || !HASH_PATTERN.test(envelope.requestSha256)) fail('INVALID_REQUEST_DIGEST');
  validateRequest(envelope.request);
  if (objectSha(envelope.request) !== envelope.requestSha256) fail('REQUEST_DIGEST_MISMATCH');
  return snapshot(envelope.request);
}

export async function runFrozenVisualRequest(root, envelope) {
  return runFrozen(root, unwrapFrozenVisualRequest(envelope));
}
