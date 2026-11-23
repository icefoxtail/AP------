// "그림이 이상해요" 신고 (2026-11-24 원장님 결정). 학생이 문제·해설 그림을 크게 보다가 사유 선택지로 알린다.
//
// 저장하는 것: 문항(uid 또는 출처 시험지 파일 + 번호), 그림 경로, 역할, 사유 코드, 화면 종류, 화면 폭 구간, 분 단위 시각, 하루 상한 계산용 키.
// 저장하지 않는 것: 학생 이름·학생 id·자유 글·IP·기기 식별자. 하루 상한 키(limit_key)는 학생 로그인 토큰과 날짜를 섞은 해시라서
// 날짜가 바뀌면 값이 달라지고 학생 id로 되돌릴 수 없다(같은 학생의 날짜 간 신고를 이어 붙일 수 없다).
//
// 테이블은 추가 전용 마이그레이션(migrations/20261124_figure_reports.sql)으로 만든다. 이 모듈은 요청 중에 CREATE TABLE을 하지 않는다.
// 테이블이 아직 없으면 FEATURE_UNAVAILABLE을 돌려주고(화면은 "지금은 보낼 수 없어요"), 다른 기능에는 영향이 없다.
import { jsonResponse } from './response.js';
import { sha256hex } from './admin-db.js';

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

const MAX_UID = 200;
const MAX_FILE = 300;
const MAX_PATH = 300;
// 문항 uid·시험지 파일: 글자·숫자와 경로에 쓰는 기호만. 제어문자와 따옴표·꺾쇠는 받지 않는다.
const SAFE_TEXT = /^[\p{L}\p{N} _\-.:/#()[\]@]+$/u;
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
  const questionUid = text(raw.question_uid);
  const archiveFile = text(raw.archive_file);
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
  if (questionUid.length > MAX_UID || (questionUid && !SAFE_TEXT.test(questionUid))) return { error: '문항 식별자가 올바르지 않습니다.' };
  if (archiveFile.length > MAX_FILE || (archiveFile && !SAFE_TEXT.test(archiveFile))) return { error: '시험지 파일이 올바르지 않습니다.' };
  if (!questionUid && !(archiveFile && questionNo > 0)) return { error: '문항을 알 수 없습니다.' };
  if (figurePath) {
    if (figurePath.length > MAX_PATH || figurePath.includes('..') || !FIGURE_PATH.test(figurePath)) return { error: '그림 경로가 올바르지 않습니다.' };
  }
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

// 하루 상한 계산용 키: 학생 로그인 토큰 + 날짜의 해시 앞 24자. 학생 id를 담지 않고 날짜마다 바뀐다.
export async function figureReportLimitKey(studentToken, day) {
  return (await sha256hex(`${studentToken}:figure-report:${day}`)).slice(0, 24);
}

// 저장. 결과: saved | duplicate | limit_student | limit_total. 같은 키(학생·날짜, 문항, 그림, 역할, 사유)는 무시한다.
export async function saveFigureReport(env, report, limitKey, now = new Date()) {
  const day = figureReportDay(now);
  const dup = await env.DB.prepare(`
    SELECT 1 AS found FROM ${FIGURE_REPORT_TABLE}
    WHERE limit_key = ? AND question_uid = ? AND archive_file = ? AND question_no = ?
      AND figure_path = ? AND role = ? AND reason_code = ?
    LIMIT 1
  `).bind(limitKey, report.questionUid, report.archiveFile, report.questionNo, report.figurePath, report.role, report.reasonCode).first();
  if (dup) return { status: 'duplicate' };
  const total = await env.DB.prepare(`SELECT COUNT(*) AS n FROM ${FIGURE_REPORT_TABLE} WHERE report_day = ?`).bind(day).first();
  if (Number(total?.n || 0) >= FIGURE_REPORT_DAILY_TOTAL) return { status: 'limit_total' };
  const mine = await env.DB.prepare(`SELECT COUNT(*) AS n FROM ${FIGURE_REPORT_TABLE} WHERE limit_key = ?`).bind(limitKey).first();
  if (Number(mine?.n || 0) >= FIGURE_REPORT_DAILY_PER_STUDENT) return { status: 'limit_student' };
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
  const studentToken = String(body.student_token || '').trim();
  const verified = await verifyStudent(env, String(body.student_id || '').trim(), studentToken);
  if (verified.error) return verified.error;
  const normalized = normalizeFigureReport(body);
  if (normalized.error) return jsonResponse({ ok: false, success: false, message: normalized.error }, 400);
  if (!(await figureReportTableExists(env))) return jsonResponse(figureReportUnavailableBody());
  const limitKey = await figureReportLimitKey(studentToken, figureReportDay(now));
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
