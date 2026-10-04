import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const REPORT = path.join(ROOT, 'reports', 'hs-quadratic-svg-upgrade-20260908');
const RECHECK = JSON.parse(fs.readFileSync(path.join(REPORT, '329_source_solution_repairs_independent_recheck_r25.json'), 'utf8'));
const V3 = JSON.parse(fs.readFileSync(path.join(REPORT, '351_source_repair_v3_parity_r26.json'), 'utf8'));
const OUTPUT = path.join(REPORT, '354_source_repair_solution_freeze_ledger_r26_recheck.json');
const sourceByKey = new Map(RECHECK.rows.map(row => [`${row.sourceJsPath}|${row.id}`, row]));
const rows = V3.rows.map(row => {
  const key = `${row.questionUid.split('|')[0]}|${row.id}`;
  const source = sourceByKey.get(key);
  const mathPass = source?.status.endsWith('MATCH') ?? false;
  const visualPass = row.verdict === 'PASS';
  return { questionUid: row.questionUid, sourceJsPath: row.questionUid.split('|')[0], id: row.id, expectedFactParity: mathPass, sourceSolutionReviewStatus: mathPass ? 'INDEPENDENT_RECHECKED' : 'MISMATCH', visualReviewStatus: visualPass ? 'V3_PARITY_PASS' : 'V3_PARITY_FAIL', solutionFreezeStatus: mathPass && visualPass ? 'FROZEN_CURRENT_SOURCE_REPAIR' : 'BLOCKED', verdict: mathPass && visualPass ? 'PASS' : 'FAIL' };
});
const frozenRows = rows.filter(row => row.verdict === 'PASS').length;
const output = { schemaVersion: 'HS_QUADRATIC_SOURCE_REPAIR_SOLUTION_FREEZE_R26_RECHECK', status: frozenRows === rows.length ? 'SOURCE_REPAIR_SOLUTION_FREEZE_RECORDED_NO_FINAL_PASS' : 'SOURCE_REPAIR_SOLUTION_FREEZE_BLOCKED', productionAuthorized: false, denominatorAffectedRows: rows.length, frozenRows, rows, evidence: { sourceSolutionRecheck: 'reports/hs-quadratic-svg-upgrade-20260908/329_source_solution_repairs_independent_recheck_r25.json', v1: 'reports/hs-quadratic-svg-upgrade-20260908/343_source_repair_v1_expected_facts_r26.json', v3: 'reports/hs-quadratic-svg-upgrade-20260908/351_source_repair_v3_parity_r26.json' }, note: 'Corrected freeze status computation for 11 source-repair rows; whole-job final audit and production authority remain open.' };
fs.writeFileSync(OUTPUT, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ status: output.status, denominatorAffectedRows: output.denominatorAffectedRows, frozenRows: output.frozenRows }, null, 2));
