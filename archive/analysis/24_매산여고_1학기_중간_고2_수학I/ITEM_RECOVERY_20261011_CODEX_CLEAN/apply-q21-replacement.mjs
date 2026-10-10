import fs from 'node:fs';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { isDeepStrictEqual } from 'node:util';
import { gitBlobSha } from '../../../tools/archive-stage-validator.mjs';
const exam = 'archive/exams/original/high/h2/1mid/24_매산여고_1학기_중간_고2_수학I.js';
const freezePath = 'archive/analysis/24_매산여고_1학기_중간_고2_수학I/ITEM_RECOVERY_20261011_CODEX_CLEAN/q21-replacement-freeze.json';
const beforePath = 'archive/analysis/24_매산여고_1학기_중간_고2_수학I/ITEM_RECOVERY_20261011_CODEX_CLEAN/q21-before-snapshot.json';
const svgPath = 'archive/assets/images/24_매산여고_1학기_중간_고2_수학I/q21-solution-recovery.svg';
const oldSvgPath = 'archive/assets/images/24_매산여고_1학기_중간_고2_수학I/q21-solution.svg';
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const raw = fs.readFileSync(exam);
const sourceText = raw.toString('utf8');
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(sourceText, sandbox, { filename: exam });
const questions = sandbox.window.questionBank || sandbox.window.questions;
const target = questions.find(q => Number(q.id) === 21);
if (!target) throw new Error('TARGET_Q21_MISSING');
const freeze = JSON.parse(fs.readFileSync(freezePath, 'utf8'));
const before = JSON.parse(fs.readFileSync(beforePath, 'utf8'));
if (sha(raw) !== before.artifactRawSha256) throw new Error('SOURCE_CHANGED_AFTER_FREEZE');
const svgBytes = fs.readFileSync(svgPath);
if (sha(svgBytes) !== freeze.solutionVisual.svgSha256) throw new Error('FROZEN_SVG_SHA_MISMATCH');
const replacement = JSON.parse(JSON.stringify(target));
Object.assign(replacement, {
  content: freeze.student.content,
  choices: freeze.student.choices,
  answer: freeze.student.answer,
  solution: freeze.student.solution,
  tags: ['객관식', '삼각함수', '그래프'],
  level: '중',
  category: '삼각함수',
  originalCategory: '삼각함수',
  standardCourse: '수학I',
  standardUnitKey: 'H15-M1-06',
  standardUnit: '삼각함수의 그래프',
  standardUnitOrder: 6,
  layoutTag: 'grid',
  wide: false,
  subUnitKey: 'H15-M1-06-TRIGONOMETRIC_GRAPH',
  subUnit: '삼각함수의 그래프',
  subUnitConfidence: 'candidate_evidence',
  subUnitClassificationDepth: 'complete_candidate',
  problemTypeKey: 'PT_FUNCTION_GRAPH_PROPERTIES',
  templateKey: 'TPL_FUNCTION_GRAPH_PROPERTY_JUDGMENT',
  crossConceptKeys: [],
  conditionKeys: ['COND_RANGE'],
  integrationPattern: 'SEQUENTIAL',
  difficultyBucket: 3,
  difficultyConfidence: 'high',
  difficultyBoundaryFlag: 'NONE',
  legacyLevelCompatibility: 'NORMAL',
  answerStatus: 'generated_pending',
  solutionStatus: 'generated_pending',
  solutionImage: 'assets/images/24_매산여고_1학기_중간_고2_수학I/q21-solution-recovery.svg',
});
delete replacement.image;
delete replacement.itemStatus;
delete replacement.itemHoldReason;
delete replacement.reviewStatus;
const targetIdStart = sourceText.indexOf('"id": 21');
if (targetIdStart < 0) throw new Error('SOURCE_Q21_ANCHOR_MISSING');
const objectStart = sourceText.lastIndexOf('{', targetIdStart);
let depth = 0, inString = false, escaped = false, objectEnd = -1;
for (let i = objectStart; i < sourceText.length; i++) {
  const ch = sourceText[i];
  if (inString) {
    if (escaped) escaped = false;
    else if (ch === '\\') escaped = true;
    else if (ch === '"') inString = false;
    continue;
  }
  if (ch === '"') inString = true;
  else if (ch === '{') depth++;
  else if (ch === '}') { depth--; if (depth === 0) { objectEnd = i + 1; break; } }
}
if (objectEnd < 0) throw new Error('SOURCE_Q21_OBJECT_END_MISSING');
let printed = JSON.stringify(replacement, null, 2).split('\n').map(line => '  ' + line).join('\n');
const updatedText = sourceText.slice(0, objectStart) + printed + sourceText.slice(objectEnd);
const verify = { window: {} };
vm.createContext(verify);
vm.runInContext(updatedText, verify, { filename: exam });
const afterQuestions = verify.window.questionBank || verify.window.questions;
if (afterQuestions.length !== questions.length) throw new Error('QUESTION_COUNT_CHANGED');
const afterTarget = afterQuestions.find(q => Number(q.id) === 21);
if (!afterTarget || afterTarget.answer !== '④' || afterTarget.solution.includes('\\n')) throw new Error('TARGET_RUNTIME_CHECK_FAILED');
for (const oldQ of questions.filter(q => Number(q.id) !== 21)) {
  const newQ = afterQuestions.find(q => Number(q.id) === Number(oldQ.id));
  if (!newQ || !isDeepStrictEqual(JSON.parse(JSON.stringify(oldQ)), JSON.parse(JSON.stringify(newQ)))) {
    throw new Error('NON_TARGET_CHANGED:q' + oldQ.id);
  }
}
fs.writeFileSync(exam, updatedText, 'utf8');
const afterBytes = fs.readFileSync(exam);
console.log(JSON.stringify({
  qid: 21,
  questionCount: afterQuestions.length,
  nonTargetDeepEquality: { compared: questions.length - 1, changed: 0 },
  finalRawSha256: sha(afterBytes),
  finalGitBlobSha1: gitBlobSha(afterBytes),
  oldAssetUntouched: fs.existsSync(oldSvgPath),
  newAssetSha256: sha(svgBytes),
  newAssetGitBlobSha1: gitBlobSha(svgBytes),
  solutionHasRealNewlines: afterTarget.solution.includes('\n'),
  solutionHasLiteralBackslashN: afterTarget.solution.includes('\\n'),
}, null, 2));

