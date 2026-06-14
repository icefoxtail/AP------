const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

const files = [
  'eie/js/views/eie-grade-ledger.js',
  'eie/index.html',
  'eie/js/eie-router.js',
  'eie/js/eie-api.js',
  'eie/js/views/eie-teacher.js',
  'eie/js/views/eie-classroom.js',
  'eie/js/views/eie-students.js',
  'eie/css/eie.css',
  'workers/wangji-eie-worker/routes/eie.js',
  'migrations/eie_exam_records_20260613.sql',
  'migrations/eie_school_grade_records_20260613.sql',
  'migrations/eie_grade_sheets_20260613.sql',
  'CODEX_RESULT2.md'
];

for (const file of files) {
  assert(fs.existsSync(path.join(root, file)), `review pack should include ${file}`);
}

const ledger = read('eie/js/views/eie-grade-ledger.js');
const api = read('eie/js/eie-api.js');
const router = read('eie/js/eie-router.js');
const index = read('eie/index.html');
const teacher = read('eie/js/views/eie-teacher.js');
const classroom = read('eie/js/views/eie-classroom.js');
const students = read('eie/js/views/eie-students.js');
// 성적표 CSS는 eie.css에서 eie-grade-ledger.css로 기능 분리되었으므로 두 파일을 함께 본다.
const css = read('eie/css/eie.css') + '\n' + read('eie/css/eie-grade-ledger.css');
const worker = read('workers/wangji-eie-worker/routes/eie.js');
const schoolMigration = read('migrations/eie_school_grade_records_20260613.sql');
const sheetsMigration = read('migrations/eie_grade_sheets_20260613.sql');
const examMigration = read('migrations/eie_exam_records_20260613.sql');
const report = read('CODEX_RESULT2.md');

for (const name of [
  'EIE_GRADE_COLS',
  'getEieGradeExamRecord',
  'getEieGradeVisibleStudents',
  'getPrevEieGradeColKey',
  'getEieGradeScore',
  'calcEieGradeAvg',
  'buildEieGradeTrendHtml',
  'buildEieGradeAvgRow',
  '_eieGradeToggleSortCol',
  'closeEieGradeLedger',
  'openEieGradeLedger',
  'renderEieSchoolGradeTable',
  '_renderEieHighGradeTable',
  '_buildEieGradeRow',
  'saveEieSchoolGradeBatch'
]) {
  assert(ledger.includes(name), `ported ledger should include ${name}`);
}

