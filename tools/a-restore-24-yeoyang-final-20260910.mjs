import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]):/, '$1:')), '..');
const workRoot = path.join(root, 'archive', '_generated', 'nightly-h1-2sem', '20260908', 'work', '24_yeoyang_2final');
const BS = String.fromCharCode(92);
const tex = (v) => v.replaceAll('§', BS);
const dir = path.join(workRoot, 'fresh-extract-final');
const fileName = fs.readdirSync(dir).find(n => n.endsWith('.js'));
const file = path.join(dir, fileName);
const original = fs.readFileSync(file, 'utf8');
const context = { window: {} };
vm.runInNewContext(original, context, { timeout: 5000 });
const bank = context.window.questionBank;
const template = bank[0];
const existing = new Set(bank.map(q => String(q.sourceQuestionNo)));
const add = [];
if (!existing.has('8')) add.push({
  ...template, sourceQuestionNo:'8', displayNo:'8', category:'순열', originalCategory:'순열', standardUnitKey:'H15-SB-07', standardUnit:'순열', standardUnitOrder:7,
  content:'등식 $§{}_nC_5=$§{}_nC_7$, $§{}_6P_4=6$§{}_5P_r$를 만족시키는 자연수 $n,r$에 대해 $n+r$의 값은? [4.2점]',
  choices:['11','12','13','14','15'], answer:'⑤',
  solution:'$§{}_nC_5=$§{}_nC_7$에서 $n-5=7$이므로 $n=12$이다. 또 $§{}_6P_4=6$§{}_5P_r$에서 $360=6$§{}_5P_r$이므로 $§{}_5P_r=60$, 따라서 $r=3$이다. 그러므로 $n+r=15$이고 정답은 ⑤이다.',
  image:'',visualAsset:'',hasVisualAsset:false,visualAssetType:'none',visualAssetBBoxOnPage:null,visualAssetStatus:'no_visual_asset_required',answerStatus:'answer_filled_A_restoration',solutionStatus:'solution_filled_A_restoration',reviewStatus:'source_checked',reviewReason:[]
});
if (!existing.has('17')) add.push({
  ...template, sourceQuestionNo:'17', displayNo:'17', category:'함수', originalCategory:'함수', standardUnitKey:'H15-SB-03', standardUnit:'합성함수', standardUnitOrder:3,
  content:'함수 $y=§dfrac{2x}{x-2}$의 그래프와 함수 $y=§sqrt{x+k}+3k$의 그래프가 서로 다른 두 점에서 만날 때, 실수 $k$의 최댓값을 $M$, 최솟값을 $m$이라 하자. $M+3m$의 값은? [5점]',
  choices:['-15','-12','-9','-5','-4'], answer:'⑤',
  solution:'$t=§sqrt{x+k}$§ge0$로 두면 교점 조건은 $t^3+(3k-2)t^2-(k+2)t-3k^2-4k=0$이다. $t$가 0 이상인 서로 다른 두 해를 갖는 범위를 조사하면 $-4/3$§le k$§le0$이다. 따라서 $M=0$, $m=-4/3$이고 $M+3m=-4$이므로 정답은 ⑤이다.',
  image:'',visualAsset:'',hasVisualAsset:false,visualAssetType:'none',visualAssetBBoxOnPage:null,answerStatus:'answer_filled_A_restoration',solutionStatus:'solution_filled_A_restoration',reviewStatus:'source_checked',reviewReason:[]
});
if (add.length) {
  for (const q of add) for (const [k,v] of Object.entries(q)) if (typeof v === 'string') q[k]=tex(v);
  const order=v=>/^\d+$/.test(String(v))?Number(v):String(v).startsWith('서술형')?100+Number(String(v).slice(3)):999;
  const finalBank=[...bank,...add].sort((a,b)=>order(a.sourceQuestionNo)-order(b.sourceQuestionNo)).map((q,i)=>({...q,id:i+1}));
  const marker='window.questionBank', open=original.indexOf('[',original.indexOf(marker)); let depth=0,close=-1,quote=null;
  for(let i=open;i<original.length;i++){const ch=original[i];if(quote){if(ch===BS)i++;else if(ch===quote)quote=null;continue}if(ch==='"'||ch==="'"){quote=ch;continue}if(ch==='[')depth++;else if(ch===']'&&--depth===0){close=i;break}}
  fs.writeFileSync(file,original.slice(0,open)+'[\n'+finalBank.map(q=>JSON.stringify(q)).join(',\n')+'\n]'+original.slice(close+1),'utf8');
  console.log(JSON.stringify({added:add.map(q=>q.sourceQuestionNo),total:finalBank.length},null,2));
}
