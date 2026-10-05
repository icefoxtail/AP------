const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const dataSource = fs.readFileSync(path.join(root, 'manual', 'manual-data.js'), 'utf8');
const reportRefreshSource = fs.readFileSync(path.join(root, 'manual', 'manual-data-20260711.js'), 'utf8');
const fullRefreshSource = fs.readFileSync(path.join(root, 'manual', 'manual-data-20260813.js'), 'utf8');
const manualSource = fs.readFileSync(path.join(root, 'manual', 'manual.js'), 'utf8');
const manualIndexSource = fs.readFileSync(path.join(root, 'manual', 'index.html'), 'utf8');

const context = { window: {} };
vm.createContext(context);
vm.runInContext(dataSource, context);
vm.runInContext(reportRefreshSource, context);
vm.runInContext(fullRefreshSource, context);

const data = context.window.APMATH_MANUAL_DATA;

assert.ok(Array.isArray(data.audiences), 'manual data should define audience modes');
assert.strictEqual(
    JSON.stringify(data.audiences.map(item => item.id)),
    JSON.stringify(['teacher', 'admin', 'all']),
    'manual should expose teacher, admin, and all modes'
);

const validAudienceIds = new Set(data.audiences.map(item => item.id).filter(id => id !== 'all'));
const sectionCategories = new Set();

for (const section of data.sections) {
    sectionCategories.add(section.category);
    assert.ok(Array.isArray(section.audience), `${section.id} should declare audience`);
    assert.ok(section.audience.length > 0, `${section.id} should have at least one audience`);
    for (const audienceId of section.audience) {
        assert.ok(validAudienceIds.has(audienceId), `${section.id} has invalid audience ${audienceId}`);
    }
}

for (const category of sectionCategories) {
    assert.ok(data.categories.includes(category), `category tab is missing ${category}`);
}

const teacherOnlyIds = data.sections
    .filter(section => section.audience.includes('teacher') && !section.audience.includes('admin'))
    .map(section => section.id);
const adminOnlyIds = data.sections
    .filter(section => section.audience.includes('admin') && !section.audience.includes('teacher'))
    .map(section => section.id);
const sharedIds = data.sections
    .filter(section => section.audience.includes('teacher') && section.audience.includes('admin'))
    .map(section => section.id);

assert.ok(teacherOnlyIds.includes('classroom-main'), 'teacher mode should include teacher-only classroom guidance');
assert.ok(adminOnlyIds.includes('admin-dashboard-overview'), 'admin mode should include admin dashboard guidance');
assert.ok(sharedIds.includes('manual-search-direct'), 'common guidance should be shared by both modes');
assert.ok(sharedIds.includes('student-portal-teacher-preview-current'), 'teacher preview guidance should be visible to operational roles');
assert.ok(teacherOnlyIds.includes('clinic-print-center-current'), 'teacher mode should document the current clinic center');
assert.ok(adminOnlyIds.includes('admin-operations-current'), 'admin mode should document the current operations center');
assert.ok(data.categories.includes('학생 포털'), 'manual should expose the student portal category');
assert.ok(data.categories.includes('운영·설정'), 'manual should expose operations and sync guidance');
assert.match(data.updatedAt, /2026-08-13/, 'manual refresh date should match the latest full audit');
assert.match(manualIndexSource, /manual-data-20260813\.js/, 'manual page should load the latest full refresh data');

const sectionIds = new Set(data.sections.map(section => section.id));
const jumpIds = Array.from(manualSource.matchAll(/\{ id: '([^']+)', title:/g), match => match[1]);
for (const jumpId of jumpIds) {
    assert.ok(sectionIds.has(jumpId), `quick link should point to an existing section: ${jumpId}`);
}

const currentSurfaceIds = [
    'student-management-current',
    'student-detail-current',
    'class-management-current',
    'student-portal-teacher-preview-current',
    'student-portal-exam-list-current',
    'student-portal-login-current',
    'daily-journal-current',
    'memo-current',
    'textbook-management-current',
    'clinic-print-center-current',
    'timetable-operations-current',
    'discharged-students-current',
    'schedule-period-exam-current',
    'system-sync-current',
    'admin-operations-current',
    'admin-diagnostic-pin-current'
];
for (const sectionId of currentSurfaceIds) {
    assert.ok(sectionIds.has(sectionId), `full refresh should cover current AP Math surface: ${sectionId}`);
}

assert.match(manualSource, /audience:\s*'teacher'/, 'manual state should default to teacher audience');
assert.match(manualSource, /renderAudiences/, 'manual UI should render audience mode controls');
assert.match(manualSource, /section\.audience/, 'manual filtering should read section audience metadata');
