import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

import {
  unescapeMarkdown,
  parseChoices,
  parseSimilarMd,
  convertSimilarExam,
  gitBlobSha1,
} from '../archive/tools/similar-md-to-js.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

test('unescapeMarkdown: unescapes Google Docs markdown backslash escapes by one layer', () => {
  const escaped = [
    '\\# 제목',
    '\\_일체형',
    '\\[3점\\]',
    '\\- 형식: 객관식',
    '\\`code\\`',
    '$\\overline{AB}$',
    '$\\begin{pmatrix}1&2\\\\3&4\\end{pmatrix}$',
    '\\$x \\- y \\= 2\\$',
  ].join('\n');

  const unescaped = unescapeMarkdown(escaped);

  assert.equal(unescaped, [
    '# 제목',
    '_일체형',
    '[3점]',
    '- 형식: 객관식',
    '`code`',
    '$\\overline{AB}$',
    '$\\begin{pmatrix}1&2\\\\3&4\\end{pmatrix}$',
    '$x - y = 2$',
  ].join('\n'));
});

test('parseChoices: correctly parses 5 choices and handles subjective/none', () => {
  const rawMultiple = '① $x+1$ ② $x-1$ ③ $2x$ ④ $3x$ ⑤ $4x$';
  const choices = parseChoices(rawMultiple);
  assert.deepEqual(choices, ['$x+1$', '$x-1$', '$2x$', '$3x$', '$4x$']);

  const multiline = `
    ① $1$
    ② $2$
    ③ $3$
    ④ $4$
    ⑤ $5$
  `;
  assert.deepEqual(parseChoices(multiline), ['$1$', '$2$', '$3$', '$4$', '$5$']);

  assert.deepEqual(parseChoices('없음'), []);
  assert.deepEqual(parseChoices(''), []);
});

