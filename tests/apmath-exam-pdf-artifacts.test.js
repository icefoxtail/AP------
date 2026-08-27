const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = (...parts) => fs.readFileSync(path.join(root, ...parts), 'utf8');

const migration = read('apmath', 'worker-backup', 'worker', 'migrations', '20260827_class_exam_assignment_pdfs.sql');
const config = read('apmath', 'worker-backup', 'worker', 'wrangler.jsonc');
const pdfRoute = read('apmath', 'worker-backup', 'worker', 'routes', 'exam-pdf.js');
const examsRoute = read('apmath', 'worker-backup', 'worker', 'routes', 'exams.js');
const studentRoute = read('apmath', 'worker-backup', 'worker', 'routes', 'student-portal.js');
const studentPortal = read('apmath', 'student', 'index.html');
const classroomPlanner = read('apmath', 'js', 'classroom-planner.js');
const archiveIndex = read('archive', 'index.html');
const assessment = read('archive', 'assessment', 'assessment-mvp.html');

for (const column of [
  'pdf_status', 'pdf_object_key', 'pdf_content_hash', 'pdf_qpp',
  'pdf_byte_size', 'pdf_page_count', 'pdf_generated_at', 'pdf_error'
]) {
  assert.ok(migration.includes(`ADD COLUMN ${column}`), `migration should add ${column}`);
}

assert.ok(config.includes('"binding": "BROWSER"'), 'Worker should bind Browser Rendering');
assert.ok(config.includes('"binding": "EXAM_PDF_BUCKET"'), 'Worker should bind the private exam PDF bucket');
assert.ok(pdfRoute.includes("import puppeteer from '@cloudflare/puppeteer'"), 'PDF route should use the Browser binding');
assert.ok(pdfRoute.includes('page.evaluateOnNewDocument'), 'MIXED payload should be injected before page scripts run');
assert.ok(pdfRoute.includes('window.__AP_RENDER_READY__'), 'PDF generation should wait for archive rendering');
assert.ok(pdfRoute.includes('env.EXAM_PDF_BUCKET.put'), 'generated PDF should be saved to R2');
assert.ok(pdfRoute.includes('env.EXAM_PDF_BUCKET.get'), 'downloads should stream the saved R2 object');
assert.ok(pdfRoute.includes("url.searchParams.set('class'"), 'rendered PDFs should preserve class QR identity');

assert.ok(examsRoute.includes("path[3] === 'pdf'"), 'teachers should have an assignment PDF endpoint');
assert.ok(examsRoute.includes('await canAccessClass(currentTeacher, assignment.class_id, env)'), 'teacher downloads should enforce class access');
assert.ok(examsRoute.includes('assignment = await ensureAssignmentPdf(env, assignment)'), 'issuing an archive exam should generate its PDF');
assert.ok(studentRoute.includes("id === 'exam-pdf'"), 'students should have a PDF download endpoint');
assert.ok(studentRoute.includes('class_exam_assignment_recipients'), 'student PDF access should require assignment membership');
assert.ok(studentRoute.includes('class_exam_assignment_exclusions'), 'excluded students should not receive the PDF');

assert.ok(studentPortal.includes('PDF 다운로드'), 'student portal should show direct PDF download');
assert.ok(classroomPlanner.includes('출제본 PDF'), 'teacher exam detail should show the issued PDF');
assert.ok(classroomPlanner.includes('PDF 다시 생성'), 'teacher exam detail should support retry after a failed render');
assert.ok(archiveIndex.includes('pdf_qpp:'), 'archive assignment should persist the selected QPP');
assert.ok(assessment.includes('pdf_qpp:'), 'mixer assignment should persist the selected QPP');

console.log('apmath exam PDF artifact checks passed');
