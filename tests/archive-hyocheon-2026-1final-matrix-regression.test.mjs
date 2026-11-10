import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const sourceUrl = new URL('../archive/exams/original/high/h1/1final/26_효천고_1학기_기말_고1_기출.js', import.meta.url);
const unit = [[1, 0], [0, 1]];

function bank() {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(sourceUrl, 'utf8'), context, { filename: sourceUrl.pathname });
  return context.window.questionBank;
}

function matrixFromCubeCondition(content) {
  const prefix = 'A^3-B^3=\\begin{pmatrix}';
  const start = content.indexOf(prefix);
  assert.ok(start >= 0, 'Q17: the displayed A³−B³ matrix must exist');
  const end = content.indexOf('\\end{pmatrix}', start);
  assert.ok(end > start, 'Q17: the given matrix must have a closing delimiter');
  const entries = content.slice(start + prefix.length, end).split(/&|\\\\/).map(Number);
  assert.equal(entries.length, 4, 'Q17: must have four numeric matrix entries');
  assert.ok(entries.every(Number.isFinite));
  return [[entries[0], entries[1]], [entries[2], entries[3]]];
}

const multiply = (a, b) => a.map(row => b[0].map((_, j) => row.reduce((total, value, k) => total + value * b[k][j], 0)));
const add = (a, b) => a.map((row, i) => row.map((value, j) => value + b[i][j]));
const subtract = (a, b) => a.map((row, i) => row.map((value, j) => value - b[i][j]));
const scale = (a, scalar) => a.map(row => row.map(value => value * scalar));
const approximatelyEqual = (a, b) => a.flat().every((value, i) => Math.abs(value - b.flat()[i]) < 1e-9);
const factorial = n => Array.from({ length: n }, (_, i) => i + 1).reduce((product, next) => product * next, 1);

test('2026 효천고 1기말 Q17: real 2×2 matrices exist and answer ① remains 9', () => {
  const q = bank().find(item => item.id === 17);
  assert.ok(q);
  const given = matrixFromCubeCondition(q.content);
  const product = scale(subtract(given, unit), 1 / 3);
  assert.ok(approximatelyEqual(multiply(product, product), scale(product, 4)), 'AB must satisfy (AB)² = 4AB for this constructive witness');

  // For C=AB and C²=4C, choose B=tC, A=B+I; 4t²+t=1.
  const t = (Math.sqrt(17) - 1) / 8;
  const B = scale(product, t);
  const A = add(B, unit);
  assert.ok(approximatelyEqual(subtract(A, B), unit));
  assert.ok(approximatelyEqual(multiply(A, B), product));
  assert.ok(approximatelyEqual(subtract(multiply(multiply(A, A), A), multiply(multiply(B, B), B)), given));
  assert.equal(product.flat().reduce((sum, entry) => sum + entry), 9);
  assert.equal(q.choices[0], '$9$');
  assert.equal(q.answer, '①');
});

test('2026 효천고 1기말 Q25: factorial denominator and minimum even n=10', () => {
  const q = bank().find(item => item.id === 25);
  assert.ok(q);
  assert.ok(q.solution.includes('\\dfrac{1}{9!}'), 'y must equal 1/(9!)');
  assert.ok(!q.solution.includes('\\frac{1}{9}!'), 'factorial must not escape the fraction denominator');
  for (const n of [4, 6, 8]) assert.ok(!Number.isInteger(Math.sqrt(n - 1)));
  const n = 10, x = 3, y = 1 / factorial(9);
  assert.equal(factorial(n - 1) * y, 1);
  assert.equal(-x * x + n * factorial(n - 1) * y, 1);
  assert.equal(q.answer, '$10$');
});
