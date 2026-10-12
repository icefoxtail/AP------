import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const resolve = value => path.resolve(root, value);
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const writeFresh = (file, value) => {
  const absolute = resolve(file);
  if (fs.existsSync(absolute)) throw new Error(`OUTPUT_EXISTS:${file}`);
  fs.writeFileSync(absolute, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' });
  return { path: absolute, sha256: sha(absolute) };
};

const dir = 'archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/17_효천고_1학기_중간_고2_확률과통계/ASSET_RESTORATION_20261012/R1_DIRECT_DEPENDENCY_20261012/R1_Q10_SOLUTION_VISUAL_REVIEW_20261012';
const oldFile = resolve(`${dir}/R1.q10.solution-visual-review.json`);
const manifestFile = resolve(`${dir}/R1.q10.capture-copy-manifest.rev2.json`);
const oldReview = readJson(oldFile);
const manifest = readJson(manifestFile);
if (sha(oldFile) !== 'ab5f62d652aff0406cb33fa90abbc90b4232af0e41981038df0b2f56165ea03e') throw new Error('PRIOR_Q10_REVIEW_SHA_MISMATCH');
if (sha(manifestFile) !== '793ffc7c61438786205302d2c8cb510d9608627b6408cffdefb3b6eb09b59903') throw new Error('DURABLE_CAPTURE_COPY_MANIFEST_SHA_MISMATCH');

const next = structuredClone(oldReview);
const copyByCase = new Map(manifest.cases.map(row => [row.case, row]));
for (const row of next.createCaptureEvidence.sixCases) {
  const copy = copyByCase.get(row.id);
  if (!copy || row.screenshot.sha256 !== copy.sourceSha256) throw new Error(`CAPTURE_CASE_COPY_BINDING_MISMATCH:${row.id}`);
  row.screenshot = {
    path: copy.durablePath,
    sha256: copy.durableSha256,
    originalCreateCapturePath: copy.sourcePath,
    originalCreateCaptureSha256: copy.sourceSha256,
    visuallyOpenedByR1: copy.visuallyReviewed
  };
}
next.createCaptureEvidence.machineCapture = {
  ...next.createCaptureEvidence.machineCapture,
  path: manifest.machineCapture.durablePath,
  sha256: manifest.machineCapture.durableSha256,
  originalCreateCapturePath: manifest.machineCapture.sourcePath,
  status: manifest.machineCapture.status,
  renderPass: false
};
next.createCaptureEvidence.standaloneSvgCapture = {
  ...next.createCaptureEvidence.standaloneSvgCapture,
  path: manifest.standaloneSvgCapture.durablePath,
  sha256: manifest.standaloneSvgCapture.durableSha256,
  originalCreateCapturePath: manifest.standaloneSvgCapture.sourcePath,
  visuallyOpenedByR1: true
};
next.createCaptureEvidence.captureCopyManifest = { path: manifestFile, sha256: sha(manifestFile) };
next.createCaptureEvidence.answerCasesVisualReview = 'NOT_OPENED; machine capture record retained; answer mode has no problem-image or solution-SVG dependency for this visual review.';
next.createCaptureEvidence.captureStatus = 'CAPTURED_REVIEW_REQUIRED';
next.createCaptureEvidence.wholeExamR3RenderClaimed = false;
next.createCaptureEvidence.renderPassClaimed = false;

const result = writeFresh(`${dir}/R1.q10.solution-visual-review.rev1.json`, next);
console.log(JSON.stringify({ path: result.path, sha256: result.sha256, captureCopyManifest: { path: manifestFile, sha256: sha(manifestFile) }, visuallyReviewedCases: manifest.cases.filter(row => row.visuallyReviewed).map(row => row.case), answerScreenshotsOpened: false }, null, 2));
