import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const evidenceDir = path.join(root, 'archive/evidence/alive-hold-replacements-20261004');
const groups = [
  {
    source: 'archive/exams/original/high/h2/2final/19_순천여고_2학기_기말_고2_수학II.js',
    evidence: 'archive/evidence/source-intake-math2-20261004/19_순천여고_2학기_기말_고2_수학II.json',
    candidate: 'archive/exams/similar/high/h2/2final/19_순천여고_2학기_기말_고2_수학II_ALIVE대체.js',
    items: [{ qid: 21, concept: '정적분과 두 곡선 사이의 넓이', type: '곡선 두 개로 둘러싸인 대칭 영역의 넓이 합', entry: '교점과 원의 아래쪽 반원을 구해 대칭 적분으로 접근', graph: ['교점 확인', '반원 함수 설정', '0에서 1까지 적분', '대칭으로 두 배'], visualDependency: 'OPTIONAL', transform: '원 중심·반지름과 포물선을 새 값으로 바꾸고 좌우 대칭의 두 영역 합을 묻는다.', answerType: 'expression', canonicalAnswer: 'pi/2-4/3', equivalencePolicy: 'symbolic_equivalence' }],
  },
  {
    source: 'archive/exams/original/high/h2/2final/21_매산여고_2학기_기말_고2_수학II.js',
    evidence: 'archive/evidence/source-intake-math2-20261004/21_매산여고_2학기_기말_고2_수학II.json',
    candidate: 'archive/exams/similar/high/h2/2final/21_매산여고_2학기_기말_고2_수학II_ALIVE대체.js',
    items: [
      { qid: 6, concept: '속도 그래프와 이동 방향·거리', type: '속도 그래프에서 참인 설명 고르기', entry: '속도의 부호와 그래프 넓이를 해석', graph: ['구간별 속도 부호', '방향 전환 시각', '속력 비교', '속도 그래프 넓이로 이동 거리'], visualDependency: 'ESSENTIAL', transform: '새 piecewise-linear 속도 그래프와 다른 시간·진술을 사용하되 그래프 해석 구조를 유지한다.', answerType: 'choice_index', canonicalAnswer: '5', equivalencePolicy: 'exact' },
      { qid: 20, concept: '닮음과 원뿔 내부 직육면체의 부피', type: '원뿔에 내접한 정사각기둥의 주어진 부피에서 변 길이 결정', entry: '높이 단면에서 반지름을 닮음으로 표현', graph: ['높이 h 지정', '단면 반지름 8(1-h/12)', '내접 정사각형 대각선 관계', '부피 방정식과 높이 조건으로 해 선택'], visualDependency: 'OPTIONAL', transform: '확정 가능한 밑면 반지름 8·원뿔 높이 12와 내접 정사각기둥 구조만 사용한다. 가려진 원본 부피값과 무관한 새 값 72를 선택한다.', answerType: 'expression', canonicalAnswer: '2*sqrt(2)', equivalencePolicy: 'symbolic_equivalence' },
    ],
  },
  {
    source: 'archive/exams/original/high/h2/2final/21_순천여고_2학기_기말_고2_수학II.js',
    evidence: 'archive/evidence/source-intake-math2-20261004/21_순천여고_2학기_기말_고2_수학II.json',
    candidate: 'archive/exams/similar/high/h2/2final/21_순천여고_2학기_기말_고2_수학II_ALIVE대체.js',
    items: [
      { qid: 8, concept: '속도·가속도·정적분으로 구한 이동 거리', type: '속도식에서 진술의 참·거짓 판단', entry: '속도식의 근과 부호를 확인', graph: ['속도 부호와 방향 전환', '위치 적분', '가속도 시각', '구간별 이동 거리'], visualDependency: 'OPTIONAL', transform: '속도식을 다른 이차식으로 바꾸고 위치·가속도·거리 판단을 유지한다.', answerType: 'choice_index', canonicalAnswer: '2', equivalencePolicy: 'exact' },
      { qid: 9, concept: '닮음과 관련 변화율', type: '가로등과 사람의 그림자 끝 속도', entry: '닮은 두 삼각형으로 그림자 길이 관계 도출', graph: ['큰·작은 삼각형의 닮음', '거리 변수 구별', '시간 미분'], visualDependency: 'OPTIONAL', transform: '가로등 높이·사람 키·보행 속도를 새 값으로 바꾸고 그림자 끝 속도를 구한다.', answerType: 'choice_index', canonicalAnswer: '4', equivalencePolicy: 'exact' },
      { qid: 10, concept: '위치-시간 그래프와 운동 방향', type: '위치 그래프에서 원점 통과·방향 전환 판단', entry: '그래프의 영점과 기울기 부호 확인', graph: ['그래프의 영점 수', '단조 구간', '기울기 부호 변화'], visualDependency: 'ESSENTIAL', transform: '새 piecewise-linear 위치 그래프의 꼭짓점과 시간 범위를 사용해 원점 통과·방향 진술을 판단한다.', answerType: 'choice_index', canonicalAnswer: '5', equivalencePolicy: 'exact' },
      { qid: 13, concept: '도함수 그래프와 정적분으로 함수값 계산', type: '도함수 그래프에서 두 함수값을 구해 곱하기', entry: '기준점에서 적분으로 함수값 복원', graph: ['도함수의 포물선·직선 구간', '정적분 부호', '기준 함수값 적용', '함숫값 곱'], visualDependency: 'OPTIONAL', transform: '도함수 그래프의 구간식과 기준값을 새로 정해 두 함수값 곱을 묻는다.', answerType: 'choice_index', canonicalAnswer: '3', equivalencePolicy: 'exact' },
      { qid: 15, concept: '두 곡선의 차의 정적분', type: '그래프가 주어진 이차함수와 직선의 적분 차', entry: '두 함수의 차를 적분', graph: ['함수식을 읽기', '적분함수 차로 변환', '구간 끝점 대입'], visualDependency: 'OPTIONAL', transform: '포물선·직선의 식과 적분 구간을 새로 정하고 정적분의 차를 구한다.', answerType: 'choice_index', canonicalAnswer: '1', equivalencePolicy: 'exact' },
    ],
  },
];

