const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const root = path.resolve(__dirname, '..');
const read = rel => fs.readFileSync(path.join(root, rel), 'utf8');

(async () => {
  const workerIndex = read('apmath/worker-backup/worker/index.js');
  const route = read('apmath/worker-backup/worker/routes/timetable-months.js');
  const core = read('apmath/js/core.js');
  const timetable = read('apmath/js/timetable.js');
  const monthHelper = read('apmath/js/timetable-months.js');
  const ui = read('apmath/js/ui.js');
  const wrangler = read('apmath/worker-backup/worker/wrangler.jsonc');

  assert(workerIndex.includes('async scheduled'), 'AP worker must expose scheduled handler');
  assert(workerIndex.includes('saveCurrentMonthTimetableArchive'), 'AP scheduled handler must save monthly archive');
  assert(wrangler.includes('"0 0 28-31 * *"'), 'AP wrangler must run cron on KST month-end candidate days');
  assert(route.includes('source_type: \'scheduled\''), 'AP scheduled archive must record source_type scheduled');
  assert(route.includes('already_exists'), 'AP scheduled archive must skip existing month/date rows');
  assert(route.includes('isKstMonthEnd'), 'AP scheduled archive must guard on KST month end');
  assert(route.includes('getUTCDate()'), 'AP month-end date must avoid UTC ISO date shifting');
  assert(route.includes('shouldIncludeSnapshotStudent'), 'AP monthly snapshot must filter students with the timetable visibility rule');
  assert(route.includes("'제적'"), 'AP monthly snapshot must treat legacy Jejeok as withdrawn status');
  assert(route.includes('student.updated_at'), 'AP monthly snapshot must use updated_at as legacy withdrawal date fallback');
  assert(route.includes('discharged_at: withdrawalDate(student)'), 'AP monthly snapshot must persist the withdrawal date used for visibility');

  ['getTimetableMonths', 'getTimetableMonth', 'getTimetableMonthChanges'].forEach(name => {
    assert(core.includes(name), `AP core api missing ${name}`);
  });

  assert(timetable.includes('apTimetableMonthControlsHtml'), 'AP current timetable must render compact month controls');
  assert(timetable.includes('bindApTimetableMonthNavigation'), 'AP current timetable must bind month controls');
  assert(timetable.includes('apBuildArchiveVirtualDb'), 'AP archived month data must be adapted to existing timetable DB shape');
  assert(timetable.includes('renderTimetableGrid(section)'), 'AP must keep reusing existing timetable grid renderer');
  assert(timetable.includes('pointerdown') && timetable.includes('pointerup'), 'AP timetable board must support swipe/drag navigation');
  assert(timetable.includes('isTimetableMonthArchiveMode()') && timetable.includes('return false'), 'AP archive mode must disable admin edit affordances');
  assert(ui.includes("indexOf('renderTimetableMonths') !== -1) return ''"), 'AP drawer must not expose separate monthly timetable item');
  assert(monthHelper.includes('renderTimetable()'), 'AP timetable-months helper must redirect to existing timetable screen');

  [
    '이번 달 저장',
    '덮어쓰기',
    '자동저장',
    '자동 보관',
    '스냅샷',
    '보관본',
    '저장본',
    '기준일'
  ].forEach(text => {
    assert(!timetable.includes(text), `AP current timetable UI must not expose forbidden text: ${text}`);
    assert(!monthHelper.includes(text), `AP monthly helper must not expose forbidden text: ${text}`);
  });

  const mod = await import(pathToFileURL(path.join(root, 'apmath/worker-backup/worker/routes/timetable-months.js')).href);
  assert.strictEqual(mod.isKstMonthEnd(new Date('2026-06-29T15:00:00.000Z')), true, '2026-06-30 KST must be month end');
  assert.strictEqual(mod.kstDateString(new Date('2026-06-29T15:00:00.000Z')), '2026-06-30');
  assert.strictEqual(mod.isKstMonthEnd(new Date('2026-06-28T15:00:00.000Z')), false, '2026-06-29 KST must not be month end');

  console.log('AP monthly timetable integrated navigation contract ok');
})();
