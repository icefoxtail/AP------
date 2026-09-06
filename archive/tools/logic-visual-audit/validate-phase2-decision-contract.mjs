import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const OUT = path.join(ROOT, 'archive/tools/logic-visual-audit/reports');
const sha = (value) => `sha256:${crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex')}`;
const invalidationPath = path.join(OUT, 'phase2_batch_11_input_preparation.json');
const invalidated = fs.existsSync(invalidationPath) ? new Set((JSON.parse(fs.readFileSync(invalidationPath, 'utf8')).legacyOutputsInvalidated || []).map((item) => item.path)) : new Set();
const files = fs.readdirSync(OUT).filter((name) => /^phase2_batch_\d+.*requirement_adjudication\.json$/.test(name) && !invalidated.has(name)).sort();
const errors = [];
const requirementEnums = new Set(['VISUAL_REQUIRED', 'VISUAL_OPTIONAL', 'VISUAL_EXEMPT', 'NO_VISUAL']);
const actionEnums = new Set(['NONE', 'KEEP_EXISTING', 'REBUILD_EXISTING', 'ADD', 'ADD_NEW_VISUAL', 'REMOVE_INVALID_VISUAL']);
for (const file of files) {
  let report;
  try { report = JSON.parse(fs.readFileSync(path.join(OUT, file), 'utf8')); } catch (error) { errors.push({ file, code: 'REPORT_INVALID', detail: error.message }); continue; }
  for (const entry of report.entries || []) {
    const requirement = entry.finalVisualRequirement;
    const action = entry.visualAction;
    if (!requirementEnums.has(requirement)) errors.push({ file, questionUid: entry.questionUid, code: 'REQUIREMENT_ENUM_INVALID', value: requirement });
    if (!actionEnums.has(action)) errors.push({ file, questionUid: entry.questionUid, code: 'ACTION_ENUM_INVALID', value: action });
    if (['VISUAL_EXEMPT', 'NO_VISUAL'].includes(requirement) && !['NONE', 'REMOVE_INVALID_VISUAL'].includes(action)) errors.push({ file, questionUid: entry.questionUid, code: 'EXEMPT_REQUIREMENT_ACTION_MISMATCH' });
    if (requirement === 'VISUAL_REQUIRED' && !['KEEP_EXISTING', 'REBUILD_EXISTING', 'ADD', 'ADD_NEW_VISUAL'].includes(action)) errors.push({ file, questionUid: entry.questionUid, code: 'REQUIRED_REQUIREMENT_ACTION_MISMATCH' });
    if (requirement === 'VISUAL_OPTIONAL' && !['NONE', 'KEEP_EXISTING', 'ADD'].includes(action)) errors.push({ file, questionUid: entry.questionUid, code: 'OPTIONAL_REQUIREMENT_ACTION_MISMATCH' });
  }
}
const output = {
  generatedAtKst: '2026-09-06',
  phase: 'LOGIC_VISUAL_PHASE_2_DECISION_REQUIREMENT_ACTION_CONTRACT',
  status: errors.length ? 'FAIL_DECISION_REQUIREMENT_ACTION_CONTRACT' : 'PASS_DECISION_REQUIREMENT_ACTION_CONTRACT',
  reportCount: files.length,
  invalidatedLegacyReports: [...invalidated].sort(),
  errors,
  contract: {
    requirementEnum: [...requirementEnums],
    actionEnum: [...actionEnums],
    requirementAndActionAreDistinctFields: true,
    v1SourceAnswerVisibility: 'FORBIDDEN'
  },
  reportSha: sha({ files, errors })
};
fs.writeFileSync(path.join(OUT, 'phase2_decision_contract_validation.json'), JSON.stringify(output, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({ status: output.status, reportCount: output.reportCount, errorCount: errors.length, reportSha: output.reportSha }, null, 2));
if (errors.length) process.exitCode = 1;
