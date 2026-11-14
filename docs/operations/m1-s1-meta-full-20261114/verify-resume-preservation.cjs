#!/usr/bin/env node
'use strict';

// Read-only structural preservation receipt. Does not run quality, solution,
// asset, official resolver, or four-slot semantic validation workflows.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const cp = require('child_process');
const vm = require('vm');

const args = process.argv.slice(2);
const option = (name, fallback) => {
  const index = args.indexOf(name);
  return index < 0 ? fallback : args[index + 1];
};
const repo = path.resolve(option('--repo', process.cwd()));
const baseline = option('--baseline', '327c4518d0e89aac9cb4879fdd4c58b3b8ff34fc');
const output = path.resolve(option('--output', path.join(__dirname, 'resume-preservation-verification.json')));
const operation = 'docs/operations/m1-s1-meta-full-20261114';
const git = (...argv) => cp.execFileSync('git', argv, { cwd: repo, maxBuffer: 512 * 1024 * 1024 });
const gitText = (...argv) => git(...argv).toString('utf8').trim();
const readBytes = relative => fs.readFileSync(path.join(repo, relative));
const readJson = relative => JSON.parse(readBytes(relative).toString('utf8'));
const baselineBytes = relative => git('show', `${baseline}:${relative}`);
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const stable = value => JSON.stringify(value, (_, current) => current && typeof current === 'object' && !Array.isArray(current)
  ? Object.fromEntries(Object.keys(current).sort().map(key => [key, current[key]])) : current);
const objectSha = value => sha(stable(value));
const same = (left, right) => stable(left) === stable(right);
const gitBlob = bytes => crypto.createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
const nullList = bytes => bytes.toString('utf8').split('\0').filter(Boolean);
const failures = [];
const check = (ok, code, context = {}) => {
  if (!ok) failures.push({ code, ...context });
  return Boolean(ok);
};
const sourceShape = bytes => {
  const sandbox = vm.createContext({ window: {}, console: { log() {}, warn() {}, error() {} } },
    { codeGeneration: { strings: false, wasm: false } });
  vm.runInContext(bytes.toString('utf8'), sandbox, { timeout: 3000 });
  const bank = sandbox.window.questionBank || sandbox.window.examData?.questions;
  if (!Array.isArray(bank)) throw new Error('SOURCE_QUESTION_ARRAY_MISSING');
  return { questions: bank, count: bank.length, rawIds: bank.map(q => q.id ?? null),
    embeddedUids: bank.map(q => q.questionUid ?? q.uid ?? null) };
};
const allowed = relative => relative === 'WORKER_CURRENT.md' || relative.startsWith(operation + '/');
const scopeSnapshot = () => {
  const head = gitText('rev-parse', 'HEAD');
  const committed = nullList(git('diff', '--name-only', '-z', baseline, head, '--'));
  const trackedWorking = nullList(git('diff', '--name-only', '-z', 'HEAD', '--'));
  const untracked = nullList(git('ls-files', '--others', '--exclude-standard', '-z'));
  const paths = [...new Set([...committed, ...trackedWorking, ...untracked])].sort();
  return { head, committedSinceResume: committed, trackedWorkingChanges: trackedWorking,
    untracked, changedPaths: paths, outsideAllowedPaths: paths.filter(p => !allowed(p)) };
};

const startedAt = new Date().toISOString();
const scopeStart = scopeSnapshot();
check(gitText('rev-parse', `${baseline}^{commit}`) === baseline, 'RESUME_COMMIT_NOT_EXACT');
const progressPath = `${operation}/progress.json`;
const baseProgressRaw = baselineBytes(progressPath);
const baseProgress = JSON.parse(baseProgressRaw.toString('utf8'));
const currentProgressRaw = readBytes(progressPath);
const currentProgress = JSON.parse(currentProgressRaw.toString('utf8'));
const currentExams = new Map(currentProgress.exams.map(exam => [exam.sourceArchiveFile, exam]));
check(baseProgress.exams.length === 12 && currentProgress.exams.length === 12, 'EXAM_COUNT');
check(same(baseProgress.exams.map(e => e.sourceArchiveFile), currentProgress.exams.map(e => e.sourceArchiveFile)),
  'PROGRESS_EXAM_ORDER_CHANGED');

