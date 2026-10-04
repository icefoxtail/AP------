-- 선택 과목 정보는 성적·학습기록용이며, 출제물 열람 대상을 제한하지 않는다.
-- 반에 출제된 시험지는 모든 수신자에게 표시하고, 교사의 수동 제외만 유지한다.
DELETE FROM class_exam_assignment_exclusions
WHERE reason = 'subject_mismatch';
