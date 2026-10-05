import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  gitBlobSha,
  validateStageEvidence,
} from '../archive/tools/archive-stage-validator.mjs';
import {
  buildStageState,
  consumeValidationPass,
} from '../archive/tools/archive-stage-runtime-v2.mjs';

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'archive-v2-routing-'));
const examFile = path.join(tmp, 'fixture-exam.js');
const examSource = 'window.questionBank = [{ "id": 1 }];\n';
fs.writeFileSync(examFile, examSource);
const artifactSha = gitBlobSha(Buffer.from(examSource));
const examUid = 'fixture-v2-routing';

function validate(stage, evidence) {
  const evidenceFile = path.join(tmp, stage.toLowerCase() + '.json');
  fs.writeFileSync(evidenceFile, JSON.stringify(evidence));
  return validateStageEvidence({ examFile, evidenceFile, stage });
}

try {
  const create = validate('CREATE', {
    schemaVersion: 'JS_ARCHIVE_STAGE_EVIDENCE_v2',
    stage: 'CREATE',
    examUid,
    artifactSha,
    rows: [{
      qid: 1,
      sourceMode: 'ORIGINAL',
      axisEvidence: {
        questionLayout: 'bound',
        solutionLayout: 'bound',
        meta: 'bound',
        visualSvg: 'bound',
      },
      provenanceEvidence: { sourceParity: 'bound' },
    }],
  });
  assert.equal(create.ok, true, JSON.stringify(create));
  assert.equal(create.validatorMode, 'CREATE_V2');
  assert.equal('nextStage' in create, false);
  assert.equal('nextStageEligible' in create, false);

  const r1 = validate('R1', {
    schemaVersion: 'JS_ARCHIVE_STAGE_EVIDENCE_v2',
    stage: 'R1',
    examUid,
    artifactSha,
    rows: [{
      qid: 1,
      independentAnswer: '3',
      independentAnswerFrozenBeforeStoredAnswer: true,
      storedAnswer: '3',
      compareResult: 'MATCH',
      verdict: 'PASS',
    }],
  });
  assert.equal(r1.ok, true, JSON.stringify(r1));
  assert.equal(r1.validatorMode, 'R1_V2');

  const r2 = validate('R2', {
    schemaVersion: 'JS_ARCHIVE_STAGE_EVIDENCE_v2',
    stage: 'R2',
    examUid,
    artifactSha,
    rows: [{
      qid: 1,
      blindAnswer: '3',
      blindAnswerFrozenBeforeR1AndStoredAnswer: true,
      compareResult: 'MATCH',
      verdict: 'PASS',
    }],
  });
  assert.equal(r2.ok, true, JSON.stringify(r2));
  assert.equal(r2.validatorMode, 'R2_V2');

  const r3 = validate('R3', {
    schemaVersion: 'JS_ARCHIVE_STAGE_EVIDENCE_v2',
    stage: 'R3',
    examUid,
    artifactSha,
    targetedScope: {
      openFindingQids: [],
      changedQids: [],
      directDependencyQids: [],
    },
    rows: [],
    lockedScopeIntegrity: true,
    releaseIntegrity: true,
  });
  assert.equal(r3.ok, true, JSON.stringify(r3));
  assert.equal(r3.validatorMode, 'R3_V2');

  let closure = consumeValidationPass({
    state: buildStageState({ stage: 'CREATE', workComplete: true, closurePending: true }),
    validationReport: create,
  });
  assert.deepEqual(closure.state, { stage: 'R1', workComplete: false, closurePending: false });
  assert.equal(closure.nextStageEligible, true);
  assert.equal(closure.receipt.completedStage, 'CREATE');
  assert.equal(closure.receipt.nextStage, 'R1');

  closure = consumeValidationPass({
    state: buildStageState({ stage: 'R1', workComplete: true, closurePending: false }),
    validationReport: r1,
  });
  assert.equal(closure.state.stage, 'R2');

  closure = consumeValidationPass({
    state: buildStageState({ stage: 'R2', workComplete: true, closurePending: false }),
    validationReport: r2,
  });
  assert.equal(closure.state.stage, 'R3');

  closure = consumeValidationPass({
    state: buildStageState({ stage: 'R3', workComplete: true, closurePending: false }),
    validationReport: r3,
  });
  assert.deepEqual(closure.state, { stage: 'MAIN', workComplete: false, closurePending: false });

  assert.throws(() => consumeValidationPass({
    state: buildStageState({ stage: 'CREATE', workComplete: true, closurePending: false }),
    validationReport: { ...create, validatorMode: 'FULL' },
  }), /CLOSURE_V2_VALIDATOR_REQUIRED/);

  assert.throws(() => consumeValidationPass({
    state: buildStageState({ stage: 'CREATE', workComplete: true, closurePending: false }),
    validationReport: { ...create, ok: false, disposition: 'FAIL' },
  }), /CLOSURE_VALIDATION_PASS_REQUIRED/);

  console.log('ARCHIVE_STAGE_VALIDATOR_V2_ROUTING_PASS');
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}
