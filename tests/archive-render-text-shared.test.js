'use strict';
// 시험지 문자열 처리 순수 함수(archive/render-text.js)를 engine.html과 mixed_engine.html이 같이 쓰는지 지킨다.
// 이유: 같은 이름 함수가 두 HTML에 복사돼 있던 때 한쪽만 고친 사고가 쌓여 같은 문항이 화면마다 다르게 나왔다
// (보기 값이 지워짐, `$<br>$` 글자 노출, 발문 중간 [보기] 상자, 표 안 <보기> 글자 소실 …).
// 입력은 실제 문항에서 뽑아 이 파일에 복사해 두었다(운영 데이터 개수는 고정하지 않는다).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const T = require('../archive/render-text.js');
const tableEngine = require('../archive/js/ap-table-engine.js');
const read = rel => fs.readFileSync(path.join(root, rel), 'utf8');

const MOVED = ['wrapLatex', 'normalizeSolutionLineBreaks', 'extractChoice', 'stripChoicePrefix', 'detectChoiceRenderMode',
  'renderChoicesHTML', 'protectRenderSegments', 'normalizeViewBlocks', 'formatGridAnswer'];
// 공용 파일 안에서만 쓰는 도우미라 HTML에는 아예 없어야 한다.
const HELPERS_ONLY_SHARED = ['normalizeHangulStatementBreaks', 'normalizeConditionMarkerBreaks'];
const ENGINES = ['archive/engine.html', 'archive/mixed_engine.html'];

function withTableEngine(fn) {
  T.setTableEngine(tableEngine);
  try { return fn(); } finally { T.setTableEngine(null); }
}

test('render-text.js는 DOM·window·MathJax에 닿지 않는다', () => {
  const source = read('archive/render-text.js').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  assert.doesNotMatch(source, /\b(?:window|document|MathJax|localStorage|sessionStorage|navigator)\b/);
  assert.deepEqual(MOVED.filter(name => typeof T[name] !== 'function'), []);
});

// ---- 사고별 고정 표본 -------------------------------------------------------------------------

test('줄바꿈: 리터럴 \\n이 LaTeX 명령으로 오인되지 않는다 (옛 mixed: `$<br>$`)', () => {
  // similar/middle/m1/1final/AP수학학원_1학기_기말_중1_기말고사.js 문항 19의 보기
  assert.equal(T.wrapLatex('한 개에 500원인 음료 $x$개의 가격 $y$원\\n'), '한 개에 500원인 음료 $x$개의 가격 $y$원<br>');
  // original/high/h2/2mid/22_효천고_2학기_중간_고2_확률과통계.js 문항 4의 보기(수식 앞 리터럴 \n)
  const out = T.wrapLatex('연속확률변수 $X$에 대하여 아래 등식이 성립한다.\\n$P(a \\le X \\le b) = P(a < X < b)$ (단, $a, b$ 는 실수)');
  assert.ok(out.startsWith('연속확률변수 $X$에 대하여 아래 등식이 성립한다.<br>$P(a \\le X \\le b)'), out);
  assert.doesNotMatch(out, /\$<br>\$|\$&lt;br&gt;\$/);
  assert.match(out, /P\(a &lt; X &lt; b\)\$/);
  // 진짜 TeX 명령 \neq 는 그대로 둔다.
  assert.equal(T.wrapLatex('a \\neq b'), '$a \\neq b$');
});

