import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";

import { bytesSha, canonicalJson, fileRef, objectSha, readBoundFile, writeNewJson } from "../pipeline-core/canonical.mjs";
import { createReleaseTransaction, assertExternalApproval, assertProductionSmokeRender, assertTargetParity } from "./lib/release-authority.mjs";
import { assetSetSha, assertStagingOutput } from "./lib/production-boundary.mjs";
import { assertReviewReady } from "./lib/review-ready.mjs";
import { promoteApprovedExam } from "./promote-reviewed-exam.mjs";
import { loadProductionBank, loadTargetDbEntry, loadTargetIndexRows, rebuildApprovedIndex, registerApprovedExam } from "./register-approved-exam.mjs";
import { RUN_VERSION, runInputSha } from "../pipeline-core/closure.mjs";
import { runtimeDependencyBundle } from "../pipeline-core/runtime.mjs";
import { spawnSync } from "node:child_process";
const here = path.dirname(fileURLToPath(import.meta.url));
const defaultRoot = path.resolve(here, "../../..");

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function relative(root, file) {
  return path.relative(root, file).split(path.sep).join("/");
}

function targetDbEntry(root, dbEntryFile, examId) {
  const entry = readJson(dbEntryFile);
  if (entry.examId && entry.examId !== examId) throw new Error("DB_ENTRY_EXAM_ID_MISMATCH");
  return entry;
}

function productionSmokeBinding(repoRoot, manifest, reviewReady, production, currentDbEntry, indexRows, { releaseTransactionId, indexCompletedAt } = {}) {
  const productionJs = fileRef(repoRoot, relative(repoRoot, production.file));
  const productionAssets = (reviewReady.assetRefs || []).map(ref => fileRef(repoRoot, "archive/assets/images/" + manifest.examId + "/" + path.basename(String(ref.path))));
  const dbRef = fileRef(repoRoot, "archive/db.js");
  const indexRef = fileRef(repoRoot, "archive/question-index.js");
  const rendererRuntimeBinding = { renderer: "archive/engine.html", runtimeSha256: fileRef(repoRoot, "archive/engine.html").sha256, runtimeBundleSha: runtimeDependencyBundle(repoRoot, "archive/engine.html").bundleSha };
  return {
    examId: manifest.examId,
    releaseTransactionId,
    reviewReadyRunId: reviewReady.reviewReadyRunId,
    productionJsSha256: productionJs.sha256,
    productionAssetSetSha256: assetSetSha(productionAssets),
    questionCount: production.questionCount,
    dbTarget: { file: currentDbEntry.file, qCount: currentDbEntry.qCount, entrySha256: objectSha(currentDbEntry), dbFileSha256: dbRef.sha256 },
    indexTarget: { sourceFile: manifest.archiveRelativePath.replaceAll("\\", "/"), qCount: indexRows.length, targetSha256: objectSha(indexRows), indexFileSha256: indexRef.sha256 },
    rendererRuntimeBinding,
    indexCompletedAt: indexCompletedAt || null,
  };
}

function snapshotFile(root, relativePath) {
  const normalized = relativePath.replaceAll("\\", "/");
  const file = path.resolve(root, normalized);
  if (!file.startsWith(path.resolve(root) + path.sep)) throw new Error("RELEASE_SNAPSHOT_PATH_ESCAPE");
  if (!fs.existsSync(file)) return { path: normalized, exists: false, bytes: null, sha256: null };
  if (!fs.statSync(file).isFile()) throw new Error("RELEASE_SNAPSHOT_NOT_FILE:" + normalized);
  const bytes = fs.readFileSync(file);
  return { path: normalized, exists: true, bytes: bytes.length, sha256: bytesSha(bytes) };
}

function snapshotDirectory(root, relativePath) {
  const normalized = relativePath.replaceAll("\\", "/");
  const directory = path.resolve(root, normalized);
  if (!fs.existsSync(directory)) return { path: normalized, exists: false, files: [] };
  if (!fs.statSync(directory).isDirectory()) throw new Error("RELEASE_SNAPSHOT_NOT_DIRECTORY:" + normalized);
  const files = [];
  const walk = current => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const file = path.join(current, entry.name);
      if (entry.isDirectory()) walk(file);
      else if (entry.isFile()) files.push(snapshotFile(root, path.relative(root, file)));
    }
  };
  walk(directory);
  return { path: normalized, exists: true, files: files.sort((left, right) => left.path.localeCompare(right.path)) };
}

