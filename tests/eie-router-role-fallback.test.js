const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'eie/js/eie-router.js'), 'utf8');

async function run(role, loginId) {
  const rendered = [];
  const context = {
    console,
    Promise,
    window: {
      location: { hash: '#missing-route' },
      localStorage: {
        getItem(key) {
          return {
            WANGJI_EIE_ROLE: role,
            WANGJI_EIE_LOGIN_ID: loginId
          }[key] || '';
        }
      },
      addEventListener() {}
    },
    document: {
      readyState: 'complete',
      body: { classList: { toggle() {} } },
      querySelectorAll() { return []; },
      addEventListener() {},
      getElementById() { return null; }
    },
    EieState: {
      setActiveView(route) {
        rendered.push(route);
      }
    },
    EieApp: {
      async mount() {}
    },
    EieDashboardView: { render: () => 'dashboard' },
    EieTimetableView: { render: () => 'timetable' },
    EieTimetableEditorView: { render: () => 'timetable-editor' },
    EieStudentsView: { render: () => 'students' },
    EieClassroomView: { render: () => 'classroom' },
    EieTeacherView: { render: () => 'teacher' },
    EieManagementView: { render: () => 'management' }
  };
  context.window.window = context.window;
  context.window.document = context.document;
  Object.assign(context.window, {
    EieState: context.EieState,
    EieApp: context.EieApp,
    EieDashboardView: context.EieDashboardView,
    EieTimetableView: context.EieTimetableView,
    EieTimetableEditorView: context.EieTimetableEditorView,
    EieStudentsView: context.EieStudentsView,
    EieClassroomView: context.EieClassroomView,
    EieTeacherView: context.EieTeacherView,
    EieManagementView: context.EieManagementView
  });

  vm.createContext(context);
  vm.runInContext(source, context, { filename: 'eie-router.js' });
  await context.window.EieRouter.boot();
  return rendered.at(-1);
}

(async () => {
  assert.strictEqual(await run('teacher', 'lily'), 'teacher', 'teacher fallback must not open owner dashboard');
  assert.strictEqual(await run('admin', 'admin'), 'dashboard', 'owner fallback should remain dashboard');
  console.log('EIE router role fallback regression test passed');
})().catch(err => {
  console.error(err);
  process.exit(1);
});
