const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

const apSql = read('apmath/worker-backup/worker/migrations/20260618_ap_timetable_month_snapshots.sql');
const eieSql = read('workers/wangji-eie-worker/migrations/20260618_eie_timetable_month_snapshots.sql');

[
  'ap_timetable_month_snapshots',
  'ap_timetable_month_snapshot_cells',
  'ap_timetable_month_snapshot_students',
  'month_key',
  'snapshot_date',
  'snapshot_id',
  'source_student_id'
].forEach(token => assert(apSql.includes(token), `AP migration missing ${token}`));

[
  'eie_timetable_month_snapshots',
  'eie_timetable_month_snapshot_cells',
  'eie_timetable_month_snapshot_students',
  'month_key',
  'snapshot_date',
  'snapshot_id',
  'source_student_id'
].forEach(token => assert(eieSql.includes(token), `EIE migration missing ${token}`));

assert(apSql.includes('UNIQUE(month_key, snapshot_date)'), 'AP migration must keep month/date uniqueness');
assert(eieSql.includes('UNIQUE(month_key, snapshot_date)'), 'EIE migration must keep month/date uniqueness');

console.log('timetable monthly snapshot schema contract ok');
