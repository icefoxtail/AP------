import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]):/, '$1:')), '..');
const workRoot = path.join(root, 'archive', '_generated', 'nightly-h1-2sem', '20260908', 'work', '24_yeocheon_2mid');
const BS = String.fromCharCode(92);
const tex = (value) => value.replaceAll('§', BS);

function span(source) {
  const markerAt = source.indexOf('window.questionBank');
  const open = source.indexOf('[', markerAt);
  let depth = 0, quote = null;
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
  throw new Error('bank not found');
}
function load(source) { const c = { window: {} }; vm.runInNewContext(source, c, { timeout: 5000 }); return c.window.questionBank; }
function replace(source, bank) { const s = span(source); return source.slice(0, s.open) + '[\n' + bank.map(q => JSON.stringify(q)).join(',\n') + '\n]' + source.slice(s.close + 1); }
function ordinal(v) { const m=String(v).match(/^(?:q)?(\d+)$/); return m ? Number(m[1]) : String(v).startsWith('서술형') ? 100+Number(String(v).slice(3)) : 999; }

const fileDirs = ['fresh-extract-final', 'fresh-extract-package'];
for (const dirName of fileDirs) {
  const dir = path.join(workRoot, dirName);
  if (!fs.existsSync(dir)) continue;
  const name = fs.readdirSync(dir).find(n => n.endsWith('.js'));
  if (!name) continue;
  const file = path.join(dir, name);
  const original = fs.readFileSync(file, 'utf8');
  const bank = load(original);
  const template = bank.find(q => q.sourceQuestionNo === '3') || bank[0];
  const existing = new Set(bank.map(q => String(q.sourceQuestionNo)));
  const add = [];
  if (!existing.has('4')) add.push({
    ...template, sourceQuestionNo:'4', displayNo:'4', category:'집합', originalCategory:'집합', standardUnitKey:'H15-SB-01', standardUnit:'집합의 연산', standardUnitOrder:1,
    content:'전체집합 $U=§{1,2,3,4,5§}$의 부분집합 $A$에 대하여 $§{1,2,3§}§cap A§ne§varnothing$을 만족시키는 모든 집합 $A$의 개수는? [3.5점]',
    choices:['12','16','18','21','28'], answer:'⑤',
    solution:'전체 부분집합의 개수는 $2^5$이다. $1,2,3$을 모두 포함하지 않는 부분집합은 나머지 $4,5$만 자유롭게 선택하므로 $2^2$개이다. 따라서 조건을 만족하는 개수는 $2^5-2^2=28$이고 정답은 ⑤이다.',
    image:'',visualAsset:'',hasVisualAsset:false,visualAssetType:'none',visualAssetBBoxOnPage:null,visualAssetStatus:'no_visual_asset_required',answerStatus:'answer_filled_A_restoration',solutionStatus:'solution_filled_A_restoration',reviewStatus:'source_checked',reviewReason:[]
  });
  if (!existing.has('5')) add.push({
    ...template, sourceQuestionNo:'5', displayNo:'5', category:'명제', originalCategory:'명제', standardUnitKey:'H15-SB-02', standardUnit:'명제와 진리집합', standardUnitOrder:2,
    content:'냉장고에 넣어 두었던 초콜릿이 밤사이에 없어졌다. 엄마가 네 명의 자녀 A, B, C, D에게 물어본 결과 다음과 같은 사실을 알았다. (가) 세 명의 자녀가 초콜릿을 함께 먹었다. (나) A가 초콜릿을 먹었다면 C도 초콜릿을 먹었다. (다) D가 초콜릿을 먹지 않았다면 C도 초콜릿을 먹지 않았다. (라) A가 초콜릿을 먹지 않았다면 B도 초콜릿을 먹지 않았다. 초콜릿을 안 먹은 사람을 모두 고르면? [3.5점]',
    choices:['A,B,C','A,C,D','A','B','D'], answer:'④',
    solution:'세 명이 먹었으므로 먹지 않은 사람은 한 명이다. A가 먹었다면 C도 먹어야 하고, D가 먹지 않았다면 C도 먹지 않아야 하며, A가 먹지 않았다면 B도 먹지 않아야 한다. 가능한 경우는 A,C,D가 먹고 B가 먹지 않은 경우뿐이다. 따라서 정답은 ④이다.',
    image:'',visualAsset:'',hasVisualAsset:false,visualAssetType:'none',visualAssetBBoxOnPage:null,visualAssetStatus:'no_visual_asset_required',answerStatus:'answer_filled_A_restoration',solutionStatus:'solution_filled_A_restoration',reviewStatus:'source_checked',reviewReason:[]
  });
  if (!add.length) continue;
  for (const q of add) for (const [k,v] of Object.entries(q)) if (typeof v === 'string') q[k]=tex(v);
  const finalBank=[...bank,...add].sort((a,b)=>ordinal(a.sourceQuestionNo)-ordinal(b.sourceQuestionNo)).map((q,i)=>({...q,id:i+1}));
  fs.writeFileSync(file, replace(original, finalBank), 'utf8');
  console.log(dirName, 'ADDED', add.map(q=>q.sourceQuestionNo).join(','), 'TOTAL', finalBank.length);
}
