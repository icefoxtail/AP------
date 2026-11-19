const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const timetable = fs.readFileSync(path.join(root, 'apmath/js/timetable.js'), 'utf8');

const calls = [];
const toasts = [];
let nextDetail = null;
const api = {
  async get(resource) { calls.push(['GET', resource]); return nextDetail; },
  async post(resource, body) { calls.push(['POST', resource, body]); return nextPost; }
};
let nextPost = {};

const context = {
  state: {
    auth: { role: 'admin', name: '원장' },
    db: {},
    ui: { timetableMonthArchive: { active: false, virtualDb: null } }
  },
  window: {},
  document: { getElementById: () => null, querySelector: () => null },
  api,
  toast: (message, type) => toasts.push([message, type]),
  apEscapeHtml: text => String(text == null ? '' : text).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])),
  setTimeout: () => 0,
  console, Set, Map, Array, Date, String, Number, Object, Math, JSON, Promise
};
vm.runInNewContext(timetable, context);
let rendered = 0;
context.renderTimetable = () => { rendered += 1; };

const detail = (extra = {}) => ({
  success: true,
  timetable_version: { id: 'v1', status: 'draft', title: '개편 초안', school_year: 2031 },
  timetable_version_classes: [
    { id: 'vc1', name_snapshot: '중2 A반', next_grade: '중2', status: 'draft', teacher_name_snapshot: '박준성' },
    { id: 'vc3', name_snapshot: '중2 B반', next_grade: '중2', status: 'draft', teacher_name_snapshot: '정겨운' },
    { id: 'vc2', name_snapshot: '삭제된 반', next_grade: '중2', status: 'removed' }
  ],
  timetable_version_slots: [],
  timetable_version_student_assignments: [{ student_id: 's1', version_class_id: 'vc1', class_id: 'vc1', student_name_snapshot: '가나' }],
  timetable_version_unassigned_students: [],
  timetable_version_removed_classes: [{ id: 'vc2', name_snapshot: '삭제된 반' }],
  roster_sync: { added: [], removed: [], moved: [], changed: 0 },
  roster_multi_class: [],
  ...extra
});

