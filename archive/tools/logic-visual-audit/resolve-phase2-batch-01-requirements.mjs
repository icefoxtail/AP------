import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const OUT = path.join(ROOT, 'archive', 'tools', 'logic-visual-audit', 'reports');
const v1 = JSON.parse(fs.readFileSync(path.join(OUT, 'phase2_v1_independent_batch_01_rule_bound.json'), 'utf8'));
const sha256 = (value) => `sha256:${crypto.createHash('sha256').update(typeof value === 'string' ? value : JSON.stringify(value)).digest('hex')}`;
const q14Uid = 'archive/exams/original/high/h1/2mid/22_팔마고_2학기_중간_고1_기출.js|22_팔마고_2학기_중간_고1_기출|14';
const q17Uid = 'archive/exams/original/high/h1/2mid/22_매산고_2학기_중간_고1_기출.js|22_매산고_2학기_중간_고1_기출|17';
const q20Uid = 'archive/exams/original/high/h1/2final/22_금당고_2학기_기말_고1_기출.js|22_금당고_2학기_기말_고1_기출|20';
const independentByUid = new Map(v1.entries.map((entry) => [entry.questionUid, entry]));
const entries = [
  { questionUid: q20Uid, independentSignal: independentByUid.get(q20Uid)?.expectedVisualRequirementSignal, independentType: independentByUid.get(q20Uid)?.visualType, finalVisualRequirement: 'VISUAL_REQUIRED', finalVisualType: 'SET_CASE_PARTITION', visualAction: 'REBUILD_EXISTING', status: 'RESOLVED', reason: 'Source-only fact requires the two displayed admissible cardinality cases and the pilot instruction explicitly requires the case partition visual.' },
  { questionUid: q17Uid, independentSignal: independentByUid.get(q17Uid)?.expectedVisualRequirementSignal, independentType: independentByUid.get(q17Uid)?.visualType, finalVisualRequirement: 'VISUAL_REQUIRED', finalVisualType: 'SET_CASE_PARTITION', visualAction: 'REBUILD_EXISTING', status: 'RESOLVED', reason: 'Source-only fact requires the collision-pair enumeration that determines the unique minimum; the pilot instruction explicitly requires the question-specific pair visual.' },
  { questionUid: q14Uid, independentSignal: independentByUid.get(q14Uid)?.expectedVisualRequirementSignal, independentType: independentByUid.get(q14Uid)?.visualType, finalVisualRequirement: 'VISUAL_REQUIRED', finalVisualType: 'SET_REGION_VENN_2', visualAction: 'REBUILD_EXISTING', status: 'RESOLVED', reason: 'Independent source-only first pass marked EXEMPT, but the applicable pilot instruction explicitly names q14 as a REBUILD_EXISTING complement/symmetric-difference target; source content contains U, A♥B, three proposition checks, and the 2^6 count. The designated adjudicator resolves the conflict in favor of the stronger applicable pilot requirement.' }
];
const output = {
  generatedAtKst: '2026-09-05',
  phase: 'LOGIC_VISUAL_PHASE_2_BATCH_01_REQUIREMENT_ADJUDICATION',
  status: entries.every((entry) => entry.status === 'RESOLVED') ? 'RESOLVED' : 'UNRESOLVED',
  reviewerRole: 'DESIGNATED_SEMANTIC_ADJUDICATOR',
  priorReviewVisibility: 'V1_RULE_BOUND_FIRST_PASS_ONLY',
  sourceReports: ['reports/phase2_v1_independent_batch_01_rule_bound.json', 'phase2 pilot instruction', 'Semantic Overlay v1.4'],
  pendingCount: entries.filter((entry) => entry.status !== 'RESOLVED').length,
  entries,
  reportSha: sha256(entries)
};
fs.writeFileSync(path.join(OUT, 'phase2_batch_01_requirement_adjudication.json'), JSON.stringify(output, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({ status: output.status, resolvedCount: entries.filter((entry) => entry.status === 'RESOLVED').length, pendingCount: output.pendingCount, reportSha: output.reportSha }, null, 2));
if (output.status !== 'RESOLVED') process.exitCode = 1;
