import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]):/, '$1:')), '..');
const archive = path.join(root, 'archive');
const bases = [
  '19_강남여고_2학기_기말_고1_기출','19_금당고_2학기_기말_고1_기출','19_금당고_2학기_중간_고1_기출','19_복성고_2학기_중간_고1_기출','19_팔마고_2학기_기말_고1_기출','19_팔마고_2학기_중간_고1_기출','20_금당고_2학기_중간_고1_기출','20_매산고_2학기_기말_고1_기출','20_매산고_2학기_중간_고1_기출','20_매산여고_2학기_기말_고1_기출','20_매산여고_2학기_중간_고1_기출','20_복성고_2학기_중간_고1_기출','20_순천고_2학기_중간_고1_기출','20_순천여고_2학기_기말_고1_기출','20_제일고_2학기_중간_고1_기출','20_효천고_2학기_기말_고1_기출','20_효천고_2학기_중간_고1_기출','23_부영여고_2학기_중간_고1_기출','23_여양고_2학기_중간_고1_기출','23_여천고_2학기_기말_고1_기출','23_여천고_2학기_중간_고1_기출','23_중앙여고_2학기_기말_고1_기출','23_한영고_2학기_기말_고1_기출','23_한영고_2학기_중간_고1_기출','24_부영여고_2학기_중간_고1_기출','24_여양고_2학기_기말_고1_기출','24_여천고_2학기_기말_고1_기출','24_여천고_2학기_중간_고1_기출','24_중앙여고_2학기_기말_고1_기출','24_한영고_2학기_기말_고1_기출'
];
const dbCtx={window:{}};vm.runInNewContext(fs.readFileSync(path.join(archive,'db.js'),'utf8'),dbCtx,{timeout:20000});
const idxCtx={window:{}};vm.runInNewContext(fs.readFileSync(path.join(archive,'question-index.js'),'utf8'),idxCtx,{timeout:20000});
const db=new Map(dbCtx.window.mainDB.exams.map(x=>[x.file,x])); const index=idxCtx.window.questionIndex;
const internal=/A형|B형|유사B|DERIVED_REPLACEMENT|B_DERIVED|BLOCKED|NOT_AUTHORIZED|SOURCE_IDENTITY|LEGACY_PAYLOAD_DRIFT|review package/i;
const errors=[];const rows=[];
for(const base of bases){
  const period=base.includes('중간')?'2mid':'2final';const rel=`original/high/h1/${period}/${base}.js`;const file=path.join(archive,'exams',rel);
  if(!fs.existsSync(file)){errors.push({base,kind:'MISSING_JS'});continue;}
  let win;try{win={window:{}};vm.runInNewContext(fs.readFileSync(file,'utf8'),win,{timeout:10000});}catch(error){errors.push({base,kind:'VM_LOAD',error:String(error)});continue;}
  const bank=win.window.questionBank||[];const ids=bank.map(q=>q.id);const duplicateIds=ids.filter((id,i)=>ids.indexOf(id)!==i);const idxRows=index.filter(x=>x.sourceFile===rel);const dbRow=db.get(rel);
  if(duplicateIds.length)errors.push({base,kind:'DUPLICATE_ID'});if(idxRows.length!==bank.length)errors.push({base,kind:'INDEX_COUNT',js:bank.length,index:idxRows.length});if(!dbRow)errors.push({base,kind:'DB_MISSING'});else if(dbRow.qCount!==bank.length)errors.push({base,kind:'DB_QCOUNT',db:dbRow.qCount,js:bank.length});
  for(const q of bank){
    const text=[q.content, ...(q.choices||[]),q.answer,q.solution].filter(x=>typeof x==='string').join('\n');
    if(q.questionType==='객관식'&&(!Array.isArray(q.choices)||q.choices.length!==5))errors.push({base,kind:'CHOICES',id:q.id,count:q.choices?.length});
    if(!String(q.content||'').trim()||!String(q.solution||'').trim()||!String(q.answer||'').trim())errors.push({base,kind:'STUDENT_FIELD',id:q.id});
    if(internal.test(text)||internal.test(JSON.stringify(q)))errors.push({base,kind:'INTERNAL_TOKEN',id:q.id});
    if((text.match(/\$/g)||[]).length%2)errors.push({base,kind:'ODD_DOLLAR',id:q.id});
    for(const field of ['image','visualAsset','solutionImage']){if(q[field]){const target=path.join(archive,q[field]);if(!fs.existsSync(target))errors.push({base,kind:'MISSING_ASSET',id:q.id,field,path:q[field]});}}
  }
  rows.push({base,relativePath:rel,questionCount:bank.length,indexCount:idxRows.length,dbQCount:dbRow?.qCount??null,internalStudentToken:false});
}
const result={schemaVersion:'CANONICAL_H1_2SEM_INDEPENDENT_AUDIT_v1',status:errors.length?'FAIL':'PASS',examCount:rows.length,rows,errors,scope:'canonical archive 2mid/2final only'};
const out=path.join(archive,'_generated','nightly-h1-2sem','20260908','audits','canonical-independent-audit-20260910.json');fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,JSON.stringify(result,null,2)+'\n','utf8');console.log(JSON.stringify({status:result.status,examCount:rows.length,errors:errors.length},null,2));if(errors.length)process.exit(1);