(async () => {
  // 열 때 자동 갱신 결과가 알림으로 쌓이고, 닫기 전까지 유지된다
  nextDetail = detail({
    timetable_version_unassigned_students: [{ student_id: 's9', student_name_snapshot: '신입', class_id: '__unassigned__', version_class_id: '__unassigned__', excluded_reason: 'unassigned' }],
    roster_sync: {
      added: [{ student_id: 's9', student_name: '신입', class_name: null, unassigned: true, ops_class_names: ['중1 신규반'] }, { student_id: 's7', student_name: '카', class_name: '중2 A반', unassigned: false }],
      removed: [{ student_id: 's2', student_name: '퇴원생', class_name: '중2 A반' }],
      moved: [],
      changed: 3
    },
    roster_multi_class: [{ student_id: 's6', student_name: '바', class_names: ['A반', 'B반'] }]
  });
  await context.openTimetableDraftVersion('v1');
  const ui = context.state.ui;
  assert.equal(ui.timetableViewMode, 'draft');
  assert.equal(ui.selectedTimetableVersionUnassigned.length, 1);
  assert.equal(ui.selectedTimetableVersionRemovedClasses.length, 1);
  assert.equal(context.isTimetableDraftMode(), true);

  // 삭제한(removed) 반은 반 목록에 나오지 않는다
  assert.deepEqual(Array.from(context.getTimetableClassList(), c => c.id), ['vc1', 'vc3']);

  const banner = context.buildTimetableVersionBannerHtml();
  assert.match(banner, /현재 명단으로 갱신했습니다/);
  assert.match(banner, /신입 2명 추가/);
  assert.match(banner, /신입 → 미배정/);
  assert.match(banner, /카 → 중2 A반/);
  assert.match(banner, /퇴원 1명 제외\(퇴원생\)/);
  assert.match(banner, /두 반 수강 1명은 한 반만 들어갑니다/);
  assert.match(banner, /미배정 1명/);
  assert.match(banner, /삭제한 반 1개/);
  assert.doesNotMatch(banner, /id="tt-unassigned-bar"[^>]*display:none/, '미배정이 있으면 줄이 보인다');

  const detailHtml = (() => { let shown = ''; context.showModalStep = (t, b) => { shown = b; }; context.openTimetableDraftRosterDetailModal(); return shown; })();
  assert.match(detailHtml, /신입 추가 2명/);
  assert.match(detailHtml, /현재 운영 반: 중1 신규반/);
  assert.match(detailHtml, /카: ?|바: A반, B반/);

  // 같은 응답이 다시 와도(차이 없음) 닫기 전 알림은 그대로, 닫으면 사라진다
  nextDetail = detail();
  await context.reloadTimetableDraftDetail();
  assert.match(context.buildTimetableVersionBannerHtml(), /현재 명단으로 갱신했습니다/);
  context.window.ttCloseRosterNotice();
  assert.doesNotMatch(context.buildTimetableVersionBannerHtml(), /현재 명단으로 갱신했습니다/);

  // 0명이면 미배정 줄은 숨김 상태로 그려진다(끌기 시작하면 나타나는 놓는 자리)
  assert.match(context.buildTimetableVersionBannerHtml(), /id="tt-unassigned-bar" data-has-students="0"[^>]*display:none/);

  // 명단 새로고침: 차이가 없으면 토스트
  toasts.length = 0;
  await context.refreshTimetableDraftRoster();
  assert.equal(JSON.stringify(toasts[toasts.length - 1]), JSON.stringify(['현재 명단과 같습니다.', 'info']));

  // 헤더 버튼
  const header = context.buildTimetableVersionHeaderActionsHtml();
  assert.match(header, /명단 새로고침/);
  assert.match(header, /새로 만들기/);

  // 학생 칩: 개편안에서는 동작 창을 연다
  const click = context.getTimetableStudentClickHandler({ id: 's1', isNew: true }, 'vc1');
  assert.match(click, /openTimetableDraftStudentActions\('s1','vc1'\)/);

  // 학생 동작 창: 반에서 빼기, 다른 반으로
  let modalBody = '';
  context.showModal = (title, body) => { modalBody = body; };
  context.state.ui.timetableMonthArchive = { active: false, virtualDb: null };
  context.openTimetableDraftStudentActions('s1', 'vc1');
  assert.match(modalBody, /반에서 빼기/);
  assert.match(modalBody, /다른 반으로/);
  context.openTimetableDraftStudentActions('s9', '__unassigned__');
  assert.match(modalBody, /반에 넣기/);
  assert.doesNotMatch(modalBody, /반에서 빼기/);

  // 반에서 빼기 → 서버 호출 후 상태 반영
  nextPost = {
    success: true,
    timetable_version_student_assignments: [],
    timetable_version_unassigned_students: [{ student_id: 's1', student_name_snapshot: '가나', version_class_id: '__unassigned__' }],
    timetable_version_removed_classes: [{ id: 'vc2', name_snapshot: '삭제된 반' }]
  };
  calls.length = 0;
  await context.unassignTimetableDraftStudent('s1');
  assert.equal(JSON.stringify(calls[0]), JSON.stringify(['POST', 'timetable-versions/v1/students/unassign', { student_id: 's1' }]));
  assert.equal(context.state.ui.selectedTimetableVersionUnassigned.length, 1);
  assert.equal(context.state.ui.selectedTimetableVersionStudentAssignments.length, 0);

  // 미배정 학생을 반으로 끌어 넣기(미배정 → 반)는 sourceClass 없이도 배정 호출이 나간다
  nextPost = { success: true, timetable_version_student_assignments: [{ student_id: 's1', version_class_id: 'vc1', class_id: 'vc1' }], timetable_version_unassigned_students: [], timetable_version_removed_classes: [] };
  calls.length = 0;
  context.readTimetableDropPayload = () => ({ drag_type: 'student', student_id: 's1', source_class_id: '__unassigned__' });
  context.isTimetableAdminMode = () => true;
  context.handleTimetableClassDrop({
    preventDefault() {}, stopPropagation() {},
    currentTarget: { classList: { remove() {} }, getAttribute: () => 'vc1' }
  });
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(calls[0][1], 'timetable-versions/v1/students/assign');
  assert.equal(calls[0][2].target_class_id, 'vc1');
  assert.equal(context.state.ui.selectedTimetableVersionUnassigned.length, 0);

  // 반 삭제 확인 문구
  context.openTimetableDraftClassRemoveConfirm('vc1');
  assert.match(modalBody, /중2 A반반을 개편안에서 삭제합니다\. 학생 1명은 미배정으로 옮겨집니다\./);

  // 새로 만들기 확인 문구
  context.openTimetableDraftRestartConfirm();
  assert.match(modalBody, /지금 개편안의 배치를 모두 버리고 현재 운영 명단으로 다시 만듭니다\. 되돌릴 수 없습니다\./);

  // 적용 확인: 열기 전에 먼저 명단을 갱신하고, 미배정 이름을 경고로 보여 준다
  nextDetail = detail({
    timetable_version_student_assignments: [{ student_id: 's1', version_class_id: 'vc1', class_id: 'vc1', student_name_snapshot: '가나' }],
    timetable_version_unassigned_students: [{ student_id: 's9', student_name_snapshot: '방금신입', version_class_id: '__unassigned__', excluded_reason: 'unassigned' }],
    roster_sync: { added: [{ student_id: 's9', student_name: '방금신입', class_name: null, unassigned: true, ops_class_names: ['신규'] }], removed: [], moved: [], changed: 1 }
  });
  calls.length = 0;
  let confirmBody = '';
  context.showModalStep = (title, body) => { confirmBody = body; };
  await context.openTimetableDraftActivateConfirm();
  assert.equal(JSON.stringify(calls[0]), JSON.stringify(['GET', 'timetable-versions/v1']), '확인 창을 열기 전에 서버에서 명단을 다시 맞춘다');
  assert.match(confirmBody, /반 2개 · 학생 1명/);
  assert.match(confirmBody, /삭제한 반 1개: 삭제된 반/);
  assert.match(confirmBody, /미배정 1명은 반 없이 적용됩니다: 방금신입/);

  // 서버 안전장치(409)에는 "먼저 현재 명단과 맞춰 주세요"
  nextPost = { success: false, status: 409, error: 'roster_mismatch' };
  let blockedBody = '';
  context.showModal = (title, body) => { blockedBody = title + body; };
  await context.confirmTimetableDraftActivate();
  assert.match(blockedBody, /먼저 현재 명단과 맞춰 주세요/);
  assert.match(blockedBody, /맞추기/);

  console.log('apmath-timetable-draft-ui: all assertions passed');
})().catch(error => {
  console.error(error);
  process.exit(1);
});
