const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (...parts) => fs.readFileSync(path.join(root, ...parts), 'utf8');

const migration = read('apmath', 'worker-backup', 'worker', 'migrations', '20260827_class_exam_assignment_pdfs.sql');
const config = read('apmath', 'worker-backup', 'worker', 'wrangler.jsonc');
const pdfRoute = read('apmath', 'worker-backup', 'worker', 'routes', 'exam-pdf.js');
const pdfReadiness = read('archive', 'archive2-pdf-readiness.js');
const mixedEngine = read('archive', 'mixed_engine.html');
const screenEngine = read('archive', 'engine.html');
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
assert.ok(pdfRoute.includes("import outputContract from '../../../../archive/archive2-output-contract.js'"), 'PDF route should use the canonical output contract');
assert.ok(pdfRoute.includes('createOutputEnvelope'), 'PDF producer should build an envelope from server assignment snapshot');
assert.ok(pdfRoute.includes('validateOutputEnvelope'), 'PDF producer should verify the envelope contract and hash');
assert.ok(!pdfRoute.includes('archive2_output_hash: outputEnvelope?.payloadHash'), 'temporary envelope hash must not invalidate the immutable snapshot PDF cache key');
assert.ok(pdfRoute.includes('window.__AP_OUTPUT_ENVELOPE__ = envelope'), 'Worker should inject one envelope before page scripts run');
assert.ok(!pdfRoute.includes('localStorage.setItem(`mixedQuestions_'), 'PDF must not write split browser question data');
assert.ok(!pdfRoute.includes('localStorage.setItem(`mixedMeta_'), 'PDF must not write split browser metadata');
assert.ok(!pdfRoute.includes('indexedDB'), 'Worker must not use browser IndexedDB as an authority');
assert.ok(pdfRoute.includes('window.__AP_RENDER_READY__'), 'PDF generation should wait for archive rendering');
assert.ok(pdfRoute.includes('window.__AP_OUTPUT_RENDER_READY__'), 'PDF generation should verify the requested envelope rendered');
assert.ok(pdfRoute.includes('Archive2PdfReadiness.assertReady'), 'Worker must use the shared browser/PDF readiness gate');
assert.ok(pdfReadiness.includes('image.naturalWidth <= 0'), 'required image failures should block PDF sealing');
assert.ok(pdfReadiness.includes('image.decode()'), 'required images must decode before PDF sealing');
assert.ok(pdfReadiness.includes('layout overflow detected'), 'layout overflow should block PDF sealing');
assert.ok(mixedEngine.includes('archive2-pdf-readiness.js?v=20261002-output-envelope-v3'), 'mixed engine should load the shared readiness gate');
assert.ok(screenEngine.includes('archive2-pdf-readiness.js?v=20261002-output-envelope-v3'), 'screen engine should load the shared readiness gate');
assert.ok(mixedEngine.includes('exam-render-executor.js?v=20261002-output-envelope-v3'), 'mixed engine should load the current shared slot renderer');
assert.ok(screenEngine.includes('exam-render-executor.js?v=20261002-output-envelope-v3'), 'screen engine should load the current shared slot renderer');
assert.ok(pdfRoute.includes('env.EXAM_PDF_BUCKET.put'), 'generated PDF should be saved to R2');
assert.ok(pdfRoute.includes('env.EXAM_PDF_BUCKET.get'), 'downloads should stream the saved R2 object');
assert.ok(pdfRoute.includes("url.searchParams.set('class'"), 'rendered PDFs should preserve class QR identity');

assert.ok(examsRoute.includes("path[3] === 'pdf'"), 'teachers should have an assignment PDF endpoint');
assert.ok(examsRoute.includes('await canAccessClass(currentTeacher, assignment.class_id, env)'), 'teacher downloads should enforce class access');
assert.ok(examsRoute.includes('await canAccessClass(currentTeacher, d.class_id, env)'), 'issuing an exam should enforce class access');
assert.ok(examsRoute.includes('assignment = await ensureAssignmentPdf(env, assignment)'), 'issuing an archive exam should generate its PDF');
assert.ok(examsRoute.includes("assignment?.pdf_status !== 'ready'"), 'failed PDF generation should fail the issuing request');
assert.ok(examsRoute.includes('[1, 2, 4, 6, 8]'), 'issuing should preserve QPP 8');
assert.ok(pdfRoute.includes('[1, 2, 4, 6, 8]'), 'PDF rendering should preserve QPP 8');
assert.ok(studentRoute.includes("id === 'exam-pdf'"), 'students should have a PDF download endpoint');
assert.ok(studentRoute.includes('class_exam_assignment_recipients'), 'student PDF access should require assignment membership');
assert.ok(studentRoute.includes('class_exam_assignment_exclusions'), 'excluded students should not receive the PDF');

assert.ok(studentPortal.includes('PDF 다운로드'), 'student portal should show direct PDF download');
assert.ok(classroomPlanner.includes('출제본 PDF'), 'teacher exam detail should show the issued PDF');
assert.ok(classroomPlanner.includes('PDF 다시 생성'), 'teacher exam detail should support retry after a failed render');
assert.ok(archiveIndex.includes('pdf_qpp:'), 'archive assignment should persist the selected QPP');
assert.ok(assessment.includes('pdf_qpp:'), 'mixer assignment should persist the selected QPP');
assert.ok(assessment.includes('출제본 PDF를 준비하는 중입니다.'), 'mixer class issuing should show PDF progress');
assert.ok(studentPortal.includes('renderOmrPdfAction(row)'), 'student home cards should expose direct PDF download');

test('PDF cache identity stays stable across temporary output envelope requests', async () => {
  const { buildPdfIdentity } = await import('../apmath/worker-backup/worker/routes/exam-pdf.js');
  const assignment = {
    id: 'assignment-cache-identity',
    class_id: 'class-cache-identity',
    exam_title: '동일한 고정 시험지',
    archive_file: 'MIXED:immutable-snapshot-1',
    pdf_qpp: 4,
    question_count: 1,
    mixed_payload_json: JSON.stringify({
      questions: [{ questionUid: 'question-cache-identity', question: '1 + 1 = ?' }],
      meta: { questionUids: ['question-cache-identity'], qpp: 4 }
    })
  };

  const first = await buildPdfIdentity(assignment);
  const second = await buildPdfIdentity(assignment);

  assert.notEqual(first.outputEnvelope.outputRequestId, second.outputEnvelope.outputRequestId);
  assert.notEqual(first.outputEnvelope.payloadHash, second.outputEnvelope.payloadHash);
  assert.equal(first.hash, second.hash, 'temporary envelope IDs and timestamps must not bust immutable PDF cache identity');
  assert.equal(first.objectKey, second.objectKey);
});

console.log('apmath exam PDF artifact checks passed');
