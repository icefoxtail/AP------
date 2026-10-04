export async function sha256hex(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export function normalizeTeacherAlias(name) {
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

export async function findTeacherByAlias(env, teacherName) {
  const normalized = normalizeTeacherAlias(teacherName);
  if (!normalized) return null;
  const teachers = await env.DB.prepare('SELECT id, login_id, name, role FROM teachers').all();
  const matches = (teachers.results || []).filter(t => normalizeTeacherAlias(t.name) === normalized);
  return matches.find(t => t.role === 'teacher') || matches[0] || null;
}

function getStudentPinPrefix(grade) {
  const text = String(grade || '').trim();
  const digit = (text.match(/[1-3]/) || [''])[0];
  if (!digit) return '';
  if (/고|高/.test(text)) return `2${digit}`;
  if (/중|中/.test(text)) return `1${digit}`;
  return `9${digit}`;
}

export async function generateStudentPin(grade, env) {
  const normalizedPrefix = getStudentPinPrefix(grade);
  if (normalizedPrefix) {
    const row = await env.DB.prepare('SELECT student_pin FROM students WHERE student_pin LIKE ? ORDER BY student_pin DESC LIMIT 1').bind(normalizedPrefix + '%').first();
    if (row?.student_pin) return String(parseInt(row.student_pin, 10) + 1).padStart(4, '0');
    return normalizedPrefix + '01';
  }
  const prefixes = { '중1': '11', '중2': '12', '중3': '13', '고1': '21', '고2': '22', '고3': '23' };
  const prefix = prefixes[grade] || '99';
  const res = await env.DB.prepare('SELECT student_pin FROM students WHERE student_pin LIKE ? ORDER BY student_pin DESC LIMIT 1').bind(prefix + '%').first();
  if (res?.student_pin) {
    const currentNum = parseInt(res.student_pin, 10);
    return String(currentNum + 1).padStart(4, '0');
  }
  return prefix + '01';
}

export function normalizeStudentIdentityValue(value) {
  return String(value ?? '').trim().replace(/\s+/g, ' ');
}

export function normalizeStudentPhoneIdentityValue(value) {
  return String(value ?? '').replace(/\D+/g, '');
}

export function normalizeStudentIdentityPayload(payload = {}) {
  return {
    name: normalizeStudentIdentityValue(payload.name),
    school_name: normalizeStudentIdentityValue(payload.school_name ?? payload.schoolName),
    grade: normalizeStudentIdentityValue(payload.grade),
    student_phone: normalizeStudentPhoneIdentityValue(payload.student_phone ?? payload.studentPhone),
    parent_phone: normalizeStudentPhoneIdentityValue(payload.parent_phone ?? payload.parentPhone),
    guardian_relation: normalizeStudentIdentityValue(payload.guardian_relation ?? payload.guardianRelation),
    student_address: normalizeStudentIdentityValue(payload.student_address ?? payload.studentAddress),
    vehicle_info: normalizeStudentIdentityValue(payload.vehicle_info ?? payload.vehicleInfo),
    class_id: normalizeStudentIdentityValue(payload.class_id ?? payload.classId)
  };
}

export async function buildStudentIdentityKey(payload = {}) {
  const normalized = normalizeStudentIdentityPayload(payload);
  const raw = [
    normalized.name,
    normalized.school_name,
    normalized.grade,
    normalized.student_phone,
    normalized.parent_phone,
    normalized.guardian_relation,
    normalized.student_address,
    normalized.vehicle_info,
    normalized.class_id
  ].join('|');
  return sha256hex(raw);
}

export function isUniqueConstraintError(err) {
  return /unique|constraint/i.test(String(err?.message || err || ''));
}

export function isStudentIdentityUniqueError(err) {
  return isUniqueConstraintError(err) && /student_identity_key|idx_students_identity_key/i.test(String(err?.message || err || ''));
}

export function isStudentPinUniqueError(err) {
  return isUniqueConstraintError(err) && /student_pin|idx_students_pin|students\.student_pin/i.test(String(err?.message || err || ''));
}

export async function generateUniqueStudentPin(grade, env, options = {}) {
  const reservedPins = options.reservedPins instanceof Set ? options.reservedPins : new Set();
  const maxAttempts = Number.isFinite(Number(options.maxAttempts)) ? Math.max(1, Number(options.maxAttempts)) : 5;

  const firstPin = await generateStudentPin(grade, env);
  const width = Math.max(4, String(firstPin || '').length);
  let candidate = Number.parseInt(firstPin, 10);
  if (!Number.isFinite(candidate)) candidate = 1;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const pin = String(candidate + attempt).padStart(width, '0');
    if (reservedPins.has(pin)) continue;
    const existing = await env.DB.prepare('SELECT 1 FROM students WHERE student_pin = ? LIMIT 1').bind(pin).first();
    if (!existing) return pin;
  }

  throw new Error('AUTO_PIN_RETRY_EXHAUSTED');
}

export function normalizeTargetScore(value) {
  if (value === undefined || value === null || value === '') return null;
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  return Math.max(0, Math.min(100, Math.round(n)));
}

export function normalizeHighSubjects(value) {
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