test('표: 표 안 <보기>는 글자로 남고, 표 트리와 수식은 그대로다 (옛 engine: 글자 소실)', () => {
  // original/high/h2/2mid/19_제일고_2학기_중간_고2_수학II.js 문항 10
  const src = '실수 전체에서 정의된 함수 $f(x), g(x)$에 대하여 다음 중 옳은 설명을 모두 고르면? [4.5점]\n'
    + '<table style="border: 1px solid #000; width: 100%; border-collapse: collapse; margin: 10px 0;"><tr><td style="padding: 10px;">'
    + '<보기><br>ㄱ. $f(x), g(x)$가 $x=a$에서 연속이면 $\\frac{f(x)}{g(x)+1}$는 $x=a$에서 연속이다.<br>ㄴ. $f(x)$이 연속함수이면 $\\{f(x)\\}^3$도 연속함수이다.</td></tr></table>';
  const out = withTableEngine(() => T.wrapLatex(src));
  assert.match(out, /<td[^>]*>&lt;보기&gt;<br>ㄱ\./);
  assert.doesNotMatch(out, /<보기>/);
  assert.match(out, /\$\\frac\{f\(x\)\}\{g\(x\)\+1\}\$/);
  assert.equal((out.match(/<table\b/g) || []).length, 1);
  assert.equal((out.match(/<\/table>/g) || []).length, 1);
  // 속성 값 안의 한글은 건드리지 않는다.
  const withAlt = withTableEngine(() => T.wrapLatex('<table><tr><td><img src="a.png" alt="그림 <보기>"></td></tr></table>'));
  assert.match(withAlt, /<img src="a\.png" alt="그림 &lt;보기&gt;">|<img src="a\.png" alt="그림 <보기>">/);
});

test('표: 파이프 표는 한 덩어리로 보호되고 수식은 조판용으로 남는다', () => {
  const out = withTableEngine(() => T.wrapLatex('문제\n\n| $x$ | $1$ | 합계 |\n| :---: | :---: | :---: |\n| $P(X=x)$ | $\\frac{1}{2}$ | $1$ |\n\n끝'));
  assert.match(out, /^문제<br><br><div class="ap-table-wrap question-table-wrap"><table class="ap-table question-table">/);
  assert.match(out, /\$\\frac\{1\}\{2\}\$/);
  assert.match(out, /<\/div><br>끝$/);
  assert.doesNotMatch(out, /\|/);
});

test('표 안 수식: <, >는 글자로 바뀌고 $ 없는 TeX 명령은 수식이 된다 (표 통째 보호가 놓치던 것)', () => {
  // original/high/h2/2final/23_금당고_2학기_기말_고2_확률과통계.js 문항 11, original/middle/m3/2mid/19_동산중_2학기_중간_중3_수학.js 문항 5
  const out = withTableEngine(() => T.wrapLatex('<table><tr><td>(가) $P(Y < 0)$ $a<b$</td></tr></table>'));
  assert.match(out, /\$P\(Y &lt; 0\)\$ \$a&lt;b\$/);
  assert.doesNotMatch(out, /<b\b/);
  const bare = withTableEngine(() => T.wrapLatex('<table><tr><th>크기(\\mathrm{mm})</th><td>230</td></tr></table>'));
  assert.match(bare, /<th>크기\(\$\\mathrm\{mm\}\$\)<\/th><td>230<\/td>/);
});

test('수식 밖 TeX 명령 바로 뒤의 태그 표지가 하위 첨자로 먹히지 않는다 ($가 짝이 어긋나던 문항)', () => {
  // original/high/h2/1mid/22_팔마고_1학기_중간_고2_수학I.js 문항 6
  const out = T.wrapLatex('<b><보 기></b><br>ㄱ. 60^\\circ = \\frac{\\pi}{3}<br>ㄴ. -135^\\circ = -\\frac{3}{4}\\pi<br>ㄷ. 2\\pi = 180^\\circ');
  assert.match(out, /ㄱ\. 60\^\$\\circ\$ = \$\\frac\{\\pi\}\{3\}\$<br>ㄴ\./);
  for (const math of out.match(/\$[^$]*\$/g) || []) assert.doesNotMatch(math, /<br>/, math);
  assert.equal((out.match(/\$/g) || []).length % 2, 0);
  // 진짜 하위 첨자는 그대로 묶인다.
  assert.equal(T.wrapLatex('값 \\alpha_1 과 \\beta^2 이다'), '값 $\\alpha_1$ 과 $\\beta^2$ 이다');
});

