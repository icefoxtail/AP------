-- AP Math OS: 교재별 canonical 과정 바인딩
-- 한 교재는 한 시점에 하나의 canonical 과정에 연결한다.
-- 여러 교재가 같은 과정에 연결되는 것은 허용한다.

ALTER TABLE class_textbooks ADD COLUMN progress_curriculum_key TEXT;
ALTER TABLE class_textbooks ADD COLUMN progress_level_key TEXT;
ALTER TABLE class_textbooks ADD COLUMN progress_course_key TEXT;

CREATE INDEX IF NOT EXISTS idx_class_textbooks_progress_course
  ON class_textbooks(class_id, progress_curriculum_key, progress_level_key, progress_course_key);
