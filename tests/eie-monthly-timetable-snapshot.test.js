const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const root = path.resolve(__dirname, '..');
const read = rel => fs.readFileSync(path.join(root, rel), 'utf8');

(async () => {
  const route = read('workers/wangji-eie-worker/routes/eie.js');
  const workerIndex = read('workers/wangji-eie-worker/index.js');
  const api = read('eie/js/eie-api.js');
  const router = read('eie/js/eie-router.js');
  const timetable = read('eie/js/views/eie-timetable.js');
  const css = read('eie/css/eie-timetable.css');
  const html = read('eie/index.html');
  const wrangler = read('workers/wangji-eie-worker/wrangler.jsonc');

  assert(workerIndex.includes('async scheduled'), 'EIE worker must expose scheduled handler');
  assert(workerIndex.includes('saveCurrentEieMonthTimetableArchive'), 'EIE scheduled handler must save monthly archive');
  assert(wrangler.includes('"0 0 28-31 * *"'), 'EIE wrangler must run cron on KST month-end candidate days');
  assert(route.includes('source_type: \'scheduled\''), 'EIE scheduled archive must record source_type scheduled');
  assert(route.includes('already_exists'), 'EIE scheduled archive must skip existing month/date rows');
  assert(route.includes('isEieKstMonthEnd'), 'EIE scheduled archive must guard on KST month end');
  assert(route.includes('getUTCDate()'), 'EIE month-end date must avoid UTC ISO date shifting');

  ['getTimetableMonths', 'getTimetableMonth', 'getTimetableMonthChanges'].forEach(name => {
    assert(api.includes(name), `EIE api missing ${name}`);
  });

  assert(router.includes("if (key === 'timetable-months') return 'timetable';"), 'EIE #timetable-months must redirect to existing timetable route');
  assert(!html.includes('eie-timetable-months.js'), 'EIE must not load separate monthly timetable page script');
  assert(!html.includes('eie-timetable-months.css'), 'EIE must not load separate monthly timetable page css');
  assert(css.includes('.eie-drw-item[data-eie-route="timetable-months"]'), 'EIE drawer monthly route must be hidden');

  assert(timetable.includes('monthControlsHtml'), 'EIE current timetable must render compact month controls');
  assert(timetable.includes('archiveRowsFromDetail'), 'EIE archived month data must be adapted to existing timetable row shape');
  assert(timetable.includes('renderBoard(sessions)'), 'EIE must keep reusing existing timetable board renderer');
  assert(timetable.includes('pointerdown') && timetable.includes('pointerup'), 'EIE timetable board must support swipe/drag navigation');
  assert(timetable.includes("isArchiveMode() ? '' : '<button type=\"button\" class=\"eie-secondary-button\" data-eie-edit-toggle>"), 'EIE archive mode must hide edit button');
  assert(timetable.includes('if (isArchiveMode()) return \'\';'), 'EIE archive mode must suppress edit/detail panel');

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
    assert(!timetable.includes(text), `EIE current timetable UI must not expose forbidden text: ${text}`);
  });

  const mod = await import(pathToFileURL(path.join(root, 'workers/wangji-eie-worker/routes/eie.js')).href);
  assert.strictEqual(mod.isEieKstMonthEnd(new Date('2026-06-29T15:00:00.000Z')), true, '2026-06-30 KST must be month end');
  assert.strictEqual(mod.eieKstDateString(new Date('2026-06-29T15:00:00.000Z')), '2026-06-30');
  assert.strictEqual(mod.isEieKstMonthEnd(new Date('2026-06-28T15:00:00.000Z')), false, '2026-06-29 KST must not be month end');

  console.log('EIE monthly timetable integrated navigation contract ok');
})();