test('인라인 <svg>와 알려진 HTML 요소는 글자(&lt;)로 바뀌지 않는다', () => {
  // original/high/h1/1mid/25_강남여고_1학기_중간_고1_기출.js 문항 16 해설: svg 안 <text>에 $수식$이 있다.
  const svg = '<svg width="160" height="120" viewBox="0 0 160 120"><g stroke="black"><polygon points="60,40 75,25" /></g><text x="82" y="100">중심 겹침 ($x^3$)</text></svg>';
  const out = T.wrapLatex('정육면체이다.<br>' + svg + '\n이 부분($x^{3}$)이 중복이다.');
  assert.ok(out.includes(svg), out);
  assert.doesNotMatch(out, /&lt;\/?(?:svg|g|polygon|text)/);
  assert.match(out, /<\/svg><br>이 부분\(\$x\^\{3\}\$\)/);
  // original/middle/m2/1final/17_연향중_1학기_기말_중2_수학.js 문항 21 등: 목록·center·fieldset·small·h3
  const html = '<div class="box"><ul><li>식을 세운 경우 (2점)</li><li>$x$의 값 (1점)</li></ul></div><center><b>&lt;보 기&gt;</b></center><fieldset><legend>범례</legend>ㄱ</fieldset><small>※ 참고</small><h3>제목</h3>';
  assert.equal(T.wrapLatex(html), html);
  // 비교 부호로 쓴 글자는 여전히 글자다.
  assert.equal(T.wrapLatex('a<b, x<code'), 'a&lt;b, x&lt;code');
});

test('보기 블록: 발문 중간의 [보기]는 상자로 바뀌지 않고, 줄 앞의 [보기]는 상자가 된다', () => {
  // original/high/h1/1mid/20_매산고_1학기_중간_고1_기출.js 문항 13 (옛 mixed: 발문 한가운데가 상자로 잘림)
  const mid = '세 자연수 $a$, $b$, $c$가 등식을 만족시킬 때, [보기]에서 옳은 것만을 있는 대로 고른 것은?<br>'
    + 'ㄱ. $2b+c&gt;a$<br>ㄴ. $a+2b&gt;c^2$<br>ㄷ. $a=b+c=10$이면 $bc=21$이다. [4.7점]';
  const midOut = T.normalizeViewBlocks(mid);
  assert.doesNotMatch(midOut, /<b>보기<\/b>/);
  assert.ok(midOut.startsWith('세 자연수 $a$, $b$, $c$가 등식을 만족시킬 때, [보기]에서 옳은 것만을 있는 대로 고른 것은?<br>'), midOut);
  assert.match(midOut, /<div class="question-note-box">ㄱ\. /);
  const long = 'ㄱ. 가나다라마바사아자차카타파하 가나다라마바사<br>ㄴ. 가나다라마바사아자차카타파하 가나다라마바사<br>ㄷ. 가나다라마바사';
  const lead = T.normalizeViewBlocks('다음 중 옳은 것은?<br><br>[보기]<br>' + long);
  assert.match(lead, /<b>보기<\/b><br>/);
  assert.match(lead, /ㄷ\. 가나다라마바사<\/div>/);
});

test('protectRenderSegments: 표·상자·수식을 보호하고 복원하면 원문과 같다 (토큰 노출 없음)', () => {
  const html = '앞 $x+1$ <div class="question-table-wrap"><table><tr><td>$y$</td></tr></table></div> 뒤 $$z$$ 끝';
  const state = T.protectRenderSegments(html);
  assert.doesNotMatch(state.html, /<table|\$/);
  assert.match(state.html, /__PROTECTED_SEGMENT_\d+__/);
  assert.equal(state.restore(state.html), html);
  assert.doesNotMatch(state.restore(state.html), /__PROTECTED_SEGMENT_/);
});

test('보기 접두: "(1)과", "0.\\dot" 같은 보기 값 앞부분을 지우지 않는다 (옛 mixed: 값이 틀리게 나옴)', () => {
  // original/middle/m2/2mid/24_신흥중_2학기_중간_중2_수학.js 문항 6
  assert.equal(T.stripChoicePrefix('(1)과 (3) : RHS합동'), '(1)과 (3) : RHS합동');
  assert.equal(T.stripChoicePrefix('(4)와 (7) : RHS합동'), '(4)와 (7) : RHS합동');
  // original/middle/m2/1mid/26_동산중_1학기_중간_중2_기출.js 문항 4
  assert.equal(T.stripChoicePrefix('0.\\dot{6}\\dot{1}'), '0.\\dot{6}\\dot{1}');
  assert.equal(T.wrapLatex(T.stripChoicePrefix('0.\\dot{6}\\dot{1}')), '$0.\\dot{6}\\dot{1}$');
  // 진짜 접두는 지운다.
  for (const [input, expected] of [['① 3', '3'], ['(1) 3', '3'], ['2) 7', '7'], ['1. 가', '가'], ['1.5', '1.5']]) {
    assert.equal(T.stripChoicePrefix(input), expected, input);
  }
  assert.equal(T.extractChoice({ answer: '값' }), '값');
  assert.equal(T.extractChoice(null), '');
});

