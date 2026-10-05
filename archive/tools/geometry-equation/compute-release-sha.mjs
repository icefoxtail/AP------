import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const REPORTS = path.join(ROOT, 'reports', 'geometry_equation_20260902');
const ARCHIVE = path.resolve(process.env.GEOMETRY_ARCHIVE_ROOT || path.join(ROOT, 'archive'));
const manifest = JSON.parse(fs.readFileSync(path.join(REPORTS, 'geometry_equation_manifest.json'), 'utf8'));

function sha(value) { return crypto.createHash('sha256').update(value).digest('hex'); }
function shaFile(filePath) { return sha(fs.readFileSync(filePath)); }
function addFile(set, relativePath) {
  const normalized = relativePath.replaceAll('\\', '/').replace(/^\.\//, '');
  const absolute = path.resolve(ARCHIVE, normalized);
  if (absolute === ARCHIVE || !absolute.startsWith(`${ARCHIVE}${path.sep}`)) return;
  if (fs.existsSync(absolute) && fs.statSync(absolute).isFile()) set.add(normalized);
}
const files = new Set();
const sourcePaths = [...new Set(manifest.rows.map((row) => row.sourceJsPath))].sort();
for (const sourceJsPath of sourcePaths) {
  addFile(files, `exams/${sourceJsPath}`);
  const filePath = path.join(ARCHIVE, 'exams', sourceJsPath.replaceAll('/', path.sep));
  const text = fs.readFileSync(filePath, 'utf8');
  for (const match of text.matchAll(/(?:assets\/images\/|\.\.\/assets\/images\/)([^"'\\)\s?]+)/g)) addFile(files, `assets/images/${match[1]}`);
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(text, context, { filename: filePath, timeout: 4000 });
  for (const question of context.window.questionBank || []) {
    addFile(files, question.image || '');
    addFile(files, question.solutionImage || '');
  }
}
// A geometry batch may include a narrowly scoped renderer hotfix.  When that
// hotfix is part of the approved release, include the engine itself in the
// artifact lock instead of leaving the browser behavior outside the SHA.
if (process.env.GEOMETRY_INCLUDE_ENGINE === '1') addFile(files, 'engine.html');
if (process.env.GEOMETRY_INCLUDE_DB_INDEX === '1') {
  addFile(files, 'db.js');
  addFile(files, 'question-index.js');
}
const rows = [...files].sort().map((relativePath) => ({ relativePath, sha256: shaFile(path.join(ARCHIVE, relativePath.replaceAll('/', path.sep))), bytes: fs.statSync(path.join(ARCHIVE, relativePath.replaceAll('/', path.sep))).size }));
const releaseSha = sha(JSON.stringify(rows.map(({ relativePath, sha256: fileSha, bytes }) => ({ relativePath, sha256: fileSha, bytes }))));
const label = process.env.GEOMETRY_RELEASE_LABEL || `S${Date.now()}`;
const output = { status: 'RELEASE_ARTIFACT_FROZEN', label, archiveRoot: path.relative(ROOT, ARCHIVE).replaceAll('\\', '/'), manifestSha256: shaFile(path.join(REPORTS, 'geometry_equation_manifest.json')), targetCount: manifest.rows.length, sourceFileCount: sourcePaths.length, releaseFileCount: rows.length, releaseArtifactSha: releaseSha, files: rows };
fs.writeFileSync(path.join(REPORTS, `release_artifact_${label}.json`), JSON.stringify(output, null, 2) + '\n', 'utf8');
fs.writeFileSync(path.join(REPORTS, 'current_release_artifact.json'), JSON.stringify(output, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({ status: output.status, label, targetCount: output.targetCount, releaseFileCount: output.releaseFileCount, releaseArtifactSha: releaseSha }, null, 2));
