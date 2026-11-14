// Focused read-only recovery of the open R02 lineage and latest-main target drift.
// This audit does not solve questions, approve solutions, or write shared registries.
const fs = require('fs'), path = require('path'), vm = require('vm');
const cp = require('child_process'), crypto = require('crypto');
const git = (...args) => cp.execFileSync('git', args, { encoding: 'utf8', maxBuffer: 512 * 1024 * 1024 });
process.chdir(git('rev-parse', '--show-toplevel').trim());
const base = path.relative(process.cwd(), __dirname).replaceAll('\\', '/');
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const stable = value => JSON.stringify(value, (_, x) => x && typeof x === 'object' && !Array.isArray(x)
  ? Object.fromEntries(Object.keys(x).sort().map(k => [k, x[k]])) : x);
const hash = value => sha(stable(value ?? null));
const fingerprint = q => sha(JSON.stringify({ content: q.content ?? null,
  choices: Array.isArray(q.choices) ? q.choices : null, answer: q.answer ?? null,
  solution: q.solution ?? null, image: q.image ?? null }));
const load = text => {
  const ctx = vm.createContext({ window: {} }, { codeGeneration: { strings: false, wasm: false } });
  vm.runInContext(text, ctx, { timeout: 3000 });
  const bank = ctx.window.questionBank || ctx.window.examData?.questions;
  if (!Array.isArray(bank)) throw Error('SOURCE_BANK_MISSING');
  return JSON.parse(JSON.stringify(bank));
};
const progress = read(base + '/progress.json');
const currentCommit = git('rev-parse', 'HEAD').trim();
const latestMain = process.argv[2] || git('rev-parse', 'origin/main').trim();
const sweepCommit = 'e853086c37753bf50362bcc1ccf9378f4d20fac3';
const sweepParent = git('rev-parse', sweepCommit + '^').trim();
const targetUids = new Set(progress.exams.flatMap(e => e.questionUids));
const metaPath = 'archive/data/question_metadata.json';
const records = read(metaPath).records;
const registered = new Map(records.map(r => [r.questionUid, r]));
const fields = ['content', 'choices', 'answer', 'solution', 'image'];
const comparisons = [];
for (const p of [metaPath, 'archive/data/question_identity_map.json']) {
  const before = JSON.parse(git('show', progress.baselineMain + ':' + p)).records.filter(r => targetUids.has(r.questionUid));
  const after = JSON.parse(git('show', latestMain + ':' + p)).records.filter(r => targetUids.has(r.questionUid));
  const a = new Map(before.map(r => [r.questionUid, r])), b = new Map(after.map(r => [r.questionUid, r]));
  const changedUids = [...targetUids].filter(uid => hash(a.get(uid)) !== hash(b.get(uid)));
  comparisons.push({ path: p, beforeCount: before.length, afterCount: after.length,
    beforeTargetSha256: hash(before.sort((x,y) => x.questionUid.localeCompare(y.questionUid))),
    afterTargetSha256: hash(after.sort((x,y) => x.questionUid.localeCompare(y.questionUid))), changedUids });
}
const exams = [], failures = [];
for (const exam of progress.exams) {
  const bytes = fs.readFileSync(exam.sourcePath), current = load(bytes.toString());
  const baselineBytes = git('show', progress.baselineMain + ':' + exam.sourcePath);
  const mainBytes = git('show', latestMain + ':' + exam.sourcePath);
  const common = { sourceArchiveFile: exam.sourceArchiveFile, questionCount: current.length,
    sourceOnly: exam.sourceOnly, currentRawSha256: sha(bytes),
    currentBlobSha1: git('hash-object', exam.sourcePath).trim(),
    baselineRawSha256: sha(baselineBytes), latestMainRawSha256: sha(mainBytes),
    targetSourceDriftSinceBaseline: baselineBytes !== mainBytes };
  if (common.targetSourceDriftSinceBaseline) failures.push({ source: exam.sourceArchiveFile, type: 'MAIN_SOURCE_DRIFT' });
  if (exam.sourceOnly) {
    const nonemptySolutions = current.flatMap((q, i) => String(q.solution ?? '').trim() ? [i + 1] : []);
    const nonemptyAnswers = current.flatMap((q, i) => String(q.answer ?? '').trim() ? [i + 1] : []);
    exams.push({ ...common, solutionStatus: 'SOURCE_ONLY_NO_VERIFIED_METHOD_EVIDENCE',
      nonemptySolutionOrdinals: nonemptySolutions, nonemptyAnswerOrdinals: nonemptyAnswers,
      registrationCurrentMatches: current.filter((q,i) => fingerprint(q) === registered.get(exam.questionUids[i]).sourceFingerprint).length,
      sourceFingerprintCaveat: 'Legacy QFULL uses content; this source uses question. Raw source SHA and question field hashes in preserved review remain necessary.' });
    continue;
  }
  const before = load(git('show', sweepParent + ':' + exam.sourcePath));
  const after = load(git('show', sweepCommit + ':' + exam.sourcePath));
  const items = current.map((q, i) => {
    const reg = registered.get(exam.questionUids[i]);
    const beforeHash = fingerprint(before[i]), sweepHash = fingerprint(after[i]), currentHash = fingerprint(q);
    const item = { ordinal: i + 1, questionUid: exam.questionUids[i], registeredQfull: reg.sourceFingerprint,
      registeredMatchesSweepParent: reg.sourceFingerprint === beforeHash,
      sweepParentQfull: beforeHash, sweepQfull: sweepHash, currentQfull: currentHash,
      changedQfullFieldsAtSweep: fields.filter(k => hash(before[i][k]) !== hash(after[i][k])),
      changedQfullFieldsSinceSweep: fields.filter(k => hash(after[i][k]) !== hash(q[k])),
      changedQfullFieldsFromRegisteredVersion: fields.filter(k => hash(before[i][k]) !== hash(q[k])),
      solutionSha256: sha(String(q.solution ?? '')),
      registeredReviewStatus: reg.reviewStatus ?? null,
      registeredMetadataApprovalType: reg.metadataApprovalType ?? null,
      registeredHoldReason: reg.metaFoundationHoldReason ?? null,
      approvalEvidenceRefs: reg.approvalEvidence ?? [],
      conclusion: 'LINEAGE_RECONCILED_CURRENT_VERSION_APPROVAL_PENDING',
      nextAction: 'Reuse this lineage and prior item metadata review; attach actual final-solution approval matching current bytes. Never set VERIFIED_FINAL or reviewed_pass from fingerprint reconciliation alone.' };
    if (!item.registeredMatchesSweepParent || item.changedQfullFieldsAtSweep.some(k => k !== 'solution')
      || item.changedQfullFieldsFromRegisteredVersion.some(k => k !== 'solution')) {
      failures.push({ source: exam.sourceArchiveFile, ordinal: i + 1, type: 'UNEXPECTED_FINGERPRINT_LINEAGE' });
    }
    return item;
  });
  exams.push({ ...common, status: 'LINEAGE_RECONCILED_APPROVAL_NOT_GRANTED', items });
}
for (const entry of comparisons) if (entry.changedUids.length || entry.beforeCount !== 286 || entry.afterCount !== 286)
  failures.push({ path: entry.path, type: 'TARGET_SHARED_RECORD_DRIFT', changedUids: entry.changedUids });
