import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]):/, '$1:')), '..');
const runRoot = path.join(repoRoot, 'archive', '_generated', 'nightly-h1-2sem', '20260908');
const BS = String.fromCharCode(92);
const tex = (value) => value.replaceAll('§', BS);

const patches = {
  '23_중앙여고_2학기_기말_고1_기출': {
    7: { answer: '④', solution: '분자를 $2x+k-7=2(x-1)+(k-5)$로 쓴다. 점근선은 $x=1$, $y=2$이고, 제3사분면을 지나지 않으려면 왼쪽 가지의 최솟값 조건에서 $k=1,2,3,4,5,6,7$이 가능하다. 따라서 자연수는 7개이고 정답은 ④이다.', reviewStatus: 'source_checked', reviewReason: [] },
    9: { answer: '④', solution: '정의역은 $x§le3$, 치역은 $y§ge-1$이다. $y=§sqrt{-2x}$를 오른쪽으로 3, 아래로 1만큼 평행이동한 그래프이므로 ㄱ, ㄴ이 참이다. 그래프는 제3사분면을 지나지 않으므로 ㄷ은 거짓이고, 역함수는 $y=-§dfrac12(x+1)^2+3$ $(x§ge-1)$이므로 ㄹ도 참이다. 따라서 ㄱ, ㄴ, ㄹ인 ④이다.', reviewStatus: 'source_checked', reviewReason: [] },
  },
  '23_한영고_2학기_중간_고1_기출': {
    11: { answer: '②', solution: '명제가 거짓이 되려면 어떤 실수 $x$에 대하여 $x^2+3x+a<0$이어야 한다. 이차식의 최솟값은 $a-§dfrac94$이므로 $a<§dfrac94$이다. 정수 $a$의 최댓값은 2이고 정답은 ②이다.', reviewStatus: 'source_checked', reviewReason: [] },
  },
  '24_중앙여고_2학기_기말_고1_기출': {
    8: { solution: '일대일 함수는 $5P_4=120$개이다. 증가 조건은 5개의 값 중 4개를 고르는 $\\binom54=5$개이므로 합은 $125$이고 정답은 ⑤이다.', reviewStatus: 'source_checked', reviewReason: [] },
    10: { answer: '②', solution: '$f(x)=x^2-3x$는 $x§ge a§ge§dfrac32$에서 증가한다. $X=[a,§infty)$에서 $X$로의 일대일대응이 되려면 최솟값 $f(a)$가 $a$와 같아야 하므로 $a^2-3a=a$이다. $a§ge§dfrac32$이므로 $a=4$이고 정답은 ②이다.', reviewStatus: 'source_checked', reviewReason: [] },
    16: { answer: '⑤', solution: '남교사가 모두 한 명씩 일어나는 경우는 6명의 일어나는 순서를 정하는 $6!=720$가지이다. 남교사 중 두 명이 함께 일어나는 경우는 함께 일어날 남교사 2명을 고르는 $§binom32$가지, 남은 5개 사건의 순서를 정하는 $5!$가지이므로 $3§times5!=360$가지이다. 합은 $720+360=1080$이고 정답은 ⑤이다.', reviewStatus: 'source_checked', reviewReason: [] },
  },
  '23_한영고_2학기_기말_고1_기출': {
    4: { content: '조합에서 ${}_nC_2=36$을 만족시키는 자연수 $n$의 값은? [3.8점]', choices: ['7', '8', '9', '10', '11'], answer: '③', solution: '${}_nC_2=36$에서 $n(n-1)/2=36$이므로 $n^2-n-72=0$이다. 자연수 해는 $n=9$이므로 정답은 ③이다.', reviewStatus: 'source_checked', reviewReason: [] },
    '단답형1': { answer: '정의역은 $\\mathbb{R}$, 치역은 $\\{y\\mid y\\le1\\}$', solution: '$y=-x^2+1$은 모든 실수 $x$에서 정의되고, 꼭짓점에서 최댓값 1을 가지므로 치역은 $y\\le1$이다.', reviewStatus: 'source_checked', reviewReason: [] },
  },
  '24_여양고_2학기_기말_고1_기출': {
    8: { content: '등식 ${}_nC_5={}_nC_7$, ${}_6P_4=6{}_5P_r$를 만족시키는 자연수 $n,r$에 대해 $n+r$의 값은? [4.2점]', solution: '${}_nC_5={}_nC_7$에서 $n-5=7$이므로 $n=12$이다. 또 ${}_6P_4=6{}_5P_r$에서 $360=6{}_5P_r$이므로 ${}_5P_r=60$이고 $r=3$이다. 그러므로 $n+r=15$이고 정답은 ⑤이다.', reviewStatus: 'source_checked', reviewReason: [] },
    17: { solution: '$t=\\sqrt{x+k}\\ge0$로 두면 교점 조건은 $t^3+(3k-2)t^2-(k+2)t-3k^2-4k=0$이다. $t$가 0 이상인 서로 다른 두 해를 갖는 범위를 조사하면 $-4/3\\le k\\le0$이다. 따라서 $M=0$, $m=-4/3$이고 $M+3m=-4$이므로 정답은 ⑤이다.', reviewStatus: 'source_checked', reviewReason: [] },
  },
};

