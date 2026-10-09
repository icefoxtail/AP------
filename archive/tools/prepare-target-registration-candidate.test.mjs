import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import vm from 'node:vm';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  appendDbExamRow,
  assertCandidateStatusIsRegistryOnly,
  buildAuthorizedDbRow,
  canonicalSourceFingerprint,
  makeTargetIdentityRows,
  makeTargetMetadataRows,
  parseAuthorizedDisplayIdentity,
  verifyBoundLegacyDisplayAliasAdmission,
  serializeR1MetaProofSummary,
  verifyR1MetaCoreDebtAdmission,
  verifyR1EvidenceBinding,
  verifyR1ReuseBinding,
} from './prepare-target-registration-candidate.mjs';
import core from '../archive2-core.js';

const sourcePath = 'archive/exams/original/high/h2/2final/19_금당고_2학기_기말_고2_수학II.js';
const examUid = '19_금당고_2학기_기말_고2_수학II';
const course = 'math2';

test('uses only locked display aliases and roster grade/course for target DB identity', () => {
  const identity = parseAuthorizedDisplayIdentity({ examUid, productionRelativePath: sourcePath, grade: 'h2', course });
  assert.equal(identity.sourceFile, 'original/high/h2/2final/19_금당고_2학기_기말_고2_수학II.js');
  assert.deepEqual(identity.displayAlias, { school: '금당고', year: 2019, semester: '2', examType: 'final', grade: '고2', subject: '수학II', contentType: '기출' });
  assert.throws(() => parseAuthorizedDisplayIdentity({ examUid, productionRelativePath: sourcePath, grade: 'h1', course }), /ROSTER_GRADE_ALIAS_MISMATCH/);
  assert.throws(() => parseAuthorizedDisplayIdentity({ examUid, productionRelativePath: sourcePath, grade: 'h2', course: 'geometry' }), /ROSTER_COURSE_DISPLAY_ALIAS_MISMATCH/);
});

test('accepts the locked H1 math-upper display alias and rejects grade, path, or course contradictions', () => {
  const h1ExamUid = '21_금당고_1학기_기말_고1_기출';
  const h1Path = 'archive/exams/original/high/h1/1final/21_금당고_1학기_기말_고1_기출.js';
  const identity = parseAuthorizedDisplayIdentity({ examUid: h1ExamUid, productionRelativePath: h1Path, grade: 'h1', course: '수학(상)' });
  assert.equal(identity.sourceFile, 'original/high/h1/1final/21_금당고_1학기_기말_고1_기출.js');
  assert.deepEqual(identity.displayAlias, { school: '금당고', year: 2021, semester: '1', examType: 'final', grade: '고1', subject: '수학(상)', contentType: '기출' });
  assert.throws(() => parseAuthorizedDisplayIdentity({ examUid: h1ExamUid, productionRelativePath: h1Path, grade: 'h2', course: '수학(상)' }), /ROSTER_GRADE_ALIAS_MISMATCH/);
  assert.throws(() => parseAuthorizedDisplayIdentity({ examUid: h1ExamUid, productionRelativePath: `archive/exams/original/high/h2/1final/${h1ExamUid}.js`, grade: 'h1', course: '수학(상)' }), /ROSTER_GRADE_SOURCE_PATH_MISMATCH/);
  assert.throws(() => parseAuthorizedDisplayIdentity({ examUid: h1ExamUid, productionRelativePath: h1Path, grade: 'h1', course: 'math2' }), /ROSTER_COURSE_DISPLAY_ALIAS_MISMATCH/);
  assert.throws(() => parseAuthorizedDisplayIdentity({ examUid: '21_금당고_1학기_기말_고2_수학(상)', productionRelativePath: 'archive/exams/original/high/h2/1final/21_금당고_1학기_기말_고2_수학(상).js', grade: 'h2', course: '수학(상)' }), /ROSTER_COURSE_DISPLAY_ALIAS_MISMATCH/);
  const row = buildAuthorizedDbRow({
    examUid: h1ExamUid, productionRelativePath: h1Path, grade: 'h1', course: '수학(상)',
    bank: [{ id: 1, standardCourse: '수학(상)', standardUnitKey: 'H15-SA-01', standardUnit: '다항식의 연산', standardUnitOrder: 1 }],
  });
  assert.equal(row.grade, '고1');
  assert.equal(row.subject, '수학(상)');
  assert.equal(row.courseRanges[0].courseCode, 'H15-SA');
  assert.deepEqual(core.Canonical.resolveSourceGrade({
    registeredGrade: '고1', sourceFile: 'original/high/h1/1final/21_금당고_1학기_기말_고1_기출.js',
    identitySourceFile: 'original/high/h1/1final/21_금당고_1학기_기말_고1_기출.js',
  }), { status: 'VALID', grade: '고1', reason: '' });
});

test('accepts only the canonical H2 probability-statistics identity from existing DB authority', () => {
  const existingDbContext = { window: {} };
  vm.runInNewContext(fs.readFileSync('archive/db.js', 'utf8'), existingDbContext);
  const existingPsRow = existingDbContext.window.mainDB.exams.find(row => row.file === 'original/high/h2/1mid/26_효천고_1학기_중간_고2_확률과통계.js');
  assert.equal(existingPsRow.primaryStandardCourse, '확률과 통계');
  assert.equal(existingPsRow.courseRanges[0].courseCode, 'H15-PS');
  assert.equal(existingPsRow.subject, '확률과통계');
  const psExamUid = '23_강남여고_1학기_중간_고2_확률과통계';
  const psPath = `archive/exams/original/high/h2/1mid/${psExamUid}.js`;
  const identity = parseAuthorizedDisplayIdentity({ examUid: psExamUid, productionRelativePath: psPath, grade: 'h2', course: 'H15-PS' });
  assert.equal(identity.sourceFile, `original/high/h2/1mid/${psExamUid}.js`);
  assert.deepEqual(identity.displayAlias, { school: '강남여고', year: 2023, semester: '1', examType: 'mid', grade: '고2', subject: '확률과통계', contentType: '기출' });
  assert.equal(identity.displayAlias.subject, existingPsRow.subject);
  assert.throws(() => parseAuthorizedDisplayIdentity({ examUid: psExamUid, productionRelativePath: psPath, grade: 'h1', course: 'H15-PS' }), /ROSTER_GRADE_ALIAS_MISMATCH/);
  assert.throws(() => parseAuthorizedDisplayIdentity({ examUid: psExamUid, productionRelativePath: psPath, grade: 'h2', course: 'H15-M2' }), /ROSTER_COURSE_DISPLAY_ALIAS_MISMATCH/);
  assert.throws(() => parseAuthorizedDisplayIdentity({ examUid: '23_강남여고_1학기_중간_고2_수학II', productionRelativePath: 'archive/exams/original/high/h2/1mid/23_강남여고_1학기_중간_고2_수학II.js', grade: 'h2', course: 'H15-PS' }), /ROSTER_COURSE_DISPLAY_ALIAS_MISMATCH/);
  assert.throws(() => parseAuthorizedDisplayIdentity({ examUid: '23_강남여고_1학기_중간_고2_확률통계', productionRelativePath: 'archive/exams/original/high/h2/1mid/23_강남여고_1학기_중간_고2_확률통계.js', grade: 'h2', course: 'H15-PS' }), /ROSTER_COURSE_DISPLAY_ALIAS_MISMATCH/);
});

