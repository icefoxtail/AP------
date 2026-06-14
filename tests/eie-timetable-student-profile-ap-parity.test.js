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
  assert(html.includes('eie-v2-ap-appbar') && html.includes('>닫기</button>'), 'panel should render a compact close app bar');
  assert(!html.includes('<strong></strong>'), 'panel appbar should not reserve empty title space');
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
  assert(classHtml.includes('eie-v2-mini-classroom'), 'timetable class detail should render the mini classroom panel');
  assert((classHtml.match(/eie-v2-mini-section/g) || []).length >= 4, 'mini classroom panel should group content into consistent sections');
  assert(classHtml.includes('eie-v2-mini-section-title'), 'mini classroom sections should expose a visible hierarchy hook');
  assert(classHtml.includes('eie-v2-mini-card-compact'), 'mini classroom compact cards should use a reusable class instead of inline padding');
  assert(!classHtml.includes('style="padding:0;"'), 'mini classroom panel should not rely on inline padding overrides');

  assert(css.includes('.eie-v2-ap-profile-panel'), 'CSS should scope the AP profile panel');
  assert(css.includes('.eie-v2-ap-tab.is-active'), 'CSS should style the AP underline active tab');
  assert(css.includes('.eie-v2-ap-profile-panel .eie-v2-panel-consultation-card'), 'CSS should restyle consultation cards inside the AP profile panel');
  assert(/\.eie-v2-ap-appbar\s*\{[\s\S]*display:\s*flex;[\s\S]*justify-content:\s*flex-end;[\s\S]*min-height:\s*36px;[\s\S]*padding:\s*6px 10px;/.test(css), 'profile appbar should be compact and right-align the close action');
  assert(/@media \(max-width:\s*620px\)\s*\{[\s\S]*\.eie-v2-ap-appbar\s*\{[\s\S]*min-height:\s*34px;[\s\S]*padding:\s*5px 8px;/.test(css), 'profile appbar should stay compact on mobile');
  assert(/\.eie-v2-ap-profile-shell\s*\{[\s\S]*padding:\s*10px;/.test(css), 'profile shell padding should match APMATH mobile detail-shell padding');
  assert(/\.eie-v2-ap-card,\s*\.eie-v2-ap-form-card\s*\{[\s\S]*padding:\s*12px;/.test(css), 'profile cards should match APMATH card padding');
  assert(/\.eie-v2-mini-classroom\s+\.eie-v2-mini-form\s*\{[\s\S]*gap:\s*12px;/.test(css), 'mini classroom form should use consistent vertical rhythm');
  assert(/\.eie-v2-mini-classroom\s+\.eie-v2-mini-section\s*\{[\s\S]*display:\s*grid;[\s\S]*gap:\s*6px;/.test(css), 'mini classroom sections should normalize label-to-card spacing');
  assert(/\.eie-v2-mini-classroom\s+\.eie-p-section-label\s*\{[\s\S]*font-size:\s*11px;[\s\S]*font-weight:\s*800;/.test(css), 'mini classroom section labels should have clearer hierarchy');
  assert(/\.eie-v2-mini-classroom\s+\.eie-v2-mini-card-compact\s*\{[\s\S]*padding:\s*0;/.test(css), 'mini classroom compact cards should replace inline padding overrides');

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
