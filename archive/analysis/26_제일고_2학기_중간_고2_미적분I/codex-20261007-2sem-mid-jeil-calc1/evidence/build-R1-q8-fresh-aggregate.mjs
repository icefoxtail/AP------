import fs from 'node:fs';
import crypto from 'node:crypto';
import vm from 'node:vm';
const root = String.raw`C:\Users\USER\.codex\worktrees\archive-exam-import-2026-2mid\AP------`;
const candidate = String.raw`C:\Users\USER\.codex\worktrees\archive-exam-import-2026-2mid\AP------\.tmp\archive\codex-20261007-2sem-mid-jeil-calc1\26_제일고_2학기_중간_고2_미적분I\candidate\26_제일고_2학기_중간_고2_미적분I.js`;
const studentBundle = String.raw`C:\Users\USER\.codex\worktrees\archive-exam-import-2026-2mid\AP------\archive\analysis\26_제일고_2학기_중간_고2_미적분I\codex-20261007-2sem-mid-jeil-calc1\handoff\R1-R2.student-only-q8-fresh.json`;
const freezeFile = String.raw`C:\Users\USER\.codex\worktrees\archive-exam-import-2026-2mid\AP------\archive\analysis\26_제일고_2학기_중간_고2_미적분I\codex-20261007-2sem-mid-jeil-calc1\evidence\R1-q8-fresh-answer-freeze.json`;
const priorEvidenceFile = String.raw`C:\Users\USER\.codex\worktrees\archive-exam-import-2026-2mid\AP------\archive\analysis\26_제일고_2학기_중간_고2_미적분I\codex-20261007-2sem-mid-jeil-calc1\evidence\R1-evidence.json`;
const outputEvidence = String.raw`C:\Users\USER\.codex\worktrees\archive-exam-import-2026-2mid\AP------\archive\analysis\26_제일고_2학기_중간_고2_미적분I\codex-20261007-2sem-mid-jeil-calc1\evidence\R1-evidence.q8-fresh-aggregate.json`;
const compareFile = String.raw`C:\Users\USER\.codex\worktrees\archive-exam-import-2026-2mid\AP------\archive\analysis\26_제일고_2학기_중간_고2_미적분I\codex-20261007-2sem-mid-jeil-calc1\evidence\R1-q8-postfreeze-comparison.json`;
const expectedRaw = '5024ab6365b997669b47edfa0985900d8adfef50db7523ef9f6924787585198c';
const expectedBlob = '04bc995405be6c58a2336dd0ba49d2efd87c32de';
const expectedBundle = 'e81888dc8d0331c248d74b13e4a02b9dbdf0578ac99752f961463681ed795b1a';
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const candidateBytes = fs.readFileSync(candidate);
if (sha(candidateBytes) !== expectedRaw) throw new Error('CANDIDATE_RAW_SHA_MISMATCH');
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(candidateBytes.toString('utf8'), sandbox, { filename: candidate, timeout: 5000 });
const allQuestions = sandbox.window.questionBank || sandbox.window.questions;
if (!Array.isArray(allQuestions)) throw new Error('QUESTION_BANK_REQUIRED');
const matches = allQuestions.filter(q => Number(q?.id) === 8);
if (matches.length !== 1) throw new Error(`Q8_CARDINALITY:${matches.length}`);
const q = matches[0];
const bundle = JSON.parse(fs.readFileSync(studentBundle, 'utf8'));
const bundleBytes = fs.readFileSync(studentBundle);
if (sha(bundleBytes) !== expectedBundle) throw new Error('STUDENT_BUNDLE_SHA_MISMATCH');
if (bundle.items?.length !== 1 || Number(bundle.items[0]?.id) !== 8) throw new Error('BUNDLE_QID_SCOPE_INVALID');
const student = bundle.items[0];
const parity = {
  content: q.content === student.content,
  choices: JSON.stringify(q.choices) === JSON.stringify(student.choices),
  image: (q.image ?? null) === (student.image ?? null),
  assetSha: (student.assetSha ?? null) === null,
  visualRequiredNone: bundle.verification?.requiredQ8Visual === 'NONE'
};
if (Object.values(parity).some(v => v !== true)) throw new Error(`Q8_STUDENT_PARITY_FAIL:${JSON.stringify(parity)}`);
const freeze = JSON.parse(fs.readFileSync(freezeFile, 'utf8'));
if (freeze.qid !== 8 || freeze.sourceArtifactRawSha256 !== expectedRaw || freeze.studentBundleSha256 !== expectedBundle) throw new Error('FREEZE_BINDING_INVALID');
const answerIndex = Number(freeze.independentAnswer?.choiceIndex);
const selectedChoice = q.choices?.[answerIndex - 1];
const storedAnswer = String(q.answer ?? '').trim();
const answerDisplay = ['①','②','③','④','⑤'][answerIndex-1];
if (answerIndex !== 3 || storedAnswer !== answerDisplay || selectedChoice !== '$(2,3)$') throw new Error('Q8_ANSWER_COMPARE_MISMATCH');
const solutionSha256 = sha(Buffer.from(String(q.solution ?? ''), 'utf8'));
const meta = Object.fromEntries(Object.entries(q).filter(([k]) => /^(level|category|originalCategory|standardCourse|standardUnitKey|standardUnit|standardUnitOrder|questionType|layoutTag|tags|wide|subUnitKey|subUnit|subUnitConfidence|subUnitClassificationDepth|problemTypeKey|templateKey|crossConceptKeys|conditionKeys|integrationPattern|difficultyBucket|difficultyConfidence|difficultyBoundaryFlag|legacyLevelCompatibility)$/.test(k)));
const metaSha256 = sha(Buffer.from(JSON.stringify(meta), 'utf8'));
const comparison = {
  schemaVersion: 'JS_ARCHIVE_R1_QID_LIMITED_POSTFREEZE_COMPARISON_V1',
  runId: 'codex-20261007-2sem-mid-jeil-calc1', examUid: '26_제일고_2학기_중간_고2_미적분I', stage: 'R1', executionLine: 'CODEX', qualityContractVersion: 'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',
  qid: 8, denominator: 1, fullExamDenominator: 22,
  sourceArtifactRawSha256: expectedRaw, sourceArtifactBlobSha1: expectedBlob,
  studentBundleSha256: expectedBundle, studentPayloadSha256: student.payloadSha,
  freezePath: freezeFile, freezeSha256: sha(fs.readFileSync(freezeFile)),
  studentParity: parity,
  independentAnswer: freeze.independentAnswer,
  postfreezeEncodingAdjudication: { originalFreezePreserved: true, locus: 'independentAnswer.choiceText', recordedText: '(2,3)', exactCurrentChoiceText: '$(2,3)$', correction: 'Choice index 3 and independent reasoning are unchanged; the missing MathJax delimiters in the freeze annotation are a display-text encoding omission only.' },
  storedAnswer, storedChoiceText: selectedChoice, compareResult: 'MATCH',
  currentSolutionSha256: solutionSha256,
  currentFieldsSha256: metaSha256,
  currentFields: meta,
  answerDisclosure: { qid: 8, fields: ['answer','solution','solutionImage','difficultyAndMeta'], postfreezeOnly: true }
};
fs.writeFileSync(compareFile, `${JSON.stringify(comparison, null, 2)}\n`, 'utf8');
const old = JSON.parse(fs.readFileSync(priorEvidenceFile, 'utf8'));
const untouchedRows = old.rows.filter(row => Number(row.qid) !== 8);
const expectedOtherQids = Array.from({length:22}, (_,i)=>i+1).filter(qid=>qid!==8);
if (JSON.stringify(untouchedRows.map(r=>Number(r.qid)).sort((a,b)=>a-b)) !== JSON.stringify(expectedOtherQids)) throw new Error('PRIOR_NON_Q8_DENOMINATOR_INVALID');
const oldDispositionRows = old.artifactDispositions?.rows ?? [];
const untouchedDispositionRows = oldDispositionRows.filter(row => Number(row.qid) !== 8);
if (JSON.stringify(untouchedDispositionRows.map(r=>Number(r.qid)).sort((a,b)=>a-b)) !== JSON.stringify(expectedOtherQids)) throw new Error('PRIOR_NON_Q8_DISPOSITION_DENOMINATOR_INVALID');
const questionLayout = { disposition: 'KEEP', evidence: 'Q8 current content and choices match the current answer-free student bundle byte-for-byte at field value level; AUTO-FIRST; no deterministic readability defect; layoutTag grid retained.' };
const solutionLayout = { disposition: 'KEEP', evidence: 'The explanation separates function continuity, endpoint sign evaluations, IVT conclusion, and final answer into readable lines; each displayed expression is complete and the conclusion follows the computation.' };
const metaReview = { status: 'PASS_WITH_DOCUMENTED_RPM_BINDING_GAP', currentFieldsSha256: metaSha256, disposition: 'Retain current active PT/TPL keys and current curriculum fields. Current 2022 Calculus I RPM row is DIRECT_BINDING_GAP; record migration debt without synthesizing a curriculum binding or reclassifying.' };
const visualReview = { status: 'PASS', required: false, assetRef: null, sourcePage: null, observation: 'Student bundle and assignment declare no q8 visual asset; question and solution are scalar algebra/IVT reasoning and no problem or solution SVG is required. No source scan was opened.' };
const boardFlow = { status: 'PASS', evidence: 'Function/domain → continuity → f(2)>0 → f(3)<0 (with sqrt(15)<4) → IVT root in (2,3) → choice ③. Every decisive value and inference is physically present in solution.' };
const q8row = {
  qid: 8,
  sourceIdentity: { sourceArchiveFile: 'archive/exams/original/high/h2/2mid/26_제일고_2학기_중간_고2_미적분I.js', sourceOrdinal: 8, questionUid: '26_제일고_2학기_중간_고2_미적분I#q8', artifactRawSha256: expectedRaw, studentBundleSha256: expectedBundle, studentPayloadSha256: student.payloadSha, sourceMode: 'AUDITED_REPAIR', repairType: 'DETERMINISTIC_RADICAL_SCOPE_CORRECTION', requiredAssets: [] },
  independentAnswer: '③', independentAnswerFrozenBeforeStoredAnswer: true, independentFreezeRef: `${freezeFile}#sha256=${sha(fs.readFileSync(freezeFile))}`,
  storedAnswer, compareResult: 'MATCH', verdict: 'PASS_AFTER_REPAIR', disposition: 'SOURCE_REPAIR_VERIFIED; independent solve and postfreeze comparison MATCH; no additional R1 correction needed.', repairApplied: true,
  solutionSha256, smallBoardContinuityStatus: 'PASS', boardFlowContinuity: boardFlow,
  axisEvidence: {
    QUESTION_LAYOUT: { status: 'PASS', disposition: 'KEEP', evidence: questionLayout.evidence },
    SOLUTION_LAYOUT: { status: 'PASS', disposition: 'KEEP', evidence: solutionLayout.evidence },
    META: { status: 'PASS', disposition: metaReview.disposition, evidence: 'Current field hash and projection gap bound in artifactDispositions; see q8 Meta review.' },
    VISUAL_SVG: { status: 'PASS', disposition: 'NOT_REQUIRED', evidence: visualReview.observation }
  },
  questionLayout, solutionLayout, metaReview, visualReview
};
const merged = {
  ...old,
  qualityContractVersion: 'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006', executionLine: 'CODEX',
  artifactSha: expectedBlob, artifactRawSha256: expectedRaw,
  studentBundleSha256: expectedBundle,
  studentBundleScope: { qid: 8, denominator: 1, fullExamDenominator: 22 },
  expectedQids: Array.from({length:22},(_,i)=>i+1), denominator: 22,
  independentFreeze: { ...old.independentFreeze, qid8FreshReplacement: { path: freezeFile, sha256: sha(fs.readFileSync(freezeFile)), replacesQid: 8 } },
  studentFreezeRebind: { ...old.studentFreezeRebind, qid8CurrentStudentBundle: { path: studentBundle, sha256: expectedBundle, qid: 8, payloadSha256: student.payloadSha } },
  qid8PostfreezeComparison: { path: compareFile, sha256: sha(fs.readFileSync(compareFile)), compareResult: 'MATCH', qid: 8 },
  artifactDispositions: { artifactSha: expectedBlob, rows: [...untouchedDispositionRows, { qid: 8, metaDebtFields: ['problemTypeKey','templateKey'], metaDebtReason: 'Current 2022 Calculus I RPM primary row for IVT is DIRECT_BINDING_GAP while the actual candidate retains the unique ACTIVE PT_INTERMEDIATE_VALUE_APPLICATION and TPL_IVT_VALUE_EXISTENCE_INTERVAL values. Preserve those fields and evidence; do not synthesize a curriculum binding.' }] },
  rows: [...untouchedRows, q8row].sort((a,b)=>Number(a.qid)-Number(b.qid))
};
fs.writeFileSync(outputEvidence, `${JSON.stringify(merged, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ comparisonFile: compareFile, comparisonSha256: sha(fs.readFileSync(compareFile)), aggregateEvidence: outputEvidence, aggregateEvidenceSha256: sha(fs.readFileSync(outputEvidence)), rows: merged.rows.length, dispositionRows: merged.artifactDispositions.rows.length, q8Compare: q8row.compareResult, q8Axes: Object.fromEntries(Object.entries(q8row.axisEvidence).map(([k,v])=>[k,v.status])) }, null, 2));



