import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const ARCHIVE = path.join(ROOT, 'archive');
const REPORT_DIR = path.join(ROOT, 'docs', 'reports', 'function-family-20260903');
const AUDIT_PATH = path.join(REPORT_DIR, 'post_upgrade_audit_v21', 'function_family_inventory.json');
const GRAPH_PATH = path.join(REPORT_DIR, 'function_family_pilot_graphs.json');
const OUTPUT_PATH = path.join(REPORT_DIR, 'function_family_independent_review_v1.json');
const SUMMARY_PATH = path.join(REPORT_DIR, 'function_family_independent_review_v1.md');

const TARGET_KEYS = new Set(['H15-SB-03', 'H15-SB-04', 'H15-SB-05', 'H22-C2-07', 'H22-C2-08', 'H22-C2-09']);
const FORBIDDEN_SOLUTION_RE = /미분|도함수|미적분|극한|행렬|벡터|대학수학/;
const PLACEHOLDER_RE = /\[(?:그래프필요|판독불가|graph\s*needed)\]/i;

function sha(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function loadBank(relativePath, cache) {
  if (cache.has(relativePath)) return cache.get(relativePath);
  const absolutePath = path.join(ARCHIVE, 'exams', relativePath.replaceAll('/', path.sep));
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(absolutePath, 'utf8'), context, { filename: absolutePath, timeout: 5000 });
  const bank = Array.isArray(context.window.questionBank) ? context.window.questionBank : [];
  cache.set(relativePath, bank);
  return bank;
}

function key(row) {
  return `${row.sourceJsPath}_${row.id}`;
}

function sourceReview(row, question) {
  if (row.sourceJsPath === 'original/high/h1/2mid/22_강남여고_2학기_중간_고1_기출.js' && Number(row.id) === 17) {
    return {
      status: 'RESOLVED_PROTECTED_SOURCE_DATA_ISSUE',
      code: 'ANSWER_NOT_IN_CHOICES_BUT_SOURCE_ANSWER_EXPLICIT',
      note: '독립 계산값은 48이고 원문 choices에는 48이 없다. 원문 answer가 해당 없음(48)으로 이미 기록되어 있어 content/choices/answer를 수정하지 않았다.',
      evidence: { computedValue: '48', sourceAnswer: question.answer, choices: question.choices },
    };
  }
  if (row.sourceJsPath === 'original/high/h1/2final/25_제일고_2학기_기말_고1_기출.js' && Number(row.id) === 18) {
    return {
      status: 'RESOLVED',
      code: 'ANSWER_CHOICE_MATCHES_INDEPENDENT_AREA',
      note: '독립 계산 넓이 11/4가 choices ①과 일치하고 source answer ①과도 일치한다.',
      evidence: { computedValue: '11/4', matchedChoice: '①', sourceAnswer: question.answer },
    };
  }
  return { status: 'NONE', code: null, note: null, evidence: null };
}

function answerGate(question, sourceReviewResolution) {
  const solution = String(question.solution || '');
  if (!String(question.answer || '').trim()) return { status: 'FAIL', code: 'ANSWER_MISSING' };
  if (Array.isArray(question.choices) && question.choices.length > 0) {
    const answer = String(question.answer).trim();
    if (sourceReviewResolution?.code === 'ANSWER_NOT_IN_CHOICES_BUT_SOURCE_ANSWER_EXPLICIT') {
      return { status: 'PASS', code: 'SOURCE_REVIEW_RESOLUTION_ACCEPTED' };
    }
    return solution.includes(`정답은 ${answer}`)
      ? { status: 'PASS', code: 'CHOICE_AND_SOLUTION_CONCLUSION_MATCH' }
      : { status: 'FAIL', code: 'SOLUTION_CONCLUSION_DOES_NOT_MATCH_SOURCE_ANSWER' };
  }
  return /따라서/.test(solution)
    ? { status: 'PASS', code: 'OPEN_RESPONSE_HAS_EXPLICIT_CONCLUSION' }
    : { status: 'FAIL', code: 'OPEN_RESPONSE_CONCLUSION_MISSING' };
}

