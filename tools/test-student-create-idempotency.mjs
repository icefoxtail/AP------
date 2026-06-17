import assert from 'node:assert/strict';
import fs from 'node:fs';
import {
  buildStudentIdentityKey,
  generateUniqueStudentPin,
  normalizeStudentIdentityPayload,
  normalizeStudentIdentityValue,
  normalizeStudentPhoneIdentityValue
} from '../apmath/worker-backup/worker/helpers/admin-db.js';

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

const adminDb = read('apmath/worker-backup/worker/helpers/admin-db.js');
const studentsRoute = read('apmath/worker-backup/worker/routes/students.js');
const schema = read('apmath/worker-backup/worker/schema.sql');
const identityMigration = read('apmath/worker-backup/worker/migrations/20260527_student_identity_key.sql');
const profileColumnsMigration = read('apmath/worker-backup/worker/migrations/20260617_students_profile_columns.sql');

for (const exported of [
  'normalizeStudentIdentityPayload',
  'normalizeStudentIdentityValue',
  'normalizeStudentPhoneIdentityValue',
  'buildStudentIdentityKey',
  'generateUniqueStudentPin'
]) {
  assert(
    adminDb.includes(`export function ${exported}`) || adminDb.includes(`export async function ${exported}`),
    `${exported} should be exported from admin-db.js`
  );
}

assert(studentsRoute.includes('student_identity_key'), 'POST /api/students should persist student_identity_key');
assert(studentsRoute.includes('buildStudentIdentityKey'), 'POST /api/students should build a stable identity key');
assert(studentsRoute.includes('generateUniqueStudentPin'), 'auto PIN creation should use retry-capable helper');
assert(studentsRoute.includes('findFallbackDuplicateStudent'), 'POST /api/students should fallback-match existing NULL identity rows');
assert(studentsRoute.includes('backfillStudentIdentityKey'), 'fallback duplicate path should safely backfill identity key when possible');
assert(studentsRoute.includes('duplicate_ignored: true'), 'duplicate creates should return duplicate_ignored true');
assert(studentsRoute.includes('isStudentIdentityUniqueError'), 'identity unique errors should be distinguished from PIN errors');
assert(!studentsRoute.includes('const duplicateCutoff'), 'unreachable legacy duplicate-window code should be removed');
assert(!studentsRoute.includes('const pin = d.studentPin || await generateStudentPin'), 'unreachable legacy insert code should be removed');

const insertSqlStart = studentsRoute.indexOf('INSERT INTO students (');
assert(insertSqlStart >= 0, 'student insert SQL should exist');
const insertSqlEnd = studentsRoute.indexOf('`).bind', insertSqlStart);
assert(insertSqlEnd > insertSqlStart, 'student insert SQL bind block should exist');
const insertSql = studentsRoute.slice(insertSqlStart, insertSqlEnd);
assert.equal((insertSql.match(/\?/g) || []).length, 15, 'student insert SQL should have one placeholder per bound value before timestamps');

assert(schema.includes('student_identity_key TEXT'), 'schema should include student_identity_key');
assert(schema.includes('onboarding_started_at TEXT'), 'schema should include onboarding_started_at');
assert(schema.includes("high_subjects TEXT DEFAULT '[]'"), 'schema should include high_subjects');
assert(schema.includes('idx_students_identity_key'), 'schema should include a student identity unique index');
assert(identityMigration.includes('student_identity_key TEXT'), 'student identity migration should add student_identity_key');
assert(identityMigration.includes('idx_students_identity_key'), 'student identity migration should create the identity unique index');
assert(profileColumnsMigration.includes('onboarding_started_at TEXT'), 'profile migration should add onboarding_started_at');
assert(profileColumnsMigration.includes("high_subjects TEXT DEFAULT '[]'"), 'profile migration should add high_subjects');

assert.equal(normalizeStudentIdentityValue('  A   B  '), 'A B', 'identity text normalization should collapse whitespace');
assert.equal(normalizeStudentPhoneIdentityValue('010-1234 5678'), '01012345678', 'phone normalization should keep only digits');
assert.deepEqual(
  normalizeStudentIdentityPayload({
    name: '  Lim   Juhyun  ',
    school_name: 'AP  Middle',
    grade: ' G1 ',
    student_phone: '010-1111-2222',
    parent_phone: '010 3333 4444',
    guardian_relation: ' mother ',
    student_address: 'Seoul  Gangnam',
    vehicle_info: ' van 1 ',
    class_id: ' c1 '
  }),
  {
    name: 'Lim Juhyun',
    school_name: 'AP Middle',
    grade: 'G1',
    student_phone: '01011112222',
    parent_phone: '01033334444',
    guardian_relation: 'mother',
    student_address: 'Seoul Gangnam',
    vehicle_info: 'van 1',
    class_id: 'c1'
  },
  'normalizeStudentIdentityPayload should normalize every identity field'
);

const keyA = await buildStudentIdentityKey({
  name: ' Lim   Juhyun ',
  school_name: 'AP  Middle',
  grade: 'G1',
  student_phone: '010-1111-2222',
  parent_phone: '010 3333 4444',
  guardian_relation: ' mother ',
  student_address: 'Seoul  Gangnam',
  vehicle_info: ' van 1 ',
  class_id: ' c1 '
});
const keyB = await buildStudentIdentityKey({
  name: 'Lim Juhyun',
  school_name: 'AP Middle',
  grade: 'G1',
  student_phone: '01011112222',
  parent_phone: '01033334444',
  guardian_relation: 'mother',
  student_address: 'Seoul Gangnam',
  vehicle_info: 'van 1',
  class_id: 'c1'
});
assert.equal(keyA, keyB, 'identity key should be stable across whitespace and phone punctuation');

const keyC = await buildStudentIdentityKey({
  name: 'Lim Juhyun',
  school_name: 'AP Middle',
  grade: 'G1',
  student_phone: '01011112222',
  parent_phone: '01033334444',
  guardian_relation: 'mother',
  student_address: 'Seoul Gangnam',
  vehicle_info: 'van 1',
  class_id: 'c2'
});
assert.notEqual(keyA, keyC, 'identity key should change when class_id changes');

const queriedPins = [];
const fakeEnv = {
  DB: {
    prepare(sql) {
      return {
        bind(pin) {
          if (!String(sql).includes('LIKE')) queriedPins.push(pin);
          return {
            async first() {
              if (String(sql).includes('LIKE')) return { student_pin: '1000' };
              return pin === '1001' ? { exists: 1 } : null;
            }
          };
        }
      };
    }
  }
};
const pin = await generateUniqueStudentPin('G1', fakeEnv, { reservedPins: new Set(['1001']), maxAttempts: 3 });
assert.equal(pin, '1002', 'generateUniqueStudentPin should skip reserved and existing pins');
assert(queriedPins.includes('1002'), 'generateUniqueStudentPin should probe the retry candidate');

console.log('Student create idempotency contract passed');
