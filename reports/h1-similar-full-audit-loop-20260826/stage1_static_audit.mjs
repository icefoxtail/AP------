import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';

const repo = 'C:/Users/USER/Desktop/AP------';
const outDir = path.join(repo, 'reports', 'h1-similar-full-audit-loop-20260826');
const targets = [
  ['2mid','25_금당고_2학기_중간_고1_유사.js','25_금당고_2학기_중간_고1_기출.js'],
  ['2mid','25_매산고_2학기_중간_고1_유사.js','25_매산고_2학기_중간_고1_기출.js'],
  ['2mid','25_순천고_2학기_중간_고1_유사.js','25_순천고_2학기_중간_고1_기출.js'],
  ['2final','25_금당고_2학기_기말_고1_유사.js','25_금당고_2학기_기말_고1_기출.js'],
  ['2final','25_순천고_2학기_기말_고1_유사.js','25_순천고_2학기_기말_고1_기출.js'],
  ['2final','25_제일고_2학기_기말_고1_유사.js','25_제일고_2학기_기말_고1_기출.js'],
  ['2final','25_팔마고_2학기_기말_고1_유사.js','25_팔마고_2학기_기말_고1_기출.js'],
  ['2final','25_효천고_2학기_기말_고1_유사.js','25_효천고_2학기_기말_고1_기출.js'],
];
const required = ['id','content','choices','answer','category','originalCategory','standardCourse','standardUnitKey','standardUnit','standardUnitOrder','questionType','layoutTag','tags','wide','solution','level'];
const answerMarks = '①②③④⑤';
const assetRoot = path.join(repo, 'archive');
const sourceInventory = JSON.parse(fs.readFileSync(path.join(outDir,'source-pdf-inventory.json'),'utf8'));
const sourceByName = new Map(sourceInventory.map(x => [x.similar, x]));
function load(file) { const c={window:{}}; vm.createContext(c); vm.runInContext(fs.readFileSync(file,'utf8'),c,{filename:file}); return c.window; }
function rel(p){return path.relative(repo,p).replaceAll('\\','/');}
function sha(p){return crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');}
function hasOperational(sol){return /\[(?:cite|보강 필요 목록|원본|정답표|오류|수정|보정|검수|생성 로그)\]|ChatGPT|Gemini|검수 완료|수정 완료|원문 기준|내부 검산 완료/i.test(sol);}
function rawTopFrac(s){return /(^|[^\\])\\frac(?![a-zA-Z])/.test(s);}
function directSigns(s){return (String(s).match(/(^|[^&])(?:<|>)(?!=)/g)||[]).map(x=>x.trim());}

const rows=[]; const exams=[]; const hashes=[];
for(const [term,simName,origName] of targets){
  const sim=path.join(repo,'archive','exams','similar','high','h1',term,simName);
  const orig=path.join(repo,'archive','exams','original','high','h1',term,origName);
  let sw,ow,syntax=null;
  try{sw=load(sim)}catch(e){syntax=String(e);}
  try{ow=load(orig)}catch(e){syntax=(syntax||'')+' ORIGINAL '+String(e);}
  const qs=Array.isArray(sw?.questionBank)?sw.questionBank:[]; const oqs=Array.isArray(ow?.questionBank)?ow.questionBank:[];
  const examRel=`exams/similar/high/h1/${term}/${simName}`; const ex={file:examRel,original:rel(orig),qCount:qs.length,sourceQCount:oqs.length,sourcePdf:sourceByName.get(simName)||null,errors:[],warnings:[],questions:[]};
  if(syntax) ex.errors.push('JS evaluation failed');
  if(qs.length!==oqs.length) ex.warnings.push(`similar/original qCount ${qs.length}/${oqs.length}`);
  if(!sw?.examTitle || !Array.isArray(sw?.questionBank)) ex.errors.push('examTitle/questionBank structure');
  for(let i=0;i<Math.max(qs.length,1);i++){
    const q=qs[i]; if(!q){continue;}
    const e=[],w=[]; const content=String(q.content??''); const sol=String(q.solution??''); const choices=Array.isArray(q.choices)?q.choices:[]; const isChoice=q.questionType==='객관식';
    const miss=required.filter(k=>!(k in q)); if(miss.length)e.push(`missing fields: ${miss.join(',')}`);
    if(q.id!==i+1)e.push('id not sequential'); if(!content.trim())e.push('content empty'); if(!sol.trim())e.push('solution empty'); if(!String(q.answer??'').trim())e.push('answer empty');
    if(!Array.isArray(q.tags))e.push('tags not array'); if(typeof q.wide!=='boolean')e.push('wide not boolean'); if(!['grid','subjective-2up','subjective-4up','fullwidth'].includes(q.layoutTag))w.push('layoutTag unusual');
    if(isChoice && choices.length!==5)e.push(`choice count ${choices.length}`); if(!isChoice && choices.length)w.push('non-choice contains choices');
    const nums=[...String(q.answer??'').matchAll(/[①②③④⑤]/g)].map(m=>answerMarks.indexOf(m[0])+1); if(isChoice && (!nums.length || nums.some(n=>n>choices.length)))e.push('answer label invalid');
    if(choices.some(x=>/[①②③④⑤]/.test(String(x))))e.push('choice contains hard-coded option marker');
    const signChoices=choices.flatMap(x=>directSigns(String(x))); if(signChoices.length)e.push('direct comparison sign in choice');
    const signContent=directSigns(content); if(signContent.length)w.push('direct comparison sign in content');
    if(rawTopFrac(content+' '+choices.join(' ')+' '+sol))w.push('top-level frac token');
    if(sol.includes('\\n'))w.push('literal \\n in evaluated solution');
    if((sol.match(/\n\s*1\./g)||[]).length===0 && sol.length>0)w.push('no visible numbered step marker');
    if(hasOperational(sol))e.push('operational/editorial trace in solution');
    if(!Array.isArray(q.tags)||!q.tags.length)w.push('tags empty');
    const visual=Boolean(q.image)||/<(?:svg|img|table)\b/i.test(content); let imagePath=null;
    if(q.image){ imagePath=path.join(repo,'archive',...String(q.image).replaceAll('\\','/').split('/')); if(!fs.existsSync(imagePath))e.push(`image missing: ${q.image}`); else hashes.push({path:rel(imagePath),sha256:sha(imagePath)}); }
    if(visual && !q.image && !/<(?:svg|img|table)\b/i.test(content))e.push('visual marker without visual');
    const source=sourceByName.get(simName); const sourceStatus=source?.available?'PENDING_MANUAL_PAGE_COMPARE':'BLOCKED_SOURCE_PDF_MISSING';
    const row={exam:examRel,q:q.id,sourcePdfStatus:sourceStatus,sourcePage:null,contentVsSource:'PENDING',choicesVsSource:'PENDING',scoreVsSource:'PENDING',conditionsVsSource:'PENDING',visualVsSource:visual?'PENDING':'NOT_APPLICABLE',errors:e,warnings:w,first:e.length?'FAIL':w.length?'WARN':'PASS',answer:q.answer,reviewStatus:q.reviewStatus||null,solutionStatus:q.solutionStatus||null,image:q.image||null};
    ex.questions.push(row); rows.push(row); ex.errors.push(...e.map(x=>`q${q.id}: ${x}`)); ex.warnings.push(...w.map(x=>`q${q.id}: ${x}`));
  }
  hashes.push({path:rel(sim),sha256:sha(sim)}); hashes.push({path:rel(orig),sha256:sha(orig)}); exams.push(ex);
}
const out={generatedAt:new Date().toISOString(),protocols:['JS아카이브_1차검수_프로토콜.md','무결성검수.md','수학_문항오류_검증_프로토콜_v2.1.md'],scope:{exams:8,questions:rows.length},gate:'1차 구조·무결성',counts:{questions:rows.length,fail:rows.filter(x=>x.first==='FAIL').length,warn:rows.filter(x=>x.first==='WARN').length,pass:rows.filter(x=>x.first==='PASS').length,sourcePdfAvailable:rows.filter(x=>x.sourcePdfStatus==='PENDING_MANUAL_PAGE_COMPARE').length,sourcePdfMissing:rows.filter(x=>x.sourcePdfStatus==='BLOCKED_SOURCE_PDF_MISSING').length},catalogGate:'SEPARATE_FINAL_GATE',reviewStatusGate:rows.every(x=>x.reviewStatus==='reviewed'&&x.solutionStatus==='reviewed')?'PASS':'FAIL',exams,hashes};
fs.mkdirSync(outDir,{recursive:true}); fs.writeFileSync(path.join(outDir,'stage1-static-audit.json'),JSON.stringify(out,null,2)); fs.writeFileSync(path.join(outDir,'stage1-hashes.json'),JSON.stringify(hashes,null,2)); console.log(JSON.stringify({counts:out.counts,reviewStatusGate:out.reviewStatusGate,examSummary:exams.map(x=>({file:x.file,q:x.qCount,fail:x.errors.length,warn:x.warnings.length,source:x.sourcePdf?.available?'available':'missing'}))},null,2));