assert(ledger.includes('학교성적') && ledger.includes('원내평가'), 'ledger should render both grade tabs');
assert(ledger.includes('중등') && ledger.includes('고등'), 'school tab should include middle/high sections');
assert(ledger.includes('1학기') && ledger.includes('2학기') && ledger.includes('중간') && ledger.includes('기말'), 'school tab should keep semester/exam headers');
assert(!ledger.includes('>과목</th>') && !ledger.includes('eie-grade-sticky-subject'), 'school grade table should not expose a subject column');
assert(ledger.includes('전체 저장'), 'ledger should keep AP MATH-style save button text');
assert(ledger.includes('setSchoolSection'), 'ledger should keep middle/high segmented tab behavior');
assert(ledger.includes('eie-grade-table') && ledger.includes('eie-grade-inp'), 'school and academy should share grade table/input classes');
assert(ledger.includes('renderAcademyTable'), 'academy tab should render through a table renderer');
assert(!ledger.includes('eie-academy-card'), 'academy tab should not introduce a separate card-style visual system');
// 원내평가 시험 영역은 점수 입력표가 중심이고, 시험 관리는 보조 작업으로 정리한다.
assert(ledger.includes('이번 달 시험'), 'academy tab should keep the lightweight 이번 달 시험 area');
assert(ledger.includes('+ 시험 추가'), 'academy tab should expose a single 시험 추가 button');
assert(ledger.includes('시험 고치기'), 'academy tab should provide a collapsible 시험 고치기 toggle');
assert(!ledger.includes('시험 관리'), 'academy tab should not keep the heavy 시험 관리 panel wording');
assert(!ledger.includes('표시할 시험'), 'academy tab should not keep the 표시할 시험 panel heading');
assert(!ledger.includes('표시 적용') && !ledger.includes('표에 표시') && !ledger.includes('표시 변경'), 'academy tab should not use display-apply wording');
assert(!ledger.includes('선택한 시험만 표에 표시됩니다.') && !ledger.includes('체크한 시험만') && !ledger.includes('체크하면 아래'), 'academy tab should not keep redundant guidance sentences');
assert(ledger.includes('월말평가') && ledger.includes('단어시험') && ledger.includes('Reading Test') && ledger.includes('숙제 확인'), 'academy tab should include default test choices');
assert(ledger.includes('문법시험') && ledger.includes('Dictation Test'), 'academy default test names should be consistent');
assert(ledger.includes('testMaxLabel'), 'academy headers should show max score labels');
assert(!ledger.includes("maxScore: 100"), 'default academy tests should not hard-code 100-point max scores');
assert(!ledger.includes('test.max_score || 100') && !ledger.includes('test.maxScore || test.max_score || 100'), 'missing academy max score should not fall back to 100');
assert(!ledger.includes('id="eie-new-test-max" type="number" value="20"'), 'new test max score input should not be prefilled');
assert(!ledger.includes('eie-grade-savebar'), 'ledger should not render a bottom duplicate savebar');
assert(ledger.includes('renderDirtyBadge'), 'ledger should show unsaved changes as a small badge');
assert((ledger.match(/전체 저장/g) || []).length === 1, 'ledger should keep exactly one 전체 저장 button');
assert(ledger.includes('입력 방식'), 'test input type label should read as 입력 방식');
assert(ledger.includes('<option value="score"') && ledger.includes('>숫자</option>'), 'test input type should include numeric score');
assert(ledger.includes('<option value="fraction"') && ledger.includes('>숫자/만점</option>'), 'test input type should include score/max');
assert(ledger.includes('<option value="memo"') && ledger.includes('>텍스트</option>'), 'test input type should include text memo');
assert(!ledger.includes('<option value="ox">') && !ledger.includes('>O/X</option>'), 'MVP should not expose O/X input type');
assert(!ledger.includes('<option value="check">') && !ledger.includes('>체크</option>'), 'MVP should not expose check input type');
assert(ledger.includes('eie-new-test-date') && ledger.includes('eie-new-test-date-enable') && ledger.includes('시험 날짜 넣기'), 'academy exam date should be optional behind a checkbox');
assert(ledger.includes('formatExamDateLabel'), 'academy table headers should show each test date');
assert(ledger.includes('exam_date: testExamDate(test)'), 'academy records should save the individual test date');
assert(ledger.includes('editTest') && ledger.includes('deleteTest'), 'academy tests should expose edit and delete actions');
assert(ledger.includes('renderTestForm') && ledger.includes('renderEditList'), 'academy test management should split add/edit form from the edit list');
assert(!ledger.includes('eie-grade-test-panel') && !ledger.includes('수정할 시험') && !ledger.includes('eie-edit-test-select'), 'academy tab should drop the old settings-style panel and edit dropdown');
assert(!ledger.includes('eie-grade-test-actions'), 'display checkbox list should not include inline edit action controls');
assert(!ledger.includes("EieGradeLedgerView.editTest(' + jsArg(item.id)") && !ledger.includes("EieGradeLedgerView.deleteTest(' + jsArg(item.id)"), 'edit/delete should not be exposed directly inside the test chips');
assert(!ledger.includes('만점 미설정') && !ledger.includes('점수 제외'), 'academy test picker should not show noisy max/memo status labels');
assert(ledger.includes('eie-grade-sticky-name') && css.includes('.eie-grade-sticky-name') && css.includes('position: sticky'), 'ledger CSS should preserve sticky student names');
assert(css.includes('.eie-grade-section-tabs button') && css.includes('flex: 1 1 0'), 'middle/high section tabs should fill the segmented bar evenly');

for (const forbidden of ['컬럼 설정', '평가항목', '필드', '스키마', 'payload_json', 'JSON', 'config', 'custom']) {
  assert(!ledger.includes(`<span>${forbidden}</span>`) && !ledger.includes(`>${forbidden}<`), `ledger visible UI should not expose ${forbidden}`);
}

for (const fn of [
  'getSchoolGradeRecords(params)',
  'batchSchoolGradeRecords(payload)',
  'getGradeSheets(params)',
  'saveGradeSheet(payload)'
]) {
  assert(api.includes(fn), `EieApi should expose ${fn}`);
}

