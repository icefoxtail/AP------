const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const operations = fs.readFileSync(path.join(root, 'apmath', 'worker-backup', 'worker', 'routes', 'operations.js'), 'utf8');
const schema = fs.readFileSync(path.join(root, 'apmath', 'worker-backup', 'worker', 'schema.sql'), 'utf8');
const report = fs.readFileSync(path.join(root, 'apmath', 'js', 'report.js'), 'utf8');

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

const saveConsultationBody = report.slice(
  report.indexOf('async function reportArchiveSaveConsultationAndLink'),
  report.indexOf('function makeClassReportTextId')
);

assert(
  saveConsultationBody.includes("const archiveId = await reportArchiveSave(studentId, targetType, sourceType, 'upsert');") &&
    !saveConsultationBody.includes('currentArchiveId || await reportArchiveSave'),
  'AP Math consultation save should always persist the latest report archive before creating consultation'
);

assert(
  saveConsultationBody.indexOf("reportArchiveSave(studentId, targetType, sourceType, 'upsert')") <
    saveConsultationBody.indexOf("api.post('consultations'"),
  'AP Math archive save should happen before consultation creation'
);

assert(
  report.includes("api.patch(`student-report-archives/${encodeURIComponent(st.currentArchiveId)}`, body)") &&
    report.includes('final_message: finalMessage') &&
    saveConsultationBody.includes('const text = inputs.textarea?.value ?? document.getElementById(textareaId)?.value ?? \'\';'),
  'dirty loaded AP Math archives should PATCH final_message from the textarea before consultation content is built'
);

(async () => {
  const saveArchiveBody = report.slice(
    report.indexOf('async function reportArchiveSave'),
    report.indexOf('function reportArchiveSaveAs')
  );
  const calls = [];
  const archiveState = {
    currentArchiveId: 'archive_loaded',
    dirty: true,
    autoText: 'old generated message',
    loadedArchive: { id: 'archive_loaded', final_message: 'old final message' }
  };
  const inputs = {
    title: { value: '' },
    start: { value: '2026-06-01' },
    end: { value: '2026-06-20' },
    memo: { value: '' },
    textarea: { value: '  updated final message  ' }
  };
  const context = {
    AP_REPORT_ARCHIVE_REPORT_TYPE: 'parent_report',
    api: {
      async patch(pathValue, body) {
        calls.push({ method: 'PATCH', path: pathValue, body });
        return { success: true, id: 'archive_loaded', data: { id: 'archive_loaded', final_message: body.final_message } };
      },
      async post(pathValue, body) {
        calls.push({ method: 'POST', path: pathValue, body });
        return { success: true, id: 'consultation_created' };
      }
    },
    apmsGetStudentById() {
      return { id: 'student_1', name: 'Student One' };
    },
    document: {
      getElementById() {
        return null;
      }
    },
    encodeURIComponent,
    loadData: async () => {},
    reportArchiveBuildSnapshot(studentId, targetType, sourceType, autoText, finalMessage, options) {
      return { studentId, targetType, sourceType, autoText, final_message: finalMessage, options };
    },
    reportArchiveDefaultTitle(name, start, end) {
      return `${name} ${start} ~ ${end} default title`;
    },
    reportArchiveGetInputs() {
      return inputs;
    },
    reportArchiveLoadList: async () => {},
    reportArchivePeriodLabel(start, end) {
      return `${start} ~ ${end}`;
    },
    reportArchiveSetDirty(isDirty) {
      archiveState.dirty = !!isDirty;
    },
    reportArchiveState() {
      return archiveState;
    },
    reportArchiveText(value) {
      return String(value || '').trim();
    },
    reportArchiveToday() {
      return '2026-06-20';
    },
    state: { db: { students: [] } },
    toast: () => {}
  };
  vm.createContext(context);
  vm.runInContext(`${saveArchiveBody}\n${saveConsultationBody}`, context);

  await context.reportArchiveSaveConsultationAndLink('student_1', 'parent', 'basic', 'report-copy-text');

  assert.strictEqual(calls[0].method, 'PATCH', 'loaded dirty archive should PATCH before consultation creation');
  assert.strictEqual(calls[0].path, 'student-report-archives/archive_loaded');
  assert.strictEqual(calls[0].body.final_message, inputs.textarea.value, 'archive PATCH should store the current textarea final_message exactly');
  assert.strictEqual(calls[1].method, 'POST', 'consultation should be created after archive PATCH');
  assert.strictEqual(calls[1].path, 'consultations');
  assert(calls[1].body.content.includes('report_archive_id: archive_loaded'), 'consultation should reference the latest archive id');
  assert(calls[1].body.content.includes('Student One 2026-06-01 ~ 2026-06-20 default title'), 'consultation should use the same default title as the archive');
  assert(calls[1].body.content.includes('기간: 2026-06-01 ~ 2026-06-20'), 'consultation should include the latest period');
  assert(calls[1].body.content.endsWith(inputs.textarea.value), 'consultation content and archive final_message should match exactly');

  console.log('AP Math consultation save fallback test passed');
})().catch(error => {
  console.error(error);
  process.exit(1);
});
