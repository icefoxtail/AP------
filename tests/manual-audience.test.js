const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const dataSource = fs.readFileSync(path.join(root, 'manual', 'manual-data.js'), 'utf8');
const manualSource = fs.readFileSync(path.join(root, 'manual', 'manual.js'), 'utf8');

const context = { window: {} };
vm.createContext(context);
vm.runInContext(dataSource, context);

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

assert.match(manualSource, /audience:\s*'teacher'/, 'manual state should default to teacher audience');
assert.match(manualSource, /renderAudiences/, 'manual UI should render audience mode controls');
assert.match(manualSource, /section\.audience/, 'manual filtering should read section audience metadata');
