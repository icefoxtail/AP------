const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');

const { checkHtml, resolveFiles, residualPipeRows } = require(path.join(__dirname, '..', 'tools', 'check-ap-tables.cjs'));

const rules = (src) => checkHtml(src).map(f => f.rule);
const has = (src, rule) => rules(src).includes(rule);

// Each rule: a minimal fixture that must fire, and a correct one that must not (defect conditions, not archive counts).

test('ROW_COL_MISMATCH: unequal column counts fire, colspan/rowspan accounting does not', () => {
  assert.ok(has('<table><tr><th>a</th><th>b</th></tr><tr><td>1</td></tr></table>', 'ROW_COL_MISMATCH'));
  assert.ok(has('<table><tr><td colspan="2">a</td></tr><tr><td>1</td></tr></table>', 'ROW_COL_MISMATCH'));
  assert.ok(!has('<table><tr><td colspan="2">a</td></tr><tr><td>1</td><td>2</td></tr></table>', 'ROW_COL_MISMATCH'));
  assert.ok(!has('<table><tr><td rowspan="2">a</td><td>1</td></tr><tr><td>2</td></tr></table>', 'ROW_COL_MISMATCH'));
  assert.ok(!has('| 구분 | 값 |\n| --- | --- |\n| 가 | $1$ |\n| 나 | $2$ |', 'ROW_COL_MISMATCH'));
});

test('RESIDUAL_PIPE_ROW: unconverted pipe rows fire, abs values and prose pipes do not', () => {
  // a GFM separator (>= 3 dashes) without outer pipes is converted by the engine now; a 2-dash separator is not GFM and stays visible
  assert.ok(!has('구분 | 우진 | 수빈\n---|---|---\n성인 | 2 | 1', 'RESIDUAL_PIPE_ROW'));
  assert.ok(has('구분 | 우진 | 수빈\n--|--|--\n성인 | 2 | 1', 'RESIDUAL_PIPE_ROW'));
  assert.deepEqual(residualPipeRows('<div>x</div>\n| a | b |\n| c | d |'), ['| a | b |', '| c | d |']);
  assert.ok(!has('| a | b |\n|---|---|\n| 1 | 2 |', 'RESIDUAL_PIPE_ROW'), 'a converted table leaves nothing behind');
  assert.ok(!has('$|x-1|<2$ 일 때 $|a|+|b|$ 의 값은?\n<table><tr><td>1</td></tr></table>', 'RESIDUAL_PIPE_ROW'));
  assert.ok(!has('<table><tr><td>a | b</td></tr></table>', 'RESIDUAL_PIPE_ROW'));
});

test('PAREN_MATH_IN_CELL: \\( \\) in a cell fires, $…$ does not', () => {
  assert.ok(has('<table><tr><th>x</th></tr><tr><td>\\(\\frac{1}{2}\\)</td></tr></table>', 'PAREN_MATH_IN_CELL'));
  assert.ok(!has('<table><tr><th>x</th></tr><tr><td>$\\frac{1}{2}$</td></tr></table>', 'PAREN_MATH_IN_CELL'));
  // a pipe table cell is normalised to $…$ by the engine, so it is already fit for students
  assert.ok(!has('| a | b |\n| --- | --- |\n| \\(x\\) | $1$ |', 'PAREN_MATH_IN_CELL'));
});

test('UNBALANCED_DOLLAR: odd $ fires, $$ pairs and escaped \\$ do not', () => {
  assert.ok(has('| a | b |\n| --- | --- |\n| $x | 1 |', 'UNBALANCED_DOLLAR'));
  assert.ok(!has('| a | b |\n| --- | --- |\n| $x$ | 1 |', 'UNBALANCED_DOLLAR'));
  assert.ok(!has('| a | b |\n| --- | --- |\n| $$x$$ | 1 |', 'UNBALANCED_DOLLAR'));
  assert.ok(!has('<table><tr><th>a</th></tr><tr><td>100\\$</td></tr></table>', 'UNBALANCED_DOLLAR'));
});

test('EMPTY_HEADER: all-empty header fires, a header with text or a blank corner cell does not', () => {
  assert.ok(has('<table><thead><tr><th></th><th></th></tr></thead><tbody><tr><td>1</td><td>2</td></tr></tbody></table>', 'EMPTY_HEADER'));
  assert.ok(has('<table><tr><th>&nbsp;</th><th> </th></tr><tr><td>1</td><td>2</td></tr></table>', 'EMPTY_HEADER'));
  assert.ok(!has('<table><tr><th></th><th>4</th><th>5</th></tr><tr><th>1.0</th><td>1</td><td>2</td></tr></table>', 'EMPTY_HEADER'));
  assert.ok(!has('<table><tr><td>1</td><td>2</td></tr><tr><td>3</td><td>4</td></tr></table>', 'EMPTY_HEADER'), 'no header at all is not an empty header');
});

