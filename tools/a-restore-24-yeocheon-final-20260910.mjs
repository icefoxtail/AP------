import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]):/, '$1:')), '..');
const workRoot = path.join(root, 'archive', '_generated', 'nightly-h1-2sem', '20260908', 'work', '24_yeocheon_2final');
const BS = String.fromCharCode(92);
const tex = (value) => value.replaceAll('§', BS);
const targetDirs = ['fresh-extract-final', 'fresh-extract-package'];

function bankSpan(source) {
  const markerAt = source.indexOf('window.questionBank');
  const open = source.indexOf('[', markerAt);
  let depth = 0;
  let quote = null;
  for (let i = open; i < source.length; i += 1) {
    const ch = source[i];
    if (quote) {
      if (ch === BS) i += 1;
      else if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'") { quote = ch; continue; }
    if (ch === '[') depth += 1;
    else if (ch === ']' && --depth === 0) return { open, close: i };
  }
  throw new Error('questionBank array not found');
}

function loadBank(source) {
  const context = { window: {} };
  vm.runInNewContext(source, context, { timeout: 5000 });
  return context.window.questionBank;
}

function replaceBank(source, bank) {
  const { open, close } = bankSpan(source);
  return source.slice(0, open) + '[\n' + bank.map((q) => JSON.stringify(q)).join(',\n') + '\n]' + source.slice(close + 1);
}

function sourceOrdinal(value) {
  if (/^\d+$/.test(String(value))) return Number(value);
  const match = String(value).match(/서술형(\d+)/);
  return match ? 100 + Number(match[1]) : 999;
}

function makeQuestion(template, sourceQuestionNo, patch) {
  const q = { ...template, ...patch, sourceQuestionNo, displayNo: sourceQuestionNo };
  for (const [key, value] of Object.entries(q)) if (typeof value === 'string') q[key] = tex(value);
  if (Array.isArray(q.choices)) q.choices = q.choices.map(value => typeof value === 'string' ? tex(value) : value);
  return q;
}

for (const dirName of targetDirs) {
  const dir = path.join(workRoot, dirName);
  if (!fs.existsSync(dir)) continue;
  const file = fs.readdirSync(dir).find(name => name.endsWith('.js'));
  if (!file) continue;
  const filePath = path.join(dir, file);
  const original = fs.readFileSync(filePath, 'utf8');
  const bank = loadBank(original);
  const template = bank.find(q => q.sourceQuestionNo === '5') || bank[0];
  const existing = new Set(bank.map(q => String(q.sourceQuestionNo)));
  const additions = [];
  if (!existing.has('3')) additions.push(makeQuestion(template, '3', {
    category: '경우의 수', originalCategory: '경우의 수', standardUnitKey: 'H15-SB-06', standardUnit: '경우의 수의 기본 원리', standardUnitOrder: 6,
    content: '2700의 양의 약수 중 5의 배수의 개수는? [3.3점]',
    choices: ['23', '24', '25', '26', '27'], answer: '②',
    solution: '$2700=2^2§times3^3§times5^2$이다. 5의 배수가 되려면 5의 지수는 1 또는 2이고, 2와 3의 지수는 각각 $0,1,2$ 및 $0,1,2,3$ 중에서 자유롭게 정한다. 따라서 경우의 수는 $2§times3§times4=24$이고 정답은 ②이다.',
    image: '', visualAsset: '', hasVisualAsset: false, visualAssetType: 'none', visualAssetBBoxOnPage: null, visualAssetStatus: 'no_visual_asset_required',
    sourceQuestionNo: '3', pageNo: 1, reviewStatus: 'source_checked', reviewReason: [], answerStatus: 'answer_filled_A_restoration', solutionStatus: 'solution_filled_A_restoration'
  }));
  if (!existing.has('4')) additions.push(makeQuestion(template, '4', {
    category: '함수', originalCategory: '함수', standardUnitKey: 'H15-SB-03', standardUnit: '함수의 뜻과 대응', standardUnitOrder: 3,
    content: '다음 중 항등함수의 그래프를 고르면? [3.4점]',
    choices: ['①', '②', '③', '④', '⑤'], answer: '①',
    solution: '항등함수는 모든 $x$에 대하여 $f(x)=x$를 만족하므로 그래프는 직선 $y=x$이다. 원문의 그래프 선택지 중 직선 $y=x$인 ①이 정답이다.',
    image: 'assets/images/24_여천고_2학기_기말_고1_기출/q004.png', visualAsset: 'assets/images/24_여천고_2학기_기말_고1_기출/q004.png', hasVisualAsset: true, visualAssetType: 'diagram', visualAssetStatus: 'source_visual_asset',
    sourceQuestionNo: '4', pageNo: 1, reviewStatus: 'source_checked', reviewReason: [], answerStatus: 'answer_filled_A_restoration', solutionStatus: 'solution_filled_A_restoration'
  }));
  if (!existing.has('10')) additions.push(makeQuestion(template, '10', {
    category: '함수', originalCategory: '함수', standardUnitKey: 'H15-SB-03', standardUnit: '함수의 뜻과 대응', standardUnitOrder: 3,
    content: '집합 $X=§{x§mid x§ge a§}$에서 $X$로의 함수 $f(x)=x^2-3x$가 일대일대응이 되도록 하는 상수 $a$의 값은? [3.9점]',
    choices: ['3', '4', '5', '6', '7'], answer: '②',
    solution: '$f(x)=x^2-3x$가 $[a,§infty)$에서 일대일이 되려면 꼭짓점의 $x$좌표 $3/2$보다 $a$가 크거나 같아야 한다. 또 치역이 정의역과 같으려면 $f(a)=a$이어야 하므로 $a^2-3a=a$, 즉 $a=0$ 또는 $a=4$이다. $a§ge3/2$ 조건을 만족하는 값은 $4$이므로 정답은 ②이다.',
    image: '', visualAsset: '', hasVisualAsset: false, visualAssetType: 'none', visualAssetBBoxOnPage: null, visualAssetStatus: 'no_visual_asset_required',
    sourceQuestionNo: '10', pageNo: 3, reviewStatus: 'source_checked', reviewReason: [], answerStatus: 'answer_filled_A_restoration', solutionStatus: 'solution_filled_A_restoration'
  }));
  if (!existing.has('18')) additions.push(makeQuestion(template, '18', {
    category: '함수', originalCategory: '함수', standardUnitKey: 'H15-SB-03', standardUnit: '함수의 뜻과 대응', standardUnitOrder: 3,
    content: '$-1§le x§le1$에서 정의된 함수 $f(x)=§begin{cases}x^2&(-1§le x<0)§§-x&(0§le x§le1)§end{cases}$에 대하여 다음 중 함수 $y=(f§circ f)(x)$의 그래프의 개형으로 옳은 것은? [4.7점]',
    choices: ['①', '②', '③', '④', '⑤'], answer: '⑤',
    solution: '$-1§le x<0$에서는 $f(x)=x^2$가 $[0,1]$에 있으므로 $(f§circ f)(x)=-x^2$이다. $0§le x§le1$에서는 $f(x)=-x$가 $[-1,0]$에 있으므로 $(f§circ f)(x)=x^2$이다. 따라서 왼쪽에는 $y=-x^2$, 오른쪽에는 $y=x^2$가 놓인 그래프인 ⑤가 정답이다.',
    image: 'assets/images/24_여천고_2학기_기말_고1_기출/q018.png', visualAsset: 'assets/images/24_여천고_2학기_기말_고1_기출/q018.png', hasVisualAsset: true, visualAssetType: 'diagram', visualAssetStatus: 'source_visual_asset',
    sourceQuestionNo: '18', pageNo: 5, reviewStatus: 'source_checked', reviewReason: [], answerStatus: 'answer_filled_A_restoration', solutionStatus: 'solution_filled_A_restoration'
  }));
  if (!additions.length) continue;
  const finalBank = [...bank, ...additions].sort((a, b) => sourceOrdinal(a.sourceQuestionNo) - sourceOrdinal(b.sourceQuestionNo)).map((q, index) => ({ ...q, id: index + 1 }));
  fs.writeFileSync(filePath, replaceBank(original, finalBank), 'utf8');
  console.log(dirName, 'ADDED', additions.map(q => q.sourceQuestionNo).join(','), 'TOTAL', finalBank.length);
}
