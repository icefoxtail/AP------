#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { pathToFileURL, fileURLToPath } from 'node:url';
import {
  gitBlobSha,
  validateCompatibilityEvidence,
  validateTargetedR2Evidence,
} from './archive-stage-validator-compat-v1.mjs';
import { V2_EVIDENCE_SCHEMA } from './archive-stage-validator-common-v2.mjs';
import { QUALITY_CONTRACT_V2, validateArtifactContract } from './archive-stage-validator-artifact-v2.mjs';
import { validateCreateEvidence } from './archive-stage-validator-create-v2.mjs';
import { validateR1Evidence } from './archive-stage-validator-r1-v2.mjs';
import { validateR2Evidence } from './archive-stage-validator-r2-v2.mjs';
import { validateR3Evidence } from './archive-stage-validator-r3-v2.mjs';
import { artifactSnapshot } from './archive-codex-artifact-io.mjs';

const ALLOWED_STAGES = new Set(['CREATE', 'R1', 'R2', 'R3', 'SOLUTION_UPGRADE']);
const V2_VALIDATORS = Object.freeze({
  CREATE: validateCreateEvidence,
  R1: validateR1Evidence,
  R2: validateR2Evidence,
  R3: validateR3Evidence,
});
const normalize = value => String(value || '').replaceAll('\\', '/');
const nonEmpty = value => typeof value === 'string' && value.trim().length > 0;

export { gitBlobSha, validateTargetedR2Evidence };

function parseArgs(argv) {
  const out = { stage: '' };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--exam') out.exam = argv[++i];
    else if (arg === '--evidence') out.evidence = argv[++i];
    else if (arg === '--stage') out.stage = String(argv[++i] || '').toUpperCase();
    else if (arg === '--quality-contract') out.qualityContractVersion = argv[++i];
    else if (arg === '--execution-line') out.executionLine = argv[++i];
    else if (arg === '--campaign-id') out.campaignId = argv[++i];
    else if (arg === '--stream') out.stream = String(argv[++i] || '').toUpperCase();
    else if (arg === '--asset-root') out.assetRoot = argv[++i];
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
    examTitle: sandbox.window.examTitle,
    expectedQids: questions.map(question => Number(question?.id)).filter(Number.isInteger),
  };
}

function validateV2Evidence({ evidence, evidenceFile, examFile, stage, repoRoot, assetRoot, goldenRoot }) {
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
    repoRoot: goldenRoot || repoRoot,
    assetRoot: assetRoot || path.join(repoRoot, 'archive'),
  });
  if (!artifactContract.active) return stageReport;

  const issues = [...stageReport.issues, ...artifactContract.issues];
  if(typeof binding.examTitle!=="string" || !binding.examTitle.trim()) issues.push("ARTIFACT_EXAM_TITLE_REQUIRED");
  return {
    ...stageReport,
    ok: issues.length === 0,
    disposition: issues.length ? 'FAIL' : 'PASS',
    artifactContract,
    qualityContractVersion: artifactContract.qualityContractVersion,
    executionLine: evidence.executionLine,
    ...(evidence.executionLine === 'CODEX' ? {technicalBinding: artifactSnapshot({sourceFile: examFile, evidenceFile, assetRoot: assetRoot || path.join(repoRoot, 'archive'), questions: binding.questions})} : {}),
    ...(evidence.executionLine === 'GPT_SCHEDULED' ? {campaignId: evidence.campaignId, stream: String(evidence.stream || '').toUpperCase()} : {}),
    issues,
  };
}

function findSourceRoot(examFile) {
  for (let dir = path.dirname(path.resolve(examFile));;) {
    if (fs.existsSync(path.join(dir,'.git'))) return dir;
    const parent = path.dirname(dir); if(parent===dir) return process.cwd(); dir=parent;
  }
}

export function validateStageEvidence({ examFile, evidenceFile, stage, qualityContractVersion, executionLine = qualityContractVersion ? 'CODEX' : undefined, campaignId, stream, repoRoot = findSourceRoot(examFile), assetRoot, goldenRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..') }) {
  const evidence = JSON.parse(fs.readFileSync(evidenceFile, 'utf8'));
  const version = evidence?.qualityContractVersion;
  const contractIssues = [];
  if(version===QUALITY_CONTRACT_V2 && !['CODEX','GPT_SCHEDULED'].includes(evidence.executionLine)) contractIssues.push('EXECUTION_LINE_REQUIRED');
  if(executionLine && evidence.executionLine!==executionLine) contractIssues.push('EXECUTION_LINE_MISMATCH');
  if (qualityContractVersion !== undefined && qualityContractVersion !== QUALITY_CONTRACT_V2) contractIssues.push('QUALITY_CONTRACT_UNSUPPORTED');
  if (version !== undefined && version !== QUALITY_CONTRACT_V2) contractIssues.push('EVIDENCE_QUALITY_CONTRACT_UNSUPPORTED');
  if (qualityContractVersion === QUALITY_CONTRACT_V2 && version !== QUALITY_CONTRACT_V2) contractIssues.push('QUALITY_CONTRACT_REQUIRED');
  if (version === QUALITY_CONTRACT_V2 && evidence.schemaVersion !== V2_EVIDENCE_SCHEMA) contractIssues.push('QUALITY_CONTRACT_V2_SCHEMA_REQUIRED');
  if (version === QUALITY_CONTRACT_V2 && evidence.executionLine === 'GPT_SCHEDULED') {
    if (!nonEmpty(evidence.campaignId)) contractIssues.push('GPT_CAMPAIGN_ID_REQUIRED');
    if (!['A','B','C'].includes(String(evidence.stream || '').toUpperCase())) contractIssues.push('GPT_STREAM_REQUIRED');
    if (campaignId && evidence.campaignId !== campaignId) contractIssues.push('GPT_CAMPAIGN_ID_MISMATCH');
    if (stream && String(evidence.stream || '').toUpperCase() !== String(stream).toUpperCase()) contractIssues.push('GPT_STREAM_MISMATCH');
  }
  if(contractIssues.length) return {ok:false,stage,validatorMode:'CONTRACT_REJECTED',disposition:'FAIL',issues:contractIssues};
  const compatibility = validateCompatibilityEvidence({
    evidence,
    evidenceFile,
    examFile,
    stage,
  });
  if (compatibility) return compatibility;

  if (evidence?.schemaVersion === V2_EVIDENCE_SCHEMA) {
    const v2 = validateV2Evidence({ evidence, evidenceFile, examFile, stage, repoRoot, assetRoot, goldenRoot });
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
      qualityContractVersion: args.qualityContractVersion,
      executionLine: args.executionLine || (args.qualityContractVersion ? 'CODEX' : undefined),
      campaignId: args.campaignId,
      stream: args.stream,
      assetRoot: args.assetRoot && path.resolve(args.assetRoot),
    });
    console.log(JSON.stringify(report, null, 2));
    process.exitCode = report.ok ? 0 : 1;
  } catch (error) {
    console.error(JSON.stringify({ ok: false, error: error.message }, null, 2));
    process.exitCode = 2;
  }
}
