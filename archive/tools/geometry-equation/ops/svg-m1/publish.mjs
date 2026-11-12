// Publish bound SVG solution figures into exam files of a git worktree (adds the four solutionImage* fields to a question object, copies the SVG).
// usage: node publish-figures.mjs <rows.json> <worktreeRoot> [--exams N] [--only <examBasenameSubstring>] [--apply]
//   rows.json: [{src, ord, svg, key, fam}] (src = archive/exams/... path inside the SVG line clone, svg = bound SVG file, key = campaign item key)
// Without --apply nothing is written. Every exam is verified by parsing before and after: only the four fields of the chosen questions may differ.
import fs from 'node:fs';import path from 'node:path';import vm from 'node:vm';
const [rowsPath,root,...flags]=process.argv.slice(2);
const flag=n=>flags.includes(n),opt=n=>{const i=flags.indexOf(n);return i>=0?flags[i+1]:null;};
const apply=flag('--apply'),limit=Number(opt('--exams')||1e9),only=opt('--only');
const rows=JSON.parse(fs.readFileSync(rowsPath,'utf8'));
const NEW_KEYS=['solutionImage','solutionImageAlt','solutionImageCaption','solutionImageSize'];

// Locate the active literal without reserializing the bank or touching a separate examData mirror.
// This scanner only needs source ranges. The VM still decides which bank the Archive uses.
function scan(text){
  const pattern=/\s+|\/\/[^\r\n]*|\/\*[\s\S]*?\*\/|"(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\])*'|\x60(?:\\[\s\S]|[^\x60\\])*\x60|[A-Za-z_$][\w$]*|===|==|=>|&&=|\|\|=|\?\?=|[+\-*/%&|^]=|[\s\S]/g;
  const tokens=[],stack=[],closing={'{':'}','[':']','(':')'};
  for(const match of text.matchAll(pattern)){
    const value=match[0];
    if(/^\s/.test(value)||value.startsWith('//')||value.startsWith('/*'))continue;
    const index=tokens.length;
    tokens.push({value,start:match.index,end:match.index+value.length-1,parent:stack.at(-1)});
    if(Object.hasOwn(closing,value))stack.push(index);
    else if(value==='}'||value===']'||value===')'){
      const open=stack.pop();
      if(open===undefined||closing[tokens[open].value]!==value)return null;
      tokens[open].close=index;
    }
  }
  return stack.length?null:tokens;
}
const isKey=(token,name)=>[name,'"'+name+'"',"'"+name+"'"].includes(token?.value);
function accessEnd(tokens,index,name){
  if(tokens[index]?.value==='.'&&tokens[index+1]?.value===name)return index+2;
  if(tokens[index]?.value==='['&&tokens[index+1]?.value!==name&&isKey(tokens[index+1],name)&&tokens[index+2]?.value===']')return index+3;
  return null;
}
function assignments(tokens,name){
  const found=[];
  for(let i=0;i<tokens.length;i++){
    if(tokens[i].value!=='window')continue;
    const end=accessEnd(tokens,i+1,name);
    if(end!==null&&/^(?:=|&&=|\|\|=|\?\?=|[+\-*/%&|^]=)$/.test(tokens[end]?.value??''))found.push(end);
  }
  return found;
}
function activeQuestionObjects(text,bank){
  const tokens=scan(text);
  if(!tokens)return null;
  const primary=assignments(tokens,'questionBank');
  if(primary.length>1||primary.some(i=>tokens[i].value!=='='))return null;
  const rhs=primary.length?primary[0]+1:null;
  let array=rhs;
  if(rhs===null||tokens[rhs]?.value!=='['){
    // Legacy sources publish the same literal through examData.questions, with or without an alias.
    if(rhs!==null&&!['null','undefined'].includes(tokens[rhs]?.value)){
      const end=tokens[rhs]?.value==='window'?accessEnd(tokens,rhs+1,'examData'):null;
      if(end===null||accessEnd(tokens,end,'questions')===null)return null;
    }
    const legacy=assignments(tokens,'examData');
    if(legacy.length!==1||tokens[legacy[0]].value!=='=')return null;
    const object=legacy[0]+1;
    if(tokens[object]?.value!=='{')return null;
    const fields=tokens.flatMap((token,i)=>token.parent===object&&isKey(token,'questions')
      &&['{',','].includes(tokens[i-1]?.value)&&tokens[i+1]?.value===':'?[i+2]:[]);
    if(fields.length!==1)return null;
    [array]=fields;
  }
  if(tokens[array]?.value!=='[')return null;
  const end=tokens[array].close,objects=[];
  for(let i=array+1;i<end;){
    if(tokens[i].value!=='{')return null;
    const close=tokens[i].close;
    objects.push([tokens[i].start,tokens[close].end]);
    i=close+1;
    if(i===end)break;
    if(tokens[i++].value!==',')return null;
  }
  if(objects.length!==bank.length)return null;
  // Match the complete literal to the VM-selected bank before relying on its object order.
  try{
    const literal=text.slice(tokens[array].start,tokens[end].end+1);
    if(JSON.stringify(vm.runInNewContext('('+literal+')',{}, {timeout:5000}))!==JSON.stringify(bank))return null;
  }catch{return null;}
  return objects;
}
// 숫자 번호는 id: 6, 문자열 id 는 id: "q01". 파일명: 숫자 → q6-solution.svg, 문자열 → q01-solution.svg
const assetFile=(ord,suffix='')=>(typeof ord==='number'?'q'+ord:String(ord))+'-solution'+suffix+'.svg';
function insertFields(text,obj,fields){
  const [open,close]=obj;let last=close-1;while(/\s/.test(text[last]))last--;
  const lineStart=text.lastIndexOf('\n',last)+1,indent=/^[ \t]*/.exec(text.slice(lineStart))[0];
  const eol=text.includes('\r\n')?'\r\n':'\n';
  const add=Object.entries(fields).map(([k,v])=>indent+JSON.stringify(k)+': '+JSON.stringify(v)).join(','+eol);
  // A last property that already ends with a comma (trailing-comma style) keeps that style: no extra comma before, one after.
  if(text[last]===',')return text.slice(0,last+1)+eol+add+','+text.slice(last+1);
  return text.slice(0,last+1)+','+eol+add+text.slice(last+1);
}
function replaceFields(text,obj,fields){
  // replace the value of each existing top-level key inside obj; insert missing keys at the end
  let [open,close]=obj;const missing={};
  for(const [k,v] of Object.entries(fields)){
    const re=new RegExp('"'+k+'"\\s*:\\s*"(?:[^"\\\\]|\\\\.)*"','g');re.lastIndex=open;let m,hit=null;
    while((m=re.exec(text))&&m.index<close){const before=text.slice(open,m.index);if(before.includes('"'+k+'"'))continue;hit=m;break;}
    if(hit){const rep=JSON.stringify(k)+': '+JSON.stringify(v);text=text.slice(0,hit.index)+rep+text.slice(hit.index+hit[0].length);close+=rep.length-hit[0].length;}
    else missing[k]=v;
  }
  return Object.keys(missing).length?insertFields(text,[open,close],missing):text;
}
const bankOf=text=>{const w={};vm.runInNewContext(text.replace(/^﻿/,''),{window:w});return w.questionBank??(Array.isArray(w.examData?.questions)?w.examData.questions:w.questionBank);};

