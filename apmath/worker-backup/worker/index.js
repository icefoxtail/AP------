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
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
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

function normalizeReportAnalysisResult(raw = {}) {
  const cleanString = (v) => String(v || '').trim();
  const cleanArray = (v) => Array.isArray(v) ? v.map(x => cleanString(x)).filter(Boolean).slice(0, 8) : [];
  const risk = cleanString(raw.riskLevel || 'stable');
  return {
    summary: cleanString(raw.summary),
    diagnosis: cleanString(raw.diagnosis),
    wrongAnalysis: cleanString(raw.wrongAnalysis),
    nextPlan: cleanString(raw.nextPlan),
    parentMessage: cleanString(raw.parentMessage),
    kakaoSummary: cleanString(raw.kakaoSummary),
    teacherMemo: cleanString(raw.teacherMemo),
    riskLevel: ['stable', 'watch', 'focus'].includes(risk) ? risk : 'stable',
    mainWeaknesses: cleanArray(raw.mainWeaknesses),
    nextActions: cleanArray(raw.nextActions)
  };
}

function buildFallbackReportAnalysis(payload = {}) {
  const draft = payload?.baseReportDraft || null;
  if (draft && typeof draft === 'object') {
    const studentName = payload?.student?.name || payload?.student?.id || '학생';
    const examTitle = payload?.exam?.title || '평가';
    const summary = String(draft.achievementSummary || '').trim() || `${studentName} 학생의 「${examTitle}」 평가 결과를 기준으로 기본 리포트를 유지합니다.`;
    const diagnosis = Array.isArray(draft.diagnosis) ? draft.diagnosis.join(' ') : String(draft.diagnosis || summary);
    const nextPlanItems = Array.isArray(draft.nextPlanItems) ? draft.nextPlanItems : [];
    const parentMessage = String(draft.parentMessage || '').trim() || `${studentName} 학생의 평가 결과와 다음 수업 보완 방향을 기본 리포트 기준으로 안내드립니다.`;
    return normalizeReportAnalysisResult({
      summary,
      diagnosis,
      wrongAnalysis: Array.isArray(draft.evaluationMeaning) ? draft.evaluationMeaning.slice(1).join(' ') : diagnosis,
      nextPlan: nextPlanItems.join(' '),
      parentMessage,
      kakaoSummary: String(draft.kakaoSummary || '').trim() || `안녕하세요, AP수학입니다.

${studentName} 학생의 「${examTitle}」 평가 리포트를 전달드립니다.
기본 리포트 기준으로 성취와 보완 방향을 안내드립니다.

감사합니다.`,
      teacherMemo: String(draft.teacherMemo || '').trim() || '기본 리포트 기준으로 다음 수업 보완 포인트를 확인합니다.',
      riskLevel: 'stable',
      mainWeaknesses: Array.isArray(payload?.wrongAnalysis) && payload.wrongAnalysis.length ? ['풀이 흐름 확인', '조건 표시와 검산 습관'] : ['정확도 유지', '심화 응용 확장'],
      nextActions: nextPlanItems.length ? nextPlanItems.slice(0, 5) : ['기본 리포트 기준으로 다음 수업을 이어갑니다.']
    });
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
  const summary = `${studentName} 학생은 「${examTitle}」에서 ${score ?? '-'}점을 기록했습니다.${correctRate !== null ? ` 정답률은 ${correctRate}%입니다.` : ''}`;
  const diagnosis = `${summary}${comparison.length ? ` 비교 기준은 ${comparison.join(', ')}입니다.` : ''} 이번 리포트는 오답 번호와 정답률을 기준으로 보완 방향을 정리했습니다.`;
  const wrongAnalysis = wrongCount
    ? `오답은 ${wrongRows.map(r => `${r.questionNo}번`).join(', ')}에서 확인됩니다.${hard.length ? ` 이 중 ${hard.length}문항은 전체 정답률이 낮아 다수 학생이 어려워한 문항으로 볼 수 있습니다.` : ''}${personal.length ? ` ${personal.length}문항은 전체 정답률이 높은 편이라 조건 확인, 계산 정리, 검산 습관을 우선 점검하겠습니다.` : ''}`
    : '이번 평가는 오답 없이 안정적으로 마무리했습니다.';
  const nextActions = [
    '오답 문항의 풀이 과정을 다시 확인합니다.',
    '조건 표시와 식 세우기 과정을 점검합니다.',
    '계산 후 검산 습관을 짧은 확인문제로 보완합니다.'
  ];
  if (units.length) nextActions.unshift(`${units.join(', ')} 단원을 우선 보완합니다.`);
  const nextPlan = `${nextActions.slice(0, 4).join(' ')} 필요하면 유사문항과 상승문제로 연결하겠습니다.`;
  const parentMessage = `${studentName} 학생의 이번 평가는 점수뿐 아니라 오답이 나온 문항의 정답률과 단원을 함께 확인하는 것이 중요합니다. 학원에서는 다음 수업에서 오답 원인을 다시 확인하고, 같은 실수가 반복되지 않도록 풀이 순서와 검산 습관을 잡아가겠습니다. 가정에서는 문제 조건 표시와 숙제 마무리 여부만 가볍게 확인해 주시면 좋겠습니다.`;
  const kakaoSummary = `안녕하세요, AP수학입니다.\n\n${studentName} 학생의 「${examTitle}」 평가 리포트를 전달드립니다.\n- 점수: ${score ?? '-'}점\n- 문항 수: ${qCount || '-'}문항\n- 오답: ${wrongCount}문항${correctRate !== null ? `\n- 정답률: ${correctRate}%` : ''}\n\n자세한 오답 의미와 보완 계획은 함께 전달드리는 PDF 리포트에서 확인하실 수 있습니다.\n\n감사합니다.`;
  return normalizeReportAnalysisResult({
    summary,
    diagnosis,
    wrongAnalysis,
    nextPlan,
    parentMessage,
    kakaoSummary,
    teacherMemo: units.length ? `우선 보완 단원: ${units.join(', ')}` : '특이 단원 쏠림 없음',
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
  if (!merged.mainWeaknesses.length) merged.mainWeaknesses = fallback?.mainWeaknesses || [];
  if (merged.nextActions.length < 2) merged.nextActions = fallback?.nextActions || merged.nextActions;
  return merged;
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
  const normalized = normalizeReportAnalysisResult(parsed);
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

          try {
            const result = await callOpenAiReportAnalysis(env, payload);
            return new Response(JSON.stringify({
              success: true,
              source: result.source,
              analysis: result.analysis
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
