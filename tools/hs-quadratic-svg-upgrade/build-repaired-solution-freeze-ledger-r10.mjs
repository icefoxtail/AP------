import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const REPORT = path.join(ROOT, 'reports', 'hs-quadratic-svg-upgrade-20260908');
const RECHECK = JSON.parse(fs.readFileSync(path.join(REPORT, '38_candidate_source_repair_independent_recheck_r8.json'), 'utf8'));
const OUTPUT = path.join(REPORT, '56_repaired_solution_freeze_ledger_r10.json');
function load(relative) { const context = { window: {} }; vm.createContext(context); vm.runInContext(fs.readFileSync(path.join(ROOT, relative), 'utf8'), context, { filename: relative, timeout: 10000 }); return context.window.questionBank || []; }
function sha(value) { return crypto.createHash('sha256').update(value).digest('hex'); }
const rows = RECHECK.checks.map(row => { const sourcePath = row.questionUid.split('|')[0]; const id = Number(row.questionUid.split('|').at(-1)); const q = load(sourcePath).find(item => Number(item.id) === id); return { questionUid: row.questionUid, sourceJsPath: sourcePath, id, solutionHash: sha(String(q.solution ?? '')), sourceReviewStatus: 'SOURCE_REPAIRED', mathReviewStatus: 'INDEPENDENT_RECHECKED', solutionFreezeStatus: 'FROZEN_CANDIDATE', visualParityStatus: 'V3_PASS_FOR_ROW', status: 'CANDIDATE_SOLUTION_FREEZE_RECORDED_NO_FINAL_PASS' }; });
const output = { schemaVersion: 'HS_QUADRATIC_REPAIRED_SOLUTION_FREEZE_LEDGER_R10', status: 'PARTIAL_SOLUTION_FREEZE_REPAIRED_ROWS_ONLY_NO_FINAL_PASS', productionAuthorized: false, sourceHoldCountAfterRepair: 0, denominatorFullScope: 430, frozenRows: rows.length, rows, note: 'Only the five user-approved source-repaired rows are frozen here. The other 425 full-scope rows still require independent solution freeze; this ledger does not claim full-scope PASS.' };
fs.writeFileSync(OUTPUT, `${JSON.stringify(output, null, 2)}\n`, 'utf8'); console.log(JSON.stringify({ status: output.status, denominatorFullScope: output.denominatorFullScope, frozenRows: output.frozenRows, sourceHoldCountAfterRepair: output.sourceHoldCountAfterRepair }, null, 2));
