-- 고2·고3은 모든 선택과목을 기본 출제 대상으로 둔다.
-- 실제로 수강하지 않는 과목만 high_subject_exclusions에 저장한다.
ALTER TABLE students ADD COLUMN high_subject_exclusions TEXT DEFAULT '[]';

UPDATE students
SET high_subjects = '["대수","미적분Ⅰ","확률과통계","미적분Ⅱ","기하"]',
    high_subject_exclusions = '[]'
WHERE grade IN ('고2', '고3');

-- 기존 high_subjects는 "수강 과목만 선택"하는 의미였으므로, 예전 자동 제외를
-- 그대로 유지하면 현재 정책에서 출제물이 계속 숨겨진다. 새 예외 선택부터 다시 적용한다.
DELETE FROM class_exam_assignment_exclusions
WHERE reason = 'subject_mismatch';
