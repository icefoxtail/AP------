import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const OUT = path.join(ROOT, 'archive', 'tools', 'logic-visual-audit', 'reports');
const v1 = JSON.parse(fs.readFileSync(path.join(OUT, 'phase2_v1_independent_batch_02.json'), 'utf8'));
const sha256 = (value) => `sha256:${crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex')}`;
const q13 = 'archive/exams/original/high/h1/2mid/22_금당고_2학기_중간_고1_기출.js|22_금당고_2학기_중간_고1_기출|13';
const q16 = 'archive/exams/original/high/h1/2mid/22_금당고_2학기_중간_고1_기출.js|22_금당고_2학기_중간_고1_기출|16';
const q6 = 'archive/exams/original/high/h1/2mid/22_매산고_2학기_중간_고1_기출.js|22_매산고_2학기_중간_고1_기출|6';
const firstPass = new Map(v1.entries.map((entry) => [entry.questionUid, entry]));
const entries = [
  { questionUid: q13, independentSignal: firstPass.get(q13)?.expectedVisualRequirementSignal, independentType: firstPass.get(q13)?.visualType, finalVisualRequirement: 'VISUAL_REQUIRED', finalVisualType: 'SET_REGION_VENN_2', visualAction: 'REBUILD_EXISTING', status: 'RESOLVED', reason: 'Source-only visual fact requires U-bound symmetric-difference region membership and the pilot target requires the region visual.' },
  { questionUid: q16, independentSignal: firstPass.get(q16)?.expectedVisualRequirementSignal, independentType: firstPass.get(q16)?.visualType, finalVisualRequirement: 'VISUAL_REQUIRED', finalVisualType: 'SET_FORCE_FORBID_FREE', visualAction: 'REBUILD_EXISTING', status: 'RESOLVED', reason: 'Independent first pass marked EXEMPT, but the applicable pilot instruction explicitly lists q16 as ADD_NEW_VISUAL and the source has a decisive forced/free parity-count structure; adjudicator resolves the conflict as required.' },
  { questionUid: q6, independentSignal: firstPass.get(q6)?.expectedVisualRequirementSignal, independentType: firstPass.get(q6)?.visualType, finalVisualRequirement: 'VISUAL_REQUIRED', finalVisualType: 'SET_FORCE_FORBID_FREE', visualAction: 'KEEP_EXISTING', status: 'RESOLVED', reason: 'Source-only fact requires the forced/forbidden/free bucket partition and the existing artifact visibly encodes all three buckets and 2²=4.' }
];
const output = { generatedAtKst: '2026-09-05', phase: 'LOGIC_VISUAL_PHASE_2_BATCH_02_REQUIREMENT_ADJUDICATION', status: 'RESOLVED', reviewerRole: 'DESIGNATED_SEMANTIC_ADJUDICATOR', priorReviewVisibility: 'V1_FIRST_PASS_AND_PILOT_RULES', pendingCount: 0, entries, reportSha: sha256(entries) };
fs.writeFileSync(path.join(OUT, 'phase2_batch_02_requirement_adjudication.json'), JSON.stringify(output, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({ status: output.status, resolvedCount: entries.length, pendingCount: output.pendingCount, reportSha: output.reportSha }, null, 2));
