import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateMachineEvidence, validateTypedEvidence } from '../../archive/tools/pipeline-core/review-evidence-v2.mjs';
import { readBoundFile } from '../../archive/tools/pipeline-core/canonical.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const REPORT = path.join(ROOT, 'reports', 'hs-quadratic-svg-upgrade-20260908');
const PREP = JSON.parse(fs.readFileSync(path.join(REPORT, process.argv[2] || '64_machine_evidence_r10.json'), 'utf8'));
const OUTPUT = path.join(REPORT, process.argv[3] || '65_machine_evidence_validation_r10.json');
const errors = []; let evidenceCount = 0; let questionCount = 0;
for (const item of PREP.runs) {
  const run = JSON.parse(fs.readFileSync(path.join(ROOT, item.manifestPath), 'utf8')); questionCount += run.questions.length; const byId = new Map();
  for (const ref of run.evidence) { const evidence = JSON.parse(readBoundFile(ROOT, ref)); byId.set(evidence.evidenceId, evidence); evidenceCount += 1; errors.push(...validateMachineEvidence(evidence, run).map(error => `${run.runId}:${error}`), ...validateTypedEvidence(evidence).map(error => `${run.runId}:${error}`)); }
  for (const question of run.questions) for (const axis of ['STATIC', 'METADATA']) if (!byId.has(question.evidence[axis])) errors.push(`${run.runId}:${question.questionUid}:EVIDENCE_REF_MISSING:${axis}`);
}
const output = { schemaVersion: 'HS_QUADRATIC_MACHINE_EVIDENCE_VALIDATION_R10', status: errors.length ? 'MACHINE_EVIDENCE_VALIDATION_FAIL' : 'MACHINE_EVIDENCE_VALIDATED_NO_FREEZE_NO_PASS', productionAuthorized: false, runCount: PREP.runCount, questionCount, evidenceCount, expectedEvidenceCount: questionCount * 2, errors, nextGate: 'RENDER_CAPTURE_AND_WHOLE_JOB_FREEZE', note: 'Validates only machine STATIC/METADATA evidence schema and run binding; it does not certify semantic math/V1/V2/V3 or render quality.' };
fs.writeFileSync(OUTPUT, `${JSON.stringify(output, null, 2)}\n`, 'utf8'); console.log(JSON.stringify({ status: output.status, runCount: output.runCount, questionCount: output.questionCount, evidenceCount: output.evidenceCount, errors: errors.length }, null, 2));