function snapshotEqual(left, right) {
  return canonicalJson(left || null) === canonicalJson(right || null);
}

function transactionIdFor(reviewReady, approval, explicit = null) {
  if (explicit) return String(explicit);
  if (approval?.releaseTransactionId) return String(approval.releaseTransactionId);
  const digest = objectSha({ examId: reviewReady?.examId || null, reviewReadyRunId: reviewReady?.reviewReadyRunId || null, reviewReadySha: reviewReady?.reviewReadySha || null, candidateSha256: reviewReady?.candidateSha256 || null, approvalEvidenceSha256: approval?.approvalEvidenceSha256 || null });
  return `release-${digest.slice("sha256:".length)}`;
}

function transactionDirectory(root, transactionId) {
  if (!/^[A-Za-z0-9_-]+$/.test(transactionId)) throw new Error("RELEASE_TRANSACTION_ID_INVALID");
  return path.resolve(root, "alive", "runtime", "approved-releases", transactionId);
}

function transactionFile(root, transactionId) {
  return path.join(transactionDirectory(root, transactionId), "transaction.json");
}

function writeTransactionJournal(root, transactionId, journal) {
  const file = transactionFile(root, transactionId);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const temporary = `${file}.${randomUUID()}.next`;
  fs.writeFileSync(temporary, `${JSON.stringify(journal, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
  fs.renameSync(temporary, file);
  return fileRef(root, relative(root, file));
}

function readTransactionJournal(root, transactionId) {
  const file = transactionFile(root, transactionId);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function releaseBaseline(root, manifest) {
  return {
    production: {
      targetFile: manifest.archiveRelativePath.replaceAll("\\", "/"),
      productionJs: snapshotFile(root, `archive/exams/${manifest.archiveRelativePath}`),
      assetRoot: snapshotDirectory(root, `archive/assets/images/${manifest.examId}`),
    },
    db: snapshotFile(root, "archive/db.js"),
    index: snapshotFile(root, "archive/question-index.js"),
  };
}

function assertReleaseBaseline(approval, baseline, dbBaselineSha256, indexBaselineSha256) {
  if (baseline.db.sha256 !== dbBaselineSha256 || approval.dbBaselineSha256 !== dbBaselineSha256) throw new Error("RELEASE_DB_BASELINE_MISMATCH_BEFORE_WRITE");
  if (baseline.index.sha256 !== indexBaselineSha256 || approval.indexBaselineSha256 !== indexBaselineSha256) throw new Error("RELEASE_INDEX_BASELINE_MISMATCH_BEFORE_WRITE");
}

function mutationRecord(journal, { stage, target, identity, before, after, status, error = null, startedAt, completedAt = new Date().toISOString() }) {
  const record = { stage, target, identity, before, after, status, error, startedAt, completedAt };
  journal.mutations = [...(journal.mutations || []), record];
  return record;
}

function latestMutation(journal, stage) {
  return [...(journal?.mutations || [])].reverse().find(row => row.stage === stage && row.status === 'COMPLETED') || null;
}

function stageResult(journal, stage) {
  return journal?.stageResults?.[stage] || null;
}

function markStage(journal, stage, result, completedAt = new Date().toISOString()) {
  journal.stages = [...new Set([...(journal.stages || []), stage])];
  journal.stageResults = { ...(journal.stageResults || {}), [stage]: result };
  journal.stageTimes = { ...(journal.stageTimes || {}), [stage]: completedAt };
  return journal;
}

function assertKnownState(root, snapshot, label, current) {
  if (!snapshotEqual(snapshot, current)) throw new Error(`RELEASE_TRANSACTION_${label}_STATE_MISMATCH`);
}

function readBoundJson(root, ref) {
  return JSON.parse(readBoundFile(root, ref).toString('utf8'));
}

function addUniqueRef(refs, ref, role) {
  const previous = refs.find(item => item.path === ref.path);
  if (previous) {
    if (previous.sha256 !== ref.sha256 || previous.bytes !== ref.bytes) throw new Error('PRODUCTION_SMOKE_RUNTIME_REF_CONFLICT:' + ref.path);
    return;
  }
  refs.push({ ...ref, role });
}

function productionSmokeRun(root, sourceRun, manifest, production, transactionId) {
  const livePath = `archive/exams/${manifest.archiveRelativePath.replaceAll('\\', '/')}`;
  const liveRef = fileRef(root, livePath);
  const assetPaths = [...new Set(
    production.bank.flatMap(question => [question.image, question.solutionImage].filter(Boolean).map(value => {
      const normalized = String(value).replaceAll('\\', '/').replace(/^archive\//, '');
      return `archive/${normalized}`;
    }))
  )].sort();
  const runtime = runtimeDependencyBundle(root, 'archive/engine.html');
  const inputs = [];
  for (const ref of sourceRun.inputs || []) if (!['candidate', 'asset', 'engine', 'runtime'].includes(ref.role)) addUniqueRef(inputs, ref, ref.role);
  addUniqueRef(inputs, liveRef, 'candidate');
  for (const relative of assetPaths) addUniqueRef(inputs, fileRef(root, relative), 'asset');
  for (const ref of runtime.localFiles) addUniqueRef(inputs, ref, ref.path === runtime.enginePath ? 'engine' : 'runtime');
  const sourceQuestions = sourceRun.questions || [];
  const questions = production.bank.map(question => {
    const prior = sourceQuestions.find(row => row.qid === question.id) || {};
    const uid = prior.questionUid || `${manifest.examId}|${question.id}`;
    return {
      ...prior,
      questionUid: uid,
      qid: question.id,
      sourcePath: prior.sourcePath || livePath,
      candidatePath: livePath,
      problemAssetPaths: question.image ? [`archive/${String(question.image).replaceAll('\\', '/').replace(/^archive\//, '')}`] : [],
      solutionAssetPaths: question.solutionImage ? [`archive/${String(question.solutionImage).replaceAll('\\', '/').replace(/^archive\//, '')}`] : [],
      requiredAxes: [],
    };
  });
  const run = {
    schemaVersion: RUN_VERSION,
    pipeline: 'past-exam',
    runId: `${sourceRun.runId}:production-smoke:${transactionId}`,
    revision: sourceRun.revision,
    publicationIntent: 'FULL_EXAM',
    assetRoot: 'archive',
    questions,
    inputs,
    evidence: [],
    registry: [],
    renderRuntime: runtime,
  };
  run.inputSha = runInputSha(run);
  return run;
}

