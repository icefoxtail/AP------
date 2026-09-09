import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const REPORT = path.join(ROOT, 'reports', 'hs-quadratic-svg-upgrade-20260908');
const COVERAGE = JSON.parse(fs.readFileSync(path.join(REPORT, '743_full_scope_evidence_coverage_audit_r49.json'), 'utf8'));
const TARGET_VISUAL = JSON.parse(fs.readFileSync(path.join(REPORT, '740_target_scoped_visual_coverage_r49.json'), 'utf8'));
const CANDIDATE = JSON.parse(fs.readFileSync(path.join(REPORT, '764_rebased_candidate_bank_manifest_r60.json'), 'utf8'));
const BANK_VALIDATION = JSON.parse(fs.readFileSync(path.join(REPORT, '765_rebased_candidate_bank_validation_r60.json'), 'utf8'));
const VISUAL_MANIFEST = JSON.parse(fs.readFileSync(path.join(REPORT, '766_full_target_visual_manifest_r60_rebased.json'), 'utf8'));
const RENDER = JSON.parse(fs.readFileSync(path.join(REPORT, '763_full_target_local_render_review_r60.json'), 'utf8'));
const SOURCE_STATIC = JSON.parse(fs.readFileSync(path.join(REPORT, '742_current_source_solution_static_audit_r49.json'), 'utf8'));
const OUTPUT = path.join(REPORT, '767_full_scope_solution_freeze_r60.json');

function sha(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}
function key(sourcePath, id) {
  return `${sourcePath}|${Number(id)}`;
}
function keyFromUid(uid) {
  const parts = String(uid).split('|');
  return key(parts[0], Number(parts.at(-1)));
}
function load(relativePath) {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(ROOT, relativePath), 'utf8'), context, { filename: relativePath, timeout: 10000 });
  return JSON.parse(JSON.stringify(context.window));
}
function rowsFromFiles(names) {
  const rows = [];
  for (const name of names) {
    const report = JSON.parse(fs.readFileSync(path.join(REPORT, name), 'utf8'));
    for (const row of report.rows ?? []) rows.push({ ...row, evidenceFile: name });
  }
  return rows;
}
function rowKey(row) {
  return row.sourceJsPath && row.id !== undefined ? key(row.sourceJsPath, row.id) : keyFromUid(row.questionUid);
}
function isV3Pass(row) {
  return row?.verdict === 'PASS' || row?.v3Decision === 'PASS';
}
function isIndependentPass(row) {
  const status = String(row?.independentCalculationStatus ?? row?.status ?? '');
  return row && (status === 'MATCH' || status.endsWith('_MATCH')) && (row.expectedFactParity === undefined || row.expectedFactParity === true);
}

const v1Rows = rowsFromFiles(COVERAGE.v1Files);
const independentRows = rowsFromFiles(COVERAGE.independentFiles);
const v1ByKey = new Map();
const independentByKey = new Map();
for (const row of v1Rows) v1ByKey.set(rowKey(row), row);
for (const row of independentRows) {
  const bucket = independentByKey.get(rowKey(row)) ?? [];
  bucket.push(row);
  independentByKey.set(rowKey(row), bucket);
}

const v3Files = fs.readdirSync(REPORT).filter((name) => /(v3|V3).*parity|parity.*(v3|V3)/.test(name) && name.endsWith('.json'));
const v3ByKey = new Map();
for (const name of v3Files) {
  const report = JSON.parse(fs.readFileSync(path.join(REPORT, name), 'utf8'));
  for (const row of report.rows ?? []) {
    const k = rowKey(row);
    if (!v3ByKey.has(k) || isV3Pass(row)) v3ByKey.set(k, { ...row, evidenceFile: name });
  }
}

const staticFiles = fs.readdirSync(REPORT).filter((name) => /(visual_static_check|candidate_static_check)/.test(name) && name.endsWith('.json'));
const staticByKey = new Map();
for (const name of staticFiles) {
  const report = JSON.parse(fs.readFileSync(path.join(REPORT, name), 'utf8'));
  for (const row of report.rows ?? []) {
    const k = rowKey(row);
    const bucket = staticByKey.get(k) ?? [];
    bucket.push({ ...row, evidenceFile: name });
    staticByKey.set(k, bucket);
  }
}