const mapPaths = ['archive/data/question_identity_map.json', 'archive/data/question_metadata.json'];
const mapData = mapPaths.map(relative => {
  const beforeBytes = baselineBytes(relative), afterBytes = readBytes(relative);
  return { path: relative, baselineFileSha256: sha(beforeBytes), currentFileSha256: sha(afterBytes),
    before: JSON.parse(beforeBytes.toString('utf8')).records,
    after: JSON.parse(afterBytes.toString('utf8')).records };
});
const identityProjection = (records, source) => records.filter(row => row.sourceArchiveFile === source)
  .map(row => ({ sourceOrdinal: Number(row.sourceOrdinal), questionUid: row.questionUid }))
  .sort((a, b) => a.sourceOrdinal - b.sourceOrdinal);
const artifactNames = ['review.json', 'four-slot.json', 'independent-review.json', 'checks.json'];
const sources = [], artifacts = [], samples = [], inherited = [], residualReuse = [], uidOrders = [];
const allUids = [], allSampleUids = [];

for (const exam of baseProgress.exams) {
  const name = path.basename(exam.sourceArchiveFile, '.js');
  const context = { exam: name };
  const sourceBefore = baselineBytes(exam.sourcePath), sourceAfter = readBytes(exam.sourcePath);
  const sourceEqual = check(sourceBefore.equals(sourceAfter), 'SOURCE_BYTES_CHANGED', context);
  const source = sourceShape(sourceAfter);
  const baselineSource = sourceShape(sourceBefore);
  check(source.count === exam.questionCount, 'SOURCE_COUNT_CHANGED', context);
  check(source.count === exam.questionUids.length, 'SOURCE_UID_COUNT_MISMATCH', context);
  const currentExam = currentExams.get(exam.sourceArchiveFile);
  check(currentExam && same(exam.questionUids, currentExam.questionUids), 'PROGRESS_UID_ORDER_CHANGED', context);
  sources.push({ ...context, path: exam.sourcePath, sourceArchiveFile: exam.sourceArchiveFile,
    baselineSha256: sha(sourceBefore), currentSha256: sha(sourceAfter), baselineGitBlob: gitBlob(sourceBefore),
    currentGitBlob: gitBlob(sourceAfter), bytes: sourceAfter.length, rawBytesIdentical: sourceEqual,
    questionCount: source.count, sourceRawIdOrderSha256: objectSha(source.rawIds),
    sourceEmbeddedCanonicalUidCount: source.embeddedUids.filter(x => /^qid_v1_[0-9a-f]{64}$/.test(x ?? '')).length });

  const perExam = {};
  for (const filename of artifactNames) {
    const relative = `${operation}/exams/${name}/${filename}`;
    const before = baselineBytes(relative), after = readBytes(relative);
    const identical = check(before.equals(after), 'ORIGINAL_ARTIFACT_BYTES_CHANGED', { ...context, path: relative });
    perExam[filename] = { relative, before: JSON.parse(before.toString('utf8')),
      after: JSON.parse(after.toString('utf8')), baselineSha256: sha(before), currentSha256: sha(after) };
    artifacts.push({ ...context, path: relative, baselineSha256: sha(before), currentSha256: sha(after),
      bytes: after.length, rawBytesIdentical: identical });
  }
  const review = perExam['review.json'], four = perExam['four-slot.json'], independent = perExam['independent-review.json'];
  const checks = perExam['checks.json'];
  for (const [key, file] of [['review', review], ['fourSlot', four], ['independentReview', independent]]) {
    check(checks.after.artifactHashes?.[key] === file.currentSha256,
      'FINAL_CHECKS_ARTIFACT_REFERENCE_MISMATCH', { ...context, fieldPath: `/artifactHashes/${key}` });
  }
  const expected = exam.questionUids.map((questionUid, i) => ({ sourceOrdinal: i + 1, questionUid }));
  const beforeReview = review.before.items.map(row => ({ sourceOrdinal: Number(row.ordinal), questionUid: row.questionUid }));
  const afterReview = review.after.items.map(row => ({ sourceOrdinal: Number(row.ordinal), questionUid: row.questionUid }));
  const beforeFour = four.before.items.map(row => ({ sourceOrdinal: Number(row.sourceOrdinal), questionUid: row.questionUid }));
  const afterFour = four.after.items.map(row => ({ sourceOrdinal: Number(row.sourceOrdinal), questionUid: row.questionUid }));
  const joins = {};
  for (const [kind, rows] of Object.entries({ baselineReview: beforeReview, currentReview: afterReview,
    baselineFourSlot: beforeFour, currentFourSlot: afterFour })) {
    joins[kind] = check(same(rows, expected), 'UID_ORDER_JOIN_MISMATCH', { ...context, kind });
  }
  for (const map of mapData) {
    const before = identityProjection(map.before, exam.sourceArchiveFile);
    const after = identityProjection(map.after, exam.sourceArchiveFile);
    joins[map.path + ':baseline'] = check(same(before, expected), 'BASELINE_CANONICAL_UID_JOIN_MISMATCH', { ...context, path: map.path });
    joins[map.path + ':current'] = check(same(after, expected), 'CURRENT_CANONICAL_UID_JOIN_MISMATCH', { ...context, path: map.path });
  }
  for (let i = 0; i < source.embeddedUids.length; i++) {
    const uid = source.embeddedUids[i];
    if (/^qid_v1_[0-9a-f]{64}$/.test(uid ?? '')) {
      check(uid === exam.questionUids[i], 'SOURCE_EMBEDDED_UID_ORDER_MISMATCH', { ...context, ordinal: i + 1 });
    }
  }
  uidOrders.push({ ...context, count: expected.length, orderSha256: objectSha(expected), questionUids: exam.questionUids, joins });
  allUids.push(...exam.questionUids);

  const independentSamples = independent.after.samples;
  check(independentSamples.length === 3, 'INDEPENDENT_SAMPLE_COUNT', context);
  check(same(independent.before.samples, independentSamples), 'INDEPENDENT_SAMPLES_CHANGED', context);
  check(same(exam.independentSampleOrdinals, independentSamples.map(s => s.ordinal)), 'SAMPLE_SELECTION_CHANGED', context);
  check(same(currentExam?.independentSampleOrdinals, independentSamples.map(s => s.ordinal)), 'CURRENT_SAMPLE_SELECTION_CHANGED', context);
  check(independent.after.sourceCurrentBlob === gitBlob(sourceAfter), 'INDEPENDENT_SOURCE_BLOB_MISMATCH', context);
  for (const sample of independentSamples) {
    const index = Number(sample.ordinal) - 1;
    const sourceUid = exam.questionUids[index];
    const bReview = review.before.items[index], aReview = review.after.items[index];
    const bFour = four.before.items[index], aFour = four.after.items[index];
    const valid = check(sourceUid === sample.questionUid && aReview?.questionUid === sample.questionUid
      && aFour?.questionUid === sample.questionUid && Number(aFour?.sourceOrdinal) === Number(sample.ordinal),
    'INDEPENDENT_SAMPLE_UID_JOIN_MISMATCH', { ...context, ordinal: sample.ordinal });
    const reviewEqual = check(same(bReview, aReview), 'SAMPLED_REVIEW_ITEM_CHANGED', { ...context, ordinal: sample.ordinal });
    const fourEqual = check(same(bFour, aFour), 'SAMPLED_FOUR_SLOT_ITEM_CHANGED', { ...context, ordinal: sample.ordinal });
    const question = source.questions[index], baseQuestion = baselineSource.questions[index];
    const fingerprints = q => ({
      QBODY: sha(JSON.stringify({ content: q.content ?? null, choices: Array.isArray(q.choices) ? q.choices : null,
        image: q.image ?? null })),
      QFULL: sha(JSON.stringify({ content: q.content ?? null, choices: Array.isArray(q.choices) ? q.choices : null,
        answer: q.answer ?? null, solution: q.solution ?? null, image: q.image ?? null }))
    });
    const actualFingerprints = fingerprints(question), priorFingerprints = fingerprints(baseQuestion);
    const sourceFingerprintChecks = {};
    for (const scope of ['QBODY', 'QFULL']) {
      const recorded = aFour.fingerprints?.find(f => f.scope === scope)?.value;
      const reviewRecorded = aReview.currentFingerprintReview?.[scope] ?? null;
      sourceFingerprintChecks[scope] = { computedCurrent: actualFingerprints[scope], computedBaseline: priorFingerprints[scope],
        recordedFourSlot: recorded, recordedReview: reviewRecorded,
        fourSlotMatchesCurrentSource: check(recorded === actualFingerprints[scope], 'SAMPLE_FOUR_FINGERPRINT_MISMATCH',
          { ...context, ordinal: sample.ordinal, scope }),
        baselineSourceMatchesCurrentSource: check(priorFingerprints[scope] === actualFingerprints[scope], 'SAMPLE_SOURCE_FINGERPRINT_CHANGED',
          { ...context, ordinal: sample.ordinal, scope }),
        reviewMatchesCurrentSource: reviewRecorded === null ? null : check(reviewRecorded === actualFingerprints[scope],
          'SAMPLE_REVIEW_FINGERPRINT_MISMATCH', { ...context, ordinal: sample.ordinal, scope }) };
    }
    const rawStemHashes = [], declaredHashChecks = [];
    const candidateQuestionHashes = new Map();
    for (const field of ['question', 'content']) {
      if (typeof question[field] !== 'string') continue;
      const actual = sha(question[field]);
      const before = typeof baseQuestion[field] === 'string' ? sha(baseQuestion[field]) : null;
      rawStemHashes.push({ field, algorithm: 'sha256-raw-utf8-field', computedCurrent: actual, computedBaseline: before,
        baselineSourceMatchesCurrentSource: check(before === actual, 'SAMPLE_RAW_STEM_CHANGED', { ...context, ordinal: sample.ordinal, field }) });
      candidateQuestionHashes.set(`sha256-raw-utf8-${field}`, actual);
      candidateQuestionHashes.set(`sha256-json-string-${field}`, sha(JSON.stringify(question[field])));
      candidateQuestionHashes.set(`sha256-json-object-${field}`, sha(JSON.stringify({ [field]: question[field] })));
    }
    check(rawStemHashes.length > 0, 'SAMPLE_SOURCE_STEM_MISSING', { ...context, ordinal: sample.ordinal });
    for (const [label, row] of [['review', aReview], ['four-slot', aFour]]) {
      for (const field of ['sourceQuestionSha256', 'sourceStemSha256', 'protectedQuestionSha256']) {
        if (typeof row[field] !== 'string') continue;
        const matchedAlgorithms = [...candidateQuestionHashes].filter(([, value]) => value === row[field]).map(([algorithm]) => algorithm);
        declaredHashChecks.push({ path: `${label}.json#/items/${index}/${field}`, recorded: row[field], matchedAlgorithms,
          matchesCurrentRawSource: check(matchedAlgorithms.length > 0, 'SAMPLE_DECLARED_QUESTION_HASH_MISMATCH',
            { ...context, ordinal: sample.ordinal, artifact: label, field }) });
      }
    }
    const registeredFingerprints = mapData.map(map => {
      const before = map.before.find(row => row.questionUid === sample.questionUid);
      const after = map.after.find(row => row.questionUid === sample.questionUid);
      const preserved = check(before?.sourceFingerprint === after?.sourceFingerprint, 'SAMPLE_REGISTERED_FINGERPRINT_CHANGED',
        { ...context, ordinal: sample.ordinal, path: map.path });
      return { path: map.path, registeredBaseline: before?.sourceFingerprint ?? null,
        registeredCurrent: after?.sourceFingerprint ?? null, registeredValuePreserved: preserved,
        matchesCurrentQFULL: after?.sourceFingerprint === actualFingerprints.QFULL,
        interpretation: after?.sourceFingerprint === actualFingerprints.QFULL ? 'FINGERPRINT_MATCH_IS_NOT_QUALITY_APPROVAL'
          : 'PREEXISTING_CURRENT_SOURCE_VS_REGISTERED_QFULL_GAP_NOT_NEW_RESUME_MUTATION' };
    });
    samples.push({ ...context, ordinal: sample.ordinal, questionUid: sample.questionUid,
      independentReviewPath: independent.relative, independentReviewSha256: independent.currentSha256,
      sourceSha256: sha(sourceAfter), reviewPath: review.relative, reviewSha256: review.currentSha256,
      fourSlotPath: four.relative, fourSlotSha256: four.currentSha256,
      sampleRecordSha256: objectSha(sample), sampledReviewItemSha256: objectSha(aReview),
      sampledFourSlotItemSha256: objectSha(aFour), uidOrdinalJoinValid: valid,
      sampledReviewItemPreserved: reviewEqual, sampledFourSlotItemPreserved: fourEqual,
      sourceFingerprintChecks, rawStemHashes, declaredQuestionHashChecks: declaredHashChecks, registeredFingerprints,
      priorResultPreserved: sample.result, reviewAction: 'REUSED_WITHOUT_NEW_INDEPENDENT_SEMANTIC_REVIEW' });
    allSampleUids.push(sample.questionUid);
  }

  for (const [filename, field, workerField] of [
    ['review.json', 'reviewSha256', 'workerReviewSha256'],
    ['four-slot.json', 'fourSlotSha256', 'workerFourSlotSha256']]) {
    const actual = perExam[filename].currentSha256;
    const recorded = independent.after.finalAuthorArtifactReadback?.[field] ?? null;
    const oldWorker = independent.after[workerField] ?? null;
    if (recorded !== actual || oldWorker !== actual) inherited.push({ ...context,
      independentReviewPath: independent.relative, referencedPath: perExam[filename].relative,
      finalAuthorReadbackFieldPath: `${independent.relative}#/finalAuthorArtifactReadback/${field}`,
      initialWorkerFieldPath: `${independent.relative}#/${workerField}`,
      recordedFinalAuthorReadbackSha256: recorded, recordedInitialWorkerSha256: oldWorker,
      actualBaselineSha256: perExam[filename].baselineSha256, actualCurrentSha256: actual,
      finalReadbackMatchesCurrentBytes: recorded === actual, initialWorkerMatchesCurrentBytes: oldWorker === actual,
      alreadyPresentAtResume: same(independent.before.finalAuthorArtifactReadback, independent.after.finalAuthorArtifactReadback)
        && perExam[filename].baselineSha256 === actual,
      disposition: 'INHERITED_REFERENCE_MISMATCH_RECORDED_NOT_TREATED_AS_NEW_RESUME_MUTATION',
      currentReuseBinding: 'THIS_RECEIPT_BINDS_ACTUAL_BASELINE_AND_CURRENT_BYTES_AND_SAMPLE_UID_ORDINAL' });
  }

  const residualPath = `${operation}/exams/${name}/residual-review.json`;
  const residualBytes = readBytes(residualPath), residual = JSON.parse(residualBytes.toString('utf8'));
  const declaredIndependent = residual.priorIndependentReviewSha256 ?? residual.baseline?.independentReviewSha256 ?? null;
  const referenceMatched = declaredIndependent === null ? null : check(declaredIndependent === independent.currentSha256,
    'RESIDUAL_INDEPENDENT_REFERENCE_MISMATCH', context);
  residualReuse.push({ ...context, residualPath, residualSha256: sha(residualBytes),
    declaredIndependentReviewSha256: declaredIndependent, declaredReferenceMatches: referenceMatched,
    independentReviewPath: independent.relative, independentReviewSha256: independent.currentSha256,
    referenceBasis: declaredIndependent === null ? 'DIRECT_BINDING_IN_THIS_PRESERVATION_RECEIPT' : 'RESIDUAL_DECLARED_HASH_MATCH',
    reusedSampleCount: independentSamples.length });
}