function captureFreshProductionSmoke({ root, manifest, reviewReady, production, binding, transactionId } = {}) {
  const authorityRunRef = reviewReady?.finalAuditAuthority?.runRef;
  if (!authorityRunRef) throw new Error('PRODUCTION_SMOKE_CANONICAL_RUN_REQUIRED');
  const sourceRun = readBoundJson(root, authorityRunRef);
  const run = productionSmokeRun(root, sourceRun, manifest, production, transactionId);
  const attempt = randomUUID();
  const planRelative = `alive/runtime/approved-releases/${transactionId}/smoke-plan-${attempt}.json`;
  const outputRelative = `alive/runtime/approved-releases/${transactionId}/smoke-${attempt}`;
  const planFile = path.resolve(root, planRelative);
  fs.mkdirSync(path.dirname(planFile), { recursive: true });
  fs.writeFileSync(planFile, `${JSON.stringify({ run, binding, transactionId, reviewReadyRunId: reviewReady.reviewReadyRunId, channel: process.env.APMATH_BROWSER_CHANNEL || null }, null, 2)}\n`, { encoding: 'utf8', flag: 'wx' });
  const collectorFile = fileURLToPath(new URL('../pipeline-core/production-smoke-collector.mjs', import.meta.url));
  const result = spawnSync(process.execPath, [collectorFile, '--root', root, '--plan', planFile, '--out', path.resolve(root, outputRelative)], { encoding: 'utf8', windowsHide: true, maxBuffer: 16 * 1024 * 1024 });
  if (result.error || result.status !== 0) throw new Error(`PRODUCTION_SMOKE_COLLECTOR_FAILED:${result.error?.message || result.stderr || result.stdout || result.status}`);
  try { return JSON.parse(result.stdout.trim().split(/\r?\n/).at(-1)); } catch { throw new Error('PRODUCTION_SMOKE_COLLECTOR_RESULT_INVALID'); }
}

