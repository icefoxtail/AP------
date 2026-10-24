import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {createFrozenVisualRequest, unwrapFrozenVisualRequest, runFrozenVisualRequest, REQUEST_ADAPTER_VERSION} from '../production/request-adapter-v1.mjs';
import {repoRoot} from '../production/run.mjs';
import {assetIdentity, planHash} from '../production/contracts.mjs';
import {commitStage, withWorkRoot} from '../production/store.mjs';
import {objectSha, canonicalJson, readBoundFile} from '../../pipeline-core/canonical.mjs';

function validRequest() {
  const identity = assetIdentity('adapter-fixture-' + crypto.randomUUID() + '|1', 'SOLUTION_VISUAL');
  return {
    questionUid: identity.questionUid,
    surface: identity.surface,
    mode: 'PHASE0_2_EXPERIMENT',
    capability: 'construction-spike-v1',
    frozenPlanRef: {path: 'plan.json', bytes: 8, sha256: 'sha256:' + 'a'.repeat(64)},
    sourceRef: {path: 'source.txt', bytes: 6, sha256: 'sha256:' + 'b'.repeat(64)},
    solutionRef: {path: 'solution.txt', bytes: 9, sha256: 'sha256:' + 'c'.repeat(64)},
  };
}

function bootstrapSyntheticRun({staleSource = false} = {}) {
  const identity = assetIdentity('adapter-run-' + crypto.randomUUID() + '|1', 'SOLUTION_VISUAL');
  const examUid = identity.questionUid.split('|')[0];
  const workRoot = `.tmp/archive/test-${crypto.randomUUID()}/${examUid}/visual-engine/production`;
  const graph = {schemaVersion: 'construction-spike-v1', nodes: [
    {id: 'A', op: 'SOURCE_POINT', inputs: [], args: {coordinates: [{kind: 'integer', value: '0'}, {kind: 'integer', value: '0'}]}, outputType: 'POINT', factRole: 'GIVEN'},
    {id: 'B', op: 'SOURCE_POINT', inputs: [], args: {coordinates: [{kind: 'integer', value: '4'}, {kind: 'integer', value: '0'}]}, outputType: 'POINT', factRole: 'GIVEN'},
    {id: 'M', op: 'MIDPOINT', inputs: ['A', 'B'], args: {}, outputType: 'POINT', factRole: 'DERIVED_INTERMEDIATE'},
  ]};
  return withWorkRoot(workRoot, () => {
    const source = commitStage(repoRoot, {stage: 'INPUT', key: objectSha(identity), provenance: {synthetic: true}, outputs: {'source.txt': 'synthetic primitive inputs', 'solution.txt': 'synthetic verified expectation'}});
    const actualSourceRef = source.outputs.find(ref => ref.path.endsWith('source.txt'));
    const sourceRef = staleSource ? {...actualSourceRef, sha256: 'sha256:' + '0'.repeat(64)} : actualSourceRef;
    const solutionRef = source.outputs.find(ref => ref.path.endsWith('solution.txt'));
    const plan = {schemaVersion: 'VISUAL_SPIKE_PLAN_v1', questionUid: identity.questionUid, visualAssetKey: identity.visualAssetKey, sourceRef, solutionRef, mathPlan: graph, labels: []};
    const frozen = commitStage(repoRoot, {stage: 'PLAN', key: planHash(plan), provenance: {synthetic: true}, outputs: {'plan.json': canonicalJson({...plan, planSha256: planHash(plan)})}});
    return {request: {questionUid: identity.questionUid, surface: identity.surface, mode: 'PHASE0_2_EXPERIMENT', capability: 'construction-spike-v1', sourceRef, solutionRef, frozenPlanRef: frozen.outputs[0]}, plan};
  });
}

