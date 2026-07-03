const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

for (const file of ['archive/engine.html', 'archive/mixed_engine.html']) {
  const html = fs.readFileSync(path.join(root, file), 'utf8');
  assert(
    html.includes('\\x3C/script></body></html>`);'),
    `${file} should hide the print-window closing script tag from the outer HTML parser`
  );
  assert(
    !html.includes('<\\/script></body></html>`);'),
    `${file} should not rely on literal <\\/script> in the outer script template`
  );
}

console.log('archive engine print script escape test passed');
