const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const operations = fs.readFileSync(path.join(root, 'apmath', 'worker-backup', 'worker', 'routes', 'operations.js'), 'utf8');
const schema = fs.readFileSync(path.join(root, 'apmath', 'worker-backup', 'worker', 'schema.sql'), 'utf8');

assert(
  operations.includes('findConsultationDuplicate') &&
    operations.includes('insertConsultation') &&
    operations.includes('isMissingClientRequestColumn'),
  'consultation save route should keep client_request_id compatibility helpers'
);

assert(
  operations.includes('SELECT id FROM consultations WHERE client_request_id = ?') &&
    operations.includes('INSERT INTO consultations (id, student_id, date, type, content, next_action, client_request_id)'),
  'consultation save route should use client_request_id when the column exists'
);

assert(
  operations.includes('INSERT INTO consultations (id, student_id, date, type, content, next_action) VALUES (?, ?, ?, ?, ?, ?)'),
  'consultation save route should fall back for databases without client_request_id'
);

assert(
  schema.includes('client_request_id TEXT') &&
    schema.includes('idx_consultations_client_req'),
  'consultation schema should include client_request_id for fresh databases'
);

console.log('AP Math consultation save fallback test passed');
