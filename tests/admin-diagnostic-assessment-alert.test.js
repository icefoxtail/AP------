const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const adminPath = path.join(root, 'apmath', 'js', 'dashboard-admin.js');
const dashboardPath = path.join(root, 'apmath', 'js', 'dashboard.js');
const teacherPath = path.join(root, 'apmath', 'js', 'dashboard-teacher.js');

const adminJs = fs.readFileSync(adminPath, 'utf8');
const dashboardJs = fs.readFileSync(dashboardPath, 'utf8');
const teacherJs = fs.readFileSync(teacherPath, 'utf8');

[
  'AP_ADMIN_DIAGNOSTIC_RESULTS_LIST_KEY',
  'apms.diagnostic.assessment.results',
  'apms.diagnostic.assessment.result.',
  'apGetAdminDiagnosticAssessmentAlerts',
  'apRenderAdminDiagnosticAssessmentAlert',
  'apBuildAdminDiagnosticReportUrl',
  "item?.status === 'completed'",
  'diagnostic-report',
  'diagnosticId',
  'packId',
  'slice(0, AP_ADMIN_DIAGNOSTIC_ALERT_LIMIT)',
  'AP_ADMIN_DIAGNOSTIC_ALERT_LIMIT = 3',
  '결과표 열기',
  '진단평가 결과',
  '최근 진단평가',
  '이름 미입력',
].forEach((marker) => {
  assert(adminJs.includes(marker), `dashboard-admin.js should include diagnostic admin alert marker: ${marker}`);
});

assert(
  adminJs.includes("apAdminDashboardRole() !== 'admin'") &&
    adminJs.includes('apRemoveAdminDiagnosticAssessmentAlert()'),
  'diagnostic assessment alert should be removed outside admin dashboard role'
);

assert(
  /new URLSearchParams\(\)/.test(adminJs) &&
    /params\.set\('packId'/.test(adminJs) &&
    /params\.set\('diagnosticId'/.test(adminJs) &&
    /params\.set\('mode', 'diagnostic-report'\)/.test(adminJs),
  'diagnostic report URL should be built with encoded query params'
);

assert(
  /updatedAt[\s\S]*completedAt|completedAt[\s\S]*updatedAt/.test(adminJs),
  'diagnostic alert ordering should consider updatedAt/completedAt'
);

assert(
  !teacherJs.includes('진단평가 결과') &&
    !teacherJs.includes('apGetAdminDiagnosticAssessmentAlerts') &&
    !teacherJs.includes('diagnostic assessment alert'),
  'teacher dashboard should not expose diagnostic assessment alert UI'
);

[
  'assessment_analysis_snapshots',
  'assessment_report_snapshots',
  'premium AI',
  '프리미엄 AI',
  '학부모 발송',
  '/api/diagnostic',
  'fetch(',
].forEach((forbidden) => {
  assert(!adminJs.includes(forbidden), `dashboard-admin.js should not include forbidden implementation marker: ${forbidden}`);
  assert(!dashboardJs.includes(forbidden), `dashboard.js should not include forbidden implementation marker: ${forbidden}`);
});

console.log('admin diagnostic assessment alert checks passed');
