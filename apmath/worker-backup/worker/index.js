/**
 * AP Math OS v26.1.2 [IRONCLAD - Phase 4/5 FINAL RECOVERY]
 * Cloudflare Worker 통합 API 엔진 - 절대 축약 없음, 모든 기존 API 복구 완료본
 * Phase 4/5 Add-on: class_textbooks / class_daily_records / class_daily_progress API 추가
 * Planner Add-on: student_plans / planner_feedback API 추가
 */

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Student-Token'
};

// SHA-256 헬퍼
async function sha256hex(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Basic Auth 파싱 및 검증
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
  } catch (e) { return null; }
}

// 권한 검증 헬퍼: 특정 학생에 접근 가능한가?
async function canAccessStudent(teacher, studentId, env) {
  if (isAdminUser(teacher)) return true;
  const row = await env.DB.prepare(`
    SELECT 1 FROM class_students cs
    JOIN teacher_classes tc ON tc.class_id = cs.class_id
    WHERE cs.student_id = ? AND tc.teacher_id = ?
    LIMIT 1
  `).bind(studentId, teacher.id).first();
  return !!row;
}

// 권한 검증 헬퍼: 특정 반에 접근 가능한가?
async function canAccessClass(teacher, classId, env) {
  if (isAdminUser(teacher)) return true;
  const row = await env.DB.prepare(`
    SELECT 1 FROM teacher_classes
    WHERE teacher_id = ? AND class_id = ?
  `).bind(teacher.id, classId).first();
  return !!row;
}

// 역할 확인 헬퍼
function isAdminUser(teacher) { return teacher?.role === 'admin'; }
function isStaffUser(user) {
  const role = String(user?.role || '').toLowerCase();
  return role === 'admin' || role === 'teacher';
}
function isTeacherUser(teacher) { return String(teacher?.role || '').toLowerCase() === 'teacher'; }

// 선생님 이름 정규화 (syncTeacherClassMapping과 동일 기준)
function normalizeTeacherName(name) {
  return String(name || '').trim().replace(/\s+/g, '').replace(/선생님$/, '');
}

function normalizeTeacherAlias(name) {
  const raw = String(name || '').trim();
  if (!raw) return '';
  const compact = raw.replace(/\s+/g, '').replace(/선생님$/g, '');
  const lower = compact.toLowerCase();
  const alias = {
    teacher1: '박준성',
    t1: '박준성',
    '선생님1': '박준성',
    teacher2: '정겨운',
    t2: '정겨운',
    '선생님2': '정겨운',
    teacher3: '정의한',
    t3: '정의한',
    '선생님3': '정의한'
  };
  return alias[lower] || alias[compact] || compact;
}

async function findTeacherByAlias(env, teacherName) {
  const normalized = normalizeTeacherAlias(teacherName);
  if (!normalized) return null;
  const teachers = await env.DB.prepare('SELECT id, login_id, name, role FROM teachers').all();
  const matches = (teachers.results || []).filter(t => normalizeTeacherAlias(t.name) === normalized);
  return matches.find(t => t.role === 'teacher') || matches[0] || null;
}

async function repairTeacherClassMappings(env) {
  const classes = await env.DB.prepare(`
    SELECT id, teacher_name
    FROM classes
    WHERE teacher_name IS NOT NULL
      AND TRIM(teacher_name) != ''
      AND (is_active != 0 OR is_active IS NULL)
  `).all();

  const teachers = await env.DB.prepare('SELECT id, login_id, name, role FROM teachers').all();
  const teacherRows = teachers.results || [];
  const stmts = [];

  for (const cls of (classes.results || [])) {
    const normalized = normalizeTeacherAlias(cls.teacher_name);
    if (!normalized) continue;
    const matches = teacherRows.filter(t => normalizeTeacherAlias(t.name) === normalized);
    const teacher = matches.find(t => t.role === 'teacher') || matches[0];
    if (!teacher) continue;
    stmts.push(
      env.DB.prepare('INSERT OR IGNORE INTO teacher_classes (teacher_id, class_id) VALUES (?, ?)').bind(teacher.id, cls.id)
    );
  }

  if (stmts.length) await env.DB.batch(stmts);
  return stmts.length;
}

// 선생님 담당반 ID 목록 반환
async function getTeacherClassIds(env, teacher) {
  if (!teacher) return [];
  const res = await env.DB.prepare('SELECT class_id FROM teacher_classes WHERE teacher_id = ?').bind(teacher.id).all();
  return (res.results || []).map(r => r.class_id);
}

// 학생 기록 접근 권한 (canAccessStudent의 의미 명시형 alias)
async function canAccessStudentRecord(teacher, studentId, env) {
  return canAccessStudent(teacher, studentId, env);
}

// 학년별 PIN 자동 채번 함수
async function generateStudentPin(grade, env) {
  const prefixes = { '중1': '11', '중2': '12', '중3': '13', '고1': '21', '고2': '22', '고3': '23' };
  const prefix = prefixes[grade] || '99';
  const res = await env.DB.prepare(`SELECT student_pin FROM students WHERE student_pin LIKE ? ORDER BY student_pin DESC LIMIT 1`).bind(prefix + '%').first();
  
  if (res && res.student_pin) {
    const currentNum = parseInt(res.student_pin, 10);
    return String(currentNum + 1).padStart(4, '0');
  } else {
    return prefix + '01';
  }
}

function todayKstDateString() {
  return new Date(new Date().getTime() + (9 * 60 * 60 * 1000)).toISOString().split('T')[0];
}

function normalizeTargetScore(value) {
  if (value === undefined || value === null || value === '') return null;
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  return Math.max(0, Math.min(100, Math.round(n)));
}

function normalizeHighSubjects(value) {
  const allowed = new Set(['대수', '미적분Ⅰ', '확률과통계', '미적분Ⅱ', '기하']);
  let arr = [];

  if (Array.isArray(value)) {
    arr = value;
  } else if (value === undefined || value === null || value === '') {
    arr = [];
  } else {
    const text = String(value || '').trim();
    try {
      const parsed = JSON.parse(text);
      arr = Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      arr = text.split(',');
    }
  }

  const clean = [];
  for (const item of arr) {
    const subject = String(item || '').trim();
    if (allowed.has(subject) && !clean.includes(subject)) clean.push(subject);
  }

  return JSON.stringify(clean);
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

function safeJsonParse(text) {
  try { return JSON.parse(text); } catch (e) {}
  const raw = String(text || '').trim();
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start >= 0 && end > start) {
    try { return JSON.parse(raw.slice(start, end + 1)); } catch (e) {}
  }
  return null;
}

function extractResponseText(data) {
  if (!data) return '';
  if (typeof data.output_text === 'string') return data.output_text;
  const parts = [];
  for (const item of (data.output || [])) {
    for (const c of (item.content || [])) {
      if (typeof c.text === 'string') parts.push(c.text);
      else if (typeof c.output_text === 'string') parts.push(c.output_text);
    }
  }
  return parts.join('\n').trim();
}

function extractGeminiText(data) {
  const parts = data?.candidates?.[0]?.content?.parts || [];
  return parts
    .map(p => {
      if (typeof p?.text === 'string') return p.text;
      return '';
    })
    .join('\n')
    .trim();
}

