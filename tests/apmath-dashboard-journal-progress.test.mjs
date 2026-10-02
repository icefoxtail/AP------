import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = fs.readFileSync(path.join(repoRoot, 'apmath/js/dashboard.js'), 'utf8');

const helperStart = source.indexOf('function extractJournalUnitAndNote');
const helperEnd = source.indexOf('function dashboardFormatConsultationFullText', helperStart);
const buildStart = source.indexOf('function buildJournalContent');
const buildEnd = source.indexOf('async function openDailyJournalModal', buildStart);
assert.ok(helperStart >= 0 && helperEnd > helperStart);
assert.ok(buildStart >= 0 && buildEnd > buildStart);

const runtimeSource = source.slice(helperStart, helperEnd) + source.slice(buildStart, buildEnd);

function makeContext(apiGet) {
  const state = {
    db: {
      class_students: [],
      students: [],
      attendance: [],
      homework: [],
      class_daily_records: [],
      class_daily_progress: [],
      class_progress_snapshots: [
        { id: 'future', class_id: 'c1', effective_date: '2026-10-02', updated_at: '2026-10-02T00:00:00Z' }
      ],
      class_progress_items: [
        { id: 'future-i', snapshot_id: 'future', class_id: 'c1', curriculum_key: '2022', course_key: 'M2-1', canonical_path_key: 'future-path', l1_snapshot: '미래', l2_snapshot: '미래단원', sort_order: 0 }
      ],
      class_progress_taxonomy: [
        { canonicalPathKey: 'p1', curriculumKey: '2022', courseKey: 'M1-2', courseLabel: '중1 과정 · 2학기', l1: '평면도형', l2: '다각형' },
        { canonicalPathKey: 'p2', curriculumKey: '2022', courseKey: 'M2-1', courseLabel: '중2 과정 · 1학기', l1: '수와 식', l2: '유리수와 순환소수' },
        { canonicalPathKey: 'future-path', curriculumKey: '2022', courseKey: 'M2-1', courseLabel: '중2 과정 · 1학기', l1: '미래', l2: '미래단원' }
      ]
    },
    ui: { userName: '교사' }
  };
  const calls = [];
  const context = {
    state,
    api: { get: async url => { calls.push(url); return apiGet(url); } },
    console,
    dashboardGetJournalClassRows: () => [{ id: 'c1', name: '중1A' }],
    isActiveStudentStatus: () => true,
    dashboardBuildJournalMakeupSection: () => '',
    dashboardBuildJournalConsultationSection: () => '',
    encodeURIComponent,
    Set,
    Map,
    Array,
    Date,
    String,
    Number,
    Object,
    Promise
  };
  vm.createContext(context);
  vm.runInContext(runtimeSource, context, { filename: 'apmath/js/dashboard.js' });
  return { context, calls };
}

test('historical journal loads persistent progress as of the journal date without future leakage', async () => {
  const { context, calls } = makeContext(async () => ({
    success: true,
    snapshot: { id: 'past', class_id: 'c1', effective_date: '2026-09-30' },
    items: [
      { snapshot_id: 'past', class_id: 'c1', curriculum_key: '2022', course_key: 'M1-2', canonical_path_key: 'p1', l1_snapshot: '평면도형', l2_snapshot: '다각형', sort_order: 0 },
      { snapshot_id: 'past', class_id: 'c1', curriculum_key: '2022', course_key: 'M2-1', canonical_path_key: 'p2', l1_snapshot: '수와 식', l2_snapshot: '유리수와 순환소수', sort_order: 1 }
    ]
  }));

  await context.dashboardPrimeJournalProgressForDate('2026-10-01', [{ id: 'c1', name: '중1A' }]);
  const content = context.buildJournalContent('2026-10-01');

  assert.match(calls[0], /date=2026-10-01/);
  assert.match(content, /2022 개정 · 중1 과정 · 2학기: 평면도형 · 다각형/);
  assert.match(content, /2022 개정 · 중2 과정 · 1학기: 수와 식 · 유리수와 순환소수/);
  assert.doesNotMatch(content, /수업 기록 미입력/);
  assert.doesNotMatch(content, /미래단원/);
});

