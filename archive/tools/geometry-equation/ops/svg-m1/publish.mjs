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

// ---- a tiny scanner: positions of every object's braces, skipping strings --------------------------------------------------
function scan(text){
  const pairs=new Map(),stack=[];
  for(let i=0;i<text.length;i++){
    const ch=text[i];
    if(ch==='"'||ch==="'"||ch==='`'){const q=ch;i++;while(i<text.length&&text[i]!==q){if(text[i]==='\\')i++;i++;}continue;}
    if(ch==='/'&&text[i+1]==='/'){while(i<text.length&&text[i]!=='\n')i++;continue;}
    if(ch==='/'&&text[i+1]==='*'){i=text.indexOf('*/',i+2);if(i<0)break;i++;continue;}
    if(ch==='{')stack.push(i);else if(ch==='}'){const s=stack.pop();if(s!==undefined)pairs.set(s,i);}
  }
  return pairs;
}
// top-level property keys of the object [open,close] (depth 1 only)
function topKeys(text,open,close){
  const keys=[];let depth=0;
  for(let i=open;i<=close;i++){
    const ch=text[i];
    if(ch==='"'||ch==="'"||ch==='`'){const q=ch,start=i;i++;while(i<=close&&text[i]!==q){if(text[i]==='\\')i++;i++;}
      if(depth===1&&q==='"'){let j=i+1;while(/\s/.test(text[j]||''))j++;if(text[j]===':')keys.push(text.slice(start+1,i));}continue;}
    // unquoted identifier keys (id: 6, solution: "...") at depth 1
    if(depth===1&&/[A-Za-z_$]/.test(ch)&&!/[A-Za-z0-9_$]/.test(text[i-1]||'')){let j=i;while(/[A-Za-z0-9_$]/.test(text[j]||''))j++;let k=j;while(/\s/.test(text[k]||''))k++;if(text[k]===':'&&text[k+1]!==':'){keys.push(text.slice(i,j));}i=j-1;continue;}
    if(ch==='{'||ch==='[')depth++;else if(ch==='}'||ch===']')depth--;
  }
  return keys;
}
function findQuestionObject(text,pairs,qid){
  const re=new RegExp('(?:"id"|\\bid)\\s*:\\s*'+qid+'\\b','g');const hits=[];let m;
  while((m=re.exec(text))){
    // innermost object that contains this position
    let best=null;for(const [o,c] of pairs)if(o<m.index&&c>m.index&&(best===null||o>best[0]))best=[o,c];
    if(best&&topKeys(text,best[0],best[1]).includes('solution')&&topKeys(text,best[0],best[1]).includes('id'))hits.push(best);
  }
  const uniq=[...new Map(hits.map(h=>[h[0],h])).values()];
  return uniq.length===1?uniq[0]:null;
}
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
const bankOf=text=>{const w={};vm.runInNewContext(text.replace(/^﻿/,''),{window:w});return w.questionBank;};

