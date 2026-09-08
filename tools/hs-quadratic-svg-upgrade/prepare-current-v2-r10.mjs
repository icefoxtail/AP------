import fs from 'node:fs';
import path from 'node:path';
import { prepareDraft } from '../../archive/tools/pipeline-core/prepare.mjs';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const REPORT = path.join(ROOT, 'reports', 'hs-quadratic-svg-upgrade-20260908');
const SCOPED = JSON.parse(fs.readFileSync(path.join(REPORT, '62_scoped_candidate_bank_manifest_r10.json'), 'utf8'));
const REGISTRY_REF = JSON.parse(fs.readFileSync(path.join(REPORT, '61_source_exam_id_registry_ref_r10.json'), 'utf8'));
const OUTPUT = path.join(REPORT, '63_current_v2_preparation_r10.json');
const WORK_BATCH_ID = 'hs-quadratic-r10';
const BUILDER_ID = 'codex-builder-r10';
const BUILDER_SESSION_ID = 'codex-session-r10';
const RUN_ROOT = 'archive/_generated/hs-quadratic-svg-upgrade-20260908/pipeline-r10/runs';

const runs = []; const errors = [];
for (let index = 0; index < SCOPED.candidateFiles.length; index += 1) {
  const file = SCOPED.candidateFiles[index]; const runId = `hsquadratic-r10-${String(index + 1).padStart(3, '0')}`; const workdir = `${RUN_ROOT}/${runId}`;
  try {
    const result = prepareDraft(ROOT, { pipeline: 'high1-svg', runId, sourcePath: file.sourcePath, candidatePath: file.candidatePath, workdir, schemaVersion: 'APMATH_PIPELINE_RUN_v2', builderId: BUILDER_ID, builderSessionId: BUILDER_SESSION_ID, builderModelOrAgent: 'gpt-5.6-luna', workBatchId: WORK_BATCH_ID, sourceExamIdRegistryRef: REGISTRY_REF });
    runs.push({ runId, workdir, sourcePath: file.sourcePath, candidatePath: file.candidatePath, questionCount: result.questionCount, manifestPath: result.manifestPath, inputSha: result.inputSha, status: result.status });
  } catch (error) { errors.push({ runId, workdir, sourcePath: file.sourcePath, candidatePath: file.candidatePath, error: error.message }); }
}
const output = { schemaVersion: 'HS_QUADRATIC_CURRENT_V2_PREPARATION_R10', status: errors.length ? 'V2_PREPARATION_PARTIAL_OR_FAIL' : 'V2_PREPARATION_DRAFTS_READY_NO_PASS', productionAuthorized: false, workBatchId: WORK_BATCH_ID, builderId: BUILDER_ID, builderSessionId: BUILDER_SESSION_ID, sourceRegistryRef: 'reports/hs-quadratic-svg-upgrade-20260908/61_source_exam_id_registry_ref_r10.json', sourceRegistryAuthority: 'PENDING', scopedCandidateManifest: 'reports/hs-quadratic-svg-upgrade-20260908/62_scoped_candidate_bank_manifest_r10.json', targetQuestionCount: SCOPED.targetQuestionCount, runCount: runs.length, preparedQuestionCount: runs.reduce((sum, run) => sum + run.questionCount, 0), runs, errors, note: 'All successful runs are draft-only v2 preparations. No whole-job freeze, machine evidence, provider review, semantic V1/V2/V3 evidence, render capture, or final audit is fabricated.' };
fs.writeFileSync(OUTPUT, `${JSON.stringify(output, null, 2)}\n`, 'utf8'); console.log(JSON.stringify({ status: output.status, targetQuestionCount: output.targetQuestionCount, runCount: output.runCount, preparedQuestionCount: output.preparedQuestionCount, errors: output.errors.length }, null, 2));
