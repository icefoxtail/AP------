import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { gitBlobSha } from '../../../tools/archive-stage-validator.mjs';
import { validateArtifactContract, solutionSha256, QUALITY_CONTRACT_V2 } from '../../../tools/archive-stage-validator-artifact-v2.mjs';
const root = process.cwd();
const exam = 'archive/exams/original/high/h2/1mid/24_매산여고_1학기_중간_고2_수학I.js';
const source = fs.readFileSync(exam);
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(source.toString('utf8'), sandbox, { filename: exam });
const questions = sandbox.window.questionBank || sandbox.window.questions;
const q = questions.find(row => Number(row.id) === 21);
const artifactSha = gitBlobSha(source);
const metaDebtReason = 'Selected globally ACTIVE generic graph-property PT/TPL and current ACTIVE_REFERENCE RPM row H2-M1-RPM-037, but crosswalk mappingStatus is DIRECT_BINDING_GAP and exact 2015 수학I H15-M1-06 bindingStatus is MISSING; preserve as explicit binding debt.';
const evidence = {
  schemaVersion: 'JS_ARCHIVE_STAGE_EVIDENCE_v2',
  qualityContractVersion: QUALITY_CONTRACT_V2,
  executionLine: 'CODEX',
  examUid: '24_매산여고_1학기_중간_고2_수학I',
  artifactSha,
  rows: [{ qid: 21, solutionSha256: solutionSha256(q.solution) }],
  artifactDispositions: {
    artifactSha,
    rows: [{ qid: 21, metaDebtFields: ['problemTypeKey', 'templateKey'], metaDebtReason }],
  },
};
const result = validateArtifactContract({ stage: 'ITEM_RECOVERY', evidence, questions: [q], repoRoot: root, assetRoot: path.join(root, 'archive') });
const report = {
  schemaVersion: 'ITEM_RECOVERY_Q21_V2_ARTIFACT_CONTRACT_RESULT_V1',
  validator: 'archive/tools/archive-stage-validator-artifact-v2.mjs validateArtifactContract',
  qualityContractVersion: QUALITY_CONTRACT_V2,
  executionLine: 'CODEX',
  examUid: evidence.examUid,
  qid: 21,
  artifactSha,
  finalArtifactRawSha256: crypto.createHash('sha256').update(source).digest('hex'),
  solutionSha256: solutionSha256(q.solution),
  result,
};
const out = 'archive/analysis/24_매산여고_1학기_중간_고2_수학I/ITEM_RECOVERY_20261011_CODEX_CLEAN/q21-v2-artifact-contract.report.json';
fs.writeFileSync(out, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
