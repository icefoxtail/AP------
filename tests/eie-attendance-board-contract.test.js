const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const stateSource = fs.readFileSync(path.join(root, 'eie/js/eie-state.js'), 'utf8');
const viewSource = fs.readFileSync(path.join(root, 'eie/js/views/eie-attendance.js'), 'utf8');
const apiSource = fs.readFileSync(path.join(root, 'eie/js/eie-api.js'), 'utf8');
const workerSource = fs.readFileSync(path.join(root, 'workers/wangji-eie-worker/routes/eie.js'), 'utf8');

function baseSession() {
  return {
    source_cell_ids: ['cellA'],
    session_id: 'sess-A',
    period_order: 1,
    period_label: '1교시',
    display_time_range: '오후 3:10~3:50',
    material: 'RS2-1',
    class_full_name: 'RS2-1',
    start_minutes: 910,
    // EIE: 같은 셀이라도 요일마다 담당 선생님이 바뀐다.
    day_teachers: { 월: ['Carmen'], 화: ['Carmen'], 수: ['Foreigner'], 목: ['Zoe'], 금: ['Zoe'] },
    students: [
      { student_id: 'stu1', name: '민준', grade: '초3' },
      { student_id: 'stu2', name: '서윤', grade: '중1' }
    ]
  };
}

