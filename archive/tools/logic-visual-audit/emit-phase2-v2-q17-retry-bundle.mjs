import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const OUT = path.join(ROOT, 'archive', 'tools', 'logic-visual-audit', 'reports');
const questionUid = 'archive/exams/original/high/h1/2mid/22_매산고_2학기_중간_고1_기출.js|22_매산고_2학기_중간_고1_기출|17';
const artifactPath = 'assets/images/22_매산고_2학기_중간_고1_기출/q17-solution.svg';
const absolute = path.join(ROOT, 'archive', artifactPath.replaceAll('/', path.sep));
const bytes = fs.readFileSync(absolute);
const artifactSha256 = `sha256:${crypto.createHash('sha256').update(bytes).digest('hex')}`;
const item = { questionUid, artifactPath, artifactExists: true, artifactSha256, mimeType: 'image/svg+xml' };
const output = {
  bundleType: 'V2_ARTIFACT_ONLY_LOGIC_VISUAL_PHASE2_RETRY',
  contractVersion: 'v1',
  priorReviewVisibility: 'NONE',
  visibility: { question: false, answer: false, solution: false, expectedFact: false, alt: false, caption: false, builderMetadata: false, previousVerdict: false },
  items: [item],
  bundleSha: `sha256:${crypto.createHash('sha256').update(JSON.stringify([item])).digest('hex')}`
};
fs.writeFileSync(path.join(OUT, 'phase2_v2_artifact_only_q17_retry.json'), JSON.stringify(output, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({ status: 'V2_RETRY_BUNDLE_READY', questionUid, artifactSha256, bundleSha: output.bundleSha }, null, 2));
