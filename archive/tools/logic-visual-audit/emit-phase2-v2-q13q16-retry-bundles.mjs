import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const OUT = path.join(ROOT, 'archive', 'tools', 'logic-visual-audit', 'reports');
const rows = [
  { questionUid: 'archive/exams/original/high/h1/2mid/22_금당고_2학기_중간_고1_기출.js|22_금당고_2학기_중간_고1_기출|13', artifactPath: 'assets/images/22_금당고_2학기_중간_고1_기출/q13-solution.svg' },
  { questionUid: 'archive/exams/original/high/h1/2mid/22_금당고_2학기_중간_고1_기출.js|22_금당고_2학기_중간_고1_기출|16', artifactPath: 'assets/images/22_금당고_2학기_중간_고1_기출/q16-solution.svg' }
];
const sha256 = (bytes) => `sha256:${crypto.createHash('sha256').update(bytes).digest('hex')}`;
const items = rows.map((row) => { const bytes = fs.readFileSync(path.join(ROOT, 'archive', row.artifactPath.replaceAll('/', path.sep))); return { ...row, artifactExists: true, artifactSha256: sha256(bytes), mimeType: 'image/svg+xml' }; });
const output = { bundleType: 'V2_ARTIFACT_ONLY_LOGIC_VISUAL_PHASE2_RETRY', contractVersion: 'v1', priorReviewVisibility: 'NONE', visibility: { question: false, answer: false, solution: false, expectedFact: false, alt: false, caption: false, builderMetadata: false, previousVerdict: false }, items, bundleSha: `sha256:${crypto.createHash('sha256').update(JSON.stringify(items)).digest('hex')}` };
fs.writeFileSync(path.join(OUT, 'phase2_v2_artifact_only_q13q16_retry.json'), JSON.stringify(output, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({ status: 'V2_RETRY_BUNDLE_READY', items, bundleSha: output.bundleSha }, null, 2));
