import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { isDeepStrictEqual } from 'node:util';

// Read-only official Consumer capture. Only the named scratch report is written.
// Baseline: --root ISOLATED --plan PLAN.json --out BASELINE.json
// Compare:  --root ISOLATED_AFTER --baseline BASELINE.json --out AFTER.json
const scriptPath = fileURLToPath(import.meta.url);
const scratch = path.dirname(scriptPath);
const targetSource = 'original/middle/m1/2mid/26_왕운중_2학기_중간_중1_기출.js';
const args = {};
for (let i = 2; i < process.argv.length; i += 2) {
  const key = process.argv[i], value = process.argv[i + 1];
  if (!['--root', '--plan', '--baseline', '--out'].includes(key) || !value || args[key]) throw Error('Invalid arguments');
  args[key] = path.resolve(value);
}
if (!args['--root'] || !args['--out'] || (!args['--plan'] && !args['--baseline'])) throw Error('Root, output and plan/baseline required');
const root = fs.realpathSync(args['--root']);
const output = args['--out'];
if (path.dirname(output) !== scratch || fs.existsSync(output)) throw Error('Use a new report directly inside the script scratch directory');
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const stable = value => JSON.stringify(value, (_, v) => v && typeof v === 'object' && !Array.isArray(v)
  ? Object.fromEntries(Object.keys(v).sort().map(k => [k, v[k]])) : v);
const hashObject = value => sha(stable(value));
const fileRef = file => ({ path: file, sha256: sha(fs.readFileSync(file)), sizeBytes: fs.statSync(file).size });
const repoRef = relative => ({ ...fileRef(path.join(root, relative)), path: relative });
const need = (condition, message) => { if (!condition) throw Error(message); };
const byUid = rows => {
  const map = new Map();
  for (const row of rows) { need(row.questionUid && !map.has(row.questionUid), 'Missing or duplicate scoped UID'); map.set(row.questionUid, row); }
  return map;
};
const packPaths = owner => {
  const slug = owner.toLowerCase().replaceAll('_', '-');
  return { runtime: `archive/data/meta-foundation/runtime/${slug}-v1.json`,
    pack: `archive/data/meta-foundation/canonical/packs/${slug}/pack.json`,
    bindings: `archive/data/meta-foundation/canonical/packs/${slug}/bindings.json` };
};
const summaryFields = ['questionUid', 'sourceFile', 'sourceOrdinal', 'curriculumKey', 'courseKey',
  'L1', 'L2', 'L3', 'L4', 'standardCourse', 'standardUnitKey', 'subUnitKey', 'problemTypeKey', 'templateKey',
  'nativeCurriculum', 'nativeL1', 'nativeL2', 'nativeL3', 'nativeL4', 'crossConceptKeys', 'conditionKeys',
  'integrationPattern', 'reviewStatus', 'sourceReviewStatus', 'tagStatus', 'tagConfidence', 'metadataStatus',
  'metadataRevision', 'nativeMetaStatus', 'canonicalAssignmentReasons', 'metadataConflicts', 'metaBinding',
  'metaHintPT', 'metaHintTPL', 'metaStatus', 'directSelectable', 'verifiedEligible', 'defaultSelectable',
  'metaCompleteness', 'metaBindingMode', 'sourceIntegrityStatus', 'sourceStatus', 'sourceIssueHold',
  'sourceQualityDisposition', 'curriculumApplicability', 'rpmSemanticStatus', 'rpmEvidenceDebtFields'];
const safeConsumerView = row => {
  if (!row) return null;
  const view = Object.fromEntries(summaryFields.map(k => [k, Object.hasOwn(row, k) ? row[k] : null]));
  const evidence = row.assignmentEvidence;
  view.assignmentApproval = evidence ? { approvalStatus: evidence.approvalStatus ?? null,
    reviewStatus: evidence.reviewEvidence?.status ?? null,
    approvalType: evidence.reviewEvidence?.approvalType ?? null,
    reviewEvidenceSha256: evidence.reviewEvidence ? hashObject(evidence.reviewEvidence) : null } : null;
  return view;
};