test('accepts only the canonical H2 H15-M1 to 수학I display alias verified by course master and existing DB', () => {
  const masterText = fs.readFileSync('docs/rules/01_CANONICAL/JS아카이브_표준단원키_마스터테이블.md', 'utf8');
  assert.match(masterText, /###\s*수학I\s*\(H15-M1\)/);
  const existingDbContext = { window: {} };
  vm.runInNewContext(fs.readFileSync('archive/db.js', 'utf8'), existingDbContext);
  const existingMathIRow = existingDbContext.window.mainDB.exams.find(row => row.file === 'original/high/h2/1final/25_금당고_1학기_기말_고2_수학I.js');
  assert.ok(existingMathIRow);
  assert.equal(existingMathIRow.subject, '수학I');
  assert.equal(existingMathIRow.primaryStandardCourse, '수학I');
  assert.equal(existingMathIRow.courseRanges[0].courseCode, 'H15-M1');

  const targetUid = '23_매산고_1학기_중간_고2_수학I';
  const targetPath = `archive/exams/original/high/h2/1mid/${targetUid}.js`;
  const identity = parseAuthorizedDisplayIdentity({ examUid: targetUid, productionRelativePath: targetPath, grade: 'h2', course: 'H15-M1' });
  assert.deepEqual(identity.displayAlias, { school: '매산고', year: 2023, semester: '1', examType: 'mid', grade: '고2', subject: '수학I', contentType: '기출' });
  const row = buildAuthorizedDbRow({
    examUid: targetUid, productionRelativePath: targetPath, grade: 'h2', course: 'H15-M1',
    bank: [{ id: 1, standardCourse: '수학I', standardUnitKey: 'H15-M1-03', standardUnit: '지수함수', standardUnitOrder: 3 }],
  });
  assert.equal(row.subject, existingMathIRow.subject);
  assert.equal(row.primaryStandardCourse, existingMathIRow.primaryStandardCourse);
  assert.equal(row.courseRanges[0].courseCode, existingMathIRow.courseRanges[0].courseCode);

  assert.throws(() => parseAuthorizedDisplayIdentity({ examUid: targetUid, productionRelativePath: targetPath, grade: 'h1', course: 'H15-M1' }), /ROSTER_GRADE_ALIAS_MISMATCH/);
  assert.throws(() => parseAuthorizedDisplayIdentity({ examUid: targetUid, productionRelativePath: targetPath, grade: 'h2', course: 'H15-M2' }), /ROSTER_COURSE_DISPLAY_ALIAS_MISMATCH/);
  const wrongSubjectUid = '23_매산고_1학기_중간_고2_수학II';
  assert.throws(() => parseAuthorizedDisplayIdentity({ examUid: wrongSubjectUid, productionRelativePath: `archive/exams/original/high/h2/1mid/${wrongSubjectUid}.js`, grade: 'h2', course: 'H15-M1' }), /ROSTER_COURSE_DISPLAY_ALIAS_MISMATCH/);
});

test('accepts legacy H15-M1 display alias only with matching ROOT roster scope and current R1 attestation', () => {
  const root = process.cwd();
  const targetUid = '24_강남여고_1학기_중간_고2_대수';
  const productionRelativePath = `archive/exams/original/high/h2/1mid/${targetUid}.js`;
  const attestationRelativePath = `archive/analysis/h2-intake-batch01-20261009/${targetUid}/R1.legacy-course-display-alias-attestation.r1_10.rev1.json`;
  const sourceBytes = fs.readFileSync(path.join(root, productionRelativePath));
  const sourceRawSha256 = crypto.createHash('sha256').update(sourceBytes).digest('hex');
  const sourceGitBlobSha1 = crypto.createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${sourceBytes.length}\0`), sourceBytes])).digest('hex');
  const sourceContext = { window: {}, console: { log() {}, warn() {}, error() {} } };
  sourceContext.globalThis = sourceContext;
  vm.createContext(sourceContext);
  vm.runInContext(sourceBytes.toString('utf8'), sourceContext, { filename: productionRelativePath, timeout: 5000 });
  const bank = sourceContext.window.questionBank || sourceContext.window.questions || sourceContext.questionBank || sourceContext.questions;
  const attestationBytes = fs.readFileSync(path.join(root, attestationRelativePath));
  const attestationSha256 = crypto.createHash('sha256').update(attestationBytes).digest('hex');
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'archive-legacy-display-alias-'));
  try {
    const writeBound = (relative, bytes) => {
      const target = path.join(tempRoot, relative);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, bytes);
    };
    writeBound(productionRelativePath, sourceBytes);
    writeBound(attestationRelativePath, attestationBytes);
    const admission = {
      schemaVersion: 'ROOT_TARGET_REGISTRATION_LEGACY_DISPLAY_ALIAS_ADMISSION_V1',
      examUid: targetUid,
      productionPath: productionRelativePath,
      grade: 'h2',
      course: 'H15-M1',
      questionCount: 25,
      sourceRawSha256,
      sourceGitBlobSha1,
      sourceField: 'standardCourse',
      sourceFieldValue: '수학I',
      sourceCurriculumFamily: 'H15-M1',
      legacyUidSuffix: '대수',
      displaySubject: '수학I',
      attestation: { path: attestationRelativePath, sha256: attestationSha256 },
    };
    const assignment = {
      examUid: targetUid, productionRelativePath, grade: 'h2', course: 'H15-M1', questionCount: 25,
      artifactRawSha256: sourceRawSha256, validatorRawBufferBlobSha1: sourceGitBlobSha1,
    };
    const verify = (authorityAdmission = admission, rosterAdmission = admission, extra = {}) => verifyBoundLegacyDisplayAliasAdmission({
      root: tempRoot, authorityAdmission, rosterAdmission, assignment, examUid: targetUid,
      productionRelativePath, grade: 'h2', course: 'H15-M1', sourceBytes, bank, ...extra,
    });
    const token = verify();
    const identity = parseAuthorizedDisplayIdentity({
      examUid: targetUid, productionRelativePath, grade: 'h2', course: 'H15-M1', verifiedLegacyDisplayAlias: token,
    });
    assert.deepEqual(identity.displayAlias, { school: '강남여고', year: 2024, semester: '1', examType: 'mid', grade: '고2', subject: '수학I', contentType: '기출' });
    const dbRow = buildAuthorizedDbRow({ examUid: targetUid, productionRelativePath, grade: 'h2', course: 'H15-M1', bank, verifiedLegacyDisplayAlias: token });
    assert.equal(dbRow.file, 'original/high/h2/1mid/24_강남여고_1학기_중간_고2_대수.js');
    assert.equal(dbRow.subject, '수학I');
    assert.equal(dbRow.primaryStandardCourse, '수학I');
    assert.throws(() => parseAuthorizedDisplayIdentity({ examUid: targetUid, productionRelativePath, grade: 'h2', course: 'H15-M1' }), /ROSTER_COURSE_DISPLAY_ALIAS_MISMATCH/);
    assert.throws(() => parseAuthorizedDisplayIdentity({ examUid: targetUid, productionRelativePath, grade: 'h2', course: 'H15-M1', verifiedLegacyDisplayAlias: { ...token } }), /ROSTER_COURSE_DISPLAY_ALIAS_MISMATCH/);

    const changed = (field, value) => ({ ...admission, [field]: value });
    for (const [label, value] of [
      ['examUid', '24_다른여고_1학기_중간_고2_대수'],
      ['grade', 'h1'],
      ['course', 'math2'],
      ['productionPath', 'archive/exams/original/high/h2/1mid/24_강남여고_1학기_중간_고2_수학I.js'],
      ['questionCount', 24],
      ['legacyUidSuffix', '수학I'],
    ]) {
      const mutatedAdmission = changed(label, value);
      assert.throws(() => verify(mutatedAdmission, mutatedAdmission), /ROOT_LEGACY_DISPLAY_ALIAS_/ , label);
    }
    const missingAttestation = { ...admission };
    delete missingAttestation.attestation;
    assert.throws(() => verify(missingAttestation), /ROOT_LEGACY_DISPLAY_ALIAS_ADMISSION_SCHEMA_REQUIRED/);
    const staleAttestation = changed('attestation', { path: attestationRelativePath, sha256: '0'.repeat(64) });
    assert.throws(() => verify(staleAttestation, staleAttestation), /R1_LEGACY_DISPLAY_ALIAS_ATTESTATION_SHA256_MISMATCH/);
    assert.throws(() => verify(admission, { ...admission, course: 'math2' }), /ROOT_LEGACY_DISPLAY_ALIAS_SCOPE_ROW_MISMATCH/);
    const wrongSourceSha = changed('sourceRawSha256', '0'.repeat(64));
    assert.throws(() => verify(wrongSourceSha, wrongSourceSha), /ROOT_LEGACY_DISPLAY_ALIAS_SOURCE_RAW_SHA_MISMATCH/);
    const wrongSourceBlob = changed('sourceGitBlobSha1', '0'.repeat(40));
    assert.throws(() => verify(wrongSourceBlob, wrongSourceBlob), /ROOT_LEGACY_DISPLAY_ALIAS_SOURCE_BLOB_SHA_MISMATCH/);
    assert.throws(() => verify(admission, admission, { sourceBytes: Buffer.concat([sourceBytes, Buffer.from('\n')]) }), /ROOT_LEGACY_DISPLAY_ALIAS_SOURCE_RAW_SHA_MISMATCH/);
    const wrongCourseBank = bank.map(question => ({ ...question }));
    wrongCourseBank[0].standardCourse = '수학II';
    assert.throws(() => verify(admission, admission, { bank: wrongCourseBank }), /ROOT_LEGACY_DISPLAY_ALIAS_SOURCE_COURSE_PARITY_FAIL/);
    const outsideRoot = { ...admission, attestation: { path: '../outside.json', sha256: attestationSha256 } };
    assert.throws(() => verify(outsideRoot, outsideRoot), /R1_LEGACY_DISPLAY_ALIAS_ATTESTATION_PATH_OUTSIDE_ROOT/);
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
});

test('builds DB course ranges from embedded approved Meta only', () => {
  const bank = [
    { id: 1, standardCourse: '수학II', standardUnitKey: 'H15-M2-01', standardUnit: '함수의 극한', standardUnitOrder: 1 },
    { id: 2, standardCourse: '수학II', standardUnitKey: 'H15-M2-02', standardUnit: '함수의 연속', standardUnitOrder: 2 },
  ];
  const row = buildAuthorizedDbRow({ examUid, productionRelativePath: sourcePath, grade: 'h2', course, bank });
  assert.equal(row.qCount, 2);
  assert.equal(row.rangeStartUnitKey, 'H15-M2-01');
  assert.equal(row.rangeEndUnitKey, 'H15-M2-02');
  assert.deepEqual(row.courseRanges, [{
    standardCourse: '수학II', courseCode: 'H15-M2',
    rangeStartUnitKey: 'H15-M2-01', rangeStartUnit: '함수의 극한', rangeStartUnitOrder: 1,
    rangeEndUnitKey: 'H15-M2-02', rangeEndUnit: '함수의 연속', rangeEndUnitOrder: 2,
  }]);
});

test('derives target identity with the canonical UID and source fingerprint contracts', () => {
  const question = { id: 'q1', content: 'ignored by test output', choices: ['a'], answer: '1', solution: 'x', image: 'assets/images/q1.png' };
  const row = makeTargetIdentityRows('original/high/h2/2final/19_금당고_2학기_기말_고2_수학II.js', [question])[0];
  const expectedUid = 'qid_v1_' + crypto.createHash('sha256').update('original/high/h2/2final/19_금당고_2학기_기말_고2_수학II.js#1').digest('hex');
  assert.equal(row.questionUid, expectedUid);
  assert.equal(row.legacyQKey, 'original/high/h2/2final/19_금당고_2학기_기말_고2_수학II.js_q1');
  assert.equal(row.sourceFingerprint, canonicalSourceFingerprint(question));
});

test('copies embedded metadata values, preserves nullable projection, and marks empty advanced fields pending', () => {
  const sourceFile = 'original/high/h2/1mid/22_매산고_1학기_중간_고2_기하와벡터_기출.js';
  const bank = [{
    id: 1, standardCourse: '기하와 벡터', standardUnitKey: 'H15-GV-01', standardUnit: '포물선', standardUnitOrder: 2,
    subUnitKey: null, subUnit: '초점과 준선', problemTypeKey: null, templateKey: null,
    difficultyBucket: 2, difficultyConfidence: 'medium', difficultyBoundaryFlag: 'NONE', legacyLevelCompatibility: 'NORMAL',
  }];
  const identity = makeTargetIdentityRows(sourceFile, bank);
  const rows = makeTargetMetadataRows({ sourceFile, bank, identityRows: identity, r1EvidencePath: 'archive/analysis/example/R1.stage-evidence.json' });
  assert.equal(rows[0].subUnitKey, null);
  assert.equal(rows[0].subUnit, '초점과 준선');
  assert.equal(rows[0].standardUnitOrder, 2);
  assert.equal(rows[0].problemTypeKey, null);
  assert.equal(rows[0].templateKey, null);
  assert.equal(rows[0].fieldStatus.subUnit, 'approved_source');
  assert.equal(rows[0].fieldStatus.problemType, 'manual_review_pending');
  assert.equal(rows[0].fieldStatus.template, 'manual_review_pending');
  assert.equal(rows[0].metadataStatus, 'approved_partial_with_explicit_holds');
  assert.deepEqual(rows[0].approvalEvidence, ['archive/analysis/example/R1.stage-evidence.json']);
  assert.notEqual(rows[0].metadataStatus, 'approved_semantic_review');
});

test('appends exactly one DB row while preserving all existing DB rows', () => {
  const baseline = { file: 'original/high/h1/1mid/existing.js', school: '기존고', grade: '고1', qCount: 1 };
  const target = { file: 'original/high/h2/2final/target.js', school: '금당고', grade: '고2', qCount: 1 };
  const source = `window.mainDB = {\n  exams: [\n${JSON.stringify(baseline, null, 2).split('\n').map(line => '    ' + line).join('\n')}\n  ]\n};\n`;
  const result = appendDbExamRow(Buffer.from(source, 'utf8'), target).toString('utf8');
  const sandbox = { window: {} };
  vm.runInNewContext(result, sandbox);
  assert.equal(JSON.stringify(sandbox.window.mainDB.exams[0]), JSON.stringify(baseline));
  assert.equal(JSON.stringify(sandbox.window.mainDB.exams[1]), JSON.stringify(target));
});

test('allows candidate drift only in the exact nine registration baseline files', () => {
  assert.equal(assertCandidateStatusIsRegistryOnly(' M archive/db.js\0 M archive/data/archive2-catalog.json\0'), 2);
  assert.throws(() => assertCandidateStatusIsRegistryOnly(' M archive/tools/build-question-index.mjs\0'), /CANDIDATE_NON_BASELINE_DIRTY/);
});

function writeR1Chain(root, { evidencePath, validationPath, examUid, row }) {
  const evidenceAbs = path.join(root, ...evidencePath.split('/'));
  const validationAbs = path.join(root, ...validationPath.split('/'));
  fs.mkdirSync(path.dirname(evidenceAbs), { recursive: true });
  fs.mkdirSync(path.dirname(validationAbs), { recursive: true });
  const assignment = {
    artifactRawSha256: 'a'.repeat(64),
    validatorRawBufferBlobSha1: 'b'.repeat(40),
    r1EvidencePath: evidencePath,
    r1ValidationPath: validationPath,
  };
  const evidence = {
    schemaVersion: 'JS_ARCHIVE_STAGE_EVIDENCE_v2', stage: 'R1', examUid,
    artifactSha: assignment.validatorRawBufferBlobSha1,
    qualityContractVersion: 'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006', executionLine: 'CODEX',
    rows: [{ qid: 1, independentAnswer: '1', independentAnswerFrozenBeforeStoredAnswer: true, storedAnswer: '1', compareResult: 'MATCH', ...row }],
  };
  const evidenceBytes = Buffer.from(JSON.stringify(evidence));
  fs.writeFileSync(evidenceAbs, evidenceBytes);
  assignment.r1EvidenceSha256 = crypto.createHash('sha256').update(evidenceBytes).digest('hex');
  const validation = {
    ok: true, validatorMode: 'R1_V2', stage: 'R1', examUid,
    artifactSha: assignment.validatorRawBufferBlobSha1,
    evidenceRef: evidenceAbs,
    denominator: 1, rowCount: 1, disposition: 'PASS', issues: [],
    qualityContractVersion: 'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006', executionLine: 'CODEX',
    artifactContract: { active: true, disposition: 'PASS', qualityContractVersion: 'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006', questionCount: 1, issues: [] },
  };
  const validationBytes = Buffer.from(JSON.stringify(validation));
  fs.writeFileSync(validationAbs, validationBytes);
  assignment.r1ValidationSha256 = crypto.createHash('sha256').update(validationBytes).digest('hex');
  return { assignment, evidence, validation, evidenceAbs, validationAbs };
}

function writeItemRecoveryR1Chain(root, { q18ItemStatus = 'CLEAR_AFTER_FRESH_SCOPED_R1_R2', q18SourceItemStatusPresent = true, q18MetaStatus = 'PASS', verdict = 'PASS_AFTER_ITEM_RECOVERY' } = {}) {
  const examUid = '21_매산여고_1학기_기말_고1_기출';
  const evidencePath = `archive/analysis/${examUid}/h1-final-five-pilot-20261008/R1.evidence.composed.json`;
  const validationPath = `archive/analysis/${examUid}/h1-final-five-pilot-20261008/R1.raw-generic-report.rev3.json`;
  const evidenceRoot = `archive/analysis/${examUid}/h1-final-five-pilot-20261008`;
  const q18SourceBlobSha1 = 'b'.repeat(40);
  const bank = Array.from({ length: 22 }, (_, index) => ({ id: index + 1, ...(index + 1 === 18 && q18SourceItemStatusPresent ? { itemStatus: q18ItemStatus } : {}) }));
  const currentSourceBytes = Buffer.from(`window.questionBank = ${JSON.stringify(bank)};`);
  const q18SourceRawSha256 = q18SourceItemStatusPresent ? 'a'.repeat(64) : crypto.createHash('sha256').update(currentSourceBytes).digest('hex');
  const priorBank = bank.map(question => ({ ...question }));
  if (!q18SourceItemStatusPresent) priorBank[17].itemStatus = 'HOLD';
  const priorSourceBytes = Buffer.from(`window.questionBank = ${JSON.stringify(priorBank)};`);
  const priorRawSha256 = q18SourceItemStatusPresent ? q18SourceRawSha256 : crypto.createHash('sha256').update(priorSourceBytes).digest('hex');
  const evidenceAbs = path.join(root, ...evidencePath.split('/'));
  const validationAbs = path.join(root, ...validationPath.split('/'));
  fs.mkdirSync(path.dirname(evidenceAbs), { recursive: true });
  const decisionPath = `archive/analysis/${examUid}/h1-final-five-pilot-20261008/ROOT.item-recovery.decision.json`;
  const recoveryEvidencePath = `archive/analysis/${examUid}/h1-final-five-pilot-20261008/ITEM_RECOVERY.q18.closed.evidence.json`;
  const nonTargetPath = `archive/analysis/${examUid}/h1-final-five-pilot-20261008/ITEM_RECOVERY.q18.non-target-invariance.json`;
  const r1ScopePath = `archive/analysis/${examUid}/h1-final-five-pilot-20261008/R1.q18fresh.scoped-review-receipt.json`;
  const r2ScopePath = `archive/analysis/${examUid}/h1-final-five-pilot-20261008/R2.q18fresh.scoped-comparison-receipt.json`;
  const holdClearPath = `.tmp/archive/h1-final-five-pilot-20261008/${examUid}/evidence/ITEM_RECOVERY.q18.hold-clear-change.json`;
  const historicalPath = `${evidenceRoot}/preserved-inputs/history/q18-hold-clear-preimage/${examUid}/${examUid}.js.source-evidence.json`;
  const writeRef = (relative, value) => {
    const file = path.join(root, ...relative.split('/'));
    fs.mkdirSync(path.dirname(file), { recursive: true });
    const bytes = Buffer.from(typeof value === 'string' ? value : JSON.stringify(value)); fs.writeFileSync(file, bytes);
    return { path: relative, sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
  };
  const r1Receipt = writeRef(r1ScopePath, 'synthetic scoped R1 review receipt bytes');
  const r2Receipt = writeRef(r2ScopePath, 'synthetic scoped R2 comparison receipt bytes');
  const decision = writeRef(decisionPath, {
    schemaVersion: 'ROOT_POST_R2_BOUNDED_ITEM_RECOVERY_DECISION_V1', runId: 'h1-final-five-pilot-20261008', examUid,
    decisionAuthority: 'ROOT_DELEGATED', scopeQids: [18], source: { sha256: '3'.repeat(64) }, remainingAfterR2: true,
    sourceHoldRecordedInEvidence: true, physicalItemStatusNotPresent: true,
  });
  let holdClearRef = null;
  let historicalRef = null;
  if (!q18SourceItemStatusPresent) {
    holdClearRef = writeRef(holdClearPath, {
      schemaVersion: 'JS_ARCHIVE_Q18_HOLD_CLEAR_CHANGE_V1', runId: 'h1-final-five-pilot-20261008', examUid,
      changedQids: [18], changedFields: ['itemStatus'], beforeRawSha256: priorRawSha256, afterRawSha256: q18SourceRawSha256,
      priorItemStatus: 'HOLD', currentItemStatus: 'CLEARED_AFTER_FRESH_SCOPED_R1_R2', studentFieldsUnchanged: true,
      answerSolutionMetaUnchanged: true, nonTargetParsedObjectMutationCount: 0, questionCount: 22,
      r1: { path: path.resolve(root, ...r1ScopePath.split('/')), sha256: r1Receipt.sha256, verdict: 'PASS', scopeQids: [18] },
      r2: { path: path.resolve(root, ...r2ScopePath.split('/')), sha256: r2Receipt.sha256, verdict: 'PASS', scopeQids: [18], answerComparison: 'MATCH' },
    });
    historicalRef = writeRef(historicalPath, {
      schemaVersion: 'JS_ARCHIVE_HISTORICAL_SOURCE_BYTES_V1',
      originalPath: `.tmp/archive/h1-final-five-pilot-20261008/${examUid}/history/q18-hold-clear-preimage/${examUid}/${examUid}.js`,
      rawSha256: priorRawSha256, byteLength: priorSourceBytes.length, base64: priorSourceBytes.toString('base64'), usage: 'PROVENANCE_ONLY_NOT_RUNTIME_SOURCE',
    });
  }
  const nonTargetMap = Object.fromEntries(priorBank.filter(question => question.id !== 18).map(question => [String(question.id), crypto.createHash('sha256').update(JSON.stringify(question)).digest('hex')]));
  const nonTarget = writeRef(nonTargetPath, {
    schemaVersion: 'JS_ARCHIVE_ITEM_RECOVERY_NON_TARGET_INVARIANCE_V1', runId: 'h1-final-five-pilot-20261008', examUid,
    sourceBeforeRecoveryRawSha256: '3'.repeat(64), currentSourceRawSha256: q18SourceItemStatusPresent ? q18SourceRawSha256 : priorRawSha256,
    allowedQids: [18], nonTargetQids: Array.from({ length: 22 }, (_, i) => i + 1).filter(qid => qid !== 18),
    nonTargetQidCount: 21, nonTargetMutationCount: 0, currentQuestionCount: 22, changedQids: [18], nonTargetParsedObjectSha256: nonTargetMap,
  });
  const recovery = writeRef(recoveryEvidencePath, {
    schemaVersion: 'JS_ARCHIVE_ITEM_RECOVERY_CLOSURE_EVIDENCE_V1', status: 'Q18_RECOVERY_CLOSED_SCOPED_REVIEW_COMPLETE',
    runId: 'h1-final-five-pilot-20261008', examUid, allowedQids: [18], sourceMode: 'ALIVE_REPLACEMENT',
    reviewStatus: { physicalItemStatus: 'CLEAR', r1Q18: 'PASS', r2Q18: 'MATCH', scopeQids: [18] },
    closureAuthority: 'ROOT_DELEGATED', sourcePreservation: { originalSourceTextRemainsUnchanged: true },
    technicalHashes: { rawSha256: q18SourceRawSha256, validatorRawBufferBlobSha1: q18SourceBlobSha1 },
    nonTargetInvariant: { sha256: nonTarget.sha256, nonTargetQidCount: 21, nonTargetMutationCount: 0 },
    closure: !q18SourceItemStatusPresent ? {
      changeReport: { path: path.resolve(root, ...holdClearPath.split('/')), sha256: holdClearRef.sha256 },
      studentAndProofBinding: { r1R2InputRawSha256: priorRawSha256, r1R2InputBlobSha1: 'c'.repeat(40), postClearRawSha256: q18SourceRawSha256, studentFieldsUnchanged: true, answerSolutionMetaUnchanged: true, originalR1R2FreezeFilesPreserved: true },
    } : undefined,
  });
  if (!q18SourceItemStatusPresent) void historicalRef;
  const rows = Array.from({ length: 22 }, (_, index) => {
    const qid = index + 1;
    if (qid !== 18) return { qid, independentAnswer: 'x', independentAnswerFrozenBeforeStoredAnswer: true, storedAnswer: 'x', compareResult: 'MATCH', verdict: 'PASS', axisEvidence: { META: { status: 'PASS' } } };
    return {
      qid, independentAnswer: 'q18-fresh-answer', independentAnswerFrozenBeforeStoredAnswer: true, storedAnswer: 'stored-answer', compareResult: 'MATCH',
      verdict, itemStatus: q18ItemStatus, disposition: 'FRESH_Q18_R1_PASS_R2_MATCH_ALIVE_REPLACEMENT', repairApplied: true, sourceMode: 'ALIVE_REPLACEMENT',
      axisEvidence: { META: { status: q18MetaStatus } },
      provenanceEvidence: {
        authorizedReplacement: {
          sourceMode: 'ALIVE_REPLACEMENT',
          rootDecision: { ...decision, authority: 'ROOT_DELEGATED', scopeQids: [18] },
          itemRecoveryEvidence: recovery,
          nonTargetInvariant: { ...nonTarget, nonTargetQidCount: 21, mutationCount: 0 },
        },
        freshScopeReviews: {
          r1: { ...r1Receipt, reviewerIdentity: { role: 'archive_r1', reviewerId: '/root/r1_q18_clean' }, scopeQids: [18], fourAxisReview: { QUESTION_LAYOUT: { verdict: 'PASS' }, SOLUTION_LAYOUT: { verdict: 'PASS' }, META: { verdict: 'PASS' }, VISUAL_SVG: { verdict: 'VISUAL_EXEMPT' } } },
          r2: { ...r2Receipt, reviewerIdentity: { role: 'archive_r2', reviewerId: '/root/r2_q18_clean' }, scopeQids: [18], comparison: { qid: 18, disposition: 'MATCH' } },
        },
      },
    };
  });
  const assignment = {
    artifactRawSha256: q18SourceRawSha256, validatorRawBufferBlobSha1: q18SourceBlobSha1,
    r1EvidencePath: evidencePath, r1ValidationPath: validationPath,
  };
  const evidence = {
    schemaVersion: 'JS_ARCHIVE_STAGE_EVIDENCE_v2', stage: 'R1', examUid, artifactSha: q18SourceBlobSha1,
    artifactRawSha256: assignment.artifactRawSha256, artifactRawBufferBlobSha1: q18SourceBlobSha1,
    qualityContractVersion: 'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006', executionLine: 'CODEX', rows,
  };
  const evidenceBytes = Buffer.from(JSON.stringify(evidence)); fs.writeFileSync(evidenceAbs, evidenceBytes);
  assignment.r1EvidenceSha256 = crypto.createHash('sha256').update(evidenceBytes).digest('hex');
  const validation = {
    ok: true, validatorMode: 'R1_V2', stage: 'R1', examUid, artifactSha: q18SourceBlobSha1, evidenceRef: evidenceAbs,
    denominator: 22, rowCount: 22, disposition: 'PASS', issues: [],
    qualityContractVersion: 'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006', executionLine: 'CODEX',
    artifactContract: { active: true, disposition: 'PASS', qualityContractVersion: 'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006', questionCount: 22, issues: [] },
  };
  const validationBytes = Buffer.from(JSON.stringify(validation)); fs.writeFileSync(validationAbs, validationBytes);
  assignment.r1ValidationSha256 = crypto.createHash('sha256').update(validationBytes).digest('hex');
  return { evidencePath, validationPath, evidence, validation, assignment, bank };
}

test('binds a non-index0 R1 evidence path and the actual shared-validator PASS report', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'archive-r1-binding-'));
  try {
    const evidencePath = 'archive/analysis/15_강남여고_2학기_중간_고2_기하와벡터_기출/audit/final-meta-proof.json';
    const validationPath = 'archive/analysis/15_강남여고_2학기_중간_고2_기하와벡터_기출/audit/R1.validation.json';
    const examUid = '15_강남여고_2학기_중간_고2_기하와벡터_기출';
    const fixture = writeR1Chain(root, { evidencePath, validationPath, examUid, row: { verdict: 'PASS', axisEvidence: { META: { status: 'PASS' } } } });
    const bound = verifyR1EvidenceBinding({ root, evidencePath, validationPath, assignment: fixture.assignment, examUid, bank: [{ id: 1 }] });
    assert.equal(bound.relative, evidencePath);
    assert.equal(bound.validationRelative, validationPath);
    assert.equal(bound.evidenceSha256, fixture.assignment.r1EvidenceSha256);
    assert.equal(bound.validationSha256, fixture.assignment.r1ValidationSha256);
    assert.throws(() => verifyR1EvidenceBinding({ root, evidencePath, validationPath, assignment: { ...fixture.assignment, r1EvidenceSha256: '0'.repeat(64) }, examUid, bank: [{ id: 1 }] }), /ASSIGNMENT_R1_SHA256_MISMATCH/);
    assert.throws(() => verifyR1EvidenceBinding({ root, evidencePath, validationPath, assignment: { ...fixture.assignment, r1ValidationSha256: '0'.repeat(64) }, examUid, bank: [{ id: 1 }] }), /ASSIGNMENT_R1_VALIDATION_SHA256_MISMATCH/);
    assert.throws(() => verifyR1EvidenceBinding({ root, evidencePath, validationPath, assignment: { ...fixture.assignment, r1EvidencePath: 'archive/analysis/wrong.json' }, examUid, bank: [{ id: 1 }] }), /ASSIGNMENT_R1_PATH_MISMATCH/);
    const mismatchedReport = { ...fixture.validation, evidenceRef: path.join(root, 'archive/analysis/wrong-evidence.json') };
    const mismatchedReportBytes = Buffer.from(JSON.stringify(mismatchedReport));
    fs.writeFileSync(fixture.validationAbs, mismatchedReportBytes);
    fixture.assignment.r1ValidationSha256 = crypto.createHash('sha256').update(mismatchedReportBytes).digest('hex');
    assert.throws(() => verifyR1EvidenceBinding({ root, evidencePath, validationPath, assignment: fixture.assignment, examUid, bank: [{ id: 1 }] }), /R1_VALIDATION_EVIDENCE_REF_MISMATCH/);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('normalizes only explicit positive META evidence fields from heterogeneous valid R1 rows', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'archive-r1-meta-shapes-'));
  try {
    const variants = [
      { verdict: 'PASS', metaReview: { status: 'PASS' } },
      { verdict: 'PASS', fourAxisReview: { META: { disposition: 'CURRENT_FIELDS_RETAINED', evidence: 'explicit current-field review proof' } } },
      { verdict: 'PASS', metaAudit: { status: 'PASS' } },
      { verdict: 'PASS', axisEvidence: { META: { verdict: 'PASS' } } },
      { verdict: 'PASS', axisEvidence: { meta: { status: 'PASS' } } },
      { verdict: 'PASS', axisEvidence: { META: { status: 'CURRENT_FIELDS_RECORDED_NO_SEMANTIC_RECLASSIFICATION' } } },
      { verdict: 'PASS_AFTER_ADJUDICATION', metaStatus: 'PASS', axisEvidence: { META: { status: 'PASS_CURRENT_FIELDS_AND_RPM_PROOF' } } },
      { verdict: 'PASS', fourAxisReview: { META: { disposition: 'CURRENT_NULL_DEBT_PRESERVED', evidence: 'explicit current null-debt review proof' } } },
    ];
    for (let index = 0; index < variants.length; index += 1) {
      const examUid = `22_테스트고_1학기_중간_고2_기하_기출`;
      const evidencePath = `archive/analysis/fixture-${index}/R1.current.json`;
      const validationPath = `archive/analysis/fixture-${index}/R1.validation.json`;
      const fixture = writeR1Chain(root, { evidencePath, validationPath, examUid, row: variants[index] });
      const bound = verifyR1EvidenceBinding({ root, evidencePath, validationPath, assignment: fixture.assignment, examUid, bank: [{ id: 1 }] });
      assert.equal(bound.validation.disposition, 'PASS');
    }
    const invalidPath = 'archive/analysis/fixture-invalid/R1.current.json';
    const invalidValidationPath = 'archive/analysis/fixture-invalid/R1.validation.json';
    const invalid = writeR1Chain(root, { evidencePath: invalidPath, validationPath: invalidValidationPath, examUid: '22_테스트고_1학기_중간_고2_기하_기출', row: { verdict: 'PASS', metaStatus: 'PENDING' } });
    assert.throws(() => verifyR1EvidenceBinding({ root, evidencePath: invalidPath, validationPath: invalidValidationPath, assignment: invalid.assignment, examUid: invalid.evidence.examUid, bank: [{ id: 1 }] }), /R1_META_PROOF_META_PASS_REQUIRED/);
    const missingValidation = { ...invalid.assignment, r1EvidenceSha256: invalid.assignment.r1EvidenceSha256, r1ValidationSha256: '0'.repeat(64) };
    assert.throws(() => verifyR1EvidenceBinding({ root, evidencePath: invalidPath, validationPath: invalidValidationPath, assignment: missingValidation, examUid: invalid.evidence.examUid, bank: [{ id: 1 }] }), /ASSIGNMENT_R1_VALIDATION_SHA256_MISMATCH/);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('accepts PASS_WITH_META_ONLY_DEBT only for an explicit approved template null-debt matching physical null', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'archive-r1-template-null-debt-'));
  try {
    const examUid = '22_테스트고_1학기_중간_고2_기하_기출';
    const evidencePath = 'archive/analysis/template-debt/R1.evidence.json';
    const validationPath = 'archive/analysis/template-debt/R1.validation.json';
    const reason = 'No active template fits this reviewed task; preserve explicit null projection debt.';
    const row = {
      verdict: 'PASS', metaDebtFields: ['templateKey'], metaDebtReason: reason,
      axisEvidence: { META: { status: 'PASS_WITH_META_ONLY_DEBT', physicalFieldCount: 17, templateKey: null, projectionStatus: 'TEMPLATE_UNMATERIALIZED', nullDebt: { fields: ['templateKey'], reason } } },
    };
    const fixture = writeR1Chain(root, { evidencePath, validationPath, examUid, row });
    const accepted = verifyR1EvidenceBinding({ root, evidencePath, validationPath, assignment: fixture.assignment, examUid, bank: [{ id: 1, templateKey: null }] });
    assert.equal(accepted.validation.disposition, 'PASS');
    assert.equal(accepted.evidence.rows[0].axisEvidence.META.status, 'PASS_WITH_META_ONLY_DEBT');
    for (const { badRow, badQuestion } of [
      { badRow: { ...row, metaDebtReason: '' }, badQuestion: { id: 1, templateKey: null } },
      { badRow: { ...row, axisEvidence: { META: { ...row.axisEvidence.META, nullDebt: { fields: ['templateKey'], reason: '' } } } }, badQuestion: { id: 1, templateKey: null } },
      { badRow: row, badQuestion: { id: 1, templateKey: 'TPL_UNREVIEWED' } },
      { badRow: { ...row, metaDebtFields: ['templateKey', 'problemTypeKey'] }, badQuestion: { id: 1, templateKey: null } },
    ]) {
      const invalid = writeR1Chain(root, { evidencePath, validationPath, examUid, row: badRow });
      assert.throws(() => verifyR1EvidenceBinding({ root, evidencePath, validationPath, assignment: invalid.assignment, examUid, bank: [badQuestion] }), /R1_META_PROOF_META_PASS_REQUIRED/);
    }
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});

test('admits only ROOT-bound Maesan q1 and q6-q9 PT/TPL projection debt while keeping source values and manual holds', () => {
  const root = process.cwd();
  const examUid = '23_매산여고_1학기_중간_고2_확률과통계';
  const evidencePath = `archive/analysis/h2-intake-batch01-20261009/${examUid}/R1.recovery.evidence.bound.json`;
  const validationPath = `archive/analysis/h2-intake-batch01-20261009/${examUid}/R1.recovery.generic-validator.raw.json`;
  const admissionPath = `archive/analysis/h2-intake-batch01-20261009/${examUid}/technical-registration/test-fixtures/r1-meta-citation-current-v1/ROOT.r1-meta-core-debt-admission.v3-current-citations.v1.json`;
  const admissionBytes = fs.readFileSync(path.join(root, admissionPath));
  const admission = JSON.parse(admissionBytes.toString('utf8'));
  const supplement = JSON.parse(fs.readFileSync(path.join(root, admission.metaCoreDebtSupplement.path), 'utf8'));
  const evidenceBytes = fs.readFileSync(path.join(root, evidencePath));
  const validationBytes = fs.readFileSync(path.join(root, validationPath));
  const evidence = JSON.parse(evidenceBytes.toString('utf8'));
  const validation = JSON.parse(validationBytes.toString('utf8'));
  const sourcePath = path.join(root, admission.scope.productionPath);
  const sourceContext = { window: {}, console: { log() {}, warn() {}, error() {} } };
  sourceContext.globalThis = sourceContext;
  vm.createContext(sourceContext);
  vm.runInContext(fs.readFileSync(sourcePath, 'utf8'), sourceContext);
  const bank = JSON.parse(JSON.stringify(sourceContext.window.questionBank));
  const assignment = {
    productionRelativePath: admission.scope.productionPath,
    artifactRawSha256: admission.scope.sourceRawSha256,
    validatorRawBufferBlobSha1: admission.scope.sourceGitBlobSha1,
    lockedRosterSha256: admission.scope.lockedRosterSha256,
    producerAuthorityPath: admission.rootAuthorityReference.path,
    producerAuthoritySha256: admission.rootAuthorityReference.sha256,
    r1EvidencePath: admission.r1Evidence.path,
    r1EvidenceSha256: admission.r1Evidence.sha256,
    r1ValidationPath: admission.r1Validation.path,
    r1ValidationSha256: admission.r1Validation.sha256,
    r1MetaCoreDebtAdmissionPath: admissionPath,
    r1MetaCoreDebtAdmissionSha256: crypto.createHash('sha256').update(admissionBytes).digest('hex'),
  };
  const bound = verifyR1EvidenceBinding({ root, evidencePath, validationPath, assignment, examUid, bank });
  assert.equal(bound.validation.disposition, 'PASS');
  assert.deepEqual(bound.metaDebtRows.map(row => row.qid), [1, 6, 7, 8, 9]);
  assert.equal(bound.metaDebtAdmission.path, admissionPath);

  const identities = bank.map((_, index) => ({ questionUid: `fixture-${index + 1}`, sourceOrdinal: index + 1, sourceQuestionNo: index + 1, sourceFingerprint: `fp-${index + 1}` }));
  const metadataRows = makeTargetMetadataRows({ sourceFile: admission.scope.productionPath.replace(/^archive\/exams\//, ''), bank, identityRows: identities, r1EvidencePath: evidencePath, r1MetaDebtRows: bound.metaDebtRows });
  for (const qid of [1, 6, 7, 8, 9]) {
    const source = bank[qid - 1], projected = metadataRows[qid - 1];
    assert.equal(projected.reviewStatus, 'manual_review');
    assert.equal(projected.metadataStatus, 'approved_partial_with_explicit_holds');
    assert.equal(projected.fieldStatus.problemType, 'manual_review_pending');
    assert.equal(projected.fieldStatus.template, 'manual_review_pending');
    assert.equal(projected.projectionStatus, source.projectionStatus);
    assert.deepEqual(projected.metaDebtFields, ['problemTypeKey', 'templateKey']);
    assert.equal(projected.problemTypeKey, source.problemTypeKey);
    assert.equal(projected.templateKey, source.templateKey);
  }
  assert.equal(metadataRows[0].problemTypeKey, null);
  assert.equal(metadataRows[0].templateKey, null);

  const ordinaryAssignment = { ...assignment };
  delete ordinaryAssignment.r1MetaCoreDebtAdmissionPath;
  delete ordinaryAssignment.r1MetaCoreDebtAdmissionSha256;
  assert.throws(() => verifyR1EvidenceBinding({ root, evidencePath, validationPath, assignment: ordinaryAssignment, examUid, bank }), /R1_META_PROOF_META_PASS_REQUIRED/);

  for (const mutate of [
    copy => { copy.scope.allowedQids = [1, 6, 7, 8]; },
    copy => { copy.r1Evidence.sha256 = '0'.repeat(64); },
    copy => { copy.metaCoreDebtSupplement.sha256 = '0'.repeat(64); },
    copy => { copy.admissionPolicy.rows[0].coreMetaAssessment.registeredL2Valid = false; },
    copy => { copy.admissionPolicy.rows[1].registeredL2.status = 'missing'; },
  ]) {
    const invalid = JSON.parse(JSON.stringify(admission));
    mutate(invalid);
    assert.throws(() => verifyR1MetaCoreDebtAdmission({ admission: invalid, evidence, assignment, examUid, bank, root }));
  }
  const badBank = JSON.parse(JSON.stringify(bank));
  badBank[0].standardUnitKey = 'H15-PS-99';
  assert.throws(() => verifyR1MetaCoreDebtAdmission({ admission, evidence, assignment, examUid, bank: badBank, root }), /R1_META_CORE_ADMISSION_SUPPLEMENT_CORE_MISMATCH/);
  const otherUnresolved = JSON.parse(JSON.stringify(evidence));
  otherUnresolved.rows[1].metaReview.status = 'META_ONLY_UNRESOLVED';
  assert.throws(() => verifyR1MetaCoreDebtAdmission({ admission, evidence: otherUnresolved, assignment, examUid, bank, root }), /R1_META_CORE_ADMISSION_SCOPE_EXPANSION_REJECTED/);
  const wrongContract = JSON.parse(JSON.stringify(evidence));
  wrongContract.qualityContractVersion = 'LEGACY';
  assert.throws(() => verifyR1MetaCoreDebtAdmission({ admission, evidence: wrongContract, assignment, examUid, bank, root }), /R1_META_CORE_ADMISSION_R1_CONTRACT_INVALID/);

  const temporaryAuthorityRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'archive-r1-live-meta-authority-'));
  try {
    const proofReferences = [admission.rootAuthorityReference, admission.metaCoreDebtSupplement, ...supplement.citationFiles];
    for (const ref of proofReferences) {
      const source = path.join(root, ...ref.path.split('/'));
      const target = path.join(temporaryAuthorityRoot, ...ref.path.split('/'));
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.copyFileSync(source, target);
    }
    assert.equal(verifyR1MetaCoreDebtAdmission({ admission, evidence, assignment, examUid, bank, root: temporaryAuthorityRoot }).length, 5);
    const changedAuthorityPath = path.join(temporaryAuthorityRoot, ...supplement.citationFiles[5].path.split('/'));
    fs.appendFileSync(changedAuthorityPath, '\nchanged after supplement freeze\n');
    assert.throws(() => verifyR1MetaCoreDebtAdmission({ admission, evidence, assignment, examUid, bank, root: temporaryAuthorityRoot }), /R1_META_CORE_ADMISSION_LIVE_CITATION_SHA256_MISMATCH/);
  } finally { fs.rmSync(temporaryAuthorityRoot, { recursive: true, force: true }); }
});

test('serializes a reuse R1 proof without assuming the optional Meta-debt row list exists', () => {
  const summary = serializeR1MetaProofSummary({
    relative: 'archive/analysis/reuse/R1.evidence.json',
    evidenceSha256: 'a'.repeat(64),
    evidenceCleanLfSha256: 'b'.repeat(64),
    validationRelative: 'archive/analysis/reuse/R1.validation.json',
    validationSha256: 'c'.repeat(64),
    validation: { validatorMode: 'R1_V2', disposition: 'PASS' },
  }, { artifactSha: 'd'.repeat(40), artifactRawSha256: 'e'.repeat(64), artifactRawBufferBlobSha1: 'd'.repeat(40), rows: [{ qid: 1 }] });
  assert.equal(summary.allMetaAxesPass, true);
  assert.equal(Object.hasOwn(summary, 'metaDebtQids'), false);
  assert.doesNotThrow(() => JSON.stringify(summary));
});

test('accepts PASS_AFTER_ITEM_RECOVERY only with cleared source status, fresh scoped R1/R2 proof, and active current artifact PASS', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'archive-r1-item-recovery-'));
  try {
    const fixture = writeItemRecoveryR1Chain(root);
    const bound = verifyR1EvidenceBinding({ root, evidencePath: fixture.evidencePath, validationPath: fixture.validationPath, assignment: fixture.assignment, examUid: fixture.evidence.examUid, bank: fixture.bank });
    assert.equal(bound.validation.disposition, 'PASS');
    assert.equal(bound.validation.artifactContract.active, true);
    assert.equal(bound.evidence.rows[17].verdict, 'PASS_AFTER_ITEM_RECOVERY');
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});

test('accepts a physically cleared q18 whose source marker was removed, only with exact scoped closure proof', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'archive-r1-item-recovery-removed-marker-'));
  try {
    const fixture = writeItemRecoveryR1Chain(root, { q18SourceItemStatusPresent: false });
    const bound = verifyR1EvidenceBinding({ root, evidencePath: fixture.evidencePath, validationPath: fixture.validationPath, assignment: fixture.assignment, examUid: fixture.evidence.examUid, bank: fixture.bank });
    assert.equal(Object.hasOwn(fixture.bank[17], 'itemStatus'), false);
    assert.equal(bound.validation.disposition, 'PASS');
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});

test('requires explicit physical-clear closure evidence when the source itemStatus marker is absent', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'archive-r1-item-recovery-clear-proof-'));
  try {
    const fixture = writeItemRecoveryR1Chain(root, { q18SourceItemStatusPresent: false });
    const row = fixture.evidence.rows[17];
    const recoveryRef = row.provenanceEvidence.authorizedReplacement.itemRecoveryEvidence;
    const recoveryAbs = path.join(root, ...recoveryRef.path.split('/'));
    const recovery = JSON.parse(fs.readFileSync(recoveryAbs, 'utf8'));
    recovery.reviewStatus.physicalItemStatus = 'HOLD';
    const bytes = Buffer.from(JSON.stringify(recovery)); fs.writeFileSync(recoveryAbs, bytes);
    recoveryRef.sha256 = crypto.createHash('sha256').update(bytes).digest('hex');
    const evidenceAbs = path.join(root, ...fixture.evidencePath.split('/'));
    const evidenceBytes = Buffer.from(JSON.stringify(fixture.evidence)); fs.writeFileSync(evidenceAbs, evidenceBytes);
    fixture.assignment.r1EvidenceSha256 = crypto.createHash('sha256').update(evidenceBytes).digest('hex');
    assert.throws(() => verifyR1EvidenceBinding({ root, evidencePath: fixture.evidencePath, validationPath: fixture.validationPath, assignment: fixture.assignment, examUid: fixture.evidence.examUid, bank: fixture.bank }), /R1_ITEM_RECOVERY_CLOSED_EVIDENCE_CLEAR_PROOF_REQUIRED/);
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});

test('rejects a two-step clear chain when any original-map non-target hash differs from current parsed objects', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'archive-r1-item-recovery-two-step-invariant-'));
  try {
    const fixture = writeItemRecoveryR1Chain(root, { q18SourceItemStatusPresent: false });
    const row = fixture.evidence.rows[17];
    const invariantRef = row.provenanceEvidence.authorizedReplacement.nonTargetInvariant;
    const invariantAbs = path.join(root, ...invariantRef.path.split('/'));
    const invariant = JSON.parse(fs.readFileSync(invariantAbs, 'utf8'));
    invariant.nonTargetParsedObjectSha256['1'] = 'f'.repeat(64);
    const invariantBytes = Buffer.from(JSON.stringify(invariant)); fs.writeFileSync(invariantAbs, invariantBytes);
    invariantRef.sha256 = crypto.createHash('sha256').update(invariantBytes).digest('hex');
    const evidenceAbs = path.join(root, ...fixture.evidencePath.split('/'));
    const evidenceBytes = Buffer.from(JSON.stringify(fixture.evidence)); fs.writeFileSync(evidenceAbs, evidenceBytes);
    fixture.assignment.r1EvidenceSha256 = crypto.createHash('sha256').update(evidenceBytes).digest('hex');
    assert.throws(() => verifyR1EvidenceBinding({ root, evidencePath: fixture.evidencePath, validationPath: fixture.validationPath, assignment: fixture.assignment, examUid: fixture.evidence.examUid, bank: fixture.bank }), /R1_ITEM_RECOVERY_HOLD_CLEAR_NON_TARGET_OBJECTS_CHANGED/);
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});

test('rejects item-recovery PASS when q18 still HOLD, META fails, R2 does not MATCH, or artifact PASS is absent', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'archive-r1-item-recovery-reject-'));
  try {
    const reject = ({ q18ItemStatus, q18MetaStatus, verdict, r2Disposition, artifactDisposition, artifactActive }) => {
      const fixture = writeItemRecoveryR1Chain(root, { q18ItemStatus, q18MetaStatus, verdict });
      if (r2Disposition) {
        const q18 = fixture.evidence.rows[17]; q18.provenanceEvidence.freshScopeReviews.r2.comparison.disposition = r2Disposition;
      }
      if (r2Disposition || q18ItemStatus || q18MetaStatus || verdict || artifactDisposition || artifactActive !== undefined) {
        const evidenceFile = path.join(root, ...fixture.evidencePath.split('/'));
        const bytes = Buffer.from(JSON.stringify(fixture.evidence)); fs.writeFileSync(evidenceFile, bytes);
        fixture.assignment.r1EvidenceSha256 = crypto.createHash('sha256').update(bytes).digest('hex');
        const report = JSON.parse(fs.readFileSync(path.join(root, ...fixture.validationPath.split('/')), 'utf8'));
        report.artifactSha = fixture.assignment.validatorRawBufferBlobSha1;
        if (artifactDisposition) report.artifactContract.disposition = artifactDisposition;
        if (artifactActive === false) report.artifactContract.active = false;
        const validationBytes = Buffer.from(JSON.stringify(report)); fs.writeFileSync(path.join(root, ...fixture.validationPath.split('/')), validationBytes);
        fixture.assignment.r1ValidationSha256 = crypto.createHash('sha256').update(validationBytes).digest('hex');
      }
      assert.throws(() => verifyR1EvidenceBinding({ root, evidencePath: fixture.evidencePath, validationPath: fixture.validationPath, assignment: fixture.assignment, examUid: fixture.evidence.examUid, bank: fixture.bank }));
    };
    reject({ q18ItemStatus: 'HOLD' });
    reject({ q18ItemStatus: 'PENDING' });
    reject({ q18MetaStatus: 'HOLD' });
    reject({ r2Disposition: 'MISMATCH' });
    reject({ artifactDisposition: 'FAIL' });
    reject({ artifactActive: false });
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});

function writeJson(root, relative, value) {
  const file = path.join(root, ...relative.split('/'));
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const bytes = Buffer.from(JSON.stringify(value));
  fs.writeFileSync(file, bytes);
  return { file, sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
}

test('accepts an authorized historical R1 proof only through current R3 and MAIN_DONE reuse chain', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'archive-r1-reuse-chain-'));
  try {
    const runId = 'archive2-h2-math2-geometry-20261007';
    const examUid = '20_매산고_2학기_기말_고2_수학II';
    const productionPath = 'archive/exams/original/high/h2/2final/20_매산고_2학기_기말_고2_수학II.js';
    const oldArtifactSha = 'b'.repeat(40);
    const qids = [1];
    const historicalR1Path = `archive/analysis/qualification-20261006/${examUid}/R1.evidence.json`;
    const historicalR1ValidationPath = `archive/analysis/qualification-20261006/${examUid}/R1.validation.json`;
    const currentR3ValidationPath = `archive/analysis/qualification-20261006/${examUid}/R3.validation.json`;
    const currentR3EvidencePath = `archive/analysis/qualification-20261006/${examUid}/R3.evidence.json`;
    const currentR3AdjudicationPath = `archive/analysis/qualification-20261006/${examUid}/R3.render-repair-adjudication.json`;
    const reuseAssessmentPath = `archive/analysis/${examUid}/codex-${runId}/R3-reuse-assessment.json`;
    const mainDonePath = `archive/analysis/${examUid}/codex-${runId}/ROOT.MAIN_DONE.reuse-receipt.current-closeout.json`;
    const mainDoneIntakePath = `archive/analysis/${examUid}/codex-${runId}/ROOT.MAIN_DONE.reuse-intake.json`;
    const renderPath = `archive/analysis/${examUid}/codex-${runId}/ROOT.render-receipt.raw-ref-compat.json`;
    const loadedJsPath = `archive/analysis/${examUid}/codex-${runId}/loaded.js`;
    const renderValidationPath = `archive/analysis/${examUid}/codex-${runId}/R3.render-validation.json`;
    const capturePath = `archive/analysis/${examUid}/codex-${runId}/capture.png`;
    const loadedJs = Buffer.from('window.questionBank = [{id: 1}];');
    const currentArtifactSha = crypto.createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${loadedJs.length}\0`), loadedJs])).digest('hex');
    const currentRawSha = crypto.createHash('sha256').update(loadedJs).digest('hex');
    const loadedJsFile = path.join(root, ...loadedJsPath.split('/'));
    fs.mkdirSync(path.dirname(loadedJsFile), { recursive: true }); fs.writeFileSync(loadedJsFile, loadedJs);
    const captureFile = path.join(root, ...capturePath.split('/'));
    fs.writeFileSync(captureFile, Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
    const r1 = {
      schemaVersion: 'JS_ARCHIVE_STAGE_EVIDENCE_v2', qualityContractVersion: 'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',
      executionLine: 'CODEX', stage: 'R1', examUid, artifactSha: oldArtifactSha, currentArtifact: { fileSha256: 'e'.repeat(64) },
      rows: [{ qid: 1, independentAnswer: 'x', independentAnswerFrozenBeforeStoredAnswer: true, storedAnswer: 'x', compareResult: 'MATCH', verdict: 'PASS_AFTER_REPAIR', axisEvidence: { meta: { status: 'PASS_AFTER_RECHECK' } } }],
    };
    const r1File = writeJson(root, historicalR1Path, r1);
    const r1CleanLfSha = crypto.createHash('sha256').update(Buffer.from(JSON.stringify(r1), 'utf8')).digest('hex');
    const r1Validation = { ok: true, validatorMode: 'R1_V2', stage: 'R1', examUid, artifactSha: oldArtifactSha,
      evidenceRef: path.join(root, ...historicalR1Path.split('/')), evidenceSha256: r1CleanLfSha, denominator: 1, rowCount: 1, disposition: 'PASS', issues: [] };
    const r1ValidationFile = writeJson(root, historicalR1ValidationPath, r1Validation);
    const r3Validation = { ok: true, validatorMode: 'R3_V2', stage: 'R3', examUid, artifactSha: currentArtifactSha,
      questionCount: 1, scopeCount: 1, rowCount: 1, evidenceRef: path.join(root, ...currentR3EvidencePath.split('/')), disposition: 'PASS', issues: [],
      qualityContractVersion: 'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006', executionLine: 'CODEX', artifactContract: { active: true } };
    const r3ValidationFile = writeJson(root, currentR3ValidationPath, r3Validation);
    const r3Evidence = { schemaVersion: 'JS_ARCHIVE_STAGE_EVIDENCE_v2', stage: 'R3', examUid, artifactSha: currentArtifactSha,
      upstreamSeals: { r1: { artifactSha: oldArtifactSha, sha256: r1CleanLfSha } },
      artifactDispositions: { artifactSha: currentArtifactSha, rows: [{ qid: 1, artifactSha: currentArtifactSha, metaDisposition: 'PASS_AFTER_RECHECK' }] }, rows: [] };
    const r3EvidenceFile = writeJson(root, currentR3EvidencePath, r3Evidence);
    const r3AdjudicationFile = writeJson(root, currentR3AdjudicationPath, { stage: 'R3', examUid, finalArtifactSha: currentArtifactSha, changedFields: [{ qid: 1, field: 'solution' }] });
    const renderValidationFile = writeJson(root, renderValidationPath, r3Validation);
    const renderReceipt = { qualityContractVersion: 'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006', executionLine: 'CODEX', status: 'RENDER_PASS', artifactSha: currentArtifactSha, qids,
      loadedJs: { path: loadedJsPath, sha256: crypto.createHash('sha256').update(loadedJs).digest('hex') },
      r3Validation: { path: renderValidationPath, sha256: renderValidationFile.sha256 }, assets: [],
      cases: ['exam/desktop','exam/mobile','sol/desktop','sol/mobile','ans/desktop','ans/mobile'].map(id => ({ id, status: 'PASS', viewport: { width: id.endsWith('mobile') ? 390 : 1200, height: 800 },
        captures: [{ image: { path: capturePath, sha256: crypto.createHash('sha256').update(fs.readFileSync(captureFile)).digest('hex') }, qids }], loadedAssets: [], mathJaxStatus: 'PASS', layoutReviewStatus: 'PASS', assetDecodeStatus: 'PASS' })) };
    const renderFile = writeJson(root, renderPath, renderReceipt);
    const originalMainDonePath = `archive/analysis/qualification-20261006/${examUid}/MAIN_DONE.receipt.json`;
    const originalMainDoneFile = writeJson(root, originalMainDonePath, { status: 'MAIN_DONE', artifactSha: currentArtifactSha, productionPath });
    const mainDoneFile = writeJson(root, mainDonePath, { qualityContractVersion: 'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006', executionLine: 'CODEX', status: 'MAIN_DONE',
      artifactSha: currentArtifactSha, productionPath, remoteMainSha: 'f'.repeat(40), renderReceipt: { path: renderPath, sha256: renderFile.sha256 },
      originalMainDoneReceipt: { path: originalMainDonePath, sha256: originalMainDoneFile.sha256 } });
    const intakeFile = writeJson(root, mainDoneIntakePath, { ok: true, disposition: 'PASS', issues: [] });
    const reuseAssessmentFile = writeJson(root, reuseAssessmentPath, { assessment: 'REUSE_ELIGIBLE_EXISTING_MAIN_DONE',
      validatorDisposition: { disposition: 'PASS_REUSED', issues: [] }, currentArtifact: { rawSha256: currentRawSha, gitBlobSha1: currentArtifactSha },
      r3Validation: { ok: true, artifactSha: currentArtifactSha, questionCount: 1 }, mainDone: { status: 'MAIN_DONE', artifactSha: currentArtifactSha } });
    const manifestRow = { index: 3, examUid, productionPath, reuse: true, metaSemanticsUnchangedConfirmed: true,
      historicalR1Evidence: historicalR1Path, historicalR1Validation: historicalR1ValidationPath, currentR3Validation: currentR3ValidationPath,
      currentR3Evidence: currentR3EvidencePath, currentR3Adjudication: currentR3AdjudicationPath, reuseAssessment: reuseAssessmentPath, mainDoneReceipt: mainDonePath };
    const manifestPath = 'archive/analysis/run/ROOT.current-registration-r1-path-manifest.json';
    const manifestFile = writeJson(root, manifestPath, { schemaVersion: 'ROOT_CURRENT_VALID_R1_REGISTRATION_PATHS_V1', status: 'ACTUAL_VALIDATED_PROOFS_REFERENCED_NO_SEMANTIC_PROMOTION', runId, rows: [null,null,null,manifestRow] });
    const proofFiles = [reuseAssessmentFile, mainDoneFile, r1File, r1ValidationFile, r3ValidationFile, r3EvidenceFile, r3AdjudicationFile, originalMainDoneFile, renderFile, intakeFile];
    const proofHashes = Object.fromEntries(proofFiles.map(file => [path.relative(root, file.file).split(path.sep).join('/'), file.sha256]));
    const assignment = { runId, artifactRawSha256: currentRawSha, validatorRawBufferBlobSha1: currentArtifactSha,
      r1ReuseManifestPath: manifestPath, r1ReuseManifestSha256: manifestFile.sha256, r1ReuseProofSha256ByPath: proofHashes };
    const bound = verifyR1ReuseBinding({ root, manifestPath, assignment, examUid, rosterIndex: 3, productionPath, bank: [{ id: 1 }] });
    assert.equal(bound.evidence.artifactSha, oldArtifactSha);
    assert.notEqual(bound.evidence.artifactSha, currentArtifactSha);
    assert.equal(bound.reuse.metaSemanticsUnchangedConfirmed, true);
    assert.equal(bound.reuse.renderDisposition, 'PASS');
    const changedManifest = { schemaVersion: 'ROOT_CURRENT_VALID_R1_REGISTRATION_PATHS_V1', status: 'ACTUAL_VALIDATED_PROOFS_REFERENCED_NO_SEMANTIC_PROMOTION', runId,
      rows: [null,null,null,{ ...manifestRow, metaSemanticsUnchangedConfirmed: false }] };
    const badManifestPath = 'archive/analysis/run/bad-reuse-manifest.json';
    writeJson(root, badManifestPath, changedManifest);
    assert.throws(() => verifyR1ReuseBinding({ root, manifestPath: badManifestPath,
      assignment: { ...assignment, r1ReuseManifestPath: badManifestPath, r1ReuseManifestSha256: crypto.createHash('sha256').update(JSON.stringify(changedManifest)).digest('hex') },
      examUid, rosterIndex: 3, productionPath, bank: [{ id: 1 }] }), /R1_REUSE_SCOPE_OR_META_INVARIANCE_REQUIRED/);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('rejects R1 evidence paths that escape the trusted workspace', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'archive-r1-binding-root-'));
  try {
    assert.throws(() => verifyR1EvidenceBinding({ root, evidencePath: '../outside.json', validationPath: 'validation.json', assignment: {}, examUid, bank: [{ id: 1 }] }), /R1_EVIDENCE_PATH_OUTSIDE_ROOT/);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
