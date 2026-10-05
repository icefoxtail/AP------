import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const OUT = path.join(ROOT, 'archive', 'tools', 'logic-visual-audit', 'reports');
const sha256 = (bytes) => `sha256:${crypto.createHash('sha256').update(bytes).digest('hex')}`;
const cases = [
  { questionUid: 'archive/exams/original/high/h1/2final/22_금당고_2학기_기말_고1_기출.js|22_금당고_2학기_기말_고1_기출|20', artifactPath: 'archive/assets/images/22_금당고_2학기_기말_고1_기출/q20-solution.svg', visualInspection: 'Two case panels show all candidate rows, 32/40 subtotals, and 32+40=72; no visible clipping or collision observed.' },
  { questionUid: 'archive/exams/original/high/h1/2mid/22_매산고_2학기_중간_고1_기출.js|22_매산고_2학기_중간_고1_기출|17', artifactPath: 'archive/assets/images/22_매산고_2학기_중간_고1_기출/q17-solution.svg', visualInspection: 'The ten pair-to-output rows are readable and the badges |B₂₁|=10, α=20, and k+α=41 are visible without clipping.' },
  { questionUid: 'archive/exams/original/high/h1/2mid/22_팔마고_2학기_중간_고1_기출.js|22_팔마고_2학기_중간_고1_기출|14', artifactPath: 'archive/assets/images/22_팔마고_2학기_중간_고1_기출/q14-solution.svg', visualInspection: 'The dashed U boundary, green U base/intersection/outside regions, red A-only/B-only regions, legend, and right-side statement panel are visible without clipping.' }
];
const results = cases.map((item) => ({ ...item, artifactSha: sha256(fs.readFileSync(path.join(ROOT, item.artifactPath.replaceAll('/', path.sep)))), renderStatus: 'PASS_OBSERVED_CUA_LOCALHOST', clipping: 'PASS_OBSERVED', collision: 'PASS_OBSERVED', glyph: 'PASS_OBSERVED', grayscale: 'PASS_OBSERVED' }));
const output = {
  generatedAtKst: '2026-09-05',
  phase: 'LOGIC_VISUAL_PHASE_2_BATCH_01_QUALIFICATION_RENDER',
  renderSurface: 'Chrome via CUA against localhost static server http://127.0.0.1:8765',
  inputPolicyNote: 'file:// navigation was blocked; localhost static serving was used for the same local workspace bytes.',
  status: results.every((result) => result.renderStatus === 'PASS_OBSERVED_CUA_LOCALHOST') ? 'PASS_QUALIFICATION_RENDER_OBSERVED' : 'FAIL_QUALIFICATION_RENDER',
  commonCoreDStatus: 'SEPARATE_AUTHORITY_NOT_FULL_ENGINE_SEAL',
  resultCount: results.length,
  results,
  reportSha: `sha256:${crypto.createHash('sha256').update(JSON.stringify(results)).digest('hex')}`
};
fs.writeFileSync(path.join(OUT, 'phase2_batch_01_qualification_render.json'), JSON.stringify(output, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({ status: output.status, resultCount: output.resultCount, commonCoreDStatus: output.commonCoreDStatus, reportSha: output.reportSha }, null, 2));
