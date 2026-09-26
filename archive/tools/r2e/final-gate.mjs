#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseQuestionBank } from '../meta-foundation/reviewed-apply-core.mjs';
import { validateStudentSerialization } from '../pipeline-core/student-output.mjs';
import { safePath } from '../pipeline-core/canonical.mjs';
import { INTAKES, ensure, sha } from './common.mjs';

export const REQUIRED_GATES = Object.freeze(['denominator', 'nodeSyntax', 'vmRuntime', 'answerSolutionConsistency', 'solutionBlank', 'controlCharacters', 'latexEscape', 'protectedParityOrRepair', 'svgXmlReference', 'svgGeometryProvenance', 'l1l2Parent', 'l3l4Parent', 'crossConceptRegistry', 'duplicateAlias', 'rpmCrosswalk', 'globalCanonical', 'curriculumBinding', 'compiledRuntimeParity', 'affectedUidMetadata', 'archive2CatalogIndexJoin', 'targetedRegression', 'realRender', 'metaHoldZero']);
const BLOCKERS = /META_PACK_GAP_HOLD|META_CANONICAL_HOLD|RPM_PRIMARY_MIGRATION_GAP|PROPOSED_NEW_L[34]|CROSS_CONCEPT_CANDIDATE|CROSSCONCEPT_CANDIDATE/;
const DISPOSITIONS = new Set(['EXISTING_REUSE', 'REBIND', 'MATERIALIZED', 'NEW_L4', 'NEW_L3', 'CROSS_CONCEPT', 'ROUTE_OUT']);
export function finalGate(root, ledger, validation) {
  const errors = [];
  const record = (ok, code) => { if (!ok) errors.push(code); };
  record(Object.values(INTAKES).includes(ledger.inputBranch), 'INTAKE_AUTHORITY_INVALID');
  record(/^[a-f0-9]{40}$/.test(ledger.inputCommit || ''), 'FROZEN_INPUT_COMMIT_REQUIRED');
  record(Array.isArray(ledger.remainingItems) && ledger.remainingItems.length === 0, 'REMAINING_ITEMS');
  record(Array.isArray(ledger.deepReviewItems) && Array.isArray(ledger.resolvedItems) && ledger.deepReviewItems.every(n => ledger.resolvedItems.includes(n)), 'DEEP_REVIEW_COVERAGE');
  record(Array.isArray(ledger.items) && ledger.items.length === ledger.denominator, 'ITEM_LEDGER_COVERAGE');
  record(Array.isArray(ledger.unresolvedItems) && ledger.unresolvedItems.length === 0, 'UNRESOLVED_ITEMS');
  for (const name of ['proposedNewL3', 'proposedNewL4', 'rpmMigrationGaps', 'crossConceptCandidates']) if (Object.hasOwn(ledger, name)) record(Array.isArray(ledger[name]) && ledger[name].length === 0, `UNRESOLVED_PROPOSAL:${name}`);
  record(new Set((ledger.items || []).map(row => row.ordinal)).size === ledger.denominator && (ledger.items || []).every((row, i) => row.ordinal === i + 1), 'ITEM_IDENTITY_COVERAGE');
  for (const row of ledger.items || []) {
    record(!BLOCKERS.test(JSON.stringify({ status: row.status, disposition: row.disposition, unresolved: row.unresolvedItems, remaining: row.remainingItems })), 'META_HOLD_OR_PROPOSAL_REMAINING');
    record(row.status === 'PASS' || DISPOSITIONS.has(row.disposition), 'ITEM_NOT_FINAL');
    if (row.r1Status === 'PASS' && row.invalidationReason == null) record(row.reviewMode === 'INTEGRITY_REUSE', 'NORMAL_PASS_REVIEW_MODE');
    if (row.reviewMode === 'DEEP') record(ledger.deepReviewItems?.includes(row.ordinal), 'DEEP_ITEM_OUTSIDE_SCOPE');
    if (row.disposition) record(DISPOSITIONS.has(row.disposition), 'FINAL_DISPOSITION_INVALID');
  }
  let bytes;
  try {
    bytes = fs.readFileSync(safePath(root, ledger.examFile));
    record(sha(bytes) === validation.artifactSha256, 'VALIDATION_ARTIFACT_SHA_STALE');
    const bank = parseQuestionBank(bytes.toString('utf8'), ledger.examFile);
    record(bank.length === ledger.denominator && new Set(bank.map(q => q.id)).size === bank.length, 'DENOMINATOR_OR_IDENTITY');
    record(ledger.integrityScanned === bank.length, 'INTEGRITY_COVERAGE');
    for (const q of bank) {
      record(String(q.solution || '').trim(), 'SOLUTION_BLANK');
      record(validateStudentSerialization(q).status === 'PASS', 'SERIALIZATION_FAIL');
      record(!Object.values(q).some(v => typeof v === 'string' && BLOCKERS.test(v)), 'META_HOLD_IN_JS');
    }
  } catch (error) { errors.push(`JS_LOAD:${error.message}`); }
  record(validation.inputCommit === ledger.inputCommit, 'VALIDATION_INPUT_COMMIT_MISMATCH');
  record(Array.isArray(ledger.dependencyShas) && ledger.dependencyShas.length > 0, 'DEPENDENCY_BINDINGS_REQUIRED');
  for (const ref of [...(ledger.dependencyShas || []), ...(validation.artifacts || [])]) {
    try { record(sha(fs.readFileSync(safePath(root, ref.path))) === String(ref.sha256).replace(/^sha256:/, ''), `DEPENDENCY_OR_ASSET_STALE:${ref.path}`); }
    catch (error) { errors.push(`DEPENDENCY_MISSING:${error.message}`); }
  }
  for (const name of REQUIRED_GATES) {
    const gate = validation.gates?.[name]; record(gate?.status === 'PASS', `GATE_NOT_PASS:${name}`);
    try {
      ensure(gate?.evidenceRef, 'EVIDENCE_REQUIRED');
      const evidence = fs.readFileSync(safePath(root, gate.evidenceRef.path));
      record(sha(evidence) === String(gate.evidenceRef.sha256).replace(/^sha256:/, ''), `GATE_EVIDENCE_STALE:${name}`);
    } catch (error) { errors.push(`GATE_EVIDENCE:${name}:${error.message}`); }
  }
  return { status: errors.length ? 'FAIL' : 'PASS', errors: [...new Set(errors)], artifactSha256: bytes ? sha(bytes) : null, inputCommit: ledger.inputCommit, productionAuthorized: false };
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2), opt = k => { const i = args.indexOf(`--${k}`); return i < 0 ? null : args[i + 1]; };
  try {
    const result = finalGate(path.resolve(opt('repo') || '.'), JSON.parse(fs.readFileSync(opt('ledger'), 'utf8')), JSON.parse(fs.readFileSync(opt('validation'), 'utf8')));
    console.log(JSON.stringify(result, null, 2)); if (result.status !== 'PASS') process.exitCode = 1;
  } catch (error) { console.log(JSON.stringify({ status: 'FAIL', errors: [error.message], productionAuthorized: false })); process.exitCode = 1; }
}
