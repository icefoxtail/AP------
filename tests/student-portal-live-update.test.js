const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'apmath', 'student', 'index.html'), 'utf8');
const sw = fs.readFileSync(path.join(root, 'apmath', 'student', 'sw.js'), 'utf8');

assert(
  html.includes("navigator.serviceWorker.register('./sw.js', { updateViaCache: 'none' })"),
  'student portal should bypass the HTTP cache when checking its service worker'
);
assert(
  html.includes("navigator.serviceWorker.addEventListener('controllerchange'") &&
    html.includes('window.location.reload()'),
  'student portal should reload once a new service worker takes control'
);
assert(
  html.includes("window.addEventListener('pageshow', refreshStudentPortalUpdate)") &&
    html.includes("document.addEventListener('visibilitychange'") &&
    html.includes('30 * 1000'),
  'installed student portal should recheck for updates when resumed and while open'
);
assert(
  sw.includes("fetch(req, { cache: 'no-store' })"),
  'student portal navigation should bypass the browser HTTP cache before using its offline fallback'
);

console.log('student portal live update checks passed');
