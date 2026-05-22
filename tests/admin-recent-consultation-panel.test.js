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
    return '<section data-test-section="recent-students"></section>';
};
context.renderAdminGlobalSearchPanel = function renderAdminGlobalSearchPanel() {
    return '<section data-test-section="global-search"></section>';
};

context.renderAdminControlCenter();
const dashboardHtml = context.document.root.innerHTML;

const teacherIndex = dashboardHtml.indexOf('data-test-section="teacher-card"');
const consultationIndex = dashboardHtml.indexOf('data-test-section="recent-consultation"');
const scheduleIndex = dashboardHtml.indexOf('주간일정');
const globalSearchIndex = dashboardHtml.indexOf('data-test-section="global-search"');

assert.ok(teacherIndex !== -1, 'teacher section should render');
assert.ok(consultationIndex !== -1, 'recent consultation section should render');
assert.ok(scheduleIndex !== -1, 'weekly schedule section should render');
assert.ok(globalSearchIndex !== -1, 'global search section should render');
assert.ok(teacherIndex < consultationIndex, 'recent consultation should render below teacher status');
assert.ok(consultationIndex < scheduleIndex, 'weekly schedule should render below recent consultation');
assert.ok(scheduleIndex < globalSearchIndex, 'weekly schedule should render directly above global search area');
