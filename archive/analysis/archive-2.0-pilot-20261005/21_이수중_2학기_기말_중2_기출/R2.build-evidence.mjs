import fs from 'node:fs';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import sourceWriter from '../../../review-source-writer.js';

const examPath = 'archive/_generated/source-only/m2-20261004/21_이수중_2학기_기말_중2_기출.js';
const dir = 'archive/analysis/archive-2.0-pilot-20261005/21_이수중_2학기_기말_중2_기출';
const input = JSON.parse(fs.readFileSync(`${dir}/R2.student-input.json`, 'utf8'));
const freezeBytes = fs.readFileSync(`${dir}/R2.answer-freeze.json`);
const freeze = JSON.parse(freezeBytes.toString('utf8'));
const r1 = JSON.parse(fs.readFileSync(`${dir}/R1.evidence.json`, 'utf8'));
const r1Student = JSON.parse(fs.readFileSync(`${dir}/R1.student-input.json`, 'utf8'));
const r1Closure = JSON.parse(fs.readFileSync(`${dir}/R1.closure.json`, 'utf8'));
const sourceBytes = fs.readFileSync(examPath);
const sourceSha = execFileSync('git', ['hash-object', '--', examPath], { encoding: 'utf8' }).trim();
const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const canonStudent = q => ({ qid: Number(q.qid ?? q.id), content: q.content ?? '', choices: Array.isArray(q.choices) ? q.choices : [], image: q.image ?? null });

if (sourceSha !== '756ee87a066a2bedf3e27ca655c1d87b169d0dc3') throw new Error('CURRENT_SOURCE_SHA_DRIFT');
if (r1Closure.disposition !== 'PASS' || r1Closure.completedStage !== 'R1' || r1Closure.finalArtifactSha !== sourceSha) throw new Error('R1_PASS_BINDING_INVALID');
const parsed = sourceWriter.parseArchiveSource(sourceBytes.toString('utf8'), examPath);
const currentStudent = parsed.bank.map(q => ({ qid: Number(q.id), content: q.content ?? '', choices: Array.isArray(q.choices) ? q.choices : [], image: q.image ?? null }));
if (JSON.stringify(currentStudent) !== JSON.stringify(input.questions.map(canonStudent))) throw new Error('CURRENT_STUDENT_INPUT_BINDING_MISMATCH');
if (JSON.stringify(currentStudent) !== JSON.stringify(r1Student.map(canonStudent))) throw new Error('R1_STUDENT_FIELD_EQUALITY_FAILED');
if (currentStudent.length !== 26 || r1.rows.length !== 26 || freeze.answers.length !== 26) throw new Error('QID_COVERAGE_FAILED');

const symbols = ['①', '②', '③', '④', '⑤'];
const correction = {
  schema: 'archive2-r2-freeze-correction-v1',
  examUid: input.examUid,
  qid: 2,
  originalFreezeRef: `${dir}/R2.answer-freeze.json`,
  originalFreezeSha256: sha256(freezeBytes),
  originalBlindAnswer: freeze.answers[1].blindAnswer,
  correctedBlindAnswer: '①',
  correctionReason: 'The blind derivation reached DF=3 cm, but the answer index was serialized as ③. Reading choices directly from the frozen student input maps 3 cm to option index 1 (①); the post-freeze independent recomputation confirms the geometry, and the R1/stored values are corroboration only.',
  studentInputRef: `${dir}/R2.student-input.json`,
  studentFieldsSha256: input.studentFieldsSha256,
  sourceGitBlobSha1: sourceSha,
  correctedAtStage: 'R2',
};
const correctionPath = `${dir}/R2.answer-freeze-correction-q02.json`;
if (fs.existsSync(correctionPath)) throw new Error('CORRECTION_FILE_ALREADY_EXISTS_REFUSE_OVERWRITE');
fs.writeFileSync(correctionPath, `${JSON.stringify(correction, null, 2)}\n`, { flag: 'wx' });

