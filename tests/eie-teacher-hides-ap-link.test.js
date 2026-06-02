const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const index = fs.readFileSync(path.join(root, 'eie/index.html'), 'utf8');
const app = fs.readFileSync(path.join(root, 'eie/js/eie-app.js'), 'utf8');

assert(index.includes('id="eie-apmath-link"'), 'AP MATH drawer link should have a stable id');
assert(index.includes('eie-owner-only-link'), 'AP MATH drawer link should be marked owner-only');
assert(app.includes('apmathLink.hidden = isEieTeacherSession()'), 'teacher sessions should hide the AP MATH drawer link');

console.log('EIE teacher AP link visibility test passed');
