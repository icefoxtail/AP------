import fs from 'node:fs';
import vm from 'node:vm';
import crypto from 'node:crypto';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { isDeepStrictEqual } from 'node:util';
import { gitBlobSha } from '../../../tools/archive-stage-validator.mjs';
const root = process.cwd();
const examRel = 'archive/exams/original/high/h2/1mid/24_매산여고_1학기_중간_고2_수학I.js';
const analysis = 'archive/analysis/24_매산여고_1학기_중간_고2_수학I/ITEM_RECOVERY_20261011_CODEX_CLEAN';
const before = JSON.parse(fs.readFileSync(`${analysis}/q21-before-snapshot.json`, 'utf8'));
const freezePath = `${analysis}/q21-replacement-freeze.json`;
const freezeBytes = fs.readFileSync(freezePath);
const freeze = JSON.parse(freezeBytes.toString('utf8'));
const finalBytes = fs.readFileSync(examRel);
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const load = (bytes, filename) => { const ctx = { window: {} }; vm.createContext(ctx); vm.runInContext(bytes.toString('utf8'), ctx, { filename }); return ctx.window.questionBank || ctx.window.questions; };
const finalQuestions = load(finalBytes, examRel);
const finalQ = finalQuestions.find(q => Number(q.id) === 21);
const oldBytes = execFileSync('git', ['show', `HEAD:${examRel}`], { cwd: root, maxBuffer: 50 * 1024 * 1024 });
if (sha(oldBytes) !== before.artifactRawSha256) throw new Error('ASSIGNED_BLOB_IS_NOT_BASELINE');
const oldQuestions = load(oldBytes, examRel);
const oldQ = oldQuestions.find(q => Number(q.id) === 21);
const changedFields = [...new Set([...Object.keys(oldQ), ...Object.keys(finalQ)])]
  .filter(key => !isDeepStrictEqual(oldQ[key], finalQ[key]));
const oldAssetRel = 'archive/assets/images/24_매산여고_1학기_중간_고2_수학I/q21-solution.svg';
const newAssetRel = 'archive/assets/images/24_매산여고_1학기_중간_고2_수학I/q21-solution-recovery.svg';
const oldAsset = fs.readFileSync(oldAssetRel);
const newAsset = fs.readFileSync(newAssetRel);
const sourceDecisionPath = `${analysis}/q21-independent-source-decision.json`;
const sourceDecisionBytes = fs.readFileSync(sourceDecisionPath);
const preflightEvidencePath = `${analysis}/q21-calibration-preflight.json`;
const preflightEvidenceBytes = fs.readFileSync(preflightEvidencePath);
const preflightReportPath = `${analysis}/q21-calibration-preflight.report.json`;
const preflightReportBytes = fs.readFileSync(preflightReportPath);
const preflightReport = JSON.parse(preflightReportBytes.toString('utf8'));
const visualEvidencePath = `${analysis}/q21-visual-geometry-evidence.json`;
const visualEvidenceBytes = fs.readFileSync(visualEvidencePath);
const visualEvidence = JSON.parse(visualEvidenceBytes.toString('utf8'));
const v2Path = `${analysis}/q21-v2-artifact-contract.report.json`;
const v2Bytes = fs.readFileSync(v2Path);
const v2 = JSON.parse(v2Bytes.toString('utf8'));
const nonTargetHashesNow = Object.fromEntries(finalQuestions.filter(q => Number(q.id) !== 21).map(q => [String(q.id), sha(JSON.stringify(q))]));
const nonTargetExact = Object.keys(before.nonTargetParsedObjectSha256).length === 23
  && Object.entries(before.nonTargetParsedObjectSha256).every(([id, hash]) => nonTargetHashesNow[id] === hash)
  && finalQuestions.length === 24;
