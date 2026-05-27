#!/usr/bin/env node
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  buildStudentIdentityKey,
  normalizeStudentIdentityValue,
  normalizeStudentPhoneIdentityValue
} from '../apmath/worker-backup/worker/helpers/admin-db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

function usage() {
  console.log(`Usage: node tools/audit-student-duplicates.mjs [--input file.json] [--out report.json]

Reads an exported/local JSON snapshot and writes a duplicate-student audit report.
It never merges or deletes rows, and phone numbers are masked in the report.

Default input: apmath/worker-backup/worker/initial_teacher1.json
Default out:   reports/student-duplicate-audit-YYYYMMDD.json`);
}

function argValue(name, fallback = '') {
  const idx = process.argv.indexOf(name);
  return idx >= 0 ? process.argv[idx + 1] || fallback : fallback;
}

function ymd() {
  return new Date().toISOString().slice(0, 10).replace(/-/g, '');
}

function maskPhone(value) {
  const digits = normalizeStudentPhoneIdentityValue(value);
  if (!digits) return '';
  return `***-${digits.slice(-4)}`;
}

function getRows(snapshot, key) {
  const value = snapshot?.[key];
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.results)) return value.results;
  return [];
}

function classIdsForStudent(classStudents, studentId) {
  return classStudents
    .filter(row => String(row.student_id) === String(studentId))
    .map(row => String(row.class_id || '').trim())
    .filter(Boolean)
    .sort();
}

function studentSummary(student, classIds) {
  return {
    id: student.id,
    name: student.name || '',
    school: student.school_name || '',
    grade: student.grade || '',
    student_phone_masked: maskPhone(student.student_phone),
    parent_phone_masked: maskPhone(student.parent_phone),
    class_ids: classIds,
    created_at: student.created_at || '',
    status: student.status || ''
  };
}

function addGroup(groups, criterion, key, student, classIds) {
  if (!key || /\|$/.test(key)) return;
  const fullKey = `${criterion}:${key}`;
  if (!groups.has(fullKey)) groups.set(fullKey, { criterion, key, students: [] });
  groups.get(fullKey).students.push(studentSummary(student, classIds));
}

async function main() {
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    usage();
    return;
  }

  const input = path.resolve(root, argValue('--input', 'apmath/worker-backup/worker/initial_teacher1.json'));
  const out = path.resolve(root, argValue('--out', `reports/student-duplicate-audit-${ymd()}.json`));
  const snapshot = JSON.parse(await readFile(input, 'utf8'));
  const students = getRows(snapshot, 'students');
  const classStudents = getRows(snapshot, 'class_students');
  const groups = new Map();

  for (const student of students) {
    const classIds = classIdsForStudent(classStudents, student.id);
    const base = [
      normalizeStudentIdentityValue(student.name),
      normalizeStudentIdentityValue(student.school_name),
      normalizeStudentIdentityValue(student.grade)
    ];
    const studentPhone = normalizeStudentPhoneIdentityValue(student.student_phone);
    const parentPhone = normalizeStudentPhoneIdentityValue(student.parent_phone);
    addGroup(groups, 'name_school_grade_parent_phone', [...base, parentPhone].join('|'), student, classIds);
    addGroup(groups, 'name_school_grade_student_phone', [...base, studentPhone].join('|'), student, classIds);
    for (const classId of classIds) {
      addGroup(groups, 'name_school_grade_class_id', [...base, classId].join('|'), student, classIds);
    }
    const identityKey = student.student_identity_key || await buildStudentIdentityKey({
      name: student.name,
      school_name: student.school_name,
      grade: student.grade,
      student_phone: student.student_phone,
      parent_phone: student.parent_phone,
      guardian_relation: student.guardian_relation,
      student_address: student.student_address,
      vehicle_info: student.vehicle_info,
      class_id: classIds[0] || ''
    });
    addGroup(groups, 'student_identity_key', identityKey, student, classIds);
  }

  const duplicate_groups = [...groups.values()]
    .filter(group => group.students.length > 1)
    .map(group => ({ ...group, recommended_action: 'manual_review_required' }));
  const duplicateIds = new Set(duplicate_groups.flatMap(group => group.students.map(student => String(student.id))));
  const backfill_candidates = [];
  for (const student of students) {
    if (student.student_identity_key || duplicateIds.has(String(student.id))) continue;
    const classIds = classIdsForStudent(classStudents, student.id);
    const identity_key = await buildStudentIdentityKey({
      name: student.name,
      school_name: student.school_name,
      grade: student.grade,
      student_phone: student.student_phone,
      parent_phone: student.parent_phone,
      guardian_relation: student.guardian_relation,
      student_address: student.student_address,
      vehicle_info: student.vehicle_info,
      class_id: classIds[0] || ''
    });
    backfill_candidates.push({
      id: student.id,
      name: student.name || '',
      school: student.school_name || '',
      grade: student.grade || '',
      student_phone_masked: maskPhone(student.student_phone),
      parent_phone_masked: maskPhone(student.parent_phone),
      class_ids: classIds,
      identity_key,
      recommended_action: 'safe_backfill_candidate'
    });
  }
  const report = {
    generated_at: new Date().toISOString(),
    input,
    total_students: students.length,
    duplicate_group_count: duplicate_groups.length,
    duplicate_groups,
    backfill_candidate_count: backfill_candidates.length,
    backfill_candidates,
    manual_review_required: duplicate_groups
  };

  await mkdir(path.dirname(out), { recursive: true });
  await writeFile(out, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({ success: true, out, duplicate_group_count: duplicate_groups.length }, null, 2));
}

main().catch(err => {
  console.error(err?.stack || err);
  process.exit(1);
});
