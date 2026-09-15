import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';

function loadQuestionBank(relativePath) {
  const context = { window: {} };
  const filePath = new URL(`../${relativePath}`, import.meta.url);
  vm.runInNewContext(fs.readFileSync(filePath, 'utf8'), context, { filename: filePath.pathname });
  return context.window.questionBank;
}

function question(bank, id) {
  const result = bank.find(item => item.id === id);
  assert.ok(result, `question id ${id} should exist`);
  return result;
}

test('q39 separates independent sign-rule formulas with one semantic break', () => {
  const q = question(
    loadQuestionBank('archive/exams/types/middle/m1/중1_1학기_정수와유리수.js'),
    39,
  );

  assert.equal((q.content.match(/\$<br>\$/g) || []).length, 7);
  assert.match(q.content, /\\text\{양수\}\)\s*\\times/);
  assert.match(q.content, /\\text\{음수\}\)\s*\\div/);
});

test('q43 keeps short values on one line with a stable inline gap', () => {
  const q = question(
    loadQuestionBank('archive/exams/types/middle/m1/중1_1학기_정수와유리수의덧셈과뺄셈.js'),
    43,
  );

  assert.match(
    q.content,
    /\$2\$<span style="display:inline-block;width:0\.7em;" aria-hidden="true"><\/span>\$5\$/,
  );
});

test('q50 separates the two independent equations with one semantic break', () => {
  const q = question(
    loadQuestionBank('archive/exams/types/middle/m1/중1_1학기_정수와유리수의덧셈과뺄셈.js'),
    50,
  );

  assert.match(q.content, /\$\(-3\)\+a=-5\$<br>\$\(-4\)\+b=-2\$/);
});
