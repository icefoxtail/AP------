ALTER TABLE consultations ADD COLUMN client_request_id TEXT;
CREATE INDEX IF NOT EXISTS idx_consultations_client_req ON consultations (client_request_id) WHERE client_request_id IS NOT NULL;
