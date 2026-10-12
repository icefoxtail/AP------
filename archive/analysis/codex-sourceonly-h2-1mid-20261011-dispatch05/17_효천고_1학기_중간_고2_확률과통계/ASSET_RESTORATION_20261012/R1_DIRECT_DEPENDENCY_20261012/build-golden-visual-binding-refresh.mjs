import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';

const root = process.cwd();
const resolve = value => path.resolve(root, value);
const shaBytes = value => crypto.createHash('sha256').update(value).digest('hex');
const shaFile = file => shaBytes(fs.readFileSync(file));
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const writeFresh = (file, value) => {
  const absolute = resolve(file);
  if (fs.existsSync(absolute)) throw new Error(`OUTPUT_EXISTS:${file}`);
  fs.writeFileSync(absolute, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' });
  return { path: absolute, sha256: shaFile(absolute) };
};

const examUid = '17_효천고_1학기_중간_고2_확률과통계';
const expectedSourceSha256 = '97d37e06747b4dff432b999a34266a05ac6dd16cfeb92fa6c9e74586cfdf2803';
const dir = 'archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/17_효천고_1학기_중간_고2_확률과통계/ASSET_RESTORATION_20261012/R1_DIRECT_DEPENDENCY_20261012';
const boundEvidencePath = `${dir}/R1.evidence.asset-restoration.bound.json`;
const boundEvidence = readJson(resolve(boundEvidencePath));
const expectedFailureEvidenceSha256 = 'f516fdd3bca0fd55e55b5c856b3a344d3356c14a23603f7c7185e855e3c83e29';
const expectedFailureReportSha256 = '6040be9d8be0e4f85896045eda3147d6513ba6e11864afeb14bce8cbe67e021f';
const failureEvidenceFile = resolve(boundEvidencePath);
const failureReportFile = resolve(`${dir}/R1.generic.raw.stdout.json`);
if (shaFile(failureEvidenceFile) !== expectedFailureEvidenceSha256 || shaFile(failureReportFile) !== expectedFailureReportSha256) throw new Error('PRIOR_FAIL_PROOF_MUST_REMAIN_IDENTICAL');

const samples = [
  {
    path: 'archive/exams/original/high/h1/2mid/25_매산여고_2학기_중간_고1_기출.js',
    qid: 12,
    expectedRawSha256: '7f283c40ccf322a73079324f53b161315ab142579b80790de4469008330be156',
    expectedSolutionSha256: 'a555355216573e25a87a2b09d6164a6f02b0d688bc01e0bacac1eca42dead171',
    expectedVisualSha256: '5ffb4c6c9013f95bed608dc656f980001f175e4d0ceb12cd1b287ba747440555',
    expectedImageRef: 'assets/images/25_매산여고_2학기_중간_고1_기출/q12-solution.svg',
    png: `${dir}/GOLDEN_VISUAL_BINDING_REFRESH_20261012/maesan-q12-solution.png`,
    observation: 'Current solution moves the circle center from (a,b) to (a−4,b−2), keeps radius a, excludes a≥4, obtains a=2, then uses b>0 to select b=4. Static SVG view shows the circle tangent to both coordinate axes, labels C(−2,2), T1 and T2, and a callout whose equations follow the same case split to a+b=6. ImageMagick static raster only; no browser render claim.'
  },
  {
    path: 'archive/exams/original/high/h1/2mid/25_효천고_2학기_중간_고1_기출.js',
    qid: 4,
    expectedRawSha256: '80cc1d0d2af2a76471441583075d0c2a04f62986d9ac95349c4985a9b2f3e54c',
    expectedSolutionSha256: 'acdb76bc6092e60c215baaf235516b6fd1a7777ffc9d20cb1f134a95a7043cdf',
    expectedVisualSha256: 'e8cffa56d1c16824f73bafa4a4cb5828735f070b6689e033f773682a7b0c791a',
    expectedImageRef: 'assets/images/25_효천고_2학기_중간_고1_기출/q04-solution.svg',
    png: `${dir}/GOLDEN_VISUAL_BINDING_REFRESH_20261012/hyocheon-q04-solution.png`,
    observation: 'Current solution derives both tangents y=x±√10 from the distance condition and identifies their y-axis intersections A and B before evaluating AB=2√10. Static SVG view shows the circle centered at O, radius √5, both parallel tangent lines, A/B on the y-axis, and the marked segment length. The ImageMagick fallback substituted some title glyphs; source SVG text retains the intended labels. Static review only; no browser render claim.'
  },
  {
    path: 'archive/exams/original/high/h1/2mid/25_효천고_2학기_중간_고1_기출.js',
    qid: 11,
    expectedRawSha256: '80cc1d0d2af2a76471441583075d0c2a04f62986d9ac95349c4985a9b2f3e54c',
    expectedSolutionSha256: '9f367d34825e18314d4a2e007296c98c5753fbaf0cfe7e26eb2ee6ef7ebd8abd',
    expectedVisualSha256: 'd05851bb0476a3a3863bf45b3e29e7a0fe2d699be1fc6b5b66d6aaebac535ed0',
    expectedImageRef: 'assets/images/25_효천고_2학기_중간_고1_기출/q11-solution.svg',
    png: `${dir}/GOLDEN_VISUAL_BINDING_REFRESH_20261012/hyocheon-q11-solution.png`,
    observation: 'Current solution converts the distance-to-line condition into |2a−3|/√2≤1/3 and derives the interval endpoints m and M. Static SVG view places C(m,m) and C(M,M) along y=x, shows equal radius 1/3 circles tangent to x+y=3 at T, and labels m≤a≤M. ImageMagick fallback substituted some math text glyphs; source SVG text retains the intended labels. Static review only; no browser render claim.'
  }
];

const readSamples = [];
for (const spec of samples) {
  const jsPath = resolve(spec.path);
  const bytes = fs.readFileSync(jsPath);
  const rawSha256 = shaBytes(bytes);
  if (rawSha256 !== spec.expectedRawSha256) throw new Error(`GOLDEN_SAMPLE_RAW_SHA_MISMATCH:${spec.qid}`);
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(bytes.toString('utf8'), sandbox, { filename: jsPath, timeout: 5000 });
  const bank = sandbox.window.questionBank || sandbox.window.questions;
  const question = Array.isArray(bank) ? bank.find(row => Number(row.id) === spec.qid) : null;
  if (!question) throw new Error(`SELECTED_GOLDEN_QID_MISSING:${spec.qid}`);
  const solutionSha256 = shaBytes(Buffer.from(String(question.solution ?? ''), 'utf8'));
  if (solutionSha256 !== spec.expectedSolutionSha256) throw new Error(`GOLDEN_SOLUTION_SHA_MISMATCH:${spec.qid}`);
  if (question.solutionImage !== spec.expectedImageRef) throw new Error(`GOLDEN_SOLUTION_IMAGE_REF_MISMATCH:${spec.qid}`);
  const svgPath = resolve(`archive/${spec.expectedImageRef}`);
  const visualSha256 = shaFile(svgPath);
  if (visualSha256 !== spec.expectedVisualSha256) throw new Error(`GOLDEN_VISUAL_SHA_MISMATCH:${spec.qid}`);
  const pngPath = resolve(spec.png);
  if (!fs.existsSync(pngPath)) throw new Error(`STATIC_VISUAL_REVIEW_IMAGE_MISSING:${spec.qid}`);
  readSamples.push({
    samplePath: spec.path,
    sampleRawSha256: rawSha256,
    qid: spec.qid,
    solutionSha256,
    solutionImageRef: spec.expectedImageRef,
    visualSha256,
    staticPng: { path: pngPath, sha256: shaFile(pngPath) },
    observation: spec.observation
  });
}

const staticReview = {
  schemaVersion: 'JS_ARCHIVE_GOLDEN_STATIC_VISUAL_REVIEW_V1',
  qualityContractVersion: 'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',
  executionLine: 'CODEX',
  targetExamUid: examUid,
  currentTargetSourceSha256: expectedSourceSha256,
  renderer: {
    name: 'ImageMagick',
    version: '7.1.2-21 Q16-HDRI x64 c86de04:20260421',
    mode: 'offline static SVG-to-PNG inspection',
    fontWarning: 'ImageMagick could not load the declared STIX Two Math/Cambria Math/Times New Roman font stack and fell back to Sans for some glyphs.',
    browserRenderStatus: 'NOT_RUN_BROWSER_POLICY_BLOCKED',
    browserAttemptRecord: { path: `${dir}/GOLDEN_VISUAL_BINDING_REFRESH_20261012/browser-preview-blocked.json`, sha256: shaFile(resolve(`${dir}/GOLDEN_VISUAL_BINDING_REFRESH_20261012/browser-preview-blocked.json`)) }
  },
  selectedItems: readSamples,
  scope: 'Only the three Golden items selected by the same-stage R1 correction assignment were read. No target qids outside q10–q12 or other Golden qids were opened.'
};
const staticReviewRef = writeFresh(`${dir}/R1.golden.static-visual-review.json`, staticReview);

const revisedEvidence = structuredClone(boundEvidence);
for (const sample of revisedEvidence.goldenCalibration.samples ?? []) {
  for (const item of sample.items ?? []) {
    const refreshed = readSamples.find(row => row.samplePath === sample.path && row.qid === Number(item.qid));
    if (!refreshed) continue;
    if (sample.sha256 !== refreshed.sampleRawSha256 || item.solutionSha256 !== refreshed.solutionSha256) throw new Error(`GOLDEN_EVIDENCE_IDENTITY_MISMATCH:${refreshed.qid}`);
    item.visualSha256 = refreshed.visualSha256;
    item.observation = refreshed.observation;
    item.staticVisualReview = { path: staticReviewRef.path, sha256: staticReviewRef.sha256, renderMode: 'STATIC_IMAGE_MAGICK_ONLY' };
  }
}
revisedEvidence.goldenCalibration.staticVisualReview = { path: staticReviewRef.path, sha256: staticReviewRef.sha256, renderMode: 'STATIC_IMAGE_MAGICK_ONLY', browserRenderStatus: 'NOT_RUN_BROWSER_POLICY_BLOCKED' };
const outputRef = writeFresh(`${dir}/R1.evidence.asset-restoration.golden-refresh.draft.json`, revisedEvidence);

console.log(JSON.stringify({
  ok: true,
  currentTargetSourceSha256: expectedSourceSha256,
  preservedFail: { evidenceSha256: shaFile(failureEvidenceFile), reportSha256: shaFile(failureReportFile) },
  refreshedItems: readSamples.map(({ samplePath, sampleRawSha256, qid, solutionSha256, solutionImageRef, visualSha256, staticPng }) => ({ samplePath, sampleRawSha256, qid, solutionSha256, solutionImageRef, visualSha256, staticPng })),
  outputs: { staticReview: staticReviewRef, evidenceDraft: outputRef }
}, null, 2));