function makeContext(role, opts = {}) {
  const apiCalls = [];
  const sessions = opts.sessions || [opts.session || baseSession()];
  const monthRecords = opts.monthRecords || [];
  const context = {
    console, Promise, Date, Array, JSON, Number, String, Object, Math,
    setTimeout, clearTimeout, window: {}
  };
  context.window.EieApp = { escapeHtml: v => String(v == null ? '' : v).replace(/"/g, '&quot;') };
  context.window.EieClassroomScope = {
    teacherKey: v => String(v == null ? '' : v).replace(/\s+/g, '').toLowerCase(),
    currentSession: () => ({ teacherName: role === 'owner' ? '' : 'Carmen', role, loginId: role === 'owner' ? 'admin' : 'carmen' }),
    isDirector: (r) => String(r).toLowerCase() === 'admin' || String(r).toLowerCase() === 'owner'
  };
  context.window.EieApi = {
    getTimetable: async () => ({ timetable_cells: sessions.map((s, i) => ({ id: 'cell' + i })) }),
    getAttendanceMonth: async () => ({ attendance_records: monthRecords }),
    saveAttendanceRecord: async (payload) => {
      apiCalls.push(['saveAttendanceRecord', payload]);
      const blank = !payload.status && !payload.tags;
      const record = blank ? null : {
        id: 'rec-' + payload.student_id, student_id: payload.student_id,
        timetable_cell_id: payload.timetable_cell_id, date: payload.date,
        status: payload.status, tags: payload.tags
      };
      return { attendance_record: record, deleted: blank };
    }
  };
  context.window.EieTimetableView = { _buildDisplaySessions: () => sessions.map(s => ({ ...s })) };
  context.window.EieRouter = { open: () => {} };
  context.global = context; context.globalThis = context;
  vm.createContext(context);
  vm.runInContext(stateSource, context);
  vm.runInContext(viewSource, context);
  ['EieState', 'EieApi', 'EieRouter', 'EieTimetableView', 'EieClassroomScope', 'EieApp', 'EieAttendanceView']
    .forEach(k => { context[k] = context.window[k]; });
  return { context, apiCalls };
}

const MON = '2026-06-08'; // Monday
const MON2 = '2026-06-01'; // Monday
const WED = '2026-06-10'; // Wednesday

(async () => {
  // ── 1. 셀 일괄 저장 경로 제거 유지 ─────────────────────────────────────
  assert(!/saveAttendanceCell/.test(viewSource) && !/saveAttendanceCell/.test(apiSource)
    && !/handlePostAttendanceCell/.test(workerSource), 'cell-level bulk save must stay removed');

  // ── 2. 백엔드: cellId 필수(400) + 지각 태그 지원 ───────────────────────
  const postFn = workerSource.slice(workerSource.indexOf('async function handlePostAttendanceRecord'));
  const postBody = postFn.slice(0, postFn.indexOf('\nasync function '));
  assert(/timetable_cell_id is required/.test(postBody) && /!cellId/.test(postBody),
    'handlePostAttendanceRecord must reject missing timetable_cell_id');
  assert(/'지각'/.test(workerSource) && /EIE_ATTENDANCE_TAGS = \['상담', '보강', '지각'\]/.test(workerSource),
    'worker tags must include 지각');
  assert(/'등원', '결석', '수업 없음'/.test(workerSource), 'worker statuses must include 수업 없음');

  // ── 3. 월간 그리드 + 툴바 + 범례(SVG 기호) ─────────────────────────────
  const { context, apiCalls } = makeContext('owner');
  const view = context.window.EieAttendanceView;
  const state = context.window.EieState;
  state.setAttendanceViewDate(MON);

  const html = await view.render();
  assert(/eie-att-toolbar/.test(html) && /오늘/.test(html) && /인쇄/.test(html), 'toolbar has 오늘/인쇄');
  assert(/type="date"/.test(html), 'toolbar has a date input');
  assert(/전체 선생님/.test(html) && /전체 반/.test(html), 'teacher/class filters present');
  assert((html.match(/class="eie-att-icon/g) || []).length >= 6, 'legend uses SVG icons for all attendance symbols');
  for (const cls of ['eie-att-o-o', 'eie-att-o-x', 'eie-att-no', 'eie-att-mk-star', 'eie-att-mk-square', 'eie-att-mk-tri']) {
    assert(html.includes(cls), `legend/style class ${cls}`);
  }
  assert(/eie-att-grid/.test(html) && /class="eie-att-dnum"/.test(html), 'renders the monthly grid with day columns');

  // 학생 행 앞 시간칸은 "교시/시간/반"만 표시한다. 월요일엔 Carmen 블록(수요일 담당 Foreigner는 미노출).
  const body = html.split('eie-att-tbl-wrap')[1] || '';
  assert(/eie-att-time-nc[\s\S]*1교시[\s\S]*오후 3:10~3:50[\s\S]*RS2-1/.test(body),
    'time column is labelled by period, time, and class');
  assert(/민준/.test(body) && /서윤/.test(body), 'student rows under the block');
  assert(!/Foreigner/.test(body), 'Monday roster excludes a Wednesday-only teacher (per-weekday day_teachers)');

  // ── 4. 그리드 기호: 수업일 기본 ○, 미래 빈칸, 결석 × ───────────────────
  assert(/<span class="eie-att-o-o"><svg[\s\S]*?aria-label="등원"/.test(body), 'class day defaults to a present SVG');
  assert(/eie-att-no-class/.test(body), 'non-class weekdays render 수업 없음 (-)');

  // 결석 노출: 같은 셀 같은 날 stu2 결석 → 그리드에 × 표시
  const { context: ac } = makeContext('owner', {
    monthRecords: [{ id: 'a1', student_id: 'stu2', timetable_cell_id: 'cellA', date: MON, status: '결석', tags: '' }]
  });
  ac.window.EieState.setAttendanceViewDate(MON);
  const aBody = (await ac.window.EieAttendanceView.render()).split('eie-att-tbl-wrap')[1] || '';
  assert(/<span class="eie-att-o-x"><svg[\s\S]*?aria-label="결석"/.test(aBody), 'absent surfaces as an SVG in the grid');

  // 다중 마크: 수업하는 날 출석 + 상담 + 보강(+지각)을 한 칸에 같이 표시
  const { context: mkc } = makeContext('owner', {
    monthRecords: [{ id: 'm1', student_id: 'stu1', timetable_cell_id: 'cellA', date: MON, status: '등원', tags: '상담,보강,지각' }]
  });
  mkc.window.EieState.setAttendanceViewDate(MON);
  const mkBody = (await mkc.window.EieAttendanceView.render()).split('eie-att-tbl-wrap')[1] || '';
  assert(/eie-att-mk-star/.test(mkBody) && /eie-att-mk-square/.test(mkBody) && /eie-att-mk-tri/.test(mkBody),
    'a class day can show 상담, 보강, 지각 SVG marks together in one cell');

  // ── 5. 셀 클릭 → 입력판(○ × ★ ■ ▲ + 저장, 취소 없음, 자동저장 없음) ────
  view.openStudent(MON, 'cell0', 'stu1');
  const padHtml = await view.render();
  const pad = padHtml.split('eie-att-pad-head')[1] || '';
  assert(/EieAttendanceView\.save\(\)/.test(padHtml), 'pad has a save action');
  assert(!/취소/.test(padHtml), 'pad has no cancel button');
  // 5개 기호 버튼만 (텍스트 설명 반복 없음)
  for (const sym of ['○', '×', '★', '■', '▲']) assert(pad.includes(sym), `pad has ${sym} button`);
  assert(!/등원|결석|상담|보강|지각/.test(pad.slice(0, pad.indexOf('eie-att-pad-save'))), 'pad omits repeated text labels');
  assert.strictEqual(apiCalls.length, 0, 'opening a cell must NOT auto-save');

  // ── 6. 선택 규칙(지각 포함) ────────────────────────────────────────────
  let a;
  // 기록 없는 수업일은 기본 등원으로 시작
  a = state.get().attendance;
  assert.strictEqual(a.draftStatus, '등원', 'class-day cell opens defaulted to 등원');
  // 태그 여러 개 동시 선택 가능: ○ + 상담 + 보강 + 지각 모두 공존
  view.pick('counsel'); view.pick('makeup'); view.pick('late'); a = state.get().attendance;
  assert(a.draftTags.includes('상담') && a.draftTags.includes('보강') && a.draftTags.includes('지각')
    && a.draftTags.length === 3 && a.draftStatus === '등원', '○ + ★ + ■ + ▲ all coexist (multi-tag)');
  view.pick('makeup'); a = state.get().attendance; // toggle 보강 back off, others stay
  assert(a.draftTags.includes('상담') && a.draftTags.includes('지각') && !a.draftTags.includes('보강'),
    'tags toggle independently');
  view.pick('absent'); a = state.get().attendance;
  assert.strictEqual(a.draftStatus, '결석', '× sets absent');
  assert.strictEqual(a.draftTags.length, 0, '× clears all marks');
  view.pick('late'); a = state.get().attendance;
  assert(a.draftStatus === '등원' && a.draftTags.length === 1 && a.draftTags[0] === '지각', '▲ after × → 등원 + 지각');
  assert.strictEqual(apiCalls.length, 0, 'no API calls during picking');

  // ── 7. 저장: 학생별 1건(셀 일괄 아님) ─────────────────────────────────
  view.pick('late'); // remove 지각 → 등원만
  await view.save();
  assert.strictEqual(apiCalls.length, 1, 'one per-student save');
  const payload = apiCalls[0][1];
  assert.strictEqual(payload.student_id, 'stu1');
  assert.strictEqual(payload.timetable_cell_id, 'cell0');
  assert(!('student_ids' in payload), 'no bulk student_ids');
  assert.strictEqual(state.getAttendanceForCellDate(MON, 'cell0').length, 1, 'only the saved student gets a record');

  // ── 8. 다중 셀 세션: 저장 셀 = 대표 source_cell_ids[0] (읽기==쓰기) ─────
  const merged = baseSession();
  merged.source_cell_ids = ['cellA', 'cellB'];
  const { context: mc, apiCalls: mCalls } = makeContext('owner', { session: merged });
  mc.window.EieState.setAttendanceViewDate(MON);
  const mBody = (await mc.window.EieAttendanceView.render()).split('eie-att-tbl-wrap')[1] || '';
  const mClean = mBody.replace(/&quot;/g, '');
  assert(/openStudent\([^)]*cellA[^)]*stu1/.test(mClean), 'rendered cell targets source_cell_ids[0] (cellA)');
  assert(!/openStudent\([^)]*cellB/.test(mClean), 'merged session must not target the secondary cell (cellB)');
  mc.window.EieAttendanceView.openStudent(MON, 'cellA', 'stu1');
  mc.window.EieAttendanceView.pick('present'); // ensure non-blank
  await mc.window.EieAttendanceView.save();
  assert.strictEqual(mCalls[mCalls.length - 1][1].timetable_cell_id, 'cellA',
    'merged-session save uses the same representative cell id as the rendered cell');

  // ── 9. 수업 없음(-) 수동 선택 + 그리드 '-' 표시 ───────────────────────
  const { context: nc } = makeContext('owner', {
    monthRecords: [{ id: 'n1', student_id: 'stu1', timetable_cell_id: 'cellA', date: MON, status: '수업 없음', tags: '' }]
  });
  const nview = nc.window.EieAttendanceView;
  const nstate = nc.window.EieState;
  nstate.setAttendanceViewDate(MON);
  const nBody = (await nview.render()).split('eie-att-tbl-wrap')[1] || '';
  // 수동 수업없음은 클릭 가능한 수업일 셀 안의 '-' (cellbox 구조)
  assert(nBody.indexOf('eie-att-cellbox"><span class="eie-att-main"><span class="eie-att-no"><svg') >= 0,
    'a manually set 수업 없음 renders an SVG inside a clickable class-day cell');

  nview.openStudent(MON, 'cell0', 'stu2'); // no record → 등원 default
  let na = nstate.get().attendance;
  assert.strictEqual(na.draftStatus, '등원', 'class-day cell defaults to 등원');
  nview.pick('noclass'); na = nstate.get().attendance;
  assert.strictEqual(na.draftStatus, '수업 없음', '- is selectable as a main status');
  assert.strictEqual(na.draftTags.length, 0, '- clears marks');
  nview.pick('counsel'); na = nstate.get().attendance;
  assert(na.draftStatus === '등원' && na.draftTags.includes('상담'), 'a mark after - switches back to 등원');
  nview.pick('absent'); nview.pick('noclass'); na = nstate.get().attendance;
  assert(na.draftStatus === '수업 없음' && na.draftTags.length === 0, '- is mutually exclusive with ○/× and clears marks');
  nview.pick('noclass'); na = nstate.get().attendance;
  assert.strictEqual(na.draftStatus, '', '- toggles off to blank');

  console.log('EIE attendance monthly-grid contract test passed');
})().catch(err => { console.error(err); process.exit(1); });
