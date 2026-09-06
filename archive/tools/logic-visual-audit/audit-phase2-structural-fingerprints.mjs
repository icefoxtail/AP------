import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const OUT = path.join(ROOT, 'archive', 'tools', 'logic-visual-audit', 'reports');
const inventory = JSON.parse(fs.readFileSync(path.join(OUT, 'phase2_2022_set_pilot_inventory.json'), 'utf8'));
const hash = (value) => `sha256:${crypto.createHash('sha256').update(value).digest('hex')}`;
const normalize = (svg) => svg
  .replace(/<title[\s\S]*?<\/title>/gi, '')
  .replace(/<desc[\s\S]*?<\/desc>/gi, '')
  .replace(/<text[\s\S]*?<\/text>/gi, '')
  .replace(/\s+(id|aria-labelledby|aria-label|data-[^=]+)="[^"]*"/gi, '')
  .replace(/#[0-9a-f]{3,8}/gi, '#COLOR')
  .replace(/rgba?\([^)]*\)/gi, 'COLOR')
  .replace(/\s+/g, ' ')
  .trim();
const rows = [];
for (const row of inventory.rows) {
  const context = { window: {} };
  const source = path.join(ROOT, row.sourceJsPath.replaceAll('/', path.sep));
  vm.runInNewContext(fs.readFileSync(source, 'utf8'), context, { timeout: 5000 });
  const question = context.window.questionBank.find((candidate) => Number(candidate.id) === Number(row.qid));
  if (!question?.solutionImage) continue;
  const asset = path.join(ROOT, 'archive', question.solutionImage.replaceAll('/', path.sep));
  if (!fs.existsSync(asset) || !asset.endsWith('.svg')) continue;
  const svg = fs.readFileSync(asset, 'utf8');
  rows.push({ questionUid: row.questionUid, artifactPath: question.solutionImage, exactSha: hash(svg), geometryFingerprint: hash(normalize(svg)), textIncludedInSpecificityScan: false });
}
const groups = new Map();
for (const row of rows) {
  if (!groups.has(row.geometryFingerprint)) groups.set(row.geometryFingerprint, []);
  groups.get(row.geometryFingerprint).push(row.questionUid);
}
const candidates = [...groups.entries()].filter(([, questionUids]) => questionUids.length > 1).map(([geometryFingerprint, questionUids]) => ({ geometryFingerprint, questionUids, status: 'REVIEW_REQUIRED_STRUCTURAL_CANDIDATE' }));
const result = {
  generatedAtKst: '2026-09-06',
  phase: 'LOGIC_VISUAL_PHASE_2_STRUCTURAL_FINGERPRINT_AUDIT',
  fingerprintMethod: 'SVG geometry/text-stripped normalized candidate fingerprint; not a semantic equivalence proof',
  scannedArtifactCount: rows.length,
  exactDuplicateCount: [...new Set(rows.map((row) => row.exactSha))].length === rows.length ? 0 : rows.length - new Set(rows.map((row) => row.exactSha)).size,
  structuralCandidateCount: candidates.length,
  candidates,
  status: candidates.length ? 'REVIEW_REQUIRED_STRUCTURAL_CANDIDATES' : 'PASS_NO_STRUCTURAL_CANDIDATES',
  reportSha: hash(JSON.stringify({ rows, candidates }))
};
fs.writeFileSync(path.join(OUT, 'phase2_2022_set_pilot_structural_fingerprint_audit.json'), JSON.stringify(result, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({ status: result.status, scannedArtifactCount: result.scannedArtifactCount, exactDuplicateCount: result.exactDuplicateCount, structuralCandidateCount: result.structuralCandidateCount, reportSha: result.reportSha }, null, 2));
