const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'eie/js/views/eie-timetable.js'), 'utf8');
const css = [
  fs.readFileSync(path.join(root, 'eie/css/eie-timetable-board-fixes.css'), 'utf8'),
  fs.readFileSync(path.join(root, 'eie/css/eie-timetable.css'), 'utf8')
].join('\n');
const apmathStudentSource = fs.readFileSync(path.join(root, 'apmath/js/student.js'), 'utf8');
const gradeLedgerSource = fs.readFileSync(path.join(root, 'eie/js/views/eie-grade-ledger.js'), 'utf8');
const gradeLedgerCss = fs.readFileSync(path.join(root, 'eie/css/eie-grade-ledger.css'), 'utf8');

const state = {
  db: {
    students: [{
      id: 'student_alpha',
      display_name: '한세아',
      status: 'active',
      school_name: '왕운중',
      grade: '중1',
      student_phone: '010-0000-0000',
      parent_phone: '010-1111-1111',
      guardian_relation: '모',
      student_address: '서울',
      vehicle_info: '',
      first_attendance_date: '',
      memo: '메모',
      student_pin: '1101',
      teacher_names: ['박준성']
    }],
    consultations: [],
    attendance: []
  },
  timetableCells: []
};

const context = {
  console,
  Date,
  JSON,
  String,
  Number,
  Array,
  Map,
  Set,
  Promise,
  localStorage: { getItem() { return ''; } },
  document: {
    addEventListener() {},
    getElementById() { return null; },
    querySelector() { return null; },
    querySelectorAll() { return []; }
  },
  EieApp: {
    escapeHtml(value) {
      return String(value == null ? '' : value).replace(/[&<>"']/g, ch => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[ch]));
    }
  },
  EieState: {
    get() { return state; },
    setTimetableCells(rows) {
      state.timetableCells = rows;
      state.db.timetable_cells = rows;
    },
    mergeStudentConsultations(studentId, rows) {
      state.db.consultations = state.db.consultations
        .filter(row => String(row.student_id || '') !== String(studentId))
        .concat(rows);
    }
  },
  EieApi: {
    async getTimetable() {
      return {
        timetable_cells: [{
          id: 'cell_alpha',
          day_label: '월',
          period_label: '3교시',
          period_order: 3,
          start_time: '16:30',
          end_time: '17:10',
          class_name_raw: '중1A',
          teacher_name_raw: '박준성',
          status: 'active',
          assigned_students: [{ student_id: 'student_alpha', name: '한세아' }]
        }]
      };
    },
    async getConsultations() {
      return {
        consultations: [{
          id: 'consult_alpha',
          student_id: 'student_alpha',
          date: '2026-04-24',
          type: '출결',
          content: '출결 상담',
          next_action: '다음 수업 확인'
        }]
      };
    }
  },
  EieRouter: { open() {} }
};
context.window = context;
context.window.addEventListener = function () {};
context.window.innerWidth = 390;

vm.createContext(context);
vm.runInContext(source, context, { filename: 'eie-timetable.js' });

function assertApmathHeaderTrimmed() {
  const basicStart = apmathStudentSource.indexOf('function renderStudentBasicTab');
  const basicEnd = apmathStudentSource.indexOf('function renderStudentContactHistoryTab', basicStart);
  const shellStart = apmathStudentSource.indexOf('function renderStudentDetailShell');
  const shellEnd = apmathStudentSource.indexOf('function renderStudentDetailTab', shellStart);
  const basicBody = apmathStudentSource.slice(basicStart, basicEnd);
  const shellBody = apmathStudentSource.slice(shellStart, shellEnd);

  assert(basicStart >= 0 && basicEnd > basicStart, 'APMATH student basic tab renderer should exist');
  assert(shellStart >= 0 && shellEnd > shellStart, 'APMATH student detail shell renderer should exist');
  assert(!basicBody.includes('보호자 관리'), 'APMATH student basic tab should not render guardian-management button');
  assert(!basicBody.includes('openStudentParentManageModal'), 'APMATH basic tab should not expose guardian-management entry');
  assert(shellBody.includes("const modalTitle = '';"), 'APMATH student detail modal should not render the student-name profile title');
  assert(!shellBody.includes('`${s.name} 프로필`'), 'APMATH student detail shell should not build the removed profile title');
}

async function assertGradeLedgerStudentFocus() {
  const gradeContext = {
    console,
    JSON,
    Date,
    Number,
    String,
    Array,
    Object,
    document: {
      querySelectorAll() { return []; },
      getElementById() { return null; }
    },
    EieApp: {
      escapeHtml(value) {
        return String(value == null ? '' : value).replace(/[&<>"']/g, ch => ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;'
        }[ch]));
      }
    },
    EieRouter: {
      opened: [],
      open(route) { this.opened.push(route); }
    },
    EieState: {
      get() { return { db: { timetable_cells: [] } }; },
      setTimetableCells() {},
      setStudents() {}
    },
    EieApi: {
      async getTimetable() {
        return {
          timetable_cells: [{
            id: 'cell_alpha',
            class_name_raw: '중1A',
            assigned_students: [
              { id: 'student_alpha', student_id: 'student_alpha', display_name: '한세아', grade: '중1' },
              { id: 'student_beta', student_id: 'student_beta', display_name: '김다른', grade: '중1' }
            ]
          }]
        };
      },
      async getStudents() {
        return { students: [] };
      },
      async getSchoolGradeRecords() {
        return { school_grade_records: [] };
      },
      async getGradeSheets() {
        return { grade_sheets: [] };
      },
      async getExamRecords() {
        return { exam_records: [] };
      }
    }
  };
  gradeContext.window = gradeContext;

  vm.createContext(gradeContext);
  vm.runInContext(gradeLedgerSource, gradeContext, { filename: 'eie-grade-ledger.js' });

  assert.strictEqual(typeof gradeContext.EieGradeLedgerView.openStudent, 'function', 'grade ledger should expose openStudent');
  gradeContext.EieGradeLedgerView.openStudent({
    studentId: 'student_alpha',
    studentName: '한세아',
    classId: 'cell_alpha',
    mode: 'academy',
    monthKey: '2026-06'
  });

  const html = await gradeContext.EieGradeLedgerView.render();
  assert(gradeContext.EieRouter.opened.includes('grades'), 'openStudent should navigate to grades route');
  assert(html.includes('개인 · 한세아'), 'grade ledger should show the focused student chip');
  assert(html.includes('한세아'), 'grade ledger should render the focused student row');
  assert(!html.includes('김다른'), 'grade ledger should filter out other students when opened for one student');
  assert(gradeLedgerCss.includes('.eie-grade-focus-chip'), 'grade ledger CSS should style the personal focus chip');
}

(async () => {
  assertApmathHeaderTrimmed();

  const html = await context.EieTimetableView.renderPanelOnlyWithContext({
    route: 'timetable',
    cellId: 'cell_alpha',
    studentId: 'student_alpha',
    studentName: '한세아'
  });

  assert(html.includes('eie-v2-ap-profile-panel'), 'timetable student detail should use the AP profile panel shell');
  assert(html.includes('>재원</span>'), 'student detail should label active students as 재원');
  assert(!html.includes('>활성</span>'), 'student detail should not label active students as 활성');
  assert(!html.includes('eie-v2-ap-appbar'), 'student panel should not render a separate white close appbar');
  assert(/eie-v2-ap-head-actions[\s\S]*data-eie-v2-student-back[\s\S]*?>닫기</.test(html), 'student panel close should live inside the profile card header');
  assert(!html.includes('<strong></strong>'), 'panel header should not reserve empty title space');
  assert(!html.includes('한세아 프로필'), 'panel should not render the removed student-name profile title');
  assert(html.includes('eie-v2-ap-profile-shell'), 'panel should render a bordered profile shell');
  assert(html.includes('eie-v2-ap-profile-head'), 'panel should render an AP-style profile header');
  assert(html.includes('eie-v2-ap-tabs'), 'panel should render AP-style detail tabs');
  for (const label of ['기본', '상담', '성적']) {
    assert(html.includes(`>${label}</button>`), `panel should include ${label} tab`);
  }
  for (const oldText of ['← 수업', '수업 정보', '더보기', '연락처·개인정보']) {
    assert(!html.includes(oldText), `panel should not show old EIE detail surface text: ${oldText}`);
  }
  assert(html.includes('학생 상세 정보'), 'basic tab should keep detailed student information');
  assert(!html.includes('보호자 관리'), 'basic tab should not render the removed guardian-management button');
  assert(html.includes('최근 활동'), 'basic tab should include recent activity');
  assert(html.includes('학생 이력'), 'basic tab should include student history');
  assert(html.includes('data-eie-v2-attendance-save="student_alpha"'), 'attendance save should remain available inside the AP-style basic body');
  assert(!html.includes('PIN 번호') && !html.includes('eie-v2-edit-pin'), 'EIE student profile should not show or edit PIN');

  const classHtml = await context.EieTimetableView.renderPanelOnlyWithContext({
    route: 'timetable',
    cellId: 'cell_alpha'
  });
  assert(classHtml.includes('eie-v2-class-profile-panel') && classHtml.includes('eie-v2-ap-profile-panel'), 'timetable class detail should use the AP student-detail shell');
  assert(classHtml.includes('eie-v2-ap-profile-head'), 'class detail view should reuse the AP profile header');
  assert(!classHtml.includes('eie-v2-ap-appbar'), 'class detail view should not render a separate white close appbar');
  assert(/eie-v2-ap-head-actions[\s\S]*data-eie-v2-class-back[\s\S]*?>닫기</.test(classHtml), 'class detail close should live inside the profile card header');
  assert(!classHtml.includes('eie-v2-class-profile-head') && !classHtml.includes('eie-v2-class-head-actions'), 'class detail view should drop its bespoke header layout for the shared AP header');
  assert(classHtml.includes('data-eie-v2-class-edit='), 'class detail view should expose an edit action');
  assert(/class="eie-v2-ap-head-btn is-primary"[^>]*data-eie-v2-class-edit=/.test(classHtml), 'class detail edit should read as the primary header action');
  assert(!classHtml.includes('data-eie-v2-save-mini') && !classHtml.includes('data-eie-v2-cancel-mini'), 'class detail view should not show edit save/cancel actions');
  assert(classHtml.includes('eie-v2-ap-meta-line') && !classHtml.includes('eie-v2-mini-meta-badges'), 'class detail header should render timing and days as a single meta text line, matching the student panel');
  assert(/eie-v2-ap-meta-line">[^<]*3교시[^<]*오후 4:30~5:10[^<]*월/.test(classHtml), 'class detail meta line should still surface period, time, and active days');
  assert(classHtml.includes('<div class="eie-v2-ap-section-head"><h3>수업 정보</h3></div>'), 'class detail view should use AP cards for class info');
  assert(classHtml.includes('eie-v2-class-day-grid') && classHtml.includes('eie-v2-class-day-grid-period'), 'class detail should show teachers as a read-only period-by-day grid');
  assert((classHtml.match(/eie-v2-class-day-grid-day/g) || []).length === 5, 'class detail teacher grid should label the five weekday columns once');
  assert(classHtml.includes('<span class="eie-v2-class-day-grid-label">교시별 담당</span>'), 'class detail teacher grid should be labelled 교시별 담당');
  assert(!classHtml.includes('eie-v2-class-day-teacher-list'), 'class detail should drop the old aggregated weekday list');
  assert(!classHtml.includes('<h3>교시별 담당</h3>'), 'class detail teacher grid should be a borderless block, not a separate card');
  assert(!classHtml.includes('<span class="eie-v2-ap-info-label">선생님</span>'), 'class detail view should remove the separate teacher summary row');
  assert(!classHtml.includes('<span class="eie-v2-ap-info-label">메모</span>'), 'class detail view should not render memo as an info row');
  assert(classHtml.includes('<div class="eie-v2-ap-section-head"><h3>메모</h3></div>') && classHtml.includes('eie-v2-class-memo-read'), 'class detail should show a read-only memo block below the roster');
  assert(classHtml.includes('eie-v2-class-student-grid'), 'class detail view should render students in a full-width grid');
  assert(classHtml.includes('eie-v2-class-student-cell'), 'class detail student entries should use larger grid cells');
  assert(!classHtml.includes('<span class="eie-p-section-label">출결</span>'), 'class detail view should not render attendance as a separate section below the roster');

  const attendanceClassHtml = await context.EieTimetableView.renderPanelOnlyWithContext({
    route: 'timetable',
    cellId: 'cell_alpha',
    classAttendanceOpen: true
  });
  assert(attendanceClassHtml.includes('eie-v2-class-student-cell is-attendance'), 'class detail attendance mode should reuse the student grid cells');
  assert(attendanceClassHtml.includes('>명단</button>'), 'class detail attendance mode should toggle back to roster mode');

  const editClassHtml = await context.EieTimetableView.renderPanelOnlyWithContext({
    route: 'timetable',
    cellId: 'cell_alpha',
    classPanelMode: 'edit'
  });
  assert(editClassHtml.includes('eie-v2-mini-classroom') && editClassHtml.includes('eie-v2-ap-profile-panel'), 'class edit mode should reuse the shared AP profile panel shell');
  assert(editClassHtml.includes('eie-v2-ap-profile-shell'), 'class edit mode should sit inside the same bordered profile shell as the view mode');
  assert(editClassHtml.includes('data-eie-v2-save-mini') && editClassHtml.includes('data-eie-v2-cancel-mini'), 'class edit mode should keep save/cancel actions');
  assert(/class="eie-v2-ap-head-btn is-primary"[^>]*data-eie-v2-save-mini/.test(editClassHtml), 'class edit save should read as the primary header action');
  assert((editClassHtml.match(/eie-v2-ap-card/g) || []).length >= 3, 'class edit mode should group content into the same AP cards as the view mode');
  assert((editClassHtml.match(/eie-v2-ap-section-head/g) || []).length >= 3, 'class edit sections should use in-card AP headings, matching the view mode');
  assert(editClassHtml.includes('eie-v2-ap-edit-title-input'), 'class edit mode should keep the class name editable in the card header');
  assert(!editClassHtml.includes('eie-v2-mini-section'), 'class edit mode should drop the old outside-the-card section wrappers');
  assert(editClassHtml.includes('eie-v2-mini-day-grid'), 'class edit weekday teachers should use a horizontal period-by-day grid');
  assert(editClassHtml.includes('eie-v2-mini-day-grid-head') && (editClassHtml.match(/eie-v2-mini-day-grid-day/g) || []).length === 5, 'class edit grid should label the five weekday columns once in a header row');
  assert((editClassHtml.match(/eie-v2-mini-day-grid-row/g) || []).length >= 1, 'class edit grid should render one row per period');
  assert(!editClassHtml.includes('eie-p-day-grid') && !editClassHtml.includes('eie-v2-mini-day-list'), 'class edit weekday teachers should not use the cramped horizontal table or the old vertical list');
  assert(!editClassHtml.includes('<details') && !editClassHtml.includes('<summary'), 'class edit memo and time fields should stay expanded without a more drawer');
  assert(editClassHtml.includes('<div class="eie-v2-ap-section-head"><h3>메모·기본 정보</h3></div>'), 'class edit mode should show memo and base info as an in-card AP section');
  assert(editClassHtml.includes('eie-v2-class-student-grid'), 'class edit roster should use the same four-column grid as the view page');
  assert(!editClassHtml.includes('style="padding:0;"'), 'class edit mode should not rely on inline padding overrides');
  assert(!editClassHtml.includes('data-eie-v2-class-attendance-toggle'), 'class edit mode should not expose an attendance toggle (roster only)');

  assert(css.includes('.eie-v2-ap-profile-panel'), 'CSS should scope the AP profile panel');
  assert(css.includes('.eie-v2-ap-tab.is-active'), 'CSS should style the AP underline active tab');
  assert(css.includes('.eie-v2-ap-profile-panel .eie-v2-panel-consultation-card'), 'CSS should restyle consultation cards inside the AP profile panel');
  assert(!css.includes('.eie-v2-ap-appbar'), 'the separate white close appbar styles should be removed');
  assert(/\.eie-v2-ap-profile-shell\s*\{[\s\S]*padding:\s*10px;/.test(css), 'profile shell padding should match APMATH mobile detail-shell padding');
  assert(/\.eie-v2-ap-card,\s*\.eie-v2-ap-form-card\s*\{[\s\S]*padding:\s*12px;/.test(css), 'profile cards should match APMATH card padding');
  assert(/\.eie-v2-ap-head-actions\s*\{[\s\S]*display:\s*flex;/.test(css), 'header close and primary actions should sit together in a flex row');
  assert(/\.eie-v2-ap-edit-title-input\s*\{[\s\S]*width:\s*100%;/.test(css), 'class edit title input should stretch inside the shared card header');
  const miniClassroomCssBlocks = (css.match(/[^{}]*\.eie-v2-mini-classroom[^{}]*\{[^{}]*\}/g) || []).join('\n');
  assert(!/font-weight:\s*(800|900);/.test(miniClassroomCssBlocks), 'mini classroom panel should not use heavy bold weights');
  assert(!/(gap|padding|margin-top|min-height):\s*(5|6|7|10|14|26|28|30|34|38)px/.test(miniClassroomCssBlocks), 'mini classroom vertical spacing should stay on the 4/8/12/16/20/24 scale');
  assert(/\.eie-v2-ap-head-btn\.is-primary,?\s*[\s\S]*?\{[\s\S]*background:\s*#6e66c9;/.test(css), 'primary header button should share the primary accent color');
  assert(/\.eie-v2-ap-seg\s*\{[\s\S]*display:\s*inline-flex;/.test(css), 'class detail roster/attendance toggle should use a segmented control');
  assert(/\.eie-v2-ap-seg-btn\.is-active\s*\{[\s\S]*background:\s*#fff;/.test(css), 'segmented control should visibly mark the active view');
  assert(/\.eie-v2-class-profile-panel\s+\.eie-v2-class-student-grid,?\s*[\s\S]*?\{[\s\S]*grid-template-columns:\s*repeat\(4,\s*minmax\(0,\s*1fr\)\);/.test(css), 'student grid should fill the card in four columns across both modes');
  assert(/\.eie-v2-class-student-cell,?\s*[\s\S]*?\{[\s\S]*height:\s*34px;/.test(css), 'student cells should use a uniform fixed height across view and edit modes');
  assert(/\.eie-v2-class-profile-panel\s+\.eie-v2-class-day-grid\s*\{[\s\S]*grid-template-columns:\s*44px repeat\(5,\s*minmax\(0,\s*1fr\)\);/.test(css), 'class detail teacher grid should align the period label with five weekday columns');
  assert(/\.eie-v2-class-profile-panel\s+\.eie-v2-class-day-grid-head,\s*[\s\S]*?\.eie-v2-class-day-grid-row\s*\{[\s\S]*display:\s*contents;/.test(css), 'class detail teacher grid head/rows should flatten into the shared column track');
  assert(/\.eie-v2-class-profile-panel\s+\.eie-v2-class-memo-read\s*\{[\s\S]*white-space:\s*pre-wrap;/.test(css), 'class detail memo block should preserve line breaks and stay borderless');
  assert(/\.eie-v2-class-student-cell\.is-attendance,?\s*[\s\S]*?\{[\s\S]*display:\s*grid;/.test(css), 'attendance cells should stay inside the student grid');
  assert(/\.eie-v2-mini-classroom\s+\.eie-v2-mini-day-grid\s*\{[\s\S]*display:\s*grid;[\s\S]*grid-template-columns:\s*44px repeat\(5,\s*minmax\(0,\s*1fr\)\);/.test(css), 'mini classroom weekday teacher editor should align the period label with five weekday columns on one grid');
  assert(/\.eie-v2-mini-classroom\s+\.eie-v2-mini-day-grid-head,\s*[\s\S]*?\.eie-v2-mini-day-grid-row\s*\{[\s\S]*display:\s*contents;/.test(css), 'mini classroom grid head/rows should flatten into the shared column track to avoid nested-grid collapse');

  const gradeHtml = await context.EieTimetableView.renderPanelOnlyWithContext({
    route: 'timetable',
    cellId: 'cell_alpha',
    studentId: 'student_alpha',
    studentName: '한세아',
    studentDetailTab: 'grades'
  });
  assert(gradeHtml.includes('data-eie-v2-open-student-grades="student_alpha"'), 'student grades tab should expose a per-student grade ledger link');
  assert(gradeHtml.includes('data-eie-v2-grade-class-id="cell_alpha"'), 'student grades tab should pass the current class id to the grade ledger');
  assert(gradeHtml.includes('성적표 열기'), 'student grades tab should label the linked action as opening the grade ledger');
  assert(!gradeHtml.includes('성적표 연동'), 'student grades tab should not show duplicate grade ledger helper copy');
  assert(
    /<div class="eie-v2-ap-section-head"><h3>성적<\/h3><button[^>]+data-eie-v2-open-student-grades="student_alpha"[\s\S]*?<\/div>/.test(gradeHtml),
    'student grades tab should place the grade ledger button in the section header'
  );

  await assertGradeLedgerStudentFocus();

  console.log('EIE timetable student profile AP parity test passed');
})().catch(err => {
  console.error(err);
  process.exit(1);
});