const digest = bytes => `sha256:${crypto.createHash('sha256').update(bytes).digest('hex')}`;
const loadWindow = relative => {
  const sandbox = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(root, relative), 'utf8'), sandbox, { timeout: 1000 });
  return sandbox.window;
};
const qrows = [];
for (const group of groups) {
  const sourceBank = loadWindow(group.source), candidateBank = loadWindow(group.candidate);
  const sourceEvidence = JSON.parse(fs.readFileSync(path.join(root, group.evidence), 'utf8'));
  const sourceBytes = fs.readFileSync(path.join(root, group.source));
  const candidateBytes = fs.readFileSync(path.join(root, group.candidate));
  for (const item of group.items) {
    const source = sourceBank.questionBank.find(q => q.id === item.qid);
    const candidate = candidateBank.questionBank.find(q => q.id === item.qid);
    const sourceRow = sourceEvidence.questions.find(q => q.id === item.qid);
    const assetPath = candidate.image ? `archive/${candidate.image}` : null;
    const assetBytes = assetPath ? fs.readFileSync(path.join(root, assetPath)) : null;
    const v1 = { status: 'UNVERIFIED', code: null, blocking: true, evidenceLevel: 'D', method: 'same_author_context_solution', coverage: 'partial', independenceLevel: 'I1_SAME_CONTEXT', evidence: ['정답은 작성자가 직접 유도했으나, 요구된 독립 블라인드 재풀이 증거는 아직 없다.'] };
    const v1b = { status: 'PASS', code: null, blocking: false, evidenceLevel: 'A', method: 'exact_symbolic', coverage: 'complete', independenceLevel: 'I1_SAME_CONTEXT', evidence: ['Python exact checkpoints and exact written derivation agree.'] };
    const v2 = { status: 'UNVERIFIED', code: 'CURRICULUM_BOUNDARY_UNRESOLVED', blocking: true, evidenceLevel: 'D', method: 'not_closed', coverage: 'partial', independenceLevel: 'I1_SAME_CONTEXT', evidence: ['최신 docs/rules manifest와 listed rule hashes가 달라 canonical rule snapshot을 만들지 못했다.'] };
    const v3 = { status: 'UNVERIFIED', code: null, blocking: true, evidenceLevel: 'D', method: 'author_fingerprint_comparison', coverage: 'partial', independenceLevel: 'I1_SAME_CONTEXT', evidence: [item.transform] };
    const v4 = candidate.questionType === '객관식' ? { status: 'UNVERIFIED', code: null, blocking: true, evidenceLevel: 'D', method: 'not_closed', coverage: 'partial', independenceLevel: 'I1_SAME_CONTEXT', evidence: ['보기 5개와 키 인덱스는 기계 대조했으나 각 오답의 독립 오류경로 검토가 닫히지 않았다.'] } : { status: 'NOT_APPLICABLE', code: null, blocking: false, evidenceLevel: 'A', method: 'not_applicable', coverage: 'not_applicable', independenceLevel: 'I1_SAME_CONTEXT', evidence: ['주관식 문항.'] };
    const v5 = { status: 'UNVERIFIED', code: null, blocking: true, evidenceLevel: 'B', method: 'deterministic_svg_and_raster_visual_inspection', coverage: 'partial', independenceLevel: 'I1_SAME_CONTEXT', evidence: ['SVG는 식·좌표에서 결정적으로 생성하고 Python 좌표·교점 검사를 통과했다. raster 재오픈도 확인했으나 production browser render와 독립 visual review는 없다.'] };
    const v6 = { status: 'UNVERIFIED', code: 'ARCHIVE_DUPLICATE_UNVERIFIED', blocking: false, evidenceLevel: 'D', method: 'not_run', coverage: 'not_applicable', independenceLevel: 'I1_SAME_CONTEXT', evidence: ['새 candidate의 Archive 전체 duplicate 검수가 실행되지 않았다.'] };
    const v7 = { status: 'PASS', code: null, blocking: false, evidenceLevel: 'B', method: 'node_check_vm_and_asset_binding', coverage: 'complete', independenceLevel: 'I1_SAME_CONTEXT', evidence: ['3개 JS syntax/VM 및 8개 image 참조·문항 ID 매핑 기계검사가 통과했다.'] };
    qrows.push({
      questionUid: `${candidateBank.examTitle}|${item.qid}`,
      sourceUid: `${sourceBank.examTitle}|${item.qid}`,
      familyId: `family-${sourceBank.examTitle}-q${item.qid}`,
      variantIndex: null,
      mode: 'EXAM_FOLLOWUP', followupKind: 'CONFIRMATION', profile: 'JS_ARCHIVE',
      sourceFingerprint: { sourcePath: group.source, sourceExamTitle: sourceBank.examTitle, sourcePdf: sourceEvidence.sourcePdf, sourcePdfSha256: sourceEvidence.sourcePdfSha256, sourceJsSha256: digest(sourceBytes), sourcePage: sourceRow.sourcePage, bboxPdfPoints: sourceRow.bboxPdfPoints, originalQuestion: source.content, concept: item.concept, problemType: item.type, solutionEntry: item.entry, solutionGraph: item.graph, visualDependency: item.visualDependency, mutableSurface: item.transform, sourceAssetStatus: sourceRow.asset },
      candidate: { candidatePath: group.candidate, candidateJsSha256: digest(candidateBytes), candidateQuestionSha256: digest(Buffer.from(JSON.stringify(candidate))), question: candidate, structuredAnswer: { answerType: item.answerType, canonicalAnswer: item.canonicalAnswer, acceptableAnswers: [], equivalencePolicy: item.equivalencePolicy }, assetPath: assetPath ? assetPath.slice('archive/'.length) : null, assetSha256: assetBytes ? digest(assetBytes) : null },
      conceptKey: '', problemTypeKey: '', templateKey: '', solutionEntry: item.entry, solutionGraph: item.graph,
      difficultyBucket: 'unknown', difficultyVectorSource: 'model_estimated', difficultyVector: {},
      difficultyComparison: { baselineSourceUid: `${sourceBank.examTitle}|${item.qid}`, delta: {}, equivalence: 'UNVERIFIED' },
      visualDependency: item.visualDependency,
      visual: { visualSpecVersion: '0.1', assetType: 'svg', assetRef: assetPath ? assetPath.slice('archive/'.length) : '', renderer: candidate.image ? 'Python deterministic coordinate sampler / SVG and direct raster reopen' : 'none', visualValidator: 'UNVERIFIED' },
      trapTags: [], validators: { V1A_MATH: v1, V1B_COMPUTATIONAL: v1b, V2_CURRICULUM: v2, V3_FIDELITY: v3, V4_DISTRACTOR: v4, V5_VISUAL: v5, V6_DUPLICATE: v6, V7_SERIALIZATION: v7 },
      finalStatus: 'BLOCKED', codes: ['CURRICULUM_BOUNDARY_UNRESOLVED', 'ARCHIVE_DUPLICATE_UNVERIFIED'],
      pipelineRunId: 'alive-hold-replacements-20261004', checkpointId: 'draft-before-freeze', resumeFromStage: 'S1_PREFLIGHT', requiredResource: 'synchronized-current-rule-manifest-and-independent-review', resumePayload: { source: group.source, candidate: group.candidate, qid: item.qid }
    });
  }
}
const output = {
  schemaVersion: 'ALIVE_HOLD_REPLACEMENT_CANDIDATE_AUDIT_v1',
  workBatchId: 'alive-hold-replacements-20261004',
  requestedCount: 8,
  actualCount: qrows.length,
  disposition: 'DRAFT_CANDIDATES_ONLY; originals not replaced because required ALIVE closure is blocked',
  pipelineCore: { initStatus: 'INITIALIZED', initReportedStatus: 'PRODUCTION', prepareStatus: 'BLOCKED_BEFORE_DRAFT_MANIFEST', workflowProfile: 'PAST_EXAM', freezeStatus: 'NOT_CREATED', providerAuditStatus: 'NOT_STARTED', blocker: 'RULE_DRIFT in 11 files listed by docs/rules/MANIFEST.md; common manifest is outside the authorized edit scope', ruleDriftFiles: ['02_PIPELINES/JS_Archive_Scheduled_Worker_Prompt_Canonical_Template_v1.md', '02_PIPELINES/Archive_No_Stop_Pipeline_Final_Debt_v1.md', '01_CANONICAL/JS아카이브_학생용해설_운영규칙_v1.md', '01_CANONICAL/JS아카이브룰북_v2.6.md', '02_PIPELINES/JS_Archive_Automation_Stable_Operating_Contract_v1.md', '02_PIPELINES/Archive_GPT_Artifact_First_Lightweight_v1.md', '02_PIPELINES/Archive_Final_Item_Direct_Replacement_v1.md', '02_PIPELINES/CODEX_Meta_Foundation_단원정리_실행프로토콜_v1.md', '02_PIPELINES/🤖 JS아카이브 발문·보기 추출 프로토콜 v4.md', '02_PIPELINES/수정프로토콜.md', '02_PIPELINES/해설프로토콜.md'] },
  questions: qrows,
};
fs.writeFileSync(path.join(evidenceDir, 'alive-validation-sidecars.json'), `${JSON.stringify(output, null, 2)}\n`, 'utf8');
process.stdout.write(JSON.stringify({ status: 'DRAFT_BLOCKED', count: qrows.length, path: 'archive/evidence/alive-hold-replacements-20261004/alive-validation-sidecars.json' }) + '\n');
