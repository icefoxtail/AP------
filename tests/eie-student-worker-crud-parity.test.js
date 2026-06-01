const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'workers/wangji-eie-worker/routes/eie.js'), 'utf8');

assert(
  source.includes('const DIRECT_STUDENT_STATUSES'),
  'current EIE worker should define a direct student status allow-list for student CRUD'
);

assert(
  /async function handlePatchStudent\(request, env, teacher, studentId\)[\s\S]*const existing = await getStudentById\(env, studentId\);[\s\S]*if \(!existing\)/.test(source),
  'PATCH /students/:id should verify the student exists before mutating fields or contacts'
);

assert(
  /const phoneRaw = safeText\(body\.student_phone \|\| body\.phone \|\| body\.phone_raw\);[\s\S]*const normalizedPhone = phoneRaw \? normalizePhone\(phoneRaw\) : '';/.test(source),
  'student PATCH should normalize student phone without overwriting it with parent_phone'
);

assert(
  source.includes("'parent_phone'") && source.includes("'guardian_relation'") && source.includes("'student_address'") && source.includes("'vehicle_info'") && source.includes("'student_pin'") && source.includes("'student_type'"),
  'student CRUD should persist AP-style student info fields in raw_meta_json'
);

assert(
  /const student = await getStudentWithContacts\(env, studentId\);[\s\S]*return jsonResponse\(\{ success: true, student, data: student, contacts: student\?\.contacts \|\| \[\], warnings/.test(source),
  'student PATCH should return the refreshed student row with contacts for frontend state merge'
);

assert(
  /async function handlePatchStudentStatus\(request, env, teacher, studentId\)[\s\S]*const existing = await getStudentById\(env, studentId\);[\s\S]*const student = await getStudentWithContacts\(env, studentId\);[\s\S]*return jsonResponse\(\{ success: true, student, data: student, contacts: student\?\.contacts \|\| \[\], warnings: \[\] \}\);/.test(source),
  'student status PATCH should validate existence and return refreshed student data'
);

console.log('EIE student worker CRUD parity test passed');