assert(router.includes("grades: () => EieGradeLedgerView.render()"), 'router should expose the standalone grade ledger route');
assert(index.includes('eie-grade-ledger.js'), 'index should load the grade ledger script');
assert(teacher.includes('openGradeLedger'), 'teacher dashboard should expose grade ledger card action');
assert(teacher.includes('성적표'), 'teacher dashboard should label the quick card 성적표');
assert(!teacher.includes('renderGradeInputCard()'), 'teacher dashboard should not render expanded grade input card');
assert(!teacher.includes('이번 달 원내평가'), 'teacher dashboard should not show academy grade status list');
assert(!teacher.includes('<strong>학교성적</strong>'), 'teacher dashboard should not show school grade status list');
assert(!teacher.includes('eie-teacher-grade-row'), 'teacher dashboard should not render per-class grade rows');
assert(!teacher.includes('eie-grade-inp'), 'teacher dashboard should not contain grade inputs');
assert(classroom.includes('EieGradeLedgerView.openLedger') && !classroom.includes('성적 빠른 입력</h3>'), 'classroom should use only a grade input entry button');
assert(!students.includes('payload_json</span>') && !students.includes('JSON이어야'), 'student detail grades UI should hide developer payload wording');

for (const column of [
  'student_id TEXT NOT NULL',
  'class_id TEXT',
  'teacher_id TEXT',
  'exam_year INTEGER NOT NULL',
  'semester TEXT NOT NULL',
  'exam_type TEXT NOT NULL',
  "subject TEXT NOT NULL DEFAULT 'english'",
  "status TEXT DEFAULT 'active'"
]) {
  assert(schoolMigration.includes(column), `school grade migration should include ${column}`);
}

assert(sheetsMigration.includes('eie_grade_sheets'), 'grade sheets migration should create the sheet table');
assert(examMigration.includes('eie_exam_records'), 'exam records migration should be included in the review pack');
assert(worker.includes("path[2] === 'school-grade-records'"), 'worker should route school grade records');
assert(worker.includes("path[2] === 'grade-sheets'"), 'worker should route grade sheets');
assert(report.includes('AP 원본에서 가져온 함수 목록') && report.includes('브라우저 실화면 확인 여부'), 'CODEX_RESULT2 should contain the requested report sections');

