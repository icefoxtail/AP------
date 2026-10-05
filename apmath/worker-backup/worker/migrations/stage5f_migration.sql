-- [5F] AP Math OS 5F 마이그레이션

-- 1. exam_sessions 확장
ALTER TABLE exam_sessions ADD COLUMN question_count INTEGER DEFAULT 0;
ALTER TABLE exam_sessions ADD COLUMN class_id TEXT;

-- 2. students PIN 추가
ALTER TABLE students ADD COLUMN student_pin TEXT;

-- 3. teachers 테이블 신설
CREATE TABLE IF NOT EXISTS teachers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  login_id TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'teacher',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. teacher_classes 매핑
CREATE TABLE IF NOT EXISTS teacher_classes (
  teacher_id TEXT NOT NULL,
  class_id TEXT NOT NULL,
  PRIMARY KEY (teacher_id, class_id)
);
CREATE INDEX IF NOT EXISTS idx_tcls_teacher ON teacher_classes(teacher_id);

-- 5. 초기 admin 및 선생님 계정 삽입
-- admin1234 hash:
-- ac9689e2272427085e35b9d3e3e8bed88cb3434828b43b86fc0596cad4c6e270
-- ap1234 hash:
-- 598a86cf3fca8f3faacab321b3f016f75084ab2edc6e126c81981502ddb19329
INSERT OR IGNORE INTO teachers (id, name, login_id, password_hash, role) VALUES
  ('t_admin', '박준성', 'admin', 'ac9689e2272427085e35b9d3e3e8bed88cb3434828b43b86fc0596cad4c6e270', 'admin'),
  ('t01', '선생님1', 'teacher1', '598a86cf3fca8f3faacab321b3f016f75084ab2edc6e126c81981502ddb19329', 'teacher'),
  ('t02', '선생님2', 'teacher2', '598a86cf3fca8f3faacab321b3f016f75084ab2edc6e126c81981502ddb19329', 'teacher'),
  ('t03', '선생님3', 'teacher3', '598a86cf3fca8f3faacab321b3f016f75084ab2edc6e126c81981502ddb19329', 'teacher');