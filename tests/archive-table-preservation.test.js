const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const engine = fs.readFileSync(path.join(__dirname, '..', 'archive', 'engine.html'), 'utf8');

function extractFunction(name) {
  const start = engine.indexOf(`function ${name}(`);
  assert.notEqual(start, -1, `${name} must exist`);
  const end = engine.indexOf('\nfunction ', start + 1);
  return engine.slice(start, end === -1 ? engine.length : end);
}

test('Archive wrapLatex preserves structured table HTML while leaving its math for final MathJax typesetting', () => {
  const wrapLatex = new Function(extractFunction('wrapLatex') + '; return wrapLatex;')();
  const source = '표<br><div class="question-table-wrap"><table><tr><td>$a$</td></tr></table></div>';
  const result = wrapLatex(source);
  assert.match(result, /question-table-wrap/);
  assert.match(result, /<table>/);
  assert.match(result, /\$a\$/);
});
