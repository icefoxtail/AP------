import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { auditManifestFile } from './closure.mjs';
import { fileRef, nonempty, uidSet, readBoundFile, bytesSha } from './canonical.mjs';

export function closureFromArgs(root, pipeline, argv = process.argv, expectedArtifacts = [], expectedSourceIdentities = null) {
  const index = argv.indexOf('--closure-manifest');
  if (index < 0 || !argv[index + 1]) return { status: 'BLOCKED', productionAuthorized: false, errors: ['COMMON_CLOSURE_MANIFEST_REQUIRED'], pipeline };
  return closureFromFile(root, pipeline, path.resolve(argv[index + 1]), expectedArtifacts, expectedSourceIdentities);
}

export function closureFromFile(root, pipeline, manifestPath, expectedArtifacts = [], expectedSourceIdentities = null) {
  const closure = auditManifestFile(root, manifestPath, pipeline);
  if (closure.status !== 'PASS') return closure;
  try {
    const run = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    for (const file of expectedArtifacts) {
      const relative = path.relative(root, path.resolve(file)).split(path.sep).join('/');
      const current = fileRef(root, relative);
      if (!run.inputs.some(i => i.path === relative && i.sha256 === current.sha256 && i.bytes === current.bytes && ['candidate', 'asset'].includes(i.role))) throw new Error(`OUTPUT_NOT_BOUND_TO_CLOSURE:${relative}`);
      if (path.extname(file).toLowerCase() === '.js') {
        const context = { window: {} }; vm.runInNewContext(fs.readFileSync(file, 'utf8'), context, { timeout: 1000 });
        const bank = context.window.questionBank;
        if (!Array.isArray(bank) || JSON.stringify(bank.map(q => q.id).sort((a, b) => a - b)) !== JSON.stringify(run.questions.filter(q => q.candidatePath === relative).map(q => q.qid).sort((a, b) => a - b))) throw new Error('OUTPUT_QUESTION_SCOPE_NOT_FULLY_REVIEWED');
      }
    }
    if (expectedSourceIdentities) {
      const key = row => sourceIdentityKey(row);
      if (JSON.stringify(uidSet(expectedSourceIdentities.map(key))) !== JSON.stringify(uidSet(run.questions.map(key)))) throw new Error('CLOSURE_SCOPE_DOES_NOT_MATCH_CALLER');
      const expectedByKey = new Map(expectedSourceIdentities.map(row => [key(row), row]));
      const actualByKey = new Map(run.questions.map(row => [key(row), row]));
      for (const [identity, expected] of expectedByKey) {
        const actual = actualByKey.get(identity);
        if (!actual) throw new Error(`CLOSURE_SOURCE_IDENTITY_MISSING:${identity}`);
        if (expected.sourceDocumentSha256 && actual.sourceDocumentSha256 && expected.sourceDocumentSha256 !== actual.sourceDocumentSha256) throw new Error(`CLOSURE_SOURCE_DOCUMENT_SHA_MISMATCH:${identity}`);
        if (expected.sourceQuestionNo && actual.sourceQuestionNo && String(expected.sourceQuestionNo) !== String(actual.sourceQuestionNo)) throw new Error(`CLOSURE_SOURCE_QUESTION_MISMATCH:${identity}`);
        if (expected.sourcePageNo && actual.sourcePageNo && Number(expected.sourcePageNo) !== Number(actual.sourcePageNo)) throw new Error(`CLOSURE_SOURCE_PAGE_MISMATCH:${identity}`);
        if (expected.qid !== undefined && actual.qid !== undefined && Number(expected.qid) !== Number(actual.qid)) throw new Error(`CLOSURE_ARCHIVE_ID_MISMATCH:${identity}`);
        const expectedPages = Array.isArray(expected.sourcePageEvidencePaths) ? [...expected.sourcePageEvidencePaths].sort() : [];
        const actualPages = Array.isArray(actual.sourcePageEvidencePaths) ? [...actual.sourcePageEvidencePaths].sort() : [];
        if (expectedPages.length && JSON.stringify(expectedPages) !== JSON.stringify(actualPages)) throw new Error(`CLOSURE_SOURCE_EVIDENCE_MISMATCH:${identity}`);
      }
    }
  } catch (error) { return { ...closure, status: 'BLOCKED', errors: [...closure.errors, error.message] }; }
  return closure;
}