function makeContext({ classId = 'cell-rs3', sheets = [], records = [] } = {}) {
  const context = {
    console,
    JSON,
    Date,
    Number,
    String,
    Array,
    Object,
    setTimeout,
    window: {},
    document: {
      querySelectorAll() { return []; },
      getElementById() { return null; }
    }
  };
  context.window = context;
  context.EieApp = {
    escapeHtml(value) {
      return String(value == null ? '' : value).replace(/[&<>"']/g, ch => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[ch]));
    }
  };
  context.EieRouter = { open() {} };
  context.EieState = {
    get() { return { db: { timetable_cells: [] } }; },
    setTimetableCells() {},
    setStudents() {}
  };
  context.EieApi = {
    async getTimetable() {
      return {
        timetable_cells: [{
          id: 'cell-rs3',
          class_name_raw: 'RS3-1',
          assigned_students: [{ id: 'stu-1', student_id: 'stu-1', display_name: 'Kim', grade: '중1' }]
        }]
      };
    },
    async getStudents() {
      return { students: [{ id: 'stu-1', display_name: 'Kim', grade: '중1' }] };
    },
    async getSchoolGradeRecords() { return { school_grade_records: [] }; },
    async getGradeSheets() { return { grade_sheets: sheets }; },
    async getExamRecords() { return { exam_records: records }; },
    async saveGradeSheet(payload) {
      context.savedSheet = payload;
      return { grade_sheet: { ...payload, columns_json: JSON.stringify(payload.tests || []) } };
    },
    async batchExamRecords(payload) {
      context.savedBatch = payload;
      return { exam_records: [] };
    }
  };
  vm.createContext(context);
  vm.runInContext(ledger, context, { filename: 'eie-grade-ledger.js' });
  context.EieGradeLedgerView.openLedger({ classId, mode: 'academy', monthKey: '2026-06' });
  return context;
}

(async () => {
  {
    const context = makeContext();
    const html = await context.EieGradeLedgerView.render();
    assert(!html.includes('/100'), 'default academy tests should not render /100 before a teacher enters max scores');
    // 기본 화면: 점수 입력표가 중심이고, 시험 관리 보조 영역은 접혀 있어야 한다.
    assert(html.includes('이번 달 시험'), 'default academy screen should show the lightweight 이번 달 시험 area');
    assert(html.includes('eie-academy-table') && html.includes('eie-academy-inp-'), 'default academy screen should lead with the student score table');
    assert(!html.includes('eie-grade-test-form'), 'default academy screen should keep the add/edit form collapsed');
    assert(!html.includes('eie-grade-edit-list'), 'default academy screen should keep the 시험 고치기 list collapsed');
    assert(!html.includes('삭제'), 'default academy screen should not surface delete actions');
  }

  {
    const context = makeContext({
      sheets: [{
        class_id: 'cell-rs3',
        month_key: '2026-06',
        sheet_type: 'academy',
        columns_json: JSON.stringify([{ id: 'month_end', title: '월말평가', scoreType: 'score', maxScore: 100 }])
      }],
      records: [{
        id: 'rec-1',
        student_id: 'stu-1',
        timetable_cell_id: 'cell-rs3',
        exam_date: '2026-06-01',
        category: 'free',
        score: 88,
        payload_json: JSON.stringify({ class_id: 'cell-rs3', month_key: '2026-06', test_id: 'month_end' }),
        status: 'active'
      }]
    });
    const html = await context.EieGradeLedgerView.render();
    assert(html.includes('value="88"'), 'academy table should restore score from payload_json.test_id');
  }

  {
    const context = makeContext({ classId: '' });
    const html = await context.EieGradeLedgerView.render();
    assert(html.includes('반을 선택해 주세요. 선택한 반의 학생 목록이 여기에 표시됩니다.'), 'academy all-class mode should show a concise class selection notice');
    assert(!html.includes('eie-academy-inp-'), 'academy all-class mode should not render editable score inputs');
  }

  {
    // 시험 고치기는 접혀 있다가 토글했을 때만 수정 링크가 보인다.
    const context = makeContext();
    const collapsed = await context.EieGradeLedgerView.render();
    assert(!collapsed.includes('eie-grade-edit-list'), 'edit list should be collapsed by default');
    context.EieGradeLedgerView.toggleEditList();
    const opened = await context.EieGradeLedgerView.render();
    assert(opened.includes('eie-grade-edit-list') && opened.includes('수정'), 'edit list should expose 수정 only after toggling 시험 고치기');
    assert(!opened.includes('삭제'), 'edit list itself should not surface delete actions');
  }

  {
    // 수정 폼은 특정 시험을 눌렀을 때만 열리고, 삭제는 그 안에서만 보인다.
    const context = makeContext();
    await context.EieGradeLedgerView.render();
    const before = await context.EieGradeLedgerView.render();
    assert(!before.includes('eie-grade-test-form'), 'edit form should be hidden before selecting a test');
    context.EieGradeLedgerView.editTest('month_end');
    const editing = await context.EieGradeLedgerView.render();
    assert(editing.includes('eie-grade-test-form') && editing.includes('월말평가 수정'), 'edit form should open only for the selected test');
    assert(editing.includes('삭제'), 'delete should live inside the edit form');
  }

  {
    // + 시험 추가를 눌렀을 때만 추가 폼이 열린다.
    const context = makeContext();
    await context.EieGradeLedgerView.render();
    context.EieGradeLedgerView.openAddTest();
    const adding = await context.EieGradeLedgerView.render();
    assert(adding.includes('eie-grade-test-form') && adding.includes('시험 추가'), 'add form should open after pressing + 시험 추가');
    assert(adding.includes('취소') && adding.includes('추가'), 'add form should provide 취소 and 추가 actions');
  }

  {
    // 체크박스는 별도 적용 버튼 없이 즉시 표 구성을 바꾼다.
    const context = makeContext();
    await context.EieGradeLedgerView.render();
    assert(context.EieGradeLedgerView._test.activeTests().some(test => test.title === '메모'), 'default tests should include 메모');
    context.EieGradeLedgerView.toggleTestChoice('memo', false);
    assert(!context.EieGradeLedgerView._test.activeTests().some(test => test.id === 'memo'), 'unchecking a chip should immediately drop it from the table');
    context.EieGradeLedgerView.toggleTestChoice('grammar', true);
    assert(context.EieGradeLedgerView._test.activeTests().some(test => test.id === 'grammar'), 'checking a chip should immediately add it to the table');
  }

  {
    const context = makeContext({
      sheets: [{
        class_id: 'cell-rs3',
        month_key: '2026-06',
        sheet_type: 'academy',
        columns_json: JSON.stringify([{ id: 'month_end', title: '월말평가', scoreType: 'score', maxScore: 100 }])
      }]
    });
    context.Date.now = () => 1000;
    context.document.getElementById = id => ({
      'eie-new-test-title': { value: '단어 2차' },
      'eie-new-test-date': { value: '2026-06-12' },
      'eie-new-test-type': { value: 'score' },
      'eie-new-test-max': { value: '20' }
    }[id] || null);
    context.EieGradeLedgerView._test.addAcademyTestFromInputs();
    assert(context.EieGradeLedgerView._test.activeTests().some(test => test.title === '단어 2차'), 'new test should be immediately selected for the current sheet');
    await context.EieGradeLedgerView._test.saveGradeSheet();
    assert(context.savedSheet.tests.some(test => test.title === '단어 2차'), 'new test should be persisted in the grade sheet');
  }

  {
    const context = makeContext({ sheets: [] });
    context.Date.now = () => 2000;
    let values = {
      'eie-new-test-title': { value: '단어시험' },
      'eie-new-test-date-enable': { checked: true },
      'eie-new-test-date': { value: '2026-06-05' },
      'eie-new-test-type': { value: 'fraction' },
      'eie-new-test-max': { value: '20' }
    };
    context.document.getElementById = id => values[id] || null;
    context.EieGradeLedgerView._test.addAcademyTestFromInputs();
    values = {
      'eie-new-test-title': { value: '단어시험' },
      'eie-new-test-date-enable': { checked: true },
      'eie-new-test-date': { value: '2026-06-12' },
      'eie-new-test-type': { value: 'fraction' },
      'eie-new-test-max': { value: '20' }
    };
    context.EieGradeLedgerView._test.addAcademyTestFromInputs();
    const vocabTests = context.EieGradeLedgerView._test.activeTests().filter(test => test.title === '단어시험' && test.examDate);
    assert.strictEqual(vocabTests.length, 2, 'same academy test title should be allowed on different exam dates');
    assert(vocabTests.some(test => test.examDate === '2026-06-05'), 'first dated test should be retained');
    assert(vocabTests.some(test => test.examDate === '2026-06-12'), 'second dated test should be retained');
    const html = await context.EieGradeLedgerView.render();
    assert(html.includes('6/5') && html.includes('6/12'), 'academy table should show dates for repeated test names');
  }

  {
    const context = makeContext({ sheets: [] });
    context.Date.now = () => 3000;
    context.document.getElementById = id => ({
      'eie-new-test-title': { value: '단어시험' },
      'eie-new-test-date-enable': { checked: true },
      'eie-new-test-date': { value: '2026-06-05' },
      'eie-new-test-type': { value: 'fraction' },
      'eie-new-test-max': { value: '20' }
    }[id] || null);
    context.EieGradeLedgerView._test.addAcademyTestFromInputs();
    context.EieGradeLedgerView._test.addAcademyTestFromInputs();
    const vocabTests = context.EieGradeLedgerView._test.activeTests().filter(test => test.title === '단어시험' && test.examDate === '2026-06-05');
    assert.strictEqual(vocabTests.length, 1, 'same academy test title on the same exam date should not be duplicated');
  }

  {
    const context = makeContext({
      sheets: [{
        class_id: 'cell-rs3',
        month_key: '2026-06',
        sheet_type: 'academy',
        columns_json: JSON.stringify([{ id: 'vocab_20260605', title: '단어시험', examDate: '2026-06-05', scoreType: 'fraction', maxScore: 20 }])
      }]
    });
    context.document.getElementById = id => ({
      'eie-new-test-title': { value: '단어시험 수정' },
      'eie-new-test-date-enable': { checked: true },
      'eie-new-test-date': { value: '2026-06-06' },
      'eie-new-test-type': { value: 'fraction' },
      'eie-new-test-max': { value: '25' }
    }[id] || null);
    await context.EieGradeLedgerView.render();
    context.EieGradeLedgerView._test.updateAcademyTestFromInputs('vocab_20260605');
    const updated = context.EieGradeLedgerView._test.activeTests().find(test => test.id === 'vocab_20260605');
    assert.strictEqual(updated.title, '단어시험 수정', 'academy test edit should update title');
    assert.strictEqual(updated.examDate, '2026-06-06', 'academy test edit should update exam date');
    assert.strictEqual(updated.maxScore, 25, 'academy test edit should update max score');
  }

  {
    const context = makeContext({
      sheets: [{
        class_id: 'cell-rs3',
        month_key: '2026-06',
        sheet_type: 'academy',
        columns_json: JSON.stringify([
          { id: 'vocab_20260605', title: '단어시험', examDate: '2026-06-05', scoreType: 'fraction', maxScore: 20 },
          { id: 'reading_20260612', title: 'Reading Test', examDate: '2026-06-12', scoreType: 'score', maxScore: null }
        ])
      }]
    });
    await context.EieGradeLedgerView.render();
    context.EieGradeLedgerView._test.deleteAcademyTest('vocab_20260605');
    const testsAfterDelete = context.EieGradeLedgerView._test.activeTests();
    assert(!testsAfterDelete.some(test => test.id === 'vocab_20260605'), 'academy test delete should remove the test from the sheet draft');
    assert(testsAfterDelete.some(test => test.id === 'reading_20260612'), 'academy test delete should keep other tests');
  }

  {
    const context = makeContext();
    const parsed = context.EieGradeLedgerView._test.academyScorePayload('18/20', { scoreType: 'fraction', maxScore: 20 });
    assert.strictEqual(parsed.score, 18, 'score/max input should store the score part');
    assert.strictEqual(parsed.maxScore, 20, 'score/max input should store the max score part');
    assert.strictEqual(parsed.memo, '', 'score/max input should not create extra memo behavior');
  }

  {
    const context = makeContext();
    const parsed = context.EieGradeLedgerView._test.academyScorePayload('18', { scoreType: 'fraction', maxScore: 20 });
    assert.strictEqual(parsed.score, 18, 'score/max table input should accept score-only values when max score is configured');
    assert.strictEqual(parsed.maxScore, 20, 'score/max table input should keep configured max score');
  }

  {
    const context = makeContext({
      sheets: [{
        class_id: 'cell-rs3',
        month_key: '2026-06',
        sheet_type: 'academy',
        columns_json: JSON.stringify([{ id: 'vocab_20260612', title: '단어시험', examDate: '2026-06-12', scoreType: 'fraction', maxScore: null }])
      }],
      records: [{
        id: 'rec-vocab',
        student_id: 'stu-1',
        timetable_cell_id: 'cell-rs3',
        exam_date: '2026-06-12',
        category: 'free',
        score: 18,
        max_score: 20,
        payload_json: JSON.stringify({ class_id: 'cell-rs3', month_key: '2026-06', test_id: 'vocab_20260612', exam_date: '2026-06-12' }),
        status: 'active'
      }]
    });
    await context.EieGradeLedgerView.render();
    context.document.getElementById = id => (
      id === 'eie-academy-inp-stu-1-vocab_20260612' ? { value: '19' } : null
    );
    await context.EieGradeLedgerView.saveAcademy();
    const saved = context.savedBatch.records.find(record => record.student_id === 'stu-1' && record.title === '단어시험');
    assert.strictEqual(saved.score, 19, 'academy resave should save score-only table input');
    assert.strictEqual(saved.max_score, 20, 'academy resave should preserve existing record.max_score when the test max is unset');
  }

  assert(worker.includes('findExistingEieExamRecord') && worker.includes('UPDATE eie_exam_records'), 'worker batch save should update existing logical academy records');
  assert(worker.includes('payloadMeta.test_id') || worker.includes('payload.test_id'), 'worker upsert should use payload test id for logical matching');
  assert(!worker.includes('env.DB.batch(items.map(item => insertEieExamRecordStatement'), 'worker batch save should not use insert-only batch writes');

  console.log('EIE grade ledger port contract test passed');
})().catch(error => {
  console.error(error);
  process.exit(1);
});
