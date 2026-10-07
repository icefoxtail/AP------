import fs from 'node:fs';
import crypto from 'node:crypto';
import vm from 'node:vm';
const js = process.argv[2];
const expectedRaw = '700abd3d7cc32e3fa39120030952badbdbeb6469ef78ac7a51670ba1c6430c1d';
const bytes = fs.readFileSync(js);
const beforeSha = crypto.createHash('sha256').update(bytes).digest('hex');
if (beforeSha !== expectedRaw) throw new Error(`unexpected source SHA ${beforeSha}`);
const source = bytes.toString('utf8');
const tokens=[];
for(let i=0;i<source.length;){
  const c=source[i];
  if(/\s/.test(c)){i++;continue;}
  if(c==='/'&&source[i+1]==='/'){i+=2;while(i<source.length&&source[i]!=='\n')i++;continue;}
  if(c==='/'&&source[i+1]==='*'){i+=2;while(i<source.length&&!(source[i]==='*'&&source[i+1]==='/'))i++;i+=2;continue;}
  if(c==='"'||c==="'") {const start=i,quote=c;i++;while(i<source.length){if(source[i]==='\\'){i+=2;continue;}if(source[i]===quote){i++;break;}i++;}tokens.push({type:'string',raw:source.slice(start,i),start,end:i});continue;}
  const id=source.slice(i).match(/^[A-Za-z_$][\w$]*/);if(id){tokens.push({type:'id',value:id[0],start:i,end:i+id[0].length});i+=id[0].length;continue;}
  const num=source.slice(i).match(/^\d+/);if(num){tokens.push({type:'number',value:num[0],start:i,end:i+num[0].length});i+=num[0].length;continue;}
  tokens.push({type:'punc',value:c,start:i,end:i+1});i++;
}
let bank=-1;for(let i=0;i<tokens.length-2;i++)if(tokens[i].type==='id'&&tokens[i].value==='questionBank'&&tokens[i+1].value==='='&&tokens[i+2].value==='['){bank=i+2;break;}
if(bank<0)throw new Error('questionBank array not found');
const rows=[];let i=bank+1;
while(i<tokens.length&&tokens[i].value!==']'){
  if(tokens[i].value===','){i++;continue;}
  if(tokens[i].value!=='{'){i++;continue;}
  const start=i;let depth=0,end=-1;for(let j=i;j<tokens.length;j++){if(tokens[j].value==='{')depth++;else if(tokens[j].value==='}'&&--depth===0){end=j;break;}}
  if(end<0)throw new Error('unclosed row');
  const props=new Map();let d=0;
  for(let j=start;j<=end;j++){
    if(tokens[j].value==='{'){d++;continue;}if(tokens[j].value==='}'){d--;continue;}
    if(d===1&&(tokens[j].type==='id'||tokens[j].type==='string')&&tokens[j+1]?.value===':'&&tokens[j+2]){const key=tokens[j].type==='id'?tokens[j].value:vm.runInNewContext(tokens[j].raw);props.set(key,tokens[j+2]);}
  }
  const id=Number(props.get('id')?.value);rows.push({id,props});i=end+1;
}
const replacements=[
  {qid:5,field:'solution',value:'산점도에 표시된 점은 모두 11개이다.\n태도 점수와 실험 점수가 같은 점은 (6,6), (7,7), (8,8), (9,9), (10,10)으로 5개이다.\n점들은 대체로 오른쪽 위로 함께 증가하므로 ②의 음의 경향은 보이지 않는다.\n실험 점수보다 태도 점수가 높은 점은 (9,8), (10,8) 두 개이다.\n두 점수 중 적어도 하나가 9점 이상인 점은 7개이다.\n따라서 옳은 설명은 ④이다.'},
  {qid:23,field:'solution',value:'한 점에서 원에 그은 두 접선의 길이는 같다.\nAC=CP=3 cm, BD=DP=9 cm이다.\nC, P, D가 한 직선 위에 있으므로\nCD=CP+PD=3+9=12 cm이다.\n두 끝점 A, B의 접선은 서로 평행하고 AB와 수직이다.\n그림에서 두 평행선 위 C와 D의 위치 차는\nBD-AC=9-3=6 cm이다.\n따라서 AB, 6 cm, CD가 직각삼각형을 이루어\nCD²=AB²+6²\nAB²=12²-6²=108\nAB=6√3 cm이다.'},
  {qid:23,field:'decisiveStep',value:'평행한 끝점 접선 사이의 거리와 공통접선 길이로 지름을 구하는 단계'}
];
console.log(JSON.stringify({idTokens:tokens.filter(t=>t.value==='id').slice(0,6).map((t,i)=>({type:t.type,after:tokens[tokens.indexOf(t)+1]?.value,next:tokens[tokens.indexOf(t)+2]?.value}))}));const edits=[];for(const r of replacements){const row=rows.find(x=>x.id===r.qid);if(!row)throw new Error(`missing q${r.qid}`);const tok=row.props.get(r.field);if(!tok||tok.type!=='string')throw new Error(`missing string ${r.field} q${r.qid}`);const current=vm.runInNewContext(tok.raw);if(typeof current!=='string')throw new Error('unexpected literal');edits.push({start:tok.start,end:tok.end,raw:JSON.stringify(r.value),qid:r.qid,field:r.field});}
let patched=source;for(const e of edits.sort((a,b)=>b.start-a.start))patched=patched.slice(0,e.start)+e.raw+patched.slice(e.end);
fs.writeFileSync(js,patched,'utf8');
const after=fs.readFileSync(js);globalThis.window={};vm.runInThisContext(after.toString('utf8'),{filename:js});
const check=window.questionBank.filter(q=>[5,23].includes(Number(q.id))).map(q=>({qid:q.id,answer:q.answer,solutionSha256:crypto.createHash('sha256').update(q.solution,'utf8').digest('hex'),decisiveStep:q.decisiveStep||null}));
console.log(JSON.stringify({beforeSha,afterSha:crypto.createHash('sha256').update(after).digest('hex'),edits:edits.map(({qid,field})=>({qid,field})),verification:check}));




