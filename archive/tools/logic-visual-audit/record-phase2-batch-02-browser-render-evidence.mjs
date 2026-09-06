import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const OUT = path.join(ROOT, 'archive', 'tools', 'logic-visual-audit', 'reports');
const sha256 = (bytes) => `sha256:${crypto.createHash('sha256').update(bytes).digest('hex')}`;
const cases = [
  { questionUid: 'archive/exams/original/high/h1/2mid/22_금당고_2학기_중간_고1_기출.js|22_금당고_2학기_중간_고1_기출|13', artifactPath: 'archive/assets/images/22_금당고_2학기_중간_고1_기출/q13-solution.svg', visualInspection: 'U boundary, red A−B, orange B−A, neutral overlap/outside remainder, and sum 27 are visible without clipping.' },
  { questionUid: 'archive/exams/original/high/h1/2mid/22_금당고_2학기_중간_고1_기출.js|22_금당고_2학기_중간_고1_기출|16', artifactPath: 'archive/assets/images/22_금당고_2학기_중간_고1_기출/q16-solution.svg', visualInspection: 'Forced 64, six-element free remainder, explicit forbidden empty selection, parity rule, and total 31 are visible without clipping.' },
  { questionUid: 'archive/exams/original/high/h1/2mid/22_매산고_2학기_중간_고1_기출.js|22_매산고_2학기_중간_고1_기출|6', artifactPath: 'archive/assets/images/22_매산고_2학기_중간_고1_기출/q06-solution.svg', visualInspection: 'The four-row table visibly separates universe, forced, forbidden, and free elements, with 2²=4 and no clipping.' }
];
const results = cases.map((item) => ({ ...item, artifactSha: sha256(fs.readFileSync(path.join(ROOT, item.artifactPath.replaceAll('/', path.sep)))), renderStatus: 'PASS_OBSERVED_CUA_LOCALHOST', clipping: 'PASS_OBSERVED', collision: 'PASS_OBSERVED', glyph: 'PASS_OBSERVED', grayscale: 'PASS_OBSERVED' }));
const output = { generatedAtKst: '2026-09-05', phase: 'LOGIC_VISUAL_PHASE_2_BATCH_02_QUALIFICATION_RENDER', renderSurface: 'Chrome via CUA against localhost static server http://127.0.0.1:8765', inputPolicyNote: 'file:// navigation was blocked; localhost static serving was used for current workspace bytes.', status: 'PASS_QUALIFICATION_RENDER_OBSERVED', commonCoreDStatus: 'SEPARATE_AUTHORITY_NOT_FULL_ENGINE_SEAL', resultCount: results.length, results, reportSha: `sha256:${crypto.createHash('sha256').update(JSON.stringify(results)).digest('hex')}` };
fs.writeFileSync(path.join(OUT, 'phase2_batch_02_qualification_render.json'), JSON.stringify(output, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({ status: output.status, resultCount: output.resultCount, reportSha: output.reportSha }, null, 2));
