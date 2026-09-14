import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { canonicalExamIdentity, parseExamPdfMetadata, sameCanonicalExamIdentity } from './exam-id.mjs';

export const CANONICAL_EXAM_IDENTITY_FIELDS = Object.freeze(['year', 'school', 'grade', 'semester', 'examType']);

function loadDatabase(file) {
  if (!fs.existsSync(file)) return [];
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(file, 'utf8'), context, { filename: file, timeout: 3000 });
  return Array.isArray(context.window.mainDB?.exams) ? context.window.mainDB.exams : [];
}

export function findExistingProductionExam({ archiveRoot, examIdentity, dbEntries = null } = {}) {
  const archive = path.resolve(archiveRoot || 'archive');
  const entries = dbEntries || loadDatabase(path.join(archive, 'db.js'));
  const target = canonicalExamIdentity(examIdentity);
  if (Object.values(target).some(value => !value)) return null;
  for (const entry of entries) {
    if (!sameCanonicalExamIdentity(target, entry)) continue;
    const relative = String(entry.file || '').replaceAll('\\', '/').replace(/^archive\/exams\//, '').replace(/^exams\//, '');
    if (!relative) continue;
    const productionFile = path.resolve(archive, 'exams', relative);
    if (fs.existsSync(productionFile) && fs.statSync(productionFile).isFile()) return { examId: entry.examId || path.basename(relative, '.js'), file: relative, identity: target };
  }

  // A production file can exist before DB registration. Use the same
  // structured filename parser as source inventory for this fallback; never
  // use a substring match on the filename. Restrict the scan to original
  // exams so a similar/type bank cannot shadow a real past-exam import.
  const originalRoot = path.join(archive, 'exams', 'original');
  const candidates = [];
  const walk = directory => {
    if (!fs.existsSync(directory)) return;
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) walk(file);
      else if (entry.isFile() && entry.name.toLowerCase().endsWith('.js')) candidates.push(file);
    }
  };
  walk(originalRoot);
  for (const productionFile of candidates.sort()) {
    const parsed = parseExamPdfMetadata(productionFile, archive);
    if (!sameCanonicalExamIdentity(target, parsed)) continue;
    const relative = path.relative(path.join(archive, 'exams'), productionFile).split(path.sep).join('/');
    return { examId: parsed.examId || path.basename(productionFile, '.js'), file: relative, identity: target, discovery: 'STRUCTURED_PRODUCTION_SCAN' };
  }
  return null;
}

export function existingExamPreflight({ archiveRoot, examIdentity, forceExisting = false, dbEntries = null } = {}) {
  const identity = canonicalExamIdentity(examIdentity);
  const missingIdentityFields = CANONICAL_EXAM_IDENTITY_FIELDS.filter(field => !identity[field]);
  if (missingIdentityFields.length) return { status: 'HOLD_EXISTING_EXAM_IDENTITY_INCOMPLETE', skip: false, hold: true, identity, missingIdentityFields };
  if (forceExisting) return { status: 'FORCE_EXISTING_EXAM', skip: false, identity, existing: null };
  const existing = findExistingProductionExam({ archiveRoot, examIdentity: identity, dbEntries });
  if (!existing) return { status: 'NEW_EXAM', skip: false, identity, existing: null };
  return { status: 'SKIP_EXISTING_EXAM', skip: true, identity, existing };
}

export function loadExistingExamEntries(archiveRoot) {
  return loadDatabase(path.join(path.resolve(archiveRoot || 'archive'), 'db.js'));
}
