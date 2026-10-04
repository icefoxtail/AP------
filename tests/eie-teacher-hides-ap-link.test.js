const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const index = fs.readFileSync(path.join(root, 'eie/index.html'), 'utf8');
const app = fs.readFileSync(path.join(root, 'eie/js/eie-app.js'), 'utf8');

assert(!index.includes('id="eie-apmath-link"'), 'EIE drawer should not render an AP MATH drawer link');
assert(!index.includes('href="../apmath/index.html"'), 'EIE drawer should remove the AP MATH navigation link for every role');
assert(!index.includes('<span class="eie-drw-label">AP MATH</span>'), 'EIE drawer footer should not expose AP MATH text');
assert(!app.includes('apmathLink'), 'EIE app should not carry AP MATH link visibility logic after removing the link');

console.log('EIE AP link removal test passed');