test('convertSimilarExam: converts a small sample with objective, subjective, and plan questions', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sim-md-test-'));

  const sampleMd = `\`\`\`json:exam
{
  "stem": "99_테스트고_1학기_기말_고1_유사",
  "sourceArchiveFile": "original/high/h1/1final/99_테스트고_1학기_기말_고1_기출.js",
  "examFolder": "1final",
  "grade": "고1",
  "curriculum": "2022",
  "questionCount": 3,
  "totalScore": 10,
  "generatedAt": "2026-11-18"
}
\`\`\`

## Q01
- 형식: 객관식
- 배점: 3
### 발문
두 다항식의 연산 문제이다. $A+B$의 값을 구하면? [3점]
### 선지
① $x$ ② $2x$ ③ $3x$ ④ $4x$ ⑤ $5x$
### 정답
②
### 해설
$A$와 $B$를 더하면 다음과 같다.
$$A+B = 2x$$
따라서 정답은 ②이다.
\`\`\`json:plan
"NONE"
\`\`\`
\`\`\`json:meta
{
  "sourceQid": 1,
  "variationType": "NUMERIC",
  "standardCourse": "공통수학1",
  "courseKey": "공통수학1",
  "curriculum": "2022",
  "standardUnitKey": "H22-C-09",
  "subUnitKey": "H22-C-09-CORE",
  "conceptClusterKey": "09-CORE",
  "primaryMethod": "두 식을 직접 더한다.",
  "decisiveStep": "$A+B=2x$",
  "rpm": {
    "majorUnit": "적분법",
    "midUnit": "여러 가지 적분법",
    "l3": "여러 함수의 부정적분",
    "l4": "지수·로그함수"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_H1_MATRIX_BASIC_OPERATION",
    "templateKey": "TPL_H1_MATRIX_BASIC_DIRECT",
    "why": "행렬 기본 연산"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "기본 덧셈 연산 한 단계",
  "level": "하",
  "item4slot": {
    "format": "단일 정답",
    "slots": {
      "given": [{ "term": "행렬", "src": "stem", "quote": "두 다항식의 연산 문제이다." }],
      "goal": [{ "term": "값", "src": "stem", "quote": "A+B의 값을 구하면" }],
      "method": [{ "term": "덧셈", "src": "solution", "quote": "더하면", "evidenceType": "NAMED" }],
      "condition": []
    }
  },
  "hold": ""
}
\`\`\`

## Q02
- 형식: 서답형
- 배점: 3
### 발문
이차방정식의 근을 구하시오.
### 선지
없음
### 정답
$x=3$
### 해설
인수분해하면 다음과 같다.
$$(x-3)^2 = 0$$
따라서 $x=3$이다.
\`\`\`json:plan
"NONE"
\`\`\`
\`\`\`json:meta
{
  "sourceQid": 2,
  "variationType": "NUMERIC",
  "standardCourse": "공통수학1",
  "courseKey": "공통수학1",
  "curriculum": "2022",
  "standardUnitKey": "H22-C-09",
  "subUnitKey": "H22-C-09-CORE",
  "conceptClusterKey": "09-CORE",
  "primaryMethod": "인수분해하여 중근을 구한다.",
  "decisiveStep": "$x=3$",
  "rpm": {
    "majorUnit": "적분법",
    "midUnit": "여러 가지 적분법",
    "l3": "여러 함수의 부정적분",
    "l4": "지수·로그함수"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_NON_EXISTENT_KEY_123",
    "templateKey": "TPL_NON_EXISTENT_KEY_456",
    "why": "사전에 없는 키 테스트"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "인수분해 적용",
  "level": "중",
  "item4slot": {
    "format": "단답",
    "slots": {
      "given": [{ "term": "이차방정식", "src": "stem", "quote": "이차방정식의" }],
      "goal": [{ "term": "근", "src": "stem", "quote": "근을 구하시오" }],
      "method": [{ "term": "인수분해", "src": "solution", "quote": "인수분해하면", "evidenceType": "NAMED" }],
      "condition": []
    }
  },
  "hold": ""
}
\`\`\`

## Q03
- 형식: 서답형
- 배점: 4
### 발문
다음 그림을 보고 풀이 과정을 서술하시오.
### 선지
없음
### 정답
10
### 해설
피타고라스 정리에 의해 빗변의 길이를 구한다.
풀이 과정: $6^2 + 8^2 = 100 = 10^2$이므로 답은 10이다.
\`\`\`json:plan
{
  "type": "geometry",
  "description": "직각삼각형 ABC",
  "elements": []
}
\`\`\`
\`\`\`json:meta
{
  "sourceQid": 3,
  "variationType": "CONTEXT",
  "standardCourse": "공통수학1",
  "courseKey": "공통수학1",
  "curriculum": "2022",
  "standardUnitKey": "H22-C-09",
  "subUnitKey": "H22-C-09-CORE",
  "conceptClusterKey": "09-CORE",
  "primaryMethod": "피타고라스 정리로 빗변을 구함",
  "decisiveStep": "빗변은 10이다",
  "rpm": {
    "majorUnit": "적분법",
    "midUnit": "여러 가지 적분법",
    "l3": "여러 함수의 부정적분",
    "l4": "지수·로그함수"
  },
  "ptTplCandidate": {
    "problemTypeKey": null,
    "templateKey": null,
    "why": ""
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 3,
  "difficultyConfidence": "medium",
  "difficultyBoundaryFlag": "B23",
  "difficultyReason": "서술형 풀이",
  "level": "상",
  "item4slot": {
    "format": "서술",
    "slots": {
      "given": [{ "term": "직각삼각형", "src": "stem", "quote": "그림을 보고" }],
      "goal": [{ "term": "값", "src": "stem", "quote": "서술하시오" }],
      "method": [{ "term": "피타고라스 정리", "src": "solution", "quote": "피타고라스 정리에 의해", "evidenceType": "NAMED" }],
      "condition": []
    }
  },
  "hold": ""
}
\`\`\`
`;

  const result = convertSimilarExam({
    mdContent: sampleMd,
    repoRoot,
    writeFiles: true,
    outDir: tmpDir,
  });

  assert.equal(result.stem, '99_테스트고_1학기_기말_고1_유사');
  assert.equal(result.questionCount, 3);
  assert.equal(result.totalScore, 10);
  assert.equal(result.validation.valid, true);

  // Check generated JS
  const jsFile = path.join(tmpDir, '99_테스트고_1학기_기말_고1_유사.js');
  assert.equal(fs.existsSync(jsFile), true);
  const jsContent = fs.readFileSync(jsFile, 'utf8');

  // Verify JS executes and sets questionBank
  const ctx = { window: {} };
  vm.createContext(ctx);
  new vm.Script(jsContent).runInContext(ctx);

  assert.equal(ctx.window.examTitle, '99_테스트고_1학기_기말_고1_유사');
  assert.equal(Array.isArray(ctx.window.questionBank), true);
  assert.equal(ctx.window.questionBank.length, 3);

  // Q1: objective
  const q1 = ctx.window.questionBank[0];
  assert.equal(q1.id, 1);
  assert.equal(q1.questionType, '객관식');
  assert.equal(q1.layoutTag, 'grid');
  assert.equal(q1.wide, false);
  assert.equal(q1.choices.length, 5);
  assert.equal(q1.answer, '②');
  assert.equal(q1.problemTypeKey, 'PT_H1_MATRIX_BASIC_OPERATION');
  assert.equal(q1.templateKey, 'TPL_H1_MATRIX_BASIC_DIRECT');
  assert.equal(q1.rpmPrimaryRecordId, 'H2-CALC-RPM-038');
  assert.equal(q1.problemPlanRef, undefined);

  // Q2: subjective 단답형, invalid PT/TPL cleared to ""
  const q2 = ctx.window.questionBank[1];
  assert.equal(q2.id, 2);
  assert.equal(q2.questionType, '단답형');
  assert.equal(q2.choices.length, 0);
  assert.equal(q2.problemTypeKey, '');
  assert.equal(q2.templateKey, '');

  // Q3: subjective 서술형, plan exists
  const q3 = ctx.window.questionBank[2];
  assert.equal(q3.id, 3);
  assert.equal(q3.questionType, '서술형');
  assert.match(q3.problemPlanRef, /q03-problem\.plan\.json$/);

  // Verify plan file exists
  const planFile = path.join(tmpDir, '99_테스트고_1학기_기말_고1_유사_plans/q03-problem.plan.json');
  assert.equal(fs.existsSync(planFile), true);

  // Verify meta registration JSON
  const metaFile = path.join(tmpDir, '99_테스트고_1학기_기말_고1_유사.meta-q01-q03.json');
  assert.equal(fs.existsSync(metaFile), true);
  const metaDoc = JSON.parse(fs.readFileSync(metaFile, 'utf8'));
  assert.equal(metaDoc.schemaVersion, 'archive-reviewed-exam-meta-register-request-v2');
  assert.equal(metaDoc.expectedQuestionCount, 3);
  assert.equal(metaDoc.expectedSourceBlobSha1, gitBlobSha1(jsContent));
  assert.equal(metaDoc.approval.type, 'CANDIDATE_CREATION_GATE');
  assert.equal(metaDoc.approval.reviewPassCount, 0);

  // Verify candidate PT/TPL preserved in metaDoc items
  assert.equal(metaDoc.items[1].ptTplCandidate.problemTypeKey, 'PT_NON_EXISTENT_KEY_123');

  // Verify 4slot JSON
  const fourSlotFile = path.join(tmpDir, '99_테스트고_1학기_기말_고1_유사.4slot.json');
  assert.equal(fs.existsSync(fourSlotFile), true);
  const fourSlotDoc = JSON.parse(fs.readFileSync(fourSlotFile, 'utf8'));
  assert.equal(fourSlotDoc.schemaVersion, 'archive-meta-4slot-v0');
  assert.equal(fourSlotDoc.items.length, 3);

  fs.rmSync(tmpDir, { recursive: true, force: true });
});