test('create and unwrap preserve request data, optional nulls, and objectSha binding', () => {
  const request = {...validRequest(), visualRole: 'decisive-relation', runId: null, replayResultRef: null, payload: undefined};
  delete request.payload;
  request.frozenPlanRef.path = 'plan-원문.json';
  const envelope = createFrozenVisualRequest(request);
  assert.equal(envelope.schemaVersion, REQUEST_ADAPTER_VERSION);
  assert.deepEqual(Object.keys(envelope).sort(), ['request', 'requestSha256', 'schemaVersion']);
  assert.equal(envelope.requestSha256, objectSha(request));
  assert.deepEqual(unwrapFrozenVisualRequest(envelope), request);
  assert.equal(Object.hasOwn(unwrapFrozenVisualRequest(envelope), 'runId'), true);
  assert.equal(unwrapFrozenVisualRequest(envelope).runId, null);
  assert.equal(unwrapFrozenVisualRequest(envelope).replayResultRef, null);
  assert.equal(Object.hasOwn(unwrapFrozenVisualRequest(envelope), 'notPresent'), false);
  const omitted = unwrapFrozenVisualRequest(createFrozenVisualRequest(validRequest()));
  for (const field of ['visualRole', 'runId', 'replayResultRef']) assert.equal(Object.hasOwn(omitted, field), false);
});

test('snapshots detach caller and returned object aliases; changed canonical payload is rejected', () => {
  const request = validRequest();
  const envelope = createFrozenVisualRequest(request);
  request.sourceRef.path = 'mutated-after-create.txt';
  const first = unwrapFrozenVisualRequest(envelope);
  assert.equal(first.sourceRef.path, 'source.txt');
  first.sourceRef.path = 'mutated-after-unwrap.txt';
  assert.equal(unwrapFrozenVisualRequest(envelope).sourceRef.path, 'source.txt');
  const stale = {...envelope, request: {...envelope.request, sourceRef: {...envelope.request.sourceRef, path: 'changed.txt'}}};
  assert.throws(() => unwrapFrozenVisualRequest(stale), /REQUEST_DIGEST_MISMATCH/);
});

test('canonical-equivalent NFC values share digest while delegated snapshot keeps supplied values', () => {
  const composed = validRequest();
  composed.sourceRef.path = 'é.txt';
  const decomposed = {...composed, sourceRef: {...composed.sourceRef, path: 'e\u0301.txt'}};
  decomposed.sourceRef.path = 'e\u0301.txt';
  const a = createFrozenVisualRequest(composed);
  const b = createFrozenVisualRequest(decomposed);
  assert.equal(a.requestSha256, b.requestSha256);
  assert.equal(unwrapFrozenVisualRequest(a).sourceRef.path, 'é.txt');
  assert.equal(unwrapFrozenVisualRequest(b).sourceRef.path, 'e\u0301.txt');
});

test('create and unwrap reject proxies at the request, envelope, and nested reference boundaries', () => {
  const rootRequestProxy = new Proxy(validRequest(), {});
  assert.throws(() => createFrozenVisualRequest(rootRequestProxy), /NON_JSON_VALUE/);

  const nestedRequest = validRequest();
  nestedRequest.sourceRef = new Proxy(nestedRequest.sourceRef, {});
  assert.throws(() => createFrozenVisualRequest(nestedRequest), /NON_JSON_VALUE/);

  const envelopeWithProxyRequest = createFrozenVisualRequest(validRequest());
  envelopeWithProxyRequest.request.solutionRef = new Proxy(envelopeWithProxyRequest.request.solutionRef, {});
  assert.throws(() => unwrapFrozenVisualRequest(envelopeWithProxyRequest), /NON_JSON_VALUE/);

  const changingPathEnvelope = createFrozenVisualRequest(validRequest());
  let pathReads = 0;
  const sourceRef = changingPathEnvelope.request.sourceRef;
  changingPathEnvelope.request.sourceRef = new Proxy(sourceRef, {get(target, key, receiver) {
    if (key === 'path') {
      pathReads++;
      return pathReads >= 3 ? 'changed-after-digest.txt' : target.path;
    }
    return Reflect.get(target, key, receiver);
  }});
  assert.throws(() => unwrapFrozenVisualRequest(changingPathEnvelope), /NON_JSON_VALUE/);
  assert.equal(pathReads, 0);

  const rootEnvelopeProxy = new Proxy(createFrozenVisualRequest(validRequest()), {});
  assert.throws(() => unwrapFrozenVisualRequest(rootEnvelopeProxy), /NON_JSON_VALUE/);
});

