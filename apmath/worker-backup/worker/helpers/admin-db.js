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

export async function generateStudentPin(grade, env) {
  const prefixes = { '중1': '11', '중2': '12', '중3': '13', '고1': '21', '고2': '22', '고3': '23' };
  const prefix = prefixes[grade] || '99';
  const res = await env.DB.prepare('SELECT student_pin FROM students WHERE student_pin LIKE ? ORDER BY student_pin DESC LIMIT 1').bind(prefix + '%').first();
  if (res?.student_pin) {
    const currentNum = parseInt(res.student_pin, 10);
    return String(currentNum + 1).padStart(4, '0');
  }
  return prefix + '01';
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