function bankSpan(source) {
  const marker = source.indexOf('window.questionBank');
  const open = source.indexOf('[', marker);
  let depth = 0; let quote = null;
  for (let i = open; i < source.length; i += 1) {
    const ch = source[i];
    if (quote) { if (ch === BS) i += 1; else if (ch === quote) quote = null; continue; }
    if (ch === '"' || ch === "'") { quote = ch; continue; }
    if (ch === '[') depth += 1;
    else if (ch === ']' && --depth === 0) return { open, close: i };
  }
  throw new Error('questionBank not found');
}
function load(source) { const context = { window: {} }; vm.runInNewContext(source, context, { timeout: 5000 }); return context.window.questionBank; }
function save(source, bank) { const { open, close } = bankSpan(source); return source.slice(0, open) + '[\n' + bank.map(q => JSON.stringify(q)).join(',\n') + '\n]' + source.slice(close + 1); }
function walk(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) { const full = path.join(dir, entry.name); if (entry.isDirectory()) out.push(...walk(full)); else if (entry.isFile() && entry.name.endsWith('.js')) out.push(full); }
  return out;
}
function apply(file, examTitle) {
  const source = fs.readFileSync(file, 'utf8'); let bank;
  try { bank = load(source); } catch { return false; }
  let touched = false;
  for (const [idText, patch0] of Object.entries(patches[examTitle] || {})) {
    const q = bank.find(item => String(item.sourceQuestionNo) === idText || String(item.id) === idText);
    if (!q) continue;
    const patch = Object.fromEntries(Object.entries(patch0).map(([k, v]) => [k, typeof v === 'string' ? tex(v) : v]));
    Object.assign(q, patch);
    q.answerStatus = 'answer_filled_A_correction';
    q.solutionStatus = 'solution_filled_A_correction';
    touched = true;
  }
  if (touched) fs.writeFileSync(file, save(source, bank), 'utf8');
  return touched;
}

let changed = 0;
for (const examTitle of Object.keys(patches)) {
  const packageDirs = fs.readdirSync(path.join(runRoot, 'packages'), { withFileTypes: true }).filter(e => e.isDirectory() && e.name.startsWith(examTitle + '_EXTERNAL_REVIEW'));
  for (const dir of packageDirs) {
    const file = path.join(runRoot, 'packages', dir.name, `${examTitle}.js`);
    if (fs.existsSync(file) && apply(file, examTitle)) changed += 1;
  }
}
for (const file of walk(path.join(runRoot, 'work'))) {
  const rel = path.relative(path.join(runRoot, 'work'), file).split(path.sep);
  const workId = rel[0];
  const map = { '23_jungang_2final': '23_중앙여고_2학기_기말_고1_기출', '23_hanyeong_2mid': '23_한영고_2학기_중간_고1_기출', '24_jungang_2final': '24_중앙여고_2학기_기말_고1_기출' };
  if (map[workId] && apply(file, map[workId])) changed += 1;
}
console.log(JSON.stringify({ changedFiles: changed }, null, 2));
