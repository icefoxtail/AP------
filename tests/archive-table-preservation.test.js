const test = require('node:test');
const assert = require('node:assert/strict');
// wrapLatex 본문은 engine.html·mixed_engine.html이 같이 쓰는 archive/render-text.js에 있다.
const { wrapLatex } = require('../archive/render-text.js');

test('Archive wrapLatex preserves structured table HTML while leaving its math for final MathJax typesetting', () => {
  const source = '표<br><div class="question-table-wrap"><table><tr><td>$a$</td></tr></table></div>';
  const result = wrapLatex(source);
  assert.match(result, /question-table-wrap/);
  assert.match(result, /<table>/);
  assert.match(result, /\$a\$/);
});