test('보기 그리기: choiceColumns와 preserveChoicePrefixes를 따른다', () => {
  const grid = T.renderChoicesHTML({ choices: ['1', '2', '3', '4', '5'], choiceColumns: 5 });
  assert.match(grid, /^<div class="choices choices-grid" style="grid-template-columns:repeat\(5, minmax\(0, 1fr\)\)">/);
  const kept = T.renderChoicesHTML({ choices: ['① 1', '② 2'], preserveChoicePrefixes: true });
  assert.match(kept, /<span class="choice-text">① 1<\/span>/);
  const stripped = T.renderChoicesHTML({ choices: ['① 1', '② 2'] });
  assert.match(stripped, /<span class="choice-text">1<\/span>/);
  assert.equal(T.renderChoicesHTML({ choices: ['주관식'] }), '<div class="answer-box"></div>');
  assert.equal(T.renderChoicesHTML({ choices: ['a'], choicesEmbeddedInImage: true }), '');
  // mixed가 넘기는 보기 변환 훅(여는 $ 하나를 닫아 준다)
  const hooked = T.renderChoicesHTML({ choices: ['$x'] }, { formatChoice: value => (value.startsWith('$') ? value + '$' : value) });
  assert.match(hooked, /<span class="choice-text">\$x\$<\/span>/);
});

test('정답표: 문항 번호 (2)는 수식이 되지 않고 분수만 묶는다', () => {
  // original/high/h2/1final/19_매산여고_1학기_기말_고2_수학I.js 문항 20
  assert.equal(T.formatGridAnswer('(1) m+n=19. (2) y=26/7. (3) p-q=-85.'),
    '(1) m+n=19. (2) y=<span class="ans-atomic">26/7</span>. (3) p-q=-85.');
  assert.equal(T.formatGridAnswer('(1) 3 / (2) 4'), '(1) 3<br>(2) 4');
  // 수식 안의 분수는 건드리지 않는다.
  assert.equal(T.formatGridAnswer('$1/2$'), '$1/2$');
  assert.equal(T.formatGridAnswer(null), '–');
  // $ 없이 쓴 TeX 명령이 든 정답은 통째로 수식이 되므로 분수 span을 넣지 않는다 (original/high/h2/2mid/16_매산고_2학기_중간_고2_기하와벡터_기출.js 문항 17)
  assert.equal(T.formatGridAnswer('\\dfrac{4x^2}{27}+\\dfrac{(y-1/2)^2}{9}=1'), '$\\dfrac{4x^2}{27}+\\dfrac{(y-1/2)^2}{9}=1$');
});

test('해설 줄바꿈: [학생용 보강] 바로 뒤 \\n은 영문자가 이어져도 줄바꿈이고 \\neq는 그대로다', () => {
  assert.equal(T.normalizeSolutionLineBreaks('[학생용 보강]\\nABC와 \\neq 그리고 \\n끝'), '[학생용 보강]\nABC와 \\neq 그리고 \n끝');
});

// ---- 두 엔진이 같은 함수를 부른다 -----------------------------------------------------------