// ---- plan the work per exam -------------------------------------------------------------------------------------------------
const byExam=new Map();for(const r of rows){const rel=r.src.split(/archive[\\/]/).pop();(byExam.get(rel)||byExam.set(rel,[]).get(rel)).push(r);}
let exams=[...byExam.entries()].filter(([rel])=>!only||rel.includes(only)).slice(0,limit);
const report=[];
for(const [rel,items] of exams){
  const file=path.join(root,'archive',rel),uid=path.basename(rel,'.js'),res={exam:uid,items:[],status:'OK'};
  if(!fs.existsSync(file)){res.status='MISSING_EXAM';report.push(res);continue;}
  let text=fs.readFileSync(file,'utf8'),before;
  try{before=bankOf(text);if(!Array.isArray(before))throw Error('ACTIVE_BANK_NOT_ARRAY');}catch(e){res.status='UNPARSEABLE:'+String(e).slice(0,60);report.push(res);continue;}
  let patched=text,offset=0;const assets=[],expected=new Map();
  const active=activeQuestionObjects(text,before),orderOf=new Map(before.map((q,i)=>[q.id,i]));
  for(const it of items.sort((a,b)=>(orderOf.get(a.ord)??1e9)-(orderOf.get(b.ord)??1e9))){
    const q=before.find(x=>x.id===it.ord);
    if(!q){res.items.push({ord:it.ord,skip:'NO_SUCH_QUESTION'});continue;}
    if(items.filter(row=>row.ord===it.ord).length!==1){res.items.push({ord:it.ord,skip:'DUPLICATE_QUESTION_ROWS'});continue;}
    // Any existing solutionImage* field means someone already registered (or half-registered) a figure for this question: never overwrite, report it.
    if(!it.replace&&NEW_KEYS.some(k=>Object.hasOwn(q,k))){res.items.push({ord:it.ord,skip:'HAS_EXISTING_SOLUTION_IMAGE_FIELDS:'+NEW_KEYS.filter(k=>Object.hasOwn(q,k)).join('+')});continue;}
    // m1 campaign: alt/caption/size come from the row (author publish.json), not from a state file.
    const size=it.size||'medium',caption=String(it.caption||'').trim(),alt=String(it.alt||'').trim();
    if(!caption||!alt){res.items.push({ord:it.ord,skip:'NO_CAPTION_OR_ALT'});continue;}
    const assetRel=`assets/images/${uid}/${it.asset||assetFile(it.ord)}`;
    // Never overwrite an existing file: a figure with this name already exists in the repository (possibly another question's registered figure).
    if(fs.existsSync(path.join(root,'archive',assetRel))){res.items.push({ord:it.ord,skip:'ASSET_ALREADY_EXISTS'});continue;}
    const index=orderOf.get(it.ord);
    const bounds=before.findIndex(x=>x.id===it.ord)===index?active?.[index]:null;
    if(!bounds){res.items.push({ord:it.ord,skip:'QUESTION_OBJECT_NOT_LOCATED'});continue;}
    const fields={solutionImage:assetRel,solutionImageAlt:alt,solutionImageCaption:caption,solutionImageSize:size};
    const obj=bounds.map(pos=>pos+offset),length=patched.length;
    patched=(it.replace?replaceFields:insertFields)(patched,obj,fields);
    offset+=patched.length-length; // items are ordered by their positions in the active array
    expected.set(it.ord,fields);
    if(process.env.DEBUG_EACH){try{bankOf(patched);}catch(e){const k=patched.indexOf('/q'+it.ord+'-solution.svg');console.log('BREAKS at q'+it.ord,JSON.stringify(patched.slice(Math.max(0,k-300),k+60)));}}assets.push({from:it.svg,to:path.join(root,'archive',assetRel)});res.items.push({ord:it.ord,ok:true,size});
  }
  if(assets.length){
    // verification: the patched bank equals the original except for the four fields on the chosen questions
    let after;try{after=bankOf(patched);}catch(e){res.status='PATCH_UNPARSEABLE:'+String(e.message).slice(0,80);{const k=patched.indexOf('"solutionImage"');if(process.env.DEBUG_SNIP)console.log(JSON.stringify(patched.slice(Math.max(0,k-120),k+260)));}report.push(res);continue;}
    let bad=null;
    if(after.length!==before.length)bad='LENGTH';
    else before.forEach((q0,i)=>{const a={...after[i]},q={...q0};if(expected.has(q.id))for(const k of NEW_KEYS){if(a[k]!==expected.get(q.id)[k])bad=bad||('FIELDS_NOT_APPLIED_Q'+q.id+':'+k);delete a[k];delete q[k];}if(JSON.stringify(a)!==JSON.stringify(q)){const ks=[...new Set([...Object.keys(a),...Object.keys(q)])].filter(k=>JSON.stringify(a[k])!==JSON.stringify(q[k]));bad=bad||('FIELDS_CHANGED_Q'+q.id+':'+ks.join(','));}});
    if(bad){res.status='VERIFY_FAIL:'+bad;report.push(res);continue;}
    if(apply){fs.writeFileSync(file,patched);for(const a of assets){fs.mkdirSync(path.dirname(a.to),{recursive:true});fs.copyFileSync(a.from,a.to);}}
  }else res.status='NOTHING';
  report.push(res);
}
const ok=report.filter(r=>r.status==='OK');
console.log(JSON.stringify({apply,exams:report.length,okExams:ok.length,figures:ok.reduce((n,r)=>n+r.items.filter(i=>i.ok).length,0),problems:report.filter(r=>r.status!=='OK'&&r.status!=='NOTHING').map(r=>r.exam+' '+r.status),skips:report.flatMap(r=>r.items.filter(i=>i.skip).map(i=>r.exam+' q'+i.ord+' '+i.skip))},null,1));
fs.writeFileSync(process.env.PUBLISH_REPORT||path.join(process.env.TEMP||'.','publish-report.json'),JSON.stringify(report,null,1));
