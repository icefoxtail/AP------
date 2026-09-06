import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const OUT = path.join(ROOT, 'archive/tools/logic-visual-audit/reports');
const read = (name) => JSON.parse(fs.readFileSync(path.join(OUT, name), 'utf8'));
const sha = (value) => `sha256:${crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex')}`;
const hashPattern = /^sha256:[0-9a-f]{64}$/;
const manifest = read('phase2_batch_11_math_verification.json');
const denominator = read('phase2_batch_11_c_denominator_frozen.json');
const required = new Set(denominator.logicVisualRequiredUidSet || []);
const errors = [];
const entries = manifest.entries || [];
const seen = new Set();
for (const entry of entries) {
  if (!entry.questionUid || seen.has(entry.questionUid)) errors.push(`UID_MISSING_OR_DUPLICATE:${entry.questionUid ?? 'MISSING'}`);
  seen.add(entry.questionUid);
  if (!required.has(entry.questionUid)) errors.push(`UID_OUTSIDE_CURRENT_C_DENOMINATOR:${entry.questionUid}`);
  if (entry.status !== 'INDEPENDENTLY_VERIFIED') errors.push(`ENTRY_NOT_INDEPENDENTLY_VERIFIED:${entry.questionUid}`);
  if (!entry.verifierId || !entry.reviewSessionId || !hashPattern.test(entry.inputBundleSha || '') || !hashPattern.test(entry.mathEvidenceSha || '')) errors.push(`INDEPENDENT_BINDING_INCOMPLETE:${entry.questionUid}`);
  if (entry.answerSolutionParity !== 'PASS' || entry.allChoicesChecked !== true || entry.answerUnique !== true) errors.push(`MATH_COMPLETENESS_NOT_PROVEN:${entry.questionUid}`);
  if (entry.verificationMode === 'VERIFIED_AGAINST_EXISTING_SOLUTION' || entry.notes?.includes('existing solution')) errors.push(`LEGACY_SOLUTION_REUSE_NOT_INDEPENDENT:${entry.questionUid}`);
}
for (const uid of required) if (!seen.has(uid)) errors.push(`MATH_ENTRY_MISSING:${uid}`);
if (manifest.independentExternalStatus !== 'PROVEN') errors.push('EXTERNAL_INDEPENDENCE_NOT_PROVEN');
if (manifest.verificationMode !== 'SEPARATE_MATH_RECHECK_EXTERNAL_BLIND') errors.push('VERIFICATION_MODE_NOT_EXTERNAL_BLIND');
if (manifest.manifestSha !== sha(entries)) errors.push('MATH_MANIFEST_SHA_MISMATCH');
const output = {
  generatedAtKst: '2026-09-06',
  phase: 'LOGIC_VISUAL_PHASE_2_MATH_VERIFICATION_VALIDATION',
  batchId: manifest.batchId,
  status: errors.length ? 'FAIL_INDEPENDENT_MATH_VERIFICATION' : 'PASS_INDEPENDENT_MATH_VERIFICATION',
  requiredCount: required.size,
  entryCount: entries.length,
  errors,
  inputManifestSha: manifest.manifestSha,
  reportSha: sha({ manifestSha: manifest.manifestSha, errors })
};
fs.writeFileSync(path.join(OUT, 'phase2_batch_11_math_verification_validation.json'), JSON.stringify(output, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({ status: output.status, requiredCount: output.requiredCount, entryCount: output.entryCount, errorCount: errors.length, reportSha: output.reportSha }, null, 2));
if (errors.length) process.exitCode = 1;
