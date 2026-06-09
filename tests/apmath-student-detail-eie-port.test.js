const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'apmath/js/student.js'), 'utf8');

assert(
  source.includes('.apms-eie-detail-head') &&
    source.includes('.apms-eie-profile-grid') &&
    source.includes('.apms-eie-field-grid') &&
    source.includes('.apms-eie-tabs') &&
    source.includes('.apms-eie-contact-row'),
  'AP Math student detail should include EIE-style detail panel layout classes'
);

assert(
  source.includes('function renderApmsStudentProfileDeck') &&
    source.includes('function renderApmsStudentStatusBadge') &&
    source.includes('function renderApmsStudentField') &&
    source.includes('getApmsStudentClassRows'),
  'AP Math student detail should render EIE-style status, field, class, and contact summaries from AP data'
);

assert(
  source.includes('<div class="apms-eie-detail-head">') &&
    source.includes('renderApmsStudentProfileDeck(s, cls)') &&
    source.includes('class="apms-eie-tabs"') &&
    source.includes('class="apms-eie-tab ${tab===') &&
    source.includes('apms-eie-detail">${headerHtml}${tabBarHtml}${bodyHtml}${footerHtml}</div>'),
  'AP Math student detail modal should use the EIE-style header, profile deck, tabs, and body wrapper'
);

assert(
  source.includes("openReportCenterModal==='function'") &&
    source.includes('openEditStudent') &&
    source.includes('renderStudentDetailTab') &&
    source.includes('renderGradeTab') &&
    source.includes('renderWeakTab') &&
    source.includes('renderCnsTab'),
  'existing AP Math student detail actions and tabs should remain wired'
);

assert(
  source.includes('@media (max-width:640px)') &&
    source.includes('.apms-eie-profile-grid,') &&
    source.includes('.apms-eie-field-grid,') &&
    source.includes('.apms-eie-form-grid { grid-template-columns:1fr; }'),
  'EIE-style student detail should have mobile layout guards'
);

assert(
  source.includes('.apms-eie-form-card') &&
    source.includes('.apms-eie-form-grid') &&
    source.includes('.apms-eie-form-field') &&
    source.includes('.apms-eie-form-flags') &&
    source.includes('.apms-eie-form-danger'),
  'AP Math student edit modal should include EIE-style form layout classes'
);

assert(
  source.includes('<div class="apms-student-contrast apms-student-form-view apms-eie-form">') &&
    source.includes('<section class="apms-eie-form-card">') &&
    source.includes('<label class="apms-eie-form-field"><span>이름</span><input id="edit-name"') &&
    source.includes('<label class="apms-eie-form-field"><span>배정 반</span><select id="edit-class"') &&
    source.includes('id="edit-is-new"') &&
    source.includes('handleEditStudent(sid)'),
  'student edit modal should render the EIE-style labeled form while preserving existing edit field ids and save handler'
);

console.log('AP Math student detail EIE port checks passed');
