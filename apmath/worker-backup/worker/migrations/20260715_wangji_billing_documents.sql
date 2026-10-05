-- =============================================================================
-- [WANGJI BILLING DOCUMENTS] - 2026-07-15 (LOOP 6)
-- 목적: 내부 납부확인서 원장.
--   D-10(사업자 표시 정보·문서 번호 규칙·공식성 범위) 미결정 → "공식 증명서"가 아닌
--   내부 확인용 문서만 발급한다. 문서에는 반드시 내부 확인용 표기가 들어간다.
--   - 발급 당시 학생명·항목·금액·수납/환불 상태를 snapshot_json으로 동결
--   - 문서 번호 unique (내부 임시 규칙 INT-YYYYMMDD-####, D-10 확정 시 규칙 교체)
--   - 재발급은 기존 문서를 superseded로 연결(replaces_document_id), 취소는 사유 필수
-- =============================================================================

CREATE TABLE IF NOT EXISTS billing_documents (
  id TEXT PRIMARY KEY,
  document_no TEXT NOT NULL,
  document_type TEXT NOT NULL DEFAULT 'payment_confirmation',
  student_id TEXT NOT NULL,
  payment_id TEXT,
  status TEXT NOT NULL DEFAULT 'issued',   -- issued | superseded | cancelled
  amount INTEGER NOT NULL DEFAULT 0,       -- 발급 시점 유효수납액(완료 수납 - 완료 환불 - 이월 유출)
  snapshot_json TEXT NOT NULL,
  replaces_document_id TEXT,
  cancelled_at TEXT,
  cancel_reason TEXT,
  issued_by TEXT,
  issued_at TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_billing_documents_no ON billing_documents(document_no);
CREATE INDEX IF NOT EXISTS idx_billing_documents_student ON billing_documents(student_id);
CREATE INDEX IF NOT EXISTS idx_billing_documents_payment ON billing_documents(payment_id);
CREATE INDEX IF NOT EXISTS idx_billing_documents_status ON billing_documents(status);
