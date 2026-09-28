import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const { runInputSha } = await import(pathToFileURL(path.join(root, 'archive/tools/pipeline-core/closure.mjs')));
const { readBoundFile, fileRef } = await import(pathToFileURL(path.join(root, 'archive/tools/pipeline-core/canonical.mjs')));
const { computeV2AxisInputShas } = await import(pathToFileURL(path.join(root, 'archive/tools/pipeline-core/v2-audit.mjs')));
const { validateMachineEvidence, validateTypedEvidence } = await import(pathToFileURL(path.join(root, 'archive/tools/pipeline-core/review-evidence-v2.mjs')));
const setKey = '비상_공통수학2_도형의방정식_익힘책_고1';
const base = `archive-work/textbooks/visang-common2/workbook/geometry/evidence/${setKey}`;
const runPath = `${base}/pipeline-core/run-q01repair-core4/run.machine-r1.json`;
const run = JSON.parse(fs.readFileSync(runPath, 'utf8'));
const errors = [];

if (run.inputSha !== runInputSha(run)) errors.push('RUN_INPUT_SHA_STALE');
for (const ref of run.inputs) try { readBoundFile(root, ref); } catch (error) { errors.push(`STALE_INPUT:${ref.path}:${error.message}`); }

const axes = computeV2AxisInputShas(root, run);
const machineRefs = run.evidence.filter(ref => ref.path.includes('/machine-evidence/'));
if (machineRefs.length !== 28) errors.push(`MACHINE_EVIDENCE_COUNT:${machineRefs.length}`);
for (const ref of machineRefs) {
  const evidence = JSON.parse(readBoundFile(root, ref));
  if (evidence.status !== 'PASS') errors.push(`MACHINE_NOT_PASS:${evidence.questionUid}:${evidence.axis}`);
  if (evidence.axisInputSha !== axes[evidence.questionUid]?.[evidence.axis]) errors.push(`MACHINE_AXIS_SHA:${evidence.questionUid}:${evidence.axis}`);
  const machineErrors = validateMachineEvidence(evidence, run, { diagnostic: true });
  const typedErrors = validateTypedEvidence(evidence, { diagnostic: true });
  if (machineErrors.length || typedErrors.length) errors.push(`MACHINE_VALIDATION:${evidence.questionUid}:${evidence.axis}:${[...machineErrors, ...typedErrors].join(',')}`);
}

const captures = run.evidence.map(ref => ({ ref, value: JSON.parse(readBoundFile(root, ref)) })).filter(row => row.value.axis === 'RENDER_CAPTURE');
const witnesses = captures.flatMap(row => row.value.payload.itemWitnesses || []);
if (captures.length !== 6) errors.push(`CAPTURE_REPORT_COUNT:${captures.length}`);
for (const { ref, value } of captures) {
  if (value.status !== 'PASS') errors.push(`CAPTURE_STATUS:${ref.path}`);
  if (value.payload?.observedQuestionCount !== 14 || value.payload?.lastQuestionId !== 14) errors.push(`CAPTURE_COUNT:${ref.path}`);
  if (value.payload?.metrics?.mathErrors !== 0 || value.payload?.metrics?.badImages !== 0 || value.payload?.metrics?.renderError !== null) errors.push(`CAPTURE_METRICS:${ref.path}`);
}
const missing = [];
for (const question of run.questions) for (const mode of ['exam', 'solution', 'answer']) for (const viewport of ['desktop', 'mobile']) {
  if (!witnesses.some(row => row.questionUid === question.questionUid && row.mode === mode && row.viewportProfile === viewport)) missing.push(`${question.questionUid}:${mode}:${viewport}`);
}
if (missing.length) errors.push(`RENDER_WITNESS_MISSING:${missing.join(',')}`);

const q1 = run.questions.find(question => question.sourceQuestionOrdinal === 1);
const q1V2 = JSON.parse(fs.readFileSync(path.join(root, `${base}/pipeline-core/v2_exact_geometry_parity_report.json`), 'utf8')).rows.find(row => row.displayNo === '01');
if (!q1.solutionAssetPaths?.[0]?.endsWith('/q01_coordinate_plane_final.svg')) errors.push('Q01_ASSET_REF_MISMATCH');
if (q1V2?.geometryVerification !== 'PASS' || q1V2.finalArtifactSha !== fileRef(root, q1.solutionAssetPaths[0]).sha256) errors.push('Q01_V2_ASSET_BINDING');
for (const refSuffix of ['golden_sample_calibration_refs.json', 'q01_source_visual_expectation_repair.json', 'q01_coordinate_context_repair.json', 'provider-review-main/prior-partial/u2-response.json']) {
  if (!run.inputs.some(ref => ref.path.endsWith(refSuffix))) errors.push(`REQUIRED_EVIDENCE_INPUT_MISSING:${refSuffix}`);
}

const report = {
  status: errors.length ? 'FAIL' : 'PASS',
  runId: run.runId,
  workBatchId: run.workBatchId,
  inputSha: run.inputSha,
  questionCount: run.questions.length,
  machineEvidenceCount: machineRefs.length,
  captureReportCount: captures.length,
  renderWitnessCount: witnesses.length,
  q01ArtifactSha: q1V2?.finalArtifactSha || null,
  calibrationEvidence: run.inputs.filter(ref => ref.path.includes('golden_sample') || ref.path.includes('q01_source_visual') || ref.path.includes('q01_coordinate_context') || ref.path.includes('prior-partial/u2-response')).map(ref => ref.path),
  errors,
};
console.log(JSON.stringify(report, null, 2));
if (errors.length) process.exitCode = 1;
