#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import {
  gitBlobSha,
  validateCompatibilityEvidence,
  validateTargetedR2Evidence,
} from './archive-stage-validator-compat-v1.mjs';

const ALLOWED_STAGES = new Set(['CREATE', 'R1', 'R2', 'R3', 'SOLUTION_UPGRADE']);
const normalize = value => String(value || '').replaceAll('\\\\', '/');

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

export function validateStageEvidence({ examFile, evidenceFile, stage }) {
  const evidence = JSON.parse(fs.readFileSync(evidenceFile, 'utf8'));
  const compatibility = validateCompatibilityEvidence({
    evidence,
    evidenceFile,
    examFile,
    stage,
  });
  if (compatibility) return compatibility;

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
