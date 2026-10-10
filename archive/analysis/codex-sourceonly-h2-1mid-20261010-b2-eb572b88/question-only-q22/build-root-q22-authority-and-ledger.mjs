import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dir = 'archive/analysis/codex-sourceonly-h2-1mid-20261010-b2-eb572b88/question-only-q22';
const uid = '24_순천여고_1학기_중간_고2_확률과통계';
const sourcePath = `archive/exams/original/high/h2/1mid/${uid}.js`;
const candidatePath = `${dir}/candidate/${uid}.q22-candidate.js`;
const r1Path = 'archive/analysis/r1_suncheon_yeo_prob/R1.evidence.json';
const r2Path = 'archive/analysis/r2_suncheon_yeo_prob/R2.evidence.json';
const freezeValidityPath = 'archive/analysis/r1_suncheon_yeo_prob/postfreeze-disclosure-after-meta.json';
const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const gitBlob = bytes => crypto.createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${bytes.length}\0`), bytes])).digest('hex');
const bytesAt = rel => fs.readFileSync(path.resolve(root, rel));
const hashAt = rel => sha256(bytesAt(rel));
const ref = rel => ({ path: rel, sha256: hashAt(rel) });
const candidateBytes = bytesAt(candidatePath);
const candidateHash = sha256(candidateBytes);
const candidateBlob = gitBlob(candidateBytes);
const baseHash = '984e37c7fd5687866dc3eaf5faca82657fe0b5e84b6d57e7ed8b4688b9fca24c';
const r1Expected = 'c5e93bb8275f91897fce37eec3a38608d5eee9dfb0edffcbe8721885056c6a7a';
const r2Expected = '84126bd0be65a4cd50734aac632427f567eb106373712f2f84c93ab564fedd89';
if (hashAt(sourcePath) !== baseHash || hashAt(r1Path) !== r1Expected || hashAt(r2Path) !== r2Expected) {
  throw new Error('ROOT_Q22_AUTHORITY_INPUT_SHA_MISMATCH');
}

const authorityPath = `${dir}/ROOT.q22-authority.json`;
const authority = {
  schemaVersion: 'JS_ARCHIVE_QUESTION_ONLY_REPLACEMENT_AUTHORITY_V1',
  qualityContractVersion: 'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',
  executionLine: 'CODEX', stage: 'CREATE', authorityType: 'ROOT_DELEGATED', status: 'AUTHORIZED',
  examUid: uid, qid: 22, sourceOrdinal: 22, replacementScope: 'QUESTION_ONLY',
  userDirective: 'The user authorized the direct QUESTION_ONLY item-replacement route for a true q22 hold before R3, preserving the original item history and requiring fresh scoped R1/R2 review before materialization.',
  source: { path: sourcePath, rawSha256: baseHash, gitBlobSha: '4428950e0794ad1d6f32da603e4978083f18a2cc' },
  candidate: { rawSha256: candidateHash, gitBlobSha: candidateBlob, assets: [] },
  sourceParityClaim: 'NOT_APPLICABLE_QUESTION_ONLY_REPLACEMENT',
  reason: 'R1 and R2 independently confirmed the exact original q22 prompt is non-unique. This authority permits only a candidate replacement in q22; production materialization remains gated on scoped CREATE, fresh q22 R1 and R2, and R3 closure.',
  holdEvidence: {
    r1Ref: ref(r1Path), r2Ref: ref(r2Path), r1FreezeValidityRef: ref(freezeValidityPath),
    r1CompletionEventRef: ref('archive/analysis/r1_suncheon_yeo_prob/R1.complete.event.json'),
    r2CompletionEventRef: ref('archive/analysis/r2_suncheon_yeo_prob/R2.complete.event.json')
  }
};
const authorityBytes = Buffer.from(`${JSON.stringify(authority, null, 2)}\n`);
fs.writeFileSync(path.resolve(root, authorityPath), authorityBytes);
const authorityRef = { path: authorityPath, sha256: sha256(authorityBytes) };

const historyPaths = [
  `${dir}/history/original-source.js`, `${dir}/history/original-q22-hold.json`,
  r1Path, 'archive/analysis/r1_suncheon_yeo_prob/R1.evidence.rev1.bound.json',
  'archive/analysis/r1_suncheon_yeo_prob/R1.complete.event.json',
  'archive/analysis/r1_suncheon_yeo_prob/original-freeze.json',
  'archive/analysis/r1_suncheon_yeo_prob/student-current.json',
  'archive/analysis/r1_suncheon_yeo_prob/student-current-after-meta.json',
  'archive/analysis/r1_suncheon_yeo_prob/meta-repair-scope-plan.json',
  'archive/analysis/r1_suncheon_yeo_prob/meta-correction-ledger.json',
  freezeValidityPath, r2Path,
  'archive/analysis/r2_suncheon_yeo_prob/original-freeze.json',
  'archive/analysis/r2_suncheon_yeo_prob/student-bundle.json',
  'archive/analysis/r2_suncheon_yeo_prob/asset-reads.json',
  'archive/analysis/r2_suncheon_yeo_prob/R2.complete.event.json'
];
const historyCopies = [...new Set(historyPaths)].map(rel => ({ path: rel, sha256: hashAt(rel), readForReplacementAnswer: false }));
const ledgerPath = `${dir}/question-only-replacement-ledger.json`;
const ledger = {
  schemaVersion: 'JS_ARCHIVE_QUESTION_ONLY_REPLACEMENT_LEDGER_V1',
  examUid: uid, stage: 'CREATE', qid: 22, replacementMode: 'QUESTION_ONLY',
  candidateArtifactSha256: candidateHash,
  source: { path: sourcePath, sha256: baseHash, gitBlobSha: '4428950e0794ad1d6f32da603e4978083f18a2cc', candidateChangedOnlyQid: 22, unchangedQidsSemanticParity: '22/22' },
  originalTarget: { qid: 22, problemImageRef: null, problemImageSha256: null, sourceImageActuallyOpened: false, sourceParityClaim: 'NOT_APPLICABLE_QUESTION_ONLY_REPLACEMENT' },
  replacement: { sameSlot: 22, responseForm: 'SHORT_ANSWER', sourceParityClaim: 'NOT_APPLICABLE_QUESTION_ONLY_REPLACEMENT' },
  authorityRef,
  originalHoldEvidence: { r1Ref: authority.holdEvidence.r1Ref, r2Ref: authority.holdEvidence.r2Ref },
  historyCopies
};
fs.writeFileSync(path.resolve(root, ledgerPath), `${JSON.stringify(ledger, null, 2)}\n`);
console.log(JSON.stringify({ authorityPath, authoritySha256: authorityRef.sha256, ledgerPath, ledgerSha256: hashAt(ledgerPath), candidateHash, candidateBlob, r1: authority.holdEvidence.r1Ref, r2: authority.holdEvidence.r2Ref, historyCopyCount: historyCopies.length }, null, 2));
