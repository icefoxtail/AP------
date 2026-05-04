-- Stage 7a: operation_memos에 teacher_name 컬럼 추가
-- 기존 데이터는 admin 소유로 처리 (빈 문자열 = 전체 공유로 유지)
ALTER TABLE operation_memos ADD COLUMN teacher_name TEXT DEFAULT '';