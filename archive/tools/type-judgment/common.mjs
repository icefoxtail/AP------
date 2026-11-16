// Read-only adapters for judgment preparation. Never register or promote a decision.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadActiveMetaRegistry, curriculumForQuestion } from '../meta-foundation/active-registry.mjs';
import { questionUidForSource } from '../meta-foundation/rpm-active-resolver.mjs';
import { loadBank } from '../meta-foundation/auto-register-merged-source.mjs';
import { loadAliasEvidence } from './alias-evidence.mjs';
export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
export const isMain = url => Boolean(process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(url));
export function loadContext(root = ROOT) {
  root = fs.realpathSync(root);
  const registry = loadActiveMetaRegistry(root);
  const packs = new Map();
  const dir = path.join(root, 'archive/data/meta-foundation/canonical/packs');
  for (const name of fs.readdirSync(dir).sort()) {
    const file = path.join(dir, name, 'pack.json');
    if (fs.existsSync(file)) { const pack = read(file); packs.set(pack.packId, pack); }
  }
  return { root, registry, packs, courseAliasEvidence: loadAliasEvidence(root),
    records: read(path.join(root, 'archive/data/question_metadata.json')).records,
    master: new Map(read(path.join(root, 'archive/data/master_tables/js_archive_tag_master.json')).map(row => [row.key, row])),
    aliases: read(path.join(root, 'archive/data/meta-foundation/compiled/aliases.json')).aliases };
}
export function scopeForRecord(row = {}) {
  return { curriculum: row.curriculum || row.curriculumKey || curriculumForQuestion(row) || '',
    course: row.standardCourse || row.courseKey || '', unit: row.standardUnitKey || '', sub: row.subUnitKey || null,
    ...(row.sourceArchiveFile ? {sourceArchiveFile:row.sourceArchiveFile} : {}),
    ...(row.curriculumKey ? { curriculumKey: row.curriculumKey } : {}), ...(row.courseKey ? { courseKey: row.courseKey } : {}) };
}
// ACTIVE and owner-pack conditions mirror rpm-active-resolver.activeCandidateKeysForScope.
export function activeKey(context, kind, key) {
  const item = (kind === 'PT' ? context.registry.problemTypes : context.registry.templates).get(key);
  return item?.status === 'ACTIVE' && context.registry.activePacks.has(item.ownerPack);
}
export function validScope(context, scope) {
  const unit = context.master.get(scope.unit), sub = scope.sub && context.master.get(scope.sub);
  return Boolean(scope.curriculum && scope.course && (!scope.curriculumKey || scope.curriculumKey === scope.curriculum) && unit?.keyType === 'standardUnitKey' && ['active', 'ACTIVE'].includes(unit.status)
    && (!scope.sub || (sub?.keyType === 'subUnitKey' && ['active', 'ACTIVE'].includes(sub.status)
      && (sub.standardUnitKey || sub.parentKey) === scope.unit)));
}
// Exact course/curriculum and pack scope from reviewed-exam-registration-v2.resolve (1691ff).
// No course alias inference; no replacement for registration, source review or approval.
export function matchingBindings(context, scope, ptKey, { exactSub = true } = {}) {
  return context.registry.bindingRows.filter(row => {
    const pack = context.packs.get(row.ownerPack || context.registry.problemTypes.get(row.problemTypeKey)?.ownerPack);
    return row.status === 'ACTIVE' && row.curriculum === scope.curriculum && row.standardCourse === scope.course
      && row.standardUnitKey === scope.unit && (!exactSub || (row.subUnitKey || null) === (scope.sub || null))
      && (!ptKey || row.problemTypeKey === ptKey) && activeKey(context, 'PT', row.problemTypeKey)
      && context.registry.activePacks.has(row.ownerPack)
      && (!scope.curriculumKey || scope.curriculumKey === scope.curriculum)
      && pack?.curricula.includes(scope.curriculum) && pack?.standardCourses.includes(scope.course)
      && pack?.standardCourses.includes(scope.courseKey || scope.course);
  });
}
export function readExam(context, examPath) {
  const base = fs.realpathSync(path.join(context.root, 'archive/exams'));
  const input = path.isAbsolute(examPath) ? examPath : path.join(context.root, examPath.startsWith('archive/exams/') ? examPath : `archive/exams/${examPath}`);
  const file = fs.realpathSync(input);
  if (!file.startsWith(base + path.sep) || !file.endsWith('.js')) throw Error('EXAM_PATH_OUTSIDE_ARCHIVE');
  const sourceArchiveFile = path.relative(base, file).split(path.sep).join('/');
  const questions = loadBank(fs.readFileSync(file, 'utf8'), sourceArchiveFile);
  const candidates = context.records.filter(r => r.sourceArchiveFile === sourceArchiveFile);
  const rows = questions.map((_, index) => {
    const sourceOrdinal = index + 1;
    const questionUid = questionUidForSource(sourceArchiveFile, sourceOrdinal);
    const found = candidates.filter(r => r.sourceOrdinal === sourceOrdinal);
    if (found.length > 1 || (found[0] && found[0].questionUid !== questionUid)) throw Error(`CANONICAL_IDENTITY_CONFLICT:${sourceOrdinal}`);
    return { questionUid, sourceOrdinal, metadata: found[0] || null };
  });
  return { exam: `archive/exams/${sourceArchiveFile}`, sourceArchiveFile, questions, rows };
}
export function parseArgs(argv, allowedValues, allowedFlags = []) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const key = argv[i];
    if (Object.hasOwn(args, key.slice(2))) throw Error(`DUPLICATE_ARGUMENT:${key}`);
    if (allowedFlags.includes(key)) args[key.slice(2)] = true;
    else if (allowedValues.includes(key) && argv[i + 1] && !argv[i + 1].startsWith('--')) args[key.slice(2)] = argv[++i];
    else throw Error(`INVALID_ARGUMENT:${key}`);
  }
  return args;
}
// Resolve all existing parents (including symlinks), forbid overwrites and repo writes.
export function writeOutput(text, out, root = ROOT) {
  if (!out) { process.stdout.write(text); return; }
  const file = path.resolve(out);
  const parent = fs.realpathSync(path.dirname(file));
  const target = path.join(parent, path.basename(file));
  const repo = fs.realpathSync(root);
  if (target === repo || target.startsWith(repo + path.sep)) throw Error('OUTPUT_INSIDE_REPOSITORY');
  for (let dir = parent; ; dir = path.dirname(dir)) {
    const marker = path.join(dir, '.git');
    if (fs.existsSync(marker) && (fs.statSync(marker).isFile() || fs.existsSync(path.join(marker, 'HEAD')))) throw Error('OUTPUT_INSIDE_REPOSITORY');
    if (dir === path.dirname(dir)) break;
  }
  fs.writeFileSync(target, text, { flag: 'wx', encoding: 'utf8' });
}