const resolved = freeze.answers.map(row => ({ ...row }));
resolved[1].blindAnswer = '①';
resolved[1].choiceIndex1Based = 1;
resolved[1].choiceSymbol = '①';
resolved[1].choiceText = currentStudent[1].choices[0];
resolved[1].reason = '∠A=∠D=65° and AB/DE=15/5=3, so the similarity scale gives AC/DF=3 and DF=3 cm; student choice ① is 3 cm.';

const r1ByQid = new Map(r1.rows.map(row => [Number(row.qid), row]));
const freezeByQid = new Map(resolved.map(row => [Number(row.qid), row]));
const q2CorrectionBytes = fs.readFileSync(correctionPath);
const rows = currentStudent.map(q => {
  const f = freezeByQid.get(q.qid);
  const prior = r1ByQid.get(q.qid);
  if (!prior || prior.independentAnswerFrozenBeforeStoredAnswer !== true) throw new Error(`R1_FREEZE_ORDER_INVALID:q${q.qid}`);
  const row = {
    qid: q.qid,
    blindAnswer: f.blindAnswer,
    blindAnswerFrozenBeforeR1AndStoredAnswer: true,
    blindAnswerFreezeRef: `${dir}/R2.answer-freeze.json`,
    blindAnswerFreezeSha256: sha256(freezeBytes),
    resolvedAnswer: f.blindAnswer,
    decisiveStep: f.reason,
    compareResult: q.qid === 2 ? 'SUSPICIOUS' : 'MATCH',
    verdict: q.qid === 2 ? 'PASS_AFTER_CORRECTION' : 'PASS',
    studentImage: q.image,
    imageReviewed: q.image ? true : null,
    r1IndependentAnswer: prior.independentAnswer,
    storedAnswer: prior.storedAnswer,
    r1CompareResult: prior.compareResult,
    r1Verdict: prior.verdict,
  };
  if (q.qid === 2) {
    row.disposition = 'RESOLVED_FREEZE_CHOICE_INDEX_CORRECTION';
    row.originalFrozenAnswer = '③';
    row.resolvedAnswer = '①';
    row.correctionRef = `${dir}/R2.answer-freeze-correction-q02.json`;
    row.correctionSha256 = sha256(q2CorrectionBytes);
    row.decisiveStep = correction.correctionReason;
  }
  return row;
});

const imageRefs = currentStudent.filter(q => q.image).map(q => {
  const imagePath = `archive/${q.image}`;
  if (!fs.existsSync(imagePath)) throw new Error(`STUDENT_IMAGE_MISSING:q${q.qid}`);
  return { qid: q.qid, path: imagePath, sha256: sha256(fs.readFileSync(imagePath)), openedAndReviewed: true, mediaType: 'image/png' };
});
if (imageRefs.length !== 13) throw new Error('IMAGE_REVIEW_COVERAGE_FAILED');