export function executeApprovedRelease({
  root = defaultRoot,
  manifest,
  candidateFile,
  reviewFile,
  reviewReady,
  approval,
  assetsDir,
  dbEntry,
  dbBaselineSha256,
  indexBaselineSha256,
  smokeReport,
  replaceExisting = false,
  dependencies = {},
} = {}) {
  const repoRoot = path.resolve(root);
  const transactionId = transactionIdFor(reviewReady, approval, dependencies.releaseTransactionId || dependencies.transactionId || null);
  let journal = null;
  let baseline = null;
  let stages = ["REVIEW_READY"];
  const persist = () => {
    if (!journal) return null;
    const ref = writeTransactionJournal(repoRoot, transactionId, journal);
    journal.journalRef = ref;
    return ref;
  };
  const identity = () => ({ examId: manifest?.examId || reviewReady?.examId || null, reviewReadyRunId: reviewReady?.reviewReadyRunId || null, revision: reviewReady?.revision || null, candidateSha256: reviewReady?.candidateSha256 || null, targetFile: manifest?.archiveRelativePath?.replaceAll("\\", "/") || null });
  const recordMutation = ({ stage, target, before, after, status = 'COMPLETED', error = null, startedAt }) => {
    const record = mutationRecord(journal, { stage, target, identity: identity(), before, after, status, error, startedAt });
    persist();
    return record;
  };
  const completed = stage => latestMutation(journal, stage);
  const failed = stage => [...(journal?.mutations || [])].reverse().find(row => row.stage === stage && row.status === 'FAILED') || null;
  const currentProductionState = () => releaseBaseline(repoRoot, manifest).production;
  const currentDbState = () => snapshotFile(repoRoot, "archive/db.js");
  const currentIndexState = () => snapshotFile(repoRoot, "archive/question-index.js");
  const nextStage = () => {
    for (const stage of ["PROMOTE_APPROVED_EXAM", "REGISTER_APPROVED_EXAM", "INDEX_REBUILD", "PRODUCTION_SMOKE_RENDER"]) if (!completed(stage)) return stage;
    return "DONE";
  };
  try {
    const candidateRef = reviewReady?.candidateRef || fileRef(repoRoot, relative(repoRoot, candidateFile));
    const assetRefs = reviewReady?.assetRefs || [];
    assertReviewReady(reviewReady, { root: repoRoot, candidateRef, assetRefs });
    assertExternalApproval({ root: repoRoot, reviewReady, approval, candidateRef, assetRefs });
    stages.push("EXTERNAL_APPROVED");
    if (!manifest?.examId || !manifest.archiveRelativePath) throw new Error("RELEASE_MANIFEST_IDENTITY_REQUIRED");
    if (!dbEntry) throw new Error("APPROVED_DB_ENTRY_REQUIRED");
    if (!dbBaselineSha256 || !indexBaselineSha256) throw new Error("RELEASE_BASELINE_SHA_REQUIRED");
    if (approval.dbBaselineSha256 !== dbBaselineSha256) throw new Error("APPROVAL_DB_BASELINE_SHA_MISMATCH");
    if (approval.indexBaselineSha256 !== indexBaselineSha256) throw new Error("APPROVAL_INDEX_BASELINE_SHA_MISMATCH");

    journal = readTransactionJournal(repoRoot, transactionId);
    if (journal) {
      if (journal.transactionId !== transactionId || journal.examId !== manifest.examId || journal.reviewReadyRunId !== reviewReady.reviewReadyRunId || journal.reviewReadySha !== reviewReady.reviewReadySha || journal.approvalSha256 !== objectSha(approval)) throw new Error("RELEASE_TRANSACTION_IDENTITY_MISMATCH");
      baseline = journal.baseline;
      stages = [...(journal.stages || stages)];
    } else {
      baseline = releaseBaseline(repoRoot, manifest);
      journal = { schemaVersion: "APMATH_APPROVED_RELEASE_JOURNAL_v1", transactionId, examId: manifest.examId, reviewReadyRunId: reviewReady.reviewReadyRunId, reviewReadySha: reviewReady.reviewReadySha, approvalSha256: objectSha(approval), baseline, stages: ["REVIEW_READY", "EXTERNAL_APPROVED"], status: "PREPARED", productionAuthorized: false, mutations: [], stageResults: {}, stageTimes: {}, failure: null, recovery: null };
      const declaredProductionBaseline = approval.productionBaseline || approval.productionTargetBaseline || null;
      if (declaredProductionBaseline && !snapshotEqual(declaredProductionBaseline, baseline.production)) throw new Error("RELEASE_PRODUCTION_BASELINE_MISMATCH_BEFORE_WRITE");
      persist();
      if (!completed("PROMOTE_APPROVED_EXAM")) assertReleaseBaseline(approval, baseline, dbBaselineSha256, indexBaselineSha256);
    }
    if (!completed("PROMOTE_APPROVED_EXAM")) {
      const before = currentProductionState();
      if (!snapshotEqual(before, baseline.production)) throw new Error("RELEASE_PRODUCTION_BASELINE_CHANGED");
      const startedAt = new Date().toISOString();
      const promote = dependencies.promote || promoteApprovedExam;
      stages = [...new Set([...stages, "PROMOTE_APPROVED_EXAM"])] ; journal.stages = stages; persist();
      try {
        const result = promote({ root: repoRoot, manifest, candidateFile, reviewFile, reviewReady, approval, assetsDir, replaceExisting, releaseTransactionId: transactionId });
        const after = currentProductionState();
        recordMutation({ stage: "PROMOTE_APPROVED_EXAM", target: `archive/exams/${manifest.archiveRelativePath}`, before, after, startedAt });
        markStage(journal, "PROMOTE_APPROVED_EXAM", result);
        persist();
      } catch (error) {
        const after = currentProductionState();
        recordMutation({ stage: "PROMOTE_APPROVED_EXAM", target: `archive/exams/${manifest.archiveRelativePath}`, before, after, status: "FAILED", error: error.message, startedAt });
        throw error;
      }
    }
    if (completed("PROMOTE_APPROVED_EXAM")) assertKnownState(repoRoot, completed("PROMOTE_APPROVED_EXAM").after, "PROMOTION", currentProductionState());
    const promotion = stageResult(journal, "PROMOTE_APPROVED_EXAM");
    if (!promotion) throw new Error("PROMOTION_RECEIPT_REQUIRED");
    const liveJs = path.resolve(repoRoot, "archive", "exams", manifest.archiveRelativePath);
    const liveCandidateSha = fileRef(repoRoot, relative(repoRoot, liveJs)).sha256;
    if (liveCandidateSha !== reviewReady.candidateSha256) throw new Error("PROMOTION_CANDIDATE_PARITY_FAIL");
    stages = [...new Set([...stages, "PROMOTION_PARITY_PASS"])]; journal.stages = stages; persist();

    if (!completed("REGISTER_APPROVED_EXAM")) {
      const before = currentDbState();
      const startedAt = new Date().toISOString();
      const register = dependencies.register || registerApprovedExam;
      stages = [...new Set([...stages, "REGISTER_APPROVED_EXAM"])]; journal.stages = stages; persist();
      try {
        const result = register({ root: repoRoot, examId: manifest.examId, targetFile: manifest.archiveRelativePath, dbEntry, expectedDbSha256: dbBaselineSha256, reviewReady, approval, promotion, releaseTransactionId: transactionId });
        const after = currentDbState();
        recordMutation({ stage: "REGISTER_APPROVED_EXAM", target: "archive/db.js", before, after, startedAt });
        markStage(journal, "REGISTER_APPROVED_EXAM", result);
        persist();
      } catch (error) {
        const after = currentDbState();
        recordMutation({ stage: "REGISTER_APPROVED_EXAM", target: "archive/db.js", before, after, status: "FAILED", error: error.message, startedAt });
        throw error;
      }
    }
    if (completed("REGISTER_APPROVED_EXAM")) assertKnownState(repoRoot, completed("REGISTER_APPROVED_EXAM").after, "REGISTRATION", currentDbState());
    const registered = stageResult(journal, "REGISTER_APPROVED_EXAM");
    if (!registered) throw new Error("REGISTRATION_RECEIPT_REQUIRED");
    const production = loadProductionBank(repoRoot, manifest.archiveRelativePath);
    const currentDbEntry = loadTargetDbEntry(repoRoot, "archive/db.js", manifest.archiveRelativePath);
    if (!currentDbEntry || currentDbEntry.file !== manifest.archiveRelativePath || currentDbEntry.qCount !== production.questionCount) throw new Error("DB_TARGET_PARITY_FAIL");
    stages = [...new Set([...stages, "DB_TARGET_PARITY_PASS"])]; journal.stages = stages; persist();

    if (!completed("INDEX_REBUILD")) {
      const before = currentIndexState();
      const startedAt = new Date().toISOString();
      const rebuild = dependencies.rebuildIndex || rebuildApprovedIndex;
      stages = [...new Set([...stages, "INDEX_REBUILD"])]; journal.stages = stages; persist();
      try {
        const result = rebuild({ root: repoRoot, examId: manifest.examId, targetFile: manifest.archiveRelativePath, dbEntry: currentDbEntry, expectedIndexSha256: indexBaselineSha256, registration: registered, releaseTransactionId: transactionId });
        const after = currentIndexState();
        recordMutation({ stage: "INDEX_REBUILD", target: "archive/question-index.js", before, after, startedAt });
        markStage(journal, "INDEX_REBUILD", result);
        persist();
      } catch (error) {
        const after = currentIndexState();
        recordMutation({ stage: "INDEX_REBUILD", target: "archive/question-index.js", before, after, status: "FAILED", error: error.message, startedAt });
        throw error;
      }
    }
    if (completed("INDEX_REBUILD")) assertKnownState(repoRoot, completed("INDEX_REBUILD").after, "INDEX", currentIndexState());
    const indexed = stageResult(journal, "INDEX_REBUILD");
    if (!indexed) throw new Error("INDEX_RECEIPT_REQUIRED");
    const indexRows = loadTargetIndexRows(repoRoot, "archive/question-index.js", manifest.archiveRelativePath);
    assertTargetParity({ examId: manifest.examId, targetFile: manifest.archiveRelativePath.replaceAll("\\", "/"), questionCount: production.questionCount, dbEntry: currentDbEntry, indexRows });
    stages = [...new Set([...stages, "INDEX_TARGET_PARITY_PASS"])]; journal.stages = stages; persist();

    let smoke;
    const smokeBinding = productionSmokeBinding(repoRoot, manifest, reviewReady, production, currentDbEntry, indexRows, { releaseTransactionId: transactionId, indexCompletedAt: journal.stageTimes.INDEX_REBUILD });
    if (completed("PRODUCTION_SMOKE_RENDER")) {
      smoke = stageResult(journal, "PRODUCTION_SMOKE_RENDER");
    } else {
      stages = [...new Set([...stages, "PRODUCTION_SMOKE_RENDER"])]; journal.stages = stages; persist();
      const smokeCollector = dependencies.captureProductionSmoke || dependencies.smoke;
      smoke = dependencies.captureProductionSmoke
        ? smokeCollector({ root: repoRoot, manifest, reviewReady, approval, production, dbEntry: currentDbEntry, indexRows, binding: smokeBinding, releaseTransactionId: transactionId })
        : dependencies.smoke
          ? smokeCollector(smokeReport, production.questionCount, smokeBinding, { root: repoRoot, manifest, reviewReady, approval, production, dbEntry: currentDbEntry, indexRows, releaseTransactionId: transactionId })
          : captureFreshProductionSmoke({ root: repoRoot, manifest, reviewReady, production, binding: smokeBinding, transactionId });
      if (!smoke || typeof smoke !== 'object') throw new Error("FRESH_PRODUCTION_SMOKE_REPORT_REQUIRED");
      assertProductionSmokeRender(smoke, production.questionCount, smokeBinding);
      const now = new Date().toISOString();
      recordMutation({ stage: "PRODUCTION_SMOKE_RENDER", target: "alive/runtime/approved-releases/" + transactionId, before: null, after: { smokeId: smoke.smokeId, releaseTransactionId: smoke.releaseTransactionId, capturedAt: smoke.capturedAt }, startedAt: now });
      markStage(journal, "PRODUCTION_SMOKE_RENDER", smoke, now);
      persist();
    }
    assertProductionSmokeRender(smoke, production.questionCount, smokeBinding);
    stages = [...new Set([...stages, "DONE"])]; journal.stages = stages; journal.status = "DONE"; journal.productionAuthorized = true; journal.failure = null; journal.recovery = null; persist();
    const transaction = createReleaseTransaction({ transactionId, reviewReady, approval, stages, status: "DONE", baseline, mutations: journal.mutations, recovery: null });
    return { ...transaction, productionAuthorized: true, productionSmokeBinding: smokeBinding, promotion, registered, indexed };
  } catch (error) {
    const failure = { phase: stages[stages.length - 1], code: error.message };
    let recovery = null;
    if (journal) {
      recovery = { resumeFrom: nextStage(), reason: error.message, actual: { production: currentProductionState(), db: currentDbState(), index: currentIndexState() } };
      journal.status = "HOLD";
      journal.productionAuthorized = false;
      journal.failure = failure;
      journal.recovery = recovery;
      journal.stages = [...new Set([...(journal.stages || stages), failure.phase])];
      try { persist(); } catch {}
    }
    return { ...createReleaseTransaction({ transactionId, reviewReady, approval, stages: journal?.stages || stages, status: "HOLD", failure, baseline: journal?.baseline || baseline, mutations: journal?.mutations || [], recovery }), status: "HOLD", productionAuthorized: false, failure, recovery, journalRef: journal?.journalRef || null };
  }
}

