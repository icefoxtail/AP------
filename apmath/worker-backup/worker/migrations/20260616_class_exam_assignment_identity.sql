-- Canonicalize class exam assignment identity.
-- Archive-backed exams are identified by class_id + exam_date + archive_file.
-- Manual exams without archive_file keep the legacy class_id + exam_title + exam_date identity.

UPDATE class_exam_assignments
SET archive_file = ''
WHERE archive_file IS NULL;

UPDATE class_exam_assignments
SET archive_file = TRIM(archive_file)
WHERE archive_file IS NOT NULL;

DELETE FROM class_exam_assignments
WHERE id IN (
  SELECT id
  FROM (
    SELECT
      id,
      ROW_NUMBER() OVER (
        PARTITION BY class_id, exam_date, archive_file
        ORDER BY COALESCE(updated_at, '') DESC, COALESCE(created_at, '') DESC, id DESC
      ) AS rn
    FROM class_exam_assignments
    WHERE TRIM(COALESCE(archive_file, '')) != ''
  )
  WHERE rn > 1
);

DELETE FROM class_exam_assignments
WHERE id IN (
  SELECT id
  FROM (
    SELECT
      id,
      ROW_NUMBER() OVER (
        PARTITION BY class_id, exam_title, exam_date
        ORDER BY COALESCE(updated_at, '') DESC, COALESCE(created_at, '') DESC, id DESC
      ) AS rn
    FROM class_exam_assignments
    WHERE TRIM(COALESCE(archive_file, '')) = ''
  )
  WHERE rn > 1
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_class_exam_assignments_archive_identity
ON class_exam_assignments (class_id, exam_date, archive_file)
WHERE TRIM(COALESCE(archive_file, '')) != '';

CREATE UNIQUE INDEX IF NOT EXISTS uq_class_exam_assignments_manual_identity
ON class_exam_assignments (class_id, exam_title, exam_date)
WHERE TRIM(COALESCE(archive_file, '')) = '';