const solved = exams.flatMap(e => e.items || []);
const out = { schemaVersion: 'm1-s1-resume-lineage-audit-v1', generatedAt: new Date().toISOString(),
  workKey: progress.workKey, taskId: progress.taskId, baselineMain: progress.baselineMain,
  observedWorkHead: currentCommit, latestMain, sweepCommit, sweepParent,
  method: 'Replay official QFULL content/choices/answer/solution/image serialization against exact Git versions; compare only the 286 target metadata/identity rows.',
  status: failures.length ? 'FAIL' : 'LINEAGE_AND_TARGET_DRIFT_CHECKS_PASSED',
  notAnApproval: true, registryWritePerformed: false,
  summary: { targetQuestions: targetUids.size, solvedQuestions: solved.length,
    registeredHashesReproducedAtSweepParent: solved.filter(r => r.registeredMatchesSweepParent).length,
    currentRegisteredQfullMismatches: solved.filter(r => r.currentQfull !== r.registeredQfull).length,
    solutionOnlyQfullChanges: solved.filter(r => r.changedQfullFieldsFromRegisteredVersion.join(',') === 'solution').length,
    postSweepSolutionDeltaCount: solved.filter(r => r.changedQfullFieldsSinceSweep.includes('solution')).length,
    sourceOnlyQuestions: exams.filter(e => e.sourceOnly).reduce((n,e) => n + e.questionCount,0) },
  sharedTargetRecordComparison: comparisons, exams, failures };
const dest = process.argv[3] || base + '/verification/resume-source-lineage.json';
fs.writeFileSync(dest, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify({ status: out.status, summary: out.summary, targetRecordDrift: comparisons.map(x => ({path:x.path, count:x.changedUids.length})), failures, output: dest }));
process.exitCode = failures.length ? 1 : 0;
