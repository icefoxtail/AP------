import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
const candidate = String.raw`C:\Users\USER\.codex\worktrees\archive-exam-import-2026-2mid\AP------\.tmp\archive\codex-20261007-2sem-mid-jeil-calc1\26_제일고_2학기_중간_고2_미적분I\candidate\26_제일고_2학기_중간_고2_미적분I.js`;
const assetRoot = path.dirname(candidate);
const bundlePath = String.raw`C:\Users\USER\.codex\worktrees\archive-exam-import-2026-2mid\AP------\archive\analysis\26_제일고_2학기_중간_고2_미적분I\codex-20261007-2sem-mid-jeil-calc1\handoff\R3.current-final-student-only-bundle.json`;
const backupPath = String.raw`C:\Users\USER\.codex\worktrees\archive-exam-import-2026-2mid\AP------\archive\analysis\26_제일고_2학기_중간_고2_미적분I\codex-20261007-2sem-mid-jeil-calc1\evidence\candidate.pre-q5-render-correction.js`;
const manifestPath = String.raw`C:\Users\USER\.codex\worktrees\archive-exam-import-2026-2mid\AP------\archive\analysis\26_제일고_2학기_중간_고2_미적분I\codex-20261007-2sem-mid-jeil-calc1\evidence\R1-q5-correction-patch-manifest.json`;
const expectedOldRaw = '5024ab6365b997669b47edfa0985900d8adfef50db7523ef9f6924787585198c';
const oldBytes = fs.readFileSync(candidate);
const oldRaw = crypto.createHash('sha256').update(oldBytes).digest('hex');
if (oldRaw !== expectedOldRaw) throw new Error(`OLD_ARTIFACT_SHA_MISMATCH:${oldRaw}`);
if (!fs.existsSync(backupPath)) fs.copyFileSync(candidate, backupPath);
const backupSha = crypto.createHash('sha256').update(fs.readFileSync(backupPath)).digest('hex');
if (backupSha !== oldRaw) throw new Error('PRE_CORRECTION_BACKUP_SHA_MISMATCH');
const bundle = JSON.parse(fs.readFileSync(bundlePath, 'utf8'));
const bundleQ5 = bundle.items?.filter(item => Number(item.id) === 5) ?? [];
if (bundleQ5.length !== 1) throw new Error('BUNDLE_Q5_CARDINALITY');
const oldSource = oldBytes.toString('utf8');
function loadQuestions(source, filename) {
  const box = { window: {} };
  vm.createContext(box);
  vm.runInContext(source, box, { filename, timeout: 5000 });
  const questions = box.window.questionBank || box.window.questions;
  if (!Array.isArray(questions)) throw new Error('QUESTION_BANK_REQUIRED');
  return questions;
}
const oldQuestions = loadQuestions(oldSource, candidate);
if (oldQuestions.length !== 22) throw new Error(`OLD_QID_COUNT:${oldQuestions.length}`);
const oldQ5Rows = oldQuestions.filter(q => Number(q.id) === 5);
if (oldQ5Rows.length !== 1) throw new Error('OLD_CANDIDATE_Q5_CARDINALITY');
const oldQ5 = oldQ5Rows[0];
for (const field of ['content','choices']) if (JSON.stringify(oldQ5[field]) !== JSON.stringify(bundleQ5[0][field])) throw new Error(`OLD_Q5_BUNDLE_PARITY_FAIL:${field}`);
if ((oldQ5.image ?? null) !== (bundleQ5[0].image ?? null) || (oldQ5.imageAlt ?? null) !== (bundleQ5[0].imageAlt ?? null)) throw new Error('OLD_Q5_VISUAL_PARITY_FAIL');
const replacements = [
  { index: 0, old: '$-dfrac52$', next: '$-\\dfrac{5}{2}$' },
  { index: 1, old: '$-dfrac53$', next: '$-\\dfrac{5}{3}$' },
  { index: 3, old: '$dfrac73$', next: '$\\dfrac{7}{3}$' }
];
for (const r of replacements) if (bundleQ5[0].choices[r.index] !== r.old) throw new Error(`ASSIGNED_Q5_TOKEN_MISMATCH:${r.index}`);
let patchedSource = oldSource;
const sourceChanges = [];
for (const r of replacements) {
  const oldLiteral = JSON.stringify(r.old);
  const nextLiteral = JSON.stringify(r.next);
  const count = patchedSource.split(oldLiteral).length - 1;
  if (count !== 1) throw new Error(`UNIQUE_Q5_LITERAL_REQUIRED:${r.index}:${count}`);
  const at = patchedSource.indexOf(oldLiteral);
  patchedSource = patchedSource.slice(0, at) + nextLiteral + patchedSource.slice(at + oldLiteral.length);
  sourceChanges.push({ choiceIndex: r.index, oldValue: r.old, newValue: r.next, sourceLiteralOccurrenceCount: count });
}
const expectedPatch = patchedSource;
const newBytes = Buffer.from(patchedSource, 'utf8');
const newQuestions = loadQuestions(patchedSource, candidate);
if (newQuestions.length !== 22) throw new Error('NEW_QID_COUNT_MISMATCH');
const newQ5Rows = newQuestions.filter(q => Number(q.id) === 5);
if (newQ5Rows.length !== 1) throw new Error('NEW_CANDIDATE_Q5_CARDINALITY');
const newQ5 = newQ5Rows[0];
const expectedChoices = ['$-\\dfrac{5}{2}$', '$-\\dfrac{5}{3}$', '$4$', '$\\dfrac{7}{3}$', '$6$'];
if (JSON.stringify(newQ5.choices) !== JSON.stringify(expectedChoices)) throw new Error('CORRECTED_Q5_CHOICES_MISMATCH');
for (const field of ['content','answer','solution','level','standardCourse','standardUnitKey','standardUnit','subUnitKey','subUnit','problemTypeKey','templateKey','difficultyBucket','difficultyConfidence','difficultyBoundaryFlag','legacyLevelCompatibility','image','solutionImage','visualAsset']) {
  if (JSON.stringify(newQ5[field] ?? null) !== JSON.stringify(oldQ5[field] ?? null)) throw new Error(`Q5_PROTECTED_FIELD_CHANGED:${field}`);
}
const changedOtherQids = [];
for (let i = 0; i < oldQuestions.length; i++) {
  const oldQ = oldQuestions[i]; const newQ = newQuestions[i];
  if (Number(oldQ.id) === 5) continue;
  if (JSON.stringify(oldQ) !== JSON.stringify(newQ)) changedOtherQids.push(Number(oldQ.id));
}
if (changedOtherQids.length) throw new Error(`NON_Q5_QUESTION_OBJECT_CHANGED:${changedOtherQids.join(',')}`);
const assetChecks = (bundle.assetManifest ?? []).map(asset => {
  const file = path.resolve(assetRoot, asset.path);
  const bytes = fs.readFileSync(file);
  const sha256 = crypto.createHash('sha256').update(bytes).digest('hex');
  if (sha256 !== asset.sha256 || bytes.length !== asset.bytes) throw new Error(`ASSET_BEFORE_PATCH_MISMATCH:${asset.path}`);
  return { qid: asset.qid, path: asset.path, sha256, bytes: bytes.length };
});
if (assetChecks.length !== 3) throw new Error(`EXPECTED_THREE_ASSETS:${assetChecks.length}`);
const oldPositions = [];
let cursor = 0;
for (const r of replacements) {
  const token = JSON.stringify(r.old);
  const start = oldSource.indexOf(token, cursor);
  if (start < 0) throw new Error('PATCH_TOKEN_ORDER_INVALID');
  oldPositions.push({ start, end: start + token.length, index: r.index });
  cursor = start + token.length;
}
let reconstructed = oldSource;
for (let i = replacements.length - 1; i >= 0; i--) {
  const pos = oldPositions[i];
  reconstructed = reconstructed.slice(0, pos.start) + JSON.stringify(replacements[i].next) + reconstructed.slice(pos.end);
}
if (reconstructed !== expectedPatch) throw new Error('PATCH_DIFF_OUTSIDE_THREE_CHOICE_TOKENS');
fs.writeFileSync(candidate, newBytes);
const newRaw = crypto.createHash('sha256').update(newBytes).digest('hex');
const newBlobHash = crypto.createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${newBytes.length}\0`), newBytes])).digest('hex');
const finalAssetChecks = assetChecks.map(asset => {
  const bytes = fs.readFileSync(path.resolve(assetRoot, asset.path));
  const sha256 = crypto.createHash('sha256').update(bytes).digest('hex');
  if (sha256 !== asset.sha256 || bytes.length !== asset.bytes) throw new Error(`ASSET_AFTER_PATCH_MISMATCH:${asset.path}`);
  return { ...asset, postPatchSha256: sha256, postPatchBytes: bytes.length, unchanged: true };
});
const patchReport = {
  schemaVersion: 'JS_ARCHIVE_R1_Q5_POSTFREEZE_TEX_ENCODING_PATCH_V1',
  qid: 5, changedField: 'choices', changedChoiceIndexes: [0,1,3], issueCode: 'Q5_CHOICE_TEX_BACKSLASH_MISSING',
  oldArtifactRawSha256: oldRaw, oldArtifactBlobSha1: crypto.createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${oldBytes.length}\0`), oldBytes])).digest('hex'),
  preCorrectionBackupAbsolute: backupPath, preCorrectionBackupSha256: backupSha,
  newArtifactRawSha256: newRaw, newArtifactBlobSha1: newBlobHash,
  changedQuestionByteLocus: 'Only source string literal tokens corresponding to q5 choices[0], choices[1], choices[3].',
  choiceTokenCorrections: sourceChanges,
  q5ProtectedFieldsUnchanged: true, nonQ5QuestionObjectEquality: true, nonQ5QuestionByteRangesUnchanged: true,
  assetCount: finalAssetChecks.length, assetChecks: finalAssetChecks,
  r1FreezeSha256: 'e64c120c617680ed1b81be95fb54bb8fd99c6aaa0ca9c1f6c030b4a19d7c8ec2',
  r2FreezeSha256: 'b6e687990a6cddf1161cff2c53776d6974e9ae289c116c519b10d006560eb70b',
  originalR3FailureSha256: '1a04004ad34d2e8d84a77398b4cebda6deee600d52b20ab4d5c62b884a4e90d9'
};
fs.writeFileSync(manifestPath, `${JSON.stringify(patchReport,null,2)}\n`, 'utf8');
console.log(JSON.stringify({manifestPath, oldArtifactRawSha256: oldRaw, newArtifactRawSha256: newRaw, newArtifactBlobSha1: newBlobHash, correctedChoiceIndexes: [0,1,3], q5ProtectedFieldsUnchanged: true, nonQ5QuestionObjectEquality: true, nonQ5QuestionByteRangesUnchanged: true, assetCount: finalAssetChecks.length},null,2));
