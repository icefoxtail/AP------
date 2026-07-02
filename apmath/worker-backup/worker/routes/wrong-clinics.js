import { canAccessClass, canAccessStudent, canAccessStudentsBatch, isAdminUser, isStaffUser, makeId } from '../helpers/foundation-db.js';
import { jsonResponse } from '../helpers/response.js';

const ROUTE = 'wrong-clinics';

function text(value, fallback = '') {
  const raw = value === undefined || value === null ? fallback : value;
  return String(raw ?? '').trim();
}

function num(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function safeJson(value, fallback = null) {
  if (value === undefined) return fallback;
  try {
    return JSON.stringify(value ?? fallback);
  } catch (e) {
    return JSON.stringify(fallback);
  }
}

function parseJson(value, fallback = null) {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch (e) {
    return fallback;
  }
}

function todayKst() {
  return new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Seoul' });
}

function ok(data = {}) {
  return jsonResponse({ success: true, ...data });
}

function fail(message, status = 400, extra = {}) {
  return jsonResponse({ success: false, message, ...extra }, status);
}

function randomKey(prefix) {
  const bytes = new Uint8Array(10);
  crypto.getRandomValues(bytes);
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  for (const b of bytes) out += alphabet[b % alphabet.length];
  return `${prefix}_${out}`;
}

async function ensureWrongClinicTables(env) {
  await env.DB.batch([
    env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS wrong_clinic_sets (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        mode TEXT NOT NULL,
        source_scope_type TEXT NOT NULL,
        source_class_id TEXT,
        source_class_name TEXT,
        source_grade TEXT,
        source_exam_title TEXT,
        source_exam_keys_json TEXT,
        print_title TEXT,
        header_options_json TEXT,
        type_meta_json TEXT,
        created_by TEXT,
        created_by_name TEXT,
        created_at TEXT DEFAULT (datetime('now', '+9 hours')),
        memo TEXT,
        public_set_key TEXT UNIQUE,
        status TEXT DEFAULT 'active'
      )
    `),
    env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS wrong_clinic_set_items (
        id TEXT PRIMARY KEY,
        set_id TEXT NOT NULL,
        order_no INTEGER NOT NULL,
        archive_file TEXT NOT NULL,
        question_no INTEGER NOT NULL,
        source_question_id TEXT,
        original_id TEXT,
        exam_title TEXT,
        exam_date TEXT,
        correct_rate REAL,
        wrong_count INTEGER,
        total_count INTEGER,
        standard_unit_key TEXT,
        standard_unit TEXT,
        item_json TEXT,
        created_at TEXT DEFAULT (datetime('now', '+9 hours')),
        FOREIGN KEY (set_id) REFERENCES wrong_clinic_sets(id)
      )
    `),
    env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS wrong_clinic_distributions (
        id TEXT PRIMARY KEY,
        set_id TEXT NOT NULL,
        target_type TEXT NOT NULL,
        target_class_id TEXT,
        target_class_name TEXT,
        target_student_id TEXT,
        target_student_name TEXT,
        target_label TEXT,
        distributed_by TEXT,
        distributed_by_name TEXT,
        distributed_at TEXT DEFAULT (datetime('now', '+9 hours')),
        due_date TEXT,
        memo TEXT,
        status TEXT DEFAULT 'active',
        FOREIGN KEY (set_id) REFERENCES wrong_clinic_sets(id)
      )
    `),
    env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS wrong_clinic_packets (
        id TEXT PRIMARY KEY,
        set_id TEXT NOT NULL,
        distribution_id TEXT,
        recipient_student_id TEXT NOT NULL,
        recipient_student_name TEXT,
        recipient_class_id TEXT,
        recipient_class_name TEXT,
        source_class_id TEXT,
        source_class_name TEXT,
        source_grade TEXT,
        packet_key TEXT UNIQUE NOT NULL,
        item_count INTEGER DEFAULT 0,
        is_submitted INTEGER DEFAULT 0,
        submitted_at TEXT,
        review_wrong_ids_json TEXT,
        review_saved_at TEXT,
        viewed_at TEXT,
        last_opened_at TEXT,
        created_at TEXT DEFAULT (datetime('now', '+9 hours')),
        status TEXT DEFAULT 'active',
        FOREIGN KEY (set_id) REFERENCES wrong_clinic_sets(id),
        FOREIGN KEY (distribution_id) REFERENCES wrong_clinic_distributions(id)
      )
    `),
    env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS wrong_clinic_packet_items (
        id TEXT PRIMARY KEY,
        packet_id TEXT NOT NULL,
        set_item_id TEXT,
        order_no INTEGER NOT NULL,
        archive_file TEXT NOT NULL,
        question_no INTEGER NOT NULL,
        source_question_id TEXT,
        original_id TEXT,
        exam_title TEXT,
        exam_date TEXT,
        correct_rate REAL,
        wrong_count INTEGER,
        total_count INTEGER,
        wrong_note TEXT,
        item_json TEXT,
        created_at TEXT DEFAULT (datetime('now', '+9 hours')),
        FOREIGN KEY (packet_id) REFERENCES wrong_clinic_packets(id),
        FOREIGN KEY (set_item_id) REFERENCES wrong_clinic_set_items(id)
      )
    `),
    env.DB.prepare(`CREATE INDEX IF NOT EXISTS idx_wrong_clinic_packets_recipient ON wrong_clinic_packets(recipient_student_id, status, created_at)`),
    env.DB.prepare(`CREATE INDEX IF NOT EXISTS idx_wrong_clinic_packet_items_packet ON wrong_clinic_packet_items(packet_id, order_no)`),
    env.DB.prepare(`CREATE INDEX IF NOT EXISTS idx_wrong_clinic_set_items_set ON wrong_clinic_set_items(set_id, order_no)`)
  ]);
  await ensureWrongClinicPacketProgressColumns(env);
}

async function ensureWrongClinicPacketProgressColumns(env) {
  const columns = await env.DB.prepare(`PRAGMA table_info(wrong_clinic_packets)`).all();
  const names = new Set((columns.results || []).map(row => row.name));
  const statements = [];
  if (!names.has('is_submitted')) statements.push(env.DB.prepare(`ALTER TABLE wrong_clinic_packets ADD COLUMN is_submitted INTEGER DEFAULT 0`));
  if (!names.has('submitted_at')) statements.push(env.DB.prepare(`ALTER TABLE wrong_clinic_packets ADD COLUMN submitted_at TEXT`));
  if (!names.has('review_wrong_ids_json')) statements.push(env.DB.prepare(`ALTER TABLE wrong_clinic_packets ADD COLUMN review_wrong_ids_json TEXT`));
  if (!names.has('review_saved_at')) statements.push(env.DB.prepare(`ALTER TABLE wrong_clinic_packets ADD COLUMN review_saved_at TEXT`));
  if (statements.length) await env.DB.batch(statements);
}

function normalizeItem(item = {}, orderNo = 1) {
  const displayArchiveFile = text(item.archiveFile || item.archive_file);
  const displayQuestionNo = Math.trunc(num(item.questionNo || item.question_no || item.originalId || item.original_id, 0));
  const archiveFile = text(item.sourceArchiveFile || item.source_archive_file || displayArchiveFile);
  const questionNo = Math.trunc(num(item.sourceQuestionNo || item.source_question_no || displayQuestionNo, 0));
  return {
    ...item,
    archiveFile,
    questionNo,
    sourceArchiveFile: archiveFile,
    sourceQuestionNo: questionNo,
    displayArchiveFile,
    displayQuestionNo,
    sourceQuestionId: text(item.sourceQuestionId || item.source_question_id || item.questionId || item.question_id),
    originalId: text(item.originalId || item.original_id || item.id),
    examTitle: text(item.examTitle || item.exam_title),
    examDate: text(item.examDate || item.exam_date),
    correctRate: num(item.correctRate ?? item.correct_rate, 0),
    wrongCount: Math.trunc(num(item.wrongCount ?? item.wrong_count, 0)),
    totalCount: Math.trunc(num(item.totalCount ?? item.total_count, 0)),
    unitKey: text(item.unitKey || item.standardUnitKey || item.standard_unit_key),
    unitText: text(item.unitText || item.standardUnit || item.standard_unit),
    orderNo
  };
}

function getSetItemsFromPayload(payload = {}) {
  const mode = text(payload.mode || 'student');
  const source = mode === 'type'
    ? payload.typeItems
    : mode === 'grade'
    ? payload.gradeWrongItems
    : mode === 'class'
    ? payload.classWrongItems
    : [];
  return (Array.isArray(source) ? source : []).map((item, idx) => normalizeItem(item, idx + 1)).filter(item => item.archiveFile && item.questionNo);
}

function getStudentItemsFromPayload(payload = {}, studentId) {
  const student = (payload.students || []).find(row => String(row.studentId || row.student_id || '') === String(studentId));
  return (student?.wrongItems || []).map((item, idx) => normalizeItem(item, idx + 1)).filter(item => item.archiveFile && item.questionNo);
}

function getStudentRowsFromPayload(payload = {}) {
  return (Array.isArray(payload.students) ? payload.students : []).map(row => ({
    student_id: text(row.studentId || row.student_id),
    student_name: text(row.studentName || row.student_name),
    class_id: text(row.classId || row.class_id || payload.classId),
    class_name: text(row.className || row.class_name || payload.className)
  })).filter(row => row.student_id);
}

async function loadClassStudents(env, classId) {
  const res = await env.DB.prepare(`
    SELECT s.id AS student_id, s.name AS student_name, cs.class_id, c.name AS class_name
    FROM class_students cs
    JOIN students s ON s.id = cs.student_id
    LEFT JOIN classes c ON c.id = cs.class_id
    WHERE cs.class_id = ?
      AND COALESCE(s.status, '재원') IN ('재원', 'active')
    ORDER BY s.name
  `).bind(classId).all();
  return res.results || [];
}

// 대상 학생 수만큼 개별 조회하면(학년 전체 배포 등) D1 왕복이 N번 발생한다.
// 동일한 조회를 IN() 한 번으로 묶되, 학생이 여러 반에 동시 소속된 경우(재원반+특강반 등)
// class_name 알파벳순 첫 행을 무조건 고르면 클리닉을 실제로 생성한 반과 다른 반이 배정될 수 있다.
// 그래서 학생당 모든 소속 반 후보를 모아두고, 호출부가 알려준(fallback) class_id와 일치하는 행을 우선 채택한다.
async function loadStudentTargetsBatch(env, studentIds, fallbackByStudentId = new Map()) {
  const uniqueIds = [...new Set((studentIds || []).map(id => text(id)).filter(Boolean))];
  const out = new Map();
  if (!uniqueIds.length) return out;

  const placeholders = uniqueIds.map(() => '?').join(', ');
  const res = await env.DB.prepare(`
    SELECT
      s.id AS student_id,
      s.name AS student_name,
      cs.class_id,
      c.name AS class_name
    FROM students s
    LEFT JOIN class_students cs ON cs.student_id = s.id
    LEFT JOIN classes c ON c.id = cs.class_id
    WHERE s.id IN (${placeholders})
      AND COALESCE(s.status, '재원') IN ('재원', 'active')
    ORDER BY c.name ASC
  `).bind(...uniqueIds).all();

  const rowsByStudent = new Map();
  for (const row of res.results || []) {
    const sid = text(row.student_id);
    if (!sid) continue;
    if (!rowsByStudent.has(sid)) rowsByStudent.set(sid, []);
    rowsByStudent.get(sid).push(row);
  }

  for (const sid of uniqueIds) {
    const candidates = rowsByStudent.get(sid) || [];
    const fallback = fallbackByStudentId.get(sid) || {};
    const preferredClassId = text(fallback.class_id || fallback.classId);
    const row = (preferredClassId && candidates.find(r => text(r.class_id) === preferredClassId)) || candidates[0];
    out.set(sid, {
      student_id: text(row?.student_id || sid),
      student_name: text(row?.student_name || fallback.student_name || fallback.studentName),
      class_id: text(row?.class_id || fallback.class_id || fallback.classId),
      class_name: text(row?.class_name || fallback.class_name || fallback.className)
    });
  }
  return out;
}

function getTargetStudentIds(target = {}) {
  const values = Array.isArray(target.students)
    ? target.students.map(row => row?.student_id || row?.studentId || row?.id || row)
    : Array.isArray(target.student_ids)
    ? target.student_ids
    : [];
  return values.map(value => text(value)).filter(Boolean);
}

async function normalizeDistributionTargets(env, body, payload) {
  const explicitTargets = Array.isArray(body.targets) ? body.targets : [];
  if (explicitTargets.length) {
    // 학생 조회가 필요한 대상(student/custom_group)을 먼저 모아 한 번의 IN() 쿼리로 해석한다.
    const studentIdsToLoad = [];
    const fallbackByStudentId = new Map();
    for (const target of explicitTargets) {
      const type = text(target.type || target.target_type || 'student');
      if (type === 'student' && text(target.student_id)) {
        const sid = text(target.student_id);
        studentIdsToLoad.push(sid);
        fallbackByStudentId.set(sid, target);
      } else if (type === 'custom_group') {
        studentIdsToLoad.push(...getTargetStudentIds(target));
      }
    }
    const studentMap = await loadStudentTargetsBatch(env, studentIdsToLoad, fallbackByStudentId);

    const distributions = [];
    for (const target of explicitTargets) {
      const type = text(target.type || target.target_type || 'student');
      if (type === 'class' && text(target.class_id)) {
        const students = await loadClassStudents(env, text(target.class_id));
        distributions.push({
          target_type: 'class',
          target_class_id: text(target.class_id),
          target_class_name: text(target.class_name),
          target_student_id: '',
          target_student_name: '',
          target_label: text(target.target_label || target.label || target.class_name),
          students: dedupeTargets(students)
        });
      } else if (type === 'student' && text(target.student_id)) {
        const student = studentMap.get(text(target.student_id));
        if (!student) continue;
        distributions.push({
          target_type: 'student',
          target_class_id: student.class_id,
          target_class_name: student.class_name,
          target_student_id: student.student_id,
          target_student_name: student.student_name,
          target_label: text(target.target_label || target.label || target.student_name || student.student_name),
          students: [student]
        });
      } else if (type === 'custom_group') {
        const rows = getTargetStudentIds(target).map(sid => studentMap.get(sid)).filter(Boolean);
        distributions.push({
          target_type: 'custom_group',
          target_class_id: text(target.class_id),
          target_class_name: text(target.class_name),
          target_student_id: '',
          target_student_name: '',
          target_label: text(target.target_label || target.label || '임시 그룹'),
          students: dedupeTargets(rows)
        });
      }
    }
    return distributions.filter(distribution => distribution.students.length);
  }

  const mode = text(payload.mode || 'student');
  if (mode === 'student') {
    const payloadRows = getStudentRowsFromPayload(payload);
    const fallbackByStudentId = new Map(payloadRows.map(row => [text(row.student_id), row]));
    const studentMap = await loadStudentTargetsBatch(env, payloadRows.map(row => row.student_id), fallbackByStudentId);
    const rows = payloadRows.map(row => studentMap.get(text(row.student_id))).filter(Boolean);
    return [{
      target_type: rows.length === 1 ? 'student' : 'custom_group',
      target_class_id: rows.length === 1 ? text(rows[0]?.class_id) : text(payload.classId),
      target_class_name: rows.length === 1 ? text(rows[0]?.class_name) : text(payload.className),
      target_student_id: rows.length === 1 ? text(rows[0]?.student_id) : '',
      target_student_name: rows.length === 1 ? text(rows[0]?.student_name) : '',
      target_label: rows.length === 1 ? text(rows[0]?.student_name) : `${rows.length}명`,
      students: dedupeTargets(rows)
    }].filter(distribution => distribution.students.length);
  }
  if (text(payload.classId)) {
    const rows = await loadClassStudents(env, text(payload.classId));
    return [{
      target_type: 'class',
      target_class_id: text(payload.classId),
      target_class_name: text(payload.className),
      target_student_id: '',
      target_student_name: '',
      target_label: text(payload.className || '반 전체'),
      students: dedupeTargets(rows)
    }].filter(distribution => distribution.students.length);
  }
  return [];
}

function dedupeTargets(rows) {
  const map = new Map();
  for (const row of rows || []) {
    const sid = text(row.student_id || row.studentId);
    if (!sid || map.has(sid)) continue;
    map.set(sid, {
      student_id: sid,
      student_name: text(row.student_name || row.studentName),
      class_id: text(row.class_id || row.classId),
      class_name: text(row.class_name || row.className)
    });
  }
  return Array.from(map.values());
}

// 학년 범위 배포는 대상 학생이 (담임 여부와 무관하게) 출제 반과 같은 학년에 속하는지만 서버에서 재검증한다.
// class_id는 클라이언트가 보낸 값이라 신뢰할 수 없으므로 DB의 실제 반 배정을 기준으로 확인한다.
async function canDistributeToGradeStudents(env, sourceClassId, targets) {
  const studentIds = [...new Set(targets.map(t => text(t.student_id)).filter(Boolean))];
  if (!studentIds.length) return true;
  const baseClass = await env.DB.prepare('SELECT grade FROM classes WHERE id = ? LIMIT 1').bind(sourceClassId).first();
  const grade = text(baseClass?.grade || '').replace(/\s+/g, '');
  if (!grade) return false;
  const placeholders = studentIds.map(() => '?').join(', ');
  const res = await env.DB.prepare(`
    SELECT DISTINCT cs.student_id
    FROM class_students cs
    JOIN classes c ON c.id = cs.class_id
    WHERE cs.student_id IN (${placeholders})
      AND REPLACE(COALESCE(c.grade, ''), ' ', '') = ?
  `).bind(...studentIds, grade).all();
  const allowedIds = new Set((res.results || []).map(row => text(row.student_id)));
  return studentIds.every(id => allowedIds.has(id));
}

async function assertCreatePermission(env, teacher, source, targets) {
  if (!isStaffUser(teacher)) return false;
  if (isAdminUser(teacher)) return true;
  const sourceClassId = text(source.class_id || source.classId);
  if (sourceClassId && !(await canAccessClass(teacher, sourceClassId, env))) return false;
  if (text(source.scope_type) === 'grade') {
    return canDistributeToGradeStudents(env, sourceClassId, targets);
  }
  // 대상 학생 수만큼 순차 조회하면 학년 전체 배포 시 D1 왕복이 N번 발생하므로 한 번에 확인한다.
  const allowedStudentIds = await canAccessStudentsBatch(teacher, targets.map(t => t.student_id), env);
  return targets.every(target => allowedStudentIds.has(text(target.student_id)));
}

async function insertItems(env, statements, setId, packetId, items, setItemIdByKey = new Map()) {
  const packetItemIds = [];
  items.forEach((item, idx) => {
    const key = `${item.archiveFile}|${item.questionNo}|${item.examTitle}|${item.examDate}`;
    const setItemId = setItemIdByKey.get(key) || null;
    const id = makeId(packetId ? 'wcpi' : 'wcsi');
    const sql = packetId ? `
      INSERT INTO wrong_clinic_packet_items (
        id, packet_id, set_item_id, order_no, archive_file, question_no, source_question_id,
        original_id, exam_title, exam_date, correct_rate, wrong_count, total_count, wrong_note, item_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ` : `
      INSERT INTO wrong_clinic_set_items (
        id, set_id, order_no, archive_file, question_no, source_question_id, original_id,
        exam_title, exam_date, correct_rate, wrong_count, total_count, standard_unit_key, standard_unit, item_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    if (packetId) {
      statements.push(env.DB.prepare(sql).bind(
        id, packetId, setItemId, idx + 1, item.archiveFile, item.questionNo, item.sourceQuestionId,
        item.originalId, item.examTitle, item.examDate, item.correctRate, item.wrongCount, item.totalCount,
        text(item.wrongNote || item._wrongNote), safeJson(item, {})
      ));
      packetItemIds.push(id);
    } else {
      statements.push(env.DB.prepare(sql).bind(
        id, setId, idx + 1, item.archiveFile, item.questionNo, item.sourceQuestionId,
        item.originalId, item.examTitle, item.examDate, item.correctRate, item.wrongCount, item.totalCount,
        item.unitKey, item.unitText, safeJson(item, {})
      ));
      setItemIdByKey.set(key, id);
    }
  });
  return packetItemIds;
}

async function createWrongClinic(request, env, teacher) {
  const body = await request.json().catch(() => ({}));
  const payload = body.payload || {};
  const mode = text(payload.mode || body.mode || 'student');
  const source = body.source || {};
  const sourceClassId = text(source.class_id || source.classId || payload.classId);
  const sourceClassName = text(source.class_name || source.className || payload.className);
  const sourceGrade = text(source.grade || source.grade_name || payload.gradeName);
  const scopeType = text(source.scope_type || payload.scope || (mode === 'grade' ? 'grade' : 'class'));
  const distributions = await normalizeDistributionTargets(env, body, payload);
  const targets = dedupeTargets(distributions.flatMap(distribution => distribution.students));
  if (!targets.length) return fail('배포 대상 학생이 없습니다.');
  if (!(await assertCreatePermission(env, teacher, { class_id: sourceClassId, scope_type: scopeType }, targets))) return fail('Forbidden', 403);

  await ensureWrongClinicTables(env);

  const setId = makeId('wcs');
  const setKey = randomKey('SET');
  const title = text(body.title || payload.printTitle || `${sourceClassName || sourceGrade || '오답'} 클리닉`);
  const setItems = getSetItemsFromPayload(payload);
  const statements = [
    env.DB.prepare(`
      INSERT INTO wrong_clinic_sets (
        id, title, mode, source_scope_type, source_class_id, source_class_name, source_grade,
        source_exam_title, source_exam_keys_json, print_title, header_options_json, type_meta_json,
        created_by, created_by_name, public_set_key, memo, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
    `).bind(
      setId,
      title,
      mode,
      scopeType,
      sourceClassId,
      sourceClassName,
      sourceGrade,
      text((payload.exams || [])[0]?.examTitle || ''),
      safeJson(payload.exams || [], []),
      text(title || payload.printTitle),
      safeJson(payload.headerOptions || null, null),
      safeJson({
        typeMode: payload.typeMode || null,
        scope: payload.scope || null,
        rateRule: payload.rateRule || null,
        selectedUnitKeys: payload.selectedUnitKeys || [],
        unitOrder: payload.unitOrder || []
      }, {}),
      text(teacher?.id),
      text(teacher?.name),
      setKey,
      text(body.memo)
    )
  ];
  const setItemIdByKey = new Map();
  await insertItems(env, statements, setId, null, setItems, setItemIdByKey);

  const packetSummaries = [];
  // 서로 다른 배포(distribution)에 같은 학생이 중복으로 들어와도 세트당 패킷은 학생 1명당 1개만 생성한다.
  const packetedStudentIds = new Set();
  for (const distribution of distributions) {
    const distributionId = makeId('wcd');
    statements.push(env.DB.prepare(`
      INSERT INTO wrong_clinic_distributions (
        id, set_id, target_type, target_class_id, target_class_name, target_student_id,
        target_student_name, target_label, distributed_by, distributed_by_name, memo, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
    `).bind(
      distributionId,
      setId,
      distribution.target_type,
      distribution.target_class_id,
      distribution.target_class_name,
      distribution.target_student_id,
      distribution.target_student_name,
      distribution.target_label,
      text(teacher?.id),
      text(teacher?.name),
      text(body.memo)
    ));

    for (const target of distribution.students) {
      const targetStudentId = text(target.student_id);
      if (!targetStudentId || packetedStudentIds.has(targetStudentId)) continue;
      packetedStudentIds.add(targetStudentId);
      const packetId = makeId('wcp');
      const packetKey = randomKey('PKT');
      const studentItems = mode === 'student' ? getStudentItemsFromPayload(payload, target.student_id) : setItems;
      statements.push(env.DB.prepare(`
        INSERT INTO wrong_clinic_packets (
          id, set_id, distribution_id, recipient_student_id, recipient_student_name, recipient_class_id,
          recipient_class_name, source_class_id, source_class_name, source_grade, packet_key, item_count, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
      `).bind(
        packetId,
        setId,
        distributionId,
        target.student_id,
        target.student_name,
        target.class_id,
        target.class_name,
        sourceClassId,
        sourceClassName,
        sourceGrade,
        packetKey,
        studentItems.length
      ));
      await insertItems(env, statements, setId, packetId, studentItems, setItemIdByKey);
      packetSummaries.push({
        packet_id: packetId,
        student_id: target.student_id,
        student_name: target.student_name,
        packet_key: packetKey,
        item_count: studentItems.length
      });
    }
  }

  await env.DB.batch(statements);
  return ok({
    set_id: setId,
    public_set_key: setKey,
    packet_count: packetSummaries.length,
    packets: packetSummaries,
    print: {
      engine_url: `https://icefoxtail.github.io/AP------/apmath/wrong_print_engine.html?set=${encodeURIComponent(setKey)}`
    }
  });
}

function itemFromRow(row) {
  const base = parseJson(row.item_json, {}) || {};
  const sourceArchiveFile = text(base.sourceArchiveFile || base.source_archive_file || row.archive_file);
  const sourceQuestionNo = Math.trunc(num(base.sourceQuestionNo || base.source_question_no || row.question_no, 0));
  const displayArchiveFile = text(base.displayArchiveFile || base.display_archive_file || row.archive_file);
  const displayQuestionNo = Math.trunc(num(base.displayQuestionNo || base.display_question_no || row.question_no, 0));
  return {
    ...base,
    archiveFile: sourceArchiveFile,
    questionNo: sourceQuestionNo,
    sourceArchiveFile,
    sourceQuestionNo,
    displayArchiveFile,
    displayQuestionNo,
    sourceQuestionId: row.source_question_id || base.sourceQuestionId || '',
    originalId: row.original_id || base.originalId || '',
    examTitle: row.exam_title || base.examTitle || '',
    examDate: row.exam_date || base.examDate || '',
    correctRate: Number(row.correct_rate || 0),
    wrongCount: Number(row.wrong_count || 0),
    totalCount: Number(row.total_count || 0)
  };
}

function basePayloadFromSet(set) {
  const typeMeta = parseJson(set.type_meta_json, {}) || {};
  return {
    version: '2.0',
    mode: set.mode || 'student',
    publicSetKey: set.public_set_key || '',
    serverSetKey: set.public_set_key || '',
    printTitle: set.print_title || set.title || '오답 클리닉',
    classId: set.source_class_id || '',
    className: set.source_class_name || '',
    sourceClassName: set.source_class_name || '',
    gradeName: set.source_grade || '',
    createdDate: String(set.created_at || '').slice(0, 10) || todayKst(),
    headerOptions: parseJson(set.header_options_json, null),
    exams: parseJson(set.source_exam_keys_json, []) || [],
    options: {
      groupByStudent: set.mode === 'student',
      groupByExam: true,
      dedupeByQuestion: set.mode !== 'student',
      showWrongStudents: true,
      pageBreakByStudent: true,
      includeAnswer: false,
      includeSolution: false,
      includeHomeworkCheckBox: true
    },
    ...typeMeta
  };
}

async function loadSetPayload(env, setKey) {
  await ensureWrongClinicTables(env);
  const set = await env.DB.prepare(`
    SELECT *
    FROM wrong_clinic_sets
    WHERE public_set_key = ? AND COALESCE(status, 'active') = 'active'
  `).bind(setKey).first();
  if (!set) return null;
  const itemsRes = await env.DB.prepare(`
    SELECT *
    FROM wrong_clinic_set_items
    WHERE set_id = ?
    ORDER BY order_no ASC
  `).bind(set.id).all();
  const items = (itemsRes.results || []).map(itemFromRow);
  const payload = basePayloadFromSet(set);
  if (payload.mode === 'type') payload.typeItems = items;
  if (payload.mode === 'grade') payload.gradeWrongItems = items;
  if (payload.mode === 'class') payload.classWrongItems = items;
  if (payload.mode === 'student') {
    const packetsRes = await env.DB.prepare(`
      SELECT *
      FROM wrong_clinic_packets
      WHERE set_id = ?
        AND COALESCE(status, 'active') = 'active'
      ORDER BY created_at ASC, recipient_student_name ASC
    `).bind(set.id).all();
    const students = [];
    for (const packet of packetsRes.results || []) {
      const packetItemsRes = await env.DB.prepare(`
        SELECT *
        FROM wrong_clinic_packet_items
        WHERE packet_id = ?
        ORDER BY order_no ASC
      `).bind(packet.id).all();
      students.push({
        studentId: packet.recipient_student_id,
        studentName: packet.recipient_student_name || '학생',
        packetKey: packet.packet_key || '',
        serverPacketKey: packet.packet_key || '',
        wrongItems: (packetItemsRes.results || []).map(itemFromRow)
      });
    }
    payload.students = students;
  } else {
    // class/grade/type 모드도 학생마다 packet_key가 배포되어 있으므로,
    // 인쇄 시 학생별로 개인 QR(→ 학생페이지)을 붙일 수 있도록 수신자 목록을 함께 내려준다.
    const recipientsRes = await env.DB.prepare(`
      SELECT recipient_student_id, recipient_student_name, packet_key
      FROM wrong_clinic_packets
      WHERE set_id = ?
        AND COALESCE(status, 'active') = 'active'
      ORDER BY recipient_student_name ASC
    `).bind(set.id).all();
    payload.recipients = (recipientsRes.results || []).map(row => ({
      studentId: row.recipient_student_id || '',
      studentName: row.recipient_student_name || '학생',
      packetKey: row.packet_key || ''
    }));
  }
  return payload;
}

async function loadPacketPayload(env, packetKey) {
  await ensureWrongClinicTables(env);
  const packet = await env.DB.prepare(`
    SELECT p.*, s.title, s.mode, s.print_title, s.public_set_key, s.header_options_json, s.type_meta_json, s.source_exam_keys_json
    FROM wrong_clinic_packets p
    JOIN wrong_clinic_sets s ON s.id = p.set_id
    WHERE p.packet_key = ?
      AND COALESCE(p.status, 'active') = 'active'
      AND COALESCE(s.status, 'active') = 'active'
  `).bind(packetKey).first();
  if (!packet) return null;
  const itemsRes = await env.DB.prepare(`
    SELECT *
    FROM wrong_clinic_packet_items
    WHERE packet_id = ?
    ORDER BY order_no ASC
  `).bind(packet.id).all();
  const payload = basePayloadFromSet({
    ...packet,
    source_class_id: packet.source_class_id,
    source_class_name: packet.source_class_name,
    source_grade: packet.source_grade,
    created_at: packet.created_at
  });
  payload.mode = 'student';
  payload.publicSetKey = packet.public_set_key || payload.publicSetKey || '';
  payload.serverSetKey = packet.public_set_key || payload.serverSetKey || '';
  payload.classId = packet.recipient_class_id || '';
  payload.className = packet.recipient_class_name || '';
  payload.sourceClassName = packet.source_class_name || '';
  payload.students = [{
    studentId: packet.recipient_student_id,
    studentName: packet.recipient_student_name || '학생',
    packetKey: packet.packet_key || '',
    serverPacketKey: packet.packet_key || '',
    wrongItems: (itemsRes.results || []).map(itemFromRow)
  }];
  return payload;
}

async function listPacketsForTeacher(env, teacher, url) {
  await ensureWrongClinicTables(env);
  if (!isStaffUser(teacher)) return fail('Forbidden', 403);
  const studentId = text(url.searchParams.get('student_id'));
  if (!studentId) return fail('student_id required');
  if (!(await canAccessStudent(teacher, studentId, env))) return fail('Forbidden', 403);
  const res = await env.DB.prepare(`
    SELECT p.*, s.title, s.mode, s.print_title, s.header_options_json
    FROM wrong_clinic_packets p
    JOIN wrong_clinic_sets s ON s.id = p.set_id
    WHERE p.recipient_student_id = ?
      AND COALESCE(p.status, 'active') = 'active'
      AND COALESCE(s.status, 'active') = 'active'
    ORDER BY p.created_at DESC
    LIMIT 100
  `).bind(studentId).all();
  return ok({ packets: (res.results || []).map(packetSummary) });
}

async function listClassClinicStatusForTeacher(env, teacher, url) {
  await ensureWrongClinicTables(env);
  if (!isStaffUser(teacher)) return fail('Forbidden', 403);
  const classId = text(url.searchParams.get('class_id') || url.searchParams.get('class'));
  if (!classId) return fail('class_id required');
  if (!(await canAccessClass(teacher, classId, env))) return fail('Forbidden', 403);

  const from = text(url.searchParams.get('from'));
  const to = text(url.searchParams.get('to'));
  const where = [
    `p.recipient_class_id = ?`,
    `COALESCE(p.status, 'active') = 'active'`,
    `COALESCE(s.status, 'active') = 'active'`
  ];
  const binds = [classId];
  if (/^\d{4}-\d{2}-\d{2}$/.test(from)) {
    where.push(`date(COALESCE(s.created_at, p.created_at)) >= date(?)`);
    binds.push(from);
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(to)) {
    where.push(`date(COALESCE(s.created_at, p.created_at)) <= date(?)`);
    binds.push(to);
  }

  const res = await env.DB.prepare(`
    SELECT
      p.id AS packet_id,
      p.set_id,
      p.recipient_student_id,
      p.recipient_student_name,
      p.recipient_class_id,
      p.item_count,
      p.is_submitted,
      p.submitted_at,
      p.review_wrong_ids_json,
      p.review_saved_at,
      p.created_at AS packet_created_at,
      s.title,
      s.mode,
      s.print_title,
      s.public_set_key,
      s.source_exam_title,
      s.source_exam_keys_json,
      s.source_class_id,
      s.source_class_name,
      s.created_at AS set_created_at
    FROM wrong_clinic_packets p
    JOIN wrong_clinic_sets s ON s.id = p.set_id
    WHERE ${where.join(' AND ')}
    ORDER BY s.created_at DESC, p.created_at DESC
    LIMIT 500
  `).bind(...binds).all();

  const grouped = new Map();
  const packetIds = [];
  for (const row of res.results || []) {
    const setId = text(row.set_id);
    if (!setId) continue;
    if (row.packet_id) {
      packetIds.push(row.packet_id);
    }
    if (!grouped.has(setId)) {
      const exams = parseJson(row.source_exam_keys_json, []);
      grouped.set(setId, {
        set_id: setId,
        public_set_key: row.public_set_key || '',
        title: row.print_title || row.title || '오답 클리닉',
        mode: row.mode || 'student',
        source_exam_title: row.source_exam_title || '',
        source_exam_count: Array.isArray(exams) ? exams.length : 0,
        source_class_id: row.source_class_id || '',
        source_class_name: row.source_class_name || '',
        created_at: row.set_created_at || row.packet_created_at || '',
        packet_count: 0,
        submitted_count: 0,
        total_item_count: 0,
        review_wrong_count: 0,
        student_packets: []
      });
    }
    const group = grouped.get(setId);
    group.packet_count += 1;
    group.total_item_count += Number(row.item_count || 0);
    if (Number(row.is_submitted || 0)) group.submitted_count += 1;
    const reviewWrongIds = parseJson(row.review_wrong_ids_json, []);
    if (Array.isArray(reviewWrongIds)) group.review_wrong_count += reviewWrongIds.length;
    group.student_packets.push({
      packet_id: row.packet_id || '',
      student_id: row.recipient_student_id || '',
      student_name: row.recipient_student_name || '',
      item_count: Number(row.item_count || 0),
      is_submitted: Number(row.is_submitted || 0),
      submitted_at: row.submitted_at || '',
      review_wrong_count: Array.isArray(reviewWrongIds) ? reviewWrongIds.length : 0,
      items: [],
      duplicate_item_count: 0
    });
  }

  if (packetIds.length) {
    const markers = packetIds.map(() => '?').join(',');
    const itemRes = await env.DB.prepare(`
      SELECT *
      FROM wrong_clinic_packet_items
      WHERE packet_id IN (${markers})
      ORDER BY packet_id ASC, order_no ASC
    `).bind(...packetIds).all();
    const itemsByPacket = new Map();
    for (const row of itemRes.results || []) {
      const packetId = text(row.packet_id);
      if (!itemsByPacket.has(packetId)) itemsByPacket.set(packetId, []);
      const item = itemFromRow(row);
      itemsByPacket.get(packetId).push({
        order_no: Number(row.order_no || item.orderNo || 0),
        archive_file: item.sourceArchiveFile || item.archiveFile || row.archive_file || '',
        question_no: Number(item.sourceQuestionNo || item.questionNo || row.question_no || 0),
        display_archive_file: item.displayArchiveFile || item.archiveFile || row.archive_file || '',
        display_question_no: Number(item.displayQuestionNo || item.questionNo || row.question_no || 0),
        exam_title: row.exam_title || item.examTitle || ''
      });
    }

    for (const group of grouped.values()) {
      for (const packet of group.student_packets) {
        const items = itemsByPacket.get(packet.packet_id) || [];
        const seen = new Set();
        let duplicateCount = 0;
        for (const item of items) {
          const key = `${item.archive_file}|${item.question_no}`;
          if (seen.has(key)) duplicateCount += 1;
          else seen.add(key);
        }
        packet.items = items;
        packet.duplicate_item_count = duplicateCount;
      }
    }
  }

  return ok({ clinics: [...grouped.values()] });
}

function packetSummary(row) {
  const reviewWrongIds = parseJson(row.review_wrong_ids_json, []);
  const headerOptions = parseJson(row.header_options_json, null);
  return {
    packet_id: row.id,
    packet_key: row.packet_key,
    title: row.print_title || row.title || '오답 클리닉',
    subtitle: text(headerOptions?.subtitle),
    source_class_name: row.source_class_name || '',
    recipient_class_name: row.recipient_class_name || '',
    recipient_student_name: row.recipient_student_name || '',
    recipient_class_id: row.recipient_class_id || '',
    recipient_student_id: row.recipient_student_id || '',
    source_class_id: row.source_class_id || '',
    item_count: Number(row.item_count || 0),
    is_submitted: Number(row.is_submitted || 0),
    submitted_at: row.submitted_at || '',
    review_wrong_ids: Array.isArray(reviewWrongIds) ? reviewWrongIds : [],
    review_saved_at: row.review_saved_at || '',
    created_at: row.created_at || '',
    mode: row.mode || 'student'
  };
}

function normalizePacketWrongIds(values, itemCount) {
  const max = Math.max(0, Math.min(200, Math.trunc(num(itemCount, 0))));
  const source = Array.isArray(values)
    ? values
    : (typeof values === 'string' ? values.split(/[\s,]+/) : []);
  return Array.from(new Set(source
    .map(value => parseInt(value, 10))
    .filter(value => Number.isFinite(value) && value > 0 && (!max || value <= max))))
    .sort((a, b) => a - b);
}

async function listReviewWrongCandidatesForTeacher(env, teacher, url) {
  await ensureWrongClinicTables(env);
  if (!isStaffUser(teacher)) return fail('Forbidden', 403);
  const studentId = text(url.searchParams.get('student_id'));
  const packetKey = text(url.searchParams.get('packet_key'));
  if (!studentId) return fail('student_id required');
  if (!(await canAccessStudent(teacher, studentId, env))) return fail('Forbidden', 403);

  const packetRes = await env.DB.prepare(`
    SELECT p.*, s.title, s.mode, s.print_title, s.header_options_json
    FROM wrong_clinic_packets p
    JOIN wrong_clinic_sets s ON s.id = p.set_id
    WHERE p.recipient_student_id = ?
      AND (? = '' OR p.packet_key = ?)
      AND COALESCE(p.status, 'active') = 'active'
      AND COALESCE(s.status, 'active') = 'active'
      AND COALESCE(p.review_wrong_ids_json, '') != ''
    ORDER BY p.review_saved_at DESC, p.created_at DESC
    LIMIT 100
  `).bind(studentId, packetKey, packetKey).all();
  const packets = packetRes.results || [];
  if (!packets.length) return ok({ items: [], packets: [] });

  const ownerRes = await env.DB.prepare(`
    SELECT p.id AS packet_id, i.archive_file, i.question_no
    FROM wrong_clinic_packets p
    JOIN wrong_clinic_sets s ON s.id = p.set_id
    JOIN wrong_clinic_packet_items i ON i.packet_id = p.id
    WHERE p.recipient_student_id = ?
      AND COALESCE(p.status, 'active') = 'active'
      AND COALESCE(s.status, 'active') = 'active'
  `).bind(studentId).all();
  const ownersByQuestion = new Map();
  for (const row of ownerRes.results || []) {
    const questionKey = `${text(row.archive_file)}|${Number(row.question_no || 0)}`;
    if (!ownersByQuestion.has(questionKey)) ownersByQuestion.set(questionKey, new Set());
    ownersByQuestion.get(questionKey).add(row.packet_id);
  }

  const items = [];
  for (const packet of packets) {
    const wrongOrderNos = new Set(normalizePacketWrongIds(parseJson(packet.review_wrong_ids_json, []), packet.item_count));
    if (!wrongOrderNos.size) continue;
    const itemRes = await env.DB.prepare(`
      SELECT *
      FROM wrong_clinic_packet_items
      WHERE packet_id = ?
      ORDER BY order_no ASC
    `).bind(packet.id).all();
    for (const row of itemRes.results || []) {
      const orderNo = Number(row.order_no || 0);
      if (!wrongOrderNos.has(orderNo)) continue;
      const questionKey = `${text(row.archive_file)}|${Number(row.question_no || 0)}`;
      const owners = ownersByQuestion.get(questionKey) || new Set();
      if (Array.from(owners).some(id => String(id) !== String(packet.id))) continue;
      const item = itemFromRow(row);
      items.push({
        packet_key: packet.packet_key,
        packet_title: packet.print_title || packet.title || '오답 클리닉',
        packet_id: packet.id,
        recipient_student_id: packet.recipient_student_id || '',
        recipient_student_name: packet.recipient_student_name || '',
        recipient_class_id: packet.recipient_class_id || '',
        recipient_class_name: packet.recipient_class_name || '',
        source_class_id: packet.source_class_id || '',
        source_class_name: packet.source_class_name || '',
        order_no: orderNo,
        archive_file: row.archive_file,
        question_no: Number(row.question_no || 0),
        exam_title: row.exam_title || item.examTitle || '',
        exam_date: row.exam_date || item.examDate || '',
        created_at: packet.created_at || '',
        item: {
          ...item,
          orderNo,
          archiveFile: row.archive_file,
          questionNo: Number(row.question_no || 0),
          sourceArchiveFile: item.sourceArchiveFile || item.archiveFile || row.archive_file,
          sourceQuestionNo: Number(item.sourceQuestionNo || item.questionNo || row.question_no || 0),
          reviewSourcePacketKey: packet.packet_key,
          reviewSourceOrderNo: orderNo
        }
      });
    }
  }

  return ok({ items, packets: packets.map(packetSummary) });
}

export async function submitWrongClinicPacketForStudent(env, studentId, packetKey) {
  await ensureWrongClinicTables(env);
  const packet = await env.DB.prepare(`
    SELECT p.*, s.title, s.mode, s.print_title, s.header_options_json
    FROM wrong_clinic_packets p
    JOIN wrong_clinic_sets s ON s.id = p.set_id
    WHERE p.packet_key = ?
      AND p.recipient_student_id = ?
      AND COALESCE(p.status, 'active') = 'active'
      AND COALESCE(s.status, 'active') = 'active'
    LIMIT 1
  `).bind(packetKey, studentId).first();
  if (!packet) return null;
  await env.DB.prepare(`
    UPDATE wrong_clinic_packets
    SET is_submitted = 1,
        submitted_at = COALESCE(submitted_at, datetime('now', '+9 hours')),
        last_opened_at = datetime('now', '+9 hours')
    WHERE id = ?
  `).bind(packet.id).run();
  return packetSummary({
    ...packet,
    is_submitted: 1,
    submitted_at: packet.submitted_at || todayKst()
  });
}

export async function saveWrongClinicReviewWrongsForStudent(env, studentId, packetKey, wrongIds) {
  await ensureWrongClinicTables(env);
  const packet = await env.DB.prepare(`
    SELECT p.*, s.title, s.mode, s.print_title, s.header_options_json
    FROM wrong_clinic_packets p
    JOIN wrong_clinic_sets s ON s.id = p.set_id
    WHERE p.packet_key = ?
      AND p.recipient_student_id = ?
      AND COALESCE(p.status, 'active') = 'active'
      AND COALESCE(s.status, 'active') = 'active'
    LIMIT 1
  `).bind(packetKey, studentId).first();
  if (!packet) return null;
  if (Number(packet.is_submitted || 0) !== 1) return { error: 'not_submitted' };
  const normalized = normalizePacketWrongIds(wrongIds, packet.item_count);
  const savedAt = new Date().toISOString();
  const wrongJson = safeJson(normalized, []);
  await env.DB.prepare(`
    UPDATE wrong_clinic_packets
    SET review_wrong_ids_json = ?,
        review_saved_at = ?,
        last_opened_at = datetime('now', '+9 hours')
    WHERE id = ?
  `).bind(wrongJson, savedAt, packet.id).run();
  return packetSummary({
    ...packet,
    is_submitted: 1,
    review_wrong_ids_json: wrongJson,
    review_saved_at: savedAt
  });
}

async function deletePacketForTeacher(env, teacher, packetKey) {
  await ensureWrongClinicTables(env);
  if (!isStaffUser(teacher)) return fail('Forbidden', 403);
  const packet = await env.DB.prepare(`
    SELECT *
    FROM wrong_clinic_packets
    WHERE packet_key = ?
    LIMIT 1
  `).bind(packetKey).first();
  if (!packet) return fail('오답 클리닉을 찾을 수 없습니다.', 404);
  if (!(await canAccessStudent(teacher, packet.recipient_student_id, env))) return fail('Forbidden', 403);
  await env.DB.batch([
    env.DB.prepare(`DELETE FROM wrong_clinic_packet_items WHERE packet_id = ?`).bind(packet.id),
    env.DB.prepare(`DELETE FROM wrong_clinic_packets WHERE id = ?`).bind(packet.id)
  ]);
  return ok({ deleted: true, packet_key: packetKey });
}

export async function listWrongClinicPacketsForStudent(env, studentId) {
  await ensureWrongClinicTables(env);
  const res = await env.DB.prepare(`
    SELECT p.*, s.title, s.mode, s.print_title, s.header_options_json
    FROM wrong_clinic_packets p
    JOIN wrong_clinic_sets s ON s.id = p.set_id
    WHERE p.recipient_student_id = ?
      AND COALESCE(p.status, 'active') = 'active'
      AND COALESCE(s.status, 'active') = 'active'
    ORDER BY p.created_at DESC
    LIMIT 100
  `).bind(studentId).all();
  return (res.results || []).map(packetSummary);
}

export async function handleWrongClinics(request, env, teacher, path, url) {
  const method = request.method;
  const resource = path[1];
  const id = path[2];
  const key = path[3];
  if (resource !== ROUTE) return null;

  if (method === 'POST' && !id) return createWrongClinic(request, env, teacher);
  if (method === 'GET' && id === 'packets') return listPacketsForTeacher(env, teacher, url);
  if (method === 'GET' && id === 'class-status') return listClassClinicStatusForTeacher(env, teacher, url);
  if (method === 'GET' && id === 'review-wrongs') return listReviewWrongCandidatesForTeacher(env, teacher, url);
  if (method === 'GET' && id === 'packet' && key) {
    const payload = await loadPacketPayload(env, key);
    if (!payload) return fail('오답 packet을 찾을 수 없습니다.', 404);
    await env.DB.prepare(`UPDATE wrong_clinic_packets SET last_opened_at = datetime('now', '+9 hours') WHERE packet_key = ?`).bind(key).run();
    return ok({ payload });
  }
  if (method === 'DELETE' && id === 'packet' && key) return deletePacketForTeacher(env, teacher, key);
  if (method === 'GET' && id === 'set' && key) {
    const payload = await loadSetPayload(env, key);
    if (!payload) return fail('오답 세트를 찾을 수 없습니다.', 404);
    return ok({ payload });
  }
  return null;
}
