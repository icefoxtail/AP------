const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const dashboard = fs.readFileSync(path.join(root, 'eie/js/views/eie-dashboard.js'), 'utf8');

assert(
  dashboard.includes('function renderRecentConsultationPanel'),
  'EIE owner dashboard should render a real recent consultation panel'
);

assert(
  !dashboard.includes('renderRecentConsultationPlaceholder()'),
  'EIE owner dashboard should not keep the recent consultation placeholder'
);

assert(
  dashboard.includes('openDashboardConsultationStudent') &&
    dashboard.includes("EieStudentsView.openDetail(studentId, { route: 'dashboard' }, 'consultation')"),
  'recent consultation rows should open the matching student detail consultation tab'
);

assert(
  dashboard.includes('EieApi.getConsultations') ||
    dashboard.includes('currentState.db?.consultations'),
  'dashboard should use existing EIE consultation data/API without adding a new route'
);

assert(
  !dashboard.includes("data-eie-route=\"consultation\""),
  'dashboard should not introduce a standalone consultation route'
);

console.log('EIE dashboard consultation connection regression test passed');
