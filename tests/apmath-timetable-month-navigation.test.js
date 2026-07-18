const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'apmath/js/timetable.js'), 'utf8');
const start = source.indexOf('function apTimetableSavedMonthKeys');
const end = source.indexOf('async function apEnsureTimetableMonthsLoaded');

assert(start >= 0 && end > start, 'month navigation helpers must remain discoverable');

function loadNavigation(archive) {
  const context = {
    getTimetableMonthArchiveState: () => archive,
    apTimetableCurrentMonthKey: () => '2026-07'
  };
  vm.createContext(context);
  vm.runInContext(source.slice(start, end), context);
  return context;
}

const juneArchive = { active: true, monthKey: '2026-06', months: [{ month_key: '2026-06' }] };
const juneNavigation = loadNavigation(juneArchive);
assert.strictEqual(juneNavigation.apFindAdjacentMonth(1), '2026-07', 'June next must return the current July timetable');
assert.strictEqual(juneNavigation.apFindAdjacentMonth(-1), '', 'June previous must stay empty when no older archive exists');

const currentJuly = { active: false, monthKey: '', months: [{ month_key: '2026-06' }] };
const julyNavigation = loadNavigation(currentJuly);
assert.strictEqual(julyNavigation.apFindAdjacentMonth(-1), '2026-06', 'Current July previous must return the June archive');
assert.strictEqual(julyNavigation.apFindAdjacentMonth(1), '', 'Current July next must stay empty when no future archive exists');

const multipleArchives = {
  active: true,
  monthKey: '2026-05',
  months: [{ month_key: '2026-06' }, { month_key: '2026-05' }]
};
const multipleNavigation = loadNavigation(multipleArchives);
assert.strictEqual(multipleNavigation.apFindAdjacentMonth(1), '2026-06');

const duplicateJune = {
  active: true,
  monthKey: '2026-06',
  months: [{ month_key: '2026-06' }, { month_key: '2026-06' }]
};
const duplicateNavigation = loadNavigation(duplicateJune);
assert.deepStrictEqual(Array.from(duplicateNavigation.apTimetableNavigableMonthKeys()), ['2026-06', '2026-07']);
assert.strictEqual(duplicateNavigation.apFindAdjacentMonth(1), '2026-07', 'Duplicate June snapshots must not trap the next arrow in June');

const missingJune = {
  active: true,
  monthKey: '2026-05',
  months: [{ month_key: '2026-05' }]
};
assert.strictEqual(loadNavigation(missingJune).apFindAdjacentMonth(1), '2026-07', 'Navigation must skip unavailable months and reach the current timetable');

console.log('AP timetable arrows navigate between archived months and the current timetable');
