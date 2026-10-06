#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { pathToFileURL } from 'node:url';
import {
  gitBlobSha,
  validateCompatibilityEvidence,
  validateTargetedR2Evidence,
} from './archive-stage-validator-compat-v1.mjs';
import { V2_EVIDENCE_SCHEMA } from './archive-stage-validator-common-v2.mjs';
import { validateArtifactContract } from './archive-stage-validator-artifact-v2.mjs';
import { validateCreateEvidence } from './archive-stage-validator-create-v2.mjs';
import { validateR1Evidence } from './archive-stage-validator-r1-v2.mjs';
import { validateR2Evidence } from './archive-stage-validator-r2-v2.mjs';
import { validateR3Evidence } from './archive-stage-validator-r3-v2.mjs';

const ALLOWED_STAGES = new Set(['CREATE', 'R1', 'R2', 'R3', 'SOLUTION_UPGRADE']);
const V2_VALIDATORS = Object.freeze({
  CREATE: validateCreateEvidence,
  R1: validateR1Evidence,
  R2: validateR2Evidence,
  R3: validateR3Evidence,
});
const normalize = value => String(value || '').replaceAll('\\', '/');

export { gitBlobSha, validateTargetedR2Evidence };

function parseArgs(argv) {
  const out = { stage: '' };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--exam') out.exam = argv[++i];
    else if (arg === '--evidence') out.evidence = argv[++i];
    else if (arg === '--stage') out.stage = String(argv[++i] || '').toUpperCase();
    else if (arg === '--json') out.json = true;
    else throw new Error(`UNKNOWN_ARGUMENT:${arg}`);
  }
  if (!out.exam) throw new Error('EXAM_PATH_REQUIRED');
  if (!out.evidence) throw new Error('EVIDENCE_PATH_REQUIRED');
  if (!ALLOWED_STAGES.has(out.stage)) throw new Error('STAGE_REQUIRED');
  return out;
}

function loadV2ExamBinding(examFile) {
  const bytes = fs.readFileSync(examFile);
  const source = bytes.toString('utf8');
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: examFile, timeout: 5000 });
  const questions = sandbox.window.questionBank || sandbox.window.questions;
  if (!Array.isArray(questions) || questions.length === 0) throw new Error('V2_QUESTION_BANK_REQUIRED');

  return {
    actualArtifactSha: gitBlobSha(bytes),
    questions,
    expectedQids: questions.map(question => Number(question?.id)).filter(Number.isInteger),
  };
}

function validateV2Evidence({ evidence, evidenceFile, examFile, stage }) {
  const normalizedStage = String(stage || '').toUpperCase();
  const validator = V2_VALIDATORS[normalizedStage];
  if (!validator) return null;

  const binding = loadV2ExamBinding(examFile);
  const stageReport = validator({
    examUid: evidence?.examUid,
    artifactSha: evidence?.artifactSha,
    actualArtifactSha: binding.actualArtifactSha,
    evidenceRef: normalize(evidenceFile),
    evidence,
    expectedQids: binding.expectedQids,
  });

  const artifactContract = validateArtifactContract({
    stage: normalizedStage,
    evidence,
    questions: binding.questions,
  });
  if (!artifactContract.active) return stageReport;

  const issues = [...stageReport.issues, ...artifactContract.issues];
  return {
    ...stageReport,
    ok: issues.length === 0,
    disposition: issues.length ? 'FAIL' : 'PASS',
    artifactContract,
    issues,
  };
}

export function validateStageEvidence({ examFile, evidenceFile, stage }) {
  const evidence = JSON.parse(fs.readFileSync(evidenceFile, 'utf8'));
  const compatibility = validateCompatibilityEvidence({
    evidence,
    evidenceFile,
    examFile,
    stage,
  });
  if (compatibility) return compatibility;

  if (evidence?.schemaVersion === V2_EVIDENCE_SCHEMA) {
    const v2 = validateV2Evidence({ evidence, evidenceFile, examFile, stage });
    if (v2) return v2;
    return {
      ok: false,
      validatorMode: 'UNSUPPORTED_V2_STAGE',
      stage,
      examPath: normalize(examFile),
      disposition: 'FAIL',
      issues: [`V2_STAGE_UNSUPPORTED:${stage}`],
    };
  }

  return {
    ok: false,
    validatorMode: 'UNSUPPORTED',
    stage,
    examPath: normalize(examFile),
    disposition: 'FAIL',
    issues: [`EVIDENCE_SCHEMA_UNSUPPORTED:${evidence.schemaVersion || 'MISSING'}`],
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const args = parseArgs(process.argv.slice(2));
    const report = validateStageEvidence({
      examFile: path.resolve(args.exam),
      evidenceFile: path.resolve(args.evidence),
      stage: args.stage,
    });
    console.log(JSON.stringify(report, null, 2));
    process.exitCode = report.ok ? 0 : 1;
  } catch (error) {
    console.error(JSON.stringify({ ok: false, error: error.message }, null, 2));
    process.exitCode = 2;
  }
}