test('envelope exact schema, version, digest syntax, and stale digest are enforced', () => {
  const envelope = createFrozenVisualRequest(validRequest());
  assert.throws(() => unwrapFrozenVisualRequest({...envelope, schemaVersion: 'future'}), /INVALID_ENVELOPE_VERSION/);
  assert.throws(() => unwrapFrozenVisualRequest({...envelope, extra: true}), /INVALID_ENVELOPE_KEYS/);
  const missing = {...envelope}; delete missing.request;
  assert.throws(() => unwrapFrozenVisualRequest(missing), /INVALID_ENVELOPE_KEYS/);
  assert.throws(() => unwrapFrozenVisualRequest({...envelope, requestSha256: 'bad'}), /INVALID_REQUEST_DIGEST/);
  assert.throws(() => unwrapFrozenVisualRequest({...envelope, request: {...envelope.request, capability: 'rational-spike-v1'}}), /REQUEST_DIGEST_MISMATCH/);
});

test('request required and optional fields and declared refs receive distinct validation errors', () => {
  const request = validRequest();
  const missing = {...request}; delete missing.solutionRef;
  assert.throws(() => createFrozenVisualRequest(missing), /REQUEST_FIELD_MISSING:solutionRef/);
  assert.throws(() => createFrozenVisualRequest({...request, surprise: true}), /UNKNOWN_REQUEST_FIELD:surprise/);
  assert.throws(() => createFrozenVisualRequest({...request, sourceRef: {...request.sourceRef, bytes: -1}}), /INVALID_FILE_REF:sourceRef/);
  assert.throws(() => createFrozenVisualRequest({...request, solutionRef: {...request.solutionRef, extra: 1}}), /INVALID_FILE_REF:solutionRef/);
  assert.throws(() => createFrozenVisualRequest({...request, runId: ''}), /INVALID_RUN_ID/);
  assert.throws(() => createFrozenVisualRequest({...request, replayResultRef: {path: 'x'}}), /INVALID_FILE_REF:replayResultRef/);
  assert.throws(() => createFrozenVisualRequest({...request, visualRole: null}), /INVALID_VISUAL_ROLE/);
});

test('identity, supported mode and capability failures retain explicit errors', () => {
  const request = validRequest();
  assert.throws(() => createFrozenVisualRequest({...request, questionUid: 'bad'}), /QUESTION_UID_V2_INVALID/);
  assert.throws(() => createFrozenVisualRequest({...request, surface: 'OTHER'}), /INVALID_VISUAL_IDENTITY/);
  assert.throws(() => createFrozenVisualRequest({...request, visualRole: 'Bad Role'}), /INVALID_VISUAL_IDENTITY/);
  assert.throws(() => createFrozenVisualRequest({...request, mode: 'PRODUCTION'}), /ONLY_PHASE0_2_EXPERIMENT_SUPPORTED/);
  assert.throws(() => createFrozenVisualRequest({...request, capability: 'unsupported'}), /UNSUPPORTED_CAPABILITY/);
});

test('existing canonical contract rejects non-JSON exact-value hazards', () => {
  for (const value of [NaN, Infinity, Number.MAX_SAFE_INTEGER + 1, undefined, () => 1, new Date()]) {
    const request = {...validRequest(), extraPayload: value};
    assert.throws(() => createFrozenVisualRequest(request));
  }
  const accessorRequest = validRequest();
  Object.defineProperty(accessorRequest, 'visualRole', {enumerable: true, get() { throw new Error('getter executed'); }});
  assert.throws(() => createFrozenVisualRequest(accessorRequest), /NON_JSON_VALUE/);
});

test('adapter delegates one synthetic frozen request through existing runFrozen and preserves non-authorizing result', async () => {
  const {request} = bootstrapSyntheticRun();
  const envelope = createFrozenVisualRequest(request);
  const receipt = await runFrozenVisualRequest(repoRoot, envelope);
  const result = JSON.parse(readBoundFile(repoRoot, receipt.outputs[0]));
  assert.equal(result.status, 'REVIEW_REQUIRED');
  assert.equal(result.productionAuthorized, false);
  assert.equal(result.evidence.CINDY_RECONSTRUCTION.status, 'PASS');
});

test('well-shaped stale source ref passes adapter structure then fails downstream byte binding', async () => {
  const {request} = bootstrapSyntheticRun({staleSource: true});
  const envelope = createFrozenVisualRequest(request);
  assert.deepEqual(unwrapFrozenVisualRequest(envelope).sourceRef, request.sourceRef);
  await assert.rejects(runFrozenVisualRequest(repoRoot, envelope), /STALE_FILE:/);
});