const renderByKey = new Map(RENDER.rows.map((row) => [keyFromUid(row.questionUid), row]));
const visualByKey = new Map(VISUAL_MANIFEST.rows.map((row) => [key(row.sourcePath, row.id), row]));
const targetByKey = new Map(TARGET_VISUAL.rows.map((row) => [key(row.sourcePath, row.id), row]));
const sourceByKey = new Map();
const candidateByKey = new Map();
for (const file of CANDIDATE.candidateFiles) {
  const source = load(file.sourcePath);
  const candidate = load(file.candidatePath);
  for (const question of source.questionBank) sourceByKey.set(key(file.sourcePath, question.id), question);
  for (const question of candidate.questionBank) candidateByKey.set(key(file.sourcePath, question.id), question);
}

const rows = [];
for (const target of TARGET_VISUAL.rows) {
  const k = key(target.sourcePath, target.id);
  const source = sourceByKey.get(k);
  const candidate = candidateByKey.get(k);
  const visual = visualByKey.get(k);
  const v1 = v1ByKey.get(k);
  const independentCandidates = independentByKey.get(k) ?? [];
  const independent = independentCandidates.find(isIndependentPass) ?? independentCandidates.at(-1);
  const v3 = v3ByKey.get(k);
  const staticEvidence = visual ? (staticByKey.get(k) ?? []).find((row) => row.assetPath === visual.assetPath && (row.errors ?? []).length === 0) ?? (staticByKey.get(k) ?? []).find((row) => (row.errors ?? []).length === 0) : null;
  const render = visual ? renderByKey.get(k) : null;
  const sourceSolution = String(source?.solution ?? '');
  const candidateSolution = String(candidate?.solution ?? '');
  const sourceSolutionPresent = sourceSolution.trim().length > 0;
  const sourceCandidateSolutionParity = sourceSolution === candidateSolution;
  const independentPass = isIndependentPass(independent);
  const v3Pass = !visual || isV3Pass(v3);
  const staticPass = !visual || Boolean(staticEvidence);
  const renderPass = !visual || (render?.status === 'LOCAL_RENDER_REVIEWED' && (render.desktopOverflowLabels ?? []).length === 0 && (render.mobileOverflowLabels ?? []).length === 0);
  const freezeReady = Boolean(source && candidate && sourceSolutionPresent && sourceCandidateSolutionParity && v1 && independentPass && v3Pass && staticPass && renderPass);
  const reasonCodes = [];
  if (!source) reasonCodes.push('SOURCE_ROW_MISSING');
  if (!candidate) reasonCodes.push('CANDIDATE_ROW_MISSING');
  if (!sourceSolutionPresent) reasonCodes.push('SOURCE_SOLUTION_MISSING');
  if (!sourceCandidateSolutionParity) reasonCodes.push('SOURCE_CANDIDATE_SOLUTION_DRIFT');
  if (!v1) reasonCodes.push('V1_EXPECTED_FACT_MISSING');
  if (!independentPass) reasonCodes.push('INDEPENDENT_RECHECK_NOT_MATCH');
  if (visual && !v3Pass) reasonCodes.push('V3_PARITY_MISSING_OR_FAIL');
  if (visual && !staticPass) reasonCodes.push('CANDIDATE_STATIC_EVIDENCE_MISSING');
  if (visual && !renderPass) reasonCodes.push('LOCAL_RENDER_REVIEW_MISSING_OR_OVERFLOW');
  rows.push({
    questionUid: target.questionUid,
    sourcePath: target.sourcePath,
    id: Number(target.id),
    visualDecision: target.visualDecision,
    visualTarget: Boolean(visual),
    caseId: visual?.caseId ?? null,
    solutionSha256: sha(sourceSolution),
    candidateSolutionSha256: sha(candidateSolution),
    sourceSolutionPresent,
    sourceCandidateSolutionParity,
    v1ExpectedFact: Boolean(v1),
    v1Evidence: v1?.evidenceFile ?? null,
    independentMathRecheck: independentPass,
    independentEvidence: independent?.evidenceFile ?? null,
    v3Parity: visual ? v3Pass : 'NOT_REQUIRED_NO_VISUAL',
    v3Evidence: v3?.evidenceFile ?? null,
    candidateStatic: visual ? staticPass : 'NOT_REQUIRED_NO_VISUAL',
    candidateStaticEvidence: staticEvidence?.evidenceFile ?? null,
    localRender: visual ? renderPass : 'NOT_REQUIRED_NO_VISUAL',
    localRenderEvidence: render?.status ?? null,
    solutionFreezeStatus: freezeReady ? 'FROZEN_CANDIDATE_NO_FINAL_PASS' : 'BLOCKED',
    reasonCodes,
  });
}

