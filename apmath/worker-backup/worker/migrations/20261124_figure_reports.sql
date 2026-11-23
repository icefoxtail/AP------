-- "그림이 이상해요" 신고 (학생이 크게 보기 화면에서 사유 선택지로 알림). 추가 전용 테이블 1개.
-- Additive only: no backfill, no destructive change, no implicit runtime DDL.
-- The Worker answers FEATURE_UNAVAILABLE for figure reports until this migration has been applied;
-- it must never CREATE this table per request. Apply by hand, e.g.:
--   wrangler d1 execute ap-math-os --remote --file apmath/worker-backup/worker/migrations/20261124_figure_reports.sql
-- 저장하지 않는 것: 학생 이름·학생 id·자유 글·IP·기기 식별자.
-- limit_key = HMAC-SHA256(서버 비밀값, 'figure-report:' + 학생 id + ':' + 날짜) 앞 24자. 서버 비밀값 없이는 학생 id로 되돌릴 수 없고 날짜마다 바뀐다.
-- 서버 비밀값이 없으면 빈 값('')으로 저장하며 학생별 중복 무시·상한은 건너뛴다(그래서 유일 인덱스는 limit_key <> '' 일 때만 건다).
-- report_day는 한국 날짜(YYYY-MM-DD), created_at은 UTC 분 단위(YYYY-MM-DDTHH:MMZ).

CREATE TABLE IF NOT EXISTS figure_reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL,
  report_day TEXT NOT NULL,
  question_uid TEXT NOT NULL DEFAULT '',
  archive_file TEXT NOT NULL DEFAULT '',
  question_no INTEGER NOT NULL DEFAULT 0,
  figure_path TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL CHECK (role IN ('problem', 'solution', 'choice')),
  reason_code TEXT NOT NULL CHECK (reason_code IN ('not_visible', 'text_unreadable', 'mismatch', 'missing_parts', 'other')),
  screen TEXT NOT NULL CHECK (screen IN ('exam', 'similar', 'original', 'self_study')),
  width_bucket TEXT NOT NULL CHECK (width_bucket IN ('xs', 'sm', 'md', 'lg')),
  limit_key TEXT NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_figure_reports_once
ON figure_reports (limit_key, question_uid, archive_file, question_no, figure_path, role, reason_code)
WHERE limit_key <> '';

CREATE INDEX IF NOT EXISTS idx_figure_reports_day
ON figure_reports (report_day);

CREATE INDEX IF NOT EXISTS idx_figure_reports_figure
ON figure_reports (figure_path, question_uid);