for (const file of ENGINES) {
  test(`${file}: 공용 함수의 본문 복사본이 없고 한 줄 위임뿐이다`, () => {
    const html = read(file);
    assert.match(html, /<script src="render-text\.js\?v=[^"]+"><\/script>/, '공용 파일을 불러와야 한다');
    assert.ok(html.indexOf('render-text.js') > html.indexOf('js/ap-table-engine.js'), '표 엔진 뒤에 불러온다');
    const lines = html.split('\n');
    for (const name of MOVED) {
      const declarations = lines.filter(line => new RegExp(`^\\s*(?:async\\s+)?function\\s+${name}\\s*\\(`).test(line));
      assert.ok(declarations.length <= 1, `${file}: ${name} 선언이 여러 개`);
      for (const line of declarations) {
        assert.match(line, new RegExp(`^function ${name}\\([^)]*\\) \\{ return APRenderText\\.${name}\\([^)]*(?:\\{[^}]*\\})?[^)]*\\); \\}$`),
          `${file}: ${name}은 APRenderText.${name} 한 줄 위임이어야 한다 (본문 복사 금지)`);
      }
    }
    for (const name of HELPERS_ONLY_SHARED) {
      assert.doesNotMatch(html, new RegExp(`function\\s+${name}\\s*\\(`), `${file}: ${name}은 공용 파일에만 둔다`);
    }
    // 공용 함수 안에서만 쓰는 표지 토큰이 HTML에 남아 있으면 본문이 복사된 것이다.
    assert.doesNotMatch(html, /__WRAP_STRUCTURAL_BLOCK_|__HTMLTAG_|__HANGUL_STATEMENT_|__CONDITION_/);
  });
}

test('두 HTML의 위임 한 줄이 실제로 공용 함수 결과를 그대로 돌려준다', () => {
  const samples = {
    wrapLatex: ['a\\nb $x<y$', '한 개에 500원 $x$개\\n'],
    normalizeSolutionLineBreaks: ['[학생용 보강]\\nABC'],
    extractChoice: [{ text: 'x' }, '① 1'],
    stripChoicePrefix: ['(1)과 (3)', '① 3'],
    detectChoiceRenderMode: [['1', '2'], ['가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하', '2']],
    normalizeViewBlocks: ['앞 [보기]에서 고른다.<br>ㄱ. a<br>ㄴ. b'],
    formatGridAnswer: ['(1) 3/16, (2) 4']
  };
  for (const file of ENGINES) {
    const shells = read(file).split('\n').filter(line => MOVED.some(name => line.startsWith(`function ${name}(`)));
    const context = vm.createContext({ APRenderText: T, window: {} });
    vm.runInContext(shells.join('\n') + `\nthis.__shells = { ${MOVED.join(', ')} };`, context);
    for (const [name, inputs] of Object.entries(samples)) {
      for (const input of inputs) {
        assert.deepEqual(context.__shells[name](input), T[name](input), `${file} ${name}`);
      }
    }
    const q = { choices: ['① 1', '② 2'], choiceColumns: 2 };
    assert.equal(context.__shells.renderChoicesHTML(q), T.renderChoicesHTML(q), `${file} renderChoicesHTML`);
    const state = context.__shells.protectRenderSegments('a $x$ b');
    assert.equal(state.restore(state.html), 'a $x$ b');
  }
});

test('render-text.js는 아카이브 배포 목록과 CI 범위에 올라 있다', () => {
  const manifest = JSON.parse(read('tools/archive-pages-release-manifest.json'));
  assert.ok(manifest.archiveRootFiles.includes('render-text.js'), 'archive-pages-release-manifest.json archiveRootFiles');
  assert.match(read('tools/ci/archive-ci-scope.mjs'), /'archive\/render-text\.js'/);
});

// ---- 본문 앞 문항 번호 제거 ("15. 15. 다음 …" 두 번 찍힘) ---------------------------------------
// 원본 시험지 일부는 본문이 "15. 다음 …"처럼 번호로 시작하고 엔진이 q-num을 따로 붙인다.
// 원본 파일은 그대로 두고 그리는 단계에서만 원래 번호(q.id)와 같은 앞 번호를 뗀다.