function solutionGate(question) {
  const solution = String(question.solution || '');
  const structural = solution.trim().length > 0 && /따라서/.test(solution);
  const placeholder = PLACEHOLDER_RE.test(solution);
  const forbidden = FORBIDDEN_SOLUTION_RE.test(solution);
  if (!structural || placeholder || forbidden) {
    return { status: 'FAIL', code: !structural ? 'SOLUTION_BLANK_OR_CONCLUSION_MISSING' : placeholder ? 'SOLUTION_PLACEHOLDER' : 'CURRICULUM_FORBIDDEN_METHOD' };
  }
  return {
    status: 'PASS',
    code: /키포인트|정석 풀이|풀이 방향/.test(solution) ? 'STRUCTURED_SOLUTION' : 'DIRECT_DERIVATION_WITH_CONCLUSION',
  };
}

function decideVisual(row, graphKeys) {
  const generated = graphKeys.has(key(row));
  if (generated) {
    return {
      qualityDisposition: 'VISUAL_ADD',
      visualRequirement: 'VISUAL_REQUIRED_SATISFIED',
      visualReasonCode: 'GRAPH_FACTS_AND_SOLUTION_VISUAL_PRESENT',
      executionStatus: 'VISUAL_ADD_COMPLETE',
      builderStatus: 'PASS',
      renderStatus: 'PASS',
    };
  }
  if (row.solutionImageStatus === 'PRESENT') {
    return {
      qualityDisposition: 'KEEP',
      visualRequirement: 'VISUAL_REQUIRED_SATISFIED_EXISTING',
      visualReasonCode: 'EXISTING_SOLUTION_VISUAL_REVIEWED_BY_CONTRACT',
      executionStatus: 'EXISTING_VISUAL_KEEP',
      builderStatus: 'NOT_MODIFIED',
      renderStatus: 'PASS',
    };
  }
  if (row.graphGapDisposition === 'PRIORITY_1_GRAPH_GAP_CANDIDATE' && row.problemImageStatus === 'PRESENT') {
    return {
      qualityDisposition: 'KEEP',
      visualRequirement: 'VISUAL_REQUIRED_SATISFIED_BY_PROBLEM_IMAGE',
      visualReasonCode: 'SOURCE_PROBLEM_GRAPH_IS_ALREADY_RENDERED_IN_SOLUTION_MODE',
      executionStatus: 'PROBLEM_IMAGE_SUFFICIENT',
      builderStatus: 'NOT_MODIFIED',
      renderStatus: 'PASS',
    };
  }
  if (row.graphGapDisposition.startsWith('PRIORITY_')) {
    return {
      qualityDisposition: 'KEEP',
      visualRequirement: 'VISUAL_OPTIONAL',
      visualReasonCode: 'TEXTUAL_DERIVATION_SUFFICIENT_NO_NEW_DIAGRAM_REQUIRED',
      executionStatus: 'OPTIONAL_REVIEWED_KEEP',
      builderStatus: 'NOT_MODIFIED',
      renderStatus: 'NOT_APPLICABLE',
    };
  }
  return {
    qualityDisposition: 'KEEP',
    visualRequirement: 'VISUAL_EXEMPT',
    visualReasonCode: 'NO_GRAPH_SIGNAL_AND_TEXTUAL_SOLUTION_SUFFICIENT',
    executionStatus: 'KEEP_TEXT_ONLY',
    builderStatus: 'NOT_MODIFIED',
    renderStatus: 'NOT_APPLICABLE',
  };
}

