const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const dashboardPath = path.join(__dirname, '..', 'apmath', 'js', 'dashboard.js');
const dashboardSource = fs.readFileSync(dashboardPath, 'utf8');

const today = new Date().toLocaleDateString('sv-SE');
const context = {
    console,
    navigator: {},
    document: {},
    state: {
        db: {
            students: [{ id: 's-test', name: 'Test Student', status: 'active' }],
            classes: [{ id: 'class-a', name: 'Class A' }],
            class_students: [{ student_id: 's-test', class_id: 'class-a' }],
            consultations: [{
                id: 'c-test',
                student_id: 's-test',
                date: today,
                type: 'grade',
                content: 'Needs algebra follow-up before finals.',
                next_action: 'Call parent this week.',
                created_at: `${today} 09:00:00`
            }]
        },
        ui: {}
    },
    toast() {},
    showModal() {}
};

vm.createContext(context);
vm.runInContext(dashboardSource, context);

const html = context.renderAdminRecentConsultationPanel();
const renderAdminNewStudentPanel = context.renderAdminNewStudentPanel;

assert.match(html, /Test Student/);
assert.match(html, /Class A/);
assert.match(html, /grade/);
assert.match(html, /Needs algebra follow-up before finals\./);
assert.match(html, /Call parent this week\./);

context.renderAppDrawer = function renderAppDrawer() {};
context.document = {
    getElementById(id) {
        if (id !== 'app-root') return null;
        return this.root;
    },
    root: { innerHTML: '' }
};
context.adminBuildOverviewData = function adminBuildOverviewData() {
    return {};
};
context.renderAdminStudentOverviewPanel = function renderAdminStudentOverviewPanel() {
    return '<section data-test-section="overview"></section>';
};
context.renderAdminTeacherCards = function renderAdminTeacherCards() {
    return '<article data-test-section="teacher-card"></article>';
};
context.renderAdminRecentConsultationPanel = function renderAdminRecentConsultationPanel() {
    return '<section data-test-section="recent-consultation"></section>';
};
context.renderAdminNeedCheckPanel = function renderAdminNeedCheckPanel() {
    return '<section data-test-section="need-check"></section>';
};
context.renderAdminNewStudentPanel = function renderAdminNewStudentPanel() {
    return '<section data-test-section="recent-students"><span>최근 14일 0명</span></section>';
};
context.renderAdminGlobalSearchPanel = function renderAdminGlobalSearchPanel() {
    return '<section data-test-section="global-search"><input placeholder="학생 · 반 · 학교 · 시험 · 자료 검색"></section>';
};

context.renderAdminControlCenter();
const dashboardHtml = context.document.root.innerHTML;

const teacherIndex = dashboardHtml.indexOf('data-test-section="teacher-card"');
const consultationIndex = dashboardHtml.indexOf('data-test-section="recent-consultation"');
const recentStudentsIndex = dashboardHtml.indexOf('data-test-section="recent-students"');
const needCheckIndex = dashboardHtml.indexOf('data-test-section="need-check"');
const scheduleIndex = dashboardHtml.indexOf('주간일정');
const globalSearchIndex = dashboardHtml.indexOf('data-test-section="global-search"');

assert.ok(teacherIndex !== -1, 'teacher section should render');
assert.ok(consultationIndex !== -1, 'recent consultation section should render');
assert.ok(recentStudentsIndex !== -1, 'recent students section should render');
assert.ok(needCheckIndex !== -1, 'need-check section should render');
assert.ok(scheduleIndex !== -1, 'weekly schedule section should render');
assert.ok(globalSearchIndex !== -1, 'global search section should render');
assert.match(dashboardHtml, /학생 · 반 · 학교 · 시험 · 자료 검색/, 'top global search placeholder should render');
assert.match(dashboardHtml, /최근 14일 0명/, 'recent students label should use 14-day copy');
assert.doesNotMatch(dashboardHtml, /전체 검색/, 'legacy bottom global search title should not render');
assert.doesNotMatch(dashboardHtml, /최근 30일/, 'legacy 30-day copy should not render');
assert.doesNotMatch(dashboardHtml, />원장님</, 'admin dashboard body should not render static admin label');
assert.ok(globalSearchIndex < teacherIndex, 'global search should render in the top dashboard header');
assert.ok(teacherIndex < consultationIndex, 'recent consultation should render below teacher status');
assert.ok(consultationIndex < scheduleIndex, 'weekly schedule should render below recent consultation');
assert.ok(consultationIndex < recentStudentsIndex, 'recent students should render below recent consultation');
assert.ok(recentStudentsIndex < needCheckIndex, 'need-check should render below recent students');

const recentStudents = Array.from({ length: 12 }, (_, index) => ({
    id: `recent-${index}`,
    name: `Recent ${index}`,
    status: '재원',
    created_at: `${today} 09:${String(index).padStart(2, '0')}:00`
}));
context.state.db.students = recentStudents;
context.state.db.classes = [{ id: 'class-a', name: 'Class A' }];
context.state.db.class_students = recentStudents.map(s => ({ student_id: s.id, class_id: 'class-a' }));
context.state.db.attendance = [];
context.state.db.homework = [];
context.state.db.exam_sessions = [];
const recentPanelHtml = renderAdminNewStudentPanel({
    recentStudents,
    todayTime: Date.now()
});
assert.match(recentPanelHtml, /최근 14일 12명/, 'recent students header should show total 14-day count');
assert.strictEqual((recentPanelHtml.match(/ap-admin-recent-student-row/g) || []).length, 10, 'recent students list should render at most 10 rows');
assert.doesNotMatch(recentPanelHtml, /최근 30일/, 'recent students panel should not use 30-day copy');
