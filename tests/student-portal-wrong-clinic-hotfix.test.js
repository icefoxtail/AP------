const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const studentIndex = fs.readFileSync(path.join(root, 'apmath', 'student', 'index.html'), 'utf8');
const studentSw = fs.readFileSync(path.join(root, 'apmath', 'student', 'sw.js'), 'utf8');
const manifest = fs.readFileSync(path.join(root, 'apmath', 'student', 'manifest.json'), 'utf8');
const versionJson = fs.readFileSync(path.join(root, 'apmath', 'student', 'student-version.json'), 'utf8');
const workerRoute = fs.readFileSync(path.join(root, 'apmath', 'worker-backup', 'worker', 'routes', 'student-portal.js'), 'utf8');
const workerIndex = fs.readFileSync(path.join(root, 'apmath', 'worker-backup', 'worker', 'index.js'), 'utf8');
const wrongClinicRoute = fs.readFileSync(path.join(root, 'apmath', 'worker-backup', 'worker', 'routes', 'wrong-clinics.js'), 'utf8');
const teacherStudentJs = fs.readFileSync(path.join(root, 'apmath', 'js', 'student.js'), 'utf8');

const appVersion = (studentIndex.match(/const STUDENT_APP_VERSION = '([^']+)'/) || [])[1];
const swVersion = (studentSw.match(/const STUDENT_SW_VERSION = '([^']+)'/) || [])[1];
const manifestVersion = JSON.parse(manifest).version;
const versionFileVersion = JSON.parse(versionJson).version;

assert(appVersion, 'student portal should define STUDENT_APP_VERSION');
assert.strictEqual(appVersion, '2026.06.29.2', 'student portal cache-bust version should include wrong clinic hotfix');
assert.strictEqual(swVersion, appVersion, 'student service worker version should match app version');
assert.strictEqual(manifestVersion, appVersion, 'student manifest version should match app version');
assert.strictEqual(versionFileVersion, appVersion, 'student version file should match app version');

assert(
  studentIndex.includes('student-portal/wrong-clinics?student_id=') &&
    studentIndex.includes('function openWrongClinicPacket(packetKey, mode =') &&
    studentIndex.includes('function submitWrongClinicPacket(packetKey)') &&
    studentIndex.includes('function renderWrongClinicReview(packetKey)') &&
    studentIndex.includes('function saveWrongClinicReviewWrongs()') &&
    studentIndex.includes("url.searchParams.set('packet', key)") &&
    studentIndex.includes("url.searchParams.set('mode', mode)") &&
    studentIndex.includes("openWrongClinicPacket('${packetKey}', 'ans')") &&
    studentIndex.includes("openWrongClinicPacket('${packetKey}', 'sol')"),
  'student portal should load wrong clinic packets and open answer/solution modes by packet key'
);

assert(
  workerRoute.includes("if (method === 'GET' && id === 'wrong-clinics')") &&
    workerRoute.includes('listWrongClinicPacketsForStudent(env, verified.student.id)') &&
    workerRoute.includes("path[4] === 'submit'") &&
    workerRoute.includes("path[4] === 'review-wrongs'") &&
    workerRoute.includes('submitWrongClinicPacketForStudent') &&
    workerRoute.includes('saveWrongClinicReviewWrongsForStudent'),
  'student portal API should expose wrong clinic packets and student submit/review endpoints'
);

assert(
  wrongClinicRoute.includes('review_wrong_ids_json') &&
    wrongClinicRoute.includes("id === 'review-wrongs'") &&
    wrongClinicRoute.includes('listReviewWrongCandidatesForTeacher') &&
    wrongClinicRoute.includes('ownersByQuestion') &&
    wrongClinicRoute.includes('wrong_clinic_packet_items') &&
    wrongClinicRoute.includes('submitWrongClinicPacketForStudent') &&
    wrongClinicRoute.includes('saveWrongClinicReviewWrongsForStudent') &&
    wrongClinicRoute.includes("if (method === 'DELETE' && id === 'packet' && key)") &&
    wrongClinicRoute.includes('DELETE FROM wrong_clinic_packet_items') &&
    wrongClinicRoute.includes('DELETE FROM wrong_clinic_packets'),
  'wrong clinic route should store self-review wrong ids, expose reissue candidates, and support teacher hard delete'
);

assert(
  workerIndex.includes("method === 'GET' && (path[2] === 'packet' || path[2] === 'set')") &&
    workerIndex.includes('isPublicWrongClinicRead ? null : await verifyAuth(request, env)'),
  'worker router should keep public packet/set reads but require auth for teacher packet delete'
);

assert(
  teacherStudentJs.includes('function reissueStudentWrongClinicPacket') &&
    teacherStudentJs.includes('wrong-clinics/review-wrongs?student_id=') &&
    teacherStudentJs.includes('buildStudentWrongClinicReissuePayload') &&
    teacherStudentJs.includes('onclick="reissueStudentWrongClinicPacket'),
  'teacher student detail wrong clinic tab should connect saved review wrongs to reissue action'
);

assert(
  studentIndex.includes('function renderOmrHomeSection()') &&
    studentIndex.includes('function openHomeOmrInput(assignmentId)') &&
    studentIndex.includes('function renderStudentQuickActions()') &&
    studentIndex.includes('${renderOmrHomeSection()}') &&
    studentIndex.includes('${renderWrongClinicPackets()}') &&
    studentIndex.includes('${renderStudentQuickActions()}') &&
    studentIndex.includes('portal-support-grid') &&
    studentIndex.includes('const visible = list.slice(0, 2);'),
  'student portal home should prioritize OMR, wrong clinic, compact task/planner actions, then support sections'
);

assert(
  studentSw.includes("navigator") === false &&
    studentSw.includes('apmath-student-portal-${STUDENT_SW_VERSION}') &&
    studentSw.includes('self.skipWaiting()') &&
    studentSw.includes('self.clients.claim()'),
  'student service worker should activate the bumped cache shell immediately'
);

console.log('student portal wrong clinic hotfix guard passed');
