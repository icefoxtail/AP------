const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..', 'archive', 'exams', 'similar');
function listJs(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? listJs(file) : entry.name.endsWith('.js') ? [file] : [];
  });
}

const files = listJs(root);
assert.ok(files.length >= 19, `expected the similar archive corpus, found ${files.length} files`);
for (const file of files) {
  const window = {};
  const document = {};
  const source = fs.readFileSync(file, 'utf8');
  assert.doesNotThrow(() => new Function('window', 'document', source)(window, document), file);
  const data = window.questions || window.questionBank;
  assert.ok(Array.isArray(data), `archive file did not expose a question array: ${file}`);
  assert.ok(data.length > 0, `archive file exposed an empty question array: ${file}`);
}

console.log(`archive mixer loader isolation checks passed (${files.length} files)`);
