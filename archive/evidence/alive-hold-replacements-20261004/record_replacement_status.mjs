import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const dir = path.join(root, 'archive/evidence/alive-hold-replacements-20261004');
const sidecarPath = path.join(dir, 'alive-validation-sidecars.json');
const replacementPath = path.join(dir, 'original-slot-replacements.json');
const sidecar = JSON.parse(fs.readFileSync(sidecarPath, 'utf8'));
const provenance = JSON.parse(fs.readFileSync(replacementPath, 'utf8'));
if (provenance.replacementCount !== 8 || sidecar.actualCount !== 8) throw new Error('REPLACEMENT_DENOMINATOR_MISMATCH');
sidecar.disposition = 'Original exam JS slots now contain one generated variant per HOLD. ALIVE v2 quality approval remains BLOCKED before freeze.';
sidecar.pipelineCore.originalSlotsReplaced = true;
sidecar.pipelineCore.replacementEvidenceRef = 'archive/evidence/alive-hold-replacements-20261004/original-slot-replacements.json';
for (const row of sidecar.questions) {
  const matched = provenance.replacedQuestions.find(item => item.qid === Number(row.questionUid.split('|').at(-1)) && item.candidatePath === row.candidate.candidatePath);
  if (!matched) throw new Error(`REPLACEMENT_PROVENANCE_MISSING:${row.questionUid}`);
  row.sourceFingerprint.sourceJsSha256 = matched.sourceBeforeJsSha256;
  row.sourceFingerprint.sourceJsAfterReplacementSha256 = matched.sourceAfterJsSha256;
}
fs.writeFileSync(sidecarPath, `${JSON.stringify(sidecar, null, 2)}\n`, 'utf8');
process.stdout.write(JSON.stringify({ status: 'RECORDED', replacements: provenance.replacementCount, closure: sidecar.pipelineCore.freezeStatus }) + '\n');
