import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const REPORT = path.join(ROOT, 'reports', 'hs-quadratic-svg-upgrade-20260908');
const SCOPED = JSON.parse(fs.readFileSync(path.join(REPORT, '764_rebased_candidate_bank_manifest_r60.json'), 'utf8'));
const TRIAGE = fs.readFileSync(path.join(REPORT, '03_visual_triage.jsonl'), 'utf8').trim().split(/\r?\n/).map(JSON.parse);
const OUTPUT = path.join(REPORT, '766_full_target_visual_manifest_r60_rebased.json');

function keyFromUid(questionUid) {
  const parts = String(questionUid).split('|');
  return `${parts[0]}|${Number(parts.at(-1))}`;
}
function load(relativePath) {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(ROOT, relativePath), 'utf8'), context, { filename: relativePath, timeout: 10000 });
  return JSON.parse(JSON.stringify(context.window));
}

const decisions = new Map(TRIAGE.map((row) => [keyFromUid(row.questionUid), row]));
const rows = [];
for (const file of SCOPED.candidateFiles) {
  const bank = load(file.candidatePath);
  for (const question of bank.questionBank) {
    const decision = decisions.get(`${file.sourcePath}|${Number(question.id)}`);
    if (!question.solutionImage || decision?.visualDecision === 'NO_VISUAL') continue;
    const assetPath = question.solutionImage;
    const svg = fs.readFileSync(path.join(ROOT, assetPath), 'utf8');
    const caseMatch = svg.match(/data-visual-case="([^"]+)"/);
    rows.push({
      questionUid: `${file.sourcePath}|${bank.examTitle}|${question.id}`,
      sourcePath: file.sourcePath,
      id: Number(question.id),
      visualDecision: decision?.visualDecision ?? null,
      caseId: caseMatch?.[1] ?? null,
      assetPath,
      assetSha256: crypto.createHash('sha256').update(svg).digest('hex'),
      solutionImageAlt: question.solutionImageAlt ?? null,
    });
  }
}
const missingCaseIds = rows.filter((row) => !row.caseId).length;
const output = {
  schemaVersion: 'HS_QUADRATIC_FULL_TARGET_VISUAL_MANIFEST_R60_REBASED',
  status: rows.length === 379 && missingCaseIds === 0 ? 'FULL_TARGET_VISUAL_MANIFEST_REBASED_READY_NO_PASS' : 'FULL_TARGET_VISUAL_MANIFEST_REVIEW_REQUIRED',
  productionAuthorized: false,
  targetRows: 430,
  targetVisualRows: rows.length,
  missingCaseIds,
  rows,
  sourceOfTruth: {
    rebasedCandidateManifest: 'reports/hs-quadratic-svg-upgrade-20260908/764_rebased_candidate_bank_manifest_r60.json',
    visualCoverage: 'reports/hs-quadratic-svg-upgrade-20260908/740_target_scoped_visual_coverage_r49.json',
    priorRender: 'reports/hs-quadratic-svg-upgrade-20260908/763_full_target_local_render_review_r60.json',
  },
  note: 'Rebuilds the full 379-row target visual manifest against the current-source-rebased candidate bank. Asset paths and SVG bytes are checked; no provider-attested PASS is claimed.',
};
fs.writeFileSync(OUTPUT, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ status: output.status, targetRows: output.targetRows, targetVisualRows: output.targetVisualRows, missingCaseIds }, null, 2));
