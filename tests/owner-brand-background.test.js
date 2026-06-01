const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const apAdmin = fs.readFileSync(path.join(root, 'apmath/js/dashboard-admin.js'), 'utf8');
const apDashboard = fs.readFileSync(path.join(root, 'apmath/js/dashboard.js'), 'utf8');
const apDashboardCss = fs.readFileSync(path.join(root, 'apmath/css/dashboard-foundation.css'), 'utf8');
const eieRouter = fs.readFileSync(path.join(root, 'eie/js/eie-router.js'), 'utf8');
const eieCss = fs.readFileSync(path.join(root, 'eie/css/eie.css'), 'utf8');

assert(
  apAdmin.includes("document.body.classList.add('ap-owner-dashboard-bg')"),
  'AP admin dashboard should mark the body with the AP owner background class'
);

assert(
  apDashboard.includes("document.body.classList.remove('ap-owner-dashboard-bg')"),
  'AP teacher dashboard path should remove the AP owner background class'
);

assert(
  /body\.ap-owner-dashboard-bg\s*\{[\s\S]*#F1F7FF[\s\S]*\}/.test(apDashboardCss),
  'AP owner dashboard background should use the approved pale blue #F1F7FF'
);

assert(
  eieRouter.includes("document.body.classList.toggle('eie-owner-dashboard-bg', nextRoute === 'dashboard')"),
  'EIE router should only apply the EIE owner background on the dashboard route'
);

assert(
  /body\.eie-owner-dashboard-bg\s*\{[\s\S]*#FFF3F2[\s\S]*\}/.test(eieCss),
  'EIE owner dashboard background should use the approved pale coral #FFF3F2'
);

console.log('owner brand background regression test passed');
