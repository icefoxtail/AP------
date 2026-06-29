const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const studentIndex = fs.readFileSync(path.join(root, 'apmath', 'student', 'index.html'), 'utf8');
const studentSw = fs.readFileSync(path.join(root, 'apmath', 'student', 'sw.js'), 'utf8');
const manifest = fs.readFileSync(path.join(root, 'apmath', 'student', 'manifest.json'), 'utf8');
const versionJson = fs.readFileSync(path.join(root, 'apmath', 'student', 'student-version.json'), 'utf8');
const workerRoute = fs.readFileSync(path.join(root, 'apmath', 'worker-backup', 'worker', 'routes', 'student-portal.js'), 'utf8');

const appVersion = (studentIndex.match(/const STUDENT_APP_VERSION = '([^']+)'/) || [])[1];
const swVersion = (studentSw.match(/const STUDENT_SW_VERSION = '([^']+)'/) || [])[1];
const manifestVersion = JSON.parse(manifest).version;
const versionFileVersion = JSON.parse(versionJson).version;

assert(appVersion, 'student portal should define STUDENT_APP_VERSION');
assert.strictEqual(appVersion, '2026.06.29.1', 'student portal cache-bust version should include wrong clinic hotfix');
assert.strictEqual(swVersion, appVersion, 'student service worker version should match app version');
assert.strictEqual(manifestVersion, appVersion, 'student manifest version should match app version');
assert.strictEqual(versionFileVersion, appVersion, 'student version file should match app version');

assert(
  studentIndex.includes('student-portal/wrong-clinics?student_id=') &&
    studentIndex.includes('function openWrongClinicPacket(packetKey, mode =') &&
    studentIndex.includes("url.searchParams.set('packet', key)") &&
    studentIndex.includes("url.searchParams.set('mode', mode)") &&
    studentIndex.includes("openWrongClinicPacket('${packetKey}', 'ans')") &&
    studentIndex.includes("openWrongClinicPacket('${packetKey}', 'sol')"),
  'student portal should load wrong clinic packets and open answer/solution modes by packet key'
);

assert(
  workerRoute.includes("if (method === 'GET' && id === 'wrong-clinics')") &&
    workerRoute.includes('listWrongClinicPacketsForStudent(env, verified.student.id)'),
  'student portal API should expose wrong clinic packets for the logged-in student'
);

assert(
  studentSw.includes("navigator") === false &&
    studentSw.includes('apmath-student-portal-${STUDENT_SW_VERSION}') &&
    studentSw.includes('self.skipWaiting()') &&
    studentSw.includes('self.clients.claim()'),
  'student service worker should activate the bumped cache shell immediately'
);

console.log('student portal wrong clinic hotfix guard passed');
