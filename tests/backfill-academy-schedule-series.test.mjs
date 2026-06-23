import test from 'node:test';
import assert from 'node:assert/strict';
import { buildSeriesBackfill } from '../tools/backfill-academy-schedule-series.mjs';

function row(id, scheduleDate, overrides = {}) {
  return {
    id,
    schedule_date: scheduleDate,
    schedule_type: 'closed',
    title: ' 여름방학 ',
    start_time: '',
    end_time: '',
    memo: '전체 휴무',
    target_scope: 'global',
    student_id: null,
    series_id: id,
    is_deleted: 0,
    ...overrides
  };
}

test('연속 3일 동일 내용은 하나의 range 시리즈가 된다', () => {
  const result = buildSeriesBackfill([
    row('acs_1', '2026-07-29'),
    row('acs_2', '2026-07-30'),
    row('acs_3', '2026-07-31')
  ]);

  assert.equal(result.length, 1);
  assert.equal(result[0].seriesKind, 'range');
  assert.equal(result[0].seriesUntil, '2026-07-31');
  assert.deepEqual(result[0].ids, ['acs_1', 'acs_2', 'acs_3']);
  assert.match(result[0].seriesId, /^srs_bf_\d+_[a-z0-9]{6}$/);
});

test('중간 날짜가 빠진 단일 run들은 시리즈를 만들지 않는다', () => {
  const result = buildSeriesBackfill([
    row('acs_1', '2026-07-29'),
    row('acs_2', '2026-07-31')
  ]);
  assert.deepEqual(result, []);
});

test('시간 메모 scope student_id가 다르면 각각 분리된다', () => {
  const variants = [
    { start_time: '09:00' },
    { memo: '다른 메모' },
    { target_scope: 'teacher' },
    { target_scope: 'student', student_id: 'stu_1' }
  ];
  const rows = variants.flatMap((overrides, index) => [
    row(`acs_${index}_a`, '2026-07-29', overrides),
    row(`acs_${index}_b`, '2026-07-30', overrides)
  ]);
  const result = buildSeriesBackfill(rows);
  assert.equal(result.length, 4);
  assert.deepEqual(result.map(item => item.ids.length), [2, 2, 2, 2]);
});

test('단일 일정은 결과에 포함하지 않는다', () => {
  assert.deepEqual(buildSeriesBackfill([row('acs_1', '2026-07-29')]), []);
});

test('이미 공유 series_id를 가진 신규 시리즈 row는 제외한다', () => {
  const result = buildSeriesBackfill([
    row('acs_1', '2026-07-29', { series_id: 'srs_existing' }),
    row('acs_2', '2026-07-30', { series_id: 'srs_existing' })
  ]);
  assert.deepEqual(result, []);
});

test('삭제된 row는 제외한다', () => {
  const result = buildSeriesBackfill([
    row('acs_1', '2026-07-29'),
    row('acs_2', '2026-07-30', { is_deleted: 1 })
  ]);
  assert.deepEqual(result, []);
});

test('백필 결과를 적용한 입력은 재실행해도 빈 결과다', () => {
  const rows = [
    row('acs_1', '2026-07-29'),
    row('acs_2', '2026-07-30'),
    row('acs_3', '2026-07-31')
  ];
  const first = buildSeriesBackfill(rows);
  const seriesById = new Map(first.flatMap(item => item.ids.map(id => [id, item.seriesId])));
  const applied = rows.map(item => ({ ...item, series_id: seriesById.get(item.id) || item.series_id }));
  assert.deepEqual(buildSeriesBackfill(applied), []);
});

test('월 경계의 연속 날짜도 같은 run으로 연결한다', () => {
  const result = buildSeriesBackfill([
    row('acs_1', '2026-07-31'),
    row('acs_2', '2026-08-01')
  ]);
  assert.equal(result.length, 1);
  assert.equal(result[0].firstDate, '2026-07-31');
  assert.equal(result[0].lastDate, '2026-08-01');
});
