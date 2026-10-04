import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sha256 } from './lib/canonicalize.mjs';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const OUT = path.join(ROOT, 'archive/tools/logic-visual-audit/reports');
const file = path.join(OUT, 'final_visual_requirement_map.json');
const map = JSON.parse(fs.readFileSync(file, 'utf8'));
const resolutions = {
  'archive/exams/original/high/h1/2mid/22_금당고_2학기_중간_고1_기출.js|22_금당고_2학기_중간_고1_기출|19': { finalVisualRequirement: 'VISUAL_REQUIRED', reason: 'ORIGINAL_PROBLEM_IMAGE_REVIEWED', evidenceRef: 'archive/assets/images/22_금당고_2학기_중간_고1_기출/q19.png' },
  'archive/exams/original/high/h1/2mid/22_효천고_2학기_중간_고1_기출.js|22_효천고_2학기_중간_고1_기출|15': { finalVisualRequirement: 'VISUAL_REQUIRED', reason: 'ORIGINAL_PROBLEM_IMAGE_TABLE_REVIEWED', evidenceRef: 'archive/assets/images/22_효천고_2학기_중간_고1_기출/q15.png' },
  'archive/exams/original/high/h1/2mid/21_복성고_2학기_중간_고1_기출.js|21_복성고_2학기_중간_고1_기출|21': { finalVisualRequirement: 'VISUAL_REQUIRED', reason: 'ORIGINAL_PROBLEM_IMAGE_GEOMETRY_REVIEWED', evidenceRef: 'archive/assets/images/21_복성고_2학기_중간_고1_기출/q21.png' }
};
for (const [uid, resolution] of Object.entries(resolutions)) map.requirements[uid] = resolution.finalVisualRequirement, map.adjudications[uid] = { status: 'RESOLVED', ...resolution, reviewedBy: 'SOURCE_ADJUDICATOR', reviewedAt: '2026-09-05' };
map.status = Object.values(map.adjudications).some((item) => item.status === 'UNRESOLVED') ? 'UNRESOLVED_SOURCE_BLOCKED' : 'RESOLVED';
map.finalVisualRequirementMapSha = sha256(map.requirements);
map.sourceBlockedUidSetSha = sha256(Object.entries(map.adjudications).filter(([, item]) => item.status === 'UNRESOLVED').map(([uid]) => uid).sort());
fs.writeFileSync(file, JSON.stringify(map, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({ status: map.status, resolved: Object.values(map.adjudications).filter((item) => item.status === 'RESOLVED').length, unresolved: Object.values(map.adjudications).filter((item) => item.status === 'UNRESOLVED').length, finalVisualRequirementMapSha: map.finalVisualRequirementMapSha }, null, 2));
