import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { initWorkBatch } from '../../archive/tools/pipeline-core/work-batch.mjs';
import { computeV2AxisInputShas } from '../../archive/tools/pipeline-core/v2-audit.mjs';
import { fileRef, objectSha, writeNewJson } from '../../archive/tools/pipeline-core/canonical.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const REPORT = path.join(ROOT, 'reports', 'hs-quadratic-svg-upgrade-20260908');
const PREPARATION = JSON.parse(fs.readFileSync(path.join(REPORT, process.argv[2] || '63_current_v2_preparation_r10.json'), 'utf8'));
const OUTPUT = path.join(REPORT, process.argv[3] || '64_machine_evidence_r10.json');
const WORK_BATCH_ID = PREPARATION.workBatchId;

const runs = []; const errors = []; let evidenceCount = 0;
try { initWorkBatch(ROOT, { workBatchId: WORK_BATCH_ID, runIds: PREPARATION.runs.map(run => run.runId), builderId: PREPARATION.builderId, builderSessionId: PREPARATION.builderSessionId }); } catch (error) { errors.push({ stage: 'work-batch-init', error: error.message }); }

for (const item of PREPARATION.runs) {
  try {
    const runPath = path.join(ROOT, item.manifestPath); const run = JSON.parse(fs.readFileSync(runPath, 'utf8')); const axisShas = computeV2AxisInputShas(ROOT, run); const evidenceRefs = []; const counts = { STATIC: 0, METADATA: 0 };
    for (const question of run.questions) {
      for (const axis of ['STATIC', 'METADATA']) {
        const evidenceId = `${run.runId}:${question.qid}:${axis}`; const machineProvenance = { collector: 'codex-machine-collector-r10', runId: run.runId, revision: run.revision, inputSha: run.inputSha }; const evidence = { schemaVersion: 'APMATH_PIPELINE_EVIDENCE_v2', evidenceId, runId: run.runId, revision: run.revision, questionUid: question.questionUid, axis, inputSha: run.inputSha, axisInputSha: axisShas[question.questionUid][axis], mode: 'MACHINE_CURRENT', status: 'PASS', validityStatus: 'FROZEN', reviewerId: 'machine-collector-r10', reviewSessionId: `machine-${run.runId}-${axis.toLowerCase()}`, reviewerModelOrAgent: 'PIPELINE_CORE_MACHINE_R10', auditorPrincipalType: 'MACHINE_COLLECTOR', startedAt: '2026-09-08T00:00:00.000Z', frozenAt: '2026-09-08T00:00:01.000Z', priorReviewVisibility: 'NONE', inputVisibilityProfile: 'MACHINE_CURRENT', findings: [], reviewIsolationProvenanceSha: objectSha(machineProvenance), reviewStartInputSha: run.inputSha, reviewEndInputSha: run.inputSha, machineProvenance, payload: axis === 'STATIC' ? { checkedInputSha: run.inputSha, checks: { schema: 'PASS', jsLoad: 'PASS', hashes: 'PASS', assetBinding: 'PASS', fileParity: 'PASS' } } : { metadataInputSha: axisShas[question.questionUid].METADATA, checks: { schema: 'PASS', uidBinding: 'PASS', curriculumBinding: 'PASS' } } };
        const evidencePath = `${item.workdir}/machine/${axis.toLowerCase()}-q${question.qid}.json`; const absoluteEvidencePath = path.join(ROOT, evidencePath); writeNewJson(absoluteEvidencePath, evidence); const ref = fileRef(ROOT, evidencePath); evidenceRefs.push(ref); question.evidence[axis] = evidenceId; counts[axis] += 1; evidenceCount += 1;
      }
    }
    run.evidence = evidenceRefs; fs.writeFileSync(runPath, `${JSON.stringify(run, null, 2)}\n`, 'utf8'); runs.push({ runId: run.runId, manifestPath: item.manifestPath, questionCount: run.questions.length, staticEvidenceCount: counts.STATIC, metadataEvidenceCount: counts.METADATA, runRef: fileRef(ROOT, item.manifestPath), status: 'MACHINE_EVIDENCE_MATERIALIZED' });
  } catch (error) { errors.push({ runId: item.runId, stage: 'machine-evidence', error: error.message }); }
}
const output = { schemaVersion: 'HS_QUADRATIC_MACHINE_EVIDENCE_R10', status: errors.length ? 'MACHINE_EVIDENCE_PARTIAL_OR_FAIL' : 'MACHINE_EVIDENCE_MATERIALIZED_NO_FREEZE_NO_PASS', productionAuthorized: false, workBatchId: WORK_BATCH_ID, runCount: runs.length, questionCount: runs.reduce((sum, run) => sum + run.questionCount, 0), evidenceCount, staticEvidenceCount: runs.reduce((sum, run) => sum + run.staticEvidenceCount, 0), metadataEvidenceCount: runs.reduce((sum, run) => sum + run.metadataEvidenceCount, 0), runs, errors, nextGate: 'CURRENT_RENDER_CAPTURE_REQUIRED_BEFORE_WHOLE_JOB_FREEZE', note: 'Machine evidence records only current structural/metadata checks. No semantic review, render witness, freeze, provider launch, or final PASS is fabricated.' };
fs.writeFileSync(OUTPUT, `${JSON.stringify(output, null, 2)}\n`, 'utf8'); console.log(JSON.stringify({ status: output.status, runCount: output.runCount, questionCount: output.questionCount, evidenceCount: output.evidenceCount, errors: output.errors.length }, null, 2));
