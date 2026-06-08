const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const fixture = require('./fixtures/eie-classroom-scope.fixture');

const root = path.resolve(__dirname, '..');
const scopeSource = fs.readFileSync(path.join(root, 'eie/js/utils/eie-classroom-scope.js'), 'utf8');
const classroomSource = fs.readFileSync(path.join(root, 'eie/js/views/eie-classroom.js'), 'utf8');

class FixedDate extends Date {
  constructor(value) {
    super(value || `${fixture.MONDAY}T09:00:00`);
  }

  static now() {
    return new Date(`${fixture.MONDAY}T09:00:00`).getTime();
  }
}

const context = {
  console,
  JSON,
  String,
  Array,
  Number,
  Date: FixedDate,
  document: {
    getElementById() {
      return null;
    },
    querySelectorAll() {
      return [];
    }
  },
  localStorage: {
    getItem(key) {
      return {
        WANGJI_EIE_ROLE: 'teacher',
        WANGJI_EIE_LOGIN_ID: 'lily',
        WANGJI_EIE_NAME: 'Lily'
      }[key] || '';
    }
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
  EieApi: {
    async getTimetable() {
      return { timetable_cells: fixture.cells };
    },
    async getStudents() {
      return { students: [] };
    },
    async getTeachers() {
      return {
        teachers: Object.values(fixture.sessions).map(session => ({
          name: session.teacherName,
          role: session.role
        }))
      };
    },
    async getAttendanceRecords() {
      return { attendance_records: [] };
    }
  },
  EieState: {
    get() {
      return { db: { attendance: [] } };
    },
    mergeStudentAttendance() {}
  },
  EieTimetableView: {
    panelContexts: [],
    dayTeacherBuilds: [],
    _buildDisplaySessions(rows) {
      return rows.map(row => {
        let raw = {};
        try {
          raw = row.raw_meta_json ? JSON.parse(row.raw_meta_json) : {};
        } catch (error) {
          raw = {};
        }
        return {
          source_cell_ids: [row.id],
          material: row.class_name_raw,
          class_name: row.class_name_raw,
          class_full_name: row.class_name_raw,
          homeroom_teacher: row.homeroom_teacher || raw.homeroom_teacher || '',
          period_order: row.period_order,
          period_label: row.period_label,
          day_teachers: row.day_teachers || raw.day_teachers || {},
          teacher_names_by_day: row.teacher_names_by_day || raw.teacher_names_by_day || {},
          weekday_teachers: row.weekday_teachers || raw.weekday_teachers || {},
          periods: [{
            period_order: row.period_order,
            period_label: row.period_label,
            source_cell_id: row.id,
            day_teachers: row.day_teachers || raw.day_teachers || {}
          }]
        };
      });
    },
    _buildDayTeacherSessions(sessions, day) {
      this.dayTeacherBuilds.push(day);
      const aliases = {
        '\uC6D4': ['\uC6D4', 'mon'],
        '\uD654': ['\uD654', 'tue'],
        '\uC218': ['\uC218', 'wed'],
        '\uBAA9': ['\uBAA9', 'thu'],
        '\uAE08': ['\uAE08', 'fri']
      }[day] || [day];
      return sessions.flatMap(session => {
        const names = [];
        [session.day_teachers, session.teacher_names_by_day, session.weekday_teachers].forEach(source => {
          if (!source) return;
          Object.keys(source).forEach(key => {
            if (aliases.includes(key)) names.push(...source[key]);
          });
        });
        return [...new Set(names)].map(name => ({
          teacherName: name,
          teacher_key: String(name).trim().toLowerCase(),
          source_cell_ids: session.source_cell_ids
        }));
      });
    },
    async renderPanelOnlyWithContext(ctx) {
      this.panelContexts.push(ctx);
      return '<aside data-test-borrowed-timetable-panel="true"></aside>';
    }
  },
  EieRouter: {
    opened: [],
    open(route) {
      this.opened.push(route);
    }
  }
};
context.window = context;

vm.createContext(context);
vm.runInContext(scopeSource, context, { filename: 'eie-classroom-scope.js' });
vm.runInContext(classroomSource, context, { filename: 'eie-classroom.js' });

(async () => {
  assert.strictEqual(typeof context.EieClassroomView.openTeacher, 'function', 'openTeacher should be exposed');
  assert.strictEqual(typeof context.EieClassroomView.openCell, 'function', 'openCell should be exposed');
  assert.strictEqual(typeof context.EieClassroomView.openTodayForTeacher, 'function', 'openTodayForTeacher should be exposed');

  context.EieClassroomView.openTeacher('IVY');
  let html = await context.EieClassroomView.render();
  assert(html.includes('>전체</button>'), 'teacher classroom should include an all-days tab');
  assert(html.includes('eie-classroom-screen eie-v2-screen'), 'classroom screen should use the EIE detail panel screen wrapper');
  assert(html.includes('eie-panel eie-p-panel'), 'classroom screen should use the EIE detail panel container token');
  assert(!html.includes('← EIE 홈'), 'classroom body should not render a duplicate EIE home button');
  assert(html.includes('eie-classroom-weekday-tabs eie-p-chip-row'), 'classroom weekday tabs should reuse the EIE chip row token');
  assert(html.includes('eie-classroom-weekday-chip eie-p-chip'), 'classroom weekday tabs should reuse the EIE chip token');
  assert(html.includes('eie-classroom-schedule-row eie-p-card'), 'classroom schedule rows should reuse the EIE card token');
  assert(html.includes('Seungjae 5'), 'teacher classroom should default to today weekday classes');
  assert(html.includes('담임 IVY'), 'teacher weekday rows should show the homeroom teacher');
  assert(!html.includes('월요일 IVY'), 'teacher weekday rows should not repeat the selected weekday teacher');
  assert(!html.includes('<strong>Lily</strong>'), 'teacher-scoped classroom should not render another teacher group header');
  assert(context.EieTimetableView.dayTeacherBuilds.includes('월'), 'teacher classroom should reuse timetable day-teacher sessions on entry');

  context.EieClassroomView.setDay('수');
  html = await context.EieClassroomView.render();
  assert(!html.includes('Seungjae 5'), 'weekday selection should filter out classes not taught by the teacher on that day');

  context.EieClassroomView.setDay('월');
  html = await context.EieClassroomView.render();
  assert(html.includes('Seungjae 5'), 'weekday selection should update the class list for the selected day');
  assert(
    html.includes('eie-classroom-weekday-chip eie-p-chip is-active'),
    'selected weekday should be visually active'
  );
  assert(!html.includes('<strong>Lily</strong>'), 'teacher-scoped classroom should not render another teacher group header');
  assert(context.EieTimetableView.dayTeacherBuilds.includes('월'), 'teacher weekday classroom should reuse timetable day-teacher sessions');

  context.EieClassroomView.setDay('');
  html = await context.EieClassroomView.render();
  assert(html.includes('>전체</button>'), 'all-days tab should reset the weekday filter');
  assert(html.includes('담임 클래스'), 'all-days teacher classroom should separate homeroom classes');
  assert(html.includes('요일별 담당 클래스'), 'all-days teacher classroom should separate weekday-assigned classes');
  assert(html.includes('Seungjae 5'), 'all-days tab should show the teacher full classroom list again');

  context.EieClassroomView.openTodayForTeacher('Lily', fixture.WEDNESDAY);
  html = await context.EieClassroomView.render();
  assert(html.includes('Seungjae 5'), 'openTodayForTeacher should filter classroom to the teacher access scope');
  assert(!html.includes('Carmen Only'), 'openTodayForTeacher should not show unrelated teacher classes');

  context.EieClassroomView.openTeacher('');
  context.EieClassroomView.setDay('월');
  html = await context.EieClassroomView.render();
  assert(!html.includes('<strong>Carmen</strong>'), 'teacher session without explicit classroom filter should not render another teacher group');
  assert(!html.includes('<strong>Zoe</strong>'), 'teacher session without explicit classroom filter should not render another teacher group');
  assert(
    classroomSource.includes('function effectiveTeacherName()') &&
      classroomSource.includes('var teacherName = effectiveTeacherName();') &&
      classroomSource.includes('timetableTeacherDayRows(cells, teacherName, active)'),
    'classroom should use the logged-in teacher as a fallback teacher scope'
  );

  context.EieClassroomView.openCell('cell_ivy_wed_lily');
  html = await context.EieClassroomView.render();
  assert(html.includes('data-test-borrowed-timetable-panel'), 'openCell should mount the timetable detail/edit panel inside classroom');
  assert.strictEqual(
    context.EieTimetableView.panelContexts.at(-1).cellId,
    'cell_ivy_wed_lily',
    'classroom should pass the selected timetable cell id to the borrowed panel renderer'
  );
  assert.strictEqual(
    context.EieTimetableView.panelContexts.at(-1).mountRoute,
    'classroom',
    'borrowed timetable panel should rerender inside the classroom route'
  );

  context.EieClassroomView.openTodayForTeacher('Lily', fixture.SATURDAY);
  html = await context.EieClassroomView.render();
  assert(
    html.includes('data-eie-classroom-empty-day'),
    'openTodayForTeacher with no classes should open classroom and render an empty today state'
  );

  console.log('EIE classroom entry API test passed');
})().catch(err => {
  console.error(err);
  process.exit(1);
});
