#!/usr/bin/env node
// Replays only the selected frozen reports. Expected HOLD/FAIL states stay HOLD/FAIL.
// Usage: node replay_compact_official_validation.mjs --repo-root <repo>
//   --report-dir <compact-report-directory> [--exam E065] [--out <new-json-file>]
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { pathToFileURL, fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const arg = name => { const at = args.indexOf(`--${name}`); return at < 0 ? '' : args[at + 1] || ''; };
if (!arg('repo-root') || !arg('report-dir')) throw new Error('Required: --repo-root <repo> --report-dir <directory>');
const repoRoot = path.resolve(arg('repo-root'));
const reportDir = path.resolve(arg('report-dir'));
const selected = arg('exam') ? new Set(arg('exam').split(',').map(s => s.trim())) : null;
const sha = data => crypto.createHash('sha256').update(data).digest('hex');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const comparable = x => JSON.stringify(x ?? null);
const same = (a, b) => comparable(a) === comparable(b);
const bump = (o, key) => { o[key] = (o[key] || 0) + 1; };
const official = await import(pathToFileURL(path.join(repoRoot, 'archive/tools/meta-foundation/rpm-active-resolver.mjs')).href);
const { loadActiveMetaRegistry } = await import(pathToFileURL(path.join(repoRoot, 'archive/tools/meta-foundation/active-registry.mjs')).href);
const { objectSha } = await import(pathToFileURL(path.join(repoRoot, 'archive/tools/pipeline-core/canonical.mjs')).href);
const registry = loadActiveMetaRegistry(repoRoot);
const checkedFiles = new Map();
const resolveHistoricalRef = refPath => {
  if (!path.isAbsolute(refPath)) return path.join(repoRoot, refPath);
  const marker = '/m3-meta/';
  const at = refPath.indexOf(marker);
  return at >= 0 ? path.join(repoRoot, refPath.slice(at + marker.length)) : refPath;
};
function checkFileRef(ref, errors, label) {
  if (!ref?.path || !ref?.sha256) { errors.push(`${label}:FILE_REF_MISSING`); return null; }
  const file = resolveHistoricalRef(ref.path);
  try {
    if (!checkedFiles.has(file)) checkedFiles.set(file, { raw: fs.readFileSync(file) });
    const cached = checkedFiles.get(file);
    if (!cached.sha256) cached.sha256 = sha(cached.raw);
    if (cached.sha256 !== ref.sha256.replace(/^sha256:/, '')) errors.push(`${label}:FILE_SHA_MISMATCH`);
    return cached;
  } catch (e) { errors.push(`${label}:FILE_UNAVAILABLE:${e.code || e.message}`); return null; }
}
function checkDecisionRef(ref, errors, label) {
  if (!ref) return;
  const cached = checkFileRef(ref, errors, label);
  if (!cached || !ref.objectSha || !Number.isInteger(ref.ordinal)) return;
  if (!cached.json) cached.json = JSON.parse(cached.raw.toString('utf8'));
  const row = cached.json.items?.find(x => x.ordinal === ref.ordinal);
  if (!row || objectSha(row) !== ref.objectSha) errors.push(`${label}:ITEM_OBJECT_SHA_MISMATCH`);
}

const files = fs.readdirSync(reportDir).filter(f => /^E\d+\.official-validation\.compact\.json$/.test(f))
  .filter(f => !selected || selected.has(f.split('.')[0])).sort();
if (!files.length) throw new Error('NO_SELECTED_COMPACT_REPORTS');
const replay = { schemaVersion: 'M3S2_OFFICIAL_COMPACT_REPLAY_v1', createdAt: new Date().toISOString(),
  scope: 'Reproduces frozen official results and receipt hashes. Matching an expected FAIL or NOT_RUN is replay integrity PASS, never metadata finalization PASS.',
  repoRoot, selectedExams: files.map(f => f.split('.')[0]), exams: [], errors: [],
  resolverStatusCounts: {}, difficultyStatusCounts: {}, fullFinalizationStatusCounts: {},
  executedRoutes: 0, preservedNotRunRoutes: 0 };

for (const name of files) {
  const compactPath = path.join(reportDir, name);
  const compact = read(compactPath);
  const exam = { examId: compact.examId, compactSha256: sha(fs.readFileSync(compactPath)),
    errors: [], routes: [] };
  const cachedPackage = checkFileRef(compact.packagedResolverRef, exam.errors, 'PACKAGED_RESOLVER');
  checkFileRef(compact.finalMetaRef, exam.errors, 'FINAL_META');
  checkFileRef(compact.actualSourceRef, exam.errors, 'FINAL_SOURCE');
  checkFileRef(compact.resolverCodeRef, exam.errors, 'OFFICIAL_RESOLVER_CODE');
  const selfSha = sha(fs.readFileSync(fileURLToPath(import.meta.url)));
  if (selfSha !== compact.replayHelperRef.sha256) exam.errors.push('REPLAY_HELPER_SHA_MISMATCH');
  const pkg = cachedPackage ? JSON.parse(cachedPackage.raw.toString('utf8')) : null;
  for (const item of compact.items) {
    for (const route of item.routes) {
      const rr = { ordinal: item.ordinal, curriculum: route.curriculum, errors: [] };
      if (route.executionStatus === 'NOT_RUN') {
        rr.resolverStatus = route.resolverValidation.status;
        rr.difficultyStatus = route.difficultyValidation.status;
        rr.fullFinalizationStatus = route.fullFinalization.status;
        rr.reason = route.reason;
        rr.executionStatus = 'NOT_RUN_PRESERVED';
        replay.preservedNotRunRoutes++;
      } else {
        try {
          const pr = pkg?.items.find(x => x.ordinal === item.ordinal && x.curriculum === route.curriculum);
          if (!pr?.input || !pr?.result) throw new Error('PACKAGED_ROUTE_INPUT_RESULT_MISSING');
          if (objectSha(pr.input) !== route.inputRef.objectSha) rr.errors.push('INPUT_OBJECT_SHA_MISMATCH');
          const now = official.resolveMetaRoute(pr.input, { repoRoot, registry });
          if (now.evidenceSha !== route.resolverEvidenceRef.evidenceSha || pr.result.evidenceSha !== route.resolverEvidenceRef.evidenceSha) rr.errors.push('RESOLVER_EVIDENCE_SHA_MISMATCH');
          const suppliedEvidence = { ...pr.result, semanticInputBundle: now.semanticInputBundle,
            authorityRefs: pr.authorityRefs.map(index => pkg.authorityRefs[index]) };
          const validation = official.validateResolverEvidence(pr.input, suppliedEvidence, { repoRoot, registry });
          if (objectSha(validation) !== route.resolverValidation.fullOfficialResultSha) rr.errors.push('RESOLVER_VALIDATION_RESULT_SHA_MISMATCH');
          if (!same(validation.errors, route.resolverValidation.errors) || validation.status !== route.resolverValidation.status) rr.errors.push('RESOLVER_RESULT_STATUS_OR_ERRORS_CHANGED');
          const receiptOk = official.validateMetaValidatorReceipt(route.officialResolverDecisionReceipt, suppliedEvidence.evidenceSha, validation);
          if (!receiptOk) rr.errors.push('OFFICIAL_RESOLVER_RECEIPT_INVALID');
          rr.resolverReceiptVerified = receiptOk;
          if (objectSha(route.difficultyDecisionBinding) !== route.difficultyEvidence.decisionSha) rr.errors.push('DIFFICULTY_DECISION_BINDING_SHA_MISMATCH');
          for (const key of ['authorDecisionRef', 'finalMetaItemRef', 'adjudicationRef', 'independentRecheckRef', 'independentSampleRef']) {
            checkDecisionRef(route.difficultyDecisionBinding[key], rr.errors, `DIFFICULTY_${key}`);
          }
          const difficulty = official.validateBlindDifficulty(route.difficultyEvidence, {
            sourceFingerprint: now.sourceFingerprint,
            solutionHash: now.semanticInputBundle.solutionIdentity.solutionHash,
          });
          if (!same(difficulty, route.difficultyValidation)) rr.errors.push('DIFFICULTY_VALIDATION_CHANGED');
          const payload = { input: pr.input, resolverEvidence: suppliedEvidence,
            candidateMeta: route.candidateMeta, difficultyEvidence: route.difficultyEvidence,
            semanticMetaEvidence: route.semanticMetaEvidence, repoRoot, registry };
          const preflight = official.validateMetaFinalization({ ...payload, requireValidatorReceipt: false });
          if (!same(preflight, route.finalizationPreflight)) rr.errors.push('FINALIZATION_PREFLIGHT_CHANGED');
          if (route.officialFullFinalizationReceipt && !official.validateMetaValidatorReceipt(route.officialFullFinalizationReceipt, suppliedEvidence.evidenceSha, preflight)) rr.errors.push('FULL_FINALIZATION_RECEIPT_INVALID');
          const full = official.validateMetaFinalization({ ...payload, validatorReceipt: route.officialFullFinalizationReceipt });
          if (!same(full, route.fullFinalization)) rr.errors.push('FULL_FINALIZATION_RESULT_CHANGED');
          rr.resolverStatus = validation.status;
          rr.difficultyStatus = difficulty.status;
          rr.fullFinalizationStatus = full.status;
          rr.expectedFinalizationErrors = full.errors;
          rr.executionStatus = 'REPLAYED';
          replay.executedRoutes++;
        } catch (e) { rr.errors.push(String(e.message || e)); rr.executionStatus = 'REPLAY_ERROR'; }
      }
      rr.replayIntegrityStatus = rr.errors.length ? 'FAIL' : 'PASS';
      for (const [field, counter] of [['resolverStatus', 'resolverStatusCounts'], ['difficultyStatus', 'difficultyStatusCounts'], ['fullFinalizationStatus', 'fullFinalizationStatusCounts']]) bump(replay[counter], rr[field] || 'UNAVAILABLE');
      if (rr.errors.length) exam.errors.push({ ordinal: item.ordinal, curriculum: route.curriculum, errors: rr.errors });
      exam.routes.push(rr);
    }
  }
  exam.status = exam.errors.length ? 'FAIL' : 'PASS';
  if (exam.errors.length) replay.errors.push({ examId: exam.examId, errors: exam.errors });
  replay.exams.push(exam);
  process.stdout.write(`${exam.examId} replay=${exam.status} routes=${exam.routes.length} errors=${exam.errors.length}\n`);
}
replay.status = replay.errors.length ? 'FAIL' : 'PASS';
if (arg('out')) fs.writeFileSync(path.resolve(arg('out')), `${JSON.stringify(replay, null, 2)}\n`, { encoding: 'utf8', flag: 'wx' });
process.stdout.write(`${JSON.stringify({ status: replay.status, executedRoutes: replay.executedRoutes, preservedNotRunRoutes: replay.preservedNotRunRoutes, resolver: replay.resolverStatusCounts, difficulty: replay.difficultyStatusCounts, finalization: replay.fullFinalizationStatusCounts })}\n`);
if (replay.errors.length) process.exitCode = 1;
