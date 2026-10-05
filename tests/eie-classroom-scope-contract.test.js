const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const fixture = require('./fixtures/eie-classroom-scope.fixture');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'eie/js/utils/eie-classroom-scope.js'), 'utf8');

const context = {
  window: {},
  console,
  Date,
  JSON,
  String,
  Array,
  Number
};
context.window = context;

vm.createContext(context);
vm.runInContext(source, context, { filename: 'eie-classroom-scope.js' });

const scope = context.EieClassroomScope;
assert(scope, 'EieClassroomScope should be exposed on window');

assert.strictEqual(scope.teacherKey(' IVY '), 'ivy');
assert.strictEqual(scope.teacherKey('I V Y'), 'ivy');
assert.strictEqual(scope.teacherKey('IVY샘'), 'ivy');

const lilyCell = fixture.cells[0];
const stacyCell = fixture.cells[1];
const malformedCell = fixture.cells[2];
const carmenCell = fixture.cells[3];

assert(
  scope.canUseCell({ ...fixture.sessions.lily, cell: lilyCell }),
  'weekday/day teacher Lily should access a non-homeroom cell'
);

assert(
  scope.canUseCell({ ...fixture.sessions.ivyVariant, cell: lilyCell }),
  'teacherKey should normalize case and whitespace for homeroom access'
);

assert(
  scope.canUseCell({ ...fixture.sessions.stacy, cell: stacyCell }),
  'raw_meta_json day_teachers should be parsed by the scope helper'
);

assert(
  scope.canUseCell({ ...fixture.sessions.carmen, cell: malformedCell }),
  'malformed raw_meta_json should not throw and should fall back to top-level fields'
);

assert(
  !scope.canUseCell({ ...fixture.sessions.zoe, cell: carmenCell }),
  'unrelated teacher should not access another teacher-only cell'
);

assert(
  scope.canUseCell({ ...fixture.sessions.owner, cell: carmenCell }) &&
    scope.canUseCell({ ...fixture.sessions.admin, cell: carmenCell }),
  'owner/admin should access every cell'
);

assert.deepStrictEqual(
  scope.cellsForTeacher({ ...fixture.sessions.lily, cells: fixture.cells }).map(cell => cell.id),
  ['cell_ivy_wed_lily'],
  'cellsForTeacher must use the shared access rule only'
);

assert.deepStrictEqual(
  scope.todayCellsForTeacher({ ...fixture.sessions.lily, cells: fixture.cells, date: fixture.WEDNESDAY }).map(cell => cell.id),
  ['cell_ivy_wed_lily'],
  'todayCellsForTeacher should accept ISO date strings and map them to Korean weekday labels'
);

assert.deepStrictEqual(
  scope.todayCellsForTeacher({ ...fixture.sessions.lily, cells: fixture.cells, date: fixture.SATURDAY }),
  [],
  'todayCellsForTeacher should return an empty array when the teacher has no classes today'
);

assert(
  scope.accessTeacherNamesForCell(lilyCell).includes('Lily') &&
    scope.displayTeacherNamesForCell(lilyCell).includes('IVY'),
  'access names are for permission, display names are for UI labels'
);

console.log('EIE classroom scope contract test passed');
