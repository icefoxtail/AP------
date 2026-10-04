-- Stage 7b: classes.textbook → class_textbooks 동기화
-- classes 테이블의 textbook 필드가 있는데 class_textbooks에 없는 반만 삽입
INSERT INTO class_textbooks (id, class_id, title, status, sort_order, start_date, created_at, updated_at)
SELECT 
    'tb_legacy_' || c.id,
    c.id,
    c.textbook,
    'active',
    0,
    DATE('now'),
    DATETIME('now'),
    DATETIME('now')
FROM classes c
WHERE 
    c.textbook IS NOT NULL 
    AND c.textbook != ''
    AND NOT EXISTS (
        SELECT 1 FROM class_textbooks ct 
        WHERE ct.class_id = c.id AND ct.status = 'active'
    );