function arg(name, argv = process.argv) {
  const index = argv.indexOf(name);
  if (index < 0 || !argv[index + 1]) throw new Error(name + " is required");
  return path.resolve(argv[index + 1]);
}

function scalarArg(name, argv = process.argv) {
  const index = argv.indexOf(name);
  if (index < 0 || !argv[index + 1]) throw new Error(name + " is required");
  return argv[index + 1];
}

function main() {
  const root = defaultRoot;
  const reviewReady = readJson(arg("--review-ready"));
  const approval = readJson(arg("--approval-receipt"));
  const manifest = readJson(arg("--manifest"));
  const dbEntry = targetDbEntry(root, arg("--db-entry"), manifest.examId);
  const smokeReport = process.argv.includes("--smoke-report") ? readJson(arg("--smoke-report")) : null;
  const result = executeApprovedRelease({
    root,
    manifest,
    candidateFile: arg("--candidate"),
    reviewFile: arg("--review"),
    reviewReady,
    approval,
    assetsDir: arg("--assets"),
    dbEntry,
    dbBaselineSha256: scalarArg("--db-baseline-sha256"),
    indexBaselineSha256: scalarArg("--index-baseline-sha256"),
    smokeReport,
    replaceExisting: process.argv.includes("--replace-existing"),
  });
  if (process.argv.includes("--out")) {
    const output = arg("--out");
    assertStagingOutput(root, output, "RELEASE_TRANSACTION_OUTPUT_FORBIDDEN");
    writeNewJson(output, result);
  }
  console.log(JSON.stringify(result, null, 2));
  if (result.status !== "DONE") process.exitCode = 1;
}

if (path.resolve(fileURLToPath(import.meta.url)) === path.resolve(process.argv[1] || "")) main();
