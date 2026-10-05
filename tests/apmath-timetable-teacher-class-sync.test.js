const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const routeSource = fs.readFileSync(path.join(root, 'apmath/worker-backup/worker/routes/timetable-versions.js'), 'utf8');
const teacherDashboardSource = fs.readFileSync(path.join(root, 'apmath/js/dashboard-teacher.js'), 'utf8');
const foundationSource = fs.readFileSync(path.join(root, 'apmath/worker-backup/worker/helpers/foundation-db.js'), 'utf8');

function functionBody(source, name) {
  const start = source.indexOf(`async function ${name}`);
  assert(start >= 0, `${name} should exist`);
  const braceStart = source.indexOf('{', start);
  let depth = 0;
  for (let i = braceStart; i < source.length; i += 1) {
    if (source[i] === '{') depth += 1;
    if (source[i] === '}') depth -= 1;
    if (depth === 0) return source.slice(braceStart + 1, i);
  }
  throw new Error(`${name} body should close`);
}

const classBasedActivate = functionBody(routeSource, 'activateVersionClassBased');
const mappingBuilder = functionBody(routeSource, 'buildTeacherClassMappingStmts');

const classBasedDeleteIndex = classBasedActivate.indexOf('DELETE FROM teacher_classes WHERE class_id IN');
const classBasedInsertIndex = classBasedActivate.indexOf('INSERT OR IGNORE INTO teacher_classes');
assert(classBasedDeleteIndex >= 0, 'class-based activation should delete stale teacher_classes mappings');
assert(classBasedInsertIndex >= 0, 'class-based activation should insert current teacher_classes mappings');
assert(classBasedDeleteIndex < classBasedInsertIndex, 'class-based activation should delete stale mappings before inserting current mappings');
assert(classBasedActivate.includes('...sourceClassIds') && classBasedActivate.includes('...appliedClassByVersionClassId.values()'), 'class-based activation should clear both source and applied class mappings');
assert(classBasedActivate.includes('vc.teacher_name_snapshot || null'), 'class-based activation should persist version teacher_name_snapshot into active classes.teacher_name');
assert(classBasedActivate.includes('findTeacherByAlias(env, vc.teacher_name_snapshot)'), 'class-based activation should use existing teacher alias matching');

const legacyDeleteIndex = mappingBuilder.indexOf('DELETE FROM teacher_classes WHERE class_id IN');
const legacyInsertIndex = mappingBuilder.indexOf('INSERT OR IGNORE INTO teacher_classes');
assert(legacyDeleteIndex >= 0, 'legacy activation mapping builder should delete stale mappings');
assert(legacyInsertIndex >= 0, 'legacy activation mapping builder should insert current mappings');
assert(legacyDeleteIndex < legacyInsertIndex, 'legacy activation should delete stale mappings before inserting current mappings');
assert(mappingBuilder.includes('findTeacherByAlias(env, cls.teacher_name)'), 'legacy activation should reuse existing teacher alias matching');

assert(foundationSource.includes('SELECT class_id FROM teacher_classes WHERE teacher_id = ?'), 'teacher permissions should be based on teacher_classes');
assert(teacherDashboardSource.includes('isClassVisibleForCurrentTeacher'), 'teacher dashboard should filter visible classes for the current teacher');
assert(teacherDashboardSource.includes('Number(c.is_active) !== 0'), 'teacher dashboard should hide inactive classes');

console.log('apmath timetable teacher class sync test passed');
