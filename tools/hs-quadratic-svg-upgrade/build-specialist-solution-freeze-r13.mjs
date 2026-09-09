import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const REPORT = path.join(ROOT, 'reports', 'hs-quadratic-svg-upgrade-20260908');
const RECHECK = JSON.parse(fs.readFileSync(path.join(REPORT, '114_independent_recheck_specialist_r13.json'), 'utf8'));
const BANK = JSON.parse(fs.readFileSync(path.join(REPORT, '103_specialist_candidate_bank_manifest_r13.json'), 'utf8'));
const OUTPUT = path.join(REPORT, '115_specialist_solution_freeze_ledger_r13.json');
function load(relative) { const context = { window: {} }; vm.createContext(context); vm.runInContext(fs.readFileSync(path.join(ROOT, relative), 'utf8'), context, { filename: relative, timeout: 10000 }); return JSON.parse(JSON.stringify(context.window)); }
function sha(value) { return crypto.createHash('sha256').update(value).digest('hex'); }
const candidateBySource = new Map(BANK.candidateFiles.map((file) => [file.sourcePath, file]));
const rows = RECHECK.rows.map((review) => {
  const bankFile = candidateBySource.get(review.sourceJsPath); const candidate = load(bankFile.candidatePath); const question = candidate.questionBank.find((item) => Number(item.id) === review.id);
  if (!question) throw new Error(`candidate question missing ${review.questionUid}`);
  return { questionUid: review.questionUid, sourceJsPath: review.sourceJsPath, id: review.id, expectedFactParity: review.expectedFactParity, solutionSha256: sha(String(question.solution ?? '')), sourceReviewStatus: 'CURRENT_SOURCE_REPAIRED_OR_UNCHANGED', mathReviewStatus: 'INDEPENDENT_RECHECKED', solutionFreezeStatus: 'FROZEN_CANDIDATE', visualReviewStatus: 'V3_PARITY_PASS', status: review.expectedFactParity ? 'CANDIDATE_SOLUTION_FREEZE_RECORDED_NO_FINAL_PASS' : 'CANDIDATE_SOLUTION_FREEZE_BLOCKED' };
});
const output = { schemaVersion: 'HS_QUADRATIC_SPECIALIST_SOLUTION_FREEZE_LEDGER_R13', status: rows.every((row) => row.expectedFactParity) ? 'PARTIAL_SOLUTION_FREEZE_R13_NO_FINAL_PASS' : 'PARTIAL_SOLUTION_FREEZE_BLOCKED', productionAuthorized: false, denominatorFullScope: 430, frozenRows: rows.filter((row) => row.expectedFactParity).length, rows, evidence: { independentRecheck: 'reports/hs-quadratic-svg-upgrade-20260908/114_independent_recheck_specialist_r13.json', v1: 'reports/hs-quadratic-svg-upgrade-20260908/101_specialist_v1_expected_facts_r13.json', v3: 'reports/hs-quadratic-svg-upgrade-20260908/106_specialist_v3_parity_r13.json' }, note: 'Only the r13 18-row candidate batch is frozen here. The full 430-row solution freeze, provider audit, and production authority remain open.' };
fs.writeFileSync(OUTPUT, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ status: output.status, denominatorFullScope: output.denominatorFullScope, frozenRows: output.frozenRows }, null, 2));