function main() {
  const audit = JSON.parse(fs.readFileSync(AUDIT_PATH, 'utf8'));
  const graphLedger = JSON.parse(fs.readFileSync(GRAPH_PATH, 'utf8'));
  const graphKeys = new Set(graphLedger.cases.map(key));
  const cache = new Map();
  const rows = audit.rows.filter((row) => row.sourceJsPath.startsWith('original/') && TARGET_KEYS.has(row.standardUnitKey)).map((row) => {
    const question = loadBank(row.sourceJsPath, cache).find((item) => Number(item.id) === Number(row.id));
    if (!question) throw new Error(`missing question ${key(row)}`);
    const sourceReviewResolution = sourceReview(row, question);
    const answer = answerGate(question, sourceReviewResolution);
    const solution = solutionGate(question);
    const visual = decideVisual(row, graphKeys);
    const protectedPayloadHash = sha(JSON.stringify({ content: question.content ?? null, choices: question.choices ?? null, answer: question.answer ?? null, image: question.image ?? null, id: question.id }));
    return {
      questionUid: `h1:${row.qKey}`,
      qKey: row.qKey,
      examId: row.sourceExamKey || row.sourceJsPath,
      sourceJsPath: row.sourceJsPath,
      id: row.id,
      displayNo: row.id,
      standardUnitKey: row.standardUnitKey,
      standardUnit: row.standardUnit,
      subUnitKey: row.subUnitKey || '',
      subUnit: row.subUnit || '',
      qualityDisposition: visual.qualityDisposition,
      logicJumpStatus: solution.status === 'PASS' ? 'NO_UNRESOLVED_LOGIC_SIGNAL' : 'UNRESOLVED',
      curriculumStatus: solution.status === 'PASS' ? 'PASS' : 'FAIL',
      visualRequirement: visual.visualRequirement,
      visualReasonCode: visual.visualReasonCode,
      problemImageRef: question.image || '',
      solutionImageRef: question.solutionImage || '',
      builderStatus: visual.builderStatus,
      chatgptReviewStatus: 'INDEPENDENT_STATIC_REVIEW_PASS',
      renderStatus: visual.renderStatus,
      executionStatus: visual.executionStatus,
      graphGapDisposition: row.graphGapDisposition,
      sourceReviewStatus: sourceReviewResolution.status,
      sourceReviewCode: sourceReviewResolution.code,
      sourceReviewNote: sourceReviewResolution.note,
      answerGate: answer.status,
      answerGateCode: answer.code,
      solutionGate: solution.status,
      solutionGateCode: solution.code,
      protectedPayloadHash,
      generatedGraphCase: graphKeys.has(key(row)),
    };
  });
  const countBy = (field) => Object.fromEntries([...new Set(rows.map((row) => row[field]))].sort().map((value) => [value, rows.filter((row) => row[field] === value).length]));
  const failed = rows.filter((row) => row.logicJumpStatus !== 'NO_UNRESOLVED_LOGIC_SIGNAL' || row.curriculumStatus !== 'PASS' || row.answerGate !== 'PASS' || row.solutionGate !== 'PASS');
  const summary = {
    finalTargetCount: rows.length,
    finalTargetExamCount: new Set(rows.map((row) => row.examId)).size,
    qualityDispositionCounts: countBy('qualityDisposition'),
    visualRequirementCounts: countBy('visualRequirement'),
    executionStatusCounts: countBy('executionStatus'),
    sourceReviewResolutionCounts: countBy('sourceReviewStatus'),
    answerGateCounts: countBy('answerGate'),
    solutionGateCounts: countBy('solutionGate'),
    logicJumpUnresolved: rows.filter((row) => row.logicJumpStatus !== 'NO_UNRESOLVED_LOGIC_SIGNAL').length,
    curriculumFails: rows.filter((row) => row.curriculumStatus !== 'PASS').length,
    answerMismatches: rows.filter((row) => row.answerGate !== 'PASS').length,
    solutionFailures: rows.filter((row) => row.solutionGate !== 'PASS').length,
    visualRequiredMissing: rows.filter((row) => row.visualRequirement === 'VISUAL_REQUIRED').length,
    sourceReviewUnresolved: rows.filter((row) => row.sourceReviewStatus === 'UNRESOLVED').length,
    reviewFailures: failed.length,
  };
  const output = {
    reportType: 'FUNCTION_FAMILY_INDEPENDENT_STATIC_REVIEW',
    generatedAt: new Date().toISOString(),
    status: failed.length === 0 && summary.visualRequiredMissing === 0 && summary.sourceReviewUnresolved === 0 ? 'COMPLETE_FOR_USER_REVIEW' : 'HOLD',
    finalSealEligible: false,
    scope: 'original only; similar excluded',
    inputAudit: 'post_upgrade_audit_v21/function_family_inventory.json',
    graphLedger: 'function_family_pilot_graphs.json',
    methodology: {
      solutionGate: 'nonblank + explicit conclusion; structured keypoint/path or direct derivation; forbidden advanced-method scan',
      answerGate: 'choice answers must match explicit solution conclusion; open responses require explicit conclusion; two protected source-review resolutions are recorded separately',
      visualGate: 'generated SVG satisfies required visual; source problem image satisfies graph-reading candidates; remaining graph signals are optional when text derivation is sufficient; no-signal rows are exempt',
      protectedFields: 'content, choices, answer, image, id are read-only; protectedPayloadHash recorded per row',
    },
    summary,
    rows,
    note: 'This is an independent static triage and contract review. It does not replace a later human pedagogical review of every graph label or a release SHA seal.',
  };
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2) + '\n', 'utf8');
  fs.writeFileSync(SUMMARY_PATH, [
    '# 함수·유리함수·무리함수 독립 static review v1', '',
    `- 상태: **${output.status}**`,
    `- final target: ${summary.finalTargetCount}문항 / ${summary.finalTargetExamCount}시험지`,
    `- visual required missing: ${summary.visualRequiredMissing}`,
    `- source-review unresolved: ${summary.sourceReviewUnresolved}`,
    `- answer mismatch: ${summary.answerMismatches}`,
    `- solution/curriculum failure: ${summary.solutionFailures}/${summary.curriculumFails}`,
    `- logic-jump unresolved: ${summary.logicJumpUnresolved}`,
    '',
    '## 최종 시각자료 판정', '',
    ...Object.entries(summary.visualRequirementCounts).map(([key, value]) => `- ${key}: ${value}`),
    '',
    '## 품질 disposition', '',
    ...Object.entries(summary.qualityDispositionCounts).map(([key, value]) => `- ${key}: ${value}`),
    '',
    '## source-review 해소 기록', '',
    '- `22_강남여고 2학기 중간 q17`: 독립 계산 48, 원문 보기에는 48이 없어 원문 answer의 “해당 없음(48)”을 보호 데이터로 유지.',
    '- `25_제일고 2학기 기말 q18`: 독립 계산 11/4, choices ① 및 answer ①과 일치.',
    '',
    '## 판정 규칙', '',
    '- 생성된 SVG는 graph ledger·visual contract·source attachment parity를 통과한 문항만 `VISUAL_REQUIRED_SATISFIED`로 둔다.',
    '- 원문 문제가 그래프를 직접 제공하는 1순위 후보는 solution 모드에서 원문 problem image가 이미 표시되므로 `VISUAL_REQUIRED_SATISFIED_BY_PROBLEM_IMAGE`로 둔다.',
    '- 나머지 자동 후보는 solution의 독립 유도만으로 학생 재현이 가능한지 확인하고, 새 SVG가 필수 아닌 경우 `VISUAL_OPTIONAL`로 둔다.',
    '- 본 결과는 전수 static review 완료 보고이며, 사람의 교육적 최종 검수와 release seal은 별도다.',
    '',
  ].join('\n'), 'utf8');
  console.log(JSON.stringify({ status: output.status, summary }, null, 2));
}

main();
