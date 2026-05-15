import { sha256hex } from '../helpers/admin-db.js';
import { canAccessStudent } from '../helpers/foundation-db.js';
import { jsonResponse } from '../helpers/response.js';

async function verifyAuth(request, env) {
  const auth = request.headers.get('Authorization') || '';
  if (!auth.startsWith('Basic ')) return null;
  try {
    const [loginId, password] = atob(auth.slice(6)).split(':');
    const hash = await sha256hex(password);
    const teacher = await env.DB.prepare(
      'SELECT id, name, role FROM teachers WHERE login_id = ? AND password_hash = ?'
    ).bind(loginId, hash).first();
    return teacher || null;
  } catch (e) {
    return null;
  }
}

async function requireTeacher(request, env, teacher) {
  return teacher || await verifyAuth(request, env);
}

const REPORT_ANALYSIS_JSON_SCHEMA = {
  name: 'ap_math_report_analysis',
  schema: {
    type: 'object',
    additionalProperties: false,
    properties: {
      summary: { type: 'string' },
      diagnosis: { type: 'string' },
      wrongAnalysis: { type: 'string' },
      nextPlan: { type: 'string' },
      parentMessage: { type: 'string' },
      kakaoSummary: { type: 'string' },
      teacherMemo: { type: 'string' },
      riskLevel: { type: 'string', enum: ['stable', 'watch', 'focus'] },
      mainWeaknesses: { type: 'array', items: { type: 'string' } },
      nextActions: { type: 'array', items: { type: 'string' } }
    },
    required: ['summary', 'diagnosis', 'wrongAnalysis', 'nextPlan', 'parentMessage', 'kakaoSummary', 'teacherMemo', 'riskLevel', 'mainWeaknesses', 'nextActions']
  },
  strict: true
};

const AP_REPORT_ANALYSIS_SYSTEM_PROMPT = `
너는 AP Math 학원의 학부모 평가 리포트 전담 AI 편집자다.

이번 작업의 핵심은 "새 리포트를 처음부터 다시 쓰는 것"이 아니라, 이미 제공된 기본 리포트 초안을 학부모 발송용으로 더 자연스럽고 신뢰감 있게 개선하는 것이다.
기본 리포트가 가진 성취 중심 톤, 점수/정답률/평균 해석, 우선 보완 문항, 다음 수업 계획을 유지하되, 반복 문장과 딱딱한 표현을 줄이고 문장을 더 전문적으로 다듬는다.

────────────────────────────────────────
[역할 원칙]
────────────────────────────────────────
1. 기본 리포트를 갈아엎지 말고, 더 좋은 학부모용 문장으로 업그레이드한다.
2. 기본 리포트보다 짧거나 허술하게 만들지 않는다.
3. 점수와 오답을 숨기지 않되, 첫인상은 반드시 성취와 안정감으로 시작한다.
4. 오답은 "틀림"이 아니라 "다음 수업에서 확인할 포인트"로 표현한다.
5. 같은 문장, 같은 의미, 같은 단원 나열을 여러 섹션에서 반복하지 않는다.
6. 학부모가 읽었을 때 "학원이 학생을 구체적으로 관리하고 있다"는 느낌이 들어야 한다.

────────────────────────────────────────
[입력 데이터 사용 기준]
────────────────────────────────────────
- student, exam, cohort, questionAnalysis, wrongAnalysis, baseReportDraft, teacherMemo만 근거로 사용한다.
- baseReportDraft가 있으면 반드시 참고한다.
- baseReportDraft의 핵심 사실, 점수, 평균, 정답률, 문항 번호, 단원, 다음 수업 계획을 유지한다.
- 없는 사실을 만들지 않는다.
- 내부 시스템 사정이나 원문 확인 제한을 학부모용 문장에 드러내지 않는다.

────────────────────────────────────────
[절대 금지 표현]
────────────────────────────────────────
- 확인 불가
- 자료 없음
- 데이터 부족
- 아카이브
- 시스템
- 함수
- 코드
- 원문을 불러오지 못함
- 기초가 없다
- 공부를 안 했다
- 심각하다
- 많이 부족하다
- 완전히 틀렸다
- 하위권
- 킬러

위 표현은 학부모용 결과물의 어떤 필드에도 쓰지 않는다.
내부적으로 정보가 부족하더라도 문항 번호, 단원, 정답률, 난도, 풀이 포인트 기준으로 자연스럽게 작성한다.

────────────────────────────────────────
[문항 정답률 해석 기준]
────────────────────────────────────────
- 전체 정답률 85% 이상인데 학생이 틀림: 개념 부족으로 단정하지 말고 조건 확인, 계산 정리, 검산 습관을 우선 점검한다.
- 전체 정답률 65% 이상 85% 미만: 보통 난도의 적용 문항으로 보고 풀이 과정과 조건 적용을 확인한다.
- 전체 정답률 45% 이상 65% 미만: 조건 해석과 개념 연결이 필요한 문항으로 본다.
- 전체 정답률 45% 미만: 난도가 있었던 문항으로 보고 단순 실수로만 보지 않는다.

────────────────────────────────────────
[오답 수에 따른 처리]
────────────────────────────────────────
오답이 0개:
- 전 문항을 정확하게 해결한 성취를 분명히 칭찬한다.
- 전체 정답률이 낮았던 문항까지 해결했다면 깊이 있는 개념 이해와 풀이 집중도를 언급한다.
- 다음 계획은 심화 응용, 풀이 속도, 서술 정리, 다음 단원 확장으로 작성한다.

오답이 1~5개:
- 문항 번호를 자연스럽게 언급한다.
- 각 문항의 의미를 정답률과 단원 기준으로 해석한다.
- 다음 수업에서 풀이 흐름 확인, 조건 표시, 유사 문제 풀이를 진행한다고 작성한다.

오답이 6개 이상:
- 모든 오답을 길게 나열하지 않는다.
- 맞출 수 있었던 문항과 핵심 보완 문항을 우선 정리한다.
- 학부모가 좌절감을 느끼지 않도록 우선순위를 정해 차근차근 보완한다는 방향으로 작성한다.
- 클리닉, 오답 노트, 유사 문제를 통한 순차 관리 계획을 포함한다.

────────────────────────────────────────
[출력 필드별 기준]
────────────────────────────────────────
summary:
- 2~3문장, 120자 이상.
- 학생 이름, 평가명, 점수를 포함한다.
- 성취를 먼저 말하고, 마지막에 다음 수업 연결을 짧게 제시한다.

diagnosis:
- 4~6문장, 260자 이상.
- 점수 위치, 평균 비교, 정답률 구조, 성취 포인트, 보완 포인트를 균형 있게 작성한다.
- summary와 같은 문장을 그대로 반복하지 않는다.

wrongAnalysis:
- 220자 이상.
- 오답이 있으면 핵심 문항 번호와 단원을 언급하되 부정적으로 몰아가지 않는다.
- 오답이 없으면 우수 해결 문항과 안정적인 풀이 습관을 분석한다.
- diagnosis와 같은 문장으로 시작하지 않는다.

nextPlan:
- 4~6문장, 240자 이상.
- 다음 수업에서 실제로 할 조치를 순서 있게 작성한다.
- nextActions를 그대로 이어붙인 문장이 아니라 자연스러운 문단이어야 한다.
- 풀이 과정 확인, 조건 표시, 식 세우기, 검산, 유사 문제, 클리닉 중 필요한 조치를 포함한다.

parentMessage:
- 6~9문장, 420자 이상.
- 순서: 성취 확인 → 평가 해석 → 우선 보완 포인트 → 학원 조치 → 가정 확인 1개 → 마무리.
- 학부모가 안심하고 맡길 수 있는 정중한 문체로 작성한다.
- 같은 문장을 diagnosis나 nextPlan에서 복사하지 않는다.

kakaoSummary:
- 반드시 "안녕하세요, AP수학입니다."로 시작한다.
- 6~10줄 내외.
- 점수, 성취, 핵심 보완, 다음 수업 계획, PDF 확인 안내를 포함한다.
- 내부 보고서식 제목이나 딱딱한 항목 나열만으로 끝내지 않는다.

teacherMemo:
- 내부 교사용으로 2~4문장.
- 다음 수업에서 볼 핵심 포인트를 압축한다.

riskLevel:
- stable, watch, focus 중 하나.
- 단, 학부모용 문장에서는 위험하다는 식의 표현을 쓰지 않는다.

mainWeaknesses:
- 2~5개.
- "약점"이라기보다 확인 포인트를 구체적인 구 형태로 작성한다.

nextActions:
- 3~5개.
- 실제 수업 행동으로 작성한다.
- nextPlan과 같은 문장을 복사하지 말고, 짧은 실행 항목으로 작성한다.

출력은 반드시 JSON 객체만 한다.
마크다운, 코드블록, 설명 문장, 주석은 출력하지 않는다.
`;

function clampText(value, max = 12000) {
  const text = String(value || '');
  return text.length > max ? text.slice(0, max) : text;
}

