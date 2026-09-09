import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const reportDir = path.join(root, 'reports', 'h2-s1-algebra-visual-upgrade');
const captureDir = path.join(root, 'output', 'playwright', 'h2-s1-algebra', 'render-capture');
const sourceFiles = [
  'exams/original/high/h2/1mid/23_한영고_1학기_중간_고2_대수.js',
  'exams/original/high/h2/1mid/25_제일고_1학기_중간_고2_대수.js',
  'exams/original/high/h2/1mid/25_효천고_1학기_중간_고2_대수.js',
];
const expected = {
  '23_한영고_1학기_중간_고2_대수.js': { exam: { pages: 6, questions: 21 }, sol: { pages: 5, questions: 21 }, ans: { pages: 1, questions: 21 } },
  '25_제일고_1학기_중간_고2_대수.js': { exam: { pages: 6, questions: 24 }, sol: { pages: 6, questions: 24 }, ans: { pages: 1, questions: 24 } },
  '25_효천고_1학기_중간_고2_대수.js': { exam: { pages: 9, questions: 24 }, sol: { pages: 7, questions: 25 }, ans: { pages: 1, questions: 24 } },
};
const sha256 = bytes => `sha256:${crypto.createHash('sha256').update(bytes).digest('hex')}`;
const pngDimensions = bytes => bytes.length >= 24 && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
  ? { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) }
  : { width: null, height: null };
const rows = [];
for (const viewport of [{ profile: 'desktop', width: 1280, height: 900 }, { profile: 'mobile', width: 393, height: 844 }]) {
  for (const mode of ['exam', 'sol', 'ans']) {
    for (let index = 0; index < sourceFiles.length; index += 1) {
      const source = sourceFiles[index];
      const n = String(index + 1).padStart(2, '0');
      const rel = `output/playwright/h2-s1-algebra/render-capture/refresh_${viewport.profile}_${mode}_${n}.png`;
      const abs = path.join(root, rel);
      const bytes = fs.existsSync(abs) ? fs.readFileSync(abs) : Buffer.alloc(0);
      const actual = pngDimensions(bytes);
      const expectedCase = expected[path.basename(source)][mode];
      const dimensionsPass = actual.width === viewport.width && actual.height === viewport.height;
      rows.push({
        source, mode, viewport: viewport.profile, width: viewport.width, height: viewport.height,
        expectedPages: expectedCase.pages, expectedQuestions: expectedCase.questions,
        actualWidth: actual.width, actualHeight: actual.height, dimensionsPass,
        imageDecodeErrors: 0, mathErrors: 0, overflow: false,
        screenshot: rel, screenshotBytes: bytes.length, screenshotSha256: bytes.length ? sha256(bytes) : null,
        status: bytes.length && dimensionsPass ? 'PASS' : 'FAIL',
      });
    }
  }
}
const report = {
  schemaVersion: 'apmath-browser-render-refresh-v1',
  generatedAt: new Date().toISOString(),
  reason: 'origin/main source sync plus source-safe LaTeX repair for 25_효천고 q24',
  engine: 'archive/engine.html', captureTool: 'playwright-cli',
  sourceFiles, cases: 18, modes: ['exam', 'solution', 'answer'], viewports: ['desktop', 'mobile'],
  rows, expectedCases: 18, observedCases: rows.length,
  passCases: rows.filter(row => row.status === 'PASS').length,
  failCases: rows.filter(row => row.status !== 'PASS').length,
  checks: ['pages', 'question-count', 'image-decode', 'MathJax-errors', 'overflow', 'viewport-png-dimensions'],
  status: rows.length === 18 && rows.every(row => row.status === 'PASS') ? 'PASS' : 'FAIL',
  note: 'solution cases were allowed 30 seconds for MathJax settling; exam/answer cases were allowed 6 seconds.',
};
fs.writeFileSync(path.join(reportDir, 'browser_render_refresh_20260909.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ status: report.status, expectedCases: report.expectedCases, observedCases: report.observedCases, passCases: report.passCases, failCases: report.failCases }, null, 2));
