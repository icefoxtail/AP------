import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sha256 } from './lib/canonicalize.mjs';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const OUT = path.join(ROOT, 'archive/tools/logic-visual-audit/reports');
const triage = JSON.parse(fs.readFileSync(path.join(OUT, 'v1_independent_triage.json'), 'utf8'));
const compatibility = { SHOULD_BE_REQUIRED: 'VISUAL_REQUIRED', MAY_BE_OPTIONAL: 'VISUAL_OPTIONAL', SHOULD_BE_EXEMPT: 'VISUAL_EXEMPT' };
const requirements = {}; const adjudications = {};
for (const entry of triage.entries) {
  if (entry.expectedVisualRequirementSignal === 'SOURCE_BLOCKED') { requirements[entry.questionUid] = null; adjudications[entry.questionUid] = { status: 'UNRESOLVED', finalVisualRequirement: null, reason: 'SOURCE_BLOCKED_FROM_V1', evidenceRef: 'reports/v1_independent_triage.json', reviewedBy: 'V1_EXPECTED', reviewedAt: '2026-09-05' }; }
  else { requirements[entry.questionUid] = compatibility[entry.expectedVisualRequirementSignal]; adjudications[entry.questionUid] = { status: 'RESOLVED', finalVisualRequirement: requirements[entry.questionUid], reason: 'V1_SOURCE_ONLY_TRIAGE_PARITY_PENDING_BUILDER_COMPARE', evidenceRef: 'reports/v1_independent_triage.json', reviewedBy: 'V1_EXPECTED', reviewedAt: '2026-09-05' }; }
}
const output = { generatedAtKst: '2026-09-05', status: Object.values(adjudications).some((item) => item.status === 'UNRESOLVED') ? 'UNRESOLVED_SOURCE_BLOCKED' : 'RESOLVED', targetCount: triage.reviewedCount, reviewedUidSetSha: triage.reviewedUidSetSha, finalVisualRequirementMapSha: sha256(requirements), sourceBlockedUidSetSha: sha256(Object.entries(adjudications).filter(([, item]) => item.status === 'UNRESOLVED').map(([uid]) => uid).sort()), requirements, adjudications };
fs.writeFileSync(path.join(OUT, 'final_visual_requirement_map.json'), JSON.stringify(output, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({ status: output.status, targetCount: output.targetCount, resolvedCount: Object.values(adjudications).filter((item) => item.status === 'RESOLVED').length, unresolvedCount: Object.values(adjudications).filter((item) => item.status === 'UNRESOLVED').length, finalVisualRequirementMapSha: output.finalVisualRequirementMapSha }, null, 2));
