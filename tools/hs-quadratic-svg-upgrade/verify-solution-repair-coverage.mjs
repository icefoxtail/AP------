import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const REPORT = path.join(ROOT, 'reports', 'hs-quadratic-svg-upgrade-20260908');
const AUDIT = JSON.parse(fs.readFileSync(path.join(REPORT, '10_current_source_solution_static_audit_v2.json'), 'utf8'));
const OUTPUT = path.join(REPORT, '23_solution_repair_coverage.json');

const SOURCE_HOLDS = new Set([
  'archive/exams/original/high/h1/1mid/26_금당고_1학기_중간_고1_기출_c.js|26_금당고_1학기_중간_고1_기출_c|13',
  'archive/exams/original/high/h1/1mid/26_금당고_1학기_중간_고1_기출_c.js|26_금당고_1학기_중간_고1_기출_c|17',
  'archive/exams/original/high/h1/1mid/26_매산여고_1학기_중간_고1_기출_c.js|26_매산여고_1학기_중간_고1_기출_c|19',
  'archive/exams/original/high/h1/1mid/26_팔마고_1학기_중간_고1_기출_c.js|26_팔마고_1학기_중간_고1_기출_c|9',
  'archive/exams/original/high/h1/1mid/26_팔마고_1학기_중간_고1_기출_c.js|26_팔마고_1학기_중간_고1_기출_c|15',
]);
const CANDIDATE_BANKS = [
  'archive/_generated/hs-quadratic-svg-upgrade-20260908/candidate-r3/exams/02-25_금당고_1학기_중간_고1_기출.js',
  'archive/_generated/hs-quadratic-svg-upgrade-20260908/candidate-r3/exams/04-25_강남여고_1학기_기말_고1_기출c.js',
  'archive/_generated/hs-quadratic-svg-upgrade-20260908/candidate-r3/exams/05-22_금당고_1학기_기말_고1_기출.js',
  'archive/_generated/hs-quadratic-svg-upgrade-20260908/candidate-r4/exams/26-geumdang-solution-repairs.js',
  'archive/_generated/hs-quadratic-svg-upgrade-20260908/candidate-r5/exams/26_금당고_1학기_중간_고1_기출_c-solution-repair.js',
  'archive/_generated/hs-quadratic-svg-upgrade-20260908/candidate-r5/exams/26_매산여고_1학기_중간_고1_기출_c-solution-repair.js',
  'archive/_generated/hs-quadratic-svg-upgrade-20260908/candidate-r5/exams/26_팔마고_1학기_중간_고1_기출_c-solution-repair.js',
];

function load(filePath) { const context = { window: {} }; vm.createContext(context); vm.runInContext(fs.readFileSync(filePath, 'utf8'), context, { filename: filePath, timeout: 10000 }); return context.window.questionBank || []; }
function pathQid(uid) { const parts = String(uid).split('|'); return `${parts.slice(0, -2).join('|')}|${parts.at(-1)}`; }

function main() {
  const banks = new Map();
  for (const relative of CANDIDATE_BANKS) for (const q of load(path.join(ROOT, relative))) banks.set(`${relative}|${q.id}`, q);
  const rows = [];
  for (const row of AUDIT.rows.filter(item => item.genericPlaceholder || item.staleAnswerConflict || item.directionFlags.length)) {
    const key = pathQid(row.questionUid);
    const candidate = [...banks.entries()].find(([relative]) => relative.includes(path.basename(row.sourceJsPath).replace('.js', '')) && relative.endsWith(`${row.id}`))?.[1] || null;
    const sourceHold = SOURCE_HOLDS.has(row.questionUid);
    const candidateSolution = String(candidate?.solution || '');
    const residual = row.genericPlaceholder && /^\s*주어진 식 또는 그래프에서/.test(candidateSolution) || row.staleAnswerConflict && /원문\s*(?:표시\s*)?정답[^.\n]{0,80}(?:충돌|다르|불일치)/.test(candidateSolution) || row.directionFlags.length && row.directionFlags.some(flag => candidateSolution.includes(flag.token));
    rows.push({ questionUid: row.questionUid, issueTypes: [...(row.genericPlaceholder ? ['GENERIC_SOLUTION_PLACEHOLDER'] : []), ...(row.staleAnswerConflict ? ['STALE_SOURCE_ANSWER_CONFLICT'] : []), ...(row.directionFlags.length ? ['PARABOLA_DIRECTION_WORDING_CONTRADICTION'] : [])], sourceHold, candidateFound: Boolean(candidate), repairStatus: sourceHold ? 'SOURCE_HOLD_REMAINS' : residual ? 'REPAIR_NOT_CLOSED' : 'CANDIDATE_REPAIRED_NO_FINAL_PASS' });
  }
  const output = { schemaVersion: 'HS_QUADRATIC_SOLUTION_REPAIR_COVERAGE_V1', status: rows.some(row => row.repairStatus === 'REPAIR_NOT_CLOSED') ? 'REPAIR_COVERAGE_FAIL' : 'CANDIDATE_REPAIR_COVERAGE_RECORDED_NO_FINAL_PASS', rows, counts: { auditedIssueRows: rows.length, candidateRepaired: rows.filter(row => row.repairStatus === 'CANDIDATE_REPAIRED_NO_FINAL_PASS').length, sourceHolds: rows.filter(row => row.repairStatus === 'SOURCE_HOLD_REMAINS').length, repairNotClosed: rows.filter(row => row.repairStatus === 'REPAIR_NOT_CLOSED').length }, note: 'Candidate repair coverage is not a source/solution independent final PASS. Source holds remain blocked until approved source repair or withdrawal.' };
  fs.writeFileSync(OUTPUT, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({ status: output.status, counts: output.counts }, null, 2));
}
main();