function buildReportWritingSeeds(payload = {}) {
  const asNumber = (value) => {
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  };
  const hashText = (text) => {
    let hash = 0;
    const raw = String(text || '');
    for (let i = 0; i < raw.length; i++) {
      hash = ((hash << 5) - hash + raw.charCodeAt(i)) | 0;
    }
    return Math.abs(hash);
  };
  const pick = (items, seed, fallback = '') => {
    if (!items.length) return fallback;
    return items[Math.abs(seed) % items.length];
  };
  const addUnique = (arr, value) => {
    if (value && !arr.includes(value)) arr.push(value);
  };
  const unique = (arr) => [...new Set((arr || []).filter(Boolean))];
  const shuffleSeeded = (items, seed) => {
    const arr = [...items];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = (seed + i * 31 + hashText(arr[i])) % (i + 1);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const wrongRows = Array.isArray(payload?.wrongAnalysis) && payload.wrongAnalysis.length
    ? payload.wrongAnalysis
    : (Array.isArray(payload?.questionAnalysis) ? payload.questionAnalysis.filter(r => r?.isStudentWrong) : []);
  const wrongCount = wrongRows.length;
  const studentId = payload?.student?.id || payload?.student?.name || '';
  const examId = payload?.exam?.id || '';
  const examDate = payload?.exam?.date || '';
  const examTitle = payload?.exam?.title || '';
  const today = new Date().toISOString().slice(0, 10);
  const seedSource = `${studentId}|${examId}|${examDate}|${examTitle}|${today}`;
  const variabilitySeed = hashText(seedSource);
  const score = asNumber(payload?.exam?.score);
  const overallAverage = asNumber(payload?.cohort?.overallAverage);
  const classAverage = asNumber(payload?.cohort?.classAverage);
  const recentAverage = asNumber(payload?.baseReportDraft?.metrics?.recentAverage);

  const buckets = {
    careless: 0,
    conceptApply: 0,
    interpretation: 0,
    strategy: 0,
    unknown: 0
  };
  for (const row of wrongRows) {
    const rate = asNumber(row?.correctRate);
    if (rate === null) buckets.unknown += 1;
    else if (rate >= 85) buckets.careless += 1;
    else if (rate >= 65) buckets.conceptApply += 1;
    else if (rate >= 45) buckets.interpretation += 1;
    else buckets.strategy += 1;
  }

  const unitCounts = {};
  for (const row of wrongRows) {
    const unit = String(row?.unit || row?.unitKey || row?.course || '').trim();
    if (unit) unitCounts[unit] = (unitCounts[unit] || 0) + 1;
  }
  const unitFocus = Object.entries(unitCounts).sort((a, b) => b[1] - a[1]).map(([unit]) => unit).slice(0, 3);
  const topUnitCount = unitFocus.length ? unitCounts[unitFocus[0]] : 0;
  const spreadType = wrongCount && (unitFocus.length <= 2 || topUnitCount >= Math.max(2, Math.ceil(wrongCount * 0.55)))
    ? 'concentrated'
    : 'distributed';
  const unitFocusMessage = !wrongCount
    ? '오답 없이 안정적으로 해결해 정확도 유지와 심화 확장에 초점을 둡니다.'
    : spreadType === 'concentrated'
      ? `${unitFocus.slice(0, 2).join(', ') || '핵심 단원'}에서 확인 포인트가 모여 있어 해당 단원 흐름을 우선 정리하겠습니다.`
      : '여러 단원에 오답이 분산되어 있어 풀이 습관과 조건 정리를 함께 확인하겠습니다.';

  const compareText = (label, average) => {
    if (score === null || average === null) return `${label} 비교 기준 없음`;
    if (score > average + 5) return `${label}보다 안정적으로 높음`;
    if (score < average - 5) return `${label}보다 낮아 우선 보완 필요`;
    return `${label}과 비슷한 수준`;
  };
  const scorePosition = [
    compareText('전체 평균', overallAverage),
    compareText('반 평균', classAverage)
  ].join(' / ');
  const isAboveAverage = score !== null && (
    (overallAverage !== null && score > overallAverage + 5) ||
    (classAverage !== null && score > classAverage + 5)
  );
  const isBelowAverage = score !== null && (
    (overallAverage !== null && score < overallAverage - 5) ||
    (classAverage !== null && score < classAverage - 5)
  );
  const isClassBelowOverallSimilar = score !== null && classAverage !== null && overallAverage !== null
    && score < classAverage - 5
    && Math.abs(score - overallAverage) <= 5;
  const isHighScore = score !== null && score >= 90;

  let recentTrend = '최근 흐름 비교 기준 없음';
  if (score !== null && recentAverage !== null) {
    if (score > recentAverage + 3) recentTrend = `최근 평균 ${recentAverage}점 대비 상승 흐름`;
    else if (score < recentAverage - 3) recentTrend = `최근 평균 ${recentAverage}점 대비 하락 흐름`;
    else recentTrend = `최근 평균 ${recentAverage}점과 비슷하게 유지`;
  }

  const errorCounts = {
    careless: buckets.careless,
    conceptGap: buckets.conceptApply,
    interpretation: buckets.interpretation,
    strategy: buckets.strategy
  };
  const topError = Object.entries(errorCounts).sort((a, b) => b[1] - a[1])[0] || ['mixed', 0];
  const activeErrorTypes = Object.values(errorCounts).filter(v => v > 0).length;
  const errorType = !wrongCount ? 'careless' : activeErrorTypes > 1 ? 'mixed' : topError[0];
  let difficultyBias = 'mixedDifficulty';
  if (wrongCount && buckets.careless && buckets.careless >= wrongCount * 0.6) difficultyBias = 'easyMistake';
  else if (wrongCount && (buckets.conceptApply + buckets.interpretation) >= wrongCount * 0.6) difficultyBias = 'midWeak';
  else if (wrongCount && buckets.strategy >= wrongCount * 0.6) difficultyBias = 'hardOnly';

  const wrongPatternSummaryParts = [];
  if (!wrongCount) wrongPatternSummaryParts.push('오답 없이 안정적으로 해결');
  if (buckets.careless) wrongPatternSummaryParts.push(`careless ${buckets.careless}문항: 조건 확인과 검산`);
  if (buckets.conceptApply) wrongPatternSummaryParts.push(`conceptApply ${buckets.conceptApply}문항: 개념 적용과 풀이 과정`);
  if (buckets.interpretation) wrongPatternSummaryParts.push(`interpretation ${buckets.interpretation}문항: 조건 해석과 개념 연결`);
  if (buckets.strategy) wrongPatternSummaryParts.push(`strategy ${buckets.strategy}문항: 고난도 접근 순서`);
  if (buckets.unknown && wrongCount) wrongPatternSummaryParts.push(`정답률 미확정 ${buckets.unknown}문항: 풀이 흔적 중심 확인`);
  const wrongPattern = {
    errorType,
    spreadType,
    difficultyBias,
    summary: wrongPatternSummaryParts.join(' / ')
  };

  let toneCandidates = [];
  if (!wrongCount) toneCandidates = ['achievement', 'growth'];
  else if (wrongCount <= 3) toneCandidates = ['stable', 'counseling'];
  else if (wrongCount <= 5) toneCandidates = ['counseling', 'management'];
  else toneCandidates = ['management'];
  if (isAboveAverage) toneCandidates = ['growth', 'achievement', ...toneCandidates];
  if (isBelowAverage) toneCandidates = ['counseling', 'management', ...toneCandidates];
  const toneVariant = pick(unique(toneCandidates), variabilitySeed, 'stable');

  let expressionCandidates = [];
  if (!wrongCount) expressionCandidates = ['achievementHighlight', 'growthNarrative'];
  else if (wrongCount <= 3) expressionCandidates = ['conciseWarm', 'parentCounselStyle', 'preciseDiagnostic'];
  else if (wrongCount <= 5) expressionCandidates = ['parentCounselStyle', 'calmManagement'];
  else expressionCandidates = ['calmManagement', 'recoveryPlan'];
  if (isAboveAverage) expressionCandidates = ['achievementHighlight', 'growthNarrative', ...expressionCandidates];
  if (isBelowAverage) expressionCandidates = ['calmManagement', 'recoveryPlan', ...expressionCandidates];
  if (isClassBelowOverallSimilar) expressionCandidates = ['parentCounselStyle', 'preciseDiagnostic', ...expressionCandidates];
  const expressionVariant = pick(unique(expressionCandidates), variabilitySeed + wrongCount, 'parentCounselStyle');

  const patternByExpression = {
    achievementHighlight: ['resultFirst', 'progressFirst'],
    growthNarrative: ['progressFirst', 'learningFlowFirst'],
    conciseWarm: ['resultFirst', 'learningFlowFirst'],
    teacherMemoStyle: ['learningFlowFirst', 'actionPlanFirst'],
    parentCounselStyle: ['progressFirst', 'comparisonFirst'],
    preciseDiagnostic: ['comparisonFirst', 'resultFirst'],
    calmManagement: ['actionPlanFirst', 'learningFlowFirst'],
    recoveryPlan: ['actionPlanFirst', 'progressFirst']
  };
  const sentencePatternSeed = pick(patternByExpression[expressionVariant] || ['resultFirst'], variabilitySeed + 7, 'resultFirst');
  const openingHookType = pick({
    resultFirst: ['scoreHighlight', 'effortObservation'],
    progressFirst: ['effortObservation', 'scoreHighlight'],
    comparisonFirst: ['comparisonInsight', 'effortObservation'],
    learningFlowFirst: ['unitFocusStart', 'effortObservation'],
    actionPlanFirst: ['mistakeInsight', 'unitFocusStart']
  }[sentencePatternSeed] || ['scoreHighlight'], variabilitySeed + 11, 'scoreHighlight');
  const connectorStyle = pick(['direct', 'explanatory', 'contrastive', 'stepwise'], variabilitySeed + wrongCount + 17, 'direct');
  let detailDensityCandidates = wrongCount <= 3 ? ['balanced', 'detailed'] : ['balanced'];
  if (wrongCount >= 6) detailDensityCandidates = ['compact', 'balanced'];
  if (isHighScore || isAboveAverage) detailDensityCandidates = ['detailed', ...detailDensityCandidates];
  if (isBelowAverage || wrongCount >= 6) detailDensityCandidates = ['compact', 'balanced', ...detailDensityCandidates];
  const detailDensity = pick(unique(detailDensityCandidates), variabilitySeed + 19, 'balanced');

  const repetitionGuard = [];
  if (buckets.careless) {
    addUnique(repetitionGuard, '조건 확인');
    addUnique(repetitionGuard, '계산 정확도');
  }
  if (buckets.conceptApply) addUnique(repetitionGuard, '개념 적용');
  if (buckets.interpretation) {
    addUnique(repetitionGuard, '조건 해석');
    addUnique(repetitionGuard, '개념 연결');
  }
  if (buckets.strategy) addUnique(repetitionGuard, '접근 순서');
  if (spreadType === 'concentrated' && wrongCount) addUnique(repetitionGuard, '단원 집중');
  if (spreadType === 'distributed' && wrongCount) addUnique(repetitionGuard, '풀이 습관');
  if (!wrongCount) {
    addUnique(repetitionGuard, '정확도 유지');
    addUnique(repetitionGuard, '심화 확장');
  }

  const actionWeights = {
    careless: ['조건 표시 훈련', '계산 검산 루틴 점검', '풀이 과정 재확인', '유사 문제 2~3개 확인'],
    conceptGap: ['식 세우기 훈련', '유사 문제 2~3개 확인', '오답노트 정리', '풀이 과정 재확인'],
    interpretation: ['조건 표시 훈련', '식 세우기 훈련', '풀이 과정 재확인', '유사 문제 2~3개 확인'],
    strategy: ['풀이 과정 재확인', '유사 문제 2~3개 확인', '클리닉 연계', '오답노트 정리'],
    mixed: ['풀이 과정 재확인', '조건 표시 훈련', '유사 문제 2~3개 확인', '오답노트 정리']
  };
  const actionPool = unique([
    ...(actionWeights[errorType] || actionWeights.mixed),
    ...(wrongCount ? [] : ['다음 단원 연결', '유사 문제 2~3개 확인']),
    ...(wrongCount >= 4 ? ['오답노트 정리', '클리닉 연계'] : []),
    '다음 단원 연결'
  ]);
  const actionLimit = wrongCount >= 6 ? 5 : wrongCount >= 4 ? 4 : 3;
  const priorityActions = shuffleSeeded(actionPool, variabilitySeed + 23).slice(0, actionLimit);
  while (priorityActions.length < 3) addUnique(priorityActions, ['풀이 과정 재확인', '조건 표시 훈련', '유사 문제 2~3개 확인'][priorityActions.length]);

  const parentGuideMap = {
    careless: ['문제 조건에 표시하는 습관만 가볍게 확인', '풀이 후 검산 여부만 격려'],
    conceptGap: ['오답을 다시 풀게 하기보다 풀이 흔적을 확인', '가정 부담 없이 학원에서 보완 예정임을 안내'],
    interpretation: ['문제 조건에 표시하는 습관만 가볍게 확인', '오답을 다시 풀게 하기보다 풀이 흔적을 확인'],
    strategy: ['가정 부담 없이 학원에서 보완 예정임을 안내', '오답을 다시 풀게 하기보다 풀이 흔적을 확인'],
    mixed: ['가정 부담 없이 학원에서 보완 예정임을 안내', '풀이 후 검산 여부만 격려']
  };
  const parentGuide = pick(parentGuideMap[errorType] || parentGuideMap.mixed, variabilitySeed + 29, '가정 부담 없이 학원에서 보완 예정임을 안내');
  const parentGuideTone = pick(
    wrongCount >= 6 ? ['reassurance', 'academyLead'] : errorType === 'careless' ? ['lightCheck', 'habitFocus'] : ['habitFocus', 'academyLead', 'reassurance'],
    variabilitySeed + 31,
    'reassurance'
  );
  const openingStyle = pick({
    achievement: ['achievementStart', 'learningFlowStart'],
    growth: ['achievementStart', 'learningFlowStart'],
    stable: ['calmStart', 'learningFlowStart'],
    counseling: ['counselingStart', 'comparisonStart'],
    management: ['counselingStart', 'learningFlowStart']
  }[toneVariant] || ['calmStart'], variabilitySeed + 37, 'calmStart');
  const closingStyle = pick(
    !wrongCount ? ['achievementWrap', 'forwardPlan'] : wrongCount >= 6 ? ['reassurance', 'parentTrust'] : ['forwardPlan', 'parentTrust'],
    variabilitySeed + 41,
    'forwardPlan'
  );

  return {
    variabilitySeed,
    toneVariant,
    expressionVariant,
    sentencePatternSeed,
    openingHookType,
    connectorStyle,
    detailDensity,
    repetitionGuard: repetitionGuard.slice(0, 4),
    scorePosition,
    recentTrend,
    wrongPattern,
    unitFocus,
    unitFocusMessage,
    priorityActions: priorityActions.slice(0, 5),
    parentGuide,
    parentGuideTone,
    openingStyle,
    closingStyle,
    sentenceAvoidList: [
      '이번 평가는',
      '다음 수업에서는',
      '학원에서는',
      '오답은',
      '부족합니다',
      '확인 불가',
      '자료 없음',
      '아카이브',
      '시스템',
      '함수',
      '코드',
      'AI',
      'Gemini',
      '분석 엔진'
    ],
    microVariationRules: [
      '같은 접속어를 두 문장 연속 사용하지 않는다.',
      '동일 어휘를 반복하지 않는다. 예: 안정적으로, 전반적으로, 확인, 보완',
      '짧은 문장과 긴 문장을 섞는다.',
      'summary와 parentMessage는 같은 문장 구조로 시작하지 않는다.',
      'diagnosis와 nextPlan은 같은 내용을 반복하지 않는다.',
      '최소 1문장은 수식이나 수치 없이 직관적으로 표현한다.',
      '학부모에게 부담을 주는 지시는 1개만 쓴다.'
    ]
  };
}

function buildLearningLifeSeeds(payload = {}) {
  const asNumber = (value) => {
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  };
  const hashText = (text) => {
    let hash = 0;
    const raw = String(text || '');
    for (let i = 0; i < raw.length; i++) {
      hash = ((hash << 5) - hash + raw.charCodeAt(i)) | 0;
    }
    return Math.abs(hash);
  };
  const textIncludesAny = (text, words) => words.some(word => text.includes(word));
  const studentName = payload?.student?.name || payload?.student?.id || '학생';
  const score = asNumber(payload?.exam?.score);
  const overallAverage = asNumber(payload?.cohort?.overallAverage);
  const wrongRows = Array.isArray(payload?.wrongAnalysis) && payload.wrongAnalysis.length
    ? payload.wrongAnalysis
    : (Array.isArray(payload?.questionAnalysis) ? payload.questionAnalysis.filter(r => r?.isStudentWrong) : []);
  const wrongCount = asNumber(payload?.baseReportDraft?.metrics?.wrongCount) ?? wrongRows.length;
  const questionCount = asNumber(payload?.exam?.questionCount || payload?.baseReportDraft?.metrics?.questionCount);
  const explicitCorrectRate = asNumber(
    payload?.exam?.correctRate ??
    payload?.baseReportDraft?.metrics?.correctRate ??
    payload?.cohort?.correctRate
  );
  const correctRate = explicitCorrectRate !== null
    ? (explicitCorrectRate <= 1 ? explicitCorrectRate * 100 : explicitCorrectRate)
    : questionCount ? ((questionCount - wrongCount) / questionCount) * 100 : null;
  const wrongRatio = questionCount ? wrongCount / questionCount : null;
  const teacherMemo = String(payload?.teacherMemo || payload?.baseReportDraft?.teacherMemo || '').trim();
  const draftText = [
    payload?.attendance,
    payload?.homework,
    payload?.clinic,
    payload?.student?.attendance,
    payload?.student?.homework,
    payload?.baseReportDraft?.parentMessage,
    payload?.baseReportDraft?.teacherMemo,
    payload?.baseReportDraft?.kakaoSummary,
    Array.isArray(payload?.baseReportDraft?.diagnosis) ? payload.baseReportDraft.diagnosis.join(' ') : payload?.baseReportDraft?.diagnosis,
    teacherMemo
  ].filter(Boolean).join(' ');
  const lowerScoreSupportMode = (
    (score !== null && overallAverage !== null && score <= overallAverage - 10) ||
    wrongCount >= 6 ||
    (questionCount && correctRate !== null && correctRate < 65) ||
    (wrongRatio !== null && wrongRatio >= 0.35)
  );
  const highScore = score !== null && score >= 90 && wrongCount <= 1 && !lowerScoreSupportMode;
  const midScore = !highScore && !lowerScoreSupportMode;
  const hasClinicEvidence = textIncludesAny(draftText, ['클리닉', '보강', '오답노트']);

  const attendanceTone = textIncludesAny(draftText, ['결석', '지각', '빠진', '늦게', '조퇴'])
    ? '빠진 부분은 다음 수업에서 보완하겠습니다.'
    : textIncludesAny(draftText, ['등원', '출석', '참여'])
      ? '수업 참여 흐름은 유지되고 있습니다.'
      : '수업 안에서 필요한 부분을 계속 확인하겠습니다.';

  const homeworkTone = textIncludesAny(draftText, ['숙제 완료', '숙제도 잘', '과제 완료', '잘 챙겨'])
    ? '숙제 흐름은 비교적 잘 이어가고 있습니다.'
    : textIncludesAny(draftText, ['숙제는 일부', '미완료', '숙제 부족', '과제 미완'])
      ? '숙제 완성도는 조금씩 다시 잡아가겠습니다.'
      : '과제와 풀이 습관을 함께 확인하겠습니다.';

  const effortToneCandidates = [
    '현재 학습 흐름을 안정적으로 이어갈 수 있도록 돕고 있습니다.',
    '학생의 학습 리듬을 고려해 무리 없이 진행하고 있습니다.',
    '꾸준한 흐름을 유지하는 데 초점을 맞춰 지도하고 있습니다.',
    '학생의 현재 상태에 맞춘 속도로 학습을 이어가고 있습니다.',
    '결과만 보지 않고 수업 안에서의 이해도와 풀이 과정을 함께 보고 있습니다.',
    '학생이 다시 자신감을 가질 수 있도록 작은 확인부터 차근차근 진행하겠습니다.'
  ];
  const effortTone = teacherMemo && textIncludesAny(teacherMemo, ['열심', '성실', '집중', '노력', '좋', '적극'])
    ? `담당 선생님 메모에 확인된 ${studentName} 학생의 긍정적인 수업 태도를 자연스럽게 반영합니다.`
    : lowerScoreSupportMode
      ? '학습 루틴을 다시 세울 수 있는 단계로 보고 차근차근 관리하겠습니다.'
      : effortToneCandidates[hashText(studentName) % effortToneCandidates.length];

  const clinicToneCandidates = hasClinicEvidence ? [
    '필요한 경우 클리닉과 오답노트를 통해 순차적으로 관리하겠습니다.',
    '필요하면 클리닉과 오답노트를 활용해 약한 부분을 하나씩 채워가겠습니다.',
    '보강과 클리닉을 적절히 활용하면서 약한 부분을 하나씩 채워나가고 있습니다.'
  ] : [
    '필요한 부분은 수업과 클리닉 시간을 통해 순서대로 확인하겠습니다.',
    '수업 안에서 풀이 습관을 다시 잡아가겠습니다.',
    '학원에서 개념 확인과 유사 문제를 병행하며 관리하겠습니다.',
    '필요한 부분은 추가 설명과 반복 연습을 통해 보완하겠습니다.',
    '이해가 부족했던 부분은 수업 안에서 충분히 다시 다루겠습니다.',
    '확인이 필요한 내용은 단계적으로 다시 점검하겠습니다.',
    '한꺼번에 많은 양을 몰아가기보다 우선순위를 정해 순서대로 보완하겠습니다.'
  ];
  const clinicTone = hasClinicEvidence
    ? '필요한 부분은 클리닉과 오답노트를 통해 순차적으로 관리하겠습니다.'
    : clinicToneCandidates[hashText(`${studentName}|clinic`) % clinicToneCandidates.length];

  const classParticipationTone = teacherMemo && textIncludesAny(teacherMemo, ['참여', '발표', '질문', '집중', '수업'])
    ? '수업 중 확인된 참여 흐름을 결과 해석과 함께 연결합니다.'
    : '수업 안에서 풀이 습관을 다시 잡아가겠습니다.';

  const positiveAnchors = lowerScoreSupportMode ? [
    '이번 평가는 단순히 점수를 확인하는 것이 아니라, 어떤 부분을 먼저 정리하면 좋을지 확인하는 자료로 보시면 좋겠습니다.',
    '점수보다 지금 필요한 학습 점검 포인트와 회복 순서를 확인하는 데 의미를 두고 있습니다.',
    '이번 결과는 부족을 지적하기보다 앞으로 어떤 순서로 다시 정리할지 확인하는 자료입니다.',
    '현재는 결과 자체보다 수업 안에서 다시 정리할 수 있는 지점을 차근차근 잡아가는 것이 중요합니다.',
    '이번 경험을 바탕으로 다음 수업에서는 한 단계 더 성장한 모습을 기대하고 있습니다.',
    '아직 발전의 여지가 많은 시점이기 때문에, 지금부터의 관리 방향이 매우 중요합니다.',
    '기본을 다시 다지는 과정이 곧 더 큰 성장을 만들어 낼 기반이 됩니다.',
    '천천히, 그러나 확실하게 성장해 나가는 과정으로 함께 만들어 가겠습니다.',
    '현재는 회복의 전환점이 될 수 있는 좋은 기회로 보고 있습니다.',
    '점수만으로 학습 가능성을 판단하기보다, 지금은 풀이 습관을 다시 잡기 좋은 시점입니다.',
    '이번 리포트는 부족한 점을 지적하기보다, 다음 수업에서 어떤 순서로 회복할지 정리한 자료입니다.',
    '지금 단계의 점검은 이후 성장을 위한 중요한 준비 과정으로 보고 있습니다.',
    '현재 흐름을 차근차근 정리하면 다음 평가에서는 더 안정적인 결과로 이어질 수 있습니다.',
    '방향만 잘 잡아주면 충분히 좋은 흐름으로 이어질 수 있는 상태입니다.',
    '이번 평가를 통해 앞으로 어떤 부분을 먼저 잡아야 할지가 더 분명해졌습니다.',
    '지금은 결과만 보기보다 학습 흐름을 다시 정리하는 데 의미를 두고 있습니다.',
    '기본을 다시 다지는 과정이 앞으로의 성장을 만드는 중요한 기반이 됩니다.',
    '현재는 회복의 방향을 잡아가기 좋은 시점으로 보고 있습니다.',
    '천천히, 그러나 확실하게 학습 흐름을 다시 만들어가겠습니다.'
  ] : highScore ? [
    '현재 성취를 바탕으로 심화 확장까지 자연스럽게 이어갈 수 있습니다.',
    '정확도를 유지하면서 난도 있는 유형까지 넓혀갈 수 있는 흐름입니다.'
  ] : [
    '지금은 실수 교정과 풀이 습관 정리만으로도 상승 여지를 만들 수 있는 단계입니다.',
    '현재 흐름을 유지하면서 확인 포인트를 줄이면 더 안정적인 결과로 이어질 수 있습니다.'
  ];

  const parentReassurances = lowerScoreSupportMode ? [
    '가정에서는 확인할 문항을 많이 다시 풀리기보다, 문제를 풀 때 조건에 표시하는 습관만 자연스럽게 격려해 주시면 충분합니다.',
    '학원에서 방향을 잡아가고 있으니 편안한 마음으로 지켜봐 주시면 감사하겠습니다.',
    '가정에서는 부담을 크게 주시기보다, 학원에서 잡아가는 회복 순서를 믿고 응원해 주시면 좋겠습니다.',
    '학원에서 체계적으로 순서를 잡아 관리해 드릴 테니, 가정에서는 너무 걱정하지 않으셔도 됩니다.',
    '아이의 성장 속도를 믿고, 학원 관리 계획을 함께 응원해 주시면 큰 힘이 됩니다.',
    '지금은 과정에 집중하는 시기입니다. 학원에서 세심하게 챙겨드리겠습니다.',
    '빠른 결과보다는 꾸준한 습관 형성에 초점을 맞춰 함께 나아가겠습니다.',
    '학원과 가정이 함께 응원한다면 충분히 좋은 방향으로 나아갈 수 있습니다.',
    '가정에서 부담을 크게 주시기보다, 학원에서 정리할 부분을 믿고 맡겨주시면 됩니다.',
    '현재는 결과를 질책하기보다 풀이 과정을 다시 세우는 것이 더 중요합니다.',
    '현재 상태를 충분히 고려해 무리하지 않는 범위에서 차근차근 관리하겠습니다.',
    '아이의 현재 학습 흐름에 맞춰 안정적으로 지도해 나가겠습니다.',
    '지금 단계에서는 부담을 주기보다 학습 흐름을 유지하는 것이 더 중요하다고 보고 있습니다.',
    '학원에서 방향을 잡아가고 있으니, 가정에서는 편안하게 지켜봐 주셔도 됩니다.',
    '아이의 컨디션과 학습 상태를 함께 살피며 균형 있게 지도하겠습니다.',
    '조급하게 몰아가기보다 안정적인 학습 루틴을 만드는 데 집중하겠습니다.',
    '가정에서는 너무 걱정하시기보다, 아이가 차분히 다시 정리할 수 있도록 격려해 주시면 좋겠습니다.',
    '학원에서 우선순위를 잡아 관리하겠습니다. 가정에서는 부담 없이 응원만 해주셔도 충분합니다.'
  ] : [
    '가정에서는 풀이 흔적을 가볍게 확인해 주시는 정도면 충분합니다.',
    '학원에서 다음 학습 흐름까지 이어서 관리하겠습니다.'
  ];

  const teacherCareMessages = lowerScoreSupportMode ? [
    '학원에서는 확인할 문항들을 차근차근 다시 풀어보며 조건 확인과 계산 검산 습관을 잡아가겠습니다.',
    '수업 안에서 다시 정리할 수 있는 지점을 먼저 확인하고, 이후 유사 문제로 풀이 흐름을 안정화하겠습니다.',
    '수업 안에서 확인되는 긍정적인 태도는 먼저 살리고, 그 흐름 위에서 확인할 문항을 순서대로 관리하겠습니다.',
    '다음 수업에서는 맞춘 문항의 자신감을 먼저 키우고, 그 기반 위에 새로운 내용을 쌓아가겠습니다.',
    '조금씩이라도 꾸준히 개선점을 쌓아가다 보면 눈에 보이는 변화가 생길 것입니다.',
    '오답을 기회로 삼아 풀이 루틴을 한 단계씩 정리해 나가겠습니다.',
    '수업 안에서 개념 연결, 풀이 과정, 유사 문제 적용 순서로 차근차근 진행하겠습니다.',
    '학생이 자신감을 회복할 수 있도록 세심하게 피드백하며 함께 성장하겠습니다.',
    '맞출 수 있었던 문항부터 회복하고, 이후 난도 있는 문항으로 이어가겠습니다.',
    '조건 표시, 식 세우기, 계산 정리 순서로 풀이 루틴을 다시 잡겠습니다.',
    hasClinicEvidence ? '필요한 경우 클리닉과 오답노트를 통해 순차적으로 관리하겠습니다.' : '필요한 부분은 수업 안에서 단계적으로 다시 확인하겠습니다.',
    '학생의 현재 이해도를 기준으로 난도를 조절하며 수업을 진행하겠습니다.',
    '수업 중 바로 피드백하며 풀이 흐름을 자연스럽게 교정하겠습니다.',
    '작은 성공 경험을 쌓을 수 있도록 문제 난도를 세심하게 조절하겠습니다.',
    '이해한 내용이 실제 문제 풀이로 이어지도록 반복해서 확인하겠습니다.',
    '학생의 반응을 보며 설명 방식과 속도를 유연하게 조정하겠습니다.',
    '풀이 과정에서 막히는 지점을 수업 안에서 바로 확인하고 정리하겠습니다.'
  ] : [
    '풀이 과정 확인과 유사 문제를 병행하며 다음 단원으로 안정적으로 연결하겠습니다.',
    '현재 성취를 유지하면서 확인이 필요한 유형만 짧게 보완하겠습니다.'
  ];

  const growthPotentials = highScore ? [
    '고득점 학생은 심화 확장 가능성 중심으로 작성한다.',
    '현재의 정확도를 유지하면 심화 응용까지 안정적으로 넓혀갈 수 있습니다.'
  ] : midScore ? [
    '중위권 학생은 실수 교정 후 상승 가능성 중심으로 작성한다.',
    '현재 흐름이 안정되면 점수 상승도 자연스럽게 따라올 수 있는 상태입니다.',
    '기본 흐름이 잡히는 시점부터 성적 변화가 나타날 가능성이 충분합니다.',
    '학습 리듬이 안정되면 좋은 결과로 이어질 가능성이 충분합니다.'
  ] : [
    '하위권 학생은 기본 루틴 회복 후 점진적 향상 가능성 중심으로 작성한다.',
    '기본 루틴이 안정화되면 중상위권으로 충분히 도약할 수 있는 잠재력을 가지고 있습니다.',
    '지금의 경험을 발판 삼아 꾸준히 관리한다면 안정적인 성적 회복이 가능합니다.',
    '학습 습관이 자리 잡히기 시작하면 성장 속도가 더욱 빨라질 학생입니다.',
    '회복의 기틀만 잘 다지면 앞으로 큰 폭의 성장을 기대할 수 있는 단계입니다.',
    '지속적인 관리와 작은 성공 경험을 쌓는다면 자연스럽게 상위권 역량까지 열릴 수 있습니다.',
    '작은 성공 경험이 쌓이면 자신감과 정확도가 함께 올라올 수 있습니다.'
  ];

  const nextStepCandidates = lowerScoreSupportMode ? [
    '확인할 문항을 차근차근 다시 풀어보며 조건 확인, 계산 검산, 유사 문제 순서로 관리하겠습니다.',
    '점수보다 풀이 습관 점검을 우선으로 두고, 수업 안에서 회복 순서를 함께 잡아가겠습니다.',
    '수업 참여, 숙제 피드백, 오답 정리, 유사 문제 연습 순서로 관리하겠습니다.',
    '수업에서 조건 표시 습관을 먼저 잡고, 이를 바탕으로 정확도 높이는 연습을 병행하겠습니다.',
    hasClinicEvidence ? '클리닉 시간 활용과 오답노트 공유를 통해 다음 테스트에서 개선된 모습을 확인하겠습니다.' : '수업 안에서 확인 문항을 정리하고 유사 문제로 개선 흐름을 확인하겠습니다.',
    '학원 수업 안에서 실수 패턴을 함께 분석하고, 예방 루틴을 만들어 가겠습니다.',
    '매 수업마다 오늘 배운 가장 중요한 1가지를 정리하는 습관을 함께 길러보겠습니다.',
    '풀이 과정 확인, 조건 표시, 유사 문제, 오답노트 순서로 관리하겠습니다.',
    '수업 이해, 간단한 적용, 오답 확인 순서로 학습 흐름을 정리하겠습니다.',
    '배운 내용을 바로 적용해보는 연습을 수업 안에서 반복하겠습니다.',
    '문제 풀이 전 조건을 먼저 정리하는 습관을 함께 만들겠습니다.',
    '확인할 문항은 정답만 확인하지 않고 풀이 과정을 중심으로 다시 보겠습니다.',
    '수업 직후 핵심 내용을 짧게 정리하는 복습 루틴을 함께 잡아가겠습니다.',
    '이해한 개념이 실제 문제에서 어떻게 쓰이는지 연결해 지도하겠습니다.'
  ] : highScore ? [
    '정확도 유지, 심화 유형 확인, 다음 단원 연결 순서로 관리하겠습니다.',
    '현재의 좋은 흐름을 유지하면서 심화 유형과 서술형 풀이까지 자연스럽게 확장해가겠습니다.'
  ] : [
    '확인 문항 정리, 풀이 습관 점검, 유사 문제 연결 순서로 관리하겠습니다.',
    '풀이 과정 확인, 조건 표시, 유사 문제, 오답노트 순서로 관리하겠습니다.',
    '수업 이해, 간단한 적용, 오답 확인 순서로 학습 흐름을 정리하겠습니다.'
  ];

  const neutralLifeAnchors = [
    '현재까지의 학습 흐름을 종합해 풀이 습관을 점검하고 있습니다.',
    '수업 안에서 필요한 부분을 계속 확인하겠습니다.',
    '과제와 풀이 습관을 함께 확인하겠습니다.',
    '학습 루틴을 다시 세울 수 있는 단계로 보고 관리하겠습니다.',
    '현재 학습 상태를 바탕으로 필요한 부분을 순차적으로 점검하고 있습니다.',
    '수업 흐름 안에서 이해도와 적용력을 함께 확인하고 있습니다.',
    '학습 과정 전반을 점검하며 균형 있게 관리하고 있습니다.',
    '지금 단계에서 필요한 학습 요소를 중심으로 확인하고 있습니다.',
    '과제와 풀이 습관을 함께 보며 학습 루틴을 점검하고 있습니다.',
    '수업 안에서 학생에게 맞는 속도와 방식으로 필요한 부분을 확인하겠습니다.'
  ];

  const pickIndex = hashText(`${studentName}|${score}|${wrongCount}|${questionCount}|${teacherMemo}`);
  const pick = (items, offset = 0) => items[(pickIndex + offset) % items.length];
  const positiveAnchor = pick(positiveAnchors);
  const parentReassurance = pick(parentReassurances, 3);
  const teacherCareMessage = pick(teacherCareMessages, 7);
  const growthPotential = pick(growthPotentials, 11);
  const lifeBasedNextStep = pick(nextStepCandidates, 13);
  const neutralLifeAnchor = pick(neutralLifeAnchors, 17);

  const parentMessageExampleSeeds = {
    lower: [
      `어머님, 안녕하세요.
이번 평가는 점수 자체보다 앞으로 어떤 부분을 먼저 정리하면 좋을지 확인하는 자료로 보시면 좋겠습니다. 수업 안에서 다시 잡아갈 지점이 분명하게 보였고, 조건 확인과 풀이 과정 정리를 통해 충분히 흐름을 회복할 수 있습니다. 학원에서는 확인할 문항을 차근차근 다시 살펴보며, 작은 성공 경험을 쌓을 수 있도록 난도와 순서를 조절하겠습니다. 가정에서는 문제를 많이 다시 풀리기보다 풀이 흔적을 가볍게 확인해 주시면 충분합니다. 학원에서 방향을 잡아가고 있으니 편안한 마음으로 지켜봐 주시면 감사하겠습니다.`,
      `어머님, 안녕하세요.
이번 평가를 통해 아이가 어떤 부분에서 먼저 도움을 받으면 좋을지 구체적으로 확인했습니다. 지금은 결과를 크게 부담으로 느끼기보다, 풀이 습관과 조건 표시 과정을 다시 정리하는 것이 더 중요합니다. 학원에서는 맞출 수 있었던 문항부터 자신감을 회복하고, 이후 유사 문제를 통해 풀이 흐름을 안정화하겠습니다. 가정에서는 문제를 풀 때 조건에 표시하는 습관만 자연스럽게 격려해 주시면 좋겠습니다. 아이가 수학에 대한 부담을 줄이고 다시 차분히 따라올 수 있도록 세심하게 지도하겠습니다.`,
      `어머님, 안녕하세요.
이번 리포트는 아이의 부족한 점을 지적하기 위한 자료가 아니라, 앞으로의 학습 순서를 정리하기 위한 자료로 보시면 좋겠습니다. 확인할 문항이 여러 개 있었지만, 한꺼번에 몰아가기보다 기본 풀이 흐름부터 다시 세우는 것이 우선입니다. 학원에서는 조건 표시, 식 정리, 계산 검산 순서로 수업 안에서 반복 확인하겠습니다. 가정에서는 아이가 이번 평가를 통해 배울 점을 찾았다는 부분을 칭찬해 주시고, 풀이 과정을 천천히 쓰는 습관만 가볍게 봐주시면 충분합니다. 안정적인 흐름을 만들 수 있도록 학원에서 책임 있게 관리하겠습니다.`,
      `어머님, 안녕하세요.
이번 평가에서는 아이가 앞으로 어떤 부분을 먼저 정리해야 할지가 비교적 분명하게 보였습니다. 점수만으로 판단하기보다, 수업 안에서 다시 잡아갈 수 있는 풀이 습관과 확인 순서를 보는 것이 중요합니다. 학원에서는 확인할 문항을 단계별로 다시 풀어보며, 작은 성공 경험을 쌓을 수 있도록 문제 난도를 세심하게 조절하겠습니다. 가정에서는 틀린 문제를 많이 풀리기보다, 문제 조건을 표시하는 습관만 편하게 격려해 주시면 좋겠습니다. 아이가 자신감을 잃지 않고 다시 흐름을 잡을 수 있도록 차분히 이끌겠습니다.`,
      `어머님, 안녕하세요.
이번 평가는 아이가 어떤 유형에서 조금 더 도움이 필요한지 확인할 수 있었던 중요한 자료입니다. 지금은 빠른 결과보다 풀이 과정을 안정적으로 정리하고, 수업 안에서 다시 연결할 수 있는 지점을 하나씩 잡아가는 것이 필요합니다. 학원에서는 확인할 문항을 풀이 흔적 중심으로 다시 보고, 유사 문제를 통해 같은 유형에서 조금씩 자신감을 쌓도록 지도하겠습니다. 가정에서는 아이가 포기하지 않고 다시 시도하는 모습을 응원해 주시면 충분합니다. 학원에서 우선순위를 잡아 안정적으로 관리하겠습니다.`,
      `어머님, 안녕하세요.
이번 평가 결과는 앞으로의 학습 방향을 정리하는 데 의미가 있습니다. 아이에게 필요한 것은 많은 문제를 한꺼번에 다시 푸는 것보다, 문제를 읽고 조건을 표시한 뒤 차분히 풀이를 정리하는 습관입니다. 학원에서는 수업 안에서 풀이 과정을 함께 확인하고, 막히는 지점을 바로 피드백하며 회복 흐름을 만들겠습니다. 가정에서는 부담을 주기보다 문제를 천천히 읽는 습관만 자연스럽게 격려해 주시면 좋겠습니다. 아이가 다시 자신감을 가질 수 있도록 학원에서 세심하게 관리하겠습니다.`,
      `어머님, 안녕하세요.
이번 평가를 통해 아이가 어떤 순서로 다시 정리하면 좋을지 확인했습니다. 확인할 문항이 있었지만, 이는 앞으로의 학습 루틴을 다시 잡는 데 도움이 되는 자료입니다. 학원에서는 맞출 수 있었던 문항의 풀이 흐름부터 먼저 회복하고, 이후 난도 있는 문항으로 자연스럽게 이어가겠습니다. 가정에서는 풀이 후 답을 한 번 더 확인하는 습관만 가볍게 격려해 주시면 충분합니다. 학원에서 단계적으로 관리하고 있으니 편안하게 지켜봐 주셔도 됩니다.`,
      `어머님, 안녕하세요.
이번 평가는 아이의 현재 위치를 차분히 확인하고, 앞으로 어떤 부분을 먼저 보완하면 좋을지 정리하는 기회가 되었습니다. 수업 안에서 다시 잡아갈 수 있는 부분이 분명히 보였기 때문에, 지금은 결과보다 회복 순서를 잘 세우는 것이 중요합니다. 학원에서는 조건 표시와 풀이 과정 확인을 반복하며, 아이가 스스로 이해한 내용을 문제에 적용할 수 있도록 지도하겠습니다. 가정에서는 아이가 다시 시도하는 태도를 칭찬해 주시면 큰 도움이 됩니다. 조급하게 몰아가기보다 안정적인 학습 흐름을 만들겠습니다.`,
      `어머님, 안녕하세요.
이번 평가에서 확인된 부분들은 앞으로의 수업 방향을 잡는 데 중요한 기준이 됩니다. 아이가 수학에 대한 부담을 느끼지 않도록, 학원에서는 확인할 문항을 순서대로 나누어 다시 살펴보겠습니다. 먼저 조건을 정확히 읽고 풀이 과정을 정리하는 습관부터 잡은 뒤, 유사 문제로 적용력을 높이겠습니다. 가정에서는 많은 양의 추가 학습보다, 문제를 풀 때 조건을 표시하는 습관만 편하게 응원해 주시면 좋겠습니다. 아이가 작은 성공 경험을 통해 자신감을 회복할 수 있도록 지도하겠습니다.`,
      `어머님, 안녕하세요.
이번 리포트는 아이가 못한 부분을 강조하기보다, 앞으로 어떤 방향으로 좋아질 수 있는지 정리한 자료입니다. 확인할 문항이 여러 개 있었지만, 풀이 습관을 다시 잡고 조건을 차분히 정리하면 충분히 개선 흐름을 만들 수 있습니다. 학원에서는 수업 중 바로 피드백하며 막히는 지점을 확인하고, 유사 문제를 통해 다시 적용하는 연습을 진행하겠습니다. 가정에서는 아이가 문제를 끝까지 읽고 표시하는 습관만 가볍게 봐주시면 충분합니다. 학원에서 차분히 방향을 잡아가겠습니다.`
    ],
    middle: [
      `어머님, 안녕하세요.
이번 평가는 아이가 기본 흐름은 따라가고 있으나, 몇몇 문항에서 조건 확인과 풀이 과정 정리가 더 필요하다는 점을 확인한 자료입니다. 큰 방향은 잡혀 있기 때문에, 수업 안에서 풀이 습관을 조금 더 안정화하면 다음 평가에서 더 좋은 결과로 이어질 수 있습니다. 학원에서는 확인할 문항을 중심으로 풀이 과정을 다시 보고, 유사 문제로 같은 유형에서 흔들리지 않도록 관리하겠습니다. 가정에서는 풀이 후 한 번 더 검산하는 습관만 가볍게 격려해 주시면 도움이 됩니다. 현재의 흐름을 유지하면서 정확도를 높여가겠습니다.`,
      `어머님, 안녕하세요.
이번 평가를 통해 아이가 어느 부분에서 안정적으로 풀고, 어느 부분에서 한 번 더 확인이 필요한지 구분할 수 있었습니다. 지금은 개념을 새로 많이 늘리기보다, 알고 있는 내용을 문제에 정확히 적용하는 연습이 중요합니다. 학원에서는 조건 표시와 풀이 과정 설명을 병행하며, 문제 접근 순서를 더 분명하게 잡아가겠습니다. 가정에서는 문제를 푼 뒤 풀이 흔적을 짧게 설명해보는 습관을 자연스럽게 격려해 주시면 좋겠습니다. 아이가 자신감을 유지하면서 한 단계 더 안정적인 성취로 이어가도록 관리하겠습니다.`,
      `어머님, 안녕하세요.
이번 결과는 아이가 기본 학습 흐름을 유지하고 있음을 보여주면서도, 정확도를 조금 더 끌어올릴 지점을 함께 알려주고 있습니다. 특히 풀이 과정에서 조건을 놓치지 않고 끝까지 확인하는 습관이 자리 잡으면 성취가 더 안정될 수 있습니다. 학원에서는 확인할 문항을 중심으로 풀이 순서를 다시 정리하고, 비슷한 유형을 통해 적용력을 높이겠습니다. 가정에서는 문제를 많이 추가하기보다, 아이가 풀이 과정을 차분히 쓰는지 가볍게 봐주시면 충분합니다. 현재의 흐름을 살리면서 실수를 줄이는 방향으로 지도하겠습니다.`,
      `어머님, 안녕하세요.
이번 평가는 아이의 학습 흐름에서 안정적인 부분과 조금 더 정리할 부분을 함께 확인할 수 있었던 자료입니다. 무리하게 난도를 올리기보다, 현재 알고 있는 개념을 정확하게 문제에 연결하는 습관을 만드는 것이 우선입니다. 학원에서는 조건 표시, 식 정리, 계산 검산 순서로 풀이 루틴을 다시 잡아가겠습니다. 가정에서는 풀이 후 답을 한 번 더 확인하는 정도만 편하게 격려해 주시면 좋겠습니다. 아이가 지금의 성취를 바탕으로 더 안정적인 결과를 만들 수 있도록 관리하겠습니다.`,
      `어머님, 안녕하세요.
이번 평가를 통해 아이가 어떤 문항에서 조금 더 세밀한 확인이 필요한지 확인했습니다. 현재 흐름은 유지되고 있으므로, 핵심은 풀이 과정의 정확도를 높이는 데 있습니다. 학원에서는 확인할 문항을 다시 보며 조건을 어떻게 표시하고 식으로 옮기는지 함께 점검하겠습니다. 가정에서는 아이가 배운 내용을 짧게 정리하는 습관을 부담 없이 격려해 주시면 도움이 됩니다. 안정적인 학습 리듬을 유지하면서 다음 단계로 이어가겠습니다.`,
      `어머님, 안녕하세요.
이번 결과는 아이가 전체적인 흐름을 따라가고 있으나, 몇몇 문항에서 확인 순서를 조금 더 다듬으면 좋겠다는 점을 보여줍니다. 학원에서는 정답 여부만 보는 것이 아니라, 풀이 과정에서 어떤 지점이 흔들렸는지 함께 확인하겠습니다. 이후 유사 문제를 통해 같은 유형에서 더 안정적으로 접근하도록 지도하겠습니다. 가정에서는 문제를 풀 때 조건을 표시하는 습관만 자연스럽게 격려해 주시면 충분합니다. 아이가 자신감을 유지하며 정확도를 높일 수 있도록 관리하겠습니다.`,
      `어머님, 안녕하세요.
이번 평가는 아이가 잘 따라온 부분과 더 단단히 정리할 부분을 나누어 볼 수 있었던 자료입니다. 지금은 학습량을 무리하게 늘리기보다, 풀이 과정을 차분히 쓰고 검산하는 습관을 잡는 것이 효과적입니다. 학원에서는 확인할 문항을 중심으로 식 정리와 계산 과정을 다시 보고, 필요한 경우 유사 문제로 반복 확인하겠습니다. 가정에서는 아이가 풀이 과정을 설명해보는 습관만 가볍게 응원해 주시면 좋겠습니다. 현재의 성취가 더 안정적인 결과로 이어지도록 지도하겠습니다.`,
      `어머님, 안녕하세요.
이번 평가에서는 아이가 기본 흐름을 유지하면서도, 일부 문항에서 더 꼼꼼한 확인이 필요하다는 점을 확인했습니다. 이는 충분히 수업 안에서 잡아갈 수 있는 부분입니다. 학원에서는 조건 표시와 풀이 과정 점검을 통해 실수 가능성을 줄이고, 비슷한 유형에서 다시 적용해보는 연습을 진행하겠습니다. 가정에서는 문제를 많이 늘리기보다, 풀이 흔적을 남기는 습관만 가볍게 확인해 주시면 됩니다. 안정적인 흐름을 이어갈 수 있도록 세심하게 관리하겠습니다.`,
      `어머님, 안녕하세요.
이번 리포트는 아이가 어느 정도까지 안정적으로 해결하고 있는지, 그리고 어디서 한 번 더 확인하면 좋을지를 정리한 자료입니다. 전반적인 학습 흐름은 유지되고 있으므로, 다음 단계는 풀이 과정의 세밀함을 높이는 것입니다. 학원에서는 확인할 문항을 다시 살펴보며 조건 해석과 식 정리를 함께 점검하겠습니다. 가정에서는 아이가 문제를 풀고 난 뒤 답을 한 번 더 확인하는 습관만 편하게 격려해 주시면 좋겠습니다. 정확도를 높여 더 안정적인 성취로 이어가겠습니다.`,
      `어머님, 안녕하세요.
이번 평가를 통해 아이의 학습 흐름에서 보완하면 좋은 부분이 구체적으로 확인되었습니다. 현재는 방향을 크게 바꾸기보다, 풀이 루틴을 조금 더 정돈해 정확도를 높이는 것이 중요합니다. 학원에서는 조건 표시와 검산 습관을 중심으로 확인할 문항을 다시 보고, 유사 문제를 통해 같은 유형을 안정화하겠습니다. 가정에서는 아이가 배운 내용을 짧게 정리하는 습관만 자연스럽게 격려해 주시면 충분합니다. 지금의 흐름이 좋은 결과로 이어지도록 꾸준히 관리하겠습니다.`
    ],
    high: [
      `어머님, 안녕하세요.
이번 평가는 아이가 높은 정확도를 바탕으로 안정적인 성취를 보여준 결과였습니다. 기본 개념을 문제에 적용하는 흐름이 잘 유지되고 있으며, 이제는 난도 있는 문항에서 풀이 과정의 세밀함을 더해가면 좋겠습니다. 학원에서는 현재의 좋은 흐름을 유지하면서 심화 유형과 서술형 풀이까지 자연스럽게 확장하겠습니다. 가정에서는 아이가 풀이 과정을 짧게 설명해보는 습관을 편하게 격려해 주시면 좋겠습니다. 지금의 성취가 더 깊은 사고력으로 이어지도록 지도하겠습니다.`,
      `어머님, 안녕하세요.
이번 평가에서 아이는 안정적인 정확도와 풀이 집중력을 보여주었습니다. 현재 학습 흐름이 잘 유지되고 있으므로, 다음 단계는 익숙한 유형을 넘어 조금 더 생각이 필요한 문제로 확장하는 것입니다. 학원에서는 심화 문항과 응용 유형을 병행하며, 풀이 과정의 완성도를 높이겠습니다. 가정에서는 아이가 배운 내용을 짧게 정리하는 정도만 가볍게 격려해 주시면 충분합니다. 좋은 흐름을 유지하면서 더 넓은 문제 해결력으로 이어가겠습니다.`,
      `어머님, 안녕하세요.
이번 평가는 아이가 학습한 내용을 안정적으로 소화하고 있음을 보여주는 결과였습니다. 점수뿐 아니라 풀이 흐름이 흔들리지 않았다는 점에서 긍정적으로 볼 수 있습니다. 학원에서는 현재의 정확도를 유지하면서, 난도 있는 문제와 서술형 문항에서 사고 과정을 더 정교하게 다듬겠습니다. 가정에서는 아이가 어려운 문제를 풀 때 풀이 순서를 말로 설명해보도록 편하게 격려해 주시면 좋겠습니다. 안정적인 성취가 심화 실력으로 이어지도록 관리하겠습니다.`,
      `어머님, 안녕하세요.
이번 결과는 아이가 현재 범위를 안정적으로 이해하고 있으며, 문제 풀이에서도 좋은 집중력을 유지하고 있음을 보여줍니다. 앞으로는 정확도를 유지하는 것과 함께, 낯선 유형에서도 차분히 접근하는 힘을 키우는 것이 중요합니다. 학원에서는 심화 유형을 조금씩 병행하며 풀이 과정의 논리성을 더 강화하겠습니다. 가정에서는 지금의 학습 리듬을 편안하게 유지할 수 있도록 격려해 주시면 충분합니다. 아이가 자신감을 바탕으로 더 깊은 단계까지 나아가도록 지도하겠습니다.`,
      `어머님, 안녕하세요.
이번 평가에서는 아이의 안정적인 성취와 꼼꼼한 풀이 흐름이 잘 드러났습니다. 현재는 기본기를 다시 점검하기보다, 좋은 정확도를 유지하면서 심화 응용으로 확장할 수 있는 단계입니다. 학원에서는 난도 있는 문제를 통해 사고력을 넓히고, 서술형 풀이에서 표현의 완성도까지 함께 관리하겠습니다. 가정에서는 아이가 풀이 과정을 간단히 정리하는 습관만 자연스럽게 격려해 주시면 좋겠습니다. 지금의 좋은 흐름을 장기적인 실력으로 이어가겠습니다.`,
      `어머님, 안녕하세요.
이번 평가는 아이가 배운 내용을 정확하게 적용하고 있음을 확인할 수 있었던 결과였습니다. 전반적인 풀이 흐름이 안정되어 있어, 앞으로는 심화 유형에서 조건을 더 정교하게 해석하는 연습을 이어가면 좋겠습니다. 학원에서는 현재의 성취를 유지하면서 응용 문제와 서술형 풀이를 병행하겠습니다. 가정에서는 아이가 어려운 문제를 만났을 때 풀이 순서를 차분히 정리해보도록 가볍게 응원해 주시면 됩니다. 성취가 더 단단한 실력으로 이어지도록 지도하겠습니다.`,
      `어머님, 안녕하세요.
이번 결과를 통해 아이가 현재 학습 범위를 안정적으로 소화하고 있음을 확인했습니다. 좋은 점수도 의미 있지만, 풀이 과정이 흔들리지 않았다는 점이 더 중요한 성취입니다. 학원에서는 지금의 정확도를 유지하며 고난도 문항과 확장 문제를 통해 사고의 폭을 넓히겠습니다. 가정에서는 아이가 배운 내용을 스스로 정리해보는 습관을 편하게 격려해 주시면 좋겠습니다. 안정적인 성취가 더 높은 수준의 문제 해결력으로 이어질 수 있도록 관리하겠습니다.`,
      `어머님, 안녕하세요.
이번 평가에서는 아이가 높은 정확도와 안정적인 풀이 습관을 함께 보여주었습니다. 현재 흐름을 잘 유지하면 다음 단계의 심화 학습도 충분히 자연스럽게 이어갈 수 있습니다. 학원에서는 응용 유형과 서술형 정리를 병행하며, 풀이 과정의 논리성을 더 다듬겠습니다. 가정에서는 아이가 문제를 풀고 난 뒤 핵심 아이디어를 짧게 말해보는 습관만 가볍게 격려해 주시면 됩니다. 좋은 성취가 더 넓은 학습 역량으로 확장되도록 지도하겠습니다.`,
      `어머님, 안녕하세요.
이번 평가는 아이의 개념 이해와 문제 적용력이 안정적으로 이어지고 있음을 보여주었습니다. 앞으로는 맞힌 문제를 단순히 지나가기보다, 어떤 방식으로 해결했는지 풀이 과정을 정리하는 습관을 더해가면 좋겠습니다. 학원에서는 심화 유형과 변형 문제를 통해 사고력을 넓히고, 서술형에서도 논리적으로 표현할 수 있도록 지도하겠습니다. 가정에서는 현재의 학습 태도를 충분히 칭찬해 주시면 좋겠습니다. 지금의 자신감이 더 깊은 실력으로 이어지도록 관리하겠습니다.`,
      `어머님, 안녕하세요.
이번 결과는 아이가 학습 내용을 정확하게 이해하고 문제에 안정적으로 적용하고 있음을 보여줍니다. 이제는 현재의 성취를 유지하면서, 더 복잡한 조건이 포함된 문항에서도 풀이 순서를 차분히 세우는 연습이 필요합니다. 학원에서는 심화 문제와 서술형 정리를 함께 진행하며, 문제 해결 과정을 더 세밀하게 관리하겠습니다. 가정에서는 아이가 배운 내용을 짧게 설명해보는 습관을 자연스럽게 격려해 주시면 좋겠습니다. 좋은 흐름이 장기적인 실력으로 이어지도록 지도하겠습니다.`
    ],
    perfect: [
      `어머님, 안녕하세요.
이번 평가는 아이가 모든 문항을 정확하게 해결하며 매우 안정적인 성취를 보여준 결과였습니다. 단순히 점수가 좋은 것을 넘어, 배운 개념을 문제에 흔들림 없이 적용했다는 점에서 의미가 큽니다. 학원에서는 현재의 정확도를 유지하면서 심화 응용과 서술형 풀이까지 자연스럽게 확장하겠습니다. 가정에서는 이번 성취를 충분히 칭찬해 주시고, 아이가 배운 내용을 짧게 정리하는 습관만 편하게 격려해 주시면 좋겠습니다. 지금의 좋은 흐름이 더 깊은 수학적 사고로 이어지도록 지도하겠습니다.`,
      `어머님, 안녕하세요.
이번 평가에서 아이는 전 문항을 정확하게 해결하며 매우 탄탄한 학습 상태를 보여주었습니다. 현재 범위에 대한 이해와 집중력이 잘 유지되고 있기 때문에, 다음 단계는 심화 유형과 낯선 문제에 대한 적응력을 키우는 것입니다. 학원에서는 난도 있는 문항과 서술형 풀이를 병행하며 사고의 폭을 넓히겠습니다. 가정에서는 아이가 이번 결과를 자신감으로 받아들일 수 있도록 충분히 칭찬해 주시면 좋겠습니다. 성취가 일시적인 결과에 머물지 않도록 꾸준히 관리하겠습니다.`,
      `어머님, 안녕하세요.
이번 결과는 아이가 배운 내용을 정확하게 이해하고, 문제 풀이에서도 흔들림 없이 적용하고 있음을 보여줍니다. 모든 문항을 해결했다는 점도 중요하지만, 난도 있는 문항까지 안정적으로 마무리했다는 점이 특히 긍정적입니다. 학원에서는 현재의 좋은 흐름을 유지하면서 심화 응용과 변형 문제까지 확장하겠습니다. 가정에서는 아이가 풀이 과정을 짧게 설명해보는 습관을 편하게 격려해 주시면 좋겠습니다. 지금의 성취가 더 깊은 실력으로 이어질 수 있도록 지도하겠습니다.`,
      `어머님, 안녕하세요.
이번 평가는 아이가 현재 학습 범위를 매우 안정적으로 소화하고 있음을 확인한 결과였습니다. 전 문항을 정확히 해결한 만큼, 앞으로는 같은 정확도를 유지하면서 더 복잡한 조건의 문제를 다루는 힘을 키워가면 좋겠습니다. 학원에서는 심화 유형, 서술형 정리, 다음 단원 연결을 균형 있게 진행하겠습니다. 가정에서는 아이가 이번 성취를 긍정적인 자신감으로 받아들일 수 있도록 칭찬해 주시면 충분합니다. 좋은 흐름이 꾸준한 실력으로 자리 잡도록 관리하겠습니다.`,
      `어머님, 안녕하세요.
이번 평가에서는 아이의 정확도와 집중력이 모두 잘 드러났습니다. 모든 문항을 안정적으로 해결한 것은 꾸준히 쌓아온 학습 흐름이 잘 이어지고 있다는 뜻으로 볼 수 있습니다. 학원에서는 현재 성취에 머무르지 않고, 심화 문제와 사고력 문항을 통해 더 넓은 풀이 경험을 제공하겠습니다. 가정에서는 지금의 성실한 흐름을 충분히 칭찬해 주시면 좋겠습니다. 아이가 높은 자신감을 유지하면서도 더 깊이 있는 학습으로 나아갈 수 있도록 지도하겠습니다.`
    ]
  };

  return {
    attendanceTone,
    homeworkTone,
    effortTone,
    clinicTone,
    classParticipationTone,
    growthPotential,
    teacherCareMessage,
    positiveAnchor,
    parentReassurance,
    lifeBasedNextStep,
    lowerScoreSupportMode,
    parentMessageOpening: '어머님, 안녕하세요.',
    parentMessageNumberRule: 'parentMessage에서는 % 기호를 쓰지 말고, 점수/평균/정답률 수치 반복을 최소화한다.',
    neutralLifeAnchor,
    parentMessageExampleSeeds
  };
}

function buildReportAnalysisUserPrompt(payload) {
  const hasBaseDraft = !!payload?.baseReportDraft;
  return [
    hasBaseDraft
      ? '아래 기본 리포트 초안을 완전히 갈아엎지 말고, 학부모 발송용으로 더 자연스럽고 신뢰감 있게 고도화하라.'
      : '아래 학생 평가 데이터를 바탕으로 학부모 평가 리포트 문장을 작성하라.',
    '',
    '[중요 작업 방식]',
    '- 현재 목적은 새 분석 생성이 아니라 기본 리포트 개선이다.',
    '- payload.baseReportDraft가 있으면 반드시 프롬프트의 핵심 근거로 사용한다.',
    '- 기본 리포트 초안이 있으면 절대 무시하지 않는다.',
    '- 새 리포트를 처음부터 다시 쓰지 말고, 기본 리포트를 더 좋게 다듬는다.',
    '- 기본 리포트보다 짧게 쓰지 말 것.',
    '- 성취 → 평가 해석 → 핵심 보완 → 다음 수업 계획 → 학부모 메시지 순서를 유지할 것.',
    '- 반복 문장을 줄이고, 딱딱한 내부 보고서 문체를 부드럽게 바꿀 것.',
    '- summary는 성취 중심, diagnosis는 평가 해석, wrongAnalysis는 문항별 확인 포인트, nextPlan은 다음 수업 조치, parentMessage는 학부모 발송문 역할을 맡는다.',
    '- parentMessage는 반드시 "어머님, 안녕하세요."로 시작한다.',
    '- "학부모님, 안녕하세요.", "안녕하세요, ○○ 학부모님.", "○○ 어머님."으로 시작하지 않는다.',
    '- 학생 이름은 parentMessage 첫 문장 이후 자연스럽게 사용한다.',
    '',
    '[문장 다양화 seed 사용 규칙]',
    '- payload.reportWritingSeeds를 반드시 참고하라.',
    '- payload.learningLifeSeeds를 반드시 참고하라.',
    '- payload.learningLifeSeeds.parentMessageExampleSeeds를 참고하라.',
    '- parentMessageExampleSeeds 안의 예시는 parentMessage 톤 참고용으로만 사용하고, summary, diagnosis, wrongAnalysis, nextPlan, teacherMemo, nextActions에는 섞지 말라.',
    '- 예시 문구를 그대로 복사하지 말고, 학생 데이터에 맞게 톤과 구조만 참고해 새로 작성하라.',
    '- learningLifeSeeds.lowerScoreSupportMode가 true이면 parentMessageExampleSeeds.lower의 톤을 우선 참고하라.',
    '- wrongCount가 0이고 score가 만점 또는 correctRate가 100이면 parentMessageExampleSeeds.perfect의 톤을 참고하라.',
    '- score가 90점 이상이거나 오답이 1개 이하이면 parentMessageExampleSeeds.high의 톤을 참고하라.',
    '- 그 외 일반 보완형 학생은 parentMessageExampleSeeds.middle의 톤을 참고하라.',
    '- parentMessage는 예시보다 짧아지지 않게 작성하라.',
    '- 예시와 같은 문장을 그대로 반복하지 말라.',
    '- learningLifeSeeds.lowerScoreSupportMode가 true이면 positiveAnchor, parentReassurance, teacherCareMessage를 반드시 최소 1개 이상 자연스럽게 반영하라.',
    '- positiveAnchor, parentReassurance, teacherCareMessage, growthPotential, lifeBasedNextStep, effortTone, clinicTone, neutralLifeAnchor에는 "어머님" 인사말을 넣지 말라.',
    '- toneVariant, expressionVariant, sentencePatternSeed, openingHookType, connectorStyle, detailDensity, openingStyle에 맞춰 문장 구조를 바꾸라.',
    '- 리포트는 점수표가 아니라 "성취 확인 + 학습 회복 계획 + 학원 관리 안내"여야 한다.',
    '- 점수, 정답률, 평균, 오답 개수, 퍼센트 표현을 과도하게 반복하지 말라.',
    '- 퍼센트와 평균 비교는 필요한 곳에서만 1~2회 사용하고, parentMessage에서는 가능하면 줄여라.',
    '- parentMessage에서는 % 기호를 쓰지 말고 "정답률" 표현도 최소화하라.',
    '- 하위권 학생의 경우 결과를 강조하기보다 "회복 순서, 수업 관리, 긍정적 가능성"을 중심으로 작성하라.',
    '- 하위권 학생 parentMessage는 점수보다 학습 점검, 부족 지적보다 회복 순서, 가정 부담 최소화, 학원 관리 책임 강조를 중심으로 작성하라.',
    '- 하위권 학생 parentMessage 첫 내용은 "이번 평가는 단순히 점수를 확인하는 것이 아니라, 학생이 어떤 부분을 먼저 정리하면 좋을지 확인하는 자료"라는 방향으로 잡아라.',
    '- 학생이 끝까지 풀어내려는 태도, 성실함, 노력, 참여 같은 긍정 근거가 teacherMemo나 payload에 있으면 parentMessage에서 점수보다 먼저 자연스럽게 칭찬하라.',
    '- 긍정 태도 근거가 없으면 "수업 안에서 다시 정리할 수 있는 지점이 보였습니다", "확인할 문항을 차근차근 다시 보겠습니다"처럼 관찰 가능한 관리 계획으로 표현하라.',
    '- 기본 개념을 잘 이해하고 있다, 성실하게 잘하고 있다처럼 데이터나 teacherMemo 근거가 없는 칭찬은 단정하지 말라.',
    '- "못했다", "낮은 수치", "아쉽게 느껴지실 수 있으나", "다소 아쉽게", "아쉬운 결과", "다소 아쉬운 결과", "부족합니다", "오답 처리", "실수 방지", "틀린 문항", "틀린 문제", "기본 개념을 잘 이해하고 있습니다", "기본 개념을 잘 이해하고 있음을 확인했습니다", "기본 개념을 이해하고 있다는 점을 확인했습니다", "기본기를 충실히 다지고 있습니다", "기본기를 충실히 다지고 있다는 점을 확인했습니다" 같은 표현은 parentMessage에 쓰지 말라.',
    '- 위 금지 표현 대신 "배운 내용을 다시 연결해 갈 수 있는 지점이 보였습니다", "수업 안에서 다시 정리할 수 있는 부분이 분명히 보였습니다", "현재 흐름에서 더 안정화할 지점이 확인되었습니다", "풀이 과정에서 한 번 더 정리할 부분이 보였습니다"처럼 표현하라.',
    '- parentMessage에서는 "아쉽게" 계열 표현 대신 "앞으로 어떤 부분을 먼저 정리해야 할지 확인할 수 있었던 자료"처럼 관리 방향 중심으로 표현하라.',
    '- parentMessage에서 문항을 언급할 때는 "확인할 문항", "다시 살펴볼 문항", "차근차근 다시 풀어볼 문항"으로 표현하라.',
    '- 하위권 학생 parentMessage에는 반드시 안심 문장을 포함하라.',
    '- 하위권 학생 parentMessage의 가정 요청은 확인할 문항을 많이 다시 풀리라는 식이 아니라, 조건 표시 습관을 자연스럽게 격려하는 정도로 제한하라.',
    '- 학부모가 "우리 아이가 못한다고 혼나는 느낌"을 받지 않도록 표현하라.',
    '- 학생이 현재 열심히 하고 있다는 근거가 teacherMemo나 payload에 있으면 반드시 자연스럽게 반영하라.',
    '- teacherMemo에 열심히, 성실, 노력, 보강, 클리닉, 참여, 숙제 같은 긍정 키워드가 있으면 parentMessage와 diagnosis에 학부모용 문장으로 다듬어 최우선 반영하라.',
    '- teacherMemo와 점수 분석이 충돌하면 생활/태도 정보는 teacherMemo를 우선한다.',
    '- 근거가 없으면 "수업 안에서 다시 잡아가겠습니다"처럼 학원의 관리 계획으로 표현하라.',
    '- 출석, 숙제, 보강, 클리닉 기록이 payload나 teacherMemo에 없으면 사실처럼 단정하지 말고 중립적인 관리 계획으로만 표현하라.',
    '- 가정 요청은 1개만 제시하고, 부담스럽지 않게 쓴다.',
    '- 학원에서 관리할 부분을 선생님이 책임지고 안내하는 문체로 작성하라.',
    '- 첫 문장은 openingHookType에 맞춰 시작하라.',
    '- 같은 데이터라도 문장 시작과 흐름이 매번 똑같아 보이지 않게 작성하라.',
    '- 매번 "이번 평가는", "다음 수업에서는", "학원에서는"으로 문단을 시작하지 말라.',
    '- sentenceAvoidList의 시스템성 표현은 학부모 리포트에 쓰지 말라.',
    '- "이번 평가는", "다음 수업에서는", "학원에서는"은 필요하면 한 번만 쓰고 모든 섹션 첫머리에 반복하지 말라.',
    '- repetitionGuard의 핵심 키워드를 섹션별로 분산해서 사용하라.',
    '- summary, diagnosis, nextPlan에서 connectorStyle이 같은 방식으로만 반복되지 않게 하라.',
    '- summary, diagnosis, wrongAnalysis, nextPlan, parentMessage는 서로 다른 문장 구조를 사용하라.',
    '- 같은 의미를 여러 섹션에 반복하지 말라.',
    '- parentMessage는 선생님이 직접 쓴 학부모 안내문처럼 자연스럽게 작성하라.',
    '- parentMessage는 반드시 "어머님, 안녕하세요."로 시작한다.',
    '- "어머님, 안녕하세요."는 parentMessage 최종 결과의 첫 문장에만 사용한다.',
    '- summary, diagnosis, wrongAnalysis, nextPlan, teacherMemo, nextActions에는 "어머님"이라는 표현을 절대 쓰지 않는다.',
    '- "학부모님, 안녕하세요.", "안녕하세요, ○○ 학부모님.", "○○ 어머님."으로 시작하지 않는다.',
    '- 학생 이름은 parentMessage 첫 문장 이후 자연스럽게 사용한다.',
    '- 기본 리포트 초안보다 짧게 쓰지 말고, 더 자연스럽고 구체적으로 개선하라.',
    '- 단, 과장하거나 없는 사실을 만들지 말라.',
    '- 표현은 다양화하되, 학부모가 보기에 안정적이고 정중한 톤은 유지하라.',
    '- microVariationRules를 반드시 지켜라.',
    '',
    '[문체별 가이드]',
    '- conciseWarm: 짧고 따뜻한 안내문. 부담 없이 읽히되 핵심 조치는 분명히 쓴다.',
    '- teacherMemoStyle: 담당 선생님이 직접 설명하는 느낌. "수업에서 이렇게 이어가겠습니다"의 신뢰감을 준다.',
    '- parentCounselStyle: 상담 문체. 결과 해석과 가정에서 볼 포인트를 부드럽게 연결한다.',
    '- growthNarrative: 학생의 성장 흐름을 강조한다. 현재 성취가 다음 단계로 이어진다는 느낌을 준다.',
    '- preciseDiagnostic: 정답률과 문항 성격을 근거로 차분하게 분석한다. 단, 딱딱한 내부 보고서처럼 쓰지 않는다.',
    '- calmManagement: 오답이 많은 경우 사용한다. 불안감을 주지 않고 우선순위 관리와 순차 보완을 강조한다.',
    '- achievementHighlight: 만점자/고득점자용. 우수 해결 문항과 정확도 유지, 심화 확장을 강조한다.',
    '- recoveryPlan: 점수가 낮거나 오답이 많은 경우 사용한다. 좌절감보다 회복 경로와 구체적 조치를 강조한다.',
    '',
    '[하위권 또는 오답 다수 리포트 구조]',
    '- score가 전체 평균보다 10점 이상 낮거나, wrongCount가 6 이상이거나, questionCount가 있고 correctRate가 65 미만이거나, wrongCount / questionCount가 0.35 이상이면 아래 구조를 따른다.',
    '- 문항 수가 적은 시험에서는 wrongCount만으로 단정하지 말고 correctRate 또는 wrong ratio도 함께 본다.',
    '- summary는 점수를 짧게 1회만 언급하고, 회복 가능성과 우선 관리 포인트를 중심으로 쓴다.',
    '- diagnosis는 쉬운 문항 실수와 고난도 문항을 구분하되, 관리 순서 중심으로 표현한다.',
    '- wrongAnalysis는 문항별 해석을 간단히 쓰고 퍼센트 표현을 남발하지 않는다.',
    '- nextPlan은 수업에서 어떤 순서로 보완할지 구체적으로 작성한다.',
    '- parentMessage는 학습 점검 의미 → 학생 태도 또는 수업 안에서 다시 정리할 지점 → 학원 관리 방향 → 가정에서 가볍게 볼 것 1개 → 안심 문장 순서로 작성한다.',
    '- parentMessage에서 수치 반복은 최소화하고, 학생을 비난하는 느낌을 주지 않는다.',
    '- 하위권 parentMessage 예시 톤: "어머님, 안녕하세요. 이번 평가는 단순히 점수를 확인하는 것이 아니라, 어떤 부분을 먼저 정리하면 좋을지 확인하는 자료로 보시면 좋겠습니다. 수업 안에서 다시 정리할 수 있는 지점이 보였고, 학원에서는 확인할 문항들을 차근차근 다시 풀어보며 조건 확인과 계산 검산 습관을 잡아가겠습니다. 가정에서는 문제를 풀 때 조건에 표시하는 습관만 자연스럽게 격려해 주시면 충분합니다. 학원에서 방향을 잡아가고 있으니 편안한 마음으로 지켜봐 주시면 감사하겠습니다." 이 톤을 따르되, 없는 태도 사실은 만들지 않는다.',
    '',
    '입력 데이터:',
    clampText(JSON.stringify(payload, null, 2), 22000),
    '',
    '작성 필수 기준:',
    '- 첫 문단은 반드시 성취와 안정적인 부분부터 시작한다.',
    '- 오답은 "틀렸다"가 아니라 "다음 수업에서 확인할 포인트"로 표현할 것.',
    '- 오답이 많으면 전부 길게 나열하지 말고 우선 보완 문항과 단원 중심으로 정리한다.',
    '- 오답이 없으면 우수 해결 문항, 정확도 유지, 심화 확장 계획을 작성한다.',
    '- parentMessage는 420자 이상, 6문장 이상으로 작성한다.',
    '- kakaoSummary는 카카오톡 발송 문구처럼 6~10줄 내외로 작성한다.',
    '- 다음 수업에서 실제로 할 조치를 구체적으로 작성한다.',
    '- AI, 시스템, 아카이브, 함수, 코드, 확인 불가, 자료 없음 같은 표현은 절대 쓰지 말 것.',
    '- 없는 사실은 만들지 말 것.',
    '- 짧게 요약하지 않는다.',
    '- 같은 문장을 여러 필드에 복사하지 않는다.'
  ].join('\n');
}

function normalizeParentMessageOpening(value, lifeSeeds = {}) {
  const softenParentMessageText = (raw) => String(raw || '')
    .replace(/%/g, '퍼센트')
    .replace(/비록 이번 점수가 시아의 평소 노력에 비해 다소 아쉽게 느껴지실 수 있으나/g, '이번 결과는 앞으로 어떤 부분을 먼저 정리해야 할지 확인할 수 있었던 자료로 보시면 좋겠습니다.')
    .replace(/기본 개념을 잘 이해하고 있음을 확인했습니다/g, '배운 내용을 다시 연결해 갈 수 있는 지점이 보였습니다')
    .replace(/기본 개념을 이해하고 있다는 점을 확인했습니다/g, '수업 안에서 다시 정리할 수 있는 부분이 분명히 보였습니다')
    .replace(/기본기를 충실히 다지고 있다는 점을 확인했습니다/g, '현재 흐름에서 더 안정화할 지점이 확인되었습니다')
    .replace(/기본 개념을 잘 이해하고 있습니다/g, '배운 내용을 다시 연결해 갈 수 있는 지점이 보입니다')
    .replace(/기본기를 충실히 다지고 있습니다/g, '풀이 과정에서 한 번 더 정리할 부분이 보입니다')
    .replace(/못했다/g, '확인할 부분이 있었다')
    .replace(/아쉽게 느껴지실 수 있으나/g, '앞으로 어떤 부분을 먼저 정리해야 할지 확인할 수 있었던 자료로 보시면 좋겠습니다')
    .replace(/다소 아쉽게/g, '앞으로 정리할 부분을 확인하는 과정으로')
    .replace(/다소 아쉬운 결과/g, '다음 수업에서 정리할 부분')
    .replace(/아쉬운 결과/g, '다음 수업에서 정리할 부분')
    .replace(/낮은 수치/g, '우선 확인할 지점')
    .replace(/부족합니다/g, '보완할 부분이 있습니다')
    .replace(/오답 처리/g, '확인할 문항')
    .replace(/틀린 문항/g, '확인할 문항')
    .replace(/틀린 문제/g, '다시 살펴볼 문제')
    .replace(/실수 방지/g, '풀이 습관 점검')
    .replace(/어려움을 보였습니다/g, '확인할 지점이 있었습니다');
  const text = softenParentMessageText(value).trim();
  if (!text) return '';

  const cleaned = (text.startsWith('어머님, 안녕하세요.') ? text.slice('어머님, 안녕하세요.'.length) : text)
    .replace(/^안녕하세요[,.]?\s*/u, '')
    .replace(/^안녕하세요[,\s]+.*?학부모님[,.]?\s*/u, '')
    .replace(/^안녕하세요[,\s]+.*?어머님[,.]?\s*/u, '')
    .replace(/^.*?학부모님[,.\s]*(안녕하세요[,.]?)?\s*/u, '')
    .replace(/^.*?어머님[,.\s]*(안녕하세요[,.]?)?\s*/u, '')
    .replace(/^AP수학입니다[,.]?\s*/u, '')
    .trim();

  let normalized = `어머님, 안녕하세요.${cleaned ? `\n${cleaned}` : ''}`;
  const reassurance = String(lifeSeeds?.parentReassurance || '').trim();
  if (lifeSeeds?.lowerScoreSupportMode && reassurance && !normalized.includes(reassurance)) {
    normalized = `${normalized}\n${reassurance}`;
  }
  return normalized;
}

function normalizeReportAnalysisResult(raw = {}, payload = {}) {
  const cleanString = (v) => String(v || '').trim();
  const cleanNonParentString = (v) => cleanString(v)
    .replace(/어머님,\s*안녕하세요\.?/g, '')
    .replace(/어머님/g, '')
    .trim();
  const cleanArray = (v) => Array.isArray(v) ? v.map(x => cleanNonParentString(x)).filter(Boolean).slice(0, 8) : [];
  const risk = cleanString(raw.riskLevel || 'stable');
  const lifeSeeds = payload?.learningLifeSeeds || {};
  return {
    summary: cleanNonParentString(raw.summary),
    diagnosis: cleanNonParentString(raw.diagnosis),
    wrongAnalysis: cleanNonParentString(raw.wrongAnalysis),
    nextPlan: cleanNonParentString(raw.nextPlan),
    parentMessage: normalizeParentMessageOpening(raw.parentMessage, lifeSeeds),
    kakaoSummary: cleanNonParentString(raw.kakaoSummary),
    teacherMemo: cleanNonParentString(raw.teacherMemo),
    riskLevel: ['stable', 'watch', 'focus'].includes(risk) ? risk : 'stable',
    mainWeaknesses: cleanArray(raw.mainWeaknesses),
    nextActions: cleanArray(raw.nextActions)
  };
}

function buildFallbackReportAnalysis(payload = {}) {
  const seeds = payload?.reportWritingSeeds || {};
  const lifeSeeds = payload?.learningLifeSeeds || {};
  const seededActions = Array.isArray(seeds.priorityActions) ? seeds.priorityActions.filter(Boolean).slice(0, 5) : [];
  const seededParentGuide = String(seeds.parentGuide || '').trim();
  const positiveAnchor = String(lifeSeeds.positiveAnchor || '').trim();
  const parentReassurance = String(lifeSeeds.parentReassurance || '').trim();
  const teacherCareMessage = String(lifeSeeds.teacherCareMessage || '').trim();
  const lifeBasedNextStep = String(lifeSeeds.lifeBasedNextStep || '').trim();
  const growthPotential = String(lifeSeeds.growthPotential || '').trim();
  const neutralLifeAnchor = String(lifeSeeds.neutralLifeAnchor || '').trim();
  const lowerScoreSupportMode = !!lifeSeeds.lowerScoreSupportMode;
  const draft = payload?.baseReportDraft || null;
  if (draft && typeof draft === 'object') {
    const studentName = payload?.student?.name || payload?.student?.id || '학생';
    const examTitle = payload?.exam?.title || '평가';
    const summary = String(draft.achievementSummary || '').trim() || `${studentName} 학생의 「${examTitle}」 평가 결과를 기준으로 다음 수업 관리 방향을 정리합니다.`;
    const diagnosis = Array.isArray(draft.diagnosis) ? draft.diagnosis.join(' ') : String(draft.diagnosis || summary);
    const nextPlanItems = Array.isArray(draft.nextPlanItems) ? draft.nextPlanItems : [];
    const parentMessage = String(draft.parentMessage || '').trim() || `${studentName} 학생의 평가 결과와 다음 수업 보완 방향을 기본 리포트 기준으로 안내드립니다.`;
    const nextActions = seededActions.length ? seededActions : (nextPlanItems.length ? nextPlanItems.slice(0, 5) : ['기본 리포트 기준으로 다음 수업을 이어갑니다.']);
    const lifeMessage = [positiveAnchor, teacherCareMessage, parentReassurance].filter(Boolean).join(' ');
    const mergedParentMessage = [parentMessage, lifeMessage].filter(Boolean).join(' ');
    return normalizeReportAnalysisResult({
      summary: lowerScoreSupportMode && positiveAnchor && !summary.includes(positiveAnchor) ? `${summary} ${positiveAnchor}` : summary,
      diagnosis: [diagnosis, lowerScoreSupportMode ? growthPotential : ''].filter(Boolean).join(' '),
      wrongAnalysis: Array.isArray(draft.evaluationMeaning) ? draft.evaluationMeaning.slice(1).join(' ') : diagnosis,
      nextPlan: [nextPlanItems.join(' '), lifeBasedNextStep].filter(Boolean).join(' '),
      parentMessage: seededParentGuide && !mergedParentMessage.includes(seededParentGuide) ? `${mergedParentMessage} 가정에서는 ${seededParentGuide}해 주시면 좋겠습니다.` : mergedParentMessage,
      kakaoSummary: String(draft.kakaoSummary || '').trim() || `안녕하세요, AP수학입니다.

${studentName} 학생의 「${examTitle}」 평가 리포트를 전달드립니다.
기본 리포트 기준으로 성취와 보완 방향을 안내드립니다.

감사합니다.`,
      teacherMemo: String(draft.teacherMemo || '').trim() || teacherCareMessage || neutralLifeAnchor || '기본 리포트 기준으로 다음 수업 보완 포인트를 확인합니다.',
      riskLevel: 'stable',
      mainWeaknesses: Array.isArray(payload?.wrongAnalysis) && payload.wrongAnalysis.length ? ['풀이 흐름 확인', '조건 표시와 검산 습관'] : ['정확도 유지', '심화 응용 확장'],
      nextActions
    }, payload);
  }
  const studentName = payload?.student?.name || payload?.student?.id || '학생';
  const examTitle = payload?.exam?.title || '평가';
  const score = payload?.exam?.score;
  const qCount = Number(payload?.exam?.questionCount || 0);
  const wrongRows = Array.isArray(payload?.wrongAnalysis) ? payload.wrongAnalysis : [];
  const wrongCount = wrongRows.length;
  const correctRate = qCount ? Math.round(((qCount - wrongCount) / qCount) * 100) : null;
  const overallAverage = payload?.cohort?.overallAverage;
  const classAverage = payload?.cohort?.classAverage;
  const hard = wrongRows.filter(r => Number.isFinite(Number(r.correctRate)) && Number(r.correctRate) < 65);
  const personal = wrongRows.filter(r => Number.isFinite(Number(r.correctRate)) && Number(r.correctRate) >= 85);
  const units = [...new Set(wrongRows.map(r => r.unit || r.unitKey).filter(Boolean))].slice(0, 3);
  const comparison = [];
  if (Number.isFinite(Number(overallAverage))) comparison.push(`전체 평균 ${overallAverage}점`);
  if (Number.isFinite(Number(classAverage))) comparison.push(`반 평균 ${classAverage}점`);
  const summary = lowerScoreSupportMode
    ? `${studentName} 학생은 「${examTitle}」에서 ${score ?? '-'}점을 기록했습니다. ${positiveAnchor || '이번 리포트는 다음 수업에서 어떤 순서로 회복할지 정리한 자료입니다.'}`
    : `${studentName} 학생은 「${examTitle}」에서 ${score ?? '-'}점을 기록했습니다.${correctRate !== null ? ` 정답률은 ${correctRate}%입니다.` : ''}`;
  const diagnosis = lowerScoreSupportMode
    ? `${studentName} 학생은 이번 평가에서 먼저 회복할 문항과 수업 안에서 다시 잡을 풀이 루틴이 분명하게 확인됩니다. ${growthPotential || '기본 루틴 회복 후 점진적 향상 가능성 중심으로 관리하겠습니다.'} ${neutralLifeAnchor || ''}`.trim()
    : `${summary}${comparison.length ? ` 비교 기준은 ${comparison.join(', ')}입니다.` : ''} 이번 리포트는 오답 번호와 정답률을 기준으로 보완 방향을 정리했습니다.`;
  const wrongAnalysis = wrongCount
    ? `오답은 ${wrongRows.map(r => `${r.questionNo}번`).join(', ')}에서 확인됩니다.${hard.length ? ` 이 중 ${hard.length}문항은 전체 정답률이 낮아 다수 학생이 어려워한 문항으로 볼 수 있습니다.` : ''}${personal.length ? ` ${personal.length}문항은 전체 정답률이 높은 편이라 조건 확인, 계산 정리, 검산 습관을 우선 점검하겠습니다.` : ''}`
    : '이번 평가는 오답 없이 안정적으로 마무리했습니다.';
  const nextActions = seededActions.length ? seededActions : [
    '오답 문항의 풀이 과정을 다시 확인합니다.',
    '조건 표시와 식 세우기 과정을 점검합니다.',
    '계산 후 검산 습관을 짧은 확인문제로 보완합니다.'
  ];
  if (!seededActions.length && units.length) nextActions.unshift(`${units.join(', ')} 단원을 우선 보완합니다.`);
  const nextPlan = `${nextActions.slice(0, 4).join(' ')} ${lifeBasedNextStep || '필요하면 유사문항과 상승문제로 연결하겠습니다.'}`;
  const parentGuideText = seededParentGuide || '문제 조건 표시와 숙제 마무리 여부만 가볍게 확인';
  const parentMessage = lowerScoreSupportMode
    ? `${positiveAnchor || '이번 평가는 단순히 점수를 확인하는 것이 아니라, 어떤 부분을 먼저 정리하면 좋을지 확인하는 자료로 보시면 좋겠습니다.'} ${studentName} 학생은 수업 안에서 다시 정리할 수 있는 지점을 차근차근 잡아가는 과정이 중요합니다. ${teacherCareMessage || '학원에서는 확인할 문항들을 차근차근 다시 풀어보며 조건 확인과 계산 검산 습관을 잡아가겠습니다.'} ${parentReassurance || '학원에서 방향을 잡아가고 있으니 편안한 마음으로 지켜봐 주시면 감사하겠습니다.'} 가정에서는 문제를 풀 때 조건에 표시하는 습관만 자연스럽게 격려해 주시면 충분합니다.`
    : `${positiveAnchor ? `${positiveAnchor} ` : ''}${studentName} 학생의 이번 평가는 점수뿐 아니라 확인할 문항의 단원을 함께 보는 것이 중요합니다. ${teacherCareMessage || '학원에서는 다음 수업에서 원인을 다시 확인하고, 같은 실수가 반복되지 않도록 풀이 순서와 검산 습관을 잡아가겠습니다.'} ${parentReassurance || `가정에서는 ${parentGuideText}해 주시면 좋겠습니다.`}`;
  const kakaoSummary = `안녕하세요, AP수학입니다.\n\n${studentName} 학생의 「${examTitle}」 평가 리포트를 전달드립니다.\n- 점수: ${score ?? '-'}점\n- 문항 수: ${qCount || '-'}문항\n- 오답: ${wrongCount}문항${correctRate !== null ? `\n- 정답률: ${correctRate}%` : ''}\n\n자세한 오답 의미와 보완 계획은 함께 전달드리는 PDF 리포트에서 확인하실 수 있습니다.\n\n감사합니다.`;
  return normalizeReportAnalysisResult({
    summary,
    diagnosis,
    wrongAnalysis,
    nextPlan,
    parentMessage,
    kakaoSummary,
    teacherMemo: teacherCareMessage || (units.length ? `우선 보완 단원: ${units.join(', ')}` : '특이 단원 쏠림 없음'),
    riskLevel: wrongCount >= 5 || hard.length >= 3 ? 'focus' : wrongCount >= 2 ? 'watch' : 'stable',
    mainWeaknesses: units.length ? units : (wrongCount ? ['오답 풀이 과정 점검'] : ['정확도 유지']),
    nextActions
  });
}

function isWeakAiReportResult(result) {
  if (!result || typeof result !== 'object') return true;

  const summary = String(result.summary || '').trim();
  const diagnosis = String(result.diagnosis || '').trim();
  const wrongAnalysis = String(result.wrongAnalysis || '').trim();
  const nextPlan = String(result.nextPlan || '').trim();
  const parentMessage = String(result.parentMessage || '').trim();
  const kakaoSummary = String(result.kakaoSummary || '').trim();
  const teacherMemo = String(result.teacherMemo || '').trim();

  if (summary.length < 80) return true;
  if (diagnosis.length < 200) return true;
  if (wrongAnalysis.length < 180) return true;
  if (nextPlan.length < 180) return true;
  if (parentMessage.length < 360) return true;
  if (kakaoSummary.length < 140) return true;
  if (teacherMemo.length < 50) return true;
  if ((parentMessage.match(/%/g) || []).length > 2) return true;
  if (/못했다|기본 개념을 잘 이해|기본 개념을 이해하고|기본기를 충실히|기본기를 잘|아쉽게 느껴지실 수 있으나|다소 아쉽게|아쉬운 결과|낮은 수치|부족합니다|오답 처리|틀린 문항|틀린 문제/.test(parentMessage)) return true;

  if (!Array.isArray(result.mainWeaknesses) || result.mainWeaknesses.length < 1) return true;
  if (!Array.isArray(result.nextActions) || result.nextActions.length < 2) return true;

  return false;
}

function mergeReportAnalysisWithFallback(result, fallback) {
  const merged = normalizeReportAnalysisResult({ ...(fallback || {}), ...(result || {}) });
  const min = {
    summary: 80,
    diagnosis: 200,
    wrongAnalysis: 180,
    nextPlan: 180,
    parentMessage: 360,
    kakaoSummary: 140,
    teacherMemo: 50
  };
  for (const key of Object.keys(min)) {
    if (String(merged[key] || '').trim().length < min[key]) {
      merged[key] = String(fallback?.[key] || merged[key] || '').trim();
    }
  }
  if ((String(merged.parentMessage || '').match(/%/g) || []).length > 2) {
    merged.parentMessage = normalizeParentMessageOpening(fallback?.parentMessage || merged.parentMessage);
  }
  if (!merged.mainWeaknesses.length) merged.mainWeaknesses = fallback?.mainWeaknesses || [];
  if (merged.nextActions.length < 2) merged.nextActions = fallback?.nextActions || merged.nextActions;
  return merged;
}

async function callReportAiProxyAnalysis(env, payload) {
  const proxyUrl = String(env.REPORT_AI_PROXY_URL || '').trim();
  const proxySecret = String(env.REPORT_AI_PROXY_SECRET || '').trim();
  const fallback = buildFallbackReportAnalysis(payload);

  if (!proxyUrl) {
    return { source: 'fallback', analysis: fallback, warning: 'AI proxy failed: REPORT_AI_PROXY_URL missing' };
  }

  try {
    const response = await fetch(proxyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(proxySecret ? { 'X-Report-AI-Proxy-Secret': proxySecret } : {})
      },
      body: JSON.stringify({
        payload,
        systemPrompt: AP_REPORT_ANALYSIS_SYSTEM_PROMPT,
        userPrompt: buildReportAnalysisUserPrompt(payload),
        schema: REPORT_ANALYSIS_JSON_SCHEMA.schema
      })
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      throw new Error(`AI proxy ${response.status}: ${detail.slice(0, 300)}`);
    }

    const data = await response.json();
    const rawAnalysis = data?.analysis || data?.result || data;
    const normalized = normalizeReportAnalysisResult(rawAnalysis, payload);
    const analysis = isWeakAiReportResult(normalized)
      ? mergeReportAnalysisWithFallback(normalized, fallback)
      : normalized;
    const source = String(data?.source || 'proxy').trim() || 'proxy';

    return {
      source,
      analysis,
      warning: data?.warning ? String(data.warning).slice(0, 500) : ''
    };
  } catch (e) {
    console.error('[AI_REPORT_PROXY_ERROR]', {
      message: String(e?.message || e),
      hasProxyUrl: !!proxyUrl
    });
    return {
      source: 'fallback',
      analysis: fallback,
      warning: `AI proxy failed: ${String(e?.message || e).slice(0, 500)}`
    };
  }
}

