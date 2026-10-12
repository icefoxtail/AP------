import fs from 'node:fs';
import crypto from 'node:crypto';
import core from '../../../../archive/archive2-core.js';

const targets = [
  ['19_강남여고_1학기_중간_고2_수학I', 30],
  ['19_순천여고_1학기_중간_고2_수학I', 22],
  ['19_제일고_1학기_중간_고2_확률과통계', 21],
  ['20_매산고_1학기_중간_고2_수학I', 20],
  ['20_매산여고_1학기_중간_고2_수학I', 23],
];
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const rawCatalog = fs.readFileSync('archive/data/archive2-catalog.json');
const catalog = core.decodeCatalog(JSON.parse(rawCatalog.toString('utf8')));
const exams = [];
for (const [examUid, expected] of targets) {
  const fileSuffix = `${examUid}.js`;
  const exam = catalog.exams.find(row => row.file.endsWith(fileSuffix));
  const records = catalog.records.filter(row => row.sourceFile.endsWith(fileSuffix));
  if (!exam || records.length !== expected || Number(exam.automaticCount) !== expected)
    throw new Error(`TARGET_ELIGIBILITY_COUNT_MISMATCH:${examUid}`);
  for (const record of records) {
    const assignment = record.assignmentEvidence;
    if (record.identityStatus !== 'VERIFIED' || record.sourceStatus !== 'VERIFIED' ||
        assignment?.approvalStatus !== 'APPROVED' || assignment?.reviewEvidence?.status !== 'PASS' ||
        assignment.questionUid !== record.questionUid || assignment.sourceOrdinal !== record.sourceOrdinal ||
        assignment.sourceFile !== record.sourceFile || assignment.assignmentFingerprint !== record.assignmentFingerprint ||
        !assignment.curriculumKey || !assignment.courseKey || !assignment.L1 || !assignment.L2)
      throw new Error(`TARGET_ASSIGNMENT_EVIDENCE_MISMATCH:${examUid}#${record.sourceOrdinal}`);
  }
  const assignmentRows = records.map(record => ({
    questionUid: record.questionUid,
    sourceOrdinal: record.sourceOrdinal,
    assignmentFingerprint: record.assignmentFingerprint,
    assignmentEvidence: record.assignmentEvidence,
  }));
  exams.push({ examUid, file: exam.file, questionCount: expected, automaticCount: exam.automaticCount,
    verifiedSourceCount: records.filter(row => row.sourceStatus === 'VERIFIED').length,
    approvedBasicAssignmentCount: records.filter(row => row.assignmentEvidence?.approvalStatus === 'APPROVED').length,
    assignmentProjectionSha256: sha(Buffer.from(JSON.stringify(assignmentRows), 'utf8')) });
}
const receipt = {
  schemaVersion: 'JS_ARCHIVE_TARGET_BASIC_ELIGIBILITY_RECEIPT_V1',
  qualityContractVersion: 'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',
  executionLine: 'CODEX',
  catalogIndexVersion: catalog.indexVersion,
  catalogSha256: sha(rawCatalog),
  totalQuestions: exams.reduce((sum, row) => sum + row.questionCount, 0),
  totalAutomatic: exams.reduce((sum, row) => sum + row.automaticCount, 0),
  exams,
  status: 'PASS',
};
fs.writeFileSync(new URL('./ROOT.target-basic-eligibility.rev1.json', import.meta.url), `${JSON.stringify(receipt, null, 2)}\n`, 'utf8');
console.log(JSON.stringify(receipt, null, 2));
