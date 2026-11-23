// "이 학생(또는 이 반)에게 이미 준 문항" UID 목록 (읽기 전용).
//
// 단원별 기출이 같은 단원으로 다시 뽑을 때 앞서 준 문항을 빼려고 쓴다. 두 출처를 합친다.
//  1) class_exam_assignment_questions(출제 때 남기는 문항 다리): 저장본·원본 출제처럼 UID가 확인된 줄.
//  2) 출제본 mixed_payload_json의 questions[].questionUid: 단원별 기출(MIXED:…)은 출제 때 서버가 문항을
//     원본 시험지와 대조하지 않아 1)의 UID가 비어 있다(resolution_status=UNRESOLVED). 본문에 UID가 실려 있다.
// 학생 기준은 출제 때 받는 사람으로 적힌 줄에서 출제 제외 학생을 뺀 것이고, 반 기준은 그 반의 출제 전부다.
// 취소된 출제는 준 것으로 세지 않는다. 문항을 알 수 없는 출제(UID도 payload도 없음)는 unresolved로 센다.

const UID = /^qid_v1_[a-f0-9]{64}$/;
const CHUNK = 80; // D1 바인딩 변수 한도(100)보다 작게
export const GIVEN_ASSIGNMENT_LIMIT = 500; // 한 번에 보는 출제 건수 상한(최신 출제일부터)

const marks = (list) => list.map(() => '?').join(',');

async function hasColumn(env, table, column) {
  try {
    const res = await env.DB.prepare(`PRAGMA table_info(${table})`).all();
    return (res.results || []).some((row) => row.name === column);
  } catch {
    return false;
  }
}

async function collectAssignments(env, { studentIds, classId, from }) {
  const cancelled = (await hasColumn(env, 'class_exam_assignments', 'cancelled_at'))
    ? 'AND a.cancelled_at IS NULL'
    : '';
  const dateCut = from ? "AND SUBSTR(COALESCE(a.exam_date, ''), 1, 10) >= ?" : '';
  const found = new Map();
  if (classId) {
    const res = await env.DB.prepare(
      `SELECT a.id, a.exam_date FROM class_exam_assignments a
       WHERE a.class_id = ? ${cancelled} ${dateCut}`,
    ).bind(classId, ...(from ? [from] : [])).all();
    for (const row of res.results || []) found.set(row.id, String(row.exam_date || ''));
    return found;
  }
  for (let i = 0; i < studentIds.length; i += CHUNK) {
    const part = studentIds.slice(i, i + CHUNK);
    const res = await env.DB.prepare(
      `SELECT DISTINCT a.id, a.exam_date
       FROM class_exam_assignment_recipients r
       JOIN class_exam_assignments a ON a.id = r.assignment_id
       LEFT JOIN class_exam_assignment_exclusions x ON x.assignment_id = a.id AND x.student_id = r.student_id
       WHERE r.student_id IN (${marks(part)}) AND x.student_id IS NULL ${cancelled} ${dateCut}`,
    ).bind(...part, ...(from ? [from] : [])).all();
    for (const row of res.results || []) found.set(row.id, String(row.exam_date || ''));
  }
  return found;
}

// assignment id → 문항 UID 목록 (UID가 하나도 없는 출제는 빈 목록으로 남긴다)
async function collectUids(env, assignmentIds) {
  const byAssignment = new Map(assignmentIds.map((id) => [id, new Set()]));
  const hasPayload = await hasColumn(env, 'class_exam_assignments', 'mixed_payload_json');
  for (let i = 0; i < assignmentIds.length; i += CHUNK) {
    const part = assignmentIds.slice(i, i + CHUNK);
    const bridge = await env.DB.prepare(
      `SELECT q.assignment_id AS aid, q.question_uid AS uid
       FROM class_exam_assignment_questions q
       WHERE q.assignment_id IN (${marks(part)}) AND q.question_uid IS NOT NULL AND q.question_uid != ''`,
    ).bind(...part).all();
    for (const row of bridge.results || []) if (UID.test(row.uid)) byAssignment.get(row.aid)?.add(row.uid);
    if (!hasPayload) continue;
    // json_valid가 아닌 값은 '{}'로 바꿔 json_each가 오류 없이 빈 결과를 내게 한다.
    const payload = await env.DB.prepare(
      `SELECT a.id AS aid,
              COALESCE(json_extract(je.value, '$.questionUid'), json_extract(je.value, '$.source_question_uid'),
                       json_extract(je.value, '$._sourceQuestionUid')) AS uid
       FROM class_exam_assignments a,
            json_each(CASE WHEN json_valid(a.mixed_payload_json) THEN a.mixed_payload_json ELSE '{}' END, '$.questions') je
       WHERE a.id IN (${marks(part)})`,
    ).bind(...part).all();
    for (const row of payload.results || []) if (UID.test(row.uid || '')) byAssignment.get(row.aid)?.add(row.uid);
  }
  return byAssignment;
}

export async function loadGivenQuestionUids(env, { studentIds = [], classId = '', from = '' } = {}) {
  const found = await collectAssignments(env, { studentIds, classId, from });
  // 최신 출제일부터 상한까지만 본다(오래된 것은 학생에게 이미 잊힌 문항이라 놓쳐도 해가 작다).
  const ordered = [...found.entries()].sort((a, b) => (a[1] < b[1] ? 1 : a[1] > b[1] ? -1 : 0));
  const truncated = ordered.length > GIVEN_ASSIGNMENT_LIMIT;
  const ids = ordered.slice(0, GIVEN_ASSIGNMENT_LIMIT).map(([id]) => id);
  const byAssignment = ids.length ? await collectUids(env, ids) : new Map();
  const all = new Set();
  let unresolved = 0;
  for (const uids of byAssignment.values()) {
    if (!uids.size) unresolved += 1;
    for (const uid of uids) all.add(uid);
  }
  return {
    scope: classId ? 'class' : 'students',
    question_uids: [...all].sort(),
    assignment_count: ids.length,
    unresolved_assignment_count: unresolved,
    truncated,
  };
}
