import fs from 'node:fs';
import path from 'node:path';
import { prepareDraft } from '../../archive/tools/pipeline-core/prepare.mjs';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const REPORT = path.join(ROOT, 'reports', 'hs-quadratic-svg-upgrade-20260908');
const SCOPED = JSON.parse(fs.readFileSync(path.join(REPORT, '243_scoped_candidate_bank_manifest_r21.json'), 'utf8'));
const REGISTRY_REF = JSON.parse(fs.readFileSync(path.join(REPORT, '61_source_exam_id_registry_ref_r10.json'), 'utf8'));
const OUTPUT = path.join(REPORT, '250_current_v2_preparation_r21c.json');
const WORK_BATCH_ID = 'hs-quadratic-r21c';
const BUILDER_ID = 'codex-builder-r21c';
const BUILDER_SESSION_ID = 'codex-session-r21c';
const RUN_ROOT = 'archive/_generated/hs-quadratic-svg-upgrade-20260908/pipeline-r21c/runs';
const runs = [];
const errors = [];

for (let index = 0; index < SCOPED.candidateFiles.length; index += 1) {
  const file = SCOPED.candidateFiles[index];
  const runId = `hsquadratic-r21c-${String(index + 1).padStart(3, '0')}`;
  const workdir = `${RUN_ROOT}/${runId}`;
  try {
    const result = prepareDraft(ROOT, { pipeline: 'high1-svg', runId, sourcePath: file.sourcePath, candidatePath: file.candidatePath, workdir, schemaVersion: 'APMATH_PIPELINE_RUN_v2', builderId: BUILDER_ID, builderSessionId: BUILDER_SESSION_ID, builderModelOrAgent: 'gpt-5.6-luna', workBatchId: WORK_BATCH_ID, sourceExamIdRegistryRef: REGISTRY_REF });
    runs.push({ runId, workdir, sourcePath: file.sourcePath, candidatePath: file.candidatePath, questionCount: result.questionCount, manifestPath: result.manifestPath, inputSha: result.inputSha, status: result.status });
  } catch (error) {
    errors.push({ runId, workdir, sourcePath: file.sourcePath, candidatePath: file.candidatePath, error: error.message });
  }
}
const output = { schemaVersion: 'HS_QUADRATIC_CURRENT_V2_PREPARATION_R21C', status: errors.length ? 'V2_PREPARATION_PARTIAL_OR_FAIL' : 'V2_PREPARATION_DRAFTS_READY_NO_PASS', productionAuthorized: false, workBatchId: WORK_BATCH_ID, builderId: BUILDER_ID, builderSessionId: BUILDER_SESSION_ID, sourceRegistryRef: 'reports/hs-quadratic-svg-upgrade-20260908/61_source_exam_id_registry_ref_r10.json', sourceRegistryAuthority: 'PENDING', scopedCandidateManifest: 'reports/hs-quadratic-svg-upgrade-20260908/243_scoped_candidate_bank_manifest_r21.json', targetQuestionCount: 430, runCount: runs.length, preparedQuestionCount: runs.reduce((sum, run) => sum + run.questionCount, 0), errors, runs, note: 'Fresh retry of r21 current v2 drafts with a new work batch and run root; no semantic review, render capture, whole-job freeze, provider launch, or final PASS is fabricated.' };
fs.writeFileSync(OUTPUT, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ status: output.status, targetQuestionCount: output.targetQuestionCount, runCount: output.runCount, preparedQuestionCount: output.preparedQuestionCount, errors: output.errors.length }, null, 2));