test('SLASH_FRACTION_OUTSIDE_MATH: 1/6 in a cell fires; $\\frac{1}{6}$, math slash and dates do not', () => {
  assert.ok(has('| x | $P$ |\n| --- | --- |\n| $1$ | 1/6 |', 'SLASH_FRACTION_OUTSIDE_MATH'));
  assert.ok(has('| x | $P$ |\n| --- | --- |\n| $1$ | 3 / 8 |', 'SLASH_FRACTION_OUTSIDE_MATH'));
  assert.ok(!has('| x | $P$ |\n| --- | --- |\n| $1$ | $\\frac{1}{6}$ |', 'SLASH_FRACTION_OUTSIDE_MATH'));
  assert.ok(!has('| x | $P$ |\n| --- | --- |\n| $1$ | $1/6$ |', 'SLASH_FRACTION_OUTSIDE_MATH'));
  assert.ok(!has('| 날짜 | 값 |\n| --- | --- |\n| 2024/11/09 | $3$ |', 'SLASH_FRACTION_OUTSIDE_MATH'));
  // prose outside any table is not this rule's business
  assert.deepEqual(rules('확률은 1/6 이다.'), []);
});

test('BARE_MATH_VARIABLE_HEADER: bare X / P(X=x) / E(X) fire; $…$, A–F labels, names and Hangul do not', () => {
  assert.ok(has('| X | 0 | 1 |\n| --- | --- | --- |\n| 개수 | $1$ | $2$ |', 'BARE_MATH_VARIABLE_HEADER'));
  assert.ok(has('| 구분 | $0$ | $1$ |\n| --- | --- | --- |\n| P(X=x) | $\\frac{1}{2}$ | $\\frac{1}{2}$ |', 'BARE_MATH_VARIABLE_HEADER'));
  assert.ok(has('| 구분 | 값 |\n| --- | --- |\n| E(X) | $2$ |', 'BARE_MATH_VARIABLE_HEADER'));
  assert.ok(has('| 구분 | 값 |\n| --- | --- |\n| P(0≤Z≤z) | $0.2$ |', 'BARE_MATH_VARIABLE_HEADER'));
  assert.ok(has('| 구분 | 값 |\n| --- | --- |\n| V(X) | $2$ |', 'BARE_MATH_VARIABLE_HEADER'));
  assert.ok(has('| z | 1 | 2 |\n| --- | --- | --- |\n| 값 | 3 | 4 |', 'BARE_MATH_VARIABLE_HEADER'));
  assert.ok(has('| 구분 | 값 |\n| --- | --- |\n| 2X | $2$ |', 'BARE_MATH_VARIABLE_HEADER'));

  assert.ok(!has('| $X$ | $0$ | $1$ |\n| --- | --- | --- |\n| $P(X=x)$ | $\\frac{1}{2}$ | $\\frac{1}{2}$ |', 'BARE_MATH_VARIABLE_HEADER'));
  assert.ok(!has('| 구분 | A | B | C |\n| --- | --- | --- | --- |\n| 점수 | 80 | 90 | 70 |', 'BARE_MATH_VARIABLE_HEADER'), 'A/B/C are names');
  assert.ok(!has('| 구분 | 합계 |\n| --- | --- |\n| A | 3 |\n| F | 4 |', 'BARE_MATH_VARIABLE_HEADER'));
  assert.ok(!has('| 구분 | 값 |\n| --- | --- |\n| 평균 | 3 |\n| 분산 | 4 |', 'BARE_MATH_VARIABLE_HEADER'));
  assert.ok(!has('| 구분 | 값 |\n| --- | --- |\n| pt | 3 |', 'BARE_MATH_VARIABLE_HEADER'), 'a latin word is not a variable');
  assert.ok(!has('| 구분 | 값 |\n| --- | --- |\n| 합격 | 3 |', 'BARE_MATH_VARIABLE_HEADER'));
});

test('a lone variable letter only counts when its row or column holds math values', () => {
  // letter next to prose only: conservative, do not fire
  assert.ok(!has('| 기호 | 뜻 |\n| --- | --- |\n| n | 학생 수를 나타낸다 |', 'BARE_MATH_VARIABLE_HEADER'));
});

test('a correct table produces no finding at all', () => {
  const ok = '다음 표는 확률변수 $X$의 확률분포표이다.\n\n| $X$ | $0$ | $1$ | 합계 |\n| :---: | :---: | :---: | :---: |\n| $P(X=x)$ | $\\frac{1}{3}$ | $\\frac{2}{3}$ | $1$ |\n\n$E(X)$의 값은? [4점]';
  assert.deepEqual(checkHtml(ok), []);
  assert.deepEqual(checkHtml('표가 없는 글. $|x|<1$ 이고 1/2 이다.'), []);
  assert.deepEqual(checkHtml(''), []);
  assert.deepEqual(checkHtml(null), []);
});

test('--files specs: fragment, glob and directory resolve to exam files', () => {
  const root = path.join(__dirname, '..');
  const all = [
    path.join(root, 'archive', 'exams', 'original', 'high', 'h2', '2final', '25_금당고_2학기_기말_고2_확률과통계.js'),
    path.join(root, 'archive', 'exams', 'original', 'high', 'h2', '2mid', '19_매산여고_2학기_중간_고2_확률과통계.js'),
    path.join(root, 'archive', 'exams', 'original', 'middle', 'm3', '1final', '17_경북대도중_1학기_기말_중3_수학.js')
  ];
  assert.equal(resolveFiles(['h2/2final/25_금당고_2학기_기말_고2_확률과통계'], all).length, 1);
  assert.equal(resolveFiles(['archive/exams/original/high/**/*확률과통계.js'], all).length, 2);
  assert.equal(resolveFiles(['original/middle/**'], all).length, 1);
  assert.equal(resolveFiles(['no/such/file'], all).length, 0);
});