test('existing draft placeholder is upgraded without overwriting teacher notes', async () => {
  const { context } = makeContext(async () => ({
    success: true,
    snapshot: { id: 'past', class_id: 'c1', effective_date: '2026-09-30' },
    items: [
      { snapshot_id: 'past', class_id: 'c1', curriculum_key: '2022', course_key: 'M1-2', canonical_path_key: 'p1', l1_snapshot: '평면도형', l2_snapshot: '다각형', sort_order: 0 }
    ]
  }));
  await context.dashboardPrimeJournalProgressForDate('2026-10-01', [{ id: 'c1', name: '중1A' }]);
  const generated = context.buildJournalContent('2026-10-01');
  const draft = [
    '[AP Math 운영 일지 - 2026-10-01]',
    '작성자: 교사',
    '',
    '■ 중1A반',
    '- 출석: 6/6',
    '- 숙제: 6/6',
    '- 진도: (수업 기록 미입력)',
    '- 특이사항: 직접 적은 메모',
    ''
  ].join('\n');

  const upgraded = context.dashboardUpgradeJournalProgressPlaceholders(draft, generated);
  assert.match(upgraded, /2022 개정 · 중1 과정 · 2학기/);
  assert.match(upgraded, /- 특이사항: 직접 적은 메모/);
});

test('editable draft refreshes stale generated progress while preserving teacher notes', async () => {
  const { context } = makeContext(async () => ({
    success: true,
    snapshot: { id: 'past', class_id: 'c1', effective_date: '2026-10-01' },
    items: [
      { snapshot_id: 'past', class_id: 'c1', curriculum_key: '2022', course_key: 'M2-1', canonical_path_key: 'p2', l1_snapshot: '수와 식', l2_snapshot: '유리수와 순환소수', sort_order: 0 }
    ]
  }));
  await context.dashboardPrimeJournalProgressForDate('2026-10-01', [{ id: 'c1' }], { forceRefresh: true });
  const generated = context.buildJournalContent('2026-10-01');
  const draft = [
    '[AP Math 운영 일지 - 2026-10-01]',
    '작성자: 교사',
    '',
    '■ 중1A반',
    '- 출석: 6/6',
    '- 숙제: 6/6',
    '- 진도:',
    '  * 2022 개정 · 중1 과정 · 2학기: 오래된 단원',
    '- 특이사항: 직접 적은 메모',
    ''
  ].join('\n');

  const refreshed = context.dashboardUpgradeJournalProgressPlaceholders(draft, generated);
  assert.doesNotMatch(refreshed, /오래된 단원/);
  assert.match(refreshed, /2022 개정 · 중2 과정 · 1학기: 수와 식 · 유리수와 순환소수/);
  assert.match(refreshed, /- 특이사항: 직접 적은 메모/);
});

test('force refresh bypasses stale journal progress cache', async () => {
  let callNo = 0;
  const { context, calls } = makeContext(async () => {
    callNo += 1;
    return {
      success: true,
      snapshot: { id: 's-' + callNo, class_id: 'c1', effective_date: '2026-10-01' },
      items: [{
        snapshot_id: 's-' + callNo,
        class_id: 'c1',
        curriculum_key: '2022',
        course_key: 'M1-2',
        canonical_path_key: 'p1',
        l1_snapshot: '평면도형',
        l2_snapshot: callNo === 1 ? '다각형' : '원과 부채꼴',
        sort_order: 0
      }]
    };
  });

  await context.dashboardPrimeJournalProgressForDate('2026-10-01', [{ id: 'c1' }]);
  await context.dashboardPrimeJournalProgressForDate('2026-10-01', [{ id: 'c1' }]);
  assert.equal(calls.length, 1);
  await context.dashboardPrimeJournalProgressForDate('2026-10-01', [{ id: 'c1' }], { forceRefresh: true });
  assert.equal(calls.length, 2);
  assert.match(context.buildJournalContent('2026-10-01'), /원과 부채꼴/);
});

test('API failure never borrows a future persistent snapshot into an older journal', async () => {
  const { context } = makeContext(async () => { throw new Error('network'); });
  await context.dashboardPrimeJournalProgressForDate('2026-10-01', [{ id: 'c1', name: '중1A' }]);
  const content = context.buildJournalContent('2026-10-01');

  assert.match(content, /- 진도: \(불러오기 실패\)/);
  assert.doesNotMatch(content, /미래단원/);
});

assert.match(source, /async function openDailyJournalModal\(dateStr\)/);
assert.match(source, /await dashboardPrimeJournalProgressForDate\(targetDate, journalClasses, \{ forceRefresh: true \}\)/);
assert.match(source, /async function openTodayCloseModal\(step = 1\)/);
assert.match(source, /dashboardGetJournalClassRows\(today\)/);
assert.doesNotMatch(source, /- 진도: \(수업 기록 미입력\)/);
