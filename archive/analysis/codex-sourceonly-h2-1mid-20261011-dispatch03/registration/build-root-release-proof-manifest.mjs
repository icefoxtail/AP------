import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
const runRoot = path.join(root, 'archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch03');
const outputPath = path.join(runRoot, 'ROOT.release-proof-manifest.rev1.json');
const scopeFiles = [
  'archive/tools/compile-r1-basic-assignment-source-links.mjs',
  'archive/data/archive2-canonical-input-manifest.json',
  'archive/data/archive2-catalog.json',
  'archive/data/basic-scope-source-links.json',
  'archive/data/basic-scope-parent-links.json',
  'archive/data/question_identity_map.json',
  'archive/data/question_metadata.json',
  'archive/db.js',
  'archive/question-identity.js',
  'archive/question-index-audit.md',
  'archive/question-index-report.md',
  'archive/question-index.js',
];
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const walk = directory => fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
  const full = path.join(directory, entry.name);
  if (entry.isDirectory()) return walk(full);
  if (entry.isFile()) return [full];
  return [];
});
const relative = file => path.relative(root, file).split(path.sep).join('/');
const selected = new Set();
const addPath = value => {
  if (typeof value !== 'string' || !value.trim()) return;
  let absolute = path.resolve(root, value);
  let rel = path.relative(root, absolute);
  if (rel === '..' || rel.startsWith(`..${path.sep}`) || path.isAbsolute(rel)) {
    const normalized = value.replaceAll('\\', '/');
    const match = /(?:^|\/)(archive|docs)\/(.+)$/.exec(normalized);
    if (!match) return;
    absolute = path.resolve(root, match[1], match[2]);
    rel = path.relative(root, absolute);
  }
  if (rel === '..' || rel.startsWith(`..${path.sep}`) || path.isAbsolute(rel) || !fs.existsSync(absolute) || !fs.statSync(absolute).isFile()) return;
  selected.add(absolute);
};
const addDirectory = directory => {
  const absolute = path.resolve(root, directory);
  if (fs.existsSync(absolute) && fs.statSync(absolute).isDirectory()) for (const file of walk(absolute)) selected.add(file);
};
const addReferencedPaths = (value, depth = 0) => {
  if (depth > 12 || !value || typeof value !== 'object') return;
  if (Array.isArray(value)) { for (const row of value) addReferencedPaths(row, depth + 1); return; }
  for (const [key, child] of Object.entries(value)) {
    if (['path', 'evidencePath', 'productionPath', 'assetDirectory', 'sourcePath'].includes(key) && typeof child === 'string') {
      if (fs.existsSync(path.resolve(root, child)) && fs.statSync(path.resolve(root, child)).isDirectory()) addDirectory(child);
      else addPath(child);
    }
    if (child && typeof child === 'object') addReferencedPaths(child, depth + 1);
  }
};
const lockedRosterPath = 'archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch03/registration-roster.locked.rev2.json';
const lockedRoster = JSON.parse(fs.readFileSync(path.join(root, lockedRosterPath), 'utf8'));
const dispatcherPath = 'archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch03/dispatcher-state.json';
const dispatcher = JSON.parse(fs.readFileSync(path.join(root, dispatcherPath), 'utf8'));
for (const path of [
  'archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch03/roster.json',
  'archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch03/registration-roster.locked.rev2.json',
  'archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch03/ROOT.target-registration-producer-authority.rev2.json',
  'archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch03/dispatcher-state.json',
]) addPath(path);
addDirectory('archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch03/registration');
addReferencedPaths(lockedRoster.rows);
for (const row of dispatcher.roster || []) {
  addPath(row.evidencePath);
  addPath(row.productionPath);
}
for (const row of lockedRoster.rows || []) addReferencedPaths(row.stageProofs);
for (const target of JSON.parse(fs.readFileSync(path.join(runRoot, 'registration/basic-parent-source-link-compile-manifest.rev1.json'), 'utf8')).targets) {
  addPath(target.supplementPath);
  addPath(target.completionEventPath);
  const event = JSON.parse(fs.readFileSync(path.resolve(root, target.completionEventPath), 'utf8'));
  addReferencedPaths(event);
}
for (const uid of (lockedRoster.rows || []).map(row => row.examUid)) {
  addDirectory(`archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch03/${uid}.R3.durable`);
  const safeReceipt = `archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch03/${uid}.R3.render-receipt.safe-path.rev2.json`;
  const safeManifest = `archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch03/${uid}.ROOT.safe-path-render-rebind.rev2.json`;
  addPath(safeReceipt);
  addPath(safeManifest);
  if (fs.existsSync(path.resolve(root, safeReceipt))) addReferencedPaths(JSON.parse(fs.readFileSync(path.resolve(root, safeReceipt), 'utf8')));
  if (fs.existsSync(path.resolve(root, safeManifest))) addReferencedPaths(JSON.parse(fs.readFileSync(path.resolve(root, safeManifest), 'utf8')));
}
const runFiles = [...selected].filter(file => {
  if (file === outputPath) return false;
  const rel = relative(file);
  return !rel.startsWith('archive/assets/') && !rel.startsWith('archive/exams/original/') &&
    !rel.startsWith('archive/data/') && !rel.startsWith('docs/rules/') &&
    !rel.startsWith('.tmp/') && !rel.includes('/.tmp/') &&
    !rel.endsWith('/archive2-catalog.before.json') &&
    !/\.R3\.durable\/aux\//.test(rel) &&
    !/\.R3\.durable\/(capture-review|machine-capture)\.durable\.json$/.test(rel);
}).map(file => {
  const bytes = fs.readFileSync(file);
  return { path: relative(file), bytes: bytes.length, sha256: sha(bytes) };
}).sort((a, b) => a.path.localeCompare(b.path, 'en'));
for (const row of dispatcher.roster || []) {
  const sourcePath = row.productionPath;
  const assetDir = row.assetDirectory;
  if (sourcePath) scopeFiles.push(sourcePath);
  if (assetDir && fs.existsSync(path.resolve(root, assetDir))) {
    for (const file of walk(path.resolve(root, assetDir))) scopeFiles.push(relative(file));
  }
}
const releaseFiles = [...new Set(scopeFiles)].map(file => {
  const bytes = fs.readFileSync(path.join(root, file));
  return { path: file, bytes: bytes.length, sha256: sha(bytes) };
});
const targetCount = JSON.parse(fs.readFileSync(path.join(runRoot, 'registration/ROOT.target-basic-eligibility.rev1.json'), 'utf8'));
const baseHead = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
const manifest = {
  schemaVersion: 'JS_ARCHIVE_ROOT_RELEASE_PROOF_MANIFEST_V1',
  qualityContractVersion: 'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',
  executionLine: 'CODEX',
  status: 'READY_FOR_MAIN_PUBLICATION',
  baselineBranch: execFileSync('git', ['branch', '--show-current'], { cwd: root, encoding: 'utf8' }).trim(),
  baselineHead: baseHead,
  sourceCommit: 'e2db265d8',
  registrationCompilerCompatibilityCommit: '24ca81b82',
  targetQuestionCount: targetCount.totalQuestions,
  targetAutomaticCount: targetCount.totalAutomatic,
  targetExams: targetCount.exams,
  releaseScopeFiles: releaseFiles,
  runEvidenceFiles: runFiles,
  runEvidenceFileCount: runFiles.length,
  runEvidenceBytes: runFiles.reduce((sum, row) => sum + row.bytes, 0),
  manifestSelfReference: 'Excluded from runEvidenceFiles; SHA-256 is stored in the commit and final closeout receipt.',
  closeoutRequirement: 'Record exact main SHA, successful Pages workflow run, remote readback, and actual student lookup/selection/output browser evidence before MAIN_DONE.',
};
fs.writeFileSync(outputPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ path: relative(outputPath), runEvidenceFileCount: manifest.runEvidenceFileCount, runEvidenceBytes: manifest.runEvidenceBytes, baselineHead: baseHead, targetQuestionCount: manifest.targetQuestionCount, targetAutomaticCount: manifest.targetAutomaticCount }, null, 2));
