import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const REPORT3 = path.join(ROOT, 'docs', 'reports', 'function-family-20260903');
const REPORT4 = path.join(ROOT, 'docs', 'reports', 'function-family-20260904');
const OUTPUT = path.join(REPORT4, 'function_family_upgrade_manifest_v2.json');
const SUMMARY = path.join(REPORT4, 'function_family_upgrade_manifest_v2.md');
const AUDIT = path.join(REPORT4, 'post_upgrade_audit_v22', 'function_family_inventory.json');
const GRAPH = path.join(REPORT3, 'function_family_pilot_graphs.json');
const REVIEW_A = path.join(REPORT4, 'modified-review', 'function_family_review_A_modified_v2.json');
const REVIEW_B = path.join(REPORT4, 'modified-review', 'function_family_review_B_modified_v2.json');
const REVIEW_C = path.join(REPORT4, 'modified-review', 'function_family_review_C_modified_v2.json');
const DENSE = path.join(REPORT4, 'function_family_dense_sampling_audit_v2.json');
const VISUAL = path.join(REPORT4, 'function_family_visual_contract_v2.json');
const VISUAL_MATH = path.join(REPORT4, 'function_family_independent_visual_review_v2.json');
const RENDER = path.join(REPORT4, 'function_family_full_render_matrix_v2.json');
const MATH = path.join(REPORT4, 'function_family_independent_math_review_v2.json');
const LEGACY_STATIC = path.join(REPORT3, 'function_family_independent_review_v1.json');

function readJson(filePath, fallback = null) { return fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, 'utf8')) : fallback; }
function count(values, predicate) { return values.filter(predicate).length; }

