import fs from 'node:fs';
import crypto from 'node:crypto';
import vm from 'node:vm';
const file = process.argv[2];
const expectedSha = process.argv[3];
const original = fs.readFileSync(file);
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
if (sha(original) !== expectedSha) throw new Error('SOURCE_SHA_PRECONDITION_MISMATCH');
const source = original.toString('utf8');
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(source, sandbox, { filename:file, timeout:5000 });
const bank = sandbox.window.questionBank;
const targets = new Map(bank.filter(q => [13,23].includes(Number(q.id))).map(q => [Number(q.id),q]));
if (targets.size !== 2) throw new Error('TARGET_QID_DENOMINATOR_MISMATCH');
const replacements = new Map([
  [13, {
    content: targets.get(13).content.replace('60이하의 자연수','6이하의 자연수'),
    answer: '③',
    solution: `식의 값을 $m$이라 두면 $m$은 1부터 6까지의 자연수이다.\n\n\\[\\frac{2\\log_2 n+1}{3}=m\\]\n\n양변을 정리하면\n\n\\[\\log_2 n=\\frac{3m-1}{2},\\qquad n=2^{\\frac{3m-1}{2}}.\\]\n\n$n$이 자연수이려면 지수 $(3m-1)/2$가 정수여야 한다. 따라서 $m$은 홀수이고, 범위 안에서는\n\n\\[m=1,3,5.\\]\n\n각각의 $n$은\n\n\\[m=1\\Rightarrow n=2,\\qquad m=3\\Rightarrow n=16,\\qquad m=5\\Rightarrow n=128.\\]\n\n따라서 모든 $n$의 합은\n\n\\[2+16+128=146.\\]\n\n정답은 ③이다.`,
    itemStatus: 'PASS_AFTER_REPAIR',
    holdReason: ''
  }],
  [23, {
    content: targets.get(23).content.replace('$3120$이다','$312$이다'),
    answer: '2',
    solution: `기울기가 $-1$인 직선 위에서는 두 점의 $x$좌표 차와 $y$좌표 차의 절댓값이 같다. 그림에서 $A$는 왼쪽 위, $B$는 오른쪽 아래에 있으므로, $AB=24\\sqrt2$에서 두 좌표 차의 절댓값은 각각 $24$이다.\n\n점 $A$의 $x$좌표를 $\\alpha$라 하자. 지수함수와 로그함수는 서로 역함수이고, $x+y=\\text{상수}$인 직선은 $y=x$ 대칭에 대해 변하지 않는다. 따라서\n\n\\[A=(\\alpha,3^\\alpha),\\qquad B=(3^\\alpha,\\alpha).\\]\n\n점 $C$는 $B$와 같은 높이에 있으므로 $BC$는 삼각형의 밑변이고, $A$에서 $BC$까지의 높이는 $3^\\alpha-\\alpha=24$이다. 삼각형의 넓이가 $312$이므로\n\n\\[312=\\frac12\\cdot BC\\cdot24,\\qquad BC=26.\\]\n\n$C$도 $y=3^x$ 위에 있고 $y_C=\\alpha$이므로 $C=(\\log_3\\alpha,\\alpha)$이다. 따라서\n\n\\[BC=3^\\alpha-\\log_3\\alpha=26.\\]\n\n이 식에서 $3^\\alpha-\\alpha=24$를 빼면\n\n\\[\\alpha-\\log_3\\alpha=26-24=2.\\]\n\n따라서 구하는 값은 $2$이다.`,
    itemStatus: 'PASS_AFTER_REPAIR',
    holdReason: ''
  }]
]);
function replaceProperty(text, object, key, value) {
  const old = object[key];
  const needle = JSON.stringify(key) + ': ' + JSON.stringify(old);
  const replacement = JSON.stringify(key) + ': ' + JSON.stringify(value);
  const at = text.indexOf(needle);
  if (at < 0 || text.indexOf(needle, at+needle.length) >= 0) throw new Error('PROPERTY_LOCUS_NOT_UNIQUE:' + object.id + ':' + key);
  return text.slice(0,at) + replacement + text.slice(at+needle.length);
}
const updates = new Map();
for (const [id, fields] of replacements) {
  const obj = targets.get(id);
  if (!obj.content.includes(id===13 ? '60이하의 자연수' : '$3120$')) throw new Error('CONTENT_SOURCE_LOCUS_MISSING:q'+id);
  if (obj.answer !== 'HOLD' || obj.itemStatus !== 'HOLD') throw new Error('HOLD_PRECONDITION_MISMATCH:q'+id);
  if (typeof fields.solution !== 'string' || !fields.content.includes(id===13 ? '6이하의 자연수' : '$312$이다')) throw new Error('REPAIR_PAYLOAD_INVALID:q'+id);
  updates.set(id, {oldContent:obj.content,oldAnswer:obj.answer,oldSolution:obj.solution,oldStatus:obj.itemStatus,oldReason:obj.holdReason,newContent:fields.content,newAnswer:fields.answer,newSolution:fields.solution,newStatus:fields.itemStatus,newReason:fields.holdReason});
}
// Preserve source bytes except the six declared properties inside the two held objects.
let changed = source;
for (const [id] of [...replacements].sort((a,b)=>b[0]-a[0])) {
  const obj = targets.get(id);
  const start = source.indexOf('"id": ' + id + ',');
  if (start < 0) throw new Error('RAW_OBJECT_LOCUS_MISSING:q'+id);
  const nextIdMatch = /\n\s*\{\s*\n\s*"id":\s*\d+,/g;
  nextIdMatch.lastIndex = start + 1;
  const next = nextIdMatch.exec(source);
  const end = next ? next.index : source.indexOf('\n  }\n];', start);
  if (end < 0) throw new Error('RAW_OBJECT_BOUNDARY_NOT_FOUND:q'+id);
  let block = changed.slice(start, end);
  const f = replacements.get(id);
  for (const [key,value] of Object.entries(f)) block = replaceProperty(block,obj,key,value);
  changed = changed.slice(0,start) + block + changed.slice(end);
}
fs.writeFileSync(file, changed, 'utf8');
const finalSandbox = {window:{}}; vm.createContext(finalSandbox); vm.runInContext(changed,finalSandbox,{filename:file,timeout:5000});
if(finalSandbox.window.questionBank.length !== bank.length) throw new Error('DENOMINATOR_CHANGED');
for(const id of [13,23]){
 const q=finalSandbox.window.questionBank.find(x=>Number(x.id)===id);
 if(q.itemStatus!=='PASS_AFTER_REPAIR'||q.answer==='HOLD'||q.holdReason!=='') throw new Error('TARGET_STATE_POSTCONDITION:q'+id);
}
console.log(JSON.stringify({ok:true,expectedPreSha:expectedSha,finalRawSha256:sha(Buffer.from(changed)),changedQids:[13,23],changedFields:['content','answer','solution','itemStatus','holdReason'],questionCount:finalSandbox.window.questionBank.length},null,2));

