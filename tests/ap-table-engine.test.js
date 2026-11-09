const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const { renderApTables, extractTableCells } = require(path.join(root, 'archive', 'js', 'ap-table-engine.js'));
const examsRoot = path.join(root, 'archive', 'exams');

function loadBank(file) {
  const w = {};
  vm.runInContext(fs.readFileSync(file, 'utf8'), vm.createContext({ window: w }), { timeout: 5000 });
  return w.questionBank || [];
}
function original(rel) { return path.join(examsRoot, 'original', ...rel.split('/')); }
function field(rel, id, key) {
  const q = loadBank(original(rel)).find(x => String(x.id) === String(id));
  assert.ok(q, `${rel} qid ${id}`);
  assert.equal(typeof q[key], 'string', `${rel} qid ${id} ${key}`);
  return q[key];
}
function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out); else if (e.name.endsWith('.js')) out.push(p);
  }
  return out;
}
function stringsOf(v, out = []) {
  if (typeof v === 'string') out.push(v);
  else if (Array.isArray(v)) v.forEach(x => stringsOf(x, out));
  else if (v && typeof v === 'object') Object.values(v).forEach(x => stringsOf(x, out));
  return out;
}
const PIPE_ROW = /^\s*\|.*\|\s*(\[[\d.]+점\])?\s*$/;
function residualPipeRows(html) {
  const outside = String(html).replace(/<table\b[\s\S]*?<\/table>/gi, '');
  const lines = outside.split(/\r?\n|\\n(?![a-zA-Z])|<br\s*\/?>/i);
  const bad = [];
  for (let i = 0; i < lines.length - 1; i++) if (PIPE_ROW.test(lines[i]) && PIPE_ROW.test(lines[i + 1])) bad.push(lines[i].slice(0, 80));
  return bad;
}
const count = (s, re) => (s.match(re) || []).length;

