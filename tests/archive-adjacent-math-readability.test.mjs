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

test('q43 is a self-contained arithmetic-progression table question', () => {
  const q = question(
    loadQuestionBank('archive/exams/types/middle/m1/중1_1학기_정수와유리수의덧셈과뺄셈.js'),
    43,
  );

  assert.match(q.content, /<div class="question-table-wrap"><table class="question-table">/);
  assert.match(q.content, /<td>2<\/td><td>5<\/td><td>8<\/td>/);
  assert.match(q.content, /<td>4<\/td><td>7<\/td><td>□<\/td>/);
  assert.match(q.content, /<td>6<\/td><td>□<\/td><td>12<\/td>/);
  assert.deepEqual(Array.from(q.choices), ['15', '17', '19', '21', '23']);
  assert.equal(q.answer, '③');
  assert.match(q.solution, /빈칸.*10/);
  assert.match(q.solution, /빈칸.*9/);
  assert.match(q.solution, /합.*19/);
});

test('q50 separates the two independent equations with one semantic break', () => {
  const q = question(
    loadQuestionBank('archive/exams/types/middle/m1/중1_1학기_정수와유리수의덧셈과뺄셈.js'),
    50,
  );

  assert.match(q.content, /\$\(-3\)\+a=-5\$<br>\$\(-4\)\+b=-2\$/);
});