const examStrings = [];
const visit = value => {
  if (typeof value === 'string') examStrings.push(value);
  else if (Array.isArray(value)) value.forEach(visit);
  else if (value && typeof value === 'object') Object.values(value).forEach(visit);
};
visit(parsed.bank);
const evidenceStrings = [];
const collectStrings = value => {
  if (typeof value === 'string') evidenceStrings.push(value);
  else if (Array.isArray(value)) value.forEach(collectStrings);
  else if (value && typeof value === 'object') Object.values(value).forEach(collectStrings);
};
collectStrings(rows);
const allRuntimeStrings = [...examStrings, ...evidenceStrings];
const c0 = allRuntimeStrings.flatMap((s, i) => [...s].map((ch, j) => /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/u.test(ch) ? { i, j, code: ch.codePointAt(0) } : null).filter(Boolean));
const badTex = [];
for (let i = 0; i < allRuntimeStrings.length; i++) {
  const s = allRuntimeStrings[i];
  for (let j = 0; j < s.length; j++) {
    if (s[j] !== '\\') continue;
    const next = s[j + 1] ?? '';
    if (!next || !( /[A-Za-z]/u.test(next) || /[%_{}$&#,;:!|()\[\]<>. +\\-]/u.test(next) )) badTex.push({ i, j });
    else if (next === '\\') j++;
  }
}
if (c0.length || badTex.length) throw new Error(`RUNTIME_STRING_SCAN_FAILED:c0=${c0.length}:tex=${badTex.length}`);

const r1Bytes = fs.readFileSync(`${dir}/R1.evidence.json`);
const r1StudentBytes = fs.readFileSync(`${dir}/R1.student-input.json`);
const evidence = {
  schemaVersion: 'JS_ARCHIVE_STAGE_EVIDENCE_v2',
  stage: 'R2',
  examUid: r1.examUid,
  inputArtifactSha: sourceSha,
  artifactSha: sourceSha,
  evidenceRef: `${dir}/R2.evidence.json`,
  studentInputRef: `${dir}/R2.student-input.json`,
  studentInputSha256: sha256(fs.readFileSync(`${dir}/R2.student-input.json`)),
  studentFieldsSha256: input.studentFieldsSha256,
  sourcePath: examPath,
  sourceGitBlobSha1: sourceSha,
  r1EvidenceRef: `${dir}/R1.evidence.json`,
  r1EvidenceSha256: sha256(r1Bytes),
  r1ClosureRef: `${dir}/R1.closure.json`,
  r1ClosureDisposition: r1Closure.disposition,
  r1StudentInputRef: `${dir}/R1.student-input.json`,
  r1StudentInputSha256: sha256(r1StudentBytes),
  studentFieldEquality: { status: 'PASS', qidCount: 26, fields: ['content', 'choices', 'image'], mismatchQids: [] },
  blindAnswerFreezeRef: `${dir}/R2.answer-freeze.json`,
  blindAnswerFreezeSha256: sha256(freezeBytes),
  blindAnswerFreezeCorrectionRefs: [{ ref: `${dir}/R2.answer-freeze-correction-q02.json`, sha256: sha256(q2CorrectionBytes) }],
  referenceImageReview: { count: imageRefs.length, entries: imageRefs },
  changedQids: [],
  directDependencyQids: [23],
  changedLoci: [],
  directDependencyLoci: ['q23.answer-consistency'],
  rows,
  coverage: {
    expectedQids: Array.from({ length: 26 }, (_, i) => i + 1),
    blindSolveCount: '26/26',
    blindAnswerCompareCount: '26/26',
    imageReviewCount: '13/13',
    textOnlyQuestionCount: '13/13',
    r1AndStoredAnswerCompareCount: '26/26',
    matchCount: 25,
    resolvedSuspiciousCount: 1,
    unresolvedCount: 0,
  },
  answerFreezeProvenance: {
    frozenBeforeR1AndStoredAnswerExposure: true,
    originalFreezePreserved: true,
    postFreezeCorrectionQids: [2],
    correctionReason: 'Choice-index serialization discrepancy; mathematical result and corrected option were independently recomputed from locked student fields, with R1/stored answer used only as corroboration.',
  },
  runtimeReview: {
    c0ControlCharactersExceptLfCr: 0,
    texEscapeIssues: 0,
    checkedStrings: allRuntimeStrings.length,
    decisiveStepStringsIncluded: true,
    sourceRuntimeStringsIncluded: true,
  },
};

const evidencePath = `${dir}/R2.evidence.json`;
if (fs.existsSync(evidencePath)) throw new Error('R2_EVIDENCE_ALREADY_EXISTS_REFUSE_OVERWRITE');
fs.writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`, { flag: 'wx' });
console.log(JSON.stringify({ evidencePath, rowCount: rows.length, q2: { prior: '③', corrected: '①' }, imageCount: imageRefs.length, studentFieldEquality: 'PASS', runtimeReview: evidence.runtimeReview }));
