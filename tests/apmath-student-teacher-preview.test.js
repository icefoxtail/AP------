const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const studentJs = fs.readFileSync(path.join(root, 'apmath', 'js', 'student.js'), 'utf8');
const portalHtml = fs.readFileSync(path.join(root, 'apmath', 'student', 'index.html'), 'utf8');
const portalRoute = fs.readFileSync(path.join(root, 'apmath', 'worker-backup', 'worker', 'routes', 'student-portal.js'), 'utf8');
const workerIndex = fs.readFileSync(path.join(root, 'apmath', 'worker-backup', 'worker', 'index.js'), 'utf8');
const studentSw = fs.readFileSync(path.join(root, 'apmath', 'student', 'sw.js'), 'utf8');
const studentVersion = JSON.parse(fs.readFileSync(path.join(root, 'apmath', 'student', 'student-version.json'), 'utf8'));
const studentManifest = JSON.parse(fs.readFileSync(path.join(root, 'apmath', 'student', 'manifest.json'), 'utf8'));

assert(
  studentJs.includes('학생 관리') &&
    studentJs.includes('학생 화면 확인 ↗') &&
    studentJs.includes('function openStudentPortalPreview(sid)') &&
    studentJs.includes("url.searchParams.set('teacher_preview', '1')") &&
    studentJs.includes("window.open(url.toString(), '_blank', 'noopener,noreferrer')"),
  'student detail should expose the teacher preview entry inside the student management card'
);

assert(
  !studentJs.includes("url.searchParams.set('pin'") &&
    !studentJs.includes("url.searchParams.set('token'"),
  'teacher preview URL must not expose a student PIN or token'
);

assert(
  portalHtml.includes('const isTeacherPreview = !!teacherPreviewStudentId;') &&
    portalHtml.includes('headers.Authorization = `Bearer ${teacherToken}`;') &&
    portalHtml.includes("if (isTeacherPreview) throw new Error('학생 화면 확인에서는 저장할 수 없습니다.');") &&
    portalHtml.includes("session = { student_id: teacherPreviewStudentId, teacher_preview: true };") &&
    portalHtml.includes("isTeacherPreview ? '' : renderWrongClinicPackets()") &&
    portalHtml.includes("isTeacherPreview ? '' : (submitted ?") &&
    !portalHtml.includes('교사 미리보기 ·'),
  'student portal should use a bannerless, read-only teacher preview session'
);

assert(
  portalRoute.includes("import { canAccessStudent, isStaffUser } from '../helpers/foundation-db.js';") &&
    portalRoute.includes('async function verifyStudentPortalReadAccess') &&
    portalRoute.includes('await canAccessStudent(teacher, studentId, env)') &&
    portalRoute.includes("accessMode: 'teacher_preview', readOnly: true") &&
    portalRoute.includes('{ requireRewonStudent: true }') &&
    portalRoute.includes("student.status !== '재원'") &&
    workerIndex.includes('const teacher = await verifyAuth(request, env);') &&
    workerIndex.includes('handleStudentPortal(request, env, teacher, path, url)'),
  'worker should authenticate teachers and enforce per-student preview access'
);

const htmlVersion = portalHtml.match(/const STUDENT_APP_VERSION = '([^']+)'/)?.[1];
const swVersion = studentSw.match(/const STUDENT_SW_VERSION = '([^']+)'/)?.[1];
assert.strictEqual(htmlVersion, swVersion, 'student portal HTML and service worker versions should match');
assert.strictEqual(htmlVersion, studentVersion.version, 'student portal HTML and version metadata should match');
assert.strictEqual(htmlVersion, studentManifest.version, 'student portal HTML and manifest versions should match');

console.log('AP Math teacher student preview contract passed');
