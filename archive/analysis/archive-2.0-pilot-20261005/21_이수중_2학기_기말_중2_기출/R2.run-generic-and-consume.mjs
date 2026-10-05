import fs from 'node:fs';
import path from 'node:path';
import { validateStageEvidence } from '../../../tools/archive-stage-validator.mjs';
import { buildStageState, consumeValidationPass } from '../../../tools/archive-stage-runtime-v2.mjs';

const examPath = path.resolve('archive/_generated/source-only/m2-20261004/21_이수중_2학기_기말_중2_기출.js');
const evidencePath = path.resolve('archive/analysis/archive-2.0-pilot-20261005/21_이수중_2학기_기말_중2_기출/R2.evidence.json');
const reportPath = path.resolve('archive/analysis/archive-2.0-pilot-20261005/21_이수중_2학기_기말_중2_기출/R2.validation.json');
const closurePath = path.resolve('archive/analysis/archive-2.0-pilot-20261005/21_이수중_2학기_기말_중2_기출/R2.closure.json');

if (fs.existsSync(reportPath) || fs.existsSync(closurePath)) throw new Error('R2_VALIDATION_OR_CLOSURE_ALREADY_EXISTS');
const validationReport = validateStageEvidence({ examFile: examPath, evidenceFile: evidencePath, stage: 'R2' });
fs.writeFileSync(reportPath, `${JSON.stringify(validationReport, null, 2)}\n`, { flag: 'wx' });
if (validationReport.ok !== true || validationReport.disposition !== 'PASS' || validationReport.validatorMode !== 'R2_V2') {
  console.log(JSON.stringify({ validator: validationReport.disposition, issues: validationReport.issues || [] }, null, 2));
  process.exitCode = 1;
} else {
  const closure = consumeValidationPass({
    state: buildStageState({ stage: 'R2', workComplete: true }),
    validationReport,
  });
  const closureRecord = {
    schemaVersion: 'JS_ARCHIVE_STAGE_CLOSURE_v2',
    examUid: validationReport.examUid,
    completedStage: 'R2',
    inputArtifactSha: validationReport.artifactSha,
    finalArtifactSha: validationReport.artifactSha,
    evidenceRef: validationReport.evidenceRef,
    validationRef: 'archive/analysis/archive-2.0-pilot-20261005/21_이수중_2학기_기말_중2_기출/R2.validation.json',
    validationMode: validationReport.validatorMode,
    disposition: validationReport.disposition,
    state: closure.state,
    nextStageEligible: closure.nextStageEligible,
    receipt: closure.receipt,
  };
  fs.writeFileSync(closurePath, `${JSON.stringify(closureRecord, null, 2)}\n`, { flag: 'wx' });
  console.log(JSON.stringify({ validator: validationReport.disposition, artifactSha: validationReport.artifactSha, evidenceRef: validationReport.evidenceRef, closure: closure.receipt }, null, 2));
}
