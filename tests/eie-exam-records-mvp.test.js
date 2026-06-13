const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const migration = fs.readFileSync(path.join(root, 'migrations/eie_exam_records_20260613.sql'), 'utf8');
const worker = fs.readFileSync(path.join(root, 'workers/wangji-eie-worker/routes/eie.js'), 'utf8');
const api = fs.readFileSync(path.join(root, 'eie/js/eie-api.js'), 'utf8');
const students = fs.readFileSync(path.join(root, 'eie/js/views/eie-students.js'), 'utf8');
const classroom = fs.readFileSync(path.join(root, 'eie/js/views/eie-classroom.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'eie/css/eie.css'), 'utf8');

for (const column of [
  'id TEXT PRIMARY KEY',
  'student_id TEXT NOT NULL',
  'timetable_cell_id TEXT',
  'exam_date TEXT NOT NULL',
  'category TEXT NOT NULL',
  'title TEXT',
  'score REAL',
  'max_score REAL',
  'level TEXT',
  'memo TEXT',
  'payload_json TEXT',
  "status TEXT DEFAULT 'active'",
  'created_by TEXT',
  'created_at TEXT DEFAULT CURRENT_TIMESTAMP',
  'updated_at TEXT DEFAULT CURRENT_TIMESTAMP'
]) {
  assert(migration.includes(column), `migration should include ${column}`);
}

for (const indexName of [
  'idx_eie_exam_records_student_date',
  'idx_eie_exam_records_cell_date',
  'idx_eie_exam_records_category',
  'idx_eie_exam_records_status'
]) {
  assert(migration.includes(indexName), `migration should include ${indexName}`);
}

assert(
  worker.includes("const EIE_EXAM_CATEGORIES = new Set(['month_end', 'vocab', 'grammar', 'material', 'reading', 'listening', 'free'])"),
  'worker should define the allowed EIE-only exam categories'
);

assert(
  /function parseEieExamPayloadJson\(value\)[\s\S]*JSON\.parse\(value\)[\s\S]*payload_json must be valid JSON/.test(worker),
  'worker should reject malformed payload_json strings'
);

assert(
  /if \(!studentId\) return \{ error: 'student_id is required' \};[\s\S]*if \(!category\) return \{ error: 'category is invalid' \};/.test(worker),
  'worker should validate required student_id and category'
);

assert(
  /WHERE \$\{where\.join\(' AND '\)\}[\s\S]*COALESCE\(status, 'active'\) = 'active'/.test(worker) ||
    worker.includes("const where = [\"COALESCE(status, 'active') = 'active'\"];"),
  'worker default query should only return active records'
);

assert(
  worker.includes("UPDATE eie_exam_records SET status = 'archived'") &&
    !worker.includes('DELETE FROM eie_exam_records'),
  'DELETE /exam-records/:id should archive instead of physically deleting'
);

for (const route of [
  "path[2] === 'exam-records' && !path[3]",
  "path[2] === 'exam-records' && path[3] === 'batch'",
  "path[2] === 'exam-records' && path[3] && !path[4]"
]) {
  assert(worker.includes(route), `worker should route ${route}`);
}

for (const fn of [
  'getExamRecords(params)',
  'async createExamRecord(payload)',
  'async updateExamRecord(id, payload)',
  'async deleteExamRecord(id)',
  'async batchExamRecords(payload)'
]) {
  assert(api.includes(fn), `EieApi should expose ${fn}`);
}

assert(
  students.includes("renderTabButton('grades', '성적표')") &&
    students.includes('function renderExamCategoryCards()') &&
    students.includes('setExamCategory: function (category)') &&
    students.includes('saveExamRecord: async function (studentId)'),
  'student detail should expose the grades tab, category cards, internal switching, and save handler'
);

for (const label of ['월말평가', '단어', '문법', '교재', 'Reading', 'Listening', '자유기록']) {
  assert(students.includes(label), `student grade tab should include ${label}`);
}

assert(
  students.includes("JSON.parse(payloadText)") &&
    students.includes("EieApi.createExamRecord(payload)") &&
    students.includes("_tab = 'grades'"),
  'student grade save should validate JSON, save through EieApi, and stay on the grades tab'
);

assert(
  classroom.includes('var _examEntryPanelOpen = false') &&
    classroom.includes("var _examEntryCategory = 'month_end'") &&
    classroom.includes("var _examEntryDate = ''"),
  'classroom should use the requested isolated exam-entry state names'
);

assert(
  classroom.includes('function renderClassExamEntryPanel(cell)') &&
    classroom.includes('EieClassroomView.saveClassExamRecords') &&
    classroom.includes('EieApi.batchExamRecords') &&
    classroom.includes('EieApi.getExamRecords'),
  'classroom should render and save batch exam records, then requery records'
);

assert(
  css.includes('.eie-app-shell .eie-exam-category-grid') &&
    css.includes('.eie-app-shell .eie-class-exam-entry-row') &&
    css.includes('@media (max-width: 640px)'),
  'CSS should add scoped EIE exam styles with mobile handling'
);

assert(
  !students.includes('exam_sessions') &&
    !classroom.includes('wrong_answers') &&
    !api.includes('exam_sessions') &&
    !worker.includes('wrong_answers') &&
    !worker.includes('exam_blueprints'),
  'EIE MVP should not copy AP exam_sessions, wrong_answers, or exam_blueprints structures'
);

console.log('EIE exam records MVP contract test passed');