async function main() {
  const baseline = args['--baseline'] ? read(args['--baseline']) : null;
  if (baseline) need(baseline.status === 'BASELINE_CAPTURED_REAL_CONSUMER' && baseline.targetExam.sourceArchiveFile === targetSource,
    'A successful exact Wangun baseline is required');
  const plan = args['--plan'] ? read(args['--plan']) : null;
  const planReference = plan ? fileRef(args['--plan']) : baseline.planReference;
  const owners = ['MIDDLE1', 'FUNCTIONS_GRAPHS'];
  const packs = owners.map(owner => {
    const files = packPaths(owner), runtime = read(path.join(root, files.runtime));
    need(runtime.packId === owner && Array.isArray(runtime.records), 'Runtime pack mismatch: ' + owner);
    return { owner, files, runtime, pack: read(path.join(root, files.pack)),
      bindings: read(path.join(root, files.bindings)).bindings };
  });
  const allRuntime = byUid(packs.flatMap(p => p.runtime.records));
  const targetUids = new Set(baseline ? baseline.targetExam.questionUids : plan.items.map(r => r.questionUid));
  need(targetUids.size === 23, 'Current Wangun denominator must be 23');
  let targets, scope;
  if (baseline) {
    targets = baseline.targets;
    scope = baseline.scope;
  } else {
    need(planReference.sha256 === '830b474917b08779353ab34aea2035c1d49718c85507b9a98da129ac21bdc62a', 'Unexpected native plan revision');
    const targetRaw = sha(fs.readFileSync(path.join(root, 'archive/exams', targetSource)));
    need(targetRaw === '165bed044a8d530ce79a03ceee5b29d8ea21e068295ae1fd75419a5ae2fbef37', 'Wangun source already changed before baseline');
    targets = [];
    scope = [];
    for (const p of packs) {
      const dependency = plan.dependencies.find(d => d.ownerPack === p.owner && d.currentImpact);
      need(dependency, 'Missing alias dependency: ' + p.owner);
      const planned = dependency.currentImpact.runtimeRows.filter(r =>
        r.scopeAppendAssessment?.classification === 'NEW_SCOPE_ELIGIBLE_WITH_ACTIVE_EXACT_BINDING');
      const plannedUids = new Set(planned.map(r => r.questionUid));
      const courses = new Set(p.pack.standardCourses), appended = new Set([...courses, 'M1-1']);
      const current = p.runtime.records.filter(r => {
        const curriculum = r.curriculum || r.curriculumKey;
        const course = r.standardCourse || r.courseKey, courseKey = r.courseKey || r.standardCourse;
        const exact = p.bindings.filter(b => b.status === 'ACTIVE' && b.ownerPack === p.owner &&
          b.curriculum === curriculum && b.standardCourse === course && b.standardUnitKey === r.standardUnitKey &&
          (b.subUnitKey ?? null) === (r.subUnitKey ?? null) && b.problemTypeKey === r.problemTypeKey);
        need(exact.length <= 1, 'Ambiguous exact binding: ' + r.questionUid);
        return exact.length === 1 && p.pack.curricula.includes(curriculum) &&
          !(courses.has(course) && courses.has(courseKey)) && appended.has(course) && appended.has(courseKey);
      });
      const currentUids = new Set(current.map(r => r.questionUid));
      need([...plannedUids].every(uid => currentUids.has(uid)), 'A planned scoped UID no longer matches the actual baseline');
      const extra = current.filter(r => !plannedUids.has(r.questionUid));
      if (p.owner === 'MIDDLE1') need(current.length === 14 && extra.length === 1 &&
        extra[0].questionUid === 'qid_v1_9a70f8dfb14b04696845323d046dedded271684fd020f1c73fd3d7f3a800dffc', 'Unexpected direct-impact expansion');
      else need(current.length === 3 && extra.length === 0, 'Unexpected FUNCTIONS_GRAPHS impact set');
      scope.push({ ownerPack: p.owner, planEligibleCount: planned.length, isolatedEligibleCount: current.length,
        dependencyInducedAdditionalUids: extra.map(r => r.questionUid),
        planRuntimeCandidateCount: dependency.currentImpact.runtimeRows.length });
      for (const r of current) targets.push({ ownerPack: p.owner, questionUid: r.questionUid,
        sourceArchiveFile: r.sourceArchiveFile, sourceOrdinal: Number(r.sourceOrdinal),
        plannedEligible: plannedUids.has(r.questionUid),
        dependencyInducedAdditional: !plannedUids.has(r.questionUid),
        excludedCurrentWangun: targetUids.has(r.questionUid) || r.sourceArchiveFile === targetSource });
    }
    targets.sort((a, b) => a.questionUid.localeCompare(b.questionUid, 'en'));
  }
  need(new Set(targets.map(r => r.questionUid)).size === targets.length, 'Duplicate captured target');
  const selected = targets.map(t => {
    const r = allRuntime.get(t.questionUid);
    need(r && r.sourceArchiveFile === t.sourceArchiveFile && Number(r.sourceOrdinal) === t.sourceOrdinal,
      'Frozen UID/source identity missing or changed: ' + t.questionUid);
    return r;
  });
  const inputFiles = [...new Set(['archive/data/archive2-canonical-input-manifest.json', 'archive/data/archive2-catalog.json',
    ...packs.flatMap(p => Object.values(p.files)),
    'archive/tools/meta-foundation/register-binding-course-correction.mjs',
    'archive/tools/meta-foundation/verify-changed-uid-consumer-approval.mjs',
    'archive/tools/meta-foundation/reviewed-exam-registration-v2.mjs',
    'archive/archive2-canonical.js', 'archive/problem-bank-meta.js'])];
  const inputsBefore = inputFiles.map(repoRef);
  const helperPath = path.join(root, 'archive/tools/meta-foundation/register-binding-course-correction.mjs');
  const loaderPath = path.join(root, 'archive/tools/meta-foundation/verify-changed-uid-consumer-approval.mjs');
  const { captureBindingCourseConsumers } = await import(pathToFileURL(helperPath).href);
  const { loadConsumer } = await import(pathToFileURL(loaderPath).href);
  const consumer = await loadConsumer(root);
  const official = captureBindingCourseConsumers(consumer, selected);
  const hashes = byUid(official);
  const snapshots = targets.map(t => {
    const runtime = allRuntime.get(t.questionUid);
    const resolved = consumer.resolvedBySource.get(`${t.sourceArchiveFile}#${t.sourceOrdinal}`);
    const page = consumer.pageByUid.get(t.questionUid);
    return { ...t, officialSemanticHash: hashes.get(t.questionUid), runtimeRowSha256: hashObject(runtime),
      resolved: safeConsumerView(resolved), page: safeConsumerView(page) };
  });
  const inputsAfter = inputFiles.map(repoRef);
  need(isDeepStrictEqual(inputsBefore, inputsAfter), 'Consumer inputs changed during read-only capture');
  const outOfScope = snapshots.filter(r => !r.excludedCurrentWangun);
  const changes = [];
  if (baseline) {
    const previous = byUid(baseline.snapshots);
    for (const row of outOfScope) {
      const before = previous.get(row.questionUid);
      need(before && !before.excludedCurrentWangun, 'Frozen comparison denominator mismatch');
      const changed = [];
      for (const field of ['officialSemanticHash', 'runtimeRowSha256', 'resolved', 'page'])
        if (!isDeepStrictEqual(before[field], row[field])) changed.push(field);
      if (changed.length) changes.push({ questionUid: row.questionUid, sourceArchiveFile: row.sourceArchiveFile,
        sourceOrdinal: row.sourceOrdinal, changedComponents: changed,
        beforeOfficialSemanticHash: before.officialSemanticHash, afterOfficialSemanticHash: row.officialSemanticHash,
        changedResolvedFields: Object.keys(row.resolved || {}).filter(k => !isDeepStrictEqual(before.resolved?.[k], row.resolved?.[k])),
        changedPageFields: Object.keys(row.page || {}).filter(k => !isDeepStrictEqual(before.page?.[k], row.page?.[k])) });
    }
  }
  const report = { schemaVersion: 'wangun-direct-pack-scope-consumer-snapshot-v1',
    status: baseline ? (changes.length ? 'FAIL_EXISTING_OUT_OF_SCOPE_CONSUMER_CHANGED' : 'PASS_EXISTING_OUT_OF_SCOPE_CONSUMERS_PRESERVED') : 'BASELINE_CAPTURED_REAL_CONSUMER',
    capturedAt: new Date().toISOString(), isolatedRoot: root, script: fileRef(scriptPath), planReference,
    baselineReference: baseline ? fileRef(args['--baseline']) : null,
    targetExam: { sourceArchiveFile: targetSource, questionCount: 23, questionUids: [...targetUids].sort() },
    scope, targets, snapshots,
    denominators: { planEligibleRuntimeUids: scope.reduce((n, r) => n + r.planEligibleCount, 0),
      isolatedPostCorrectionEligibleRuntimeUids: targets.length, currentWangunExamQuestions: 23,
      currentWangunUidsAmongCaptured: targets.filter(r => r.excludedCurrentWangun).length,
      existingOutOfScopeUidsCaptured: outOfScope.length,
      existingOutOfScopeUidsCompared: baseline ? outOfScope.length : 0 },
    semanticHashes: { allCaptured: hashObject(official),
      existingOutOfScope: hashObject(outOfScope.map(r => r.officialSemanticHash)) },
    observations: ['The extra Dongsan Q21 UID is a direct result of the isolated course-spelling correction; plan16 becomes current17.',
      'Capture hashes come from the official helper and cover classification, approval, source integrity, pending reasons and selection semantics. Human-readable views are metadata whitelists.',
      'No current Wangun question is treated as an out-of-scope preservation subject. This snapshot does not certify target-exam registration or approval.'],
    changes, inputFiles: inputsBefore, inputFilesUnchangedDuringCapture: true,
    packEnvelopes: packs.map(p => ({ ownerPack: p.owner, packVersion: p.pack.packVersion,
      runtimePackVersion: p.runtime.packVersion, runtimeVersion: p.runtime.runtimeVersion,
      standardCourses: p.pack.standardCourses })),
    boundary: { realOfficialConsumerLoaded: true, captureHelper: 'captureBindingCourseConsumers',
      consumerLoader: 'loadConsumer', rawQuestionOrSolutionDataStored: false, productionWrites: false,
      gitOrApiOperations: false, broadTestsRun: false, mathQaPerformed: false, newApprovalCreated: false,
      mainApplicationInferred: false, targetExamPostRegistrationCheckIncluded: false } };
  fs.writeFileSync(output, JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ path: output, sha256: sha(fs.readFileSync(output)), status: report.status,
    denominators: report.denominators, semanticHashes: report.semanticHashes, changedOutOfScopeCount: changes.length }));
  if (changes.length) process.exitCode = 1;
}

try { await main(); }
catch (error) {
  const report = { schemaVersion: 'wangun-direct-pack-scope-consumer-snapshot-v1', status: 'FAILED_CAPTURE',
    capturedAt: new Date().toISOString(), isolatedRoot: root, error: String(error.message || error),
    boundary: { productionWrites: false, rawQuestionOrSolutionDataStored: false, gitOrApiOperations: false } };
  if (!fs.existsSync(output)) fs.writeFileSync(output, JSON.stringify(report, null, 2) + '\n');
  console.error(JSON.stringify({ path: output, sha256: sha(fs.readFileSync(output)), ...report }));
  process.exitCode = 1;
}