// Past-exam closure rows carry the frozen source document/question identity.
// Keep the legacy sourcePath|qid form for existing pipeline-core callers, but
// never silently reduce a rich source identity to an archive id.
export function sourceIdentityKey(row) {
  if (nonempty(row?.sourceDocumentSha256) && nonempty(row?.sourceQuestionNo)) {
    const derived = `${row.sourceDocumentSha256}|${row.sourceQuestionNo}`;
    if (nonempty(row?.sourceIdentityKey) && String(row.sourceIdentityKey) !== derived) throw new Error('SOURCE_IDENTITY_KEY_MISMATCH');
    return derived;
  }
  if (nonempty(row?.sourceIdentityKey)) return String(row.sourceIdentityKey);
  if (nonempty(row?.sourcePath) && Number.isSafeInteger(row?.qid)) return `${row.sourcePath}|${row.qid}`;
  throw new Error('SOURCE_IDENTITY_ROW_INVALID');
}

export function requireClosure(root, pipeline, argv = process.argv, expectedArtifacts = [], expectedSourceIdentities = null) {
  const report = closureFromArgs(root, pipeline, argv, expectedArtifacts, expectedSourceIdentities);
  if (report.status !== 'PASS') throw new Error(`COMMON_PIPELINE_CLOSURE_BLOCKED:${report.errors.join(';')}`);
  return report;
}

export function requireProductionClosure(root, pipeline, argv = process.argv, expectedArtifacts = [], expectedSourceIdentities = null) {
  const report = requireClosure(root, pipeline, argv, expectedArtifacts, expectedSourceIdentities);
  if (report.productionAuthorized !== true) throw new Error('COMMON_PIPELINE_PRODUCTION_AUTHORITY_BLOCKED');
  return report;
}

export function archiveSourceIdentity(sourcePath, qid) {
  const normalized = sourcePath.startsWith('archive/exams/') ? sourcePath : `archive/exams/${sourcePath}`;
  if (!Number.isSafeInteger(qid) || qid < 1 || normalized.includes('..') || normalized.includes('\\')) throw new Error('INVALID_LEGACY_SOURCE_IDENTITY');
  return { sourcePath: normalized, qid };
}

export function reviewedMutationPlan(root, pipeline, identities, argv = process.argv) {
  const closure = requireClosure(root, pipeline, argv, [], identities);
  const run = JSON.parse(fs.readFileSync(path.resolve(argv[argv.indexOf('--closure-manifest') + 1]), 'utf8'));
  if (run.inputSha !== closure.inputSha) throw new Error('CLOSURE_MANIFEST_CHANGED');
  return {
    assertCandidateBytes(sourcePath, after) {
      const paths = [...new Set(run.questions.filter(q => q.sourcePath === sourcePath).map(q => q.candidatePath))];
      if (paths.length !== 1) throw new Error('REVIEWED_MUTATION_SOURCE_SCOPE');
      const ref = run.inputs.find(i => i.path === paths[0] && i.role === 'candidate');
      readBoundFile(root, ref);
      if (bytesSha(Buffer.from(after, 'utf8')) !== ref.sha256) throw new Error('PLANNED_MUTATION_DIFFERS_FROM_REVIEWED_CANDIDATE');
    }
  };
}

export function validateIdentityRows(rows, identity) {
  if (!Array.isArray(rows) || rows.length === 0) return ['EMPTY_CANDIDATE_SCOPE'];
  const ids = rows.map(identity);
  if (ids.some(id => !nonempty(id))) return ['CANDIDATE_IDENTITY_MISSING'];
  try { uidSet(ids); } catch { return ['DUPLICATE_CANDIDATE_IDENTITY']; }
  return [];
}
