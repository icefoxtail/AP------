#!/usr/bin/env node
/**
 * One metadata projection entry for CREATE / R1 / R2 / R3.
 * This script does NOT certify independent mathematics, student rendering, or release.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildResolverDecisionEvidence, validateMetaFinalization } from './rpm-active-resolver.mjs';

export const META_STAGES = Object.freeze(['CREATE', 'R1', 'R2', 'R3']);
const asText = value => typeof value === 'string' ? value.trim() : '';

/**
 * No AI-authored PT/TPL is authoritative. Compare the candidate against the
 * independently resolved ACTIVE projection, including missing-binding cases.
 */
export function checkResolverProjectionParity(resolution, candidate) {
  const errors = [];
  if (!resolution || typeof resolution !== 'object') return ['META_RESOLVER_EVIDENCE_REQUIRED'];
  if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) return ['META_CANDIDATE_REQUIRED'];
  const projectionReady = resolution.projectionStatus === 'PROJECTION_REUSE';
  for (const field of ['problemTypeKey', 'templateKey']) {
    const actual = asText(candidate[field]);
    const expected = projectionReady ? asText(resolution[field]) : '';
    if (actual !== expected) errors.push('META_RESOLVER_ONLY_' + field.toUpperCase() + '_MISMATCH');
  }
  const cross = candidate.crossConceptKeys;
  if (!Array.isArray(cross)) errors.push('META_CROSSCONCEPT_ARRAY_REQUIRED');
  else {
    if (cross.some(key => !asText(key))) errors.push('META_CROSSCONCEPT_EMPTY_KEY');
    if (new Set(cross).size !== cross.length) errors.push('META_CROSSCONCEPT_DUPLICATE');
  }
  if (projectionReady && (!asText(resolution.problemTypeKey) || !asText(resolution.templateKey)))
    errors.push('META_ACTIVE_PT_TPL_NOT_UNIQUE');
  return errors;
}

export function evaluateMetaStage({ stage, built, candidateMeta = null, relationalEvidence = null,
  difficultyEvidence = null, repoRoot, validatorReceipt = null }) {
  const resolution = built?.resolverEvidence;
  const errors = [];
  if (!META_STAGES.includes(stage)) errors.push('META_STAGE_INVALID');
  if (built?.validation?.status !== 'PASS') errors.push('META_RESOLVER_VALIDATION_FAILED');
  const projectionStatus = resolution?.projectionStatus || 'NOT_ATTEMPTED';
  const semanticStatus = resolution?.semanticStatus || 'UNAVAILABLE';
  let finalization = null;
  if (candidateMeta) errors.push(...checkResolverProjectionParity(resolution, candidateMeta));
  const completeEvidence = Boolean(candidateMeta && relationalEvidence && difficultyEvidence);
  if (completeEvidence && !errors.length) {
    finalization = validateMetaFinalization({
      input: built.input, resolverEvidence: resolution, difficultyEvidence,
      candidateMeta, semanticMetaEvidence: relationalEvidence,
      validatorReceipt, requireValidatorReceipt: Boolean(validatorReceipt), repoRoot
    });
    if (finalization.status !== 'PASS') errors.push(...finalization.errors);
  }
  let metaStatus = 'EVIDENCE_INCOMPLETE';
  if (errors.length) metaStatus = 'INVALID';
  else if (semanticStatus !== 'FINAL') metaStatus = 'SEMANTIC_UNRESOLVED';
  else if (projectionStatus !== 'PROJECTION_REUSE') metaStatus = 'PROJECTION_PENDING';
  else if (completeEvidence && finalization?.status === 'PASS') metaStatus = 'META_FINALIZATION_PASS';
  else if (stage === 'CREATE') metaStatus = 'RESOLVER_ONLY';
  return {
    schemaVersion: 'JS_ARCHIVE_STAGE_META_BRIDGE_v1', stage, metaStatus, semanticStatus,
    projectionStatus, resolverValidation: built?.validation?.status || 'NOT_RUN',
    resolverEvidence: resolution || null, validatorReceipt: built?.validatorReceipt || null,
    finalization, errors: [...new Set(errors)],
    stageQualityPass: false,
    notice: 'META_FINALIZATION_PASS is metadata-only; it never certifies mathematics, R1/R2/R3, rendering or release.'
  };
}

function option(args, flag) {
  const at = args.indexOf('--' + flag);
  return at < 0 ? '' : args[at + 1] || '';
}

function readJson(root, file) {
  if (!file) return null;
  const full = path.resolve(root, file);
  return JSON.parse(fs.readFileSync(full, 'utf8'));
}

async function main() {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
  const args = process.argv.slice(2);
  const stage = asText(option(args, 'stage')).toUpperCase();
  const inputPath = option(args, 'input');
  const outputPath = option(args, 'out');
  if (!META_STAGES.includes(stage) || !inputPath || !outputPath)
    throw new Error('Usage: stage-meta-bridge.mjs --stage CREATE|R1|R2|R3 --input decision.json --out evidence.json [--candidate meta.json --relational relational.json --difficulty difficulty.json --validator-receipt receipt.json]');
  const inputPacket = readJson(root, inputPath);
  const input = inputPacket?.input || inputPacket;
  const built = buildResolverDecisionEvidence(input, { repoRoot: root });
  const verdict = evaluateMetaStage({
    stage, built: { ...built, input },
    candidateMeta: readJson(root, option(args, 'candidate')),
    relationalEvidence: readJson(root, option(args, 'relational')),
    difficultyEvidence: readJson(root, option(args, 'difficulty')),
    validatorReceipt: readJson(root, option(args, 'validator-receipt')),
    repoRoot: root
  });
  const dest = path.resolve(root, outputPath);
  const stagingRoot = path.resolve(root, 'archive/_generated') + path.sep;
  if (!dest.startsWith(stagingRoot) || !dest.endsWith('.json'))
    throw new Error('META_BRIDGE_OUTPUT_MUST_BE_STAGE_LOCAL_JSON: archive/_generated/');
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, JSON.stringify(verdict, null, 2) + '\n', 'utf8');
  process.stdout.write(JSON.stringify({
    stage, metaStatus: verdict.metaStatus, semanticStatus: verdict.semanticStatus,
    projectionStatus: verdict.projectionStatus, errors: verdict.errors, output: path.relative(root, dest)
  }, null, 2) + '\n');
  if (verdict.metaStatus === 'INVALID') process.exitCode = 1;
  else if (stage !== 'CREATE' && verdict.metaStatus !== 'META_FINALIZATION_PASS') process.exitCode = 2;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
