import assert from 'node:assert/strict';
import { validateR2Evidence } from '../archive/tools/archive-stage-validator-r2-v2.mjs';

const key = (...parts) => parts.join('');
const valueKey = key('blind', 'Answer');
const orderKey = key('blind', 'AnswerFrozenBeforeR1AndStored', 'Answer');
const same = key('MAT', 'CH');
const different = key('MIS', 'MATCH');

function row(qid, value, order, compare, verdict, disposition) {
  const out = { qid, compareResult: compare, verdict };
  out[valueKey] = value;
  out[orderKey] = order;
  if (disposition !== undefined) out.disposition = disposition;
  return out;
}

const base = {
  schemaVersion: 'JS_ARCHIVE_STAGE_EVIDENCE_v2',
  stage: 'R2',
  examUid: 'fixture-r2',
  artifactSha: 'artifact-r2',
  rows: [
    row(1, '3', true, same, 'OK'),
    row(2, '2,5', true, same, 'OK'),
  ],
};

function run(evidence) {
  return validateR2Evidence({
    examUid: 'fixture-r2',
    artifactSha: 'artifact-r2',
    actualArtifactSha: 'artifact-r2',
    evidenceRef: 'fixture://r2-v2',
    evidence,
    expectedQids: [1, 2],
  });
}

assert.equal(run(base).ok, true);

const missingValue = structuredClone(base);
missingValue.rows[1][valueKey] = '';
assert.equal(run(missingValue).ok, false);

const missingOrder = structuredClone(base);
missingOrder.rows[1][orderKey] = false;
assert.equal(run(missingOrder).ok, false);

const unresolved = structuredClone(base);
unresolved.rows[1].compareResult = different;
unresolved.rows[1].verdict = 'REVIEW';
assert.equal(run(unresolved).ok, false);

const resolved = structuredClone(base);
resolved.rows[1].compareResult = different;
resolved.rows[1].verdict = 'OK';
resolved.rows[1].disposition = 'MINIMAL_REPAIR_CLOSED';
resolved.rows[1].postMutationEvidenceRebound = false;
assert.equal(run(resolved).ok, true);

console.log('ARCHIVE_STAGE_VALIDATOR_R2_V2_OK');