function parseGeminiJsonText(text) {
  const raw = String(text || '')
    .replace(/^\uFEFF/, '')
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/```$/i, '')
    .trim();

  let parsed = safeJsonParse(raw);
  if (parsed) return parsed;

  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start >= 0 && end > start) {
    parsed = safeJsonParse(raw.slice(start, end + 1));
    if (parsed) return parsed;
  }

  return null;
}

function buildGeminiReportAnalysisSchema() {
  return {
    type: 'OBJECT',
    properties: {
      summary: { type: 'STRING' },
      diagnosis: { type: 'STRING' },
      wrongAnalysis: { type: 'STRING' },
      nextPlan: { type: 'STRING' },
      parentMessage: { type: 'STRING' },
      kakaoSummary: { type: 'STRING' },
      teacherMemo: { type: 'STRING' },
      riskLevel: { type: 'STRING', enum: ['stable', 'watch', 'focus'] },
      mainWeaknesses: { type: 'ARRAY', items: { type: 'STRING' } },
      nextActions: { type: 'ARRAY', items: { type: 'STRING' } }
    },
    required: [
      'summary',
      'diagnosis',
      'wrongAnalysis',
      'nextPlan',
      'parentMessage',
      'kakaoSummary',
      'teacherMemo',
      'riskLevel',
      'mainWeaknesses',
      'nextActions'
    ],
    propertyOrdering: [
      'summary',
      'diagnosis',
      'wrongAnalysis',
      'nextPlan',
      'parentMessage',
      'kakaoSummary',
      'teacherMemo',
      'riskLevel',
      'mainWeaknesses',
      'nextActions'
    ]
  };
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


async function callGeminiReportAnalysis(env, payload) {
  const apiKey = env.GEMINI_API_KEY;
  const fallback = buildFallbackReportAnalysis(payload);

  if (!apiKey) {
    return { source: 'fallback', analysis: fallback, warning: 'Gemini failed: GEMINI_API_KEY missing' };
  }

  const userPrompt = buildReportAnalysisUserPrompt(payload);
  const geminiModelCandidates = [
    env.GEMINI_REPORT_MODEL || 'gemini-3-flash-preview',
    'gemini-2.5-flash',
    'gemini-2.5-flash-lite'
  ];
  const models = geminiModelCandidates.filter((model, index, arr) => arr.indexOf(model) === index);
  let lastErrorMessage = 'unknown error';

  for (const model of models) {
    try {
      return await callGeminiReportAnalysisOnce(apiKey, model, payload, fallback, userPrompt);
    } catch (e) {
      lastErrorMessage = String(e?.message || e || 'unknown error');
      console.error('[AI_REPORT_GEMINI_ERROR]', {
        message: lastErrorMessage,
        model
      });
      if (!(e?.retryNextModel || e?.skipModel)) break;
    }
  }

  return {
    source: 'fallback',
    analysis: fallback,
    warning: `Gemini failed: ${lastErrorMessage.slice(0, 500)}`
  };
}

async function callGeminiReportAnalysisOnce(apiKey, model, payload, fallback, userPrompt) {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey
    },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `${AP_REPORT_ANALYSIS_SYSTEM_PROMPT}\n\n${userPrompt}`
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.25,
        maxOutputTokens: 6000,
        responseMimeType: 'application/json'
      }
    })
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    const status = response.status;
    const retryStatuses = new Set([429, 500, 502, 503, 504]);
    const error = new Error(`Gemini ${status}: ${detail.slice(0, 300)}`);
    error.status = status;
    error.retryNextModel = retryStatuses.has(status);
    error.skipModel = status === 404;
    throw error;
  }

  const data = await response.json();
  const text = extractGeminiText(data);
  const parsed = parseGeminiJsonText(text);
  if (!parsed) {
    const finishReason = data?.candidates?.[0]?.finishReason || '';
    const blockReason = data?.promptFeedback?.blockReason || '';
    console.error('[AI_REPORT_GEMINI_PARSE_DEBUG]', {
      model,
      textSample: text.slice(0, 1000),
      candidateCount: Array.isArray(data?.candidates) ? data.candidates.length : 0,
      finishReason,
      blockReason,
      safetyRatings: data?.candidates?.[0]?.safetyRatings || data?.promptFeedback?.safetyRatings || []
    });
    const error = new Error(`Gemini JSON parse failed (finishReason=${finishReason}, blockReason=${blockReason}): ${text.slice(0, 1000)}`);
    error.retryNextModel = true;
    throw error;
  }

  const normalized = normalizeReportAnalysisResult(parsed, payload);
  if (isWeakAiReportResult(normalized)) {
    const merged = mergeReportAnalysisWithFallback(normalized, fallback);
    return { source: 'gemini', analysis: merged };
  }

  return { source: 'gemini', analysis: normalized };
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

async function callOpenAiReportAnalysis(env, payload) {
  const apiKey = env.OPENAI_API_KEY;
  if (!apiKey) return { source: 'fallback', analysis: buildFallbackReportAnalysis(payload) };

  const model = env.OPENAI_REPORT_MODEL || env.OPENAI_MODEL || 'gpt-5.2';
  const hasBaseDraft = !!payload?.baseReportDraft;
  const userPrompt = [
    hasBaseDraft
      ? '아래 학생 평가 데이터와 기본 리포트 초안을 바탕으로, 기본 리포트를 더 자연스럽고 신뢰감 있는 학부모 발송용 리포트로 개선하라.'
      : '아래 학생 평가 데이터를 바탕으로 학부모 평가 리포트 문장을 작성하라.',
    '',
    '[중요 작업 방식]',
    '- 기본 리포트 초안이 있으면 절대 무시하지 않는다.',
    '- 새 리포트를 처음부터 다시 쓰지 말고, 기본 리포트를 더 좋게 다듬는다.',
    '- 기본 리포트보다 더 짧거나 딱딱하게 만들지 않는다.',
    '- 반복 문장을 제거하고, 섹션별 역할을 분리한다.',
    '- summary는 성취 중심, diagnosis는 평가 해석, wrongAnalysis는 문항별 확인 포인트, nextPlan은 다음 수업 조치, parentMessage는 학부모 발송문 역할을 맡는다.',
    '- parentMessage는 반드시 "어머님, 안녕하세요."로 시작한다.',
    '- "어머님, 안녕하세요."는 parentMessage 최종 결과의 첫 문장에만 사용한다.',
    '- summary, diagnosis, wrongAnalysis, nextPlan, teacherMemo, nextActions에는 "어머님"이라는 표현을 절대 쓰지 않는다.',
    '- payload.learningLifeSeeds를 참고해 점수표가 아니라 성취 확인, 학습 회복 계획, 학원 관리 안내가 드러나게 쓴다.',
    '- payload.learningLifeSeeds.parentMessageExampleSeeds를 참고하라.',
    '- parentMessageExampleSeeds 안의 예시는 parentMessage 톤 참고용으로만 사용하고, summary, diagnosis, wrongAnalysis, nextPlan, teacherMemo, nextActions에는 섞지 않는다.',
    '- 예시 문구를 그대로 복사하지 말고, 학생 데이터에 맞게 톤과 구조만 참고해 새로 작성한다.',
    '- learningLifeSeeds.lowerScoreSupportMode가 true이면 parentMessageExampleSeeds.lower의 톤을 우선 참고한다.',
    '- wrongCount가 0이고 score가 만점 또는 correctRate가 100이면 parentMessageExampleSeeds.perfect의 톤을 참고한다.',
    '- score가 90점 이상이거나 오답이 1개 이하이면 parentMessageExampleSeeds.high의 톤을 참고한다.',
    '- 그 외 일반 보완형 학생은 parentMessageExampleSeeds.middle의 톤을 참고한다.',
    '- parentMessage는 예시보다 짧아지지 않게 작성한다.',
    '- 예시와 같은 문장을 그대로 반복하지 않는다.',
    '- learningLifeSeeds.lowerScoreSupportMode가 true이면 positiveAnchor, parentReassurance, teacherCareMessage를 반드시 최소 1개 이상 반영한다.',
    '- positiveAnchor, parentReassurance, teacherCareMessage, growthPotential, lifeBasedNextStep, effortTone, clinicTone, neutralLifeAnchor에는 "어머님" 인사말을 넣지 않는다.',
    '- 점수, 정답률, 평균, 퍼센트 표현은 과도하게 반복하지 않는다.',
    '- parentMessage에서는 % 기호를 쓰지 말고 정답률 표현도 최소화한다.',
    '- 하위권 학생은 결과보다 회복 순서, 수업 관리, 긍정적 가능성을 중심으로 작성한다.',
    '- 하위권 학생 parentMessage는 점수보다 학습 점검, 부족 지적보다 회복 순서, 가정 부담 최소화, 학원 관리 책임 강조를 중심으로 작성한다.',
    '- 하위권 학생 parentMessage 첫 내용은 "이번 평가는 단순히 점수를 확인하는 것이 아니라, 학생이 어떤 부분을 먼저 정리하면 좋을지 확인하는 자료"라는 방향으로 잡는다.',
    '- 학생 태도 칭찬은 teacherMemo나 payload 근거가 있을 때 우선 반영하고, 근거가 없으면 수업 안에서 다시 정리할 지점과 학원 관리 계획으로 표현한다.',
    '- 기본 개념을 잘 이해하고 있다처럼 데이터 없이 단정하지 않는다.',
    '- 하위권 기준은 score가 전체 평균보다 10점 이상 낮음, wrongCount 6 이상, correctRate 65 미만, wrongCount / questionCount 0.35 이상 중 하나다.',
    '- 하위권 학생 parentMessage에는 반드시 안심 문장을 포함한다.',
    '- 하위권 학생 parentMessage의 가정 요청은 문제를 많이 다시 풀리라는 식이 아니라, 조건 표시 습관을 자연스럽게 격려하는 정도로 제한한다.',
    '- "못했다", "낮은 수치", "아쉽게 느껴지실 수 있으나", "다소 아쉽게", "아쉬운 결과", "다소 아쉬운 결과", "부족합니다", "오답 처리", "실수 방지", "틀린 문항", "틀린 문제", "기본 개념을 잘 이해하고 있습니다", "기본 개념을 잘 이해하고 있음을 확인했습니다", "기본 개념을 이해하고 있다는 점을 확인했습니다", "기본기를 충실히 다지고 있습니다", "기본기를 충실히 다지고 있다는 점을 확인했습니다" 같은 표현은 parentMessage에 쓰지 않는다.',
    '- 위 금지 표현 대신 "배운 내용을 다시 연결해 갈 수 있는 지점이 보였습니다", "수업 안에서 다시 정리할 수 있는 부분이 분명히 보였습니다", "현재 흐름에서 더 안정화할 지점이 확인되었습니다", "풀이 과정에서 한 번 더 정리할 부분이 보였습니다"처럼 표현한다.',
    '- parentMessage에서는 "아쉽게" 계열 표현 대신 "앞으로 어떤 부분을 먼저 정리해야 할지 확인할 수 있었던 자료"처럼 관리 방향 중심으로 표현한다.',
    '- parentMessage에서 문항을 언급할 때는 "확인할 문항", "다시 살펴볼 문항", "차근차근 다시 풀어볼 문항"으로 표현한다.',
    '- teacherMemo의 긍정적인 생활/태도 정보는 점수 분석보다 우선해 자연스럽게 반영한다.',
    '- 기록이 없는 출석, 숙제, 보강, 클리닉 사실은 만들지 않는다.',
    '- 가정 요청은 1개만 제시하고 부담스럽지 않게 쓴다.',
    '',
    '입력 데이터:',
    clampText(JSON.stringify(payload, null, 2), 22000),
    '',
    '작성 필수 기준:',
    '- 첫 문단은 반드시 성취와 안정적인 부분부터 시작한다.',
    '- 오답은 부정적 지적이 아니라 다음 수업에서 확인할 포인트로 표현한다.',
    '- 오답이 많으면 전부 길게 나열하지 말고 우선 보완 문항과 단원 중심으로 정리한다.',
    '- 오답이 없으면 우수 해결 문항, 정확도 유지, 심화 확장 계획을 작성한다.',
    '- parentMessage는 420자 이상, 6문장 이상으로 작성한다.',
    '- kakaoSummary는 카카오톡 발송 문구처럼 6~10줄 내외로 작성한다.',
    '- 다음 수업에서 실제로 할 조치를 구체적으로 작성한다.',
    '- 학부모용 결과물에는 확인 불가, 자료 없음, 아카이브, 시스템, 함수, 코드 같은 표현을 절대 쓰지 않는다.',
    '- 없는 사실은 만들지 않는다.',
    '- 짧게 요약하지 않는다.',
    '- 같은 문장을 여러 필드에 복사하지 않는다.'
  ].join('\n');

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      instructions: AP_REPORT_ANALYSIS_SYSTEM_PROMPT,
      input: userPrompt,
      max_output_tokens: 4500,
      text: {
        format: {
          type: 'json_schema',
          name: REPORT_ANALYSIS_JSON_SCHEMA.name,
          schema: REPORT_ANALYSIS_JSON_SCHEMA.schema,
          strict: REPORT_ANALYSIS_JSON_SCHEMA.strict
        }
      }
    })
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`OpenAI ${response.status}: ${detail.slice(0, 300)}`);
  }

  const data = await response.json();
  const parsed = safeJsonParse(extractResponseText(data));
  if (!parsed) throw new Error('AI JSON parse failed');
  const normalized = normalizeReportAnalysisResult(parsed, payload);
  const fallback = buildFallbackReportAnalysis(payload);
  const analysis = isWeakAiReportResult(normalized)
    ? mergeReportAnalysisWithFallback(normalized, fallback)
    : normalized;
  return { source: 'ai', analysis };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname.split('/').filter(Boolean);
    const method = request.method;

    if (method === 'OPTIONS') return new Response(null, { headers });

    try {
      if (path[0] === 'api') {
        const resource = path[1];
        const id = path[2];

        // --- 1. 인증 및 계정 관리 ---
        if (resource === 'auth' && path[2] === 'login' && method === 'POST') {
          const { login_id, password } = await request.json();
          const hash = await sha256hex(password);
          const teacher = await env.DB.prepare('SELECT id, name, role FROM teachers WHERE login_id = ? AND password_hash = ?').bind(login_id, hash).first();
          if (!teacher) return new Response(JSON.stringify({ success: false, message: '아이디 또는 비밀번호 오류' }), { status: 401, headers });
          return new Response(JSON.stringify({ success: true, id: teacher.id, name: teacher.name, role: teacher.role }), { headers });
        }

        if (resource === 'auth' && path[2] === 'change-password' && method === 'POST') {
          const teacher = await verifyAuth(request, env);
          if (!teacher) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });
          const { new_password } = await request.json();
          const hash = await sha256hex(new_password);
          await env.DB.prepare('UPDATE teachers SET password_hash = ? WHERE id = ?').bind(hash, teacher.id).run();
          return new Response(JSON.stringify({ success: true }), { headers });
        }

        // --- 2. 학생용 QR 인증 및 초기화 (check-pin / check-init) ---
        if (resource === 'check-pin' && method === 'POST') {
          const { student_id, pin } = await request.json();
          const student = await env.DB.prepare('SELECT student_pin FROM students WHERE id = ?').bind(student_id).first();
          if (!student?.student_pin || student.student_pin === String(pin)) {
            return new Response(JSON.stringify({ success: true }), { headers });
          }
          return new Response(JSON.stringify({ success: false, message: 'PIN 번호가 일치하지 않습니다.' }), { status: 401, headers });
        }

        if (resource === 'check-init' && method === 'GET') {
          const classId = url.searchParams.get('class');
          const examTitle = url.searchParams.get('exam') || '';
          const examDate = url.searchParams.get('date') || '';
          const qCount = parseInt(url.searchParams.get('q')) || 0;
          
          const archiveFile = 
            url.searchParams.get('archiveFile') || 
            url.searchParams.get('archive_file') || 
            url.searchParams.get('archive') || 
            '';

          if (!classId) return new Response(JSON.stringify({ error: 'class required', students: [], submitted_sessions: [] }), { status: 400, headers });

          const todayKST = todayKstDateString();
          const targetDate = examDate || todayKST;

          const [clsInfo, stds, sessions] = await Promise.all([
            env.DB.prepare('SELECT name FROM classes WHERE id = ?').bind(classId).first(),
            env.DB.prepare("SELECT id, name, school_name, grade, student_pin FROM students WHERE id IN (SELECT student_id FROM class_students WHERE class_id = ?) AND status = '재원'").bind(classId).all(),
            env.DB.prepare("SELECT id, student_id, exam_title, exam_date, score FROM exam_sessions WHERE exam_title = ? AND exam_date = ? AND student_id IN (SELECT student_id FROM class_students WHERE class_id = ?)").bind(examTitle, targetDate, classId).all()
          ]);

          return new Response(JSON.stringify({ 
            success: true,
            class_id: classId, 
            class_name: clsInfo?.name || '알 수 없는 반', 
            exam_title: examTitle, 
            exam_date: targetDate,
            question_count: qCount,
            archive_file: archiveFile,
            students: stds.results, 
            submitted_sessions: sessions.results 
          }), { headers });
        }

        // --- 3. QR 출제용 반 목록 ---
        if (resource === 'qr-classes' && method === 'GET') {
          const teacher = await verifyAuth(request, env);
          if (!teacher) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });

          let query, params = [];
          if (isAdminUser(teacher)) {
            query = `SELECT id, name, grade, teacher_name FROM classes WHERE is_active != 0 OR is_active IS NULL ORDER BY grade, name`;
          } else {
            query = `
              SELECT c.id, c.name, c.grade, c.teacher_name 
              FROM classes c
              JOIN teacher_classes tc ON tc.class_id = c.id
              WHERE tc.teacher_id = ? AND (c.is_active != 0 OR c.is_active IS NULL)
              ORDER BY c.grade, c.name`;
            params.push(teacher.id);
          }
          const res = await env.DB.prepare(query).bind(...params).all();
          return new Response(JSON.stringify({ success: true, classes: res.results }), { headers });
        }

        // --- 4. 메인 데이터 로드 (initial-data) ---
        if (resource === 'initial-data') {
          const teacher = await verifyAuth(request, env);
          if (!teacher) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });

          await repairTeacherClassMappings(env);

          let stds, clss, map, att, hw, exs, wrs, attHis, hwHis, cns, opm, exS, acs, ser, jou, txt, cdr, cdp, timetableClasses;
          let ttAllClassStudents = { results: [] };
          let ttAllStudents = { results: [] };
          let ttAllClassTextbooks = { results: [] };

          if (isAdminUser(teacher)) {
            [stds, clss, map, att, hw, exs, wrs, attHis, hwHis, cns, opm, exS, acs, ser, jou, txt, cdr, cdp, timetableClasses] = await Promise.all([
              env.DB.prepare('SELECT * FROM students').all(),
              env.DB.prepare('SELECT * FROM classes').all(),
              env.DB.prepare('SELECT * FROM class_students').all(),
              env.DB.prepare("SELECT * FROM attendance WHERE date = DATE('now', '+9 hours')").all(),
              env.DB.prepare("SELECT * FROM homework WHERE date = DATE('now', '+9 hours')").all(),
              env.DB.prepare('SELECT * FROM exam_sessions ORDER BY exam_date DESC LIMIT 500').all(),
              env.DB.prepare('SELECT * FROM wrong_answers').all(),
              env.DB.prepare("SELECT * FROM attendance WHERE date >= DATE('now', '+9 hours', '-14 days') LIMIT 1000").all(),
              env.DB.prepare("SELECT * FROM homework WHERE date >= DATE('now', '+9 hours', '-14 days') LIMIT 1000").all(),
              env.DB.prepare('SELECT * FROM consultations ORDER BY date DESC, created_at DESC').all(),
              env.DB.prepare('SELECT * FROM operation_memos WHERE teacher_name = ? ORDER BY is_done ASC, is_pinned DESC, memo_date ASC').bind(teacher.name).all(),
              env.DB.prepare('SELECT * FROM exam_schedules ORDER BY exam_date ASC').all(),
              env.DB.prepare('SELECT * FROM academy_schedules WHERE is_deleted = 0 ORDER BY schedule_date ASC, start_time ASC, created_at ASC').all(),
              env.DB.prepare('SELECT * FROM school_exam_records WHERE is_deleted = 0 ORDER BY exam_year DESC, semester DESC, created_at DESC LIMIT 1000').all(),
              env.DB.prepare('SELECT * FROM daily_journals ORDER BY date DESC, created_at DESC').all(),
              env.DB.prepare('SELECT * FROM class_textbooks ORDER BY class_id ASC, status ASC, sort_order ASC, created_at ASC').all(),
              env.DB.prepare('SELECT * FROM class_daily_records ORDER BY date DESC, created_at DESC LIMIT 1000').all(),
              env.DB.prepare('SELECT * FROM class_daily_progress ORDER BY created_at ASC LIMIT 3000').all(),
              env.DB.prepare('SELECT id, name, grade, subject, teacher_name, schedule_days, time_label, textbook, is_active FROM classes WHERE is_active != 0 OR is_active IS NULL ORDER BY grade, name').all()
            ]);
          } else {
            const tcls = await env.DB.prepare('SELECT class_id FROM teacher_classes WHERE teacher_id = ?').bind(teacher.id).all();
            const classIds = tcls.results.map(r => r.class_id);
            timetableClasses = await env.DB.prepare('SELECT id, name, grade, subject, teacher_name, schedule_days, time_label, textbook, is_active FROM classes WHERE is_active != 0 OR is_active IS NULL ORDER BY grade, name').all();

            // 시간표 전용 전체 데이터 (권한 범위와 분리, D1 바인딩 한도 회피)
            [ttAllClassStudents, ttAllStudents, ttAllClassTextbooks] = await Promise.all([
              env.DB.prepare('SELECT * FROM class_students').all(),
              env.DB.prepare('SELECT id, name, status, memo, created_at FROM students').all(),
              env.DB.prepare('SELECT * FROM class_textbooks ORDER BY class_id ASC, status ASC, sort_order ASC, created_at ASC').all()
            ]);

            opm = await env.DB.prepare("SELECT * FROM operation_memos WHERE teacher_name = ? ORDER BY is_done ASC, is_pinned DESC, memo_date ASC").bind(teacher.name).all();
            exS = await env.DB.prepare('SELECT * FROM exam_schedules ORDER BY exam_date ASC').all();
            if (classIds.length) {
              const cMark = classIds.map(() => '?').join(',');
              acs = await env.DB.prepare(`SELECT * FROM academy_schedules WHERE is_deleted = 0 AND (target_scope = 'global' OR (target_scope = 'teacher' AND teacher_name = ?) OR (target_scope = 'student' AND student_id IN (SELECT student_id FROM class_students WHERE class_id IN (${cMark})))) ORDER BY schedule_date ASC, start_time ASC, created_at ASC`).bind(teacher.name, ...classIds).all();
            } else {
              acs = await env.DB.prepare(`SELECT * FROM academy_schedules WHERE is_deleted = 0 AND (target_scope = 'global' OR (target_scope = 'teacher' AND teacher_name = ?)) ORDER BY schedule_date ASC, start_time ASC, created_at ASC`).bind(teacher.name).all();
            }
            jou = await env.DB.prepare('SELECT * FROM daily_journals WHERE teacher_name = ? ORDER BY date DESC').bind(teacher.name).all();

            if (!classIds.length) {
              return new Response(JSON.stringify({
                students: [],
                classes: [],
                class_students: [],
                attendance: [],
                homework: [],
                exam_sessions: [],
                wrong_answers: [],
                attendance_history: [],
                homework_history: [],
                consultations: [],
                operation_memos: opm.results,
                exam_schedules: exS.results,
                academy_schedules: acs.results,
                school_exam_records: [],
                journals: jou.results,
                class_textbooks: [],
                class_daily_records: [],
                class_daily_progress: [],
                timetable_classes: timetableClasses.results,
                timetable_class_students: ttAllClassStudents.results,
                timetable_students: ttAllStudents.results,
                timetable_class_textbooks: ttAllClassTextbooks.results
              }), { headers });
            }
            
            const cMarkers = classIds.map(() => '?').join(',');
            [clss, map, txt, cdr, cdp] = await Promise.all([
              env.DB.prepare(`SELECT * FROM classes WHERE id IN (${cMarkers})`).bind(...classIds).all(),
              env.DB.prepare(`SELECT * FROM class_students WHERE class_id IN (${cMarkers})`).bind(...classIds).all(),
              env.DB.prepare(`SELECT * FROM class_textbooks WHERE class_id IN (${cMarkers}) ORDER BY class_id ASC, status ASC, sort_order ASC, created_at ASC`).bind(...classIds).all(),
              env.DB.prepare(`SELECT * FROM class_daily_records WHERE class_id IN (${cMarkers}) ORDER BY date DESC, created_at DESC LIMIT 1000`).bind(...classIds).all(),
              env.DB.prepare(`SELECT * FROM class_daily_progress WHERE class_id IN (${cMarkers}) ORDER BY created_at ASC LIMIT 3000`).bind(...classIds).all()
            ]);

            const studentIds = map.results.map(r => r.student_id);
            if (studentIds.length > 0) {
              const sMarkers = studentIds.map(() => '?').join(',');
              [stds, att, hw, exs, wrs, attHis, hwHis, cns, ser] = await Promise.all([
                env.DB.prepare(`SELECT * FROM students WHERE id IN (${sMarkers})`).bind(...studentIds).all(),
                env.DB.prepare(`SELECT * FROM attendance WHERE date = DATE('now', '+9 hours') AND student_id IN (${sMarkers})`).bind(...studentIds).all(),
                env.DB.prepare(`SELECT * FROM homework WHERE date = DATE('now', '+9 hours') AND student_id IN (${sMarkers})`).bind(...studentIds).all(),
                env.DB.prepare(`SELECT * FROM exam_sessions WHERE student_id IN (${sMarkers}) ORDER BY exam_date DESC LIMIT 300`).bind(...studentIds).all(),
                env.DB.prepare(`SELECT * FROM wrong_answers WHERE student_id IN (${sMarkers})`).bind(...studentIds).all(),
                env.DB.prepare(`SELECT * FROM attendance WHERE date >= DATE('now', '+9 hours', '-14 days') AND student_id IN (${sMarkers})`).bind(...studentIds).all(),
                env.DB.prepare(`SELECT * FROM homework WHERE date >= DATE('now', '+9 hours', '-14 days') AND student_id IN (${sMarkers})`).bind(...studentIds).all(),
                env.DB.prepare(`SELECT * FROM consultations WHERE student_id IN (${sMarkers}) ORDER BY date DESC, created_at DESC`).bind(...studentIds).all(),
                env.DB.prepare(`SELECT * FROM school_exam_records WHERE is_deleted = 0 AND student_id IN (${sMarkers}) ORDER BY exam_year DESC, semester DESC, created_at DESC LIMIT 500`).bind(...studentIds).all()
              ]);
            } else {
              stds = { results: [] };
              att = { results: [] };
              hw = { results: [] };
              exs = { results: [] };
              wrs = { results: [] };
              attHis = { results: [] };
              hwHis = { results: [] };
              cns = { results: [] };
              ser = { results: [] };
            }
          }

          return new Response(JSON.stringify({
            students: stds.results,
            classes: clss.results,
            class_students: map.results,
            attendance: att.results,
            homework: hw.results,
            exam_sessions: exs.results,
            wrong_answers: wrs.results,
            attendance_history: attHis.results,
            homework_history: hwHis.results,
            consultations: cns.results,
            operation_memos: opm.results,
            exam_schedules: exS.results,
            academy_schedules: acs.results,
            school_exam_records: ser.results,
            journals: jou.results,
            class_textbooks: txt.results,
            class_daily_records: cdr.results,
            class_daily_progress: cdp.results,
            timetable_classes: timetableClasses.results,
            timetable_class_students: ttAllClassStudents.results,
            timetable_students: ttAllStudents.results,
            timetable_class_textbooks: isAdminUser(teacher) ? txt.results : ttAllClassTextbooks.results
          }), { headers });
        }

        // --- 5. 학생 관리 ---
        if (resource === 'students') {
          const teacher = await verifyAuth(request, env);
          if (!teacher) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });

          const normalizeStudentPayload = (d = {}, current = {}) => ({
            name: String(d.name ?? current.name ?? '').trim(),
            schoolName: String(d.school_name ?? d.schoolName ?? current.school_name ?? '').trim(),
            grade: String(d.grade ?? current.grade ?? '').trim(),
            targetScore: d.target_score ?? d.targetScore ?? current.target_score ?? null,
            memo: String(d.memo ?? current.memo ?? '').trim(),
            guardianRelation: String(d.guardian_relation ?? d.guardianRelation ?? current.guardian_relation ?? '').trim(),
            studentPhone: String(d.student_phone ?? d.studentPhone ?? current.student_phone ?? '').trim(),
            parentPhone: String(d.parent_phone ?? d.parentPhone ?? current.parent_phone ?? '').trim(),
            studentPin: String(d.student_pin ?? d.studentPin ?? current.student_pin ?? '').trim(),
            highSubjects: normalizeHighSubjects(d.high_subjects ?? d.highSubjects ?? current.high_subjects ?? '[]'),
            classId: d.class_id !== undefined || d.classId !== undefined ? String(d.class_id ?? d.classId ?? '').trim() : undefined
          });

          if (method === 'POST' && id === 'batch-pins') {
            const { class_id } = await request.json();
            if (!class_id && !isAdminUser(teacher)) return new Response(JSON.stringify({ error: 'Class ID required' }), { status: 403, headers });
            if (class_id && !(await canAccessClass(teacher, class_id, env))) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers });
            const targets = class_id
              ? await env.DB.prepare("SELECT id, grade FROM students WHERE (student_pin IS NULL OR student_pin = '') AND status = '재원' AND id IN (SELECT student_id FROM class_students WHERE class_id = ?)").bind(class_id).all()
              : await env.DB.prepare("SELECT id, grade FROM students WHERE (student_pin IS NULL OR student_pin = '') AND status = '재원'").all();
            let count = 0;
            for (const s of targets.results) {
              const newPin = await generateStudentPin(s.grade, env);
              await env.DB.prepare('UPDATE students SET student_pin = ? WHERE id = ?').bind(newPin, s.id).run();
              count++;
            }
            return new Response(JSON.stringify({ success: true, count }), { headers });
          }

          if (method === 'POST' && path[3] === 'auto-pin') {
            if (!(await canAccessStudent(teacher, id, env))) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers });
            const student = await env.DB.prepare('SELECT grade, student_pin FROM students WHERE id = ?').bind(id).first();
            if (!student) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers });
            if (student.student_pin) return new Response(JSON.stringify({ message: '이미 PIN이 설정된 학생입니다.' }), { status: 400, headers });
            const newPin = await generateStudentPin(student.grade, env);
            await env.DB.prepare('UPDATE students SET student_pin = ? WHERE id = ?').bind(newPin, id).run();
            return new Response(JSON.stringify({ success: true, pin: newPin }), { headers });
          }

          if (method === 'POST' && !id) {
            const d = normalizeStudentPayload(await request.json());
            if (!isAdminUser(teacher)) {
              if (!d.classId) return new Response(JSON.stringify({ error: 'Class ID required' }), { status: 403, headers });
              if (!(await canAccessClass(teacher, d.classId, env))) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers });
            }
            if (!d.name) return new Response(JSON.stringify({ error: 'name required' }), { status: 400, headers });
            let pin = d.studentPin || await generateStudentPin(d.grade, env);
            const exist = await env.DB.prepare('SELECT 1 FROM students WHERE student_pin = ?').bind(pin).first();
            if (exist) return new Response(JSON.stringify({ message: '이미 사용 중인 PIN입니다.' }), { status: 409, headers });

            const sid = `s_${Date.now()}`;
            const targetScore = normalizeTargetScore(d.targetScore);
            const stmts = [env.DB.prepare("INSERT INTO students (id, name, school_name, grade, target_score, status, memo, guardian_relation, student_phone, parent_phone, student_pin, high_subjects, created_at, updated_at) VALUES (?, ?, ?, ?, ?, '\uC7AC\uC6D0', ?, ?, ?, ?, ?, ?, DATETIME('now'), DATETIME('now'))").bind(sid, d.name, d.schoolName, d.grade, targetScore, d.memo, d.guardianRelation, d.studentPhone, d.parentPhone, pin, d.highSubjects)];
            if (d.classId) stmts.push(env.DB.prepare('INSERT INTO class_students (class_id, student_id) VALUES (?, ?)').bind(d.classId, sid));
            try { await env.DB.batch(stmts); return new Response(JSON.stringify({ success: true, id: sid }), { headers }); }
            catch (err) { if (err.message.includes('UNIQUE')) return new Response(JSON.stringify({ message: '이미 사용 중인 PIN입니다.' }), { status: 409, headers }); throw err; }
          }

          if (method === 'PATCH' && id) {
            if (!(await canAccessStudent(teacher, id, env))) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers });
            if (path[3] === 'restore') { await env.DB.prepare("UPDATE students SET status = '재원', updated_at = DATETIME('now') WHERE id = ?").bind(id).run(); return new Response(JSON.stringify({ success: true }), { headers }); }
            if (path[3] === 'hide') { await env.DB.prepare("UPDATE students SET status = '숨김', updated_at = DATETIME('now') WHERE id = ?").bind(id).run(); return new Response(JSON.stringify({ success: true }), { headers }); }
            const current = await env.DB.prepare('SELECT * FROM students WHERE id = ?').bind(id).first();
            if (!current) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers });
            const d = normalizeStudentPayload(await request.json(), current);
            if (d.classId !== undefined && d.classId) {
              if (!(await canAccessClass(teacher, d.classId, env))) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers });
            }
            if (d.studentPin) {
              const exist = await env.DB.prepare('SELECT 1 FROM students WHERE student_pin = ? AND id != ?').bind(d.studentPin, id).first();
              if (exist) return new Response(JSON.stringify({ message: '이미 사용 중인 PIN입니다.' }), { status: 409, headers });
            }
            if (!d.name) return new Response(JSON.stringify({ error: 'name required' }), { status: 400, headers });
            const targetScore = normalizeTargetScore(d.targetScore);
            const stmts = [env.DB.prepare("UPDATE students SET name=?, school_name=?, grade=?, target_score=?, memo=?, guardian_relation=?, student_phone=?, parent_phone=?, student_pin=?, high_subjects=?, updated_at=DATETIME('now') WHERE id=?").bind(d.name, d.schoolName, d.grade, targetScore, d.memo, d.guardianRelation, d.studentPhone, d.parentPhone, d.studentPin, d.highSubjects, id)];
            if (d.classId !== undefined) { stmts.push(env.DB.prepare('DELETE FROM class_students WHERE student_id = ?').bind(id)); if (d.classId) stmts.push(env.DB.prepare('INSERT INTO class_students (class_id, student_id) VALUES (?, ?)').bind(d.classId, id)); }
            try { await env.DB.batch(stmts); return new Response(JSON.stringify({ success: true }), { headers }); }
            catch (err) { if (err.message.includes('UNIQUE')) return new Response(JSON.stringify({ message: '이미 사용 중인 PIN입니다.' }), { status: 409, headers }); throw err; }
          }

          if (method === 'DELETE' && id) { 
            if (!(await canAccessStudent(teacher, id, env))) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers });
            await env.DB.prepare("UPDATE students SET status = '제적', updated_at = DATETIME('now') WHERE id = ?").bind(id).run(); 
            return new Response(JSON.stringify({ success: true }), { headers }); 
          }
        }

        // --- 6. 출결 및 숙제 ---
        if (resource === 'attendance-history' && method === 'GET') {
          const teacher = await verifyAuth(request, env);
          if (!teacher) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });

          const date = url.searchParams.get('date') || todayKstDateString();

          if (isAdminUser(teacher)) {
            const [att, hw] = await Promise.all([
              env.DB.prepare('SELECT * FROM attendance WHERE date = ?').bind(date).all(),
              env.DB.prepare('SELECT * FROM homework WHERE date = ?').bind(date).all()
            ]);
            return new Response(JSON.stringify({ attendance: att.results, homework: hw.results, date }), { headers });
          }

          const tcls = await env.DB.prepare('SELECT class_id FROM teacher_classes WHERE teacher_id = ?').bind(teacher.id).all();
          const classIds = (tcls.results || []).map(r => r.class_id);
          if (!classIds.length) {
            return new Response(JSON.stringify({ attendance: [], homework: [], date }), { headers });
          }
          const cMarkers = classIds.map(() => '?').join(',');
          const map = await env.DB.prepare(`SELECT student_id FROM class_students WHERE class_id IN (${cMarkers})`).bind(...classIds).all();
          const studentIds = [...new Set((map.results || []).map(r => r.student_id))];
          if (!studentIds.length) {
            return new Response(JSON.stringify({ attendance: [], homework: [], date }), { headers });
          }
          const sMarkers = studentIds.map(() => '?').join(',');
          const [att, hw] = await Promise.all([
            env.DB.prepare(`SELECT * FROM attendance WHERE date = ? AND student_id IN (${sMarkers})`).bind(date, ...studentIds).all(),
            env.DB.prepare(`SELECT * FROM homework WHERE date = ? AND student_id IN (${sMarkers})`).bind(date, ...studentIds).all()
          ]);
          return new Response(JSON.stringify({ attendance: att.results, homework: hw.results, date }), { headers });
        }

        if (resource === 'attendance-month' && method === 'GET') {
          const teacher = await verifyAuth(request, env);
          if (!teacher) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });

          const month = String(url.searchParams.get('month') || '').trim();
          if (!/^\d{4}-\d{2}$/.test(month)) {
            return new Response(JSON.stringify({ success: false, message: 'month must be YYYY-MM' }), { status: 400, headers });
          }

          const [year, monthNo] = month.split('-').map(Number);
          const endDay = new Date(year, monthNo, 0).getDate();
          const startDate = `${month}-01`;
          const endDate = `${month}-${String(endDay).padStart(2, '0')}`;

          let acs;

          if (isAdminUser(teacher)) {
            acs = await env.DB.prepare(
              'SELECT * FROM academy_schedules WHERE is_deleted = 0 AND schedule_date BETWEEN ? AND ? ORDER BY schedule_date ASC, start_time ASC, created_at ASC'
            ).bind(startDate, endDate).all();
            const [att, hw] = await Promise.all([
              env.DB.prepare('SELECT * FROM attendance WHERE date BETWEEN ? AND ? ORDER BY date ASC').bind(startDate, endDate).all(),
              env.DB.prepare('SELECT * FROM homework WHERE date BETWEEN ? AND ? ORDER BY date ASC').bind(startDate, endDate).all()
            ]);
            return new Response(JSON.stringify({ success: true, month, attendance: att.results, homework: hw.results, academy_schedules: acs.results }), { headers });
          }

          const tcls = await env.DB.prepare('SELECT class_id FROM teacher_classes WHERE teacher_id = ?').bind(teacher.id).all();
          const classIds = (tcls.results || []).map(r => r.class_id);
          if (!classIds.length) {
            acs = await env.DB.prepare(`SELECT * FROM academy_schedules WHERE is_deleted = 0 AND schedule_date BETWEEN ? AND ? AND (target_scope = 'global' OR (target_scope = 'teacher' AND teacher_name = ?)) ORDER BY schedule_date ASC, start_time ASC, created_at ASC`).bind(startDate, endDate, teacher.name).all();
            return new Response(JSON.stringify({ success: true, month, attendance: [], homework: [], academy_schedules: acs.results }), { headers });
          }

          const cMarkers = classIds.map(() => '?').join(',');
          const map = await env.DB.prepare(`SELECT student_id FROM class_students WHERE class_id IN (${cMarkers})`).bind(...classIds).all();
          const studentIds = [...new Set((map.results || []).map(r => r.student_id))];
          if (!studentIds.length) {
            acs = await env.DB.prepare(`SELECT * FROM academy_schedules WHERE is_deleted = 0 AND schedule_date BETWEEN ? AND ? AND (target_scope = 'global' OR (target_scope = 'teacher' AND teacher_name = ?)) ORDER BY schedule_date ASC, start_time ASC, created_at ASC`).bind(startDate, endDate, teacher.name).all();
            return new Response(JSON.stringify({ success: true, month, attendance: [], homework: [], academy_schedules: acs.results }), { headers });
          }

          const sMarkers = studentIds.map(() => '?').join(',');
          const [att, hw, acsForTeacher] = await Promise.all([
            env.DB.prepare(`SELECT * FROM attendance WHERE date BETWEEN ? AND ? AND student_id IN (${sMarkers}) ORDER BY date ASC`).bind(startDate, endDate, ...studentIds).all(),
            env.DB.prepare(`SELECT * FROM homework WHERE date BETWEEN ? AND ? AND student_id IN (${sMarkers}) ORDER BY date ASC`).bind(startDate, endDate, ...studentIds).all(),
            env.DB.prepare(`SELECT * FROM academy_schedules WHERE is_deleted = 0 AND schedule_date BETWEEN ? AND ? AND (target_scope = 'global' OR (target_scope = 'teacher' AND teacher_name = ?) OR (target_scope = 'student' AND student_id IN (${sMarkers}))) ORDER BY schedule_date ASC, start_time ASC, created_at ASC`).bind(startDate, endDate, teacher.name, ...studentIds).all()
          ]);
          acs = acsForTeacher;
          return new Response(JSON.stringify({ success: true, month, attendance: att.results, homework: hw.results, academy_schedules: acs.results }), { headers });
        }

        if (resource === 'attendance-batch' && method === 'POST') {
          const teacher = await verifyAuth(request, env);
          if (!teacher) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });

          const data = await request.json();
          const entries = Array.isArray(data.entries) ? data.entries : [];

          for (const { studentId } of entries) {
            if (!(await canAccessStudent(teacher, studentId, env))) {
              return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers });
            }
          }

          const stmts = entries.map(({ studentId, status, date }) =>
            env.DB.prepare(`
              INSERT INTO attendance (id, student_id, status, date, created_at, updated_at)
              VALUES (?, ?, ?, ?, DATETIME('now'), DATETIME('now'))
              ON CONFLICT(id) DO UPDATE SET
                status = excluded.status,
                updated_at = DATETIME('now')
            `).bind(`${studentId}_${date}`, studentId, status, date)
          );

          if (stmts.length) await env.DB.batch(stmts);
          return new Response(JSON.stringify({ success: true }), { headers });
        }

        if (resource === 'homework-batch' && method === 'POST') {
          const teacher = await verifyAuth(request, env);
          if (!teacher) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });
          const data = await request.json();
          const entries = data.entries || [];
          for (const { studentId } of entries) {
            if (!(await canAccessStudent(teacher, studentId, env))) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers });
          }
          const stmts = entries.map(({ studentId, status, date }) =>
            env.DB.prepare("INSERT INTO homework (id, student_id, status, date, created_at) VALUES (?, ?, ?, ?, DATETIME('now')) ON CONFLICT(id) DO UPDATE SET status=excluded.status")
              .bind(`${studentId}_${date}`, studentId, status, date)
          );
          if (stmts.length) await env.DB.batch(stmts);
          return new Response(JSON.stringify({ success: true }), { headers });
        }

        if (method === 'PATCH' && resource === 'attendance') {
          const teacher = await verifyAuth(request, env);
          if (!teacher) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });

          const d = await request.json();
          const studentId = d.studentId;
          const date = d.date;

          if (!studentId || !date) {
            return new Response(JSON.stringify({ success: false, message: 'studentId and date are required' }), { status: 400, headers });
          }

          if (!(await canAccessStudent(teacher, studentId, env))) {
            return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers });
          }

          const hasStatus = Object.prototype.hasOwnProperty.call(d, 'status');
          const hasTags = Object.prototype.hasOwnProperty.call(d, 'tags');
          const hasMemo = Object.prototype.hasOwnProperty.call(d, 'memo');

          if (!hasStatus && !hasTags && !hasMemo) {
            return new Response(JSON.stringify({ success: false, message: 'status, tags, or memo is required' }), { status: 400, headers });
          }

          const normalizeText = value => {
            if (Array.isArray(value)) {
              return value.map(v => String(v || '').trim()).filter(Boolean).join(',');
            }
            return String(value ?? '').trim();
          };

          const id = `${studentId}_${date}`;
          const existing = await env.DB.prepare('SELECT id FROM attendance WHERE id = ?').bind(id).first();

          if (!existing) {
            const insertStatus = hasStatus ? normalizeText(d.status) : '미기록';
            const insertTags = hasTags ? normalizeText(d.tags) : '';
            const insertMemo = hasMemo ? normalizeText(d.memo) : '';

            await env.DB.prepare(`
              INSERT INTO attendance (id, student_id, status, date, tags, memo, created_at, updated_at)
              VALUES (?, ?, ?, ?, ?, ?, DATETIME('now'), DATETIME('now'))
            `).bind(id, studentId, insertStatus, date, insertTags, insertMemo).run();

            return new Response(JSON.stringify({ success: true }), { headers });
          }

          const sets = [];
          const binds = [];

          if (hasStatus) {
            sets.push('status = ?');
            binds.push(normalizeText(d.status));
          }

          if (hasTags) {
            sets.push('tags = ?');
            binds.push(normalizeText(d.tags));
          }

          if (hasMemo) {
            sets.push('memo = ?');
            binds.push(normalizeText(d.memo));
          }

          sets.push("updated_at = DATETIME('now')");
          binds.push(id);

          await env.DB.prepare(`UPDATE attendance SET ${sets.join(', ')} WHERE id = ?`).bind(...binds).run();

          return new Response(JSON.stringify({ success: true }), { headers });
        }

        if (method === 'PATCH' && resource === 'homework') {
          const teacher = await verifyAuth(request, env);
          if (!teacher) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });

          const d = await request.json();

          if (!(await canAccessStudent(teacher, d.studentId, env))) {
            return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers });
          }

          await env.DB.prepare(`
            INSERT INTO homework (id, student_id, status, date, created_at)
            VALUES (?, ?, ?, ?, DATETIME('now'))
            ON CONFLICT(id) DO UPDATE SET status = excluded.status
          `).bind(`${d.studentId}_${d.date}`, d.studentId, d.status, d.date).run();

          return new Response(JSON.stringify({ success: true }), { headers });
        }

        // --- 6B. 숙제 사진 확인 QR 시스템 ---
        if (resource === 'homework-photo') {
          const makeHomeworkPhotoId = (prefix) => `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
          const getHomeworkPhotoBaseUrl = () => {
            const origin = url.origin;
            const apiIdx = path.indexOf('api');
            const baseParts = apiIdx > 0 ? path.slice(0, apiIdx) : [];
            const basePath = baseParts.length ? `/${baseParts.join('/')}/` : '/';
            return `${origin}${basePath}homework/`;
          };
          const buildHomeworkPhotoLink = (assignmentId, studentId) =>
            `${getHomeworkPhotoBaseUrl()}?assignment_id=${encodeURIComponent(assignmentId)}&student_id=${encodeURIComponent(studentId)}`;
          const normalizeHomeworkPhotoDate = (value) => {
            const str = String(value || '').trim();
            return /^\d{4}-\d{2}-\d{2}$/.test(str) ? str : '';
          };
          const normalizeHomeworkPhotoTime = (value) => {
            const str = String(value || '').trim();
            return /^\d{2}:\d{2}$/.test(str) ? str : '';
          };
          const syncHomeworkPhotoStatus = async (studentId, date, status) => {
            await env.DB.prepare(`
              INSERT INTO homework (id, student_id, status, date, created_at)
              VALUES (?, ?, ?, ?, DATETIME('now'))
              ON CONFLICT(id) DO UPDATE SET status = excluded.status
            `).bind(`${studentId}_${date}`, studentId, status, date).run();
          };
          const getHomeworkPhotoAssignment = (assignmentId) => env.DB.prepare(`
            SELECT hpa.*, c.name AS class_name
            FROM homework_photo_assignments hpa
            LEFT JOIN classes c ON c.id = hpa.class_id
            WHERE hpa.id = ? AND hpa.status != 'deleted'
          `).bind(assignmentId).first();
          const checkHomeworkPhotoStudent = async (assignmentId, studentId, pin = '') => {
            const row = await env.DB.prepare(`
              SELECT
                hpa.id AS assignment_id,
                hpa.class_id,
                hpa.title,
                hpa.description,
                hpa.due_date,
                hpa.due_time,
                hpa.status AS assignment_status,
                c.name AS class_name,
                hps.id AS submission_id,
                hps.is_submitted,
                hps.submitted_at,
                s.name AS student_name,
                s.student_pin,
                s.status AS student_status
              FROM homework_photo_assignments hpa
              JOIN homework_photo_submissions hps ON hps.assignment_id = hpa.id
              JOIN students s ON s.id = hps.student_id
              LEFT JOIN classes c ON c.id = hpa.class_id
              WHERE hpa.id = ? AND hps.student_id = ? AND hpa.status != 'deleted'
            `).bind(assignmentId, studentId).first();

            if (!row) return { authorized: false, status: 404, error: 'Not found' };
            if (row.student_status !== '재원') return { authorized: false, status: 403, error: 'Not active student' };
            if (row.student_pin && String(row.student_pin) !== String(pin || '').trim()) {
              await new Promise(resolve => setTimeout(resolve, 1000));
              return { authorized: false, status: 401, error: 'PIN mismatch' };
            }
            return { authorized: true, row };
          };
          const checkHomeworkPhotoStudentToken = async (studentId, token = '') => {
            const sid = String(studentId || '').trim();
            const safeToken = String(token || '').trim();
            if (!sid || !safeToken) return false;
            const student = await env.DB.prepare(`
              SELECT id, student_pin, status
              FROM students
              WHERE id = ?
            `).bind(sid).first();
            if (!student || student.status !== '재원') return false;
            const expectedToken = await sha256hex(`${student.id}:${student.student_pin || ''}:student-portal:v1`);
            return safeToken === expectedToken;
          };

          if (method === 'POST' && id === 'assignments') {
            const teacher = await verifyAuth(request, env);
            if (!teacher) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });

            const d = await request.json();
            const classId = String(d.class_id || d.classId || '').trim();
            const title = String(d.title || '').trim();
            const description = String(d.description || '').trim();
            const dueDate = normalizeHomeworkPhotoDate(d.due_date || d.dueDate);
            const dueTime = normalizeHomeworkPhotoTime(d.due_time || d.dueTime);

            if (!classId || !title || !dueDate) {
              return new Response(JSON.stringify({ success: false, error: 'class_id, title, due_date required' }), { status: 400, headers });
            }
            if (!(await canAccessClass(teacher, classId, env))) {
              return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers });
            }

            const students = await env.DB.prepare(`
              SELECT id, name
              FROM students
              WHERE status = '재원'
                AND id IN (SELECT student_id FROM class_students WHERE class_id = ?)
              ORDER BY name ASC
            `).bind(classId).all();
            const studentList = students.results || [];
            const assignmentId = makeHomeworkPhotoId('hpa');
            const stmts = [
              env.DB.prepare(`
                INSERT INTO homework_photo_assignments (
                  id, class_id, teacher_id, title, description, due_date, due_time, status, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, 'active', DATETIME('now'), DATETIME('now'))
              `).bind(assignmentId, classId, teacher.id, title, description, dueDate, dueTime)
            ];

            for (const s of studentList) {
              stmts.push(env.DB.prepare(`
                INSERT OR IGNORE INTO homework_photo_submissions (
                  id, assignment_id, student_id, is_submitted, created_at, updated_at
                ) VALUES (?, ?, ?, 0, DATETIME('now'), DATETIME('now'))
              `).bind(makeHomeworkPhotoId('hps'), assignmentId, s.id));
            }
            await env.DB.batch(stmts);

            const links = studentList.map(s => ({
              student_id: s.id,
              name: s.name,
              url: buildHomeworkPhotoLink(assignmentId, s.id)
            }));

            return new Response(JSON.stringify({ success: true, assignment_id: assignmentId, links }), { headers });
          }

          if (method === 'PATCH' && id && id !== 'assignments' && id !== 'overview' && id !== 'student-links' && id !== 'assignment' && id !== 'auth' && id !== 'submit' && id !== 'cancel' && path[3] !== 'close') {
            const teacher = await verifyAuth(request, env);
            if (!teacher) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });

            const assignmentId = String(id || '').trim();
            const assignment = await getHomeworkPhotoAssignment(assignmentId);
            if (!assignment) return new Response(JSON.stringify({ success: false, error: 'Not found' }), { status: 404, headers });
            if (!(await canAccessClass(teacher, assignment.class_id, env))) {
              return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers });
            }

            const d = await request.json();
            const title = String(d.title || '').trim();
            const description = String(d.description || '').trim();
            const dueDate = normalizeHomeworkPhotoDate(d.due_date || d.dueDate);
            const dueTime = normalizeHomeworkPhotoTime(d.due_time || d.dueTime);

            if (!title || !dueDate) {
              return new Response(JSON.stringify({ success: false, error: 'title, due_date required' }), { status: 400, headers });
            }

            await env.DB.prepare(`
              UPDATE homework_photo_assignments
              SET title = ?,
                  description = ?,
                  due_date = ?,
                  due_time = ?,
                  updated_at = DATETIME('now')
              WHERE id = ?
            `).bind(title, description, dueDate, dueTime, assignmentId).run();

            const updated = await getHomeworkPhotoAssignment(assignmentId);
            return new Response(JSON.stringify({ success: true, assignment: updated }), { headers });
          }

          if (method === 'GET' && id === 'assignments') {
            const teacher = await verifyAuth(request, env);
            if (!teacher) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });

            const classId = String(url.searchParams.get('class_id') || '').trim();
            if (!classId) return new Response(JSON.stringify({ success: false, error: 'class_id required' }), { status: 400, headers });
            if (!(await canAccessClass(teacher, classId, env))) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers });

            const res = await env.DB.prepare(`
              SELECT hpa.*,
                     COUNT(hps.id) AS total,
                     SUM(CASE WHEN hps.is_submitted = 1 THEN 1 ELSE 0 END) AS submitted
              FROM homework_photo_assignments hpa
              LEFT JOIN homework_photo_submissions hps ON hps.assignment_id = hpa.id
              WHERE hpa.class_id = ? AND hpa.status != 'deleted'
              GROUP BY hpa.id
              ORDER BY hpa.due_date DESC, hpa.created_at DESC
              LIMIT 30
            `).bind(classId).all();

            return new Response(JSON.stringify({ success: true, assignments: res.results || [] }), { headers });
          }

          if (method === 'GET' && id === 'overview') {
            const teacher = await verifyAuth(request, env);
            if (!teacher) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });

            const assignmentId = String(url.searchParams.get('assignment_id') || '').trim();
            if (!assignmentId) return new Response(JSON.stringify({ success: false, error: 'assignment_id required' }), { status: 400, headers });

            const assignment = await getHomeworkPhotoAssignment(assignmentId);
            if (!assignment) return new Response(JSON.stringify({ success: false, error: 'Not found' }), { status: 404, headers });
            if (!(await canAccessClass(teacher, assignment.class_id, env))) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers });

            const rows = await env.DB.prepare(`
              SELECT
                hps.id AS submission_id,
                hps.student_id,
                hps.is_submitted,
                hps.submitted_at,
                hps.synced_homework_status,
                s.name,
                COUNT(hpf.id) AS file_count
              FROM homework_photo_submissions hps
              JOIN students s ON s.id = hps.student_id
              LEFT JOIN homework_photo_files hpf
                ON hpf.submission_id = hps.id AND hpf.deleted_at IS NULL
              WHERE hps.assignment_id = ?
              GROUP BY hps.id
              ORDER BY s.name ASC
            `).bind(assignmentId).all();

            const students = (rows.results || []).map(r => ({
              ...r,
              url: buildHomeworkPhotoLink(assignmentId, r.student_id)
            }));
            return new Response(JSON.stringify({ success: true, assignment, students }), { headers });
          }

          if (method === 'GET' && id === 'student-links') {
            const teacher = await verifyAuth(request, env);
            if (!teacher) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });

            const assignmentId = String(url.searchParams.get('assignment_id') || '').trim();
            const assignment = await getHomeworkPhotoAssignment(assignmentId);
            if (!assignment) return new Response(JSON.stringify({ success: false, error: 'Not found' }), { status: 404, headers });
            if (!(await canAccessClass(teacher, assignment.class_id, env))) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers });

            const rows = await env.DB.prepare(`
              SELECT hps.student_id, s.name
              FROM homework_photo_submissions hps
              JOIN students s ON s.id = hps.student_id
              WHERE hps.assignment_id = ?
              ORDER BY s.name ASC
            `).bind(assignmentId).all();
            const links = (rows.results || []).map(s => ({
              student_id: s.student_id,
              name: s.name,
              url: buildHomeworkPhotoLink(assignmentId, s.student_id)
            }));
            return new Response(JSON.stringify({ success: true, assignment, links }), { headers });
          }

          if (method === 'GET' && id === 'assignment') {
            const assignmentId = String(url.searchParams.get('assignment_id') || '').trim();
            const studentId = String(url.searchParams.get('student_id') || '').trim();
            if (!assignmentId || !studentId) {
              return new Response(JSON.stringify({ success: false, error: 'assignment_id, student_id required' }), { status: 400, headers });
            }

            const row = await env.DB.prepare(`
              SELECT
                hpa.id AS assignment_id,
                hpa.class_id,
                hpa.title,
                hpa.description,
                hpa.due_date,
                hpa.due_time,
                hpa.status AS assignment_status,
                c.name AS class_name,
                hps.id AS submission_id,
                hps.is_submitted,
                hps.submitted_at,
                s.name AS student_name,
                s.status AS student_status
              FROM homework_photo_assignments hpa
              JOIN homework_photo_submissions hps ON hps.assignment_id = hpa.id
              JOIN students s ON s.id = hps.student_id
              LEFT JOIN classes c ON c.id = hpa.class_id
              WHERE hpa.id = ? AND hps.student_id = ? AND hpa.status != 'deleted'
            `).bind(assignmentId, studentId).first();

            if (!row) return new Response(JSON.stringify({ success: false, error: 'Not found' }), { status: 404, headers });
            if (row.student_status !== '재원') return new Response(JSON.stringify({ success: false, error: 'Not active student' }), { status: 403, headers });

            return new Response(JSON.stringify({
              success: true,
              assignment: {
                id: row.assignment_id,
                class_id: row.class_id,
                class_name: row.class_name,
                title: row.title,
                description: row.description,
                due_date: row.due_date,
                due_time: row.due_time,
                status: row.assignment_status
              },
              student: {
                id: studentId,
                name: row.student_name
              },
              submission: {
                id: row.submission_id,
                is_submitted: row.is_submitted,
                submitted_at: row.submitted_at
              }
            }), { headers });
          }

          if (method === 'POST' && id === 'auth') {
            const d = await request.json();
            const assignmentId = String(d.assignment_id || '').trim();
            const studentId = String(d.student_id || '').trim();
            const pin = String(d.pin || '').trim();
            const auth = await checkHomeworkPhotoStudent(assignmentId, studentId, pin);
            if (!auth.authorized) {
              return new Response(JSON.stringify({ success: false, error: auth.error }), { status: auth.status || 403, headers });
            }
            return new Response(JSON.stringify({ success: true }), { headers });
          }

          if (method === 'POST' && id === 'submit') {
            const d = await request.json();
            const assignmentId = String(d.assignment_id || '').trim();
            const studentId = String(d.student_id || '').trim();
            const pin = String(d.pin || '').trim();
            const auth = await checkHomeworkPhotoStudent(assignmentId, studentId, pin);
            if (!auth.authorized) {
              return new Response(JSON.stringify({ success: false, error: auth.error }), { status: auth.status || 403, headers });
            }

            const row = auth.row;
            await env.DB.prepare(`
              UPDATE homework_photo_submissions
              SET is_submitted = 1,
                  submitted_at = COALESCE(submitted_at, DATETIME('now')),
                  synced_homework_date = ?,
                  synced_homework_status = '완료',
                  updated_at = DATETIME('now')
              WHERE id = ?
            `).bind(row.due_date, row.submission_id).run();
            await syncHomeworkPhotoStatus(studentId, row.due_date, '완료');

            return new Response(JSON.stringify({ success: true }), { headers });
          }

          if (method === 'POST' && id === 'cancel') {
            const d = await request.json();
            const assignmentId = String(d.assignment_id || d.assignmentId || '').trim();
            const studentId = String(d.student_id || d.studentId || '').trim();
            const pin = String(d.pin || '').trim();
            const studentToken = String(d.student_token || d.studentToken || d.token || request.headers.get('X-Student-Token') || '').trim();

            if (!assignmentId || !studentId) {
              return new Response(JSON.stringify({ success: false, error: 'assignment_id, student_id required' }), { status: 400, headers });
            }

            const assignment = await getHomeworkPhotoAssignment(assignmentId);
            if (!assignment) return new Response(JSON.stringify({ success: false, error: 'Not found' }), { status: 404, headers });

            let authorized = false;
            const teacher = await verifyAuth(request, env);
            if (teacher) {
              authorized = await canAccessClass(teacher, assignment.class_id, env);
            }

            if (!authorized && studentToken) {
              authorized = await checkHomeworkPhotoStudentToken(studentId, studentToken);
            }

            if (!authorized) {
              const auth = await checkHomeworkPhotoStudent(assignmentId, studentId, pin);
              authorized = !!auth.authorized;
            }

            if (!authorized) {
              await new Promise(resolve => setTimeout(resolve, 800));
              return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), { status: 401, headers });
            }

            const submission = await env.DB.prepare(`
              SELECT id
              FROM homework_photo_submissions
              WHERE assignment_id = ? AND student_id = ?
            `).bind(assignmentId, studentId).first();

            if (!submission) {
              return new Response(JSON.stringify({ success: false, error: 'Submission not found' }), { status: 404, headers });
            }

            await env.DB.prepare(`
              UPDATE homework_photo_submissions
              SET is_submitted = 0,
                  submitted_at = NULL,
                  synced_homework_date = ?,
                  synced_homework_status = '미완료',
                  updated_at = DATETIME('now')
              WHERE id = ?
            `).bind(assignment.due_date, submission.id).run();

            await syncHomeworkPhotoStatus(studentId, assignment.due_date, '미완료');

            return new Response(JSON.stringify({ success: true, is_submitted: 0, status: '미제출' }), { headers });
          }

          if (method === 'PATCH' && path[3] === 'close') {
            const teacher = await verifyAuth(request, env);
            if (!teacher) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });
            const assignmentId = String(id || '').trim();
            const assignment = await getHomeworkPhotoAssignment(assignmentId);
            if (!assignment) return new Response(JSON.stringify({ success: false, error: 'Not found' }), { status: 404, headers });
            if (!(await canAccessClass(teacher, assignment.class_id, env))) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers });

            const pending = await env.DB.prepare(`
              SELECT id, student_id
              FROM homework_photo_submissions
              WHERE assignment_id = ? AND is_submitted = 0
            `).bind(assignmentId).all();
            const stmts = [
              env.DB.prepare("UPDATE homework_photo_assignments SET status = 'closed', updated_at = DATETIME('now') WHERE id = ?").bind(assignmentId)
            ];
            for (const s of (pending.results || [])) {
              stmts.push(env.DB.prepare(`
                UPDATE homework_photo_submissions
                SET synced_homework_date = ?,
                    synced_homework_status = '미완료',
                    updated_at = DATETIME('now')
                WHERE id = ?
              `).bind(assignment.due_date, s.id));
              stmts.push(env.DB.prepare(`
                INSERT INTO homework (id, student_id, status, date, created_at)
                VALUES (?, ?, '미완료', ?, DATETIME('now'))
                ON CONFLICT(id) DO UPDATE SET status = excluded.status
              `).bind(`${s.student_id}_${assignment.due_date}`, s.student_id, assignment.due_date));
            }
            await env.DB.batch(stmts);
            return new Response(JSON.stringify({ success: true, closed_count: (pending.results || []).length }), { headers });
          }
        }


        // --- 학생 개인 포털 1차 (student-portal) ---
        if (resource === 'student-portal') {
          const buildStudentPortalToken = async (studentId, studentPin) => {
            return await sha256hex(`${studentId}:${studentPin || ''}:student-portal:v1`);
          };

          const pickStudentPortalToken = (reqUrl, req) => {
            return String(
              reqUrl.searchParams.get('token') ||
              req.headers.get('X-Student-Token') ||
              ''
            ).trim();
          };

          if (method === 'POST' && id === 'auth') {
            const d = await request.json();
            const name = String(d.name || '').trim();
            const pin = String(d.pin || '').trim();

            if (!name || !pin) {
              return new Response(JSON.stringify({
                success: false,
                message: '이름 또는 PIN을 확인하세요.'
              }), { status: 400, headers });
            }

            const found = await env.DB.prepare(`
              SELECT id, name, grade, school_name, student_pin, status
              FROM students
              WHERE TRIM(name) = ?
                AND student_pin = ?
                AND status = '재원'
            `).bind(name, pin).all();

            const rows = found.results || [];
            if (!rows.length) {
              await new Promise(resolve => setTimeout(resolve, 800));
              return new Response(JSON.stringify({
                success: false,
                message: '이름 또는 PIN을 확인하세요.'
              }), { status: 401, headers });
            }

            if (rows.length > 1) {
              return new Response(JSON.stringify({
                success: false,
                message: '동명이인 정보가 있습니다. 선생님께 문의하세요.'
              }), { status: 409, headers });
            }

            const student = rows[0];
            const studentToken = await buildStudentPortalToken(student.id, student.student_pin);

            return new Response(JSON.stringify({
              success: true,
              student: {
                id: student.id,
                name: student.name,
                grade: student.grade,
                school_name: student.school_name
              },
              student_token: studentToken
            }), { headers });
          }

          if (method === 'GET' && id === 'home') {
            const studentId = String(url.searchParams.get('student_id') || '').trim();
            const studentToken = pickStudentPortalToken(url, request);

            if (!studentId || !studentToken) {
              return new Response(JSON.stringify({
                success: false,
                message: '학생 로그인이 필요합니다.'
              }), { status: 401, headers });
            }

            const student = await env.DB.prepare(`
              SELECT id, name, grade, school_name, student_pin, status
              FROM students
              WHERE id = ?
            `).bind(studentId).first();

            if (!student || student.status !== '재원') {
              return new Response(JSON.stringify({
                success: false,
                message: '학생 정보를 확인할 수 없습니다.'
              }), { status: 404, headers });
            }

            const expectedToken = await buildStudentPortalToken(student.id, student.student_pin);
            if (studentToken !== expectedToken) {
              await new Promise(resolve => setTimeout(resolve, 800));
              return new Response(JSON.stringify({
                success: false,
                message: '학생 로그인이 만료되었습니다.'
              }), { status: 401, headers });
            }

            const assignments = await env.DB.prepare(`
              SELECT
                hpa.id AS assignment_id,
                hpa.title,
                hpa.description,
                hpa.class_id,
                c.name AS class_name,
                hpa.due_date,
                hpa.due_time,
                COALESCE(hpa.status, 'active') AS status,
                COALESCE(hps.is_submitted, 0) AS is_submitted,
                hps.submitted_at
              FROM homework_photo_submissions hps
              JOIN homework_photo_assignments hpa ON hpa.id = hps.assignment_id
              LEFT JOIN classes c ON c.id = hpa.class_id
              WHERE hps.student_id = ?
                AND COALESCE(hpa.status, 'active') != 'deleted'
              ORDER BY
                CASE WHEN COALESCE(hps.is_submitted, 0) = 1 THEN 1 ELSE 0 END ASC,
                hpa.due_date ASC,
                hpa.created_at DESC
              LIMIT 30
            `).bind(studentId).all();

            return new Response(JSON.stringify({
              success: true,
              student: {
                id: student.id,
                name: student.name,
                grade: student.grade,
                school_name: student.school_name
              },
              assignments: (assignments.results || []).map(row => ({
                assignment_id: row.assignment_id,
                title: row.title,
                description: row.description || '',
                class_id: row.class_id,
                class_name: row.class_name,
                due_date: row.due_date,
                due_time: row.due_time,
                status: row.status,
                is_submitted: Number(row.is_submitted || 0),
                submitted_at: row.submitted_at || null
              })),
              planner: {
                enabled: true,
                url: `/apmath/planner/?student_id=${encodeURIComponent(student.id)}`
              },
              omr: {
                enabled: true,
                status: 'coming_soon'
              }
            }), { headers });
          }
        }

        // --- 7. 시험 설계도 (Blueprints) ---
        if (resource === 'exam-blueprints') {
          const teacher = await verifyAuth(request, env);
          if (!teacher) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });

          if (method === 'POST') {
            const d = await request.json();
            if (!d.archive_file) return new Response(JSON.stringify({ error: 'archive_file required' }), { status: 400, headers });
            if (!Array.isArray(d.items)) return new Response(JSON.stringify({ error: 'items must be an array' }), { status: 400, headers });

            const stmts = [];
            for (const item of d.items) {
              if (!item.question_no) continue;
              
              const src_archive_file = item.source_archive_file || d.archive_file;
              const src_question_no = item.source_question_no || item.question_no;
              
              stmts.push(env.DB.prepare(`
                INSERT INTO exam_blueprints (
                  archive_file, question_no, source_archive_file, source_question_no, 
                  standard_unit_key, standard_unit, standard_course, concept_cluster_key,
                  created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, DATETIME('now'), DATETIME('now'))
                ON CONFLICT(archive_file, question_no) DO UPDATE SET
                  source_archive_file=excluded.source_archive_file,
                  source_question_no=excluded.source_question_no,
                  standard_unit_key=excluded.standard_unit_key,
                  standard_unit=excluded.standard_unit,
                  standard_course=excluded.standard_course,
                  concept_cluster_key=excluded.concept_cluster_key,
                  updated_at=DATETIME('now')
              `).bind(
                d.archive_file, item.question_no, src_archive_file, src_question_no,
                item.standard_unit_key || null, item.standard_unit || null, item.standard_course || null, item.concept_cluster_key || null
              ));
            }

            if (stmts.length > 0) {
              await env.DB.batch(stmts);
            }
            return new Response(JSON.stringify({ success: true, count: stmts.length }), { headers });
          }

          if (method === 'GET') {
            const file = url.searchParams.get('file');
            if (!file) return new Response(JSON.stringify({ error: 'file parameter required' }), { status: 400, headers });
            
            const res = await env.DB.prepare('SELECT * FROM exam_blueprints WHERE archive_file = ? ORDER BY question_no ASC').bind(file).all();
            return new Response(JSON.stringify({ success: true, archive_file: file, items: res.results }), { headers });
          }
        }

        // --- 7.5. 시험 배정 관리 (Phase 3-H) ---
        if (resource === 'class-exam-assignments') {
          if (method === 'POST') {
            const d = await request.json();
            if (!d.class_id || !d.exam_title || !d.exam_date) {
              return new Response(JSON.stringify({ success: false, error: 'class_id, exam_title, exam_date required' }), { status: 400, headers });
            }

            const cls = await env.DB.prepare('SELECT id FROM classes WHERE id = ? LIMIT 1').bind(d.class_id).first();
            if (!cls) {
              return new Response(JSON.stringify({ success: false, error: 'class not found' }), { status: 404, headers });
            }

            const archive_file = d.archive_file || '';
            const source_type = d.source_type || 'archive';
            const aid = crypto.randomUUID();

            await env.DB.prepare(`
              INSERT INTO class_exam_assignments (id, class_id, exam_title, exam_date, question_count, archive_file, source_type, created_at, updated_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, DATETIME('now'), DATETIME('now'))
              ON CONFLICT(class_id, exam_title, exam_date, archive_file) DO UPDATE SET
                question_count = excluded.question_count,
                source_type = excluded.source_type,
                updated_at = DATETIME('now')
            `).bind(aid, d.class_id, d.exam_title, d.exam_date, d.question_count || 0, archive_file, source_type).run();

            const assignment = await env.DB.prepare('SELECT * FROM class_exam_assignments WHERE class_id = ? AND exam_title = ? AND exam_date = ? AND archive_file = ?')
              .bind(d.class_id, d.exam_title, d.exam_date, archive_file).first();

            return new Response(JSON.stringify({ success: true, assignment }), { headers });
          }

          if (method === 'GET') {
            const teacher = await verifyAuth(request, env);
            if (!teacher) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });

            const classId = url.searchParams.get('class');
            if (!classId) return new Response(JSON.stringify({ success: false, error: 'classId required' }), { status: 400, headers });
            if (!(await canAccessClass(teacher, classId, env))) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers });

            const res = await env.DB.prepare(`
              SELECT * FROM class_exam_assignments
              WHERE class_id = ?
              ORDER BY exam_date DESC, updated_at DESC
            `).bind(classId).all();

            return new Response(JSON.stringify({ success: true, assignments: res.results }), { headers });
          }
        }

        // --- 8. 시험 세션 및 오답 ---
        if (resource === 'exam-sessions') {
          if (method === 'DELETE' && id === 'by-exam') {
            const teacher = await verifyAuth(request, env);
            if (!teacher) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });

            const classId = url.searchParams.get('class') || '';
            const examTitle = url.searchParams.get('exam') || '';
            const examDate = url.searchParams.get('date') || '';

            if (!classId || !examTitle || !examDate) {
              return new Response(JSON.stringify({ success: false, error: 'class, exam, date required' }), { status: 400, headers });
            }
            if (!(await canAccessClass(teacher, classId, env))) {
              return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers });
            }

            const targets = await env.DB.prepare(`
              SELECT id
              FROM exam_sessions
              WHERE exam_title = ?
                AND exam_date = ?
                AND student_id IN (SELECT student_id FROM class_students WHERE class_id = ?)
            `).bind(examTitle, examDate, classId).all();

            const sessionIds = (targets.results || []).map(r => r.id).filter(Boolean);
            const stmts = [];
            
            for (const sessionId of sessionIds) {
              stmts.push(env.DB.prepare('DELETE FROM wrong_answers WHERE session_id = ?').bind(sessionId));
              stmts.push(env.DB.prepare('DELETE FROM exam_sessions WHERE id = ?').bind(sessionId));
            }
            
            stmts.push(env.DB.prepare('DELETE FROM class_exam_assignments WHERE class_id = ? AND exam_title = ? AND exam_date = ?').bind(classId, examTitle, examDate));
            
            if (stmts.length > 0) {
              await env.DB.batch(stmts);
            }

            return new Response(JSON.stringify({ success: true, deleted: sessionIds.length }), { headers });
          }

          if (method === 'GET' && id === 'by-class') {
            const teacher = await verifyAuth(request, env);
            if (!teacher) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });
            const classId = url.searchParams.get('class');
            const examTitle = url.searchParams.get('exam') || null;
            if (!classId) return new Response(JSON.stringify({ error: 'class required', students: [], sessions: [], wrong_answers: [], blueprints: [], assignments: [] }), { status: 400, headers });
            if (!(await canAccessClass(teacher, classId, env))) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers });

            const studentIds = await env.DB.prepare("SELECT student_id FROM class_students WHERE class_id = ?").bind(classId).all();
            const sIds = studentIds.results.map(r => r.student_id);
            if (!sIds.length) return new Response(JSON.stringify({ students: [], sessions: [], wrong_answers: [], blueprints: [], assignments: [] }), { headers });
            
            const p = sIds.map(() => '?').join(',');
            const [students, sessions, wrongs, assignments] = await Promise.all([
              env.DB.prepare(`SELECT id, name, school_name, grade FROM students WHERE id IN (${p}) AND status='재원'`).bind(...sIds).all(),
              examTitle ? env.DB.prepare(`SELECT * FROM exam_sessions WHERE class_id = ? AND exam_title = ? ORDER BY exam_date DESC`).bind(classId, examTitle).all() : env.DB.prepare(`SELECT * FROM exam_sessions WHERE class_id = ? ORDER BY exam_date DESC LIMIT 200`).bind(classId).all(),
              env.DB.prepare(`SELECT * FROM wrong_answers WHERE student_id IN (${p})`).bind(...sIds).all(),
              env.DB.prepare(`SELECT * FROM class_exam_assignments WHERE class_id = ? ORDER BY exam_date DESC, updated_at DESC`).bind(classId).all()
            ]);

            const archiveFiles = [...new Set(
              (sessions.results || [])
                .map(s => s.archive_file)
                .filter(v => v && String(v).trim())
            )];

            let blueprints = { results: [] };
            if (archiveFiles.length > 0) {
              const bpMarkers = archiveFiles.map(() => '?').join(',');
              blueprints = await env.DB.prepare(`
                SELECT *
                FROM exam_blueprints
                WHERE archive_file IN (${bpMarkers})
                ORDER BY archive_file ASC, question_no ASC
              `).bind(...archiveFiles).all();
            }

            return new Response(JSON.stringify({
              students: students.results,
              sessions: sessions.results,
              wrong_answers: wrongs.results,
              blueprints: blueprints.results,
              assignments: assignments.results
            }), { headers });
          }

          if (method === 'POST' && id === 'bulk-omr') {
            const teacher = await verifyAuth(request, env);
            if (!teacher) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });

            const d = await request.json();
            const examTitle = String(d.exam_title || '').trim();
            const examDate = String(d.exam_date || '').trim();
            const questionCount = Math.max(1, Math.min(80, parseInt(d.question_count, 10) || 0));
            const archiveFile = String(d.archive_file || '').trim();
            const rows = Array.isArray(d.rows) ? d.rows : [];

            if (!examTitle || !examDate || !questionCount) {
              return new Response(JSON.stringify({ success: false, error: 'exam_title, exam_date, question_count required' }), { status: 400, headers });
            }
            if (!rows.length) {
              return new Response(JSON.stringify({ success: false, error: 'rows required' }), { status: 400, headers });
            }

            const sessionRows = [];
            for (let i = 0; i < rows.length; i++) {
              const row = rows[i] || {};
              const studentId = String(row.student_id || '').trim();
              if (!studentId) continue;

              if (!(await canAccessStudent(teacher, studentId, env))) {
                return new Response(JSON.stringify({ error: 'Forbidden', student_id: studentId }), { status: 403, headers });
              }

              const classId = String(row.class_id || '').trim() || null;
              if (classId && !(await canAccessClass(teacher, classId, env))) {
                return new Response(JSON.stringify({ error: 'Forbidden', class_id: classId }), { status: 403, headers });
              }

              const wrongIds = Array.from(new Set((Array.isArray(row.wrong_ids) ? row.wrong_ids : [])
                .map(v => String(v).trim())
                .filter(v => /^\d+$/.test(v))
                .map(v => parseInt(v, 10))
                .filter(v => v >= 1 && v <= questionCount)
                .sort((a, b) => a - b)
                .map(v => String(v))));

              const existing = await env.DB.prepare(`
                SELECT id
                FROM exam_sessions
                WHERE student_id = ?
                  AND exam_title = ?
                  AND exam_date = ?
                LIMIT 1
              `).bind(studentId, examTitle, examDate).first();

              const sessionId = existing?.id || `ex_${Date.now()}_${i}_${Math.random().toString(36).slice(2, 8)}`;
              const score = Math.round(((questionCount - wrongIds.length) / questionCount) * 100);
              sessionRows.push({ sessionId, studentId, classId, wrongIds, score });
            }

            if (!sessionRows.length) {
              return new Response(JSON.stringify({ success: false, error: 'valid rows required' }), { status: 400, headers });
            }

            const stmts = [];
            for (const row of sessionRows) {
              stmts.push(env.DB.prepare(`
                INSERT INTO exam_sessions (id, student_id, exam_title, score, exam_date, question_count, class_id, archive_file, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, DATETIME('now'))
                ON CONFLICT(id) DO UPDATE SET
                  exam_title=excluded.exam_title,
                  score=excluded.score,
                  exam_date=excluded.exam_date,
                  question_count=excluded.question_count,
                  class_id=excluded.class_id,
                  archive_file=COALESCE(excluded.archive_file, exam_sessions.archive_file),
                  updated_at=excluded.updated_at
              `).bind(row.sessionId, row.studentId, examTitle, row.score, examDate, questionCount, row.classId, archiveFile || null));
              stmts.push(env.DB.prepare('DELETE FROM wrong_answers WHERE session_id = ?').bind(row.sessionId));
              for (const qId of row.wrongIds) {
                stmts.push(env.DB.prepare('INSERT INTO wrong_answers (session_id, question_id, student_id) VALUES (?, ?, ?)').bind(row.sessionId, qId, row.studentId));
              }
            }

            await env.DB.batch(stmts);
            return new Response(JSON.stringify({ success: true, saved: sessionRows.length }), { headers });
          }

          if (method === 'PATCH') {
            const teacher = await verifyAuth(request, env);
            if (!teacher) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });
            const d = await request.json();
            if (!(await canAccessStudent(teacher, d.student_id, env))) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers });
            const sid = id === 'new' ? `ex_${Date.now()}` : id;
            const stmts = [
              env.DB.prepare(`
                INSERT INTO exam_sessions (id, student_id, exam_title, score, exam_date, question_count, class_id, archive_file, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, DATETIME('now'))
                ON CONFLICT(id) DO UPDATE SET
                  score=excluded.score,
                  question_count=excluded.question_count,
                  class_id=excluded.class_id,
                  archive_file=COALESCE(excluded.archive_file, exam_sessions.archive_file),
                  updated_at=excluded.updated_at
              `).bind(sid, d.student_id, d.exam_title, d.score, d.exam_date, d.question_count || 0, d.class_id || null, d.archive_file || null),
              env.DB.prepare('DELETE FROM wrong_answers WHERE session_id = ?').bind(sid)
            ];
            for (const qId of (d.wrong_ids || [])) stmts.push(env.DB.prepare('INSERT INTO wrong_answers (session_id, question_id, student_id) VALUES (?, ?, ?)').bind(sid, qId, d.student_id));
            await env.DB.batch(stmts);
            return new Response(JSON.stringify({ success: true, id: sid }), { headers });
          }

          if (method === 'DELETE' && path[3] === 'wrongs') {
            const teacher = await verifyAuth(request, env);
            if (!teacher) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });

            const session = await env.DB.prepare('SELECT student_id FROM exam_sessions WHERE id = ?').bind(id).first();
            if (!session) return new Response(JSON.stringify({ success: false, error: 'session not found' }), { status: 404, headers });
            if (!(await canAccessStudent(teacher, session.student_id, env))) {
              return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers });
            }

            await env.DB.prepare('DELETE FROM wrong_answers WHERE session_id = ?').bind(id).run();
            return new Response(JSON.stringify({ success: true }), { headers });
          }

          if (method === 'DELETE') {
            const teacher = await verifyAuth(request, env);
            if (!teacher) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });

            const session = await env.DB.prepare('SELECT student_id FROM exam_sessions WHERE id = ?').bind(id).first();
            if (!session) return new Response(JSON.stringify({ success: false, error: 'session not found' }), { status: 404, headers });
            if (!(await canAccessStudent(teacher, session.student_id, env))) {
              return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers });
            }

            await env.DB.batch([
              env.DB.prepare('DELETE FROM wrong_answers WHERE session_id = ?').bind(id),
              env.DB.prepare('DELETE FROM exam_sessions WHERE id = ?').bind(id)
            ]);
            return new Response(JSON.stringify({ success: true }), { headers });
          }
        }

        // --- 9. 운영 관리 (상담, 메모, 일정) ---
        if (resource === 'consultations') {
          const teacher = await verifyAuth(request, env);
          if (!teacher) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });
          if (method === 'POST') {
            const d = await request.json();
            if (!(await canAccessStudent(teacher, d.studentId, env))) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers });
            const cid = `cns_${Date.now()}`;
            await env.DB.prepare("INSERT INTO consultations (id, student_id, date, type, content, next_action) VALUES (?, ?, ?, ?, ?, ?)").bind(cid, d.studentId, d.date, d.type, d.content, d.nextAction || '').run();
            return new Response(JSON.stringify({ success: true, id: cid }), { headers });
          }
          if (method === 'GET') {
            const sid = url.searchParams.get('studentId');
            if (sid) {
              if (!(await canAccessStudent(teacher, sid, env))) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers });
              const res = await env.DB.prepare('SELECT * FROM consultations WHERE student_id = ? ORDER BY date DESC, created_at DESC').bind(sid).all();
              return new Response(JSON.stringify({ success: true, data: res.results }), { headers });
            }
          }
          if (method === 'PATCH' && id) {
            const existing = await env.DB.prepare('SELECT student_id FROM consultations WHERE id = ?').bind(id).first();
            if (!existing) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers });
            if (!(await canAccessStudent(teacher, existing.student_id, env))) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers });
            const d = await request.json();
            await env.DB.prepare("UPDATE consultations SET date = ?, type = ?, content = ?, next_action = ? WHERE id = ?").bind(d.date, d.type, d.content, d.nextAction || '', id).run();
            return new Response(JSON.stringify({ success: true }), { headers });
          }
          if (method === 'DELETE' && id) {
            const existing = await env.DB.prepare('SELECT student_id FROM consultations WHERE id = ?').bind(id).first();
            if (!existing) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers });
            if (!(await canAccessStudent(teacher, existing.student_id, env))) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers });
            await env.DB.prepare('DELETE FROM consultations WHERE id = ?').bind(id).run();
            return new Response(JSON.stringify({ success: true }), { headers });
          }
        }

        if (resource === 'operation-memos') {
          const teacher = await verifyAuth(request, env);
          if (!teacher) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });

          // admin은 전체 조회, teacher는 본인 메모만
          if (method === 'GET') {
            const res = isAdminUser(teacher)
              ? await env.DB.prepare('SELECT * FROM operation_memos ORDER BY is_done ASC, is_pinned DESC, memo_date ASC').all()
              : await env.DB.prepare("SELECT * FROM operation_memos WHERE teacher_name = ? OR teacher_name = '' OR teacher_name IS NULL ORDER BY is_done ASC, is_pinned DESC, memo_date ASC").bind(teacher.name).all();
            return new Response(JSON.stringify({ success: true, data: res.results }), { headers });
          }
          if (method === 'POST') {
            const d = await request.json();
            const mid = `m_${Date.now()}`;
            await env.DB.prepare("INSERT INTO operation_memos (id, memo_date, content, is_pinned, is_done, teacher_name) VALUES (?, ?, ?, ?, 0, ?)").bind(mid, d.memoDate, d.content, d.isPinned ? 1 : 0, teacher.name).run();
            return new Response(JSON.stringify({ success: true, id: mid }), { headers });
          }
          if (method === 'PATCH' && id) {
            const existing = await env.DB.prepare('SELECT teacher_name FROM operation_memos WHERE id = ?').bind(id).first();
            if (!existing) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers });
            if (!isAdminUser(teacher) && existing.teacher_name && existing.teacher_name !== teacher.name) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers });
            const d = await request.json();
            await env.DB.prepare("UPDATE operation_memos SET memo_date=?, content=?, is_pinned=?, is_done=? WHERE id=?").bind(d.memoDate, d.content, d.isPinned ? 1 : 0, d.isDone ? 1 : 0, id).run();
            return new Response(JSON.stringify({ success: true }), { headers });
          }
          if (method === 'DELETE' && id) {
            const existing = await env.DB.prepare('SELECT teacher_name FROM operation_memos WHERE id = ?').bind(id).first();
            if (!existing) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers });
            if (!isAdminUser(teacher) && existing.teacher_name && existing.teacher_name !== teacher.name) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers });
            await env.DB.prepare("DELETE FROM operation_memos WHERE id=?").bind(id).run();
            return new Response(JSON.stringify({ success: true }), { headers });
          }
        }
        
        if (resource === 'exam-schedules') {
          const teacher = await verifyAuth(request, env);
          if (!teacher) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });
          if (method === 'GET') { const res = await env.DB.prepare('SELECT * FROM exam_schedules ORDER BY exam_date ASC').all(); return new Response(JSON.stringify({ success: true, data: res.results }), { headers }); }
          if (!isStaffUser(teacher)) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers });
          if (method === 'POST') {
            const d = await request.json();
            const eid = `exs_${Date.now()}`;
            await env.DB.prepare("INSERT INTO exam_schedules (id, school_name, grade, exam_name, exam_date, memo) VALUES (?, ?, ?, ?, ?, ?)").bind(eid, d.schoolName, d.grade, d.examName, d.examDate, d.memo || '').run();
            return new Response(JSON.stringify({ success: true, id: eid }), { headers });
          }
          if (method === 'PATCH' && id) {
            const d = await request.json();
            await env.DB.prepare("UPDATE exam_schedules SET school_name=?, grade=?, exam_name=?, exam_date=?, memo=? WHERE id=?").bind(d.schoolName, d.grade, d.examName, d.examDate, d.memo || '', id).run();
            return new Response(JSON.stringify({ success: true }), { headers });
          }
          if (method === 'DELETE' && id) { await env.DB.prepare("DELETE FROM exam_schedules WHERE id=?").bind(id).run(); return new Response(JSON.stringify({ success: true }), { headers }); }
        }

        // --- 9.5. 반별 교재 관리 ---
        if (resource === 'academy-schedules') {
          const teacher = await verifyAuth(request, env);
          if (!teacher) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });

          const normalizeAcademySchedulePayload = (d) => {
            const scheduleType = String(d.scheduleType || '').trim();
            const title = String(d.title || '').trim();
            const scheduleDate = String(d.scheduleDate || '').trim();
            const rawTargetScope = String(d.targetScope || 'global').trim();
            const targetScope = ['global', 'teacher', 'student'].includes(rawTargetScope) ? rawTargetScope : 'global';
            const studentId = targetScope === 'student' ? String(d.studentId || '').trim() : null;
            const isClosed = scheduleType === 'closed' ? 1 : (d.isClosed ? 1 : 0);

            if (!scheduleType || !title || !scheduleDate) return { error: 'Required fields missing' };
            if (targetScope === 'student' && !studentId) return { error: 'Student ID required' };
            if ((scheduleType === 'makeup' || scheduleType === 'consultation') && targetScope !== 'student') return { error: 'Student target required' };

            return {
              scheduleType,
              title,
              scheduleDate,
              startTime: d.startTime || '',
              endTime: d.endTime || '',
              targetScope,
              studentId,
              teacherName: d.teacherName || teacher.name || '',
              memo: d.memo || '',
              isClosed
            };
          };

          if (method === 'GET') {
            const from = url.searchParams.get('from') || '';
            const to = url.searchParams.get('to') || '';
            const dateParams = [];
            let dateClause = '';
            if (from) { dateClause += ' AND schedule_date >= ?'; dateParams.push(from); }
            if (to) { dateClause += ' AND schedule_date <= ?'; dateParams.push(to); }

            if (isAdminUser(teacher)) {
              const query = `SELECT * FROM academy_schedules WHERE is_deleted = 0${dateClause} ORDER BY schedule_date ASC, start_time ASC, created_at ASC`;
              const res = dateParams.length ? await env.DB.prepare(query).bind(...dateParams).all() : await env.DB.prepare(query).all();
              return new Response(JSON.stringify({ success: true, data: res.results }), { headers });
            }

            // teacher: global 일정 전체 + 담당학생의 student 일정만
            const tcls = await env.DB.prepare('SELECT class_id FROM teacher_classes WHERE teacher_id = ?').bind(teacher.id).all();
            const classIds = (tcls.results || []).map(r => r.class_id);
            let query, params;
            if (!classIds.length) {
              query = `SELECT * FROM academy_schedules WHERE is_deleted = 0${dateClause} AND (target_scope = 'global' OR (target_scope = 'teacher' AND teacher_name = ?)) ORDER BY schedule_date ASC, start_time ASC, created_at ASC`;
              params = [...dateParams, teacher.name];
            } else {
              const cMarkers = classIds.map(() => '?').join(',');
              query = `SELECT * FROM academy_schedules WHERE is_deleted = 0${dateClause} AND (target_scope = 'global' OR (target_scope = 'teacher' AND teacher_name = ?) OR (target_scope = 'student' AND student_id IN (SELECT student_id FROM class_students WHERE class_id IN (${cMarkers})))) ORDER BY schedule_date ASC, start_time ASC, created_at ASC`;
              params = [...dateParams, teacher.name, ...classIds];
            }
            const res = params.length ? await env.DB.prepare(query).bind(...params).all() : await env.DB.prepare(query).all();
            return new Response(JSON.stringify({ success: true, data: res.results }), { headers });
          }

          if (method === 'POST') {
            const d = normalizeAcademySchedulePayload(await request.json());
            if (d.error) return new Response(JSON.stringify({ success: false, message: d.error }), { status: 400, headers });
            if (d.targetScope === 'global' && !isStaffUser(teacher)) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers });
            if (d.targetScope === 'student' && !(await canAccessStudent(teacher, d.studentId, env))) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers });
            const sid = `acs_${Date.now()}`;
            await env.DB.prepare(`INSERT INTO academy_schedules
              (id, schedule_type, title, schedule_date, start_time, end_time, target_scope, student_id, teacher_name, memo, is_closed, is_deleted, created_at, updated_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, DATETIME('now'), DATETIME('now'))`)
              .bind(sid, d.scheduleType, d.title, d.scheduleDate, d.startTime, d.endTime, d.targetScope, d.studentId, d.teacherName, d.memo, d.isClosed).run();
            return new Response(JSON.stringify({ success: true, id: sid }), { headers });
          }

          if (method === 'PATCH' && id) {
            const d = normalizeAcademySchedulePayload(await request.json());
            if (d.error) return new Response(JSON.stringify({ success: false, message: d.error }), { status: 400, headers });
            if (d.targetScope === 'global' && !isStaffUser(teacher)) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers });
            if (d.targetScope === 'student' && !(await canAccessStudent(teacher, d.studentId, env))) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers });
            await env.DB.prepare(`UPDATE academy_schedules
              SET schedule_type=?, title=?, schedule_date=?, start_time=?, end_time=?, target_scope=?, student_id=?, teacher_name=?, memo=?, is_closed=?, updated_at=DATETIME('now')
              WHERE id=? AND is_deleted = 0`)
              .bind(d.scheduleType, d.title, d.scheduleDate, d.startTime, d.endTime, d.targetScope, d.studentId, d.teacherName, d.memo, d.isClosed, id).run();
            return new Response(JSON.stringify({ success: true }), { headers });
          }

          if (method === 'DELETE' && id) {
            const existingAcs = await env.DB.prepare('SELECT target_scope, student_id, teacher_name FROM academy_schedules WHERE id = ? AND is_deleted = 0').bind(id).first();
            if (existingAcs && existingAcs.target_scope === 'global' && !isStaffUser(teacher)) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers });
            if (existingAcs && existingAcs.target_scope === 'teacher' && !isAdminUser(teacher) && existingAcs.teacher_name !== teacher.name) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers });
            if (existingAcs && existingAcs.target_scope === 'student' && !(await canAccessStudent(teacher, existingAcs.student_id, env))) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers });
            await env.DB.prepare("UPDATE academy_schedules SET is_deleted = 1, updated_at = DATETIME('now') WHERE id = ?").bind(id).run();
            return new Response(JSON.stringify({ success: true }), { headers });
          }
        }

        if (resource === 'school-exam-records') {
          const teacher = await verifyAuth(request, env);
          if (!teacher) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });

          const normalizeSchoolExamRecordPayload = async (d) => {
            const studentId = String(d.studentId || d.student_id || '').trim();
            const examYear = Number(d.examYear || d.exam_year || 0);
            const examType = String(d.examType || d.exam_type || '').trim();
            const subject = String(d.subject || '').trim();
            if (!studentId || !examYear || !examType || !subject) return { error: 'Required fields missing' };

            let targetScoreSnapshot = d.targetScoreSnapshot ?? d.target_score_snapshot ?? null;
            if (targetScoreSnapshot === '' || targetScoreSnapshot === undefined) targetScoreSnapshot = null;
            if (targetScoreSnapshot === null) {
              const student = await env.DB.prepare('SELECT target_score FROM students WHERE id = ?').bind(studentId).first();
              targetScoreSnapshot = student?.target_score ?? null;
            }

            const rawScore = d.score;
            const score = rawScore === '' || rawScore === undefined || rawScore === null ? null : Number(rawScore);
            const targetScore = targetScoreSnapshot === '' || targetScoreSnapshot === undefined || targetScoreSnapshot === null ? null : Number(targetScoreSnapshot);

            return {
              studentId,
              classId: String(d.classId || d.class_id || '').trim() || null,
              schoolName: String(d.schoolName || d.school_name || '').trim(),
              grade: String(d.grade || '').trim(),
              examYear,
              semester: String(d.semester || '').trim(),
              examType,
              subject,
              score: Number.isFinite(score) ? score : null,
              targetScoreSnapshot: Number.isFinite(targetScore) ? targetScore : null,
              memo: String(d.memo || '').trim()
            };
          };

          if (method === 'GET') {
            const params = [];
            const clauses = ['is_deleted = 0'];
            const studentId = url.searchParams.get('studentId') || '';
            const classId = url.searchParams.get('classId') || '';
            const grade = url.searchParams.get('grade') || '';
            const year = url.searchParams.get('year') || '';

            if (studentId) { clauses.push('student_id = ?'); params.push(studentId); }
            if (classId) { clauses.push('class_id = ?'); params.push(classId); }
            if (grade) { clauses.push('grade = ?'); params.push(grade); }
            if (year) { clauses.push('exam_year = ?'); params.push(Number(year)); }

            if (!isAdminUser(teacher)) {
              const tcls = await env.DB.prepare('SELECT class_id FROM teacher_classes WHERE teacher_id = ?').bind(teacher.id).all();
              const classIds = (tcls.results || []).map(r => r.class_id);
              if (!classIds.length) return new Response(JSON.stringify({ success: true, data: [] }), { headers });
              const markers = classIds.map(() => '?').join(',');
              clauses.push(`student_id IN (SELECT student_id FROM class_students WHERE class_id IN (${markers}))`);
              params.push(...classIds);
            }

            const limit = Math.min(Number(url.searchParams.get('limit') || 1000) || 1000, 2000);
            const query = `SELECT * FROM school_exam_records WHERE ${clauses.join(' AND ')} ORDER BY exam_year DESC, semester DESC, created_at DESC LIMIT ?`;
            const res = await env.DB.prepare(query).bind(...params, limit).all();
            return new Response(JSON.stringify({ success: true, data: res.results }), { headers });
          }

          if (method === 'POST' && id === 'batch') {
            const d = await request.json();
            const { classId: bClassId, examYear: bYear, semester: bSem, examType: bType, subject: bSubj, records: bRecs } = d;
            if (!bYear || !bType || !bSubj) return new Response(JSON.stringify({ success: false, message: 'examYear, examType, subject required' }), { status: 400, headers });
            if (bClassId && !(await canAccessClass(teacher, bClassId, env))) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers });

            const bStudentIds = (bRecs || []).map(r => String(r.studentId || '')).filter(Boolean);
            if (!bStudentIds.length) return new Response(JSON.stringify({ success: true }), { headers });

            // 담당 학생 검증: teacher면 classId 기준으로 일괄 확인
            if (!isAdminUser(teacher)) {
              let allowedIds;
              if (bClassId) {
                const csRes = await env.DB.prepare('SELECT student_id FROM class_students WHERE class_id = ?').bind(bClassId).all();
                allowedIds = new Set((csRes.results || []).map(r => String(r.student_id)));
              } else {
                const tcls = await env.DB.prepare('SELECT class_id FROM teacher_classes WHERE teacher_id = ?').bind(teacher.id).all();
                const tcIds = (tcls.results || []).map(r => r.class_id);
                if (!tcIds.length) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers });
                const m2 = tcIds.map(() => '?').join(',');
                const csRes2 = await env.DB.prepare(`SELECT student_id FROM class_students WHERE class_id IN (${m2})`).bind(...tcIds).all();
                allowedIds = new Set((csRes2.results || []).map(r => String(r.student_id)));
              }
              for (const sid of bStudentIds) {
                if (!allowedIds.has(sid)) return new Response(JSON.stringify({ error: 'Forbidden', message: '담당하지 않은 학생이 포함되어 있습니다.' }), { status: 403, headers });
              }
            }

            // 기존 기록 일괄 조회
            const sm = bStudentIds.map(() => '?').join(',');
            const existRes = await env.DB.prepare(
              `SELECT id, student_id FROM school_exam_records WHERE student_id IN (${sm}) AND exam_year = ? AND semester = ? AND exam_type = ? AND subject = ? AND is_deleted = 0`
            ).bind(...bStudentIds, Number(bYear), String(bSem || ''), String(bType), String(bSubj)).all();
            const existMap = new Map((existRes.results || []).map(r => [String(r.student_id), r.id]));

            // 학생 정보 일괄 조회
            const stuRes = await env.DB.prepare(`SELECT id, school_name, grade, target_score FROM students WHERE id IN (${sm})`).bind(...bStudentIds).all();
            const stuMap = new Map((stuRes.results || []).map(s => [String(s.id), s]));

            const stmts = [];
            const baseTs = Date.now();
            for (let i = 0; i < bRecs.length; i++) {
              const { studentId: bSid, score: bScore } = bRecs[i];
              const sid = String(bSid || '');
              if (!sid) continue;
              const rawScore = bScore === '' || bScore === null || bScore === undefined ? null : Number(bScore);
              const finalScore = Number.isFinite(rawScore) ? rawScore : null;
              const existId = existMap.get(sid);
              if (existId) {
                stmts.push(env.DB.prepare("UPDATE school_exam_records SET score = ?, class_id = ?, updated_at = DATETIME('now') WHERE id = ? AND is_deleted = 0").bind(finalScore, bClassId || null, existId));
              } else if (finalScore !== null) {
                const stu = stuMap.get(sid);
                const rid = `ser_${baseTs}_${i}_${sid.slice(-4)}`;
                stmts.push(env.DB.prepare(
                  "INSERT INTO school_exam_records (id,student_id,class_id,school_name,grade,exam_year,semester,exam_type,subject,score,target_score_snapshot,memo,is_deleted,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,0,DATETIME('now'),DATETIME('now'))"
                ).bind(rid, sid, bClassId || null, stu?.school_name || '', stu?.grade || '', Number(bYear), String(bSem || ''), String(bType), String(bSubj), finalScore, stu?.target_score ?? null, ''));
              }
            }
            if (stmts.length) await env.DB.batch(stmts);
            return new Response(JSON.stringify({ success: true }), { headers });
          }

          if (method === 'POST') {
            const d = await normalizeSchoolExamRecordPayload(await request.json());
            if (d.error) return new Response(JSON.stringify({ success: false, message: d.error }), { status: 400, headers });
            if (!(await canAccessStudent(teacher, d.studentId, env))) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers });
            const rid = `ser_${Date.now()}`;
            await env.DB.prepare(`INSERT INTO school_exam_records
              (id, student_id, class_id, school_name, grade, exam_year, semester, exam_type, subject, score, target_score_snapshot, memo, is_deleted, created_at, updated_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, DATETIME('now'), DATETIME('now'))`)
              .bind(rid, d.studentId, d.classId, d.schoolName, d.grade, d.examYear, d.semester, d.examType, d.subject, d.score, d.targetScoreSnapshot, d.memo).run();
            return new Response(JSON.stringify({ success: true, id: rid }), { headers });
          }

          if (method === 'PATCH' && id) {
            const existing = await env.DB.prepare('SELECT student_id FROM school_exam_records WHERE id = ? AND is_deleted = 0').bind(id).first();
            if (!existing) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers });
            if (!(await canAccessStudent(teacher, existing.student_id, env))) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers });
            const d = await normalizeSchoolExamRecordPayload(await request.json());
            if (d.error) return new Response(JSON.stringify({ success: false, message: d.error }), { status: 400, headers });
            if (!(await canAccessStudent(teacher, d.studentId, env))) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers });
            await env.DB.prepare(`UPDATE school_exam_records
              SET student_id=?, class_id=?, school_name=?, grade=?, exam_year=?, semester=?, exam_type=?, subject=?, score=?, target_score_snapshot=?, memo=?, updated_at=DATETIME('now')
              WHERE id=? AND is_deleted = 0`)
              .bind(d.studentId, d.classId, d.schoolName, d.grade, d.examYear, d.semester, d.examType, d.subject, d.score, d.targetScoreSnapshot, d.memo, id).run();
            return new Response(JSON.stringify({ success: true }), { headers });
          }

          if (method === 'DELETE' && id) {
            const existing = await env.DB.prepare('SELECT student_id FROM school_exam_records WHERE id = ? AND is_deleted = 0').bind(id).first();
            if (!existing) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers });
            if (!(await canAccessStudent(teacher, existing.student_id, env))) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers });
            await env.DB.prepare("UPDATE school_exam_records SET is_deleted = 1, updated_at = DATETIME('now') WHERE id = ?").bind(id).run();
            return new Response(JSON.stringify({ success: true }), { headers });
          }
        }

        if (resource === 'class-textbooks') {
          const teacher = await verifyAuth(request, env);
          if (!teacher) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });

          if (method === 'GET') {
            const classId = url.searchParams.get('class') || '';
            const status = url.searchParams.get('status') || '';

            if (classId) {
              if (!(await canAccessClass(teacher, classId, env))) {
                return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers });
              }

              let query = 'SELECT * FROM class_textbooks WHERE class_id = ?';
              const params = [classId];

              if (status) {
                query += ' AND status = ?';
                params.push(status);
              }

              query += ' ORDER BY sort_order ASC, created_at ASC';

              const res = await env.DB.prepare(query).bind(...params).all();
              return new Response(JSON.stringify({ success: true, items: res.results }), { headers });
            }

            if (isAdminUser(teacher)) {
              const res = await env.DB.prepare('SELECT * FROM class_textbooks ORDER BY class_id ASC, status ASC, sort_order ASC, created_at ASC').all();
              return new Response(JSON.stringify({ success: true, items: res.results }), { headers });
            }

            const tcls = await env.DB.prepare('SELECT class_id FROM teacher_classes WHERE teacher_id = ?').bind(teacher.id).all();
            const classIds = tcls.results.map(r => r.class_id);

            if (!classIds.length) {
              return new Response(JSON.stringify({ success: true, items: [] }), { headers });
            }

            const markers = classIds.map(() => '?').join(',');
            const res = await env.DB.prepare(`SELECT * FROM class_textbooks WHERE class_id IN (${markers}) ORDER BY class_id ASC, status ASC, sort_order ASC, created_at ASC`).bind(...classIds).all();
            return new Response(JSON.stringify({ success: true, items: res.results }), { headers });
          }

          if (method === 'POST') {
            const d = await request.json();

            if (!d.class_id || !String(d.title || '').trim()) {
              return new Response(JSON.stringify({ success: false, error: 'class_id and title required' }), { status: 400, headers });
            }

            if (!(await canAccessClass(teacher, d.class_id, env))) {
              return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers });
            }

            const tid = `tx_${crypto.randomUUID()}`;
            const startDate = d.start_date || todayKstDateString();

            await env.DB.prepare(`
              INSERT INTO class_textbooks (
                id, class_id, title, status, start_date, end_date, sort_order, created_at, updated_at
              ) VALUES (?, ?, ?, 'active', ?, NULL, ?, DATETIME('now'), DATETIME('now'))
            `).bind(
              tid,
              d.class_id,
              String(d.title).trim(),
              startDate,
              Number(d.sort_order || 0)
            ).run();

            const item = await env.DB.prepare('SELECT * FROM class_textbooks WHERE id = ?').bind(tid).first();
            return new Response(JSON.stringify({ success: true, item }), { headers });
          }

          if (method === 'PATCH' && id) {
            const current = await env.DB.prepare('SELECT * FROM class_textbooks WHERE id = ?').bind(id).first();

            if (!current) {
              return new Response(JSON.stringify({ success: false, error: 'not found' }), { status: 404, headers });
            }

            if (!(await canAccessClass(teacher, current.class_id, env))) {
              return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers });
            }

            const d = await request.json();
            const nextStatus = d.status || current.status || 'active';
            const today = todayKstDateString();

            let nextEndDate = d.end_date !== undefined ? d.end_date : current.end_date;
            if (nextStatus === 'completed' && !nextEndDate) nextEndDate = today;
            if (nextStatus === 'active' && d.clear_end_date === true) nextEndDate = null;

            await env.DB.prepare(`
              UPDATE class_textbooks
              SET title = ?,
                  status = ?,
                  start_date = ?,
                  end_date = ?,
                  sort_order = ?,
                  updated_at = DATETIME('now')
              WHERE id = ?
            `).bind(
              String(d.title !== undefined ? d.title : current.title).trim(),
              nextStatus,
              d.start_date !== undefined ? d.start_date : current.start_date,
              nextEndDate,
              d.sort_order !== undefined ? Number(d.sort_order || 0) : Number(current.sort_order || 0),
              id
            ).run();

            const item = await env.DB.prepare('SELECT * FROM class_textbooks WHERE id = ?').bind(id).first();
            return new Response(JSON.stringify({ success: true, item }), { headers });
          }

          if (method === 'DELETE' && id) {
            const current = await env.DB.prepare('SELECT * FROM class_textbooks WHERE id = ?').bind(id).first();

            if (!current) {
              return new Response(JSON.stringify({ success: false, error: 'not found' }), { status: 404, headers });
            }

            if (!(await canAccessClass(teacher, current.class_id, env))) {
              return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers });
            }

            await env.DB.prepare('DELETE FROM class_textbooks WHERE id = ?').bind(id).run();
            return new Response(JSON.stringify({ success: true }), { headers });
          }
        }

        // --- 9.6. 반별 수업 기록 관리 ---
        if (resource === 'class-daily-records') {
          const teacher = await verifyAuth(request, env);
          if (!teacher) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });

          if (method === 'GET') {
            const classId = url.searchParams.get('class') || '';
            const date = url.searchParams.get('date') || todayKstDateString();

            if (classId) {
              if (!(await canAccessClass(teacher, classId, env))) {
                return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers });
              }

              const records = await env.DB.prepare('SELECT * FROM class_daily_records WHERE class_id = ? AND date = ? ORDER BY created_at ASC').bind(classId, date).all();
              const progress = await env.DB.prepare(`
                SELECT *
                FROM class_daily_progress
                WHERE class_id = ?
                  AND record_id IN (
                    SELECT id FROM class_daily_records WHERE class_id = ? AND date = ?
                  )
                ORDER BY created_at ASC
              `).bind(classId, classId, date).all();

              return new Response(JSON.stringify({
                success: true,
                date,
                records: records.results,
                progress: progress.results
              }), { headers });
            }

            let classIds = [];
            if (isAdminUser(teacher)) {
              const allClasses = await env.DB.prepare('SELECT id FROM classes WHERE is_active != 0 OR is_active IS NULL').all();
              classIds = allClasses.results.map(r => r.id);
            } else {
              const tcls = await env.DB.prepare('SELECT class_id FROM teacher_classes WHERE teacher_id = ?').bind(teacher.id).all();
              classIds = tcls.results.map(r => r.class_id);
            }

            if (!classIds.length) {
              return new Response(JSON.stringify({ success: true, date, records: [], progress: [] }), { headers });
            }

            const markers = classIds.map(() => '?').join(',');
            const records = await env.DB.prepare(`SELECT * FROM class_daily_records WHERE date = ? AND class_id IN (${markers}) ORDER BY class_id ASC, created_at ASC`).bind(date, ...classIds).all();
            const progress = await env.DB.prepare(`SELECT * FROM class_daily_progress WHERE record_id IN (SELECT id FROM class_daily_records WHERE date = ? AND class_id IN (${markers})) ORDER BY created_at ASC`).bind(date, ...classIds).all();

            return new Response(JSON.stringify({
              success: true,
              date,
              records: records.results,
              progress: progress.results
            }), { headers });
          }

          if (method === 'POST') {
            const d = await request.json();

            if (!d.class_id || !d.date) {
              return new Response(JSON.stringify({ success: false, error: 'class_id and date required' }), { status: 400, headers });
            }

            if (!(await canAccessClass(teacher, d.class_id, env))) {
              return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers });
            }

            const existing = await env.DB.prepare('SELECT * FROM class_daily_records WHERE class_id = ? AND date = ?').bind(d.class_id, d.date).first();
            const recordId = existing?.id || `cdr_${crypto.randomUUID()}`;
            const teacherName = d.teacher_name || teacher.name || '';
            const specialNote = d.special_note || '';

            const stmts = [];

            if (existing) {
              stmts.push(env.DB.prepare(`
                UPDATE class_daily_records
                SET teacher_name = ?,
                    special_note = ?,
                    updated_at = DATETIME('now')
                WHERE id = ?
              `).bind(teacherName, specialNote, recordId));
            } else {
              stmts.push(env.DB.prepare(`
                INSERT INTO class_daily_records (
                  id, class_id, date, teacher_name, special_note, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, DATETIME('now'), DATETIME('now'))
              `).bind(recordId, d.class_id, d.date, teacherName, specialNote));
            }

            stmts.push(env.DB.prepare('DELETE FROM class_daily_progress WHERE record_id = ?').bind(recordId));

            const progressItems = Array.isArray(d.progress) ? d.progress : [];

            for (const item of progressItems) {
              const textbookId = item.textbook_id || '';
              const progressText = String(item.progress_text || '').trim();

              if (!textbookId && !String(item.textbook_title_snapshot || '').trim()) continue;

              let titleSnapshot = String(item.textbook_title_snapshot || '').trim();

              if (textbookId) {
                const textbook = await env.DB.prepare('SELECT title FROM class_textbooks WHERE id = ? AND class_id = ?').bind(textbookId, d.class_id).first();
                if (textbook?.title) titleSnapshot = textbook.title;
              }

              if (!titleSnapshot) continue;

              stmts.push(env.DB.prepare(`
                INSERT INTO class_daily_progress (
                  id, record_id, class_id, textbook_id, textbook_title_snapshot, progress_text, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, DATETIME('now'))
              `).bind(
                `cdp_${crypto.randomUUID()}`,
                recordId,
                d.class_id,
                textbookId || null,
                titleSnapshot,
                progressText
              ));
            }

            await env.DB.batch(stmts);

            const record = await env.DB.prepare('SELECT * FROM class_daily_records WHERE id = ?').bind(recordId).first();
            const progress = await env.DB.prepare('SELECT * FROM class_daily_progress WHERE record_id = ? ORDER BY created_at ASC').bind(recordId).all();

            return new Response(JSON.stringify({
              success: true,
              record,
              progress: progress.results
            }), { headers });
          }
        }

        // --- 10. 반 관리 (classes) ---
        if (resource === 'classes') {
          const normalizeClassPayload = (d = {}, current = {}) => ({
            name: String(d.name ?? current.name ?? '').trim(),
            grade: String(d.grade ?? current.grade ?? '').trim(),
            subject: String(d.subject ?? current.subject ?? '수학').trim() || '수학',
            teacherName: String(d.teacher_name ?? d.teacherName ?? current.teacher_name ?? teacher?.name ?? '박준성').trim() || '박준성',
            scheduleDays: String(d.schedule_days ?? d.scheduleDays ?? current.schedule_days ?? '').trim(),
            textbook: String(d.textbook ?? current.textbook ?? '').trim(),
            isActive: d.is_active !== undefined ? Number(d.is_active) : (current.is_active !== undefined ? Number(current.is_active) : 1),
            dayGroup: String(d.day_group ?? d.dayGroup ?? d.schedule_group ?? d.scheduleGroup ?? current.day_group ?? '').trim(),
            timeLabel: String(d.time_label ?? d.timeLabel ?? d.schedule_time ?? d.scheduleTime ?? current.time_label ?? '').trim()
          });

          const syncTeacherClassMapping = async (classId, teacherName) => {
            if (!classId) return false;

            const matched = await findTeacherByAlias(env, teacherName);
            if (!matched) {
              return false;
            }

            await env.DB.batch([
              env.DB.prepare('DELETE FROM teacher_classes WHERE class_id = ?').bind(classId),
              env.DB.prepare('INSERT OR IGNORE INTO teacher_classes (teacher_id, class_id) VALUES (?, ?)').bind(matched.id, classId)
            ]);
            return true;
          };
          const teacher = await verifyAuth(request, env);
          if (!teacher) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });
          if (!isStaffUser(teacher)) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers });

          if (method === 'POST') {
            const d = normalizeClassPayload(await request.json());
            if (!d.name) return new Response(JSON.stringify({ error: 'name required' }), { status: 400, headers });
            const cid = `cls_${Date.now()}`;
            await env.DB.prepare("INSERT INTO classes (id, name, grade, subject, teacher_name, schedule_days, textbook, is_active, day_group, time_label) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)").bind(cid, d.name, d.grade, d.subject, d.teacherName, d.scheduleDays, d.textbook, d.isActive, d.dayGroup, d.timeLabel).run();
            const mappingUpdated = await syncTeacherClassMapping(cid, d.teacherName);
            return new Response(JSON.stringify({ success: true, id: cid, mappingUpdated }), { headers });
          }
          if (method === 'PATCH' && id) {
            const current = await env.DB.prepare('SELECT * FROM classes WHERE id = ?').bind(id).first();
            if (!current) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers });
            if (!(await canAccessClass(teacher, id, env))) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers });
            const d = normalizeClassPayload(await request.json(), current);
            if (!d.name) return new Response(JSON.stringify({ error: 'name required' }), { status: 400, headers });
            await env.DB.prepare("UPDATE classes SET name = ?, grade = ?, subject = ?, teacher_name = ?, schedule_days = ?, textbook = ?, is_active = ?, day_group = ?, time_label = ? WHERE id = ?").bind(d.name, d.grade, d.subject, d.teacherName, d.scheduleDays, d.textbook, d.isActive, d.dayGroup, d.timeLabel, id).run();
            const mappingUpdated = await syncTeacherClassMapping(id, d.teacherName);
            return new Response(JSON.stringify({ success: true, mappingUpdated }), { headers });
          }
          if (method === 'DELETE' && id) {
            const classId = String(id || '').trim();
            if (!classId) return new Response(JSON.stringify({ error: 'class id required' }), { status: 400, headers });

            const current = await env.DB.prepare('SELECT id FROM classes WHERE id = ?').bind(classId).first();
            if (!current) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers });
            if (!(await canAccessClass(teacher, classId, env))) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers });

            const countRows = async (table) => {
              const row = await env.DB.prepare(`SELECT COUNT(*) AS count FROM ${table} WHERE class_id = ?`).bind(classId).first();
              return Number(row?.count || 0);
            };

            const deleted = {
              class_students: await countRows('class_students'),
              teacher_classes: await countRows('teacher_classes'),
              class_textbooks: await countRows('class_textbooks'),
              class_daily_records: await countRows('class_daily_records'),
              class_daily_progress: await countRows('class_daily_progress'),
              class_exam_assignments: await countRows('class_exam_assignments'),
              exam_sessions: await countRows('exam_sessions'),
              school_exam_records: await countRows('school_exam_records'),
              classes: 1
            };

            const sessionRes = await env.DB.prepare('SELECT id FROM exam_sessions WHERE class_id = ?').bind(classId).all();
            const sessionIds = (sessionRes.results || []).map(r => String(r.id || '').trim()).filter(Boolean);
            const wrongAnswerDelete = sessionIds.length
              ? [env.DB.prepare(`DELETE FROM wrong_answers WHERE session_id IN (${sessionIds.map(() => '?').join(',')})`).bind(...sessionIds)]
              : [];

            await env.DB.batch([
              ...wrongAnswerDelete,
              env.DB.prepare('DELETE FROM teacher_classes WHERE class_id = ?').bind(classId),
              env.DB.prepare('DELETE FROM class_students WHERE class_id = ?').bind(classId),
              env.DB.prepare('DELETE FROM class_textbooks WHERE class_id = ?').bind(classId),
              env.DB.prepare('DELETE FROM class_daily_progress WHERE class_id = ?').bind(classId),
              env.DB.prepare('DELETE FROM class_daily_records WHERE class_id = ?').bind(classId),
              env.DB.prepare('DELETE FROM class_exam_assignments WHERE class_id = ?').bind(classId),
              env.DB.prepare('DELETE FROM exam_sessions WHERE class_id = ?').bind(classId),
              env.DB.prepare('DELETE FROM school_exam_records WHERE class_id = ?').bind(classId),
              env.DB.prepare('DELETE FROM classes WHERE id = ?').bind(classId)
            ]);

            return new Response(JSON.stringify({ success: true, mode: 'deleted', deleted }), { headers });
          }
        }

        // --- 11. 선생님 및 담당반 관리 (Staff Only) ---
        if (resource === 'teachers' && method === 'GET') {
          const t = await verifyAuth(request, env);
          if (!isAdminUser(t)) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });
          const res = await env.DB.prepare('SELECT id, name, login_id, role FROM teachers ORDER BY role DESC').all();
          const map = await env.DB.prepare('SELECT * FROM teacher_classes').all();
          return new Response(JSON.stringify({ teachers: res.results, teacher_classes: map.results }), { headers });
        }

        if (resource === 'teacher-classes' && method === 'POST') {
          const t = await verifyAuth(request, env);
          if (!isAdminUser(t)) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });
          const { teacher_id, class_ids } = await request.json();
          const stmts = [env.DB.prepare('DELETE FROM teacher_classes WHERE teacher_id = ?').bind(teacher_id)];
          for (const cid of (class_ids || [])) stmts.push(env.DB.prepare('INSERT OR IGNORE INTO teacher_classes (teacher_id, class_id) VALUES (?, ?)').bind(teacher_id, cid));
          await env.DB.batch(stmts);
          return new Response(JSON.stringify({ success: true }), { headers });
        }

        // --- 11b. 선생님 계정 생성 (Staff Only) ---
        if (resource === 'teachers' && method === 'POST') {
          const t = await verifyAuth(request, env);
          if (!isAdminUser(t)) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });
          const d = await request.json();
          const loginId = String(d.login_id || '').trim();
          const password = String(d.password || '').trim();
          const name = String(d.name || '').trim();
          const role = d.role === 'admin' ? 'admin' : 'teacher';
          if (!loginId || !password || !name) return new Response(JSON.stringify({ error: 'Required fields: login_id, password, name' }), { status: 400, headers });
          const existing = await env.DB.prepare('SELECT 1 FROM teachers WHERE login_id = ?').bind(loginId).first();
          if (existing) return new Response(JSON.stringify({ error: '이미 사용 중인 아이디입니다.' }), { status: 409, headers });
          const hash = await sha256hex(password);
          const tid = `t_${Date.now()}`;
          await env.DB.prepare("INSERT INTO teachers (id, name, login_id, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?, DATETIME('now'))").bind(tid, name, loginId, hash, role).run();
          return new Response(JSON.stringify({ success: true, id: tid }), { headers });
        }

        // --- 11c. 선생님 정보 수정 / 비밀번호 초기화 (Staff Only) ---
        if (resource === 'teachers' && method === 'PATCH' && id) {
          const t = await verifyAuth(request, env);
          if (!isAdminUser(t)) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });
          const d = await request.json();
          if (path[3] === 'reset-password') {
            const newPass = String(d.new_password || '').trim();
            if (!newPass) return new Response(JSON.stringify({ error: 'new_password required' }), { status: 400, headers });
            const hash = await sha256hex(newPass);
            await env.DB.prepare('UPDATE teachers SET password_hash = ? WHERE id = ?').bind(hash, id).run();
            return new Response(JSON.stringify({ success: true }), { headers });
          }
          const name = String(d.name || '').trim();
          if (!name) return new Response(JSON.stringify({ error: 'name required' }), { status: 400, headers });
          const role = d.role === 'admin' ? 'admin' : 'teacher';
          await env.DB.prepare('UPDATE teachers SET name = ?, role = ? WHERE id = ?').bind(name, role, id).run();
          return new Response(JSON.stringify({ success: true }), { headers });
        }

        // --- 12. AI 리포트 ---
        if (resource === 'ai' && path[2] === 'report-analysis' && method === 'POST') {
          const teacher = await verifyAuth(request, env);
          if (!teacher) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });

          const payload = await request.json();
          const studentId = String(payload?.student?.id || payload?.exam?.student_id || '').trim();
          if (studentId && !(await canAccessStudent(teacher, studentId, env))) {
            return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers });
          }
          payload.reportWritingSeeds = buildReportWritingSeeds(payload);
          payload.learningLifeSeeds = buildLearningLifeSeeds(payload);

          try {
            const result = await callReportAiProxyAnalysis(env, payload);
            return new Response(JSON.stringify({
              success: true,
              source: result.source,
              analysis: result.analysis,
              warning: result.warning || ''
            }), { headers });
          } catch (e) {
            return new Response(JSON.stringify({
              success: true,
              source: 'fallback',
              warning: e.message,
              analysis: buildFallbackReportAnalysis(payload)
            }), { headers });
          }
        }

        if (resource === 'ai' && path[2] === 'student-report' && method === 'POST') {
          const p = await request.json();
          const { type, student, today: td } = p;
          const examStr = td?.exam ? `${td.exam.title} ${td.exam.score}점` : '없음';
          let fallback = type === 'parent' ? `[AP Math] ${student.name} 학생 오늘 수업 안내\n출결: ${td.att}\n숙제: ${td.hw}\n성적: ${examStr}` : type === 'student' ? `${student.name}아 수고했어!` : `상담메모: ${student.name}`;
          return new Response(JSON.stringify({ success: true, message: fallback, source: 'fallback' }), { headers });
        }
        
        // --- 13. 오늘의 일지 (결재 시스템) ---
        if (resource === 'daily-journals') {
          const teacher = await verifyAuth(request, env);
          if (!teacher) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });

          if (method === 'POST') {
            const d = await request.json();
            const jid = `jou_${Date.now()}`;
            await env.DB.prepare("INSERT INTO daily_journals (id, date, teacher_name, content, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, DATETIME('now'), DATETIME('now'))").bind(jid, d.date, teacher.name, d.content, d.status || '작성중').run();
            return new Response(JSON.stringify({ success: true, id: jid }), { headers });
          }

          if (method === 'PATCH' && id) {
            const d = await request.json();

            const existing = await env.DB.prepare('SELECT * FROM daily_journals WHERE id = ?')
              .bind(id)
              .first();

            if (!existing) {
              return new Response(JSON.stringify({ success: false, error: 'journal not found' }), { status: 404, headers });
            }

            if (!isAdminUser(teacher) && existing.teacher_name !== teacher.name) {
              return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers });
            }

            if (isAdminUser(teacher) && d.feedback !== undefined) {
              await env.DB.prepare("UPDATE daily_journals SET feedback = ?, status = '결재완료', updated_at = DATETIME('now') WHERE id = ?")
                .bind(d.feedback, id)
                .run();
            } else {
              await env.DB.prepare("UPDATE daily_journals SET content = ?, status = ?, updated_at = DATETIME('now') WHERE id = ?")
                .bind(d.content, d.status, id)
                .run();
            }

            return new Response(JSON.stringify({ success: true }), { headers });
          }
        }

        // --- 14. 장기 플래너 (Student Plans & Feedback) ---
        if (resource === 'planner-auth' && method === 'GET') {
          const studentId = String(url.searchParams.get('student_id') || '').trim();
          const pin = String(url.searchParams.get('pin') || '').trim();

          if (!studentId) {
            return new Response(JSON.stringify({ success: false, error: 'student_id required' }), { status: 400, headers });
          }

          const student = await env.DB.prepare(`
            SELECT id, name, school_name, grade, student_pin, status
            FROM students
            WHERE id = ?
          `).bind(studentId).first();

          if (!student) {
            return new Response(JSON.stringify({ success: false, error: 'Student not found' }), { status: 404, headers });
          }

          if (student.status !== '재원') {
            return new Response(JSON.stringify({ success: false, error: 'Not active student' }), { status: 403, headers });
          }

          if (student.student_pin && String(student.student_pin) !== pin) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            return new Response(JSON.stringify({ success: false, error: 'PIN mismatch' }), { status: 401, headers });
          }

          return new Response(JSON.stringify({
            success: true,
            student: {
              id: student.id,
              name: student.name,
              school_name: student.school_name,
              grade: student.grade
            }
          }), { headers });
        }

        if (resource === 'planner') {
          const checkPlannerAccess = async (req, studentId, pin, expectedStudentId = null) => {
            const sid = String(studentId || '').trim();
            const expected = expectedStudentId === null || expectedStudentId === undefined ? '' : String(expectedStudentId || '').trim();

            if (!sid) return { authorized: false, status: 400, error: 'student_id required' };
            if (expected && sid !== expected) return { authorized: false, status: 403, error: 'student mismatch' };

            const teacher = await verifyAuth(req, env);
            if (teacher) {
              if (await canAccessStudent(teacher, sid, env)) return { authorized: true, teacher };
              return { authorized: false, status: 403, error: 'Forbidden' };
            }

            const student = await env.DB.prepare(`
              SELECT student_pin, status
              FROM students
              WHERE id = ?
            `).bind(sid).first();

            if (!student) return { authorized: false, status: 404, error: 'Student not found' };
            if (student.status !== '재원') return { authorized: false, status: 403, error: 'Not active student' };

            const studentToken = String(req.headers.get('X-Student-Token') || '').trim();
            if (studentToken) {
              const expectedToken = await sha256hex(`${sid}:${student.student_pin || ''}:student-portal:v1`);
              if (studentToken === expectedToken) return { authorized: true, student: true, portal: true };
              await new Promise(resolve => setTimeout(resolve, 800));
              return { authorized: false, status: 401, error: 'Student token mismatch' };
            }

            if (student.student_pin && String(student.student_pin) !== String(pin || '').trim()) {
              await new Promise(resolve => setTimeout(resolve, 1000));
              return { authorized: false, status: 401, error: 'PIN mismatch' };
            }

            return { authorized: true, student: true };
          };

          const formatPlannerDate = (date) => {
            const y = date.getFullYear();
            const m = String(date.getMonth() + 1).padStart(2, '0');
            const d = String(date.getDate()).padStart(2, '0');
            return `${y}-${m}-${d}`;
          };

          const parsePlannerDate = (value) => {
            const str = String(value || '').trim();
            if (!/^\d{4}-\d{2}-\d{2}$/.test(str)) return null;
            const [y, m, d] = str.split('-').map(Number);
            const date = new Date(y, m - 1, d);
            if (!Number.isFinite(date.getTime())) return null;
            if (formatPlannerDate(date) !== str) return null;
            return date;
          };

          if (method === 'POST' && id === 'feedback') {
            const teacher = await verifyAuth(request, env);
            if (!teacher) {
              return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });
            }

            const d = await request.json();
            const studentId = String(d.student_id || '').trim();
            const feedbackDate = String(d.feedback_date || '').trim();

            if (!studentId || !feedbackDate) {
              return new Response(JSON.stringify({ success: false, error: 'student_id, feedback_date required' }), { status: 400, headers });
            }

            if (!(await canAccessStudent(teacher, studentId, env))) {
              return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers });
            }

            const completionRate = Math.max(0, Math.min(100, Math.round(Number(d.completion_rate || 0) || 0)));
            const existing = await env.DB.prepare(`
              SELECT id
              FROM planner_feedback
              WHERE student_id = ? AND feedback_date = ?
            `).bind(studentId, feedbackDate).first();

            if (existing) {
              await env.DB.prepare(`
                UPDATE planner_feedback
                SET teacher_comment = ?,
                    badge = ?,
                    completion_rate = ?,
                    updated_at = DATETIME('now')
                WHERE id = ?
              `).bind(
                String(d.teacher_comment || '').trim(),
                String(d.badge || '').trim(),
                completionRate,
                existing.id
              ).run();
            } else {
              await env.DB.prepare(`
                INSERT INTO planner_feedback (
                  id, student_id, feedback_date, teacher_comment, badge, completion_rate, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, DATETIME('now'), DATETIME('now'))
              `).bind(
                `pfb_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
                studentId,
                feedbackDate,
                String(d.teacher_comment || '').trim(),
                String(d.badge || '').trim(),
                completionRate
              ).run();
            }

            return new Response(JSON.stringify({ success: true }), { headers });
          }

          if (method === 'GET' && id === 'overview') {
            const teacher = await verifyAuth(request, env);
            if (!teacher) {
              return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });
            }

            const classId = String(url.searchParams.get('class_id') || '').trim();
            const date = String(url.searchParams.get('date') || '').trim();

            if (!classId || !date) {
              return new Response(JSON.stringify({ success: false, error: 'class_id, date required' }), { status: 400, headers });
            }

            if (!(await canAccessClass(teacher, classId, env))) {
              return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers });
            }

            const stds = await env.DB.prepare(`
              SELECT id, name
              FROM students
              WHERE status = '재원'
                AND id IN (SELECT student_id FROM class_students WHERE class_id = ?)
              ORDER BY name ASC
            `).bind(classId).all();

            const studentList = stds.results || [];
            if (!studentList.length) {
              return new Response(JSON.stringify({ success: true, students: [] }), { headers });
            }

            const studentIds = studentList.map(s => s.id);
            const markers = studentIds.map(() => '?').join(',');

            const [plans, feedbacks] = await Promise.all([
              env.DB.prepare(`
                SELECT student_id, is_done
                FROM student_plans
                WHERE plan_date = ? AND student_id IN (${markers})
              `).bind(date, ...studentIds).all(),
              env.DB.prepare(`
                SELECT *
                FROM planner_feedback
                WHERE feedback_date = ? AND student_id IN (${markers})
              `).bind(date, ...studentIds).all()
            ]);

            const feedbackMap = new Map((feedbacks.results || []).map(f => [String(f.student_id), f]));
            const planGroups = {};

            for (const p of (plans.results || [])) {
              const sid = String(p.student_id);
              if (!planGroups[sid]) planGroups[sid] = { total: 0, done: 0 };
              planGroups[sid].total += 1;
              if (Number(p.is_done || 0) === 1) planGroups[sid].done += 1;
            }

            const students = studentList.map(s => {
              const group = planGroups[String(s.id)] || { total: 0, done: 0 };
              const rate = group.total > 0 ? Math.round((group.done / group.total) * 100) : 0;
              return {
                student_id: s.id,
                name: s.name,
                total: group.total,
                done: group.done,
                rate,
                feedback: feedbackMap.get(String(s.id)) || null
              };
            });

            return new Response(JSON.stringify({ success: true, students }), { headers });
          }

          if (method === 'GET' && !id) {
            const studentId = String(url.searchParams.get('student_id') || '').trim();
            const from = String(url.searchParams.get('from') || '').trim();
            const to = String(url.searchParams.get('to') || '').trim();
            const pin = String(url.searchParams.get('pin') || '').trim();

            if (!studentId || !from || !to) {
              return new Response(JSON.stringify({ success: false, error: 'student_id, from, to required' }), { status: 400, headers });
            }

            const auth = await checkPlannerAccess(request, studentId, pin);
            if (!auth.authorized) {
              return new Response(JSON.stringify({ success: false, error: auth.error }), { status: auth.status || 403, headers });
            }

            const [plans, feedback] = await Promise.all([
              env.DB.prepare(`
                SELECT *
                FROM student_plans
                WHERE student_id = ? AND plan_date BETWEEN ? AND ?
                ORDER BY plan_date ASC, created_at ASC
              `).bind(studentId, from, to).all(),
              env.DB.prepare(`
                SELECT *
                FROM planner_feedback
                WHERE student_id = ? AND feedback_date BETWEEN ? AND ?
                ORDER BY feedback_date ASC
              `).bind(studentId, from, to).all()
            ]);

            return new Response(JSON.stringify({
              success: true,
              plans: plans.results,
              feedback: feedback.results
            }), { headers });
          }

          if (method === 'POST' && !id) {
            const d = await request.json();
            const studentId = String(d.student_id || '').trim();
            const planDate = String(d.plan_date || '').trim();
            const title = String(d.title || '').trim();
            const subject = String(d.subject || '').trim();
            const rule = String(d.repeat_rule || '').trim() || null;

            if (!studentId || !planDate || !title) {
              return new Response(JSON.stringify({ success: false, error: 'student_id, plan_date, title required' }), { status: 400, headers });
            }

            const auth = await checkPlannerAccess(request, studentId, d.pin);
            if (!auth.authorized) {
              return new Response(JSON.stringify({ success: false, error: auth.error }), { status: auth.status || 403, headers });
            }

            const startDate = parsePlannerDate(planDate);
            if (!startDate) {
              return new Response(JSON.stringify({ success: false, error: 'invalid plan_date' }), { status: 400, headers });
            }

            let endDate = startDate;
            if (rule === 'daily' || rule === 'weekly') {
              if (d.exam_date) {
                const parsedEnd = parsePlannerDate(d.exam_date);
                if (!parsedEnd) {
                  return new Response(JSON.stringify({ success: false, error: 'invalid exam_date' }), { status: 400, headers });
                }
                const today = parsePlannerDate(todayKstDateString());
                if (today && parsedEnd < today) {
                  return new Response(JSON.stringify({ success: false, error: 'exam_date is in the past' }), { status: 400, headers });
                }
                if (parsedEnd < startDate) {
                  return new Response(JSON.stringify({ success: false, error: 'exam_date must be after plan_date' }), { status: 400, headers });
                }
                endDate = parsedEnd;
              }
            }

            const stmts = [];
            const current = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
            let count = 0;

            while (current <= endDate && count < 100) {
              const currentDate = formatPlannerDate(current);
              stmts.push(env.DB.prepare(`
                INSERT INTO student_plans (
                  id, student_id, plan_date, title, subject, is_done, repeat_rule, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, 0, ?, DATETIME('now'), DATETIME('now'))
              `).bind(
                `plan_${Date.now()}_${count}_${Math.random().toString(36).slice(2, 8)}`,
                studentId,
                currentDate,
                title,
                subject,
                rule
              ));

              if (rule === 'daily') current.setDate(current.getDate() + 1);
              else if (rule === 'weekly') current.setDate(current.getDate() + 7);
              else break;

              count += 1;
            }

            if (stmts.length) await env.DB.batch(stmts);
            return new Response(JSON.stringify({ success: true, count: stmts.length }), { headers });
          }

          if (method === 'PATCH' && id === 'settings') {
            const d = await request.json();
            const studentId = String(d.student_id || '').trim();
            const pin = String(d.pin || '').trim();
            const examDateStr = String(d.planner_exam_date || '').trim();

            if (!studentId || !examDateStr) {
              return new Response(JSON.stringify({ success: false, error: 'student_id, planner_exam_date required' }), { status: 400, headers });
            }

            const parsedExamDate = parsePlannerDate(examDateStr);
            if (!parsedExamDate) {
              return new Response(JSON.stringify({ success: false, error: 'planner_exam_date must be YYYY-MM-DD' }), { status: 400, headers });
            }

            const today = parsePlannerDate(todayKstDateString());
            if (today && parsedExamDate < today) {
              return new Response(JSON.stringify({ success: false, error: 'planner_exam_date must be today or later' }), { status: 400, headers });
            }

            const auth = await checkPlannerAccess(request, studentId, pin);
            if (!auth.authorized) {
              return new Response(JSON.stringify({ success: false, error: auth.error }), { status: auth.status || 403, headers });
            }

            await env.DB.prepare(`
              UPDATE students
              SET planner_exam_date = ?
              WHERE id = ?
            `).bind(examDateStr, studentId).run();

            return new Response(JSON.stringify({ success: true }), { headers });
          }
          if (method === 'PATCH' && id) {
            const d = await request.json();
            const existing = await env.DB.prepare(`
              SELECT id, student_id, updated_at
              FROM student_plans
              WHERE id = ?
            `).bind(id).first();

            if (!existing) {
              return new Response(JSON.stringify({ success: false, error: 'Not found' }), { status: 404, headers });
            }

            const auth = await checkPlannerAccess(request, existing.student_id, d.pin, d.student_id || existing.student_id);
            if (!auth.authorized) {
              return new Response(JSON.stringify({ success: false, error: auth.error }), { status: auth.status || 403, headers });
            }

            if (d.updated_at && existing.updated_at) {
              const existingTime = new Date(String(existing.updated_at).replace(' ', 'T')).getTime();
              const requestTime = new Date(String(d.updated_at).replace(' ', 'T')).getTime();

              if (Number.isFinite(existingTime) && Number.isFinite(requestTime) && existingTime > requestTime) {
                return new Response(JSON.stringify({ success: false, error: 'Conflict: Data modified elsewhere' }), { status: 409, headers });
              }
            }

            await env.DB.prepare(`
              UPDATE student_plans
              SET title = COALESCE(?, title),
                  subject = COALESCE(?, subject),
                  plan_date = COALESCE(?, plan_date),
                  is_done = COALESCE(?, is_done),
                  updated_at = DATETIME('now')
              WHERE id = ?
            `).bind(
              d.title !== undefined ? String(d.title).trim() : null,
              d.subject !== undefined ? String(d.subject).trim() : null,
              d.plan_date !== undefined ? String(d.plan_date).trim() : null,
              d.is_done !== undefined ? (d.is_done ? 1 : 0) : null,
              id
            ).run();

            return new Response(JSON.stringify({ success: true }), { headers });
          }

          if (method === 'DELETE' && id) {
            const studentId = String(url.searchParams.get('student_id') || '').trim();
            const pin = String(url.searchParams.get('pin') || '').trim();

            const existing = await env.DB.prepare(`
              SELECT id, student_id
              FROM student_plans
              WHERE id = ?
            `).bind(id).first();

            if (!existing) {
              return new Response(JSON.stringify({ success: false, error: 'Not found' }), { status: 404, headers });
            }

            const auth = await checkPlannerAccess(request, existing.student_id, pin, studentId || existing.student_id);
            if (!auth.authorized) {
              return new Response(JSON.stringify({ success: false, error: auth.error }), { status: auth.status || 403, headers });
            }

            await env.DB.prepare('DELETE FROM student_plans WHERE id = ?').bind(id).run();
            return new Response(JSON.stringify({ success: true }), { headers });
          }
        }
      }

      return new Response(JSON.stringify({ error: 'API Endpoint Not Found' }), { status: 404, headers });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500, headers });
    }
  }
};