if (!nonTargetExact) throw new Error('NON_TARGET_DEEP_EQUALITY_FAILED');
if (sha(oldAsset) !== before.oldSolutionAssetRawSha256) throw new Error('RESTORED_ORIGINAL_SVG_CHANGED');
if (sha(newAsset) !== freeze.solutionVisual.svgSha256) throw new Error('NEW_SVG_FREEZE_BINDING_MISMATCH');
if (sha(Buffer.from(finalQ.solution, 'utf8')) !== v2.solutionSha256) throw new Error('FINAL_SOLUTION_SHA_MISMATCH');
if (v2.result?.disposition !== 'PASS' || v2.result?.issues?.length) throw new Error('V2_ARTIFACT_CONTRACT_NOT_PASS');
if (preflightReport?.ok !== true || preflightReport?.stage !== 'ITEM_RECOVERY' || preflightReport?.issues?.length) throw new Error('CALIBRATION_PREFLIGHT_REPORT_INVALID');
const closure = {
  schemaVersion: 'ITEM_RECOVERY_Q21_CLOSURE_PACKET_V1',
  qualityContractVersion: 'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',
  executionLine: 'CODEX',
  examUid: '24_매산여고_1학기_중간_고2_수학I',
  qid: 21,
  stage: 'ITEM_RECOVERY',
  result: 'QUESTION_REPLACEMENT_AUTHORED_V2_ARTIFACT_PASS',
  replacementType: 'QUESTION_REPLACEMENT',
  method: 'CODEX_DIRECT_AUTHORING',
  replacementScope: 'QUESTION_ONLY',
  reason: 'ORIGINAL_ITEM_UNRECOVERABLE_AFTER_REVIEW2',
  sourceTruthDecision: {
    path: sourceDecisionPath,
    sha256: sha(sourceDecisionBytes),
    sufficient: false,
    sourceRegionPath: 'archive/analysis/24_매산여고_1학기_중간_고2_수학I/ITEM_RECOVERY_20261011_CODEX/source-page06-q21.png',
    confirmedFacts: ['scan wording matches student packet', 'no uniqueness qualifier', 'no graph/table condition is present'],
  },
  calibrationPreflight: {
    command: 'node archive/tools/solution-calibration-gate.mjs --exam <absolute-current-js> --evidence <absolute-q21-calibration-preflight.json> --stage ITEM_RECOVERY --preflight --json',
    evidencePath: preflightEvidencePath,
    evidenceSha256: sha(preflightEvidenceBytes),
    reportPath: preflightReportPath,
    reportSha256: sha(preflightReportBytes),
    report: preflightReport,
  },
  before: {
    artifactRawSha256: sha(oldBytes),
    artifactGitBlobSha1: gitBlobSha(oldBytes),
    originalSolutionAssetPath: oldAssetRel.replace('archive/', ''),
    originalSolutionAssetRawSha256: sha(oldAsset),
    originalSolutionAssetGitBlobSha1: gitBlobSha(oldAsset),
    studentPacketSha256: before.studentPacketSha256,
    sourceRawSha256: 'fd53c2297a0984ca7d0a1c72cfbc27b207e77c0ee9f63418ef71f2103c862b04',
    sourceRawBlobSha1: 'ff175c0ca217b873c194b75d0744d6b21c6502ec',
  },
  after: {
    artifactPath: examRel,
    artifactRawSha256: sha(finalBytes),
    artifactGitBlobSha1: gitBlobSha(finalBytes),
    questionCount: finalQuestions.length,
    solutionSha256: v2.solutionSha256,
    answer: finalQ.answer,
    choices: finalQ.choices,
    solutionAssetPath: newAssetRel.replace('archive/', ''),
    solutionAssetRawSha256: sha(newAsset),
    solutionAssetGitBlobSha1: gitBlobSha(newAsset),
    originalSolutionAssetRawSha256After: sha(oldAsset),
    originalSolutionAssetGitBlobSha1After: gitBlobSha(oldAsset),
  },
  exactChanges: {
    changedQids: [21],
    changedTargetFields: changedFields,
    nonTargetQidCount: 23,
    nonTargetDeepEquality: { status: 'PASS', compared: 23, changed: 0 },
    sourceIdentityPreserved: finalQ.questionUid === oldQ.questionUid && finalQ.sourceQid === oldQ.sourceQid && finalQ.sourceArchiveFile === oldQ.sourceArchiveFile,
    staleOldSolutionImageReferenceRemoved: !String(finalQ.solutionImage).endsWith('/q21-solution.svg'),
    newRecoverySolutionImageReferenceBound: finalQ.solutionImage === freeze.solutionVisual.path,
    itemHoldReasonRemoved: !Object.hasOwn(finalQ, 'itemHoldReason'),
    itemStatusRemoved: !Object.hasOwn(finalQ, 'itemStatus'),
    reviewStatusRemoved: !Object.hasOwn(finalQ, 'reviewStatus'),
    solutionUsesRealRuntimeNewlines: finalQ.solution.includes('\n') && !finalQ.solution.includes('\\n'),
  },
  meta: {
    standardCourse: finalQ.standardCourse,
    standardUnitKey: finalQ.standardUnitKey,
    standardUnit: finalQ.standardUnit,
    subUnitKey: finalQ.subUnitKey,
    subUnit: finalQ.subUnit,
    rpmCrosswalk: freeze.curriculumAndFidelity.rpmPrimary,
    problemTypeKey: finalQ.problemTypeKey,
    templateKey: finalQ.templateKey,
    exactCurriculumBindingDebt: freeze.curriculumAndFidelity.activeCurriculumBindingDebt,
    difficulty: { level: finalQ.level, difficultyBucket: finalQ.difficultyBucket, confidence: finalQ.difficultyConfidence, boundaryFlag: finalQ.difficultyBoundaryFlag, legacyCompatibility: finalQ.legacyLevelCompatibility },
    conditionKeys: finalQ.conditionKeys,
    crossConceptKeys: finalQ.crossConceptKeys,
    integrationPattern: finalQ.integrationPattern,
    authority: freeze.metaAuthority,
  },
  visual: {
    problem: freeze.problemVisual,
    solutionDisposition: freeze.solutionVisual.disposition,
    solutionGeometryEvidencePath: visualEvidencePath,
    solutionGeometryEvidenceSha256: sha(visualEvidenceBytes),
    solutionGeometryEvidence: visualEvidence,
    actualRender: 'NOT_RUN_ITEM_RECOVERY; R3 must inspect actual student-engine output',
  },
  v2ArtifactContract: {
    reportPath: v2Path,
    reportSha256: sha(v2Bytes),
    disposition: v2.result.disposition,
    issues: v2.result.issues,
    artifactSha: v2.artifactSha,
    artifactRawSha256: v2.finalArtifactRawSha256,
  },
  nextRequiredAction: 'ROOT_ROUTE_FRESH_Q21_ONLY_R1_R2_R3_CLOSURES',
  r1R2R3Status: 'NOT_RUN_BY_ITEM_RECOVERY_WORKER',
};
const out = `${analysis}/q21-recovery-closure.json`;
fs.writeFileSync(out, JSON.stringify(closure, null, 2) + '\n');
console.log(JSON.stringify({ out, sha256: sha(fs.readFileSync(out)), finalArtifactRawSha256: sha(finalBytes), finalArtifactGitBlobSha1: gitBlobSha(finalBytes), changedTargetFields: changedFields, nonTargetExact, v2Disposition: v2.result.disposition }, null, 2));

