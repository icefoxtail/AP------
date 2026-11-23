// "그림이 이상해요" 신고 (2026-11-24 원장님 결정). 학생이 문제·해설 그림을 크게 보다가 사유 선택지로 알린다.
//
// 저장하는 것: 문항(uid 또는 출처 시험지 파일 + 번호), 그림 경로, 역할, 사유 코드, 화면 종류, 화면 폭 구간, 분 단위 시각, 하루 상한 계산용 키.
// 저장하지 않는 것: 학생 이름·학생 id·자유 글·IP·기기 식별자. 하루 상한 키(limit_key)는 서버 비밀값으로 만든 HMAC-SHA256(비밀값, 학생 id + 날짜)
// 앞 24자다. 서버 비밀값 없이는 학생 id로 되돌릴 수 없고, 날짜가 바뀌면 값이 달라져 같은 학생의 날짜 간 신고를 이어 붙일 수 없다.
// (학생 로그인 토큰은 학생 id + 4자리 PIN의 해시라 키 재료로 쓰지 않는다: DB만 읽어도 대입으로 되돌릴 수 있다.)
// 서버 비밀값이 런타임에 없으면 limit_key를 빈 값으로 저장하고 학생별 상한·중복 무시는 건너뛴다(전체 하루 상한은 유지, 신고는 받는다).
//
// 테이블은 추가 전용 마이그레이션(migrations/20261124_figure_reports.sql)으로 만든다. 이 모듈은 요청 중에 CREATE TABLE을 하지 않는다.
// 테이블이 아직 없으면 FEATURE_UNAVAILABLE을 돌려주고(화면은 "지금은 보낼 수 없어요"), 다른 기능에는 영향이 없다.
import { jsonResponse } from './response.js';

export const FIGURE_REPORT_TABLE = 'figure_reports';
export const FIGURE_REPORT_REASONS = ['not_visible', 'text_unreadable', 'mismatch', 'missing_parts', 'other'];
export const FIGURE_REPORT_ROLES = ['problem', 'solution', 'choice'];
export const FIGURE_REPORT_SCREENS = ['exam', 'similar', 'original', 'self_study'];
export const FIGURE_REPORT_WIDTHS = ['xs', 'sm', 'md', 'lg'];
export const FIGURE_REPORT_DAILY_PER_STUDENT = 20;
export const FIGURE_REPORT_DAILY_TOTAL = 2000;
export const FIGURE_REPORT_MAX_BODY_BYTES = 4 * 1024;
export const FIGURE_REPORT_READ_LIMIT_DEFAULT = 500;
export const FIGURE_REPORT_READ_LIMIT_MAX = 2000;

const MAX_FILE = 160;
const MAX_PATH = 300;
// 문항 uid: 저장소의 실제 UID 형식만(archive2-core.js의 UID와 같다). 시험지 파일: exams/…/….js 같은 상대 경로 형식만.
// 형식이 안 맞으면 그 칸만 비우고 신고는 받는다(학생이 글을 끼워 넣을 자리를 주지 않는다).
const QUESTION_UID = /^qid_v1_[a-f0-9]{64}$/;
const ARCHIVE_FILE = /^(?:archive\/)?(?:exams\/)?(?:[\p{L}\p{N}_\-. ()]+\/)*[\p{L}\p{N}_\-. ()]+\.js$/u;
// 그림 경로: 사이트 기준 assets/<폴더>/.../<파일>.<그림 확장자>. ".." 없음.
const FIGURE_PATH = /^assets\/(?:[\p{L}\p{N}_\-. ()]+\/)+[\p{L}\p{N}_\-. ()]+\.(?:svg|png|jpe?g|webp|gif)$/iu;
const DAY = /^\d{4}-\d{2}-\d{2}$/;

export function figureReportUnavailableBody() {
  return {
    ok: false,
    success: false,
    code: 'FEATURE_UNAVAILABLE',
    message: '그림 신고 기능이 아직 준비되지 않았습니다.',
  };
}