// ---- plan the work per exam -------------------------------------------------------------------------------------------------
const byExam=new Map();for(const r of rows){const rel=r.src.split(/archive[\\/]/).pop();(byExam.get(rel)||byExam.set(rel,[]).get(rel)).push(r);}
let exams=[...byExam.entries()].filter(([rel])=>!only||rel.includes(only)).slice(0,limit);
const report=[];
for(const [rel,items] of exams){
  const file=path.join(root,'archive',rel),uid=path.basename(rel,'.js'),res={exam:uid,items:[],status:'OK'};
  if(!fs.existsSync(file)){res.status='MISSING_EXAM';report.push(res);continue;}
  let text=fs.readFileSync(file,'utf8'),before;
  try{before=bankOf(text);}catch(e){res.status='UNPARSEABLE:'+String(e).slice(0,60);report.push(res);continue;}
  let patched=text;const assets=[];
  for(const it of items.sort((a,b)=>a.ord-b.ord)){
    const q=before.find(x=>x.id===it.ord);
    if(!q){res.items.push({ord:it.ord,skip:'NO_SUCH_QUESTION'});continue;}
    // Any existing solutionImage* field means someone already registered (or half-registered) a figure for this question: never overwrite, report it.
    if(!it.replace&&NEW_KEYS.some(k=>Object.hasOwn(q,k))){res.items.push({ord:it.ord,skip:'HAS_EXISTING_SOLUTION_IMAGE_FIELDS:'+NEW_KEYS.filter(k=>Object.hasOwn(q,k)).join('+')});continue;}
    // m1 campaign: alt/caption/size come from the row (author publish.json), not from a state file.
    const size=it.size||'medium',caption=String(it.caption||'').trim(),alt=String(it.alt||'').trim();
    if(!caption||!alt){res.items.push({ord:it.ord,skip:'NO_CAPTION_OR_ALT'});continue;}
    const assetRel=`assets/images/${uid}/${it.asset||('q'+it.ord+'-solution.svg')}`;
    // Never overwrite an existing file: a figure with this name already exists in the repository (possibly another question's registered figure).
    if(fs.existsSync(path.join(root,'archive',assetRel))){res.items.push({ord:it.ord,skip:'ASSET_ALREADY_EXISTS'});continue;}
    const pairs=scan(patched),obj=findQuestionObject(patched,pairs,it.ord);
    if(!obj){res.items.push({ord:it.ord,skip:'QUESTION_OBJECT_NOT_LOCATED'});continue;}
    patched=(it.replace?replaceFields:insertFields)(patched,obj,{solutionImage:assetRel,solutionImageAlt:alt,solutionImageCaption:caption,solutionImageSize:size});
    if(process.env.DEBUG_EACH){try{bankOf(patched);}catch(e){const k=patched.indexOf('/q'+it.ord+'-solution.svg');console.log('BREAKS at q'+it.ord,JSON.stringify(patched.slice(Math.max(0,k-300),k+60)));}}assets.push({from:it.svg,to:path.join(root,'archive',assetRel)});res.items.push({ord:it.ord,ok:true,size});
  }
  if(assets.length){
    // verification: the patched bank equals the original except for the four fields on the chosen questions
    let after;try{after=bankOf(patched);}catch(e){res.status='PATCH_UNPARSEABLE:'+String(e.message).slice(0,80);{const k=patched.indexOf('"solutionImage"');if(process.env.DEBUG_SNIP)console.log(JSON.stringify(patched.slice(Math.max(0,k-120),k+260)));}report.push(res);continue;}
    const chosen=new Set(res.items.filter(i=>i.ok).map(i=>i.ord));let bad=null;
    if(after.length!==before.length)bad='LENGTH';
    else before.forEach((q0,i)=>{const a={...after[i]},q={...q0};if(chosen.has(q.id))for(const k of NEW_KEYS){delete a[k];delete q[k];}if(JSON.stringify(a)!==JSON.stringify(q)){const ks=[...new Set([...Object.keys(a),...Object.keys(q)])].filter(k=>JSON.stringify(a[k])!==JSON.stringify(q[k]));bad=bad||('FIELDS_CHANGED_Q'+q.id+':'+ks.join(','));}});
    if(bad){res.status='VERIFY_FAIL:'+bad;report.push(res);continue;}
    if(apply){fs.writeFileSync(file,patched);for(const a of assets){fs.mkdirSync(path.dirname(a.to),{recursive:true});fs.copyFileSync(a.from,a.to);}}
  }else res.status='NOTHING';
  report.push(res);
}
const ok=report.filter(r=>r.status==='OK');
console.log(JSON.stringify({apply,exams:report.length,okExams:ok.length,figures:ok.reduce((n,r)=>n+r.items.filter(i=>i.ok).length,0),problems:report.filter(r=>r.status!=='OK'&&r.status!=='NOTHING').map(r=>r.exam+' '+r.status),skips:report.flatMap(r=>r.items.filter(i=>i.skip).map(i=>r.exam+' q'+i.ord+' '+i.skip))},null,1));
fs.writeFileSync(process.env.PUBLISH_REPORT||path.join(process.env.TEMP||'.','publish-report.json'),JSON.stringify(report,null,1));