test('pipe table with math header, label column and separator becomes one canonical table (19 매산여고 확률과통계)', () => {
  const src = field('high/h2/2mid/19_매산여고_2학기_중간_고2_확률과통계.js', 4, 'content');
  const out = renderApTables(src);
  assert.equal(count(out, /<table\b/g), 1);
  assert.match(out, /<div class="ap-table-wrap question-table-wrap"><table class="ap-table question-table">/);
  assert.equal(count(out, /<th scope="col">/g), 5);
  assert.match(out, /<th scope="row">\$P\(X=x\)\$<\/th>/);
  assert.match(out, /<td>\$\\frac\{1\}\{5\}\$<\/td>/);
  assert.doesNotMatch(out, /:---|\n\|/);
  assert.deepEqual(residualPipeRows(out), []);
  assert.match(out, /다음과 같다\.\n\n<div class="ap-table-wrap/);
  assert.match(out, /<\/div>\n\$E\(2X\+1\)\$/, 'exactly one separator after the table, not two');
});

test('two tables separated by a blank line stay two tables', () => {
  const src = field('high/h2/2mid/19_매산여고_2학기_중간_고2_확률과통계.js', 7, 'content');
  const out = renderApTables(src);
  assert.equal(count(out, /<table\b/g), 2);
  assert.deepEqual(residualPipeRows(out), []);
});

test('no separator row still yields a table whose first row is the header (25 금당고 확률과통계)', () => {
  for (const id of [2, 6, 13, 15, 19]) {
    const src = field('high/h2/2final/25_금당고_2학기_기말_고2_확률과통계.js', id, 'content');
    assert.ok(!/:?-{3,}/.test(src.split('\n').filter(l => /^\s*\|/.test(l)).join('\n')), 'fixture has no separator row');
    const out = renderApTables(src);
    assert.ok(count(out, /<table\b/g) >= 1, `qid ${id}`);
    assert.ok(count(out, /<th scope="col">/g) >= 2, `qid ${id}`);
    assert.deepEqual(residualPipeRows(out), [], `qid ${id}`);
  }
});

test('trailing [x.x점] on the last row is moved out of the table (22 효천고 수학I)', () => {
  for (const id of [3, 4]) {
    const src = field('high/h2/1mid/22_효천고_1학기_중간_고2_수학I.js', id, 'content');
    assert.match(src, /\|\s*\[\d\.\d점\]/);
    const out = renderApTables(src);
    assert.match(out, /<\/table><\/div> \[\d\.\d점\]/, `qid ${id}: score tag follows the table block`);
    assert.doesNotMatch(out, /<t[dh][^>]*>[^<]*\[\d\.\d점\]/, `qid ${id}: score tag is not inside a cell`);
  }
});

test('one-cell separator row is recognised as a separator and dropped (17 경북대도중 qid 25)', () => {
  for (const key of ['question', 'content']) {
    const src = field('middle/m3/1final/17_경북대도중_1학기_기말_중3_수학.js', 25, key);
    assert.match(src, /\| :---: \|\n/);
    const out = renderApTables(src);
    assert.equal(count(out, /<table\b/g), 1);
    assert.equal(count(out, /<th scope="col">/g), 8);
    assert.doesNotMatch(out, /:---/);
    assert.match(out, /<th scope="row">편차\(시간\)<\/th>/);
    assert.match(out, /<td>\$a\$<\/td>/);
  }
});

test('rows separated by <br> (no newlines) become a table without splitting in-cell content (25 연향중)', () => {
  const src = field('middle/m2/1mid/25_연향중_1학기_중간_중2_기출.js', 7, 'content');
  assert.ok(!/\n/.test(src) && /<br>\|:---:/.test(src));
  const out = renderApTables(src);
  assert.equal(count(out, /<table\b/g), 1);
  assert.equal(count(out, /<th scope="col">/g), 3);
  assert.equal(count(out, /<td>/g), 2);
  assert.match(out, /\[4점\]<br><br><div class="ap-table-wrap/);
  assert.match(out, /\$2\^\{10\}\$ B/);
});

test('empty cells are preserved and comparison signs in text/math are escaped', () => {
  const out = renderApTables('표\n\n| 상담실 이용경험 | 1학년 | 2학년 | 합계 |\n| 있음 | 24 |  |  |\n| 없음 |  | 49 |  |\n| 합계 |  |  | 150 |\n');
  assert.equal(count(out, /<td><\/td>/g), 6);
  const sign = renderApTables('| 구분 | 값 |\n| <첫 번째> | $a<b$ |');
  assert.match(sign, /<td>&lt;첫 번째&gt;<\/td><td>\$a&lt;b\$<\/td>/);
});

test('one-column consecutive rows become a one-column table; an empty header row is dropped', () => {
  const box = renderApTables('보기\n| 대화 내용 |\n| :--- |\n| A : 첫째 |\n| B : 둘째 |\n끝');
  assert.equal(count(box, /<table\b/g), 1);
  assert.equal(count(box, /<tr>/g), 3);
  const grid = renderApTables('| | | |\n| :--- | :--- | :--- |\n| ㉠ $x$ | ㉡ $y$ | ㉢ $z$ |\n| ㉣ $p$ | ㉤ $q$ | ㉥ $r$ |');
  assert.equal(count(grid, /<th\b/g), 0, 'no header row made of empty cells');
  assert.equal(count(grid, /<tr>/g), 2);
});

test('false positives: absolute values, single pipe lines and math-only pipes never become tables', () => {
  const cases = [
    '답: |x|<3',
    '\\[\n|4x+3y-11|=|3x-4y-2|\n\\]\n를 만족한다.',
    '$|x-1|=2$ 이고\n$|x+1|=4$ 이다.',
    '첫째 줄\n| 한 줄짜리 |\n끝',
    '\\[\n|x-y|=2<3=|x-z|\n\\]',
    '$$\n|a|\n|b|\n$$',
  ];
  for (const c of cases) assert.equal(renderApTables(c), c, c);
});

test('escaped hard-break backslashes around a pipe table are tolerated', () => {
  const out = renderApTables('점수의 평균이 70점일 때? (4점)\\\n| 학생 | 형규 | 민서 |\\\n| 편차(점) | -4 | $a$ |');
  assert.equal(count(out, /<table\b/g), 1);
  assert.doesNotMatch(out, /\\\n|\)\\</);
});

test('literal backslash-n line separators work and \\neq is not a separator', () => {
  const out = renderApTables('앞\\n| a | b |\\n| 1 | $x\\neq y$ |\\n뒤');
  assert.equal(count(out, /<table\b/g), 1);
  assert.match(out, /\$x\\neq y\$/);
});

test('HTML tables: style/border/width/cellpadding are stripped, colspan/rowspan/scope kept, wrapper added', () => {
  const src = '<table class="exam-table" border="1" cellpadding="4" cellspacing="0" style="width:90%;border-collapse:collapse"><colgroup><col width="40"><col></colgroup>' +
    '<tr style="background:#eee"><th colspan="2" style="width:30px;border:1px solid red" align="center">제목</th></tr>' +
    '<tr><td rowspan="2" class="px-2 border-r">가</td><td bgcolor="#fff">$a$</td></tr><tr><td scope="row">나</td></tr></table>';
  const out = renderApTables(src);
  assert.match(out, /^<div class="ap-table-wrap question-table-wrap"><table class="ap-table question-table">/);
  assert.doesNotMatch(out, /style=|border=|width=|cellpadding|cellspacing|align=|bgcolor|<col|exam-table|px-2/);
  assert.match(out, /<th colspan="2">제목<\/th>/);
  assert.match(out, /<td rowspan="2">가<\/td>/);
  assert.equal(count(out, /<table\b/g), 1);
});

test('legacy wrapper div is upgraded in place, not nested; bare and class-less tables are classed', () => {
  const legacy = renderApTables('<div class="question-table-wrap"><table class="question-table"><tr><td>1</td></tr></table></div>');
  assert.equal(legacy, '<div class="ap-table-wrap question-table-wrap"><table class="ap-table question-table"><tr><td>1</td></tr></table></div>');
  const bare = renderApTables('앞<table><tr><td>1</td></tr></table>뒤');
  assert.equal(bare, '앞<div class="ap-table-wrap question-table-wrap"><table class="ap-table question-table"><tr><td>1</td></tr></table></div>뒤');
  const escaped = renderApTables('<table class=\\"question-table\\"><tr><td>1</td></tr></table>');
  assert.match(escaped, /<table class="ap-table question-table">/);
});

test('long Korean cells are marked ap-cell-text and 7+ column tables ap-table-wide; square grids keep a usable size class', () => {
  const longCell = renderApTables('<table><tr><td>이것은 열두 글자를 넘는 설명 문장입니다</td><td>짧음</td></tr></table>');
  assert.match(longCell, /<td class="ap-cell-text">/);
  assert.match(longCell, /<td>짧음<\/td>/);
  const wide = renderApTables('| a | b | c | d | e | f | g |\n| 1 | 2 | 3 | 4 | 5 | 6 | 7 |');
  assert.match(wide, /class="ap-table question-table ap-table-wide"/);
  const grid = renderApTables("<table><tr><td style='width:45px; height:45px;'> </td></tr></table>");
  assert.match(grid, /ap-table-grid/);
});

test('renderApTables is idempotent on pipe, HTML and mixed input', () => {
  const samples = [
    field('high/h2/2mid/19_매산여고_2학기_중간_고2_확률과통계.js', 14, 'content'),
    field('middle/m2/1mid/25_연향중_1학기_중간_중2_기출.js', 7, 'content'),
    field('high/h2/1mid/22_효천고_1학기_중간_고2_수학I.js', 3, 'content'),
    '<div class="question-table-wrap"><table class="exam-table" style="x"><tr><th>가</th><td colspan="2">나</td></tr></table></div>',
    "표<table style='width:1px'><tr><td style='width:45px; height:45px;'>1</td></tr></table>\n\n| a | b |\n| 1 | 2 |",
    '',
    '표 없음',
  ];
  for (const s of samples) {
    const once = renderApTables(s);
    assert.equal(renderApTables(once), once);
  }
});

test('extractTableCells: cell texts survive conversion and normalisation unchanged', () => {
  const html = '<table class="exam-table" border="1" style="x"><tr><th style="y">$a<b$</th><td>&lt;가&gt; &amp; 나</td></tr><tr><td colspan="2"><b>굵게</b> 글</td></tr></table>';
  const before = extractTableCells(html);
  assert.deepEqual(before, ['$a<b$', '<가> & 나', '굵게 글']);
  assert.deepEqual(extractTableCells(renderApTables(html)), before);
  const pipe = field('high/h2/2mid/19_매산여고_2학기_중간_고2_확률과통계.js', 7, 'content');
  const pipeBefore = extractTableCells(pipe);
  assert.equal(pipeBefore.length, 18);
  assert.deepEqual(extractTableCells(renderApTables(pipe)), pipeBefore);
});

test('regression: every pipe-table string in the 11 확률과통계 audit files converts, keeps its cells, leaves no pipe rows', () => {
  const rels = [
    'high/h2/1mid/23_팔마고', 'high/h2/2mid/19_매산여고', 'high/h2/2mid/19_복성고', 'high/h2/2mid/20_매산고', 'high/h2/2mid/20_매산여고',
    'high/h2/2mid/20_제일고', 'high/h2/2mid/22_복성고', 'high/h2/2mid/22_순천고', 'high/h2/2mid/22_효천고', 'high/h2/2mid/23_순천고',
    'high/h2/2final/25_금당고',
  ];
  let converted = 0;
  for (const prefix of rels) {
    const dir = path.dirname(original(prefix));
    const base = path.basename(prefix);
    const file = fs.readdirSync(dir).find(f => f.startsWith(base + '_') && f.endsWith('확률과통계.js'));
    assert.ok(file, `audit file ${prefix}`);
    for (const q of loadBank(path.join(dir, file))) {
      for (const s of stringsOf(q)) {
        const out = renderApTables(s);
        assert.deepEqual(residualPipeRows(out), [], `${file} qid ${q.id}`);
        if (out !== s && /(^|\n)\s*\|/.test(s)) {
          converted++;
          assert.ok(/<table class="ap-table question-table/.test(out), `${file} qid ${q.id}`);
          assert.deepEqual(extractTableCells(out), extractTableCells(s), `${file} qid ${q.id} cells`);
        }
      }
    }
  }
  assert.ok(converted > 0, 'the audit files contain pipe tables');
});

test('whole archive: after renderApTables no string under archive/exams has residual pipe-table rows, cells are kept, output is stable', () => {
  const problems = [];
  for (const file of walk(examsRoot)) {
    let bank;
    try { bank = loadBank(file); } catch { continue; }
    for (const q of bank) {
      for (const s of stringsOf(q)) {
        if (s.indexOf('|') === -1 && !/<table/i.test(s)) continue;
        const out = renderApTables(s);
        const rel = path.relative(examsRoot, file) + ' qid ' + q.id;
        const res = residualPipeRows(out);
        if (res.length) problems.push(rel + ' residual: ' + res[0]);
        if (out !== s) {
          if (renderApTables(out) !== out) problems.push(rel + ' not idempotent');
          const a = JSON.stringify(extractTableCells(s)), b = JSON.stringify(extractTableCells(out));
          if (a !== b) problems.push(rel + ' cell text changed');
          if (/<table\b(?![^>]*class="ap-table question-table)/i.test(out)) problems.push(rel + ' table without canonical class');
          if (/<table\b[^>]*\b(style|border|width)=/i.test(out)) problems.push(rel + ' table keeps style/border/width');
        }
      }
    }
  }
  assert.deepEqual(problems.slice(0, 10), []);
});

test('engine.html and mixed_engine.html load the module and stylesheet and call it from wrapLatex', () => {
  for (const name of ['engine.html', 'mixed_engine.html']) {
    const html = fs.readFileSync(path.join(root, 'archive', name), 'utf8');
    assert.match(html, /<script src="js\/ap-table-engine\.js\?v=[^"]+"><\/script>/, name);
    assert.match(html, /<link rel="stylesheet" href="css\/ap-table\.css\?v=[^"]+">/, name);
    assert.match(html, /globalThis\.ApTableEngine\.renderApTables\(s\)/, name);
    assert.match(html, /typeof globalThis !== 'undefined' && globalThis\.ApTableEngine/, name);
  }
  assert.ok(fs.existsSync(path.join(root, 'archive', 'js', 'ap-table-engine.js')));
  assert.ok(fs.existsSync(path.join(root, 'archive', 'css', 'ap-table.css')));
});

test('wrapLatex (engine.html) with the engine loaded: pipe table survives typesetting prep and math stays intact', () => {
  const engine = fs.readFileSync(path.join(root, 'archive', 'engine.html'), 'utf8');
  const start = engine.indexOf('function wrapLatex(');
  const wrapLatex = new Function(engine.slice(start, engine.indexOf('\nfunction ', start + 1)) + '; return wrapLatex;')();
  const before = globalThis.ApTableEngine;
  globalThis.ApTableEngine = { renderApTables };
  try {
    const out = wrapLatex('문제\n\n| $x$ | $1$ | 합계 |\n| :---: | :---: | :---: |\n| $P(X=x)$ | $\\frac{1}{2}$ | $1$ |\n\n끝');
    assert.match(out, /^문제<br><br><div class="ap-table-wrap question-table-wrap"><table class="ap-table question-table">/);
    assert.match(out, /\$\\frac\{1\}\{2\}\$/);
    assert.match(out, /<\/div><br>끝$/);
    assert.doesNotMatch(out, /\|/);
    assert.equal(wrapLatex(wrapLatex('| a | b |\n| 1 | 2 |').replace(/<br>/g, '\n')).match(/<table\b/g).length, 1);
  } finally {
    if (before === undefined) delete globalThis.ApTableEngine; else globalThis.ApTableEngine = before;
  }
});