// 읽기 전용 존재 확인. 실패하면 없는 것으로 본다(없다는 답은 캐시하지 않아 마이그레이션 뒤 바로 켜진다).
export async function figureReportTableExists(env) {
  try {
    const row = await env.DB.prepare(
      "SELECT name FROM sqlite_master WHERE type = 'table' AND name = ? LIMIT 1",
    ).bind(FIGURE_REPORT_TABLE).first();
    return !!row?.name;
  } catch {
    return false;
  }
}

function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

// 요청 본문 한 건을 검증한다. 모르는 필드는 버리고, 허용 목록 밖의 값은 거절한다. { report } 또는 { error }.
export function normalizeFigureReport(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return { error: '요청 형식이 올바르지 않습니다.' };
  const rawUid = text(raw.question_uid);
  const rawFile = text(raw.archive_file);
  const questionUid = QUESTION_UID.test(rawUid) ? rawUid : '';
  const archiveFile = rawFile.length <= MAX_FILE && !rawFile.includes('..') && ARCHIVE_FILE.test(rawFile) ? rawFile : '';
  const figurePath = text(raw.figure_path);
  const role = text(raw.role);
  const reasonCode = text(raw.reason_code);
  const screen = text(raw.screen);
  const widthBucket = text(raw.width_bucket);
  let questionNo = 0;
  if (raw.question_no !== undefined && raw.question_no !== null && raw.question_no !== '') {
    if (typeof raw.question_no !== 'number' || !Number.isInteger(raw.question_no) || raw.question_no < 0 || raw.question_no > 1000) {
      return { error: '문항 번호가 올바르지 않습니다.' };
    }
    questionNo = raw.question_no;
  }
  if (figurePath) {
    if (figurePath.length > MAX_PATH || figurePath.includes('..') || !FIGURE_PATH.test(figurePath)) return { error: '그림 경로가 올바르지 않습니다.' };
  }
  // 문항을 가리키는 칸이 모두 비면(형식이 안 맞아 비워졌거나 처음부터 없음) 그림 경로라도 있어야 받는다.
  if (!questionUid && !(archiveFile && questionNo > 0) && !figurePath) return { error: '문항을 알 수 없습니다.' };
  if (!FIGURE_REPORT_ROLES.includes(role)) return { error: '그림 역할이 올바르지 않습니다.' };
  if (!FIGURE_REPORT_REASONS.includes(reasonCode)) return { error: '사유가 올바르지 않습니다.' };
  if (!FIGURE_REPORT_SCREENS.includes(screen)) return { error: '화면 종류가 올바르지 않습니다.' };
  if (!FIGURE_REPORT_WIDTHS.includes(widthBucket)) return { error: '화면 폭 구간이 올바르지 않습니다.' };
  return {
    report: { questionUid, archiveFile, questionNo, figurePath, role, reasonCode, screen, widthBucket },
  };
}

// 한국 날짜(YYYY-MM-DD)와 분 단위 시각(UTC, 초 없음).
export function figureReportDay(now = new Date()) {
  return new Date(now.getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

export function figureReportMinute(now = new Date()) {
  return `${now.toISOString().slice(0, 16)}Z`;
}

// 하루 상한 계산용 키의 비밀값: 운영 Worker에 이미 설정된 비밀값을 순서대로 찾는다(새 비밀값을 요구하지 않는다).
export const FIGURE_REPORT_SECRET_NAMES = ['D1_BACKUP_API_TOKEN', 'REPORT_AI_PROXY_SECRET'];

export function figureReportSecret(env) {
  for (const name of FIGURE_REPORT_SECRET_NAMES) {
    const value = typeof env?.[name] === 'string' ? env[name].trim() : '';
    if (value) return value;
  }
  return '';
}

// 하루 상한 계산용 키 = HMAC-SHA256(서버 비밀값, "figure-report:" + 학생 id + ":" + 날짜)의 앞 24자. 비밀값이 없으면 ''(키 없음).
export async function figureReportLimitKey(secret, studentId, day) {
  if (!secret || !studentId) return '';
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const mac = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`figure-report:${studentId}:${day}`));
  return Array.from(new Uint8Array(mac)).map(byte => byte.toString(16).padStart(2, '0')).join('').slice(0, 24);
}

