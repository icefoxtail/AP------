const fs = require('fs');
const path = require('path');
const assert = require('assert');
const vm = require('vm');

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
assert(
  appVersion.localeCompare('2026.06.29.2') >= 0,
  'student portal cache-bust version should include the wrong clinic hotfix or a later release'
);
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
    studentIndex.includes('function renderClinicList()') &&
    studentIndex.includes('function renderLearningHistory()') &&
    studentIndex.includes('function renderMaterialList()') &&
    studentIndex.includes('${renderStudentQuickActions()}') &&
    studentIndex.includes('const visible = materialShowAll ? list : list.slice(0, 2);'),
  'student portal should retain OMR, wrong clinic, records, and task/planner entry points with an expandable material list'
);

const home = studentIndex.slice(studentIndex.indexOf('function renderHome('), studentIndex.indexOf('function renderPreviewNotice('));
assert(home.indexOf('renderStudentQuickActions()') >= 0 && home.indexOf('renderStudentQuickActions()') < home.indexOf('renderOmrHomeSection()'), 'four primary features must precede recent learning');
assert(!home.includes('renderWrongClinicPackets()') && !home.includes('id="clinic-learning-history"'), 'home must not stack full review and history sections');
assert(home.includes('onclick="renderMore()"'), 'retained supporting features must be discoverable through more');
const quickActions = studentIndex.match(/function renderStudentQuickActions\(\) \{[\s\S]*?\n    \}/);
assert(quickActions && quickActions[0].includes('onclick="openPlanner()"') && quickActions[0].includes('onclick="renderAssignments()"'), 'both planner and assignment actions must remain available');

const materialRenderer = studentIndex.match(/function renderMaterialWrongAssignments\(\) \{[\s\S]*?\n    \}/);
const materialToggle = studentIndex.match(/function toggleMaterialAssignmentList\(\) \{[\s\S]*?\n    \}/);
assert(materialRenderer && materialToggle, 'supporting materials should expose the complete list through a toggle');
const materialElement = { outerHTML: '' };
const materialContext = {
  materialShowAll: false,
  getMaterialWrongAssignments: () => Array.from({ length: 4 }, (_, index) => ({ assignment_id: `material-${index + 1}`, assignment_title: `자료 ${index + 1}` })),
  getMaterialWrongStatus: () => ({ className: '', label: '미제출' }),
  escapeHtml: value => String(value ?? ''),
  $: id => id === 'material-wrong-section' ? materialElement : null
};
vm.createContext(materialContext);
vm.runInContext(materialRenderer[0] + '\n' + materialToggle[0], materialContext);
const materialCount = markup => (markup.match(/class="portal-assignment-row"/g) || []).length;
assert.strictEqual(materialCount(materialContext.renderMaterialWrongAssignments()), 2, 'supporting materials should start with a compact two-item preview');
assert(materialContext.renderMaterialWrongAssignments().includes('전체 4개 보기'), 'the preview should disclose a route to every loaded material');
materialContext.toggleMaterialAssignmentList();
assert.strictEqual(materialCount(materialElement.outerHTML), 4, 'expanding supporting materials must reveal every loaded item');
assert(materialElement.outerHTML.includes("openMaterialWrongOmr('material-4')"), 'items outside the preview must retain their wrong-number entry action');
materialContext.toggleMaterialAssignmentList();
assert.strictEqual(materialCount(materialElement.outerHTML), 2, 'the full list should be collapsible without mutating source data');

assert(
  studentSw.includes("navigator") === false &&
    studentSw.includes('apmath-student-portal-${STUDENT_SW_VERSION}') &&
    studentSw.includes('self.skipWaiting()') &&
    studentSw.includes('self.clients.claim()'),
  'student service worker should activate the bumped cache shell immediately'
);

console.log('student portal wrong clinic hotfix guard passed');
