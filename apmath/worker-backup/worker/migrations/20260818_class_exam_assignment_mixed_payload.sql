-- A MIXED:<key> only exists in the teacher's local browser storage. Keep a
-- frozen copy with the assignment so students can later open the same paper.
ALTER TABLE class_exam_assignments ADD COLUMN mixed_payload_json TEXT DEFAULT '';