// 저장. 결과: saved | duplicate | limit_student | limit_total. 같은 키(학생·날짜, 문항, 그림, 역할, 사유)는 무시한다.
export async function saveFigureReport(env, report, limitKey, now = new Date()) {
  const day = figureReportDay(now);
  // 키가 없으면(서버 비밀값 없음) 학생별 중복 무시·상한은 건너뛰고 전체 하루 상한만 지킨다.
  if (limitKey) {
    const dup = await env.DB.prepare(`
      SELECT 1 AS found FROM ${FIGURE_REPORT_TABLE}
      WHERE limit_key = ? AND question_uid = ? AND archive_file = ? AND question_no = ?
        AND figure_path = ? AND role = ? AND reason_code = ?
      LIMIT 1
    `).bind(limitKey, report.questionUid, report.archiveFile, report.questionNo, report.figurePath, report.role, report.reasonCode).first();
    if (dup) return { status: 'duplicate' };
  }
  const total = await env.DB.prepare(`SELECT COUNT(*) AS n FROM ${FIGURE_REPORT_TABLE} WHERE report_day = ?`).bind(day).first();
  if (Number(total?.n || 0) >= FIGURE_REPORT_DAILY_TOTAL) return { status: 'limit_total' };
  if (limitKey) {
    const mine = await env.DB.prepare(`SELECT COUNT(*) AS n FROM ${FIGURE_REPORT_TABLE} WHERE limit_key = ?`).bind(limitKey).first();
    if (Number(mine?.n || 0) >= FIGURE_REPORT_DAILY_PER_STUDENT) return { status: 'limit_student' };
  }
  const result = await env.DB.prepare(`
    INSERT OR IGNORE INTO ${FIGURE_REPORT_TABLE}
      (created_at, report_day, question_uid, archive_file, question_no, figure_path, role, reason_code, screen, width_bucket, limit_key)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    figureReportMinute(now), day, report.questionUid, report.archiveFile, report.questionNo, report.figurePath,
    report.role, report.reasonCode, report.screen, report.widthBucket, limitKey,
  ).run();
  return { status: Number(result?.meta?.changes || 0) > 0 ? 'saved' : 'duplicate' };
}

// POST (학생). verifyStudent(env, studentId, studentToken) -> { student } | { error: Response } (student-portal.js의 세션 확인).
export async function handleFigureReportPost(request, env, { verifyStudent, now = new Date() }) {
  const raw = await request.text();
  if (new TextEncoder().encode(raw).length > FIGURE_REPORT_MAX_BODY_BYTES) {
    return jsonResponse({ ok: false, success: false, message: '요청이 너무 큽니다.' }, 400);
  }
  let body = null;
  try { body = JSON.parse(raw); } catch { body = null; }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return jsonResponse({ ok: false, success: false, message: '요청 형식이 올바르지 않습니다.' }, 400);
  }
  const verified = await verifyStudent(env, String(body.student_id || '').trim(), String(body.student_token || '').trim());
  if (verified.error) return verified.error;
  const normalized = normalizeFigureReport(body);
  if (normalized.error) return jsonResponse({ ok: false, success: false, message: normalized.error }, 400);
  if (!(await figureReportTableExists(env))) return jsonResponse(figureReportUnavailableBody());
  const limitKey = await figureReportLimitKey(figureReportSecret(env), String(verified.student?.id || ''), figureReportDay(now));
  const saved = await saveFigureReport(env, normalized.report, limitKey, now);
  if (saved.status === 'limit_student' || saved.status === 'limit_total') {
    return jsonResponse({ ok: false, success: false, code: 'DAILY_LIMIT', message: '오늘은 더 보낼 수 없어요.' }, 429);
  }
  return jsonResponse({ ok: true, success: true, duplicate: saved.status === 'duplicate' });
}

function readDay(value) {
  const day = text(value);
  return DAY.test(day) ? day : '';
}

// 집계(읽기 전용): 그림 경로·문항·역할·사유별 건수와 최근 날짜. 학생 식별 정보는 응답에 없다.
export async function aggregateFigureReports(env, { from = '', to = '', reason = '', limit = FIGURE_REPORT_READ_LIMIT_DEFAULT } = {}) {
  const where = [];
  const binds = [];
  if (from) { where.push('report_day >= ?'); binds.push(from); }
  if (to) { where.push('report_day <= ?'); binds.push(to); }
  if (reason) { where.push('reason_code = ?'); binds.push(reason); }
  const cap = Math.max(1, Math.min(FIGURE_REPORT_READ_LIMIT_MAX, Number(limit) || FIGURE_REPORT_READ_LIMIT_DEFAULT));
  const rows = await env.DB.prepare(`
    SELECT figure_path, question_uid, archive_file, question_no, role, reason_code,
           COUNT(*) AS reports, MAX(report_day) AS last_day, MIN(report_day) AS first_day
    FROM ${FIGURE_REPORT_TABLE}
    ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
    GROUP BY figure_path, question_uid, archive_file, question_no, role, reason_code
    ORDER BY reports DESC, last_day DESC, figure_path ASC, question_uid ASC
    LIMIT ?
  `).bind(...binds, cap).all();
  return (rows.results || []).map(row => ({
    figure_path: row.figure_path,
    question_uid: row.question_uid,
    archive_file: row.archive_file,
    question_no: Number(row.question_no) || 0,
    role: row.role,
    reason_code: row.reason_code,
    reports: Number(row.reports) || 0,
    first_day: row.first_day,
    last_day: row.last_day,
  }));
}

const TSV_COLUMNS = ['figure_path', 'question_uid', 'archive_file', 'question_no', 'role', 'reason_code', 'reports', 'first_day', 'last_day'];

// TSV. 탭·줄바꿈은 공백으로, 수식으로 읽힐 첫 글자(= + - @)는 앞에 작은따옴표를 붙여 스프레드시트에서 계산되지 않게 한다.
export function figureReportsToTsv(rows) {
  const cell = value => {
    const flat = String(value ?? '').replace(/[\t\r\n]+/g, ' ');
    return /^[=+\-@]/.test(flat) ? `'${flat}` : flat;
  };
  return [TSV_COLUMNS.join('\t'), ...rows.map(row => TSV_COLUMNS.map(column => cell(row[column])).join('\t'))].join('\n') + '\n';
}

