const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'apmath/js/timetable.js'), 'utf8');
const start = source.indexOf('function normalizeTimetableSlotDay');
const end = source.indexOf('function getTimetableFallbackPlacementRows');

assert(start >= 0 && end > start, 'timetable period helpers must remain discoverable');

function loadHelpers(archiveMode) {
  const context = { isTimetableMonthArchiveMode: () => archiveMode };
  vm.createContext(context);
  vm.runInContext(source.slice(start, end), context);
  return context;
}

const context = loadHelpers(true);

const period = context.getTimetableMiddlePeriodFromSlot;
const group = context.getTimetableMiddleGroupFromSlotDays;

assert.strictEqual(period({ start_time: '16:50', end_time: '18:20' }), '1교시');
assert.strictEqual(period({ start_time: '18:30', end_time: '20:00' }), '2교시');
assert.strictEqual(period({ start_time: '20:00', end_time: '21:30' }), '3교시');

assert.strictEqual(period({ start_time: '16:40', end_time: '18:10', period_label: '1교시 4:40~6:10' }), '1교시');
assert.strictEqual(period({ start_time: '18:20', end_time: '19:50', period_label: '2교시 6:20~7:50' }), '2교시');
assert.strictEqual(period({ start_time: '19:50', end_time: '21:20', period_label: '3교시 7:50~9:20' }), '3교시');
assert.strictEqual(period({ start_time: '16:40', end_time: '18:10' }), '1교시');
assert.strictEqual(period({ start_time: '18:20', end_time: '19:50' }), '2교시');
assert.strictEqual(period({ start_time: '19:50', end_time: '21:20' }), '3교시');

const livePeriod = loadHelpers(false).getTimetableMiddlePeriodFromSlot;
assert.strictEqual(livePeriod({ start_time: '16:40', end_time: '18:10', period_label: '1교시 4:40~6:10' }), '');
assert.strictEqual(livePeriod({ start_time: '18:20', end_time: '19:50', period_label: '2교시 6:20~7:50' }), '');
assert.strictEqual(livePeriod({ start_time: '19:50', end_time: '21:20', period_label: '3교시 7:50~9:20' }), '');

assert.strictEqual(group(['mon', 'wed', 'fri']), 'mwf');
assert.strictEqual(group(['tue', 'thu', 'fri']), 'ttf');

assert(
  source.includes('? _ttFirstNonEmptyArray(db.class_time_slots, mainDb.class_time_slots, allDb.class_time_slots)'),
  'archive rendering must prefer archived slot rows over current live slot rows'
);
assert(
  source.includes("period_label: cell.period_label || ''"),
  'archive virtual slots must retain the saved period label'
);

console.log('AP archived timetable maps every teacher onto the shared period rows');
