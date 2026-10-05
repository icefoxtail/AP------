import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const OUT = path.join(ROOT, 'archive', 'tools', 'logic-visual-audit', 'reports');
const sha = (value) => `sha256:${crypto.createHash('sha256').update(Buffer.isBuffer(value) ? value : JSON.stringify(value)).digest('hex')}`;
const required = [
  ['22_복성고_2학기_중간_고1_기출', 9],
  ['22_제일고_2학기_중간_고1_기출', 20],
  ['22_팔마고_2학기_중간_고1_기출', 18],
  ['22_효천고_2학기_중간_고1_기출', 10],
  ['22_효천고_2학기_중간_고1_기출', 11],
  ['22_효천고_2학기_중간_고1_기출', 12]
];
const inputArg = process.argv.indexOf('--input');
const inputPath = inputArg >= 0 ? path.resolve(process.argv[inputArg + 1] || '') : null;
let supplied = null;
if (inputPath && fs.existsSync(inputPath)) supplied = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
const suppliedByUid = new Map((supplied?.entries || []).map((entry) => [entry.questionUid, entry]));
const rows = required.map(([examId, qid]) => {
  const questionUid = `archive/exams/original/high/h1/2mid/${examId}.js|${examId}|${qid}`;
  const entry = suppliedByUid.get(questionUid);
  return entry ? { ...entry, questionUid } : {
    questionUid,
    status: 'BLOCKED_REAL_RENDER_EVIDENCE_REQUIRED',
    issues: ['desktopViewport_missing', 'mobileViewport_missing', 'screenshotSha_missing', 'accessibilitySnapshotSha_missing', 'actualBrowserWitness_missing']
  };
});
const validEntry = (entry) => entry.status === 'PASS' && entry.actualBrowser === true && entry.desktopViewport?.width >= 1280 && entry.mobileViewport?.width >= 390 && entry.screenshotSha && entry.accessibilitySnapshotSha && entry.inputSha && entry.artifactSha;
const out = {
  generatedAtKst: '2026-09-06',
  phase: 'LOGIC_VISUAL_PHASE_2_BATCH_11_QUALIFICATION_RENDER',
  status: rows.every(validEntry) ? 'PASS_QUALIFICATION_RENDER_OBSERVED' : 'BLOCKED_REAL_RENDER_EVIDENCE_REQUIRED',
  renderEnvironment: supplied?.renderEnvironment ?? 'No actual browser witness supplied; synthetic URL/status claims are forbidden.',
  renderedRequiredCount: rows.filter(validEntry).length,
  exemptNoRenderCount: 8,
  commonCoreDStatus: rows.every(validEntry) ? 'PASS_REAL_BROWSER_WITNESS' : 'BLOCKED_REAL_BROWSER_WITNESS_MISSING',
  entries: rows,
  reportSha: sha(rows)
};
fs.writeFileSync(path.join(OUT, 'phase2_batch_11_qualification_render.json'), JSON.stringify(out, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({ status: out.status, renderedRequiredCount: out.renderedRequiredCount, exemptNoRenderCount: out.exemptNoRenderCount, reportSha: out.reportSha }, null, 2));
if (out.status !== 'PASS_QUALIFICATION_RENDER_OBSERVED') process.exitCode = 1;
