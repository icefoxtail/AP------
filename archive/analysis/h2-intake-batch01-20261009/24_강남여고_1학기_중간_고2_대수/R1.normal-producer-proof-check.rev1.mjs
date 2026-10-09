import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { verifyR1EvidenceBinding, parseAuthorizedDisplayIdentity } from '../../../../archive/tools/prepare-target-registration-candidate.mjs';
import { readExam } from '../../../../archive/tools/archive-codex-artifact-io.mjs';
const root = process.cwd();
const examUid = '24_강남여고_1학기_중간_고2_대수';
const dir = `archive/analysis/h2-intake-batch01-20261009/${examUid}`;
const regAssignmentPath = `.tmp/archive/h2-intake-batch01-20261009/${examUid}/registration.assignment.v1.json`;
const assignment = JSON.parse(fs.readFileSync(regAssignmentPath, 'utf8'));
const evidencePath = `${dir}/R1.evidence.r1_10.20261009.rev6.bound.json`;
const validationPath = `${dir}/R1.validator.rev5.raw.stdout.json`;
const evidenceBytes = fs.readFileSync(evidencePath);
const validationBytes = fs.readFileSync(validationPath);
assignment.r1EvidencePath = evidencePath;
assignment.r1EvidenceSha256 = crypto.createHash('sha256').update(evidenceBytes).digest('hex');
assignment.r1ValidationPath = validationPath;
assignment.r1ValidationSha256 = crypto.createHash('sha256').update(validationBytes).digest('hex');
const exam = readExam(assignment.workingJsAbsolute);
const verified = verifyR1EvidenceBinding({ root, evidencePath, validationPath, assignment, examUid, bank: exam.questions });
let alias;
try {
  alias = { status: 'PASS', value: parseAuthorizedDisplayIdentity({ examUid, productionRelativePath: assignment.productionRelativePath, grade: assignment.grade, course: assignment.course }) };
} catch (error) {
  alias = { status: 'BLOCKED', code: String(error.message || error).split(':')[0], message: String(error.message || error) };
}
console.log(JSON.stringify({
  schemaVersion: 'ARCHIVE_R1_NORMAL_PRODUCER_PROOF_CHECK_V1',
  executionLine: 'CODEX',
  qualityContractVersion: 'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',
  examUid,
  assignmentPath: regAssignmentPath,
  currentSourceRawSha256: exam.rawSha256,
  currentSourceBlobSha1: exam.rawBufferGitBlobSha1,
  evidencePath,
  evidenceSha256: assignment.r1EvidenceSha256,
  validationPath,
  validationSha256: assignment.r1ValidationSha256,
  proofDisposition: 'ACCEPTED_BY_NORMAL_R1_META_PROOF_VERIFIER',
  acceptedDebtRows: verified.metaDebtRows,
  displayAliasCheck: alias,
  sourceOrRegistryWrites: false
}, null, 2));