export async function handleReportsAi(request, env, teacher, path, url) {
  const method = request.method;
  const resource = path[1];
  const id = path[2];

  if (resource !== 'ai') return null;

  if (id === 'report-analysis' && method === 'POST') {
    const currentTeacher = await requireTeacher(request, env, teacher);
    if (!currentTeacher) return jsonResponse({ error: 'Unauthorized' }, 401);

    const payload = await request.json();
    const studentId = String(payload?.student?.id || payload?.exam?.student_id || '').trim();
    if (studentId && !(await canAccessStudent(currentTeacher, studentId, env))) {
      return jsonResponse({ error: 'Forbidden' }, 403);
    }
    payload.reportWritingSeeds = buildReportWritingSeeds(payload);
    payload.learningLifeSeeds = buildLearningLifeSeeds(payload);

    try {
      const result = await callReportAiProxyAnalysis(env, payload);
      return jsonResponse({
        success: true,
        source: result.source,
        analysis: result.analysis,
        warning: result.warning || ''
      });
    } catch (e) {
      return jsonResponse({
        success: true,
        source: 'fallback',
        warning: e.message,
        analysis: buildFallbackReportAnalysis(payload)
      });
    }
  }

  if (id === 'student-report' && method === 'POST') {
    const p = await request.json();
    const { type, student, today: td } = p;
    const examStr = td?.exam ? `${td.exam.title} ${td.exam.score}점` : '없음';
    const fallback = type === 'parent'
      ? `[AP Math] ${student.name} 학생 오늘 수업 안내\n출결: ${td.att}\n숙제: ${td.hw}\n성적: ${examStr}`
      : type === 'student'
        ? `${student.name}아 수고했어!`
        : `상담메모: ${student.name}`;
    return jsonResponse({ success: true, message: fallback, source: 'fallback' });
  }

  return null;
}
