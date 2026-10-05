-- [5G-2] 학생 PIN 중복 방지 UNIQUE INDEX 추가
-- 주의: student_pin 컬럼이 이미 존재해야 실행 가능합니다.
CREATE UNIQUE INDEX IF NOT EXISTS idx_students_student_pin 
ON students(student_pin) 
WHERE student_pin IS NOT NULL AND student_pin != '';