const frozenRows = rows.filter((row) => row.solutionFreezeStatus === 'FROZEN_CANDIDATE_NO_FINAL_PASS');
const blockedRows = rows.filter((row) => row.solutionFreezeStatus === 'BLOCKED');
const visualRows = rows.filter((row) => row.visualTarget);
const output = {
  schemaVersion: 'HS_QUADRATIC_FULL_SCOPE_SOLUTION_FREEZE_R60',
  status: frozenRows.length === 430 ? 'FULL_SCOPE_SOLUTION_FREEZE_RECORDED_NO_FINAL_PASS' : 'FULL_SCOPE_SOLUTION_FREEZE_INCOMPLETE_NO_PASS',
  productionAuthorized: false,
  denominator: 430,
  frozenRows: frozenRows.length,
  blockedRows: blockedRows.length,
  visualDenominator: 379,
  visualRowsFrozen: visualRows.filter((row) => row.solutionFreezeStatus === 'FROZEN_CANDIDATE_NO_FINAL_PASS').length,
  residualFailCount: blockedRows.length,
  rows,
  evidence: {
    sourceStatic: 'reports/hs-quadratic-svg-upgrade-20260908/742_current_source_solution_static_audit_r49.json',
    fullScopeCoverage: 'reports/hs-quadratic-svg-upgrade-20260908/743_full_scope_evidence_coverage_audit_r49.json',
    targetVisualCoverage: 'reports/hs-quadratic-svg-upgrade-20260908/740_target_scoped_visual_coverage_r49.json',
    rebasedCandidateBank: 'reports/hs-quadratic-svg-upgrade-20260908/764_rebased_candidate_bank_manifest_r60.json',
    rebasedCandidateValidation: 'reports/hs-quadratic-svg-upgrade-20260908/765_rebased_candidate_bank_validation_r60.json',
    fullVisualManifest: 'reports/hs-quadratic-svg-upgrade-20260908/766_full_target_visual_manifest_r60_rebased.json',
    localRender: 'reports/hs-quadratic-svg-upgrade-20260908/763_full_target_local_render_review_r60.json',
  },
  gateSnapshot: {
    sourceStaticIssueRows: SOURCE_STATIC.counts?.issueRows ?? null,
    fullScopeV1Rows: COVERAGE.available.v1SourceIdRows,
    fullScopeIndependentRows: COVERAGE.available.independentMathRows,
    candidateBankErrors: BANK_VALIDATION.errors?.length ?? null,
    candidateBankSolutionDrift: BANK_VALIDATION.solutionDriftFromCurrentSource,
    targetVisualRows: VISUAL_MANIFEST.targetVisualRows,
    targetVisualMissingCaseIds: VISUAL_MANIFEST.missingCaseIds,
    fullRenderRows: RENDER.rows.length,
    fullRenderOverflowLabels: RENDER.overflowLabelCount,
    v3ParityPassRows: visualRows.filter((row) => row.v3Parity === true).length,
    v3ParityFailRows: visualRows.filter((row) => row.v3Parity === false).length,
  },
  openExternalGates: [
    'provider-attested FINAL_AUDIT is not available in this local run',
    'approved QUESTION_UID_v2 source-exam registry authority is not available; do not invent identity mappings',
    'DB/question-index/production promotion remains outside this candidate-only branch',
  ],
  note: 'All 430 current target solutions are frozen only as candidate evidence when the row checks pass. This ledger never authorizes production PASS, SEALED, or promotion.',
};
fs.writeFileSync(OUTPUT, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ status: output.status, denominator: output.denominator, frozenRows: output.frozenRows, blockedRows: output.blockedRows, visualRowsFrozen: output.visualRowsFrozen, residualFailCount: output.residualFailCount }, null, 2));