test('앞 문항 번호: 원래 번호와 같은 "N." 또는 "N)" + 공백 + 본문일 때만 뗀다', () => {
  const strip = T.stripLeadingQuestionNumber;
  // original/middle/m3/1final/16_창포중_1학기_기말_중3_수학.js 문항 15 (본문이 <p>로 시작)
  assert.equal(strip('<p>15. 다음 $9$개 자료의 중앙값을 $a$</p>', { id: 15 }), '<p>다음 $9$개 자료의 중앙값을 $a$</p>');
  assert.equal(strip('15. 다음 중 옳은 것은?', { id: 15 }), '다음 중 옳은 것은?');
  assert.equal(strip('5) 다음 중 옳은 것은?', { id: 5 }), '다음 중 옳은 것은?');
  assert.equal(strip('  <br>16.\n이차함수', { id: '16' }), '  <br>이차함수');
  // 영문 한두 글자가 붙은 id (original/middle/m1/1final/19_동산중_1학기_기말_중1_수학.js 의 "Q22")
  assert.equal(strip('22. (서술형 1) (4점)<br>일차방정식', { id: 'Q22' }), '(서술형 1) (4점)<br>일차방정식');
  // 번호가 다르면(서술형 번호가 1부터 다시 시작하는 original/high/h1/2mid/25_제일고_2학기_중간_고1_기출.js 문항 id 19의 "1.") 그대로 둔다.
  assert.equal(strip('1. 집합 $X$에서', { id: 19 }), '1. 집합 $X$에서');
  // 번호가 아닌 것: 소수, 점 뒤 공백 없음, 수식 안, 본문이 없음, 번호가 맨 앞이 아님
  assert.equal(strip('15.5 이하의 수', { id: 15 }), '15.5 이하의 수');
  assert.equal(strip('15.다음', { id: 15 }), '15.다음');
  assert.equal(strip('$15.$ 다음', { id: 15 }), '$15.$ 다음');
  assert.equal(strip('15. ', { id: 15 }), '15. ');
  assert.equal(strip('다음 15. 번', { id: 15 }), '다음 15. 번');
  assert.equal(strip('서술형 1. 다음', { id: 1 }), '서술형 1. 다음');
  // id가 번호가 아니거나 없으면 건드리지 않는다.
  assert.equal(strip('15. 다음', { id: 'abc-15x' }), '15. 다음');
  assert.equal(strip('15. 다음', {}), '15. 다음');
  assert.equal(strip('15. 다음', null), '15. 다음');
  assert.equal(strip(undefined, { id: 15 }), undefined);
  // 한 번만 뗀다(본문 첫 줄이 번호와 같은 숫자로 다시 시작해도 하나만).
  assert.equal(strip('15. 15. 다음', { id: 15 }), '15. 다음');
});

test('앞 문항 번호: 실제 시험지 한 개에서 번호로 시작하는 문항은 번호만 떨어지고 나머지는 그대로다', () => {
  const file = path.join(root, 'archive/exams/original/middle/m3/1final/16_창포중_1학기_기말_중3_수학.js');
  const context = vm.createContext({});
  context.window = context;
  vm.runInContext(fs.readFileSync(file, 'utf8'), context);
  let stripped = 0;
  for (const q of context.examData.questions) {
    const raw = String(q.content || q.question || '');
    const out = T.stripLeadingQuestionNumber(raw, q);
    const lead = /^((?:<p[^>]*>\s*)?)(\d{1,3})\.\s+/.exec(raw);
    if (lead && Number(lead[2]) === Number(q.id)) {
      stripped += 1;
      assert.equal(out, lead[1] + raw.slice(lead[0].length), `id ${q.id}: 번호만 떨어져야 한다`);
    } else {
      assert.equal(out, raw, `id ${q.id}: 번호로 시작하지 않으면 그대로`);
    }
  }
  assert.ok(stripped > 0, '이 시험지에는 번호로 시작하는 문항이 있어야 한다');
});

for (const file of ENGINES) {
  test(`${file}: formatQuestionContent가 렌더 사본에서만 앞 번호를 뗀다`, () => {
    const html = read(file);
    const start = html.indexOf('function formatQuestionContent(html, q) {');
    assert.ok(start >= 0, 'formatQuestionContent 선언');
    const body = html.slice(start, html.indexOf('\n}\n', start));
    assert.match(body, /html = APRenderText\.stripLeadingQuestionNumber\(html, q\);/);
    assert.ok(body.indexOf('stripLeadingQuestionNumber') < body.indexOf('__apExamSubjectiveSpacing'), '발문 분리보다 먼저 뗀다');
    // 저장·지문 계산 쪽으로 새지 않는다: HTML에서는 formatQuestionContent 안에서 한 번만 부른다.
    assert.equal((html.match(/stripLeadingQuestionNumber/g) || []).length, 1, `${file}: 다른 곳에서 부르지 않는다`);
  });
}