// GET (선생님). 로그인한 교사·관리자만. 읽기 전용.
export async function handleFigureReportsGet(request, env, teacher, url) {
  if (!teacher) return jsonResponse({ success: false, message: '로그인이 필요합니다.' }, 401);
  const role = String(teacher.role || '').toLowerCase();
  if (role !== 'admin' && role !== 'teacher') return jsonResponse({ success: false, message: '권한이 없습니다.' }, 403);
  if (!(await figureReportTableExists(env))) return jsonResponse({ ...figureReportUnavailableBody(), rows: [] });
  const reason = text(url.searchParams.get('reason'));
  if (reason && !FIGURE_REPORT_REASONS.includes(reason)) return jsonResponse({ success: false, message: 'reason 값이 올바르지 않습니다.' }, 400);
  const rows = await aggregateFigureReports(env, {
    from: readDay(url.searchParams.get('from')),
    to: readDay(url.searchParams.get('to')),
    reason,
    limit: Number(url.searchParams.get('limit')) || FIGURE_REPORT_READ_LIMIT_DEFAULT,
  });
  if (url.searchParams.get('format') === 'tsv') {
    return new Response(figureReportsToTsv(rows), {
      status: 200,
      headers: { 'Content-Type': 'text/tab-separated-values; charset=utf-8', 'Cache-Control': 'no-store' },
    });
  }
  return jsonResponse({ ok: true, success: true, rows });
}
