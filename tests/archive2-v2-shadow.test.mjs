import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import {
  gitBlobSha,
  validateStageEvidence,
} from '../archive/tools/archive-stage-validator.mjs';
import { rebindPostMutationEvidence } from '../archive/tools/archive-repair-alive-v2.mjs';

const examFile = path.resolve('archive/exams/original/middle/m2/1mid/25_매산중_1학기_중간_중2_기출.js');
const bytes = fs.readFileSync(examFile);
const source = bytes.toString('utf8');
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(source, sandbox, { filename: examFile, timeout: 5000 });
const qids = sandbox.window.questionBank.map(q => Number(q.id));
assert.ok(qids.length > 1);

const artifactSha = gitBlobSha(bytes);
const examUid = 'shadow-real-m2-control';
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'archive-v2-shadow-'));

function validate(stage, evidence) {
  const evidenceFile = path.join(tmp, stage.toLowerCase() + '-' + Math.random().toString(16).slice(2) + '.json');
  fs.writeFileSync(evidenceFile, JSON.stringify(evidence));
  return validateStageEvidence({ examFile, evidenceFile, stage });
}

function createRow(qid, index) {
  if (index === 0) {
    return {
      qid,
      sourceMode: 'ALIVE_REPLACEMENT',
      axisEvidence: {
        questionLayout: 'bound',
        solutionLayout: 'bound',
        meta: { semantic: 'PASS', projection: 'GAP' },
        visualSvg: 'EXEMPT',
      },
      provenanceEvidence: {
        curriculum: 'bound',
        answerCardinality: 'bound',
      },
    };
  }
  return {
    qid,
    sourceMode: 'ORIGINAL',
    axisEvidence: {
      questionLayout: 'bound',
      solutionLayout: 'bound',
      meta: 'bound',
      visualSvg: 'EXEMPT',
    },
    provenanceEvidence: { sourceParity: 'bound' },
  };
}

try {
  const createEvidence = {
    schemaVersion: 'JS_ARCHIVE_STAGE_EVIDENCE_v2',
    stage: 'CREATE',
    examUid,
    artifactSha,
    rows: qids.map(createRow),
  };
  const createPass = validate('CREATE', createEvidence);
  assert.equal(createPass.ok, true, JSON.stringify(createPass));
  assert.equal(createPass.validatorMode, 'CREATE_V2');
  assert.equal('nextStage' in createPass, false);
  assert.equal('nextStageEligible' in createPass, false);

  const wrongArtifact = validate('CREATE', { ...createEvidence, artifactSha: '0000000000000000000000000000000000000000' });
  assert.equal(wrongArtifact.ok, false);
  assert.ok(wrongArtifact.issues.includes('COMMON_ACTUAL_ARTIFACT_SHA_MISMATCH'));

  const duplicate = structuredClone(createEvidence);
  duplicate.rows[duplicate.rows.length - 1] = structuredClone(duplicate.rows[0]);
  const duplicateReport = validate('CREATE', duplicate);
  assert.equal(duplicateReport.ok, false);
  assert.ok(duplicateReport.issues.some(issue => issue.startsWith('COMMON_ROW_QID_DUPLICATE:')));

  const r1Evidence = {
    schemaVersion: 'JS_ARCHIVE_STAGE_EVIDENCE_v2',
    stage: 'R1',
    examUid,
    artifactSha,
    rows: qids.map(qid => ({
      qid,
      independentAnswer: 'shadow-answer',
      independentAnswerFrozenBeforeStoredAnswer: true,
      storedAnswer: 'shadow-answer',
      compareResult: 'MATCH',
      verdict: 'PASS',
    })),
  };
  const r1Pass = validate('R1', r1Evidence);
  assert.equal(r1Pass.ok, true, JSON.stringify(r1Pass));

  const r1FreezeMissing = structuredClone(r1Evidence);
  delete r1FreezeMissing.rows[0].independentAnswerFrozenBeforeStoredAnswer;
  assert.equal(validate('R1', r1FreezeMissing).ok, false);

  const r2Evidence = {
    schemaVersion: 'JS_ARCHIVE_STAGE_EVIDENCE_v2',
    stage: 'R2',
    examUid,
    artifactSha,
    rows: qids.map(qid => ({
      qid,
      blindAnswer: 'shadow-answer',
      blindAnswerFrozenBeforeR1AndStoredAnswer: true,
      compareResult: 'MATCH',
      verdict: 'PASS',
    })),
  };
  const r2Pass = validate('R2', r2Evidence);
  assert.equal(r2Pass.ok, true, JSON.stringify(r2Pass));

  const r2BlindMissing = structuredClone(r2Evidence);
  delete r2BlindMissing.rows[0].blindAnswer;
  assert.equal(validate('R2', r2BlindMissing).ok, false);

  const r2Mismatch = structuredClone(r2Evidence);
  r2Mismatch.rows[0].compareResult = 'MISMATCH';
  r2Mismatch.rows[0].verdict = 'REVIEW';
  delete r2Mismatch.rows[0].disposition;
  assert.equal(validate('R2', r2Mismatch).ok, false);

  const targetQid = qids[0];
  const r3Evidence = {
    schemaVersion: 'JS_ARCHIVE_STAGE_EVIDENCE_v2',
    stage: 'R3',
    examUid,
    artifactSha,
    targetedScope: {
      openFindingQids: [],
      changedQids: [targetQid],
      directDependencyQids: [],
    },
    rows: [{ qid: targetQid, verdict: 'PASS' }],
    lockedScopeIntegrity: true,
    releaseIntegrity: true,
  };
  const r3Pass = validate('R3', r3Evidence);
  assert.equal(r3Pass.ok, true, JSON.stringify(r3Pass));
  assert.equal(r3Pass.scopeCount, 1);
  assert.equal(r3Pass.rowCount, 1);

  const r3Missing = structuredClone(r3Evidence);
  r3Missing.rows = [];
  assert.equal(validate('R3', r3Missing).ok, false);

  const oldEvidence = {
    artifactSha: 'old-artifact',
    rows: qids.slice(0, 2).map(qid => ({ qid, evidenceRef: 'old://' + qid })),
  };
  assert.throws(() => rebindPostMutationEvidence({
    evidence: oldEvidence,
    finalArtifactSha: 'new-artifact',
    changedQids: [qids[0]],
    directDependencyQids: [qids[1]],
    reboundRows: [
      { qid: qids[0], artifactSha: 'old-artifact', evidenceRef: 'new://changed' },
      { qid: qids[1], artifactSha: 'new-artifact', evidenceRef: 'new://dependency' },
    ],
  }), /REBIND_ROW_ARTIFACT_SHA_MISMATCH/);

  const rebound = rebindPostMutationEvidence({
    evidence: oldEvidence,
    finalArtifactSha: 'new-artifact',
    changedQids: [qids[0]],
    directDependencyQids: [qids[1]],
    reboundRows: [
      { qid: qids[0], artifactSha: 'new-artifact', evidenceRef: 'new://changed' },
      { qid: qids[1], artifactSha: 'new-artifact', evidenceRef: 'new://dependency' },
    ],
  });
  assert.equal(rebound.artifactSha, 'new-artifact');

  console.log(JSON.stringify({
    status: 'PASS',
    mode: 'SHADOW_ONLY',
    examPath: path.relative(process.cwd(), examFile),
    qidCount: qids.length,
    stages: ['CREATE', 'R1', 'R2', 'R3'],
    productionMutation: 0,
  }));
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}