check(sources.length === 12, 'TOTAL_SOURCE_COUNT');
check(artifacts.length === 48, 'TOTAL_ORIGINAL_ARTIFACT_COUNT');
check(allUids.length === 286 && new Set(allUids).size === 286, 'TOTAL_UNIQUE_UID_COUNT');
check(samples.length === 36 && new Set(allSampleUids).size === 36, 'TOTAL_UNIQUE_SAMPLE_COUNT');
const scopeEnd = scopeSnapshot();
check(scopeStart.outsideAllowedPaths.length === 0 && scopeEnd.outsideAllowedPaths.length === 0, 'GIT_CHANGE_SCOPE_VIOLATION',
  { start: scopeStart.outsideAllowedPaths, end: scopeEnd.outsideAllowedPaths });

const report = {
  schemaVersion: 'm1-s1-resume-preservation-v1', workKey: 'M1-S1-META-FULL',
  taskId: 'ef319e48-5efb-4d99-a4ac-5ded7ac1d74d', author: 'META_A', startedAt, completedAt: new Date().toISOString(),
  baselineResumeCommit: baseline, repositoryPath: repo, observedHeadStart: scopeStart.head, observedHeadEnd: scopeEnd.head,
  headStableDuringRead: scopeStart.head === scopeEnd.head,
  scope: 'READ_ONLY_BYTES_IDENTITY_ORDER_AND_PRIOR_SAMPLE_PRESERVATION',
  result: failures.length ? 'STRUCTURAL_PRESERVATION_FAILURE' : 'STRUCTURAL_PRESERVATION_CONFIRMED',
  qualityStatus: 'NOT_A_QUALITY_OR_SEMANTIC_PASS',
  verificationMeaning: '재개점 대비 원문 bytes·UID 순서·기존 검토 bytes·표본 재사용의 구조적 보존만 확인한다. 내부 과거 해시 불일치는 별도 공개하며 정답/해설 승인이나 품질 PASS로 해석하지 않는다.',
  verificationActions: { fullReviewRerun: false, independentSemanticReviewRerun: false, solutionRereview: false,
    assetsDownloaded: false, officialResolverRun: false, sharedRegistryModified: false, originalArtifactsModified: false,
    gitMutationPerformed: false, onlyWrittenArtifact: output },
  summary: { sourceCount: sources.length, sourceBytesPreserved: sources.filter(r => r.rawBytesIdentical).length,
    canonicalUidCount: allUids.length, uniqueCanonicalUidCount: new Set(allUids).size,
    originalArtifactCount: artifacts.length, originalArtifactsPreserved: artifacts.filter(r => r.rawBytesIdentical).length,
    reusedIndependentSampleCount: samples.length, uniqueSampleUidCount: new Set(allSampleUids).size,
    sampleUidOrdinalJoinsValid: samples.filter(r => r.uidOrdinalJoinValid).length,
    samplesWithCurrentSourceFingerprintsMatched: samples.filter(r => ['QBODY', 'QFULL'].every(scope =>
      r.sourceFingerprintChecks[scope].fourSlotMatchesCurrentSource && r.sourceFingerprintChecks[scope].baselineSourceMatchesCurrentSource)).length,
    samplesWithCurrentRawStemRebound: samples.filter(r => r.rawStemHashes.length > 0 &&
      r.rawStemHashes.every(h => h.baselineSourceMatchesCurrentSource) && r.declaredQuestionHashChecks.every(h => h.matchesCurrentRawSource)).length,
    samplesWithPreexistingRegisteredQfullGap: samples.filter(r => r.registeredFingerprints.some(f => !f.matchesCurrentQFULL)).length,
    inheritedFinalReadbackMismatchFileCount: inherited.filter(r => !r.finalReadbackMatchesCurrentBytes).length,
    inheritedInitialWorkerMismatchFileCount: inherited.filter(r => !r.initialWorkerMatchesCurrentBytes).length,
    changedPathCount: scopeEnd.changedPaths.length, outsideAllowedPathCount: scopeEnd.outsideAllowedPaths.length,
    structuralFailureCount: failures.length },
  identityResolution: 'Source position is preserved by raw-byte equality. Canonical questionUid order is joined by sourceArchiveFile + sourceOrdinal through baseline/current identity and metadata maps, progress, review and four-slot arrays; no new UID is generated.',
  hashAlgorithms: { rawFiles: 'SHA-256 over exact raw bytes', itemAndOrderHashes: 'SHA-256 over UTF-8 JSON with recursively sorted object keys and preserved array order',
    sampleSourceFingerprints: 'Prior verify-packet.cjs field order: QBODY={content,choices,image}; QFULL={content,choices,answer,solution,image}; SHA-256 of JSON.stringify. SOURCE_ONLY question text is separately protected by raw UTF-8 stem hashes.',
    gitBlobs: 'Git SHA-1 blob header plus bytes' },
  progressReferences: { path: progressPath, baselineSha256: sha(baseProgressRaw), observedCurrentSha256: sha(currentProgressRaw) },
  canonicalMapReferences: mapData.map(({ path, baselineFileSha256, currentFileSha256 }) => ({ path, baselineFileSha256, currentFileSha256 })),
  sources, originalArtifacts: artifacts, uidOrderByExam: uidOrders, reusedSamples: samples,
  residualToIndependentReuseBindings: residualReuse, knownPreexistingReferenceMismatch: inherited,
  gitChangeScope: { allowedPrefixes: [operation + '/'], allowedExactPaths: ['WORKER_CURRENT.md'], start: scopeStart, end: scopeEnd },
  reproducibility: { script: path.basename(__filename), scriptSha256: sha(fs.readFileSync(__filename)),
    command: ['node', path.basename(__filename), '--repo', '<repository-root>', '--baseline', baseline, '--output', '<receipt-path>'] },
  failures
};
fs.writeFileSync(output, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ output, sha256: sha(fs.readFileSync(output)), result: report.result, summary: report.summary }, null, 2));
process.exitCode = failures.length ? 1 : 0;
