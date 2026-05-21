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
