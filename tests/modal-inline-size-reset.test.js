const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const uiSource = fs.readFileSync(path.join(root, 'apmath/js/ui.js'), 'utf8');

const applyMatch = uiSource.match(/function applyModalContent\s*\([^)]*\)\s*\{([\s\S]*?)\n\}/);
assert(applyMatch, 'applyModalContent should exist');

const body = applyMatch[1];

assert(
  body.includes("const contentEl = document.getElementById('modal-content');"),
  'applyModalContent should target the modal content element'
);

assert(body.includes("contentEl.style.width = '';"), 'modal content width should reset between modal opens');
assert(body.includes("contentEl.style.maxWidth = '';"), 'modal content maxWidth should reset between modal opens');
assert(body.includes("bodyEl.style.maxHeight = '';"), 'modal body maxHeight should reset between modal opens');
assert(body.includes("bodyEl.style.overflow = '';"), 'modal body overflow should reset between modal opens');

console.log('modal inline size reset test passed');
