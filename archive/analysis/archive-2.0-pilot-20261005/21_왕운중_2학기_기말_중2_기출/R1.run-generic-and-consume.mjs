import fs from 'node:fs';
import path from 'node:path';
import { validateStageEvidence } from '../../../tools/archive-stage-validator.mjs';
import { buildStageState, consumeValidationPass } from '../../../tools/archive-stage-runtime-v2.mjs';

const examPath = path.resolve('archive/_generated/source-only/m2-20261004/21_왕운중_2학기_기말_중2_기출.js');
const evidencePath = path.resolve('archive/analysis/archive-2.0-pilot-20261005/21_왕운중_2학기_기말_중2_기출/R1.evidence.json');
const reportPath = path.resolve('archive/analysis/archive-2.0-pilot-20261005/21_왕운중_2학기_기말_중2_기출/R1.validation.json');
const closurePath = path.resolve('archive/analysis/archive-2.0-pilot-20261005/21_왕운중_2학기_기말_중2_기출/R1.closure.json');

const validationReport = validateStageEvidence({ examFile: examPath, evidenceFile: evidencePath, stage: 'R1' });
fs.writeFileSync(reportPath, `${JSON.stringify(validationReport, null, 2)}\n`, 'utf8');
if (validationReport.ok !== true || validationReport.disposition !== 'PASS') {
  console.log(JSON.stringify({ validator: validationReport.disposition, issues: validationReport.issues || [] }, null, 2));
  process.exitCode = 1;
} else {
  const closure = consumeValidationPass({
    state: buildStageState({ stage: 'R1', workComplete: true }),
    validationReport,
  });
  const closureRecord = {
    schemaVersion: 'JS_ARCHIVE_STAGE_CLOSURE_v2',
    examUid: validationReport.examUid,
    completedStage: 'R1',
    nextStage: closure.state.stage,
    nextStageEligible: closure.nextStageEligible,
    receipt: closure.receipt,
    validationReportRef: 'archive/analysis/archive-2.0-pilot-20261005/21_왕운중_2학기_기말_중2_기출/R1.validation.json',
  };
  fs.writeFileSync(closurePath, `${JSON.stringify(closureRecord, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({
    validator: validationReport.disposition,
    artifactSha: validationReport.artifactSha,
    evidenceRef: validationReport.evidenceRef,
    closure: closure.receipt,
  }, null, 2));
}
