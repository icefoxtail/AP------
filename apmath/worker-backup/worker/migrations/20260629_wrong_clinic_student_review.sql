ALTER TABLE wrong_clinic_packets ADD COLUMN is_submitted INTEGER DEFAULT 0;
ALTER TABLE wrong_clinic_packets ADD COLUMN submitted_at TEXT;
ALTER TABLE wrong_clinic_packets ADD COLUMN review_wrong_ids_json TEXT;
ALTER TABLE wrong_clinic_packets ADD COLUMN review_saved_at TEXT;
