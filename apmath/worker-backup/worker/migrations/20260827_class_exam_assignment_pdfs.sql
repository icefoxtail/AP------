-- Freeze an issued exam as a downloadable PDF artifact in private R2.
ALTER TABLE class_exam_assignments ADD COLUMN pdf_status TEXT DEFAULT 'pending';
ALTER TABLE class_exam_assignments ADD COLUMN pdf_object_key TEXT DEFAULT '';
ALTER TABLE class_exam_assignments ADD COLUMN pdf_content_hash TEXT DEFAULT '';
ALTER TABLE class_exam_assignments ADD COLUMN pdf_qpp INTEGER DEFAULT 4;
ALTER TABLE class_exam_assignments ADD COLUMN pdf_byte_size INTEGER DEFAULT 0;
ALTER TABLE class_exam_assignments ADD COLUMN pdf_page_count INTEGER DEFAULT 0;
ALTER TABLE class_exam_assignments ADD COLUMN pdf_generated_at TEXT;
ALTER TABLE class_exam_assignments ADD COLUMN pdf_error TEXT;

CREATE INDEX IF NOT EXISTS idx_class_exam_assignments_pdf_status
ON class_exam_assignments(pdf_status);

CREATE INDEX IF NOT EXISTS idx_class_exam_assignments_pdf_hash
ON class_exam_assignments(pdf_content_hash);
