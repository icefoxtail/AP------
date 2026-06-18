const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const worker = fs.readFileSync(path.join(root, 'workers/wangji-eie-worker/routes/eie.js'), 'utf8');

assert(
  worker.includes('if (!studentId) {') &&
    worker.includes('FROM consultations') &&
    worker.includes('LIMIT 50'),
  'EIE consultations API should support owner dashboard recent-consultation lookup without student_id'
);

assert(
  !worker.includes("if (!studentId) return jsonResponse({ success: false, error: 'student_id is required' }, 400);\n  const rows = await queryConsultations(env, studentId);"),
  'EIE owner dashboard must not trigger a 400 by calling GET /api/eie/consultations without student_id'
);

console.log('EIE dashboard consultations API regression test passed');