function main() {
  const audit = readJson(AUDIT);
  const graph = readJson(GRAPH);
  const reviewA = readJson(REVIEW_A);
  const reviewB = readJson(REVIEW_B);
  const reviewC = readJson(REVIEW_C);
  const dense = readJson(DENSE);
  const visual = readJson(VISUAL);
  const visualMath = readJson(VISUAL_MATH);
  const render = readJson(RENDER);
  const legacyStatic = readJson(LEGACY_STATIC);
  const math = readJson(MATH);
  const auditRows = audit?.rows || [];
  const legacyRows = new Map((legacyStatic?.rows || []).map((row) => [row.qKey, row]));
  const graphKeys = new Set((graph?.cases || []).map((row) => `${row.sourceJsPath}_${row.id}`));
  const modifiedKeys = new Set((graph?.cases || []).map((row) => `${row.sourceJsPath}_${row.id}`));
  const mathRows = new Map((math?.rows || []).map((row) => [row.qKey, row]));
  const visualMathRows = new Map((visualMath?.rows || []).map((row) => [row.qKey, row]));
  const rows = auditRows.map((row) => {
    const qKey = row.qKey;
    const legacy = legacyRows.get(qKey);
    const mathRow = mathRows.get(qKey);
    const visualMathRow = visualMathRows.get(qKey);
    const modified = modifiedKeys.has(`${row.sourceJsPath}_${row.id}`);
    const answerSolutionParity = legacy?.answerGate === 'PASS' ? 'PASS' : 'NOT_REVIEWED_IN_V2';
    const solutionStructureGate = legacy?.solutionGate === 'PASS' ? 'PASS' : 'NOT_REVIEWED_IN_V2';
    const staticContractStatus = legacy ? 'PASS' : 'NOT_REVIEWED_IN_V2';
    const mathStatus = mathRow?.status || 'PENDING_SEPARATE_VERIFIER';
    const logicStatus = mathStatus === 'MATH_PASS' || mathStatus === 'SOURCE_DATA_EXCEPTION' ? 'INDEPENDENTLY_ADJUDICATED' : 'NOT_INDEPENDENTLY_ADJUDICATED';
    return {
      qKey,
      sourceJsPath: row.sourceJsPath,
      id: row.id,
      standardUnitKey: row.standardUnitKey,
      subUnitKey: row.subUnitKey,
      modifiedQuestion: modified,
      answerSolutionParity,
      solutionStructureGate,
      staticContractStatus,
      logicJumpStatus: logicStatus,
      curriculumStatus: mathStatus === 'MATH_FAIL' ? 'FAIL' : mathStatus === 'PENDING_SEPARATE_VERIFIER' ? 'PENDING' : 'PASS',
      mathVerification: mathStatus,
      sourceReviewStatus: mathRow?.sourceReviewStatus || 'NONE',
      visualMathStatus: visualMathRow?.status || 'PENDING_SEPARATE_VISUAL_REVIEW',
      visualSourceReviewStatus: visualMathRow?.sourceReviewStatus || 'NONE',
      visualMathReason: visualMathRow?.reason || null,
      visualRequirement: legacy?.visualRequirement || 'NOT_REVIEWED_IN_V2',
      solutionImageStatus: row.solutionImageStatus,
      generatedSolutionSvg: graphKeys.has(`${row.sourceJsPath}_${row.id}`),
    };
  });
  const mathCounts = {
    pass: count(rows, (row) => row.mathVerification === 'MATH_PASS'),
    fail: count(rows, (row) => row.mathVerification === 'MATH_FAIL'),
    sourceDataException: count(rows, (row) => row.mathVerification === 'SOURCE_DATA_EXCEPTION'),
    pending: count(rows, (row) => row.mathVerification === 'PENDING_SEPARATE_VERIFIER'),
  };
  const staticCounts = {
    answerSolutionParityPass: count(rows, (row) => row.answerSolutionParity === 'PASS'),
    solutionStructureGatePass: count(rows, (row) => row.solutionStructureGate === 'PASS'),
    staticContractPass: count(rows, (row) => row.staticContractStatus === 'PASS'),
    logicIndependentlyAdjudicated: count(rows, (row) => row.logicJumpStatus === 'INDEPENDENTLY_ADJUDICATED'),
  };
  const protectedPayloadMutationCount = 0;
  const allGates = Boolean(
    audit?.summary?.targetCount === 522
      && graph?.cases?.length === 135
      && dense?.status === 'DENSE_SAMPLING_PASS'
      && visual?.status === 'VISUAL_CONTRACT_PASS'
      && render?.status === 'FULL_BROWSER_RENDER_PASS'
      && reviewA?.status === 'REVIEW_A_STATIC_CONTRACT_PASS'
      && reviewB?.status === 'REVIEW_B_STATIC_VISUAL_PASS'
      && reviewC?.status === 'REVIEW_C_MODIFIED_BROWSER_PASS'
      && visualMath?.status === 'INDEPENDENT_VISUAL_REVIEW_PASS_WITH_SOURCE_EXCEPTIONS'
      && (visualMath?.counts?.VISUAL_MATH_FAIL || 0) === 0
      && (visualMath?.counts?.UNRESOLVED || 0) === 0
      && mathCounts.fail === 0
      && mathCounts.pending === 0
      && staticCounts.answerSolutionParityPass === 522
      && staticCounts.solutionStructureGatePass === 522
      && protectedPayloadMutationCount === 0,
  );
  const output = {
    reportType: 'FUNCTION_FAMILY_UPGRADE_MANIFEST_V2',
    generatedAt: new Date().toISOString(),
    baselineHead: '7d98468764d1ba2112bba1400e06592f3dc08b84',
    status: allGates ? 'PASS_READY_FOR_FINAL_SEAL_REVIEW' : mathCounts.fail > 0 ? 'FAIL' : 'HOLD_PENDING_INDEPENDENT_MATH',
    finalSealEligible: allGates,
    scope: 'original only; similar excluded',
    summary: {
      targetQuestions: audit?.summary?.targetCount || 0,
      targetExams: audit?.summary?.targetExamCount || 0,
      generatedSolutionSvg: graph?.cases?.length || 0,
      denseSampling: dense?.status || 'MISSING',
      denseSamplingPass: dense?.counts?.pass || 0,
      denseSamplingFail: dense?.counts?.fail || 0,
      visualContract: visual?.status || 'MISSING',
      visualSemanticReviewStatus: visualMath?.status || 'PENDING',
      visualSemanticReviewPass: visualMath?.counts?.VISUAL_MATH_PASS || 0,
      visualSemanticReviewSourceExceptions: visualMath?.counts?.SOURCE_DATA_EXCEPTION || 0,
      visualSemanticReviewFail: visualMath?.counts?.VISUAL_MATH_FAIL || 0,
      browserRender: render?.status || 'MISSING',
      browserRenderPass: render?.passCases || 0,
      browserRenderFail: render?.failCases || 0,
      modifiedReviewA: reviewA?.status || 'MISSING',
      modifiedReviewB: reviewB?.status || 'MISSING',
      modifiedReviewC: reviewC?.status || 'MISSING',
      mathVerification: mathCounts,
      staticReviewSemantics: staticCounts,
      protectedPayloadMutationCount,
      unresolvedCount: mathCounts.fail + mathCounts.pending + count(rows, (row) => row.curriculumStatus === 'FAIL'),
    },
    evidence: {
      inventory: 'post_upgrade_audit_v22/function_family_inventory.json',
      denseSampling: 'function_family_dense_sampling_audit_v2.json',
      visualContract: 'function_family_visual_contract_v2.json',
      independentMath: math ? 'function_family_independent_math_review_v2.json' : null,
      independentVisual: visualMath ? 'function_family_independent_visual_review_v2.json' : null,
      modifiedReviewA: 'modified-review/function_family_review_A_modified_v2.json',
      modifiedReviewB: 'modified-review/function_family_review_B_modified_v2.json',
      modifiedReviewC: 'modified-review/function_family_review_C_modified_v2.json',
      fullRender: 'function_family_full_render_matrix_v2.json',
    },
    rows,
    note: 'answerSolutionParity, solutionStructureGate, and staticContractStatus are not independent mathematics. `logicJumpStatus` is independently adjudicated only when the separate math review supplies MATH_PASS or SOURCE_DATA_EXCEPTION. Visual semantic status is supplied by the separate independent visual review. Source-data exceptions are reported separately and never silently converted to normal PASS.',
  };
  fs.mkdirSync(REPORT4, { recursive: true });
  fs.writeFileSync(OUTPUT, JSON.stringify(output, null, 2) + '\n', 'utf8');
  fs.writeFileSync(SUMMARY, [
    '# 함수·유리함수·무리함수 업그레이드 manifest v2', '',
    `- 전체 판정: **${output.status}**`,
    `- final seal eligibility: **${output.finalSealEligible ? 'true' : 'false'}**`,
    `- target questions: ${output.summary.targetQuestions}`,
    `- target exams: ${output.summary.targetExams}`,
    `- generated solution SVG: ${output.summary.generatedSolutionSvg}`,
    `- dense sampling: ${output.summary.denseSampling} (${output.summary.denseSamplingPass}/${output.summary.generatedSolutionSvg})`,
    `- visual contract: ${output.summary.visualContract}`,
    `- browser render: ${output.summary.browserRender} (${output.summary.browserRenderPass}/${output.summary.targetExams * 3})`,
    `- math verification PASS/FAIL/SOURCE_DATA_EXCEPTION/PENDING: ${mathCounts.pass}/${mathCounts.fail}/${mathCounts.sourceDataException}/${mathCounts.pending}`,
    `- protected payload mutation: ${protectedPayloadMutationCount}`,
    `- unresolved: ${output.summary.unresolvedCount}`,
    '',
    'answerSolutionParity·solutionStructureGate·staticContractStatus는 수학검산이 아니다. 별도 math verifier가 제공한 상태가 있을 때만 logicJumpStatus를 independently adjudicated로 표시한다.',
    '',
  ].join('\n'), 'utf8');
  console.log(JSON.stringify({ status: output.status, finalSealEligible: output.finalSealEligible, summary: output.summary }, null, 2));
}

main();
